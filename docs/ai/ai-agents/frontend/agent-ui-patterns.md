# Agent UI/UX 设计模式

> Agent 应用的用户体验核心在于让用户看到 Agent 的「思考」过程，提高信任感和可控感。

---

## 一、Agent 思考过程可视化

```
┌─────────────────────────────────────────────────┐
│  Agent 正在处理你的请求...                        │
│                                                 │
│  ✓ 理解需求 → "分析项目技术栈"                    │
│  ✓ 制定计划 → 3 个步骤                           │
│  ⏳ 执行步骤 1/3 → 正在搜索项目文件...             │
│  ○ 等待执行 2/3 → 分析依赖关系                    │
│  ○ 等待执行 3/3 → 生成优化建议                    │
└─────────────────────────────────────────────────┘
```

### 思考链组件

```tsx
interface ThinkingStep {
  id: string
  type: 'plan' | 'think' | 'tool_call' | 'tool_result' | 'conclusion'
  content: string
  status: 'pending' | 'running' | 'done' | 'error'
  timestamp: number
}

function AgentThinkingChain({ steps }: { steps: ThinkingStep[] }) {
  return (
    <div className="thinking-chain">
      {steps.map((step, index) => (
        <div key={step.id} className={`think-step ${step.status}`}>
          {index < steps.length - 1 && (
            <div className={`step-connector ${step.status}`} />
          )}

          <div className="step-indicator">
            {step.status === 'running' && <Spinner />}
            {step.status === 'done' && <CheckIcon />}
            {step.status === 'error' && <ErrorIcon />}
            {step.status === 'pending' && <DotIcon />}
          </div>

          <div className="step-content">
            <span className="step-type">
              {step.type === 'plan' && '📋 计划'}
              {step.type === 'think' && '💭 思考'}
              {step.type === 'tool_call' && '🔧 工具'}
              {step.type === 'tool_result' && '📊 结果'}
              {step.type === 'conclusion' && '✨ 结论'}
            </span>
            <span className="step-text">{step.content}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 二、流式文本渲染

```tsx
import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

function StreamingMarkdown({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    if (indexRef.current < text.length) {
      const timer = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))
        if (indexRef.current >= text.length) clearInterval(timer)
      }, 20)
      return () => clearInterval(timer)
    }
  }, [text])

  return (
    <div className="streaming-markdown">
      <ReactMarkdown>{displayed}</ReactMarkdown>
      {displayed.length < text.length && (
        <span className="cursor-blink">▊</span>
      )}
    </div>
  )
}
```

---

## 三、Agent 状态指示器

```tsx
type AgentStatus =
  | 'idle'
  | 'thinking'
  | 'planning'
  | 'executing'
  | 'waiting_user'
  | 'done'
  | 'error'

function AgentStatusBar({
  status,
  step,
  totalSteps
}: {
  status: AgentStatus
  step?: number
  totalSteps?: number
}) {
  const statusConfig: Record<
    AgentStatus,
    { label: string; color: string; icon: string }
  > = {
    idle:         { label: '等待指令', color: '#999',     icon: '⏸' },
    thinking:     { label: '思考中...', color: '#f0a500', icon: '💭' },
    planning:     { label: '制定计划', color: '#7c3aed', icon: '📋' },
    executing:    { label: '执行任务', color: '#3b82f6', icon: '⚡' },
    waiting_user: { label: '等待确认', color: '#f59e0b', icon: '🤔' },
    done:         { label: '已完成',   color: '#22c55e', icon: '✅' },
    error:        { label: '出错了',   color: '#ef4444', icon: '❌' }
  }

  const config = statusConfig[status]

  return (
    <div className="agent-status-bar" style={{ borderColor: config.color }}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
      {step && totalSteps && (
        <span className="status-progress">
          步骤 {step}/{totalSteps}
        </span>
      )}
      {status === 'executing' && <div className="progress-bar" />}
    </div>
  )
}
```

### 状态转换图

```
idle → thinking → planning → executing → done
  │        │           │           │
  └────────┴───────────┴───────────┴──→ error
                       │
                       └──→ waiting_user → executing
```

---

## 四、用户确认与干预

```tsx
function ConfirmDialog({
  action,
  onConfirm,
  onReject
}: {
  action: { description: string; risk: string }
  onConfirm: (approved: boolean, reason?: string) => void
  onReject: () => void
}) {
  const [reason, setReason] = useState('')

  const riskColors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444'
  }

  return (
    <div className={`confirm-dialog risk-${action.risk}`}>
      <div className="dialog-header">
        <span className="warning-icon">⚠️</span>
        <h3>Agent 请求确认</h3>
        <span
          className="risk-badge"
          style={{ background: riskColors[action.risk] }}
        >
          {action.risk === 'high'
            ? '高风险'
            : action.risk === 'medium'
            ? '中风险'
            : '低风险'}
        </span>
      </div>

      <div className="dialog-body">
        <p>{action.description}</p>
      </div>

      <div className="dialog-reason">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="拒绝原因（可选）"
        />
      </div>

      <div className="dialog-actions">
        <button className="btn-reject" onClick={onReject}>拒绝</button>
        <button
          className="btn-confirm"
          onClick={() => onConfirm(true, reason || undefined)}
        >
          确认执行
        </button>
      </div>
    </div>
  )
}
```

---

## 五、UI 设计原则总结

| 原则 | 说明 | 实现方式 |
|------|------|----------|
| **可见性** | 让用户看到 Agent 在做什么 | 思考链、状态栏、进度条 |
| **可控性** | 用户可以随时干预 | 停止按钮、确认弹窗、拒绝原因 |
| **渐进性** | 内容逐步呈现而非一次性 | 逐字/逐 token 渲染 |
| **可追溯** | 记录 Agent 的每一步决策 | 工具调用卡片、参数/结果展示 |
| **容错性** | 出错时友好提示并支持重试 | 错误状态 + 重试按钮 |