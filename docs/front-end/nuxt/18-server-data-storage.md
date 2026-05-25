# 服务端数据存储

> 本章介绍 Nuxt 服务端的数据存储方案，包括 KV 存储、数据库集成与文件存储。

## 一、useStorage (KV 存储)

### 1.1 什么是 useStorage？

Nitro 内置了基于 [unstorage](https://github.com/unjs/unstorage) 的 KV 存储系统，在服务端 API 和中间件中使用。

```ts
// server/api/counter.get.ts
export default defineEventHandler(async () => {
  const storage = useStorage()
  const count = (await storage.getItem('count')) || 0
  return { count }
})

// server/api/counter.post.ts
export default defineEventHandler(async () => {
  const storage = useStorage()
  const count = ((await storage.getItem('count')) || 0) + 1
  await storage.setItem('count', count)
  return { count }
})
```

### 1.2 多存储实例

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      // 默认（内存存储）
      default: { driver: 'memory' },

      // 文件存储
      data: { driver: 'fs', base: './data' },

      // Redis 存储
      cache: {
        driver: 'redis',
        host: 'localhost',
        port: 6379,
      },
    },
  },
})
```

```ts
// 使用命名存储
const cache = useStorage('cache')
await cache.setItem('posts', posts, { ttl: 3600 }) // 1小时过期

const data = useStorage('data')
await data.setItem('config', configData)
```

### 1.3 常用操作

```ts
const storage = useStorage()

// 设置
await storage.setItem('key', value)
await storage.setItem('key', value, { ttl: 3600 }) // 带过期时间

// 获取
const value = await storage.getItem('key')

// 判断存在
const exists = await storage.hasItem('key')

// 删除
await storage.removeItem('key')

// 清空
await storage.clear()

// 获取所有 key
const keys = await storage.getKeys('prefix:')
```

---

## 二、数据库集成

### 2.1 SQLite（文件数据库）

```bash
npm install better-sqlite3
```

```ts
// server/utils/db.ts
import Database from 'better-sqlite3'

let db: Database.Database

export function useDB() {
  if (!db) {
    db = new Database('./data/app.db')
    db.pragma('journal_mode = WAL')
    initTables()
  }
  return db
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
}
```

```ts
// server/api/posts/index.get.ts
export default defineEventHandler(() => {
  const db = useDB()
  return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all()
})

// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const body = await readBody(event)
  return db
    .prepare('INSERT INTO posts (title, content) VALUES (?, ?)')
    .run(body.title, body.content)
})
```

### 2.2 Drizzle ORM

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit
```

```ts
// server/utils/db.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const sqlite = new Database('./data/app.db')
export const db = drizzle(sqlite)

// 定义 schema
// server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// API 使用
import { db } from '../utils/db'
import { posts } from '../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get()
})
```

### 2.3 PostgreSQL / MySQL

使用 `pg` (PostgreSQL) 或 `mysql2`：

```ts
// server/utils/db.ts
import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!)

export { sql }

// server/api/users.get.ts
export default defineEventHandler(async () => {
  return await sql`SELECT * FROM users ORDER BY created_at DESC`
})
```

---

## 三、文件存储

### 3.1 读写文件

```ts
import { writeFile, readFile, unlink } from 'node:fs/promises'
import path from 'node:path'

// 写文件
await writeFile(
  path.join(process.cwd(), 'data', 'config.json'),
  JSON.stringify(config, null, 2)
)

// 读文件
const raw = await readFile(
  path.join(process.cwd(), 'data', 'config.json'),
  'utf-8'
)
const config = JSON.parse(raw)
```

### 3.2 使用 Nitro 的存储文件驱动

Nitro 内置的 `assets:server` 可以读取 `server/` 目录下的文件：

```ts
// server/api/config.get.ts
export default defineEventHandler(async () => {
  // 读取 server 目录下的文件
  const config = await useStorage().getItem('assets:server:data/config.json')
  return config
})
```

### 3.3 文件上传保存

```ts
// server/api/upload.post.ts
export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)

  for (const file of files || []) {
    if (!file.filename) continue

    const ext = path.extname(file.filename)
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${ext}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filepath, file.data)
    return { url: `/uploads/${filename}` }
  }
})
```

---

## 四、缓存策略

### 4.1 服务端 API 缓存

```ts
// server/api/posts.get.ts
export default defineEventHandler(async (event) => {
  const cache = useStorage('cache')
  const cacheKey = 'api-posts-list'

  // 检查缓存
  const cached = await cache.getItem(cacheKey)
  if (cached) {
    setHeader(event, 'X-Cache', 'HIT')
    return cached
  }

  // 查询数据
  const posts = await fetchPosts()
  await cache.setItem(cacheKey, posts, { ttl: 60 }) // 60 秒缓存

  setHeader(event, 'X-Cache', 'MISS')
  return posts
})
```

### 4.2 ISR / SWR 配合

缓存存储 + `routeRules` 的组合使用：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/api/trending/**': {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    },
  },
})
```

### 4.3 缓存失效（Cache Invalidation）

```ts
// server/api/admin/revalidate.post.ts
export default defineEventHandler(async (event) => {
  const cache = useStorage('cache')

  // 清除特定缓存
  await cache.removeItem('api-posts-list')
  await cache.removeItem('api-trending')

  // 清除前缀匹配的所有缓存
  const keys = await cache.getKeys('api-')
  for (const key of keys) {
    await cache.removeItem(key)
  }

  return { success: true, message: '缓存已清除' }
})
```
