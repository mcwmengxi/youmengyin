# Portal 传送门

## 什么是 Portal？

Portal 允许将子组件渲染到 DOM 树中不同于父组件的位置，常用于模态框、弹出菜单、提示框等。

## 基本用法

```tsx
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        {children}
      </div>
    </div>,
    document.body // 渲染到 body 下，而不是父组件的 DOM 位置
  )
}

// 使用
function App() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(true)}>打开弹窗</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>弹窗内容</h2>
        <p>这是通过 Portal 渲染的弹窗</p>
      </Modal>
    </div>
  )
}
```

## 常见应用场景

### Tooltip 提示框

```tsx
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({ x: rect.left, y: rect.bottom + 5 })
    }
    setVisible(true)
  }

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={() => setVisible(false)}>
        {children}
      </div>
      {visible && createPortal(
        <div style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 9999 }}>
          {text}
        </div>,
        document.body
      )}
    </>
  )
}
```

### Dropdown 下拉菜单

```tsx
function Dropdown({ items, children }: { items: string[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleClick = () => setOpen(!open)

  return (
    <div>
      <div ref={triggerRef} onClick={handleClick}>{children}</div>
      {open && createPortal(
        <DropdownMenu
          items={items}
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
        />,
        document.body
      )}
    </div>
  )
}
```

## Portal 事件冒泡

Portal 虽然渲染在 DOM 不同位置，但 React 事件冒泡仍然遵循 React 组件树。

```tsx
function Parent() {
  return (
    <div onClick={() => console.log('父组件捕获到事件')}>
      <Modal open={true}>
        <button onClick={() => console.log('弹窗按钮')}>点击</button>
        {/* 点击按钮：先打印"弹窗按钮"，再冒泡打印"父组件捕获到事件" */}
      </Modal>
    </div>
  )
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `createPortal` | `react-dom` 导出 | `react-dom` 导出，无变化 |
| Portal 事件 | 按 React 树冒泡 | 无变化 |
| 预渲染支持 | 实验性 | 正式支持 |

> Portal 在 React 18 和 19 中没有 API 层面的变化。