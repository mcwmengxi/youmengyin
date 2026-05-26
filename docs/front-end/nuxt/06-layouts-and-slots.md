# 布局系统与插槽

> 本章讲解 Nuxt 4 的布局系统（`app/layouts/`）、命名布局及插槽使用。

## 一、默认布局

### 1.1 `app/layouts/default.vue`

`app/layouts/` 目录下的 `default.vue` 是所有页面默认使用的布局：

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <main>
      <slot />
      <!-- 页面内容渲染在此处 -->
    </main>
    <AppFooter />
  </div>
</template>
```

`<slot />` 是页面内容的渲染出口，**必须保留**。

### 1.2 `app/app.vue` 中使用布局

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- `<NuxtLayout>` 自动应用默认布局
- 如果不存在 `app/layouts/default.vue`，`<NuxtLayout>` 仅渲染 `<NuxtPage />` 内容

---

## 二、自定义布局

### 2.1 创建自定义布局

```vue
<!-- app/layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <AdminNav />
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>
```

### 2.2 页面指定布局

```vue
<!-- app/pages/admin/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <div>欢迎来到管理后台</div>
</template>
```

### 2.3 动态切换布局

```vue
<script setup lang="ts">
const route = useRoute()
// Nuxt 4 中可在路由守卫中动态切换
definePageMeta({
  layout: computed(() => route.meta.requiresAuth ? 'admin' : 'default')
})
</script>
```

### 2.4 使用 `<NuxtLayout>` 的 `name` 属性

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const layout = computed(() => route.meta.layout ?? 'default')
</script>
```

---

## 三、布局插槽

### 3.1 命名插槽

布局文件可以定义多个插槽，页面通过 `<template #slotName>` 填充：

```vue
<!-- app/layouts/docs.vue -->
<template>
  <div class="docs-layout">
    <aside>
      <slot name="sidebar">
        <!-- 默认侧边栏内容 -->
        <DocsNav />
      </slot>
    </aside>
    <main>
      <slot />
      <!-- 默认插槽：页面主内容 -->
    </main>
  </div>
</template>
```

```vue
<!-- app/pages/docs/guide.vue -->
<template>
  <div>
    <!-- 主内容（默认插槽） -->
    <h1>使用指南</h1>
    <p>这里是文档内容...</p>
  </div>
</template>
```

### 3.2 在布局中使用插槽 Props

```vue
<!-- app/layouts/user.vue -->
<script setup lang="ts">
const user = await useFetch('/api/me')  // Nuxt 4 智能数据获取
</script>

<template>
  <div>
    <header>
      <slot name="header" :user="user" />
    </header>
    <slot />
  </div>
</template>
```

```vue
<!-- 页面中使用布局的插槽 props -->
<template>
  <div>
    <template #header="{ user }">
      <h1>{{ user?.name }} 的个人主页</h1>
    </template>

    <p>主页内容...</p>
  </div>
</template>
```

---

## 四、布局嵌套

### 4.1 多级布局

```
app/layouts/
├── default.vue       # 基础布局（头部 + 底部）
├── docs.vue          # 文档布局（基础 + 侧边栏）
└── admin.vue         # 管理布局（基础 + 管理菜单）
```

### 4.2 布局内使用 `<NuxtLayout>`

```vue
<!-- app/layouts/docs.vue -->
<script setup lang="ts">
const layout = 'default'
</script>

<template>
  <NuxtLayout :name="layout">
    <div class="docs-wrapper">
      <aside><!-- 侧边栏 --></aside>
      <main><slot /></main>
    </div>
  </NuxtLayout>
</template>
```

> 注：Nuxt 4 推荐使用 `<NuxtLayout>` 嵌套而不是深层布局继承，性能和调试体验更好。

---

## 五、布局过渡动画

Nuxt 4 内置 `<NuxtPage>` 的 `transition` 属性：

```vue
<!-- app/app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
```

### 自定义特定布局的过渡：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
```

对应的 CSS 类名为 `layout-enter-active`、`layout-leave-active` 等。

---

## 六、Nuxt 4 布局最佳实践

- **布局文件放在 `app/layouts/`**，`default.vue` 作为基础布局
- **使用命名插槽**为不同页面定制布局区域（顶部栏、侧边栏等）
- **用 `definePageMeta({ layout: 'xxx' })` 选择布局**，不要在 `app.vue` 中硬编码
- **布局间数据传递用插槽 Props**，不要尝试跨布局 `provide/inject`（布局作用域隔离）
- **布局嵌套用 `<NuxtLayout :name="">`**，比深层继承更清晰