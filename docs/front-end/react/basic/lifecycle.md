# 组件生命周期

## 概述

React 组件从创建到销毁会经历一系列阶段，称为生命周期。函数组件使用 Hooks 来模拟生命周期行为。

## 类组件生命周期

```tsx
import React from 'react'

class LifecycleDemo extends React.Component {
  // 1. 挂载阶段
  constructor(props) {
    super(props)
    console.log('constructor')
  }

  componentDidMount() {
    console.log('组件已挂载 - 适合发起请求、设置定时器')
  }

  // 2. 更新阶段
  shouldComponentUpdate(nextProps, nextState) {
    console.log('是否应该更新 - 性能优化')
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('组件已更新')
  }

  // 3. 卸载阶段
  componentWillUnmount() {
    console.log('组件即将卸载 - 适合清理定时器、取消请求')
  }

  // 4. 错误处理
  componentDidCatch(error, info) {
    console.log('捕获到错误:', error)
  }

  render() {
    return <div>生命周期演示</div>
  }
}
```

## 函数组件 - 使用 useEffect 模拟生命周期

```tsx
import { useEffect, useState } from 'react'

function LifecycleDemo() {
  const [data, setData] = useState(null)

  // 模拟 componentDidMount（挂载时执行一次）
  useEffect(() => {
    console.log('组件已挂载')
    // 发起数据请求
    fetchData().then(setData)

    // 模拟 componentWillUnmount（清理函数）
    return () => {
      console.log('组件即将卸载，清理资源')
    }
  }, []) // 空依赖数组 = 只执行一次

  // 模拟 componentDidUpdate（每次更新后执行）
  useEffect(() => {
    console.log('组件已更新或挂载')
  })

  // 模拟 componentDidUpdate + 条件判断（特定状态变化时执行）
  useEffect(() => {
    console.log('data 变化了:', data)
  }, [data]) // 仅在 data 变化时执行

  return <div>生命周期演示</div>
}
```

## 生命周期对比

| 阶段 | 类组件 | 函数组件 (Hooks) |
|------|--------|------------------|
| 挂载 | `componentDidMount` | `useEffect(() => {}, [])` |
| 更新 | `componentDidUpdate` | `useEffect(() => {})` 或 `useEffect(() => {}, [dep])` |
| 卸载 | `componentWillUnmount` | `useEffect` 返回的清理函数 |
| 错误处理 | `componentDidCatch` | `ErrorBoundary` 类组件（无 Hook 替代） |

## useLayoutEffect vs useEffect

```tsx
import { useEffect, useLayoutEffect } from 'react'

function LayoutDemo() {
  // useEffect: 在浏览器绘制之后异步执行（不会阻塞渲染）
  useEffect(() => {
    console.log('useEffect - 绘制后执行')
  })

  // useLayoutEffect: 在浏览器绘制之前同步执行（会阻塞渲染）
  useLayoutEffect(() => {
    console.log('useLayoutEffect - 绘制前执行')
  })

  return <div>Layout 演示</div>
}
```

| 对比 | useEffect | useLayoutEffect |
|------|-----------|-----------------|
| 执行时机 | 渲染提交到屏幕**之后** | 渲染提交到屏幕**之前** |
| 是否阻塞渲染 | 不阻塞 | 阻塞 |
| 适用场景 | 数据请求、订阅 | 读取 DOM 布局、同步更新 |

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `componentWillMount` | 已废弃（UNSAFE_） | 已废弃 |
| `componentWillReceiveProps` | 已废弃 | 已废弃 |
| `componentWillUpdate` | 已废弃 | 已废弃 |
| 严格模式 useEffect | 开发环境执行两次 | 开发环境执行两次 |
| `useEffect` 清理时机 | 同步执行 | 异步执行（性能优化） |

> React 19 中 `useEffect` 的清理函数改为异步执行，减少了浏览器卡顿，这是一个重要的性能改进。