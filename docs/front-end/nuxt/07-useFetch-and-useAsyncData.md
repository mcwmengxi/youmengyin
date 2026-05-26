# useFetch 与 useAsyncData — Nuxt 4 智能数据层

> Nuxt 4 对数据获取层进行了重大升级。本章详细讲解 `useFetch` 和 `useAsyncData` 在 Nuxt 4 中的新特性：智能共享、自动清理和响应式 key 联动。

## 一、Nuxt 4 数据层核心变化

| 特性             | Nuxt 3                                | Nuxt 4                                |
| ---------------- | ------------------------------------- | ------------------------------------- |
| **数据共享**     | 手动传递或重复请求                    | 同 key 自动跨组件共享                 |
| **数据清理**     | 手动管理，可能内存泄漏                | 组件卸载时自动清理                    |
| **缓存控制**     | 基础 `getCachedData`                  | 增强的 `staleTime`、缓存策略          |
| **响应式 key**   | 需手动 `watch` 再调用 `refresh`       | `key` 支持函数，变化时自动重新获取    |
| **默认行为**     | `data` 初始为 `null`                  | 可配置 `resetAsyncDataToUndefined` 等 |

---

## 二、useFetch

### 2.1 基本用法

```vue
<script setup lang="ts">
// 最简单的用法 — Nuxt 4 自动处理生命周期
const { data, pending, error, refresh, status } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <p v-if="status === 'pending'">加载中...</p>
    <p v-else-if="error">出错了: {{ error.message }}</p>
    <ul v-else>
      <li v-for="post in data" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>
```

### 2.2 返回值详解

| 属性       | 类型                        | 说明                                  |
| ---------- | --------------------------- | ------------------------------------- |
| `data`     | `Ref<T>`                    | 请求返回的数据，初始为 `null`          |
| `pending`  | `Ref<boolean>`              | 请求是否进行中                        |
| `error`    | `Ref<Error \| null>`        | 请求错误对象                          |
| `refresh`  | `Function`                  | 手动重新执行请求                      |
| `status`   | `Ref<string>`               | `'idle'` / `'pending'` / `'success'` / `'error'` |
| `execute`  | `Function`                  | 与 `refresh` 类似，但返回 Promise     |
| `clear`    | `Function`                  | 清空当前 data 和 error                |

### 2.3 带参数的请求

```vue
<script setup lang="ts">
const route = useRoute()

// 动态 URL — 可以用 computed 或函数
const { data } = await useFetch(() => `/api/posts/${route.params.id}`)

// 查询参数
const { data: posts } = await useFetch('/api/posts', {
  query: { page: 1, limit: 10 },
})

// 搜索 — Nuxt 4 自动追踪 query 中的响应式依赖
const search = ref('')
const page = ref(1)
const { data: results } = await useFetch('/api/search', {
  query: { q: search, page },
})
// search 或 page 变化时自动重新请求！
</script>
```

---

## 三、Nuxt 4 智能共享数据

### 3.1 跨组件共享（新特性）

Nuxt 4 中，同一个 `key` 的 `useFetch` / `useAsyncData` 会自动共享数据，避免重复请求：

```vue
<!-- app/components/PostTitle.vue -->
<script setup lang="ts">
// 使用相同 key 的请求，数据自动共享
const { data } = await useFetch('/api/post/1', {
  key: 'post-1',
})
</script>

<template>
  <h1>{{ data?.title }}</h1>
</template>
```

```vue
<!-- app/components/PostBody.vue -->
<script setup lang="ts">
// 同一个 key，不会发起第二次请求！
const { data } = await useFetch('/api/post/1', {
  key: 'post-1',
})
</script>

<template>
  <div v-html="data?.content" />
</template>
```

### 3.2 响应式 Key

`key` 可以是函数，key 变化时自动重新获取：

```vue
<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

// Nuxt 4：key 变化 → 自动重新获取，旧数据自动清理
const { data } = await useFetch(() => `/api/posts/${id.value}`, {
  key: () => `post-${id.value}`,
})
</script>
```

### 3.3 自动清理

组件卸载时，如果该数据的 `key` 没有其他组件使用，Nuxt 4 自动清理缓存，释放内存。

---

## 四、useAsyncData

### 4.1 基本用法

`useAsyncData` 用于获取非 HTTP 数据（数据库查询、文件读取等）：

```vue
<script setup lang="ts">
const { data } = await useAsyncData('stats', async () => {
  const [users, posts, comments] = await Promise.all([
    $fetch('/api/users/count'),
    $fetch('/api/posts/count'),
    $fetch('/api/comments/count'),
  ])
  return { users, posts, comments }
})
</script>
```

### 4.2 Nuxt 4 缓存新选项

```ts
const { data } = await useAsyncData('products', () => $fetch('/api/products'), {
  // Nuxt 4 新增选项
  staleTime: 60 * 1000,  // 1 分钟内使用缓存，不重新请求
  shared: true,           // 跨组件共享（默认 true）
})
```

### 4.3 条件请求

```vue
<script setup lang="ts">
const shouldFetch = ref(false)

const { data } = await useAsyncData('conditional', () => $fetch('/api/data'), {
  immediate: false,  // 不立即执行
})

// 手动触发
function load() {
  shouldFetch.value = true
  // 使用 execute 而不是 refresh 来获取 Promise
  await refresh()
}
</script>
```

---

## 五、useFetch vs useAsyncData 选择指南

| 场景                               | 推荐方法       |
| ---------------------------------- | -------------- |
| 从 API 端点获取 JSON 数据          | `useFetch`     |
| 获取非 HTTP 数据（数据库、文件等） | `useAsyncData` |
| 需要多个请求组合                   | `useAsyncData` |
| 简单的 GET/POST 请求               | `useFetch`     |
| 需要自定义请求转换                 | `useAsyncData` + `$fetch` |

---

## 六、Nuxt 4 数据获取最佳实践

### 6.1 推荐模式

```vue
<script setup lang="ts">
const route = useRoute()

// ✅ 推荐：使用函数形式的 URL，依赖自动追踪
const { data, refresh } = await useFetch(() => `/api/posts/${route.params.id}`)

// ✅ 推荐：显式 key 以便跨组件共享
const { data: post } = await useFetch(() => `/api/posts/${route.params.id}`, {
  key: () => `post-${route.params.id}`,
})

// ❌ 避免：手动 watch
// watch(id, () => refresh())  // Nuxt 4 不再需要
</script>
```

### 6.2 错误处理

```vue
<script setup lang="ts">
const { data, error, status } = await useFetch('/api/dangerous-endpoint')

// Nuxt 4 的 status 提供更细粒度的状态
if (status.value === 'error') {
  console.error('请求失败:', error.value?.message)
}
</script>
```

### 6.3 服务器端数据传递

```vue
<script setup lang="ts">
// Nuxt 4 服务端预取的数据自动序列化到客户端
const { data } = await useFetch('/api/init-data')
// 服务端渲染时获取，客户端无需重新请求
</script>
```

### 6.4 关键要点

- **给每个 useFetch/useAsyncData 指定唯一 key**，享受自动共享
- **key 用函数形式**以支持响应式 refetch
- **Nuxt 4 不再需要手动 watch + refresh**，key 变化自动处理
- **组件卸载自动清理**，不用担心内存泄漏