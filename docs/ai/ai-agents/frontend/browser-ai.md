# 浏览器端 AI

> 浏览器正成为 AI 推理的新战场。WebLLM 利用 WebGPU 在浏览器中运行 LLM，Chrome 则在实验性地内置 Gemini Nano。

---

## 一、WebLLM（浏览器内 LLM 推理）

WebLLM 利用 WebGPU 在浏览器中直接运行 LLM，无需后端服务器。

```typescript
import { CreateMLCEngine } from '@mlc-ai/web-llm'

async function createBrowserAgent() {
  const engine = await CreateMLCEngine('Qwen2.5-7B-Instruct-q4f16_1-MLC', {
    initProgressCallback: (progress) => {
      console.log(`模型下载: ${(progress.progress * 100).toFixed(1)}%`)
    }
  })

  const browserTools = {
    getCurrentURL: () => window.location.href,
    getPageTitle: () => document.title,
    getSelectedText: () => window.getSelection()?.toString() || '',
    getLocalStorage: (key: string) => localStorage.getItem(key),
    setLocalStorage: (key: string, value: string) =>
      localStorage.setItem(key, value)
  }

  async function browserAgent(userInput: string) {
    const messages = [
      {
        role: 'system',
        content: `你是一个浏览器助手 Agent。你可以访问当前页面的信息。
可用工具: ${Object.keys(browserTools).join(', ')}`
      },
      { role: 'user', content: userInput }
    ]

    const response = await engine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 2048
    })

    return response.choices[0].message.content
  }

  return { browserAgent, browserTools }
}
```

### WebLLM 关键特性

| 特性 | 说明 |
|------|------|
| 运行环境 | 浏览器 WebGPU |
| 模型格式 | MLC（量化后的模型） |
| 首次加载 | 需下载模型（数百 MB - 数 GB） |
| 推理速度 | 取决于 GPU 性能，通常 10-50 token/s |
| 隐私性 | 数据完全本地，不上传服务器 |
| 适用场景 | 隐私敏感、离线可用、低成本部署 |

---

## 二、Chrome Built-in AI API

Chrome 正在实验性地内置 Gemini Nano 到浏览器中。

```typescript
async function useChromeAI() {
  if (!('ai' in window)) {
    throw new Error(
      'Chrome Built-in AI 不可用，需要 Chrome 127+ 并开启实验性功能'
    )
  }

  const ai = (window as any).ai

  const capabilities = await ai.languageModel.capabilities()
  if (capabilities.available === 'no') {
    throw new Error('语言模型不可用')
  }

  const session = await ai.languageModel.create({
    systemPrompt: '你是一个前端开发助手 Agent',
    temperature: 0.7,
    topK: 40
  })

  async function* streamChat(userMessage: string) {
    const stream = session.promptStreaming(userMessage)
    for await (const chunk of stream) {
      yield chunk
    }
  }

  function destroy() {
    session.destroy()
  }

  return { streamChat, destroy, capabilities }
}
```

### Chrome Built-in AI 关键特性

| 特性 | 说明 |
|------|------|
| 可用性 | Chrome 127+，需开启实验性 flag |
| 模型 | Gemini Nano（内置在浏览器中） |
| 无需下载 | 模型随浏览器分发 |
| API 风格 | 类似 Web API，Promise 风格 |
| 内存管理 | 需手动 `session.destroy()` 释放 |

---

## 三、前端纯工具型 Agent（无需后端）

```typescript
class FrontendOnlyAgent {
  private tools: Map<string, FrontendTool>
  private toolDescriptions: string

  constructor() {
    this.tools = new Map()

    this.registerTool('dom_query', {
      description: '查询 DOM 元素',
      parameters: {
        selector: { type: 'string', description: 'CSS 选择器' },
        attribute: { type: 'string', description: '要获取的属性，默认 innerText' }
      },
      execute: ({ selector, attribute }) => {
        const el = document.querySelector(selector)
        if (!el) return { error: '元素未找到' }
        return {
          value: attribute ? el.getAttribute(attribute) : el.textContent
        }
      }
    })

    this.registerTool('clipboard', {
      description: '读写剪贴板',
      parameters: {
        action: { type: 'string', enum: ['read', 'write'] },
        text: { type: 'string', description: '写入的文本（action=write 时）' }
      },
      execute: async ({ action, text }) => {
        if (action === 'read')
          return { text: await navigator.clipboard.readText() }
        if (action === 'write' && text) {
          await navigator.clipboard.writeText(text)
          return { success: true }
        }
        return { error: '无效操作' }
      }
    })

    this.registerTool('local_storage', {
      description: '读写本地存储',
      parameters: {
        action: { type: 'string', enum: ['get', 'set', 'remove'] },
        key: { type: 'string' },
        value: { type: 'string' }
      },
      execute: ({ action, key, value }) => {
        switch (action) {
          case 'get': return { value: localStorage.getItem(key) }
          case 'set': localStorage.setItem(key, value!); return { success: true }
          case 'remove': localStorage.removeItem(key); return { success: true }
        }
      }
    })

    this.toolDescriptions = Array.from(this.tools.entries())
      .map(
        ([name, tool]) =>
          `- ${name}: ${tool.description}\n  参数: ${JSON.stringify(tool.parameters)}`
      )
      .join('\n')
  }

  private registerTool(name: string, config: Omit<FrontendTool, 'name'>) {
    this.tools.set(name, { name, ...config })
  }

  getToolDescriptions(): string {
    return this.toolDescriptions
  }

  async executeTool(name: string, args: Record<string, any>): Promise<any> {
    const tool = this.tools.get(name)
    if (!tool) return { error: `未知工具: ${name}` }
    return tool.execute(args)
  }
}
```

---

## 四、浏览器端 AI 方案对比

| 方案 | 模型位置 | 网络依赖 | 推理速度 | 隐私性 | 成熟度 |
|------|----------|----------|----------|--------|--------|
| 后端 API（OpenAI 等） | 云端 | 必须 | 快 | 低 | 成熟 |
| WebLLM | 浏览器（WebGPU） | 首次下载后离线 | 中 | 高 | 成长中 |
| Chrome Built-in AI | 浏览器内置 | 无 | 快 | 高 | 实验性 |
| 前端工具型 Agent | 调用后端 API | 必须 | 快 | 中 | 成熟 |