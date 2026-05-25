# 中间件机制

> 本章讲解 Nuxt 路由中间件的创建、分类及使用场景。

## 一、中间件类型

Nuxt 3 的中间件是一个**路由导航守卫**，在页面渲染前执行。分为三种类型：

| 类型           | 文件命名        | 触发方式                           |
| -------------- | --------------- | ---------------------------------- |
| **全局中间件** | `xxx.global.ts` | 每次路由切换自动执行               |
| **命名中间件** | `xxx.ts`        | 页面通过 `definePageMeta` 手动指定 |
| **内联中间件** | 直接写在页面内  | 仅在该页面生效                     |

---

## 二、中间件创建与注册

### 2.1 全局中间件

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')

  // 未登录且不在登录页 → 重定向
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login?redirect=' + to.fullPath)
  }
})
```

全局中间件在 `middleware/` 目录下，文件名必须以 `.global.ts` 结尾。

### 2.2 命名中间件

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState('user')

  if (!user.value?.isAdmin) {
    // 中止导航并显示错误页面
    throw createError({
      statusCode: 403,
      message: '无权限访问',
    })
  }
})
```

在页面中使用：

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: ['auth'], // 使用 middleware/auth.ts
  // 或 middleware: 'auth'
})
</script>
```

### 2.3 内联中间件

```vue
<!-- pages/editor/[id].vue -->
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      const draftId = to.params.id
      const drafts = useState('drafts')

      if (!drafts.value.find((d) => d.id === draftId)) {
        return navigateTo('/')
      }
    },
  ],
})
</script>
```

---

## 三、中间件执行顺序

### 3.1 执行流程

```
用户导航 → 全局中间件（按文件名排序） → 命名/内联中间件（按 definePageMeta 数组顺序） → 页面渲染
```

### 3.2 排序示例

```
middleware/
├── 01.setup.global.ts    # ① 最先执行
├── 02.analytics.global.ts # ② 第二个
├── auth.ts               # ③ 在页面指定后才执行
└── permission.ts         # ④ 在页面指定后才执行
```

```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'permission'], // ③ → ④
})
</script>
```

最终执行顺序：① → ② → ③ → ④ → 页面渲染

---

## 四、实际应用场景

### 4.1 用户认证守卫

```ts
// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user, refreshUser } = useAuth()

  // 公共页面无需登录
  const publicPages = ['/', '/login', '/register', '/about']
  if (publicPages.includes(to.path)) return

  // 未登录且有 token — 尝试恢复会话
  if (!user.value) {
    await refreshUser()
  }

  // 仍然未登录 — 重定向
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

### 4.2 路由日志记录

```ts
// middleware/analytics.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.client) {
    console.log(`[路由] ${from.path} → ${to.path}`)
  }
})
```

### 4.3 权限控制

```ts
// middleware/role.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useState('user')

  // 路由元信息中定义的所需角色
  const requiredRole = to.meta.role
  if (requiredRole && user.value?.role !== requiredRole) {
    return navigateTo('/403')
  }
})
```

```vue
<!-- pages/admin/users.vue -->
<script setup>
definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin', // 自定义元信息
})
</script>
```

### 4.4 移动端重定向

```ts
// middleware/mobile-redirect.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    const userAgent = useRequestHeaders()['user-agent'] || ''
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent)

    if (isMobile && !to.path.startsWith('/m')) {
      return navigateTo('/m' + to.path)
    }
  }
})
```

### 4.5 多中间件编排

```ts
// middleware/checkout.ts
export default defineNuxtRouteMiddleware(() => {
  const cart = useState('cart')

  // 购物车为空不能进入结算页
  if (!cart.value?.items?.length) {
    return navigateTo('/cart')
  }
})
```

```vue
<!-- pages/checkout.vue -->
<script setup>
definePageMeta({
  // 按顺序执行的中间件链
  middleware: [
    'auth', // 1. 先检查登录
    'checkout', // 2. 再检查购物车
  ],
})
</script>
```

### 4.6 中间件返回值

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 无返回值 / return undefined → 放行，继续导航

  // return navigateTo() → 重定向到指定页面
  return navigateTo('/login')

  // throw createError() → 触发错误页面
  throw createError({ statusCode: 404, message: '页面不存在' })

  // 返回 true / false → 放行 / 取消导航
  return false // 取消当前导航
})
```
