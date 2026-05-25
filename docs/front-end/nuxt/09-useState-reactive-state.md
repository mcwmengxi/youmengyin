# useState 响应式状态

> 本章讲解 Nuxt 内置的 `useState` 组合式函数，实现跨组件的响应式状态共享。

## 一、useState 基础

### 1.1 什么是 useState？

`useState` 是 Nuxt 3 内置的 SSR 友好状态管理函数，用于在**组件间共享响应式状态**，并在 SSR 序列化期间保持状态一致性。

```vue
<script setup>
// 定义共享状态
const counter = useState('counter', () => 0)
//                              key      初始化函数

// 在其他组件中直接读取同一个 key
const counter = useState('counter') // 获取同一个状态
</script>
```

### 1.2 基本示例

```vue
<!-- components/Counter.vue -->
<script setup>
const count = useState('count', () => 0)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

```vue
<!-- components/CounterDisplay.vue -->
<script setup>
// 不传第二个参数，直接获取已存在的状态
const count = useState('count')
</script>

<template>
  <p>当前计数：{{ count }}</p>
</template>
```

两个组件共享同一个 `count` 状态，互相同步。

### 1.3 useState 签名

```ts
useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>
```

- `key`：全局唯一键，用于标识和共享状态
- `init`：可选的工厂函数，仅在服务端或状态不存在时执行

---

## 二、与 ref/reactive 的区别

| 特性       | `ref`                  | `useState`            |
| ---------- | ---------------------- | --------------------- |
| 作用域     | 当前组件               | 全局（通过 key 共享） |
| SSR 安全   | 否（hydration 不匹配） | 是（自动序列化）      |
| 跨组件共享 | 需要 provide/inject    | 直接通过 key 访问     |
| 适用场景   | 组件内部状态           | 全局/跨组件状态       |

### 2.1 SSR 水合问题

```vue
<!-- ❌ 错误做法 — SSR 水合不匹配 -->
<script setup>
const count = ref(Math.random()) // 服务端和客户端值不同
</script>

<!-- ✅ 正确做法 — 使用 useState -->
<script setup>
const count = useState('random', () => Math.random()) // 服务端生成，客户端复用
</script>
```

---

## 三、SSR 状态序列化

### 3.1 序列化原理

Nuxt 在服务端渲染时，将 `useState` 的值序列化为 JSON 嵌入 HTML；客户端 hydration 时直接恢复，避免重复计算。

```
<!-- 服务端渲染的 HTML -->
<script>
window.__NUXT__ = {
  state: {
    count: 0,
    user: { id: 1, name: "Alice" }
  }
}
</script>
```

### 3.2 可序列化的数据

```vue
<script setup>
// ✅ 可安全序列化 — 基本类型、普通对象、数组
const user = useState('user', () => ({
  id: 1,
  name: 'Alice',
  roles: ['admin'],
}))

const list = useState('list', () => [1, 2, 3])

// ❌ 不能序列化 — 函数、类实例、Symbol、循环引用
const fn = useState('fn', () => () => {}) // 函数不行
const date = useState('date', () => new Date()) // 需要手动转换
</script>
```

### 3.3 自定义序列化

```vue
<script setup>
// 对于需要特殊处理的数据（如 Date），在 useAsyncData 的 transform 中处理
const { data } = await useFetch('/api/posts', {
  transform: (response) => {
    return response.posts.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt), // 字符串 → Date
    }))
  },
})
</script>
```

---

## 四、使用场景与注意事项

### 4.1 适合同步的场景

```ts
// composables/useToast.ts
export function useToast() {
  const toasts = useState('toasts', () => [])

  function show(message: string) {
    toasts.value.push({ id: Date.now(), message })
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, remove }
}
```

这样在任意组件中调用 `useToast().show('操作成功')` 即可。

### 4.2 适合异步数据的场景

```vue
<script setup>
// ❌ 不推荐 — 用 useState 管理异步数据（失去 SSR 去重优化）
const posts = useState('posts', () => [])
const data = await $fetch('/api/posts')
posts.value = data

// ✅ 推荐 — 直接用 useFetch（自动享有 SSR 优化）
const { data: posts } = await useFetch('/api/posts')
</script>
```

### 4.3 用户登录状态

```ts
// composables/useAuth.ts
export function useAuth() {
  const user = useState('user', () => null)

  async function login(credentials: { email: string; password: string }) {
    user.value = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    })
  }

  function logout() {
    user.value = null
    navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, isLoggedIn, login, logout }
}

// 任意页面使用
const { user, isLoggedIn } = useAuth()
```

### 4.4 注意事项

| 注意点                   | 说明                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| **key 全局唯一**         | 同一 key 在整个应用中只有一个实例，注意命名冲突                  |
| **仅在顶层使用**         | 不要在回调、条件、循环中调用 `useState`（同 Vue 组合式函数规则） |
| **初始化函数只执行一次** | `init` 函数仅在服务端或首次未初始化时执行                        |
| **避免存储大量数据**     | 所有 useState 数据都会在 SSR 时序列化到页面，影响性能            |
| **不替代 Pinia**         | useState 适合轻量状态，复杂状态管理仍推荐 Pinia                  |

### 4.5 useState vs Pinia 选择指南

| 场景                           | 推荐         |
| ------------------------------ | ------------ |
| 少数几个全局状态（主题、语言） | `useState`   |
| 用户认证信息                   | `useState`   |
| 复杂业务状态（购物车、订单）   | Pinia        |
| 需要 getters / actions 结构化  | Pinia        |
| 需要 DevTools 调试             | Pinia        |
| 跨页面持久化                   | Pinia + 插件 |
