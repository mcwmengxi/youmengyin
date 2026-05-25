# 常用模块使用

> 本章介绍 Nuxt 生态中最常用的官方与社区模块。

## 一、模块系统概述

### 1.1 安装与注册

```bash
# 安装模块
npx nuxi module add @nuxtjs/i18n
# 等价于
npm install @nuxtjs/i18n
```

模块会自动添加到 `nuxt.config.ts` 的 `modules` 数组：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/image', '@vueuse/nuxt'],
})
```

---

## 二、@nuxtjs/i18n — 国际化

### 2.1 基本配置

```bash
npx nuxi module add @nuxtjs/i18n
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    strategy: 'prefix_except_default', // URL 前缀（默认语言不加）
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', iso: 'zh-CN', name: '中文', file: 'zh-CN.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    ],
    lazy: true,
    langDir: 'locales/',
    vueI18n: './i18n.config.ts',
  },
})
```

### 2.2 翻译文件

```
locales/
├── zh-CN.json
└── en.json
```

```json
// locales/zh-CN.json
{
  "welcome": "欢迎来到我的网站",
  "about": "关于我们",
  "home": "首页",
  "contact": "联系我们"
}
```

```json
// locales/en.json
{
  "welcome": "Welcome to my site",
  "about": "About Us",
  "home": "Home",
  "contact": "Contact Us"
}
```

### 2.3 组件中使用

```vue
<script setup>
const { locale, setLocale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// 切换语言
function switchLanguage() {
  locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
}

// 调用 API
const { data } = await useAsyncData('posts', () =>
  $fetch('/api/posts', {
    headers: { 'Accept-Language': locale.value },
  })
)
</script>

<template>
  <div>
    <NuxtLink :to="switchLocalePath('en')">EN</NuxtLink>
    <NuxtLink :to="switchLocalePath('zh-CN')">中文</NuxtLink>
    <h1>{{ $t('welcome') }}</h1>
  </div>
</template>
```

### 2.4 不同策略对比

| 策略                    | URL 格式               | 适用场景         |
| ----------------------- | ---------------------- | ---------------- |
| `prefix_except_default` | `/`, `/en/about`       | 多数项目推荐     |
| `prefix`                | `/zh-CN/`, `/en/about` | 所有语言一致处理 |
| `prefix_and_default`    | `/zh-CN/`, `/en/about` | 所有语言都有前缀 |
| `no_prefix`             | `/`, `/about`          | Cookie 检测语言  |

---

## 三、@nuxt/image — 图片优化

### 3.1 安装与配置

```bash
npx nuxi module add @nuxt/image
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],

  image: {
    // 默认优化器
    provider: 'ipx',

    // 预设尺寸
    presets: {
      avatar: { modifiers: { width: 64, height: 64, fit: 'cover' } },
      thumbnail: { modifiers: { width: 320, height: 240, fit: 'cover' } },
      hero: { modifiers: { width: 1200, height: 600, fit: 'cover' } },
    },

    // 域名白名单
    domains: ['cdn.example.com'],
  },
})
```

### 3.2 核心用法

```vue
<template>
  <!-- 本地图片 -->
  <NuxtImg
    src="/images/hero.jpg"
    width="800"
    height="400"
    fit="cover"
    alt="Hero"
  />

  <!-- 远程图片 -->
  <NuxtImg
    src="https://picsum.photos/800/400"
    format="webp"
    quality="80"
    loading="lazy"
  />

  <!-- 响应式图片 -->
  <NuxtPicture
    src="/images/photo.jpg"
    :sizes="{ sm: '100vw', md: '50vw', lg: '400px' }"
    loading="lazy"
  />

  <!-- 使用预设 -->
  <NuxtImg src="/avatars/user.jpg" preset="avatar" />
</template>
```

### 3.3 背景图优化

```vue
<template>
  <div :style="{ backgroundImage: `url(${imgUrl})` }">
    <NuxtImg
      :src="imgSrc"
      :modifiers="{ width: 1920, height: 600, fit: 'cover' }"
      preload
      class="hidden"
    />
  </div>
</template>

<script setup>
// 用 preload 标签预热背景图
const imgSrc = '/hero-bg.jpg'
</script>
```

---

## 四、@vueuse/nuxt — VueUse 集成

### 4.1 安装

```bash
npx nuxi module add @vueuse/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
})
```

### 4.2 常用功能

```vue
<script setup>
// 浏览器 API
const { width, height } = useWindowSize()
const { x, y } = useMouse()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const clipboard = useClipboard()
const { isSupported: isWebShare, share } = useShare()

// 状态管理
const counter = useStorage('counter', 0)
const token = useStorage('token', '')
const settings = useStorage('settings', { theme: 'light' })

// 节流防抖
const search = ref('')
const debouncedSearch = useDebouncedRef(search, 500)

// 无限滚动
const el = ref<HTMLElement>()
useInfiniteScroll(el, async () => {
  await loadMore()
}, { distance: 200 })

// Intersection Observer
const target = ref(null)
const targetIsVisible = useElementVisibility(target)

// 网络状态
const { isOnline } = useNetwork()

// 设备信息
const { isMobile } = useDevice()
</script>
```

---

## 五、@nuxtjs/tailwindcss — Tailwind CSS

### 5.1 安装与配置

```bash
npx nuxi module add @nuxtjs/tailwindcss
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: true,
    viewer: true, // 开发模式下提供可视化面板
  },
})
```

### 5.2 自定义主题

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a5f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

```css
/* assets/css/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white px-4 py-2 rounded-lg
           hover:bg-primary-600 transition-colors;
  }
}
```

---

## 六、@nuxt/content — 内容管理

### 6.1 安装与配置

```bash
npx nuxi module add @nuxt/content
```

### 6.2 写作与查询

```
content/
├── blog/
│   ├── hello-world.md
│   └── nuxt-guide.md
└── about.md
```

```md
---
title: 'Hello World'
description: '我的第一篇文章'
date: 2024-01-01
tags: ['nuxt', 'vue']
---

# Hello World

内容正文...
```

```vue
<script setup>
// 查询所有文章
const { data: posts } = await useAsyncData('posts', () =>
  queryContent('/blog').sort({ date: -1 }).find()
)

// 查询单篇文章
const { data: post } = await useAsyncData('post', () =>
  queryContent(`/blog/${route.params.slug}`).findOne()
)

// 搜索
const { data: results } = await useAsyncData('search', () =>
  queryContent()
    .where({
      $or: [
        { title: { $contains: 'hello' } },
        { body: { $contains: 'world' } },
      ],
    })
    .find()
)
</script>
```

---

## 七、@nuxtjs/color-mode — 主题切换

```bash
npx nuxi module add @nuxtjs/color-mode
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],

  colorMode: {
    preference: 'system', // 跟随系统
    fallback: 'light',
    classSuffix: '',
    storageKey: 'theme',
  },
})
```

```vue
<script setup>
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button @click="toggle">
    {{ colorMode.value === 'dark' ? '🌙' : '☀️' }}
  </button>
</template>
```

在 Tailwind CSS 中自动生效：

```html
<div class="bg-white dark:bg-gray-900">
  <p class="text-black dark:text-white">自适应主题</p>
</div>
```

---

## 八、@sidebase/nuxt-auth — 认证

### 8.1 安装

```bash
npx nuxi module add @sidebase/nuxt-auth
```

### 8.2 配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],

  auth: {
    provider: {
      type: 'authjs', // 或 'local' | 'refresh'
    },
    globalAppMiddleware: true, // 全局认证守卫
  },
})
```

```ts
// server/api/auth/[...].ts — 由模块自动生成
```

### 8.3 组件中使用

```vue
<script setup>
const { status, data, signIn, signOut } = useAuth()
</script>

<template>
  <div v-if="status === 'authenticated'">
    <p>已登录：{{ data?.user?.name }}</p>
    <button @click="signOut()">退出登录</button>
  </div>
  <div v-else>
    <button @click="signIn('github')">GitHub 登录</button>
  </div>
</template>
```

---

## 九、其他实用模块

| 模块                   | 用途                  |
| ---------------------- | --------------------- |
| `@nuxtjs/sitemap`      | 自动生成 sitemap.xml  |
| `@nuxtjs/robots`       | 管理 robots.txt       |
| `nuxt-swiper`          | Swiper 轮播图组件     |
| `@nuxtjs/google-fonts` | 自动加载 Google Fonts |
| `nuxt-icon`            | Iconify 图标组件      |
| `nuxt-delay-hydration` | 延迟客户端水合        |

```bash
# 一键安装常用模块组合
npx nuxi module add @nuxtjs/sitemap @nuxtjs/robots nuxt-icon
```
