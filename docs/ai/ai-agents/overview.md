# AI Agents 概述

## 什么是 AI Agent？

AI Agent（人工智能代理）是一个能够**自主感知环境、做出决策并执行行动**的智能系统。它不仅仅是回答问题，而是能够使用工具、制定计划、执行多步骤任务来达成目标。

### Agent 与传统 LLM 的区别

| 特性 | 传统 LLM | AI Agent |
|------|----------|----------|
| 交互方式 | 单轮/多轮问答 | 自主多步行动 |
| 外部工具 | 无法调用 | 可以调用 API、数据库、文件系统等 |
| 记忆能力 | 仅对话上下文 | 短期+长期记忆 |
| 任务规划 | 无 | 可分解任务、制定执行计划 |
| 自主性 | 被动响应 | 主动执行 |

### 一个简单的 Agent 示例

```
用户: "帮我查一下北京今天的天气，如果下雨就提醒我带伞"

Agent 执行流程:
  Step 1: 理解意图 → 需要查询天气 + 条件判断
  Step 2: 调用天气 API → 获取北京天气数据
  Step 3: 分析结果 → "小雨转多云"
  Step 4: 条件判断 → "下雨" → 触发提醒
  Step 5: 返回最终结果 → "北京今天小雨转多云，记得带伞！"

传统 LLM 做法: 直接告诉你"请查询天气应用"（无法自己查）
```

---

## Agent 核心组件

```
┌─────────────────────────────────────────┐
│                AI Agent                  │
│  ┌──────────┐  ┌──────────────────┐     │
│  │  记忆     │  │  规划 (Planning) │     │
│  │ (Memory) │  │                  │     │
│  └──────────┘  └────────┬─────────┘     │
│                         │               │
│                    ┌────▼────┐          │
│                    │ 推理核心 │          │
│                    │  (LLM)  │          │
│                    └────┬────┘          │
│                         │               │
│  ┌──────────┐  ┌───────▼────────┐      │
│  │  工具     │  │  行动 (Action) │      │
│  │ (Tools)  │  │                │      │
│  └──────────┘  └────────────────┘      │
└─────────────────────────────────────────┘
```

### 1. 推理核心（LLM Brain）

LLM 是 Agent 的大脑，负责理解任务、制定计划、决策下一步行动。

```python
# 核心能力
class AgentBrain:
    def reason(self, task: str, context: dict) -> Action:
        """基于当前任务和上下文，决定下一步行动"""
        pass

    def plan(self, goal: str) -> list[Step]:
        """将复杂目标分解为可执行的步骤"""
        pass

    def reflect(self, result: str) -> Insight:
        """从执行结果中学习，调整后续策略"""
        pass
```

### 2. 记忆系统（Memory）

| 类型 | 说明 | 示例 |
|------|------|------|
| 短期记忆 | 当前对话/任务的上下文 | 用户刚才说了什么 |
| 长期记忆 | 持久化的知识/经验 | 之前任务的执行记录 |
| 工作记忆 | 当前任务执行中的中间状态 | 正在执行的步骤列表 |

### 3. 规划能力（Planning）

Agent 需要将复杂任务分解为可执行的子任务。

```
目标: "帮我做一份竞品分析报告"

规划:
  Step 1: 搜索竞品信息 → 使用搜索工具
  Step 2: 提取关键数据 → 使用数据处理工具
  Step 3: 生成对比表格 → 使用代码执行工具
  Step 4: 撰写分析报告 → 使用 LLM 总结
  Step 5: 输出格式化文档 → 使用文件工具
```

### 4. 工具使用（Tool Use）

Agent 通过调用外部工具来扩展能力边界。

```python
# 工具的类型
tools = {
    "search": WebSearchTool(),        # 网络搜索
    "calculator": CalculatorTool(),   # 数学计算
    "code_interpreter": CodeTool(),   # 代码执行
    "database": DatabaseTool(),       # 数据查询
    "file_system": FileSystemTool(),  # 文件读写
    "api_caller": APITool(),          # 外部 API
}
```

---

## Agent 的能力层级

```
Level 0: 规则引擎
  └─ if-else 逻辑，无 LLM
     示例: 传统客服机器人

Level 1: 简单工具调用
  └─ LLM + 单个工具调用
     示例: ChatGPT 联网搜索

Level 2: 链式工具调用
  └─ LLM + 多个工具串联调用
     示例: 搜索 → 提取 → 总结

Level 3: 规划与推理
  └─ 任务分解 + 多步执行 + 错误恢复
     示例: 自动完成复杂数据分析

Level 4: 多 Agent 协作
  └─ 多个 Agent 分工协作
     示例: 软件开发团队（PM Agent + Dev Agent + QA Agent）

Level 5: 完全自主
  └─ 持续学习 + 自我改进 + 长期目标管理
     示例: 未来的 AGI Agent
```

---

## 主流 Agent 框架对比

| 框架 | 开发方 | 语言 | 特点 | 适用场景 |
|------|--------|------|------|----------|
| LangChain/LangGraph | LangChain | Python/JS | 生态丰富，状态图编排 | 通用 Agent 开发 |
| AutoGen | Microsoft | Python | 多 Agent 对话式协作 | 复杂多角色任务 |
| CrewAI | CrewAI | Python | 角色化 Agent，易上手 | 团队协作场景 |
| Semantic Kernel | Microsoft | C#/Python | 企业级，Azure 集成 | 企业应用 |
| OpenAI Agents SDK | OpenAI | Python | 官方原生支持 | 快速原型 |
| Anthropic Claude | Anthropic | Python | MCP 协议 + Tool Use | 安全优先场景 |

---

## Agent 开发的挑战

| 挑战 | 说明 |
|------|------|
| 可靠性 | Agent 可能执行错误操作或陷入循环 |
| 成本控制 | 多步骤推理消耗大量 Token |
| 延迟 | 多工具调用链导致响应慢 |
| 安全 | Agent 可能执行危险操作 |
| 评估 | 难以量化 Agent 的表现质量 |
| 可观测性 | 难以 debug Agent 的决策过程 |

> 理解这些核心概念是构建高质量 Agent 的基础。接下来我们将深入每个组件和框架的具体实现。