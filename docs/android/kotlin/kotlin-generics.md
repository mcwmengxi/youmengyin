# Kotlin 泛型编程

泛型是 Kotlin 中实现代码复用和类型安全的重要机制。通过泛型，可以编写适用于多种类型的代码，同时保持编译时的类型检查。

## 泛型基础

### 泛型函数

```kotlin
fun <T> singletonList(item: T): List<T> {
    return listOf(item)
}

fun <T> List<T>.secondOrNull(): T? {
    return if (size >= 2) this[1] else null
}

// 多类型参数
fun <K, V> mapOfPairs(vararg pairs: Pair<K, V>): Map<K, V> {
    return pairs.toMap()
}

// 使用
val stringList = singletonList("Hello")
val intList = singletonList(42)
val map = mapOfPairs("name" to "Alice", 1 to "first")
```

### 泛型类

```kotlin
class Box<T>(val value: T) {
    fun getValue(): T = value
    fun isValue(expected: T): Boolean = value == expected
}

class Pair<A, B>(val first: A, val second: B) {
    fun swapped(): Pair<B, A> = Pair(second, first)
    fun <C> mapFirst(transform: (A) -> C): Pair<C, B> {
        return Pair(transform(first), second)
    }
}

// 使用
val stringBox = Box("Hello")
val intBox = Box(42)
val pair = Pair("name", 25)
val swapped = pair.swapped()
```

### 泛型接口

```kotlin
interface Repository<T> {
    fun findById(id: String): T?
    fun findAll(): List<T>
    fun save(item: T): T
    fun delete(id: String): Boolean
}

interface Comparator<T> {
    fun compare(a: T, b: T): Int
}

class InMemoryRepository<T>(private val items: MutableMap<String, T> = mutableMapOf()) : Repository<T> {
    override fun findById(id: String): T? = items[id]
    override fun findAll(): List<T> = items.values.toList()
    override fun save(item: T): T = item.also { items[item.toString()] = it }
    override fun delete(id: String): Boolean = items.remove(id) != null
}
```

## 类型约束

### 单一约束

```kotlin
// T 必须实现 Comparable 接口
fun <T : Comparable<T>> List<T>.sortedAscending(): List<T> {
    return this.sorted()
}

// T 必须是 Number 的子类
fun <T : Number> List<T>.sumOfDoubles(): Double {
    return this.sumOf { it.toDouble() }
}

// T 必须有默认构造函数
class Container<T : Any>(val item: T) {
    fun getType(): String = item::class.simpleName ?: "Unknown"
}
```

### 多重约束 (where)

```kotlin
fun <T> ensureTrailingPeriod(item: T) where T : CharSequence, T : Appendable {
    if (!item.endsWith('.')) {
        item.append('.')
    }
}

// 多约束泛型类
class Processor<T> where T : Comparable<T>, T : Serializable {
    fun process(item: T): String {
        return "Processing: $item"
    }
}
```

## 型变 (Variance)

型变是泛型中最复杂的概念，它描述了泛型类型之间的子类型关系。

### 不可变 (Invariant)

```kotlin
// 默认情况下，泛型是不可变的
class Container<T>(var value: T)

// Container<String> 不是 Container<Any> 的子类型
val stringContainer: Container<String> = Container("Hello")
// val anyContainer: Container<Any> = stringContainer  // 编译错误！
```

### 协变 (Covariant - out)

```kotlin
// out 修饰符表示 T 只能出现在输出位置（返回值）
interface Producer<out T> {
    fun produce(): T
}

class StringProducer : Producer<String> {
    override fun produce(): String = "Hello"
}

// 协变允许子类型关系
val producer: Producer<Any> = StringProducer()

// 实际应用：List 是协变的
// List<out T> - List<String> 是 List<Any> 的子类型
val strings: List<String> = listOf("a", "b", "c")
val anys: List<Any> = strings
```

### 逆协变 (Contravariant - in)

```kotlin
// in 修饰符表示 T 只能出现在输入位置（参数）
interface Consumer<in T> {
    fun consume(item: T)
}

class AnyConsumer : Consumer<Any> {
    override fun consume(item: Any) {
        println("Consumed: $item")
    }
}

// 逆协变允许子类型关系反转
val consumer: Consumer<String> = AnyConsumer()

// 实际应用：Comparator 是逆协变的
// Comparator<in T>
val anyComparator: Comparator<Any> = compareBy { it.toString() }
val stringComparator: Comparator<String> = anyComparator
```

### 型变总结

| 修饰符 | 含义 | T 的位置 | 子类型关系 |
|--------|------|----------|------------|
| 无 (invariant) | 不可变 | 输入和输出 | 无 |
| out | 协变 | 仅输出（返回值） | Producer\<Sub\> 是 Producer\<Base\> 的子类型 |
| in | 逆协变 | 仅输入（参数） | Consumer\<Base\> 是 Consumer\<Sub\> 的子类型 |

## 星投影 (Star Projection)

```kotlin
// 当不确定泛型类型参数时使用星投影
fun printList(list: List<*>) {
    for (item in list) {
        println(item)
    }
}

// Array<*> 等价于 Array<out Any?>
fun Array<*>.printTypes() {
    for (item in this) {
        println(item?.javaClass?.simpleName ?: "null")
    }
}

// 星投影的限制
// MutableList<*> 不能添加元素（除了 null）
// 因为不知道具体类型，编译器不允许添加不安全的元素
fun mutateList(list: MutableList<*>) {
    // list.add("hello")  // 编译错误！
    list.clear()
}
```

## 类型擦除与具体化

### 类型擦除

```kotlin
// 运行时泛型类型信息被擦除
val stringList: List<String> = listOf("a", "b")
val intList: List<Int> = listOf(1, 2)

// 运行时都是 List
println(stringList.javaClass == intList.javaClass)

// 无法在运行时检查泛型类型
fun <T> isTypeOf(value: Any): Boolean {
    // return value is T  // 编译错误！类型参数已被擦除
    return false
}
```

### 具体化类型参数 (reified)

```kotlin
// 使用 reified 保留类型信息（仅限 inline 函数）
inline fun <reified T> isInstanceOf(value: Any): Boolean {
    return value is T
}

inline fun <reified T> List<*>.filterInstanceOf(): List<T> {
    return filterIsInstance<T>()
}

inline fun <reified T> Gson.fromJson(json: String): T {
    return fromJson(json, T::class.java)
}

// 使用
val result = isInstanceOf<String>("Hello")
val numbers: List<Int> = listOf(1, "two", 3, "four", 5).filterInstanceOf()
```

### reified 的实际应用

```kotlin
// 简化 Fragment 参数获取
inline fun <reified VM : ViewModel> Fragment.viewModel(): Lazy<VM> {
    return lazy { ViewModelProvider(this)[VM::class.java] }
}

// 类型安全的 JSON 解析
inline fun <reified T> parseJson(json: String): T {
    return Gson().fromJson(json, object : TypeToken<T>() {}.type)
}

// 启动 Activity
inline fun <reified T : Activity> Context.startActivity(vararg params: Pair<String, Any?>) {
    val intent = Intent(this, T::class.java)
    params.forEach { (key, value) ->
        when (value) {
            is Int -> intent.putExtra(key, value)
            is String -> intent.putExtra(key, value)
            is Boolean -> intent.putExtra(key, value)
        }
    }
    startActivity(intent)
}
```

## 泛型与集合

```kotlin
// 集合操作中的泛型
fun <T : Comparable<T>> List<T>.findMedian(): T? {
    if (isEmpty()) return null
    val sorted = sorted()
    return sorted[size / 2]
}

// 多泛型集合操作
fun <T, R> List<T>.mapNotNullWith(transform: (T) -> R?): List<R> {
    return mapNotNull(transform)
}

// 泛型集合过滤
inline fun <reified T> List<Any>.filterByType(): List<T> {
    return filterIsInstance<T>()
}
```

## 泛型委托

```kotlin
import kotlin.properties.ReadWriteProperty
import kotlin.reflect.KProperty

class MapDelegate<T>(private val map: MutableMap<String, Any?>, private val key: String) :
    ReadWriteProperty<Any?, T> {
    override fun getValue(thisRef: Any?, property: KProperty<*>): T {
        @Suppress("UNCHECKED_CAST")
        return map[key] as T
    }

    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        map[key] = value
    }
}

class User(map: MutableMap<String, Any?>) {
    var name: String by MapDelegate(map, "name")
    var age: Int by MapDelegate(map, "age")
}

// 使用
val data = mutableMapOf<String, Any?>(
    "name" to "Alice",
    "age" to 25
)
val user = User(data)
println(user.name)
user.age = 26
```

## 高级泛型模式

### 生成器模式

```kotlin
class Builder<T> {
    private val items = mutableListOf<T>()

    fun add(item: T): Builder<T> = apply { items.add(item) }
    fun addAll(items: Collection<T>): Builder<T> = apply { this.items.addAll(items) }
    fun build(): List<T> = items.toList()
}

val list = Builder<String>()
    .add("first")
    .add("second")
    .addAll(listOf("third", "fourth"))
    .build()
```

### 类型安全的构建器

```kotlin
class Table<T> {
    private val rows = mutableListOf<List<T>>()

    fun row(vararg values: T) {
        rows.add(values.toList())
    }

    fun <R> transform(transformer: (T) -> R): Table<R> {
        val newTable = Table<R>()
        rows.forEach { row ->
            newTable.row(*row.map(transformer).toTypedArray())
        }
        return newTable
    }
}
```

### 递归泛型

```kotlin
// 自引用泛型（F-bounded polymorphism）
interface Comparable<T : Comparable<T>> {
    fun compareTo(other: T): Int
}

class Version(val major: Int, val minor: Int) : Comparable<Version> {
    override fun compareTo(other: Version): Int {
        val majorComp = major.compareTo(other.major)
        return if (majorComp != 0) majorComp else minor.compareTo(other.minor)
    }
}
```

## 最佳实践

1. **优先使用泛型而非 Any**：泛型提供编译时类型安全
2. **合理使用型变**：生产者用 out，消费者用 in
3. **使用 reified 简化代码**：当需要运行时类型信息时使用 inline + reified
4. **避免过度复杂化**：不要创建过于复杂的泛型约束
5. **命名泛型参数**：对于多类型参数，使用有意义的名称如 Key、Value 而非 K、V
