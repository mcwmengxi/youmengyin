# Nitro Server Routes

> 本章详解 Nuxt 3 基于 Nitro 引擎的服务端 API 路由开发。

## 一、Nitro 简介

### 1.1 什么是 Nitro？

Nitro 是 Nuxt 3 的底层服务端引擎，提供了：

- 跨平台部署（Node.js、Deno、Cloudflare Workers 等）
- 文件系统 API 路由
- 自动导入服务端工具函数
- 高性能（基于 h3、unjs 生态）

### 1.2 服务端目录结构

```
server/
├── api/               # API 端点 → /api/*
│   ├── posts/
│   │   ├── index.get.ts  → GET /api/posts
│   │   ├── [id].get.ts   → GET /api/posts/:id
│   │   └── [id].put.ts   → PUT /api/posts/:id
│   └── hello.ts       → /api/hello (所有 HTTP 方法)
├── routes/            # 服务端路由（更灵活）
│   └── sitemap.xml.ts → /sitemap.xml
└── middleware/         # 服务端中间件
    ├── auth.ts        # 所有请求都经过
    └── log.ts
```

---

## 二、Server Routes 创建

### 2.1 基础 API 端点

```ts
// server/api/hello.ts
export default defineEventHandler((event) => {
  return {
    message: 'Hello from Nitro!',
    timestamp: Date.now(),
  }
})
```

访问 `http://localhost:3000/api/hello` 返回 JSON。

### 2.2 限定 HTTP 方法

```ts
// server/api/posts/index.get.ts  → GET /api/posts
export default defineEventHandler(async (event) => {
  const posts = await db.query('SELECT * FROM posts')
  return posts
})

// server/api/posts/index.post.ts → POST /api/posts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const post = await db.insert('posts', body)
  return post
})

// server/api/posts/[id].put.ts → PUT /api/posts/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  return await db.update('posts', id, body)
})

// server/api/posts/[id].delete.ts → DELETE /api/posts/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await db.delete('posts', id)
  return { success: true }
})
```

---

## 三、请求处理与响应

### 3.1 读取请求数据

```ts
// server/api/echo.ts
export default defineEventHandler(async (event) => {
  // 读取请求体（JSON / form）
  const body = await readBody(event)

  // 读取查询参数
  const query = getQuery(event) // { page: '1', q: 'search' }

  // 读取路由参数
  const id = getRouterParam(event, 'id')

  // 读取请求头
  const headers = getHeaders(event)
  const auth = getHeader(event, 'Authorization')

  // 读取 Cookie
  const cookies = parseCookies(event)
  const token = getCookie(event, 'token')

  // 获取 HTTP 方法
  const method = event.method // GET / POST / PUT / DELETE

  return { body, query, method }
})
```

### 3.2 返回响应

```ts
export default defineEventHandler((event) => {
  // 设置状态码
  setResponseStatus(event, 201)

  // 设置响应头
  setHeader(event, 'X-Custom', 'value')
  setHeaders(event, {
    'Cache-Control': 'max-age=3600',
    'X-Powered-By': 'Nitro',
  })

  // 返回 JSON
  return { ok: true }

  // 返回纯文本
  // return 'Hello World'

  // 返回 HTML
  // setHeader(event, 'Content-Type', 'text/html')
  // return '<h1>Hello</h1>'
})
```

### 3.3 错误处理

```ts
// server/api/auth/me.ts
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')

  // 未认证
  if (!token) {
    throw createError({
      statusCode: 401,
      message: '请先登录',
    })
  }

  // 权限不足
  const user = await verifyToken(token)
  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: '无权限访问',
    })
  }

  // 资源不存在
  const profile = await db.findUser(user.id)
  if (!profile) {
    throw createError({
      statusCode: 404,
      message: '用户不存在',
    })
  }

  return profile
})
```

---

## 四、路由参数与查询

### 4.1 动态路由参数

```
server/api/users/[id].get.ts    → GET /api/users/:id
server/api/category/[category]/[slug].get.ts → GET /api/category/:category/:slug
```

```ts
// server/api/users/[id].get.ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  console.log(id) // "123"
})
```

### 4.2 查询参数

```
GET /api/posts?page=2&limit=10&sort=latest
```

```ts
// server/api/posts/index.get.ts
export default defineEventHandler((event) => {
  const query = getQuery(event)
  // query = { page: '2', limit: '10', sort: 'latest' }

  const page = Number(query.page) || 1
  const limit = Math.min(Number(query.limit) || 10, 100)
  const sort = query.sort || 'latest'

  return await db.query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, (page - 1) * limit]
  )
})
```

### 4.3 请求体校验（推荐使用 zod）

```ts
// server/api/register.post.ts
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
  name: z.string().min(2, '名称至少2个字符'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 校验请求体
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues.map((i) => i.message).join(', '),
    })
  }

  const { email, password, name } = result.data
  // 创建用户...
})
```

---

## 五、中间件与守卫

### 5.1 服务端中间件

```ts
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  // 跳过 API 路由以外的请求
  if (!event.path.startsWith('/api/')) return

  // 公开的 API 路径
  const publicPaths = ['/api/login', '/api/register']
  if (publicPaths.includes(event.path)) return

  // 验证 Token
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, message: '未登录' })
  }

  // 将用户信息挂到 event.context 上，后续 handler 可以直接用
  event.context.user = verifyToken(token)
})
```

### 5.2 在 handler 中读取上下文

```ts
// server/api/me.get.ts
export default defineEventHandler((event) => {
  // 中间件已挂载 user 信息
  const user = event.context.user
  return user
})
```

### 5.3 流式响应（SSE）

```ts
// server/api/stream.get.ts
export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  // 发送 SSE 事件
  const send = (data: any) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  send({ message: 'connected' })

  const interval = setInterval(() => {
    send({ time: new Date().toISOString() })
  }, 1000)

  event.node.req.on('close', () => clearInterval(interval))
})
```

---

## 六、文件上传处理

```ts
// server/api/upload.post.ts
export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)

  if (!files?.length) {
    throw createError({ statusCode: 400, message: '请选择文件' })
  }

  const results = []
  for (const file of files) {
    if (!file.filename) continue

    // 保存文件
    const filePath = `./public/uploads/${Date.now()}-${file.filename}`
    await writeFile(filePath, file.data)

    results.push({
      filename: file.filename,
      size: file.data.length,
      type: file.type,
      url: `/uploads/${path.basename(filePath)}`,
    })
  }

  return results
})
```

```vue
<!-- 前端上传 -->
<script setup>
async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  await $fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
}
</script>
```
