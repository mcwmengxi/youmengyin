# Nuxt 4 测试指南

> 本章讲解 Nuxt 4 中的测试策略，包括单元测试、组件测试、端到端测试和 API 测试。

## 一、测试体系概览

```
端到端测试（E2E）     — Playwright / Cypress
    ↓
组件测试              — @nuxt/test-utils + Vitest
    ↓
服务端 API 测试        — Vitest + h3 event
    ↓
工具函数测试           — Vitest
```

Nuxt 4 推荐 **Vitest** 作为测试框架，配合 `@nuxt/test-utils`。

---

## 二、环境搭建

```bash
npm install -D vitest @nuxt/test-utils happy-dom @vue/test-utils
npm install -D @playwright/test  # E2E 测试
```

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      // Nuxt 4 使用 app/ 目录
      nuxt: {
        // 测试环境自动识别 app/ 目录
      },
    },
  },
})
```

---

## 三、单元测试

### 3.1 工具函数测试

```ts
// shared/validators.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

```ts
// tests/unit/validators.test.ts
import { describe, it, expect } from 'vitest'
import { isValidEmail } from '~/shared/validators'

describe('isValidEmail', () => {
  it('正确邮箱返回 true', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('错误邮箱返回 false', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})
```

### 3.2 Composable 测试

```ts
// tests/unit/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '~/app/composables/useCounter'

describe('useCounter', () => {
  it('初始值正确', () => {
    const { count } = useCounter(5)
    expect(count.value).toBe(5)
  })

  it('increment 正确', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })
})
```

---

## 四、组件测试

### 4.1 基础组件测试

```ts
// tests/components/MyButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyButton from '~/app/components/MyButton.vue'

describe('MyButton', () => {
  it('渲染按钮文本', () => {
    const wrapper = mount(MyButton, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('点击触发 emit', async () => {
    const wrapper = mount(MyButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### 4.2 异步组件测试

```ts
// tests/components/PostList.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PostList from '~/app/components/PostList.vue'

describe('PostList', () => {
  it('加载并显示文章', async () => {
    // 模拟 API
    vi.stubGlobal('$fetch', () => Promise.resolve([
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ]))

    const wrapper = await mountSuspended(PostList)
    expect(wrapper.text()).toContain('Post 1')
    expect(wrapper.text()).toContain('Post 2')
  })
})
```

### 4.3 Nuxt 特定组件测试

```ts
// tests/components/ProfileCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import ProfileCard from '~/app/components/ProfileCard.vue'

describe('ProfileCard', () => {
  it('通过 useFetch 显示用户数据', async () => {
    // 注册模拟 API
    registerEndpoint('/api/user/1', () => ({
      name: 'Alice',
      email: 'alice@example.com',
    }))

    const wrapper = await mountSuspended(ProfileCard, {
      props: { userId: 1 },
    })

    expect(wrapper.text()).toContain('Alice')
  })
})
```

---

## 五、API 路由测试

### 5.1 使用 Vitest 测试 API

```ts
// tests/api/hello.test.ts
import { describe, it, expect } from 'vitest'
import { createEvent } from 'h3'

describe('GET /api/hello', () => {
  it('返回正确消息', async () => {
    const event = createEvent(new Request('http://localhost/api/hello'))

    const handler = await import('~/server/api/hello.get')
    const result = await handler.default(event)

    expect(result).toEqual({ message: 'Hello!' })
  })
})
```

### 5.2 测试带参数的 API

```ts
// tests/api/posts.test.ts
import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('API: /api/posts', async () => {
  await setup()

  it('返回文章列表', async () => {
    const { data } = await $fetch('/api/posts')
    expect(Array.isArray(data)).toBe(true)
  })

  it('创建文章', async () => {
    const result = await $fetch('/api/posts', {
      method: 'POST',
      body: { title: 'Test', content: 'Hello' },
    })
    expect(result.title).toBe('Test')
  })
})
```

---

## 六、E2E 测试（Playwright）

### 6.1 配置

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    nuxt: {
      host: 'http://localhost:3000',
    },
  },
  webServer: {
    command: 'npx nuxt dev',
    port: 3000,
    reuseExistingServer: true,
  },
})
```

### 6.2 页面测试

```ts
// tests/e2e/home.test.ts
import { test, expect } from '@playwright/test'

test('首页正常加载', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Nuxt 4')
})

test('导航到关于页面', async ({ page }) => {
  await page.goto('/')
  await page.click('text=关于')
  await expect(page).toHaveURL('/about')
})

test('表单提交', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

---

## 七、测试命令

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --dir tests/unit",
    "test:components": "vitest --dir tests/components",
    "test:api": "vitest --dir tests/api",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 八、Nuxt 4 测试最佳实践

- **单元测试放 `tests/unit/`**，测试纯函数和逻辑
- **组件测试用 `mountSuspended`**，支持异步 setup
- **API 测试用 `registerEndpoint` 模拟路由**
- **E2E 测试覆盖关键用户流程**（注册、登录、购买）
- **CI 中同时运行 Vitest 和 Playwright**
- **不追求 100% 覆盖率**，优先测试核心业务逻辑