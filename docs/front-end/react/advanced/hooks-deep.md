# Hooks 深入

## 自定义 Hook

自定义 Hook 是一种复用状态逻辑的机制，以 `use` 开头命名。

### 示例：useWindowSize

```tsx
import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// 使用
function App() {
  const { width, height } = useWindowSize()
  return <div>窗口尺寸: {width} x {height}</div>
}
```

### 示例：useLocalStorage

```tsx
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}
```

### 示例：useDebounce

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// 使用
function SearchBox() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch) {
      // 发起搜索请求
      console.log('搜索:', debouncedSearch)
    }
  }, [debouncedSearch])

  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

## useRef 进阶：保存上一次的值

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

function App() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>当前: {count}, 上一次: {prevCount ?? '无'}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

## Hooks 组合模式

```tsx
// 组合多个自定义 Hook
function useUserData(userId: string) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading, error }
}
```

## React 18 vs 19 新增 Hook

| 特性                 | React 18 | React 19                           |
| ------------------ | -------- | ---------------------------------- |
| `use`              | 不支持      | 新增，可读取 Promise 和 Context，可在条件语句中使用 |
| `useOptimistic`    | 不支持      | 新增，乐观更新                            |
| `useActionState`   | 不支持      | 新增，管理 Server Action 状态             |
| `useFormStatus`    | 不支持      | 新增，获取父表单状态                         |
| `useDeferredValue` | 初始值可选    | 新增 `initialValue` 参数               |

```tsx
// React 19: use() - 可在条件语句中使用
function UserProfile({ userId }: { userId: string }) {
  if (!userId) {
    return <div>请选择用户</div>
  }
  // use() 可以在条件语句中调用，不像其他 Hook 必须在顶层
  const user = use(fetchUser(userId))
  return <div>{user.name}</div>
}
```

