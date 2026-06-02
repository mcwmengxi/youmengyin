# 多 Agent 协作可视化

> 多 Agent 系统中，前端需要同时展示多个 Agent 的工作状态、通信和协作过程。

---

## 一、多 Agent 协作模式

```
┌─────────────────────────────────────────────────────┐
│                   多 Agent 协作                       │
│                                                     │
│  ┌──────────────────┐    ┌──────────────────┐       │
│  │   PM Agent       │    │   Dev Agent       │       │
│  │   状态: 执行中    │    │   状态: 等待中     │       │
│  │   任务: 需求分析  │    │   任务: 待分配     │       │
│  └────────┬─────────┘    └────────┬─────────┘       │
│           │      消息传递          │                 │
│           └───────────────────────┘                 │
│                                                     │
│  ┌──────────────────┐    ┌──────────────────┐       │
│  │   QA Agent       │    │   DevOps Agent    │       │
│  │   状态: 已完成    │    │   状态: 等待中     │       │
│  │   任务: 测试用例  │    │   任务: 待分配     │       │
│  └──────────────────┘    └──────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## 二、多 Agent 状态模型

```typescript
interface MultiAgentSession {
  id: string
  goal: string
  status: 'initializing' | 'running' | 'done' | 'error'

  agents: AgentInstance[]
  messages: InterAgentMessage[]
  artifacts: Artifact[]
}

interface AgentInstance {
  id: string
  name: string
  role: string
  avatar: string
  status: 'idle' | 'thinking' | 'executing' | 'waiting' | 'done' | 'error'
  currentTask?: string
  toolCalls: ToolCallRecord[]
  progress: number
}

interface InterAgentMessage {
  id: string
  from: string
  to: string | 'broadcast'
  content: string
  type: 'task_assign' | 'result' | 'question' | 'handoff'
  timestamp: number
}
```

---

## 三、多 Agent 面板组件

```tsx
function MultiAgentPanel({ session }: { session: MultiAgentSession }) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showMessages, setShowMessages] = useState(false)

  return (
    <div className="multi-agent-panel">
      {/* Agent 卡片网格 */}
      <div className="agent-grid">
        {session.agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent === agent.id}
            onClick={() => setSelectedAgent(agent.id)}
          />
        ))}
      </div>

      {/* 选中 Agent 的详情 */}
      {selectedAgent && (
        <AgentDetail
          agent={session.agents.find((a) => a.id === selectedAgent)!}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* Agent 间通信 */}
      <div className="inter-agent-messages">
        <button onClick={() => setShowMessages(!showMessages)}>
          Agent 间通信 ({session.messages.length})
        </button>
        {showMessages && (
          <div className="message-list">
            {session.messages.map((msg) => (
              <InterAgentMessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AgentCard({ agent, isSelected, onClick }: {
  agent: AgentInstance
  isSelected: boolean
  onClick: () => void
}) {
  const statusColors = {
    idle: '#999',
    thinking: '#f0a500',
    executing: '#3b82f6',
    waiting: '#8b5cf6',
    done: '#22c55e',
    error: '#ef4444'
  }

  return (
    <div
      className={`agent-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ borderColor: statusColors[agent.status] }}
    >
      <div className="agent-avatar">{agent.avatar}</div>
      <div className="agent-name">{agent.name}</div>
      <div className="agent-role">{agent.role}</div>
      <div className="agent-status" style={{ color: statusColors[agent.status] }}>
        {agent.status === 'executing' ? '⚡' : ''}
        {agent.status === 'thinking' ? '💭' : ''}
        {agent.status === 'done' ? '✅' : ''}
        {agent.status}
      </div>
      {agent.currentTask && (
        <div className="agent-task">{agent.currentTask}</div>
      )}
      {/* 进度条 */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${agent.progress}%`, background: statusColors[agent.status] }}
        />
      </div>
    </div>
  )
}
```

---

## 四、Agent 间消息传递可视化

```tsx
function InterAgentMessageBubble({ message }: { message: InterAgentMessage }) {
  const typeIcons = {
    task_assign: '📋',
    result: '📊',
    question: '❓',
    handoff: '🤝'
  }

  return (
    <div className={`inter-agent-message type-${message.type}`}>
      <div className="message-header">
        <span className="from-agent">{message.from}</span>
        <span className="arrow">→</span>
        <span className="to-agent">
          {message.to === 'broadcast' ? '📢 全体' : message.to}
        </span>
        <span className="message-type-icon">{typeIcons[message.type]}</span>
      </div>
      <div className="message-body">{message.content}</div>
      <div className="message-time">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  )
}
```

---

## 五、Agent 角色切换

```tsx
function AgentRoleSwitcher({
  agents,
  activeAgentId,
  onSwitch
}: {
  agents: AgentInstance[]
  activeAgentId: string
  onSwitch: (agentId: string) => void
}) {
  return (
    <div className="agent-role-switcher">
      {agents.map((agent) => (
        <button
          key={agent.id}
          className={`role-btn ${agent.id === activeAgentId ? 'active' : ''}`}
          onClick={() => onSwitch(agent.id)}
        >
          <span className="role-avatar">{agent.avatar}</span>
          <span className="role-name">{agent.name}</span>
          {agent.status === 'executing' && (
            <span className="role-badge executing">●</span>
          )}
          {agent.status === 'waiting' && (
            <span className="role-badge waiting">◌</span>
          )}
        </button>
      ))}
    </div>
  )
}
```

---

## 六、多 Agent 开发检查清单

| 功能 | 说明 |
|------|------|
| Agent 卡片网格 | 展示所有 Agent 的状态、进度、当前任务 |
| Agent 详情面板 | 查看单个 Agent 的工具调用、思考链 |
| 通信消息流 | Agent 间的任务分配、结果传递、交接 |
| 角色切换 | 用户可以在不同 Agent 视角间切换 |
| 全局状态栏 | 展示整体任务进度和完成情况 |
| 产物展示 | 各 Agent 产出的文件、代码、报告 |