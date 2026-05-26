# 混合渲染策略与 routeRules

> 本章深入 Nuxt 4 的混合渲染策略，讲解如何在同一个应用中按路由粒度使用不同的渲染模式。

## 一、混合渲染概念

混合渲染允许同一 Nuxt 4 应用的不同路由使用不同的渲染模式：

```
/            → SSR（服务端渲染，SEO 优先）
/about       → SSG（构建时预渲染，纯静态）
/products/*  → ISR（增量静态再生成，定期更新）
/search/*    → SWR（缓存 + 后台更新）
/admin/*     → SPA（纯客户端，无需 SEO）
```

**核心工具**：`nuxt.config.ts` 中的 `routeRules`。

---

## 二、routeRules 完整配置

### 2.1 支持的所有规则

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    '/specific-page': {
      // 渲染模式
      ssr: true,            // SSR（默认）
      prerender: true,      // SSG 预渲染
      isr: 600,             // ISR，秒为单位
      swr: 300,             // SWR，秒为单位

      // 重定向
      redirect: '/new-path',          // 永久重定向
      redirect: { to: '/new-path', statusCode: 301 },

      // 响应头
      headers: {
        'X-Custom-Header': 'value',
        'Cache-Control': 'max-age=3600',
      },

      // CORS
      cors: true,

      // 代理（Nitro 3 增强）
      proxy: { to: 'https://api.external.com/**' },

      // 实验性：边缘渲染
      experimentalNoScripts: false,
    },
  },
})
```

### 2.2 路由匹配语法

| 模式               | 匹配                              |
| ------------------ | --------------------------------- |
| `/`                | 仅首页                            |
| `/about`           | 仅 /about                         |
| `/blog/*`          | /blog 及其所有子路由                        |
| `/blog/**`         | /blog 及其所有子路由（深度匹配）  |
| `/posts/:id`       | /posts/1、/posts/abc 等           |

---

## 三、实战混合配置

### 3.1 电商网站示例

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    // 首页 — SSR，实时内容
    '/': { ssr: true },

    // 静态信息页 — 完全预渲染
    '/about': { prerender: true },
    '/faq': { prerender: true },
    '/terms': { prerender: true },

    // 产品列表 — ISR 10 分钟
    '/products/**': { isr: 600 },

    // 产品详情 — ISR 30 分钟
    '/products/*': { isr: 1800 },

    // 搜索结果 — SWR 60 秒（允许短暂过期）
    '/search/**': { swr: 60 },

    // 用户个人中心 — SPA
    '/account/**': { ssr: false },

    // 管理后台 — SPA
    '/admin/**': { ssr: false },

    // 博客 — ISR 1 小时
    '/blog/**': { isr: 3600 },

    // API 路由
    '/api/public/**': { cors: true },
    '/api/private/**': { cors: false },
  },
})
```

### 3.2 使用 `__NUXT_ISR_TIMESTAMP` 控制 ISR 刷新

```vue
<!-- app/pages/products/[id].vue -->
<script setup lang="ts">
// Nuxt 4 自动在 ISR 路由中注入此时间戳
const isrTimestamp = useState('__NUXT_ISR_TIMESTAMP', () => Date.now())
</script>
```

### 3.3 动态 routeRules

Nuxt 4 支持运行时动态更新路由规则（通过 Nitro 3）：

```ts
// server/api/cache/clear.get.ts
export default defineEventHandler(async (event) => {
  // 清除特定路由的 ISR 缓存
  await useStorage('cache:nitro').removeItem('_ prerender_/products/123')
  return { success: true }
})
```

---

## 四、预渲染配置详解

### 4.1 自动爬取

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    prerender: {
      crawlLinks: true,      // 自动爬取 <NuxtLink> 链接
      routes: ['/'],         // 入口路由
      ignore: ['/admin/**'], // 忽略的路由
    },
  },
})
```

### 4.2 动态生成预渲染路由

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    prerender: {
      routes: async () => {
        const response = await fetch('https://api.example.com/posts')
        const posts = await response.json()
        return [
          '/',
          '/about',
          ...posts.map((p: any) => `/posts/${p.slug}`),
        ]
      },
    },
  },
})
```

---

## 五、性能监控

### 5.1 查看渲染模式

```vue
<script setup lang="ts">
const route = useRoute()

// 检查当前路由是否预渲染
const isPrerendered = import.meta.prerender
const isSSR = !import.meta.client
</script>
```

### 5.2 Nuxt 4 DevTools 渲染分析

Nuxt 4 内置 DevTools v2，提供：
- **路由性能面板**：查看每条路由的渲染模式
- **数据获取时间线**：追踪 `useFetch` 的执行时间
- **缓存命中率**：ISR/SWR 缓存的命中统计

---

## 六、混合渲染最佳实践

- **首页/着陆页 → SSR**，确保 SEO 和首屏速度
- **静态内容 → SSG（prerender）**，零服务器开销
- **动态但变化不频繁 → ISR**，兼顾性能和实时性
- **实时性强但可容忍短暂不一致 → SWR**，用户体验好
- **后台管理 → SPA**，无需 SEO
- **全局启用 `crawlLinks`**，自动发现需要预渲染的页面
- **监控 ISR 缓存**，必要时手动清除过期缓存