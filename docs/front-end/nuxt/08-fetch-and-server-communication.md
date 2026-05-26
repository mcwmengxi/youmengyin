# $fetch 与服务端通信

> 本章讲解 Nuxt 4 中 `$fetch`（基于 ofetch）的高级用法，包括自定义请求配置、服务器端数据传递和错误处理。

## 一、$fetch 概述

`$fetch` 是 Nuxt 内置的 HTTP 客户端（ohmyfetch / ofetch），可在客户端、服务端和 Nitro 路由中使用。

```ts
// 基本 GET 请求
const data = await $fetch('/api/posts')

// 带类型
const posts = await $fetch<Post[]>('/api/posts')
```

### Nuxt 4 中 $fetch 的增强

- 更好的 TypeScript 泛型推断
- 与 Nuxt 4 数据层共享缓存策略
- 服务端直接调用 Nitro handler，跳过 HTTP 层（性能优化）

---

## 二、请求配置

### 2.1 HTTP 方法与请求体

```ts
// GET
const data = await $fetch('/api/posts', { method: 'GET' })

// POST — JSON 自动序列化
const result = await $fetch('/api/posts', {
  method: 'POST',
  body: { title: 'New Post', content: '...' },
})

// PUT
await $fetch(`/api/posts/${id}`, {
  method: 'PUT',
  body: updatedPost,
})

// DELETE
await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
```

### 2.2 请求头（Headers）

```ts
const data = await $fetch('/api/protected', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Request-ID': generateId(),
  },
})
```

### 2.3 查询参数（Query / Params）

```ts
// 方式一：直接在 URL 中
await $fetch(`/api/posts?id=${id}`)

// 方式二：使用 query 选项（推荐）
await $fetch('/api/search', {
  query: { q: 'vue', page: 1, limit: 20 },
})
// → GET /api/search?q=vue&page=1&limit=20

// 方式三：params 用于路径参数（Nuxt 4）
await $fetch('/api/posts', {
  params: { id: 123 },  // 仅用于模板路径
})
```

---

## 三、拦截器（Interceptors）

### 3.1 请求拦截器

```ts
const data = await $fetch('/api/data', {
  async onRequest({ request, options }) {
    // 请求前处理
    console.log('发起请求:', options.method, request)

    // 自动添加 Token
    const token = useCookie('token').value
    if (token) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  },
})
```

### 3.2 响应拦截器

```ts
const data = await $fetch('/api/data', {
  async onResponse({ request, response }) {
    // 统一处理响应
    console.log(`[${response.status}] ${request}`)

    // 自定义错误处理
    if (!response.ok) {
      throw new Error(`API 错误: ${response.status}`)
    }
  },
})
```

### 3.3 错误拦截器

```ts
const data = await $fetch('/api/risky', {
  async onResponseError({ request, response }) {
    // 统一错误处理
    if (response.status === 401) {
      await navigateTo('/login')
    }
    if (response.status === 403) {
      throw new Error('无权限访问')
    }
  },
})
```

---

## 四、全局 $fetch 配置（Nuxt 4 推荐）

在 `app/plugins/` 中创建全局配置：

```ts
// app/plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // 创建全局 API 实例
  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 10000,

    onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
      if (response.status >= 500) {
        console.error('服务器错误:', response._data)
      }
    },
  })

  return { provide: { api } }
})
```

```vue
<!-- 在组件中使用 -->
<script setup lang="ts">
const { $api } = useNuxtApp()
const posts = await $api<Post[]>('/posts')
</script>
```

---

## 五、服务端直接调用（Nuxt 4 增强）

### 5.1 服务端内部 API 调用

Nuxt 4 的服务端 `$fetch` 在请求内部 API 时**跳过 HTTP 层**，直接调用 Nitro handler：

```ts
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  // 直接调用另一个 handler，无 HTTP 开销
  const config = await $fetch('/api/config')
  return { users: [], config }
})
```

### 5.2 服务端调用外部 API

```ts
// server/api/proxy.get.ts
export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)

  // 调用外部 API — 正常 HTTP 请求
  const data = await $fetch(`https://api.external.com/search?q=${q}`, {
    headers: {
      'X-API-Key': useRuntimeConfig().externalApiKey,
    },
  })

  return data
})
```

### 5.3 `server$fetch`（前缀调用）

Nuxt 4 中继续保持 `server$` 前缀语法糖：

```ts
// server/api/data.get.ts — 使用 server$fetch 调用同 server 下的端点
export default defineEventHandler(async () => {
  const users = await $fetch('/api/users')
  const posts = await $fetch('/api/posts')
  return { users, posts }
})
```

---

## 六、$fetch vs useFetch 对比

| 特性               | `$fetch`                          | `useFetch`                        |
| ------------------ | --------------------------------- | --------------------------------- |
| **SSR 数据传递**   | 不支持（仅客户端时）              | 自动序列化服务端数据到客户端      |
| **请求去重**       | 不支持                            | 同 key 自动去重                   |
| **响应式数据**     | 不支持                            | 返回 `Ref`                        |
| **跨组件共享**     | 不支持                            | Nuxt 4 自动共享                   |
| **生命周期绑定**   | 不支持                            | 组件卸载自动清理                  |
| **使用场景**       | 事件处理、服务端、非 SSR 场景     | 页面组件数据获取                  |

```vue
<script setup lang="ts">
// ✅ 页面组件中获取数据 → 用 useFetch
const { data } = await useFetch('/api/posts')

// ✅ 事件处理中提交数据 → 用 $fetch
async function handleSubmit() {
  await $fetch('/api/posts', { method: 'POST', body: formData })
}

// ✅ 服务端代码 → 用 $fetch
// server/api/...
</script>
```

---

## 七、Nuxt 4 最佳实践

- **页面数据获取用 `useFetch`/`useAsyncData`**，享受自动共享和清理
- **事件处理（提交、删除等）用 `$fetch`**，不占用缓存
- **创建全局 `$fetch` 实例**封装 baseURL、token、错误处理
- **服务端内部调用用 `$fetch`**，Nuxt 4 自动优化为直接调用
- **Nuxt 4 的 `useFetch` 不再需要手动 `watch`**，key 函数自动追踪依赖