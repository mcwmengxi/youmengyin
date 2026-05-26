# Nuxt 4 插件系统

> 本章讲解 Nuxt 4 中的插件机制，包括插件创建、依赖注入、客户端/服务端插件和第三方库集成。

## 一、插件概述

Nuxt 4 插件用于在 Vue 应用实例化时执行代码，典型场景：
- 注册全局组件或指令
- 注入全局方法或属性
- 初始化第三方库（如 Chart.js、Day.js）
- 设置全局拦截器

Nuxt 4 的插件放在 `app/plugins/` 目录。

---

## 二、创建插件

### 2.1 基础插件

```ts
// app/plugins/hello.ts
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp 提供：
  // - nuxtApp.vueApp      Vue 应用实例
  // - nuxtApp.$router     Vue Router
  // - nuxtApp.provide()   注入全局属性
  // - nuxtApp.hook()      生命周期钩子

  return {
    provide: {
      hello: (name: string) => `Hello, ${name}!`,
    },
  }
})
```

### 2.2 在任何组件使用

```vue
<script setup lang="ts">
const { $hello } = useNuxtApp()
console.log($hello('World'))  // "Hello, World!"
</script>
```

### 2.3 自动导入

插件导出以 `useNuxtApp` 获取时可用。Nuxt 4 还支持 automatic helpers：

```ts
// app/plugins/my-helper.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      myHelper: {
        formatDate: (date: Date) => date.toLocaleDateString(),
      },
    },
  }
})
```

```ts
// 使用时自动补全类型
const { $myHelper } = useNuxtApp()
```

---

## 三、插件执行顺序

### 3.1 文件命名控制顺序

```
app/plugins/
├── 01.analytics.ts      # 最先执行
├── 02.api.ts             # 其次执行
├── auth.ts               # 最后执行
└── hello.ts              # 最后执行
```

文件按**字母顺序**执行，可以通过添加数字前缀控制。

### 3.2 手动控制依赖顺序

```ts
// app/plugins/auth-dependent.ts
export default defineNuxtPlugin({
  name: 'auth-dependent',
  dependsOn: ['auth'],  // 确保 auth 插件先执行
  setup(nuxtApp) {
    const { $auth } = useNuxtApp()
    // $auth 已经可用
  },
})
```

---

## 四、客户端 & 服务端插件

### 4.1 `.client.ts` — 仅客户端

```ts
// app/plugins/chart.client.ts
import Chart from 'chart.js/auto'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      chart: (ctx: HTMLCanvasElement, config: any) => new Chart(ctx, config),
    },
  }
})
```

### 4.2 `.server.ts` — 仅服务端

```ts
// app/plugins/db.server.ts
import { createClient } from '@libsql/client'

export default defineNuxtPlugin(() => {
  const db = createClient({
    url: useRuntimeConfig().databaseUrl,
  })

  return { provide: { db } }
})
```

### 4.3 判断运行环境

```ts
// app/plugins/env-aware.ts
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    // 仅客户端
    console.log('在浏览器中运行')
  }

  if (import.meta.server) {
    // 仅服务端
    console.log('在服务端运行')
  }
})
```

---

## 五、常用插件示例

### 5.1 全局时间格式化（Day.js）

```ts
// app/plugins/dayjs.ts
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs: (date?: dayjs.ConfigType) => dayjs(date),
    },
  }
})
```

```vue
<script setup lang="ts">
const { $dayjs } = useNuxtApp()
const formatted = $dayjs().format('YYYY-MM-DD HH:mm:ss')
</script>
```

### 5.2 全局 Toast 通知

```ts
// app/plugins/toast.ts
import { createToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const toast = createToast({ position: 'top-right', timeout: 3000 })
  nuxtApp.vueApp.use(toast)

  return {
    provide: {
      toast: {
        success: (msg: string) => toast.success(msg),
        error: (msg: string) => toast.error(msg),
        info: (msg: string) => toast.info(msg),
      },
    },
  }
})
```

### 5.3 全局 $fetch 封装

```ts
// app/plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 15000,
    onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) navigateTo('/login')
    },
  })

  return { provide: { api } }
})
```

### 5.4 注册全局指令

```ts
// app/plugins/directives.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el: HTMLElement) {
      el.focus()
    },
  })

  nuxtApp.vueApp.directive('click-outside', {
    mounted(el: HTMLElement, binding) {
      el.clickOutsideEvent = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el: any) {
      document.removeEventListener('click', el.clickOutsideEvent)
    },
  })
})
```

---

## 六、插件生命周期钩子

```ts
// app/plugins/hooks.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 页面开始渲染前
  nuxtApp.hook('page:start', () => {
    console.log('页面开始渲染')
  })

  // 页面渲染完成后
  nuxtApp.hook('page:finish', () => {
    console.log('页面渲染完成')
  })

  // 应用挂载前
  nuxtApp.hook('app:beforeMount', () => {
    console.log('应用即将挂载')
  })

  // 应用挂载后
  nuxtApp.hook('app:mounted', () => {
    console.log('应用已挂载')
  })

  // 应用错误
  nuxtApp.hook('app:error', (error) => {
    console.error('应用错误:', error)
  })
})
```

---

## 七、Nuxt 4 插件最佳实践

- **插件放在 `app/plugins/` 目录**，Nuxt 自动扫描和注册
- **用 `.client.ts` / `.server.ts` 区分执行环境**
- **用 `provide` 注入全局方法**，用 `$` 前缀命名（如 `$api`）
- **用数字前缀控制插件执行顺序**（`01.xxx`, `02.xxx`）
- **第三方库初始化放在插件中**，不要在组件中重复 import