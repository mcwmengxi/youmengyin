# nuxt.config 配置详解

> 本章全面解读 `nuxt.config.ts` 中的核心配置项及其用法。

## 一、配置文件结构

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // === 基础配置 ===
  ssr: true, // 是否启用 SSR
  devtools: { enabled: true }, // 开发者工具
  srcDir: 'src/', // 源码目录

  // === 运行时配置 ===
  runtimeConfig: {}, // 运行时公共/私有配置
  appConfig: {}, // 应用级公共配置

  // === 模块 ===
  modules: [], // 注册 Nuxt 模块

  // === CSS ===
  css: [], // 全局 CSS 文件

  // === 路由 ===
  routeRules: {}, // 路由级别渲染配置

  // === 构建 ===
  nitro: {}, // Nitro 引擎配置
  vite: {}, // Vite 配置
  postcss: {}, // PostCSS 配置

  // === 类型检查 ===
  typescript: {}, // TS 配置

  // === 目录 ===
  dir: {}, // 自定义目录结构

  // === 实验性 ===
  experimental: {}, // 实验性功能
})
```

---

## 二、基础配置

### 2.1 SSR / SPA 模式

```ts
export default defineNuxtConfig({
  ssr: true, // 默认开启 SSR, 设为 false 为纯 SPA
})
```

### 2.2 源码目录

```ts
export default defineNuxtConfig({
  // 将所有页面/组件等移到 src/ 下
  srcDir: 'src/',

  // 目录结构变为:
  // src/
  // ├── pages/
  // ├── components/
  // ├── composables/
  // └── ...
})
```

### 2.3 全局 CSS

```ts
export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
    '~/assets/css/transitions.css',
    'normalize.css/normalize.css',
  ],
})
```

---

## 三、runtimeConfig 运行时配置

### 3.1 公共与私有配置

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 仅服务端可访问（私有）
    apiSecret: process.env.API_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // 客户端和服务端都可访问
    public: {
      apiBase: process.env.API_BASE || 'https://api.example.com',
      appName: 'My App',
      version: '1.0.0',
    },
  },
})
```

```vue
<script setup>
const config = useRuntimeConfig()
// 客户端可访问
console.log(config.public.apiBase) // ✅

// 客户端无法访问（服务端渲染时可通过 Nuxt 访问，构建后是 undefined）
console.log(config.apiSecret) // ⚠️ undefined on client

// 不要让公共配置的值来自私有密钥！
// ❌ public: { secret: process.env.SUPER_SECRET }
</script>
```

### 3.2 环境变量覆盖

运行时配置可以通过环境变量覆盖，命名规则为 `NUXT_` 前缀 + `_` 分隔：

```bash
# 覆盖 runtimeConfig.apiSecret
NUXT_API_SECRET=my-secret

# 覆盖 runtimeConfig.public.apiBase
NUXT_PUBLIC_API_BASE=https://new-api.example.com
```

---

## 四、appConfig 应用配置

与 `runtimeConfig` 的区别：`appConfig` 在**构建时**确定，`runtimeConfig` 在**运行时**确定。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  appConfig: {
    theme: {
      primaryColor: '#3b82f6',
      borderRadius: '8px',
    },
  },
})
```

```ts
// app.config.ts — 也可以在 app.config.ts 中定义
export default defineAppConfig({
  theme: {
    primaryColor: '#3b82f6',
  },
  navigation: [
    { label: '首页', to: '/' },
    { label: '博客', to: '/blog' },
  ],
})
```

```vue
<script setup>
const appConfig = useAppConfig()
console.log(appConfig.theme.primaryColor) // '#3b82f6'
</script>
```

| 特性         | `runtimeConfig` | `appConfig` |
| ------------ | --------------- | ----------- |
| 确定时机     | 运行时          | 构建时      |
| 环境变量覆盖 | 支持            | 不支持      |
| 敏感信息     | 支持私有配置    | 全部公开    |

---

## 五、目录自定义

```ts
export default defineNuxtConfig({
  dir: {
    pages: 'routes', // pages/ → routes/
    layouts: 'layouts', // layouts/
    middleware: 'middleware', // middleware/
    plugins: 'plugins', // plugins/
    public: 'public', // 静态资源
    assets: 'assets', // 资源文件
    modules: 'modules', // 本地模块
  },
})
```

---

## 六、TypeScript 配置

```ts
export default defineNuxtConfig({
  typescript: {
    strict: true, // 严格模式
    shim: true, // 生成 .nuxt/types/shim.d.ts
    typeCheck: true, // 构建时类型检查

    tsConfig: {
      compilerOptions: {
        strictNullChecks: true,
        paths: {
          '@/*': ['./*'],
          '~/*': ['./*'],
        },
      },
    },
  },
})
```

---

## 七、Nitro 引擎配置

```ts
export default defineNuxtConfig({
  nitro: {
    // 预设部署目标
    preset: 'node-server', // node-server | vercel | netlify | cloudflare-pages | ...

    // 服务端端口
    devServer: {
      watch: ['./server'],
    },

    // 压缩
    compressPublicAssets: true,

    // 预渲染路由
    prerender: {
      routes: ['/', '/about', '/sitemap.xml'],
      crawlLinks: true, // 自动爬取页面中的链接进行预渲染
    },

    // 存储
    storage: {
      data: { driver: 'fs', base: './data' },
    },

    // 服务端插件
    plugins: ['~/server/plugins/db.ts'],

    // 路径前缀
    baseURL: '/my-app', // 部署在子路径下
  },
})
```

---

## 八、Vite 配置

```ts
export default defineNuxtConfig({
  vite: {
    // CSS 预处理器
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_variables.scss" as *;',
        },
      },
    },

    // 路径别名
    resolve: {
      alias: {
        '@ui': resolve(__dirname, './components/ui'),
      },
    },

    // 服务器配置
    server: {
      fs: {
        allow: ['..'],
      },
    },

    // 构建配置
    build: {
      chunkSizeWarningLimit: 1000,
    },

    // 插件
    plugins: [],
  },
})
```

---

## 九、App 配置

```ts
export default defineNuxtConfig({
  app: {
    // HTML 头部
    head: {
      title: 'My App',
      meta: [
        { name: 'description', content: '网站描述' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      htmlAttrs: { lang: 'zh-CN' },
      bodyAttrs: { class: 'antialiased' },
    },

    // 根 ID（默认 __nuxt）
    rootId: '__nuxt',

    // 页面过渡
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },

    // 布局过渡
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },

    // 构建目录
    buildAssetsDir: '/_nuxt/',

    // CDN URL
    cdnURL: 'https://cdn.example.com',

    // 保持页面状态
    keepalive: true,
  },
})
```

---

## 十、常用配置组合

### SSR 博客站

```ts
export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/tailwindcss'],
  nitro: {
    prerender: { routes: ['/', '/blog', '/about'], crawlLinks: true },
  },
  routeRules: {
    '/blog/**': { swr: 3600 },
  },
})
```

### 管理后台 SPA

```ts
export default defineNuxtConfig({
  ssr: false, // 纯 SPA
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  routeRules: {
    '/admin/**': { ssr: false },
  },
  app: {
    head: { title: '管理后台' },
  },
})
```

### Edge 部署

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
  },
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
    },
    '/**': { swr: true },
  },
})
```
