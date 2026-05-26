# 错误边界

## 什么是错误边界？

错误边界是 React 组件，用于捕获子组件树中发生的 JavaScript 错误，并显示降级 UI。

## 实现错误边界

错误边界**只能**用类组件实现（目前没有 Hook 版本）。

```tsx
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染显示降级 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    console.error('错误边界捕获:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>出错了</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleRetry}>重试</button>
        </div>
      )
    }

    return this.props.children
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary fallback={<div>页面加载失败，请刷新重试</div>}>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

## 错误边界使用建议

```tsx
function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <ErrorBoundary fallback={<div>侧边栏加载失败</div>}>
          <Sidebar />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>内容加载失败</div>}>
          <MainContent />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  )
}
```

## 错误边界无法捕获的场景

- 事件处理器中的错误（用 try/catch）
- 异步代码中的错误（setTimeout、Promise）
- 服务端渲染中的错误
- 错误边界**自身**抛出的错误

```tsx
// 事件处理器错误需要自行处理
function MyComponent() {
  const handleClick = () => {
    try {
      // 可能出错的代码
      throw new Error('点击错误')
    } catch (error) {
      console.error('捕获点击错误:', error)
    }
  }

  return <button onClick={handleClick}>点击</button>
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 错误边界 | 只能使用类组件 | 只能使用类组件（无变化） |
| `componentDidCatch` | 标准用法 | 无变化 |
| 错误恢复 | 需手动实现 | 无变化 |

> React 19 中错误边界的实现方式没有变化，仍然是类组件。不过 React 团队正在探索未来的函数组件错误边界方案。