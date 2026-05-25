# 布局系统与插槽

> 本章讲解 Nuxt 的布局系统、命名布局以及插槽的使用方式。

## 一、默认布局

### 1.1 `layouts/default.vue`

`layouts/` 目录下的 `default.vue` 是 Nuxt 的默认布局文件，所有页面默认使用它：

```vue
<!-- layouts/default.vue -->
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

`<slot />` 是页面内容的渲染出口，必须保留。

### 1.2 `app.vue` 中使用布局

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- `<NuxtLayout>` 自动应用默认布局
- 如果不存在 `layouts/default.vue`，`<NuxtLayout>` 仅渲染 `<NuxtPage />` 内容

---

## 二、自定义布局

### 2.1 创建自定义布局

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <slot />
    </div>
  </div>
</template>
```

```vue
<!-- layouts/blank.vue -->
<template>
  <div>
    <slot />
  </div>
</template>
```

### 2.2 页面指定布局

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  layout: 'admin', // 使用 layouts/admin.vue
})
</script>
```

```vue
<!-- pages/login.vue -->
<script setup>
definePageMeta({
  layout: 'blank', // 使用空白布局
})
</script>
```

### 2.3 禁用布局

```vue
<script setup>
definePageMeta({
  layout: false, // 不套用任何布局
})
</script>
```

---

## 三、动态切换布局

### 3.1 根据路由动态切换

```vue
<!-- app.vue -->
<script setup>
const route = useRoute()

// 根据路径前缀决定布局
const layout = computed(() => {
  if (route.path.startsWith('/admin')) return 'admin'
  if (route.path === '/login') return 'blank'
  return 'default'
})
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 3.2 布局中使用路由信息

```vue
<!-- layouts/default.vue -->
<script setup>
const route = useRoute()
const pageTitle = computed(() => route.meta.title || '默认标题')
</script>

<template>
  <div>
    <header>
      <h1>{{ pageTitle }}</h1>
    </header>
    <slot />
  </div>
</template>
```

---

## 四、插槽机制

### 4.1 `<NuxtLayout>` 的具名插槽

布局中可以定义多个具名插槽，页面通过 `<NuxtLayout>` 的属性传递：

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <slot name="header">默认头部</slot>
    </header>
    <main>
      <slot />
    </main>
    <aside>
      <slot name="sidebar">默认侧边栏</slot>
    </aside>
  </div>
</template>
```

在 `app.vue` 中使用：

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <!-- #header 填充布局的 header 插槽 -->
    <template #header>
      <AppHeader />
    </template>

    <!-- #sidebar 填充布局的 sidebar 插槽 -->
    <template #sidebar>
      <AppSidebar />
    </template>

    <!-- 默认插槽 → <NuxtPage /> -->
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 4.2 页面级插槽注入

也可以通过 `definePageMeta` + `app.vue` 配合实现页面级插槽控制：

```vue
<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  layout: 'admin',
  title: '仪表盘',
})
</script>
```

```vue
<!-- layouts/admin.vue -->
<script setup>
const route = useRoute()
</script>
<template>
  <div>
    <AdminHeader :title="route.meta.title" />
    <slot />
  </div>
</template>
```

### 4.3 插槽与 Teleport 配合

```vue
<!-- layouts/default.vue -->
<template>
  <div>
    <div id="modal-container" />
    <slot />
  </div>
</template>

<!-- 任意子组件 -->
<template>
  <Teleport to="#modal-container">
    <div class="modal">弹窗内容</div>
  </Teleport>
</template>
```

---

## 五、布局最佳实践

| 实践              | 说明                                                          |
| ----------------- | ------------------------------------------------------------- |
| 保持布局简洁      | 布局只放结构性框架（导航、侧栏、底部），不写业务逻辑          |
| 按场景拆分        | `default`、`admin`、`auth`、`blank` 各司其职                  |
| 利用 `route.meta` | 在 `definePageMeta` 中传递标题、描述等元信息到布局            |
| 嵌套使用          | 布局中可使用 `<NuxtLayout>` 实现嵌套（如全局布局 + 二级布局） |
| SSR 安全          | 布局中的交互逻辑（如 `onMounted`）注意 SSR 兼容               |
