# SSR / SSG / ISR / SWR 渲染模式

> 本章讲解 Nuxt 4 支持的四种渲染模式及其适用场景。Nuxt 4 + Nitro 3 在渲染模式上提供了更好的性能和更灵活的配置。

## 一、渲染模式概述

| 模式       | 全称                          | 渲染时机     | SEO | 实时性   |
| ---------- | ----------------------------- | ------------ | --- | -------- |
| **SSR**    | Server-Side Rendering         | 每次请求时   | ✅  | ✅ 实时  |
| **SSG**    | Static Site Generation        | 构建时       | ✅  | ❌ 静态  |
| **ISR**    | Incremental Static Regeneration | 按需重新生成 | ✅  | ⚡ 准实时 |
| **SWR**    | Stale-While-Revalidate        | 缓存 + 后台更新 | ✅  | ⚡ 准实时 |

Nuxt 4 默认使用 **SSR**，可通过 `routeRules` 按路由混合使用多种模式。

---

## 二、SSR（服务端渲染）

### 2.1 工作原理

```
用户请求 → Nuxt 服务端执行 Vue 组件 → 生成完整 HTML → 返回给浏览器
                ↓
         浏览器水合（Hydration）→ 页面可交互
```

### 2.2 Nuxt 4 SSR 增强

- **Nitro 3 引擎**：更快的服务端渲染速度
- **Socket 通信**：开发模式下 HMR 更快
- **智能数据层**：服务端预取数据自动序列化到客户端

### 2.3 SSR 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  ssr: true, // 默认启用
})
```

### 2.4 SSR 适用场景

- 需要 SEO 的内容型网站（博客、商城、企业官网）
- 首屏加载速度要求高的应用
- 社交媒体分享需要正确预览的内容

---

## 三、SSG（静态站点生成）

### 3.1 预渲染

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    prerender: {
      routes: ['/', '/about', '/posts/1', '/posts/2'],
      crawlLinks: true,  // 自动爬取页面中的链接
    },
  },
})
```

### 3.2 动态路由预渲染

```ts
// server/api/generate-routes.ts 或在 nuxt.config.ts 中
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    prerender: {
      routes: async () => {
        const posts = await $fetch('https://api.example.com/posts')
        return posts.map((p: any) => `/posts/${p.slug}`)
      },
    },
  },
})
```

### 3.3 构建命令

```bash
npx nuxi generate
# 或
npm run generate
```

输出在 `.output/public/`，可直接部署到 CDN。

---

## 四、ISR（增量静态再生成）

### 4.1 routeRules 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    // 10 分钟后重新生成
    '/products/**': { isr: 600 },
    // 1 小时后重新生成
    '/blog/**': { isr: 3600 },
  },
})
```

### 4.2 ISR 工作流程

```
首次请求 → 服务端渲染 → 缓存页面 → 返回给用户
10分钟后请求 → 仍返回缓存（旧版本）→ 后台触发重新生成 → 下次请求返回新版本
```

### 4.3 ISR 适用场景

- 数据变化不频繁的页面（产品列表、文章页）
- 需要 SEO 但不需要实时更新的内容
- 高并发场景，需要缓存来分担服务器压力

---

## 五、SWR（Stale-While-Revalidate）

### 5.1 routeRules 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    // 30 秒内返回缓存，后台更新
    '/search/**': { swr: 30 },
    // 5 分钟内返回缓存，后台更新
    '/trending/**': { swr: 300 },
  },
})
```

### 5.2 SWR vs ISR

|       | SWR                          | ISR                          |
| ----- | ---------------------------- | ---------------------------- |
| 首次  | 渲染 + 缓存                  | 渲染 + 缓存                  |
| 过期后 | 返回旧缓存 + 后台更新        | 等待新渲染完成再返回         |
| 体验  | 始终快速响应，但可能看到旧数据 | 可能等待，但一定看到最新数据   |
| 适用  | 实时性要求低的搜索/列表      | 内容型页面（CMS 驱动）       |

---

## 六、SPA（纯客户端渲染）

### 6.1 routeRules 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    '/admin/**': { ssr: false },  // 管理后台完全客户端渲染
    '/dashboard/**': { ssr: false },
  },
})
```

### 6.2 SPA 的优缺点

- **优点**：初次加载后跳转极快，无需服务器资源
- **缺点**：首屏加载慢，SEO 差

### 6.3 SPA 适用场景

- 管理后台、Dashboard
- 登录后的应用内部页面
- 不需要 SEO 的交互密集型应用

---

## 七、Nuxt 4 渲染模式配置示例

### 一个完整的 routeRules 配置：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  routeRules: {
    // 首页 — SSR（SEO 优先）
    '/': { ssr: true },

    // 静态页面 — 预渲染为纯静态
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // 博客文章 — ISR 1 小时
    '/blog/**': { isr: 3600 },

    // 产品列表 — ISR 10 分钟
    '/products/**': { isr: 600 },

    // 搜索结果 — SWR 30 秒
    '/search/**': { swr: 30 },

    // 管理后台 — 纯 SPA
    '/admin/**': { ssr: false },

    // API 路由 — 添加 CORS
    '/api/**': {
      cors: true,
      headers: { 'X-Custom': 'value' },
    },
  },
})
```

### 渲染模式选择决策树

```
需要 SEO？
├── 是 → 内容更新频率？
│         ├── 几乎不变 → SSG（prerender）
│         ├── 偶尔更新 → ISR（按时间重新生成）
│         ├── 较频繁但可接受短暂延迟 → SWR
│         └── 实时性要求高 → SSR
└── 否 → SPA（ssr: false）
```

---

## 八、Nitro 3 渲染增强

Nuxt 4 内置 Nitro 3，渲染层面有显著提升：
- **更快的 SSR**：优化的 HTML 序列化和流式传输
- **更强的边缘计算支持**：Cloudflare Workers、Deno Deploy 等
- **智能缓存**：ISR/SWR 缓存策略更高效
- **实验性：Partial Prerendering**：混合 SSG + SSR 同一页面