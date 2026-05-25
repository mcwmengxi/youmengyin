# Nuxt 简介与环境搭建

> 本章介绍 Nuxt 框架的基本概念、核心特性以及开发环境的搭建过程。

## 一、Nuxt 简介

### 1.1 什么是 Nuxt？

Nuxt 是一个基于 Vue.js 的开源**全栈框架**，由 NuxtLabs 团队维护。它在 Vue 3 的基础上提供了约定式路由、服务端渲染（SSR）、静态站点生成（SSG）、文件系统 API 路由、自动导入、代码分层等开箱即用的能力，让开发者专注于业务逻辑而非工程配置。

### 1.2 Nuxt 3 核心特性

| 特性                  | 说明                                                      |
| --------------------- | --------------------------------------------------------- |
| **文件系统路由**      | `pages/` 目录下的文件自动生成路由，无需手动配置           |
| **自动导入**          | `components/`、`composables/`、`utils/` 中的导出自动可用  |
| **混合渲染**          | 同一应用内可按路由混合 SSR / SSG / SPA / ISR              |
| **Nitro 引擎**        | 底层服务端引擎，支持 Node.js、Deno、Cloudflare Workers 等 |
| **零配置 TypeScript** | 原生支持 TypeScript，无需额外配置                         |
| **HMR 热更新**        | 极快的开发体验，修改即生效                                |

### 1.3 Nuxt 2 vs Nuxt 3 主要变化

- 底层框架：Vue 2 → Vue 3（Composition API）
- 构建工具：Webpack → Vite（默认）
- 服务端引擎：@nuxt/server → Nitro（跨平台）
- 数据获取：`asyncData` + `fetch` → `useFetch` + `useAsyncData`
- 状态共享：`@nuxtjs/composition-api` → 内置 `useState`

---

## 二、环境搭建

### 2.1 环境要求

- **Node.js**：18.x 或更高版本（推荐 20.x LTS）
- **包管理器**：npm / pnpm / yarn

```bash
# 检查 Node 版本
node -v
```

### 2.2 创建项目

```bash
# 使用 npx 快速创建（推荐）
npx nuxi@latest init my-app

# 选择包管理器后自动安装依赖
cd my-app
npm run dev
```

### 2.3 项目启动

```bash
# 开发模式（默认 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 2.4 开发工具推荐

- **VS Code** + 插件：
  - `Vue - Official`（Volar）：Vue 3 官方插件
  - `Nuxtr`：Nuxt 专属辅助工具
  - `Tailwind CSS IntelliSense`（如使用 Tailwind）
  - `ESLint`、`Prettier`

---

## 三、第一个 Nuxt 项目

### 3.1 最小页面示例

```vue
<!-- app.vue -->
<template>
  <div>
    <h1>Hello Nuxt 3!</h1>
    <NuxtWelcome />
  </div>
</template>
```

启动 `npm run dev`，打开 `http://localhost:3000` 即可看到欢迎页。

### 3.2 添加第一个页面

在 `pages/` 目录下创建文件即可自动注册路由：

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>首页</h1>
    <NuxtLink to="/about">关于</NuxtLink>
  </div>
</template>
```

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>关于页面</h1>
    <NuxtLink to="/">返回首页</NuxtLink>
  </div>
</template>
```

### 3.3 关键文件说明

| 文件             | 作用                         |
| ---------------- | ---------------------------- |
| `app.vue`        | 应用根组件，所有页面的父组件 |
| `pages/`         | 页面目录，自动生成路由       |
| `components/`    | 组件目录，自动导入           |
| `public/`        | 静态资源，直接映射到根路径   |
| `nuxt.config.ts` | Nuxt 主配置文件              |
| `package.json`   | 项目依赖配置                 |

### 3.4 app.vue 与 pages/ 的关系

- 如果只有 `app.vue` 而没有 `pages/`：`app.vue` 作为唯一页面渲染
- 如果存在 `pages/` 目录：`app.vue` 中**必须**包含 `<NuxtPage />` 组件作为页面出口

```vue
<!-- app.vue（有 pages 目录时） -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```
