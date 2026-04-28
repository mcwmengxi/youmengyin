# Kotlin 空安全机制

Kotlin 的空安全机制是一种设计，旨在消除程序运行时的空指针异常（NullPointerException），这是软件开发中最常见的错误之一。

## 可空与非空类型

在 Kotlin 中，类型系统区分可空和非空引用。

### 非空类型（默认）

```kotlin
// 非空类型 - 不能为 null
var name: String = "Kotlin"
// name = null  // 编译错误！

// 函数参数和返回值也是非空的
fun greet(name: String): String {
    return "Hello, $name!"
}
```

### 可空类型

```kotlin
// 可空类型 - 用 ? 表示
var nullableName: String? = "Kotlin"
nullableName = null  // 合法

// 可空返回值
fun findName(id: Int): String? {
    return if (id > 0) "Found" else null
}
```

## 安全调用操作符（?.）

安全调用操作符允许在对象为 null 时不执行后续操作。

```kotlin
var str: String? = "Hello"
val length = str?.length  // 5

str = null
val nullLength = str?.length  // null（不会抛出异常）

// 链式调用
val user: User? = getUser()
val userNameLength = user?.address?.street?.length
```

## Elvis 操作符（?:）

Elvis 操作符提供了一种简洁的方式来处理可能为 null 的值。

```kotlin
fun getUserName(userId: String): String? {
    // 可能返回 null
    return if (userId == "valid") "John" else null
}

val name = getUserName("invalid") ?: "Unknown"
println(name)  // 输出: Unknown

// 更复杂的 Elvis 操作符使用
fun getUserNameOrThrow(userId: String): String {
    return getUserName(userId) ?: throw IllegalArgumentException("User not found")
}

// 使用 Elvis 操作符计算默认值
fun getDisplayName(user: User?): String {
    return user?.name ?: "No name provided"
}
```

## 非空断言操作符（!!）

非空断言操作符将任何值转换为非空类型，但如果值为 null，则会抛出异常。

```kotlin
var str: String? = "Hello"
val nonNullStr = str!!  // 断言 str 不为 null
println(nonNullStr.length)  // 5

str = null
// val length = str!!  // 抛出 KotlinNullPointerException
```

## 安全转换（as?）

安全转换操作符在转换失败时返回 null 而不是抛出异常。

```kotlin
fun example(value: Any) {
    val str = value as? String  // 如果 value 不是 String 类型则返回 null
    if (str != null) {
        println(str.toUpperCase())
    }
}

// 示例
example("hello")  // HELLO
example(123)      // 什么也不打印
```

## 平台类型

在与 Java 代码交互时，可能会遇到平台类型，它们可能是 null 或非 null。

```kotlin
// Java 代码
public class JavaClass {
    public String getString() {
        return Math.random() > 0.5 ? "Hello" : null;
    }
}

// Kotlin 中使用（平台类型）
val javaClass = JavaClass()
val str: String? = javaClass.string  // 需要明确声明为可空
val str2: String = javaClass.string   // 编译器警告，运行时可能崩溃
```

## 安全的类型检查

```kotlin
fun processValue(obj: Any?) {
    // 智能转换配合空安全
    if (obj is String && obj.length > 0) {
        // 此处 obj 被智能转换为非空 String
        println(obj.toUpperCase())
    }
    
    // 或者使用安全调用
    (obj as? String)?.let { str ->
        if (str.isNotEmpty()) {
            println(str.toUpperCase())
        }
    }
}
```

## 空安全的实际应用

### 1. 集合中的空值处理

```kotlin
val list: List<String?> = listOf("a", null, "c")
val nonNullList = list.filterNotNull()  // ["a", "c"]

// 链式操作
val lengths = list
    .filterNotNull()
    .map { it.length }
```

### 2. 构造函数中的空安全

```kotlin
class User(val name: String, val email: String?) {
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
        // email 可以为 null，但我们仍需检查格式
        if (email != null) {
            require(email.contains("@")) { "Invalid email format" }
        }
    }
    
    val displayName: String
        get() = if (email != null) "$name <$email>" else name
}
```

### 3. 使用 let 进行安全操作

```kotlin
fun updateUI(user: User?) {
    user?.let { u ->  // 只有当 user 非空时才执行
        // 更新 UI
        binding.userName.text = u.name
        u.email?.let { email ->
            binding.userEmail.text = email
        } ?: run {
            binding.userEmail.visibility = View.GONE
        }
    } ?: run {
        // user 为 null 时的操作
        showLoginPrompt()
    }
}
```

## lateinit 和 lazy 属性

### lateinit 属性

```kotlin
class TestClass {
    @Test
    fun setup() {
        // lateinit 用于稍后初始化的非空属性
        lateinit var service: MyService
        
        @BeforeTest
        fun initialize() {
            service = MyService()
        }
        
        @Test
        fun testSomething() {
            assertTrue(service::service.isInitialized)  // 检查是否已初始化
            // 使用 service
        }
    }
}
```

### lazy 属性

```kotlin
class ExpensiveClass {
    // lazy 委托确保属性只初始化一次，且是线程安全的
    val expensiveObject: ExpensiveObject by lazy {
        println("Creating expensive object")
        ExpensiveObject()
    }
    
    fun useObject() {
        // 第一次访问时才会创建 expensiveObject
        println(expensiveObject.toString())
    }
}
```

## 最佳实践

### 1. 优先使用不可空类型

```kotlin
// 好的做法
fun processName(name: String) {  // name 保证非空
    println(name.length)
}

// 避免这样做（除非确实需要处理 null）
fun processName(name: String?) {
    if (name != null) {
        println(name.length)
    }
}
```

### 2. 使用合适的安全调用操作符

```kotlin
// 安全地访问深层嵌套的对象
val streetName = user?.address?.street?.name

// 如果需要默认值
val streetNameOrDefault = user?.address?.street?.name ?: "Unknown Street"
```

### 3. 合理使用 !! 操作符

```kotlin
// 仅在确定非空时使用
fun definitelyNotNull(str: String?) {
    // 如果你确信 str 不为 null，或者希望在此情况下崩溃
    val length = str!!.length
}
```

### 4. 避免过度使用空安全

```kotlin
// 避免过度防御性编程
if (user != null) {
    if (user.address != null) {
        if (user.address.street != null) {
            println(user.address.street.name)
        }
    }
}

// 更好的方式
user?.address?.street?.let { street ->
    println(street.name)
}
```

通过正确理解和使用 Kotlin 的空安全机制，我们可以编写出更安全、更可靠的代码，有效防止空指针异常的发生。