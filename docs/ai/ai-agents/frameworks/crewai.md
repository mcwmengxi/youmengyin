# CrewAI 角色化 Agent 框架

> CrewAI 是一个以"角色"为中心的 Agent 框架，让开发者用"团队"的思维来构建 AI 应用。

---

## 一、CrewAI 核心概念

```
CrewAI 架构:
┌──────────────────────────────────────┐
│               Crew                   │
│  (团队 - 管理多个 Agent 协作)         │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │  Agent   │  │  Agent   │  ...    │
│  │ (角色)   │  │ (角色)   │         │
│  │ - Role   │  │ - Role   │         │
│  │ - Goal   │  │ - Goal   │         │
│  │ - Tools  │  │ - Tools  │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │  Task    │  │  Task    │  ...    │
│  │ - Agent  │  │ - Agent  │         │
│  │ - Context│  │ - Context│         │
│  └──────────┘  └──────────┘         │
└──────────────────────────────────────┘
```

### 与 AutoGen 的区别

| 特性 | CrewAI | AutoGen |
|------|--------|---------|
| 设计理念 | 角色 + 任务 | Agent 对话 |
| 控制流 | 预定义执行顺序 | 动态选择发言者 |
| 易用性 | 更简单直观 | 更灵活 |
| 适用场景 | 流水线式任务 | 需要多轮讨论的任务 |

---

## 二、基础示例：内容创作团队

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool

# === 定义工具 ===
search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()

# === 定义 Agent ===
researcher = Agent(
    role="资深研究员",
    goal="发现AI领域的最新突破性进展",
    backstory="""你是一位在顶级科技媒体工作了15年的资深研究员。
    你擅长从海量信息中快速定位最具价值的线索。
    你的工作风格是严谨、全面、追求第一手资料。""",
    tools=[search_tool, scrape_tool],
    verbose=True,
    allow_delegation=False,
)

writer = Agent(
    role="科技内容撰稿人",
    goal="将技术研究成果转化为引人入胜的文章",
    backstory="""你是一位获得过多项新闻奖的科技作家。
    你擅长将复杂的技术概念用生动的语言解释清楚。
    你的文章既有深度又有可读性。""",
    tools=[search_tool],  # 写作时也可以查资料
    verbose=True,
    allow_delegation=False,
)

editor = Agent(
    role="主编",
    goal="确保文章质量达到出版标准",
    backstory="""你是一位拥有20年经验的主编。
    你对文章的逻辑结构、语言表达和数据准确性有极高的要求。
    你有最终决定权。""",
    verbose=True,
    allow_delegation=True,  # 主编可以把任务委派给其他人
)

# === 定义 Task ===
research_task = Task(
    description="""研究2025年AI Agent领域的最新突破:
    1. 搜索最近3个月的AI Agent相关新闻和研究论文
    2. 找出3-5个最有影响力的进展
    3. 为每个进展整理关键信息和数据
    4. 标注信息来源""",
    agent=researcher,
    expected_output="一份包含3-5个AI Agent突破性进展的研究纪要，每条包含技术要点、影响分析和信息来源",
)

writing_task = Task(
    description="""基于研究纪要撰写一篇面向技术决策者的深度文章:
    1. 文章标题要有吸引力
    2. 开篇用场景化的语言引入
    3. 详细介绍每个突破的技术原理和商业价值
    4. 结尾给出行业展望和建议
    5. 文章长度: 2000-3000字""",
    agent=writer,
    context=[research_task],
    expected_output="一篇2000-3000字的深度技术文章，Markdown格式",
    output_file="agent_trends_2025.md",
)

editing_task = Task(
    description="""最终审核文章:
    1. 检查技术概念的准确性
    2. 检查数据和引用是否可靠
    3. 优化文章结构和语言表达
    4. 如发现问题，委派给writer修改""",
    agent=editor,
    context=[research_task, writing_task],
    expected_output="最终审核通过的文章，可发布",
)

# === 创建 Crew ===
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,
    verbose=True,
)

# === 启动 ===
result = crew.kickoff()
print(result)
```

---

## 三、Task 高级特性

### 1. 异步执行

```python
# 不需要依赖关系的任务可以异步并行
research_task_1 = Task(
    description="研究中国市场",
    agent=researcher,
    async_execution=True,  # 异步执行
)

research_task_2 = Task(
    description="研究美国市场",
    agent=researcher2,
    async_execution=True,  # 异步执行
)

# 这两个任务会并行执行
# 后续任务会等待它们都完成
```

### 2. 任务回调

```python
def on_task_complete(output):
    """任务完成后的回调"""
    print(f"任务完成: {output.summary}")
    # 可以记录日志、发送通知等

def on_task_start(task):
    """任务开始前的回调"""
    print(f"开始任务: {task.description}")

task = Task(
    description="分析市场数据",
    agent=analyst,
    callback=on_task_complete,
)
```

### 3. Human Input

```python
# 需要人类介入的任务
task = Task(
    description="设计产品定价策略",
    agent=strategist,
    human_input=True,  # 执行前需要人类确认
)
```

---

## 四、层级化 Crew

```python
# 子 Crew
research_crew = Crew(
    agents=[researcher, data_analyst],
    tasks=[search_task, analysis_task],
    process=Process.sequential,
)

# 主 Crew 使用子 Crew 的输出
main_crew = Crew(
    agents=[writer, editor],
    tasks=[
        Task(
            description="撰写报告",
            agent=writer,
            context=[research_crew.kickoff()],  # 使用子Crew的结果
        ),
        review_task,
    ],
)
```

---

## 五、自定义工具

```python
from crewai_tools import BaseTool
from pydantic import BaseModel, Field

class StockPriceInput(BaseModel):
    """股票查询工具的输入"""
    symbol: str = Field(description="股票代码，如 AAPL")

class StockPriceTool(BaseTool):
    """自定义股票查询工具"""
    name: str = "Stock Price Tool"
    description: str = "查询股票实时价格"
    args_schema: type[BaseModel] = StockPriceInput

    def _run(self, symbol: str) -> str:
        """实际执行逻辑"""
        # 调用股票API
        price = get_stock_price(symbol)
        return f"{symbol} 当前价格: ${price}"

# 给 Agent 使用
analyst = Agent(
    role="金融分析师",
    goal="分析股票市场",
    tools=[StockPriceTool()],
)
```

---

## 六、不同执行流程

```python
# Process.sequential: 顺序执行（默认）
crew = Crew(
    agents=[a, b, c],
    tasks=[t1, t2, t3],
    process=Process.sequential,
)
# 执行: t1 → t2 → t3

# Process.hierarchical: 层级执行
crew = Crew(
    agents=[manager, worker1, worker2],
    tasks=[t1, t2, t3],
    process=Process.hierarchical,
)
# Manager Agent 会动态分配任务给 worker
```

---

## 七、CrewAI vs 其他框架

| 特性 | CrewAI | AutoGen | LangGraph |
|------|--------|---------|-----------|
| 上手难度 | 低 | 中 | 中高 |
| 角色概念 | 核心（Role/Goal/Backstory） | 无（仅 name/system_message） | 无 |
| 任务依赖 | 内置（context参数） | 需手动管理 | 图边定义 |
| 并行执行 | 支持 | 需要自定义 | 原生支持 |
| 人类参与 | 内置 human_input | UserProxyAgent | interrupt |
| 内置工具 | 丰富（crewai_tools） | 少 | 丰富（langchain社区） |
| 适合团队 | 小团队快速原型 | 复杂多Agent场景 | 自定义流程 |

---

## 八、最佳实践

### 1. Backstory 设计

```python
# 好的 Backstory（具体，有角色感）
backstory = """你是一位在McKinsey工作了10年的战略顾问。
你擅长用MECE原则分析问题，用金字塔原理组织表达。
你总是在回答中标注可信度等级（高/中/低）。"""

# 不好的 Backstory（太笼统）
backstory = """你是一个助手，帮助用户解决问题。"""
```

### 2. Expected Output 明确化

```python
task = Task(
    description="分析市场趋势",
    agent=analyst,
    expected_output="""一份市场分析报告，包含:
    - 市场规模（数字 + 同比变化）
    - TOP5竞争对手分析（表格）
    - 3个关键趋势（每个100字说明）
    - 风险提示（3条，按严重程度排序）
    
    格式: Markdown""",
)
```

### 3. 错误处理

```python
try:
    result = crew.kickoff()
except Exception as e:
    # CrewAI 的异常通常包含详细的上下文
    print(f"执行失败: {e}")
    # 可以重试或降级处理
```

---

## 总结

- CrewAI 用**角色 + 任务**模型降低多 Agent 开发门槛
- **Backstory** 的质量直接影响 Agent 的表现
- **context** 参数实现任务间的依赖传递
- 适合**流水线式**协作任务
- 内置工具丰富，快速上手