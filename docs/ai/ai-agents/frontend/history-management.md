# Agent 对话历史管理

> 使用 IndexedDB 实现 Agent 对话历史的持久化存储，支持会话的增删改查和恢复。

---

## IndexedDB 持久化方案

```typescript
class AgentHistoryManager {
  private dbName = 'agent-history'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onupgradeneeded = () => {
        const db = request.result

        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' })
          sessionsStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }

        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id' })
          messagesStore.createIndex('sessionId', 'sessionId', { unique: false })
          messagesStore.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  async saveSession(session: AgentSession): Promise<void> {
    if (!this.db) await this.init()

    const tx = this.db!.transaction(['sessions', 'messages'], 'readwrite')

    tx.objectStore('sessions').put({
      id: session.id,
      title: session.messages[0]?.content.slice(0, 50) || '新对话',
      status: session.status,
      messageCount: session.messages.length,
      createdAt: session.messages[0]?.createdAt || Date.now(),
      updatedAt: Date.now()
    })

    const messagesStore = tx.objectStore('messages')
    for (const message of session.messages) {
      messagesStore.put({
        id: message.id,
        sessionId: session.id,
        role: message.role,
        content: message.content,
        toolInvocations: message.toolInvocations || [],
        createdAt: message.createdAt
      })
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async loadSession(sessionId: string): Promise<AgentSession | null> {
    if (!this.db) await this.init()

    const tx = this.db!.transaction(['sessions', 'messages'], 'readonly')

    const sessionData = await new Promise<any>((resolve) => {
      const request = tx.objectStore('sessions').get(sessionId)
      request.onsuccess = () => resolve(request.result)
    })

    if (!sessionData) return null

    const messages = await new Promise<AgentMessage[]>((resolve) => {
      const request = tx.objectStore('messages')
        .index('sessionId')
        .getAll(sessionId)
      request.onsuccess = () => resolve(request.result)
    })

    return {
      id: sessionData.id,
      status: 'idle',
      messages: messages.sort((a, b) => a.createdAt - b.createdAt),
      thinkingSteps: [],
      toolCalls: []
    }
  }

  async getAllSessions(): Promise<Array<{ id: string; title: string; updatedAt: number }>> {
    if (!this.db) await this.init()

    return new Promise((resolve) => {
      const request = this.db!.transaction('sessions', 'readonly')
        .objectStore('sessions')
        .getAll()
      request.onsuccess = () => {
        resolve(
          request.result.sort((a, b) => b.updatedAt - a.updatedAt)
        )
      }
    })
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.db) await this.init()

    const tx = this.db!.transaction(['sessions', 'messages'], 'readwrite')
    tx.objectStore('sessions').delete(sessionId)

    const messageStore = tx.objectStore('messages')
    const messagesRequest = messageStore.index('sessionId').getAllKeys(sessionId)
    messagesRequest.onsuccess = () => {
      for (const key of messagesRequest.result) {
        messageStore.delete(key)
      }
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}
```

---

## 数据库设计

| 表 | 主键 | 索引 | 说明 |
|----|------|------|------|
| sessions | id | updatedAt | 会话元数据 |
| messages | id | sessionId, createdAt | 消息数据 |

### 为什么选择 IndexedDB

| 方案 | 容量 | 结构化 | 异步 | 适用场景 |
|------|------|--------|------|----------|
| localStorage | 5MB | 否 | 同步 | 简单配置 |
| IndexedDB | 数百MB+ | 是 | 异步 | 大量结构化数据 |
| OPFS | 数百MB+ | 文件系统 | 异步 | 二进制文件、模型 |

对于 Agent 对话历史，IndexedDB 是最佳选择：容量大、支持索引查询、异步不阻塞 UI。