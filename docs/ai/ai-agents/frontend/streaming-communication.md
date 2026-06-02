# 流式通信协议

> 流式通信是前端 Agent 的基石。掌握 SSE 和 WebSocket，让 Agent 的输出实时推送到前端。

---

## 一、SSE（Server-Sent Events）

SSE 是前端 Agent 最常用的通信方式，基于 HTTP，单向从服务器推送数据到客户端。

### 前端 SSE 解析

```typescript
async function connectAgentStream(userMessage: string) {
  const response = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: userMessage }]
    })
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
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        handleAgentEvent(data)
      }
    }
  }
}
```

---

## 二、Agent 事件类型设计

```typescript
type AgentEvent =
  | { type: 'text_delta'; content: string }
  | { type: 'tool_call'; toolName: string; args: object }
  | { type: 'tool_result'; toolName: string; result: string }
  | { type: 'thinking'; content: string }
  | { type: 'plan'; steps: string[] }
  | { type: 'error'; message: string }
  | { type: 'done'; summary: string }
  | { type: 'user_action_required'; action: UserAction }
```

| 事件类型 | 触发时机 | 前端处理 |
|----------|----------|----------|
| `text_delta` | LLM 生成每个 token | 追加到流式文本缓冲区 |
| `tool_call` | Agent 决定调用工具 | 展示工具调用卡片（执行中） |
| `tool_result` | 工具执行完成 | 更新工具卡片状态为完成 |
| `thinking` | Agent 内部推理 | 展示思考过程 |
| `plan` | Agent 制定执行计划 | 渲染步骤列表 |
| `error` | 执行出错 | 展示错误信息 + 重试 |
| `done` | 任务完成 | 将流式文本固化为消息 |
| `user_action_required` | 需要用户确认 | 弹出确认对话框 |

---

## 三、后端 SSE 事件流示例（Express）

```typescript
app.post('/api/agent/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const sendEvent = (event: AgentEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  try {
    const { messages } = req.body

    sendEvent({ type: 'plan', steps: ['搜索资料', '分析数据', '生成报告'] })
    sendEvent({ type: 'thinking', content: '我需要先搜索相关资料...' })
    sendEvent({
      type: 'tool_call',
      toolName: 'web_search',
      args: { query: 'AI Agent 前端开发' }
    })
    sendEvent({
      type: 'tool_result',
      toolName: 'web_search',
      result: '找到 10 篇相关文章...'
    })

    const text = '根据搜索结果，AI Agent 前端开发主要关注以下几个方面...'
    for (const char of text) {
      sendEvent({ type: 'text_delta', content: char })
      await sleep(30)
    }

    sendEvent({ type: 'done', summary: '已生成报告' })
    res.end()
  } catch (err) {
    sendEvent({ type: 'error', message: (err as Error).message })
    res.end()
  }
})
```

---

## 四、WebSocket 双向通信

WebSocket 适合需要双向实时通信的场景，如多 Agent 协作可视化、用户中断 Agent 执行。

```typescript
class AgentWebSocket {
  private ws: WebSocket
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.emit(data.type, data)
    }
  }

  sendMessage(content: string) {
    this.ws.send(JSON.stringify({
      type: 'user_message',
      content,
      timestamp: Date.now()
    }))
  }

  abort() {
    this.ws.send(JSON.stringify({ type: 'abort' }))
  }

  confirm(actionId: string, approved: boolean) {
    this.ws.send(JSON.stringify({
      type: 'user_confirmation',
      actionId,
      approved
    }))
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)
    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  private emit(eventType: string, data: any) {
    this.listeners.get(eventType)?.forEach((cb) => cb(data))
  }

  close() {
    this.ws.close()
  }
}
```

---

## 五、SSE vs WebSocket 对比

| 维度 | SSE | WebSocket |
|------|-----|-----------|
| 通信方向 | 单向（服务器→客户端） | 双向 |
| 协议 | HTTP | WebSocket（升级后） |
| 自动重连 | 内置 | 需手动实现 |
| 浏览器兼容 | 除 IE 外全支持 | 全支持 |
| 适用场景 | Agent 流式输出 | 多 Agent 协作、用户中断 |
| 实现复杂度 | 低 | 中 |

**推荐策略**：对于大多数 Agent 应用，SSE 足够。仅在需要双向实时交互（如用户中断 Agent 执行、多 Agent 协作可视化）时引入 WebSocket。