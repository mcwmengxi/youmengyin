# useFetch 与 useAsyncData

> 本章详细讲解 Nuxt 3 中最核心的两个数据获取组合式函数：`useFetch` 和 `useAsyncData`。

## 一、useFetch

### 1.1 基本用法

`useFetch` 是 Nuxt 3 中**最常用**的数据获取方式，封装了 `$fetch` 和 `useAsyncData`：

```vue
<script setup>
// 最简单的用法
const { data, pending, error, refresh } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <p v-if="pending">加载中...</p>
    <p v-else-if="error">出错了: {{ error.message }}</p>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

### 1.2 返回值详解

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<T \| null>` | 请求返回的数据，初始为 `null` |
| `pending` | `Ref<boolean>` | 请求是否进行中 |
| `error` | `Ref<Error \| null>` | 请求错误对象 |
| `refresh` | `Function` | 手动重新执行请求 |
| `status` | `Ref<string>` | 请求状态：`'idle'` / `'pending'` / `'success'` / `'error'` |

### 1.3 带参数的请求

```vue
<script setup>
// 动态参数 — 页面路由变化时自动重新请求
const route = useRoute()
const { data } = await useFetch(`/api/posts/${route.params.id}`)

// 查询参数 — 自动转为 URL query string
const { data } = await useFetch('/api/posts', {
  query: { page: 1, limit: 10 }
})

// 请求头
const { data } = await useFetch('/api/admin/posts', {
  headers: {
    Authorization: `Bearer ${token.value}`
  }
})
</script>
```

**重要**：`useFetch` 的 URL 参数是**响应式**的 — 如果第一个参数用了 `ref` 或 `computed`，变化时会自动重新请求。

### 1.4 POST / PUT / DELETE 请求

```vue
<script setup>
// POST 请求
const { data, error } = await useFetch('/api/posts', {
  method: 'POST',
  body: { title: '新文章', content: '正文...' }
})

// PUT 请求
await useFetch(`/api/posts/${id}`, {
  method: 'PUT',
  body: { title: '修改后的标题' }
})

// DELETE 请求
await useFetch(`/api/posts/${id}`, {
  method: 'DELETE'
})
</script>
```

### 1.5 请求选项

```vue
<script setup>
const { data, refresh } = await useFetch('/api/posts', {
  // 服务端获取（默认），设为 false 则仅客户端获取
  server: true,

  // 懒加载 — 设为 true 时不立即请求，需手动 refresh
  lazy: false,

  // 立即执行（默认），设为 false 则不自动请求
  immediate: true,

  // 缓存 key — 同一 key 共享数据，避免重复请求
  key: 'posts-list',

  // 数据转换
  transform: (response) => {
    return response.posts.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt)
    }))
  },

  // 自定义 fetch 选项
  retry: 3,          // 失败重试次数
  retryDelay: 1000,  // 重试间隔（ms）
  timeout: 5000,     // 超时时间（ms）
  baseURL: 'https://api.example.com'
})
</script>
```

### 1.6 响应式刷新

```vue
<script setup>
const page = ref(1)
const search = ref('')

// URL 中的响应式数据变化时，自动重新请求
const { data, pending, refresh } = await useFetch('/api/posts', {
  query: computed(() => ({
    page: page.value,
    search: search.value
  }))
})

// 手动刷新
function loadMore() {
  page.value++
  // 或 refresh()
}
</script>

<template>
  <input v-model="search" placeholder="搜索..." />
  <ul>
    <li v-for="post in data" :key="post.id">{{ post.title }}</li>
  </ul>
  <button @click="refresh">刷新</button>
</template>
```

---

## 二、useAsyncData

### 2.1 基本用法

`useAsyncData` 是更底层的数据获取函数，适合获取非 URL 数据（数据库查询、本地文件等）：

```vue
<script setup>
const { data, pending, error, refresh } = await useAsyncData(
  'posts',                // 唯一 key
  () => queryDatabase()   // 异步获取函数
)
</script>
```

### 2.2 典型场景

```vue
<script setup>
// 场景1：多个 API 聚合
const { data } = await useAsyncData('dashboard', async () => {
  const [posts, users, stats] = await Promise.all([
    $fetch('/api/posts'),
    $fetch('/api/users'),
    $fetch('/api/stats')
  ])
  return { posts, users, stats }
})

// 场景2：服务端直接查数据库
const { data } = await useAsyncData('db-posts', () => {
  return db.query('SELECT * FROM posts ORDER BY created_at DESC')
})

// 场景3：读取本地文件
const { data } = await useAsyncData('config', () => {
  return import('~/config/app.json')
})
</script>
```

### 2.3 返回值（与 useFetch 一致）

```vue
<script setup>
const { data, pending, error, refresh, status } = await useAsyncData(
  'key',
  () => fetchData()
)
</script>
```

---

## 三、useFetch 与 useAsyncData 对比

| 维度 | `useFetch` | `useAsyncData` |
|------|------------|----------------|
| **用途** | HTTP 请求 | 任意异步数据 |
| **语法糖** | 对 `$fetch` + `useAsyncData` 的封装 | 底层 API |
| **URL 响应式** | 自动追踪 URL / params 变化 | 不追踪（需手动 watch） |
| **请求去重** | 同一 URL 自动去重 | 基于 key 去重 |
| **适用场景** | REST API 调用 | 数据库查询、文件读取、多源聚合 |

**等效关系**：

```ts
// useFetch 内部等价于：
const { data } = await useAsyncData('key', () => $fetch('/api/posts'))
```

### 3.1 何时用哪个？

```vue
<script setup>
// ✅ 用 useFetch — 标准 HTTP 请求
const { data: posts } = await useFetch('/api/posts')

// ✅ 用 useAsyncData — 非 HTTP 或需聚合
const { data } = await useAsyncData('dashboard', async () => {
  const [a, b] = await Promise.all([
    $fetch('/api/a'),
    $fetch('/api/b')
  ])
  return { a, b }
})

// ❌ 不推荐 — 用 useAsyncData 包 $fetch 单请求
const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))
// 直接用 useFetch 更简洁
</script>
```

---

## 四、请求去重与缓存

### 4.1 自动去重

同一页面或组件树中，相同 URL/key 的请求自动合并，只发一次：

```vue
<!-- 父组件 -->
<script setup>
await useFetch('/api/config') // ← 真正发出请求
</script>

<!-- 子组件 -->
<script setup>
await useFetch('/api/config') // ← 复用父组件的结果，不重复请求
</script>
```

### 4.2 手动指定 key

```vue
<script setup>
// 两个不同的请求需要不同的 key
const { data: posts } = await useFetch('/api/posts', { key: 'all-posts' })
const { data: pinned } = await useFetch('/api/posts', {
  key: 'pinned-posts',
  query: { pinned: true }
})

// useAsyncData 的 key 是第一个参数（必填）
const { data } = await useAsyncData('unique-key', () => fetchData())
</script>
```

### 4.3 `refreshNuxtData` — 批量刷新

```vue
<script setup>
// 刷新所有指定 key 的数据
await refreshNuxtData('posts')

// 刷新多个
await refreshNuxtData(['posts', 'comments', 'users'])

// 刷新所有
await refreshNuxtData()
</script>
```

### 4.4 `clearNuxtData` — 清除缓存

```vue
<script setup>
// 清除指定 key 的缓存
clearNuxtData('posts')

// 清除所有
clearNuxtData()
</script>
```

---

## 五、刷新与缓存策略

### 5.1 手动刷新

```vue
<script setup>
const { data, refresh } = await useFetch('/api/posts')

function handleRefresh() {
  // refresh 重新请求并更新 data
  refresh()
}
</script>

<template>
  <button @click="handleRefresh">刷新列表</button>
</template>
```

### 5.2 自动定时刷新

```vue
<script setup>
const { data, refresh } = await useFetch('/api/realtime-stats')

// 每 30 秒自动刷新
let timer
onMounted(() => {
  timer = setInterval(refresh, 30000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
```

### 5.3 懒加载 + 手动触发

```vue
<script setup>
// lazy: true — 不自动请求
const { data, pending, refresh } = await useFetch('/api/posts', {
  lazy: true
})

// 点击按钮时才请求
function loadData() {
  refresh()
}
</script>

<template>
  <button @click="loadData" :disabled="pending">
    {{ pending ? '加载中...' : '加载数据' }}
  </button>
</template>
```

### 5.4 SSR / Client 执行控制

```vue
<script setup>
// 仅在服务端获取（SSR 时获取，客户端不重复请求）
const { data } = await useFetch('/api/posts', {
  server: true   // 服务端执行（默认）
})

// 仅在客户端获取（如需要浏览器 Cookie/Token）
const { data } = await useFetch('/api/me', {
  server: false  // 跳过服务端，只在客户端执行
})
</script>
```

| `server` 值 | 行为 |
|-------------|------|
| `true`（默认）| 服务端 SSR 时获取，客户端 hydration 时复用 |
| `false` | 仅客户端执行，SSR 时不请求 |