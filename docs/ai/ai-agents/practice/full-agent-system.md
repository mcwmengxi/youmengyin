# 完整 Agent 系统开发

> 从零构建一个生产级的"智能客服 + 数据分析"Agent 系统，涵盖架构设计、多工具集成、记忆系统、错误处理、流式输出。

---

## 一、系统架构

```
┌─────────────────────────────────────────────────┐
│              智能客服 Agent 系统                  │
│                                                  │
│  ┌──────────┐   ┌──────────┐   ┌─────────────┐ │
│  │ Web UI   │   │  API     │   │ 消息队列     │ │
│  │ (Chat)   │   │ Gateway  │   │ (异步任务)   │ │
│  └────┬─────┘   └────┬─────┘   └──────┬──────┘ │
│       └──────────────┼───────────────┘         │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐ │
│  │              Agent Core                   │ │
│  │  ┌─────────┐ ┌────────┐ ┌─────────────┐ │ │
│  │  │ Router  │ │Memory  │ │Tool Manager │ │ │
│  │  └─────────┘ └────────┘ └─────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│                      │                          │
│     ┌────────────────┼───────────────────┐     │
│     ▼                ▼                    ▼     │
│ ┌────────┐   ┌────────────┐   ┌────────────┐  │
│ │ LLM   │   │ Vector DB  │   │ External   │  │
│ │ Service│   │ (知识库)   │   │ APIs       │  │
│ └────────┘   └────────────┘   └────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 二、核心实现

### 1. 项目结构

```
agent-system/
├── agent/
│   ├── __init__.py
│   ├── core.py          # Agent 核心引擎
│   ├── tools/           # 工具模块
│   │   ├── __init__.py
│   │   ├── registry.py  # 工具注册
│   │   ├── database.py  # 数据库查询工具
│   │   ├── analytics.py # 数据分析工具
│   │   └── notification.py # 通知工具
│   ├── memory.py        # 记忆系统
│   ├── router.py        # 意图路由
│   └── prompts.py       # Prompt 模板
├── config.py            # 配置
├── server.py            # FastAPI 服务
└── requirements.txt
```

### 2. Agent 核心引擎

```python
# agent/core.py
import json
import asyncio
from typing import AsyncGenerator
from dataclasses import dataclass, field

@dataclass
class AgentConfig:
    model: str = "gpt-4"
    max_iterations: int = 5
    temperature: float = 0.1
    stream: bool = True
    max_tool_results_chars: int = 5000

class AgentCore:
    """Agent 核心引擎"""

    def __init__(self, config: AgentConfig, tool_manager, memory):
        self.config = config
        self.tools = tool_manager
        self.memory = memory

    async def run(self, user_id: str, query: str) -> AsyncGenerator[str, None]:
        """流式运行 Agent"""
        # 1. 加载用户记忆
        user_context = await self.memory.get_context(user_id)

        # 2. 构建初始消息
        messages = self._build_initial_messages(query, user_context)

        # 3. ReAct 循环
        iteration = 0
        while iteration < self.config.max_iterations:
            iteration += 1

            # 调用 LLM
            response = await self._call_llm(messages)

            # 如果有工具调用
            if response.tool_calls:
                # 执行工具
                tool_results = await self._execute_tools(response.tool_calls)

                # 添加工具结果到消息
                messages.append(response)
                for tr in tool_results:
                    messages.append(tr)

                # 流式输出中间状态（可选）
                yield f"[执行工具: {', '.join(tc.function.name for tc in response.tool_calls)}]\n"

            else:
                # 最终回复
                full_response = response.content

                # 存储到记忆
                await self.memory.add_interaction(user_id, query, full_response)

                yield full_response
                return

        yield "抱歉，任务未能完成。请尝试简化问题。"

    def _build_initial_messages(self, query: str, context: dict) -> list:
        """构建初始消息"""
        system_prompt = f"""你是一个智能客服 Agent。

能力:
- 查询数据库（订单、用户、产品信息）
- 数据分析（统计、图表生成）
- 发送通知（邮件、短信）

身份信息:
{json.dumps(context.get('user_info', {}), ensure_ascii=False)}

历史上下文:
{context.get('history', '无')}

请专业、准确地回答用户问题。如果不确定，请明确说明。"""

        return [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]

    async def _call_llm(self, messages: list) -> dict:
        """调用 LLM"""
        # 选择相关工具（减少 context）
        relevant_tools = self.tools.get_relevant_tools(messages)

        response = await openai.ChatCompletion.acreate(
            model=self.config.model,
            messages=messages,
            tools=relevant_tools,
            temperature=self.config.temperature,
        )
        return response.choices[0].message

    async def _execute_tools(self, tool_calls: list) -> list:
        """执行工具调用（支持并行）"""
        tasks = []
        for tc in tool_calls:
            tasks.append(self._execute_single_tool(tc))

        results = await asyncio.gather(*tasks)
        return results

    async def _execute_single_tool(self, tool_call) -> dict:
        """执行单个工具"""
        try:
            tool = self.tools.get(tool_call.function.name)
            args = json.loads(tool_call.function.arguments)
            result = await tool.execute(**args)

            # 截断过长结果
            result_str = str(result)
            if len(result_str) > self.config.max_tool_results_chars:
                result_str = result_str[:self.config.max_tool_results_chars] + "...(已截断)"

            return {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result_str,
            }
        except Exception as e:
            return {
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": f"工具执行失败: {str(e)}",
            }
```

### 3. 工具注册与管理

```python
# agent/tools/registry.py
from abc import ABC, abstractmethod
from typing import Any

class BaseTool(ABC):
    """工具基类"""

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @property
    @abstractmethod
    def parameters(self) -> dict:
        pass

    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        pass

    def to_openai_format(self) -> dict:
        """转换为 OpenAI tool 格式"""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            }
        }

class ToolRegistry:
    """工具注册表"""

    def __init__(self):
        self._tools: dict[str, BaseTool] = {}
        self._categories: dict[str, list[str]] = {}

    def register(self, tool: BaseTool, category: str = "general"):
        self._tools[tool.name] = tool
        if category not in self._categories:
            self._categories[category] = []
        self._categories[category].append(tool.name)

    def get(self, name: str) -> BaseTool:
        return self._tools.get(name)

    def get_all_openai_format(self) -> list[dict]:
        return [t.to_openai_format() for t in self._tools.values()]

    def get_relevant_tools(self, messages: list) -> list[dict]:
        """根据对话上下文选择相关工具（简化版：返回所有）"""
        # 生产环境中可实现智能筛选
        return self.get_all_openai_format()


# agent/tools/database.py
class DatabaseQueryTool(BaseTool):
    """数据库查询工具"""

    name = "query_database"
    description = "查询数据库中的订单、用户、产品信息。支持SQL查询。"

    parameters = {
        "type": "object",
        "properties": {
            "query_type": {
                "type": "string",
                "enum": ["order", "user", "product"],
                "description": "查询类型"
            },
            "filters": {
                "type": "object",
                "description": "查询过滤条件，如 {\"user_id\": 123, \"status\": \"completed\"}"
            }
        },
        "required": ["query_type"]
    }

    async def execute(self, query_type: str, filters: dict = None) -> str:
        """执行数据库查询"""
        # 模拟数据库查询
        mock_data = {
            "order": [
                {"id": 1001, "user_id": 123, "amount": 299, "status": "completed"},
                {"id": 1002, "user_id": 123, "amount": 599, "status": "pending"},
            ],
            "user": [
                {"id": 123, "name": "张三", "level": "VIP", "points": 5200},
            ],
            "product": [
                {"id": 1, "name": "智能音箱", "price": 299, "stock": 150},
                {"id": 2, "name": "无线耳机", "price": 599, "stock": 80},
            ]
        }

        data = mock_data.get(query_type, [])
        if filters:
            data = [
                d for d in data
                if all(d.get(k) == v for k, v in filters.items())
            ]

        return json.dumps(data, ensure_ascii=False, indent=2)


# agent/tools/analytics.py
class DataAnalyticsTool(BaseTool):
    """数据分析工具"""

    name = "analyze_data"
    description = "对数据进行分析，支持统计摘要、趋势分析等"

    parameters = {
        "type": "object",
        "properties": {
            "data": {
                "type": "string",
                "description": "要分析的数据（JSON格式）"
            },
            "analysis_type": {
                "type": "string",
                "enum": ["summary", "trend", "comparison"],
                "description": "分析类型"
            }
        },
        "required": ["data", "analysis_type"]
    }

    async def execute(self, data: str, analysis_type: str) -> str:
        """执行数据分析"""
        try:
            parsed = json.loads(data)
        except json.JSONDecodeError:
            return "错误: 无法解析数据"

        if analysis_type == "summary":
            return self._summary(parsed)
        elif analysis_type == "trend":
            return self._trend(parsed)
        else:
            return self._comparison(parsed)

    def _summary(self, data: list) -> str:
        """统计摘要"""
        if not data:
            return "无数据"

        numeric_fields = {}
        for item in data:
            for key, value in item.items():
                if isinstance(value, (int, float)):
                    if key not in numeric_fields:
                        numeric_fields[key] = []
                    numeric_fields[key].append(value)

        result = {"total_records": len(data), "fields": {}}
        for field, values in numeric_fields.items():
            result["fields"][field] = {
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
            }

        return json.dumps(result, ensure_ascii=False, indent=2)

    def _trend(self, data: list) -> str:
        """趋势分析（简化版）"""
        return f"趋势分析完成，数据点: {len(data)} 个"

    def _comparison(self, data: list) -> str:
        """对比分析（简化版）"""
        return f"对比分析完成，比较了 {len(data)} 个项目"
```

### 4. 记忆系统

```python
# agent/memory.py
import json
from datetime import datetime

class MemorySystem:
    """记忆系统（生产环境应使用 Redis + 向量数据库）"""

    def __init__(self):
        self.short_term = {}    # user_id → 对话历史
        self.user_profiles = {} # user_id → 用户画像
        self.max_history = 20   # 每用户保留最近 20 轮对话

    async def get_context(self, user_id: str) -> dict:
        """获取用户上下文"""
        profile = self.user_profiles.get(user_id, {})
        history = self.short_term.get(user_id, [])

        # 只保留最近 max_history 轮
        recent_history = history[-self.max_history:]

        return {
            "user_info": profile,
            "history": self._format_history(recent_history),
        }

    async def add_interaction(self, user_id: str, query: str, response: str):
        """记录一次交互"""
        if user_id not in self.short_term:
            self.short_term[user_id] = []

        self.short_term[user_id].append({
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "response": response[:500],  # 截断长回复
        })

        # 更新用户画像（简化版）
        self._update_profile(user_id, query, response)

    def _update_profile(self, user_id: str, query: str, response: str):
        """从对话中提取用户信息更新画像"""
        # 生产环境需要更智能的提取方式
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {}

    def _format_history(self, history: list) -> str:
        if not history:
            return "无历史对话"

        return "\n".join(
            f"用户: {h['query']}\n助手: {h['response'][:200]}"
            for h in history[-5:]  # 只展示最近 5 轮
        )
```

### 5. FastAPI 服务

```python
# server.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Agent System API")

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

# 初始化 Agent
config = AgentConfig(model="gpt-4", max_iterations=5)
tool_registry = ToolRegistry()
tool_registry.register(DatabaseQueryTool(), "data")
tool_registry.register(DataAnalyticsTool(), "analytics")
tool_registry.register(NotificationTool(), "notification")

memory = MemorySystem()
agent = AgentCore(config, tool_registry, memory)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """同步聊天接口"""
    result = ""
    async for chunk in agent.run(request.user_id, request.message):
        result += chunk
    return ChatResponse(response=result)


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """流式聊天接口"""
    async def generate():
        async for chunk in agent.run(request.user_id, request.message):
            yield f"data: {json.dumps({'content': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 三、关键设计决策

### 1. 流式 vs 非流式

```python
# 流式: 适合聊天场景，用户体验好
async for chunk in agent.run_stream(user_id, query):
    yield chunk

# 非流式: 适合 API 调用，需要完整结果
result = await agent.run_sync(user_id, query)
```

### 2. 同步 vs 异步工具

```python
# 工具执行策略
class ToolExecutor:
    async def execute_batch(self, calls: list) -> list:
        # 分类: 可并行 vs 必须串行
        independent = []
        dependent = []

        for call in calls:
            if self._has_dependency(call, calls):
                dependent.append(call)
            else:
                independent.append(call)

        # 并行执行独立调用
        results = await asyncio.gather(
            *[self._execute(c) for c in independent]
        )

        # 串行执行依赖调用
        for call in dependent:
            results.append(await self._execute(call))

        return results
```

### 3. 错误降级

```python
class GracefulDegradation:
    """优雅降级"""

    async def run_with_fallback(self, user_id: str, query: str):
        try:
            async for chunk in self.agent.run(user_id, query):
                yield chunk
        except LLMTimeoutError:
            yield "\n[LLM 响应超时，正在使用备用模型...]\n"
            async for chunk in self.fallback_agent.run(user_id, query):
                yield chunk
        except ToolExecutionError as e:
            yield f"\n[工具执行异常: {e}]\n"
            yield await self._generate_without_tools(user_id, query)
        except Exception:
            yield "\n抱歉，系统遇到了一个意外错误，请稍后重试。\n"
```

---

## 四、部署与监控

### 1. Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. 监控指标

```python
# 需要监控的关键指标
metrics = {
    "latency_p50": "50分位延迟",
    "latency_p95": "95分位延迟",
    "tool_call_success_rate": "工具调用成功率",
    "avg_iterations": "平均迭代轮次",
    "token_consumption": "Token 消耗量",
    "user_satisfaction": "用户满意度（点赞/踩）",
}
```

---

## 总结

构建一个完整的 Agent 系统需要考虑：
1. **核心引擎**: ReAct 循环 + 流式输出
2. **工具系统**: 注册机制 + 并行执行 + 安全控制
3. **记忆系统**: 短期 + 长期 + 用户画像
4. **服务化**: API 接口 + 流式响应
5. **运维**: 错误降级 + 监控 + 成本控制