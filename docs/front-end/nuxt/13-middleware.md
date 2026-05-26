# 中间件机制

> 本章讲解 Nuxt 4 的中间件系统，包括全局中间件、命名中间件和内联中间件的使用方式。

## 一、中间件概述

中间件在页面渲染前执行，用于：
- 身份验证与授权
- 重定向
- 日志记录
- 路由守卫

Nuxt 4 的中间件文件放在 `app/middleware/` 目录。

---

## 二、中间件类型

### 2.1 全局中间件

文件名以 `.global.ts` 结尾，**所有路由跳转时自动执行**：

```ts
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')

  // 公开页面白名单
  const publicPages = ['/login', '/register', '/']

  if (!token.value && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }
})
```

### 2.2 命名中间件

在 `definePageMeta` 中按需引用：

```ts
// app/middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState('auth-user')

  if (!user.value || user.value.role !== 'admin') {
    return navigateTo('/403')
  }
})
```

```vue
<!-- app/pages/admin/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})
</script>
```

### 2.3 内联中间件

直接在页面中定义，适用于简单的、只在一处使用的逻辑：

```vue
<!-- app/pages/settings.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: (to, from) => {
    const settings = useCookie('settings-initialized')
    if (!settings.value) {
      return navigateTo('/setup-wizard')
    }
  },
})
</script>
```

---

## 三、中间件执行顺序

```ts
// app/pages/dashboard.vue
definePageMeta({
  middleware: ['auth', 'log', 'track'],  // 从左到右依次执行
})
```

等效于链式调用：

```
auth → (通过) → log → (通过) → track → (通过) → 渲染页面
auth → (拦截) → 停止执行，重定向到 /login
```

### 3.1 全局 + 命名 顺序

```
全局中间件 (.global.ts) → 命名中间件（按数组顺序）→ 渲染页面
```

---

## 四、中间件 API

### 4.1 `defineNuxtRouteMiddleware`

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  // to: 目标路由
  // from: 来源路由

  // 返回 navigateTo 来重定向
  if (!isAuthenticated()) {
    return navigateTo('/login')
  }

  // 返回 abortNavigation 来中止导航
  if (!hasAccess(to)) {
    return abortNavigation('没有访问权限')
  }

  // 不返回任何值 = 通过，继续执行
})
```

### 4.2 常用模式

**角色检查**：

```ts
// app/middleware/role.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useUserStore()

  const requiredRole = to.meta.role as string | undefined
  if (requiredRole && user.role !== requiredRole) {
    return navigateTo('/unauthorized')
  }
})
```

**重定向已登录用户**：

```ts
// app/middleware/guest.ts
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')

  if (token.value) {
    return navigateTo('/dashboard')
  }
})
```

**带查询参数的登录重定向**：

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')

  if (!token.value) {
    // 登录后重定向回原页面
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
```

---

## 五、Nuxt 4 中间件增强

### 5.1 TypeScript 类型安全

Nuxt 4 的 TypeScript 隔离让中间件中的 API 提示更准确：

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // to.meta 类型根据 definePageMeta 自动推断
  if (to.meta.requiresAuth) {
    // ...
  }
})
```

### 5.2 异步中间件

Nuxt 4 对异步中间件支持更好：

```ts
// app/middleware/verify.ts
export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { valid } = await $fetch('/api/auth/verify')
    if (!valid) {
      return navigateTo('/login')
    }
  } catch {
    return navigateTo('/error')
  }
})
```

### 5.3 共享中间件的 Nuxt 4 最佳实践

中间件逻辑应尽量抽取为 Composable，中间件文件本身只做路由级判断：

```ts
// app/composables/useAuthGuard.ts
export function useAuthGuard() {
  const token = useCookie('token')
  const user = useState('auth-user')

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function requireAuth() {
    if (!isAuthenticated.value) {
      throw createError({ statusCode: 401, message: '请先登录' })
    }
  }

  return { isAuthenticated, requireAuth }
}
```

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuthGuard()
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

---

## 六、中间件最佳实践

- **全局中间件慎用**，只在确实需要全量拦截时使用 `.global.ts`
- **业务逻辑放入 Composable**，中间件只做路由级决策
- **命名中间件按功能拆分**：`auth`、`guest`、`role`、`log`
- **中间件尽量轻量**，避免在中间件中做大量数据处理
- **Nuxt 4 中中间件放在 `app/middleware/`** 目录下