# 混合渲染策略

> 本章讲解如何在 Nuxt 中实现混合渲染，为不同页面或路由设置不同的渲染模式。

## 一、路由级别配置

### 1.1 `routeRules` 语法

`nuxt.config.ts` 中的 `routeRules` 允许按路由路径设置不同的渲染策略：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 精确匹配
    '/': { ssr: true },

    // 通配符匹配
    '/blog/**': { swr: 3600 },

    // 动态路由匹配
    '/products/**': { isr: 600 },

    // 前缀匹配
    '/admin/**': { ssr: false },
  },
})
```

### 1.2 routeRules 支持的选项

| 选项            | 值        | 说明                 |
| --------------- | --------- | -------------------- |
| `ssr`           | `boolean` | 是否启用服务端渲染   |
| `isr`           | `number`  | ISR 缓存时间（秒）   |
| `swr`           | `number`  | SWR 缓存时间（秒）   |
| `prerender`     | `boolean` | 是否在构建时预渲染   |
| `redirect`      | `string`  | 重定向目标 URL       |
| `headers`       | `object`  | 自定义响应头         |
| `cors`          | `boolean` | 是否启用 CORS        |
| `appMiddleware` | `boolean` | 是否运行客户端中间件 |

### 1.3 通配符规则

```ts
routeRules: {
  '/blog/**': { swr: 3600 },     // /blog 及其所有子路由
  '/blog/*': { swr: 3600 },      // /blog 的一级子路由（/blog/foo 但不含 /blog/foo/bar）
  '/products/[id]': { isr: 600 } // 匹配 /products/123 但不含 /products/abc/def
}
```

---

## 二、混合渲染规则

### 2.1 典型混合站点配置

```ts
export default defineNuxtConfig({
  routeRules: {
    // 首页 — SSR（SEO + 实时数据）
    '/': { ssr: true },

    // 博客文章 — SWR（用户立即看到内容，后台更新）
    '/blog/**': { swr: 3600 },

    // 商品详情 — ISR（定期更新）
    '/products/**': { isr: 1800 },

    // 静态页面 — 预渲染（构建时生成）
    '/about': { prerender: true },
    '/faq': { prerender: true },

    // 后台管理 — 纯 SPA（无需 SEO）
    '/admin/**': { ssr: false },

    // 重定向旧链接
    '/old-about': { redirect: '/about' },

    // API 代理 — 自定义响应头
    '/api/external/**': {
      proxy: 'https://api.example.com/**',
      headers: { 'X-Custom': 'value' },
    },
  },
})
```

### 2.2 合并层级配置

同一路由可能被多条规则匹配，Nuxt 会按优先级合并：

```ts
routeRules: {
  '/blog/**': { swr: 3600 },            // 全局博客缓存
  '/blog/breaking/**': { ssr: true }     // 突发新闻实时渲染（覆盖 SWR）
}
```

匹配 `/blog/breaking/article-x` 时，`ssr: true` 会覆盖 `swr: 3600`。

---

## 三、客户端渲染 (SPA)

### 3.1 全局 SPA 模式

```ts
export default defineNuxtConfig({
  ssr: false, // 全局关闭 SSR，变为纯 SPA
})
```

### 3.2 路由级 SPA

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { ssr: false },
  },
})
```

### 3.3 SPA 模式的特点

- 所有渲染在客户端完成
- 首屏加载慢（需等 JS 加载执行）
- **不利于 SEO**
- 适合需要登录的后台系统、仪表盘

---

## 四、边缘渲染

### 4.1 什么是边缘渲染？

**边缘渲染（Edge Rendering）**：在 CDN 边缘节点上运行 Nuxt 服务端渲染，用户请求由离其最近的节点处理。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages', // 或 'vercel-edge'、'netlify-edge'
  },
})
```

### 4.2 支持的边缘平台

| 平台               | Nitro Preset                             |
| ------------------ | ---------------------------------------- |
| Cloudflare Workers | `cloudflare-pages` / `cloudflare-module` |
| Vercel Edge        | `vercel-edge`                            |
| Netlify Edge       | `netlify-edge`                           |
| Deno Deploy        | `deno-deploy`                            |

### 4.3 边缘渲染的限制

- 无法访问 Node.js 文件系统（`fs`、`path`）
- 受限的运行时 API
- 某些 Node 原生模块不可用（需 polyfill）

### 4.4 组合策略示例

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel', // 默认 Node.js 部署
  },
  routeRules: {
    // 大部分页面使用 Node.js SSR
    '/**': { ssr: true },

    // 高流量页面使用 ISR 缓存
    '/trending/**': { isr: 600 },

    // 静态内容预渲染
    '/docs/**': { prerender: true },
  },
})
```

---

## 五、选择决策流程

```
是否需要 SEO？
├── 是 → 需要 SSR / SSG / ISR
│   ├── 内容更新频率？
│   │   ├── 极少更新 → SSG（构建时生成）
│   │   ├── 偶尔更新 → ISR（定时缓存再生）
│   │   └── 频繁更新 → SSR（每次请求渲染）
│   └── 性能要求？
│       ├── 极致性能 → SSG / ISR
│       └── 可接受 → SSR
│
└── 否 → SPA（客户端渲染）
    └── 示例：后台管理系统、内部工具
```

### 5.1 快速参考

| 你的站点类型 | 推荐渲染策略                            |
| ------------ | --------------------------------------- |
| 个人博客     | SSG（全站预渲染）或 SWR                 |
| 企业官网     | SSG（静态页）+ SSR（动态内容）          |
| 电商平台     | SSR（首页）+ ISR（商品页）+ SPA（后台） |
| SaaS 产品    | SSR（营销页）+ SPA（应用内）            |
| 内容站/新闻  | SWR（文章页）+ SSR（首页）              |
