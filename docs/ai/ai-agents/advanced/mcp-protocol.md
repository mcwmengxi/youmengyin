# MCP 协议详解

> MCP（Model Context Protocol）是 Anthropic 推出的开放协议，旨在标准化 AI 模型与外部工具、数据源的交互方式。

---

## 一、MCP 是什么？

```
传统集成方式:                      MCP 方式:

App ──► API A (自定义格式)        App ──► MCP Client
  └───► API B (另一种格式)                ├──► MCP Server A
  └───► DB   (直连)                      ├──► MCP Server B
                                          └──► MCP Server C
每个集成都需要定制开发              统一协议，一次集成，多处复用
```

MCP 就像是 AI 应用的 **USB-C 接口**：一个标准协议，连接各种工具和数据源。

---

## 二、MCP 核心概念

### 架构模型

```
┌─────────────────────────────────────────┐
│              Host (宿主应用)              │
│  ┌─────────────────────────────────┐    │
│  │         MCP Client               │    │
│  │  ┌──────────┐ ┌───────────────┐ │    │
│  │  │ Transport│ │ Protocol      │ │    │
│  │  │ (stdio/  │ │ Handler       │ │    │
│  │  │  SSE)   │ │               │ │    │
│  │  └──────────┘ └───────────────┘ │    │
│  └──────────────┬──────────────────┘    │
└─────────────────┼───────────────────────┘
                  │ JSON-RPC 2.0
       ┌──────────┼──────────┐
       ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ MCP      │ │ MCP      │ │ MCP      │
│ Server A │ │ Server B │ │ Server C │
│ (文件系统)│ │ (数据库)  │ │ (API)    │
└──────────┘ └──────────┘ └──────────┘
```

### 核心原语

| 原语 | 说明 | 示例 |
|------|------|------|
| **Tools** | 模型可调用的函数 | 搜索、计算、发送邮件 |
| **Resources** | 模型可读取的数据 | 文件内容、数据库记录 |
| **Prompts** | 预定义的 Prompt 模板 | 代码审查模板、翻译模板 |
| **Sampling** | Server 请求 LLM 生成 | Agent 请求子任务完成 |

---

## 三、MCP Server 开发

### Python MCP Server 示例

```python
# server.py - 一个简单的 MCP Server
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationCapabilities
import mcp.server.stdio
import mcp.types as types

# 1. 创建 Server
server = Server("my-agent-server")

# 2. 注册 Tools
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """返回可用工具列表"""
    return [
        types.Tool(
            name="search_web",
            description="搜索网页获取实时信息",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "搜索关键词"
                    },
                    "num_results": {
                        "type": "integer",
                        "description": "返回结果数量",
                        "default": 5,
                    }
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="read_file",
            description="读取本地文件内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "encoding": {"type": "string", "default": "utf-8"},
                },
                "required": ["path"],
            },
        ),
    ]

@server.call_tool()
async def handle_call_tool(
    name: str,
    arguments: dict,
) -> list[types.TextContent]:
    """处理工具调用"""
    if name == "search_web":
        query = arguments["query"]
        # 实际搜索逻辑
        result = f"搜索结果: 关于 '{query}' 的信息..."
        return [types.TextContent(type="text", text=result)]

    elif name == "read_file":
        path = arguments["path"]
        try:
            with open(path, "r") as f:
                content = f.read()
            return [types.TextContent(type="text", text=content)]
        except FileNotFoundError:
            return [types.TextContent(
                type="text",
                text=f"文件不存在: {path}"
            )]

    raise ValueError(f"未知工具: {name}")

# 3. 注册 Resources
@server.list_resources()
async def handle_list_resources() -> list[types.Resource]:
    """返回可用资源列表"""
    return [
        types.Resource(
            uri="file:///documents/report.txt",
            name="项目报告",
            description="最新的项目报告文档",
            mimeType="text/plain",
        ),
        types.Resource(
            uri="database://users/profile",
            name="用户信息",
            description="当前用户的档案数据",
            mimeType="application/json",
        ),
    ]

@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """读取资源内容"""
    if uri == "file:///documents/report.txt":
        return "这里是项目报告的内容..."
    elif uri == "database://users/profile":
        return '{"name": "张三", "level": "VIP"}'
    raise ValueError(f"未知资源: {uri}")

# 4. 注册 Prompts
@server.list_prompts()
async def handle_list_prompts() -> list[types.Prompt]:
    """返回可用的 Prompt 模板"""
    return [
        types.Prompt(
            name="code_review",
            description="代码审查 Prompt",
            arguments=[
                types.PromptArgument(
                    name="language",
                    description="编程语言",
                    required=True,
                ),
                types.PromptArgument(
                    name="code",
                    description="要审查的代码",
                    required=True,
                ),
            ],
        ),
    ]

@server.get_prompt()
async def handle_get_prompt(
    name: str,
    arguments: dict,
) -> types.GetPromptResult:
    """获取 Prompt 内容"""
    if name == "code_review":
        return types.GetPromptResult(
            messages=[
                types.PromptMessage(
                    role="user",
                    content=types.TextContent(
                        type="text",
                        text=f"请审查以下 {arguments['language']} 代码:\n\n{arguments['code']}"
                    ),
                )
            ]
        )
    raise ValueError(f"未知 Prompt: {name}")


# 5. 启动 Server
async def main():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationCapabilities(
                sampling={},
                experimental={},
            ),
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## 四、MCP Client 开发

```python
# client.py - MCP Client 使用示例
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def run_agent_with_mcp():
    """使用 MCP Client 连接 Server 并运行 Agent"""

    # 1. 创建到 MCP Server 的连接
    server_params = StdioServerParameters(
        command="python",
        args=["server.py"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # 2. 初始化
            await session.initialize()

            # 3. 列出可用工具
            tools = await session.list_tools()
            print(f"可用工具: {[t.name for t in tools.tools]}")

            # 4. 调用工具
            result = await session.call_tool(
                "search_web",
                arguments={"query": "Python MCP tutorial"}
            )
            print(f"搜索结果: {result.content[0].text}")

            # 5. 读取资源
            resources = await session.list_resources()
            content = await session.read_resource("file:///documents/report.txt")
            print(f"资源内容: {content}")

            # 6. 获取 Prompt 模板
            prompt = await session.get_prompt(
                "code_review",
                arguments={
                    "language": "python",
                    "code": "def hello(): print('world')"
                }
            )
            print(f"Prompt: {prompt.messages[0].content.text}")


# 7. 将 MCP 工具转为 OpenAI 格式
def mcp_tools_to_openai(mcp_tools: list) -> list[dict]:
    """将 MCP 工具转换为 OpenAI function calling 格式"""
    openai_tools = []
    for tool in mcp_tools:
        openai_tools.append({
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.inputSchema,
            }
        })
    return openai_tools


# 8. 完整的 MCP-Agent 循环
async def mcp_agent_loop(user_query: str):
    """结合 MCP 的 Agent 循环"""
    server_params = StdioServerParameters(
        command="python", args=["server.py"]
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # 获取 MCP 工具列表
            mcp_tools = await session.list_tools()
            openai_tools = mcp_tools_to_openai(mcp_tools.tools)

            messages = [{"role": "user", "content": user_query}]

            # Agent 循环
            for _ in range(5):
                response = openai.chat.completions.create(
                    model="gpt-4",
                    messages=messages,
                    tools=openai_tools,
                )

                msg = response.choices[0].message
                if not msg.tool_calls:
                    return msg.content

                # 通过 MCP 执行工具
                for tc in msg.tool_calls:
                    result = await session.call_tool(
                        tc.function.name,
                        arguments=json.loads(tc.function.arguments),
                    )
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": result.content[0].text if result.content else "",
                    })

            return "达到最大迭代次数"


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_agent_with_mcp())
```

---

## 五、MCP 传输方式

| 传输方式 | 说明 | 适用场景 |
|----------|------|----------|
| **stdio** | 标准输入输出 | 本地进程通信 |
| **SSE** | Server-Sent Events (HTTP) | 远程服务 |
| **WebSocket** | 双向通信 | 实时交互 |

```python
# stdio 传输（本地）
server_params = StdioServerParameters(
    command="python",
    args=["server.py"],
)

# SSE 传输（远程）
from mcp.client.sse import sse_client
async with sse_client("http://localhost:8000/sse") as (read, write):
    async with ClientSession(read, write) as session:
        ...
```

---

## 六、MCP 的优势

```
问题: 你有 N 个 LLM 应用和 M 个工具/数据源，如何高效集成？

传统: N × M 个集成                    MCP: N + M 个集成
┌─────┐  ┌─────┐  ┌─────┐            ┌─────┐  ┌─────┐  ┌─────┐
│ App1│  │ App2│  │ App3│            │ App1│  │ App2│  │ App3│
└──┬──┘  └──┬──┘  └──┬──┘            └──┬──┘  └──┬──┘  └──┬──┘
   │ ┌──────┘        │                  │       │       │
   ▼ ▼               ▼                  └───────┼───────┘
┌──┴───┴──┐     ┌───┴────┐                    │
│  DB     │     │  API    │              ┌─────▼─────┐
└─────────┘     └────────┘              │ MCP Layer │
                                        └─────┬─────┘
                                        ┌─────┼─────┐
                                        ▼     ▼     ▼
                                     ┌───┐ ┌───┐ ┌───┐
                                     │DB │ │API│ │FS │
                                     └───┘ └───┘ └───┘
```

---

## 七、MCP 生态现状

| 组件 | 状态 | 说明 |
|------|------|------|
| Python SDK | 稳定 | 官方维护 |
| TypeScript SDK | 稳定 | 官方维护 |
| Claude Desktop 集成 | 已支持 | 直接配置 MCP Server |
| 第三方 Server | 快速增长 | 文件系统、数据库、搜索等 |
| 规范 | v1.0 | 开放标准 |

---

## 八、未来展望

- **Agent-to-Agent 通信**: 多个 Agent 通过 MCP 互相调用
- **动态工具发现**: Agent 自动发现网络中可用的 MCP Server
- **工具市场**: 类似 App Store 的工具共享平台
- **与 A2A 协议互补**: Google 的 Agent-to-Agent 协议 + Anthropic 的 MCP = 完整 Agent 生态

---

## 总结

- MCP 是 **AI 应用与工具之间的标准化协议**
- **Client-Server 架构**，基于 JSON-RPC 2.0
- 支持 **Tools、Resources、Prompts** 三大原语
- **stdio 和 SSE** 两种传输方式覆盖本地和远程场景
- MCP 正在成为 Agent 工具调用的**行业标准**，建议所有 Agent 开发者关注