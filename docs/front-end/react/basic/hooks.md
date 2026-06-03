# Hooks 基础

## 什么是 Hooks？

Hooks 是 React 16.8 引入的特性，让你在函数组件中使用 state 和其他 React 功能，无需类组件。

## Hooks 规则

1. **只在顶层调用**：不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用**：不要在普通 JavaScript 函数中调用

```
✅ 正确                    ❌ 错误
function Comp() {          function Comp() {
  const [a] = useState()     if (condition) {
  const [b] = useState()       const [a] = useState()  // 条件中调用
  ...                        }
}                          }
```

---

## 基础 Hooks

### useState - 状态管理

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: '', age: 0 })

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        年龄+1
      </button>
    </div>
  )
}
```

**惰性初始化**：初始值通过函数传入，避免每次渲染都执行昂贵计算。

```tsx
// ❌ 每次渲染都创建数组
const [state, setState] = useState(createExpensiveArray())

// ✅ 只在首次渲染时执行
const [state, setState] = useState(() => createExpensiveArray())
```

**更新函数形式**：当新值依赖旧值时，使用函数形式。

```tsx
// ❌ 可能有问题（闭包陷阱）
<button onClick={() => setCount(count + 1)}>

// ✅ 函数形式，始终获取最新值
<button onClick={() => setCount(c => c + 1)}>
```

---

### useEffect - 副作用处理

```tsx
import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // 副作用：启动定时器
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(timer)
  }, []) // 空数组 = 只在挂载时执行

  return <div>已运行 {seconds} 秒</div>
}
```

**依赖数组详解**：

| 依赖数组 | 执行时机          | 使用场景           |
| -------- | ----------------- | ------------------ |
| 无依赖   | 每次渲染后都执行  | 极少使用           |
| `[]`     | 仅挂载时执行      | 一次性订阅、初始化 |
| `[a, b]` | 挂载 + a/b 变化时 | 监听特定值变化     |

**常见模式**：

```tsx
// 1. 挂载时执行一次
useEffect(() => {
  fetchData()
}, [])

// 2. 监听 props 变化
useEffect(() => {
  fetchUser(userId)
}, [userId])

// 3. 清理订阅
useEffect(() => {
  const subscription = subscribe(channel)
  return () => subscription.unsubscribe()
}, [channel])

// 4. 监听浏览器事件
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

---

### useRef - DOM 引用与可变值

`useRef` 返回一个 ref 对象，其 `.current` 属性可变且持久化整个组件生命周期。

```tsx
import { useRef, useEffect } from 'react'

// 用法 1：DOM 引用
function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} placeholder="自动聚焦" />
}

// 用法 2：保存可变值（不触发重渲染）
function Timer() {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => setCount((c) => c + 1), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return <div>计数: {count}</div>
}
```

**useRef vs useState**：

| 特性     | `useRef`                      | `useState`           |
| -------- | ----------------------------- | -------------------- |
| 值变化时 | 不触发重渲染                  | 触发重渲染           |
| 持久性   | 组件生命周期内持久            | 组件生命周期内持久   |
| 使用场景 | DOM 引用、定时器 ID、前一次值 | 需要响应式更新的数据 |

---

### useContext - 消费上下文

```tsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>当前主题: {theme}</button>
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  )
}
```

**性能注意**：Context 值变化时，所有消费者都会重渲染。可通过拆分 Context 或使用 `useMemo` 优化。

---

### useReducer - 复杂状态管理

适合管理包含多个子值的复杂 state，或状态逻辑复杂时。

```tsx
import { useReducer } from 'react'

interface State {
  count: number
  step: number
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setStep'; payload: number }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'reset':
      return { ...state, count: 0 }
    case 'setStep':
      return { ...state, step: action.payload }
    default:
      return state
  }
}

function ReducerDemo() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  )
}
```

**useState vs useReducer**：

| 场景                 | 推荐         |
| -------------------- | ------------ |
| 简单独立状态         | `useState`   |
| 多个相关联的状态     | `useReducer` |
| 状态逻辑复杂         | `useReducer` |
| 需要可预测的状态变更 | `useReducer` |

---

### useMemo - 缓存计算结果

```tsx
import { useMemo, useState } from 'react'

function ExpensiveCalculation({ list }: { list: number[] }) {
  const [filter, setFilter] = useState(0)

  const filteredList = useMemo(() => {
    console.log('重新计算...')
    return list.filter((item) => item > filter)
  }, [list, filter])

  return (
    <div>
      <input
        type="number"
        value={filter}
        onChange={(e) => setFilter(Number(e.target.value))}
      />
      <ul>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

**使用原则**：

- 仅用于昂贵计算（如大数据过滤、复杂转换）
- 不要过度使用，`useMemo` 本身也有开销
- React 仅在开发模式下验证依赖，生产模式下不保证缓存

---

### useCallback - 缓存函数引用

```tsx
import { useCallback, useState, memo } from 'react'

const ChildButton = memo(
  ({ onClick, label }: { onClick: () => void; label: string }) => {
    console.log(`渲染 ${label}`)
    return <button onClick={onClick}>{label}</button>
  }
)

function Parent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  return (
    <div>
      <p>
        Count: {count}, Other: {other}
      </p>
      <ChildButton onClick={increment} label="Increment" />
      <button onClick={() => setOther((o) => o + 1)}>Change Other</button>
    </div>
  )
}
```

**useMemo vs useCallback**：

```tsx
// useCallback(fn, deps) 等价于 useMemo(() => fn, deps)
const handleClick = useCallback(() => doSomething(id), [id])
const handleClick = useMemo(() => () => doSomething(id), [id])
```

---

## Hooks 汇总

| Hook          | 用途                             | 使用频率 |
| ------------- | -------------------------------- | -------- |
| `useState`    | 管理组件状态                     | 极高     |
| `useEffect`   | 处理副作用（请求、订阅、定时器） | 极高     |
| `useRef`      | DOM 引用、保存可变值             | 高       |
| `useContext`  | 消费上下文数据                   | 高       |
| `useMemo`     | 缓存计算结果                     | 中       |
| `useCallback` | 缓存函数引用                     | 中       |
| `useReducer`  | 复杂状态管理                     | 低       |

---

## 其他常用 Hooks

### useLayoutEffect - 同步副作用

与 `useEffect` 类似，但在 DOM 更新后**同步**执行，用于读取/修改 DOM 布局。

```tsx
import { useState, useLayoutEffect, useRef } from 'react'

function Tooltip() {
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (visible && buttonRef.current && tooltipRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      tooltipRef.current.style.top = `${rect.bottom + 8}px`
      tooltipRef.current.style.left = `${rect.left}px`
    }
  }, [visible])

  return (
    <div>
      <button ref={buttonRef} onClick={() => setVisible(!visible)}>
        悬停
      </button>
      {visible && (
        <div ref={tooltipRef} className="tooltip">
          提示内容
        </div>
      )}
    </div>
  )
}
```

**useEffect vs useLayoutEffect**：

| 特性     | `useEffect`        | `useLayoutEffect`      |
| -------- | ------------------ | ---------------------- |
| 执行时机 | 渲染完成后（异步） | DOM 更新后立即（同步） |
| 阻塞渲染 | 不阻塞             | 阻塞                   |
| SSR      | 安全               | 可能闪烁               |
| 使用场景 | 大多数副作用       | 测量 DOM、同步修改 DOM |

---

### useImperativeHandle - 暴露 ref 方法

自定义暴露给父组件的 ref 内容，配合 `forwardRef` 使用。

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface FancyInputHandle {
  focus: () => void
  highlight: () => void
}

const FancyInput = forwardRef<FancyInputHandle>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    highlight: () => inputRef.current?.select(),
  }))

  return <input ref={inputRef} {...props} />
})

function Parent() {
  const fancyRef = useRef<FancyInputHandle>(null)

  return (
    <div>
      <FancyInput ref={fancyRef} />
      <button onClick={() => fancyRef.current?.focus()}>聚焦</button>
      <button onClick={() => fancyRef.current?.highlight()}>选中</button>
    </div>
  )
}
```

---

### useId - 生成唯一 ID

生成在服务端和客户端之间稳定、唯一的 ID，适用于无障碍属性。

```tsx
import { useId } from 'react'

function PasswordField() {
  const passwordId = useId()
  const hintId = useId()

  return (
    <div>
      <label htmlFor={passwordId}>密码:</label>
      <input id={passwordId} type="password" aria-describedby={hintId} />
      <p id={hintId}>密码至少 8 位</p>
    </div>
  )
}
```

> **注意**：不要用 `useId` 生成列表 key，它不是为列表设计的。

---

### useDebugValue - 自定义 Hook 调试

为自定义 Hook 在 React DevTools 中显示标签。

```tsx
import { useState, useDebugValue } from 'react'

function useOnlineStatus() {
  const isOnline = useState(navigator.onLine)[0]
  useDebugValue(isOnline ? '在线' : '离线')
  return isOnline
}

// DevTools 中显示: useOnlineStatus: "在线"
```

---

## 并发特性 Hooks（React 18+）

### useTransition - 标记非紧急更新

将状态更新标记为 transition，避免阻塞 UI 交互。

```tsx
import { useState, useTransition } from 'react'

function SearchApp() {
  const [query, setQuery] = useState('')
  const [displayQuery, setDisplayQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    setQuery(value) // 紧急更新，立即响应
    startTransition(() => {
      setDisplayQuery(value) // 非紧急更新，可延迟
    })
  }

  return (
    <div>
      <input value={query} onChange={(e) => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <SearchResults query={displayQuery} />
    </div>
  )
}
```

---

### useDeferredValue - 延迟值更新

延迟一个值的更新，保持 UI 响应。

```tsx
import { useState, useDeferredValue, useMemo } from 'react'

function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(
    () => expensiveFilter(allData, deferredQuery),
    [deferredQuery]
  )

  return (
    <ul style={{ opacity: deferredQuery !== query ? 0.5 : 1 }}>
      {results.map((r) => (
        <li key={r.id}>{r.name}</li>
      ))}
    </ul>
  )
}
```

| 对比        | `useTransition`  | `useDeferredValue` |
| ----------- | ---------------- | ------------------ |
| 适用场景    | 控制状态更新时机 | 延迟派生值         |
| API 风格    | 包装更新函数     | 包装值             |
| `isPending` | 有               | 无                 |

---

### useSyncExternalStore - 订阅外部 Store

安全订阅外部数据源，确保并发模式下正确工作。

```tsx
import { useSyncExternalStore } from 'react'

function useOnlineStatus() {
  return useSyncExternalStore(
    // subscribe
    (callback) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    },
    // getSnapshot (客户端)
    () => navigator.onLine,
    // getServerSnapshot (服务端)
    () => false
  )
}
```

---

### useInsertionEffect - CSS-in-JS 样式插入

在 DOM 变更前同步插入样式，用于 CSS-in-JS 库。

```tsx
import { useInsertionEffect } from 'react'

function useCSS(css: string) {
  useInsertionEffect(() => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [css])
}
```

> **注意**：普通开发几乎不需要使用此 Hook，只有 CSS-in-JS 库作者会用到。

---

## React 19 新增 Hooks

### use - 条件读取 Promise/Context

允许在条件语句或循环中读取 Promise 或 Context。

```tsx
import { use, Suspense, createContext } from 'react'

const ThemeContext = createContext('light')

// 读取 Promise
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <h1>{user.name}</h1>
}

// 读取 Context（可在条件中使用）
function ThemedButton({ showTheme }: { showTheme: boolean }) {
  if (showTheme) {
    const theme = use(ThemeContext) // ✅ 可以在条件中调用
    return <button className={theme}>按钮</button>
  }
  return <button>按钮</button>
}

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <UserProfile userPromise={fetchUser()} />
    </Suspense>
  )
}
```

---

### useOptimistic - 乐观更新

立即更新 UI，同时在后台处理实际请求。

```tsx
import { useState, useOptimistic } from 'react'

function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  )

  async function handleSend(content: string) {
    const tempMsg = { id: `temp-${Date.now()}`, content, status: 'sending' }
    addOptimisticMessage(tempMsg) // 立即显示

    await sendMessage(content)
    setMessages((prev) => [...prev, { ...tempMsg, status: 'sent' }])
  }

  return (
    <div>
      {optimisticMessages.map((msg) => (
        <div key={msg.id} className={msg.status}>
          {msg.content}
        </div>
      ))}
    </div>
  )
}
```

---

### useActionState - 管理 Action 状态

管理表单 Action 的 pending、error、success 状态。

```tsx
import { useActionState } from 'react'

async function submitForm(prevState: FormState, formData: FormData) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) return { error: '提交失败' }
  return { success: true }
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null)

  if (state?.success) return <div>提交成功！</div>

  return (
    <form action={formAction}>
      <input name="name" placeholder="姓名" />
      <button type="submit" disabled={isPending}>
        {isPending ? '提交中...' : '提交'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
```

---

### useFormStatus - 获取表单状态

在表单内组件中获取表单的 pending 状态。

```tsx
import { useFormStatus } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}

function Form() {
  return (
    <form
      action={async () => {
        await submitForm()
      }}
    >
      <input name="name" />
      <SubmitButton />
    </form>
  )
}
```

---

## 自定义 Hook 最佳实践

### 命名规范

自定义 Hook 必须以 `use` 开头，React 依赖此前缀检查 Hook 规则。

```tsx
// ✅ 正确命名
function useWindowSize() { ... }
function useFetchUser(id: string) { ... }
function useLocalStorage<T>(key: string, initialValue: T) { ... }

// ❌ 错误命名（React 无法检查 Hook 规则）
function getWindowSize() { ... }
function fetchUserHook(id: string) { ... }
```

### 提取复用逻辑

```tsx
// 提取窗口大小监听
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// 使用
function Component() {
  const { width, height } = useWindowSize()
  return (
    <div>
      {width} x {height}
    </div>
  )
}
```

### 返回值设计

```tsx
// 方式 1：返回数组（灵活，调用者可重命名）
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = () => setValue((v) => !v)
  return [value, toggle] as const
}
const [on, toggleOn] = useToggle()

// 方式 2：返回对象（语义清晰，字段多时推荐）
function useFetch<T>(url: string) {
  return { data, loading, error, refetch }
}
const { data, loading, error } = useFetch('/api/user')
```

---

## Hooks 常见陷阱

### 1. 闭包陷阱

```tsx
// ❌ 闭包捕获了旧的 count 值
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // 始终是 0
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}

// ✅ 使用 ref 或函数式更新
function Counter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(countRef.current) // 始终是最新值
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}
```

### 2. 依赖遗漏

```tsx
// ❌ 依赖遗漏，导致闭包陈旧
useEffect(() => {
  fetchData(userId)
}, []) // userId 变化时不会重新请求

// ✅ 正确声明依赖
useEffect(() => {
  fetchData(userId)
}, [userId])
```

### 3. 过度使用 useMemo/useCallback

```tsx
// ❌ 过度使用，反而增加开销
const name = useMemo(() => user.name, [user.name])
const handleClick = useCallback(() => console.log(id), [id])

// ✅ 仅在昂贵计算或子组件优化时使用
const sortedList = useMemo(() => list.sort(compare), [list])
const handleClick = useCallback(() => onSubmit(id), [onSubmit, id])
```

### 4. 在条件中调用 Hook

```tsx
// ❌ 违反 Hook 规则
function Component({ show }) {
  if (show) {
    const [value, setValue] = useState(0) // 错误！
  }
}

// ✅ 始终在顶层调用
function Component({ show }) {
  const [value, setValue] = useState(0)
  if (show) {
    // 使用 value
  }
}
```

---

## React 18 vs 19 差异

| 特性             | React 18                                              | React 19                             |
| ---------------- | ----------------------------------------------------- | ------------------------------------ |
| 基础 Hooks       | useState, useEffect, useContext 等                    | 无变化                               |
| 并发 Hooks       | useTransition, useDeferredValue, useSyncExternalStore | 新增 `use`                           |
| `use` API        | 不支持                                                | 新增，可在条件中读取 Promise/Context |
| `useOptimistic`  | 不支持                                                | 新增，乐观更新                       |
| `useActionState` | 不支持                                                | 新增，管理表单 Action 状态           |
| `useFormStatus`  | 不支持                                                | 新增，获取表单状态                   |

---

## Hooks 使用检查清单

| 场景                          | 推荐 Hook              |
| ----------------------------- | ---------------------- |
| 组件需要保存状态              | `useState`             |
| 需要执行副作用（请求、订阅）  | `useEffect`            |
| 需要获取 DOM 元素或保存可变值 | `useRef`               |
| 需要读取 Context              | `useContext`           |
| 复杂状态逻辑                  | `useReducer`           |
| 昂贵计算结果缓存              | `useMemo`              |
| 回调函数引用稳定              | `useCallback`          |
| 读取 DOM 布局后同步更新       | `useLayoutEffect`      |
| 暴露 ref 方法给父组件         | `useImperativeHandle`  |
| 生成唯一 ID（无障碍）         | `useId`                |
| 自定义 Hook 调试标签          | `useDebugValue`        |
| 非阻塞状态更新（大量渲染）    | `useTransition`        |
| 延迟派生值                    | `useDeferredValue`     |
| 订阅外部 Store                | `useSyncExternalStore` |
