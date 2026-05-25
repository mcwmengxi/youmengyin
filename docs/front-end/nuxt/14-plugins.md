# 插件系统

> 本章介绍 Nuxt 插件系统的核心概念，包括插件的创建、注册及生命周期。

## 一、插件概述

### 1.1 什么是 Nuxt 插件？

Nuxt 插件是在应用初始化阶段执行的代码，用于：

- 注册全局组件、指令
- 注入全局辅助函数（通过 `provide`）
- 初始化第三方库（图表、编辑器、分析工具等）
- 设置全局错误处理、请求拦截等

### 1.2 插件运行时机

插件在 Vue 应用挂载**之前**执行，分为服务端和客户端两种执行环境。

```
应用启动 → 插件注册（服务端 + 客户端） → app.vue 渲染 → 页面路由
```

---

## 二、插件创建与注册

### 2.1 基础插件

```ts
// plugins/my-plugin.ts
export default defineNuxtPlugin(() => {
  // 插件逻辑
  console.log('插件已注册')
})
```

`plugins/` 目录下的所有文件自动注册为插件，无需手动引入。

### 2.2 注入全局方法

```ts
// plugins/hello.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (name: string) => `你好，${name}！`,
    },
  }
})
```

在任意组件中使用：

```vue
<script setup>
const { $hello } = useNuxtApp()
console.log($hello('世界')) // "你好，世界！"
</script>
```

### 2.3 获取 Nuxt 上下文

```ts
// plugins/context.ts
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp 提供了完整的 Nuxt 上下文
  console.log(nuxtApp.vueApp) // Vue 应用实例
  console.log(nuxtApp.$router) // Vue Router 实例
  console.log(nuxtApp.$pinia) // Pinia 实例（如已安装）
  console.log(nuxtApp.ssrContext) // SSR 上下文（仅服务端）
})
```

### 2.4 使用 Composables 和生命周期钩子

```ts
// plugins/init-auth.ts
export default defineNuxtPlugin(async () => {
  // 在插件中可以使用 useCookie、useState 等
  const token = useCookie('token')
  const user = useState('user')

  if (token.value) {
    // 恢复用户信息
    user.value = await $fetch('/api/user/me', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
  }
})
```

---

## 三、执行控制

### 3.1 客户端专属插件 `.client.ts`

```ts
// plugins/analytics.client.ts
// 仅在浏览器中执行，SSR 时跳过
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // 初始化百度统计、Google Analytics 等
    window._hmt = window._hmt || []
    const hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?xxx'
    document.head.appendChild(hm)
  }
})
```

### 3.2 服务端专属插件 `.server.ts`

```ts
// plugins/db-init.server.ts
// 仅在服务端执行
export default defineNuxtPlugin(() => {
  // 初始化数据库连接池
  const db = initializeDatabase()
  console.log('数据库连接已建立')
})
```

### 3.3 并行 vs 串行插件

```ts
// 默认：并行执行（与其他插件同时加载）
export default defineNuxtPlugin(() => {
  // 不依赖其他插件的初始化
})

// 串行：需要等特定插件先加载
export default defineNuxtPlugin({
  name: 'my-plugin',
  parallel: false, // 串行执行
  dependsOn: ['auth-plugin'], // 依赖 auth-plugin 先执行

  setup(nuxtApp) {
    // 这里可以安全使用 auth 插件注入的功能
  },
})
```

---

## 四、常用插件示例

### 4.1 全局错误处理插件

```ts
// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('捕获到 Vue 错误:', error)
    // 上报到监控平台
  }

  nuxtApp.hook('app:error', (error) => {
    console.error('Nuxt 应用错误:', error)
  })

  nuxtApp.hook('vue:error', (error) => {
    console.error('Vue 渲染错误:', error)
  })
})
```

### 4.2 全局指令注册

```ts
// plugins/directives.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 自动聚焦指令
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
  })

  // 点击外部指令
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el, binding) {
      el.__clickOutside = (event: MouseEvent) => {
        if (!el.contains(event.target as Node)) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el.__clickOutside)
    },
    unmounted(el) {
      document.removeEventListener('click', el.__clickOutside)
    },
  })
})
```

```vue
<template>
  <input v-focus />
  <div v-click-outside="handleOutsideClick">弹窗内容</div>
</template>
```

### 4.3 图表库初始化

```ts
// plugins/echarts.ts
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

export default defineNuxtPlugin(() => {
  return {
    provide: {
      echarts,
    },
  }
})
```

### 4.4 i18n 国际化初始化

```ts
// plugins/i18n.ts
export default defineNuxtPlugin(() => {
  const locale = useCookie('locale')
  const messages = {
    'zh-CN': { welcome: '欢迎' },
    'en-US': { welcome: 'Welcome' },
  }

  const t = (key: string) => {
    return messages[locale.value || 'zh-CN']?.[key] || key
  }

  return {
    provide: { t },
  }
})
```
