# Nuxt 4 简介与环境搭建

> 本章介绍 Nuxt 4 框架的核心概念、相比 Nuxt 3 的重大变化以及开发环境的搭建过程。

## 一、Nuxt 4 简介

### 1.1 什么是 Nuxt 4？

Nuxt 4 是 2025 年 7 月正式发布的**全栈 Vue 框架**重大版本。它在 Nuxt 3 成熟生态的基础上，引入了全新的 `app/` 目录结构、智能数据获取层、项目级 TypeScript 隔离和更快的 CLI 开发体验。

### 1.2 Nuxt 4 相比 Nuxt 3 的核心变化

| 特性                     | Nuxt 3                                      | Nuxt 4                                      |
| ------------------------ | ------------------------------------------- | ------------------------------------------- |
| **默认目录结构**         | 根目录直接放 `pages/`、`components/` 等     | 统一放在 `app/` 目录下                      |
| **数据获取**             | `useFetch` / `useAsyncData` 基础功能        | 智能共享 key、自动清理、响应式 key 联动     |
| **TypeScript**           | 单一 tsconfig，类型混杂                     | 项目级 TS 隔离（app / server / shared 各自独立） |
| **CLI 性能**             | 标准启动速度                                | Socket 通信 + V8 compile cache，冷启动更快  |
| **构建工具**             | Vite 5                                      | Vite 6（默认），可选 Rspack                 |
| **服务端引擎**           | Nitro 2                                     | **Nitro 3**                                 |
| **兼容性版本**           | 无                                          | `compatibilityVersion: 4` 显式声明          |
| **共享代码**             | 无明确目录                                  | 新增 `shared/` 目录                         |

### 1.3 Nuxt 4 核心特性一览

- **`app/` 目录**：应用代码统一放在 `app/` 下，与 `node_modules`、`.git` 分离，文件监听更快（Windows/Linux 上尤其明显）
- **智能数据层**：同一 key 的 `useAsyncData` / `useFetch` 自动跨组件共享，组件卸载自动清理，无需手动 `watch`
- **更好的 TypeScript**：app 代码、server 代码、`shared/` 目录自动生成独立的 tsconfig，自动补全更精准
- **更快的 CLI**：内部采用 Socket 通信替代网络端口，Node.js V8 compile cache 自动复用
- **Nitro 3**：更强的边缘计算能力，更灵活的部署方案

---

## 二、环境搭建

### 2.1 环境要求

- **Node.js**：20.x 或更高版本（推荐 22.x LTS）
- **包管理器**：npm / pnpm / yarn / bun

```bash
# 检查 Node 版本
node -v
```

### 2.2 创建 Nuxt 4 项目

```bash
# 使用 npx 创建
npx nuxi@latest init my-app

# 创建时直接指定 Nuxt 4 模板
npx nuxi@latest init my-app --template v4

# 进入项目
cd my-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2.3 从 Nuxt 3 升级到 Nuxt 4

如果你是 Nuxt 3 项目，升级步骤如下：

```bash
# 1. 升级依赖
npx nuxi upgrade --force

# 2. 在 nuxt.config.ts 中启用 compatibilityVersion
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
})
```

```bash
# 3. 重新生成类型
npx nuxt prepare

# 4. 将源码迁移到 app/ 目录（可选，但推荐）
mkdir app
mv pages components composables layouts middleware plugins utils app/
# 注意：server/ 仍然留在根目录
```

### 2.4 项目启动

```bash
# 开发模式（默认 http://localhost:3000）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# TypeScript 类型检查
npx nuxt typecheck
```

### 2.5 开发工具推荐

- **VS Code** + 插件：
  - `Vue - Official`（Volar）：Vue 3 官方插件
  - `Nuxtr`：Nuxt 专属辅助工具
  - `Tailwind CSS IntelliSense`（如使用 Tailwind）
  - `ESLint`、`Prettier`

---

## 三、第一个 Nuxt 4 项目

### 3.1 最小页面示例

Nuxt 4 默认使用 `app/` 目录。创建 `app/pages/index.vue`：

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
useHead({
  title: 'Hello Nuxt 4!',
})
</script>

<template>
  <div>
    <h1>Welcome to Nuxt 4 🚀</h1>
    <p>app/ 目录结构 + 智能数据层 + Vite 6</p>
  </div>
</template>
```

启动 `npm run dev`，打开 `http://localhost:3000` 即可看到页面。

### 3.2 Nuxt 4 项目初始化后的完整结构

```
my-app/
├── app/                   # 🆕 应用源码（Nuxt 4 默认）
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   ├── utils/
│   ├── app.vue
│   ├── app.config.ts
│   └── error.vue
├── public/                # 静态资源
├── server/                # 服务端（仍在外层）
│   ├── api/
│   ├── routes/
│   └── middleware/
├── shared/                # 🆕 客户端/服务端共享代码
├── nuxt.config.ts         # 配置文件
├── tsconfig.json          # 🆕 只需要一个 tsconfig！
├── package.json
└── .gitignore
```

### 3.3 Nuxt 4 的向下兼容

Nuxt 4 完全兼容 Nuxt 3 的旧目录结构。如果你不想迁移：

- 将 `future.compatibilityVersion` 设置为 `4` 但不移动目录
- 或者保持 `srcDir: '.'` 即可沿用 Nuxt 3 的项目组织方式

```ts
// nuxt.config.ts — 继续使用 Nuxt 3 风格目录
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  srcDir: '.',  // 沿用旧的根目录布局
})
```