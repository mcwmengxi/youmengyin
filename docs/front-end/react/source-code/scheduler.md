# 调度器原理（Scheduler）

> Scheduler 是 React 的独立调度模块，负责管理任务优先级和执行时机，是实现时间切片和并发渲染的基础。

---

## 一、Scheduler 核心概念

源码位置: `packages/scheduler/`

Scheduler 解决的问题：当有多个任务（用户输入、动画、数据更新）时，如何安排执行顺序以保持 UI 响应。

```
优先级（从高到低）：
┌─────────────────────────┐
│ ImmediatePriority (1)   │ ← 必须立即执行（如用户点击）
├─────────────────────────┤
│ UserBlockingPriority(2) │ ← 用户交互（如输入、滚动）
├─────────────────────────┤
│ NormalPriority (3)      │ ← 普通数据更新
├─────────────────────────┤
│ LowPriority (4)         │ ← 低优先级更新
├─────────────────────────┤
│ IdlePriority (5)        │ ← 空闲时才执行
└─────────────────────────┘
```

---

## 二、时间切片（Time Slicing）

### 核心思路

每个工作单元（Fiber）处理完后检查是否超时（默认 5ms），如果超时就让出主线程。

```js
// 时间切片配置
const frameLength = 5  // 每帧给 React 5ms

// React 不使用 requestIdleCallback，而是用 MessageChannel 模拟
// 原因：
// 1. requestIdleCallback 回调频率太低（~20ms）
// 2. 浏览器兼容性
// 3. 不够灵活
```

### MessageChannel 模拟

```js
// Scheduler 中的宏任务实现
const channel = new MessageChannel()
const port = channel.port2

// 当有任务需要调度时
channel.port1.onmessage = () => {
  // 在当前帧执行任务
  performWorkUntilDeadline()
}

// 请求在下一个事件循环执行
function requestHostCallback(callback) {
  scheduledHostCallback = callback
  port.postMessage(null)
}
```

---

## 三、最小堆任务队列

Scheduler 使用**最小堆**管理任务优先级。堆顶始终是截止时间最近（即优先级最高）的任务。

```js
// 任务节点结构
type Task = {
  id: number
  callback: Function | null     // 要执行的回调
  priorityLevel: number         // 优先级
  startTime: number             // 任务开始时间
  expirationTime: number        // 过期时间（越小越优先）
  sortIndex: number             // 排序索引（= expirationTime）
}

// 最小堆操作
const taskQueue = []  // 已就绪的任务队列（按 expirationTime 排序）
const timerQueue = [] // 延迟任务队列（按 startTime 排序）
```

### 堆操作

```js
// 向最小堆添加任务
function push(heap, node) {
  const index = heap.length
  heap.push(node)
  siftUp(heap, node, index)  // 上浮到合适位置
}

// 上浮操作
function siftUp(heap, node, i) {
  let index = i
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1
    const parent = heap[parentIndex]
    if (compare(parent, node) > 0) {
      // 父节点比当前节点大，交换
      heap[parentIndex] = node
      heap[index] = parent
      index = parentIndex
    } else {
      return
    }
  }
}

// 从最小堆取出堆顶（最高优先级任务）
function pop(heap) {
  const first = heap[0]
  if (first !== undefined) {
    const last = heap.pop()
    if (last !== first) {
      heap[0] = last
      siftDown(heap, last, 0)  // 下沉
    }
    return first
  }
  return null
}

// 下沉操作
function siftDown(heap, node, i) {
  let index = i
  const length = heap.length
  const halfLength = length >>> 1

  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1
    const left = heap[leftIndex]
    const rightIndex = leftIndex + 1
    const right = heap[rightIndex]

    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } else {
        heap[index] = left
        heap[leftIndex] = node
        index = leftIndex
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right
      heap[rightIndex] = node
      index = rightIndex
    } else {
      return
    }
  }
}

// 比较函数
function compare(a, b) {
  // sortIndex 小的优先（即 expirationTime 小的先执行）
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}
```

### 最小堆可视化

```
初始队列:
         5ms
       /     \
     10ms    15ms
    /   \
  20ms  25ms

取出堆顶 (5ms 最高优先级):
         10ms
       /      \
     20ms     15ms
    /
  25ms

加入新任务 (8ms):
         8ms
       /     \
     10ms    15ms
    /   \
  20ms  25ms
```

---

## 四、workLoop 工作循环

```js
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime

  // 将 timerQueue 中到期的任务移到 taskQueue
  advanceTimers(currentTime)

  // 取出当前最高优先级任务
  currentTask = peek(taskQueue)

  while (currentTask !== null) {
    // 如果任务未过期，且已经没有剩余时间 → 暂停
    if (currentTask.expirationTime > currentTime && !hasTimeRemaining) {
      break
    }

    // 执行任务回调
    const callback = currentTask.callback
    if (typeof callback === 'function') {
      currentTask.callback = null

      // 回调返回一个函数 → 说明任务还没完成，继续调度
      const continuationCallback = callback(currentTask.expirationTime <= currentTime)
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback
      } else {
        // 任务完成，从堆中移除
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue)
        }
      }
    } else {
      pop(taskQueue)
    }

    currentTask = peek(taskQueue)
  }

  // 返回是否还有待处理任务
  return currentTask !== null
}
```

---

## 五、完整调度流程

```js
// 1. 调度一个任务
function unstable_scheduleCallback(priorityLevel, callback, options) {
  const currentTime = getCurrentTime()

  let startTime
  if (options?.delay) {
    startTime = currentTime + options.delay
  } else {
    startTime = currentTime
  }

  // 根据优先级计算过期时间
  let timeout
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1     // 立即过期
      break
    case UserBlockingPriority:
      timeout = 250    // 250ms 后过期
      break
    case NormalPriority:
      timeout = 5000   // 5s 后过期
      break
    case LowPriority:
      timeout = 10000  // 10s 后过期
      break
    case IdlePriority:
      timeout = 1073741823  // 永不过期
      break
  }

  const expirationTime = startTime + timeout

  const newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  }

  // 延迟任务
  if (startTime > currentTime) {
    newTask.sortIndex = startTime
    push(timerQueue, newTask)  // 放入延迟队列
    // 如果这个任务是延迟队列的第一个，设置一个定时器
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      requestHostTimeout(handleTimeout, startTime - currentTime)
    }
  } else {
    newTask.sortIndex = expirationTime
    push(taskQueue, newTask)  // 放入就绪队列
    // 请求调度
    requestHostCallback(flushWork)
  }

  return newTask
}

// 2. 执行回调的包装函数
function flushWork(hasTimeRemaining, initialTime) {
  return workLoop(hasTimeRemaining, initialTime)
}

// 3. 工作循环入口
function performWorkUntilDeadline() {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime()
    const hasTimeRemaining = true
    const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime)

    if (hasMoreWork) {
      // 还有任务，继续调度
      port.postMessage(null)
    } else {
      scheduledHostCallback = null
    }
  }
}
```

---

## 六、Lane 优先级模型

React 内部使用 **Lane（车道）** 模型替代了之前的 ExpirationTime 模型。

```js
// ReactFiberLane.js
// Lane 使用二进制位来表示优先级（位运算高效）
export const TotalLanes = 31

export const NoLanes =    0b0000000000000000000000000000000
export const SyncLane =   0b0000000000000000000000000000001  // 同步优先级（最高）

// 用户交互
export const InputContinuousLane = 0b0000000000000000000000000000100
export const DefaultLane =         0b0000000000000000000000000010000

// 空闲
export const IdleLane =            0b0100000000000000000000000000000

// 离线（离屏）
export const OffscreenLane =       0b1000000000000000000000000000000
```

### Lane 核心操作

```js
// 合并多个 Lane
function mergeLanes(a, b) {
  return a | b
}

// 取交集
function intersectLanes(a, b) {
  return a & b
}

// 获取最高优先级的 Lane（取最低位）
function getHighestPriorityLane(lanes) {
  return lanes & -lanes  // 位运算技巧！
}

// 示例:
// lanes = 0b0000101000
// -lanes = 0b1111011000
// & =      0b0000001000  ← 最低位的1（最高优先级）
```

### 为什么用 Lane 而不是数字？

| 模型 | 优势 | 劣势 |
|------|------|------|
| ExpirationTime | 直观 | 无法表达多任务并发 |
| Lane（位运算） | 可同时标记多个优先级的任务 | 只有 31 个车道 |

```
Lane 可以同时表示多个任务:
  SyncLane | DefaultLane = 0b0000000000000000000000000010001

这意味着 Fiber 上有两个不同优先级的更新在等待：
  - 同步更新（如焦点事件）
  - 默认优先级更新（如数据请求返回）
```

---

## 七、React 18 vs 19 调度器差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 时间切片 | 5ms 切片 | 优化切片策略 |
| Lane 模型 | 31 个 Lane | 无变化 |
| 任务队列 | 最小堆 | 无变化 |
| MessageChannel | 使用 | 使用 |
| Scheduler 独立性 | 独立包 | 独立包（无 API 变化） |

> 调度器的核心实现（时间切片、最小堆、Lane 模型）在 React 19 中没有显著变化。React 19 更多地是在上层（Actions、`use` API 等）做了改进，调度器依然稳定可靠。