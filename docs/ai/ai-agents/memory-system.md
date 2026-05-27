# 记忆系统（Memory）

> 记忆系统是 Agent 持久化和利用历史信息的关键能力。没有记忆的 Agent 每次对话都是"失忆"的。

---

## 一、记忆的类型

```
┌─────────────────────────────────────────────┐
│              Agent 记忆系统                  │
│                                              │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  短期记忆    │  │     长期记忆          │  │
│  │ (上下文窗口) │  │  (向量数据库/知识库)   │  │
│  └─────────────┘  └──────────────────────┘  │
│                                              │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  工作记忆    │  │     情景记忆          │  │
│  │ (任务中间态) │  │  (历史交互记录)       │  │
│  └─────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────┘
```

| 记忆类型 | 存储位置 | 生命周期 | 用途 |
|----------|----------|----------|------|
| 短期记忆 | LLM 上下文窗口 | 当前对话 | 理解当前问题 |
| 工作记忆 | Agent 运行时 | 当前任务 | 跟踪执行进度 |
| 长期记忆 | 向量数据库 | 跨对话 | 记住用户偏好 |
| 情景记忆 | 数据库 | 永久 | 历史交互记录 |

---

## 二、短期记忆实现

### 1. 对话消息管理

```python
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage

class ShortTermMemory:
    def __init__(self, max_tokens: int = 4000):
        self.messages: list = []
        self.max_tokens = max_tokens

    def add_message(self, role: str, content: str):
        if role == "user":
            self.messages.append(HumanMessage(content=content))
        else:
            self.messages.append(AIMessage(content=content))
        self._trim_if_needed()

    def _trim_if_needed(self):
        """当总 token 超过限制时，裁剪最早的消息"""
        total = sum(len(m.content) for m in self.messages)
        while total > self.max_tokens and len(self.messages) > 2:
            removed = self.messages.pop(0)
            total -= len(removed.content)

    def get_context(self) -> list:
        return self.messages

# 使用
memory = ShortTermMemory(max_tokens=4000)
memory.add_message("user", "帮我分析这个数据")
memory.add_message("assistant", "好的，让我读取数据文件...")
memory.add_message("user", "重点关注销售趋势")
```

### 2. 摘要记忆（Summarization Memory）

当对话过长时，自动生成摘要来压缩历史。

```python
class SummarizationMemory:
    def __init__(self, llm, max_tokens: int = 2000):
        self.llm = llm
        self.max_tokens = max_tokens
        self.summary = ""
        self.recent_messages = []

    def add_message(self, role: str, content: str):
        self.recent_messages.append({"role": role, "content": content})

        # 检查是否需要摘要
        recent_tokens = sum(len(m["content"]) for m in self.recent_messages)
        if recent_tokens > self.max_tokens // 2:
            self._summarize()

    def _summarize(self):
        """将近期消息合并到摘要中"""
        conversation = "\n".join(
            f"{m['role']}: {m['content']}" for m in self.recent_messages
        )
        prompt = f"""请将以下对话内容总结为简洁的摘要，保留关键信息:

已有摘要: {self.summary}

新对话:
{conversation}

请生成更新后的摘要:"""

        self.summary = self.llm.invoke(prompt)
        self.recent_messages = []

    def get_context(self) -> str:
        return f"历史摘要:\n{self.summary}\n\n近期对话:\n" + \
               "\n".join(f"{m['role']}: {m['content']}" for m in self.recent_messages)
```

---

## 三、长期记忆实现（向量存储）

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.memory import VectorStoreRetrieverMemory

# 1. 初始化向量存储
embeddings = OpenAIEmbeddings()
vectorstore = Chroma(
    collection_name="agent_long_term_memory",
    embedding_function=embeddings,
)

# 2. 存储记忆
def store_memory(content: str, metadata: dict = None):
    """将重要信息存入长期记忆"""
    vectorstore.add_texts(
        texts=[content],
        metadatas=[metadata or {}]
    )

# 3. 检索相关记忆
def retrieve_relevant_memory(query: str, k: int = 3) -> list[str]:
    """根据当前查询检索相关的历史记忆"""
    docs = vectorstore.similarity_search(query, k=k)
    return [doc.page_content for doc in docs]

# 4. 使用示例
# 存储用户偏好
store_memory("用户张三偏好简洁的回答风格", {"user": "zhangsan"})
store_memory("张三正在做新能源汽车市场分析项目", {"user": "zhangsan", "project": "ev-analysis"})

# 下次对话时检索
retrieve_relevant_memory("帮我分析市场数据", k=3)
# → ["张三正在做新能源汽车市场分析项目", ...]
```

---

## 四、混合记忆系统

将多种记忆类型组合，构建完整的记忆系统。

```python
class HybridMemorySystem:
    """混合记忆系统：短期 + 长期 + 工作记忆"""

    def __init__(self, llm, embeddings):
        self.short_term = ShortTermMemory(max_tokens=4000)
        self.long_term = Chroma(embedding_function=embeddings)
        self.working_memory = {}  # 当前任务的中间状态

    def add_interaction(self, user_input: str, agent_response: str):
        """记录一次交互"""
        self.short_term.add_message("user", user_input)
        self.short_term.add_message("assistant", agent_response)

        # 判断是否值得存入长期记忆
        if self._should_remember(user_input, agent_response):
            self.long_term.add_texts([
                f"用户: {user_input}\n助手: {agent_response}"
            ])

    def _should_remember(self, user_input: str, response: str) -> bool:
        """判断是否值得存入长期记忆"""
        # 包含明确偏好、个人信息、重要决策的对话值得记忆
        important_keywords = ["偏好", "习惯", "项目", "目标", "不喜欢"]
        return any(kw in user_input + response for kw in important_keywords)

    def get_full_context(self, query: str) -> str:
        """获取完整上下文（短期 + 长期）"""
        # 1. 短期上下文
        recent = self.short_term.get_context()

        # 2. 检索相关长期记忆
        relevant = self.long_term.similarity_search(query, k=3)
        long_term_context = "\n".join(doc.page_content for doc in relevant)

        # 3. 工作记忆
        working = json.dumps(self.working_memory, ensure_ascii=False)

        return f"""## 相关历史记忆
{long_term_context}

## 当前任务状态
{working}

## 近期对话
{recent}"""

    def update_working_memory(self, key: str, value: any):
        """更新工作记忆"""
        self.working_memory[key] = value
```

---

## 五、记忆管理策略

### 1. 重要性评分

```python
class ImportanceBasedMemory:
    """基于重要性的记忆管理"""

    def calculate_importance(self, content: str) -> float:
        """计算一条记忆的重要性分数 (0-1)"""
        score = 0.0

        # 用户偏好
        if any(kw in content for kw in ["喜欢", "偏好", "习惯"]):
            score += 0.4

        # 任务相关
        if any(kw in content for kw in ["项目", "任务", "目标"]):
            score += 0.3

        # 决策信息
        if any(kw in content for kw in ["决定", "选择", "最终"]):
            score += 0.3

        return min(score, 1.0)

    def store_with_importance(self, content: str):
        score = self.calculate_importance(content)
        if score > 0.3:  # 只存储重要的
            self.vectorstore.add_texts(
                texts=[content],
                metadatas=[{"importance": score}]
            )
```

### 2. 遗忘机制

```python
class MemoryWithForgetting:
    """带遗忘机制的记忆系统"""

    def periodic_cleanup(self):
        """定期清理不重要的记忆"""
        all_memories = self.vectorstore.get()

        for memory in all_memories:
            # 计算"新鲜度"
            age_days = (now() - memory.last_accessed).days
            importance = memory.metadata.get("importance", 0.5)

            # 衰减公式: 不重要的旧记忆自然遗忘
            retention_score = importance * (0.9 ** age_days)

            if retention_score < 0.2:
                self.vectorstore.delete([memory.id])
```

---

## 六、各框架记忆实现对比

| 框架 | 短期记忆 | 长期记忆 | 特点 |
|------|----------|----------|------|
| LangChain | ConversationBufferMemory 等 | VectorStoreRetrieverMemory | 丰富的记忆类型 |
| AutoGen | 对话历史自动维护 | 需手动集成 | 简洁但灵活 |
| CrewAI | 内置短期记忆 | 需外接向量库 | 开箱即用 |
| 自建 | 完全自定义 | 完全自定义 | 最大灵活性 |

---

## 总结

- **短期记忆** 确保对话连贯，注意 token 窗口管理
- **长期记忆** 需要向量数据库支持，按相似度检索
- **重要性评估** 比无差别存储更有效
- **遗忘机制** 防止记忆膨胀
- 好的记忆系统是 Agent "人格化"的关键