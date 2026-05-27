# AutoGen 多 Agent 框架

> AutoGen 是微软推出的多 Agent 对话框架，核心思想是"让 Agent 通过对话协作完成任务"。

---

## 一、AutoGen 核心概念

### 核心组件

```
AutoGen 核心架构:
┌──────────────────────────────────────┐
│           AutoGen 应用                │
│                                      │
│  ┌──────────┐    ┌──────────────┐   │
│  │ Conversable│◄──►│ Conversation │   │
│  │  Agent    │    │   Protocol   │   │
│  └──────────┘    └──────────────┘   │
│                                      │
│  ┌──────────┐    ┌──────────────┐   │
│  │  Group    │    │    Tool      │   │
│  │  Chat     │    │  Execution   │   │
│  └──────────┘    └──────────────┘   │
└──────────────────────────────────────┘
```

### Agent 类型

| Agent 类型 | 说明 | 使用场景 |
|-----------|------|----------|
| ConversableAgent | 基础 Agent，可对话 | 通用场景 |
| AssistantAgent | LLM 驱动的助手 | 执行推理和生成 |
| UserProxyAgent | 代表用户，可执行代码 | 充当用户执行操作 |
| GroupChatManager | 管理群聊 | 协调多 Agent |

---

## 二、基础 AutoGen Agent

```python
import autogen

# 1. LLM 配置
llm_config = {
    "config_list": [
        {
            "model": "gpt-4",
            "api_key": "your-api-key",
        }
    ],
    "temperature": 0,
    "timeout": 120,
}

# 2. 创建 Agent
assistant = autogen.AssistantAgent(
    name="assistant",
    system_message="你是一个有帮助的AI助手，擅长编程",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: "TERMINATE" in x.get("content", ""),
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    },
)

# 3. 启动对话
user_proxy.initiate_chat(
    assistant,
    message="写一个Python函数计算斐波那契数列",
)
```

### 执行流程

```
UserProxy → Assistant: 写一个Python函数计算斐波那契数列
Assistant → UserProxy: [Python代码]
UserProxy: 执行代码
UserProxy → Assistant: [执行结果]
Assistant → UserProxy: 代码运行正确！斐波那契数列为...
UserProxy: TERMINATE
```

---

## 三、多 Agent 群聊（GroupChat）

```python
# 创建多个 Agent
planner = autogen.AssistantAgent(
    name="Planner",
    system_message="""你是项目规划专家。
    职责: 分析需求，制定实现计划，分配任务。
    只做规划，不写代码。""",
    llm_config=llm_config,
)

engineer = autogen.AssistantAgent(
    name="Engineer",
    system_message="""你是高级软件工程师。
    职责: 根据Planner的计划编写代码。
    代码要包含注释和错误处理。""",
    llm_config=llm_config,
)

reviewer = autogen.AssistantAgent(
    name="Reviewer",
    system_message="""你是代码审查专家。
    职责:
    1. 检查代码的安全性、性能和可维护性
    2. 发现bug和改进点
    3. 如果代码有问题，要求Engineer修改
    4. 代码通过审查后，回复'APPROVED'""",
    llm_config=llm_config,
)

executor = autogen.UserProxyAgent(
    name="Executor",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "project"},
    is_termination_msg=lambda x: "APPROVED" in x.get("content", ""),
)

# 创建群聊
groupchat = autogen.GroupChat(
    agents=[planner, engineer, reviewer, executor],
    messages=[],
    max_round=15,
    speaker_selection_method="auto",  # 自动选择下一个发言者
    allow_repeat_speaker=False,       # 不允许连续发言
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config=llm_config,
)

# 启动群聊
executor.initiate_chat(
    manager,
    message="开发一个简单的任务管理系统: 支持创建任务、分配任务、标记完成、查看统计",
)
```

### GroupChat 的执行流

```
Executor → Manager → [选择发言者]
Manager → Planner: 分析需求
Planner → Manager: [计划文档]
Manager → Engineer: 根据计划写代码
Engineer → Manager: [Python代码]
Manager → Executor: 执行代码
Executor → Manager: [执行结果: 成功]
Manager → Reviewer: 审查代码
Reviewer → Manager: 发现2个问题: 缺少输入验证、SQL注入风险
Manager → Engineer: 修复问题
Engineer → Manager: [修改后代码]
Manager → Reviewer: 再次审查
Reviewer → Manager: APPROVED
Manager → Executor: TERMINATE
```

---

## 四、自定义发言者选择策略

```python
def custom_speaker_selection(last_speaker, groupchat):
    """自定义发言者选择策略"""
    messages = groupchat.messages

    # 如果是 Planner → 下一步该 Engineer
    if last_speaker.name == "Planner":
        return groupchat.agent_by_name("Engineer")

    # 如果是 Engineer → 先执行代码，再审查
    if last_speaker.name == "Engineer":
        if "```python" in messages[-1]["content"]:
            return groupchat.agent_by_name("Executor")
        return groupchat.agent_by_name("Reviewer")

    # 如果是 Executor → 交给 Reviewer
    if last_speaker.name == "Executor":
        return groupchat.agent_by_name("Reviewer")

    # 如果是 Reviewer → 检查是否通过
    if last_speaker.name == "Reviewer":
        if "APPROVED" in messages[-1]["content"]:
            return None  # 结束对话
        return groupchat.agent_by_name("Engineer")

    # 默认自动选择
    return "auto"

# 使用自定义策略
groupchat = autogen.GroupChat(
    agents=[planner, engineer, reviewer, executor],
    messages=[],
    max_round=15,
    speaker_selection_method=custom_speaker_selection,
)
```

---

## 五、嵌套对话（Nested Chat）

一个 Agent 的回复可以触发另一个子对话。

```python
# 定义子对话：代码审查
reviewer_chat = {
    "recipient": reviewer,
    "message": "请审查以下代码",
    "max_turns": 2,
    "summary_method": "reflection_with_llm",
}

# 注册嵌套对话：Engineer 回复后自动触发审查
engineer.register_nested_chats(
    [reviewer_chat],
    trigger=executor,  # Executor 触发
)

# 执行时，Engineer 的每段代码都会自动经过审查
executor.initiate_chat(
    manager,
    message="开发一个REST API",
)
```

---

## 六、工具集成

```python
from typing import Annotated, Literal

# 定义工具函数
def search_web(
    query: Annotated[str, "搜索关键词"]
) -> str:
    """搜索网页"""
    # 实际搜索逻辑
    return f"搜索结果: 关于'{query}'的相关信息..."

def calculate(
    expression: Annotated[str, "数学表达式"]
) -> str:
    """计算数学表达式"""
    return str(eval(expression))

# 注册工具到 Agent
assistant = autogen.AssistantAgent(
    name="assistant",
    system_message="你是一个能搜索和计算的助手",
    llm_config={
        "config_list": config_list,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "search_web",
                    "description": "搜索网页获取信息",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string"}
                        },
                        "required": ["query"]
                    }
                }
            }
        ]
    }
)

# UserProxyAgent 执行工具
user_proxy = autogen.UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
)

# 注册工具执行函数
autogen.register_function(
    search_web,
    caller=assistant,
    executor=user_proxy,
    description="搜索网页获取信息",
)
```

---

## 七、AutoGen 最佳实践

### 1. 终止条件

```python
# 多种终止条件
def termination_msg(msg):
    """自定义终止判断"""
    content = msg.get("content", "")
    # 1. 显式终止信号
    if "TERMINATE" in content:
        return True
    # 2. 审批通过
    if "APPROVED" in content:
        return True
    # 3. 任务完成
    if "TASK_COMPLETE" in content:
        return True
    return False

user_proxy = autogen.UserProxyAgent(
    name="user",
    is_termination_msg=termination_msg,
    max_consecutive_auto_reply=10,  # 最大连续回复数
)
```

### 2. 缓存与成本控制

```python
llm_config = {
    "config_list": config_list,
    "cache_seed": 42,  # 缓存种子，相同输入复用结果
    "temperature": 0,
    "timeout": 60,      # 单次调用超时
}
```

### 3. 日志与调试

```python
import logging

# 开启详细日志
logging.basicConfig(level=logging.INFO)

# 或使用 AutoGen 的 runtime logging
autogen.runtime_logging.start()

# ... 执行 Agent ...

autogen.runtime_logging.stop()
```

---

## 八、AutoGen vs LangGraph 对比

| 维度 | AutoGen | LangGraph |
|------|---------|-----------|
| 核心抽象 | Agent 对话 | 状态图 |
| 控制流 | 对话驱动（自动选择发言人） | 图边驱动（显式定义） |
| 多 Agent | 原生支持，开箱即用 | 需要手动构建 |
| 代码执行 | UserProxyAgent 天然支持 | 需要 Tool 封装 |
| 学习曲线 | 中等 | 中等偏高 |
| 灵活性 | 中等 | 高 |
| 适合场景 | 多角色协作任务 | 复杂自定义流程 |

---

## 总结

- AutoGen 的核心理念是 **"Agent 之间的对话"**
- **GroupChat** + **Manager** 是多 Agent 协作的标准模式
- **NestedChat** 实现子任务自动流转
- 自定义**发言者选择策略**可以精确控制流程
- 适合需要多个专家角色协作的复杂场景