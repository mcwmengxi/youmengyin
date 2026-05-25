# 项目结构与目录约定

> 本章详细介绍 Nuxt 3 项目的目录结构、各目录职责及文件命名约定。

## 一、标准目录结构

Nuxt 3 初始化后的标准目录结构如下：

```
my-app/
├── .nuxt/               # 自动生成的构建目录（勿手动修改）
├── .output/             # 生产构建输出
├── assets/              # 需要构建处理的静态资源（CSS、图片、字体）
├── components/          # Vue 组件，自动导入
├── composables/         # 组合式函数，自动导入
├── content/             # Nuxt Content 模块的内容目录
├── layouts/             # 布局组件
├── middleware/          # 路由中间件
├── node_modules/        # 依赖包
├── pages/               # 页面文件，自动生成路由
├── plugins/             # 插件文件
├── public/              # 静态资源，直接映射到根路径
├── server/              # 服务端 API 和中间件
│   ├── api/             #  API 路由
│   ├── routes/          # 自定义服务端路由
│   └── middleware/      # 服务端中间件
├── utils/               # 工具函数，自动导入
├── .env                 # 环境变量
├── .gitignore
├── app.vue              # 应用根组件
├── nuxt.config.ts       # Nuxt 配置文件
├── package.json
└── tsconfig.json        # TypeScript 配置
```

---

## 二、核心目录详解

### 2.1 `pages/` — 页面目录

- 文件自动映射为路由，遵循约定式路由规则
- 支持动态路由参数 `[id].vue`、全捕获路由 `[...slug].vue`
- 目录下的 `index.vue` 自动作为该路径的默认页面

```
pages/
├── index.vue            → /
├── about.vue            → /about
├── posts/
│   ├── index.vue        → /posts
│   └── [id].vue         → /posts/:id
└── admin/
    ├── index.vue        → /admin
    └── users/
        └── [id].vue     → /admin/users/:id
```

### 2.2 `components/` — 组件目录

- 所有导出的 `.vue` 组件**自动全局注册**，无需手动 `import`
- 支持嵌套目录，组件名按路径自动生成
- `<ClientOnly>` 包裹的组件只在客户端渲染

```
components/
├── TheHeader.vue        → <TheHeader />
├── base/
│   └── Button.vue       → <BaseButton />
└── card/
    └── ArticleCard.vue  → <CardArticleCard />
```

**命名规则**：

- 文件名 = 组件名（PascalCase）
- 嵌套目录名会作为组件名前缀
- 重复路径时取文件名更具体的那一级

### 2.3 `layouts/` — 布局目录

- 定义页面通用布局骨架
- 默认使用 `layouts/default.vue`
- 页面可通过 `definePageMeta({ layout: 'custom' })` 切换布局

### 2.4 `server/` — 服务端目录

- `server/api/`：创建 RESTful API 端点
- `server/routes/`：更灵活的服务端路由（支持中间件）
- `server/middleware/`：每次请求都会执行的服务端中间件

### 2.5 `composables/` — 组合式函数

- 导出函数自动导入，无需手动 import
- 命名须以 `use` 开头（如 `useAuth.ts`）
- 其中的 `ref`、`reactive` 等 Vue API 也是自动导入的

### 2.6 `assets/` vs `public/`

| 目录      | 用途                                     | 访问方式                         |
| --------- | ---------------------------------------- | -------------------------------- |
| `assets/` | 需 Vite 构建处理的资源（SCSS、图片压缩） | `~/assets/logo.png`              |
| `public/` | 不经构建直接复制的静态文件               | `/favicon.ico`（根路径直接引用） |

### 2.7 `utils/` — 工具函数

- 放置纯工具函数，自动导入
- 不限命名规则，任意导出均可直接使用

---

## 三、文件命名约定

| 目录           | 命名规则                 | 示例                          |
| -------------- | ------------------------ | ----------------------------- |
| `pages/`       | kebab-case 或 PascalCase | `about-us.vue`、`AboutUs.vue` |
| `components/`  | PascalCase               | `AppHeader.vue`               |
| `composables/` | `use` 前缀               | `useAuth.ts`、`useCounter.ts` |
| `plugins/`     | kebab-case               | `analytics.client.ts`         |
| `middleware/`  | kebab-case               | `auth.global.ts`              |
| `server/api/`  | kebab-case               | `users/[id].get.ts`           |

### 文件后缀约定

- `.client.ts` — 仅在客户端执行
- `.server.ts` — 仅在服务端执行
- `.[method].ts` — 服务端 API 限定 HTTP 方法（如 `.get.ts`）

---

## 四、自动导入机制

Nuxt 3 的自动导入分为两层：

### 4.1 Vue 核心 API 自动导入

无需手动 import，以下 API 可直接使用：

```vue
<script setup>
// 无需 import { ref, computed, watch } from 'vue'
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### 4.2 项目文件自动导入

以下目录中的导出会自动可用：

- `components/` — 组件
- `composables/` — 组合式函数
- `utils/` — 工具函数

### 4.3 禁止自动导入

可在 `nuxt.config.ts` 中关闭：

```ts
export default defineNuxtConfig({
  imports: {
    autoImport: false, // 关闭全部自动导入
  },
})
```

### 4.4 自定义自动导入目录

```ts
export default defineNuxtConfig({
  imports: {
    dirs: ['stores', 'shared/utils'], // 额外加入自动导入的目录
  },
})
```
