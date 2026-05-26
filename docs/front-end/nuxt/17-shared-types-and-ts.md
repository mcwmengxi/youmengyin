# 共享类型与 TypeScript 隔离

> 本章讲解 Nuxt 4 的项目级 TypeScript 隔离机制，以及如何在 `app/`、`server/`、`shared/` 三域之间安全地共享类型。

## 一、Nuxt 4 TypeScript 隔离模型

Nuxt 4 将代码分为三个独立的 TypeScript 域：

```
app/        → 客户端 + SSR 代码（run on browser + server）
server/     → 纯服务端代码（run on server only）
shared/     → 跨域共享代码（importable from both app/ and server/）
```

每个域有独立的 `tsconfig.json`，各自的 `include`/`exclude`，互相隔离：

```
app/ 和 server/ 之间不能直接 import
    ↓
必须通过 shared/ 目录共享代码和类型
```

---

## 二、shared/ 目录

### 2.1 共享类型定义

```ts
// shared/types.ts
export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface CreatePostInput {
  title: string
  content: string
  tags?: string[]
}

// Nuxt 4 支持 Zod 共享校验
export const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
```

### 2.2 共享校验工具

```ts
// shared/validators.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /[0-9]/.test(password)
}
```

### 2.3 在 app/ 中使用

```vue
<!-- app/pages/users/[id].vue -->
<script setup lang="ts">
import type { User } from '~~/shared/types'

const { data: user } = await useFetch<User>('/api/users/1')
// user 自动拥有 User 类型
</script>
```

```ts
// app/composables/useValidate.ts
import { isValidEmail } from '~~/shared/validators'

export function useValidate() {
  return { isValidEmail }
}
```

### 2.4 在 server/ 中使用

```ts
// server/api/users.post.ts
import type { CreatePostInput } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreatePostInput>(event)
  // body 自动拥有 CreatePostInput 类型
})
```

---

## 三、类型补强方式

### 3.1 增强 useRuntimeConfig 类型

```ts
// shared/types.ts
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    databaseUrl: string
    jwtSecret: string
  }

  interface PublicRuntimeConfig {
    apiBaseUrl: string
    appName: string
  }
}

// 现在所有文件中 useRuntimeConfig() 有完整类型
const config = useRuntimeConfig()
config.databaseUrl   // ✅ string
config.public.apiBaseUrl // ✅ string
```

### 3.2 增强 useNuxtApp 类型

```ts
// shared/types.ts
declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch
    $hello: (name: string) => string
  }
}

// 使用时自动补全
const { $api, $hello } = useNuxtApp()
```

---

## 四、TypeScript 配置

Nuxt 4 自动生成 `tsconfig.json`：

```json
{
  "extends": "./.nuxt/tsconfig.json"
}
```

`.nuxt/tsconfig.json` 由 Nuxt 4 自动管理，包含：
- 自动导入组件的类型
- `app/` 和 `shared/` 的路径别名
- Nitro 3 服务端的类型推导
- 严格模式下的类型检查

### 自定义 tsconfig

```json
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": false
  }
}
```

---

## 五、nuxt prepare 与类型生成

```bash
npx nuxt prepare
```

该命令生成：
- `.nuxt/types/` — Nuxt 内部类型
- `.nuxt/tsconfig.json` — 基础 TS 配置
- 自动导入的类型声明

```bash
# 类型检查
npx nuxi typecheck

# 等同于
npx vue-tsc --noEmit
```

---

## 六、Nuxt 4 类型安全增强

### 6.1 自动导入类型安全

Nuxt 4 为所有自动导入的 Composables 和组件生成类型：

```vue
<script setup lang="ts">
// 无需 import，但类型完全可用
const route = useRoute()       // ✅ RouteLocationNormalized
const { data } = useFetch()    // ✅ AsyncData<string>
const cookie = useCookie('key') // ✅ Ref<string>
</script>
```

### 6.2 路由参数类型安全

```ts
// Nuxt 4 支持从路由配置推导参数类型
definePageMeta({
  validate: (route) => {
    // route.params 有正确类型
    return typeof route.params.id === 'string'
  },
})
```

---

## 七、TypeScript 隔离最佳实践

- **类型定义放入 `shared/types.ts`**，前后端共享
- **校验逻辑放入 `shared/validators.ts`**，避免前端弱校验
- **不要跨域 import**：`app/` 不能 import `server/` 的代码
- **用 `nuxt/schema` 模块补强** 增强内置类型
- **运行 `nuxi typecheck`** 在 CI 中确保类型正确
- **共享代码避免使用平台 API**（如 `window` 或 Node.js 专用 API）