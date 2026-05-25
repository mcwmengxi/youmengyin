# 自定义 Composables

> 本章讲解如何编写高质量的自定义组合式函数，实现逻辑复用与代码组织。

## 一、Composable 命名规范

### 1.1 核心规则

- 函数名**必须以 `use` 开头**（如 `useAuth`、`usePagination`）
- 文件名建议与函数名一致（如 `composables/useAuth.ts`）
- 自动导入时 Nuxt 会识别 `use` 前缀并处理

```
composables/
├── useAuth.ts          → 自动导入 useAuth()
├── usePagination.ts    → 自动导入 usePagination()
├── useClickOutside.ts  → 自动导入 useClickOutside()
└── utils.ts            → 也会自动导入（不限 use 前缀）
```

### 1.2 命名建议

| 命名          | 说明                     |
| ------------- | ------------------------ |
| `useXxx`      | 组合式函数（有状态逻辑） |
| `useXxxState` | 纯状态管理               |
| `useXxxApi`   | API 请求封装             |
| `useXxxForm`  | 表单处理                 |

---

## 二、创建自定义 Composable

### 2.1 基础结构

```ts
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return { count, increment, decrement }
}
```

在组件中使用（自动导入，无需 import）：

```vue
<script setup>
const { count, increment, decrement } = useCounter(10)
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
</template>
```

### 2.2 异步 Composable

```ts
// composables/usePost.ts
export function usePost(id: MaybeRef<string>) {
  const post = ref(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    pending.value = true
    error.value = null
    try {
      post.value = await $fetch(`/api/posts/${toValue(id)}`)
    } catch (e: any) {
      error.value = e.message
    } finally {
      pending.value = false
    }
  }

  return { post, pending, error, fetch }
}
```

---

## 三、参数设计模式

### 3.1 接收 Ref 或原始值（MaybeRef）

```ts
// composables/useToggle.ts
import { toValue } from 'vue'
import type { MaybeRef } from 'vue'

export function useToggle(initialValue: MaybeRef<boolean> = false) {
  // toValue 统一处理 ref 和普通值
  const state = ref(toValue(initialValue))

  function toggle() {
    state.value = !state.value
  }

  return { state, toggle }
}
```

```vue
<script setup>
// 可以传普通值
const { state: a } = useToggle(true)

// 也可以传 ref
const flag = ref(false)
const { state: b } = useToggle(flag) // flag 变化时 b 会同步
</script>
```

### 3.2 关键点：`toValue` vs `toRef`

```ts
import { toValue, toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

// ❌ 错误 — 只取了初始值，不会响应变化
export function useBad(param: MaybeRefOrGetter<number>) {
  const value = ref(toValue(param)) // 只执行一次
}

// ✅ 正确 — 追踪来源变化
export function useGood(param: MaybeRefOrGetter<number>) {
  const value = computed(() => toValue(param))
}
```

---

## 四、SSR 安全设计

### 4.1 环境检查

```ts
// composables/useWindowSize.ts
export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  function update() {
    if (import.meta.client) {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', update)
    }
  })

  return { width, height }
}
```

### 4.2 延迟客户端初始化

```ts
// composables/useLocalStorage.ts
export function useLocalStorage(key: string, defaultValue: any) {
  const data = ref(defaultValue)

  // 仅在客户端从 localStorage 读取
  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        data.value = JSON.parse(stored)
      } catch {
        data.value = stored
      }
    }
  }

  // 监听变化写回 localStorage
  watch(
    data,
    (val) => {
      if (import.meta.client) {
        localStorage.setItem(key, JSON.stringify(val))
      }
    },
    { deep: true }
  )

  return data
}
```

---

## 五、常见场景示例

### 5.1 分页 Composable

```ts
// composables/usePagination.ts
export function usePagination<T>(fetchFn: (page: number) => Promise<T[]>) {
  const page = ref(1)
  const items = ref<T[]>([])
  const pending = ref(false)
  const finished = ref(false)

  async function loadMore() {
    if (pending.value || finished.value) return
    pending.value = true
    const newItems = await fetchFn(page.value)
    if (newItems.length === 0) {
      finished.value = true
    } else {
      items.value.push(...newItems)
      page.value++
    }
    pending.value = false
  }

  return { page, items, pending, finished, loadMore }
}
```

```vue
<script setup>
const { items, pending, loadMore } = usePagination(async (page) => {
  return await $fetch('/api/posts', { query: { page } })
})

onMounted(() => loadMore())
</script>
```

### 5.2 防抖请求 Composable

```ts
// composables/useDebouncedFetch.ts
export function useDebouncedFetch<T>(url: string, delay = 300) {
  const query = ref('')
  const data = ref<T | null>(null)
  const pending = ref(false)

  // 使用 VueUse 或手动实现防抖
  let timer: ReturnType<typeof setTimeout>
  watch(query, (val) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (!val.trim()) {
        data.value = null
        return
      }
      pending.value = true
      data.value = await $fetch(url, { query: { q: val } })
      pending.value = false
    }, delay)
  })

  return { query, data, pending }
}
```

### 5.3 剪贴板 Composable

```ts
// composables/useClipboard.ts
export function useClipboard() {
  const copied = ref(false)

  async function copy(text: string) {
    if (import.meta.client) {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }

  return { copied, copy }
}
```
