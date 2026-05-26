# Zustand

## 什么是 Zustand？

Zustand 是一个轻量级的 React 状态管理库，API 简洁、无样板代码，是 Redux 的一个优秀替代方案。

### 安装

```sh
npm install zustand
```

### 基本使用

```tsx
import { create } from 'zustand'

// 1. 创建 Store
interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// 2. 在组件中使用
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

### 选择器（Selectors）- 避免不必要渲染

```tsx
// 只订阅 count，其他状态变化不会触发重渲染
function CountDisplay() {
  const count = useCounterStore((state) => state.count)
  return <div>Count: {count}</div>
}

// 只订阅 action，count 变化不会触发重渲染
function Buttons() {
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

### 异步操作

```tsx
interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/users')
      const users = await res.json()
      set({ users, loading: false })
    } catch (err) {
      set({ error: '请求失败', loading: false })
    }
  },
}))

function UserList() {
  const { users, loading, error, fetchUsers } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) return <div>加载中...</div>
  if (error) return <div>{error}</div>

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

### 中间件

Zustand 内置了常用中间件。

```tsx
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

// persist: 持久化到 localStorage
// devtools: Redux DevTools 支持
const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { name: 'my-store' } // localStorage key
    )
  )
)
```

### Zustand vs Redux Toolkit

| 对比 | Zustand | Redux Toolkit |
|------|---------|---------------|
| 包体积 | ~1KB | ~12KB |
| 样板代码 | 极少 | 适中 |
| 学习曲线 | 低 | 中 |
| Store 外使用 | 直接调用 | 需要 dispatch |
| DevTools | 支持 | 支持 |
| 适用场景 | 中小项目 | 大型项目 |
| 社区生态 | 快速增长 | 最成熟 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Zustand | 正常工作 | 正常工作 |
| React 19 兼容性 | - | 完全兼容 |

> Zustand 完全兼容 React 18 和 19，无差异。