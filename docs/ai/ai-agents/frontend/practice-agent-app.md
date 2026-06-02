# 构建前端 Agent 应用

> 通过完整项目掌握前端 Agent 开发全流程，从目录结构到核心组件实现。

---

## 一、完整目录结构

```
frontend-agent-app/
├── src/
│   ├── agent/
│   │   ├── AgentLoop.ts           # Agent 主循环
│   │   ├── tools.ts               # 工具注册
│   │   ├── streamHandler.ts       # 流事件处理
│   │   └── types.ts               # 类型定义
│   ├── store/
│   │   └── agentStore.ts          # Zustand 状态
│   ├── hooks/
│   │   ├── useAgentStream.ts      # Agent 流 Hook
│   │   ├── useAgentHistory.ts     # 历史管理 Hook
│   │   └── useToolCallUI.ts       # 工具调用 UI Hook
│   ├── components/
│   │   ├── AgentChat.tsx          # 主对话组件
│   │   ├── MessageBubble.tsx      # 消息气泡
│   │   ├── ThinkingChain.tsx      # 思考链
│   │   ├── ToolCallCard.tsx       # 工具调用卡片
│   │   ├── ConfirmDialog.tsx      # 确认弹窗
│   │   ├── AgentStatusBar.tsx     # 状态栏
│   │   └── HistorySidebar.tsx     # 历史侧边栏
│   └── App.tsx
├── api/
│   └── agent/
│       └── chat/
│           └── route.ts           # 后端 Agent API
└── package.json
```

---

## 二、核心 AgentChat 组件

```tsx
function AgentChat() {
  const { startStream, abort, store } = useAgentStream()
  const { sessions, loadSession, deleteSession } = useAgentHistory()
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const session = store.session
  const streamingText = store.streamingText

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || session?.status === 'executing') return
    await startStream(input)
    setInput('')
  }

  return (
    <div className="agent-app">
      {showHistory && (
        <HistorySidebar
          sessions={sessions}
          onSelect={(id) => { loadSession(id); setShowHistory(false) }}
          onDelete={deleteSession}
          onClose={() => setShowHistory(false)}
        />
      )}

      <div className="agent-main">
        <header className="agent-header">
          <button onClick={() => setShowHistory(true)}>📋 历史</button>
          <h2>AI Agent</h2>
          <button onClick={() => startStream('')}>➕ 新对话</button>
        </header>

        <AgentStatusBar
          status={session?.status || 'idle'}
          step={session?.plan?.currentStepIndex}
          totalSteps={session?.plan?.steps.length}
        />

        {session?.thinkingSteps && session.thinkingSteps.length > 0 && (
          <AgentThinkingChain steps={session.thinkingSteps} />
        )}

        <div className="messages-container">
          {session?.messages.map((message) => (
            <MessageBubble key={message.id} message={message}>
              {message.toolInvocations?.map((tool) => (
                <ToolCallCard key={tool.toolCallId} tool={tool} />
              ))}
            </MessageBubble>
          ))}

          {streamingText && (
            <MessageBubble
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingText,
                createdAt: Date.now()
              }}
              isStreaming
            />
          )}
        </div>

        {session?.pendingConfirmation && (
          <ConfirmDialog
            action={{
              description: session.pendingConfirmation.description,
              risk: session.pendingConfirmation.risk
            }}
            onConfirm={(approved, reason) => {
              store.setPendingConfirmation(null)
            }}
            onReject={() => {
              store.setPendingConfirmation(null)
            }}
          />
        )}

        <form onSubmit={handleSubmit} className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="描述你想让 Agent 完成的任务..."
            disabled={
              session?.status === 'executing' ||
              session?.status === 'waiting_user'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <div className="input-actions">
            {session?.status === 'executing' ? (
              <button type="button" onClick={abort} className="btn-stop">
                ⏹ 停止
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-send"
              >
                ➤ 发送
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## 三、前端 Agent 开发检查清单

| 维度 | 检查项 | 说明 |
|------|--------|------|
| **通信** | SSE/Streaming 实现 | 支持流式接收 Agent 事件 |
| | 中断/取消机制 | AbortController 取消请求 |
| | 重连机制 | 网络断开自动重连 |
| **状态** | Agent 状态枚举 | idle/thinking/executing/done/error |
| | 消息列表管理 | 增删改查 + 持久化 |
| | 工具调用追踪 | 每个工具调用的完整生命周期 |
| **UI** | 流式文本渲染 | 逐字/逐 token 渲染 |
| | 思考链可视化 | Agent 推理过程展示 |
| | 工具调用卡片 | 参数 + 结果展示 |
| | 用户确认弹窗 | 危险操作确认 |
| | 错误展示与重试 | 友好错误 + 重试按钮 |
| **性能** | 虚拟滚动 | 长对话列表优化 |
| | 工具调用缓存 | 避免重复工具调用 |
| | 消息增量更新 | 只更新变化的消息 |
| **体验** | 加载骨架屏 | 等待时的占位 |
| | 中断后恢复 | 支持从断点继续 |
| | Markdown 渲染 | 支持富文本输出 |
| | 代码高亮 | 代码块语法高亮 |

---

## 四、学习路线建议

```
阶段 1: 基础入门（1-2 周）
  ├─ 理解 Agent 核心概念（overview → agent-architecture）
  ├─ 学习 Function Calling 原理
  └─ 用 Vercel AI SDK useChat 跑通第一个流式对话

阶段 2: 流式通信（1 周）
  ├─ 手写 fetch + ReadableStream 解析 SSE
  ├─ 设计 Agent Event 类型体系
  └─ 对比 SSE vs WebSocket 适用场景

阶段 3: UI/UX（1-2 周）
  ├─ 实现思考链可视化
  ├─ 实现工具调用卡片
  ├─ 实现流式 Markdown 渲染
  └─ 实现用户确认机制

阶段 4: 状态管理（1 周）
  ├─ 设计 Agent 状态模型
  ├─ Zustand 状态管理
  └─ IndexedDB 持久化

阶段 5: 完整实战（2-3 周）
  ├─ 构建完整前端 Agent 应用
  ├─ 性能优化（虚拟滚动、缓存）
  └─ 浏览器端 AI 探索
```

---

## 推荐资源

- [Vercel AI SDK 官方文档](https://sdk.vercel.ai/docs)
- [AI SDK RSC（React Server Components）](https://sdk.vercel.ai/docs/ai-sdk-rsc)
- [WebLLM - 浏览器端 LLM](https://github.com/mlc-ai/web-llm)
- [Chrome Built-in AI 早期预览](https://developer.chrome.com/docs/ai/built-in)
- [SSE 规范](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)