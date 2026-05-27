# RAG + Agent 融合

> RAG（检索增强生成）+ Agent = "能查资料的 Agent"，是当前最实用的 Agent 模式之一。

---

## 一、RAG 基础回顾

```
传统 LLM                    RAG 系统
┌──────────┐              ┌──────────────┐
│  用户问题  │              │   用户问题     │
│    ↓     │              │      ↓        │
│   LLM    │              │  1.检索相关文档  │
│    ↓     │              │      ↓        │
│  回答    │              │  2.拼接上下文   │
└──────────┘              │      ↓        │
                          │  3.LLM 生成    │
                          │      ↓        │
                          │  回答（有据可依）│
                          └──────────────┘
```

### 基本 RAG 流程

```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

# 1. 加载文档
loader = TextLoader("knowledge_base.txt")
documents = loader.load()

# 2. 分割文档
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
chunks = text_splitter.split_documents(documents)

# 3. 向量化存储
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=OpenAIEmbeddings(),
)

# 4. 创建检索链
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
)

# 5. 查询
result = qa_chain.run("公司去年的营收是多少？")
```

---

## 二、Agentic RAG 架构

将 RAG 的能力赋予 Agent，让 Agent 自己决定何时检索、检索什么、如何利用检索结果。

```
Agentic RAG:
  用户问题 → Agent 判断是否需要检索
                ↓
            需要 → 生成检索查询 → 检索文档 → 分析结果
                ↓                              ↓
            不需要 ───────────────── 生成回答 ←─┘
```

### 实现

```python
class AgenticRAG:
    """具备自主检索能力的 Agent"""

    def __init__(self, llm, vectorstore):
        self.llm = llm
        self.vectorstore = vectorstore
        self.retriever = vectorstore.as_retriever()

    def should_retrieve(self, query: str) -> bool:
        """判断是否需要检索知识库"""
        prompt = f"""判断以下问题是否需要检索知识库来回答:

问题: {query}

回答 YES 或 NO:
- 如果问题是关于通用知识的，不需要检索
- 如果问题是关于特定文档/数据/公司内部信息的，需要检索"""
        
        response = self.llm.invoke(prompt)
        return "YES" in response.upper()

    def generate_search_queries(self, question: str) -> list[str]:
        """生成多个检索查询（多角度检索）"""
        prompt = f"""为以下问题生成 3 个不同的检索查询，以从知识库中找到最相关的信息:

问题: {question}

查询列表（每行一个）:"""
        response = self.llm.invoke(prompt)
        return [q.strip() for q in response.split("\n") if q.strip()]

    def retrieve(self, queries: list[str]) -> list[str]:
        """执行检索并去重"""
        all_docs = []
        seen = set()

        for query in queries:
            docs = self.retriever.get_relevant_documents(query)
            for doc in docs:
                if doc.page_content not in seen:
                    seen.add(doc.page_content)
                    all_docs.append(doc.page_content)

        return all_docs[:10]  # 限制上下文大小

    def generate_answer(self, question: str, context: list[str]) -> str:
        """基于检索结果生成答案"""
        context_str = "\n\n---\n\n".join(context)

        prompt = f"""基于以下参考资料回答用户问题。如果资料中没有相关信息，请明确说明。

参考资料:
{context_str}

用户问题: {question}

回答:"""
        return self.llm.invoke(prompt)

    def run(self, question: str) -> str:
        """主流程"""
        if not self.should_retrieve(question):
            return self.llm.invoke(question)

        # 多角度检索
        queries = self.generate_search_queries(question)
        context = self.retrieve(queries)

        # 生成答案
        return self.generate_answer(question, context)
```

---

## 三、高级 RAG 策略

### 1. Self-Reflective RAG

检索后自我反思，判断是否需要继续检索。

```python
class SelfReflectiveRAG(AgenticRAG):
    """自我反思的 RAG"""

    def run(self, question: str) -> str:
        context = []

        for iteration in range(3):  # 最多 3 轮检索
            # 生成当前轮的检索查询
            if not context:
                queries = self.generate_search_queries(question)
            else:
                # 基于已有上下文，找出信息缺口
                queries = self._find_gaps(question, context)

            # 检索
            new_docs = self.retrieve(queries)
            context.extend(new_docs)

            # 自检：信息是否充分？
            if self._is_sufficient(question, context):
                break

        return self.generate_answer(question, context)

    def _find_gaps(self, question: str, context: list[str]) -> list[str]:
        """找出信息缺口"""
        prompt = f"""当前已有信息:
{chr(10).join(context[:5])}

需要回答的问题: {question}

信息缺口是什么？请生成补充检索查询:"""
        response = self.llm.invoke(prompt)
        return [response]

    def _is_sufficient(self, question: str, context: list[str]) -> bool:
        """判断信息是否足够回答"""
        prompt = f"""以下信息是否足够回答该问题？回答 YES 或 NO。

问题: {question}
已有信息: {chr(10).join(context[:5])}

信息是否充分？"""
        response = self.llm.invoke(prompt)
        return "YES" in response.upper()
```

### 2. 层次化检索

```python
class HierarchicalRetrieval:
    """层次化检索：摘要检索 → 详细检索"""

    def retrieve_hierarchical(self, query: str) -> list[str]:
        # 阶段 1: 用问题检索文档摘要，找到相关文档
        summaries = self.summary_index.similarity_search(query, k=5)
        relevant_doc_ids = [s.metadata["doc_id"] for s in summaries]

        # 阶段 2: 在相关文档内做细粒度检索
        detailed_docs = self.chunk_index.similarity_search(
            query,
            k=10,
            filter={"doc_id": {"$in": relevant_doc_ids}},
        )

        return detailed_docs
```

---

## 四、RAG + Tool Calling 融合

```python
# 将 RAG 检索做成一个工具，融入 Agent 的工具调用体系
rag_tool = {
    "type": "function",
    "function": {
        "name": "search_knowledge_base",
        "description": "在企业内部知识库中搜索信息。适用于查询公司政策、产品文档、历史项目等信息。",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索查询。尽量使用关键词和短语。"
                },
                "topic": {
                    "type": "string",
                    "enum": ["policy", "product", "project", "technical", "all"],
                    "description": "搜索主题范围"
                }
            },
            "required": ["query"]
        }
    }
}

# Agent 使用 RAG 工具的场景
"""
用户: 公司去年的OKR完成情况如何？

Agent 思考: 这需要查询内部知识库
Agent 行动: search_knowledge_base(query="2024年OKR完成情况", topic="all")
Agent 观察: [检索到3份相关文档]
Agent 回答: 根据内部文档，2024年公司OKR完成率为...
"""
```

---

## 五、Graph RAG

使用知识图谱增强检索，处理实体之间的关系。

```python
# Graph RAG 概念示例
"""
传统 RAG: 我搜索"产品A的竞品" → 返回提到"产品A"和"竞品"的文档块

Graph RAG: 我搜索"产品A的竞品"
  → 在知识图谱中找到"产品A"实体
  → 沿着"竞品"关系找到"产品B"、"产品C"
  → 返回产品B和C的详细信息
  → 可以跨文档理解关系
"""

# Neo4j + LLM 实现示例
from langchain.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain

graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password",
)

chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
)

result = chain.run("产品A有哪些竞品？")
```

---

## 六、RAG 质量评估

```python
class RAGEvaluator:
    """RAG 质量评估"""

    def evaluate_retrieval(self, query: str, retrieved_docs: list[str],
                           ground_truth: list[str]) -> dict:
        """评估检索质量"""
        # Recall: 相关文档被检索到的比例
        retrieved_set = set(retrieved_docs)
        truth_set = set(ground_truth)
        recall = len(retrieved_set & truth_set) / len(truth_set)

        # Precision: 检索到的文档中相关文档的比例
        precision = len(retrieved_set & truth_set) / len(retrieved_set)

        return {
            "recall": recall,
            "precision": precision,
            "f1": 2 * recall * precision / (recall + precision) if recall + precision > 0 else 0
        }

    def evaluate_answer(self, query: str, answer: str,
                        context: list[str]) -> dict:
        """评估生成答案的质量"""
        prompt = f"""评估以下基于上下文的回答质量:

问题: {query}
上下文: {chr(10).join(context)}
回答: {answer}

请评分 (1-5):
1. 相关性: 回答是否与问题相关？
2. 忠实性: 回答是否忠实于上下文？（有无编造）
3. 完整性: 回答是否完整？"""
        
        response = self.llm.invoke(prompt)
        return self._parse_scores(response)
```

---

## 总结

- **Agentic RAG** 让 Agent 自主决定检索策略
- **多角度检索** + **自反思** 提升检索质量
- **RAG 作为 Agent 工具** 是最灵活的集成方式
- **Graph RAG** 适合有复杂实体关系的场景
- 评估是 RAG 系统的必备环节