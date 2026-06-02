# AI Agents 前端开发实践学习路线图

> 从前端工程师视角系统学习 AI Agent 开发，涵盖流式通信、Agent UI 设计、浏览器端 AI 和工程化实战。

---

## 一、基础篇

理解前端在 Agent 系统中的角色和核心挑战。

| 序号 | 内容               | 文档                         | 状态   |
| ---- | ------------------ | ---------------------------- | ------ |
| 1    | 前端角色与核心挑战 | [overview.md](./overview.md) | 已完成 |

---

## 二、通信篇

掌握 Agent 前后端流式通信的核心技术。

| 序号 | 内容         | 文档                                                       | 状态   |
| ---- | ------------ | ---------------------------------------------------------- | ------ |
| 1    | 流式通信协议 | [streaming-communication.md](./streaming-communication.md) | 已完成 |

涵盖：SSE 解析、Agent Event 类型设计、WebSocket 双向通信。

---

## 三、框架篇

掌握前端 Agent 开发的主流框架和工具。

| 序号 | 内容          | 文档                                   | 状态   |
| ---- | ------------- | -------------------------------------- | ------ |
| 1    | Vercel AI SDK | [vercel-ai-sdk.md](./vercel-ai-sdk.md) | 已完成 |
| 2    | Vue 生态支持  | [vue-ecosystem.md](./vue-ecosystem.md) | 已完成 |

涵盖：React 版 useChat/useCompletion、服务端多步骤 Agent（maxSteps）、工具调用可视化；Vue 3 Composition API + Pinia 集成。

---

## 四、UI/UX 篇

掌握 Agent 交互界面的设计模式。

| 序号 | 内容                 | 文档                                                           | 状态   |
| ---- | -------------------- | -------------------------------------------------------------- | ------ |
| 1    | Agent UI/UX 设计模式 | [agent-ui-patterns.md](./agent-ui-patterns.md)                 | 已完成 |
| 2    | 多 Agent 协作可视化  | [multi-agent-visualization.md](./multi-agent-visualization.md) | 已完成 |

涵盖：思考链可视化、流式 Markdown 渲染、Agent 状态指示器、用户确认与干预、多 Agent 面板、Agent 间通信展示。

---

## 五、状态管理篇

掌握 Agent 前端状态的设计与管理。

| 序号 | 内容         | 文档                                         | 状态   |
| ---- | ------------ | -------------------------------------------- | ------ |
| 1    | 前端状态管理 | [state-management.md](./state-management.md) | 已完成 |

涵盖：Agent 状态模型设计、Zustand Store、SSE 流事件处理 Hook。

---

## 六、浏览器端 AI 篇

探索浏览器内运行 AI 的前沿技术。

| 序号 | 内容        | 文档                             | 状态   |
| ---- | ----------- | -------------------------------- | ------ |
| 1    | 浏览器端 AI | [browser-ai.md](./browser-ai.md) | 已完成 |

涵盖：WebLLM（WebGPU 推理）、Chrome Built-in AI API、纯前端 Tool Agent。

---

## 七、工程化篇

深入 Agent 前端开发的工程化实践。

| 序号 | 内容                       | 文档                                             | 状态   |
| ---- | -------------------------- | ------------------------------------------------ | ------ |
| 1    | 前端 Function Calling 流程 | [function-calling.md](./function-calling.md)     | 已完成 |
| 2    | 对话历史管理               | [history-management.md](./history-management.md) | 已完成 |
| 3    | 性能优化                   | [performance.md](./performance.md)               | 已完成 |
| 4    | 错误处理与重试机制         | [error-handling.md](./error-handling.md)         | 已完成 |
| 5    | 前端 Agent 安全            | [security.md](./security.md)                     | 已完成 |
| 6    | 测试策略                   | [testing.md](./testing.md)                       | 已完成 |

---

## 八、实战篇

通过完整项目掌握前端 Agent 开发全流程。

| 序号 | 内容                | 文档                                             | 状态   |
| ---- | ------------------- | ------------------------------------------------ | ------ |
| 1    | 构建前端 Agent 应用 | [practice-agent-app.md](./practice-agent-app.md) | 已完成 |

涵盖：完整项目结构、AgentChat 主编排组件、开发检查清单、学习路线、推荐资源。

---

## 学习建议

1. **先理解 Agent 核心概念**：建议先阅读 [AI Agents 概述](../overview.md) 和 [工具调用](../tools-function-calling.md)，理解 Agent 的基本原理
2. **从通信协议入手**：SSE 和 Streaming 是前端 Agent 的基石，务必先掌握
3. **善用 Vercel AI SDK**：它封装了大量底层细节，是这个领域最成熟的前端库
4. **UI 设计是关键**：Agent 应用的用户体验取决于如何展示思考过程、工具调用和流式输出
5. **动手做项目**：最好的学习方式是构建一个完整的 Agent 对话应用

## 推荐资源

- [Vercel AI SDK 官方文档](https://sdk.vercel.ai/docs)
- [AI SDK RSC（React Server Components）](https://sdk.vercel.ai/docs/ai-sdk-rsc)
- [WebLLM - 浏览器端 LLM](https://github.com/mlc-ai/web-llm)
- [Chrome Built-in AI 早期预览](https://developer.chrome.com/docs/ai/built-in)
- [SSE 规范](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
