# $fetch 与服务端通信

> 本章介绍 `$fetch` 的使用方式、请求拦截、错误处理以及服务端 API 调用最佳实践。

## 一、$fetch 基础

### 1.1 什么是 $fetch？

`$fetch` 是 Nuxt 3 基于 [ofetch](https://github.com/unjs/ofetch) 提供的全局 HTTP 请求函数，在客户端和服务端**均可使用**：

```vue
<script setup>
// 客户端和服务端都能用
const data = await $fetch('/api/posts')
</script>
```

### 1.2 基本用法

```ts
// GET 请求
const posts = await $fetch('/api/posts')

// 带查询参数
const posts = await $fetch('/api/posts', {
  query: { page: 1, limit: 10 },
})

// POST 请求
const result = await $fetch('/api/posts', {
  method: 'POST',
  body: { title: '新文章' },
})

// PUT 请求
await $fetch(`/api/posts/${id}`, {
  method: 'PUT',
  body: { title: '更新标题' },
})

// DELETE 请求
await $fetch(`/api/posts/${id}`, {
  method: 'DELETE',
})
```

### 1.3 $fetch vs useFetch

| 特性            | `useFetch`                          | `$fetch`                   |
| --------------- | ----------------------------------- | -------------------------- |
| SSR 数据去重    | 自动                                | 无                         |
| 响应式 URL 追踪 | 自动                                | 无                         |
| 返回值          | `{ data, pending, error, refresh }` | 直接返回数据               |
| 缓存管理        | 内置                                | 无                         |
| 使用场景        | 页面/组件的数据获取                 | 事件处理、工具函数、服务端 |

```vue
<script setup>
// 页面数据 — 用 useFetch（享受 SSR 优化）
const { data } = await useFetch('/api/posts')

// 按钮点击 — 用 $fetch（轻量直接）
async function handleSubmit() {
  const result = await $fetch('/api/form', {
    method: 'POST',
    body: formData.value,
  })
}
</script>
```

---

## 二、请求与响应拦截

### 2.1 全局拦截器

在 `nuxt.config.ts` 中配置 `$fetch` 的全局钩子：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  $fetch: {
    // 全局请求拦截器
    onRequest({ request, options }) {
      // 统一添加 Token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${getToken()}`,
      }
    },

    // 全局请求错误处理
    onRequestError({ error }) {
      console.error('[请求错误]', error)
    },

    // 全局响应拦截器
    onResponse({ response }) {
      // 统一处理响应
      if (response.status === 401) {
        navigateTo('/login')
      }
    },

    // 全局响应错误处理
    onResponseError({ response }) {
      console.error('[响应错误]', response.status, response._data)
    },
  },
})
```

### 2.2 局部拦截器（单次请求）

```ts
const data = await $fetch('/api/posts', {
  onRequest({ request, options }) {
    console.log('请求发送前:', options.method, request)
  },
  onResponse({ response }) {
    console.log('收到响应:', response.status)
  },
  onResponseError({ response }) {
    console.error('响应出错:', response.status)
  },
})
```

### 2.3 自定义请求实例

```ts
// composables/useApi.ts
import { $fetch } from 'ofetch'

export const useApi = () => {
  return $fetch.create({
    baseURL: 'https://api.example.com',
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options }) {
      const token = useCookie('token')
      if (token.value) {
        options.headers.Authorization = `Bearer ${token.value}`
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
      throw response._data
    },
  })
}
```

---

## 三、错误处理

### 3.1 try-catch 捕获

```vue
<script setup>
async function fetchPosts() {
  try {
    const data = await $fetch('/api/posts')
    posts.value = data
  } catch (error) {
    console.error('请求失败:', error)

    // error.data — 服务端返回的错误体
    // error.statusCode — HTTP 状态码
    // error.message — 错误信息
  }
}
</script>
```

### 3.2 useFetch 的错误处理

```vue
<script setup>
const { data, error, refresh } = await useFetch('/api/posts')

// 响应式错误对象
watch(error, (newError) => {
  if (newError) {
    showToast('加载失败：' + newError.message)
  }
})
</script>

<template>
  <div v-if="error" class="error-banner">
    <p>加载失败: {{ error.message }}</p>
    <button @click="refresh()">重试</button>
  </div>
</template>
```

### 3.3 统一错误处理（插件方式）

```ts
// plugins/error-handler.ts
export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('app:error', (error) => {
    console.error('全局错误:', error)
    // 上报错误到监控平台
  })

  // 全局 Vue 错误处理
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue 错误:', error, info)
  }
})
```

### 3.4 服务端错误页面

`pages/` 同级目录中的 `error.vue`：

```vue
<!-- error.vue -->
<script setup>
const props = defineProps({
  error: Object,
})

function handleClearError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <button @click="handleClearError">返回首页</button>
  </div>
</template>
```

使用 `createError` 或 `throwError` 触发：

```ts
// 在中间件、API、服务端中
throw createError({
  statusCode: 404,
  message: '页面未找到',
  fatal: true,
})
```

---

## 四、自定义请求封装

### 4.1 封装通用 API 组合式函数

```ts
// composables/useApiFetch.ts
import type { UseFetchOptions } from '#app'

export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  return useFetch(url, {
    baseURL: 'https://api.example.com',
    ...options,

    // 统一附加请求头
    headers: {
      Authorization: `Bearer ${useCookie('token').value}`,
      ...options.headers,
    },

    // 统一错误处理
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
      if (response.status >= 500) {
        console.error('服务器错误')
      }
    },

    // 统一数据转换
    transform: (data) => {
      return data?.result ?? data
    },
  })
}

// 使用
const { data: posts } = await useApiFetch('/posts')
```

### 4.2 封装表单提交

```ts
// composables/useFormSubmit.ts
export function useFormSubmit<T>(url: string) {
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function submit(body: any): Promise<T | null> {
    pending.value = true
    error.value = null

    try {
      return await $fetch<T>(url, {
        method: 'POST',
        body,
      })
    } catch (e: any) {
      error.value = e.data?.message || '提交失败'
      return null
    } finally {
      pending.value = false
    }
  }

  return { pending, error, submit }
}

// 使用
const { pending, error, submit } = useFormSubmit('/api/contact')
await submit({ name: 'Alice', email: 'alice@example.com' })
```

### 4.3 带节流的搜索封装

```ts
// composables/useSearch.ts
import { watchDebounced } from '@vueuse/core'

export function useSearch() {
  const query = ref('')
  const results = ref([])
  const pending = ref(false)

  watchDebounced(
    query,
    async (val) => {
      if (!val.trim()) {
        results.value = []
        return
      }
      pending.value = true
      results.value = await $fetch('/api/search', { query: { q: val } })
      pending.value = false
    },
    { debounce: 300 }
  )

  return { query, results, pending }
}
```
