# 内置 Composables

> 本章整理 Nuxt 3 内置的组合式函数，包括 `useRoute`、`useRouter`、`useHead`、`useCookie` 等常用 API。

## 一、useRoute / useRouter

详见 [路由参数与导航守卫](./04-路由参数与导航守卫.md)。

```vue
<script setup>
const route = useRoute() // 当前路由信息（只读）
const router = useRouter() // 路由实例（导航控制）

// 路由参数
route.params.id
route.query.page

// 编程式导航
router.push('/about')
router.replace({ path: '/login' })
router.back()
</script>
```

---

## 二、useHead / useSeoMeta

### 2.1 useHead — 动态设置页面 Head

```vue
<script setup>
useHead({
  title: '文章详情',
  meta: [
    { name: 'description', content: '文章描述' },
    { property: 'og:title', content: '分享标题' },
  ],
  link: [{ rel: 'canonical', href: 'https://example.com/page' }],
  script: [{ src: 'https://example.com/script.js', async: true }],
  style: [{ children: 'body { color: red }' }],
})
</script>
```

### 2.2 响应式 Head

```vue
<script setup>
const title = ref('首页')

useHead({
  title, // 响应式 — title 变化时自动更新
  meta: computed(() => [
    { name: 'description', content: `关于 ${title.value} 的页面` },
  ]),
})
</script>
```

### 2.3 useSeoMeta — SEO 专用快捷方式

```vue
<script setup>
useSeoMeta({
  title: '我的博客',
  description: '分享前端技术的博客',
  ogTitle: '我的博客',
  ogDescription: '分享前端技术的博客',
  ogImage: 'https://example.com/og.png',
  twitterCard: 'summary_large_image',
})
</script>
```

### 2.4 全局 Head 默认值

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: '我的网站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
```

---

## 三、useCookie

### 3.1 基本用法

```vue
<script setup>
// 读取/设置 Cookie（服务端和客户端通用）
const token = useCookie('token')

// 设置值
token.value = 'abc123'

// 带选项
const theme = useCookie('theme', {
  default: () => 'light', // 默认值
  maxAge: 60 * 60 * 24, // 过期时间（秒）
  path: '/', // 作用路径
  secure: true, // 仅 HTTPS
  httpOnly: false, // JS 可读
  sameSite: 'lax', // 跨站策略
  watch: true, // 变化时自动同步（默认 true）
})

// 监听 Cookie 变化
watch(theme, (newVal) => {
  console.log('主题切换:', newVal)
})
</script>
```

### 3.2 常用场景

```vue
<script setup>
// 用户 Token
const token = useCookie('token', {
  maxAge: 60 * 60 * 24 * 7, // 7 天过期
  secure: true,
})

// 网站主题
const theme = useCookie('theme', {
  default: () => 'system',
})

// 语言偏好
const locale = useCookie('locale', {
  default: () => 'zh-CN',
})

// 删除 Cookie
function clearToken() {
  token.value = null // 设为 null 即可删除
}
</script>
```

---

## 四、useRuntimeConfig

### 4.1 配置定义

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // private — 仅在服务端可用
    apiSecret: 'sk-xxx',
    databaseUrl: 'postgres://...',

    // public — 客户端和服务端都可用
    public: {
      apiBase: 'https://api.example.com',
      siteName: '我的博客',
      version: '1.0.0',
    },
  },
})
```

### 4.2 在应用中使用

```vue
<script setup>
const config = useRuntimeConfig()

// public 配置
console.log(config.public.apiBase) // "https://api.example.com"

// private 配置 — 仅服务端能访问
// console.log(config.apiSecret)     // 客户端输出 undefined
</script>
```

### 4.3 环境变量覆盖

```bash
# .env
NUXT_API_SECRET=secret-xxx
NUXT_PUBLIC_API_BASE=https://prod.example.com
```

环境变量会自动覆盖 `runtimeConfig` 中的同名配置。

---

## 五、useAppConfig

### 5.1 定义 app.config.ts

```ts
// app.config.ts
export default defineAppConfig({
  theme: {
    primary: '#3B82F6',
    secondary: '#10B981',
  },
  site: {
    name: '我的博客',
    description: '分享前端技术',
  },
})
```

### 5.2 在应用中使用

```vue
<script setup>
const appConfig = useAppConfig()

console.log(appConfig.theme.primary) // "#3B82F6"
</script>
```

### 5.3 runtimeConfig vs appConfig

| 特性         | `runtimeConfig`    | `appConfig`              |
| ------------ | ------------------ | ------------------------ |
| 定义位置     | `nuxt.config.ts`   | `app.config.ts`          |
| 环境变量覆盖 | 支持               | 不支持                   |
| 热更新       | 需重启             | 开发时热更新             |
| 敏感数据     | 支持（private）    | 不支持（应存放公开配置） |
| 适用场景     | 环境相关配置、密钥 | 应用主题、网站信息       |

---

## 六、useNuxtApp

### 6.1 获取 Nuxt 上下文

```vue
<script setup>
const nuxtApp = useNuxtApp()

// 访问插件注入的全局方法
const { $hello, $echarts } = nuxtApp

// 检查运行环境
console.log(nuxtApp.isHydrating) // 是否正在 hydration
console.log(nuxtApp.ssrContext) // SSR 上下文（仅服务端）

// 访问 Vue 实例
nuxtApp.vueApp.component('MyComponent')

// 访问 Payload（SSR 序列化数据）
const user = nuxtApp.payload.data.user
</script>
```

### 6.2 钩子（Hooks）

```ts
// plugins/my-plugin.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 应用挂载前
  nuxtApp.hook('app:beforeMount', () => {
    console.log('应用即将挂载')
  })

  // 应用挂载后
  nuxtApp.hook('app:mounted', () => {
    console.log('应用已挂载')
  })

  // 页面渲染前
  nuxtApp.hook('page:start', () => {
    NProgress.start()
  })

  // 页面渲染完成
  nuxtApp.hook('page:finish', () => {
    NProgress.done()
  })

  // 应用错误
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误:', error)
  })
})
```

### 6.3 常用 hook 列表

| Hook              | 触发时机       |
| ----------------- | -------------- |
| `app:created`     | 应用实例创建后 |
| `app:beforeMount` | 挂载前         |
| `app:mounted`     | 挂载后         |
| `app:error`       | 应用级错误     |
| `page:start`      | 页面导航开始   |
| `page:finish`     | 页面导航完成   |
| `vuet:error`      | Vue 渲染错误   |
| `link:prefetch`   | 链接预加载     |
