# 样式处理

## 内联样式

```tsx
function InlineStyle() {
  const style: React.CSSProperties = {
    color: 'red',
    fontSize: '20px',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '4px',
  }

  return <div style={style}>内联样式示例</div>
}

// 动态样式
function DynamicStyle({ isActive }: { isActive: boolean }) {
  return (
    <div style={{
      color: isActive ? 'green' : 'gray',
      fontWeight: isActive ? 'bold' : 'normal',
    }}>
      {isActive ? '激活' : '未激活'}
    </div>
  )
}
```

## CSS/SCSS Module

CSS Module 提供局部作用域的样式，避免样式冲突。

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: #1890ff;
  color: white;
}

.danger {
  background-color: #ff4d4f;
  color: white;
}
```

```tsx
// Button.tsx
import styles from './Button.module.css'

interface ButtonProps {
  type?: 'primary' | 'danger'
  children: React.ReactNode
}

function Button({ type = 'primary', children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[type]}`}>
      {children}
    </button>
  )
}
```

## className 工具

### classnames 库

```tsx
import classNames from 'classnames'

function MyComponent({ isActive, isDisabled }: { isActive: boolean; isDisabled: boolean }) {
  return (
    <div className={classNames('base-class', {
      'active': isActive,
      'disabled': isDisabled,
    })}>
      内容
    </div>
  )
}
```

### 模板字符串

```tsx
function MyComponent({ isActive }: { isActive: boolean }) {
  return (
    <div className={`base-class ${isActive ? 'active' : ''}`}>
      内容
    </div>
  )
}
```

## CSS-in-JS（styled-components）

```tsx
import styled from 'styled-components'

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$primary ? '#1890ff' : '#fff'};
  color: ${props => props.$primary ? '#fff' : '#333'};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

function App() {
  return (
    <div>
      <Button $primary>主要按钮</Button>
      <Button>普通按钮</Button>
    </div>
  )
}
```

## Tailwind CSS（Atomic CSS）

```tsx
function Card() {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
      <h2 className="text-xl font-bold mb-2">卡片标题</h2>
      <p className="text-gray-700 text-base">卡片内容</p>
    </div>
  )
}

// 动态 Tailwind 类名
function Badge({ status }: { status: 'success' | 'error' | 'warning' }) {
  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  }

  return <span className={`px-2 py-1 rounded text-white ${colorMap[status]}`}>{status}</span>
}
```

## 样式方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 内联样式 | 简单直接，动态方便 | 不支持伪类、媒体查询 | 简单动态样式 |
| CSS Module | 局部作用域，无冲突 | 需要配置 | 中大型项目 |
| styled-components | CSS-in-JS，动态能力强 | 运行时开销 | 动态主题场景 |
| Tailwind CSS | 开发快，约束性强 | 类名较长 | 快速开发，团队协作 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `style` 属性 | 标准 React.CSSProperties | 无变化 |
| 样式方案 | 无内置方案 | 无内置方案 |
| CSS-in-JS | 运行时注入 | 推荐使用预编译方案，支持 React Server Components |

> React 19 中，由于 Server Components 的引入，运行时 CSS-in-JS 方案（如 styled-components）需要额外配置才能在服务端使用。推荐使用 CSS Module 或 Tailwind CSS 等零运行时方案。