# 性能优化

> 前端 Agent 应用面临长对话列表、大量工具调用等性能挑战，以下优化策略不可或缺。

---

## 一、虚拟滚动（长对话列表）

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualMessageList({ messages }: { messages: AgentMessage[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5
  })

  return (
    <div ref={parentRef} className="message-list" style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = messages[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <MessageBubble message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

---

## 二、工具调用结果缓存

```typescript
class ToolCallCache {
  private cache = new Map<string, { result: any; timestamp: number }>()
  private ttl: number

  constructor(ttlMs: number = 5 * 60 * 1000) {
    this.ttl = ttlMs
  }

  private getKey(toolName: string, args: Record<string, any>): string {
    return `${toolName}:${JSON.stringify(args)}`
  }

  get(toolName: string, args: Record<string, any>): any | null {
    const key = this.getKey(toolName, args)
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.result
    }
    this.cache.delete(key)
    return null
  }

  set(toolName: string, args: Record<string, any>, result: any): void {
    const key = this.getKey(toolName, args)
    this.cache.set(key, { result, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}
```

---

## 三、React 渲染优化

```tsx
// 使用 React.memo 避免不必要的重渲染
const MessageBubble = React.memo(function MessageBubble({
  message,
  isStreaming
}: {
  message: AgentMessage
  isStreaming?: boolean
}) {
  return (
    <div className={`message ${message.role}`}>
      <div className="content">
        {isStreaming ? (
          <StreamingMarkdown text={message.content} />
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  )
})

const ToolCallCard = React.memo(function ToolCallCard({
  tool
}: {
  tool: ToolInvocation
}) {
  return (
    <div className={`tool-call state-${tool.state}`}>
      <span>{tool.toolName}</span>
      <span>{tool.state}</span>
    </div>
  )
})
```

---

## 四、性能检查清单

| 优化点 | 策略 | 效果 |
|--------|------|------|
| 长列表渲染 | 虚拟滚动（@tanstack/react-virtual） | DOM 节点数从 1000+ 降到 ~20 |
| 工具调用 | 基于参数的内容寻址缓存 | 相同参数不重复请求 |
| 消息组件 | React.memo + useMemo | 避免无关消息的重渲染 |
| 流式更新 | requestAnimationFrame 节流 | 减少 render 次数 |
| 历史数据 | IndexedDB 分页加载 | 避免一次性加载全部历史 |
| Markdown | 懒加载语法高亮库 | 减少初始 bundle 大小 |
| 图片/文件 | 懒加载 + 缩略图 | 减少内存占用 |