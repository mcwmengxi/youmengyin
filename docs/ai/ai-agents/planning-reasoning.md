# 规划与推理

> 规划（Planning）和推理（Reasoning）是 Agent 处理复杂任务的核心能力，决定了 Agent 能否有效地分解目标、选择策略、应对变化。

---

## 一、任务分解（Task Decomposition）

将复杂目标拆解为可执行的子任务。

### 分解策略

```
复杂任务: "帮我做一份新能源汽车行业的竞品分析报告"

分解为子任务:
┌─────────────────────────────────────────────┐
│ 1. 搜索: 2025 年新能源汽车销量 TOP10        │
│ 2. 搜索: 各品牌技术路线和核心竞争力         │
│ 3. 搜索: 最新政策法规对行业的影响           │
│ 4. 分析: 对比各品牌优劣势                   │
│ 5. 总结: 生成 SWOT 分析                     │
│ 6. 输出: 生成格式化报告                     │
└─────────────────────────────────────────────┘
```

### 实现

```python
class TaskDecomposer:
    """任务分解器"""

    DECOMPOSE_PROMPT = """你是一个任务规划专家。请将以下复杂任务分解为 3-8 个可独立执行的子任务。

任务: {task}

要求:
1. 每个子任务应该是具体、可操作的
2. 子任务之间应该有清晰的依赖关系
3. 标明每个子任务需要的工具类型

输出 JSON 格式:
{{
  "subtasks": [
    {{
      "id": 1,
      "description": "...",
      "tool_type": "search|analysis|generate|...",
      "depends_on": []
    }}
  ]
}}
"""

    def decompose(self, task: str) -> list[dict]:
        prompt = self.DECOMPOSE_PROMPT.format(task=task)
        response = llm.invoke(prompt)
        plan = json.loads(response)
        return plan["subtasks"]
```

---

## 二、思维链（Chain of Thought, CoT）

让 LLM 在输出最终答案前，先"展示思考过程"。

### 标准 CoT

```python
COT_PROMPT = """请一步步思考，最后给出答案。

问题: {question}

请按照以下格式:
思考:
1. ...
2. ...
3. ...

答案: ..."""

# 示例
question = "一个水池有进水管和出水管，进水管3小时注满，出水管5小时放完，同时打开几小时注满？"

# LLM 输出:
"""
思考:
1. 进水管每小时注水 1/3 池
2. 出水管每小时放水 1/5 池
3. 同时打开，每小时净注水 = 1/3 - 1/5 = 2/15 池
4. 注满需要 1 ÷ (2/15) = 7.5 小时

答案: 7.5小时
"""
```

### Tree of Thoughts (ToT)

不只一条推理链，而是探索多条可能的思路。

```python
class TreeOfThoughts:
    """思维树：探索多条推理路径"""

    def generate_thoughts(self, problem: str, n: int = 3) -> list[str]:
        """生成 n 个不同的思考方向"""
        prompt = f"""针对以下问题，提出 {n} 个不同的思考方向:

问题: {problem}

请给出 {n} 种不同的思路:"""
        response = llm.invoke(prompt)
        return self._parse_thoughts(response)

    def evaluate_thought(self, thought: str, problem: str) -> float:
        """评估一个思路的可行性（0-1）"""
        prompt = f"""评估以下思路对于解决该问题的可行性:

问题: {problem}
思路: {thought}

请给出 0-1 的可行性评分和理由。"""
        response = llm.invoke(prompt)
        return self._parse_score(response)

    def search(self, problem: str, breadth: int = 3, depth: int = 3) -> str:
        """BFS 搜索最优推理路径"""
        current_thoughts = [{"thought": "", "score": 1.0, "path": []}]

        for d in range(depth):
            candidates = []
            for node in current_thoughts:
                # 为每个当前节点生成下一步思考
                new_thoughts = self.generate_thoughts(
                    f"{problem}\n当前推理: {' -> '.join(node['path'])}",
                    n=breadth
                )
                for t in new_thoughts:
                    score = self.evaluate_thought(t, problem)
                    candidates.append({
                        "thought": t,
                        "score": node["score"] * score,
                        "path": node["path"] + [t]
                    })

            # 保留前 breadth 个最优路径
            candidates.sort(key=lambda x: x["score"], reverse=True)
            current_thoughts = candidates[:breadth]

        # 返回最优路径
        return " -> ".join(current_thoughts[0]["path"])
```

---

## 三、Self-Consistency（自洽性）

对同一问题多次采样，取最一致的答案。

```python
class SelfConsistency:
    """通过多次采样取最一致答案来提高准确性"""

    def solve(self, problem: str, n_samples: int = 5, temperature: float = 0.7) -> str:
        answers = []

        for _ in range(n_samples):
            # 使用较高温度获得多样化的推理
            response = llm.invoke(
                problem,
                temperature=temperature
            )
            answer = self._extract_answer(response)
            answers.append(answer)

        # 投票：出现次数最多的答案
        from collections import Counter
        most_common = Counter(answers).most_common(1)[0][0]
        return most_common
```

---

## 四、RePrompt 与 Auto-Planning

### 动态 Re-Planning

执行过程中动态调整计划。

```python
class DynamicPlanner:
    """动态规划器：根据执行结果重新规划"""

    def __init__(self, llm):
        self.llm = llm
        self.plan = []
        self.completed = []

    def create_initial_plan(self, goal: str):
        """创建初始计划"""
        self.plan = self.decompose(goal)

    def execute_step(self, step_id: int) -> dict:
        """执行单个步骤"""
        step = self.plan[step_id]
        result = self._execute(step)

        # 检查是否需要重新规划
        if result["status"] == "failed":
            return self.replan(step_id, result)

        self.completed.append(step_id)
        return result

    def replan(self, failed_step: int, error: dict) -> list:
        """根据失败原因重新规划剩余步骤"""
        prompt = f"""原始任务执行失败，需要重新规划。

已完成步骤: {self.completed}
失败步骤: {self.plan[failed_step]}
失败原因: {error}

请为剩余任务制定新的执行计划:"""
        new_plan = self.llm.invoke(prompt)
        self.plan = self.plan[:failed_step] + new_plan
        return self.plan
```

---

## 五、结构化推理输出

### 使用 Pydantic 约束推理格式

```python
from pydantic import BaseModel, Field
from typing import Literal

class ReasoningStep(BaseModel):
    """推理步骤"""
    thought: str = Field(description="当前思考内容")
    action: Literal["search", "calculate", "analyze", "conclude"] = Field(
        description="要执行的操作类型"
    )
    action_input: str = Field(description="操作的具体输入")
    confidence: float = Field(ge=0, le=1, description="信心分数")

class ReasoningChain(BaseModel):
    """完整推理链"""
    problem: str
    steps: list[ReasoningStep]
    conclusion: str

# 使用 structured output
response = llm.invoke(
    problem,
    response_format=ReasoningChain
)
```

---

## 六、推理能力对比

| 方法 | 推理深度 | 计算成本 | 准确率提升 | 适用场景 |
|------|----------|----------|-----------|----------|
| 直接回答 | 浅 | 低 | 基准线 | 简单问题 |
| CoT | 中 | 中 | +10-20% | 中等推理 |
| Self-Consistency | 中 | 高 | +15-25% | 需要准确答案 |
| Tree of Thoughts | 深 | 很高 | +20-30% | 复杂搜索问题 |
| ReAct | 中 | 中 | +10-15% | 需要工具调用 |

---

## 总结

- **任务分解** 是处理复杂任务的第一步
- **CoT** 是最基础的推理增强，成本低效果好
- **ToT** 适合搜索空间大的问题
- **动态 Re-Planning** 让 Agent 能应对执行中的意外情况
- 推理方法的选择需要权衡**准确率 vs 成本**