# Monorepo 架构与微前端协同

## 一、什么是 Monorepo

Monorepo（单一代码仓库）是一种项目管理策略，将多个相关但独立的项目（包/微应用/库）存储在同一个 Git 仓库中，通过统一的工具链进行管理。

```text
Polyrepo（多仓库）                    Monorepo（单仓库）
                          vs
┌──────────┐                         ┌──────────────────────────┐
│ repo-A   │                         │  /packages               │
│ (子应用A) │                         │  ├── app-a/   子应用A     │
└──────────┘                         │  ├── app-b/   子应用B     │
┌──────────┐                         │  ├── shared/  共享组件库  │
│ repo-B   │                         │  ├── utils/   工具库     │
│ (子应用B) │                         │  ├── styles/  样式库     │
└──────────┘                         │  └── config/  共享配置    │
┌──────────┐                         └──────────────────────────┘
│ shared   │
│ (共享库)  │
└──────────┘
```

## 二、Monorepo 核心优势

### 2.1 与微前端的天然契合

| 痛点 | Polyrepo 问题 | Monorepo 解法 |
|------|-------------|-------------|
| 代码共享 | 跨仓库共享靠 npm 发包，调试困难 | 直接 import 本地包，实时调试 |
| 版本管理 | 各仓库版本不一致，组合测试困难 | 统一版本，一次 commit 覆盖所有 |
| 规范统一 | 各仓库 ESLint/TS 配置分散 | 共享配置，一键应用到所有包 |
| CI/CD | 多套流水线，维护成本高 | 一套流水线，按变更范围增量构建 |
| 重构 | 跨仓库重构需要多次 PR | 一次 PR 完成所有修改 |

### 2.2 典型微前端 Monorepo 结构

```
my-project/
├── pnpm-workspace.yaml          # 工作空间配置
├── package.json                 # 根 package.json
├── turbo.json                   # Turborepo 配置（可选）
├── tsconfig.base.json           # 共享 TS 配置
├── .eslintrc.js                 # 共享 ESLint 配置
│
├── apps/                        # 应用目录
│   ├── shell/                   # 主应用（基座）
│   │   ├── package.json
│   │   └── src/
│   ├── app-order/               # 子应用 - 订单
│   │   ├── package.json
│   │   └── src/
│   └── app-product/             # 子应用 - 商品
│       ├── package.json
│       └── src/
│
├── packages/                    # 共享包目录
│   ├── shared-ui/               # 共享 UI 组件
│   ├── shared-utils/            # 共享工具函数
│   ├── shared-types/            # 共享类型定义
│   └── shared-store/            # 共享状态
│
└── configs/                     # 配置文件
    ├── eslint-config/
    ├── tsconfig/
    └── vite-config/
```

## 三、主流工具

### 3.1 pnpm workspace

pnpm 是目前最推荐的 Monorepo 包管理器，其 workspace 协议原生支持本地包引用。

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'configs/*'
```

```json
// apps/shell/package.json
{
  "name": "@myproject/shell",
  "dependencies": {
    "@myproject/shared-ui": "workspace:*",   // 本地包引用
    "@myproject/shared-utils": "workspace:*"
  }
}
```

```bash
# 常用命令
pnpm install                    # 安装所有依赖
pnpm -r run build               # 递归执行所有包的 build
pnpm --filter @myproject/shell add lodash  # 只给 shell 装依赖
pnpm --filter @myproject/shell dev          # 只启动 shell 的开发服务器
```

### 3.2 Turborepo

Turborepo 是 Vercel 开源的高性能构建编排工具，擅长并行执行和缓存。

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],    // 先构建依赖包
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,             // dev 不缓存
      "persistent": true          // 常驻进程
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

```bash
turbo run build    # 并行构建所有包 + 缓存
turbo run dev      # 并行启动所有开发服务器
turbo run lint --filter=@myproject/shell  # 只 lint shell
```

### 3.3 Nx

Nx 是另一款流行的 Monorepo 工具，提供更强的依赖图分析和受影响项目检测。

```bash
nx build shell          # 构建 shell（自动构建其依赖）
nx affected:build       # 只构建受当前变更影响的项目（CI 利器）
nx graph                # 可视化项目依赖图
```

### 3.4 工具对比

| 特性 | pnpm workspace | Turborepo | Nx |
|------|---------------|-----------|-----|
| 定位 | 包管理 | 任务编排 | 全功能平台 |
| 缓存 | 无 | 本地 + 远程 | 本地 + 远程 |
| 增量构建 | 无 | 支持 | 支持（更强大） |
| 插件生态 | 弱 | 中 | 强（插件市场） |
| 学习曲线 | 低 | 低 | 中高 |
| 适合场景 | 简单 Monorepo | 中型 Monorepo | 大型企业级 |

## 四、Monorepo 与微前端框架搭配

### 4.1 通用模式

```text
Monorepo 解决：代码组织、依赖管理、构建编排
微前端框架解决：运行时集成、沙箱隔离、通信协调

两者正交互补，不冲突
```

### 4.2 各框架下的推荐结构

**qiankun / micro-app / 无界**：

```
apps/
├── shell/       # 主应用（基座）
├── sub-app-a/   # 子应用A（独立 Vite/Webpack 项目）
└── sub-app-b/   # 子应用B（独立 Vite/Webpack 项目）
packages/
├── shared-ui/   # 共享组件
└── shared-utils/
```

每个子应用都有自己的 `vite.config.js` / `webpack.config.js`，构建完全独立。`shared-*` 包通过 `workspace:*` 被各子应用引用，构建时内联打包。

**EMP / Module Federation**：

```
apps/
├── shell/       # Host + Remote
├── remote-a/    # Remote
└── remote-b/    # Remote
packages/
├── shared-ui/   # 共享组件（MF 暴露）
└── shared-types/ # 共享类型
```

Module Federation 本身就能共享模块，Monorepo 内的 `shared-*` 包既可以作为本地依赖打包，也可以通过 MF 运行时共享。

## 五、版本管理与发布

### 5.1 Changesets

```bash
# 安装
pnpm add -w @changesets/cli

# 初始化
pnpm changeset init

# 提交时记录变更
pnpm changeset add

# 生成版本和 changelog
pnpm changeset version

# 发布
pnpm changeset publish
```

### 5.2 微前端的版本策略

```text
微前端项目的版本策略建议：

1. 主应用：保守更新，充分回归测试
2. 独立子应用：各自独立版本，互不影响
3. 共享包（shared-*）：
   - 大版本更新需通知所有消费方
   - 小版本和补丁向后兼容
   - 使用 changeset 管理 changelog
```

## 六、常见坑与最佳实践

### 6.1 幽灵依赖

```bash
# pnpm 默认严格，未声明的依赖无法使用
# 如果迁移过来有"幽灵依赖"问题，配置提升
# .npmrc
shamefully-hoist=true  # 不推荐，尽量显式声明依赖
```

### 6.2 循环依赖

Monorepo 内各包可能存在循环依赖，Turborepo/Nx 能在构建时检测：

```bash
turbo run build --graph   # 查看依赖图，确保无循环
```

### 6.3 CI/CD 优化

```yaml
# GitHub Actions 示例 - 只构建变更的子应用
- uses: nrwl/nx-set-shas@v3
- run: pnpm exec nx affected --target=build --base=$NX_BASE --head=$NX_HEAD
```

### 6.4 分支策略

- **主干开发**：所有子应用开发在主分支，通过特性开关控制发布
- **独立分支**：每个子应用维护独立发布分支（不推荐，失去 Monorepo 优势）

## 七、总结

Monorepo 不是微前端的必要条件，但两者结合使用能显著提升开发效率和代码共享体验。对于中大型微前端项目，强烈建议采用 pnpm workspace + Turborepo 的组合方案。</think>

<｜DSML｜tool_calls>
<｜DSML｜invoke name="Write">
<｜DSML｜parameter name="content" string="true"># Monorepo 架构与微前端协同

## 一、什么是 Monorepo

Monorepo（单一代码仓库）是一种项目管理策略，将多个相关但独立的项目（包/微应用/库）存储在同一个 Git 仓库中，通过统一的工具链进行管理。

```text
Polyrepo（多仓库）                    Monorepo（单仓库）
                          vs
┌──────────┐                         ┌──────────────────────────┐
│ repo-A   │                         │  /packages               │
│ (子应用A) │                         │  ├── app-a/   子应用A     │
└──────────┘                         │  ├── app-b/   子应用B     │
┌──────────┐                         │  ├── shared/  共享组件库  │
│ repo-B   │                         │  ├── utils/   工具库     │
│ (子应用B) │                         │  ├── styles/  样式库     │
└──────────┘                         │  └── config/  共享配置    │
┌──────────┐                         └──────────────────────────┘
│ shared   │
│ (共享库)  │
└──────────┘
```

## 二、Monorepo 核心优势

### 2.1 与微前端的天然契合

| 痛点 | Polyrepo 问题 | Monorepo 解法 |
|------|-------------|-------------|
| 代码共享 | 跨仓库共享靠 npm 发包，调试困难 | 直接 import 本地包，实时调试 |
| 版本管理 | 各仓库版本不一致，组合测试困难 | 统一版本，一次 commit 覆盖所有 |
| 规范统一 | 各仓库 ESLint/TS 配置分散 | 共享配置，一键应用到所有包 |
| CI/CD | 多套流水线，维护成本高 | 一套流水线，按变更范围增量构建 |
| 重构 | 跨仓库重构需要多次 PR | 一次 PR 完成所有修改 |

### 2.2 典型微前端 Monorepo 结构

```
my-project/
├── pnpm-workspace.yaml
├── package.json
├── turbo.json
├── tsconfig.base.json
├── .eslintrc.js
│
├── apps/                    # 应用目录
│   ├── shell/               # 主应用（基座）
│   ├── app-order/           # 子应用 - 订单
│   └── app-product/         # 子应用 - 商品
│
├── packages/                # 共享包目录
│   ├── shared-ui/           # 共享 UI 组件
│   ├── shared-utils/        # 共享工具函数
│   ├── shared-types/        # 共享类型定义
│   └── shared-store/        # 共享状态
│
└── configs/                 # 配置文件
    ├── eslint-config/
    ├── tsconfig/
    └── vite-config/
```

## 三、主流工具

### 3.1 pnpm workspace

pnpm 是目前最推荐的 Monorepo 包管理器，workspace 协议原生支持本地包引用。

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'configs/*'
```

```json
// apps/shell/package.json
{
  "name": "@myproject/shell",
  "dependencies": {
    "@myproject/shared-ui": "workspace:*",
    "@myproject/shared-utils": "workspace:*"
  }
}
```

```bash
pnpm install                        # 安装所有依赖
pnpm -r run build                   # 递归构建所有包
pnpm --filter @myproject/shell add lodash   # 单包添加依赖
pnpm --filter @myproject/shell dev          # 单包启动
```

### 3.2 Turborepo

高性能构建编排工具，擅长并行执行和缓存。

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],     // 先构建依赖包
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

```bash
turbo run build        # 并行构建 + 缓存
turbo run dev          # 并行启动所有开发服务器
```

### 3.3 Nx

提供更强的依赖图分析和受影响项目检测能力。

```bash
nx build shell              # 构建 shell（自动构建依赖）
nx affected:build           # 只构建受变更影响的项目
nx graph                    # 可视化依赖图
```

### 3.4 工具对比

| 特性 | pnpm workspace | Turborepo | Nx |
|------|---------------|-----------|-----|
| 定位 | 包管理 | 任务编排 | 全功能平台 |
| 缓存机制 | 无 | 本地 + 远程 | 本地 + 远程 |
| 增量构建 | 无 | 支持 | 支持（更强大） |
| 学习曲线 | 低 | 低 | 中高 |
| 适合场景 | 简单仓库 | 中型仓库 | 大型企业级 |

## 四、与微前端框架搭配

Monorepo 与微前端框架是正交互补的关系：

- **Monorepo** 解决：代码组织、依赖管理、构建编排
- **微前端框架** 解决：运行时集成、沙箱隔离、通信协调

### 各框架下的推荐结构

**qiankun / micro-app / 无界**：

```
apps/
├── shell/       # 主应用（独立 Vite/Webpack 项目）
├── sub-app-a/   # 子应用A
└── sub-app-b/   # 子应用B
packages/
├── shared-ui/
└── shared-utils/
```

每个子应用构建完全独立，`shared-*` 包通过 `workspace:*` 引用，构建时内联打包。

**EMP / Module Federation**：

Module Federation 本身具备模块共享能力，Monorepo 内的 `shared-*` 包既可作为本地依赖打包，也可通过 MF 运行时共享，两者天然互补。

## 五、版本管理与发布

### Changesets

```bash
pnpm add -w @changesets/cli
pnpm changeset init       # 初始化
pnpm changeset add        # 记录变更
pnpm changeset version    # 生成版本和 changelog
pnpm changeset publish    # 发布
```

### 版本策略建议

1. 主应用：保守更新，充分回归
2. 独立子应用：各自独立版本号
3. 共享包（shared-*）：大版本需通知消费方，小版本和补丁向后兼容

## 六、最佳实践与常见坑

### 6.1 幽灵依赖

pnpm 默认严格模式，未声明的依赖无法访问。从其他包管理器迁移时，需显式声明所有依赖。

```bash
# 不推荐，但迁移过渡期可用
# .npmrc
shamefully-hoist=true
```

### 6.2 循环依赖

Turborepo/Nx 可在构建时检测循环依赖：

```bash
turbo run build --graph
```

### 6.3 CI 增量构建

```yaml
# 只构建受影响的子应用
- uses: nrwl/nx-set-shas@v3
- run: pnpm exec nx affected --target=build --base=$NX_BASE --head=$NX_HEAD
```

### 6.4 分支策略

- 推荐主干开发，所有子应用开发在主分支，通过特性开关控制发布
- 不推荐为每个子应用维护独立发布分支（失去 Monorepo 优势）

## 七、总结

Monorepo 不是微前端的必要条件，但两者结合能显著提升开发效率和代码共享体验。对于中大型微前端项目，强烈建议采用 **pnpm workspace + Turborepo** 的组合方案。