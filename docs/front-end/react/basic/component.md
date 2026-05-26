# 组件基础

## 什么是组件？

组件是 React 应用的基本构建单元，它将 UI 拆分为独立的、可复用的代码片段。每个组件负责自己的逻辑和渲染。

## 组件的分类

### 1. 函数组件（推荐）

函数组件是最简单、最常用的组件形式，就是一个返回 JSX 的普通 JavaScript/TypeScript 函数。

```tsx
// 函数组件 - 无 props
function Welcome() {
  return <h1>Hello, React!</h1>
}

// 箭头函数写法
const Welcome = () => {
  return <h1>Hello, React!</h1>
}

// 接收 props
interface WelcomeProps {
  name: string
}
const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>
}
```

### 2. 类组件（了解即可）

React 16.8 之前，类组件是唯一能使用 state 和生命周期的组件形式。现在推荐使用函数组件 + Hooks。

```tsx
import React from 'react'

interface WelcomeProps {
  name: string
}
interface WelcomeState {
  count: number
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  state: WelcomeState = {
    count: 0
  }

  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}!</h1>
        <p>Count: {this.state.count}</p>
      </div>
    )
  }
}
```

## 组件使用

```tsx
// 父组件中使用子组件
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  )
}
```

## 组件命名规范

- 组件名必须**首字母大写**（React 以此区分组件和原生 HTML 标签）
- 文件名通常与组件名保持一致，使用 PascalCase 命名

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 组件类型 | 函数组件、类组件 | 函数组件、类组件（类组件已不推荐） |
| `React.FC` | 隐式包含 `children` | 不再隐式包含 `children`，需显式声明 |
| 组件导出 | 默认导出、命名导出 | 无变化 |

```tsx
// React 19 中需要显式声明 children
interface MyComponentProps {
  title: string
  children?: React.ReactNode  // React 18 中 FC 自动包含，19 中需显式声明
}
```

## FAQ

**Q: 函数组件和类组件如何选择？**
A: 推荐使用函数组件 + Hooks，这是 React 官方推荐的方式，代码更简洁，逻辑复用更方便。