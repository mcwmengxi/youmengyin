# 表单处理

## 受控组件（推荐）

受控组件中，表单数据由 React 的 state 管理，这是推荐的方式。

```tsx
import { useState } from 'react'

function LoginForm() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('提交数据:', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="用户名"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="密码"
      />
      <label>
        <input
          name="remember"
          type="checkbox"
          checked={form.remember}
          onChange={handleChange}
        />
        记住我
      </label>
      <button type="submit">登录</button>
    </form>
  )
}
```

## 非受控组件

使用 `useRef` 直接从 DOM 获取表单值，React 不管理表单状态。

```tsx
import { useRef } from 'react'

function SimpleForm() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('输入值:', inputRef.current?.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="默认值" />
      <button type="submit">提交</button>
    </form>
  )
}
```

## 常见表单元素

### select 下拉框

```tsx
function SelectDemo() {
  const [city, setCity] = useState('beijing')
  const [cities, setCities] = useState<string[]>([])

  return (
    <div>
      {/* 单选 */}
      <select value={city} onChange={e => setCity(e.target.value)}>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="shenzhen">深圳</option>
      </select>

      {/* 多选 */}
      <select
        multiple
        value={cities}
        onChange={e => {
          const values = Array.from(e.target.selectedOptions, o => o.value)
          setCities(values)
        }}
      >
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
        <option value="shenzhen">深圳</option>
      </select>
    </div>
  )
}
```

### radio 单选框

```tsx
function RadioDemo() {
  const [gender, setGender] = useState('male')

  return (
    <div>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={gender === 'male'}
          onChange={e => setGender(e.target.value)}
        />
        男
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={gender === 'female'}
          onChange={e => setGender(e.target.value)}
        />
        女
      </label>
    </div>
  )
}
```

## 表单验证

```tsx
function ValidatedForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validate = (value: string) => {
    if (!value) {
      setError('邮箱不能为空')
    } else if (!/^[\w-]+@[\w-]+\.\w+$/.test(value)) {
      setError('邮箱格式不正确')
    } else {
      setError('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validate(value)
  }

  return (
    <div>
      <input value={email} onChange={handleChange} placeholder="请输入邮箱" />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )
}
```

## React 18 vs 19 新增表单特性

| 特性 | React 18 | React 19 |
|------|----------|----------|
| `formAction` | 不支持 | 支持，无需 JS 即可提交表单 |
| `useFormStatus` | 不支持 | 新增 Hook，获取表单提交状态 |
| `useActionState` | 不支持 | 新增 Hook，管理表单 Action 状态 |
| `useOptimistic` | 不支持 | 新增 Hook，乐观更新 |

```tsx
// React 19 新特性示例
import { useFormStatus, useActionState } from 'react-dom'

// useFormStatus：获取表单提交状态
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  )
}
```

> React 19 在表单处理方面新增了多个强大的 Hooks，大大简化了表单处理逻辑。