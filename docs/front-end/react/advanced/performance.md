# 性能优化

## React.memo

避免 props 未变化时的重新渲染。

```tsx
import { memo, useState } from 'react'

interface UserItemProps {
  name: string
  age: number
}

const UserItem = memo(({ name, age }: UserItemProps) => {
  console.log(`渲染: ${name}`)
  return <div>{name} - {age}岁</div>
})

function UserList() {
  const [users] = useState([
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
  ])
  const [count, setCount] = useState(0)

  return (
    <div>
      {users.map(u => (
        <UserItem key={u.id} name={u.name} age={u.age} />
      ))}
      {/* count 变化不会导致 UserItem 重新渲染 */}
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
    </div>
  )
}
```

## useMemo

缓存昂贵的计算结果。

```tsx
function ExpensiveList({ items }: { items: number[] }) {
  const [filter, setFilter] = useState(0)

  // 只在 items 或 filter 变化时重新计算
  const filtered = useMemo(() => {
    console.log('过滤计算中...')
    return items
      .filter(item => item > filter)
      .sort((a, b) => b - a)
  }, [items, filter])

  return (
    <div>
      <input
        type="number"
        value={filter}
        onChange={e => setFilter(Number(e.target.value))}
      />
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
```

## useCallback

缓存函数引用，配合 `memo` 使用。

```tsx
function Parent() {
  const [count, setCount] = useState(0)

  // 没有 useCallback：每次渲染都创建新函数，Child 会重新渲染
  // const handleClick = () => setCount(c => c + 1)

  // 有 useCallback：函数引用不变，Child 不会重新渲染
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return (
    <div>
      <p>{count}</p>
      <ChildButton onClick={handleClick} />
    </div>
  )
}

const ChildButton = memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child 渲染')
  return <button onClick={onClick}>+1</button>
})
```

## 列表虚拟化（Virtual List）

对于长列表，只渲染可见区域的内容。

```tsx
// 使用 react-window 库
import { FixedSizeList as List } from 'react-window'

function VirtualList({ items }: { items: string[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>Row {items[index]}</div>
  )

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

## 代码分割与懒加载

```tsx
import { lazy, Suspense } from 'react'

// 动态导入组件
const LazyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## 避免不必要的渲染

```tsx
// 1. 将状态下沉
function BadExample() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <ExpensiveChild />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  )
}

function GoodExample() {
  return (
    <div>
      <ExpensiveChild />
      <CounterButton /> {/* count 状态隔离在内部 */}
    </div>
  )
}

// 2. 使用 key 重置组件
function App() {
  const [userId, setUserId] = useState(1)
  return <UserProfile key={userId} userId={userId} />
}
```

## React 18 vs 19 新增优化特性

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 自动批处理 | 已支持（所有更新自动批处理） | 继承 |
| Transitions | `useTransition`、`useDeferredValue` | 继承并增强 |
| React Compiler | 不内置 | React Compiler（自动 memo 优化） |
| Server Components | 实验性 | 正式支持（减少客户端 JS） |

> **React 19 最重要的性能变化**：引入了 **React Compiler**（React Forget），可以自动为你优化 re-render，类似自动版的 `memo`、`useMemo`、`useCallback`，不再需要手动添加这些优化。同时 Server Components 成为正式特性，可大幅减少客户端 JS 体积。