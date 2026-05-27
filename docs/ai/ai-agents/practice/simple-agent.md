# 从零构建一个简单 Agent

> 不依赖任何框架，用纯 Python + OpenAI API 构建一个可调用工具的 Agent，深刻理解 Agent 的运行机制。

---

## 一、目标

构建一个**能查询天气、计算数学表达式的 Agent**，原生实现：

- 工具注册与调用
- ReAct 循环（Thought → Action → Observation）
- 错误处理
- 最大迭代保护

---

## 二、完整实现

```python
import openai
import json
import math
from datetime import datetime

# ============================================
# 1. 定义工具
# ============================================

def get_weather(city: str) -> str:
    """获取城市天气（模拟）"""
    weather_db = {
        "北京": {"temp": 25, "weather": "晴天", "humidity": "45%", "wind": "微风"},
        "上海": {"temp": 28, "weather": "多云", "humidity": "65%", "wind": "3级"},
        "深圳": {"temp": 30, "weather": "阵雨", "humidity": "80%", "wind": "4级"},
        "成都": {"temp": 22, "weather": "阴天", "humidity": "70%", "wind": "2级"},
    }

    info = weather_db.get(city)
    if not info:
        return f"未找到 {city} 的天气数据"

    return f"{city}: {info['weather']}, 温度 {info['temp']}°C, 湿度 {info['humidity']}, {info['wind']}"


def calculate(expression: str) -> str:
    """安全的数学计算"""
    # 只允许安全的数学函数
    allowed_names = {
        k: v for k, v in math.__dict__.items()
        if not k.startswith("__")
    }
    allowed_names.update({"abs": abs, "round": round, "min": min, "max": max})

    try:
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        return f"计算结果: {result}"
    except Exception as e:
        return f"计算出错: {str(e)}"


def get_current_time() -> str:
    """获取当前时间"""
    now = datetime.now()
    return f"当前时间: {now.strftime('%Y-%m-%d %H:%M:%S')}，星期{['一','二','三','四','五','六','日'][now.weekday()]}"


# ============================================
# 2. 工具注册表
# ============================================

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的实时天气信息，包括温度、天气状况、湿度和风力",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如 北京、上海"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "执行数学计算，支持基本的算术运算和常用数学函数（如 sin, cos, sqrt, log）",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式，如 '2 + 3 * 4' 或 'sqrt(144)'"
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "获取当前的日期、时间和星期",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    }
]

# 函数名 → 函数对象的映射
AVAILABLE_FUNCTIONS = {
    "get_weather": get_weather,
    "calculate": calculate,
    "get_current_time": get_current_time,
}


# ============================================
# 3. Agent 核心循环
# ============================================

class SimpleAgent:
    """简单的 ReAct Agent"""

    def __init__(self, model: str = "gpt-4", max_iterations: int = 5):
        self.model = model
        self.max_iterations = max_iterations

    def run(self, user_query: str, verbose: bool = True) -> str:
        """运行 Agent"""
        messages = [
            {
                "role": "system",
                "content": """你是一个能使用工具的智能助手。
请按以下方式工作:
1. 分析用户问题，判断是否需要使用工具
2. 如果需要，调用合适的工具
3. 基于工具返回的结果，生成最终答案
4. 如果不需要工具，直接回答"""
            },
            {"role": "user", "content": user_query}
        ]

        iteration = 0

        while iteration < self.max_iterations:
            iteration += 1

            if verbose:
                print(f"\n{'='*50}")
                print(f"第 {iteration} 轮思考...")
                print(f"{'='*50}")

            # 调用 LLM
            response = openai.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )

            response_message = response.choices[0].message

            # 检查是否有工具调用
            if not response_message.tool_calls:
                # 没有工具调用 → 最终答案
                if verbose:
                    print(f"\n✅ Agent 完成，无需工具调用")
                    print(f"回复: {response_message.content}")
                return response_message.content

            # 有工具调用 → 执行工具
            if verbose:
                print(f"\n🔧 Agent 决定调用 {len(response_message.tool_calls)} 个工具:")

            # 将 LLM 的响应加入消息历史
            messages.append(response_message)

            # 执行每个工具调用
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                if verbose:
                    print(f"  → {function_name}({function_args})")

                # 执行工具
                function_to_call = AVAILABLE_FUNCTIONS.get(function_name)
                if function_to_call:
                    try:
                        result = function_to_call(**function_args)
                    except Exception as e:
                        result = f"工具执行错误: {str(e)}"
                else:
                    result = f"错误: 未知工具 {function_name}"

                if verbose:
                    print(f"  ← 结果: {result[:100]}...")

                # 将工具结果加入消息历史
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result),
                })

        # 超过最大迭代次数
        return "抱歉，任务太复杂，无法在有限步骤内完成。请简化您的问题。"


# ============================================
# 4. 运行测试
# ============================================

if __name__ == "__main__":
    # 请确保设置了 OPENAI_API_KEY 环境变量
    agent = SimpleAgent(model="gpt-4", max_iterations=5)

    # 测试 1: 简单工具调用
    print("\n" + "="*60)
    print("测试 1: 查询天气")
    print("="*60)
    result = agent.run("北京今天天气怎么样？")
    print(f"\n最终答案: {result}")

    # 测试 2: 多步工具调用
    print("\n" + "="*60)
    print("测试 2: 多步计算")
    print("="*60)
    result = agent.run("北京的温度是25度，上海是28度，两个城市的平均温度是多少？")
    print(f"\n最终答案: {result}")

    # 测试 3: 不需要工具
    print("\n" + "="*60)
    print("测试 3: 普通问答")
    print("="*60)
    result = agent.run("什么是AI Agent？")
    print(f"\n最终答案: {result}")
```

---

## 三、执行输出示例

```
============================================================
测试 2: 多步计算
============================================================

==================================================
第 1 轮思考...
==================================================

🔧 Agent 决定调用 2 个工具:
  → get_weather({'city': '北京'})
  ← 结果: 北京: 晴天, 温度 25°C, 湿度 45%, 微风...
  → get_weather({'city': '上海'})
  ← 结果: 上海: 多云, 温度 28°C, 湿度 65%, 3级...

==================================================
第 2 轮思考...
==================================================

🔧 Agent 决定调用 1 个工具:
  → calculate({'expression': '(25 + 28) / 2'})
  ← 结果: 计算结果: 26.5...

==================================================
第 3 轮思考...
==================================================

✅ Agent 完成，无需工具调用

最终答案: 北京（25°C）和上海（28°C）的平均温度是 26.5°C。
```

---

## 四、关键设计要点

### 1. ReAct 循环的本质

```python
while not finished and iteration < max_iterations:
    # Step 1: 思考 → LLM 决定是否调用工具
    response = llm(messages, tools)

    # Step 2: 行动 → 执行 LLM 决定的工具
    if response.has_tool_calls:
        for tool_call in response.tool_calls:
            result = execute_tool(tool_call)
            messages.append(tool_result)

    # Step 3: 观察 → 工具结果自动加入下次 LLM 调用的上下文
    else:
        finished = True
        return response.content
```

### 2. 安全考虑

```python
# 工具安全原则:
# 1. 不允许直接执行任意代码
# 2. 限制计算器可用的数学函数
# 3. 所有工具调用都有错误处理
# 4. 不通过网络执行可能造成实际影响的操作（在实际项目中需要确认机制）

def safe_execute(function, args):
    """安全的工具执行"""
    try:
        # 参数验证
        validated_args = validate_args(function, args)
        # 执行
        return function(**validated_args)
    except ValidationError as e:
        return f"参数无效: {e}"
    except Exception as e:
        return f"执行失败: {e}"
```

### 3. 扩展工具

```python
# 添加新工具只需两步
# Step 1: 定义函数
def send_email(to: str, subject: str, body: str) -> str:
    """发送邮件"""
    # 实际发送逻辑
    return f"邮件已发送至 {to}"

# Step 2: 注册到工具表和函数表
TOOLS.append({...})  # 添加工具定义
AVAILABLE_FUNCTIONS["send_email"] = send_email  # 添加函数映射
```

---

## 五、从简单 Agent 到生产级 Agent

| 当前实现 | 生产级需要 |
|----------|-----------|
| 单次执行 | 流式输出（streaming） |
| 同步调用 | 异步调用 + 并行工具执行 |
| 无记忆 | 短期 + 长期记忆 |
| 硬编码工具 | 动态工具发现（MCP） |
| 控制台日志 | 结构化监控（LangSmith等） |
| 无评估 | 自动评估 + A/B 测试 |

---

## 总结

通过这个简单 Agent，你理解了：
1. **ReAct 循环**是 Agent 的核心机制
2. **工具注册 + 函数映射**是实现工具调用的关键
3. **消息历史管理**决定了 Agent 的上下文
4. **错误处理 + 迭代限制**是安全性和可靠性的基本保障

> 掌握手工实现后，再使用框架会更清楚每个参数背后的含义。接下来看看如何构建一个更完整的 Agent 系统。