# 页面路由与动态路由

> 本章讲解 Nuxt 基于文件系统的路由机制，包括静态路由、动态路由和嵌套路由。

## 一、文件系统路由

### 1.1 基础映射规则

Nuxt 3 使用**约定式路由**，`pages/` 目录下的文件结构自动映射为 Vue Router 路由配置。

```
pages/
├── index.vue            → /
├── about.vue            → /about
├── contact.vue          → /contact
└── blog/
    └── index.vue        → /blog
```

**无需手动配置路由表**，创建文件即生效。

### 1.2 路由入口 — `<NuxtPage>`

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

`<NuxtPage />` 是 `pages/` 目录的路由出口，等价于 Vue Router 的 `<RouterView />`。

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
    <NuxtLink :to="{ name: 'posts-id', params: { id: 1 } }"> 文章 #1 </NuxtLink>
  </nav>
</template>
```

`<NuxtLink>` 在视口内会自动**预加载**目标页面代码，提升导航速度。

---

## 二、动态路由

### 2.1 基础动态参数 `[param]`

用方括号包裹的**文件名**即为动态路由参数：

```
pages/
└── posts/
    └── [id].vue         → /posts/:id
```

```vue
<!-- pages/posts/[id].vue -->
<script setup>
const route = useRoute()
// 访问路由参数
console.log(route.params.id) // 如 "/posts/123" → "123"
</script>

<template>
  <div>
    <h1>文章 {{ $route.params.id }}</h1>
    <!-- 或 -->
    <h1>文章 {{ route.params.id }}</h1>
  </div>
</template>
```

### 2.2 多段动态参数

```
pages/
└── [category]/
    └── [slug].vue       → /:category/:slug
```

```vue
<!-- pages/[category]/[slug].vue -->
<script setup>
const route = useRoute()
console.log(route.params.category) // "tech"
console.log(route.params.slug) // "nuxt-3-guide"
</script>
```

### 2.3 可选参数 `[[param]]`

双层方括号表示**可选**参数，不传参数也能匹配：

```
pages/
├── user-[role]/
│   └── [id].vue          → /user-:role/:id
├── [slug].vue            → /:slug
└── [[slug]].vue          → /:slug? （slug 可选）
```

- `[[slug]].vue` 既可以匹配 `/` 也可以匹配 `/about`
- `[slug].vue` 只能匹配 `/about`，不会匹配 `/`

### 2.4 全捕获路由 `[...slug]`

匹配任意深度的路径：

```
pages/
└── [...slug].vue         → /:slug(.*)*
```

```vue
<!-- pages/[...slug].vue -->
<script setup>
const route = useRoute()
console.log(route.params.slug) // "/a/b/c" → ['a', 'b', 'c']
</script>
```

- 访问 `/` → `slug: []`
- 访问 `/a/b/c` → `slug: ['a', 'b', 'c']`

---

## 三、嵌套路由

### 3.1 目录嵌套

同名目录 + 同名文件构成嵌套路由：

```
pages/
├── parent/
│   └── child.vue         → /parent/child
└── parent.vue            → 父路由（必须包含 <NuxtPage />）
```

```vue
<!-- pages/parent.vue -->
<template>
  <div>
    <h2>父级页面</h2>
    <NuxtPage />
    <!-- 子路由出口 -->
  </div>
</template>
```

### 3.2 完整嵌套示例

```
pages/
├── blog/
│   ├── index.vue         → /blog         （列表页）
│   ├── [id].vue          → /blog/:id     （详情页）
│   └── new.vue           → /blog/new     （新建页）
└── blog.vue              → 父路由（包含导航 + <NuxtPage />）
```

```vue
<!-- pages/blog.vue -->
<template>
  <div>
    <nav>
      <NuxtLink to="/blog">全部</NuxtLink>
      <NuxtLink to="/blog/new">新建</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>
```

---

## 四、路由分组

### 4.1 路径无关的分组

用 `()` 包裹目录名可以创建**不影响 URL** 的分组：

```
pages/
├── (auth)/
│   ├── login.vue         → /login
│   └── register.vue      → /register
└── (dashboard)/
    ├── index.vue         → /
    └── settings.vue      → /settings
```

括号内的名称不会出现在 URL 中，仅用于组织代码。

### 4.2 分组 + 布局

分组目录中可以放置 `layout.vue` 为该组专用布局：

```
pages/
├── (auth)/
│   ├── layout.vue        # 仅 auth 组页面使用
│   ├── login.vue
│   └── register.vue
└── (dashboard)/
    ├── layout.vue        # 仅 dashboard 组页面使用
    ├── index.vue
    └── profile.vue
```

### 4.3 别名路由

`nuxt.config.ts` 中可以手动定义路由别名：

```ts
export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'old-about',
        path: '/old-about',
        file: '~/pages/about.vue',
      })
    },
  },
})
```
