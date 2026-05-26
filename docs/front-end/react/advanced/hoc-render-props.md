# 高阶组件与 Render Props

> 这两种模式在现代 React 中已逐渐被 Hooks 替代，但了解它们有助于阅读旧代码。

## 高阶组件（HOC）

高阶组件是一个函数，接收一个组件作为参数，返回一个新的增强组件。

### 基本示例

```tsx
import { ComponentType } from 'react'

// HOC：添加 loading 功能的组件
interface WithLoadingProps {
  loading: boolean
}

function withLoading<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithLoading(props: P & WithLoadingProps) {
    const { loading, ...rest } = props

    if (loading) {
      return <div>加载中...</div>
    }

    return <WrappedComponent {...(rest as P)} />
  }
}

// 使用
interface UserListProps {
  users: string[]
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(u => <li key={u}>{u}</li>)}
    </ul>
  )
}

const UserListWithLoading = withLoading(UserList)

function App() {
  return <UserListWithLoading loading={false} users={['Alice', 'Bob']} />
}
```

### 常见 HOC 应用

```tsx
// 1. 权限控制
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
      return <div>请先登录</div>
    }

    return <WrappedComponent {...props} />
  }
}

// 2. 日志记录
function withLogger<P extends object>(WrappedComponent: ComponentType<P>, componentName: string) {
  return function WithLogger(props: P) {
    useEffect(() => {
      console.log(`${componentName} 已挂载`)
      return () => console.log(`${componentName} 已卸载`)
    }, [])

    return <WrappedComponent {...props} />
  }
}
```

## Render Props

Render Props 是通过一个值为函数的 prop 来共享代码的技术。

```tsx
// Render Props 模式：共享鼠标位置逻辑
interface MouseState {
  x: number
  y: number
}

interface MouseProps {
  children: (state: MouseState) => React.ReactNode
}

class Mouse extends React.Component<MouseProps, MouseState> {
  state: MouseState = { x: 0, y: 0 }

  handleMouseMove = (e: React.MouseEvent) => {
    this.setState({ x: e.clientX, y: e.clientY })
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    )
  }
}

// 使用
function App() {
  return (
    <Mouse>
      {({ x, y }) => (
        <h1>鼠标位置: {x}, {y}</h1>
      )}
    </Mouse>
  )
}
```

## 现代替代方案：自定义 Hooks

```tsx
// 上述 Mouse Render Props 用自定义 Hook 重写
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return position
}

// 使用 - 比 HOC 和 Render Props 简洁得多
function App() {
  const { x, y } = useMouse()
  return <h1>鼠标位置: {x}, {y}</h1>
}
```

## 三种模式对比

| 模式 | 优点 | 缺点 | 现状 |
|------|------|------|------|
| HOC | 可组合、不修改原组件 | props 命名冲突、嵌套地狱 | 逐渐被替代 |
| Render Props | 灵活、数据来源清晰 | 回调嵌套、可读性差 | 逐渐被替代 |
| 自定义 Hook | 简洁、无嵌套、类型安全 | 无 | 首选方案 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| HOC | 标准模式 | 仍可用但非推荐 |
| Render Props | 标准模式 | 仍可用但非推荐 |
| 自定义 Hook | 推荐 | 仍然是推荐方案 |

> React 18/19 中 HOC 和 Render Props 没有实质性变化，但 Hooks 始终是官方推荐的代码复用方案。