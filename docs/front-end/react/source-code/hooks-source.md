# Hooks 源码实现

> 深入 React 18 源码，解析 useState、useEffect 等核心 Hooks 的实现原理。React 19 新增的 Hooks（`use()`、`useOptimistic` 等）见单独章节。

---

## 一、Hooks 的存储结构：链表

每个 Fiber 节点通过 `memoizedState` 属性维护一个 **Hooks 链表**。

```ts
// 每个 Hook 对象的结构（ReactFiberHooks.js）
type Hook = {
  memoizedState: any       // 当前 hook 保存的状态值
  baseState: any           // 基准状态（用于跳过更新时回退）
  baseQueue: Update<any> | null  // 待处理的更新队列
  queue: UpdateQueue<any> | null // 更新队列（链表的头）
  next: Hook | null        // 指向下一个 Hook（构成链表！）
}

// useState 对应的 UpdateQueue
type UpdateQueue<S> = {
  pending: Update<S> | null  // 环形链表的尾指针（指向最后一个 Update）
  dispatch: (action: any) => void
  lastRenderedReducer: (state: S, action: any) => S
  lastRenderedState: S
}

// 每次 setState 创建的 Update 对象
type Update<S> = {
  lane: Lane                // 优先级
  action: S | ((prevState: S) => S)  // 新值或更新函数
  next: Update<S> | null    // 环形链表的下一个 Update
}
```

### Hooks 链表图示

```
Fiber.memoizedState
        │
        ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Hook 1  │ ──► │ Hook 2  │ ──► │ Hook 3  │ ──► null
   │(useState)│    │(useState)│    │(useEffect)│
   └─────────┘     └─────────┘     └─────────┘
```

---

## 二、useState 源码解析

源码位置: `packages/react-reconciler/src/ReactFiberHooks.js`

### 首次渲染：mountState

```js
function mountState(initialState) {
  // 1. 创建 Hook 对象
  const hook = mountWorkInProgressHook()

  // 2. 设置初始状态
  if (typeof initialState === 'function') {
    initialState = initialState()  // 惰性初始化
  }
  hook.memoizedState = hook.baseState = initialState

  // 3. 创建更新队列（环形链表结构）
  const queue = {
    pending: null,      // 尾指针，指向最后一个 Update
    dispatch: null,     // dispatch 函数
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  }
  hook.queue = queue

  // 4. 创建 dispatch 函数（即 setState）
  const dispatch = (queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue
  ))

  return [hook.memoizedState, dispatch]
}
```

### Update 环形链表

```js
// dispatchSetState 被调用时
function dispatchSetState(fiber, queue, action) {
  const lane = requestUpdateLane(fiber)

  // 创建 Update 对象
  const update = {
    lane,
    action,
    next: null,
  }

  // 加入环形链表
  const pending = queue.pending
  if (pending === null) {
    // 链表为空：指向自己
    update.next = update
  } else {
    // 链表非空：插入尾部（环形链表操作）
    update.next = pending.next
    pending.next = update
  }
  queue.pending = update  // pending 始终指向尾部

  // 最终调度更新
  scheduleUpdateOnFiber(fiber, lane)
}
```

**Update 环形链表结构：**

```
初次队列为空:
  queue.pending = null

第一次 setState(A):
  queue.pending → Update(A)
                    ↑___↓ (自环)

第二次 setState(B):
                      ┌── Update(A) ──┐
                      ↓               │
  queue.pending → Update(B) ──────────┘
  (pending 始终指向最新的 Update)
```

### 更新渲染：updateState

```js
function updateState() {
  return updateReducer(basicStateReducer)
}

function updateReducer(reducer) {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue

  // 遍历环形链表，计算最终 state
  let newState = hook.memoizedState

  if (queue.pending !== null) {
    // 将环形链表展开为单向链表
    const first = queue.pending.next     // 最早的 Update
    let update = first

    do {
      const action = update.action
      // 应用 reducer
      newState = reducer(newState, action)
      update = update.next
    } while (update !== first) // 环形遍历直到回到起点

    // 更新已处理，清空队列
    queue.pending = null

    // 更新 hook 状态
    hook.memoizedState = newState
    hook.baseState = newState
    queue.lastRenderedState = newState
  }

  return [hook.memoizedState, queue.dispatch]
}

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action
}
```

### 批量更新（Batching）

React 18 的自动批处理核心逻辑：

```js
// React 18: 所有更新都会通过调度器批量处理
function dispatchSetState(fiber, queue, action) {
  const lane = requestUpdateLane(fiber)

  // 创建 update
  const update = { lane, action, next: null }
  enqueueUpdate(fiber, queue, update)

  // 进入调度（会被批量合并）
  const root = scheduleUpdateOnFiber(fiber, lane)
}

// 在事件处理中，React 会包裹在 batch 上下文中：
// React 18 let 自动批处理对 setTimeout、Promise 也有效
// React 17 及之前：仅对 React 事件处理中的 setState 批处理
```

---

## 三、useEffect 源码解析

### mountEffect（首次渲染）

```js
function mountEffect(create, deps) {
  return mountEffectImpl(PassiveEffect, HookPassive, create, deps)
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook()

  // 标记 Fiber 的副作用
  currentlyRenderingFiber.flags |= fiberFlags

  // 存储 effect 信息
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,  // 标记为"需要执行"
    create,
    undefined,                   // destroy（首次没有销毁函数）
    deps
  )
}
```

### pushEffect - Effect 链表

```js
function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,       // HookHasEffect | HookPassive 等
    create,    // useEffect 的回调函数
    destroy,   // 上一次回调返回的清理函数
    deps,      // 依赖数组
    next: null,
  }

  // 将 effect 加入当前 Fiber 的 effect 链表
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue()
    currentlyRenderingFiber.updateQueue = componentUpdateQueue
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const lastEffect = componentUpdateQueue.lastEffect
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect
    } else {
      effect.next = lastEffect.next
      lastEffect.next = effect
      componentUpdateQueue.lastEffect = effect
    }
  }
  return effect
}
```

### updateEffect（更新）

```js
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps)
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook()

  // 比较依赖
  if (hook.memoizedState !== null && deps !== null) {
    const prevDeps = hook.memoizedState.deps
    if (areHookInputsEqual(deps, prevDeps)) {
      // 依赖没变 → 创建 effect 但不标记为"需要执行"
      hook.memoizedState = pushEffect(hookFlags, create, hook.memoizedState.destroy, deps)
      return
    }
  }

  // 依赖变了 → 标记为"需要执行"
  currentlyRenderingFiber.flags |= fiberFlags
  hook.memoizedState = pushEffect(HookHasEffect | hookFlags, create, hook.memoizedState.destroy, deps)
}

// 依赖比较（浅比较）
function areHookInputsEqual(nextDeps, prevDeps) {
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue
    }
    return false
  }
  return true
}
```

### Effect 执行时机

```js
// Commit 阶段执行 useEffect（异步，不阻塞渲染）
function commitHookEffectListMount(finishedWork) {
  const updateQueue = finishedWork.updateQueue
  const lastEffect = updateQueue?.lastEffect

  if (lastEffect !== null) {
    let effect = lastEffect.next
    do {
      if ((effect.tag & HookHasEffect) !== NoFlags) {
        // 执行 create，获取 destroy 函数并保存
        const destroy = effect.create()
        if (effect.destroy !== undefined) {
          effect.destroy = destroy
        }
      }
      effect = effect.next
    } while (effect !== lastEffect.next)
  }
}
```

---

## 四、useMemo / useCallback 源码

```js
// useMemo: 缓存值
function mountMemo(nextCreate, deps) {
  const hook = mountWorkInProgressHook()
  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, deps]
  return nextValue
}

function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook()
  const prevState = hook.memoizedState

  if (prevState !== null && deps !== null) {
    const prevDeps = prevState[1]
    if (areHookInputsEqual(deps, prevDeps)) {
      return prevState[0]  // 依赖不变，返回缓存值
    }
  }

  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, deps]
  return nextValue
}

// useCallback: 是 useMemo 的语法糖
function mountCallback(callback, deps) {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = [callback, deps]
  return callback
}

function updateCallback(callback, deps) {
  const hook = updateWorkInProgressHook()
  const prevState = hook.memoizedState

  if (prevState !== null && deps !== null) {
    const prevDeps = prevState[1]
    if (areHookInputsEqual(deps, prevDeps)) {
      return prevState[0]  // 依赖不变，返回原函数引用
    }
  }

  hook.memoizedState = [callback, deps]
  return callback
}
```

---

## 五、React 18 vs 19 Hooks 源码差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `useState` 实现 | 基于环形链表 | 无变化 |
| `useEffect` 实现 | 基于环形链表 | **清理函数异步执行**（源码改动） |
| `useMemo/useCallback` | 依赖浅比较 | React Compiler 会自动优化，不再需要手动加 |
| `use()` | 不存在 | 新增实现，打破 Hook 规则约束 |
| `useOptimistic` | 不存在 | 新增，基于 updateQueue 机制 |
| `useActionState` | 不存在 | 新增，集成 Server Actions |

> React 19 的 Hooks 核心实现变化不大，主要是 `useEffect` 清理函数改为异步执行（减少阻塞），以及新增了多个 Hook API。最大的变化是 React Compiler 可以在编译时自动优化，不再需要手动使用 `useMemo` / `useCallback`。