# Kotlin 基本语法与数据类型

## 变量声明

Kotlin 有两种类型的变量：

- `val`：只读变量（类似 JS 中的 `const`）
- `var`：可变变量（类似 JS 中的 `let`）

```kotlin
// 只读变量 - 一旦赋值不能更改
val name = "Kotlin"          // 类型推断为 String
val age: Int = 25            // 显式声明类型

// 可变变量 - 可以重新赋值
var score = 100              // 类型推断为 Int
score = 95                   // 合法：更新变量值

// 编译错误：不能重新赋值给 val 变量
// name = "Java"             // 错误！
```

## 基本数据类型

### 数字类型

| 类型 | 位数 | 范围 |
|------|------|------|
| Byte | 8 | -128 到 127 |
| Short | 16 | -32768 到 32767 |
| Int | 32 | -2,147,483,648 到 2,147,483,647 |
| Long | 64 | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807 |
| Float | 32 | IEEE 754 单精度浮点 |
| Double | 64 | IEEE 754 双精度浮点 |

```kotlin
val byteValue: Byte = 127
val shortValue: Short = 32767
val intValue: Int = 100_000    // 下划线分隔数字，提高可读性
val longValue: Long = 1_000_000_000L
val floatValue: Float = 2.5f
val doubleValue: Double = 3.14159
```

### 字符与布尔类型

```kotlin
val charValue: Char = 'A'
val boolValue: Boolean = true

// 字符串
val stringValue: String = "Hello Kotlin"
val multiLineString = """
    这是一个
    多行字符串
    示例
""".trimIndent()
```

## 类型转换

Kotlin 不会自动进行类型转换，必须显式转换：

```kotlin
val intValue: Int = 100
// val longValue: Long = intValue     // 错误！不能隐式转换
val longValue: Long = intValue.toLong()  // 显式转换

// 支持的转换方法：
// toByte(), toShort(), toInt(), toLong()
// toFloat(), toDouble()
// toChar(), toBoolean()
```

## 运算符

### 算术运算符

```kotlin
val a = 10
val b = 3

println(a + b)    // 13 加法
println(a - b)    // 7 减法
println(a * b)    // 30 乘法
println(a / b)    // 3 除法
println(a % b)    // 1 取模
```

### 比较运算符

```kotlin
val x = 5
val y = 10

println(x == y)   // false 等于
println(x != y)   // true 不等于
println(x < y)    // true 小于
println(x > y)    // false 大于
println(x <= y)   // true 小于等于
println(x >= y)   // false 大于等于
```

### 赋值与增强赋值运算符

```kotlin
var num = 10

num += 5    // 等同于 num = num + 5
num -= 3    // 等同于 num = num - 3
num *= 2    // 等同于 num = num * 2
num /= 4    // 等同于 num = num / 4
num %= 3    // 等同于 num = num % 3
```

## 字符串模板

Kotlin 提供了强大的字符串模板功能：

```kotlin
val name = "Kotlin"
val version = "1.7.20"

// 简单变量插入
val info = "Language: $name, Version: $version"

// 表达式插入
val calculation = "10 * 5 = ${10 * 5}"

// 复杂表达式
val user = User("Alice", 25)
val userInfo = "User: ${user.name.uppercase()}, Age: ${user.age + 1}"
```

## 数组

```kotlin
// 创建数组的不同方式
val numbers = arrayOf(1, 2, 3, 4, 5)
val strings = arrayOf<String>("hello", "world")
val nulls = arrayOfNulls<String>(5)  // 创建包含 null 的数组

// 使用工厂函数创建数组
val squares = IntArray(5) { it * it }  // [0, 1, 4, 9, 16]

// 访问数组元素
println(numbers[0])  // 第一个元素
numbers[0] = 10      // 修改第一个元素
```

## 区间 (Ranges)

```kotlin
val range = 1..10          // 包含 10
val exclusiveRange = 1..<10 // 不包含 10
val descendingRange = 10.downTo(1)  // 降序区间
val stepRange = 1..10 step 2  // 步长为 2

// 检查成员
println(5 in range)         // true
println(15 in range)        // false
println(5 !in range)        // false

// 遍历区间
for (i in range) {
    print("$i ")
}
```

## 注释

```kotlin
// 单行注释

/*
多行注释
可以跨越多行
*/

/**
 * KDoc 文档注释
 * 用于公共 API
 */
fun publicFunction() {
    // 函数体
}
```

## 编码约定

- 使用驼峰命名法：`myVariableName`
- 类名使用 Pascal 命名法：`MyClass`
- 常量使用大写下划线：`MAX_COUNT`
- 文件名与主类名一致
- 使用 4 个空格缩进
- 每行不超过 120 个字符