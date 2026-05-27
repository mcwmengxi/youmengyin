# Agent 评估与测试

> Agent 的评估比传统软件测试更复杂，因为它涉及开放性决策和质量判断。

---

## 一、评估的挑战

| 挑战 | 说明 |
|------|------|
| 非确定性 | 相同输入可能产生不同输出 |
| 开放性 | 答案没有标准"正确" |
| 多维度 | 正确性、效率、安全性、用户体验 |
| 上下文依赖 | 评估依赖完整的对话历史 |
| 工具正确性 | 是否调用了正确的工具 |

---

## 二、评估维度与指标

### 1. 任务完成度

```python
class TaskCompletionEvaluator:
    """评估任务是否成功完成"""

    def evaluate(self, task: str, expected_outcome: dict,
                 actual_result: str) -> dict:
        """
        expected_outcome = {
            "should_contain": ["关键词1", "关键词2"],
            "should_not_contain": ["错误信息"],
            "format": "markdown",
            "data_constraints": {"min_length": 100}
        }
        """
        score = 1.0
        issues = []

        # 包含必要内容
        for keyword in expected_outcome.get("should_contain", []):
            if keyword not in actual_result:
                score -= 0.1
                issues.append(f"缺少关键内容: {keyword}")

        # 不包含禁止内容
        for keyword in expected_outcome.get("should_not_contain", []):
            if keyword in actual_result:
                score -= 0.2
                issues.append(f"包含不该有的内容: {keyword}")

        # 格式检查
        if expected_outcome.get("format"):
            if not self._check_format(actual_result, expected_outcome["format"]):
                score -= 0.1
                issues.append(f"格式不符合预期: {expected_outcome['format']}")

        return {
            "score": max(0, score),
            "issues": issues,
            "passed": score >= 0.7,
        }
```

### 2. LLM-as-Judge

```python
class LLMJudge:
    """用 LLM 评估 Agent 的输出质量"""

    JUDGE_PROMPT = """你是一位 Agent 质量评估专家。请评估以下 Agent 的执行质量。

## 用户任务
{task}

## Agent 执行过程
{execution_trace}

## 最终输出
{final_output}

## 评估标准（每项0-5分）
1. 正确性: 是否准确完成了用户任务？
2. 效率: 是否用最少的步骤完成了任务？
3. 工具使用: 是否选择了合适的工具？
4. 表达清晰度: 输出是否清晰易懂？
5. 安全性: 是否有潜在的安全风险？

请以 JSON 格式输出:
{{
  "scores": {{"correctness": 5, "efficiency": 4, ...}},
  "overall": 4.2,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": "..."
}}
"""

    def evaluate(self, task: str, execution_trace: str,
                 final_output: str) -> dict:
        prompt = self.JUDGE_PROMPT.format(
            task=task,
            execution_trace=execution_trace,
            final_output=final_output,
        )
        response = llm.invoke(prompt)
        return json.loads(response)
```

### 3. 关键指标

```python
class AgentMetrics:
    """Agent 性能指标收集"""

    def __init__(self):
        self.metrics = []

    def record_execution(self, task: str, iterations: int,
                         tokens_used: int, tools_called: list[str],
                         success: bool, latency_ms: float):
        self.metrics.append({
            "task": task,
            "iterations": iterations,
            "tokens_used": tokens_used,
            "tools_called": tools_called,
            "success": success,
            "latency_ms": latency_ms,
        })

    def get_summary(self) -> dict:
        """生成汇总统计"""
        total = len(self.metrics)
        if total == 0:
            return {}

        success_count = sum(1 for m in self.metrics if m["success"])
        avg_iterations = sum(m["iterations"] for m in self.metrics) / total
        avg_tokens = sum(m["tokens_used"] for m in self.metrics) / total
        avg_latency = sum(m["latency_ms"] for m in self.metrics) / total

        # 工具使用频率
        tool_freq = {}
        for m in self.metrics:
            for tool in m["tools_called"]:
                tool_freq[tool] = tool_freq.get(tool, 0) + 1

        return {
            "total_runs": total,
            "success_rate": f"{success_count/total*100:.1f}%",
            "avg_iterations": f"{avg_iterations:.1f}",
            "avg_tokens": f"{avg_tokens:.0f}",
            "avg_latency_ms": f"{avg_latency:.0f}",
            "tool_frequency": tool_freq,
        }
```

---

## 三、测试策略

### 1. 单元测试（工具级）

```python
import pytest

class TestTools:
    """工具单元测试"""

    @pytest.mark.asyncio
    async def test_weather_tool_valid_city(self):
        tool = WeatherTool()
        result = await tool.execute(city="北京")
        assert "北京" in result
        assert "温度" in result

    @pytest.mark.asyncio
    async def test_weather_tool_invalid_city(self):
        tool = WeatherTool()
        result = await tool.execute(city="不存在的城市")
        assert "未找到" in result

    @pytest.mark.asyncio
    async def test_calculator_safe(self):
        tool = CalculatorTool()
        result = await tool.execute(expression="2 + 3 * 4")
        assert "14" in result

    @pytest.mark.asyncio
    async def test_calculator_dangerous(self):
        tool = CalculatorTool()
        result = await tool.execute(expression="__import__('os').system('ls')")
        assert "出错" in result or "不允许" in result
```

### 2. 集成测试（Agent 级）

```python
class TestAgentIntegration:
    """Agent 集成测试"""

    @pytest.fixture
    def agent(self):
        return SimpleAgent(model="gpt-3.5-turbo", max_iterations=3)

    @pytest.mark.asyncio
    async def test_simple_weather_query(self, agent):
        """测试简单天气查询"""
        result = await agent.run("北京天气怎么样？")
        assert "北京" in result
        assert "天气" in result or "温度" in result

    @pytest.mark.asyncio
    async def test_multi_step_task(self, agent):
        """测试多步骤任务"""
        result = await agent.run("查北京和上海天气，然后算平均温度")
        # 至少应该调用了天气工具
        assert len(agent.execution_trace) >= 2

    @pytest.mark.asyncio
    async def test_no_tool_needed(self, agent):
        """测试不需要工具的场景"""
        result = await agent.run("你好")
        assert len(result) > 0
        # 不应该调用工具
        assert len(agent.execution_trace) == 0

    @pytest.mark.asyncio
    async def test_max_iterations_limit(self, agent):
        """测试最大迭代限制"""
        agent.max_iterations = 1
        result = await agent.run("帮我查北京、上海、深圳、广州、成都的天气")
        assert "无法" in result or "抱歉" in result or "限制" in result
```

### 3. 回归测试套件

```python
class RegressionTestSuite:
    """回归测试套件"""

    def __init__(self):
        self.test_cases = [
            {
                "id": "TC001",
                "task": "查北京天气",
                "expected_tools": ["get_weather"],
                "should_contain": ["北京", "天气|温度|度"],
            },
            {
                "id": "TC002",
                "task": "计算 100 的平方根",
                "expected_tools": ["calculate"],
                "should_contain": ["10"],
            },
            {
                "id": "TC003",
                "task": "北京温度25度，上海30度，差多少？",
                "expected_tools": ["get_weather", "get_weather", "calculate"],
                "should_contain": [r"\d+"],
            },
            {
                "id": "TC004",
                "task": "你好",
                "expected_tools": [],
            },
            {
                "id": "TC005",
                "task": "帮我发送邮件给admin@company.com，主题是测试，内容是Hello",
                "expected_tools": ["send_email"],
                "should_contain": ["发送|已发送"],
            },
        ]

    async def run_all(self, agent) -> dict:
        """运行所有回归测试"""
        results = {}
        for tc in self.test_cases:
            result = await self._run_test_case(agent, tc)
            results[tc["id"]] = result

        passed = sum(1 for r in results.values() if r["passed"])
        return {
            "total": len(results),
            "passed": passed,
            "failed": len(results) - passed,
            "details": results,
        }

    async def _run_test_case(self, agent, tc: dict) -> dict:
        """运行单个测试用例"""
        try:
            # 执行 Agent
            output = await agent.run(tc["task"], verbose=False)

            # 检查工具调用
            tools_called = agent.last_execution_tools
            expected = set(tc["expected_tools"])
            actual = set(tools_called)

            tools_match = expected == actual

            # 检查输出内容
            content_match = True
            if "should_contain" in tc:
                import re
                for pattern in tc["should_contain"]:
                    if not re.search(pattern, output):
                        content_match = False
                        break

            return {
                "passed": tools_match and content_match,
                "tools_expected": list(expected),
                "tools_actual": list(actual),
                "tools_match": tools_match,
                "content_match": content_match,
                "output_preview": output[:200],
            }
        except Exception as e:
            return {
                "passed": False,
                "error": str(e),
            }
```

---

## 四、评估框架

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| LangSmith | LangChain 官方，全链路追踪 | LangChain 项目 |
| Braintrust | 评估数据集管理，A/B 测试 | 专业 Agent 评估 |
| Ragas | RAG 评估专用 | RAG Agent |
| 自建 | 灵活，完全可控 | 特殊需求 |

---

## 五、评估最佳实践

1. **分层测试**: 工具 → Agent → 端到端
2. **测试数据集多样化**: 简单/复杂/边界/对抗性
3. **LLM-as-Judge 需要校准**: 先人工标注一批，验证 Judge 的准确性
4. **监控线上指标**: 成功率、延迟、用户反馈
5. **A/B 测试**: Prompt 调整后先小流量验证

---

## 总结

- Agent 评估是多维度的：**正确性 + 效率 + 安全性 + 体验**
- **分层测试**（工具→Agent→端到端）是最实用的策略
- **LLM-as-Judge** 适合开放性任务，但需要校准
- **回归测试套件**是防止性能退化的重要手段
- 评估不是一次性工作，需要随着 Agent 迭代持续进行