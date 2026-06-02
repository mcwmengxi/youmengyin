# 前端状态管理

> Agent 前端的状态管理比传统 Web 应用复杂得多，涉及多维度状态、流式更新和异步事件处理。

---

## 一、Agent 状态模型

```typescript
interface AgentSession {
  id: string
  status: AgentStatus

  messages: AgentMessage[]
  thinkingSteps: ThinkingStep[]

  plan?: {
    goal: string
    steps: PlanStep[]
    currentStepIndex: number
  }

  toolCalls: ToolCallRecord[]
  pendingConfirmation?: UserConfirmation
  error?: AgentError
}

interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolInvocations?: ToolInvocation[]
  createdAt: number
}

interface PlanStep {
  id: string
  description: string
  status: 'pending' | 'running' | 'done' | 'error'
  result?: string
}
```

### 状态关系图

```
AgentSession
  ├── status: AgentStatus (全局状态)
  ├── messages: AgentMessage[] (对话消息)
  ├── thinkingSteps: ThinkingStep[] (思考链)
  ├── plan: { goal, steps, currentStepIndex } (执行计划)
  ├── toolCalls: ToolCallRecord[] (工具调用)
  ├── pendingConfirmation?: UserConfirmation (待确认)
  └── error?: AgentError (错误)
```

---

## 二、Zustand 状态管理

```typescript
import { create } from 'zustand'

interface AgentStore {
  session: AgentSession | null
  streamingText: string

  createSession: (goal: string) => void
  appendMessage: (message: AgentMessage) => void
  appendStreamingText: (delta: string) => void
  updateThinkingStep: (stepId: string, update: Partial<ThinkingStep>) => void
  addToolCall: (toolCall: ToolCallRecord) => void
  updateToolResult: (toolCallId: string, result: any) => void
  setStatus: (status: AgentStatus) => void
  setPendingConfirmation: (confirmation: UserConfirmation | null) => void
  resetStreamingText: () => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  session: null,
  streamingText: '',

  createSession: (goal) =>
    set({
      session: {
        id: crypto.randomUUID(),
        status: 'idle',
        messages: [{
          id: crypto.randomUUID(),
          role: 'user',
          content: goal,
          createdAt: Date.now()
        }],
        thinkingSteps: [],
        toolCalls: []
      },
      streamingText: ''
    }),

  appendMessage: (message) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, messages: [...state.session.messages, message] }
        : null
    })),

  appendStreamingText: (delta) =>
    set((state) => ({ streamingText: state.streamingText + delta })),

  updateThinkingStep: (stepId, update) =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            thinkingSteps: state.session.thinkingSteps.map((s) =>
              s.id === stepId ? { ...s, ...update } : s
            )
          }
        : null
    })),

  addToolCall: (toolCall) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, toolCalls: [...state.session.toolCalls, toolCall] }
        : null
    })),

  updateToolResult: (toolCallId, result) =>
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            toolCalls: state.session.toolCalls.map((tc) =>
              tc.id === toolCallId ? { ...tc, result, status: 'done' } : tc
            )
          }
        : null
    })),

  setStatus: (status) =>
    set((state) => ({
      session: state.session ? { ...state.session, status } : null
    })),

  setPendingConfirmation: (confirmation) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, pendingConfirmation: confirmation ?? undefined }
        : null
    })),

  resetStreamingText: () => set({ streamingText: '' })
}))
```

---

## 三、Agent 流事件处理 Hook

将 SSE 流事件映射到 Zustand 状态管理的核心 Hook：

```typescript
function useAgentStream() {
  const store = useAgentStore()
  const abortRef = useRef<AbortController | null>(null)

  const startStream = useCallback(async (userMessage: string) => {
    const abortController = new AbortController()
    abortRef.current = abortController

    store.createSession(userMessage)
    store.setStatus('thinking')

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }]
        }),
        signal: abortController.signal
      })

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const event: AgentEvent = JSON.parse(line.slice(6))

          switch (event.type) {
            case 'plan':
              store.setStatus('planning')
              event.steps.forEach((desc, i) => {
                store.session?.thinkingSteps.push({
                  id: `plan-${i}`,
                  type: 'plan',
                  content: desc,
                  status: 'pending',
                  timestamp: Date.now()
                })
              })
              break

            case 'thinking':
              store.setStatus('thinking')
              store.appendStreamingText(event.content)
              break

            case 'text_delta':
              if (store.session?.status !== 'executing') {
                store.setStatus('executing')
              }
              fullText += event.content
              store.appendStreamingText(event.content)
              break

            case 'tool_call':
              store.addToolCall({
                id: event.toolName + '-' + Date.now(),
                toolName: event.toolName,
                args: event.args,
                status: 'running'
              })
              break

            case 'tool_result':
              break

            case 'done':
              store.appendMessage({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: fullText,
                createdAt: Date.now()
              })
              store.setStatus('done')
              store.resetStreamingText()
              break

            case 'error':
              store.setStatus('error')
              break
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        store.setStatus('error')
      }
    }
  }, [store])

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { startStream, abort, store }
}
```

---

## 四、状态管理关键点

| 关注点 | 说明 |
|--------|------|
| **流式文本与最终消息分离** | `streamingText` 是临时缓冲区，`done` 事件后才固化为 `messages` 中的一条消息 |
| **状态驱动 UI** | 所有 UI 变化（状态栏、思考链、确认弹窗）都由 `AgentStatus` 驱动 |
| **可中断** | 通过 `AbortController` 实现请求取消，状态回退到 `idle` |
| **不可变更新** | 使用 Zustand 的 `set` 函数进行不可变更新，确保 React 正确重渲染 |