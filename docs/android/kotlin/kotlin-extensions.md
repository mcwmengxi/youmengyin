# Kotlin 扩展函数与属性

Kotlin 提供了扩展机制，允许在不继承类或使用装饰器模式的情况下，为现有类添加新功能。这是 Kotlin 最强大的特性之一。

## 扩展函数

### 基本语法

```kotlin
// 为 String 添加扩展函数
fun String.addExclamation(): String {
    return this + "!"
}

// 使用
val greeting = "Hello".addExclamation()
println(greeting)
```

### 扩展函数中的 this

```kotlin
fun String.describe(): String {
    // this 指向接收者对象
    println("字符串值: $this")
    println("字符串长度: ${this.length}")
    return "字符串 '$this' 有 ${this.length} 个字符"
}

val description = "Kotlin".describe()
```

### 为标准库类型添加扩展

```kotlin
// Int 扩展
fun Int.isPrime(): Boolean {
    if (this < 2) return false
    for (i in 2 until this) {
        if (this % i == 0) return false
    }
    return true
}

// List 扩展
fun <T> List<T>.second(): T {
    if (size < 2) throw NoSuchElementException("List has less than 2 elements")
    return this[1]
}

// 可空类型扩展
fun String?.isNullOrBlank(): Boolean {
    return this == null || this.isBlank()
}
```

## 扩展属性

### 基本语法

```kotlin
// 为 String 添加扩展属性
val String.isLong: Boolean
    get() = this.length > 10

val String.wordCount: Int
    get() = this.split(Regex("\\s+")).size

// 使用
val text = "Hello Kotlin World"
println(text.isLong)
println(text.wordCount)
```

### 扩展属性的局限

```kotlin
// 扩展属性不能有初始化器，只能通过 getter 定义
// val String.lastChar: Char = this.last()  // 编译错误！

// 正确方式：通过 getter 计算
val String.lastChar: Char
    get() = this.last()

// 可变扩展属性需要同时定义 getter 和 setter
var StringBuilder.lastChar: Char
    get() = this.last()
    set(value) {
        this.setCharAt(this.length - 1, value)
    }

val sb = StringBuilder("Kotlin")
println(sb.lastChar)
sb.lastChar = '!'
println(sb)
```

## 扩展函数与成员函数的优先级

```kotlin
class Example {
    fun printMessage() = println("成员函数")
}

fun Example.printMessage() = println("扩展函数")

// 成员函数优先！
Example().printMessage()

// 如果成员函数签名不同，扩展函数仍然可用
class Example2 {
    fun printMessage() = println("成员函数")
}

fun Example2.printMessage(prefix: String) = println("$prefix 扩展函数")

Example2().printMessage("Hello")
```

## 可空接收者

```kotlin
// 可空接收者的扩展函数
fun String?.safeLength(): Int {
    return this?.length ?: 0
}

// 在可空接收者上调用
val nullString: String? = null
println(nullString.safeLength())

val nonNullString: String? = "Hello"
println(nonNullString.safeLength())
```

## 泛型扩展函数

```kotlin
// 通用泛型扩展
fun <T> T?.ifNull(defaultValue: T): T {
    return this ?: defaultValue
}

// 带约束的泛型扩展
fun <T : Comparable<T>> T.isInRange(range: ClosedRange<T>): Boolean {
    return this in range
}

// 多泛型参数扩展
fun <T, R> T.applyIf(condition: Boolean, transform: (T) -> R): R? {
    return if (condition) transform(this) else null
}
```

## 扩展函数的作用域

### 顶层扩展

```kotlin
// FileUtils.kt
package com.example.utils

fun String.removeExtension(): String {
    val dotIndex = this.lastIndexOf('.')
    return if (dotIndex > 0) this.substring(0, dotIndex) else this
}

// 其他文件中使用
import com.example.utils.removeExtension

val fileName = "document.pdf".removeExtension()
```

### 局部扩展

```kotlin
fun processUsers(users: List<String>) {
    // 在函数内部定义扩展
    fun String.isValidUsername(): Boolean {
        return this.length in 3..20 && this.all { it.isLetterOrDigit() }
    }

    val validUsers = users.filter { it.isValidUsername() }
    println(validUsers)
}
```

### 类成员中的扩展

```kotlin
class Host(val hostname: String) {
    fun printGreeting() = println("Greetings from $hostname")
}

class Connection(val host: Host) {
    // 在类内部定义扩展函数
    fun Host.printConnectionString() {
        printGreeting()
        println("Connection to $hostname established")
    }

    fun connect() {
        host.printConnectionString()
    }
}
```

## 扩展函数与继承

```kotlin
open class Animal
class Dog : Animal()
class Cat : Animal()

fun Animal.sound() = "Some sound"
fun Dog.sound() = "Woof"
fun Cat.sound() = "Meow"

// 扩展函数是静态解析的！
fun printSound(animal: Animal) {
    println(animal.sound())
}

printSound(Dog())
printSound(Cat())
printSound(Animal())
```

## 常用扩展函数示例

### 集合扩展

```kotlin
fun <T> List<T>.randomElement(): T {
    if (isEmpty()) throw NoSuchElementException("List is empty")
    return this[(0 until size).random()]
}

fun <T> List<List<T>>.flattenAll(): List<T> {
    return this.flatten()
}

fun <T : Comparable<T>> List<T>.secondLargest(): T? {
    return this.distinct().sortedDescending().getOrNull(1)
}
```

### 字符串扩展

```kotlin
fun String.toCamelCase(): String {
    return split(Regex("[\\s_-]+"))
        .joinToString("") { it.capitalize() }
}

fun String.truncate(maxLength: Int): String {
    return if (length <= maxLength) this else substring(0, maxLength) + "..."
}

fun String.isEmail(): Boolean {
    return matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
}

fun String.countVowels(): Int {
    return count { it.lowercaseChar() in "aeiou" }
}
```

### 日期时间扩展

```kotlin
import java.time.LocalDate
import java.time.format.DateTimeFormatter

fun LocalDate.formatChinese(): String {
    return format(DateTimeFormatter.ofPattern("yyyy年MM月dd日"))
}

fun LocalDate.isWeekend(): Boolean {
    return dayOfWeek.value >= 6
}
```

### Android 视图扩展

```kotlin
import android.view.View
import android.widget.Toast

fun View.show() {
    visibility = View.VISIBLE
}

fun View.hide() {
    visibility = View.GONE
}

fun View.invisible() {
    visibility = View.INVISIBLE
}

fun View.toggleVisibility() {
    visibility = if (visibility == View.VISIBLE) View.GONE else View.VISIBLE
}

fun View.onClick(action: () -> Unit) {
    setOnClickListener { action() }
}
```

## 扩展函数与中缀调用

```kotlin
infix fun Int.power(exp: Int): Int {
    var result = 1
    repeat(exp) { result *= this }
    return result
}

val result = 2 power 10

infix fun <T> Collection<T>.has(element: T): Boolean {
    return contains(element)
}

val containsHello = listOf("a", "b", "c") has "a"
```

## 扩展函数的注意事项

### 1. 扩展函数是静态解析的

```kotlin
open class Base
class Derived : Base()

fun Base.foo() = "Base"
fun Derived.foo() = "Derived"

fun printFoo(base: Base) {
    println(base.foo())
}

printFoo(Derived())
```

### 2. 扩展函数不能访问私有成员

```kotlin
class MyClass {
    private val secret = "hidden"
    val public = "visible"
}

fun MyClass.accessMembers() {
    // println(secret)  // 编译错误！无法访问私有成员
    println(public)
}
```

### 3. 不要过度使用扩展函数

```kotlin
// 不好的做法：为所有类型添加过多扩展
fun Any.toJson(): String { ... }
fun Any.fromJson(json: String): Any { ... }

// 好的做法：使用工具类或顶层函数
object JsonUtils {
    fun toJson(obj: Any): String { ... }
    fun <T> fromJson(json: String, clazz: Class<T>): T { ... }
}
```

## 最佳实践

1. **为第三方库类添加便捷方法**：扩展函数最适合为无法修改的类添加功能
2. **提高代码可读性**：使用扩展函数将复杂逻辑封装为简洁的方法调用
3. **合理命名**：扩展函数名应清晰表达其功能，避免与成员函数冲突
4. **注意作用域**：将扩展函数放在合适的包中，避免命名冲突
5. **优先使用成员函数**：当你可以修改类时，成员函数比扩展函数更合适
