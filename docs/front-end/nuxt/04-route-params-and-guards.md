# 路由参数与导航守卫

> 本章深入路由参数传递、编程式导航以及路由守卫的使用。

## 一、路由参数获取

### 1.1 `useRoute` — 获取当前路由信息

```vue
<script setup>
const route = useRoute()

// 路由路径
console.log(route.path)        // "/posts/123?tab=comments"

// 动态参数
console.log(route.params)      // { id: "123" }

// 查询参数
console.log(route.query)       // { tab: "comments" }

// 路由名称
console.log(route.name)        // "posts-id"

// 路由元信息
console.log(route.meta)        // { layout: "default" }

// hash 锚点
console.log(route.hash)        // "#section-1"

// 完整路径（含 query 和 hash）
console.log(route.fullPath)    // "/posts/123?tab=comments#section-1"
</script>
```

### 1.2 查询参数（Query）处理

查询参数适用于**非必选**的过滤、搜索、分页等场景：

```vue
<!-- /search?q=vue&page=2 -->
<script setup>
const route = useRoute()
const searchQuery = route.query.q     // "vue"
const currentPage = route.query.page  // "2"（注意：query 值都是字符串）
</script>
```

**更新查询参数**而不重新加载页面：

```vue
<script setup>
const router = useRouter()

// 追加/更新查询参数
router.push({ query: { page: 3 } })

// 替换查询参数（不产生历史记录）
router.replace({ query: { page: 3 } })
</script>
```

### 1.3 `watch` 监听路由变化

```vue
<script setup>
const route = useRoute()

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  console.log('文章 ID 变化:', newId)
  fetchArticle(newId)
})

// 监听完整路由变化
watch(() => route.fullPath, () => {
  console.log('路由切换')
})
</script>
```

---

## 二、编程式导航

### 2.1 `useRouter` 基础

```vue
<script setup>
const router = useRouter()

// 路径导航
router.push('/about')

// 命名路由导航
router.push({ name: 'posts-id', params: { id: 1 } })

// 带查询参数
router.push({ path: '/search', query: { q: 'nuxt' } })

// 替换当前历史记录（不产生后退记录）
router.replace('/login')

// 前进 / 后退
router.go(1)   // 前进
router.go(-1)  // 后退
router.back()  // 后退
</script>
```

### 2.2 `navigateTo` — Nuxt 专用导航

Nuxt 提供了 `navigateTo` 辅助函数，支持服务端和客户端：

```vue
<script setup>
// 基础导航（客户端 + 服务端均可使用）
await navigateTo('/dashboard')

// 命名路由
await navigateTo({ name: 'posts-id', params: { id: 1 } })

// 外部 URL 重定向
await navigateTo('https://example.com', { external: true })

// 替换当前历史记录
await navigateTo('/new-path', { replace: true })

// 重定向代码（SSR 时设置 HTTP 状态码）
await navigateTo('/login', { redirectCode: 302 })
</script>
```

**`router.push` vs `navigateTo`：**

| 场景 | 推荐 |
|------|------|
| 用户点击事件中的页面跳转 | `router.push` |
| 服务端权限检查后重定向 | `navigateTo` |
| 中间件中路由拦截 | `navigateTo` |
| 需要设置 HTTP 状态码的重定向 | `navigateTo` |

---

## 三、导航守卫

### 3.1 全局中间件

在 `middleware/` 目录创建全局中间件（文件名加 `.global.ts` 后缀）：

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 检查是否登录
  const token = useCookie('token')
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

- 全局中间件**每次路由切换都会执行**
- 命名规范：`xxx.global.ts`

### 3.2 路由中间件

不加 `.global` 前缀的就是命名中间件，需要在页面中手动引用：

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log(`从 ${from.path} 导航到 ${to.path}`)

  // 返回 true / 无返回值 → 放行
  // 返回 navigateTo() → 重定向
  // 抛出错误 → 中断导航
})
```

在页面中使用：

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: ['auth'] // 可指定多个中间件：['auth', 'log']
})
</script>
```

### 3.3 内联中间件

不创建独立文件，直接在页面内定义：

```vue
<!-- pages/admin/settings.vue -->
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      const isAdmin = useState('isAdmin')
      if (!isAdmin.value) {
        return navigateTo('/403')
      }
    }
  ]
})
</script>
```

### 3.4 中间件执行顺序

1. 全局中间件（按文件名排序）
2. 页面 `definePageMeta` 中指定的中间件（按数组顺序）

### 3.5 页面级导航守卫

Nuxt 提供的页面生命周期钩子：

```vue
<script setup>
// 页面进入前（可获取数据）
definePageMeta({
  // 验证路由参数
  validate(route) {
    return /^\d+$/.test(route.params.id) // 必须为数字
  }
})
</script>
```

**完整示例：路由守卫 + 参数校验**

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useState('user')
  if (!user.value?.id) {
    return navigateTo('/login?redirect=' + to.fullPath)
  }
})
```

```vue
<!-- pages/admin/users/[id].vue -->
<script setup>
definePageMeta({
  middleware: ['auth'],
  validate(route) {
    return /^\d+$/.test(route.params.id)
  }
})
</script>
```

---

## 四、路由元信息

### 4.1 `definePageMeta`

为页面设置元信息，包括布局、中间件、权限等：

```vue
<script setup>
definePageMeta({
  layout: 'admin',           // 指定布局
  middleware: ['auth'],       // 指定中间件
  alias: '/old-dashboard',   // 路由别名
  name: 'custom-name',       // 自定义路由名
  path: '/custom-path',      // 自定义路径（覆盖文件路由）
  title: '仪表盘',           // 自定义元信息
  keepalive: true,           // 页面缓存
  key: 'unique-key',         // 强制重新渲染的 key
  validate(route) {          // 参数校验
    return /^\d+$/.test(route.params.id)
  }
})
</script>
```

### 4.2 读取元信息

```vue
<script setup>
const route = useRoute()
const meta = route.meta // 包含 definePageMeta 中定义的所有信息

// 在布局/组件中获取当前页面的元信息
const { title } = route.meta
</script>
```

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <h1>{{ route.meta.title || '默认标题' }}</h1>
    <slot />
  </div>
</template>

<script setup>
const route = useRoute()
</script>
```