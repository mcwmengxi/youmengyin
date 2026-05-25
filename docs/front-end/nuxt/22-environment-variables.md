# 环境变量与多环境管理

> 本章讲解环境变量的配置与管理，以及开发、测试、生产环境的区分。

## 一、.env 文件机制

### 1.1 .env 文件优先级

Nuxt 在启动时按以下优先级加载环境变量（后面的覆盖前面的）：

```
.env                    # 所有环境都加载（最低优先级）
.env.local              # 本地覆盖（不提交到 Git）
.env.${NODE_ENV}        # 按环境加载: .env.development / .env.production
.env.${NODE_ENV}.local  # 环境本地覆盖（最高优先级）
```

### 1.2 基础示例

```bash
# .env — 所有环境默认值
API_BASE_URL=https://api.example.com
APP_TITLE=My App

# .env.development — 开发环境
API_BASE_URL=http://localhost:3001
APP_DEBUG=true

# .env.production — 生产环境
API_BASE_URL=https://api.prod.example.com
APP_DEBUG=false
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: '', // 由环境变量 NUXT_PUBLIC_API_BASE_URL 覆盖
    },
  },
})
```

---

## 二、环境变量命名规范

### 2.1 标准命名

| 变量用途   | 命名示例                   |
| ---------- | -------------------------- |
| API 地址   | `NUXT_PUBLIC_API_BASE_URL` |
| 第三方 Key | `NUXT_THIRD_PARTY_KEY`     |
| 数据库     | `NUXT_DATABASE_URL`        |
| 构建模式   | `NUXT_PUBLIC_APP_MODE`     |
| 版本号     | `NUXT_PUBLIC_APP_VERSION`  |

### 2.2 在 nuxt.config 中使用

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有（仅服务端）
    apiSecret: process.env.NUXT_API_SECRET,
    databaseUrl: process.env.NUXT_DATABASE_URL,

    // 公共（客户端 + 服务端）
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'development',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0',
      enableDebug: process.env.NUXT_PUBLIC_ENABLE_DEBUG === 'true',
    },
  },
})
```

---

## 三、多环境配置方案

### 3.1 方案一：多 .env 文件 + package.json scripts

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build:dev": "NODE_ENV=development nuxt build",
    "build:test": "NODE_ENV=test nuxt build",
    "build:prod": "NODE_ENV=production nuxt build",
    "preview:dev": "NODE_ENV=development nuxt preview",
    "preview:test": "NODE_ENV=test nuxt preview",
    "preview:prod": "NODE_ENV=production nuxt preview"
  }
}
```

```bash
# .env.development  # 开发环境
# .env.test         # 测试环境
# .env.production   # 生产环境
```

### 3.2 方案二：统一 config 文件管理

```ts
// config/env.ts
export const envConfig = {
  development: {
    apiBase: 'http://localhost:3001',
    debug: true,
  },
  test: {
    apiBase: 'https://test-api.example.com',
    debug: true,
  },
  production: {
    apiBase: 'https://api.example.com',
    debug: false,
  },
}

export function getEnv(env: string) {
  return envConfig[env] || envConfig.development
}
```

```ts
// nuxt.config.ts
import { envConfig } from './config/env'

const env = process.env.APP_ENV || 'development'
const config = envConfig[env]

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: config.apiBase,
      appEnv: env,
      enableDebug: config.debug,
    },
  },
})
```

### 3.3 方案三：运行时注入

```ts
// server/api/env.get.ts
export default defineEventHandler(() => {
  return {
    env: process.env.APP_ENV,
    version: process.env.APP_VERSION,
    buildTime: process.env.BUILD_TIME,
  }
})
```

---

## 四、敏感信息管理

### 4.1 原则

- **私有变量不要暴露给 `public`**
- **.env 文件加入 .gitignore**（特别是含密钥的文件）
- **生产环境变量由 CI/CD 注入**，不存放在代码仓库

```bash
# .gitignore
.env
.env.*
!.env.example     # 保留示例文件

# 密钥文件
*.pem
*.key
```

### 4.2 .env.example

```bash
# .env.example — 提交到仓库，不含真实值
NUXT_API_SECRET=your_api_secret_here
NUXT_DATABASE_URL=postgres://user:password@host:port/db
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
NUXT_PUBLIC_APP_ENV=development
```

### 4.3 在服务端 API 中使用

```ts
// server/api/secret-data.get.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  // 只有服务端能访问
  const secret = config.apiSecret

  // 使用密钥调用第三方 API
  const data = await $fetch('https://third-party-api.com/data', {
    headers: { 'X-API-Key': secret },
  })

  // 返回给客户端的数据不包含密钥
  return data
})
```

---

## 五、CI/CD 环境变量注入

### 5.1 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - run: npm ci

      - name: Build
        run: npm run build
        env:
          NUXT_API_SECRET: ${{ secrets.API_SECRET }}
          NUXT_DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NUXT_PUBLIC_API_BASE_URL: ${{ vars.API_BASE_URL }}
          NUXT_PUBLIC_APP_ENV: production
```

### 5.2 Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .output .output

ENV NUXT_PUBLIC_APP_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
# docker run 时注入环境变量
docker run -d \
  -e NUXT_API_SECRET=my-secret \
  -e NUXT_DATABASE_URL=postgres://... \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -p 3000:3000 \
  my-nuxt-app
```

### 5.3 Vercel / Netlify

在平台的 Environment Variables 面板中设置：

```
NUXT_API_SECRET          = xxx  (Secret)
NUXT_PUBLIC_API_BASE_URL = https://api.example.com
NUXT_PUBLIC_APP_ENV      = production
```

---

## 六、动态环境检测

### 6.1 客户端环境判断

```vue
<script setup>
const config = useRuntimeConfig()
const route = useRoute()

// 通过环境变量
const isDev = config.public.appEnv === 'development'
const isProd = config.public.appEnv === 'production'

// 通过域名
const isLocal = window.location.hostname === 'localhost'

// 通过 import.meta
const isServerDev = import.meta.dev
const isClient = import.meta.client
</script>
```

### 6.2 服务端环境判断

```ts
// server/utils/env.ts
export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_DEV = process.env.NODE_ENV === 'development'

// 服务端中间件
export default defineEventHandler((event) => {
  if (IS_DEV) {
    console.log(`[${event.method}] ${event.path}`)
  }
})
```

---

## 七、常见问题

### 7.1 环境变量更新后不生效

```bash
# 重启开发服务器（.env 文件在启动时加载）
# 如果修改了 nuxt.config.ts，需要重启
npx nuxi dev
```

### 7.2 客户端访问不到变量

确保变量在 `runtimeConfig.public` 中定义：

```ts
// ❌ 客户端无法访问
runtimeConfig: {
  secretKey: 'xxx'
}

// ✅ 客户端可访问
runtimeConfig: {
  public: {
    apiBase: 'https://...'
  }
}
```

### 7.3 构建时 vs 运行时变量

```ts
// ⚠️ 构建时确定的变量，后续无法通过环境变量修改
export default defineNuxtConfig({
  appConfig: {
    // 这些值在构建时固化
    buildTime: Date.now(),
  },
})

// ✅ 运行时确定的变量，可通过环境变量修改
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // 运行时读取环境变量
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
})
```
