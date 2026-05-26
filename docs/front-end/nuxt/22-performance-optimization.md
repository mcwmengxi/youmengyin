# Nuxt 4 性能优化

> 本章讲解 Nuxt 4 应用的性能优化策略，包括构建优化、运行时优化和监控手段。

## 一、性能优化全景

Nuxt 4 性能优化覆盖以下维度：

| 维度         | 目标               | 关键手段                   |
| ------------ | ------------------ | -------------------------- |
| **构建速度** | 快速开发和部署     | 缓存、并行构建、模块优化   |
| **首屏加载** | FCP < 1.5s         | SSR、代码分割、资源预加载  |
| **运行时**   | 交互流畅           | 懒加载、虚拟列表、防抖节流 |
| **服务端**   | 高并发低延迟       | ISR、SWR、边缘计算         |
| **静态资源** | 快速下载           | 压缩、CDN、Cache-Control   |

---

## 二、构建优化

### 2.1 分析构建产物

Nuxt 4 DevTools 内置构建分析：

```bash
npx nuxi analyze
```

或使用 `nuxt.config.ts` 配置：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  build: {
    analyze: {},  // 开启构建分析
  },
})
```

### 2.2 减少依赖体积

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  // 跳过不必要的模块扫描
  imports: {
    dirs: ['composables'],  // 只扫描 composables 目录
  },

  // 排除大型库的服务端打包
  vite: {
    ssr: {
      noExternal: [],
    },
  },
})
```

### 2.3 实验性功能

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  experimental: {
    payloadExtraction: true,     // HTML 内联数据提取
    renderJsonPayloads: true,    // JSON payload 渲染
    crossOriginPrefetch: true,   // 跨域预取
  },
})
```

---

## 三、首屏加载优化

### 3.1 代码分割

Nuxt 4 自动进行路由级代码分割，无需手动配置。进一步优化：

```vue
<!-- 异步加载非首屏组件 -->
<script setup lang="ts">
// 仅在需要时加载
const HeavyChart = defineAsyncComponent(() => import('~/components/HeavyChart.vue'))
</script>

<template>
  <ClientOnly>
    <HeavyChart v-if="showChart" />
  </ClientOnly>
</template>
```

### 3.2 资源预加载

```vue
<script setup lang="ts">
// 预加载即将访问的页面
await preloadRouteComponents('/dashboard')

// 预取指定组件
await prefetchComponents('Modal', 'DataTable')
</script>
```

### 3.3 关键 CSS 内联

Nuxt 4 自动处理关键 CSS：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    inlineDynamicImports: true,
  },
})
```

---

## 四、运行时优化

### 4.1 组件懒加载

```vue
<template>
  <!-- 进入视口才加载 -->
  <LazyHeavyComponent v-if="visible" />

  <!-- 仅客户端渲染（跳过 SSR 开销） -->
  <ClientOnly>
    <InteractiveWidget />
  </ClientOnly>
</template>
```

### 4.2 列表虚拟化

```vue
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const items = ref(Array.from({ length: 10000 }, (_, i) => `Item ${i}`))
const { list, containerProps, wrapperProps } = useVirtualList(items, {
  itemHeight: 40,
})
</script>
```

### 4.3 防抖与节流

```ts
// app/composables/useDebounce.ts
export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
```

---

## 五、静态资源优化

### 5.1 图片优化

```vue
<template>
  <!-- 使用 @nuxt/image -->
  <NuxtImg
    src="/hero.jpg"
    width="800"
    format="webp"
    quality="80"
    loading="lazy"
  />

  <!-- 响应式图片 -->
  <NuxtPicture
    src="/banner.jpg"
    :img-attrs="{ class: 'rounded-lg' }"
  />
</template>
```

### 5.2 字体优化

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
    ],
  },
})
```

---

## 六、缓存策略

### 6.1 多级缓存

```
CDN 缓存 (边缘节点)
  ↓ 未命中
应用缓存 (ISR/SWR)
  ↓ 未命中
服务端渲染 (SSR)
```

### 6.2 缓存配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    // 静态资源 — 永久缓存
    '/_nuxt/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
    // 图片资源 — 1 年缓存
    '/images/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000' },
    },
    // 首页 — ISR 5 分钟
    '/': { isr: 300 },
    // API — SWR 60 秒
    '/api/trending': { swr: 60 },
  },
})
```

---

## 七、服务端优化

### 7.1 数据库查询优化

```ts
// server/api/posts.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // ✅ 只查询需要的字段
  const posts = await db.query.posts.findMany({
    columns: { id: true, title: true, createdAt: true },
    limit: 20,
  })

  // 设置缓存
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300')
  return posts
})
```

### 7.2 Nitro 3 存储层

```ts
// server/api/fast-data.get.ts
export default defineEventHandler(async (event) => {
  const cache = useStorage('cache')
  const cached = await cache.getItem('fast-data')

  if (cached) {
    return cached  // 直接返回缓存
  }

  const data = await expensiveQuery()
  await cache.setItem('fast-data', data, { ttl: 600 })  // 10 分钟 TTL

  return data
})
```

---

## 八、性能监控

### 8.1 Web Vitals

```ts
// app/plugins/vitals.client.ts
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log)
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    })
  }
})
```

### 8.2 Nuxt 4 DevTools 性能面板

- **路由加载时间**：每条路由的 SSR/CSR 耗时
- **Bundle 大小**：每个页面的 JS/CSS 大小
- **数据获取时间线**：`useFetch` 请求耗时分布
- **缓存命中率**：ISR/SWR 的缓存效率和惩罚

---

## 九、性能优化清单

- [ ] 启用 `payloadExtraction` 减少 HTML 体积
- [ ] 非首屏组件使用 `<Lazy>` 前缀懒加载
- [ ] 浏览器 API 组件包裹 `<ClientOnly>`
- [ ] 图片使用 `@nuxt/image` 自动优化
- [ ] 正确配置 `routeRules` 缓存策略（ISR/SWR）
- [ ] 静态资源设置长期缓存头
- [ ] 使用虚拟列表处理长列表
- [ ] 服务端查询只选择需要的字段
- [ ] 频繁访问的热数据使用 `useStorage` 缓存
- [ ] 部署前运行 `nuxi analyze` 检查 bundle 大小