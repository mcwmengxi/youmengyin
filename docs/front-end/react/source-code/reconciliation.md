# 协调与 Diff 算法

> React 的 Diff 算法（协调算法 Reconciliation）用于比较新旧虚拟 DOM 树，以最小代价更新真实 DOM。

---

## 一、Diff 算法的三大策略

React 的 Diff 算法基于两个假设，将原本 O(n³) 的复杂度降为 O(n)：

1. **只对同级元素进行 Diff**：不会跨层级比较
2. **不同类型的元素会产生不同的树**：类型变了直接重建
3. **通过 key 来识别元素的稳定性**：key 相同的视为同一元素

源码位置: `packages/react-reconciler/src/ReactChildFiber.js`

---

## 二、reconcileChildren 入口

```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // 首次渲染：直接创建子 Fiber（不做 Diff）
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes)
  } else {
    // 更新：执行 Diff 算法
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,        // 旧的第一个子 Fiber
      nextChildren,          // 新的子元素数组
      renderLanes
    )
  }
}
```

---

## 三、单节点 Diff (reconcileSingleElement)

当新的子节点是单个元素时（不是数组）。

```js
function reconcileSingleElement(
  returnFiber,
  currentFirstChild,
  element,
  renderLanes
) {
  let child = currentFirstChild

  // 遍历旧的同级 Fiber 链表
  while (child !== null) {
    if (child.key === element.key) {
      if (child.elementType === element.type) {
        // key 和 type 都相同 → 复用 Fiber 节点
        const existing = useFiber(child, element.props)
        existing.return = returnFiber
        // 标记其余兄弟节点为删除
        deleteRemainingChildren(returnFiber, child.sibling)
        return existing
      } else {
        // key 相同但 type 不同 → 删除当前及所有兄弟
        deleteRemainingChildren(returnFiber, child)
        break
      }
    } else {
      // key 不同 → 标记此节点删除，继续检查下一个兄弟
      deleteChild(returnFiber, child)
    }
    child = child.sibling
  }

  // 没有可复用的 → 新建 Fiber
  const created = createFiberFromElement(element, returnFiber.mode, renderLanes)
  created.return = returnFiber
  return created
}
```

**单节点 Diff 流程：**

```
旧: [A] [B] [C]
新: [A']

遍历:
1. A.key === A'.key, A.type === A'.type → 复用 A (成为 A')
2. 删除 B, C
```

```
旧: [A] [B] [C]
新: [B']

遍历:
1. A.key !== B'.key → 删除 A
2. B.key === B'.key, B.type === B'.type → 复用 B (成为 B')
3. 删除 C
```

---

## 四、多节点 Diff (reconcileChildrenArray)

当新的子节点是数组时，React 使用更复杂的算法。

```js
function reconcileChildrenArray(
  returnFiber,
  currentFirstChild,
  newChildren,
  renderLanes
) {
  let oldFiber = currentFirstChild
  let newIdx = 0

  // ===== 第一轮：处理相同位置的节点 =====
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      // 旧 Fiber 索引比当前大，说明中间有被删除的
      // 需要进入第二轮
      break
    }

    const newChild = newChildren[newIdx]
    if (oldFiber.key === newChild.key) {
      if (oldFiber.type === newChild.type) {
        // key 和 type 都相同 → 复用
        const existing = useFiber(oldFiber, newChild.props)
        existing.index = newIdx
        lastPlacedIndex = placeChild(existing, lastPlacedIndex, newIdx)
        // 继续处理下一个
        oldFiber = oldFiber.sibling
        continue
      }
      // key 相同但 type 不同 → 不可复用，跳出
      break
    }

    // key 不同 → 不可复用，跳出
    break
  }

  // ===== 情况1：新节点已经处理完 =====
  if (newIdx === newChildren.length) {
    // 删除剩余的旧节点
    deleteRemainingChildren(returnFiber, oldFiber)
    return resultingFirstChild
  }

  // ===== 情况2：旧节点已经处理完 =====
  if (oldFiber === null) {
    // 创建剩余的新节点
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx], renderLanes)
      // ... 链接到 Fiber 树
    }
    return resultingFirstChild
  }

  // ===== 第二轮：处理剩余节点（key 移动/删除/新增） =====
  // 将旧节点存入 Map，key → Fiber
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber)

  for (; newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx]
    const matchedFiber = existingChildren.get(newChild.key)

    if (matchedFiber !== undefined) {
      // 找到同 key 的旧节点
      if (matchedFiber.type === newChild.type) {
        // type 相同 → 复用，判断是否需要移动
        const existing = useFiber(matchedFiber, newChild.props)
        existingChildren.delete(newChild.key)
        lastPlacedIndex = placeChild(existing, lastPlacedIndex, newIdx)
        // placeChild 通过比较 lastPlacedIndex 和 oldIndex 决定是否标记移动
      } else {
        // type 不同 → 删除旧节点，创建新节点
        deleteChild(returnFiber, matchedFiber)
        const newFiber = createChild(returnFiber, newChild, renderLanes)
      }
    } else {
      // 没找到 → 新增
      const newFiber = createChild(returnFiber, newChild, renderLanes)
    }
  }

  // 删除 Map 中还存在的旧节点（新节点中没有）
  existingChildren.forEach(child => deleteChild(returnFiber, child))
}
```

### placeChild - 判断是否需要移动

```js
function placeChild(newFiber, lastPlacedIndex, newIndex) {
  newFiber.index = newIndex

  const current = newFiber.alternate
  if (current !== null) {
    const oldIndex = current.index
    if (oldIndex < lastPlacedIndex) {
      // 旧位置在"最后放置位置"之前 → 需要移动到后面
      newFiber.flags |= Placement
      return lastPlacedIndex
    } else {
      // 旧位置已经在"最后放置位置"之后 → 不需要移动
      return oldIndex
    }
  } else {
    // 新节点，标记插入
    newFiber.flags |= Placement
    return lastPlacedIndex
  }
}
```

---

## 五、图解 Diff 过程

### 场景：节点移动

```
旧:  [A] [B] [C] [D]
新:  [A] [C] [B] [E]

第一轮（逐个比较）:
  OLD index=0 [A] vs NEW index=0 [A]  → key相同, type相同 → 复用A, lastPlacedIndex=0
  OLD index=1 [B] vs NEW index=1 [C]  → key不同 → 跳出第一轮

第二轮（key 映射）:
  旧 Map: { B → Fiber, C → Fiber, D → Fiber }

  NEW index=1 [C] → 在 Map 中找到 C, oldIndex=2, lastPlacedIndex=0
    2 >= 0 → 不需要移动, lastPlacedIndex=2

  NEW index=2 [B] → 在 Map 中找到 B, oldIndex=1, lastPlacedIndex=2
    1 < 2 → 需要移动! 标记 Placement

  NEW index=3 [E] → Map 中没有 → 新增

  删除 Map 中剩余: D → 标记 Deletion
```

### 场景：key 的重要性

```
没有 key（默认使用 index）:
  旧: [A, B, C]
  新: [D, A, B, C]  （头部插入 D）

  index=0: A vs D → 不同 → 删除A, 创建D
  index=1: B vs A → 不同 → 删除B, 创建A
  index=2: C vs B → 不同 → 删除C, 创建B
  index=3: - vs C → 创建C

  结果：全部重建！（性能最差）

有 key:
  旧: [{key:a, val:A}, {key:b, val:B}, {key:c, val:C}]
  新: [{key:d, val:D}, {key:a, val:A}, {key:b, val:B}, {key:c, val:C}]

  key=d → 没有 → 创建
  key=a → 有 → 复用
  key=b → 有 → 复用
  key=c → 有 → 复用

  结果：只创建一个节点，其余复用！（最优）
```

---

## 六、React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Diff 算法核心 | reconcileChildren 的三大策略 | 无变化 |
| key 机制 | 必须唯一 | 无变化 |
| 移动判断 | placeChild 比较 oldIndex | 无变化 |
| 数组 Diff | 两轮遍历 | 无变化 |

> React 的 Diff 算法是经过长期验证的成熟设计，React 18 和 19 在协调算法层面没有本质变化。React 19 的优化主要在 React Compiler 层面（编译时优化），而非运行时 Diff 算法层面。