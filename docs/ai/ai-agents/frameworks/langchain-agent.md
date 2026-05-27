# LangChain / LangGraph Agent 开发

> LangChain + LangGraph 是构建 Agent 最流行的技术栈，提供了从简单链到复杂状态图的完整工具链。

---

## 一、LangChain Agent 概览

### LangChain 生态

```
LangChain
├── LangChain Core: 核心抽象（Chain, Tool, Prompt）
├── LangChain Community: 社区集成（各种工具和模型）
├── LangGraph: 状态图编排（构建复杂 Agent 流程）
├── LangSmith: 调试和监控平台
└── LangServe: 部署服务
```

### 传统 Chain vs Agent

```python
# 传统 Chain: 固定流程
from langchain.chains import LLMChain

chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run(input_text)
# 每次执行流程完全相同

# Agent: 动态决策
from langchain.agents import create_openai_functions_agent, AgentExecutor

agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)
result = executor.invoke({"input": input_text})
# LLM 自主决定是否使用工具、使用哪个工具
```

---

## 二、LangChain Agent 类型

### 1. OpenAI Functions Agent

```python
from langchain.agents import create_openai_functions_agent
from langchain.agents import AgentExecutor

# 推荐：最稳定、最常用的 Agent 类型
agent = create_openai_functions_agent(
    llm=ChatOpenAI(model="gpt-4"),
    tools=[search_tool, calculator_tool],
    prompt=hub.pull("hwchase17/openai-functions-agent"),
)

executor = AgentExecutor(
    agent=agent,
    tools=[search_tool, calculator_tool],
    verbose=True,
    max_iterations=5,
    handle_parsing_errors=True,
)

result = executor.invoke({"input": "2024年特斯拉营收是多少？比2023年增长了多少？"})
```

### 2. ReAct Agent

```python
from langchain.agents import create_react_agent

agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=REACT_PROMPT,
)
```

### 3. Structured Chat Agent

```python
from langchain.agents import create_structured_chat_agent

# 支持多参数工具
agent = create_structured_chat_agent(
    llm=llm,
    tools=tools,
    prompt=STRUCTURED_CHAT_PROMPT,
)
```

### 4. Tool Calling Agent（推荐用于最新模型）

```python
from langchain.agents import create_tool_calling_agent

agent = create_tool_calling_agent(
    llm=ChatOpenAI(model="gpt-4-turbo"),
    tools=tools,
    prompt=prompt,
)
```

---

## 三、LangGraph 核心概念

LangGraph 用**有向图**来定义 Agent 的控制流，比传统 Chain 更灵活。

### 基本概念

```
Graph:
  ├── State: 在节点间传递的状态（TypedDict）
  ├── Node: 图中的节点（函数/Agent）
  ├── Edge: 节点间的连接（普通边 或 条件边）
  └── Conditional Edge: 根据条件分叉
```

### 第一个 LangGraph

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
import operator

# 1. 定义状态
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]  # 自动追加消息
    next_step: str
    tool_results: dict

# 2. 定义节点
def chatbot(state: AgentState) -> AgentState:
    """LLM 节点：思考下一步"""
    response = llm.invoke(state["messages"])
    return {
        "messages": [response],
        "next_step": "continue" if response.tool_calls else "end"
    }

def tool_executor(state: AgentState) -> AgentState:
    """工具执行节点"""
    last_message = state["messages"][-1]
    results = {}

    for tool_call in last_message.tool_calls:
        tool = tools[tool_call["name"]]
        result = tool(**tool_call["args"])
        results[tool_call["name"]] = result

    return {"tool_results": results, "next_step": "continue"}

# 3. 条件路由
def should_continue(state: AgentState) -> str:
    """决定下一步"""
    if state["next_step"] == "end":
        return "end"
    return "tools" if state["messages"][-1].tool_calls else "chatbot"

# 4. 构建图
workflow = StateGraph(AgentState)

# 添加节点
workflow.add_node("chatbot", chatbot)
workflow.add_node("tools", tool_executor)

# 添加边
workflow.set_entry_point("chatbot")
workflow.add_conditional_edges(
    "chatbot",
    should_continue,
    {
        "chatbot": "chatbot",
        "tools": "tools",
        "end": END,
    }
)
workflow.add_edge("tools", "chatbot")

# 5. 编译并运行
app = workflow.compile()

result = app.invoke({
    "messages": [HumanMessage(content="帮我查一下北京天气")]
})
```

### 图的可视化

```
        ┌──────────┐
        │  chatbot  │◄──────────┐
        └────┬──────┘           │
             │                   │
    ┌────────▼────────┐         │
    │ should_continue  │         │
    │  (条件边)        │         │
    └──┬──────┬───────┘         │
       │      │                 │
       ▼      ▼                 │
   ┌──────┐ ┌──────┐           │
   │ END  │ │tools │───────────┘
   └──────┘ └──────┘
```

---

## 四、LangGraph 高级模式

### 1. 带记忆的图

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# 持久化 checkpoint
memory = SqliteSaver.from_conn_string(":memory:")
app = workflow.compile(checkpointer=memory)

# 使用 thread_id 来跟踪不同会话
config = {"configurable": {"thread_id": "user-session-1"}}

# 第一轮对话
result1 = app.invoke(
    {"messages": [HumanMessage(content="我叫小明")]},
    config=config,
)

# 第二轮对话（记住之前的信息）
result2 = app.invoke(
    {"messages": [HumanMessage(content="我叫什么名字？")]},
    config=config,
)
# → Agent 能记住用户叫小明
```

### 2. 并行执行节点

```python
from langgraph.graph import StateGraph

class ParallelState(TypedDict):
    query: str
    web_results: str
    db_results: str
    combined: str

def web_search(state: ParallelState) -> dict:
    return {"web_results": search_web(state["query"])}

def db_query(state: ParallelState) -> dict:
    return {"db_results": query_db(state["query"])}

def combine(state: ParallelState) -> dict:
    return {"combined": f"Web: {state['web_results']}\nDB: {state['db_results']}"}

workflow = StateGraph(ParallelState)
workflow.add_node("web_search", web_search)
workflow.add_node("db_query", db_query)
workflow.add_node("combine", combine)

workflow.set_entry_point("web_search")
workflow.set_entry_point("db_query")  # 多个入口 → 并行
workflow.add_edge("web_search", "combine")
workflow.add_edge("db_query", "combine")
workflow.add_edge("combine", END)

# 可视化:
#   web_search ──┐
#                ├──► combine → END
#   db_query ────┘
```

### 3. 子图嵌套

```python
# 将复杂功能封装为子图
def create_research_subgraph() -> StateGraph:
    """研究子图：搜索 → 提取 → 总结"""
    workflow = StateGraph(ResearchState)
    workflow.add_node("search", search_node)
    workflow.add_node("extract", extract_node)
    workflow.add_node("summarize", summarize_node)
    workflow.add_edge("search", "extract")
    workflow.add_edge("extract", "summarize")
    workflow.add_edge("summarize", END)
    return workflow.compile()

# 在主图中复用子图
main_workflow = StateGraph(MainState)
main_workflow.add_node("research", create_research_subgraph())
main_workflow.add_node("write_report", write_node)
main_workflow.add_edge("research", "write_report")
```

---

## 五、LangChain Agent 最佳实践

### 1. 错误处理

```python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5,              # 防止无限循环
    max_execution_time=30,         # 超时保护
    handle_parsing_errors=True,    # 自动处理格式错误
    early_stopping_method="generate",  # 达到最大迭代时生成最佳答案
    return_intermediate_steps=True,    # 返回中间步骤用于调试
)
```

### 2. 结构化输出

```python
from langchain.output_parsers import PydanticOutputParser

class AnalysisResult(BaseModel):
    sentiment: str = Field(description="情感: positive/negative/neutral")
    key_points: list[str] = Field(description="关键发现")
    confidence: float = Field(ge=0, le=1)

parser = PydanticOutputParser(pydantic_object=AnalysisResult)

agent = create_tool_calling_agent(
    llm=llm.bind(response_format=AnalysisResult),
    tools=tools,
    prompt=prompt,
)
```

### 3. 回调与监控

```python
from langchain.callbacks import StdOutCallbackHandler, FileCallbackHandler

callbacks = [
    StdOutCallbackHandler(),     # 控制台输出
    FileCallbackHandler("agent.log"),  # 记录到文件
]

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    callbacks=callbacks,
)
```

---

## 六、LangChain vs LangGraph 选择

| 场景 | 推荐工具 |
|------|----------|
| 简单 Agent（1-2 个工具） | LangChain AgentExecutor |
| 固定流程的任务 | LangChain Chain |
| 复杂控制流（条件、循环） | LangGraph |
| 需要持久化状态 | LangGraph + Checkpointer |
| 并行执行 | LangGraph |
| 人机协作（Human-in-the-loop） | LangGraph |
| 多 Agent 系统 | LangGraph |

---

## 总结

- **LangChain** 提供开箱即用的 Agent，适合快速开发
- **LangGraph** 提供灵活的状态图，适合复杂流程
- 两者可以配合使用：用 LangGraph 编排，内部节点使用 LangChain Agent
- **Checkpointer** 是 LangGraph 实现记忆和持久化的关键