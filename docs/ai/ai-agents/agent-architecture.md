# Agent 架构模式

> Agent 的架构决定了它如何思考、规划和执行任务。核心架构模式包括 ReAct、Plan-and-Execute、Reflection 等。

---

## 一、ReAct 模式（Reasoning + Acting）

**ReAct** = Reasoning（推理）+ Acting（行动），是 Agent 最经典的架构。Agent 交替进行"思考"和"行动"，逐步推进任务。

```
ReAct 循环:
  Thought → Action → Observation → Thought → Action → ... → Final Answer
```

### 执行流程

```
任务: "北京今天适合户外运动吗？"

Step 1:
  Thought: 我需要知道北京今天的天气和空气质量
  Action: search("北京今天天气")
  Observation: 晴天，18-25℃，微风

Step 2:
  Thought: 还需要了解空气质量
  Action: search("北京今天空气质量")
  Observation: AQI 45，优

Step 3:
  Thought: 已经有足够信息了
  Final Answer: 北京今天晴天，18-25℃，空气质量优，非常适合户外运动！
```

### ReAct Prompt 模板

```python
REACT_PROMPT = """你是一个能够使用工具的智能助手。请按照以下格式回答问题：

可用工具:
{tools}

使用格式:
Question: 用户的问题
Thought: 你应该思考该怎么做
Action: 要使用的工具名称
Action Input: 工具的输入参数
Observation: 工具返回的结果
... (这个 Thought/Action/Action Input/Observation 可以重复多次)
Thought: 我现在知道最终答案了
Final Answer: 对用户问题的最终回答

开始!
Question: {input}
{agent_scratchpad}
"""

# LangChain 实现示例
from langchain.agents import create_react_agent
from langchain.agents import AgentExecutor

agent = create_react_agent(llm, tools, REACT_PROMPT)
agent_executor = AgentExecutor(agent=agent, tools=tools)

result = agent_executor.invoke({"input": "北京今天天气怎么样？"})
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 简单直观，容易理解和实现 | 对于复杂任务，容易丢失全局目标 |
| LLM 原生支持 | 中间步骤可能偏离方向 |
| 适合大多数中等复杂度任务 | 缺乏全局规划 |

---

## 二、Plan-and-Execute 模式

先制定计划，再逐步执行。比 ReAct 更适合复杂任务。

```
Plan-and-Execute:
  Goal → Plan → Execute Step 1 → Execute Step 2 → ... → Summarize
```

### 执行流程

```
任务: "帮我分析新能源汽车市场并生成报告"

Plan 阶段:
  Step 1: 搜索 2025 年新能源汽车销量数据
  Step 2: 搜索主要车企市场份额
  Step 3: 搜索最新政策法规
  Step 4: 使用代码计算增长率
  Step 5: 生成分析报告

Execute 阶段:
  逐步骤执行，每步完成后记录结果
  如果某步失败，调整计划并重试
```

### 代码实现

```python
from langchain.agents import create_plan_and_execute_agent

# Planner: 制定计划
PLANNER_PROMPT = """
你是一个任务规划专家。请将以下任务分解为清晰的步骤。

任务: {input}

请以 JSON 格式输出计划:
{{
  "steps": [
    {{"step": 1, "description": "...", "tool": "..."}},
    ...
  ]
}}
"""

# Executor: 逐步执行
class PlanAndExecuteAgent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = tools

    def plan(self, task: str) -> list[dict]:
        """制定执行计划"""
        prompt = PLANNER_PROMPT.format(input=task)
        response = self.llm.invoke(prompt)
        return json.loads(response)["steps"]

    def execute_step(self, step: dict, context: dict) -> dict:
        """执行单个步骤"""
        # 选择并调用工具
        result = self.tools[step["tool"]](step["description"])
        return result

    def run(self, task: str) -> str:
        steps = self.plan(task)
        results = []
        for step in steps:
            result = self.execute_step(step, {"previous_results": results})
            results.append(result)
        return self.summarize(results)
```

### 优点 vs ReAct

| 维度 | ReAct | Plan-and-Execute |
|------|-------|------------------|
| 任务分解 | 边做边想 | 先规划后执行 |
| 全局视角 | 弱 | 强 |
| 灵活性 | 高 | 中 |
| 适合任务 | 简单到中等 | 复杂、多步骤 |
| Token 消耗 | 较低 | 较高 |

---

## 三、Reflection 模式（自我反思）

在行动之后加入自我评估环节，让 Agent 能够从错误中学习。

```
Think → Act → Observe → Reflect → Think → Act → ...
                           ↑
                    评估结果质量
                    发现错误并修正
```

### 实现

```python
REFLECTION_PROMPT = """
你刚才执行了以下任务:

任务: {task}
你的行动: {action}
执行结果: {result}

请反思:
1. 行动是否正确完成了任务？
2. 如果有问题，是什么问题？
3. 下一步应该怎么做？
"""

class ReflectiveAgent:
    def run(self, task: str) -> str:
        max_iterations = 5
        history = []

        for i in range(max_iterations):
            # 思考 + 行动
            action = self.think_and_act(task, history)
            result = self.execute(action)

            # 反思
            reflection = self.reflect(task, action, result)

            # 检查是否完成
            if reflection["is_complete"]:
                return reflection["final_answer"]

            history.append({
                "action": action,
                "result": result,
                "reflection": reflection,
            })

        return "未能完成任务"
```

---

## 四、ReWOO 模式（Reasoning WithOut Observation）

将推理和工具调用分离，先规划完整的工具调用链，再一次性执行。

```
ReWOO:
  Plan → Worker (并行执行工具) → Solver (汇总结果)
```

```python
# ReWOO 示例
"""
Plan: 我需要搜索新能源汽车销量和市场份额

#E1 = GoogleSearch("2025新能源汽车销量")
#E2 = GoogleSearch("2025车企市场份额")
#E3 = LLM("基于 #E1 和 #E2 的结果，分析市场格局")

Worker: 并行执行 #E1 和 #E2
Solver: 使用 #E3 汇总
"""
```

### 优势

- 减少 LLM 调用次数（不需要每步都调用 LLM）
- 并行执行工具调用，减少延迟
- 适合工具调用多但推理少的场景

---

## 五、架构选择指南

```
任务复杂度:
  低 ───────────────► ReAct
  中 ───────────────► ReAct + Reflection
  高 ───────────────► Plan-and-Execute
  极高（多角色） ───► Multi-Agent (后面的章节)

关键指标:
  - 需要全局规划 → Plan-and-Execute
  - 需要灵活应变 → ReAct
  - 需要自我纠错 → Reflection
  - 工具调用多 → ReWOO
```

---

## 六、架构模式总结

| 模式 | 核心思想 | 适合场景 | 典型框架 |
|------|----------|----------|----------|
| ReAct | 思考→行动交替 | 通用任务 | LangChain, OpenAI |
| Plan-and-Execute | 先规划后执行 | 复杂多步骤任务 | LangGraph, AutoGen |
| Reflection | 行动后自我评估 | 需要高准确率 | 自建 |
| ReWOO | 推理与观察分离 | 工具密集型任务 | 理论研究较多 |

> 实际开发中，一个好的 Agent 系统往往是多种模式的组合。例如，使用 Plan-and-Execute 做全局规划，每个步骤内部使用 ReAct 做灵活执行，配合 Reflection 做质量把关。