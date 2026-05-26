# 最佳实践与安全

> 本章汇总 Nuxt 4 开发中的最佳实践和安全注意事项，涵盖代码规范、性能、安全和团队协作。

## 一、代码组织最佳实践

### 1.1 目录结构规范

```
app/
├── assets/          # 样式、图片（构建工具处理）
│   └── css/
├── components/      # 公共组件
│   ├── ui/          # 基础 UI 组件
│   ├── layout/      # 布局组件
│   └── business/    # 业务组件
├── composables/     # 组合式函数
│   ├── use*.ts      # 状态/数据型 composable
│   └── api/         # API 相关 composable
├── layouts/         # 布局模板
├── middleware/       # 路由中间件
├── pages/           # 页面组件
├── plugins/         # 插件
└── utils/           # 纯工具函数
shared/
├── types.ts         # 共享类型
├── validators.ts    # 共享校验
└── constants.ts     # 共享常量
server/
├── api/             # API 路由
├── middleware/       # 服务端中间件
├── utils/           # 服务端工具
└── tasks/           # 定时任务
```

### 1.2 命名规范

| 类别         | 规范                         | 示例                          |
| ------------ | ---------------------------- | ----------------------------- |
| 页面         | kebab-case                   | `product-detail.vue`          |
| 组件         | PascalCase                   | `ProductCard.vue`             |
| Composable   | `use` 前缀 + camelCase       | `useAuth.ts`                  |
| 中间件       | kebab-case                   | `auth-guard.ts`               |
| API 路由     | kebab-case + 方法后缀        | `posts.get.ts`                |
| Store        | `use` 前缀 + PascalCaseStore | `useCartStore.ts`             |

### 1.3 组件拆分原则

- **大页面拆为小组件**：超过 200 行的页面组件应拆分
- **UI 组件无业务逻辑**：不直接调用 API
- **业务组件按功能拆分**：`CheckoutForm` vs `CheckoutSummary`

---

## 二、性能最佳实践

- **非首屏组件用 `<Lazy>` 懒加载**
- **大列表用虚拟滚动**
- **图片用 `@nuxt/image` 优化**
- **合理配置 `routeRules` 缓存**
- **服务端查询只选必要字段**
- **运行时避免不必要的水合**
- **第三方库按需导入**

```ts
// ✅ 按需导入
import { debounce } from 'lodash-es'

// ❌ 全量导入
import _ from 'lodash'
```

---

## 三、安全最佳实践

### 3.1 环境变量安全

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  runtimeConfig: {
    // ✅ 密钥放这里 — 仅服务端可访问
    jwtSecret: process.env.JWT_SECRET,
    apiKey: process.env.API_KEY,

    public: {
      // ✅ 公开配置放这里
      appName: 'My App',
      // ❌ 不要把密钥放 public
    },
  },
})
```

### 3.2 XSS 防护

Nuxt 4 自动转义模板中的内容，但在使用 `v-html` 时需要谨慎：

```vue
<template>
  <!-- ✅ 安全：自动转义 -->
  <div>{{ userContent }}</div>

  <!-- ⚠️ 危险：不做转义，仅用于可信内容 -->
  <div v-html="trustedHtml" />
</template>
```

### 3.3 CSRF 防护

```ts
// 使用 nuxt-security 模块
// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['nuxt-security'],
  security: {
    csrf: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
      },
    },
  },
})
```

### 3.4 API 输入验证

```ts
// server/api/posts.post.ts
import { z } from 'zod'

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  tags: z.array(z.string()).max(10).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = CreatePostSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: '输入验证失败',
      data: result.error.flatten(),
    })
  }

  // result.data 类型安全
  const post = await createPost(result.data)
  return post
})
```

### 3.5 认证与授权

```ts
// server/middleware/01.auth.ts
export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  // 仅 /api/protected 下的路由需要认证
  if (event.path.startsWith('/api/protected')) {
    if (!token) {
      throw createError({ statusCode: 401, message: '未授权' })
    }
    // 验证 token
    try {
      const payload = verifyToken(token)
      event.context.user = payload
    } catch {
      throw createError({ statusCode: 401, message: 'Token 无效' })
    }
  }
})
```

### 3.6 速率限制

```ts
// server/middleware/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export default defineEventHandler((event) => {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()

  const record = rateLimitMap.get(ip)
  if (record && now < record.resetTime) {
    if (record.count > 100) {
      throw createError({ statusCode: 429, message: '请求太频繁' })
    }
    record.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
  }
})
```

---

## 四、团队协作最佳实践

### 4.1 Git 提交规范

```bash
feat: 添加用户登录功能
fix: 修复导航栏闪烁问题
refactor: 重构 API 请求模块
docs: 更新 README
chore: 更新依赖版本
```

### 4.2 ESLint + Prettier

```ts
// eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
})
```

### 4.3 Husky 钩子

```bash
# .husky/pre-commit
npm run lint
npm run typecheck
```

---

## 五、安全清单

- [ ] 密钥和秘密不暴露到客户端
- [ ] API 输入始终校验（服务端用 Zod）
- [ ] 需要认证的 API 添加中间件
- [ ] 使用 nuxt-security 模块配置安全头
- [ ] 避免使用 `v-html`，除非内容可信
- [ ] 添加 CSRF 防护
- [ ] API 添加速率限制
- [ ] `.env` 文件不提交到 Git
- [ ] 依赖定期更新，修复安全漏洞