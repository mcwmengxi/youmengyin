# 条件渲染与列表渲染

## 条件渲染

根据不同的条件渲染不同的 UI。

### 1. if/else 语句（不能在 JSX 中使用）

```tsx
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    return <h1>欢迎回来!</h1>
  }
  return <h1>请先登录</h1>
}
```

### 2. 三元运算符

```tsx
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? <h1>欢迎回来!</h1> : <h1>请先登录</h1>}
    </div>
  )
}
```

### 3. 逻辑与 &&

```tsx
function Notification({ message }: { message?: string }) {
  return (
    <div>
      {message && <div className="alert">{message}</div>}
    </div>
  )
}

// 注意：0 也会被渲染！以下写法有问题
function BadExample({ count }: { count: number }) {
  // count 为 0 时，页面会显示 "0"
  return <div>{count && <p>有{count}条消息</p>}</div>
}

// 正确写法
function GoodExample({ count }: { count: number }) {
  return <div>{count > 0 && <p>有{count}条消息</p>}</div>
}
```

### 4. switch 语句

```tsx
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
  const renderBadge = () => {
    switch (status) {
      case 'success':
        return <span className="badge green">成功</span>
      case 'error':
        return <span className="badge red">失败</span>
      case 'warning':
        return <span className="badge yellow">警告</span>
      default:
        return null
    }
  }

  return <div>{renderBadge()}</div>
}
```

## 列表渲染

使用 `Array.map()` 渲染列表数据。

### 基本用法

```tsx
interface User {
  id: number
  name: string
  age: number
}

function UserList() {
  const users: User[] = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
  ]

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.age}岁
        </li>
      ))}
    </ul>
  )
}
```

### key 的重要性

- key 帮助 React 识别哪些元素改变了、添加了或删除了
- key 必须是**唯一且稳定**的（不要使用 `index` 作为 key，除非列表是静态的）

```tsx
// 错误：使用 index 作为 key
{users.map((user, index) => <li key={index}>{user.name}</li>)}

// 正确：使用唯一 ID
{users.map(user => <li key={user.id}>{user.name}</li>)}
```

### 带过滤和排序的列表

```tsx
function FilteredList() {
  const [users] = useState<User[]>([...])
  const [search, setSearch] = useState('')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = users
    .filter(u => u.name.includes(search))
    .sort((a, b) => sortAsc ? a.age - b.age : b.age - a.age)

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="搜索..."
      />
      <button onClick={() => setSortAsc(!sortAsc)}>
        {sortAsc ? '升序' : '降序'}
      </button>
      <ul>
        {filtered.map(user => (
          <li key={user.id}>{user.name} - {user.age}岁</li>
        ))}
      </ul>
    </div>
  )
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 条件渲染 | 无变化 | 无变化 |
| 列表 key | 必须提供 key | 必须提供 key |
| `React.Fragment` | `<></>` 不支持 key | `<></>` 仍不支持 key，需要用 `<Fragment key={...}>` |

> 条件渲染和列表渲染在 React 18/19 中没有变化。