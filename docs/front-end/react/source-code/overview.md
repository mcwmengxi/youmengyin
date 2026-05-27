# React 源码架构概览

> 基于 React 18 源码，梳理整体架构、核心模块与工作流程。React 19 在此基础上新增了 React Compiler 和 Server Components 等机制。

---

## 一、React 核心架构

React 18 源码主要由三大模块构成：

```
┌──────────────────────────────────────────────┐
│                  React Core                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  React   │  │Reconciler│  │ Scheduler │  │
│  │(定义组件)│  │ (协调器) │  │ (调度器)  │  │
│  └──────────┘  └──────────┘  └───────────┘  │
│       │              │              │          │
│       ▼              ▼              ▼          │
│  ┌──────────────────────────────────────┐    │
│  │            Renderer (渲染器)          │    │
│  │  react-dom / react-native / ...      │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

### 1. React Core（核心层）

定义组件 API、Hooks、Element 等，不涉及平台相关逻辑。

```js
// 源码位置：packages/react/
├── src/
│   ├── React.js              # React 入口
│   ├── ReactElement.js       # createElement 实现
│   ├── ReactHooks.js         # Hooks 调度入口
│   ├── ReactContext.js       # Context 实现
│   └── ReactChildren.js      # Children 工具
```

核心 API：
- `createElement()`: 创建 ReactElement（即虚拟 DOM 节点）
- `Component` / `PureComponent`: 类组件基类
- `createRef` / `forwardRef`: Ref 相关
- `createContext`: 创建上下文
- `useState` / `useEffect` / `useMemo` 等 Hooks

### 2. Reconciler（协调器）

负责 Fiber 树的构建和更新，是 React 的"大脑"。

```js
// 源码位置：packages/react-reconciler/
├── src/
│   ├── ReactFiber.js              # Fiber 节点创建
│   ├── ReactFiberBeginWork.js     # 开始处理 Fiber（beginWork）
│   ├── ReactFiberCompleteWork.js  # 完成 Fiber（completeWork）
│   ├── ReactFiberCommitWork.js    # commit 阶段
│   ├── ReactFiberHooks.js         # Hooks 的真正实现
│   ├── ReactFiberReconciler.js    # 协调入口
│   ├── ReactChildFiber.js         # Diff 算法（reconcileChildren）
│   └── ReactFiberLane.js          # Lane 优先级模型
```

核心职责：
- 通过 DFS（深度优先遍历）构建 Fiber 树
- 执行 Diff 算法找出变化
- 产出 Effect List（副作用链表）
- 处理优先级调度（Lane 模型）

### 3. Scheduler（调度器）

负责管理任务优先级，确保高优先级任务先执行。

```js
// 源码位置：packages/scheduler/
├── src/
│   ├── Scheduler.js           # 调度器入口
│   ├── SchedulerMinHeap.js    # 最小堆（任务优先级队列）
│   └── SchedulerPriorities.js # 优先级定义
```

核心职责：
- 维护任务队列（基于最小堆）
- 时间切片（Time Slicing）：每 5ms 让出主线程
- 通过 `MessageChannel` 实现宏任务调度
- 支持 `requestIdleCallback` 的 polyfill

### 4. Renderer（渲染器）

负责将协调结果渲染到具体平台。

```js
// react-dom 源码位置：packages/react-dom/
├── src/
│   ├── client/
│   │   ├── ReactDOMRoot.js         # createRoot 实现
│   │   └── ReactDOMComponent.js    # DOM 操作
│   └── events/
│       ├── ReactBrowserEventEmitter.js  # 事件绑定
│       └── SyntheticEvent.js           # 合成事件
```

---

## 二、Fiber 节点结构

Fiber 是 React 中最核心的数据结构，每个组件实例对应一个 Fiber 节点。

```ts
// 简化的 Fiber 节点结构（ReactFiber.js）
type Fiber = {
  // ===== 节点标识 =====
  tag: WorkTag             // 节点类型（FunctionComponent / ClassComponent / HostComponent 等）
  key: null | string
  elementType: any         // 组件类型（函数 / 类）
  type: any                // 对于 HostComponent 是标签名如 'div'

  // ===== 树结构（关键！）=====
  return: Fiber | null     // 父节点
  child: Fiber | null      // 第一个子节点
  sibling: Fiber | null    // 下一个兄弟节点
  // ⬆️ 这三个指针构成了 Fiber 树的双向链表结构

  // ===== 工作单元 =====
  pendingProps: any        // 即将更新的 props
  memoizedProps: any       // 上次渲染的 props
  memoizedState: any       // 上次渲染的 state（Hooks 链表头）
  updateQueue: any         // 更新队列（setState 产生的更新）

  // ===== 副作用 =====
  flags: Flags             // 副作用标记（Placement / Update / Deletion）
  subtreeFlags: Flags      // 子树副作用标记
  deletions: Fiber[] | null // 要删除的子节点

  // ===== 调度 =====
  lanes: Lanes             // 优先级
  childLanes: Lanes        // 子节点优先级

  // ===== 双缓存 =====
  alternate: Fiber | null  // 指向另一棵树对应的 Fiber（current ↔ workInProgress）

  // ===== 状态 =====
  stateNode: any           // 对应的 DOM 节点 或 类组件实例
}
```

### Fiber 树结构图解

```
          App (Fiber)
         /    |    \
    child   sibling  sibling
      ↓       ↓        ↓
    Header → Main → Footer
             /  \
          child sibling
            ↓     ↓
          div →  div
```

---

## 三、双缓存机制（Double Buffering）

React 同时维护两棵 Fiber 树：

```
current Fiber Tree          workInProgress Fiber Tree
(屏幕上呈现的)              (正在内存中构建的)
      │                            │
      ├──────── alternate ────────►│
      │◄─────── alternate ─────────┤
```

切换时机：commit 阶段完成后，`workInProgress` 变为 `current`。

```js
// root.current = 当前树
// root.finishedWork = 已完成的工作树
// 切换：
root.current = root.finishedWork
```

---

## 四、React 工作流程总览

```
触发更新（setState / useState / render）
    │
    ▼
创建 Update 对象，加入 UpdateQueue
    │
    ▼
调度更新（Scheduler 根据优先级安排）
    │
    ▼
┌────────── Render 阶段（可中断）──────────┐
│  beginWork: 自顶向下递进                  │
│  completeWork: 自底向上归并               │
│  产出 Effect List                         │
└──────────────────────────────────────────┘
    │
    ▼
┌────────── Commit 阶段（不可中断）─────────┐
│  BeforeMutation: DOM 操作前               │
│  Mutation: 执行 DOM 操作                   │
│  Layout: DOM 操作后，执行 useLayoutEffect │
└──────────────────────────────────────────┘
    │
    ▼
浏览器绘制 → 执行 useEffect
```

---

## 五、React 18 vs 19 源码架构变化

| 模块 | React 18 | React 19 |
|------|----------|----------|
| React Core | 标准 Hooks 实现 | 新增 `use()`、`useOptimistic` 等 API |
| Reconciler | 并发模式可中断渲染 | 调度器增强，更好地支持 Actions |
| Scheduler | Lane 模型 + 5ms 时间切片 | 优化优先级调度 |
| Renderer | react-dom 传统渲染 | 新增 react-server-dom（Server Components） |
| React Compiler | 无 | 新增 Forget 编译器，自动 memo 优化 |
| Ref 机制 | forwardRef 包裹 | ref 作为普通 prop，内部简化 |

---

## 六、关键源码入口

| 想要理解的 | 看这里 |
|-----------|--------|
| 首次渲染流程 | `ReactDOMRoot.js` → `createRoot` → `render` |
| setState 更新流程 | `ReactFiberClassComponent.js` → `enqueueSetState` |
| useState 更新流程 | `ReactFiberHooks.js` → `dispatchSetState` |
| Diff 算法 | `ReactChildFiber.js` → `reconcileChildren` |
| 任务调度 | `Scheduler.js` → `unstable_scheduleCallback` |
| commit 阶段 DOM 操作 | `ReactFiberCommitWork.js` |
| Lane 优先级 | `ReactFiberLane.js` |

---

> 建议结合 [React 官方源码](https://github.com/facebook/react) 的 `packages/` 目录阅读，使用注释和断点调试加深理解。