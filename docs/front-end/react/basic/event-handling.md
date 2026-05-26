# 事件处理

## React 事件处理

React 的事件命名采用驼峰式（camelCase），并且通过 JSX 传入一个函数作为事件处理函数。

### 基本语法

```tsx
function App() {
  const handleClick = () => {
    console.log('按钮被点击了')
  }

  return (
    <div>
      {/* React 事件：驼峰命名 */}
      <button onClick={handleClick}>点击我</button>

      {/* 原生 HTML：全小写 */}
      {/* <button onclick="handleClick()">点击我</button> */}
    </div>
  )
}
```

### 常用事件

```tsx
function EventDemo() {
  // 鼠标事件
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()  // 阻止默认行为
    e.stopPropagation() // 阻止冒泡
    console.log('点击坐标:', e.clientX, e.clientY)
  }

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('按下了回车键')
    }
  }

  // 表单事件
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('输入值:', e.target.value)
  }

  // 表单提交事件
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('表单提交')
  }

  return (
    <div>
      <button onClick={handleClick}>鼠标事件</button>
      <input onKeyDown={handleKeyDown} placeholder="键盘事件" />
      <input onChange={handleChange} placeholder="表单事件" />
      <form onSubmit={handleSubmit}>
        <button type="submit">提交</button>
      </form>
    </div>
  )
}
```

### 传递参数

```tsx
function App() {
  const handleDelete = (id: number, name: string) => {
    console.log(`删除: ${id}, ${name}`)
  }

  return (
    <div>
      {/* 方式一：箭头函数包装 */}
      <button onClick={() => handleDelete(1, 'Alice')}>删除</button>

      {/* 方式二：bind 绑定 */}
      <button onClick={handleDelete.bind(null, 1, 'Alice')}>删除</button>
    </div>
  )
}
```

### 事件对象

React 中的事件对象是 `SyntheticEvent`（合成事件），是对原生事件的跨浏览器封装。

```tsx
function App() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.type)          // 'click'
    console.log(e.target)        // 触发事件的元素
    console.log(e.currentTarget) // 绑定事件的元素
    console.log(e.nativeEvent)   // 原生事件对象
  }

  return <button onClick={handleClick}>点击</button>
}
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| 合成事件 | 使用合成事件 `SyntheticEvent` | 无变化 |
| 事件委托 | 委托到 root 节点 | 委托到 root 节点 |
| 事件类型 | 标准事件类型 | 无变化 |

> 事件处理在 React 18 和 19 之间基本没有变化。