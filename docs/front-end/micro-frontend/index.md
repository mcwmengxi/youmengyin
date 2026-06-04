# 微前端技术知识库

## 文档索引

### 基础篇

| 文档                                           | 说明                                        |
| ---------------------------------------------- | ------------------------------------------- |
| [概述与核心价值](./overview.md)                | 微前端概念、特性、适用场景与核心价值        |
| [Web Components 前置知识](./web-components.md) | Custom Elements、Shadow DOM、HTML Templates |
| [Monorepo 架构](./monorepo.md)                 | Monorepo 概念、工具链与微前端协同           |

### 方案篇

| 文档                                              | 说明                                                   |
| ------------------------------------------------- | ------------------------------------------------------ |
| [方案对比与选型](./comparison.md)                 | 多维度对比分析与选型建议（含 single-spa、Garfish）     |
| [iframe 方案](./iframe-solution.md)               | 传统 iframe 微前端方案的优劣与适用场景                 |
| [single-spa 方案](./single-spa-solution.md)       | 微前端先驱框架，极简路由调度器                         |
| [qiankun 方案](./qiankun-solution.md)             | 基于 single-spa 的经典微前端方案，阿里出品             |
| [micro-app 方案](./micro-app-solution.md)         | 基于 Web Components + qiankun sandbox 的方案，京东出品 |
| [EMP 方案 (Module Federation)](./emp-solution.md) | 基于 Webpack 5 Module Federation 的方案，百度出品      |
| [无界微前端方案](./wujie-solution.md)             | 基于 iframe + Shadow DOM 的下一代方案，腾讯出品        |

### 架构设计篇

| 文档                                     | 说明                                                       |
| ---------------------------------------- | ---------------------------------------------------------- |
| [架构设计要点](./architecture-design.md) | 生命周期管理、路由劫持、跨应用通信、公共依赖管理、样式隔离 |
| [沙箱机制详解](./sandbox-mechanism.md)   | JS 沙箱（Snapshot/Legacy/Proxy）+ CSS 沙箱实现原理         |

### 工程化篇

| 文档                                            | 说明                                                           |
| ----------------------------------------------- | -------------------------------------------------------------- |
| [工程化实践](./engineering-practice.md)         | 仓库策略、CI/CD 流水线、本地开发调试、灰度发布、代码规范       |
| [性能优化与安全](./performance-and-security.md) | 预加载、缓存、懒加载、公共依赖提取、样式/JS 污染防护、安全沙箱 |

---

## 阅读路线

### 新手入门

1. [概述与核心价值](./overview.md) — 理解什么是微前端、为什么需要微前端
2. [方案对比与选型](./comparison.md) — 快速了解各方案差异，选择适合的方案
3. 按需深入具体方案文档

### 架构设计

1. [概述与核心价值](./overview.md) — 明确微前端适用的业务场景
2. [方案对比与选型](./comparison.md) — 根据团队与技术栈做选型决策
3. [架构设计要点](./architecture-design.md) — 深入生命周期、路由、通信、依赖管理等核心设计
4. [Monorepo 架构](./monorepo.md) — 规划仓库结构与工程化体系
5. 选定方案后深入对应方案文档

### 原理深入

1. [沙箱机制详解](./sandbox-mechanism.md) — 理解 JS 和 CSS 隔离的实现原理
2. [Web Components 前置知识](./web-components.md) — 掌握底层 Web 标准
3. 各方案文档中的「底层原理」章节

### 工程落地

1. [工程化实践](./engineering-practice.md) — CI/CD、本地开发、灰度发布、代码规范
2. [性能优化与安全](./performance-and-security.md) — 预加载、缓存、安全防护、错误隔离
3. [架构设计要点](./architecture-design.md) — 样式隔离、公共依赖管理方案落地
