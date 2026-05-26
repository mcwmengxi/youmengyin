# Suspense

## 什么是 Suspense？

Suspense 允许你在组件等待某些内容（如数据加载、代码分割）时显示一个 fallback UI。

## 基本用法：代码分割

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>组件加载中...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## Suspense + 数据请求（React 18 实验性，React 19 正式支持）

```tsx
// React 19: use() + Suspense 实现数据请求
import { use, Suspense } from 'react'

async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

function UserProfile({ userId, userPromise }: { userId: string; userPromise: Promise<User> }) {
  // use() 会"暂停"组件，直到 Promise 完成
  const user = use(userPromise)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

function App() {
  const [userId, setUserId] = useState('1')
  const userPromise = fetchUser(userId)

  return (
    <div>
      <Suspense fallback={<div>用户数据加载中...</div>}>
        <UserProfile userId={userId} userPromise={userPromise} />
      </Suspense>
    </div>
  )
}
```

## Suspense 嵌套

```tsx
function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Layout>
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Suspense fallback={<ContentSkeleton />}>
          <MainContent />
        </Suspense>
      </Layout>
    </Suspense>
  )
}
```

## Transitions + Suspense

```tsx
import { useTransition } from 'react'

function SearchResults({ query }: { query: string }) {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState(query)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value) // 立即更新
    startTransition(() => {
      setQuery(e.target.value) // 低优先级更新
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <span>搜索中...</span>}
      <Suspense fallback={<div>加载结果...</div>}>
        <ResultsList query={query} />
      </Suspense>
    </div>
  )
}
```

## React 18 vs 19 差异

| 特性           | React 18      | React 19                           |
| ------------ | ------------- | ---------------------------------- |
| Suspense     | 基本支持，数据请求为实验性 | 正式支持所有异步操作                         |
| `use()`      | 不支持           | 新增，可在 Suspense 中读取 Promise/Context |
| Suspense 嵌套  | 支持            | 支持，且性能更好                           |
| 服务端 Suspense | 流式 SSR        | 增强的流式 SSR                          |

> React 19 中 Suspense 成为一等公民，配合 `use()` API 可以在组件内部"暂停"渲染并等待异步数据，大大简化了数据请求的处理逻辑。

