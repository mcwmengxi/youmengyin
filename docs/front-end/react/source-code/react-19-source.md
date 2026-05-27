# React 19 新特性源码解析

> React 19 在 18 的基础上新增了 `use()`、`useOptimistic`、Server Components、Actions、React Compiler 等特性。本文档聚焦其源码实现。

---

## 一、`use()` API 源码解析

`use()` 是 React 19 最特殊的新 API，它不是一个真正的 Hook（不受 Hook 规则约束）。

### 为什么 use() 不是 Hook？

```js
// 传统 Hook 必须在顶层调用
function ComponentA() {
  const [state, setState] = useState(0)  // ✅ 顶层
  if (state > 0) {
    useEffect(() => {}, [])  // ❌ 条件语句中不行！
  }
}

// use() 可以在条件、循环中调用
function ComponentB({ id }) {
  if (!id) return <div>No ID</div>

  const data = use(fetchData(id))  // ✅ 条件语句中也没问题！
  return <div>{data.name}</div>

  // use() 甚至可以用于循环
  // items.map(item => use(fetchDetail(item.id)))
}
```

### use() 实现原理

`use()` 是利用了 React 内部的 **"抛出 Promise"** 机制（最早用于 Suspense），而不是 Hook 链表。

```js
// React 19: use() 简化实现
function use(usable) {
  // usable 可以是 Promise 或 Context
  if (usable !== null && typeof usable === 'object') {
    if (typeof usable.then === 'function') {
      // ===== Promise 处理 =====
      // 检查缓存中是否已有结果
      const cached = readCache.get(usable)
      if (cached !== undefined) {
        if (cached.status === 'fulfilled') {
          return cached.value  // 有结果 → 直接返回
        }
        if (cached.status === 'rejected') {
          throw cached.value   // 有错误 → 抛出
        }
        // pending 状态 → 抛出 Promise（触发 Suspense）
        throw usable
      }

      // 首次遇到此 Promise，wrap 它
      const wrapped = wrapPromise(usable)
      readCache.set(usable, wrapped)

      // 未完成 → 抛出 Promise（暂停渲染，等待 Suspense）
      if (wrapped.status === 'pending') {
        throw usable
      }
      return wrapped.value
    }

    if (usable.$$typeof === REACT_CONTEXT_TYPE) {
      // ===== Context 处理 =====
      // 从当前 Fiber 向上查找 Provider
      const context = usable
      const value = readContext(context)
      return value
    }
  }

  throw new Error('use() 只接受 Promise 或 Context')
}

// 包装 Promise
function wrapPromise(promise) {
  let status = 'pending'
  let result

  const suspender = promise.then(
    (value) => {
      status = 'fulfilled'
      result = value
    },
    (error) => {
      status = 'rejected'
      result = error
    }
  )

  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'rejected') throw result
      return result
    }
  }
}
```

### 为什么 use() 不受 Hook 规则约束？

```
传统 Hooks 依赖调用顺序：
  第1次调用 → Hook链表[0]
  第2次调用 → Hook链表[1]
  第3次调用 → Hook链表[2]
  ↑ 如果在条件语句中，调用顺序会变化，导致状态错乱

use() 不依赖调用顺序：
  它直接从 Promise/Context 读取数据
  不存入 Fiber 的 memoizedState 链表
  所以可以在条件、循环中随意使用
```

---

## 二、`useOptimistic` 源码解析

乐观更新：立即更新 UI，后台异步确认。

```js
// React 19: useOptimistic 简化实现
function useOptimistic(passthrough, reducer) {
  const hook = mountWorkInProgressHook()

  // 初始状态 = passthrough
  hook.memoizedState = passthrough

  // 乐观更新队列
  const queue = {
    pending: null,       // 乐观更新的环形链表
    dispatch: null,
    lastRenderedState: passthrough,
  }
  hook.queue = queue

  // dispatch 函数
  const dispatch = (optimisticValue) => {
    // 创建乐观更新
    const update = {
      action: optimisticValue,
      next: null,
    }

    // 加入环形链表
    const pending = queue.pending
    if (pending === null) {
      update.next = update
    } else {
      update.next = pending.next
      pending.next = update
    }
    queue.pending = update

    // 触发重渲染
    scheduleUpdateOnFiber(currentlyRenderingFiber, SyncLane)
  }

  // 计算最终状态
  let state = hook.memoizedState

  // 当 passthrough 变化时，清除对应的乐观更新
  if (!Object.is(passthrough, hook.memoizedState)) {
    // 服务器确认了数据，清除乐观更新
    queue.pending = null
    state = passthrough
  }

  // 应用剩余的乐观更新
  if (queue.pending !== null) {
    const pending = queue.pending
    let update = pending.next
    do {
      state = reducer(state, update.action)
      update = update.next
    } while (update !== pending.next)
  }

  hook.memoizedState = state
  return [state, dispatch]
}
```

**useOptimistic 数据流：**

```
初始: passthrough = [{id:1, text:'hello'}]
      optimistic  = [{id:1, text:'hello'}]

dispatch({id:2, text:'world', pending:true}):
      passthrough = [{id:1, text:'hello'}]
      optimistic  = [{id:1, text:'hello'}, {id:2, text:'world', pending:true}]
      ↑ 立即显示在 UI 上

服务器确认后, 更新 passthrough:
      passthrough = [{id:1, text:'hello'}, {id:2, text:'world'}]
      optimistic  = [{id:1, text:'hello'}, {id:2, text:'world'}]
      ↑ passthrough 变化，清除乐观更新
```

---

## 三、Server Components 工作机制

React 19 中 Server Components 正式成为一等公民。

### 架构

```
客户端                        服务端
┌──────────────┐           ┌──────────────┐
│ Client Bundle │◄──────────│  RSC Payload │
│ (交互组件)    │  stream   │ (序列化数据)  │
├──────────────┤           ├──────────────┤
│ LikeButton   │           │ UserList     │
│ SearchBox    │           │ BlogPost     │
└──────────────┘           └──────────────┘
      ↓                          ↓
  需要 hydrate             不需要 JS，直接渲染 HTML
```

### RSC Payload 格式

```js
// React Server Component 输出的是特殊格式的流
// 不是 HTML，而是 React 内部的 RSC Wire Format

// 示例 Payload:
M1:{"id":"./UserList.tsx","name":"UserList","env":"Server"}
J0:["$","div",null,{"children":["$","h1",null,{"children":"用户列表"}]}]
M2:{"id":"./LikeButton.tsx","name":"LikeButton","env":"Client"}
J1:["$","@2",null,{}]  // @2 引用 Client Component LikeButton
```

### 源码层面：react-server-dom

```js
// packages/react-server-dom-webpack/
// Server 端：渲染 Server Components 并序列化
function renderToReadableStream(children) {
  // 递归渲染组件树
  // 遇到 Server Component → 直接在服务端执行
  // 遇到 Client Component → 输出引用标记（占位符）
  // 输出为 RSC Wire Format 的可读流
}

// Client 端：解析 RSC Payload 并创建 Fiber 树
function createFromReadableStream(stream) {
  // 解析 RSC Wire Format
  // 对于 Server Component 渲染结果 → 直接创建 DOM
  // 对于 Client Component → 加载对应 JS bundle 并 hydrate
}
```

---

## 四、Ref 不再需要 forwardRef

React 19 中 ref 可以作为普通 prop 传递，不再需要 `forwardRef`。

### 源码变化

```js
// React 18: ref 是保留关键字，不能作为 prop 传递
// 需要使用 forwardRef 包裹

// ReactFiberBeginWork.js - React 19
function updateFunctionComponent(current, workInProgress, Component, nextProps) {
  // React 19: 从 props 中提取 ref
  const ref = workInProgress.ref  // 直接从 Fiber 上取

  // 如果 Component 使用 ref prop
  // ref 会自动从 props 中分离，作为 Fiber.ref 传递
  // 不再需要 forwardRef 特殊处理

  const nextChildren = renderWithHooks(current, workInProgress, Component, nextProps)
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}

// 对用户而言：
// React 18:
const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />)

// React 19:
function MyInput({ ref, ...props }) {  // ref 就是普通 prop
  return <input ref={ref} {...props} />
}
```

---

## 五、Actions 机制

React 19 的 Actions 将表单提交和异步操作深度集成到框架。

```js
// 源码核心：表单 Action 处理
function handleFormAction(formElement) {
  const action = formElement.getAttribute('action')
  if (typeof action === 'function') {
    // 调用 Server Action 或普通 Action
    const formData = new FormData(formElement)

    // React 自动管理 pending 状态
    startTransition(async () => {
      await action(formData)
    })
  }
}

// useActionState 内部实现
function useActionState(action, initialState) {
  const [state, setState] = useState(initialState)
  const [isPending, startTransition] = useTransition()

  const formAction = useCallback((formData) => {
    startTransition(async () => {
      const newState = await action(state, formData)
      setState(newState)
    })
  }, [action, state, startTransition])

  return [state, formAction, isPending]
}
```

---

## 六、React 19 源码架构变化总结

| 模块 | React 18 源码 | React 19 源码变化 |
|------|--------------|-------------------|
| React Core | `useState`, `useEffect` 等 | 新增 `use()`, `useOptimistic`, `useActionState` |
| React Reconciler | beginWork/completeWork/commitWork | beginWork 增加了 `use()` 处理分支 |
| React DOM | 事件委托、DOM 操作 | 新增 formAction 处理、Server Actions |
| react-server-dom | 实验性 | 正式支持，RSC Wire Format 稳定 |
| Scheduler | 时间切片、Lane 模型 | 基本不变 |
| React Compiler | 无 | 全新的编译器模块（Forget） |

> React 19 的源码变化更多地是**增量添加**而非**重写重构**。Fiber、调和算法、调度器等核心架构保持不变，新增特性以模块化方式集成到现有架构中。