# 服务端 API 与 Nitro 3

> 本章讲解 Nuxt 4 中基于 Nitro 3 的服务端 API 开发，包括路由定义、中间件、数据库集成和部署平台。

## 一、Nitro 3 概述

Nitro 3 是 Nuxt 4 的服务端引擎，默认使用 `unjs/h3`：

- **跨平台部署**：Node.js、Bun、Deno、Cloudflare Workers、Vercel 等
- **文件系统路由**：`server/api/` 自动映射为 API 路由
- **热更新**：API 修改即时生效
- **可移植性**：构建为 `.output/` 通用格式

---

## 二、API 路由

### 2.1 基础 API 路由

```ts
// server/api/hello.get.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nuxt 4!',
    time: new Date().toISOString(),
  }
})
```

访问 `GET /api/hello` 返回 JSON。

### 2.2 支持的请求方法

```ts
// server/api/users.get.ts    → GET    /api/users
// server/api/users.post.ts   → POST   /api/users
// server/api/users.put.ts    → PUT    /api/users
// server/api/users.delete.ts → DELETE /api/users
// server/api/users.patch.ts  → PATCH  /api/users

// 或在一个文件中处理多种方法:
// server/api/users.ts
export default defineEventHandler((event) => {
  const method = event.method

  if (method === 'GET')    return handleGet(event)
  if (method === 'POST')   return handlePost(event)
  if (method === 'DELETE') return handleDelete(event)
})
```

### 2.3 动态路由参数

```
server/api/posts/[id].get.ts   → GET /api/posts/:id
server/api/posts/[...slug].ts  → 通配路由 /api/posts/a/b/c
```

```ts
// server/api/posts/[id].get.ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  // 读取查询参数
  const query = getQuery(event)  // { page: '1', limit: '10' }

  // 读取请求体（POST/PUT/PATCH）
  const body = await readBody(event)

  return { id, query, body }
})
```

---

## 三、Nitro 3 事件对象

`defineEventHandler` 中的 `event` 对象提供：

```ts
import {
  getRouterParam,    // 获取路由参数
  getQuery,          // 获取查询参数
  readBody,          // 读取请求体
  getRequestHeaders, // 获取请求头
  getCookie,         // 获取 Cookie
  setCookie,         // 设置 Cookie
  sendRedirect,      // 重定向
  setResponseStatus, // 设置响应状态码
  createError,       // 创建错误响应
} from 'h3'

export default defineEventHandler(async (event) => {
  // 获取路径参数
  const id = getRouterParam(event, 'id')

  // 获取查询字符串
  const { page, search } = getQuery(event)

  // 读取 JSON 请求体
  const body = await readBody(event)

  // 获取请求头
  const headers = getRequestHeaders(event)
  const userAgent = headers['user-agent']

  // Cookie 操作
  const session = getCookie(event, 'session')
  setCookie(event, 'lastVisit', new Date().toISOString())

  // 响应状态码
  setResponseStatus(event, 201)

  return { id, body }
})
```

---

## 四、服务端中间件

服务端中间件在 `server/middleware/` 目录，**按数字前缀顺序执行**：

```ts
// server/middleware/01.auth.ts
export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  if (!token && event.path.startsWith('/api/protected')) {
    throw createError({
      statusCode: 401,
      message: '未授权访问',
    })
  }
})
```

```ts
// server/middleware/02.log.ts
export default defineEventHandler((event) => {
  console.log(`${event.method} ${event.path}`)
})
```

---

## 五、Nitro 3 存储层

### 5.1 内置 KV 存储

```ts
// server/api/cache.get.ts
export default defineEventHandler(async (event) => {
  const storage = useStorage('cache')

  // 写入
  await storage.setItem('key', 'value')

  // 读取
  const value = await storage.getItem('key')

  // 带 TTL
  await storage.setItem('token', 'abc123', { ttl: 3600 })

  return value
})
```

### 5.2 数据库集成

```ts
// server/api/posts.get.ts
import { drizzle } from 'drizzle-orm/libsql'

const db = drizzle(useRuntimeConfig().databaseUrl)

export default defineEventHandler(async () => {
  const posts = await db.select().from(postsTable).all()
  return posts
})
```

---

## 六、Nitro 3 任务系统

### 6.1 定时任务

```ts
// server/tasks/cleanup.ts
export default defineTask({
  meta: {
    name: 'cleanup',
    description: '清理过期数据',
  },
  run() {
    console.log('执行每日清理任务...')
    return { result: 'success' }
  },
})
```

Nuxt 4 + Nitro 3 可在不同平台通过不同方式触发（cron、Vercel Cron 等）。

### 6.2 DB 迁移任务

```ts
// server/tasks/db-migrate.ts
export default defineTask({
  meta: {
    name: 'db:migrate',
    description: '运行数据库迁移',
  },
  async run() {
    // 执行迁移逻辑
    const result = await runMigrations()
    return { result }
  },
})
```

---

## 七、Nitro 3 部署预设

| 预设           | 平台                       | 命令                       |
| -------------- | -------------------------- | -------------------------- |
| `node-server`  | Node.js 服务器             | 默认                       |
| `vercel`       | Vercel                     | `NITRO_PRESET=vercel`      |
| `netlify`      | Netlify                    | `NITRO_PRESET=netlify`     |
| `cloudflare`   | Cloudflare Workers         | `NITRO_PRESET=cloudflare`  |
| `bun`          | Bun                        | `NITRO_PRESET=bun`         |
| `deno`         | Deno                       | `NITRO_PRESET=deno`        |

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    preset: 'vercel',
  },
})
```

---

## 八、错误处理

```ts
// server/api/sensitive.get.ts
export default defineEventHandler((event) => {
  const isAdmin = event.context.isAdmin

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: '无权访问此资源',
    })
  }

  return { data: '机密数据' }
})
```

---

## 九、Nuxt 4 服务端最佳实践

- **API 路由使用 TypeScript**，享受 Nitro 3 的类型推导
- **服务端中间件用数字前缀控制顺序**
- **共享代码放在 `shared/` 目录**，前后端复用
- **利用 `useStorage` 做缓存**，减轻数据库压力
- **根据部署平台选择合适的 Nitro preset**