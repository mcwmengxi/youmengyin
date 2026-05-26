# useState 响应式状态

> 本章讲解 Nuxt 4 中 `useState` 的用法、SSR 安全的状态共享以及服务端状态序列化。

## 一、useState 基础

### 1.1 什么是 useState？

`useState` 是 Nuxt 内置的 SSR 友好型状态管理工具。它替代 Vue 3 的 `ref`，在服务端渲染后能将状态序列化到客户端。

```vue
<script setup lang="ts">
// 创建或访问一个 SSR 安全的状态
const counter = useState('counter', () => 0)

// 修改状态
function increment() {
  counter.value++
}
</script>

<template>
  <button @click="increment">{{ counter }}</button>
</template>
```

**第一个参数是唯一 key**，同一个 key 在整个应用中共享同一份状态。

### 1.2 为什么不用 `ref`？

|          | `ref`           | `useState`      |
| -------- | --------------- | --------------- |
| SSR 安全 | 否              | 是              |
| 跨组件共享 | 否              | 是（同 key）    |
| 服务端初始化 | 每次渲染重置 | 保持在内存中 |
| 客户端水合 | 可能不一致    | 自动同步        |

服务端用 `ref` 可能导致 hydration mismatch（服务端和客户端渲染结果不一致）。

---

## 二、useState 共享模式

### 2.1 跨组件共享

```vue
<!-- app/components/Counter.vue -->
<script setup lang="ts">
const count = useState('counter', () => 0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

```vue
<!-- app/components/Display.vue -->
<script setup lang="ts">
const count = useState('counter', () => 0)
// 无需 props，自动共享 Counter 的 counter 状态
</script>

<template>
  <p>当前值: {{ count }}</p>
</template>
```

### 2.2 跨页面共享

```ts
// app/composables/useCart.ts
export const useCart = () => {
  const items = useState<CartItem[]>('cart-items', () => [])

  const addItem = (item: CartItem) => {
    items.value.push(item)
  }

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return { items, addItem, total }
}
```

```vue
<!-- 在任意页面或组件中使用 -->
<script setup lang="ts">
const { items, addItem, total } = useCart()
</script>
```

---

## 三、useState 与 Composable 结合（推荐模式）

将 `useState` 封装在 Composable 中是 Nuxt 4 推荐的最佳实践：

```ts
// app/composables/useAuth.ts
interface User {
  id: number
  name: string
  email: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const token = useCookie<string | null>('auth-token')

  const isLoggedIn = computed(() => !!user.value)

  async function login(email: string, password: string) {
    const response = await $fetch<{ user: User; token: string }>('/api/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = response.user
    token.value = response.token
  }

  function logout() {
    user.value = null
    token.value = null
    navigateTo('/login')
  }

  return { user, token, isLoggedIn, login, logout }
}
```

---

## 四、Nuxt 4 useState 增强

### 4.1 类型推断优化

Nuxt 4 的 TypeScript 隔离让 `useState` 的类型推断更加精准：

```ts
// Nuxt 4：自动推断类型
const user = useState('user', () => ({ id: 1, name: 'Alice' }))
// user 类型自动推断为 Ref<{ id: number, name: string }>

// 也可以显式指定更宽泛的类型
const user = useState<User | null>('user', () => null)
```

### 4.2 配合 Nuxt 4 数据层

```ts
// app/composables/usePosts.ts
export const usePosts = () => {
  const posts = useState<Post[]>('posts', () => [])

  // useState 可以与 useFetch 结合使用
  async function fetchPosts() {
    const { data } = await useFetch('/api/posts', { key: 'posts-list' })
    posts.value = data.value ?? []
  }

  return { posts, fetchPosts }
}
```

---

## 五、注意事项与最佳实践

### 5.1 命名规范

```ts
// ✅ 好的命名：有意义的唯一 key
useState('auth-user', () => null)
useState('cart-items', () => [])
useState('theme-preference', () => 'light')

// ❌ 避免：太简单的 key 容易冲突
useState('data', () => null)
```

### 5.2 避免在工厂函数中使用浏览器 API

```ts
// ❌ 错误：工厂函数在服务端也会执行
const width = useState('window-width', () => window.innerWidth)

// ✅ 正确：在客户端再初始化
const width = useState('window-width', () => 0)
onMounted(() => {
  width.value = window.innerWidth
})
```

### 5.3 无需手动序列化

Nuxt 自动处理 `useState` 的数据从服务端到客户端的序列化：

```ts
// toRef、Date、Map、Set 等都能正确序列化
const items = useState('items', () => new Map<string, number>())
const createdAt = useState('created', () => new Date())
```

### 5.4 Nuxt 4 最佳实践

- **用 Composable 封装 `useState`**，不直接在组件中调用
- **给 key 加上有意义的前缀**，避免命名冲突
- **工厂函数保持纯净**，不依赖浏览器 API
- **跨页面状态用 `useState`**，局部状态用 `ref`
- **复杂状态管理用 Pinia**（下一章），`useState` 适合轻量级场景