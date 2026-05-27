# 工具调用与 Function Calling

> 工具调用（Tool Calling）是 Agent 区别于普通 LLM 的核心能力，让 Agent 能够与外部世界交互。

---

## 一、Function Calling 原理

Function Calling 让 LLM 能够输出结构化的函数调用请求，而非自然语言。

### 工作流程

```
用户输入 → LLM 判断是否需要调用工具
                ↓
        如果需要 → 输出函数名 + 参数(JSON)
                ↓
        代码执行函数 → 获取结果
                ↓
        将结果反馈给 LLM → 生成最终回复
```

### OpenAI Function Calling 示例

```python
import openai
import json

# 1. 定义工具（函数声明）
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如 北京"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "发送邮件",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {"type": "string", "description": "收件人邮箱"},
                    "subject": {"type": "string", "description": "邮件主题"},
                    "body": {"type": "string", "description": "邮件内容"}
                },
                "required": ["to", "subject", "body"]
            }
        }
    }
]

# 2. 实际实现函数
def get_weather(city: str, unit: str = "celsius") -> str:
    """模拟天气查询"""
    weather_data = {
        "北京": {"celsius": "晴天 25°C", "fahrenheit": "晴天 77°F"},
        "上海": {"celsius": "多云 28°C", "fahrenheit": "多云 82°F"},
    }
    return weather_data.get(city, {}).get(unit, "未找到该城市")

def send_email(to: str, subject: str, body: str) -> str:
    """模拟发送邮件"""
    print(f"发送邮件到 {to}: {subject}")
    return f"邮件已发送至 {to}"

# 3. 函数映射表
available_functions = {
    "get_weather": get_weather,
    "send_email": send_email,
}

# 4. Agent 运行循环
def run_agent(user_query: str):
    messages = [{"role": "user", "content": user_query}]

    # 第一次 LLM 调用
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=messages,
        tools=tools,
        tool_choice="auto",  # 自动决定是否调用工具
    )

    response_message = response.choices[0].message

    # 处理工具调用
    if response_message.tool_calls:
        messages.append(response_message)

        for tool_call in response_message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            # 执行函数
            function_response = available_functions[function_name](**function_args)

            # 将结果添加到消息中
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": function_response,
            })

        # 第二次 LLM 调用：基于工具结果生成回复
        final_response = openai.chat.completions.create(
            model="gpt-4",
            messages=messages,
        )
        return final_response.choices[0].message.content

    return response_message.content

# 测试
print(run_agent("北京今天天气怎么样？"))
print(run_agent("查一下上海天气，然后发邮件给boss@company.com告诉他们"))
```

---

## 二、Anthropic Claude Tool Use

```python
import anthropic

client = anthropic.Anthropic()

# Claude 的工具定义格式
tools = [
    {
        "name": "get_stock_price",
        "description": "获取股票实时价格",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "股票代码，如 AAPL"
                }
            },
            "required": ["symbol"]
        }
    }
]

# Claude 的 tool_use 和 tool_result 机制
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "苹果股价多少？"}]
)

# 处理 tool_use
for block in response.content:
    if block.type == "tool_use":
        result = execute_tool(block.name, block.input)
        # 反馈 tool_result
        ...
```

### OpenAI vs Anthropic 工具调用差异

| 特性 | OpenAI | Anthropic Claude |
|------|--------|------------------|
| 工具定义 | JSON Schema | JSON Schema |
| 调用格式 | `tool_calls` 数组 | `tool_use` content block |
| 结果反馈 | `role: "tool"` message | `tool_result` content block |
| 多工具同时调用 | 支持 | 支持 |
| 流式输出中调用 | 支持 | 支持 |

---

## 三、工具设计最佳实践

### 1. 清晰描述

```python
# 好的工具描述
{
    "name": "search_database",
    "description": "在用户数据库中搜索客户信息。支持按姓名、邮箱、手机号搜索。返回匹配的客户记录列表。",
    "parameters": {
        "query": {
            "type": "string",
            "description": "搜索关键词，可以是姓名、邮箱或手机号的一部分"
        },
        "limit": {
            "type": "integer",
            "description": "返回结果的最大数量，默认10，最大100"
        }
    }
}

# 不好的工具描述
{
    "name": "search",
    "description": "搜索东西",
    "parameters": {
        "q": {"type": "string", "description": "查询"}
    }
}
```

### 2. 错误处理

```python
def safe_tool_executor(tool_name: str, params: dict) -> str:
    """安全的工具执行器，统一处理错误"""
    try:
        tool = available_tools.get(tool_name)
        if not tool:
            return json.dumps({"error": f"未知工具: {tool_name}"})

        result = tool(**params)

        # 截断过长的结果
        if len(str(result)) > 10000:
            result = str(result)[:10000] + "...(结果已截断)"

        return str(result)

    except Exception as e:
        return json.dumps({
            "error": str(e),
            "suggestion": "请检查参数是否正确"
        })
```

### 3. 工具数量控制

```python
# 根据任务类型动态选择工具
def select_tools_for_task(task: str, all_tools: list) -> list:
    """根据任务描述选择相关工具，减少 context 占用"""
    # 使用 LLM 或规则筛选相关工具
    task_keywords = extract_keywords(task)
    relevant_tools = [
        t for t in all_tools
        if any(kw in t["function"]["description"] for kw in task_keywords)
    ]
    return relevant_tools[:5]  # 限制最多 5 个工具
```

---

## 四、MCP 协议（Model Context Protocol）

MCP 是 Anthropic 推出的标准化协议，让 LLM 和 Agent 以统一的方式发现和调用工具。

```
传统方式:                        MCP 方式:
┌─────┐                         ┌─────────┐
│Agent│──► API A (自定义)        │  Agent  │
│     │──► API B (自定义)        │   │     │
│     │──► DB   (自定义)    →    │   ▼     │
└─────┘                         │ MCP Client
                                 │   │
                                 │   ├──► MCP Server A (工具A)
                                 │   ├──► MCP Server B (工具B)
                                 │   └──► MCP Server C (数据库)
                                 └─────────┘
```

### MCP 核心概念

```python
# MCP Server 提供工具
class MCPServer:
    @tool
    def search_web(self, query: str) -> str:
        """搜索网络"""
        ...

    @tool
    def read_file(self, path: str) -> str:
        """读取文件"""
        ...

    @resource("file://documents/{name}")
    def get_document(self, name: str) -> str:
        """获取文档资源"""
        ...

# MCP Client 发现并调用工具
from mcp import ClientSession

async with ClientSession(server_url) as session:
    # 自动发现所有可用工具
    tools = await session.list_tools()

    # 调用工具
    result = await session.call_tool("search_web", {"query": "..."})
```

> MCP 协议是 Agent 工具调用的标准化方向，建议持续关注。详见高级篇 [MCP 协议详解](../advanced/mcp-protocol.md)。

---

## 五、工具调用策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| 串行调用 | 一次调用一个工具，等待结果 | 有依赖关系的操作 |
| 并行调用 | 同时调用多个不相关的工具 | 独立查询 |
| 条件调用 | 根据上一步结果决定是否调用 | 需要判断的场景 |
| 链式调用 | 前一个工具的输出作为下一个的输入 | 数据处理管道 |
| 重试机制 | 调用失败时自动重试 | 网络请求等不稳定场景 |

```python
# 并行调用示例（多个不相关的查询）
messages = [...]
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    parallel_tool_calls=True,  # 允许并行调用
)

# LLM 可能同时决定调用 get_weather, get_stock_price, get_news
# 这三个调用可以并行执行，减少总延迟
```

---

## 总结

- **Function Calling** 是 Agent 能力的核心扩展点
- 工具描述要**清晰、具体**，包含足够的上下文
- 做好**错误处理**，避免 Agent 因工具失败而卡住
- **MCP** 正在成为工具调用的行业标准
- 根据场景选择**串行/并行**策略优化性能