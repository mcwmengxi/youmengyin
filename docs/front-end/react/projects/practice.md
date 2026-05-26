# 项目实战 - Todo 应用

> 通过构建一个完整的 Todo 应用，巩固 React 基础知识：组件、Props、State、事件、条件渲染、列表渲染、表单、Hooks。

## 项目功能

- 添加待办事项
- 标记完成/未完成
- 删除待办事项
- 过滤显示（全部/已完成/未完成）
- 本地存储持久化
- 统计完成数量

## 完整代码

```tsx
// App.tsx
import { useState, useEffect, useCallback, useMemo } from 'react'

// ==================== 类型定义 ====================
interface Todo {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

// ==================== 自定义 Hook ====================
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }])
  }, [])

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  const removeTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  return { todos, addTodo, toggleTodo, removeTodo, clearCompleted }
}

// ==================== 子组件 ====================
function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed) {
      onAdd(trimmed)
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="添加待办事项..."
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">添加</button>
    </form>
  )
}

function TodoItem({ todo, onToggle, onRemove }: {
  todo: Todo
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}) {
  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      padding: 8,
      borderBottom: '1px solid #eee',
      textDecoration: todo.completed ? 'line-through' : 'none',
      color: todo.completed ? '#999' : '#333',
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ flex: 1, marginLeft: 8 }}>{todo.text}</span>
      <button onClick={() => onRemove(todo.id)}>删除</button>
    </li>
  )
}

function FilterBar({ filter, onFilterChange, onClearCompleted, leftCount }: {
  filter: Filter
  onFilterChange: (f: Filter) => void
  onClearCompleted: () => void
  leftCount: number
}) {
  const filters: Filter[] = ['all', 'active', 'completed']
  const labels: Record<Filter, string> = { all: '全部', active: '未完成', completed: '已完成' }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
      <span>{leftCount} 项待完成</span>
      <div style={{ display: 'flex', gap: 8 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            style={{ fontWeight: filter === f ? 'bold' : 'normal' }}
          >
            {labels[f]}
          </button>
        ))}
      </div>
      <button onClick={onClearCompleted}>清除已完成</button>
    </div>
  )
}

// ==================== 主组件 ====================
function App() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos()
  const [filter, setFilter] = useState<Filter>('all')

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed)
      case 'completed':
        return todos.filter(t => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const leftCount = useMemo(() => todos.filter(t => !t.completed).length, [todos])

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 16 }}>
      <h1>Todo 应用</h1>
      <TodoInput onAdd={addTodo} />

      {todos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>暂无待办事项</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
            {filteredTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onRemove={removeTodo} />
            ))}
          </ul>
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            leftCount={leftCount}
          />
        </>
      )}
    </div>
  )
}

export default App
```

## 涉及知识点

| 知识点 | 对应代码 |
|--------|----------|
| 组件拆分 | TodoInput、TodoItem、FilterBar |
| useState | text、todos、filter |
| useEffect | localStorage 持久化 |
| useCallback | addTodo、toggleTodo、removeTodo |
| useMemo | filteredTodos、leftCount |
| 受控组件 | input 的 value/onChange |
| 条件渲染 | `{todos.length === 0 ? ...}` |
| 列表渲染 | `filteredTodos.map(...)` |
| 自定义 Hook | useTodos |

## 扩展练习

1. 添加编辑功能（双击待办事项进行编辑）
2. 添加拖拽排序
3. 添加分类标签
4. 接入后端 API（使用 useState + useEffect 请求数据）

## React 18 vs 19 差异

本项目代码在 React 18 和 19 中均可正常运行，无差异。