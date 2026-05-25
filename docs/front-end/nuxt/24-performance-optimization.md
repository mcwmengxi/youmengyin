# 性能优化实践

> 本章汇总 Nuxt 3 项目性能优化的核心技巧。

## 一、构建与打包优化

### 1.1 代码分割与懒加载

```vue
<script setup>
// ✅ 异步加载重组件
const HeavyChart = defineAsyncComponent(() =>
  import('~/components/HeavyChart.vue')
)

// ✅ 动态导入工具库
async function exportPDF() {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  // ...
}
</script>

<template>
  <ClientOnly>
    <HeavyChart v-if="showChart" />
  </ClientOnly>
</template>
```

### 1.2 控制 Chunk 大小

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将大库单独分包
            if (id.includes('node_modules/echarts')) {
              return 'echarts'
            }
            if (id.includes('node_modules/monaco-editor')) {
              return 'monaco'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },
    },
  },
})
```

### 1.3 Tree Shaking

```ts
// ❌ 引入整个库
import _ from 'lodash'

// ✅ 按需引入
import debounce from 'lodash/debounce'
```

```ts
// vite.config 中标记无副作用的包
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        treeshake: true,
      },
    },
  },
})
```

---

## 二、图片优化

### 2.1 使用 Nuxt Image

```vue
<template>
  <!-- 自动压缩、格式转换、响应式 -->
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    quality="80"
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</template>
```

### 2.2 响应式图片

```vue
<NuxtPicture src="/banner.jpg" :img-attrs="{ class: 'w-full' }" />
```

### 2.3 首屏关键图片预加载

```vue
<template>
  <NuxtImg src="/hero.jpg" preload fetchpriority="high" />
</template>
```

---

## 三、字体优化

### 3.1 使用 @nuxtjs/google-fonts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Noto Sans SC': [400, 500, 700],
    },
    display: 'swap',
    preload: true,
    useStylesheet: false, // 内联字体 CSS 减少请求
  },
})
```

### 3.2 本地字体（最佳性能）

```css
/* assets/fonts/fonts.css */
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap;
}
```

---

## 四、渲染优化

### 4.1 合理的渲染策略

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 首页 — SSR（SEO 优先）
    '/': { ssr: true },

    // 不需要 SEO 的页面 — 客户端渲染
    '/dashboard/**': { ssr: false },

    // 变化不频繁的页面 — ISR
    '/products/**': { isr: 600 },

    // 静态内容 — 预渲染
    '/about': { prerender: true },

    // 搜索结果页 — SWR
    '/search/**': { swr: 300 },
  },
})
```

### 4.2 ClientOnly 减少服务端负担

```vue
<template>
  <div>
    <h1>文章标题</h1>
    <!-- 服务端渲染 -->

    <ClientOnly>
      <CommentSection />
      <!-- 仅客户端渲染 -->
      <template #fallback>
        <p>评论加载中...</p>
      </template>
    </ClientOnly>
  </div>
</template>
```

### 4.3 延迟水合

```bash
npx nuxi module add nuxt-delay-hydration
```

```vue
<template>
  <!-- 页面水合后再加载次要交互 -->
  <div v-lazy-hydrate>
    <HeavyInteractiveComponent />
  </div>
</template>
```

---

## 五、数据获取优化

### 5.1 请求合并与缓存

```ts
// ✅ 使用 Promise.all 并行请求
const [{ data: posts }, { data: categories }] = await Promise.all([
  useAsyncData('posts', () => $fetch('/api/posts')),
  useAsyncData('categories', () => $fetch('/api/categories')),
])

// ✅ API 响应缓存
// server/api/posts.ts
export default defineCachedEventHandler(
  async () => {
    return await fetchPosts()
  },
  {
    maxAge: 60, // 缓存 60 秒
    swr: true, // 过期后后台更新
    getKey: (event) => event.path,
  }
)
```

### 5.2 分页 + 虚拟滚动

```vue
<script setup>
// 大列表使用分页而非全量加载
const { items, pending, loadMore } = usePagination((page) =>
  $fetch('/api/posts', { query: { page, limit: 20 } })
)
</script>
```

### 5.3 预取数据

```vue
<script setup>
// 鼠标悬停时预取详情页数据
function prefetchDetail(id) {
  preloadRouteComponents(`/posts/${id}`)
  prefetch(`/api/posts/${id}`)
}
</script>

<template>
  <NuxtLink
    v-for="post in posts"
    :to="`/posts/${post.id}`"
    @mouseenter="prefetchDetail(post.id)"
  >
    {{ post.title }}
  </NuxtLink>
</template>
```

---

## 六、CSS 优化

### 6.1 移除未使用的 CSS (PurgeCSS)

```ts
// nuxt.config.ts — Tailwind 已内置
export default defineNuxtConfig({
  postcss: {
    plugins: {
      '@fullhuman/postcss-purgecss': {
        content: ['./**/*.vue', './**/*.html'],
        safelist: ['dark'],
      },
    },
  },
})
```

### 6.2 关键 CSS 内联

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    inlineSSRStyles: true, // SSR 时内联样式
  },
})
```

### 6.3 CSS 异步加载

```vue
<script setup>
// 按需加载 CSS
onMounted(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/css/print.css'
  link.media = 'print'
  document.head.appendChild(link)
})
</script>
```

---

## 七、监控与分析

### 7.1 Lighthouse / PageSpeed Insights

```bash
# 使用 Lighthouse CLI 自动化检测
npm install -g lighthouse
lighthouse https://example.com --view
```

### 7.2 Nuxt DevTools

```ts
export default defineNuxtConfig({
  devtools: { enabled: true },
})
```

DevTools 内置了性能面板，可查看：

- Payload 大小分析
- 模块加载时间
- SSR/CSR 混合渲染分析

### 7.3 自定义性能埋点

```ts
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // 监控核心 Web 指标
    import('web-vitals').then(({ onLCP, onFID, onCLS, onINP }) => {
      onLCP(console.log)
      onFID(console.log)
      onCLS(console.log)
      onINP(console.log)
    })
  }
})
```

---

## 八、性能检查清单

### 构建层面

- [ ] 移除未使用依赖
- [ ] 大型库按需导入 / 分包
- [ ] 生产构建开启压缩
- [ ] 图片使用 Nuxt Image 优化

### 渲染层面

- [ ] 页面按需使用 SSR/SSG/SPA
- [ ] 重交互组件使用 `<ClientOnly>`
- [ ] 非首屏组件懒加载

### 网络层面

- [ ] 静态资源 CDN 部署
- [ ] API 响应合理缓存
- [ ] 字体使用 `font-display: swap`
- [ ] 启用 HTTP/2

### 运行时

- [ ] 避免不必要的 `watch`
- [ ] 大列表分页或虚拟滚动
- [ ] `useAsyncData` 使用 key 控制缓存
- [ ] 预加载关键页面
