# React Compiler（Forget）原理

> React Compiler（代号 Forget）是 React 19 引入的编译时优化工具，自动为组件添加 `memo`、`useMemo`、`useCallback` 等优化，开发者不再需要手动处理。

---

## 一、React Compiler 解决了什么问题？

### React 的渲染规则

```jsx
// React 的核心规则：当 state 变化时，组件重新渲染
function Parent() {
  const [count, setCount] = useState(0)

  // 每次渲染都创建新的对象/函数引用
  const style = { color: 'blue' }          // 新对象
  const handleClick = () => setCount(c => c + 1)  // 新函数

  // 尽管 Child 用了 memo，但因为 style 引用变了，还是会重新渲染
  return <Child style={style} onClick={handleClick} />
}

const Child = memo(({ style, onClick }) => {
  // ...
})
```

为了让 `Child` 不重新渲染，开发者需要手动添加优化：

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  // 手动优化：useMemo + useCallback
  const style = useMemo(() => ({ color: 'blue' }), [])
  const handleClick = useCallback(() => setCount(c => c + 1), [])

  return <Child style={style} onClick={handleClick} />
}
```

**React Compiler 的目标：自动做这些优化，开发者不用操心。**

---

## 二、React Compiler 工作原理

React Compiler 是一个 Babel/SWC 插件，在**编译时**分析组件代码，自动插入优化。

```
源码                         编译后
┌──────────────┐           ┌──────────────────┐
│ function      │           │ function         │
│ MyComponent()│  ──RC──► │ MyComponent() {  │
│ {            │           │   const $ =       │
│   const x =  │           │     useMemoCache(1)│
│     [1,2,3]  │           │   const x = $[0]  │
│   return ... │           │     ?? (($[0]=[1..│
│ }            │           │   return ...      │
└──────────────┘           │ }                │
                           └──────────────────┘
```

### 核心步骤

```
1. 分析阶段（Static Analysis）
   └─ 将 JSX/TSX 源码解析为抽象语法树（AST）
   └─ 遍历 AST，识别组件的状态、props、副作用

2. 依赖追踪（Dependency Tracking）
   └─ 分析哪些值依赖 state/props（会变）
   └─ 分析哪些值不依赖 state/props（不会变）

3. 记忆化注入（Memoization Injection）
   └─ 对不变的值 → 插入 useMemoCache
   └─ 对不变的函数 → 插入缓存指令
   └─ 对纯组件 → 插入等价于 memo 的指令
```

---

## 三、静态分析示例

### 示例 1：自动识别不变值

```jsx
// 源码
function Greeting({ name }) {
  const greeting = `Hello, ${name}`  // 依赖 props.name → 会变
  const theme = 'dark'                // 常量 → 不会变
  const config = useConfig()          // 依赖 Hook → 需要分析

  return (
    <div className={theme}>
      <p>{greeting}</p>
    </div>
  )
}

// React Compiler 分析后：
// theme: 常量 → 可以缓存
// greeting: 依赖 name → 不能缓存（但可以只在 name 变化时重新计算）
// config: 调用 Hook → 看 Hook 内部实现

// 编译后的等价代码：
function Greeting({ name }) {
  const $ = useMemoCache(3)

  const greeting = name !== $[0]
    ? ($[0] = name, $[1] = `Hello, ${name}`, $[1])
    : $[1]

  const theme = $[2] ?? ($[2] = 'dark')

  return (
    <div className={theme}>
      <p>{greeting}</p>
    </div>
  )
}
```

### 示例 2：自动优化子组件 props

```jsx
// 源码
function Parent({ items }) {
  const handleDelete = (id) => {
    setItems(items.filter(i => i.id !== id))
  }

  const sortedItems = items.sort((a, b) => b.score - a.score)

  return (
    <ItemList
      items={sortedItems}
      onDelete={handleDelete}
      style={{ padding: 10 }}
    />
  )
}

// React Compiler 分析：
// - handleDelete: 依赖 items → items 变化时才重新创建
// - sortedItems:  依赖 items → items 变化时才重新计算
// - style 对象:   常量 → 永远缓存

// 编译后的等价代码：
function Parent({ items }) {
  const $ = useMemoCache(3)

  const handleDelete = $[0] ?? ($[0] = (id) => {
    setItems(items.filter(i => i.id !== id))
  })

  const sortedItems = $[1] ?? ($[1] = items.sort((a, b) => b.score - a.score))

  const jsxProps = $[2] ?? ($[2] = { padding: 10 })

  return (
    <ItemList
      items={sortedItems}
      onDelete={handleDelete}
      style={jsxProps}
    />
  )
}
```

---

## 四、React Compiler 的限制

不是所有代码都能自动优化。以下场景 Compiler 会跳过：

### 1. 违反 React 规则

```jsx
// Compiler 依赖 Hook 规则来分析依赖
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0)  // ❌ 条件中调用 Hook
  }
  // Compiler 无法分析这种代码
}
```

### 2. 使用外部可变变量

```jsx
let external = 0

function Component() {
  // external 可能在任意位置被修改
  const value = external + 10  // ❌ Compiler 不知道 external 何时变化
  return <div>{value}</div>
}
```

### 3. 过长的函数

当组件函数过长时，Compiler 会跳过（保守策略）。

---

## 五、React Compiler 的编译选项

```js
// babel.config.js
{
  plugins: [
    ['babel-plugin-react-compiler', {
      // 编译模式
      compilationMode: 'infer',  // 'infer' | 'annotation' | 'all'

      // 环境
      environment: {
        enableResetCacheOnSourceFileChanges: true,
      },

      // 日志
      logger: {
        logEvent(filename, event) {
          // 记录 Compiler 优化了什么
        }
      }
    }]
  ]
}
```

---

## 六、React Compiler vs 手动优化

| 对比维度 | 手动 `memo`/`useMemo`/`useCallback` | React Compiler |
|----------|--------------------------------------|----------------|
| 学习成本 | 需要理解何时使用 | 无需关心 |
| 维护成本 | 需要持续维护 deps 数组 | 自动分析 |
| 遗漏风险 | 容易遗漏优化 | 自动覆盖 |
| 过度优化 | 可能在不需要的地方使用 | 精确分析 |
| 支持范围 | 所有组件 | 符合 React 规则的组件 |
| 编译开销 | 无 | 增加编译时间 |

---

## 七、React 18 vs 19 编译器对比

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 编译时优化 | 无 | React Compiler（可选） |
| `useMemo`/`useCallback` | 手动添加 | Compiler 自动注入 |
| `memo` | 手动包裹 | Compiler 自动（等价） |
| 编译产物 | 原始代码 | 插入 `useMemoCache` |
| 是否强制 | - | 可选，渐进启用 |
| 性能影响 | 取决于手动优化质量 | 相对统一的表现 |

> React Compiler 是 React 19 最革命性的变化之一。它改变了开发者的心智模型：**不再需要思考 "什么时候用 useMemo/useCallback"，只需要正常写代码，剩下的交给编译器。**