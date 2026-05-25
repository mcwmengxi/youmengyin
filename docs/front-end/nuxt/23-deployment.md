# 部署方案

> 本章介绍 Nuxt 3 项目在不同平台上的部署方案。

## 一、构建产物

### 1.1 目录结构

执行 `npm run build` 后生成 `.output` 目录：

```
.output/
├── public/           # 静态资源（可直接部署到 CDN）
│   └── _nuxt/
├── server/           # 服务端代码
│   ├── index.mjs     # 入口文件
│   ├── chunks/
│   └── node_modules/
└── nitro.json        # Nitro 配置
```

### 1.2 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 本地预览生产构建
npm run preview

# 生成静态站点
npx nuxi generate
```

---

## 二、Node.js 服务器部署

### 2.1 传统 Node 部署

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server',
  },
})
```

```bash
# 构建
npm run build

# 直接运行
node .output/server/index.mjs

# 或使用 PM2
npm install -g pm2
pm2 start .output/server/index.mjs --name nuxt-app
pm2 save
pm2 startup
```

### 2.2 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/nuxt-app
server {
    listen 80;
    server_name example.com;

    # 静态资源直接由 Nginx 处理
    location /_nuxt/ {
        alias /app/.output/public/_nuxt/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 其他请求代理到 Node
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2.3 Docker 部署

```dockerfile
# Dockerfile
# ——— 构建阶段 ———
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ——— 运行阶段 ———
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

```bash
docker build -t my-nuxt-app .
docker run -d -p 3000:3000 --name nuxt-app my-nuxt-app
```

### 2.4 Docker Compose（配合数据库）

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      NUXT_DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb

volumes:
  pgdata:
```

---

## 三、静态站点生成（SSG）

### 3.1 纯静态部署

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/', '/blog', '/about'],
      crawlLinks: true,
    },
  },
})
```

```bash
# 生成静态文件
npx nuxi generate

# 产物在 .output/public/
# 可直接部署到 Nginx / Apache / OSS / CDN
```

### 3.2 部署到 Nginx（静态）

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/nuxt-app/.output/public;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3.3 部署到 OSS / CDN

```bash
# 阿里云 OSS
npx nuxi generate
ossutil cp -r .output/public/ oss://my-bucket/

# AWS S3
aws s3 sync .output/public/ s3://my-bucket/ --delete
```

---

## 四、主流平台部署

### 4.1 Vercel

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
  },
})
```

Vercel 会自动检测 Nuxt 项目并配置构建命令。无需手动设置，推送代码即可自动部署。

```bash
# Vercel CLI
npm i -g vercel
vercel
```

### 4.2 Netlify

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify',
  },
})
```

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server/:splat"
  status = 200
```

### 4.3 Cloudflare Pages

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
  },
})
```

构建设置：

- 构建命令: `npm run build`
- 构建输出目录: `dist`

### 4.4 Railway / Render

这些 PaaS 平台会自动检测 `package.json` 中的 `start` 脚本：

```json
{
  "scripts": {
    "build": "nuxt build",
    "start": "node .output/server/index.mjs"
  },
  "engines": {
    "node": "20.x"
  }
}
```

---

## 五、缓存与性能

### 5.1 CDN 缓存策略

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      // 静态资源永久缓存
      '/_nuxt/**': {
        headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
      },
      // API 响应短期缓存
      '/api/public/**': {
        headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
      },
    },
  },
})
```

### 5.2 静态资源 CDN

```ts
export default defineNuxtConfig({
  app: {
    cdnURL: 'https://cdn.example.com',
  },
})
```

构建后，所有 `/_nuxt/*` 资源引用会自动替换为 `https://cdn.example.com/_nuxt/*`。

---

## 六、HTTPS 与域名配置

### 6.1 Nginx + Let's Encrypt

```bash
# Certbot 自动配置 HTTPS
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

### 6.2 云平台配置

| 平台             | HTTPS 方式                |
| ---------------- | ------------------------- |
| Vercel           | 自动配置                  |
| Netlify          | 自动配置                  |
| Cloudflare Pages | 自动配置 + 自定义域名可配 |
| 自建 Nginx       | certbot + Let's Encrypt   |
| Docker + Traefik | 自动 ACME                 |

---

## 七、常用 preset 对比

| Preset             | 适用场景         | Serverless | Edge |
| ------------------ | ---------------- | ---------- | ---- |
| `node-server`      | 自建服务器       |            |      |
| `static`           | 纯静态网站       |            |      |
| `vercel`           | Vercel 平台      | ✅         |      |
| `vercel-edge`      | Vercel Edge      | ✅         | ✅   |
| `netlify`          | Netlify          | ✅         |      |
| `netlify-edge`     | Netlify Edge     | ✅         | ✅   |
| `cloudflare-pages` | Cloudflare Pages | ✅         | ✅   |
| `deno-server`      | Deno 环境        |            |      |
| `bun`              | Bun 环境         |            |      |

---

## 八、部署检查清单

- [ ] 确认 `runtimeConfig` 中敏感信息已正确配置
- [ ] 环境变量在部署平台已设置（API keys, 数据库 URL）
- [ ] `nitro.preset` 已匹配目标平台
- [ ] 静态资源 CDN 地址正确
- [ ] robots.txt 允许搜索引擎抓取（如需要）
- [ ] sitemap.xml 已生成
- [ ] HTTPS 已启用
- [ ] 自定义域名已配置 DNS
- [ ] 健康检查接口正常
- [ ] 日志监控已接入
