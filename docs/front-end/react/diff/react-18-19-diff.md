# React 18 vs React 19 差异详解

> React 19 于 2024 年 12 月正式发布，带来了大量新特性和改进。本文档系统梳理两个版本的核心差异。

---

## 一、新增 Hooks

### 1. `use()` API

React 19 新增的 `use()` 不是真正的 Hook（不受 Hook 规则约束），可以在条件语句和循环中使用。

```tsx
// React 19: use() 读取 Promise
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

function UserProfile({ userId }: { userId: string }) {
  if (!userId) {
    return <div>请选择用户</div>
  }
  // use() 可以在条件语句中调用！
  const user = use(fetchUser(userId))
  return <div>{user.name}</div>
}

// React 19: use() 读取 Context（替代 useContext）
const user = use(UserContext)
```

### 2. `useOptimistic`

乐观更新：在执行异步操作之前就更新 UI，如果操作失败则回滚。

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  const addTodo = async (text: string) => {
    const tempTodo = { id: Date.now(), text, pending: true }
    addOptimistic(tempTodo) // 立即显示
    const realTodo = await api.saveTodo(text) // 异步保存
    setTodos(prev => [...prev, realTodo]) // 成功后更新
  }
}
```

### 3. `useFormStatus`

获取父级 `<form>` 的提交状态。

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}
```

### 4. `useActionState`

管理表单 Action 的状态（状态、错误、pending 等）。

```tsx
import { useActionState } from 'react'

async function updateName(prevState: unknown, formData: FormData) {
  const name = formData.get('name') as string
  // 验证和处理...
  return { success: true, name }
}

function NameForm() {
  const [state, formAction, isPending] = useActionState(updateName, null)

  return (
    <form action={formAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>保存</button>
      {state?.success && <p>已保存: {state.name}</p>}
    </form>
  )
}
```

### 5. `useDeferredValue` 新增 `initialValue`

```tsx
// React 19: 支持 initialValue
const deferredValue = useDeferredValue(value, initialValue)
```

---

## 二、新特性

### 1. React Server Components（正式支持）

React 19 正式支持 Server Components，允许组件在服务端渲染。

```tsx
// Server Component（默认）
// 在服务端运行，可直接访问数据库
async function UserList() {
  const users = await db.user.findMany()
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}

// Client Component（需显式声明）
'use client'
function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>{liked ? '已赞' : '点赞'}</button>
}
```

### 2. Actions（表单 Actions）

```tsx
// React 19: Server Action
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  await db.post.create({ data: { title } })
}

function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">创建</button>
    </form>
  )
}
```

### 3. Document Metadata（内置 SEO 支持）

```tsx
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={`https://example.com/blog/${post.slug}`} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### 4. ref 作为普通 prop

```tsx
// React 18: 必须使用 forwardRef
const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19: ref 作为普通 prop，不再需要 forwardRef！
function MyInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & Props) {
  return <input ref={ref} {...props} />
}
```

### 5. Context 直接作为 Provider

```tsx
// React 18
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// React 19：更简洁
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

### 6. React Compiler（自动性能优化）

React 19 引入了 React Compiler，自动优化 re-render 行为。

- **不再需要手动添加 `memo`、`useMemo`、`useCallback`**
- 编译器自动分析并优化组件
- 向后兼容，无需修改现有代码

---

## 三、破坏性变化

### 1. `React.FC` 不再隐式包含 `children`

```tsx
// React 18: FC 自动包含 children
const MyComp: React.FC<{}> = ({ children }) => { /* ... */ }

// React 19: 需显式声明
interface Props {
  children?: React.ReactNode // 必须显式声明
}
```

### 2. 废弃 API 移除

| 废弃 API | 说明 |
|----------|------|
| `propTypes` | 建议用 TypeScript |
| `defaultProps` on function components | 建议用参数默认值 |
| `findDOMNode` | 建议用 ref |

### 3. `useEffect` 清理函数异步执行

```tsx
// React 18: 清理函数同步执行
// React 19: 清理函数异步执行（减少卡顿）
```

---

## 四、差异速查表

| 特性 | React 18 | React 19 |
|------|:--------:|:--------:|
| `use()` | 不支持 | 支持 |
| `useOptimistic` | 不支持 | 支持 |
| `useFormStatus` | 不支持 | 支持 |
| `useActionState` | 不支持 | 支持 |
| Server Components | 实验性 | 正式支持 |
| Actions | 不支持 | 支持 |
| Document Metadata | 需要第三方库 | 内置支持 |
| `forwardRef` | 必须使用 | 不再需要 |
| Context Provider | 需 `.Provider` | 可直接用 Context |
| React Compiler | 不支持 | 内置 |
| `React.FC` children | 隐式包含 | 需显式声明 |
| `useEffect` 清理 | 同步 | 异步 |
| 新 `ref` 清理函数 | 不支持 | 支持 |

---

## 五、升级建议

1. **先升级到 React 18 最新版**（18.3.x），确保没有废弃 API 警告
2. 移除 `forwardRef` 的使用，将 ref 改为普通 prop
3. 为 `React.FC` 显式添加 `children` 类型声明
4. 替换 `<Context.Provider>` 为 `<Context>`
5. 逐步尝试 Server Components 和 Actions 等新特性
6. React Compiler 可选启用，不影响已有代码

> 建议新项目直接使用 React 19，旧项目在做好兼容性测试后逐步升级。