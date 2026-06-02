# 错误处理与重试机制

> 前端 Agent 应用的错误处理比传统应用更复杂：流式中断、网络断开、工具调用失败都需要优雅降级。

---

## 一、错误类型分类

| 错误类型 | 触发场景 | 处理策略 |
|----------|----------|----------|
| 网络错误 | 断网、超时 | 自动重连 + 指数退避重试 |
| 流式中断 | SSE 连接断开 | 重连并从断点恢复 |
| 工具调用失败 | 工具执行异常 | 展示错误信息，允许跳过或重试 |
| LLM 返回异常 | 格式错误、超长 | 降级为纯文本展示 |
| 用户主动取消 | AbortController | 清理状态，保留已生成内容 |
| 服务端错误 | 5xx、Rate Limit | 指数退避重试 + 友好提示 |

---

## 二、指数退避重试

```typescript
class RetryManager {
  private maxRetries: number
  private baseDelay: number
  private maxDelay: number

  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 30000) {
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
    this.maxDelay = maxDelay
  }

  async execute<T>(
    fn: () => Promise<T>,
    shouldRetry?: (error: Error) => boolean
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn()
      } catch (err: any) {
        lastError = err

        if (attempt === this.maxRetries) break
        if (shouldRetry && !shouldRetry(err)) break

        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          this.maxDelay
        )

        console.log(`重试 ${attempt + 1}/${this.maxRetries}，等待 ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}

// 使用示例
const retryManager = new RetryManager(3, 1000)

async function fetchWithRetry(url: string, options: RequestInit) {
  return retryManager.execute(
    () => fetch(url, options).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    }),
    (err) => {
      // 只重试网络错误和 5xx
      return err.message.includes('fetch') || err.message.startsWith('HTTP 5')
    }
  )
}
```

---

## 三、SSE 流式重连

```typescript
class SSEConnection {
  private url: string
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map()
  private retryManager: RetryManager
  private lastEventId: string | null = null
  private abortController: AbortController | null = null
  private isManuallyClosed = false

  constructor(url: string) {
    this.url = url
    this.retryManager = new RetryManager(5, 2000, 60000)
  }

  async connect(body: object) {
    this.isManuallyClosed = false

    await this.retryManager.execute(async () => {
      this.abortController = new AbortController()

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (this.lastEventId) {
        headers['Last-Event-ID'] = this.lastEventId
      }

      const response = await fetch(this.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: this.abortController.signal
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('id: ')) {
            this.lastEventId = line.slice(4)
          }
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            this.emit(data.type, data)
          }
        }
      }
    })
  }

  private emit(eventType: string, data: any) {
    this.eventHandlers.get(eventType)?.forEach((cb) => cb(data))
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set())
    }
    this.eventHandlers.get(eventType)!.add(callback)
    return () => this.eventHandlers.get(eventType)?.delete(callback)
  }

  close() {
    this.isManuallyClosed = true
    this.abortController?.abort()
  }
}
```

---

## 四、React 错误边界

```tsx
import { Component, ReactNode } from 'react'

interface AgentErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class AgentErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  AgentErrorBoundaryState
> {
  state: AgentErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Agent 组件错误:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="agent-error-boundary">
          <h3>Agent 出了点问题</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleRetry}>重试</button>
        </div>
      )
    }
    return this.props.children
  }
}

// 使用
function App() {
  return (
    <AgentErrorBoundary>
      <AgentChat />
    </AgentErrorBoundary>
  )
}
```

---

## 五、全局错误处理 Hook

```typescript
function useAgentErrorHandler() {
  const [error, setError] = useState<AgentError | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const store = useAgentStore()

  const handleError = useCallback((err: Error, context: string) => {
    const agentError: AgentError = {
      message: err.message,
      context,
      timestamp: Date.now(),
      retryable: isRetryableError(err)
    }

    setError(agentError)
    store.setStatus('error')

    if (agentError.retryable && retryCount < 3) {
      setRetryCount((c) => c + 1)
    }
  }, [retryCount, store])

  const clearError = useCallback(() => {
    setError(null)
    setRetryCount(0)
    store.setStatus('idle')
  }, [store])

  return { error, retryCount, handleError, clearError }
}

function isRetryableError(err: Error): boolean {
  if (err.name === 'AbortError') return false
  if (err.message.includes('422')) return false
  if (err.message.includes('401')) return false
  return true
}
```

---

## 六、降级策略

```typescript
// 当 Agent 流式输出失败时，降级为非流式展示
async function fetchAgentResponse(userMessage: string, preferStream = true) {
  if (preferStream) {
    try {
      return await streamAgentResponse(userMessage)
    } catch (err) {
      console.warn('流式请求失败，降级为非流式:', err)
    }
  }

  const response = await fetch('/api/agent/chat/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }] })
  })
  return response.json()
}
```

---

## 七、错误处理检查清单

| 场景 | 策略 | 说明 |
|------|------|------|
| 网络断开 | 自动重连 + 指数退避 | 最多重试 5 次，延迟递增 |
| SSE 中断 | Last-Event-ID 恢复 | 从断点继续接收 |
| 工具调用失败 | 展示错误 + 跳过/重试 | 不要让一个工具失败阻塞整个 Agent |
| LLM 超时 | 降级为非流式 | 或使用更快的模型 |
| 用户取消 | 保留已生成内容 | 不要清空已显示的消息 |
| Rate Limit | 等待后重试 | 使用 Retry-After 头 |
| 组件崩溃 | 错误边界 | 隔离错误，不影响其他部分 |