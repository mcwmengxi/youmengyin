# Kotlin 入门指南（JavaScript/TypeScript 开发者版）

## Kotlin 简介

Kotlin 是由 JetBrains 开发的现代静态类型编程语言，2017 年被 Google 宣布为 Android 开发的官方语言。与 JavaScript/TypeScript 相比，Kotlin 运行在 JVM 上，具有更强的类型安全和性能优势。

### 主要特性

- **静态类型**：编译时类型检查（类似 TypeScript）
- **空安全**：内置空值处理机制
- **函数式编程**：支持高阶函数、lambda 表达式
- **互操作性**：与 Java 100% 互操作
- **简洁语法**：比 Java 更简洁，比 JavaScript 更安全

## 基础语法对比

### 变量声明

| 语言       | 可变变量            | 不可变变量            | 类型推断 |
| ---------- | ------------------- | --------------------- | -------- |
| JavaScript | `let x = 5`         | `const x = 5`         | ✅       |
| TypeScript | `let x: number = 5` | `const x: number = 5` | ✅       |
| Kotlin     | `var x = 5`         | `val x = 5`           | ✅       |

**示例：**

```kotlin
// 可变变量
var count = 10
count = 20  // 允许修改

// 不可变变量
val name = "Kotlin"
// name = "Java"  // 编译错误

// 显式类型声明
val age: Int = 25
val isActive: Boolean = true
```

### 数据类型

| 类型   | Kotlin                   | JavaScript | TypeScript    |
| ------ | ------------------------ | ---------- | ------------- |
| 数字   | `Int`, `Double`, `Float` | `number`   | `number`      |
| 布尔   | `Boolean`                | `boolean`  | `boolean`     |
| 字符串 | `String`                 | `string`   | `string`      |
| 数组   | `Array<T>`, `List<T>`    | `Array`    | `Array<T>`    |
| 对象   | 类/数据类                | 对象字面量 | 接口/类型别名 |

**示例：**

```kotlin
// 基本类型
val number: Int = 42
val decimal: Double = 3.14
val text: String = "Hello"
val flag: Boolean = true

// 集合类型
val numbers: List<Int> = listOf(1, 2, 3)
val mutableList: MutableList<String> = mutableListOf("a", "b")
val map: Map<String, Int> = mapOf("one" to 1, "two" to 2)
```

## 函数定义

### 函数声明对比

**JavaScript/TypeScript:**

```javascript
// JavaScript
function add(a, b) {
  return a + b
}

// TypeScript
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数
const multiply = (a: number, b: number): number => a * b
```

**Kotlin:**

```kotlin
// 基本函数
fun add(a: Int, b: Int): Int {
    return a + b
}

// 单表达式函数（类似箭头函数）
fun multiply(a: Int, b: Int): Int = a * b

// 类型推断（可省略返回类型）
fun subtract(a: Int, b: Int) = a - b

// 默认参数
fun greet(name: String = "World"): String {
    return "Hello, $name!"
}
```

### 高阶函数和 Lambda

**JavaScript/TypeScript:**

```typescript
// 回调函数
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map((x) => x * 2)

// 高阶函数
function processNumbers(
  nums: number[],
  callback: (n: number) => number
): number[] {
  return nums.map(callback)
}
```

**Kotlin:**

```kotlin
// Lambda 表达式
val numbers = listOf(1, 2, 3, 4, 5)
val doubled = numbers.map { it * 2 }

// 高阶函数
fun processNumbers(nums: List<Int>, callback: (Int) -> Int): List<Int> {
    return nums.map(callback)
}

// 使用
val result = processNumbers(numbers) { it * 3 }
```

## 空安全（Null Safety）

Kotlin 最大的优势之一是其空安全系统，避免了 JavaScript 中常见的 `undefined` 和 `null` 错误。

### 可空类型

**TypeScript:**

```typescript
let name: string | null = null
let age: number | undefined = undefined

if (name) {
  console.log(name.length)
}
```

**Kotlin:**

```kotlin
// 不可空类型（默认）
val name: String = "Kotlin"  // 不能为 null

// 可空类型（需要显式声明）
val nullableName: String? = null

// 安全调用操作符（?.）
val length = nullableName?.length  // 如果为 null 则返回 null

// Elvis 操作符（?:）
val safeLength = nullableName?.length ?: 0  // 如果为 null 则返回 0

// 非空断言（!!） - 谨慎使用
val forcedLength = nullableName!!.length  // 如果为 null 则抛出异常
```

## 类与对象

### 类定义对比

**TypeScript:**

```typescript
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  greet(): string {
    return `Hello, I'm ${this.name}`
  }
}
```

**Kotlin:**

```kotlin
// 主构造函数（简洁语法）
class Person(val name: String, var age: Int) {

    // 次构造函数
    constructor(name: String) : this(name, 0)

    // 方法
    fun greet(): String {
        return "Hello, I'm $name"
    }
}

// 数据类（自动生成 equals, hashCode, toString 等）
data class User(val id: Int, val username: String, val email: String)

// 使用
val person = Person("Alice", 25)
println(person.greet())
```

### 继承与接口

**TypeScript:**

```typescript
interface Animal {
  name: string
  makeSound(): void
}

class Dog implements Animal {
  name: string

  constructor(name: string) {
    this.name = name
  }

  makeSound(): void {
    console.log('Woof!')
  }
}
```

**Kotlin:**

```kotlin
// 接口
interface Animal {
    val name: String
    fun makeSound()
}

// 类实现接口（默认 final，需要 open 才能被继承）
class Dog(override val name: String) : Animal {
    override fun makeSound() {
        println("Woof!")
    }
}

// 可继承的类
open class Mammal(val species: String)

class Cat(name: String) : Mammal("Cat"), Animal {
    override val name: String = name

    override fun makeSound() {
        println("Meow!")
    }
}
```

## 控制流

### 条件语句

**JavaScript/TypeScript:**

```javascript
// if-else
if (age >= 18) {
  console.log('Adult')
} else {
  console.log('Minor')
}

// 三元运算符
const status = age >= 18 ? 'Adult' : 'Minor'

// switch (TypeScript)
switch (day) {
  case 1:
    console.log('Monday')
    break
  default:
    console.log('Other day')
}
```

**Kotlin:**

```kotlin
// if-else（也是表达式）
val status = if (age >= 18) "Adult" else "Minor"

// when（强大的 switch 替代）
val day = 1
val dayName = when (day) {
    1 -> "Monday"
    2 -> "Tuesday"
    in 3..5 -> "Weekday"
    else -> "Weekend"
}

// when 作为语句
when {
    age < 13 -> println("Child")
    age < 20 -> println("Teenager")
    else -> println("Adult")
}
```

### 循环

**JavaScript/TypeScript:**

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i)
}

// for-of
for (const item of array) {
  console.log(item)
}

// for-in
for (const key in object) {
  console.log(key, object[key])
}
```

**Kotlin:**

```kotlin
// 范围循环
for (i in 1..5) {
    println(i)
}

// 集合迭代
val list = listOf("a", "b", "c")
for (item in list) {
    println(item)
}

// 带索引迭代
for ((index, value) in list.withIndex()) {
    println("$index: $value")
}

// while 循环
var i = 0
while (i < 5) {
    println(i)
    i++
}
```

## 扩展函数（Extension Functions）

Kotlin 独有的强大特性，可以为现有类添加新方法：

```kotlin
// 为 String 类添加扩展函数
fun String.addExclamation(): String = this + "!"

// 使用
val greeting = "Hello"
println(greeting.addExclamation())  // 输出: Hello!

// 为 List 添加扩展函数
fun <T> List<T>.secondOrNull(): T? = if (this.size >= 2) this[1] else null

val numbers = listOf(1, 2, 3)
println(numbers.secondOrNull())  // 输出: 2
```

## 协程（Coroutines）

Kotlin 的轻量级并发解决方案，类似于 JavaScript 的 async/await：

**JavaScript:**

```javascript
async function fetchData() {
  const response = await fetch('/api/data')
  const data = await response.json()
  return data
}
```

**Kotlin:**

```kotlin
suspend fun fetchData(): Data {
    return withContext(Dispatchers.IO) {
        // 模拟网络请求
        delay(1000)
        Data("Sample Data")
    }
}

// 使用
fun main() = runBlocking {
    val data = fetchData()
    println(data)
}
```

## Android 开发中的 Kotlin 特有特性

### 视图绑定（View Binding）

```kotlin
// 传统 findViewById（不推荐）
val textView = findViewById<TextView>(R.id.text_view)

// 视图绑定（推荐）
private lateinit var binding: ActivityMainBinding

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    setContentView(binding.root)

    binding.textView.text = "Hello Kotlin!"
}
```

### LiveData 和 ViewModel

```kotlin
class MainViewModel : ViewModel() {
    private val _userName = MutableLiveData<String>()
    val userName: LiveData<String> = _userName

    fun updateName(name: String) {
        _userName.value = name
    }
}

// Activity/Fragment 中观察
viewModel.userName.observe(this) { name ->
    binding.textView.text = name
}
```

## 最佳实践

### 1. 充分利用空安全

```kotlin
// 不好的做法
var name: String? = null

// 好的做法
val name: String = ""  // 使用空字符串而不是 null
// 或者使用 lateinit（当确定会在初始化后赋值时）
private lateinit var userName: String
```

### 2. 使用数据类

```kotlin
// 代替普通的类
data class User(val id: Int, val name: String, val email: String)

// 自动获得 equals(), hashCode(), toString(), copy() 等方法
```

### 3. 善用扩展函数

```kotlin
// 为常用操作创建扩展函数
fun Context.showToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}

// 使用
context.showToast("操作成功")
```

### 4. 使用协程处理异步

```kotlin
// 代替回调地狱
viewModelScope.launch {
    try {
        val result = repository.fetchData()
        _uiState.value = UiState.Success(result)
    } catch (e: Exception) {
        _uiState.value = UiState.Error(e.message)
    }
}
```

## 常见陷阱与注意事项

### 1. 空安全误用

```kotlin
// 错误：可能抛出 NullPointerException
val length = nullableString!!.length

// 正确：使用安全调用
val length = nullableString?.length ?: 0
```

### 2. 可变性管理

```kotlin
// 尽量使用 val（不可变）
val immutableList = listOf(1, 2, 3)  // 不可变

// 需要修改时使用 mutable
val mutableList = mutableListOf(1, 2, 3)
mutableList.add(4)
```

### 3. 范围函数使用

```kotlin
// 正确使用 let, apply, also, run, with
user?.let {
    println(it.name)
    updateUser(it)
}

// 代替复杂的空检查
if (user != null && user.name != null && user.email != null) {
    // ...
}
```

## 学习资源

- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://play.kotlinlang.org/koans) - 交互式练习
- [Android Kotlin 指南](https://developer.android.com/kotlin)
- [Kotlin 风格指南](https://developer.android.com/kotlin/style-guide)

## 总结

对于有 JavaScript/TypeScript 经验的开发者，学习 Kotlin 的主要挑战在于：

- 适应静态类型系统（但 TypeScript 经验会有帮助）
- 理解空安全概念
- 掌握 Kotlin 特有的语法糖（如扩展函数、数据类）
- 学习 Android 特有的框架和模式

优势在于：

- 更安全的代码（编译时错误检测）
- 更好的性能（JVM 优化）
- 更简洁的语法
- 强大的 IDE 支持（来自 JetBrains）

通过实践和项目开发，你会很快适应 Kotlin 的编程范式，并享受其带来的开发效率提升。
