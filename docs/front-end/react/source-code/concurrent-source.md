# 并发模式源码解析

> React 18 的并发模式（Concurrent Mode）让渲染变得可中断，React 19 在此基础上增强了并发特性。

---

## 一、什么是并发渲染？

并发渲染不是让 React 同时做多件事，而是在一个时间段内**交错地执行多个任务**，对用户来说像是并行的。

```
传统同步渲染：
[========= 渲染大组件 =========]  ← 30ms，阻塞用户输入

并发渲染：
[渲染][渲染][渲染] ← 暂停 → [处理输入][渲染][渲染] ← 暂停 → ...
  ↑ 每5ms检查是否需要让出主线程
```

---

## 二、并发模式入口：createRoot

```js
// React 18: createRoot 替代 ReactDOM.render
// packages/react-dom/src/client/ReactDOMRoot.js

function createRoot(container, options) {
  // 创建 FiberRootNode
  const root = createContainer(
    container,
    ConcurrentRoot,  // 并发模式根节点
    null,
    options
  )

  // 标记容器
  markContainerAsRoot(root.current, container)

  return new ReactDOMRoot(root)
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot
  updateContainer(children, root, null, null)
}
```

### createRoot vs ReactDOM.render

```js
// React 17: 传统渲染（不可中断）
ReactDOM.render(<App />, document.getElementById('root'))

// React 18: 并发渲染（可中断）
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

特点：
- `createRoot` 创建的根节点使用 `ConcurrentRoot` 标签
- 所有的 `setState` 更新都会走并发调度
- 高优先级更新（用户输入）可以中断低优先级渲染

---

## 三、任务中断与恢复

### shouldYield - 是否应该让出主线程

```js
// Scheduler 中的判断逻辑
function shouldYieldToHost() {
  const currentTime = getCurrentTime()
  // 距离帧截止时间还有多久
  if (currentTime >= deadline) {
    // 已经超时了，而且有更高优先级任务需要执行
    if (needsPaint || scheduling.isInputPending) {
      return true  // 让出主线程
    }
    // 当前任务已经执行超过 5ms，但没更高优先级任务
    return currentTime >= maxYieldInterval
  }
  return false  // 还有时间，继续执行
}

// 检查是否有待处理的用户输入（React 的 isInputPending）
function shouldYield() {
  if (needsPaint) {
    return true  // 需要重绘 → 让出
  }
  if (enableIsInputPending && navigator.scheduling?.isInputPending()) {
    return true  // 有待处理的用户输入 → 让出
  }
  return false
}
```

### 中断恢复机制

```js
// 渲染循环（ReactFiberWorkLoop.js）
function workLoopConcurrent() {
  // 只要有工作且不需要让出，就继续执行
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate

  // beginWork: 处理当前 Fiber，返回子 Fiber
  let next = beginWork(current, unitOfWork, renderLanes)

  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // 没有子节点 → 完成当前节点
    completeUnitOfWork(unitOfWork)
  } else {
    // 有子节点 → 继续向下
    workInProgress = next
  }
}
```

**中断和恢复的过程：**

```
中断前:
  workInProgress 指针 → 已经处理到的 Fiber 节点
  Fiber 树中保留了所有中间状态

中断时:
  shouldYield() 返回 true → 停止循环
  workInProgress 保留在最后一个处理的节点上

恢复时:
  浏览器空闲 → Scheduler 重新调用 performConcurrentWorkOnRoot
  workInProgress 还在 → 从上次中断的地方继续
```

---

## 四、useTransition 源码

`useTransition` 让开发者能标记低优先级更新。

```js
// ReactFiberHooks.js
function mountTransition() {
  const [isPending, setPending] = mountState(false)
  const start = startTransition.bind(null, setPending)
  const hook = mountWorkInProgressHook()
  hook.memoizedState = start
  return [isPending, start]
}

function startTransition(setPending, callback) {
  setPending(true)  // 立即更新 isPending

  // 将后续更新标记为 TransitionLane（低优先级）
  const prevTransition = ReactCurrentBatchConfig.transition
  ReactCurrentBatchConfig.transition = {}

  try {
    callback()  // 执行回调（其中的 setState 会被标记为低优先级）
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition
  }
}

// 在 dispatchSetState 中会根据 transition 设置不同的 Lane
function requestUpdateLane(fiber) {
  if (ReactCurrentBatchConfig.transition !== null) {
    return TransitionLane  // Transition 中的更新 → 低优先级
  }
  // 其他情况走正常逻辑...
}
```

**useTransition 时间线：**

```
用户输入 → setInput('a')     ────► SyncLane（立即执行）
startTransition → setQuery('a') ──► TransitionLane（低优先级）

时间线:
帧1: [处理 input 更新]  [开始处理 query 更新]
帧2: [用户输入 'b'] → [中断 query 更新] [处理 'b' input 更新]
帧3: [继续处理 query('b') 更新]
```

---

## 五、useDeferredValue 源码

```js
// ReactFiberHooks.js
function mountDeferredValue(value) {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = value
  return value
}

function updateDeferredValue(value) {
  const hook = updateWorkInProgressHook()
  const prevValue = hook.memoizedState

  if (Object.is(value, prevValue)) {
    // 值没变 → 直接返回
    return prevValue
  }

  // 值变了 → 标记当前渲染为低优先级
  // 先返回旧值，新值的渲染可以延迟
  const deferredLane = claimNextTransitionLane()
  currentlyRenderingFiber.lanes = mergeLanes(currentlyRenderingFiber.lanes, deferredLane)

  return prevValue  // 仍然返回旧值，新值的渲染延迟到低优先级
}
```

---

## 六、并发特性全景

```js
// React 并发渲染的完整入口
function performConcurrentWorkOnRoot(root) {
  // 获取当前根节点最高的优先级
  const lanes = getNextLanes(root, NoLanes)

  if (lanes === NoLanes) {
    return null  // 没有工作需要做
  }

  // 检查是否应该同步执行（如任务已过期）
  const shouldTimeSlice = !includesBlockingLane(root, lanes)

  if (shouldTimeSlice) {
    // 并发模式：可中断
    renderRootConcurrent(root, lanes)
  } else {
    // 同步模式：不可中断（如用户交互已过期）
    renderRootSync(root, lanes)
  }

  // Render 阶段结束后，进入 Commit 阶段
  // ...

  return performConcurrentWorkOnRoot.bind(null, root)
}
```

---

## 七、React 18 vs 19 并发差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 并发渲染 | 默认启用 | 默认启用（更稳定） |
| `useTransition` | 返回 `[isPending, startTransition]` | 支持异步函数 |
| `useDeferredValue` | `useDeferredValue(value)` | 新增 `useDeferredValue(value, initialValue)` |
| `useOptimistic` | 不存在 | 新增，支持乐观更新 |
| 中断恢复 | 基于 Fiber 树状态 | 优化恢复逻辑 |
| 自动并发 | 手动标记低优先级 | React Compiler 自动优化 |

```js
// React 19: useTransition 支持异步函数
const [isPending, startTransition] = useTransition()

const handleSubmit = () => {
  startTransition(async () => {
    await saveData()  // React 19 支持 async！
  })
}
```

> React 19 的并发模式更加成熟可靠，新增了 `useOptimistic` 用于乐观更新，同时 React Compiler 可以自动判断哪些更新适合低优先级执行。