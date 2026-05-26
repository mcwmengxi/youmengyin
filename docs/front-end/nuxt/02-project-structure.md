# Nuxt 4 项目结构与 `app/` 目录约定

> Nuxt 4 最大的可见变化是默认将应用代码放入 `app/` 目录。本章详细介绍新目录结构、各目录职责及 Nuxt 4 特有的 `shared/` 目录。

## 一、Nuxt 4 默认目录结构

```
my-app/
├── app/                   # 🆕 应用源码目录（Nuxt 4 默认）
│   ├── assets/            # 需要构建处理的静态资源
│   ├── components/        # Vue 组件，自动导入
│   ├── composables/       # 组合式函数，自动导入
│   ├── layouts/           # 布局组件
│   ├── middleware/        # 路由中间件
│   ├── pages/             # 页面文件，自动生成路由
│   ├── plugins/           # 插件文件
│   ├── utils/             # 工具函数，自动导入
│   ├── app.vue            # 应用根组件
│   ├── app.config.ts      # 🆕 应用配置（App Config）
│   └── error.vue          # 错误页面
├── public/                # 静态资源，直接映射到根路径
├── server/                # 服务端（不在 app/ 下）
│   ├── api/               # API 路由
│   ├── routes/            # 自定义服务端路由
│   └── middleware/        # 服务端中间件
├── shared/                # 🆕 客户端 / 服务端共享代码
├── content/               # Nuxt Content 模块内容
├── layers/                # 可扩展层（Layers）
├── nuxt.config.ts         # Nuxt 配置
├── tsconfig.json          # 🆕 Nuxt 4 只需要一个 tsconfig
├── package.json
└── .gitignore
```

> **关键变化**：`app/` 将源码与 `node_modules`、`.git` 分离，文件监听器只关注 `app/`，Windows/Linux 上开发体验显著提升。

---

## 二、Nuxt 4 新增目录

### 2.1 `app/` — 统一的应用源码目录

所有前端应用的代码统一放在 `app/` 下，具体规则沿用 Nuxt 3 的约定：

| 子目录         | 职责                             | 自动导入 |
| -------------- | -------------------------------- | -------- |
| `pages/`       | 文件路由，自动映射为页面路由     | 否       |
| `components/`  | Vue 组件，自动全局注册           | 是       |
| `composables/` | 组合式函数（须以 `use` 开头命名） | 是       |
| `layouts/`     | 布局组件                         | 否       |
| `middleware/`  | 路由中间件（命名导出）           | 否       |
| `plugins/`     | 插件（命名导出）                 | 否       |
| `utils/`       | 通用工具函数                     | 是       |
| `assets/`      | 需要构建的静态资源（CSS、图片）  | 否       |

### 2.2 `shared/` — 客户端/服务端共享代码

这是 Nuxt 4 的全新目录。放在 `shared/` 中的代码在：

- 浏览器端（客户端渲染时）
- Node.js 端（SSR 时）
- Nitro 服务端路由中

都能直接使用。典型用途包括验证逻辑、常量定义、类型定义。

```ts
// shared/constants.ts — 客户端和服务端都能访问
export const APP_NAME = 'My Nuxt 4 App'
export const API_VERSION = 'v1'

// shared/validators.ts — 前后端共享的校验逻辑
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

```ts
// server/api/register.post.ts — 服务端使用 shared 中的校验
import { isValidEmail } from '~~/shared/validators'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!isValidEmail(body.email)) {
    throw createError({ statusCode: 400, message: 'Invalid email' })
  }
  // ...
})
```

```vue
<!-- app/pages/register.vue — 客户端同样使用 shared 中的校验 -->
<script setup lang="ts">
const email = ref('')
const error = computed(() =>
  email.value && !isValidEmail(email.value) ? 'Invalid email' : ''
)
</script>
```

### 2.3 `app/app.config.ts` — 应用配置

Nuxt 4 推荐在 `app/` 下使用 `app.config.ts` 定义应用级公共配置：

```ts
// app/app.config.ts
export default defineAppConfig({
  title: 'My Nuxt 4 App',
  theme: {
    primary: '#00DC82',
    secondary: '#1E293B',
  },
})
```

```vue
<!-- 在组件中访问 -->
<script setup lang="ts">
const appConfig = useAppConfig()
console.log(appConfig.title)  // 'My Nuxt 4 App'
</script>
```

---

## 三、向下兼容：沿用 Nuxt 3 目录结构

如果暂时不想迁移到 `app/` 目录，可以通过配置继续使用旧布局：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  // 保持 Nuxt 3 的目录布局
  srcDir: '.',
  dir: {
    pages: 'pages',
    components: 'components',
    layouts: 'layouts',
    middleware: 'middleware',
    plugins: 'plugins',
  },
})
```

Nuxt 会自动检测你的目录布局方式，无需强制迁移。

---

## 四、Nuxt 4 TypeScript 新机制

### 4.1 单一 tsconfig.json

Nuxt 4 项目中**只需一个 `tsconfig.json`**：

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

Nuxt 会自动为不同上下文（app / server / shared）生成独立的 tsconfig，在 `.nuxt/` 目录中管理，杜绝类型冲突。

### 4.2 目录与 TypeScript 上下文对应

| 目录        | TypeScript 上下文      | 可用 API                         |
| ----------- | --------------------- | -------------------------------- |
| `app/`      | 客户端 + SSR          | Vue、`useFetch`、`useState` 等   |
| `server/`   | Nitro 服务端          | `defineEventHandler`、`useStorage` |
| `shared/`   | 两端共享              | 纯函数、类型、常量               |

这种隔离让 IDE 能正确提示每个上下文中可用的 API，避免在 `server/` 中误用 `useHead` 等客户端 API。

---

## 五、Nitro 3 服务端结构变化

Nuxt 4 内置 **Nitro 3**，`server/` 目录结构保持兼容但有增强：

```
server/
├── api/                   # API 端点（自动路由）
│   ├── posts.get.ts       # GET /api/posts
│   └── posts.post.ts      # POST /api/posts
├── routes/                # 更灵活的服务端路由
│   └── upload.post.ts     # POST /upload
├── middleware/             # 服务端中间件
├── utils/                 # 服务端工具函数
└── plugins/               # Nitro 插件
```

---

## 六、新旧目录对照表

| 原位置 (Nuxt 3)        | 新位置 (Nuxt 4 默认)        | 说明                    |
| ---------------------- | --------------------------- | ----------------------- |
| `pages/`               | `app/pages/`                | 页面路由                |
| `components/`          | `app/components/`           | 自动导入组件            |
| `composables/`         | `app/composables/`          | 自动导入组合式函数      |
| `layouts/`             | `app/layouts/`              | 布局组件                |
| `middleware/`          | `app/middleware/`           | 路由中间件              |
| `plugins/`             | `app/plugins/`              | 插件                    |
| `utils/`（前端）       | `app/utils/`                | 前端工具函数            |
| `assets/`              | `app/assets/`               | 构建资源                |
| `app.vue`              | `app/app.vue`               | 根组件                  |
| `server/`              | `server/`（不变）           | Nitro 服务端            |
| （无）                 | `shared/`                   | 🆕 两端共享代码        |
| `error.vue`            | `app/error.vue`             | 错误页面                |