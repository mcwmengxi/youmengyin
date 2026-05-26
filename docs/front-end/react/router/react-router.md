# React Router v6

## 什么是 React Router？

React Router 是 React 应用中最流行的路由库，用于实现页面导航和 URL 管理。

### 安装

```sh
npm install react-router-dom
```

### 基本路由配置

```tsx
// main.tsx
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// App.tsx
import { Routes, Route, Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/users">用户</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />}>
          <Route path=":id" element={<UserDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
```

### 嵌套路由

```tsx
function Users() {
  return (
    <div>
      <h2>用户列表</h2>
      <ul>
        <li><Link to="/users/1">用户1</Link></li>
        <li><Link to="/users/2">用户2</Link></li>
      </ul>
      {/* 子路由渲染位置 */}
      <Outlet />
    </div>
  )
}
```

### 路由参数

```tsx
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

function UserDetail() {
  // /users/:id → { id: '1' }
  const { id } = useParams<{ id: string }>()

  // ?page=1&size=10
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get('page') || '1'

  // 获取完整 location 对象
  const location = useLocation()

  return (
    <div>
      <p>用户ID: {id}</p>
      <p>当前页: {page}</p>
      <p>当前路径: {location.pathname}</p>
    </div>
  )
}
```

### 编程式导航

```tsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    const success = await login()
    if (success) {
      navigate('/dashboard')        // 跳转
      navigate(-1)                  // 返回上一页
      navigate('/users', { replace: true }) // 替换历史记录
      navigate('/users/1', { state: { from: 'login' } }) // 传递状态
    }
  }
}

// 接收 state
function UserDetail() {
  const location = useLocation()
  const from = location.state?.from
}
```

### 路由守卫

```tsx
// ProtectedRoute.tsx
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

// App.tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>
```

### 懒加载路由

```tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <Suspense fallback={<div>页面加载中...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  )
}
```

### 常用 Hooks 汇总

| Hook | 用途 |
|------|------|
| `useParams` | 获取路由参数 |
| `useSearchParams` | 获取/设置查询参数 |
| `useLocation` | 获取当前路径信息 |
| `useNavigate` | 编程式导航 |
| `useMatch` | 匹配当前路由 |
| `useOutlet` | 获取当前子路由元素 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| React Router v6 | 正常工作 | 正常工作 |
| React Router v7 | 支持 | 更深度集成了 React 19 新特性 |

> React Router 在 React 18/19 中均能正常工作。