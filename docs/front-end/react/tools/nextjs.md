# Next.js

## 什么是 Next.js？

Next.js 是基于 React 的全栈框架，支持 SSR（服务端渲染）、SSG（静态生成）、ISR（增量静态再生成）等功能，是 React 官方推荐的生产级框架。

### 特性

- 文件系统路由（pages router / app router）
- 服务端渲染（SSR）
- 静态站点生成（SSG）
- API 路由
- 自动代码分割
- 内置图片优化
- React Server Components（React 19 正式支持）

### App Router（Next.js 13+ 推荐）

```
app/
├── layout.tsx          # 根布局
├── page.tsx            # 首页 /
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/:slug
└── api/
    └── users/
        └── route.ts    # /api/users
```

### Server Component 默认

```tsx
// app/page.tsx - 默认是 Server Component
async function HomePage() {
  // 可直接访问数据库、文件系统等
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

### Client Component

```tsx
'use client' // 客户端组件标记

import { useState } from 'react'

function LikeButton() {
  const [likes, setLikes] = useState(0)

  return <button onClick={() => setLikes(l => l + 1)}>点赞 {likes}</button>
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Next.js 建议版本 | 12-14 | 15+ |
| Server Components | Next.js 13+ App Router | 正式集成到 React |
| Server Actions | Next.js 14 实验性 | Next.js 15 稳定 |
| `use()` 支持 | 不支持 | 支持 |

> React 19 与 Next.js 15 是官方推荐的组合，Server Components 和 Server Actions 均为稳定特性。