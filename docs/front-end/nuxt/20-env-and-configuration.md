# 环境变量与多环境配置

> 本章讲解 Nuxt 4 的环境变量管理、多环境配置策略和运行时配置的最佳实践。

## 一、运行时配置

### 1.1 `runtimeConfig` vs `app.config`

Nuxt 4 提供两层配置：

| 配置方式           | 用途                         | 访问方式            | 安全性       |
| ------------------ | ---------------------------- | ------------------- | ------------ |
| `runtimeConfig`    | 环境相关配置（秘密、URL 等） | `useRuntimeConfig()` | 私密/公开    |
| `app.config.ts`    | 应用主题、功能开关           | `useAppConfig()`     | 完全公开     |

### 1.2 `app.config.ts` — 应用配置

```ts
// app/app.config.ts
export default defineAppConfig({
  title: 'My Nuxt 4 App',
  theme: {
    primary: '#00DC82',
    secondary: '#1E293B',
  },
  features: {
    enableComments: true,
    enableSearch: true,
    enableAnalytics: false,
  },
})
```

```vue
<script setup lang="ts">
const appConfig = useAppConfig()
// appConfig.title           → 'My Nuxt 4 App'
// appConfig.theme.primary   → '#00DC82'
</script>
```

**特点**：
- 始终公开，客户端可访问
- 支持 HMR（开发时修改即时生效）
- 适合主题、功能开关等非敏感配置

---

## 二、环境变量

### 2.1 `.env` 文件

Nuxt 4 会在项目根目录加载 `.env` 文件：

```bash
# .env
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=my-super-secret-key
API_BASE_URL=https://api.example.com
```

### 2.2 在 `runtimeConfig` 中使用

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    // 私有配置 — 仅服务端可访问
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,

    // 公开配置 — 客户端和服务端都可访问
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
      appEnv: process.env.NODE_ENV || 'development',
    },
  },
})
```

```ts
// 服务端 — 可访问全部
const config = useRuntimeConfig()
config.databaseUrl       // ✅ 可访问
config.public.apiBaseUrl // ✅ 可访问

// 客户端 — 仅可访问 public
const config = useRuntimeConfig()
config.databaseUrl       // ❌ undefined
config.public.apiBaseUrl // ✅ 可访问
```

---

## 三、多环境文件

Nuxt 4 支持 `.env`、`.env.development`、`.env.production` 等：

### 3.1 文件优先级

```
.env.development.local  (本地开发，不提交到 Git)
.env.development        (开发环境)
.env.local              (本地通用，不提交到 Git)
.env                    (所有环境)
```

### 3.2 多环境示例

```bash
# .env — 默认值
APP_NAME=MyApp
API_BASE_URL=http://localhost:3000

# .env.development — 开发环境覆盖
API_BASE_URL=http://localhost:3000
LOG_LEVEL=debug

# .env.production — 生产环境覆盖
API_BASE_URL=https://api.prod.example.com
LOG_LEVEL=warn
```

### 3.3 部署平台环境变量

Nuxt 4 + Nitro 3 会自动读取部署平台的环境变量：

```ts
// Vercel: process.env.VERCEL_URL 自动可用
// Netlify: process.env.NETLIFY 自动可用
// Cloudflare: process.env.CF_PAGES 自动可用
```

---

## 四、Nuxt 4 配置增强

### 4.1 `nuxt.config.ts` 完整示例

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  // 运行时配置
  runtimeConfig: {
    // 私有（服务端）
    databaseUrl: '',
    jwtSecret: '',
    smtp: {
      host: '',
      port: 587,
      user: '',
      pass: '',
    },

    // 公开（客户端 + 服务端）
    public: {
      apiBaseUrl: 'http://localhost:3000',
      appName: 'My Nuxt 4 App',
      appEnv: 'development',
      gtagId: '',
    },
  },

  // 应用配置
  appConfig: {
    title: 'My App',
    theme: { primary: '#00DC82' },
  },

  // 模块
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
  ],
})
```

### 4.2 环境变量验证

Nuxt 4 支持在 `nuxt.config.ts` 中验证环境变量：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },

  // 开发环境验证
  hooks: {
    'nitro:init'(nitro) {
      if (process.env.NODE_ENV === 'production') {
        if (!process.env.DATABASE_URL) {
          console.error('❌ 生产环境缺少 DATABASE_URL')
          process.exit(1)
        }
      }
    },
  },
})
```

---

## 五、CI/CD 环境配置

### 5.1 GitHub Actions

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          API_BASE_URL: ${{ vars.API_BASE_URL }}
```

### 5.2 Docker 环境变量

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .output .output
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 六、Nuxt 4 环境变量最佳实践

- **秘密信息放 `runtimeConfig` 私有字段**，不用 `public` 暴露
- **客户端需要的配置放 `public`**，如 API 地址、Analytics ID
- **主题/功能开关放 `app.config.ts`**，非敏感且可 HMR
- **环境变量前缀用 `NUXT_PUBLIC_`** 覆盖 public 配置（Nuxt 4 标准）
- **`.env` 文件不提交到 Git**，用 `.env.example` 提供模板
- **生产环境验证必须变量**，避免运行时崩溃