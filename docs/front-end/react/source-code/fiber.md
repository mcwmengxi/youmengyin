# Fiber 架构深度解析

> Fiber 是 React 16+ 的核心架构，是实现可中断渲染、优先级调度、时间切片的基础数据结构。

---

## 一、为什么需要 Fiber？

### React 15 的问题：Stack Reconciler

React 15 使用的是栈协调器（Stack Reconciler），DFS 递归遍历组件树，**一旦开始渲染就无法中断**。

```
递归调用栈（不可中断）：
App()
  ├── Header()
  ├── Main()
  │     ├── Sidebar()
  │     │     ├── Menu()
  │     │     └── ...
  │     └── Content()
  └── Footer()
```

当组件树很大时，主线程被长时间占用（可能 > 16ms），导致掉帧、卡顿。

### Fiber 的解决方案

Fiber 将渲染工作**分解为小的工作单元**，每次只执行一个 Fiber 节点的处理，然后检查是否需要让出主线程。

```
Fiber 工作循环（可中断）：
执行 Fiber1 → 还有剩余时间？
  YES → 执行 Fiber2 → 还有剩余时间？
  YES → 执行 Fiber3 → ...
  NO  → 让出主线程，等待下一帧继续
```

---

## 二、Fiber 节点的创建

源码位置: `packages/react-reconciler/src/ReactFiber.js`

```js
// 简化的 createFiber 实现
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

function FiberNode(tag, pendingProps, key) {
  // 实例属性
  this.tag = tag                // 节点类型
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null

  // Fiber 树结构（链表）
  this.return = null            // 父 Fiber
  this.child = null             // 第一个子 Fiber
  this.sibling = null           // 下一个兄弟 Fiber
  this.index = 0                // 在兄弟节点中的索引

  // 工作相关
  this.pendingProps = pendingProps  // 待处理的 props
  this.memoizedProps = null         // 已生效的 props
  this.memoizedState = null         // 已生效的 state
  this.updateQueue = null           // 更新队列

  // 副作用
  this.flags = NoFlags              // 当前节点的副作用标记
  this.subtreeFlags = NoFlags       // 子树副作用标记
  this.deletions = null

  // 调度
  this.lanes = NoLanes              // 当前优先级
  this.childLanes = NoLanes         // 子节点优先级

  // 双缓存
  this.alternate = null             // 指向另一棵树对应的 Fiber
}
```

### Fiber 的 tag 类型

```js
// ReactWorkTags.js
export const FunctionComponent = 0
export const ClassComponent = 1
export const IndeterminateComponent = 2  // 尚未确定是函数还是类
export const HostRoot = 3                // 根节点（ReactDOM.render/Root）
export const HostComponent = 5           // 原生 DOM 节点（div、span 等）
export const HostText = 6                // 文本节点
export const Fragment = 7
export const SuspenseComponent = 13
export const OffscreenComponent = 22     // React 18 新增（keep-alive 基础）
```

---

## 三、工作循环：Render 阶段

Render 阶段的核心是 **深度优先遍历** Fiber 树，分为 `beginWork` 和 `completeWork` 两个阶段。

### beginWork（递 - 自顶向下）

源码位置: `packages/react-reconciler/src/ReactFiberBeginWork.js`

```js
function beginWork(current, workInProgress, renderLanes) {
  // 根据 tag 分发到不同的处理函数
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, renderLanes)
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderLanes)
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes)
    case HostText:
      return updateHostText(current, workInProgress)
    // ... 更多类型
  }
}
```

beginWork 主要做：
1. 计算新 state / props
2. 执行 render 函数 / 类组件的 render 方法
3. 执行 Diff 算法生成子 Fiber
4. 返回第一个子 Fiber（继续向下遍历）

```js
// 简化：FunctionComponent 的 beginWork
function updateFunctionComponent(current, workInProgress, renderLanes) {
  // 获取 Hooks 链表
  workInProgress.memoizedState = current ? current.memoizedState : null
  // 执行函数组件，返回 JSX（ReactElement）
  const nextChildren = renderWithHooks(current, workInProgress, Component, props)
  // Diff 子节点，生成子 Fiber
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}
```

### completeWork（归 - 自底向上）

源码位置: `packages/react-reconciler/src/ReactFiberCompleteWork.js`

```js
function completeWork(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case HostComponent:
      // 创建 / 更新 DOM 节点
      if (!current) {
        // 首次渲染：创建 DOM 实例
        const instance = createInstance(workInProgress.type, workInProgress.pendingProps)
        appendAllChildren(instance, workInProgress)
        workInProgress.stateNode = instance
      } else {
        // 更新：计算需要更新的属性
        updateHostComponent(current, workInProgress)
      }
      // 收集子树的 flags
      bubbleProperties(workInProgress)
      return null
  }
}
```

### 遍历过程示意图

```
            beginWork                          completeWork
        ┌──────────────┐                  ┌──────────────┐
        │     App      │ ───────────────►  │     App      │
        └──────┬───────┘                  └──────────────┘
               ▼                                    ▲
        ┌──────────────┐                  ┌──────────────┐
        │   Header     │ ───────────────►  │   Header     │
        └──────────────┘                  └──────────────┘
               ▼                                    ▲
        ┌──────────────┐                  ┌──────────────┐
        │    Main      │ ───────────────►  │    Main      │
        └──────┬───────┘                  └──────────────┘
               ▼                                    ▲
        ┌──────────────┐                  ┌──────────────┐
        │   Content    │ ───────────────►  │   Content    │
        └──────────────┘                  └──────────────┘
```

---

## 四、Effect List（副作用链表）

Render 阶段完成后，React 将所有有副作用的 Fiber 串联成单向链表，Commit 阶段只遍历这个链表。

```js
// 收集副作用标记
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags
  let child = completedWork.child
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags
    child = child.sibling
  }
  completedWork.subtreeFlags = subtreeFlags
}
```

### 副作用类型

```js
// ReactFiberFlags.js
export const Placement =      0b00000000000000000000000010   // 插入
export const Update =         0b00000000000000000000000100   // 更新
export const Deletion =       0b00000000000000000000001000   // 删除
export const ChildDeletion =  0b00000000000000000000010000   // 子节点删除
export const Passive =        0b00000000000010000000000000   // useEffect
export const LayoutMask =     0b00000000000001000000000000   // useLayoutEffect
```

---

## 五、Commit 阶段（不可中断）

源码位置: `packages/react-reconciler/src/ReactFiberCommitWork.js`

Commit 阶段分为三个子阶段：

```js
function commitRoot(root) {
  // 获取副作用链表
  const finishedWork = root.finishedWork

  // 1. BeforeMutation: DOM 操作之前
  commitBeforeMutationEffects(root, finishedWork)
  // 执行 getSnapshotBeforeUpdate（类组件）

  // 2. Mutation: 执行 DOM 增删改
  commitMutationEffects(root, finishedWork)
  // 执行 Placement、Update、Deletion 对应的 DOM 操作

  // 3. Layout: DOM 操作之后
  commitLayoutEffects(root, finishedWork)
  // 执行 useLayoutEffect 的回调

  // 切换双缓存树
  root.current = finishedWork
}
```

### Phase 1: BeforeMutation

```js
function commitBeforeMutationEffects(root, finishedWork) {
  // 递归遍历 Fiber 树
  while (nextEffect !== null) {
    const flags = nextEffect.flags
    if ((flags & Snapshot) !== NoFlags) {
      // 类组件：getSnapshotBeforeUpdate
      commitBeforeMutationEffectOnFiber(nextEffect)
    }
    nextEffect = nextEffect.nextEffect
  }
}
```

### Phase 2: Mutation

```js
function commitMutationEffects(root, finishedWork) {
  while (nextEffect !== null) {
    const flags = nextEffect.flags

    // 删除
    if ((flags & ChildDeletion) !== NoFlags) {
      commitDeletion(root, nextEffect)
    }

    // 插入/移动
    if ((flags & Placement) !== NoFlags) {
      commitPlacement(nextEffect)
      nextEffect.flags &= ~Placement // 清除标记
    }

    // 更新
    if ((flags & Update) !== NoFlags) {
      commitUpdate(nextEffect)
    }

    nextEffect = nextEffect.nextEffect
  }
}
```

### Phase 3: Layout

```js
function commitLayoutEffects(root, finishedWork) {
  while (nextEffect !== null) {
    const flags = nextEffect.flags
    if ((flags & LayoutMask) !== NoFlags) {
      // 执行 useLayoutEffect 的销毁函数和回调
      commitLayoutEffectOnFiber(root, nextEffect)
    }
    nextEffect = nextEffect.nextEffect
  }
}
```

---

## 六、React 18 vs 19 Fiber 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Fiber 节点结构 | 当前结构 | 基本不变，增加了 Action 相关字段 |
| beginWork | 标准流程 | 增加了对 `use()` 的处理分支 |
| Commit 阶段 | 同步不可中断 | 同步不可中断（无变化） |
| 并发中断恢复 | 支持 | 支持，恢复性能优化 |

> Fiber 架构在 React 18 和 19 中没有根本性变化。React 19 主要在上层 API 和编译优化层面做了改进，Fiber 核心仍是稳定基础。