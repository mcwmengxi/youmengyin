# 工程化实践

## 一、多仓库 vs 单仓库（Monorepo）

### 1.1 对比分析

| 维度 | Polyrepo（多仓库） | Monorepo（单仓库） |
|------|-------------------|-------------------|
| **仓库数量** | 每个子应用独立仓库 | 所有应用共享一个仓库 |
| **代码共享** | 通过 npm 发布/安装，调试需 link | 直接 import 本地包，实时调试 |
| **版本管理** | 各仓库独立版本号 | 统一版本或 Changesets 管理 |
| **CI/CD** | 多套流水线，独立触发 | 一套流水线，增量构建 |
| **权限控制** | 天然隔离，仓库级权限 | 需 CODEOWNERS 文件控制 |
| **构建速度** | 各自独立，互不影响 | 需增量构建工具（Turborepo/Nx） |
| **团队自治** | 高（完全独立） | 中（需遵循统一规范） |
| **历史追溯** | 分散，需跨仓库追踪 | 集中，一次 commit 关联所有变更 |

### 1.2 选型建议

```text
团队规模 < 10 人，子应用 < 3 个 → Polyrepo 即可
团队规模 10-50 人，子应用 3-10 个 → Monorepo（pnpm + Turborepo）
团队规模 > 50 人，子应用 > 10 个 → Monorepo（Nx）+ 严格的 CODEOWNERS
```

### 1.3 Monorepo 推荐结构

```
my-project/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
│
├── apps/
│   ├── main-app/              # 主应用（基座）
│   ├── sub-app-order/         # 子应用 - 订单
│   └── sub-app-product/       # 子应用 - 商品
│
├── packages/
│   ├── shared-ui/             # 共享 UI 组件库
│   ├── shared-utils/          # 共享工具函数
│   ├── shared-types/          # 共享 TypeScript 类型
│   └── shared-store/          # 共享状态管理
│
└── configs/
    ├── eslint-config/         # 共享 ESLint 配置
    ├── tsconfig/              # 共享 TS 配置
    └── vite-config/           # 共享 Vite 配置
```

---

## 二、统一构建配置与微应用独立构建

### 2.1 统一构建配置

```javascript
// configs/vite-config/src/index.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export function createBaseConfig(options = {}) {
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: { '@': '/src' }
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    },
    build: {
      target: 'es2015',
      cssCodeSplit: false,
      ...options.build
    },
    ...options
  });
}
```

```javascript
// 子应用使用共享配置
// apps/sub-app-order/vite.config.js
import { createBaseConfig } from '@configs/vite-config';

export default createBaseConfig({
  build: {
    outDir: 'dist/order'
  },
  server: {
    port: 8082
  }
});
```

### 2.2 独立构建流程

```bash
# 各子应用独立构建
pnpm --filter @myproject/sub-app-order build
pnpm --filter @myproject/sub-app-product build

# 或使用 Turborepo 并行构建
turbo run build
```

### 2.3 构建产物管理

```text
子应用构建产物结构：
dist/
├── index.html
├── js/
│   ├── app.[hash].js
│   └── chunk-vendors.[hash].js
├── css/
│   └── app.[hash].css
└── assets/
    └── ...

部署后：
https://cdn.example.com/sub-app-order/
├── index.html
├── js/
├── css/
└── assets/

https://cdn.example.com/sub-app-product/
├── index.html
├── js/
├── css/
└── assets/
```

---

## 三、CI/CD 流水线设计

### 3.1 增量构建策略

```yaml
# .github/workflows/deploy.yml
name: Deploy Micro Apps

on:
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      apps: ${{ steps.changes.outputs.apps }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - id: changes
        run: |
          # 检测变更的子应用
          CHANGED=$(git diff --name-only HEAD~1 HEAD | grep '^apps/' | cut -d'/' -f2 | sort -u | jq -R -s -c 'split("\n")[:-1]')
          echo "apps=$CHANGED" >> $GITHUB_OUTPUT

  build-and-deploy:
    needs: detect-changes
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: ${{ fromJSON(needs.detect-changes.outputs.apps) }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install

      # 只构建变更的子应用
      - run: pnpm --filter @myproject/${{ matrix.app }} build

      # 部署到 CDN
      - uses: ./.github/actions/deploy-cdn
        with:
          path: apps/${{ matrix.app }}/dist
          target: ${{ matrix.app }}
```

### 3.2 集成测试

```yaml
# 集成测试在合并前执行
name: Integration Test

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install

      # 启动所有子应用
      - run: pnpm exec turbo run dev --filter=./apps/* &

      # 等待服务就绪
      - run: npx wait-on http://localhost:8080 http://localhost:8081 http://localhost:8082

      # 运行端到端测试
      - run: pnpm run test:e2e
```

### 3.3 发布策略

```text
微前端发布策略：
┌──────────────┐
│  主应用更新   │ → 影响所有子应用，需全量回归
├──────────────┤
│  子应用更新   │ → 仅影响自身，可独立上线
├──────────────┤
│  共享包更新   │ → 需通知所有消费方，协同升级
└──────────────┘

推荐流程：
1. 子应用独立发布 → 灰度验证 → 全量
2. 共享包发布 → 所有消费方 lock 文件更新 → 统一灰度
3. 主应用发布 → 沙箱环境验证 → 灰度 → 全量
```

---

## 四、本地开发代理与调试方案

### 4.1 开发环境代理配置

```javascript
// 主应用 vite.config.js
export default {
  server: {
    port: 8080,
    proxy: {
      // 代理到子应用开发服务器
      '/app-order': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/app-product': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      }
    }
  }
};
```

### 4.2 并行启动脚本

```bash
# 使用 concurrently 同时启动所有服务
pnpm add -w concurrently

# package.json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter @myproject/main-app dev\" \"pnpm --filter @myproject/sub-app-order dev\" \"pnpm --filter @myproject/sub-app-product dev\""
  }
}
```

### 4.3 调试技巧

```javascript
// 1. 调试子应用沙箱问题
// 在子应用中注入调试代码
if (window.__POWERED_BY_QIANKUN__) {
  console.log('运行在 qiankun 中');
  console.log('沙箱 window:', window);
  console.log('真实 window:', window.__ORIGINAL_WINDOW__);
}

// 2. 调试跨应用通信
// 拦截全局状态变化
if (props?.onGlobalStateChange) {
  props.onGlobalStateChange((state, prev) => {
    console.log('状态变化:', { prev, current: state, diff: diff(prev, state) });
  }, true);
}

// 3. 调试样式冲突
// 浏览器 DevTools 中检查元素样式来源
// 查看 data-qiankun 属性确定样式归属
```

### 4.4 本地联调最佳实践

```text
开发模式选择：

1. 全量联调（推荐日常开发）
   主应用 + 全部子应用本地启动
   适用：跨应用功能开发、集成调试

2. 按需联调（推荐独立开发）
   主应用 + 当前子应用本地启动，其余子应用使用线上/测试环境
   适用：单子应用功能开发

3. 纯线上联调（紧急排查）
   主应用本地 + 全部子应用使用线上环境
   适用：线上问题排查，快速复现

配置示例：
# .env.local
VITE_APP_ORDER_URL=http://localhost:8081     # 本地开发
VITE_APP_PRODUCT_URL=https://test.example.com # 使用测试环境
```

---

## 五、灰度发布与版本控制

### 5.1 灰度发布策略

```javascript
// 主应用层面实现灰度路由
function getSubAppEntry(appName) {
  const user = getCurrentUser();

  // 基于用户 ID 的灰度策略
  if (isGrayUser(user.id, appName)) {
    return `https://gray.example.com/${appName}/index.html`;  // 灰度版本
  }
  return `https://stable.example.com/${appName}/index.html`;  // 稳定版本
}

// 灰度判断
function isGrayUser(userId, appName) {
  // 方案1：哈希取模
  const hash = hashCode(userId + appName);
  return hash % 100 < 10;  // 10% 灰度

  // 方案2：白名单
  // return GRAY_LIST[appName]?.includes(userId);

  // 方案3：远程配置
  // return fetchGrayConfig(appName, userId);
}
```

### 5.2 版本管理策略

```javascript
// 子应用版本号管理
// 1. 语义化版本号
const appVersion = {
  major: 2,   // 不兼容的 API 修改
  minor: 3,   // 向下兼容的功能新增
  patch: 1    // 向下兼容的问题修复
};

// 2. 子应用部署时上报版本信息
registerMicroApps([
  {
    name: 'app-order',
    entry: `https://cdn.example.com/app-order/${appVersion}/index.html`,
    // 或使用 query 参数
    // entry: `https://cdn.example.com/app-order/index.html?v=${version}`,
  }
]);

// 3. 版本回滚
// 将 Nginx/网关 指向上一版本的构建产物目录
// 或修改配置中心的子应用入口 URL
```

### 5.3 灰度发布流程

```text
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ 构建产物 │ → │ 灰度环境 │ → │ 5% 用户  │ → │ 50% 用户 │ → │ 全量 │
│  (& 测试) │    │ 验证    │    │ 观察    │    │ 观察    │    │      │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
    5min          10min         30min          1hour          2hour

每个阶段监控指标：
- JS 错误率
- 接口成功率
- 页面加载时间（LCP/FCP）
- 用户投诉量
```

### 5.4 蓝绿部署

```text
┌──────────────┐     ┌──────────────┐
│   Blue（当前） │     │  Green（新版） │
│  v1.2.0      │     │  v1.3.0      │
│  CDN A       │     │  CDN B       │
└──────────────┘     └──────────────┘

发布流程：
1. 部署 Green 环境
2. 验证 Green 环境正常
3. 切换入口配置指向 Green（秒级切换）
4. 观察 Green 运行稳定
5. 下线 Blue 环境（或保留作为回滚备用）
```

---

## 六、统一代码规范

### 6.1 共享 ESLint 配置

```javascript
// configs/eslint-config/index.js
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    // 微前端特有规则
    'no-restricted-globals': ['error', {
      name: 'window',
      message: '在微前端子应用中，请避免直接污染全局 window 对象'
    }]
  }
};
```

### 6.2 共享 Git Hooks

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix"]
  }
}
```

### 6.3 提交规范

```text
git commit 格式：
<type>(<scope>): <subject>

type:
- feat:     新功能
- fix:      修复 Bug
- refactor: 重构
- style:    样式调整
- chore:    构建/工具链变更

scope: 子应用名（如 order, product, main）

示例：
feat(order): 新增订单列表页
fix(product): 修复商品详情页图片加载异常
chore(main): 升级 qiankun 到 2.10.0
```