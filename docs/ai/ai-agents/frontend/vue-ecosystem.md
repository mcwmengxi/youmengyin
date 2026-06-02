# Vue 生态支持

> Vercel AI SDK 同样支持 Vue 3，结合 Composition API 和 Pinia，可以构建同样强大的 Agent 应用。

---

## 一、AI SDK Vue 集成

```bash
npm install ai @ai-sdk/vue @ai-sdk/openai
```

### useChat（Vue 版）

```vue
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const {
  messages,
  input,
  handleSubmit,
  isLoading,
  stop,
  error,
  reload
} = useChat({
  api: '/api/agent/chat',
  body: {
    sessionId: 'user-123'
  },
  onFinish: (message) => {
    console.log('对话完成:', message)
  },
  onError: (error) => {
    console.error('Agent 错误:', error)
  }
})
</script>

<template>
  <div class="agent-chat">
    <div class="messages">
      <div
        v-for="m in messages"
        :key="m.id"
        :class="['message', m.role]"
      >
        <span class="role-badge">{{ m.role === 'user' ? '👤' : '🤖' }}</span>
        <div class="content">
          {{ m.content }}
          <ToolCallCard
            v-for="tool in m.toolInvocations"
            :key="tool.toolCallId"
            :tool="tool"
          />
        </div>
      </div>
    </div>

    <form @submit="handleSubmit" class="input-area">
      <input
        v-model="input"
        placeholder="输入你的需求..."
        :disabled="isLoading"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '思考中...' : '发送' }}
      </button>
      <button v-if="isLoading" type="button" @click="stop()">
        停止
      </button>
    </form>

    <div v-if="error" class="error-banner">
      出错了: {{ error.message }}
      <button @click="reload()">重试</button>
    </div>
  </div>
</template>
```

---

## 二、Pinia 状态管理

```typescript
// stores/agentStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgentStore = defineStore('agent', () => {
  const session = ref<AgentSession | null>(null)
  const streamingText = ref('')

  const isExecuting = computed(() =>
    session.value?.status === 'executing'
  )
  const messageCount = computed(() =>
    session.value?.messages.length ?? 0
  )

  function createSession(goal: string) {
    session.value = {
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
    }
    streamingText.value = ''
  }

  function appendMessage(message: AgentMessage) {
    if (session.value) {
      session.value.messages.push(message)
    }
  }

  function appendStreamingText(delta: string) {
    streamingText.value += delta
  }

  function addToolCall(toolCall: ToolCallRecord) {
    if (session.value) {
      session.value.toolCalls.push(toolCall)
    }
  }

  function updateToolResult(toolCallId: string, result: any) {
    if (session.value) {
      const tc = session.value.toolCalls.find((t) => t.id === toolCallId)
      if (tc) {
        tc.result = result
        tc.status = 'done'
      }
    }
  }

  function setStatus(status: AgentStatus) {
    if (session.value) {
      session.value.status = status
    }
  }

  function resetStreamingText() {
    streamingText.value = ''
  }

  return {
    session,
    streamingText,
    isExecuting,
    messageCount,
    createSession,
    appendMessage,
    appendStreamingText,
    addToolCall,
    updateToolResult,
    setStatus,
    resetStreamingText
  }
})
```

---

## 三、Vue Composables

### useAgentStream

```typescript
// composables/useAgentStream.ts
import { useAgentStore } from '@/stores/agentStore'

export function useAgentStream() {
  const store = useAgentStore()
  const abortController = ref<AbortController | null>(null)

  const startStream = async (userMessage: string) => {
    const controller = new AbortController()
    abortController.value = controller

    store.createSession(userMessage)
    store.setStatus('thinking')

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }]
        }),
        signal: controller.signal
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
            case 'text_delta':
              store.setStatus('executing')
              fullText += event.content
              store.appendStreamingText(event.content)
              break
            case 'tool_call':
              store.addToolCall({
                id: `${event.toolName}-${Date.now()}`,
                toolName: event.toolName,
                args: event.args,
                status: 'running'
              })
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
  }

  const abort = () => {
    abortController.value?.abort()
  }

  return { startStream, abort, store }
}
```

---

## 四、Vue 组件示例

### Vue 版 Agent 思考链

```vue
<script setup lang="ts">
defineProps<{
  steps: ThinkingStep[]
}>()
</script>

<template>
  <div class="thinking-chain">
    <div
      v-for="(step, index) in steps"
      :key="step.id"
      :class="['think-step', step.status]"
    >
      <div
        v-if="index < steps.length - 1"
        :class="['step-connector', step.status]"
      />

      <div class="step-indicator">
        <Spinner v-if="step.status === 'running'" />
        <CheckIcon v-else-if="step.status === 'done'" />
        <ErrorIcon v-else-if="step.status === 'error'" />
        <DotIcon v-else />
      </div>

      <div class="step-content">
        <span class="step-type">
          <template v-if="step.type === 'plan'">📋 计划</template>
          <template v-else-if="step.type === 'think'">💭 思考</template>
          <template v-else-if="step.type === 'tool_call'">🔧 工具</template>
          <template v-else-if="step.type === 'tool_result'">📊 结果</template>
          <template v-else-if="step.type === 'conclusion'">✨ 结论</template>
        </span>
        <span class="step-text">{{ step.content }}</span>
      </div>
    </div>
  </div>
</template>
```

---

## 五、React vs Vue 对比

| 维度 | React | Vue 3 |
|------|-------|-------|
| AI SDK 包 | `@ai-sdk/react` | `@ai-sdk/vue` |
| 状态管理 | Zustand / Jotai | Pinia |
| 组件风格 | JSX 函数组件 | SFC + Composition API |
| 副作用 | useEffect | watch / watchEffect |
| 响应式 | useState / useRef | ref / reactive |
| 模板语法 | JSX | Template + 指令 |
| TypeScript | 原生支持 | 原生支持 |

两者在 AI SDK 层面的 API 几乎一致，选择取决于团队技术栈偏好。