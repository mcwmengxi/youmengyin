# 并发特性

## React 并发模式

React 18 引入了并发特性，让 React 可以同时处理多个状态更新，并能够中断渲染。

## useTransition

标记低优先级更新，保持 UI 响应。

```tsx
import { useState, useTransition } from 'react'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 高优先级：立即更新输入框
    setInput(e.target.value)

    // 低优先级：延迟更新搜索结果
    startTransition(() => {
      setQuery(e.target.value)
    })
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <span>搜索中...</span>}
      <SearchResults query={query} />
    </div>
  )
}
```

## useDeferredValue

延迟更新某个值，保持 UI 流畅。

```tsx
import { useState, useDeferredValue, useMemo } from 'react'

function HeavyList() {
  const [search, setSearch] = useState('')
  // 延迟更新 search，优先处理用户输入
  const deferredSearch = useDeferredValue(search)

  // 用延迟后的值执行重计算
  const filteredList = useMemo(() => {
    console.log('过滤中...')
    return hugeList.filter(item => item.includes(deferredSearch))
  }, [deferredSearch])

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <ul>
        {filteredList.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
```

### useTransition vs useDeferredValue

| 特性 | useTransition | useDeferredValue |
|------|---------------|------------------|
| 控制范围 | 可以控制哪个 setState 是低优先级 | 延迟值本身 |
| 返回 | `[isPending, startTransition]` | 延迟后的值 |
| 使用场景 | 你能控制 setState 调用 | 你无法控制 setState（如 props 变化） |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `useTransition` | 支持 | 支持，异步函数支持增强 |
| `useDeferredValue` | 支持 | 新增 `initialValue` 参数 |
| 并发渲染 | 并发特性可用 | 并发渲染更稳定，默认启用 |
| `useOptimistic` | 不支持 | 新增，支持乐观更新 |

```tsx
// React 19: useDeferredValue 新增 initialValue
// 在第一次渲染时就可以使用初始值
const deferredValue = useDeferredValue(value, initialValue)

// React 19: useOptimistic 乐观更新
function Messages({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  )

  const sendMessage = async (text: string) => {
    const newMessage = { id: Date.now(), text, pending: true }
    addOptimisticMessage(newMessage) // 立即显示
    await api.sendMessage(conversationId, text) // 后台发送
    // 成功后刷新实际消息列表
  }

  return (
    <div>
      {optimisticMessages.map(msg => (
        <div key={msg.id} style={{ opacity: msg.pending ? 0.7 : 1 }}>
          {msg.text}
        </div>
      ))}
    </div>
  )
}
```

> React 19 新增的 `useOptimistic` 是一个重要的并发模式工具，让你在异步操作完成之前就能乐观地更新 UI，比如在聊天应用中立即显示发送的消息。