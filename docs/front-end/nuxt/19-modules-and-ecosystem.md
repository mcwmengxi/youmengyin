# Nuxt 4 模块生态

> 本章讲解 Nuxt 4 的模块系统，包括常用模块、模块安装与配置、以及如何编写自定义模块。

## 一、模块概述

Nuxt 模块是可插拔的功能包，通过 `nuxt.config.ts` 的 `modules` 数组注册。模块可以：
- 自动注入组件、Composables、插件
- 修改 Vite/Webpack 配置
- 添加服务端路由和中间件
- 扩展 Nuxt 运行时能力

---

## 二、常用 Nuxt 4 模块

### 2.1 UI 框架

**@nuxt/ui** — Nuxt 官方 UI 库（Tailwind CSS + 无头组件）：

```bash
npx nuxi module add @nuxt/ui
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui'],
})
```

**@nuxtjs/tailwindcss**：

```bash
npx nuxi module add @nuxtjs/tailwindcss
```

### 2.2 图片优化

**@nuxt/image** — Nuxt 4 图片优化模块：

```bash
npx nuxi module add @nuxt/image
```

```vue
<NuxtImg src="/hero.jpg" format="webp" loading="lazy" />
```

**@nuxt/icon** — Nuxt 4 图标模块（替代过去的 @nuxtjs/icon）：

```bash
npx nuxi module add @nuxt/icon
```

### 2.3 状态与数据

**@pinia/nuxt** — Pinia 状态管理：

```bash
npx nuxi module add @pinia/nuxt
```

### 2.4 内容管理

**@nuxt/content** — 基于文件的 CMS：

```bash
npx nuxi module add @nuxt/content
```

```ts
// 使用 content/ 目录下的 Markdown 文件
const { data: article } = await useAsyncData('article',
  () => queryContent('/blog/my-post').findOne()
)
```

### 2.5 SEO & PWA

**@nuxtjs/sitemap** — 自动生成网站地图：

```bash
npx nuxi module add @nuxtjs/sitemap
```

**@nuxtjs/robots** — 自动生成 robots.txt：

```bash
npx nuxi module add @nuxtjs/robots
```

**@vite-pwa/nuxt** — PWA 支持：

```bash
npx nuxi module add @vite-pwa/nuxt
```

### 2.6 国际化

**@nuxtjs/i18n** — 多语言支持：

```bash
npx nuxi module add @nuxtjs/i18n
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'zh',
    vueI18n: './i18n.config.ts',
  },
})
```

### 2.7 安全与性能

**nuxt-security** — 安全头、CSP、CSRF 防护：

```bash
npx nuxi module add nuxt-security
```

**@nuxtjs/fontaine** — 字体加载优化：

```bash
npx nuxi module add @nuxtjs/fontaine
```

---

## 三、模块安装方式

Nuxt 4 推荐使用 `nuxi module add` 命令：

```bash
# 添加模块（自动安装依赖 + 更新 nuxt.config.ts）
npx nuxi module add @nuxt/ui
npx nuxi module add @nuxt/image
npx nuxi module add @nuxt/icon

# 等价于手动：
npm install @nuxt/ui
# 然后在 nuxt.config.ts 的 modules 中添加 '@nuxt/ui'
```

Nuxt 4 的 module add 命令会自动更新 `nuxt.config.ts` 的 `modules` 数组。

---

## 四、模块配置

### 4.1 内联配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/content'],

  // 模块配置
  ui: {
    primary: 'green',
  },
  image: {
    provider: 'ipx',
    domains: ['cdn.example.com'],
  },
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
```

### 4.2 Nuxt 4 模块自动检测

Nuxt 4 可以自动检测已安装的模块，无需手动添加到 `modules` 数组：

```bash
npm install @nuxt/ui @nuxt/image
```

Nuxt 4 在启动时会扫描 `package.json` 的依赖，自动加载以 `@nuxt/` 或 `nuxt-` 开头的包。

---

## 五、编写自定义模块

### 5.1 定义模块

```ts
// modules/my-module.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },

  defaults: {
    enabled: true,
    message: 'Hello!',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // 添加插件
    addPlugin(resolve('./runtime/plugin'))

    // 添加组件
    addComponent({
      name: 'MyButton',
      filePath: resolve('./runtime/components/MyButton.vue'),
    })

    // 添加 Composable
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve('./runtime/composables'))
    })
  },
})
```

### 5.2 使用自定义模块

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['~/modules/my-module'],
  myModule: {
    enabled: true,
    message: 'Custom message',
  },
})
```

### 5.3 发布模块到 npm

```json
// package.json
{
  "name": "nuxt-my-module",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/module.mjs",
      "types": "./dist/types.d.ts"
    }
  },
  "main": "./dist/module.mjs",
  "files": ["dist"]
}
```

---

## 六、Nuxt 4 模块生态速查

| 类别       | 模块                  | 用途               |
| ---------- | --------------------- | ------------------ |
| UI         | `@nuxt/ui`            | 官方 UI 组件库     |
| UI         | `@nuxtjs/tailwindcss` | Tailwind CSS       |
| 图片       | `@nuxt/image`         | 图片优化与裁剪     |
| 图标       | `@nuxt/icon`          | 图标管理           |
| 字体       | `@nuxt/fonts`         | 字体优化           |
| 状态管理   | `@pinia/nuxt`         | Pinia              |
| 内容       | `@nuxt/content`       | 文件内容管理       |
| SEO        | `@nuxtjs/sitemap`     | 站点地图           |
| SEO        | `@nuxtjs/robots`      | Robots.txt         |
| 国际化     | `@nuxtjs/i18n`        | 多语言             |
| PWA        | `@vite-pwa/nuxt`      | PWA 支持           |
| 安全       | `nuxt-security`       | 安全头与 CSRF      |
| 分析       | `@nuxtjs/plausible`   | 隐私友好分析       |
| 颜色模式   | `@nuxtjs/color-mode`  | 暗色模式切换       |

---

## 七、Nuxt 4 模块最佳实践

- **使用 `nuxi module add` 安装模块**，自动处理配置
- **Nuxt 4 模块自动检测**，减少手动配置
- **模块配置集中在 `nuxt.config.ts`**，便于维护
- **自定义模块保持轻量**，利用 `@nuxt/kit` 提供的钩子
- **模块使用 TypeScript 编写**，发布时提供类型声明