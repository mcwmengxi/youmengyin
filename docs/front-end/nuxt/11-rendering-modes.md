# 渲染模式

> 本章对比讲解 Nuxt 中的 SSR、SSG、ISR、SWR 等渲染模式及其适用场景。

## 一、SSR 服务端渲染

### 1.1 什么是 SSR？

**SSR（Server-Side Rendering）**：每次请求在服务端渲染 HTML，返回给浏览器的是**完整页面内容**。

```
浏览器发起请求 → Nuxt 服务端渲染 Vue 组件 → 返回完整 HTML → 浏览器直接展示
```

Nuxt 3 **默认使用 SSR**，无需额外配置。

### 1.2 SSR 的优势

| 优势           | 说明                                    |
| -------------- | --------------------------------------- |
| **SEO 友好**   | 搜索引擎爬虫能直接抓取完整内容          |
| **首屏速度快** | 浏览器直接渲染 HTML，无需等 JS 加载执行 |
| **动态数据**   | 每次请求都能获取最新数据                |

### 1.3 SSR 的工作流程

1. 浏览器请求页面
2. Nuxt 服务端执行组件 `setup`，调用 `useFetch` / `useAsyncData` 获取数据
3. 渲染为 HTML 字符串，连同序列化的状态嵌入页面
4. 浏览器接收 HTML，立即展示
5. 客户端 JS 下载完成，**hydration**（激活）使页面可交互

### 1.4 SSR 注意事项

```vue
<script setup>
// ❌ 服务端没有 window、document
// console.log(window.innerWidth)  // 报错！

// ✅ 在 mounted 中访问浏览器 API
onMounted(() => {
  console.log(window.innerWidth)
})

// ✅ 使用 import.meta.client 判断环境
if (import.meta.client) {
  console.log(window.innerWidth)
}
</script>
```

---

## 二、SSG 静态站点生成

### 2.1 什么是 SSG？

**SSG（Static Site Generation）**：构建时预渲染所有页面为静态 HTML，部署时直接提供静态文件，无需运行 Node 服务。

### 2.2 启用 SSG

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 保持 SSR 开启
  nitro: {
    prerender: {
      routes: ['/', '/about', '/posts/1', '/posts/2'], // 预渲染的路由
      crawlLinks: true, // 自动爬取内部链接并预渲染
    },
  },
})
```

构建命令：

```bash
npx nuxi generate
```

### 2.3 预渲染动态路由

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  hooks: {
    async 'nitro:config'(config) {
      if (config.dev) return
      // 构建时获取所有文章 ID，生成对应静态页面
      const posts = await $fetch('https://api.example.com/posts')
      const routes = posts.map((p) => `/posts/${p.id}`)
      config.prerender.routes.push(...routes)
    },
  },
})
```

### 2.4 SSG 适用场景

- 博客、文档站、企业官网（内容不频繁变化）
- 需要极快的首屏加载速度
- 纯静态文件部署（CDN 友好）

---

## 三、ISR 增量静态再生

### 3.1 什么是 ISR？

**ISR（Incremental Static Regeneration）**：页面首次请求时按需生成静态 HTML 并缓存，过期后后台重新生成。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': {
      isr: 600, // 缓存 600 秒（10 分钟），过期后后台重新生成
    },
  },
})
```

### 3.2 ISR 工作流程

1. 首次访问 `/blog/1` → 服务端渲染并缓存（返回给用户）
2. 10 分钟内再次访问 → 直接返回缓存
3. 10 分钟后访问 → 返回旧缓存的同时，后台重新生成新缓存
4. 再次访问 → 返回新缓存

### 3.3 ISR vs SSG vs SSR 对比

| 特性       | SSG                  | ISR                | SSR    |
| ---------- | -------------------- | ------------------ | ------ |
| 构建时间   | 慢（需生成所有页面） | 快（按需生成）     | 无构建 |
| 响应速度   | 极快                 | 快                 | 较慢   |
| 数据实时性 | 差（需重新构建）     | 延迟（按缓存过期） | 实时   |
| 服务器压力 | 无                   | 低                 | 高     |

---

## 四、SWR 陈旧验证

### 4.1 什么是 SWR？

**SWR（Stale-While-Revalidate）**：始终返回缓存内容（即使已过期），同时后台更新缓存。用户永远不会等待页面生成。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/trending/**': {
      swr: 300, // 缓存 5 分钟，过期后返回旧内容 + 后台更新
    },
  },
})
```

### 4.2 SWR vs ISR

| 特性           | ISR                  | SWR            |
| -------------- | -------------------- | -------------- |
| 过期后首个请求 | 等待重新生成，可能慢 | 立即返回旧内容 |
| 用户等待时间   | 可能等待             | 零等待         |
| 数据时效要求   | 可接受延迟           | 可接受旧数据   |

---

## 五、四种模式对比与选择

| 渲染模式 | 配置方式        | 适用场景                                     |
| -------- | --------------- | -------------------------------------------- |
| **SSR**  | 默认            | 需要实时数据的页面、管理后台                 |
| **SSG**  | `nuxi generate` | 博客、文档、营销页面                         |
| **ISR**  | `isr: 秒数`     | 内容更新不频繁的页面（商城商品页）           |
| **SWR**  | `swr: 秒数`     | 不要求数据强实时性的页面（排行榜、推荐列表） |
| **SPA**  | `ssr: false`    | 不需要 SEO 的后台管理、仪表盘                |

### 5.1 同一站点混合使用

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { ssr: true }, // 首页 SSR
    '/blog/**': { swr: 3600 }, // 博客 SWR
    '/products/**': { isr: 600 }, // 商品页 ISR
    '/admin/**': { ssr: false }, // 后台 SPA
    '/about': { prerender: true }, // 关于页 预渲染
  },
})
```
