# 页面路由与动态路由

> Nuxt 4 的路由系统完全向后兼容 Nuxt 3，文件系统路由的核心机制不变。本章重点讲解基于 `app/pages/` 的路由映射、动态路由和嵌套路由。

## 一、文件系统路由

### 1.1 基础映射规则

Nuxt 4 使用**约定式路由**，`app/pages/` 目录下的文件结构自动映射为 Vue Router 配置。

```
app/pages/
├── index.vue            → /
├── about.vue            → /about
├── contact.vue          → /contact
└── blog/
    └── index.vue        → /blog
```

**无需手动配置路由表**，创建文件即生效。

### 1.2 路由出口 — `<NuxtPage>`

```vue
<!-- app/app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

`<NuxtPage />` 是 `app/pages/` 目录的路由出口，等价于 Vue Router 的 `<RouterView />`。

### 1.3 路由链接 — `<NuxtLink>`

```vue
<template>
  <nav>
    <!-- 基础链接 -->
    <NuxtLink to="/">首页</NuxtLink>
    <NuxtLink to="/about">关于</NuxtLink>

    <!-- 动态参数 -->
    <NuxtLink :to="`/posts/${post.id}`">文章</NuxtLink>

    <!-- 命名路由 -->
    <NuxtLink :to="{ name: 'posts-id', params: { id: 1 } }">文章 #1</NuxtLink>
  </nav>
</template>
```

### 1.4 `<NuxtLink>` 常用属性

| 属性          | 说明                                   | 示例                                  |
| ------------- | -------------------------------------- | ------------------------------------- |
| `to`          | 目标路径或路由对象                     | `to="/about"`                         |
| `external`    | 标记为外部链接，渲染 `<a>`             | `external`                            |
| `target`      | 同 HTML target 属性                    | `target="_blank"`                     |
| `replace`     | 替换当前历史而不是压栈                 | `replace`                             |
| `activeClass` | 激活时的 class                         | `activeClass="text-blue-500"`         |
| `prefetch`    | 是否预取目标页面（默认 true）          | `:prefetch="false"`                   |
| `noRelax`     | 是否不松弛匹配（精确匹配）             | `noRelax`                             |

---

## 二、动态路由

### 2.1 基本动态参数 `[param].vue`

```
app/pages/
└── posts/
    └── [id].vue          → /posts/:id
```

```vue
<!-- app/pages/posts/[id].vue -->
<script setup lang="ts">
const route = useRoute()
const postId = route.params.id  // 获取动态参数
</script>

<template>
  <div>文章 ID: {{ postId }}</div>
</template>
```

### 2.2 多段动态参数

```
app/pages/
└── category/
    └── [category]/
        └── [product].vue  → /category/:category/:product
```

### 2.3 可选参数 `[[param]].vue`

```
app/pages/
└── user/
    └── [[id]].vue          → 匹配 /user 和 /user/:id
```

当 `id` 不存在时 `route.params.id` 为 `undefined`。

### 2.4 全捕获路由 `[...slug].vue`

```
app/pages/
└── docs/
    └── [...slug].vue       → 匹配 /docs/a/b/c/d
```

```vue
<script setup lang="ts">
const route = useRoute()
// 访问 /docs/guide/getting-started/introduction
// route.params.slug → ['guide', 'getting-started', 'introduction']
</script>
```

---

## 三、嵌套路由

### 3.1 父子路由结构

```
app/pages/
├── parent/
│   ├── index.vue       → /parent
│   ├── child.vue       → /parent/child
│   └── deep/
│       └── nested.vue  → /parent/deep/nested
```

父级需要 `<NuxtPage />` 来渲染子页面：

```vue
<!-- app/pages/parent.vue -->
<template>
  <div>
    <h1>父级页面</h1>
    <NuxtPage />   <!-- 子页面在此渲染 -->
  </div>
</template>
```

### 3.2 命名子路由

使用 `<NuxtPage :page-key="...">` 来在多个 `<NuxtPage>` 之间区分渲染目标：

```vue
<template>
  <div>
    <NuxtPage />
    <aside>
      <NuxtPage name="sidebar" />  <!-- 命名视图 -->
    </aside>
  </div>
</template>
```

---

## 四、`definePageMeta` 页面元信息

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  name: 'custom-name',
  alias: ['/old-path'],
  // Nuxt 4 新增：更丰富的元信息支持
  validate: (route) => {
    return /^\d+$/.test(route.params.id as string)
  },
})
</script>
```

### Nuxt 4 的 `definePageMeta` 增强

- 更好的 TypeScript 类型推断，自动从文件路径推断 `params` 类型
- `validate` 支持异步返回

---

## 五、路由验证（Validate）

### 5.1 页面级验证

```vue
<!-- app/pages/posts/[id].vue -->
<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    const id = Number(route.params.id)
    return !isNaN(id) && id > 0
  },
})
</script>
```

验证失败时 Nuxt 自动显示 `app/error.vue`。

### 5.2 `useRoute` 获取路由信息

```vue
<script setup lang="ts">
const route = useRoute()

// 完整的路由信息
console.log(route.path)      // "/posts/123?tab=comments"
console.log(route.params)    // { id: "123" }
console.log(route.query)     // { tab: "comments" }
console.log(route.name)      // "posts-id"
console.log(route.fullPath)  // "/posts/123?tab=comments#section"
</script>
```

---

## 六、Nuxt 4 路由与 `routeRules` 联动

Nuxt 4 的 `routeRules` 允许按路由配置渲染策略：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    '/': { ssr: true },
    '/admin/**': { ssr: false },
    '/products/**': { isr: 600 },
    '/api/**': { cors: true },
  },
})
```

详见第 12 章混合渲染策略。