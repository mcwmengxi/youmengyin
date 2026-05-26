# Redux / Redux Toolkit

## 什么是 Redux？

Redux 是一个用于 JavaScript 应用的可预测状态容器，常用于 React 项目的全局状态管理。

## Redux Toolkit（推荐）

Redux Toolkit 是 Redux 官方推荐的编写 Redux 逻辑的方式，简化了 Redux 的使用。

### 安装

```sh
npm install @reduxjs/toolkit react-redux
```

### 核心概念

```
Action → Dispatch → Reducer → Store → UI 更新
```

### 创建 Store

```tsx
// store/index.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

// 1. 创建 Slice（包含 reducer 和 actions）
interface CounterState {
  value: number
}

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => {
      state.value += 1 // Redux Toolkit 内部使用 Immer，可以直接修改
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 2. 创建 Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
```

### 在 React 中使用

```tsx
// main.tsx
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)

// Counter.tsx
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount } from './store'
import type { RootState, AppDispatch } from './store'

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  )
}
```

### 异步操作（createAsyncThunk）

```tsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// 异步 thunk
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('/api/users')
  return response.json()
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as User[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '请求失败'
      })
  },
})

// 在组件中
function UserList() {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <ul>
      {list.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### 模块化组织

```
store/
├── index.ts          # configureStore
├── slices/
│   ├── counterSlice.ts
│   ├── userSlice.ts
│   └── todoSlice.ts
└── hooks.ts           # 自定义 useAppDispatch / useAppSelector
```

```tsx
// hooks.ts - 类型安全的 hooks
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

## React 18 vs 19 差异

| 特性 | React 18 | React 19 |
|------|----------|----------|
| Redux | 正常工作 | 正常工作 |
| React-Redux | 推荐 v8+ | 推荐 v9+（更好的类型支持） |

> Redux 在 React 18/19 中都能正常工作，没有明显差异。