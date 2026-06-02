# 前端 Agent 安全

> Agent 应用的安全模型与传统 Web 应用不同：Agent 可能执行危险操作、访问敏感数据，前端需要建立多层安全防线。

---

## 一、API Key 管理

### 永远不要在前端暴露 API Key

```
❌ 错误做法
const apiKey = 'sk-xxxxxxxxxxxx'  // 直接写在前端代码
fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
})

✅ 正确做法
fetch('/api/agent/chat', {  // 通过后端代理
  method: 'POST',
  body: JSON.stringify({ messages })
})
```

### 后端代理模式

```typescript
// 前端：只发送业务数据，不带 API Key
async function agentChat(messages: Message[]) {
  return fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })
}

// 后端：在服务端管理 API Key
// api/agent/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()
  const apiKey = process.env.OPENAI_API_KEY  // 服务端环境变量

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model: 'gpt-4', messages, stream: true })
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}
```

---

## 二、XSS 防护

Agent 生成的文本内容可能包含恶意脚本，必须做好输出编码。

```tsx
import DOMPurify from 'dompurify'
import ReactMarkdown from 'react-markdown'

function SafeAgentMessage({ content }: { content: string }) {
  // 方式 1：使用 DOMPurify 清洗 HTML
  const sanitized = DOMPurify.sanitize(content)

  // 方式 2：React 默认转义 + Markdown 安全渲染
  return (
    <div className="agent-message">
      <ReactMarkdown
        components={{
          // 禁用危险元素
          script: () => null,
          iframe: () => null,
          // 链接加 rel="noopener noreferrer"
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

---

## 三、工具调用安全

### 前端工具白名单

```typescript
// 只允许安全的前端工具
const ALLOWED_FRONTEND_TOOLS = new Set([
  'dom_query',
  'clipboard_read',
  'local_storage_get',
  'get_current_url',
  'get_page_title'
])

// 需要用户确认的工具
const CONFIRMATION_REQUIRED_TOOLS = new Set([
  'clipboard_write',
  'local_storage_set',
  'local_storage_remove',
  'file_download',
  'file_upload'
])

function isToolAllowed(toolName: string): boolean {
  return ALLOWED_FRONTEND_TOOLS.has(toolName)
}

function requiresConfirmation(toolName: string): boolean {
  return CONFIRMATION_REQUIRED_TOOLS.has(toolName)
}
```

### 危险操作确认

```typescript
// 危险操作分级
enum RiskLevel {
  LOW = 'low',         // 只读操作
  MEDIUM = 'medium',   // 修改本地数据
  HIGH = 'high',       // 网络请求、文件操作
  CRITICAL = 'critical' // 删除、支付、发送
}

const riskConfig: Record<RiskLevel, { maxAutoConfirm: number; requireReason: boolean }> = {
  [RiskLevel.LOW]:      { maxAutoConfirm: Infinity, requireReason: false },
  [RiskLevel.MEDIUM]:   { maxAutoConfirm: 3,        requireReason: false },
  [RiskLevel.HIGH]:     { maxAutoConfirm: 0,        requireReason: true },
  [RiskLevel.CRITICAL]: { maxAutoConfirm: 0,        requireReason: true }
}
```

---

## 四、CSP（内容安全策略）

```html
<!-- 推荐的前端 Agent 应用 CSP 配置 -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.openai.com;
  img-src 'self' data: https:;
  media-src 'none';
  object-src 'none';
  frame-src 'none';
">
```

---

## 五、敏感数据保护

```typescript
// 脱敏工具函数
class DataSanitizer {
  // 移除 API Key、Token 等敏感信息
  static sanitizeMessage(message: AgentMessage): AgentMessage {
    return {
      ...message,
      content: this.redactSensitive(message.content)
    }
  }

  private static redactSensitive(text: string): string {
    return text
      .replace(/sk-[a-zA-Z0-9]{32,}/g, '[API_KEY_REDACTED]')
      .replace(/Bearer\s+[a-zA-Z0-9\-._~+/]+/g, 'Bearer [REDACTED]')
      .replace(/-----BEGIN\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+PRIVATE\s+KEY-----/g, '[PRIVATE_KEY_REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
  }

  // 存储前清理
  static beforePersist(session: AgentSession): AgentSession {
    return {
      ...session,
      messages: session.messages.map(this.sanitizeMessage)
    }
  }
}
```

---

## 六、安全最佳实践检查清单

| 维度 | 措施 | 说明 |
|------|------|------|
| API Key | 后端代理，绝不暴露在前端 | 使用环境变量 + 服务端路由 |
| XSS | DOMPurify + Markdown 安全渲染 | 禁用 script/iframe 等危险标签 |
| 工具调用 | 白名单 + 风险分级 + 用户确认 | 写操作必须用户确认 |
| CSP | 限制脚本来源和连接目标 | 防止 XSS 和数据泄露 |
| 敏感数据 | 日志脱敏 + 存储前清理 | 防止 API Key 泄露到日志 |
| 传输安全 | HTTPS + 敏感头禁用缓存 | Cache-Control: no-store |
| 依赖安全 | 定期 npm audit | 防止供应链攻击 |
| 存储安全 | 敏感数据不存 localStorage | 使用 httpOnly cookie 或服务端 session |