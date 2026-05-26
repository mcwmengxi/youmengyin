# 组件组合与继承

## 组合 vs 继承

React 推荐使用**组合**而非继承来构建组件。

## 组合模式

### 1. children 插槽

```tsx
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header>头部</header>
      <main>{children}</main>
      <footer>底部</footer>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <h1>页面内容</h1>
    </Layout>
  )
}
```

### 2. 具名插槽（多 children）

```tsx
interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
}

function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{left}</div>
      <div style={{ flex: 1 }}>{right}</div>
    </div>
  )
}

function App() {
  return (
    <SplitPane
      left={<div>左侧内容</div>}
      right={<div>右侧内容</div>}
    />
  )
}
```

### 3. 特例（Specialization）

通过组合实现类似继承中"覆盖"的效果。

```tsx
// 通用组件
function Dialog({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

// 特例：基于通用组件创建特定场景组件
function WelcomeDialog() {
  return (
    <Dialog title="欢迎">
      <p>感谢访问我们的网站</p>
    </Dialog>
  )
}

function ErrorDialog({ message }: { message: string }) {
  return (
    <Dialog title="错误">
      <p style={{ color: 'red' }}>{message}</p>
    </Dialog>
  )
}
```

## 复合组件模式（Compound Components）

```tsx
import { createContext, useContext, useState } from 'react'

// Tabs 复合组件
interface TabsContextType {
  activeIndex: number
  setActiveIndex: (index: number) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function Tabs({ children, defaultIndex = 0 }: { children: React.ReactNode; defaultIndex?: number }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>
}

function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const context = useContext(TabsContext)!
  return (
    <button
      className={context.activeIndex === index ? 'active' : ''}
      onClick={() => context.setActiveIndex(index)}
    >
      {children}
    </button>
  )
}

function TabPanels({ children }: { children: React.ReactNode }) {
  const context = useContext(TabsContext)!
  return <div>{React.Children.toArray(children)[context.activeIndex]}</div>
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return <div className="tab-panel">{children}</div>
}

// 使用
function App() {
  return (
    <Tabs defaultIndex={0}>
      <TabList>
        <Tab index={0}>标签1</Tab>
        <Tab index={1}>标签2</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>内容1</TabPanel>
        <TabPanel>内容2</TabPanel>
      </TabPanels>
    </Tabs>
  )
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 组合模式 | 推荐 | 推荐 |
| 继承 | 不推荐 | 不推荐 |
| 复合组件 | 可用 | 可用，无变化 |

> 组合模式在 React 18 和 19 中没有变化，始终是 React 官方推荐的构建方式。