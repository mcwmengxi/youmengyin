# Context 上下文

## 什么是 Context？

Context 提供了一种在组件树中共享数据的方式，无需通过 props 层层传递。

## 创建和使用 Context

```tsx
import { createContext, useContext, useState } from 'react'

// 1. 创建 Context
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

// 2. Provider 组件
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. 消费 Context
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
      }}
    >
      当前主题: {theme}
    </button>
  )
}

// 4. 使用
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  )
}
```

## 封装自定义 Hook

将 `useContext` 封装起来，避免直接用 Context。

```tsx
// 使用自定义 Hook 消费 Context（推荐）
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }
  return context
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme() // 简洁且有运行时检查
  return <button onClick={toggleTheme}>主题: {theme}</button>
}
```

## 多个 Context 组合

```tsx
const AuthContext = createContext<AuthContextType | null>(null)
const ThemeContext = createContext<ThemeContextType | null>(null)

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}

function UserProfile() {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <div className={theme}>
      <h1>{user?.name}</h1>
    </div>
  )
}
```

## Context 性能注意事项

```tsx
// 问题：每次 Provider value 变化，所有消费者都会重渲染
function ProblemProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  // value 对象每次都是新的引用，导致所有消费者重渲染！
  return (
    <MyContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </MyContext.Provider>
  )
}

// 解决：拆分 Context
function SolutionProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ThemeProvider>
  )
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `useContext` | 标准用法 | `use(Context)` 也可替代 |
| `createContext` | 无变化 | 无变化 |
| Provider | 必须用 `<Context.Provider>` | 可直接用 `<Context>` 作为 Provider |

```tsx
// React 19: Context 可直接作为 Provider
const ThemeContext = createContext('light')

function App() {
  return (
    <ThemeContext value="dark">  {/* 不需要 .Provider */}
      <Child />
    </ThemeContext>
  )
}
```

> React 19 中 `<ThemeContext>` 可直接替代 `<ThemeContext.Provider>`，写法更简洁。