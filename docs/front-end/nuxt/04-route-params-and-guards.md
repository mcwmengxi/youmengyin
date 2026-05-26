# 路由参数与导航守卫

> 本章深入 Nuxt 4 的路由参数获取、编程式导航以及路由守卫（Route Guards）。

## 一、路由参数获取

### 1.1 `useRoute` — 获取当前路由信息

```vue
<script setup lang="ts">
const route = useRoute()

console.log(route.path)        // "/posts/123?tab=comments"
console.log(route.params)      // { id: "123" }
console.log(route.query)       // { tab: "comments" }
console.log(route.name)        // "posts-id"
console.log(route.meta)        // { layout: "default" }
console.log(route.hash)        // "#section-1"
console.log(route.fullPath)    // "/posts/123?tab=comments#section-1"
</script>
```

### 1.2 查询参数（Query）处理

查询参数适用于**非必选**的过滤、搜索、分页等场景：

```vue
<!-- /search?q=vue&page=2 -->
<script setup lang="ts">
const route = useRoute()
const searchQuery = route.query.q     // "vue"
const currentPage = route.query.page  // "2"（query 值都是字符串）
</script>
```

**更新查询参数**而不重新加载页面：

```vue
<script setup lang="ts">
const router = useRouter()

function updateFilter(key: string, value: string) {
  router.replace({ query: { ...router.currentRoute.value.query, [key]: value } })
}

// 移除某个查询参数
function removeFilter(key: string) {
  const query = { ...router.currentRoute.value.query }
  delete query[key]
  router.replace({ query })
}
</script>
```

---

## 二、编程式导航

### 2.1 `useRouter` 基础导航

```vue
<script setup lang="ts">
const router = useRouter()

function goTo(path: string) {
  router.push(path)         // 跳转 + 新增历史
}

function goToReplace(path: string) {
  router.replace(path)      // 跳转 + 替换当前历史
}

function goBack() {
  router.back()             // 返回上一页
}

function goForward() {
  router.forward()          // 前进
}

function goToHistory(n: number) {
  router.go(n)              // 跳转历史栈中的某条（正数前进，负数后退）
}
</script>
```

### 2.2 带参数的编程式导航

```ts
// 动态参数
router.push(`/posts/${postId}`)

// 对象形式
router.push({
  name: 'posts-id',
  params: { id: postId },
})

// 带查询参数
router.push({
  path: '/search',
  query: { q: 'vue', page: '2' },
})

// 带 hash
router.push({
  path: '/docs',
  hash: '#installation',
})
```

### 2.3 路由导航回调

```ts
router.push('/admin')
  .then(() => console.log('导航成功'))
  .catch(err => console.log('导航失败或被取消', err))
```

---

## 三、路由守卫

### 3.1 全局守卫（中间件）

Nuxt 4 使用 `app/middleware/` 目录定义路由中间件，详见第 13 章。

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  if (!token.value) {
    return navigateTo('/login')
  }
})
```

### 3.2 页面级守卫 — `definePageMeta`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'log'],  // 按顺序执行
})
</script>
```

### 3.3 组件内守卫（Nuxt 4 增强）

Nuxt 4 对 `watch` 路由变化提供了更简洁的 API：

```vue
<script setup lang="ts">
const route = useRoute()

// 监听路由变化（相当于 beforeRouteUpdate）
watch(() => route.params.id, (newId, oldId) => {
  console.log(`路由参数从 ${oldId} 变为 ${newId}`)
  // 重新获取数据
})
</script>
```

### 3.4 导航取消处理

```vue
<script setup lang="ts">
const router = useRouter()

// 阻止用户离开未保存的表单
const isDirty = ref(false)

// 使用 onBeforeRouteLeave（来自 Vue Router）
import { onBeforeRouteLeave } from '#app'

onBeforeRouteLeave((to, from) => {
  if (isDirty.value) {
    const answer = window.confirm('你有未保存的更改，确定离开吗？')
    if (!answer) return false
  }
})
</script>
```

---

## 四、路由元信息

### 4.1 在 `definePageMeta` 中设置

```vue
<script setup lang="ts">
definePageMeta({
  title: '关于我们',
  requiresAuth: true,
  roles: ['admin'],
  keepalive: true,
})
</script>
```

### 4.2 在中间件中读取

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.requiresAuth) {
    // 鉴权逻辑
  }
})
```

### 4.3 在组件中读取

```vue
<script setup lang="ts">
const route = useRoute()
console.log(route.meta.keepalive)  // true
</script>
```

---

## 五、Nuxt 4 路由命名约定

| 文件路径                                     | 路由名称                          |
| -------------------------------------------- | --------------------------------- |
| `app/pages/index.vue`                        | `index`                           |
| `app/pages/about.vue`                        | `about`                           |
| `app/pages/posts/[id].vue`                   | `posts-id`                        |
| `app/pages/category/[category]/[product].vue`| `category-category-product`       |
| `app/pages/docs/[...slug].vue`               | `docs-slug`                       |

> **规则**：`/` 替换为 `-`，`[param]` 保留参数名但去掉方括号。

---

## 六、编程式导航与数据获取联动（Nuxt 4）

Nuxt 4 智能数据层让路由变化自动触发数据获取：

```vue
<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

// Nuxt 4：无需手动 watch，useFetch 自动追踪依赖
const { data } = await useFetch(() => `/api/posts/${id.value}`, {
  key: () => `post-${id.value}`,
})
</script>
```

`key` 变化时自动重新获取并清理旧数据，详见第 7 章。