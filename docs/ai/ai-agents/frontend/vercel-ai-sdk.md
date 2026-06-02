# Vercel AI SDK

> Vercel AI SDK 是当前最主流的前端 AI 开发库，提供统一的流式 AI 交互能力，支持 React、Vue、Svelte 等框架。

---

## 核心概念

```
┌────────────────────────────────────────────┐
│             Vercel AI SDK                   │
│                                            │
│  ┌─────────────┐     ┌──────────────────┐  │
│  │  useChat    │     │   useCompletion  │  │
│  │ (对话模式)   │     │   (补全模式)     │  │
│  └─────────────┘     └──────────────────┘  │
│                                            │
│  ┌─────────────┐     ┌──────────────────┐  │
│  │ useAssistant│     │    streamText    │  │
│  │ (OpenAI辅助) │     │   (服务端流式)   │  │
│  └─────────────┘     └──────────────────┘  │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │          Core Utilities             │   │
│  │  generateText / streamObject / tool │   │
│  └─────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

---

## 一、useChat Hook（React）

```tsx
import { useChat } from '@ai-sdk/react'

function AgentChat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    error,
    reload
  } = useChat({
    api: '/api/agent/chat',
    body: {
      sessionId: 'user-123',
      preferences: { language: 'zh-CN' }
    },
    onFinish: (message) => {
      console.log('对话完成:', message)
    },
    onError: (error) => {
      console.error('Agent 错误:', error)
    }
  })

  return (
    <div className="agent-chat">
      <div className="messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="role-badge">{m.role === 'user' ? '👤' : '🤖'}</div>
            <div className="content">
              {m.content}
              {m.toolInvocations?.map((tool) => (
                <ToolCallCard key={tool.toolCallId} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="输入你的需求..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '思考中...' : '发送'}
        </button>
        {isLoading && (
          <button type="button" onClick={() => stop()}>停止</button>
        )}
      </form>

      {error && (
        <div className="error-banner">
          出错了: {error.message}
          <button onClick={() => reload()}>重试</button>
        </div>
      )}
    </div>
  )
}
```

---

## 二、带工具调用的 Agent Chat

### 前端工具调用可视化组件

```tsx
function ToolCallCard({ tool }: { tool: ToolInvocation }) {
  const { toolName, toolCallId, state, args, result } = tool

  return (
    <div className={`tool-call state-${state}`}>
      <div className="tool-header">
        <span className="tool-icon">🔧</span>
        <span className="tool-name">{toolName}</span>
        <span className={`tool-state ${state}`}>
          {state === 'call' && '执行中...'}
          {state === 'result' && '已完成'}
          {state === 'partial-call' && '准备调用...'}
        </span>
      </div>

      <details className="tool-args">
        <summary>调用参数</summary>
        <pre>{JSON.stringify(args, null, 2)}</pre>
      </details>

      {state === 'result' && (
        <div className="tool-result">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### 服务端工具定义

```typescript
// api/agent/chat/route.ts
import { streamText, tool } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: yourModel,
    messages,
    tools: {
      searchWeb: tool({
        description: '搜索互联网信息',
        parameters: z.object({
          query: z.string().describe('搜索关键词'),
          maxResults: z.number().optional().describe('最大结果数')
        }),
        execute: async ({ query, maxResults = 5 }) => {
          const results = await searchAPI(query, maxResults)
          return results
        }
      }),
      getFileContent: tool({
        description: '读取文件内容',
        parameters: z.object({
          filePath: z.string().describe('文件路径'),
          encoding: z.enum(['utf-8', 'base64']).optional()
        }),
        execute: async ({ filePath, encoding = 'utf-8' }) => {
          const content = await readFile(filePath, encoding)
          return { content, size: content.length }
        }
      }),
      confirmDangerousAction: tool({
        description: '需要用户确认的危险操作',
        parameters: z.object({
          action: z.string().describe('操作描述'),
          risk: z.enum(['low', 'medium', 'high']).describe('风险等级')
        }),
        execute: async ({ action, risk }) => {
          return { status: 'pending_confirmation', action, risk }
        }
      })
    },
    maxSteps: 5
  })

  return result.toDataStreamResponse()
}
```

---

## 三、服务端多步骤 Agent

```typescript
import { generateText, tool } from 'ai'

async function runAgent(userGoal: string) {
  const result = await generateText({
    model: yourModel,
    system: `你是一个自主 Agent。接收用户目标后，你需要:
1. 制定执行计划
2. 逐步调用工具完成任务
3. 在每次工具调用后评估是否达到目标
4. 如果未完成，继续下一步`,
    prompt: userGoal,
    tools: {
      searchWeb: tool({ /* ... */ }),
      readFile: tool({ /* ... */ }),
      executeCode: tool({ /* ... */ }),
      markComplete: tool({
        description: '标记任务完成',
        parameters: z.object({
          summary: z.string().describe('完成总结'),
          artifacts: z.array(z.string()).optional().describe('生成的文件列表')
        }),
        execute: async ({ summary }) => summary
      })
    },
    maxSteps: 10,
    onStepFinish: (step) => {
      console.log(
        `Step ${step.stepNumber}: ${step.toolCalls.map((t) => t.toolName)}`
      )
    }
  })

  return result
}
```

---

## 四、关键 API 总结

| API | 用途 | 场景 |
|-----|------|------|
| `useChat` | 对话式 AI 交互 | 聊天机器人、Agent 对话 |
| `useCompletion` | 文本补全 | 写作辅助、代码补全 |
| `useAssistant` | OpenAI Assistant API | 文件上传、代码解释器 |
| `streamText` | 服务端流式文本生成 | 自定义 Agent 循环 |
| `generateText` | 非流式文本生成 | 批量处理、后台任务 |
| `tool()` | 工具定义 | 所有需要工具调用的场景 |
| `maxSteps` | 多步 Agent 循环 | 自主 Agent 执行 |