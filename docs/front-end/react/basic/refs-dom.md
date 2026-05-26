# Refs 与 DOM 操作

## useRef

`useRef` 用于保存一个在组件整个生命周期内不变的值，常用于访问 DOM 元素。

```tsx
import { useRef, useEffect } from 'react'

function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 组件挂载后自动聚焦
    inputRef.current?.focus()
  }, [])

  const handleClick = () => {
    console.log('输入值:', inputRef.current?.value)
  }

  return (
    <div>
      <input ref={inputRef} placeholder="自动聚焦" />
      <button onClick={handleClick}>获取值</button>
    </div>
  )
}
```

## useRef vs useState

```tsx
function RefVsState() {
  const countRef = useRef(0)
  const [countState, setCountState] = useState(0)

  const handleRefClick = () => {
    countRef.current += 1
    console.log('ref:', countRef.current) // 值已更新但不会触发重渲染
  }

  return (
    <div>
      <p>useRef 值 (不触发渲染): {countRef.current}</p>
      <p>useState 值 (会触发渲染): {countState}</p>
      <button onClick={handleRefClick}>ref +1</button>
      <button onClick={() => setCountState(c => c + 1)}>state +1</button>
    </div>
  )
}
```

| 对比 | useRef | useState |
|------|--------|----------|
| 更新时是否重新渲染 | 否 | 是 |
| 值是否可变 | 可直接修改 `.current` | 必须通过 setState |
| 典型用途 | DOM 引用、保存计时器 ID | UI 数据 |

## forwardRef

将 ref 转发给子组件的内部 DOM 元素。

```tsx
import { forwardRef } from 'react'

interface InputProps {
  placeholder?: string
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} placeholder={props.placeholder} />
})

// 使用
function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="自定义输入框" />
      <button onClick={() => inputRef.current?.focus()}>聚焦</button>
    </div>
  )
}
```

### React 19: ref 作为普通 prop

```tsx
// React 19 中不再需要 forwardRef！ref 可以直接作为 prop 传递

// React 18 写法
const MyInput = forwardRef<HTMLInputElement, { placeholder?: string }>(
  (props, ref) => <input ref={ref} {...props} />
)

// React 19 新写法（不再需要 forwardRef）
function MyInput({ placeholder, ref }: { placeholder?: string; ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} placeholder={placeholder} />
}
```

## useImperativeHandle

限制子组件暴露给父组件的接口。

```tsx
import { forwardRef, useRef, useImperativeHandle } from 'react'

interface ChildHandle {
  focus: () => void
  clear: () => void
}

const Child = forwardRef<ChildHandle>((_, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }))

  return <input ref={inputRef} />
})

function Parent() {
  const childRef = useRef<ChildHandle>(null)

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.current?.focus()}>聚焦</button>
      <button onClick={() => childRef.current?.clear()}>清空</button>
    </div>
  )
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `forwardRef` | 必须使用 `forwardRef` 转发 ref | ref 可直接作为 prop 传递，不再需要 `forwardRef` |
| `ref` 清理函数 | 不支持 | 支持回调 ref 返回清理函数 |
| `ref` 作为 prop | 不支持 | 支持（`ref` 不再是保留 prop） |

```tsx
// React 19: ref 清理函数
<input ref={(el) => {
  // 当 ref 被清除或改变时自动调用
  return () => {
    console.log('清理 ref')
  }
}} />
```

> React 19 中最显著的变化是 **不再需要 forwardRef**，ref 可以像普通 prop 一样直接传递，这是一个非常实用的简化。