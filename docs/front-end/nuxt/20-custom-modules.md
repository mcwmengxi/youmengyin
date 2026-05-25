# 自定义模块开发

> 本章讲解如何开发自己的 Nuxt 模块，封装可复用的功能。

## 一、模块开发基础

### 1.1 模块的本质

Nuxt 模块是一个函数，在 Nuxt 启动时被调用，可以：

- 添加或修改 `nuxt.config` 配置
- 注册 composables、插件、组件
- 修改 Vite / webpack 配置
- 注册 Nitro 服务端钩子

```ts
// 最简单的模块
export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule', // nuxt.config 中的配置 key
  },
  setup(options, nuxt) {
    // 模块逻辑
    console.log('My module loaded!')
  },
})
```

---

## 二、本地模块开发

### 2.1 创建本地模块

```
modules/
└── my-module/
    ├── index.ts       # 模块入口
    └── runtime/
        ├── plugin.ts  # 运行时插件
        └── composables/
            └── useMyModule.ts
```

```ts
// modules/my-module/index.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  enabled?: boolean
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    enabled: true,
    prefix: '$',
  },
  setup(options, nuxt) {
    // 创建路径解析器
    const { resolve } = createResolver(import.meta.url)

    // 注册运行时插件
    addPlugin(resolve('./runtime/plugin'))

    // 注册 composable
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve('./runtime/composables'))
    })
  },
})
```

### 2.2 在 nuxt.config 中注册

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '~/modules/my-module', // 本地模块路径
  ],
  myModule: {
    enabled: true,
    prefix: '$',
  },
})
```

---

## 三、使用 @nuxt/kit 核心 API

### 3.1 注册插件与 Composable

```ts
import {
  defineNuxtModule,
  addPlugin,
  addImportsDir,
  createResolver,
} from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // 方式 1：注册插件
    addPlugin(resolve('./runtime/plugin'))

    // 方式 2：直接注册 composable 目录（自动导入）
    addImportsDir(resolve('./runtime/composables'))

    // 方式 3：添加组件目录（自动导入组件）
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolve('./runtime/components'),
        prefix: 'My',
      })
    })
  },
})
```

### 3.2 添加自定义模板

```ts
import { addTemplate } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options) {
    // 添加类型声明
    addTemplate({
      filename: 'my-module.d.ts',
      getContents: () => `
declare module '#my-module' {
  export const version: string
  export const config: {
    enabled: boolean
    prefix: string
  }
}
      `,
    })

    // 让 TypeScript 识别虚拟模块
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolve(nuxt.options.buildDir, 'my-module.d.ts'),
      })
    })
  },
})
```

### 3.3 修改 Vite 配置

```ts
export default defineNuxtModule({
  setup(options, nuxt) {
    // 修改 Vite 配置
    nuxt.hook('vite:extendConfig', (viteConfig) => {
      viteConfig.css = viteConfig.css || {}
      viteConfig.css.preprocessorOptions = {
        scss: {
          additionalData: '@use "~/assets/styles/variables" as *;',
        },
      }
    })

    // 修改 Nitro 配置
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.experimental = nitroConfig.experimental || {}
      nitroConfig.experimental.wasm = true
    })
  },
})
```

### 3.4 添加 Nuxt 页面

```ts
import { addRouteMiddleware, extendPages } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options) {
    // 添加页面
    extendPages((pages) => {
      pages.push({
        name: 'my-module-dashboard',
        path: '/my-module',
        file: resolve(runtimeDir, 'pages/dashboard.vue'),
      })
    })

    // 添加中间件
    addRouteMiddleware({
      name: 'my-module-auth',
      path: resolve(runtimeDir, 'middleware/auth'),
      global: true,
    })
  },
})
```

---

## 四、发布模块示例

### 4.1 完整的模块结构

```
my-nuxt-module/
├── package.json
├── src/
│   ├── module.ts        # 模块入口
│   └── runtime/
│       ├── composables/
│       │   └── useFeature.ts
│       └── plugin.ts
├── dist/                # 构建输出
└── tsconfig.json
```

```json
// package.json
{
  "name": "@my/nuxt-module",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/module.cjs",
  "module": "./dist/module.mjs",
  "types": "./dist/module.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "import": "./dist/module.mjs",
      "require": "./dist/module.cjs"
    }
  }
}
```

### 4.2 模块示例：全局消息通知

```ts
// src/module.ts
import {
  defineNuxtModule,
  addPlugin,
  addImports,
  createResolver,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-toast',
    configKey: 'toast',
  },
  defaults: {
    duration: 3000,
    position: 'top-right',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    // 注册插件
    addPlugin({
      src: resolve(runtimeDir, 'plugin'),
      mode: 'client', // 仅客户端
    })

    // 注册 composable
    addImports({
      name: 'useToast',
      from: resolve(runtimeDir, 'composables/useToast'),
    })
  },
})
```

```ts
// src/runtime/composables/useToast.ts
import { ref } from 'vue'

export const toasts = ref<Array<{ id: number; message: string; type: string }>>(
  []
)
let id = 0

export function useToast() {
  function show(message: string, type = 'info') {
    const toastId = ++id
    toasts.value.push({ id: toastId, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId)
    }, 3000)
  }

  return {
    toasts,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    info: (msg: string) => show(msg, 'info'),
  }
}
```

```vue
<!-- src/runtime/plugin.ts -->
<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['toast', `toast-${t.type}`]"
        >
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
```

### 4.3 使用示例

```bash
npm install @my/nuxt-module
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@my/nuxt-module'],
  toast: {
    duration: 5000,
    position: 'bottom-center',
  },
})
```

```vue
<script setup>
const toast = useToast()
toast.success('操作成功！')
toast.error('操作失败！')
</script>
```

---

## 五、模块生命周期钩子

### 5.1 常用钩子

```ts
export default defineNuxtModule({
  setup(options, nuxt) {
    // 配置加载前
    nuxt.hook('modules:done', () => {
      // 所有模块加载完成
    })

    // 页面扩展
    nuxt.hook('pages:extend', (pages) => {
      // 修改路由页面
    })

    // 构建前
    nuxt.hook('build:before', () => {})

    // 构建完成
    nuxt.hook('build:done', () => {})

    // Nitro 初始化
    nuxt.hook('nitro:init', (nitro) => {})

    // Nitro 构建前
    nuxt.hook('nitro:build:before', (nitro) => {})

    // Vite 配置扩展
    nuxt.hook('vite:extendConfig', (config, { isClient, isServer }) => {
      // 分别处理客户端/服务端配置
    })
  },
})
```

### 5.2 钩子使用原则

- **尽量使用 @nuxt/kit 提供的高层 API**（如 `addPlugin`, `addImports`），而不是直接操作钩子
- **仅在高层 API 无法满足时才使用钩子**
- **注意客户端/服务端的区分**，避免服务端模块引入客户端代码

```ts
// ✅ 优先使用高层 API
addPlugin(resolve('./plugin'))

// ❌ 只有在特殊需要时才直接操作钩子
nuxt.hook('app:resolve', (app) => {
  /* ... */
})
```
