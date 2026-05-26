# 部署与优化

> 本章讲解 Nuxt 4 应用的部署策略、CI/CD 流水线和生产环境优化。

## 一、部署策略概览

Nuxt 4 支持四种部署方式，由 Nitro 3 引擎统一管理：

| 方式             | 命令               | 输出目录                  | 适用场景            |
| ---------------- | ------------------ | ------------------------- | -------------------- |
| **Node.js 服务器** | `npm run build`    | `.output/`                | 需要服务端渲染       |
| **静态站点**     | `npm run generate` | `.output/public/`         | 纯静态内容网站       |
| **边缘函数**     | `NITRO_PRESET=...` | `.output/`                | Cloudflare, Vercel   |
| **Docker 容器**  | 手动构建镜像       | `.output/` in container   | Kubernetes, Docker   |

---

## 二、Node.js 服务器部署

### 2.1 构建

```bash
npm run build
# 输出在 .output/
```

```bash
# 启动生产服务器
node .output/server/index.mjs

# 配合 PM2
pm2 start .output/server/index.mjs --name my-app
```

### 2.2 环境变量

```bash
# 通过环境变量配置
PORT=3000 \
HOST=0.0.0.0 \
NITRO_PORT=3000 \
NITRO_HOST=0.0.0.0 \
node .output/server/index.mjs
```

### 2.3 PM2 配置

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'my-nuxt-app',
    script: './.output/server/index.mjs',
    env: {
      PORT: 3000,
      NODE_ENV: 'production',
    },
    instances: 'max',
    exec_mode: 'cluster',
  }],
}
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # 开机自启
```

---

## 三、静态站点部署

### 3.1 预渲染构建

```bash
npm run generate
# 输出在 .output/public/
```

### 3.2 部署到 Vercel

Nuxt 4 + Vercel 零配置部署：

```bash
# 自动检测 Nuxt 4，使用 Nitro 的 Vercel preset
```

### 3.3 部署到 Netlify

```bash
# 构建命令：npm run generate
# 发布目录：.output/public
```

### 3.4 部署到 Cloudflare Pages

```bash
# 构建命令：npm run generate
# 输出目录：/dist
# 或使用 edge preset
NITRO_PRESET=cloudflare-pages npm run build
```

### 3.5 部署到 GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./.output/public
```

---

## 四、Docker 部署

### 4.1 Dockerfile（Node.js 服务器）

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output

ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### 4.2 Docker Compose

```yaml
# docker-compose.yml
services:
  nuxt-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
```

---

## 五、生产环境优化

### 5.1 构建优化配置

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  // 生产优化
  experimental: {
    payloadExtraction: true,   // 提取 payload 减小 HTML
    renderJsonPayloads: true,   // JSON payload 启用压缩
  },

  nitro: {
    compressPublicAssets: true, // 压缩静态资源
    minify: true,               // 最小化 HTML
  },

  // 移除开发工具
  devtools: {
    enabled: false,
  },
})
```

### 5.2 资源优化

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  // 资源预加载策略
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://api.example.com' },
      ],
    },
  },
})
```

### 5.3 缓存策略

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  routeRules: {
    // 静态资源缓存
    '/_nuxt/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
    // API 缓存（SWR）
    '/api/public/**': { swr: 300 },
  },
})
```

---

## 六、Nitro 3 部署预设

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  nitro: {
    preset: 'node-server', // 或 'vercel', 'netlify', 'cloudflare-pages'...

    // Node.js 集群模式
    node: {
      // Nitro 3 支持自动集群
    },
  },
})
```

---

## 七、部署最佳实践

- **生产环境使用 `npm run build` 或 `npm run generate`**
- **环境变量在 CI/CD 平台管理，不提交 `.env` 到 Git**
- **使用 Docker 多阶段构建减小镜像大小**
- **静态资源设置长期缓存**（`Cache-Control: immutable`）
- **PM2 集群模式充分利用多核 CPU**
- **监控 `.output/` 目录大小**，避免过大导致部署缓慢
- **在部署前运行 `nuxi typecheck` 确保类型安全**