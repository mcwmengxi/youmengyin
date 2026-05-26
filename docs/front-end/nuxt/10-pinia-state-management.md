# Pinia 状态管理

> 本章介绍如何在 Nuxt 4 中集成和使用 Pinia 进行全局状态管理，包括 Store 定义、SSR 序列化和最佳实践。

## 一、Pinia 安装与配置

### 1.1 安装

```bash
npm install pinia @pinia/nuxt
```

### 1.2 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@pinia/nuxt'],
})
```

Pinia 模块会自动：
- 注册 Pinia 插件
- 将 `app/stores/` 目录加入自动导入
- 处理 SSR 状态序列化

### 1.3 Store 目录（Nuxt 4 新位置）

```
app/stores/
├── useAuthStore.ts
├── useCartStore.ts
└── usePostStore.ts
```

---

## 二、创建 Store

### 2.1 Setup Store（推荐方式）

Nuxt 4 推荐使用 Setup Store 语法（类似 Composition API）：

```ts
// app/stores/useCounterStore.ts
export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const lastChanged = ref<Date | null>(null)

  // 计算属性
  const doubleCount = computed(() => count.value * 2)

  // 操作
  function increment() {
    count.value++
    lastChanged.value = new Date()
  }

  function decrement() {
    count.value--
    lastChanged.value = new Date()
  }

  return { count, lastChanged, doubleCount, increment, decrement }
})
```

### 2.2 Options Store（传统方式）

```ts
// app/stores/useUserStore.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false,
  }),

  getters: {
    displayName: (state) => state.name || '未登录用户',
  },

  actions: {
    async login(email: string, password: string) {
      const { data } = await useFetch('/api/login', {
        method: 'POST',
        body: { email, password },
      })
      this.name = data.value?.name ?? ''
      this.email = data.value?.email ?? ''
      this.isLoggedIn = true
    },

    logout() {
      this.name = ''
      this.email = ''
      this.isLoggedIn = false
      navigateTo('/login')
    },
  },
})
```

---

## 三、在组件中使用 Pinia

### 3.1 基本使用

```vue
<script setup lang="ts">
import { useCounterStore } from '~/stores/useCounterStore'

// 在 setup 中调用即可（无需在 setup 外部）
const counter = useCounterStore()

// 注意：不要解构，会丢失响应式
// const { count } = counter  // ❌ 会丢失响应式
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">+1</button>
  </div>
</template>
```

### 3.2 使用 `storeToRefs` 安全解构

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'

const counter = useCounterStore()

// ✅ 安全的响应式解构
const { count, doubleCount } = storeToRefs(counter)
// actions 可以直接解构（它们是函数）
const { increment } = counter
</script>

<template>
  <p>{{ count }}</p>
  <p>{{ doubleCount }}</p>
  <button @click="increment">+1</button>
</template>
```

---

## 四、SSR 中的 Pinia（Nuxt 4）

### 4.1 自动序列化

Nuxt 4 + `@pinia/nuxt` 自动处理 SSR 状态序列化，服务端初始化的 state 会被序列化到客户端的 `<script>` 标签中：

```html
<script>window.__NUXT__ = { /* 包含 pinia 序列化数据 */ }</script>
```

### 4.2 在服务器端初始化 Store

```vue
<!-- app/pages/products.vue -->
<script setup lang="ts">
const productStore = useProductStore()

// 服务端执行时获取的数据自动序列化到客户端
await useAsyncData('products', async () => {
  const { data } = await useFetch('/api/products', { key: 'products-list' })
  productStore.setProducts(data.value ?? [])
  return data.value
})
</script>
```

### 4.3 Store 中的服务端/客户端区分

```ts
// app/stores/useAppStore.ts
export const useAppStore = defineStore('app', () => {
  const platform = ref('')

  // 在客户端获取平台信息
  if (import.meta.client) {
    platform.value = navigator.platform
  }

  return { platform }
})
```

---

## 五、复杂 Store 示例 — 购物车

```ts
// app/stores/useCartStore.ts
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const coupon = ref<string | null>(null)

  // 计算属性
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // 操作
  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(item => item.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) removeItem(productId)
    }
  }

  async function checkout() {
    const { data } = await $fetch('/api/orders', {
      method: 'POST',
      body: { items: items.value, coupon: coupon.value },
    })
    items.value = []
    coupon.value = null
    return data
  }

  return { items, coupon, totalPrice, itemCount, addItem, removeItem, updateQuantity, checkout }
})
```

---

## 六、Pinia vs useState 选择指南

| 场景                 | 推荐方案      |
| -------------------- | ------------- |
| 简单计数器、开关     | `useState`    |
| 需要计算属性和 actions | Pinia         |
| 复杂业务逻辑         | Pinia         |
| 跨页面共享简单值     | `useState`    |
| 需要持久化存储       | Pinia + 插件  |
| 需要 DevTools 调试   | Pinia         |
| 临时、轻量级状态     | `useState`    |

---

## 七、Nuxt 4 Pinia 最佳实践

- **Setup Store 优于 Options Store**，与 Composition API 风格一致
- **不要直接解构 store**，使用 `storeToRefs()` 保持响应式
- **将 store 放在 `app/stores/` 目录**，Nuxt 4 会自动导入
- **服务端数据通过 `useAsyncData` → store 赋值**，利用 SSR 自动序列化
- **区分服务端和客户端逻辑**，用 `import.meta.client` / `import.meta.server`