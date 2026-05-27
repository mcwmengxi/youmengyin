# 多智能体系统

> 多智能体系统（Multi-Agent System）让多个 Agent 协作完成复杂任务，每个 Agent 扮演不同角色，分工协作。

---

## 一、多 Agent 协作模式

### 1. 顺序协作（Sequential）

```
Agent A → Agent B → Agent C → 结果

示例: 文章生成
  写作 Agent → 审校 Agent → 排版 Agent
```

### 2. 对话式协作（Conversational）

```
Agent A ⇄ Agent B
  ↓       ↓
多轮对话达成共识

示例: 方案评审
  方案 Agent ←→ 评审 Agent → 最终方案
```

### 3. 分层协作（Hierarchical）

```
        Boss Agent
       /    |    \
   Agent1 Agent2 Agent3
     任务分解 + 汇总

示例: 软件开发团队
  PM Agent → Dev Agent + QA Agent + DevOps Agent
```

### 4. 辩论模式（Debate）

```
Agent A 观点  ⇄  Agent B 反驳
         ↓
    裁判 Agent 裁决
```

---

## 二、多 Agent 系统的关键问题

### 1. 任务分配

```python
class TaskRouter:
    """将用户任务路由到合适的 Agent"""

    def route(self, task: str, agents: list[Agent]) -> Agent:
        prompt = f"""有以下专业 Agent:

{self._describe_agents(agents)}

任务: {task}

应该由哪个 Agent 处理？请返回 Agent 名称:"""
        response = llm.invoke(prompt)
        agent_name = response.strip()
        return self._find_agent(agent_name, agents)

    def _describe_agents(self, agents: list[Agent]) -> str:
        return "\n".join(
            f"- {a.name}: {a.description}" for a in agents
        )
```

### 2. 信息共享

```python
class SharedMemory:
    """多 Agent 共享记忆"""

    def __init__(self):
        self.global_context = {}  # 全局上下文
        self.messages = []         # 通信消息队列
        self.task_board = {}       # 任务状态看板

    def broadcast(self, from_agent: str, message: str):
        """广播消息给所有 Agent"""
        self.messages.append({
            "from": from_agent,
            "message": message,
            "timestamp": time.time(),
            "recipients": "all",
        })

    def send_to(self, from_agent: str, to_agent: str, message: str):
        """点对点消息"""
        self.messages.append({
            "from": from_agent,
            "to": to_agent,
            "message": message,
            "timestamp": time.time(),
        })

    def get_messages_for(self, agent_name: str) -> list:
        """获取发给特定 Agent 的消息"""
        return [
            m for m in self.messages
            if m.get("to") == agent_name
            or m.get("recipients") == "all"
        ]
```

### 3. 冲突解决

```python
class ConflictResolver:
    """当多个 Agent 产生冲突时，协调解决"""

    def resolve(self, agent_a_result: str, agent_b_result: str,
                task: str) -> str:
        prompt = f"""两个 Agent 对同一任务给出了不同的结果，请作为裁判判定。

任务: {task}

Agent A 的结果:
{agent_a_result}

Agent B 的结果:
{agent_b_result}

请分析两个结果的差异，并给出最终裁决:"""
        return llm.invoke(prompt)
```

---

## 三、AutoGen 多 Agent 示例

AutoGen 是微软推出的多 Agent 框架，核心是 Agent 之间的对话。

```python
import autogen

# 配置 LLM
config_list = [{"model": "gpt-4", "api_key": "your-key"}]

# 创建 Agent 角色
user_proxy = autogen.UserProxyAgent(
    name="User",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=3,
    code_execution_config={"work_dir": "coding"},
)

planner = autogen.AssistantAgent(
    name="Planner",
    system_message="你是项目规划专家，负责将任务分解为可执行的步骤。",
    llm_config={"config_list": config_list},
)

coder = autogen.AssistantAgent(
    name="Coder",
    system_message="你是软件开发工程师，负责编写高质量的代码。",
    llm_config={"config_list": config_list},
)

reviewer = autogen.AssistantAgent(
    name="Reviewer",
    system_message="你是代码审查专家，负责检查代码质量、安全性和正确性。",
    llm_config={"config_list": config_list},
)

# 创建群聊
groupchat = autogen.GroupChat(
    agents=[user_proxy, planner, coder, reviewer],
    messages=[],
    max_round=10,
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list},
)

# 启动多 Agent 协作
user_proxy.initiate_chat(
    manager,
    message="开发一个待办事项管理 API，支持增删改查和状态管理",
)
```

### AutoGen 执行流程

```
User → Manager → Planner: 制定开发计划
Planner → Manager: 计划: 1.设计数据模型 2.实现CRUD 3.添加状态管理
Manager → Coder: 请实现数据模型
Coder → Manager: [代码]
Manager → Reviewer: 请审查数据模型代码
Reviewer → Manager: 发现一个安全问题，建议修改
Manager → Coder: 根据审查意见修改
Coder → Manager: [修改后代码]
...
Manager → User: 完整的API代码已完成
```

---

## 四、CrewAI 角色化 Agent

CrewAI 用"角色"的概念组织 Agent。

```python
from crewai import Agent, Task, Crew, Process

# 定义研究 Agent
researcher = Agent(
    role="市场研究员",
    goal="深入调研新能源汽车市场，收集关键数据",
    backstory="你是一位经验丰富的市场研究员，擅长收集和分析行业数据",
    tools=[search_tool, web_scraper_tool],
    verbose=True,
)

# 定义分析师 Agent
analyst = Agent(
    role="数据分析师",
    goal="基于调研数据，进行深入分析，发现市场趋势",
    backstory="你是一位资深数据分析师，擅长从数据中发现洞察",
    tools=[code_interpreter_tool],
    verbose=True,
)

# 定义写作 Agent
writer = Agent(
    role="报告撰写人",
    goal="将分析结果整理成清晰、专业的市场分析报告",
    backstory="你是一位专业的商业报告撰写人，擅长将复杂信息转化为易读的报告",
    verbose=True,
)

# 定义任务
research_task = Task(
    description="搜索2025年新能源汽车市场的关键数据，包括销量、市场份额、政策",
    agent=researcher,
    expected_output="一份包含关键市场数据的调研文档",
)

analysis_task = Task(
    description="对收集到的数据进行深入分析，找出市场趋势和竞争格局",
    agent=analyst,
    context=[research_task],  # 依赖前一个任务的输出
    expected_output="一份数据分析报告，包含趋势和洞察",
)

writing_task = Task(
    description="基于分析结果，生成一份专业的市场分析报告",
    agent=writer,
    context=[research_task, analysis_task],
    expected_output="最终的市场分析报告（Markdown格式）",
)

# 创建 Crew
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential,  # 顺序执行
    verbose=True,
)

# 启动
result = crew.kickoff()
```

---

## 五、自定义多 Agent 框架

```python
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """Agent 基类"""

    def __init__(self, name: str, role: str, tools: list = None):
        self.name = name
        self.role = role
        self.tools = tools or []
        self.memory = []

    @abstractmethod
    def act(self, task: str, context: dict) -> str:
        """执行动作"""
        pass

class MultiAgentOrchestrator:
    """多 Agent 编排器"""

    def __init__(self):
        self.agents: dict[str, BaseAgent] = {}
        self.shared_memory = SharedMemory()
        self.execution_history = []

    def register(self, agent: BaseAgent):
        self.agents[agent.name] = agent

    def execute_sequential(self, tasks: list[dict]) -> str:
        """顺序执行：每个 Agent 顺序处理"""
        context = {}

        for task_item in tasks:
            agent = self.agents[task_item["agent"]]
            result = agent.act(task_item["task"], context)

            # 更新上下文
            context[agent.name] = result
            self.execution_history.append({
                "agent": agent.name,
                "task": task_item["task"],
                "result": result,
            })

        return self._summarize_results(context)

    def execute_debate(self, topic: str,
                       agent_a: str, agent_b: str,
                       judge: str, rounds: int = 3) -> str:
        """辩论模式"""
        context = {"topic": topic}

        for r in range(rounds):
            # Agent A 发表观点
            a_response = self.agents[agent_a].act(
                f"第{r+1}轮辩论 - {topic}",
                context
            )
            context["last_speaker"] = agent_a
            context["last_argument"] = a_response

            # Agent B 反驳
            b_response = self.agents[agent_b].act(
                f"反驳 {agent_a} 的观点: {a_response[:200]}",
                context
            )
            context["last_speaker"] = agent_b
            context["last_argument"] = b_response

        # 裁判裁决
        verdict = self.agents[judge].act(
            f"基于以下辩论做出裁决\nA: {context.get(agent_a, '')}\nB: {context.get(agent_b, '')}",
            context
        )
        return verdict

    def _summarize_results(self, context: dict) -> str:
        """汇总所有 Agent 的结果"""
        prompt = "请将以下 Agent 的结果汇总为一份完整的最终输出:\n\n"
        for agent_name, result in context.items():
            prompt += f"[{agent_name}]:\n{result}\n\n"
        return llm.invoke(prompt)
```

---

## 六、多 Agent 设计模式总结

| 模式 | 通信方式 | 控制流 | 适用场景 |
|------|----------|--------|----------|
| 顺序 | 单向传递 | 固定顺序 | 流水线任务 |
| 对话 | 多轮交互 | Manager 调度 | 复杂协作 |
| 层级 | 上下级 | Manager 分配 | 任务分解 |
| 辩论 | 对抗交流 | 裁判裁决 | 需要多方观点 |
| 黑板 | 共享黑板 | 自主读取 | 松耦合协作 |
| 市场 | 竞价/竞标 | 合同网协议 | 资源分配 |

---

## 七、多 Agent 的挑战

| 挑战 | 说明 | 缓解方案 |
|------|------|----------|
| 通信开销 | Agent 间消息传递增加延迟 | 减少不必要通信，使用共享内存 |
| 一致性 | 多 Agent 状态可能不一致 | 统一状态管理，事务机制 |
| 死锁 | 互相等待导致卡住 | 超时机制，死锁检测 |
| 发散 | 讨论偏离主题 | Manager 引导，话题锚定 |
| 成本 | 多个 LLM 调用成本高 | 小模型做简单任务，按需调度 |

> 多 Agent 系统是 AI Agent 发展的前沿方向。选对协作模式比堆砌 Agent 数量更重要。