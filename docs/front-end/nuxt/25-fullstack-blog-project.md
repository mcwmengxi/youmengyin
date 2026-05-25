# 综合实战：全栈博客项目

> 本章通过完整项目实战，串联前面所有章节的知识点。

## 一、项目概览

### 1.1 功能需求

- 文章列表（分页、搜索）
- 文章详情（Markdown 渲染）
- 分类与标签
- 评论系统
- 管理后台（登录、新增/编辑/删除文章）
- 暗色模式
- SEO 优化

### 1.2 技术栈

```
前端：Nuxt 3 + Vue 3 + Tailwind CSS + Pinia
服务端：Nitro Server Routes + SQLite (better-sqlite3)
模块：@nuxt/image, @nuxtjs/tailwindcss, @vueuse/nuxt, @nuxt/content
部署：Docker + Nginx / Vercel
```

---

## 二、项目初始化

### 2.1 创建项目

```bash
npx nuxi@latest init nuxt-blog
cd nuxt-blog

# 安装依赖
npm install better-sqlite3
npm install -D @types/better-sqlite3

# 安装模块
npx nuxi module add @nuxtjs/tailwindcss @vueuse/nuxt @nuxt/image @nuxt/content
```

### 2.2 项目结构

```
nuxt-blog/
├── pages/
│   ├── index.vue            # 首页（文章列表）
│   ├── posts/
│   │   └── [slug].vue       # 文章详情
│   ├── admin/
│   │   ├── login.vue        # 登录页
│   │   └── dashboard.vue    # 管理后台
│   └── tags/
│       └── [tag].vue        # 标签页
├── components/
│   ├── PostCard.vue         # 文章卡片
│   ├── CommentList.vue      # 评论列表
│   ├── SearchBar.vue        # 搜索栏
│   └── admin/
│       └── PostEditor.vue   # 文章编辑器
├── composables/
│   └── useAuth.ts           # 认证逻辑
├── server/
│   ├── api/
│   │   ├── posts/
│   │   │   ├── index.get.ts       # 获取文章列表
│   │   │   ├── index.post.ts      # 创建文章
│   │   │   ├── [id].get.ts        # 获取单篇文章
│   │   │   ├── [id].put.ts        # 更新文章
│   │   │   └── [id].delete.ts     # 删除文章
│   │   ├── comments/
│   │   │   ├── index.get.ts       # 获取评论
│   │   │   └── index.post.ts      # 发表评论
│   │   ├── auth/
│   │   │   ├── login.post.ts      # 登录
│   │   │   └── me.get.ts          # 当前用户
│   │   └── tags/
│   │       └── index.get.ts       # 标签列表
│   ├── middleware/
│   │   └── auth.ts           # API 认证中间件
│   └── utils/
│       └── db.ts             # 数据库连接
├── stores/
│   └── auth.ts               # Pinia 认证状态
├── nuxt.config.ts
└── tailwind.config.ts
```

---

## 三、数据库设计

### 3.1 数据库初始化

```ts
// server/utils/db.ts
import Database from 'better-sqlite3'

let db: Database.Database

export function useDB() {
  if (!db) {
    db = new Database('./data/blog.db')
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initTables()
  }
  return db
}

function initTables() {
  const db = useDB()
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      cover TEXT,
      published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // 创建默认管理员
  const existing = db
    .prepare('SELECT id FROM users WHERE username = ?')
    .get('admin')
  if (!existing) {
    // 生产环境请使用 bcrypt 等加密
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(
      'admin',
      'admin123'
    )
  }
}
```

### 3.2 种子数据

```ts
// server/utils/seed.ts
export function seedData() {
  const db = useDB()
  const count = db.prepare('SELECT COUNT(*) as cnt FROM posts').get() as any

  if (count.cnt > 0) return

  const posts = [
    {
      title: 'Nuxt 3 入门指南',
      slug: 'nuxt-3-getting-started',
      content: '# Nuxt 3 入门指南\n\nNuxt 3 是基于 Vue 3 的全栈框架...',
      excerpt: '快速上手 Nuxt 3 的基础知识',
      published: 1,
      tags: ['Nuxt', 'Vue'],
    },
    {
      title: 'Tailwind CSS 最佳实践',
      slug: 'tailwind-best-practices',
      content: '# Tailwind CSS 最佳实践\n\n实用类优先的 CSS 框架...',
      excerpt: '掌握 Tailwind CSS 的核心用法',
      published: 1,
      tags: ['CSS', 'Tailwind'],
    },
  ]

  const insertPost = db.prepare(
    'INSERT INTO posts (title, slug, content, excerpt, published) VALUES (?, ?, ?, ?, ?)'
  )
  const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)')
  const insertPostTag = db.prepare(
    'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)'
  )

  for (const post of posts) {
    const result = insertPost.run(
      post.title,
      post.slug,
      post.content,
      post.excerpt,
      post.published
    )
    const postId = result.lastInsertRowid

    for (const tagName of post.tags) {
      insertTag.run(tagName)
      const tag = db
        .prepare('SELECT id FROM tags WHERE name = ?')
        .get(tagName) as any
      insertPostTag.run(postId, tag.id)
    }
  }
}
```

---

## 四、服务端 API 实现

### 4.1 文章列表 API

```ts
// server/api/posts/index.get.ts
export default defineEventHandler((event) => {
  const db = useDB()
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Math.min(Number(query.limit) || 10, 50)
  const search = (query.search as string) || ''
  const tag = (query.tag as string) || ''

  let where = 'WHERE p.published = 1'
  const params: any[] = []

  if (search) {
    where += ' AND (p.title LIKE ? OR p.content LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  if (tag) {
    where += ' AND t.name = ?'
    params.push(tag)
  }

  const total = db
    .prepare(
      `
    SELECT COUNT(DISTINCT p.id) as cnt FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${where}
  `
    )
    .get(...params) as any

  const posts = db
    .prepare(
      `
    SELECT DISTINCT p.id, p.title, p.slug, p.excerpt, p.cover, p.created_at
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `
    )
    .all(...params, limit, (page - 1) * limit)

  return {
    posts,
    total: total.cnt,
    page,
    totalPages: Math.ceil(total.cnt / limit),
  }
})
```

### 4.2 文章详情 API

```ts
// server/api/posts/[id].get.ts
export default defineEventHandler((event) => {
  const db = useDB()
  const id = getRouterParam(event, 'id')

  const post = db
    .prepare(
      `
    SELECT * FROM posts WHERE id = ? AND published = 1
  `
    )
    .get(id)

  if (!post) {
    throw createError({ statusCode: 404, message: '文章不存在' })
  }

  const tags = db
    .prepare(
      `
    SELECT t.name FROM tags t
    JOIN post_tags pt ON t.id = pt.tag_id
    WHERE pt.post_id = ?
  `
    )
    .all(id)

  return { ...post, tags }
})
```

### 4.3 创建文章 API（需认证）

```ts
// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readBody(event)

  // 生成 slug
  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const result = db
    .prepare(
      `
    INSERT INTO posts (title, slug, content, excerpt, cover, published)
    VALUES (?, ?, ?, ?, ?, ?)
  `
    )
    .run(
      body.title,
      slug,
      body.content,
      body.excerpt || '',
      body.cover || '',
      body.published ? 1 : 0
    )

  // 处理标签
  if (body.tags?.length) {
    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)')
    const insertPT = db.prepare(
      'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)'
    )
    for (const tagName of body.tags) {
      insertTag.run(tagName)
      const tag = db
        .prepare('SELECT id FROM tags WHERE name = ?')
        .get(tagName) as any
      insertPT.run(result.lastInsertRowid, tag.id)
    }
  }

  return { id: result.lastInsertRowid, slug }
})
```

### 4.4 认证 API

```ts
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readBody(event)

  const user = db
    .prepare(
      'SELECT id, username FROM users WHERE username = ? AND password = ?'
    )
    .get(body.username, body.password)

  if (!user) {
    throw createError({ statusCode: 401, message: '用户名或密码错误' })
  }

  // 生成 token（生产环境使用 JWT）
  const token = Buffer.from(
    JSON.stringify({ id: user.id, username: user.username })
  ).toString('base64')

  setCookie(event, 'token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400, // 1 天
  })

  return { success: true }
})

// server/api/auth/me.get.ts
export default defineEventHandler((event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  return user
})
```

### 4.5 认证中间件

```ts
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  // 公开路径跳过认证
  const publicPaths = ['/api/auth/login']
  if (publicPaths.some((p) => event.path.startsWith(p))) return

  // 读操作公开
  if (event.method === 'GET' && !event.path.includes('/auth/')) return

  // 写操作需要认证
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, message: '请先登录' })
  }

  try {
    event.context.user = JSON.parse(Buffer.from(token, 'base64').toString())
  } catch {
    throw createError({ statusCode: 401, message: 'Token 无效' })
  }
})
```

### 4.6 评论 API

```ts
// server/api/comments/index.get.ts
export default defineEventHandler((event) => {
  const db = useDB()
  const query = getQuery(event)
  const postId = Number(query.postId)

  return db
    .prepare(
      `
    SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC
  `
    )
    .all(postId)
})

// server/api/comments/index.post.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readBody(event)

  const result = db
    .prepare('INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)')
    .run(body.postId, body.author, body.content)

  return { id: result.lastInsertRowid }
})
```

---

## 五、前端页面实现

### 5.1 首页（文章列表）

```vue
<!-- pages/index.vue -->
<script setup>
const page = ref(1)
const search = ref('')

const { data, pending, refresh } = await useAsyncData(
  'posts',
  () =>
    $fetch('/api/posts', {
      query: { page: page.value, search: search.value, limit: 10 },
    }),
  { watch: [page, search] }
)

useHead({
  title: '博客首页',
  meta: [{ name: 'description', content: '分享技术心得与开发经验' }],
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">最新文章</h1>

    <!-- 搜索栏 -->
    <SearchBar v-model="search" @search="page = 1" />

    <!-- 文章列表 -->
    <div v-if="pending" class="text-center py-12">加载中...</div>

    <div v-else class="space-y-6">
      <PostCard v-for="post in data?.posts" :key="post.id" :post="post" />
    </div>

    <!-- 分页 -->
    <div v-if="data?.totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button
        v-for="p in data.totalPages"
        :key="p"
        :class="[
          'px-3 py-1 rounded',
          p === page ? 'bg-blue-500 text-white' : 'bg-gray-100',
        ]"
        @click="page = p"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>
```

### 5.2 文章卡片组件

```vue
<!-- components/PostCard.vue -->
<script setup>
defineProps<{
  post: {
    id: number
    title: string
    slug: string
    excerpt: string
    cover?: string
    created_at: string
  }
}>()
</script>

<template>
  <NuxtLink
    :to="`/posts/${post.slug}`"
    class="block p-6 border rounded-lg hover:shadow-md transition-shadow"
  >
    <NuxtImg
      v-if="post.cover"
      :src="post.cover"
      width="800"
      class="w-full h-48 object-cover rounded mb-4"
    />
    <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
    <p class="text-gray-600 mb-2">{{ post.excerpt }}</p>
    <time class="text-sm text-gray-400">
      {{ new Date(post.created_at).toLocaleDateString('zh-CN') }}
    </time>
  </NuxtLink>
</template>
```

### 5.3 文章详情页

```vue
<!-- pages/posts/[slug].vue -->
<script setup>
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.params.slug}`, () =>
  $fetch(`/api/posts/${route.params.slug}`)
)

const { data: comments, refresh: refreshComments } = await useAsyncData(
  `comments-${route.params.slug}`,
  () => $fetch('/api/comments', { query: { postId: post.value?.id } })
)

const newComment = reactive({ author: '', content: '' })
const submitting = ref(false)

async function submitComment() {
  if (!newComment.author || !newComment.content) return
  submitting.value = true
  await $fetch('/api/comments', {
    method: 'POST',
    body: { postId: post.value.id, ...newComment },
  })
  newComment.author = ''
  newComment.content = ''
  await refreshComments()
  submitting.value = false
}

useHead({
  title: post.value?.title,
  meta: [{ name: 'description', content: post.value?.excerpt }],
})
</script>

<template>
  <article class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">{{ post?.title }}</h1>

    <div class="flex gap-2 mb-6">
      <span
        v-for="tag in post?.tags"
        :key="tag.name"
        class="bg-gray-100 px-2 py-1 rounded text-sm"
      >
        {{ tag.name }}
      </span>
    </div>

    <!-- Markdown 内容渲染 -->
    <div class="prose max-w-none" v-html="post?.content" />

    <!-- 评论区 -->
    <section class="mt-12 border-t pt-8">
      <h2 class="text-2xl font-bold mb-6">评论</h2>

      <div v-for="c in comments" :key="c.id" class="border-b pb-4 mb-4">
        <p class="font-semibold">{{ c.author }}</p>
        <p class="mt-1">{{ c.content }}</p>
      </div>

      <form @submit.prevent="submitComment" class="mt-6 space-y-4">
        <input
          v-model="newComment.author"
          placeholder="你的名字"
          required
          class="w-full border rounded px-3 py-2"
        />
        <textarea
          v-model="newComment.content"
          placeholder="写下你的评论..."
          required
          class="w-full border rounded px-3 py-2"
          rows="3"
        />
        <button
          :disabled="submitting"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ submitting ? '提交中...' : '发表评论' }}
        </button>
      </form>
    </section>
  </article>
</template>
```

### 5.4 认证 Composable

```ts
// composables/useAuth.ts
export function useAuth() {
  const user = useState('user')
  const loading = ref(true)

  async function fetchUser() {
    try {
      user.value = await $fetch('/api/auth/me')
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(username: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    await fetchUser()
  }

  async function logout() {
    user.value = null
    await navigateTo('/')
  }

  onMounted(() => fetchUser())

  return { user, loading, login, logout }
}
```

### 5.5 管理后台

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: ['auth'],
})

const { data: posts, refresh } = await useAsyncData('admin-posts', () =>
  $fetch('/api/posts', { query: { limit: 100, includeUnpublished: true } })
)

async function deletePost(id: number) {
  if (!confirm('确认删除？')) return
  await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
  refresh()
}

async function togglePublish(post: any) {
  await $fetch(`/api/posts/${post.id}`, {
    method: 'PUT',
    body: { ...post, published: post.published ? 0 : 1 },
  })
  refresh()
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">文章管理</h1>
      <NuxtLink
        to="/admin/new"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        新建文章
      </NuxtLink>
    </div>

    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2">标题</th>
          <th class="text-left py-2">状态</th>
          <th class="text-left py-2">日期</th>
          <th class="text-right py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts?.posts" :key="post.id" class="border-b">
          <td class="py-2">
            <NuxtLink
              :to="`/posts/${post.slug}`"
              class="text-blue-500 hover:underline"
            >
              {{ post.title }}
            </NuxtLink>
          </td>
          <td>
            <span
              :class="post.published ? 'text-green-500' : 'text-yellow-500'"
            >
              {{ post.published ? '已发布' : '草稿' }}
            </span>
          </td>
          <td>{{ new Date(post.created_at).toLocaleDateString('zh-CN') }}</td>
          <td class="text-right space-x-2">
            <NuxtLink
              :to="`/admin/edit/${post.id}`"
              class="text-blue-500 hover:underline"
              >编辑</NuxtLink
            >
            <button
              @click="togglePublish(post)"
              class="text-yellow-500 hover:underline"
            >
              {{ post.published ? '下架' : '发布' }}
            </button>
            <button
              @click="deletePost(post.id)"
              class="text-red-500 hover:underline"
            >
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### 5.6 认证中间件

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()
  await fetchUser()

  if (!user.value) {
    return navigateTo('/admin/login')
  }
})
```

---

## 六、nuxt.config 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      title: '我的技术博客',
      meta: [{ name: 'description', content: '分享技术心得与开发经验' }],
      htmlAttrs: { lang: 'zh-CN' },
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://blog.example.com',
    },
  },

  routeRules: {
    '/': { swr: 300 },
    '/posts/**': { swr: 3600 },
    '/admin/**': { ssr: false },
  },

  nitro: {
    storage: {
      data: { driver: 'fs', base: './data' },
    },
    prerender: {
      routes: ['/', '/about'],
      crawlLinks: true,
    },
  },
})
```

---

## 七、项目启动与部署

```bash
# 开发
npm run dev

# 首次运行时初始化种子数据（在某个 server plugin 中调用 seedData()）

# 构建
npm run build

# 预览
npm run preview
```

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p data && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/data ./data
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 八、项目总结

通过本实战项目，你实践了：

| 章节     | 对应知识点                             |
| -------- | -------------------------------------- |
| 项目结构 | 文件系统路由、组件自动导入             |
| 数据库   | Nitro Server Routes、SQLite 集成       |
| 文章 API | CRUD 操作、分页、搜索、路由参数        |
| 认证     | 中间件守卫、Cookie、Token              |
| 前端页面 | `useAsyncData`、`useHead`、`NuxtLink`  |
| 管理后台 | 认证中间件、Pinia 状态管理             |
| 评论     | 父子组件通信、表单处理                 |
| 配置     | `routeRules`、`runtimeConfig`、`nitro` |
| 部署     | Docker 多阶段构建                      |
