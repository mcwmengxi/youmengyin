# 组件基础

> 本章介绍 Nuxt 4 中组件的基本使用方式、自动注册机制及 `<ClientOnly>` 等特殊组件。

## 一、组件创建与注册

### 1.1 自动注册

在 Nuxt 4 中，`app/components/` 目录下的 `.vue` 文件**自动全局注册**，无需手动 import：

```
app/components/
├── TheHeader.vue
├── AppFooter.vue
├── base/
│   └── Button.vue
├── card/
│   └── ArticleCard.vue
└── ui/
    └── Modal.vue
```

直接在模板中使用：

```vue
<template>
  <div>
    <TheHeader />
    <BaseButton>点击</BaseButton>
    <CardArticleCard :article="article" />
    <UiModal v-model="showModal" />
    <AppFooter />
  </div>
</template>
```

### 1.2 组件命名规则

| 文件路径 | 组件名 |
|----------|--------|
| `app/components/TheHeader.vue` | `<TheHeader />` |
| `app/components/base/Button.vue` | `<BaseButton />` |
| `app/components/card/ArticleCard.vue` | `<CardArticleCard />` |
| `app/components/ui/Modal.vue` | `<UiModal />` |

**规则**：目录名作为前缀，PascalCase 拼接，忽略重复部分。

### 1.3 手动导入

如果需要禁用自动导入或想显式管理依赖：

```vue
<script setup lang="ts">
import MyComponent from '~/components/MyComponent.vue'
</script>
```

> Nuxt 4 中 `~/` 路径别名指向 `app/` 目录。

---

## 二、组件通信

### 2.1 Props（父传子）

**父组件：**

```vue
<template>
  <UserCard
    :name="user.name"
    :age="user.age"
    :avatar="user.avatar"
  />
</template>
```

**子组件：**

```vue
<script setup lang="ts">
// 使用 TypeScript 泛型定义 Props（Nuxt 4 推荐方式）
interface Props {
  name: string
  age?: number
  avatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  age: 18,
  avatar: '/default-avatar.png',
})
</script>

<template>
  <div class="card">
    <img :src="props.avatar" :alt="props.name" />
    <h3>{{ props.name }}</h3>
    <p>{{ props.age }} 岁</p>
  </div>
</template>
```

### 2.2 Emits（子传父）

```vue
<!-- 子组件 -->
<script setup lang="ts">
const emit = defineEmits<{
  submit: [data: FormData]
  cancel: []
}>()

function handleSubmit() {
  emit('submit', formData.value)
}
</script>
```

```vue
<!-- 父组件 -->
<template>
  <MyForm @submit="onFormSubmit" @cancel="onFormCancel" />
</template>
```

### 2.3 `defineModel`（双向绑定）Nuxt 4 增强

```vue
<!-- 子组件 -->
<script setup lang="ts">
// Nuxt 4 的 v-model 支持更好的类型推断
const model = defineModel<string>({ required: true })
</script>

<template>
  <input v-model="model" />
</template>
```

```vue
<!-- 父组件 -->
<template>
  <MyInput v-model="username" />
</template>
```

### 2.4 Provide / Inject（跨层级通信）

```ts
// app/composables/useTheme.ts
export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

  const toggle = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
}
```

```vue
<!-- 祖先组件 -->
<script setup lang="ts">
const theme = useTheme()
provide('theme', theme)
</script>
```

```vue
<!-- 后代组件 -->
<script setup lang="ts">
const theme = inject('theme')!
</script>
```

---

## 三、`<ClientOnly>` 与纯客户端组件

### 3.1 基本用法

由于 Nuxt 是 SSR 框架，组件默认在服务端和客户端都会执行。但某些组件依赖 `window`、`document` 等浏览器 API，此时需要用 `<ClientOnly>` 包裹：

```vue
<template>
  <div>
    <SiteHeader />

    <!-- 只在客户端渲染的消息组件 -->
    <ClientOnly>
      <ToastNotification />
    </ClientOnly>

    <SiteFooter />
  </div>
</template>
```

### 3.2 `fallback` 插槽 — SSR 时的占位内容

```vue
<template>
  <ClientOnly fallback-tag="div" fallback="Loading chart...">
    <ChartComponent :data="data" />
  </ClientOnly>
</template>
```

### 3.3 `.client` 后缀（自动 ClientOnly）

将组件文件命名为 `*.client.vue`，Nuxt 自动识别为纯客户端组件：

```
app/components/
└── ECharts.client.vue     # 自动只在客户端渲染
```

直接使用即可，无需 `<ClientOnly>` 包裹：

```vue
<template>
  <ECharts :option="chartOption" />
</template>
```

### 3.4 Nuxt 4 性能提示

Nuxt 4 的 Vite 6 支持更好的 Tree Shaking，纯客户端组件在 SSR 构建时会被完全跳过，减小服务端包体积。

---

## 四、动态组件

### 4.1 `<component :is="">` 经典方式

```vue
<script setup lang="ts">
const currentTab = ref('Overview')
const tabs = {
  Overview: defineAsyncComponent(() => import('./tabs/Overview.vue')),
  Details: defineAsyncComponent(() => import('./tabs/Details.vue')),
  Settings: defineAsyncComponent(() => import('./tabs/Settings.vue')),
}
</script>

<template>
  <button v-for="name in Object.keys(tabs)" :key="name" @click="currentTab = name">
    {{ name }}
  </button>
  <component :is="tabs[currentTab]" />
</template>
```

### 4.2 `<NuxtIsland>`（实验性）

Nuxt 4 实验性支持 `<NuxtIsland>`，将部分内容渲染为"岛屿"独立发送：

```vue
<template>
  <NuxtIsland name="ProductRecommendations" :props="{ productId: 1 }" />
</template>
```

---

## 五、Nuxt 4 组件开发最佳实践

- **组件放在 `app/components/`，利用自动导入**，不要手动 import
- **用 TypeScript 泛型定义 Props 和 Emits**，Nuxt 4 的类型推断更精准
- **纯客户端组件使用 `.client.vue` 后缀**，比 `<ClientOnly>` 更简洁
- **复杂组件拆分为小的可复用单元**，充分利用自动导入
- **跨层级通信优先用 provide/inject**，避免 prop drilling