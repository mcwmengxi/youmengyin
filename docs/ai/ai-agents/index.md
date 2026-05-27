# AI Agents 开发实践学习路线图

> 系统学习 AI Agent 开发，从基础概念到框架实战，涵盖工具调用、记忆系统、多智能体协作等核心技术。

---

## 一、核心概念篇

理解 AI Agent 的基本原理与架构设计。

| 序号 | 内容                        | 文档                                                     | 状态   |
| ---- | --------------------------- | -------------------------------------------------------- | ------ |
| 1    | AI Agents 概述              | [overview.md](./overview.md)                             | 待完成 |
| 2    | Agent 架构模式              | [agent-architecture.md](./agent-architecture.md)         | 待完成 |
| 3    | 工具调用与 Function Calling | [tools-function-calling.md](./tools-function-calling.md) | 待完成 |
| 4    | 记忆系统                    | [memory-system.md](./memory-system.md)                   | 待完成 |
| 5    | 规划与推理                  | [planning-reasoning.md](./planning-reasoning.md)         | 待完成 |
| 6    | RAG + Agent 融合            | [rag-agent.md](./rag-agent.md)                           | 待完成 |
| 7    | 多智能体系统                | [multi-agent.md](./multi-agent.md)                       | 待完成 |

---

## 二、框架篇

掌握主流 Agent 开发框架的使用与原理。

| 序号 | 内容                  | 文档                                                  | 状态   |
| ---- | --------------------- | ----------------------------------------------------- | ------ |
| 1    | LangChain / LangGraph | [langchain-agent.md](./frameworks/langchain-agent.md) | 待完成 |
| 2    | AutoGen（Microsoft）  | [autogen.md](./frameworks/autogen.md)                 | 待完成 |
| 3    | CrewAI                | [crewai.md](./frameworks/crewai.md)                   | 待完成 |

---

## 三、实战篇

通过实战项目掌握 Agent 开发全流程。

| 序号 | 内容                   | 文档                                                    | 状态   |
| ---- | ---------------------- | ------------------------------------------------------- | ------ |
| 1    | 从零构建一个简单 Agent | [simple-agent.md](./practice/simple-agent.md)           | 待完成 |
| 2    | 完整 Agent 系统开发    | [full-agent-system.md](./practice/full-agent-system.md) | 待完成 |

---

## 四、高级篇

深入 Agent 开发的工程化与前沿话题。

| 序号 | 内容             | 文档                                                  | 状态   |
| ---- | ---------------- | ----------------------------------------------------- | ------ |
| 1    | Agent 评估与测试 | [evaluation.md](./advanced/evaluation.md)             | 待完成 |
| 2    | 安全与对齐       | [safety-alignment.md](./advanced/safety-alignment.md) | 待完成 |
| 3    | MCP 协议详解     | [mcp-protocol.md](./advanced/mcp-protocol.md)         | 待完成 |

---

## 学习建议

1. **先理解核心概念**：Agent 架构、工具调用、记忆系统是基础，务必先掌握
2. **边学边练**：每学完一个概念，用 LangChain 或原生 API 写一个简单 Agent 验证
3. **框架不是银弹**：理解底层原理后，再选框架会事半功倍
4. **关注 MCP 协议**：Anthropic 推出的 MCP 正在成为 Agent 与工具交互的行业标准
5. **动手做项目**：最好的学习方式是构建一个完整 Agent 系统

## 推荐资源

- [OpenAI Function Calling 文档](https://platform.openai.com/docs/guides/function-calling)
- [LangChain 官方文档](https://python.langchain.com/)
- [Anthropic MCP 协议](https://modelcontextprotocol.io/)
- [AutoGen 官方文档](https://microsoft.github.io/autogen/)
