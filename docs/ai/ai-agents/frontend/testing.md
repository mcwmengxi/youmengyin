# 测试策略

> 前端 Agent 组件的测试有其特殊性：流式数据、异步状态转换、工具调用模拟都需要针对性的测试策略。

---

## 一、测试金字塔

```
         ╱─────╲
        ╱  E2E  ╲         Playwright / Cypress
       ╱─────────╲        完整用户流程
      ╱  集成测试  ╲       Vitest + Testing Library
     ╱─────────────╲     组件交互 + API Mock
    ╱   单元测试     ╲     Vitest
   ╱─────────────────╲   纯函数、Hook、Store
```

---

## 二、Mock SSE 流式响应

```typescript
// test/mocks/sse-mock.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

function createSSEMockStream(events: AgentEvent[]) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      for (const event of events) {
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(encoder.encode(data))
      }
      controller.close()
    }
  })

  return stream
}

// 模拟 Agent 完整响应流程
const mockAgentResponse = createSSEMockStream([
  { type: 'plan', steps: ['搜索资料', '分析数据'] },
  { type: 'thinking', content: '开始搜索...' },
  { type: 'tool_call', toolName: 'search', args: { query: 'test' } },
  { type: 'tool_result', toolName: 'search', result: '找到 3 条结果' },
  { type: 'text_delta', content: '根据搜索结果，' },
  { type: 'text_delta', content: '分析如下...' },
  { type: 'done', summary: '分析完成' }
])

export const handlers = [
  http.post('/api/agent/chat', () => {
    return new HttpResponse(mockAgentResponse, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  })
]

export const server = setupServer(...handlers)
```

---

## 三、Zustand Store 单元测试

```typescript
// test/agentStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAgentStore } from '@/store/agentStore'

describe('AgentStore', () => {
  beforeEach(() => {
    useAgentStore.setState({ session: null, streamingText: '' })
  })

  it('应该创建会话并包含用户消息', () => {
    const store = useAgentStore.getState()
    store.createSession('帮我分析数据')

    expect(store.session).not.toBeNull()
    expect(store.session!.messages).toHaveLength(1)
    expect(store.session!.messages[0].role).toBe('user')
    expect(store.session!.messages[0].content).toBe('帮我分析数据')
    expect(store.session!.status).toBe('idle')
  })

  it('应该追加流式文本', () => {
    const store = useAgentStore.getState()
    store.appendStreamingText('Hello')
    store.appendStreamingText(' World')

    expect(useAgentStore.getState().streamingText).toBe('Hello World')
  })

  it('应该正确管理工具调用状态', () => {
    const store = useAgentStore.getState()
    store.createSession('test')

    const toolCall = {
      id: 'tool-1',
      toolName: 'search',
      args: { query: 'test' },
      status: 'running' as const
    }
    store.addToolCall(toolCall)

    expect(store.session!.toolCalls).toHaveLength(1)
    expect(store.session!.toolCalls[0].status).toBe('running')

    store.updateToolResult('tool-1', { results: ['a', 'b'] })
    const updated = useAgentStore.getState().session!.toolCalls[0]
    expect(updated.status).toBe('done')
    expect(updated.result).toEqual({ results: ['a', 'b'] })
  })

  it('应该正确重置流式文本', () => {
    const store = useAgentStore.getState()
    store.appendStreamingText('some text')
    store.resetStreamingText()

    expect(useAgentStore.getState().streamingText).toBe('')
  })
})
```

---

## 四、组件集成测试

```tsx
// test/AgentStatusBar.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AgentStatusBar } from '@/components/AgentStatusBar'

describe('AgentStatusBar', () => {
  it('应该显示等待指令状态', () => {
    render(<AgentStatusBar status="idle" />)
    expect(screen.getByText('等待指令')).toBeDefined()
  })

  it('应该显示执行中状态和进度', () => {
    render(<AgentStatusBar status="executing" step={2} totalSteps={5} />)
    expect(screen.getByText('执行任务')).toBeDefined()
    expect(screen.getByText('步骤 2/5')).toBeDefined()
  })

  it('应该显示错误状态', () => {
    render(<AgentStatusBar status="error" />)
    expect(screen.getByText('出错了')).toBeDefined()
  })
})
```

---

## 五、E2E 测试

```typescript
// e2e/agent-chat.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Agent Chat E2E', () => {
  test('完整的 Agent 对话流程', async ({ page }) => {
    await page.goto('/')

    // 输入消息
    const textarea = page.locator('textarea')
    await textarea.fill('帮我搜索前端 Agent 开发资料')
    await page.locator('button[type="submit"]').click()

    // 验证状态栏显示
    await expect(page.locator('.agent-status-bar')).toContainText('思考中')

    // 验证工具调用卡片出现
    await expect(page.locator('.tool-call')).toBeVisible()
    await expect(page.locator('.tool-name')).toContainText('search')

    // 验证流式文本出现
    await expect(page.locator('.streaming-markdown')).toBeVisible()

    // 等待完成
    await expect(page.locator('.agent-status-bar')).toContainText('已完成', { timeout: 30000 })

    // 验证消息已保存
    const messages = page.locator('.message')
    await expect(messages).toHaveCount(2) // user + assistant
  })

  test('可以中断 Agent 执行', async ({ page }) => {
    await page.goto('/')

    const textarea = page.locator('textarea')
    await textarea.fill('执行一个很长的任务')
    await page.locator('button[type="submit"]').click()

    // 等待开始执行
    await expect(page.locator('.agent-status-bar')).toContainText('执行')

    // 点击停止按钮
    await page.locator('.btn-stop').click()

    // 验证已停止
    await expect(page.locator('.btn-send')).toBeVisible()
  })
})
```

---

## 六、测试检查清单

| 测试层级 | 测试内容 | 工具 |
|----------|----------|------|
| 单元测试 | Store actions、工具函数、类型守卫 | Vitest |
| 组件测试 | AgentStatusBar、ToolCallCard、ConfirmDialog | Vitest + Testing Library |
| Hook 测试 | useAgentStream、useAgentHistory | Vitest + MSW |
| 集成测试 | 完整 AgentChat 组件 + Mock SSE | Vitest + MSW |
| E2E 测试 | 真实用户流程 | Playwright / Cypress |
| 快照测试 | UI 组件渲染一致性 | Vitest snapshots |