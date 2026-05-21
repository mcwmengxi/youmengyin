# JavaScript 学习指南

> 从语言核心到工程实践的完整学习路径

## 📚 学习路径总览

本指南按照由浅入深的方式组织 JavaScript 知识体系，帮助你系统性地掌握这门语言：

```
语言基础 → 类型系统 → 数据类型 → 函数进阶 → 面向对象 → 异步编程 → 内置API → 浏览器API → 工程实践
```

---

## 第一阶段：语言基础

打好 JavaScript 的根基，理解核心语法和运算规则

- [基础语法与运算符](./basic.md)
  - 一元运算符（`++a` vs `a++`）
  - 逻辑运算符（`&&`、`||`）
  - 运算符优先级

---

## 第二阶段：类型系统：JavaScript 的地基

理解 JavaScript 的类型系统是掌握这门语言的关键。JavaScript 采用动态弱类型系统，与 TypeScript 等强类型语言有本质区别。

### 2.1 类型分类

JavaScript 的类型分为两大类：

#### 原始类型（Primitive Types）

JavaScript 有 7 种原始类型，它们是不可变的值：

- **undefined** - 未定义
- **null** - 空值
- **boolean** - 布尔值（true/false）
- **number** - 数字（整数、浮点数、NaN、Infinity）
- **string** - 字符串
- **symbol** - 符号（ES6 新增，唯一标识符）
- **bigint** - 大整数（ES2020 新增）

```js
// 原始类型的示例
let name = '张三' // string
let age = 18 // number
let isStudent = true // boolean
let score = undefined // undefined
let empty = null // null
let id = Symbol('id') // symbol
let bigNum = 9007199254740991n // bigint
```

#### 引用类型（Reference Types）

引用类型是存储在内存中的对象，变量保存的是对象的引用（地址）：

- **Object** - 对象（包括普通对象、数组、函数等）
- **Array** - 数组
- **Function** - 函数
- **Date** - 日期对象
- **RegExp** - 正则表达式
- **Map / Set** - 集合类型（ES6）

```js
// 引用类型的示例
let user = { name: '张三', age: 18 } // Object
let list = [1, 2, 3] // Array
let greet = function () {} // Function
let now = new Date() // Date
```

### 2.2 typeof 操作符

`typeof` 用于检测变量的数据类型，但有一些需要注意的"坑"：

```js
typeof undefined // "undefined"
typeof null // "object" ⚠️ 历史遗留 bug
typeof true // "boolean"
typeof 123 // "number"
typeof 'hello' // "string"
typeof Symbol('id') // "symbol"
typeof 123n // "bigint"
typeof {} // "object"
typeof [] // "object" ⚠️ 数组也是 object
typeof function () {} // "function" ⚠️ 函数比较特殊
```

**重要提示：**

- `typeof null === "object"` 是 JavaScript 的历史遗留 bug，自 JavaScript 第一版就存在
- 数组使用 typeof 检测返回 "object"，需要用 `Array.isArray()` 判断
- 函数虽然也是对象，但 typeof 返回 "function"

### 2.3 类型转换（Type Coercion）

JavaScript 是弱类型语言，会在需要时自动进行类型转换，这是初学者最容易出错的地方：

#### 隐式转换规则

```js
// 字符串拼接：数字转字符串
1 + '1' // "11"

// 数学运算：字符串转数字
'10' - 5 // 5
'10' * 2 // 20
'10' / 2 // 5

// 布尔转换
if (1) {
} // truthy，会执行
if (0) {
} // falsy，不会执行
if ('') {
} // falsy
if (null) {
} // falsy
if (undefined) {
} // falsy
if (NaN) {
} // falsy

// 相等性比较
1 == '1' // true ⚠️ 隐式转换
1 === '1' // false ✅ 推荐使用严格相等
0 == false // true ⚠️
0 === false // false ✅
null == undefined // true ⚠️ 特殊情况
null === undefined // false ✅
```

#### Falsy 值列表

以下 6 个值在布尔上下文中为 `false`（称为 falsy 值）：

| 值          | 类型      | 说明     |
| ----------- | --------- | -------- |
| `false`     | Boolean   | 布尔假值 |
| `0`         | Number    | 数字零   |
| `-0`        | Number    | 负零     |
| `0n`        | BigInt    | 大整数零 |
| `""`        | String    | 空字符串 |
| `null`      | Null      | 空值     |
| `undefined` | Undefined | 未定义   |
| `NaN`       | Number    | 非数字   |

**其他所有值都是 truthy（包括空数组 `[]`、空对象 `{}`）**

### 2.4 类型判断的最佳实践

```js
// 判断原始类型
typeof variable === 'string'
typeof variable === 'number'

// 判断 null（必须单独判断）
variable === null

// 判断数组
Array.isArray(variable)

// 判断对象（排除 null 和数组）
typeof variable === 'object' && variable !== null && !Array.isArray(variable)

// 判断函数
typeof variable === 'function'

// 判断 NaN（NaN 是唯一不等于自身的值）
Number.isNaN(variable) // 推荐
variable !== variable // 或者用这个特性

// 完整的类型判断函数
function getType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

getType(123) // "number"
getType('hello') // "string"
getType([1, 2]) // "array"
getType({ name: 'test' }) // "object"
getType(null) // "null"
```

### 2.5 值传递 vs 引用传递

理解值类型和引用类型的区别对于避免 bug 至关重要：

```js
// 原始类型：值传递
let a = 10
let b = a
b = 20
console.log(a) // 10 ✅ a 不受影响

// 引用类型：引用传递
let obj1 = { name: '张三' }
let obj2 = obj1
obj2.name = '李四'
console.log(obj1.name) // "李四" ⚠️ obj1 也被修改了！

// 数组同理
let arr1 = [1, 2, 3]
let arr2 = arr1
arr2.push(4)
console.log(arr1) // [1, 2, 3, 4] ⚠️ arr1 也被修改了！

// 解决方案：浅拷贝或深拷贝
let obj3 = { ...obj1 } // 浅拷贝（展开运算符）
let arr3 = [...arr1] // 浅拷贝
let deepCopy = JSON.parse(JSON.stringify(obj1)) // 深拷贝（有局限性）
```

### 2.6 为什么 TypeScript 更安全？

TypeScript 通过静态类型检查解决了 JavaScript 动态类型带来的问题：

```javascript
// JavaScript：运行时才发现错误
function add(a, b) {
  return a + b
}
add('1', 2) // "12" ❌ 可能不是你想要的结果

// TypeScript：编译时就发现错误
function addTS(a: number, b: number): number {
  return a + b
}
addTS('1', 2) // 编译错误 ✅ 提前发现问题
```

**学习建议：**

- 先深入理解 JavaScript 的动态类型机制
- 再学习 TypeScript 的静态类型系统
- 在实际项目中逐步引入 TypeScript 的严格模式

---

## 第三阶段：数据类型与数据结构

掌握 JavaScript 的类型系统和常用数据结构

- [数据类型](./data-type.md)
  - 基本数据类型
  - Map 数据结构（键值对集合）
  - Set 数据结构
  - 类型转换

---

## 第四阶段：函数编程

深入理解 JavaScript 的函数特性

### 4.1 函数基础

- [函数与回调](./function.md)
  - 回调函数的概念与应用
  - 回调地狱问题
  - 高阶函数

### 4.2 数组操作

- [数组迭代方法](./array-iteration.md)

  - `forEach()` 遍历
  - `filter()` 过滤
  - `map()` 映射
  - `reduce()` 归约
  - `find()` 查找

- [数组基础方法](./methods-array.md)
  - `push()` / `pop()` 栈操作
  - `shift()` / `unshift()` 队列操作
  - `splice()` 切片操作
  - `slice()` / `concat()` 复制与合并
  - `indexOf()` / `includes()` 查找
  - `sort()` / `reverse()` 排序

### 4.3 字符串操作

- [字符串方法](./methods-string.md)
  - `toString()` 类型转换
  - `concat()` 拼接
  - `slice()` / `substring()` / `substr()` 截取
  - `indexOf()` / `includes()` 查找
  - `trim()` / `split()` 处理
  - `replace()` 替换
  - 模板字符串

---

## 第五阶段：面向对象编程

掌握 JavaScript 的 OOP 特性

### 5.1 原型系统

- [原型与原型链](./fun-prototype.md)
  - 对象的原型（`__proto__`）
  - 函数的 prototype
  - 原型链查找机制
  - 继承的实现方式

### 5.2 ES6 类

- [类的使用](./fun-class.md)
  - class 关键字
  - constructor 构造器
  - 实例方法与静态方法
  - getter / setter
  - extends 继承
  - super 关键字

### 5.3 对象操作

- [对象方法](./methods-object.md)
  - `Object.defineProperty()` 属性定义
  - `Object.defineProperties()` 批量定义
  - `Object.assign()` 对象合并
  - `Object.keys()` / `values()` / `entries()`
  - 对象解构与展开

---

## 第六阶段：异步编程

理解 JavaScript 的异步特性，掌握现代异步方案

### 6.1 异步基础

- [异步函数](./fun-async.md)
  - 单线程与异步原理
  - Promise 的三种状态
  - then / catch 链式调用
  - async / await 语法糖
  - 错误处理

### 6.2 生成器与迭代器

- [迭代器与生成器](./generator.md)
  - Symbol.iterator 可迭代协议
  - next() 方法与 IteratorResult
  - Generator 生成器函数（`function*`）
  - yield 暂停与恢复
  - 生成器的实际应用

### 6.3 事件循环机制

- [事件循环](./event-loop.md)
  - 浏览器的进程与线程模型
  - 渲染主线程的工作原理
  - 调用栈（Call Stack）
  - 任务队列（微任务/宏任务）
  - Event Loop 执行流程
  - 异步代码的执行顺序

---

## 第七阶段：内置 API

熟练使用 JavaScript 内置对象和方法

### 7.1 数学计算

- [Math 对象](./math-object.md)
  - `Math.round()` 四舍五入
  - `Math.ceil()` / `Math.floor()` 取整
  - `Math.random()` 随机数
  - `Math.max()` / `Math.min()` 最值
  - `Math.abs()` 绝对值
  - `Math.PI` 圆周率

### 7.2 日期时间

- [Date 对象](./date-object.md)
  - 创建日期对象
  - getTime() 时间戳获取
  - getFullYear() / getMonth() / getDate()
  - getHours() / getMinutes() / getSeconds()
  - 日期格式化与计算
  - 时区处理

---

## 第八阶段：浏览器 API 与 DOM

掌握浏览器环境下的 JavaScript 开发

### 8.1 DOM 操作

- [DOM 相关](./dom.md)
  - `childNodes` 获取子节点
  - `parentNode` 获取父元素
  - `nodeName` 获取标签名
  - 元素选择与遍历
  - 创建、插入、删除元素
  - 样式操作与类名管理

### 8.2 浏览器距离计算

- [网页的各种距离](./distance.md)
  - 视口（Viewport）概念
  - pageY / clientY / offsetY 区别
  - screenY 屏幕坐标
  - `getBoundingClientRect()` 元素位置
  - `window.scrollY` 页面滚动距离
  - `element.scrollTop` 元素滚动距离
  - offsetTop / clientTop 元素偏移

### 8.3 Web API

- [JavaScript API](./javascript-api.md)
  - File 文件对象
  - URL.createObjectURL() 文件预览
  - Blob 对象
  - FileReader 文件读取
  - 本地存储（localStorage / sessionStorage）

### 8.4 高级特性

- [Proxy 代理](./proxy.md)
  - Proxy 构造函数
  - get / set 捕获器
  - 反射 API（Reflect）
  - 数据劫持与响应式原理
  - Vue 3 响应式的实现基础

---

## 第九阶段：工程实践

将知识应用于实际项目开发

### 9.1 并发控制

- [并发任务控制器](./supertask.md)
  - 任务队列设计
  - 并发数控制
  - Promise 管理
  - 实际应用场景（批量请求、任务调度）

---

## 🔗 学习建议

### 初学者路径

```
basic → data-type → function → methods-array → methods-string → dom
```

### 进阶开发者路径

```
fun-prototype → fun-class → fun-async → generator → event-loop → proxy
```

### 工程化实践路径

```
event-loop → javascript-api → distance → supertask
```

---

## 📖 配套资源

- 本目录包含配套图片资源（[images/](./images/)），辅助理解概念
- 所有示例代码均可直接运行测试
- 建议结合浏览器控制台进行实验性学习

---

_持续更新中..._
