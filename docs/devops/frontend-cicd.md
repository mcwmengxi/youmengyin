# 前端持续集成与部署学习路线

## 概述

前端持续集成与部署（CI/CD）是将前端工程化流程自动化的核心实践。从代码提交到线上发布，通过自动化流水线减少人工干预，提升交付效率与质量。

本路线结合已有 DevOps 知识体系（Linux、Docker、Nginx、Jenkins），梳理前端 CI/CD 的完整学习路径。

## 学习路线图

```
版本控制(Git) → 包管理与构建 → 自动化测试 → 持续集成 → 容器化 → 部署与反向代理 → 监控与优化
```

## 第一阶段：版本控制与协作规范

### Git 工作流

- 分支策略：Git Flow、GitHub Flow、Trunk-Based Development
- Commit 规范：Conventional Commits（feat / fix / docs / chore 等）
- Code Review 流程与 PR/MR 模板

### 钩子与自动化

- Husky + lint-staged：提交前自动校验代码风格
- commitlint：校验 commit message 格式
- pre-push 钩子：推送前运行单元测试

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["stylelint --fix"]
  }
}
```

## 第二阶段：包管理与构建工具

### 包管理器

详见 [包管理器](/docs/devops/package_tools)

- npm / yarn / pnpm 的选型与 .npmrc 配置
- 依赖锁定：package-lock.json / yarn.lock / pnpm-lock.yaml
- 私有 npm 仓库搭建（Verdaccio）

### 构建工具

- Webpack：模块打包、代码分割、Tree Shaking
- Vite：基于 ESM 的开发服务器与 Rollup 构建
- 构建产物分析：webpack-bundle-analyzer、rollup-plugin-visualizer

### 构建优化

- 代码分割与懒加载
- 资源压缩（terser、cssnano、imagemin）
- 构建缓存策略

## 第三阶段：自动化测试

### 测试金字塔

| 层级     | 工具                             | 关注点         |
| -------- | -------------------------------- | -------------- |
| 单元测试 | Vitest / Jest                    | 函数、组件逻辑 |
| 集成测试 | Vue Test Utils / Testing Library | 组件交互       |
| E2E 测试 | Playwright / Cypress             | 用户流程       |

### 测试在 CI 中的集成

```yaml
# GitHub Actions 示例
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:e2e
```

### 覆盖率与质量门禁

- Istanbul / c8 覆盖率采集
- 设置覆盖率阈值，未达标则 CI 构建失败
- SonarQube 代码质量扫描

## 第四阶段：持续集成平台

### Jenkins

详见 [Jenkins](/docs/devops/jenkins)

- Pipeline as Code：Jenkinsfile 声明式流水线
- 多分支流水线：自动识别分支并触发构建
- 凭据管理：SSH Key、API Token 安全存储
- 构建产物归档与部署

```groovy
pipeline {
  agent any
  stages {
    stage('Install') {
      steps { sh 'pnpm install' }
    }
    stage('Lint') {
      steps { sh 'pnpm lint' }
    }
    stage('Test') {
      steps { sh 'pnpm test' }
    }
    stage('Build') {
      steps { sh 'pnpm build' }
    }
    stage('Deploy') {
      steps { sh 'deploy.sh' }
    }
  }
}
```

### GitHub Actions

- Workflow 语法：on、jobs、steps、uses
- 常用 Action：actions/checkout、actions/setup-node
- 矩阵构建：多 Node 版本并行测试
- 环境变量与 Secrets 管理

### GitLab CI

- .gitlab-ci.yml 配置
- Runner 类型：Shared / Group / Specific
- 环境与部署策略

## 第五阶段：容器化

### Docker 基础

详见 [Docker](/docs/devops/docker/docker)

### 前端项目 Dockerfile 最佳实践

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 多阶段构建要点

- 构建阶段：安装依赖、编译打包
- 运行阶段：仅包含构建产物与运行时
- 镜像体积优化：alpine 基础镜像、.dockerignore

### Docker Compose 编排

详见 [Docker 容器编排](/docs/devops/docker/docker-compose)

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - '80:80'
    restart: always
  api:
    image: my-api:latest
    ports:
      - '3000:3000'
    restart: always
```

## 第六阶段：部署与反向代理

### Nginx 部署

详见 [Nginx 入门](/docs/devops/nginx/basic) 和 [HTTPS 配置](/docs/devops/nginx/https)

### 前端静态资源部署配置

```nginx
server {
    listen 80;
    server_name www.example.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

### SPA 路由处理

- `try_files $uri $uri/ /index.html`：将所有路由回退到 index.html
- History 模式 vs Hash 模式对部署的影响

### 部署策略

| 策略       | 说明             | 适用场景   |
| ---------- | ---------------- | ---------- |
| 蓝绿部署   | 两套环境切换     | 零停机发布 |
| 滚动更新   | 逐步替换实例     | 容器化部署 |
| 金丝雀发布 | 小流量验证后全量 | 风险控制   |
| 灰度发布   | 按用户特征分流   | A/B 测试   |

## 第七阶段：监控与持续优化

### 构建监控

- 构建耗时趋势分析
- 构建失败告警（钉钉 / 飞书 / Slack 通知）
- 构建产物体积变化追踪

### 线上监控

- 错误监控：Sentry
- 性能监控：Web Vitals（LCP / FID / CLS）
- 用户行为分析

### CDN 与缓存

- 静态资源 CDN 分发
- 文件名哈希与长期缓存策略
- HTML 文件 no-cache，JS/CSS/images 强缓存

## 工具链速查

| 环节     | 推荐工具                             |
| -------- | ------------------------------------ |
| 版本控制 | Git + Husky + lint-staged            |
| 包管理   | pnpm                                 |
| 构建     | Vite / Webpack                       |
| 测试     | Vitest + Playwright                  |
| CI       | GitHub Actions / Jenkins / GitLab CI |
| 容器化   | Docker + Docker Compose              |
| 部署     | Nginx                                |
| 监控     | Sentry + Web Vitals                  |

## 推荐学习顺序

1. 掌握 [Linux 基础](/docs/devops/linux/basic)，熟悉命令行操作
2. 学习 [Docker](/docs/devops/docker/docker) 容器化技术
3. 理解 [Nginx](/docs/devops/nginx/basic) 反向代理与静态资源服务
4. 实践 [Jenkins](/docs/devops/jenkins) 搭建 CI/CD 流水线
5. 将前端项目接入完整的自动化流程
6. 持续优化构建速度、部署策略与监控体系
