# 自定义 Composables

> 本章讲解如何在 Nuxt 4 中编写自定义组合式函数（Composables），包括自动导入、最佳实践和常见模式。

## 一、Composables 概述

Nuxt 4 自动扫描 `app/composables/` 目录，文件中导出的函数自动全局可用：

```
app/composables/
├── useAuth.ts        → 自动导入：useAuth()
├── useDate.ts         → 自动导入：useDate()
├── useApi.ts          → 自动导入：useApi()
└── useDarkMode.ts     → 自动导入：useDarkMode()
```

**命名规范**：以 `use` 开头，camelCase。

---

## 二、基础 Composable

### 2.1 状态管理型

```ts
// app/composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const double = computed(() => count.value * 2)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initialValue }

  return { count, double, increment, decrement, reset }
}
```

```vue
<script setup lang="ts">
const { count, double, increment } = useCounter(10)
</script>
```

### 2.2 数据获取型

```ts
// app/composables/usePosts.ts
export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Post[]>('/api/posts')
      posts.value = data
    } catch (e) {
      error.value = '加载失败'
    } finally {
      loading.value = false
    }
  }

  // 自动预取（在 SSR 时也会执行）
  if (import.meta.server) {
    await fetchPosts()
  }

  return { posts, loading, error, fetchPosts }
}
```

### 2.3 工具函数型

```ts
// app/composables/useDateFormatter.ts
export function useDateFormatter() {
  function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatRelative(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const diff = Date.now() - d.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
    return formatDate(date)
  }

  return { formatDate, formatRelative }
}
```

---

## 三、Composable 目录嵌套

Nuxt 4 支持嵌套目录，自动保持按需导入：

```
app/composables/
├── useAuth.ts
├── useCounter.ts
├── api/
│   ├── usePosts.ts
│   └── useUsers.ts
└── ui/
    ├── useToast.ts
    └── useModal.ts
```

```vue
<script setup lang="ts">
// 嵌套的 composable 同样自动导入
const { posts, fetchPosts } = usePosts()
const { show, hide } = useModal()
</script>
```

---

## 四、SSR 安全 Composable

### 4.1 检查执行环境

```ts
// app/composables/useWindowSize.ts
export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  function update() {
    if (import.meta.client) {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }

  if (import.meta.client) {
    window.addEventListener('resize', update)
    update()
  }

  // 使用 onUnmounted 而非 onBeforeUnmount（Nuxt 4 推荐）
  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', update)
    }
  })

  return { width, height }
}
```

### 4.2 服务端安全的 LocalStorage

```ts
// app/composables/useLocalStorage.ts
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue) as Ref<T>

  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try { data.value = JSON.parse(stored) } catch {}
    }

    watch(data, (val) => {
      localStorage.setItem(key, JSON.stringify(val))
    }, { deep: true })
  }

  return data
}
```

---

## 五、Composable 中的异步并发

### 5.1 使用 Promise.all 批量请求

```ts
// app/composables/useDashboard.ts
export function useDashboard() {
  const stats = ref(null)
  const activities = ref([])
  const notifications = ref([])

  async function loadDashboard() {
    const [statsData, activitiesData, notificationsData] = await Promise.all([
      $fetch('/api/stats'),
      $fetch('/api/activities'),
      $fetch('/api/notifications'),
    ])

    stats.value = statsData
    activities.value = activitiesData
    notifications.value = notificationsData
  }

  return { stats, activities, notifications, loadDashboard }
}
```

### 5.2 使用 Nuxt 4 的 `useFetch` 共享请求

```ts
// app/composables/useSharedPost.ts
export function useSharedPost(id: string) {
  // 多个组件使用相同 key，请求自动共享
  return useFetch(`/api/posts/${id}`, { key: `post-${id}` })
}
```

---

## 六、Composable 推荐模式

| 模式         | 示例                      | 适用场景               |
| ------------ | ------------------------- | ---------------------- |
| **状态管理** | `useCounter()`            | 组件间共享响应式状态   |
| **数据获取** | `usePosts()`              | 封装 API 调用逻辑      |
| **工具函数** | `useDateFormatter()`      | 通用的纯函数工具集     |
| **浏览器 API** | `useWindowSize()`       | 封装浏览器原生 API     |
| **副作用**   | `useEventListener()`      | 管理 DOM 事件监听      |

---

## 七、Nuxt 4 Composable 最佳实践

- **一个 Composable 只做一件事**，保持单一职责
- **命名以 `use` 开头**，保证自动导入
- **SSR 安全**：使用 `import.meta.client` 检查环境
- **副作用清理**：用 `onUnmounted` / `watch` 清理监听
- **返回值用对象而非数组**，方便按需解构
- **避免在 Composable 中直接修改 DOM**，改用 `ref` + 模板绑定