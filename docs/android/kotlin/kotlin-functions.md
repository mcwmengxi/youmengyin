# Kotlin 函数与高阶函数

## 函数定义

### 基本语法

```kotlin
fun functionName(parameter: Type, parameter2: Type): ReturnType {
    // 函数体
    return value
}
```

### 函数声明示例

```kotlin
// 有返回值的函数
fun sum(a: Int, b: Int): Int {
    return a + b
}

// 单表达式函数
fun multiply(a: Int, b: Int): Int = a * b

// 返回类型可推断的单表达式函数
fun greet(name: String) = "Hello, $name!"

// 无返回值的函数 (Unit 可省略)
fun printMessage(message: String): Unit {
    println(message)
}

// 简化写法
fun printSum(a: Int, b: Int) {
    println("Sum: ${a + b}")
}
```

## 参数类型

### 默认参数

```kotlin
fun connect(
    host: String = "localhost",
    port: Int = 8080,
    timeout: Long = 5000
) {
    println("Connecting to $host:$port with timeout $timeout ms")
}

// 调用示例
connect()                           // 使用所有默认值
connect("example.com")              // 使用默认 port 和 timeout
connect(port = 3000)                // 使用命名参数
connect(host = "api.com", port = 9000) // 部分参数指定
```

### 可变参数

```kotlin
fun printAll(vararg messages: String) {
    for (message in messages) {
        println(message)
    }
}

// 调用
printAll("Hello", "World", "Kotlin")

// 解构参数
val items = arrayOf("apple", "banana", "orange")
printAll(*items)  // 使用 * 操作符展开数组
```

### 命名参数

```kotlin
fun createUser(
    name: String,
    age: Int,
    email: String,
    isActive: Boolean
) {
    // 函数实现
}

// 使用命名参数调用
createUser(
    name = "Alice",
    age = 25,
    email = "alice@example.com",
    isActive = true
)

// 重排参数顺序
createUser(
    email = "bob@example.com",
    name = "Bob",
    isActive = false,
    age = 30
)
```

## 函数类型

### 函数引用

```kotlin
fun processNumber(n: Int): Int {
    return n * 2
}

// 获取函数引用
val processor = ::processNumber
val result = processor(5)  // 调用函数

// Lambda 表达式
val square: (Int) -> Int = { x -> x * x }
val result2 = square(4)  // 16
```

## 高阶函数

高阶函数是接受其他函数作为参数或返回函数的函数。

### 接受函数作为参数

```kotlin
// 定义一个高阶函数
fun performOperation(x: Int, y: Int, operation: (Int, Int) -> Int): Int {
    return operation(x, y)
}

// 使用高阶函数
val sumResult = performOperation(5, 3) { a, b -> a + b }
val productResult = performOperation(5, 3) { a, b -> a * b }

// 更复杂的例子
fun <T> calculate(
    items: List<T>,
    transform: (T) -> Int,
    operation: (Int, Int) -> Int
): Int {
    var result = 0
    for (item in items) {
        result = operation(result, transform(item))
    }
    return result
}
```

### 返回函数的高阶函数

```kotlin
fun operationSelector(operation: String): (Int, Int) -> Int {
    return when (operation) {
        "add" -> { a, b -> a + b }
        "multiply" -> { a, b -> a * b }
        "subtract" -> { a, b -> a - b }
        else -> { _, _ -> 0 }
    }
}

val addFunction = operationSelector("add")
val result = addFunction(5, 3)  // 8
```

## Lambda 表达式

### Lambda 语法

```kotlin
// 完整语法
val sumLambda: (Int, Int) -> Int = { x: Int, y: Int -> x + y }

// 类型推断
val sumSimple = { x: Int, y: Int -> x + y }

// 使用 it（仅适用于单参数 lambda）
val square = { x: Int -> x * x }
val double = { it * 2 }  // 类型需能推断

// 多行 lambda
val complexOperation = { x: Int, y: Int ->
    val temp = x + y
    temp * temp
}
```

### Lambda 的实际应用

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 使用 lambda 进行集合操作
val doubled = numbers.map { it * 2 }
val evens = numbers.filter { it % 2 == 0 }
val sum = numbers.reduce { acc, value -> acc + value }

// 自定义操作
fun <T> List<T>.forEachWithIndex(operation: (Int, T) -> Unit) {
    for (index in this.indices) {
        operation(index, this[index])
    }
}

numbers.forEachWithIndex { index, value ->
    println("Index: $index, Value: $value")
}
```

## 内联函数

内联函数可以减少高阶函数调用的性能开销。

```kotlin
inline fun repeatAction(times: Int, action: () -> Unit) {
    for (i in 0 until times) {
        action()
    }
}

// 使用
repeatAction(3) {
    println("Hello")
}
```

### 非局部返回

```kotlin
inline fun <T> myRun(obj: T, block: T.() -> R): R {
    return obj.block()
}

fun example() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach  // 跳过当前迭代，而非退出整个函数
        print("$it ")
    }
    println("End of function")
}
```

## 函数扩展

为现有类添加新的函数。

```kotlin
// 为 String 类添加扩展函数
fun String.isPalindrome(): Boolean {
    val normalized = this.lowercase().replace(" ", "")
    return normalized == normalized.reversed()
}

// 为 Int 类添加扩展函数
fun Int.isEven(): Boolean = this % 2 == 0

// 使用扩展函数
val result1 = "A man a plan a canal Panama".isPalindrome()  // true
val result2 = 4.isEven()  // true
```

## 成员函数 vs 扩展函数

```kotlin
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
}

// 扩展函数
fun Calculator.multiply(a: Int, b: Int): Int = a * b

val calc = Calculator()
val sum = calc.add(5, 3)        // 成员函数调用
val product = calc.multiply(5, 3) // 扩展函数调用
```

## 函数重载

```kotlin
fun display(value: String) {
    println("String: $value")
}

fun display(value: Int) {
    println("Integer: $value")
}

fun display(values: IntArray) {
    println("Array: ${values.contentToString()}")
}

// 调用不同重载版本
display("Hello")        // 输出: String: Hello
display(42)             // 输出: Integer: 42
display(intArrayOf(1, 2, 3))  // 输出: Array: [1, 2, 3]
```

## 函数组合

```kotlin
// 创建函数组合工具
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

// 示例使用
val addOne = { x: Int -> x + 1 }
val multiplyByTwo = { x: Int -> x * 2 }

val combined = compose(multiplyByTwo, addOne)  // 先加1，再乘2
val result = combined(5)  // (5+1)*2 = 12
```