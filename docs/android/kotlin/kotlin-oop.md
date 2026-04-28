# Kotlin 面向对象编程

## 类的定义

### 基本类定义

```kotlin
// 简单的类定义
class Person {
    var name: String = ""
    var age: Int = 0
    
    fun greet() {
        println("Hello, I'm $name and I'm $age years old.")
    }
}

// 带主构造函数的类
class Person(val name: String, var age: Int) {
    init {
        println("Person initialized with name: $name, age: $age")
    }
    
    fun greet() {
        println("Hello, I'm $name and I'm $age years old.")
    }
}

// 使用
val person = Person("Alice", 25)
person.greet()
```

### 主构造函数和次构造函数

```kotlin
// 主构造函数
class Customer(val name: String, val email: String) {
    // 初始化块
    init {
        println("Creating customer: $name")
    }
    
    // 次构造函数
    constructor(name: String, email: String, phone: String) : this(name, email) {
        println("Additional phone: $phone")
    }
}

// 次构造函数示例
class View {
    constructor(ctx: Context) {
        // 构造函数逻辑
    }
    
    constructor(ctx: Context, attr: AttributeSet) {
        // 构造函数逻辑
    }
}
```

## 继承

### 基本继承

```kotlin
// 基类 - 必须标记为 open 才能被继承
open class Animal(val name: String) {
    open fun speak() {
        println("$name makes a sound")
    }
}

// 派生类
class Dog(name: String, val breed: String) : Animal(name) {
    override fun speak() {
        println("$name barks")
    }
    
    fun fetch() {
        println("$name fetches the ball")
    }
}

// 使用
val dog = Dog("Buddy", "Golden Retriever")
dog.speak()  // 输出: Buddy barks
dog.fetch()
```

### 抽象类

```kotlin
abstract class Shape(val color: String) {
    abstract fun draw()  // 抽象方法
    
    open fun move() {   // 可以有具体实现的方法
        println("Moving shape")
    }
    
    fun getColor() = color  // 普通方法
}

class Circle(color: String, val radius: Double) : Shape(color) {
    override fun draw() {
        println("Drawing a circle with radius $radius")
    }
}
```

## 接口

```kotlin
interface Drawable {
    fun draw()  // 抽象方法
    fun animate() {  // 默认实现
        println("Animating drawable")
    }
}

interface Clickable {
    fun click()
    fun showOff() = println("I'm clickable!")  // 默认实现
}

// 实现多个接口
class Button(val label: String) : Drawable, Clickable {
    override fun draw() {
        println("Drawing button: $label")
    }
    
    override fun click() {
        println("Button $label clicked")
    }
}
```

## 数据类

```kotlin
// 数据类 - 自动生成 equals(), hashCode(), toString(), copy() 等方法
data class User(val id: Long, val name: String, val email: String)

val user1 = User(1, "Alice", "alice@example.com")
val user2 = User(1, "Alice", "alice@example.com")

println(user1.toString())  // User(id=1, name=Alice, email=alice@example.com)
println(user1 == user2)    // true
println(user1.hashCode() == user2.hashCode())  // true

// copy 方法 - 创建副本并更改部分属性
val updatedUser = user1.copy(email = "newemail@example.com")
println(updatedUser)  // User(id=1, name=Alice, email=newemail@example.com)

// 解构声明
val (id, name, email) = user1
println("ID: $id, Name: $name, Email: $email")
```

## 密封类

```kotlin
// 密封类 - 限制子类的数量，通常用于表示有限的类层次
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}

fun handleResult(result: Result) {
    when (result) {
        is Result.Success -> println("Success: ${result.data}")
        is Result.Error -> println("Error: ${result.message}")
        Result.Loading -> println("Loading...")
        // 注意：不需要 else 分支，因为密封类的所有子类都是已知的
    }
}
```

## 枚举类

```kotlin
// 枚举类
enum class Priority(val level: Int) {
    LOW(1),
    MEDIUM(2),
    HIGH(3),
    URGENT(4);
    
    fun description(): String {
        return when (this) {
            LOW -> "Low priority"
            MEDIUM -> "Medium priority"
            HIGH -> "High priority"
            URGENT -> "Urgent priority"
        }
    }
}

// 使用
val priority = Priority.HIGH
println(priority.level)  // 3
println(priority.description())  // "High priority"

// 在 when 表达式中使用
when (priority) {
    Priority.LOW -> println("Handle low priority")
    Priority.MEDIUM -> println("Handle medium priority")
    Priority.HIGH, Priority.URGENT -> println("Handle high priority")
}
```

## 嵌套类和内部类

```kotlin
class Outer(val outerValue: String) {
    private val outerProperty = "Outer property"
    
    // 嵌套类 - 不持有外部类实例的引用
    class Nested {
        fun printMessage() = println("Nested class message")
        // 无法访问 outerProperty
    }
    
    // 内部类 - 持有外部类实例的引用
    inner class Inner {
        fun printOuterProperty() = println(outerProperty)
        fun printOuterValue() = println(outerValue)
    }
}

// 使用
val outer = Outer("test")
val nested = Outer.Nested()
nested.printMessage()

val inner = outer.Inner()
inner.printOuterProperty()
inner.printOuterValue()
```

## 对象声明和伴生对象

### 对象声明（单例）

```kotlin
// 对象声明 - Kotlin 中的单例模式
object DatabaseManager {
    private var connectionCount = 0
    
    fun connect() {
        connectionCount++
        println("Connected to database. Connection count: $connectionCount")
    }
    
    fun disconnect() {
        if (connectionCount > 0) {
            connectionCount--
            println("Disconnected from database. Connection count: $connectionCount")
        }
    }
}

// 使用
DatabaseManager.connect()
DatabaseManager.disconnect()
```

### 伴生对象

```kotlin
class MyClass {
    companion object {
        const val MAX_SIZE = 100
        var instanceCount = 0
            private set  // 私有 setter
        
        fun createInstance(): MyClass {
            instanceCount++
            return MyClass()
        }
    }
    
    // 命名伴生对象
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}

// 使用
println(MyClass.MAX_SIZE)
val instance = MyClass.createInstance()
println(MyClass.instanceCount)  // 1
```

### 对象表达式

```kotlin
// 对象表达式 - 创建匿名对象
val comparator = object : Comparator<String> {
    override fun compare(a: String, b: String): Int {
        return a.length - b.length
    }
}

// 用作函数参数
fun example() {
    val items = listOf("apple", "banana", "kiwifruit")
    val sorted = items.sortedWith(object : Comparator<String> {
        override fun compare(a: String, b: String): Int {
            return a.length - b.length
        }
    })
    println(sorted)  // 按长度排序
}

// 简单的匿名对象
val counter = object {
    var count = 0
    fun increment() = ++count
}
```

## 属性和字段

```kotlin
class Person {
    // 只读属性
    val fullName: String
        get() = "$firstName $lastName"
    
    // 可变属性
    var firstName: String = ""
        set(value) {
            field = value.capitalize()
        }
    
    var lastName: String = ""
        set(value) {
            field = value.capitalize()
        }
    
    // 延迟初始化属性
    lateinit var address: String
    
    // 委托属性
    var email: String by Delegate()
}

class Delegate {
    operator fun getValue(thisObj: Any?, prop: kotlin.reflect.KProperty<*>): String {
        return "Value of ${prop.name}"
    }
    
    operator fun setValue(thisObj: Any?, prop: kotlin.reflect.KProperty<*>, value: String) {
        println("${prop.name} has been assigned $value")
    }
}
```

## 运算符重载

```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point): Point {
        return Point(x + other.x, y + other.y)
    }
    
    operator fun minus(other: Point): Point {
        return Point(x - other.x, y - other.y)
    }
    
    operator fun times(scale: Int): Point {
        return Point(x * scale, y * scale)
    }
    
    operator fun get(index: Int): Int {
        return when(index) {
            0 -> x
            1 -> y
            else -> throw IndexOutOfBoundsException("Point has only x and y coordinates")
        }
    }
}

// 使用
val p1 = Point(1, 2)
val p2 = Point(3, 4)
val p3 = p1 + p2  // Point(4, 6)
val p4 = p3 * 2   // Point(8, 12)
val xCoord = p1[0] // 1
```

这些是 Kotlin 面向对象编程的主要概念。通过合理使用这些特性，可以构建出结构清晰、易于维护的代码。