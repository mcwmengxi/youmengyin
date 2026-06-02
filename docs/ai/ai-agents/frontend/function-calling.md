# 前端 Function Calling 完整流程

> 自主实现 OpenAI 格式的 Function Calling 循环，理解 Agent 工具调用的底层机制。

---

## 数据结构定义

```typescript
interface FrontendTool {
  name: string
  description: string
  parameters: Record<
    string,
    {
      type: string
      description: string
      enum?: string[]
    }
  >
  execute: (args: Record<string, any>) => Promise<any> | any
}

interface ToolCall {
  id: string
  function: {
    name: string
    arguments: string
  }
}
```

---

## 核心循环实现

```typescript
class AgentFunctionCallingLoop {
  private model: string
  private tools: Map<string, FrontendTool> = new Map()

  constructor(model: string) {
    this.model = model
  }

  registerTool(tool: FrontendTool) {
    this.tools.set(tool.name, tool)
  }

  getOpenAITools() {
    return Array.from(this.tools.values()).map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: Object.fromEntries(
            Object.entries(tool.parameters).map(([key, param]) => [
              key,
              {
                type: param.type,
                description: param.description,
                ...(param.enum && { enum: param.enum })
              }
            ])
          ),
          required: Object.keys(tool.parameters)
        }
      }
    }))
  }

  async run(userMessage: string, apiKey: string) {
    const messages: any[] = [{ role: 'user', content: userMessage }]

    let loopCount = 0
    const maxLoops = 10

    while (loopCount < maxLoops) {
      loopCount++

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            tools: this.getOpenAITools(),
            tool_choice: 'auto'
          })
        }
      )

      const data = await response.json()
      const choice = data.choices[0]
      const assistantMessage = choice.message

      messages.push(assistantMessage)

      if (
        !assistantMessage.tool_calls ||
        assistantMessage.tool_calls.length === 0
      ) {
        return {
          finalAnswer: assistantMessage.content,
          messages,
          toolCalls: messages.filter((m) => m.role === 'tool')
        }
      }

      for (const toolCall of assistantMessage.tool_calls as ToolCall[]) {
        const toolName = toolCall.function.name
        const toolArgs = JSON.parse(toolCall.function.arguments)

        const tool = this.tools.get(toolName)
        if (!tool) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: `未知工具: ${toolName}` })
          })
          continue
        }

        try {
          const result = await tool.execute(toolArgs)
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          })
        } catch (err: any) {
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: err.message })
          })
        }
      }
    }

    return { finalAnswer: 'Agent 达到最大执行步骤', messages }
  }
}
```

---

## 执行流程图

```
用户输入
  │
  ▼
LLM 分析 → 判断是否需要工具
  │              │
  │ 不需要       │ 需要
  │              ▼
  │         输出 tool_calls[]
  │              │
  │              ▼
  │         执行每个工具
  │              │
  │              ▼
  │         将 tool_result 追加到 messages
  │              │
  │              ▼
  │         重新调用 LLM（带工具结果）
  │              │
  │              ▼
  │         (循环直到 LLM 不再调用工具)
  │              │
  ▼              ▼
返回最终回复
```

---

## 关键设计要点

| 要点 | 说明 |
|------|------|
| **maxLoops** | 防止无限循环，通常设为 5-10 |
| **tool_choice: 'auto'** | 让 LLM 自行决定是否调用工具 |
| **错误处理** | 每个工具调用都需 try-catch，错误信息也要返回给 LLM |
| **消息追加** | 工具调用和结果都必须追加到 messages 数组，保持上下文完整 |
| **工具注册** | 工具定义和管理与循环逻辑分离，便于扩展 |