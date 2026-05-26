# Hooks 基础

## 什么是 Hooks？

Hooks 是 React 16.8 引入的特性，让你在函数组件中使用 state 和其他 React 功能，无需类组件。

## Hooks 规则

1. **只在顶层调用**：不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用**：不要在普通 JavaScript 函数中调用

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
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>年龄+1</button>
    </div>
  )
}
```

### useEffect - 副作用处理

```tsx
import { useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // 副作用：启动定时器
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(timer)
  }, []) // 空数组 = 只在挂载时执行

  return <div>已运行 {seconds} 秒</div>
}
```

### useContext - 消费上下文

```tsx
import { createContext, useContext } from 'react'

// 创建上下文
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

### useReducer - 复杂状态管理

适合管理包含多个子值的复杂 state。

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
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
      <button onClick={() => dispatch({ type: 'setStep', payload: 2 })}>设置步长</button>
    </div>
  )
}
```

### useMemo - 缓存计算结果

```tsx
import { useMemo, useState } from 'react'

function ExpensiveCalculation({ list }: { list: number[] }) {
  const [filter, setFilter] = useState(0)

  // 仅在 list 或 filter 变化时重新计算
  const filteredList = useMemo(() => {
    console.log('重新计算...')
    return list.filter(item => item > filter)
  }, [list, filter])

  return (
    <div>
      <input
        type="number"
        value={filter}
        onChange={e => setFilter(Number(e.target.value))}
      />
      <ul>
        {filteredList.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
```

### useCallback - 缓存函数引用

```tsx
import { useCallback, useState, memo } from 'react'

// 使用 memo 避免不必要的重渲染
const ChildButton = memo(({ onClick, label }: { onClick: () => void; label: string }) => {
  console.log(`渲染 ${label}`)
  return <button onClick={onClick}>{label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // 使用 useCallback 缓存函数引用，避免子组件无意义重渲染
  const increment = useCallback(() => {
    setCount(c => c + 1)
  }, []) // 依赖为空，函数引用始终不变

  return (
    <div>
      <p>Count: {count}, Other: {other}</p>
      <ChildButton onClick={increment} label="Increment" />
      <button onClick={() => setOther(o => o + 1)}>Change Other</button>
    </div>
  )
}
```

## Hooks 汇总

| Hook | 用途 | 使用频率 |
|------|------|----------|
| `useState` | 管理组件状态 | 极高 |
| `useEffect` | 处理副作用（请求、订阅、定时器） | 极高 |
| `useRef` | DOM 引用、保存可变值 | 高 |
| `useContext` | 消费上下文数据 | 高 |
| `useMemo` | 缓存计算结果 | 中 |
| `useCallback` | 缓存函数引用 | 中 |
| `useReducer` | 复杂状态管理 | 低 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 基础 Hooks | useState, useEffect, useContext 等 | 无变化 |
| `use` API | 不支持 | 新增，可在条件中读取 Promise/Context |
| `useOptimistic` | 不支持 | 新增，乐观更新 Hook |
| `useActionState` | 不支持 | 新增，管理表单 Action 状态 |
| `useFormStatus` | 不支持 | 新增，获取表单状态 |

> React 19 新增了 `use`、`useOptimistic`、`useActionState`、`useFormStatus` 等 Hook，基础 Hooks 行为没有变化。