# 组件基础

> 本章介绍 Nuxt 中组件的基本使用方式、组件通信及 `<ClientOnly>` 等特殊组件。

## 一、组件创建与注册

### 1.1 自动注册

`components/` 目录下的 `.vue` 文件**自动全局注册**，无需手动 import：

```
components/
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
| `components/TheHeader.vue` | `<TheHeader />` |
| `components/base/Button.vue` | `<BaseButton />` |
| `components/card/ArticleCard.vue` | `<CardArticleCard />` |
| `components/ui/Modal.vue` | `<UiModal />` |

**规则**：目录名作为前缀，PascalCase 拼接，忽略重复部分。

### 1.3 手动导入

如果需要禁用自动导入或想显式管理依赖：

```vue
<script setup>
import Btn from '~/components/base/Button.vue'
</script>

<template>
  <Btn>手动导入的按钮</Btn>
</template>
```

### 1.4 动态组件

```vue
<script setup>
const comp = resolveComponent('BaseButton')
// 或
import { resolveComponent } from 'vue'
</script>

<template>
  <component :is="comp">动态按钮</component>
</template>
```

---

## 二、组件通信

### 2.1 Props — 父传子

```vue
<!-- components/base/Card.vue -->
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  tags: { type: Array, default: () => [] }
})

// TypeScript 写法
// const props = defineProps<{
//   title: string
//   image?: string
//   tags?: string[]
// }>()
</script>

<template>
  <div class="card">
    <img v-if="image" :src="image" />
    <h3>{{ title }}</h3>
    <span v-for="tag in tags" :key="tag">{{ tag }}</span>
  </div>
</template>
```

使用：

```vue
<Card title="文章标题" image="/cover.jpg" :tags="['vue', 'nuxt']" />
```

### 2.2 Emits — 子传父

```vue
<!-- components/ui/ConfirmDialog.vue -->
<script setup>
const emit = defineEmits(['confirm', 'cancel'])

// 或 TypeScript 写法
// const emit = defineEmits<{
//   confirm: [id: number]
//   cancel: []
// }>()

function handleConfirm() {
  emit('confirm', 123)
}
</script>

<template>
  <div>
    <button @click="handleConfirm">确认</button>
    <button @click="emit('cancel')">取消</button>
  </div>
</template>
```

使用：

```vue
<ConfirmDialog @confirm="onConfirm" @cancel="onCancel" />
```

### 2.3 `defineModel` — 双向绑定 (v-model)

Nuxt 3 / Vue 3.4+ 提供的简化写法：

```vue
<!-- components/ui/InputModal.vue -->
<script setup>
const model = defineModel()               // v-model 的默认值
const visible = defineModel('visible')    // v-model:visible
</script>

<template>
  <input v-model="model" />
  <div v-if="visible">内容</div>
</template>
```

使用：

```vue
<script setup>
const name = ref('')
const showModal = ref(false)
</script>

<template>
  <InputModal v-model="name" v-model:visible="showModal" />
</template>
```

### 2.4 Slots — 内容分发

**默认插槽**：

```vue
<!-- components/ui/Card.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<!-- 使用 -->
<Card>
  <p>这是插槽内容</p>
</Card>
```

**具名插槽**：

```vue
<!-- components/ui/Panel.vue -->
<template>
  <div class="panel">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>

<!-- 使用 -->
<Panel>
  <template #header>
    <h2>标题</h2>
  </template>
  <p>默认内容</p>
  <template #footer>
    <Button>确定</Button>
  </template>
</Panel>
```

**作用域插槽**：

```vue
<!-- components/ui/List.vue -->
<script setup>
defineProps({ items: Array })
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot name="item" :item="item" :index="index" />
    </li>
  </ul>
</template>

<!-- 使用 -->
<List :items="users">
  <template #item="{ item, index }">
    {{ index + 1 }}. {{ item.name }}
  </template>
</List>
```

### 2.5 Provide / Inject — 跨层级通信

```vue
<!-- 祖先组件 -->
<script setup>
const theme = ref('dark')
provide('theme', theme)
</script>

<!-- 后代组件（可以跨多层级） -->
<script setup>
const theme = inject('theme')
</script>
```

---

## 三、ClientOnly 组件

### 3.1 基本用法

有些组件依赖浏览器 API（`window`、`document` 等），在 SSR 时会报错，用 `<ClientOnly>` 包裹即可：

```vue
<template>
  <ClientOnly>
    <ChartComponent :data="chartData" />
    <template #fallback>
      <!-- SSR 时展示的占位内容 -->
      <div class="loading">图表加载中…</div>
    </template>
  </ClientOnly>
</template>
```

### 3.2 常见使用场景

- 图表库（ECharts、Chart.js）
- 地图组件（高德、百度地图）
- WebSocket 连接
- 浏览器存储（localStorage、sessionStorage）
- 第三方需要 DOM 的库

### 3.3 `.client.vue` 后缀

更简单的方式 — 直接在文件名标明：

```
components/
└── RichEditor.client.vue    # 仅在客户端渲染
```

等同于用 `<ClientOnly>` 包裹，无需修改模板代码。

---

## 四、动态组件与 Lazy 加载

### 4.1 懒加载组件

组件名加 `Lazy` 前缀即可实现按需加载：

```vue
<template>
  <div>
    <!-- 普通加载：随页面加载 -->
    <HeavyComponent />

    <!-- 懒加载：进入视口或条件渲染时才加载 -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

**注意**：
- 原组件名为 `HeavyComponent`，使用 `LazyHeavyComponent` 即可
- 被 `<NuxtLink>` 链接的页面也会自动预加载，这不受懒加载影响

### 4.2 KeepAlive — 页面缓存

```vue
<!-- pages/ 中的页面组件 -->
<script setup>
definePageMeta({
  keepalive: true  // 切换路由时缓存该页面，不被销毁
})
</script>
```

### 4.3 全局 KeepAlive 配置

```vue
<!-- app.vue -->
<template>
  <NuxtPage :keepalive="{ include: ['index', 'about'] }" />
</template>
```