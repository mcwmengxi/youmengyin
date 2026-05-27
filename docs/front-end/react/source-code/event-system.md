# 事件系统源码

> React 的事件系统（SyntheticEvent）是对原生事件的跨浏览器封装，核心机制是事件委托和事件池化。

---

## 一、React 事件系统的设计目的

1. **跨浏览器兼容**：封装不同浏览器的事件差异
2. **性能优化**：通过事件委托减少内存开销
3. **与 Fiber 架构集成**：事件优先级与调度系统联动

---

## 二、事件委托机制

React 17+ 将事件委托到 **根节点**（`#root`）上，而不是 `document`。

```js
// React 16: 委托到 document
document.addEventListener('click', handler)

// React 17/18/19: 委托到 root 容器
const rootElement = document.getElementById('root')
rootElement.addEventListener('click', handler)
```

**事件委托的好处：**

```
不需要在每个 DOM 节点上绑定事件:

┌─────────────────┐
│      #root       │ ← 只在这里绑定一次
│  ┌─────────┐     │
│  │  <div>  │     │ ← 点击这里的事件冒泡到 root
│  │ ┌─────┐ │     │
│  │ │<btn>│ │     │ ← 点击这里的事件也冒泡到 root
│  │ └─────┘ │     │
│  └─────────┘     │
└─────────────────┘
```

---

## 三、事件注册流程

源码位置: `packages/react-dom/src/events/`

### 创建 Root 时注册事件

```js
// ReactDOMRoot.js
function createRoot(container) {
  const root = createContainer(container, ConcurrentRoot)
  // 在 container 上注册所有需要的事件
  listenToAllSupportedEvents(container)
  return new ReactDOMRoot(root)
}

// 注册所有支持的事件
function listenToAllSupportedEvents(rootContainerElement) {
  // allNativeEvents 是所有需要监听的原生事件集合
  allNativeEvents.forEach(domEventName => {
    // 只监听不需要委托的事件（如 scroll）
    // 需要委托的事件如 click、change 等也在这里注册
    if (!nonDelegatedEvents.has(domEventName)) {
      listenToNativeEvent(domEventName, false, rootContainerElement)
    }
    listenToNativeEvent(domEventName, true, rootContainerElement) // 捕获阶段
  })
}

function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
  let listeningSet = getListeningSetForElement(target)
  const listenerKey = getListenerKey(domEventName, isCapturePhaseListener)

  if (!listeningSet.has(listenerKey)) {
    // 注册事件监听器
    const listener = createEventListenerWrapper(domEventName, isCapturePhaseListener)
    target.addEventListener(domEventName, listener, isCapturePhaseListener)
    listeningSet.add(listenerKey)
  }
}
```

---

## 四、事件触发流程（SyntheticEvent）

### 从原生事件到合成事件

```js
// 事件监听器包装函数
function createEventListenerWrapper(domEventName, isCapturePhase) {
  // 返回的处理函数
  return function dispatchEvent(domEventName, isCapturePhase, nativeEvent) {
    // 1. 获取触发事件的目标 Fiber
    const nativeEventTarget = getEventTarget(nativeEvent)
    let targetInst = getClosestInstanceFromNode(nativeEventTarget)

    // 2. 创建合成事件对象（复用或新建）
    const syntheticEvent = createSyntheticEvent(domEventName, nativeEvent, nativeEventTarget)

    // 3. 模拟捕获/冒泡阶段遍历 Fiber 树
    dispatchEventForPluginEventSystem(
      domEventName,
      syntheticEvent,
      targetInst,
      isCapturePhase
    )
  }
}
```

### dispatchEventForPluginEventSystem - 模拟事件传播

```js
function dispatchEventForPluginEventSystem(
  domEventName,
  syntheticEvent,
  targetInst,
  isCapturePhase
) {
  // 1. 收集事件路径上的所有处理函数
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    domEventName,
    isCapturePhase
  )

  if (listeners.length > 0) {
    // 2. 顺序执行（捕获：从父到子；冒泡：从子到父）
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      // 执行用户注册的事件处理函数
      listener(syntheticEvent)

      if (syntheticEvent.isPropagationStopped()) {
        break  // stopPropagation 被调用
      }
    }
  }
}

// 收集事件路径上的监听器
function accumulateSinglePhaseListeners(targetFiber, eventName, isCapture) {
  const listeners = []

  // 从 target 向上遍历 Fiber 树（通过 return 指针）
  let instance = targetFiber
  while (instance !== null) {
    const stateNode = instance.stateNode
    if (stateNode !== null) {
      // 获取该节点上注册的该事件类型的处理函数
      const listener = getListener(instance, eventName)
      if (listener !== null) {
        // 根据捕获/冒泡阶段决定插入顺序
        if (isCapture) {
          listeners.unshift(listener)  // 捕获：插入头部（父在前）
        } else {
          listeners.push(listener)    // 冒泡：插入尾部（子在前）
        }
      }
    }
    instance = instance.return  // 向上遍历父节点
  }

  return listeners
}
```

**事件传播过程：**

```
DOM树: root → div → button

用户点击 button:
  捕获阶段（从 root 到 button）:
    root (onClickCapture) → div (onClickCapture) → button (onClickCapture)

  冒泡阶段（从 button 到 root）:
    button (onClick) → div (onClick) → root (onClick)
```

---

## 五、合成事件对象（SyntheticEvent）

```js
// SyntheticEvent 构造函数
function SyntheticEvent(
  dispatchConfig,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  this.dispatchConfig = dispatchConfig
  this._targetInst = targetInst
  this.nativeEvent = nativeEvent
  this._dispatchInstances = null

  // 将原生事件对象的属性拷贝到合成事件上
  const Interface = dispatchConfig.Interface
  for (const propName in Interface) {
    const normalize = Interface[propName]
    if (normalize) {
      this[propName] = normalize(nativeEvent)
    } else {
      this[propName] = nativeEvent[propName]
    }
  }

  // 默认行为相关
  this.isDefaultPrevented = false
  this.isPropagationStopped = false
  this.target = nativeEventTarget
  this.currentTarget = null // 在处理过程中动态更新
}

// 阻止默认行为
SyntheticEvent.prototype.preventDefault = function () {
  this.isDefaultPrevented = true
  const event = this.nativeEvent
  if (event.preventDefault) {
    event.preventDefault()
  }
}

// 阻止冒泡
SyntheticEvent.prototype.stopPropagation = function () {
  this.isPropagationStopped = true
  const event = this.nativeEvent
  if (event.stopPropagation) {
    event.stopPropagation()
  }
}

// 持久化（React 17 已废弃事件池）
SyntheticEvent.prototype.persist = function () {
  // React 17+ 不再池化事件，无需 persist
}
```

---

## 六、事件优先级映射

每个事件类型都有对应的优先级，影响更新的调度。

```js
// 事件优先级映射
function getEventPriority(domEventName) {
  switch (domEventName) {
    // 离散事件：高优先级（DiscreteEventPriority）
    case 'click':
    case 'keydown':
    case 'keyup':
    case 'focus':
    case 'blur':
      return DiscreteEventPriority

    // 连续事件：中优先级（ContinuousEventPriority）
    case 'scroll':
    case 'drag':
    case 'mouseMove':
    case 'wheel':
      return ContinuousEventPriority

    // 默认事件：低优先级（DefaultEventPriority）
    default:
      return DefaultEventPriority
  }
}

// 优先级 → Lane 映射
switch (eventPriority) {
  case DiscreteEventPriority:
    lane = SyncLane             // 同步执行（最高）
    break
  case ContinuousEventPriority:
    lane = InputContinuousLane   // 输入级优先级
    break
  case DefaultEventPriority:
  default:
    lane = DefaultLane           // 默认优先级
    break
}
```

---

## 七、React 18 vs 19 事件系统差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 事件委托位置 | root 节点 | root 节点（无变化） |
| 合成事件 | SyntheticEvent | 无变化 |
| 事件池 | 已废弃（v17） | 已废弃 |
| 事件优先级 | 三类优先级映射 | 无变化 |
| 自定义事件支持 | 有限 | 增强的自定义事件支持 |
| Actions | 不支持 | 支持 `formAction` 等新事件属性 |

> React 的事件系统在 18 和 19 之间基本稳定。React 19 主要是在表单事件上扩展了 `formAction` 等属性来支持 Actions 机制，核心的事件委托和合成事件机制没有变化。