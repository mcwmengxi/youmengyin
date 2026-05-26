# 内置 Composables

> 本章汇总 Nuxt 4 内置的组合式函数（Composables），包括路由、SEO、Cookie、请求头、应用配置等常用 API。

## 一、路由相关

### 1.1 `useRoute` — 当前路由信息

```vue
<script setup lang="ts">
const route = useRoute()

route.path       // '/posts/123'
route.params     // { id: '123' }
route.query      // { tab: 'comments' }
route.name       // 'posts-id'
route.fullPath   // '/posts/123?tab=comments#section'
route.hash       // '#section'
route.meta       // 页面元信息
</script>
```

### 1.2 `useRouter` — 编程式导航

```vue
<script setup lang="ts">
const router = useRouter()

router.push('/about')
router.push({ name: 'posts-id', params: { id: '1' } })
router.replace('/new-path')
router.back()
router.forward()
router.go(-1)
</script>
```

### 1.3 `navigateTo` — 导航助手

```ts
// 在中间件、插件或 setup 中使用
await navigateTo('/login')
await navigateTo({ path: '/search', query: { q: 'vue' } })

// 替换当前历史记录
await navigateTo('/new-path', { replace: true })

// 外部链接
await navigateTo('https://example.com', { external: true })
```

---

## 二、SEO & Head 管理

### 2.1 `useHead` — 页面 Head 标签

```vue
<script setup lang="ts">
useHead({
  title: '我的页面',
  titleTemplate: '%s | My App',
  meta: [
    { name: 'description', content: '页面描述' },
    { property: 'og:title', content: 'Open Graph 标题' },
    { property: 'og:image', content: 'https://example.com/og.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' },
  ],
  script: [
    { src: 'https://example.com/external.js', defer: true },
  ],
})
</script>
```

### 2.2 `useSeoMeta` — 简化 SEO Meta

```vue
<script setup lang="ts">
useSeoMeta({
  title: '产品列表',
  description: '浏览我们最新的产品系列',
  ogTitle: '产品列表 | My Store',
  ogDescription: '购物好去处',
  ogImage: 'https://example.com/og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>
```

### 2.3 `useServerHead` / `useServerSeoMeta`

服务端专用的 Head 设置，不会发送到客户端：

```vue
<script setup lang="ts">
useServerHead({
  title: '管理后台',
})
// 这个 title 不会出现在客户端 JS 中
</script>
```

---

## 三、Cookie 管理

### 3.1 `useCookie` — 读写 Cookie

```ts
// 创建/读取 Cookie
const theme = useCookie('theme', {
  default: () => 'light',
  maxAge: 60 * 60 * 24 * 365,  // 1 年
  secure: true,
  httpOnly: false,
  sameSite: 'lax',
})

// 修改
theme.value = 'dark'

// 删除
theme.value = null
```

### 3.2 Cookie 选项

| 选项       | 类型      | 说明                       |
| ---------- | --------- | -------------------------- |
| `maxAge`   | `number`  | 过期时间（秒）             |
| `expires`  | `Date`    | 过期日期                   |
| `secure`   | `boolean` | 仅 HTTPS                   |
| `httpOnly` | `boolean` | 禁止 JS 访问（服务端可用） |
| `sameSite` | `string`  | `'lax'` / `'strict'` / `'none'` |
| `domain`   | `string`  | Cookie 域                  |
| `path`     | `string`  | Cookie 路径                |

---

## 四、应用上下文

### 4.1 `useNuxtApp` — 获取 Nuxt 实例

```vue
<script setup lang="ts">
const nuxtApp = useNuxtApp()

// nuxtApp 提供的属性：
nuxtApp.$router     // Vue Router
nuxtApp.$i18n       // 国际化（如果使用）
nuxtApp.$pinia      // Pinia 实例（如果使用）
nuxtApp.ssrContext  // SSR 上下文（服务端）
nuxtApp.payload     // 序列化数据
</script>
```

### 4.2 `useRuntimeConfig` — 运行时配置

```vue
<script setup lang="ts">
const config = useRuntimeConfig()

// 公共配置（客户端和服务端都能访问）
config.public.apiBaseUrl
config.public.appEnv

// 私有配置（仅服务端可访问）
// config.databaseUrl  // 客户端拿不到
</script>
```

### 4.3 `useAppConfig` — 应用配置

```vue
<script setup lang="ts">
const appConfig = useAppConfig()

appConfig.title    // 'My App'
appConfig.theme    // { primary: '#00DC82' }
</script>
```

---

## 五、请求与响应

### 5.1 `useRequestHeaders` — 读取请求头

```vue
<script setup lang="ts">
// 仅在服务端可用
const headers = useRequestHeaders(['user-agent', 'cookie'])
// headers['user-agent'] // 'Mozilla/5.0...'
</script>
```

### 5.2 `useRequestURL` — 获取请求 URL

```vue
<script setup lang="ts">
const url = useRequestURL()
// url.href    'https://example.com/page?q=test'
// url.origin  'https://example.com'
// url.pathname '/page'
// url.searchParams
</script>
```

### 5.3 `useRequestEvent` — 获取 Nitro 事件对象

```ts
// 仅在服务端可用
const event = useRequestEvent()
event.context  // 请求上下文
```

---

## 六、错误处理

### 6.1 `useError` — 获取当前错误

```vue
<!-- app/error.vue -->
<script setup lang="ts">
const error = useError()

console.log(error.value?.statusCode)  // 404
console.log(error.value?.message)     // 'Page not found'
</script>
```

### 6.2 `createError` — 创建错误

```vue
<script setup lang="ts">
throw createError({
  statusCode: 404,
  message: '页面未找到',
  fatal: true,
})
</script>
```

### 6.3 `showError` — 显示错误页面

```vue
<script setup lang="ts">
// 在事件处理中触发错误页面
function handleNotFound() {
  showError({
    statusCode: 404,
    message: '找不到该资源',
  })
}
</script>
```

---

## 七、工具类

### 7.1 `useLoadingIndicator` — 加载进度条

```vue
<script setup lang="ts">
const { start, finish, isLoading } = useLoadingIndicator()

// 页面跳转时自动调用，也可以手动控制
start()
// ... 执行异步操作
finish()
</script>
```

### 7.2 `preloadRouteComponents` — 预加载路由组件

```ts
// 预加载目标页面的组件，提升导航速度
await preloadRouteComponents('/dashboard')
```

### 7.3 `prefetchComponents` / `preloadComponents`

```vue
<script setup lang="ts">
// 预取/预加载指定组件
await prefetchComponents('Modal', 'Chart')
</script>
```

### 7.4 `onPrehydrate` — 水合前回调

```vue
<script setup lang="ts">
onPrehydrate(() => {
  // 在水合（客户端激活）之前执行
  console.log('即将水合')
})
</script>
```

---

## 八、Nuxt 4 新增 Composable

### `refreshNuxtData` — 刷新数据缓存

```vue
<script setup lang="ts">
// 刷新所有缓存的数据获取
await refreshNuxtData()

// 刷新特定 key
await refreshNuxtData('posts-list')

// 刷新匹配 key 的数据
await refreshNuxtData((key) => key.startsWith('posts-'))
</script>
```

---

## 九、Composables 速查表

| Composable               | 用途               | 可用环境          |
| ------------------------ | ------------------ | ----------------- |
| `useRoute`               | 当前路由信息       | 客户端 + 服务端   |
| `useRouter`              | 编程式导航         | 客户端            |
| `navigateTo`             | 导航函数           | 客户端 + 服务端   |
| `useHead`                | SEO Head 管理      | 客户端 + 服务端   |
| `useSeoMeta`             | 简化 SEO Meta      | 客户端 + 服务端   |
| `useCookie`              | Cookie 读写        | 客户端 + 服务端   |
| `useNuxtApp`             | Nuxt 实例          | 客户端 + 服务端   |
| `useRuntimeConfig`       | 运行时配置         | 客户端 + 服务端   |
| `useAppConfig`           | 应用配置           | 客户端 + 服务端   |
| `useRequestHeaders`      | 请求头             | 服务端            |
| `useRequestEvent`        | Nitro 事件         | 服务端            |
| `useError`               | 错误信息           | 客户端 + 服务端   |
| `createError`            | 创建错误           | 客户端 + 服务端   |
| `showError`              | 显示错误页         | 客户端            |
| `refreshNuxtData`        | 刷新数据缓存       | 客户端            |
| `useLoadingIndicator`    | 加载进度条         | 客户端 + 服务端   |