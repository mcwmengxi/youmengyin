# Vite 构建工具

## 什么是 Vite？

Vite 是新一代前端构建工具，由 Vue 作者 Evan You 开发。它利用浏览器原生 ES Module 支持，实现了极速的开发服务器启动和热更新（HMR）。

### 核心特性

1. **极速冷启动**：不需要打包，直接使用浏览器原生 ESM
2. **热模块替换（HMR）**：修改代码后近乎即时更新
3. **预构建依赖**：使用 esbuild 预构建，速度快
4. **生产环境打包**：使用 Rollup 打包
5. **开箱即用**：支持 TypeScript、JSX、CSS、PostCSS 等
6. **插件系统**：兼容 Rollup 插件

### 创建 React + Vite 项目

```sh
npm create vite@latest my-app -- --template react-ts
```

### 配置 vite.config.ts

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 路径别名
    },
  },
  server: {
    port: 3000,        // 开发服务器端口
    open: true,        // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',    // 输出目录
    sourcemap: false,   // 是否生成 sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // 代码分割
        },
      },
    },
  },
})
```

### 常用插件

| 插件 | 用途 |
|------|------|
| `@vitejs/plugin-react` | React Fast Refresh + JSX |
| `@vitejs/plugin-react-swc` | 使用 SWC 替代 Babel（更快） |
| `vite-plugin-compression` | 构建时 gzip 压缩 |
| `vite-plugin-pwa` | PWA 支持 |

### Vite vs Webpack

| 对比 | Vite | Webpack |
|------|------|---------|
| 冷启动 | 极快（ESM） | 慢（需打包） |
| HMR | 极快 | 随项目增大变慢 |
| 生态 | 快速成长 | 最成熟 |
| 配置复杂度 | 低 | 高 |
| 打包器 | Rollup | Webpack 5 |

### 环境变量

```
.env                # 所有环境
.env.local          # 本地环境（被 git 忽略）
.env.development    # 开发环境
.env.production     # 生产环境
```

```ts
// 使用环境变量
console.log(import.meta.env.VITE_API_URL)
// VITE_ 前缀的变量会被暴露给客户端
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Vite 兼容 | 完全兼容 | 完全兼容 |
| `@vitejs/plugin-react` | 支持 React 18 Fast Refresh | 支持 React 19 Fast Refresh |

> Vite 对 React 18 和 19 都有良好支持，升级 React 19 不涉及 Vite 配置变更。