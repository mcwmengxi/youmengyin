# EMP 方案（Webpack 5 Module Federation）

## 一、方案概述

Module Federation（模块联邦）是 Webpack 5 引入的新特性，EMP 方案（由百度开源）基于此构建微前端架构。其核心理念与 qiankun/micro-app 根本不同 — 它不是加载整个子应用，而是让不同构建之间**共享模块**，实现去中心化的模块级编排。

- **EMP 仓库地址**：https://github.com/efoxTeam/emp
- **底层依赖**：Webpack 5 Module Federation 原生能力

## 二、核心思想对比

```text
qiankun / micro-app 模式：
  主应用加载 → 子应用整体运行 → 主应用控制生命周期
  类似于：容器编排，主应用"调度"子应用

Module Federation 模式：
  A 应用暴露模块 → B 应用远程消费 → 对等关系
  类似于：模块共享，应用间"互相引用"模块
```

## 三、快速上手

### 3.1 远程应用（暴露模块）

```javascript
// 应用 A（remote） webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app_a',           // 应用标识（全局唯一）
      filename: 'remoteEntry.js', // 远程入口文件
      exposes: {
        // 暴露组件/模块给其他应用使用
        './Button': './src/components/Button.vue',
        './utils': './src/utils/index.js',
        './store': './src/store/index.js',
      },
      shared: {
        // 共享依赖（避免重复加载）
        vue: { singleton: true, eager: true },
        'vue-router': { singleton: true },
      },
    }),
  ],
};
```

### 3.2 宿主应用（消费模块）

```javascript
// 应用 B（host）webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app_b',
      remotes: {
        // 声明远程应用
        app_a: 'app_a@http://localhost:8081/remoteEntry.js',
      },
      shared: {
        vue: { singleton: true, eager: true },
      },
    }),
  ],
};
```

### 3.3 使用远程模块

```javascript
// 应用 B 中直接 import 远程模块，就像使用本地模块一样
import Button from 'app_a/Button';
import { formatDate } from 'app_a/utils';

// Vue 组件中使用
<template>
  <div>
    <h1>应用B</h1>
    <Button @click="handleClick">来自应用A的按钮</Button>
  </div>
</template>
```

## 四、核心概念

### 4.1 角色定义

| 角色 | 说明 |
|------|------|
| **Host**（宿主） | 消费远程模块的应用 |
| **Remote**（远程） | 暴露模块供其他应用使用的应用 |
| **Bidirectional**（双向） | 既是 Host 也是 Remote |

### 4.2 共享依赖（Shared）

```javascript
shared: {
  vue: {
    singleton: true,  // 全局只允许一个 Vue 实例
    eager: false,     // 不立即加载，按需异步加载
    requiredVersion: '^3.2.0'  // 版本约束
  },
  lodash: {
    singleton: false, // 允许各自版本
  }
}
```

模块联邦的共享依赖机制能自动去重，确保运行时只有一份 Vue/React 实例，避免多个框架实例共存导致的错误。

### 4.3 版本协商

当 Host 和 Remote 的 shared 依赖版本不一致时，Webpack 会自动处理：

```text
Host: vue@3.2.0  (requiredVersion: ^3.0.0)
Remote: vue@3.3.0 (requiredVersion: ^3.2.0)

协商结果：
- 若版本兼容 → 使用较高版本（3.3.0）
- 若版本不兼容 → 加载两份（警告 singleton 冲突）
- 若无版本声明 → 各自使用自己的版本
```

## 五、EMP 的增强

EMP 在 Webpack 5 Module Federation 基础上提供了额外能力：

```javascript
// EMP 配置
const { defineConfig } = require('@efox/emp-cli');

module.exports = defineConfig({
  moduleFederation: {
    name: 'app_a',
    exposes: { './Component': './src/Component' },
    shared: { vue: { singleton: true } },
    // EMP 增强功能
    shareLib: { react: 'React', 'react-dom': 'ReactDOM' },
  },
  // EMP 开发服务器增强
  server: { port: 8081 },
  // 跨应用调试
  debug: { clearLog: false, showLog: true },
});
```

## 六、适用场景

### 适合场景

- **微组件共享**：一个团队的组件库被多个团队的项目直接使用（运行时共享，非 npm 发布）
- **Shell + Widgets 架构**：主应用提供框架，子应用作为 Widget 嵌入
- **技术栈统一团队**：所有应用使用同一框架（如都是 React），模块联邦共享更高效
- **需要极致构建速度**：各应用独立构建，互不阻塞，发布粒度细

### 不适合场景

- 多技术栈混合（Vue + React + Angular 共存）— 共享依赖很难协调
- 需要严格 JS/CSS 隔离 — MF 没有沙箱
- 老旧项目（非 Webpack 5）— 迁移成本高

## 七、优劣势总结

| 优势 | 劣势 |
|------|------|
| 去中心化，应用间对等关系 | 强依赖 Webpack 5 |
| 模块级别共享，粒度最细 | 无 JS/CSS 沙箱，依赖团队规范 |
| 共享依赖自动去重 | 多技术栈共享难以协调 |
| TypeScript 远程类型支持 | 学习曲线陡峭 |
| 构建独立，并行效率高 | 路由可能冲突，需自行解决 |
| 性能好，无沙箱开销 | 生态相对小众 |

## 八、与 qiankun 的关键差异

| 维度 | qiankun | Module Federation |
|------|---------|-------------------|
| 架构模式 | 主-从（中心化） | 对等（去中心化） |
| 加载粒度 | 整个子应用 | 单个模块/组件 |
| 隔离方式 | 框架沙箱 | 无（靠约定） |
| 路由管理 | 主应用统一管理 | 各自管理，易冲突 |
| 共享依赖 | 各自打包 | 运行时共享去重 |
| 构建工具 | 不限 | 必须 Webpack 5 |