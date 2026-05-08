# Kotlin DSL 构建

DSL（Domain-Specific Language，领域特定语言）是 Kotlin 最强大的特性之一。利用 Kotlin 的语法糖，可以创建出类似自然语言的 API，使代码更加直观和易读。

## DSL 基础概念

### 什么是 DSL

DSL 是针对特定领域问题设计的语言，分为两类：

- **内部 DSL**：基于宿主语言（Kotlin）构建，利用语言特性模拟专用语法
- **外部 DSL**：独立语言，需要单独的解析器

Kotlin 的 DSL 都是内部 DSL，利用以下特性实现：

- Lambda 表达式
- 扩展函数
- 带接收者的 Lambda
- 中缀调用
- 运算符重载

### 带接收者的 Lambda

```kotlin
// 普通 Lambda
val ordinary: (String) -> Int = { str -> str.length }

// 带接收者的 Lambda - 在 Lambda 内部可以通过 this 访问接收者
val withReceiver: String.() -> Int = { this.length }

// 调用方式不同
println(ordinary("Hello"))
println(withReceiver("Hello"))
println("Hello".withReceiver())
```

## 基本 DSL 构建

### HTML 构建器

```kotlin
class Tag(val name: String) {
    private val children = mutableListOf<Tag>()
    private val attributes = mutableListOf<Pair<String, String>>()
    var text: String = ""

    fun attr(name: String, value: String) {
        attributes.add(name to value)
    }

    fun child(tag: Tag, init: Tag.() -> Unit) {
        tag.init()
        children.add(tag)
    }

    override fun toString(): String {
        val attrs = if (attributes.isNotEmpty()) {
            attributes.joinToString(" ", prefix = " ") { "${it.first}=\"${it.second}\"" }
        } else ""
        val content = if (text.isNotEmpty()) text else children.joinToString("")
        return "<$name$attrs>$content</$name>"
    }
}

fun tag(name: String, init: Tag.() -> Unit): Tag {
    return Tag(name).apply(init)
}

fun html(init: Tag.() -> Unit) = tag("html", init)
fun Tag.head(init: Tag.() -> Unit) = child(Tag("head"), init)
fun Tag.body(init: Tag.() -> Unit) = child(Tag("body"), init)
fun Tag.div(init: Tag.() -> Unit) = child(Tag("div"), init)
fun Tag.p(init: Tag.() -> Unit) = child(Tag("p"), init)

// 使用 DSL
val page = html {
    head {
        attr("lang", "zh")
    }
    body {
        div {
            attr("class", "container")
            p {
                text = "Hello, Kotlin DSL!"
            }
        }
    }
}
println(page)
```

### 简化的 HTML DSL

```kotlin
abstract class Element(val name: String) {
    val children = mutableListOf<Element>()
    val attributes = mutableMapOf<String, String>()

    protected fun <T : Element> initElement(element: T, init: T.() -> Unit): T {
        element.init()
        children.add(element)
        return element
    }

    override fun toString(): String {
        val attrs = if (attributes.isNotEmpty()) {
            attributes.entries.joinToString(" ", prefix = " ") { "${it.key}=\"${it.value}\"" }
        } else ""
        val content = children.joinToString("")
        return "<$name$attrs>$content</$name>"
    }
}

class HTML : Element("html") {
    fun head(init: Head.() -> Unit) = initElement(Head(), init)
    fun body(init: Body.() -> Unit) = initElement(Body(), init)
}

class Head : Element("head") {
    fun title(init: Title.() -> Unit) = initElement(Title(), init)
}

class Title : Element("title")

class Body : Element("body") {
    fun div(init: Div.() -> Unit) = initElement(Div(), init)
    fun p(init: P.() -> Unit) = initElement(P(), init)
    fun h1(init: H1.() -> Unit) = initElement(H1(), init)
}

class Div : Element("div") {
    fun p(init: P.() -> Unit) = initElement(P(), init)
    fun span(init: Span.() -> Unit) = initElement(Span(), init)
}

class P : Element("p")
class H1 : Element("h1")
class Span : Element("span")

fun html(init: HTML.() -> Unit): HTML {
    return HTML().apply(init)
}

// 使用
val document = html {
    attributes["lang"] = "zh"
    head {
        title {
            children.add(Element("text") {}.apply { attributes["value"] = "My Page" })
        }
    }
    body {
        h1 {
            attributes["class"] = "title"
        }
        div {
            attributes["class"] = "content"
            p {
                attributes["id"] = "intro"
            }
        }
    }
}
```

## Gradle 风格 DSL

```kotlin
class Dependency {
    var group: String = ""
    var artifact: String = ""
    var version: String = ""
    var configuration: String = "implementation"

    override fun toString() = "$group:$artifact:$version"
}

class Dependencies {
    private val deps = mutableListOf<Dependency>()

    fun implementation(dependency: String) {
        val parts = dependency.split(":")
        deps.add(Dependency().apply {
            group = parts.getOrNull(0) ?: ""
            artifact = parts.getOrNull(1) ?: ""
            version = parts.getOrNull(2) ?: ""
            configuration = "implementation"
        })
    }

    fun testImplementation(dependency: String) {
        val parts = dependency.split(":")
        deps.add(Dependency().apply {
            group = parts.getOrNull(0) ?: ""
            artifact = parts.getOrNull(1) ?: ""
            version = parts.getOrNull(2) ?: ""
            configuration = "testImplementation"
        })
    }

    fun add(dependency: Dependency) {
        deps.add(dependency)
    }

    fun list() = deps.toList()
}

class AndroidConfig {
    var compileSdk: Int = 33
    var minSdk: Int = 21
    var targetSdk: Int = 33
    var versionCode: Int = 1
    var versionName: String = "1.0"
}

class Project {
    var group: String = ""
    var version: String = ""
    private val androidConfig = AndroidConfig()
    private val dependencies = Dependencies()

    fun android(init: AndroidConfig.() -> Unit) {
        androidConfig.init()
    }

    fun dependencies(init: Dependencies.() -> Unit) {
        dependencies.init()
    }

    fun printConfig() {
        println("Group: $group, Version: $version")
        println("Android: compileSdk=${androidConfig.compileSdk}, minSdk=${androidConfig.minSdk}")
        println("Dependencies: ${dependencies.list()}")
    }
}

fun project(init: Project.() -> Unit): Project {
    return Project().apply(init)
}

// 使用
val myProject = project {
    group = "com.example"
    version = "1.0.0"

    android {
        compileSdk = 34
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "2.0"
    }

    dependencies {
        implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.0")
        implementation("androidx.core:core-ktx:1.12.0")
        testImplementation("junit:junit:4.13.2")
    }
}
```

## 配置 DSL

```kotlin
class ServerConfig {
    var host: String = "localhost"
    var port: Int = 8080
    var debug: Boolean = false
    private val routes = mutableListOf<Route>()

    fun route(path: String, init: Route.() -> Unit) {
        routes.add(Route(path).apply(init))
    }

    fun printConfig() {
        println("Server: $host:$port (debug=$debug)")
        routes.forEach { println("  ${it.method} ${it.path} -> ${it.handler}") }
    }
}

class Route(val path: String) {
    var method: String = "GET"
    var handler: String = ""
}

fun server(init: ServerConfig.() -> Unit): ServerConfig {
    return ServerConfig().apply(init)
}

// 使用
val config = server {
    host = "0.0.0.0"
    port = 3000
    debug = true

    route("/api/users") {
        method = "GET"
        handler = "UserController.list"
    }

    route("/api/users") {
        method = "POST"
        handler = "UserController.create"
    }
}
```

## 数据构建 DSL

```kotlin
data class Person(
    val name: String,
    val age: Int,
    val address: Address? = null,
    val phones: List<Phone> = emptyList()
)

data class Address(
    val street: String,
    val city: String,
    val zipCode: String
)

data class Phone(
    val type: String,
    val number: String
)

class PersonBuilder {
    var name: String = ""
    var age: Int = 0
    private var address: Address? = null
    private val phones = mutableListOf<Phone>()

    fun address(init: AddressBuilder.() -> Unit) {
        address = AddressBuilder().apply(init).build()
    }

    fun phone(init: PhoneBuilder.() -> Unit) {
        phones.add(PhoneBuilder().apply(init).build())
    }

    fun build() = Person(name, age, address, phones)
}

class AddressBuilder {
    var street: String = ""
    var city: String = ""
    var zipCode: String = ""

    fun build() = Address(street, city, zipCode)
}

class PhoneBuilder {
    var type: String = ""
    var number: String = ""

    fun build() = Phone(type, number)
}

fun person(init: PersonBuilder.() -> Unit): Person {
    return PersonBuilder().apply(init).build()
}

// 使用
val person = person {
    name = "Alice"
    age = 25
    address {
        street = "123 Main St"
        city = "Shanghai"
        zipCode = "200000"
    }
    phone {
        type = "mobile"
        number = "138-0000-0000"
    }
    phone {
        type = "work"
        number = "021-12345678"
    }
}
```

## Kotlin DSL 中的 @DslMarker

### 作用域控制问题

```kotlin
// 没有 @DslMarker 时，可能会意外访问外层接收者
class Outer {
    fun target() = println("Outer")
}

class Inner {
    fun target() = println("Inner")
}

fun outer(init: Outer.() -> Unit) = Outer().apply(init)

// 可能误用
outer {
    target()  // Outer
    // Inner().apply {
    //     target()  // Inner
    //     this@outer.target()  // 可以访问外层，可能导致混淆
    // }
}
```

### 使用 @DslMarker 限制

```kotlin
@DslMarker
annotation class HtmlDsl

@HtmlDsl
class TableDsl {
    fun row(init: RowDsl.() -> Unit) { /* ... */ }
}

@HtmlDsl
class RowDsl {
    fun cell(init: CellDsl.() -> Unit) { /* ... */ }
}

@HtmlDsl
class CellDsl {
    var text: String = ""
}

// 使用 @DslMarker 后，不能隐式访问外层接收者
// table {
//     row {
//         cell {
//             row { }  // 编译错误！不能在 CellDsl 中访问 TableDsl 的方法
//         }
//     }
// }
```

## 中缀调用 DSL

```kotlin
class QueryBuilder {
    private val conditions = mutableListOf<String>()
    private var tableName: String = ""

    infix fun from(table: String): QueryBuilder {
        tableName = table
        return this
    }

    infix fun where(condition: String): QueryBuilder {
        conditions.add(condition)
        return this
    }

    infix fun and(condition: String): QueryBuilder {
        conditions.add("AND $condition")
        return this
    }

    infix fun or(condition: String): QueryBuilder {
        conditions.add("OR $condition")
        return this
    }

    fun build(): String {
        return "SELECT * FROM $tableName WHERE ${conditions.joinToString(" ")}"
    }
}

fun query(init: QueryBuilder.() -> Unit): String {
    return QueryBuilder().apply(init).build()
}

// 使用
val sql = query {
    this from "users" where "age > 18" and "active = true"
}
```

## 测试 DSL

```kotlin
class TestSuite(val name: String) {
    private val tests = mutableListOf<TestCase>()

    fun test(name: String, block: () -> Unit) {
        tests.add(TestCase(name, block))
    }

    fun run() {
        println("Suite: $name")
        tests.forEach { test ->
            print("  - ${test.name}: ")
            try {
                test.block()
                println("PASSED")
            } catch (e: AssertionError) {
                println("FAILED - ${e.message}")
            }
        }
    }
}

data class TestCase(val name: String, val block: () -> Unit)

fun suite(name: String, init: TestSuite.() -> Unit): TestSuite {
    return TestSuite(name).apply(init)
}

// 使用
suite("String operations") {
    test("concatenation") {
        val result = "Hello" + " " + "World"
        assert(result == "Hello World") { "Expected 'Hello World', got '$result'" }
    }
    test("length") {
        val result = "Kotlin".length
        assert(result == 6) { "Expected 6, got $result" }
    }
}.run()
```

## 最佳实践

1. **使用 @DslMarker 限制作用域**：防止 DSL 用户意外访问外层接收者
2. **保持 DSL 简洁**：只暴露必要的 API，隐藏实现细节
3. **使用 Builder 模式**：将 DSL 配置转换为不可变数据对象
4. **合理使用中缀调用**：使 DSL 更像自然语言
5. **提供类型安全的 API**：利用泛型和扩展函数避免运行时错误
6. **文档化 DSL 用法**：提供清晰的示例和使用说明
