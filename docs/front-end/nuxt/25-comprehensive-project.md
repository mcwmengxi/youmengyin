# 综合实战：Nuxt 4 项目开发

> 本章通过一个完整的实战项目 —— 在线博客，串联 Nuxt 4 的核心知识。从项目创建到部署上线，涵盖全流程。

## 一、项目需求

**NuxtBlog**：一个支持 Markdown 的在线博客平台

- 文章列表与详情（SSR + ISR）
- 用户登录与注册
- 文章发布与编辑（SPA 管理后台）
- 搜索功能（SWR 缓存）
- 响应式设计（暗色模式）

---

## 二、项目初始化

### 2.1 创建项目

```bash
npx nuxi@latest init nuxtblog --package-manager npm
cd nuxtblog
```

### 2.2 安装依赖

```bash
# UI 和工具
npx nuxi module add @nuxt/ui @nuxt/image @nuxt/icon

# 状态管理和认证
npm install @pinia/nuxt pinia

# 内容管理
npx nuxi module add @nuxt/content

# 数据库
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit
```

### 2.3 项目结构

```
nuxtblog/
├── app/
│   ├── assets/css/
│   ├── components/
│   │   ├── blog/           # ArticleCard, ArticleList
│   │   ├── layout/         # Header, Footer, Sidebar
│   │   └── ui/             # Button, Input, Modal
│   ├── composables/
│   │   ├── useAuth.ts
│   │   └── usePosts.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── admin.vue
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── pages/
│   │   ├── index.vue
│   │   ├── posts/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── admin/
│   │       ├── index.vue
│   │       ├── posts/
│   │       │   ├── index.vue
│   │       │   ├── create.vue
│   │       │   └── [id]/edit.vue
│   │       └── settings.vue
│   ├── plugins/
│   │   └── api.ts
│   ├── stores/
│   │   └── useAuthStore.ts
│   └── app.vue
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   ├── register.post.ts
│   │   │   └── me.get.ts
│   │   ├── posts/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   └── search.get.ts
│   └── middleware/
│       └── auth.ts
├── shared/
│   └── types.ts
└── nuxt.config.ts
```

---

## 三、配置

### 3.1 nuxt.config.ts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || 'file:./data.db',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    public: {
      appName: 'NuxtBlog',
      apiBaseUrl: process.env.API_BASE_URL || '',
    },
  },

  routeRules: {
    '/': { isr: 300 },
    '/posts/**': { isr: 1800 },
    '/search/**': { swr: 60 },
    '/admin/**': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },
})
```

### 3.2 共享类型

```ts
// shared/types.ts
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin'
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  author: User
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

---

## 四、关键页面实现

### 4.1 首页

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import type { Post } from '~~/shared/types'

const page = ref(1)
const { data, pending } = await useFetch('/api/posts', {
  query: { page, pageSize: 10 },
  key: 'home-posts',
})

useHead({ title: 'NuxtBlog - 首页' })
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold mb-8">最新文章</h1>

    <div v-if="pending" class="animate-pulse">
      加载中...
    </div>

    <div v-else class="grid gap-6">
      <ArticleCard
        v-for="post in data?.data"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>
```

### 4.2 文章详情页

```vue
<!-- app/pages/posts/[slug].vue -->
<script setup lang="ts">
import type { Post } from '~~/shared/types'

const route = useRoute()
const slug = route.params.slug as string

const { data: post, error } = await useFetch<Post>(`/api/posts/${slug}`, {
  key: `post-${slug}`,
})

if (error.value) {
  throw createError({ statusCode: 404, message: '文章未找到' })
}

useHead({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.excerpt },
  ],
})
</script>

<template>
  <article class="max-w-3xl mx-auto py-8 prose">
    <NuxtImg :src="post?.coverImage" class="rounded-lg mb-8" />
    <h1>{{ post?.title }}</h1>
    <div v-html="post?.content" />
  </article>
</template>
```

### 4.3 管理后台 Dashboard

```vue
<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin',
})

const { data: stats } = await useFetch('/api/admin/stats')
</script>

<template>
  <div>
    <h1>管理后台</h1>
    <div class="grid grid-cols-3 gap-4">
      <UCard>
        <p class="text-2xl font-bold">{{ stats?.posts }}</p>
        <p>文章总数</p>
      </UCard>
      <UCard>
        <p class="text-2xl font-bold">{{ stats?.users }}</p>
        <p>用户总数</p>
      </UCard>
      <UCard>
        <p class="text-2xl font-bold">{{ stats?.views }}</p>
        <p>今日浏览</p>
      </UCard>
    </div>
  </div>
</template>
```

### 4.4 搜索页

```vue
<!-- app/pages/search.vue -->
<script setup lang="ts">
import type { Post } from '~~/shared/types'

const searchQuery = ref('')
const debouncedQuery = refDebounced(searchQuery, 300)

const { data: results, pending } = await useFetch('/api/search', {
  query: { q: debouncedQuery },
  key: 'search-results',
})
</script>

<template>
  <div>
    <UInput v-model="searchQuery" placeholder="搜索文章..." />

    <div v-if="pending">搜索中...</div>
    <div v-else-if="results?.length === 0">无结果</div>
    <div v-else class="mt-4 space-y-4">
      <ArticleCard
        v-for="post in results"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>
```

---

## 五、关键 API 实现

### 5.1 文章列表 API

```ts
// server/api/posts/index.get.ts
import type { PaginatedResponse, Post } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const { page = '1', pageSize = '10' } = getQuery(event)
  const offset = (Number(page) - 1) * Number(pageSize)

  const posts = await db.query.posts.findMany({
    limit: Number(pageSize),
    offset,
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  })

  const total = await db.select({ count: sql`count(*)` }).from(posts)

  const result: PaginatedResponse<Post> = {
    data: posts,
    total: Number(total[0]?.count ?? 0),
    page: Number(page),
    pageSize: Number(pageSize),
  }

  return result
})
```

### 5.2 认证 API

```ts
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user || !verifyPassword(password, user.password)) {
    throw createError({ statusCode: 401, message: '邮箱或密码错误' })
  }

  const token = signToken({ id: user.id, role: user.role })

  setCookie(event, 'token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })

  return { user: { id: user.id, name: user.name, email: user.email } }
})
```

### 5.3 创建文章

```ts
// server/api/posts/index.post.ts
import { CreatePostSchema } from '~~/shared/validators'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event)
  const result = CreatePostSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  const { title, content, tags, coverImage } = result.data
  const slug = generateSlug(title)

  const post = await db.insert(postsTable).values({
    title,
    slug,
    content,
    tags,
    coverImage,
    authorId: user.id,
  }).returning()

  return post
})
```

---

## 六、认证管理 Store

```ts
// app/stores/useAuthStore.ts
import type { User } from '~~/shared/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
  }

  function logout() {
    user.value = null
    navigateTo('/')
  }

  return { user, isAuthenticated, fetchUser, login, logout }
})
```

---

## 七、部署

### 7.1 构建

```bash
npm run build
```

### 7.2 Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
ENV NITRO_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### 7.3 环境变量

```bash
# .env.production
DATABASE_URL=postgresql://user:pass@host:5432/nuxtblog
JWT_SECRET=your-production-secret
API_BASE_URL=https://nuxtblog.example.com
```

---

## 八、项目总结

| 知识点           | 应用                         |
| ---------------- | ---------------------------- |
| **目录结构**     | `app/` 页面和组件            |
| **路由**         | 动态路由 [slug]              |
| **数据获取**     | useFetch + 智能 key          |
| **状态管理**     | Pinia useAuthStore           |
| **中间件**       | auth.ts / admin.ts           |
| **渲染模式**     | ISR + SPA 混合               |
| **服务端 API**   | Nitro 3 event handler        |
| **类型共享**     | shared/types.ts              |
| **安全**         | 输入验证、JWT 认证            |
| **部署**         | Docker + 环境变量             |

通过这个项目，你已掌握 Nuxt 4 从开发到部署的完整流程。可以根据实际需求扩展更多功能，如评论系统、RSS 订阅、全文搜索等。