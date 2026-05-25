# Pinia 状态管理

> 本章介绍如何在 Nuxt 3 中集成和使用 Pinia 进行全局状态管理。

## 一、Pinia 安装与配置

### 1.1 安装 Pinia

```bash
npm install pinia @pinia/nuxt
```

### 1.2 配置 nuxt.config.ts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
})
```

Pinia 模块会自动：

- 注册 Pinia 插件
- 将 store 目录加入自动导入
- 处理 SSR 状态序列化

### 1.3 创建 Store 目录

```
stores/
└── counter.ts       # Pinia store（会自动导入）
```

`stores/` 目录不是必需的，但使用它可以享受自动导入。

---

## 二、Store 定义

### 2.1 选项式 Store（Option Store）

```ts
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'My Counter',
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用 this 引用其他 getter
    doublePlusOne(): number {
      return this.doubleCount + 1
    },
  },

  actions: {
    increment() {
      this.count++
    },
    async fetchAndSet() {
      const data = await $fetch('/api/counter')
      this.count = data.value
    },
  },
})
```

### 2.2 组合式 Store（Setup Store，推荐）

```ts
// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // state → ref / reactive
  const user = ref<User | null>(null)
  const token = useCookie('token') // 可配合 Nuxt 的 useCookie

  // getters → computed
  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => user.value?.name ?? '游客')

  // actions → 普通函数
  async function login(email: string, password: string) {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = res.user
    token.value = res.token
  }

  async function logout() {
    user.value = null
    token.value = null
    await navigateTo('/login')
  }

  return { user, token, isLoggedIn, userName, login, logout }
})
```

组合式 Store 的优势：

- 写法与 Vue Composition API 一致
- 可以使用 `useCookie`、`useFetch` 等 Nuxt 专属 API
- 无需区分 `state` / `getters` / `actions`

### 2.3 TypeScript 类型安全

```ts
// types/user.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)

  async function fetchUsers() {
    users.value = await $fetch<User[]>('/api/users')
  }

  return { users, currentUser, fetchUsers }
})
```

---

## 三、Store 使用

### 3.1 在组件中读取/修改

```vue
<script setup>
import { useCounterStore } from '~/stores/counter'

const counter = useCounterStore()

// 读取 state
console.log(counter.count)

// 读取 getter
console.log(counter.doubleCount)

// 直接修改（Pinia 支持）
counter.count++

// 批量修改 — $patch
counter.$patch({
  count: 100,
  name: 'Updated',
})

// 或函数式 $patch
counter.$patch((state) => {
  state.count++
  state.name = 'New Name'
})

// 调用 action
counter.increment()

// 重置为初始状态
counter.$reset()
</script>

<template>
  <p>{{ counter.count }}</p>
  <p>{{ counter.doubleCount }}</p>
  <button @click="counter.increment()">+1</button>
</template>
```

### 3.2 解构与响应式

```vue
<script setup>
import { storeToRefs } from 'pinia'

const counter = useCounterStore()

// ❌ 错误：解构会丢失响应式
const { count, doubleCount } = counter

// ✅ 正确：使用 storeToRefs 保持响应式
const { count, doubleCount } = storeToRefs(counter)

// actions 可以直接解构（不需要保持响应式）
const { increment } = counter
</script>
```

### 3.3 Store 中互相引用

```ts
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  async function checkout() {
    // 直接在 store 中引用另一个 store
    const userStore = useUserStore()
    const orderStore = useOrderStore()

    await orderStore.createOrder({
      userId: userStore.currentUser?.id,
      items: items.value,
    })

    items.value = []
  }

  return { items, checkout }
})
```

### 3.4 监听 Store 变化

```vue
<script setup>
const counter = useCounterStore()

// 监听整个 store 的变化
counter.$subscribe((mutation, state) => {
  console.log('Store 变化:', mutation.type, state)
})

// watch 特定属性
watch(
  () => counter.count,
  (newVal, oldVal) => {
    console.log(`count 从 ${oldVal} 变为 ${newVal}`)
  }
)

// 或使用 storeToRefs 后 watch
const { count } = storeToRefs(counter)
watch(count, (val) => {
  localStorage.setItem('count', String(val))
})
</script>
```

---

## 四、SSR 下的 Pinia 注意事项

### 4.1 状态序列化

Pinia 会自动将 store 状态序列化，SSR 时服务端初始化的数据会传递到客户端：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'], // 自动导入的 store 目录
  },
})
```

### 4.2 服务端数据预取

```vue
<!-- pages/posts.vue -->
<script setup>
const postStore = usePostStore()

// 在页面 setup 中获取数据，SSR 时会自动序列化到客户端
await postStore.fetchPosts()
</script>
```

### 4.3 仅在客户端初始化的 Store

```ts
// stores/clientOnly.ts
export const useClientStore = defineStore('client-only', () => {
  const windowWidth = ref(0)

  // 仅在客户端执行
  if (import.meta.client) {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth
    })
  }

  return { windowWidth }
})
```

### 4.4 Store 持久化（插件方式）

```ts
// plugins/pinia-persist.ts
export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia

  pinia.use(({ store }) => {
    // 从 localStorage 恢复
    if (import.meta.client) {
      const saved = localStorage.getItem(`pinia-${store.$id}`)
      if (saved) {
        store.$patch(JSON.parse(saved))
      }

      // 监听变化并保存
      store.$subscribe(() => {
        localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(store.$state))
      })
    }
  })
})
```

### 4.5 服务端请求中的 Store

```ts
// server/api/user.ts
export default defineEventHandler(async (event) => {
  // 服务端 API 中不能用 Pinia Store！
  // Pinia 是客户端状态管理，服务端 API 应直接操作数据库

  const db = useDatabase()
  return await db.query('SELECT * FROM users')
})
```
