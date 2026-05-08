# Kotlin 反射与注解

反射和注解是 Kotlin 中实现元编程的两种重要机制。反射允许在运行时检查和操作代码结构，注解则提供了一种在代码中添加元数据的方式。

## 反射基础

### 添加依赖

```gradle
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-reflect:1.9.0"
}
```

### 类引用

```kotlin
// Kotlin 类引用
val kotlinClass: KClass<Person> = Person::class

// 通过对象获取类引用
val person = Person("Alice", 25)
val personClass: KClass<out Person> = person::class

// Java 类引用
val javaClass: Class<Person> = Person::class.java

// 互转
val fromJava: KClass<*> = javaClass.kotlin
val toJava: Class<*> = kotlinClass.java
```

### 函数引用

```kotlin
fun greet(name: String): String = "Hello, $name!"

// 获取函数引用
val greetRef = ::greet
println(greetRef.name)
println(greetRef.parameters)
println(greetRef.returnType)

// 调用
val result = greetRef.call("Kotlin")

// 成员函数引用
class Person(val name: String) {
    fun greet() = "Hi, I'm $name"
}

val person = Person("Alice")
val greetMethod = Person::greet
println(greetMethod.call(person))

val boundGreet = person::greet
println(boundGreet())
```

### 属性引用

```kotlin
class Person(val name: String, var age: Int)

val person = Person("Alice", 25)

// 顶层属性引用
val prop = Person::name
println(prop.name)
println(prop.get(person))
println(prop.returnType)

// 可变属性引用
val ageProp = Person::age
ageProp.set(person, 26)

// 绑定属性引用
val nameRef = person::name
println(nameRef())
```

## KClass 详解

### 类成员访问

```kotlin
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KProperty

class Example(
    val publicVal: String = "public",
    private val privateVal: String = "private",
    var mutableVar: Int = 0
) {
    fun publicFun() = "public function"
    private fun privateFun() = "private function"

    companion object {
        const val CONSTANT = "constant"
    }
}

fun inspectClass() {
    val cls = Example::class

    // 类基本信息
    println("Simple name: ${cls.simpleName}")
    println("Qualified name: ${cls.qualifiedName}")
    println("Is abstract: ${cls.isAbstract}")
    println("Is sealed: ${cls.isSealed}")
    println("Is data: ${cls.isData}")
    println("Is companion: ${cls.isCompanion}")

    // 构造函数
    println("Constructors: ${cls.constructors}")
    cls.constructors.forEach { ctor ->
        println("  Parameters: ${ctor.parameters}")
    }

    // 成员函数
    cls.memberFunctions.forEach { func ->
        println("Function: ${func.name}, Parameters: ${func.parameters}")
    }

    // 属性
    cls.memberProperties.forEach { prop ->
        println("Property: ${prop.name}, Type: ${prop.returnType}")
    }

    // 所有声明（包括私有）
    cls.declaredMemberFunctions.forEach { func ->
        println("Declared function: ${func.name}")
    }
    cls.declaredMemberProperties.forEach { prop ->
        println("Declared property: ${prop.name}")
    }
}
```

### 构造函数调用

```kotlin
data class User(val name: String, val age: Int, val email: String)

fun createInstance() {
    val cls = User::class

    // 通过主构造函数创建实例
    val ctor = cls.primaryConstructor!!
    val user = ctor.call("Alice", 25, "alice@example.com")

    // 通过参数 Map 创建
    val user2 = ctor.callBy(mapOf(
        ctor.parameters[0] to "Bob",
        ctor.parameters[1] to 30,
        ctor.parameters[2] to "bob@example.com"
    ))

    // 使用默认参数值
    class Config(val host: String, val port: Int = 8080)
    val configCtor = Config::class.primaryConstructor!!
    val config = configCtor.callBy(mapOf(
        configCtor.parameters[0] to "localhost"
    ))
}
```

### 类型系统

```kotlin
import kotlin.reflect.full.createType
import kotlin.reflect.full.isSubtypeOf

fun typeSystem() {
    val stringType = String::class.createType()
    val anyType = Any::class.createType()
    val nullableStringType = String::class.createType(nullable = true)

    println("String is subtype of Any: ${stringType.isSubtypeOf(anyType)}")
    println("String? is subtype of Any: ${nullableStringType.isSubtypeOf(anyType)}")
    println("String is subtype of Any?: ${stringType.isSubtypeOf(anyType)}")
}
```

## 注解基础

### 定义注解

```kotlin
// 无参数注解
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Table(val name: String)

// 带参数注解
@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Column(val name: String, val type: String = "TEXT")

// 方法注解
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Route(val path: String, val method: String = "GET")

// 多目标注解
@Target(
    AnnotationTarget.CLASS,
    AnnotationTarget.FUNCTION,
    AnnotationTarget.PROPERTY
)
@Retention(AnnotationRetention.RUNTIME)
annotation class Documentation(val description: String)
```

### 注解目标

```kotlin
// 不同的注解目标
@Target(AnnotationTarget.CLASS)         // 类
@Target(AnnotationTarget.FUNCTION)      // 函数
@Target(AnnotationTarget.PROPERTY)      // 属性
@Target(AnnotationTarget.FIELD)         // 字段（幕后字段）
@Target(AnnotationTarget.VALUE_PARAMETER) // 值参数
@Target(AnnotationTarget.EXPRESSION)    // 表达式
@Target(AnnotationTarget.TYPE)          // 类型
@Target(AnnotationTarget.FILE)          // 文件

// 保留策略
@Retention(AnnotationRetention.SOURCE)  // 仅源码（如 @Deprecated）
@Retention(AnnotationRetention.BINARY)  // 编译到 class 文件但运行时不可见
@Retention(AnnotationRetention.RUNTIME) // 运行时可通过反射访问
```

### 使用注解

```kotlin
@Table(name = "users")
data class User(
    @Column(name = "id", type = "INTEGER")
    val id: Long,

    @Column(name = "username", type = "VARCHAR(50)")
    val username: String,

    @Column(name = "email", type = "VARCHAR(100)")
    val email: String,

    @Column(name = "active", type = "BOOLEAN")
    val active: Boolean = true
)

class UserController {
    @Route("/api/users", method = "GET")
    fun listUsers(): List<User> = emptyList()

    @Route("/api/users", method = "POST")
    fun createUser(): User = User(1, "new", "new@example.com")

    @Route("/api/users/{id}", method = "GET")
    fun getUser(id: Long): User? = null
}
```

## 反射与注解结合

### ORM 映射示例

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Entity(val tableName: String)

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Id
annotation class Column(val name: String = "")
annotation class Ignore

@Entity(tableName = "t_students")
data class Student(
    @Id
    @Column(name = "student_id")
    val id: Long,

    @Column(name = "student_name")
    val name: String,

    @Column(name = "student_age")
    val age: Int,

    @Ignore
    val tempData: String = ""
)

object SimpleOrm {
    fun getTableName(cls: KClass<*>): String {
        val entity = cls.findAnnotation<Entity>()
        return entity?.tableName ?: cls.simpleName?.lowercase() ?: "unknown"
    }

    fun getColumns(cls: KClass<*>): List<Pair<String, KProperty1<*, *>>> {
        return cls.memberProperties
            .filter { prop -> prop.findAnnotation<Ignore>() == null }
            .map { prop ->
                val column = prop.findAnnotation<Column>()
                val columnName = column?.name?.takeIf { it.isNotEmpty() } ?: prop.name
                columnName to prop
            }
    }

    fun isId(prop: KProperty1<*, *>): Boolean {
        return prop.findAnnotation<Id>() != null
    }

    fun <T : Any> toInsertSql(cls: KClass<T>): String {
        val table = getTableName(cls)
        val columns = getColumns(cls)
        val columnNames = columns.joinToString(", ") { it.first }
        val placeholders = columns.joinToString(", ") { "?" }
        return "INSERT INTO $table ($columnNames) VALUES ($placeholders)"
    }
}

fun main() {
    val sql = SimpleOrm.toInsertSql(Student::class)
    println(sql)

    SimpleOrm.getColumns(Student::class).forEach { (name, prop) ->
        val isId = SimpleOrm.isId(prop)
        println("Column: $name, Property: ${prop.name}, IsId: $isId")
    }
}
```

### 依赖注入示例

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class Singleton

@Target(AnnotationTarget.PROPERTY)
@Retention(AnnotationRetention.RUNTIME)
annotation class Inject

interface Repository {
    fun getData(): String
}

@Singleton
class RemoteRepository : Repository {
    override fun getData() = "Remote Data"
}

@Singleton
class Service {
    @Inject
    lateinit var repository: Repository

    fun process(): String = "Processing: ${repository.getData()}"
}

object SimpleContainer {
    private val instances = mutableMapOf<KClass<*>, Any>()

    inline fun <reified T : Any> get(): T {
        return resolve(T::class) as T
    }

    fun <T : Any> resolve(cls: KClass<T>): T {
        @Suppress("UNCHECKED_CAST")
        instances[cls]?.let { return it as T }

        val ctor = cls.constructors.first()
        val instance = ctor.call()

        if (cls.findAnnotation<Singleton>() != null) {
            instances[cls] = instance
        }

        cls.memberProperties
            .filter { it.findAnnotation<Inject>() != null }
            .forEach { prop ->
                val propType = prop.returnType.classifier as KClass<*>
                val dependency = resolve(propType as KClass<Any>)
                (prop as KProperty1<Any, Any>).set(instance, dependency)
            }

        return instance
    }
}
```

### 路由注册示例

```kotlin
object Router {
    private val routes = mutableMapOf<String, Pair<String, KFunction<*>>>()

    fun register(controller: Any) {
        val cls = controller::class
        cls.memberFunctions.forEach { func ->
            val route = func.findAnnotation<Route>()
            if (route != null) {
                val key = "${route.method} ${route.path}"
                routes[key] = controller to func
            }
        }
    }

    fun dispatch(method: String, path: String): String? {
        val key = "$method $path"
        val (controller, func) = routes[key] ?: return null
        val result = func.call(controller)
        return result?.toString()
    }
}
```

## 常用反射操作

### 动态调用方法

```kotlin
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
    fun multiply(a: Int, b: Int): Int = a * b
}

fun dynamicCall() {
    val calc = Calculator()
    val cls = calc::class

    val method = cls.memberFunctions.find { it.name == "add" }
    val result = method?.call(calc, 3, 5)
    println(result)
}
```

### 动态访问属性

```kotlin
data class Config(var host: String, var port: Int)

fun dynamicAccess() {
    val config = Config("localhost", 8080)
    val cls = config::class

    cls.memberProperties.forEach { prop ->
        val value = (prop as KProperty1<Config, *>).get(config)
        println("${prop.name} = $value")
    }

    val portProp = cls.memberProperties.find { it.name == "port" } as KMutableProperty1<Config, Int>
    portProp.set(config, 9090)
    println(config)
}
```

### 检查泛型类型

```kotlin
inline fun <reified T> checkType(value: Any): Boolean {
    return value is T
}

inline fun <reified T> KProperty1<*, *>.isTypeOf(): Boolean {
    return returnType.classifier == T::class
}
```

## 反射的性能考虑

```kotlin
// 反射操作较慢，应缓存结果
object ReflectionCache {
    private val classInfoCache = mutableMapOf<KClass<*>, ClassInfo>()

    data class ClassInfo(
        val tableName: String,
        val columns: List<Pair<String, KProperty1<*, *>>>
    )

    fun getClassInfo(cls: KClass<*>): ClassInfo {
        return classInfoCache.getOrPut(cls) {
            val entity = cls.findAnnotation<Entity>()
            val tableName = entity?.tableName ?: cls.simpleName?.lowercase() ?: ""
            val columns = cls.memberProperties.map { it.name to it }
            ClassInfo(tableName, columns)
        }
    }
}
```

## 最佳实践

1. **优先使用非反射方案**：反射有性能开销，仅在必要时使用
2. **缓存反射结果**：避免重复的反射操作
3. **使用 @DslMarker 限制作用域**：确保注解处理器正确工作
4. **注意安全性**：反射可以绕过访问控制，谨慎使用
5. **合理选择保留策略**：SOURCE 用于编译时处理，RUNTIME 用于运行时反射
6. **使用 kapt 或 KSP**：对于注解处理，优先使用编译时代码生成
