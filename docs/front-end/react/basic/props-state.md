# Props 与 State

## Props

Props（Properties）是组件之间传递数据的方式，父组件通过 props 向子组件传递数据。

### 基本使用

```tsx
interface ChildProps {
  name: string
  age: number
  isMarried?: boolean  // 可选属性
}

function Child({ name, age, isMarried = false }: ChildProps) {
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <p>婚否: {isMarried ? '是' : '否'}</p>
    </div>
  )
}

function Parent() {
  return <Child name="张三" age={25} />
}
```

### children 插槽

```tsx
interface CardProps {
  title: string
  children?: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

// 使用
function App() {
  return (
    <Card title="标题">
      <p>这是卡片内容</p>
      <button>操作按钮</button>
    </Card>
  )
}
```

### React 18 vs 19 - children 变化

```tsx
// React 18: React.FC 隐式包含 children
const MyComp: React.FC<{title: string}> = ({ title, children }) => {
  // children 无需声明即可使用
}

// React 19: 必须显式声明 children
interface MyCompProps {
  title: string
  children?: React.ReactNode  // 必须显式声明
}
const MyComp = ({ title, children }: MyCompProps) => {
  // ...
}
```

## State

State 是组件内部的私有数据，用于管理组件自身会变化的值。

### useState 基本使用

```tsx
import { useState } from 'react'

function Counter() {
  // [状态值, 更新函数] = useState(初始值)
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}
```

### State 更新特性

1. **异步更新**：React 会批量处理 state 更新，多条 setState 会在同一渲染周期内合并
2. **不可变更新**：不要直接修改 state，应返回新的值

```tsx
// 对象类型的 state
const [user, setUser] = useState({ name: 'Alice', age: 25 })

// 正确：创建新对象
setUser({ ...user, age: 26 })

// 数组类型的 state
const [list, setList] = useState([1, 2, 3])

// 正确：创建新数组
setList([...list, 4])
setList(list.filter(item => item !== 2))
```

## Props vs State

| 对比项 | Props | State |
|--------|-------|-------|
| 来源 | 父组件传入 | 组件内部管理 |
| 可变性 | 只读，不可修改 | 可通过 setState 修改 |
| 作用 | 组件间通信 | 管理组件自身数据 |
| 更新触发 | 父组件重新渲染 | setState 调用 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 自动批处理 | 仅在事件处理中批处理 | 所有更新都自动批处理（已包含在 18） |
| `children` 声明 | `React.FC` 隐式包含 | 必须显式声明 |