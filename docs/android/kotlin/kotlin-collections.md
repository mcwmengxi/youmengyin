# Kotlin 集合框架

Kotlin 的集合框架建立在 Java 集合框架之上，但提供了更丰富的 API 和更安全的类型系统。Kotlin 区分只读集合和可变集合。

## 集合类型概述

| 类型 | 只读 | 可变 | 说明 |
|------|------|------|------|
| List | List | MutableList | 有序集合，允许重复元素 |
| Set | Set | MutableSet | 无序集合，不允许重复元素 |
| Map | Map | MutableMap | 键值对集合，键不允许重复 |

## List 列表

### 创建 List

```kotlin
// 只读 List
val readOnlyList = listOf("apple", "banana", "cherry")
val emptyList = emptyList<String>()
val numberList = listOf(1, 2, 3, 4, 5)

// 可变 MutableList
val mutableList = mutableListOf("apple", "banana")
mutableList.add("cherry")
mutableList.add(0, "avocado")
mutableList.remove("banana")

// 使用构建器创建
val list = buildList {
    add("first")
    add("second")
    add("third")
}
```

### List 常用操作

```kotlin
val fruits = listOf("apple", "banana", "cherry", "date")

// 访问元素
val first = fruits.first()
val last = fruits.last()
val element = fruits[2]
val safeElement = fruits.getOrNull(10)

// 查找元素
val containsApple = fruits.contains("apple")
val index = fruits.indexOf("cherry")
val lastIndex = fruits.lastIndexOf("date")

// 截取子列表
val subList = fruits.subList(1, 3)

// 判断条件
val allLong = fruits.all { it.length > 3 }
val anyLong = fruits.any { it.length > 6 }
val noneLong = fruits.none { it.length > 10 }
```

## Set 集合

### 创建 Set

```kotlin
// 只读 Set
val readOnlySet = setOf("apple", "banana", "cherry")
val emptySet = emptySet<String>()

// 可变 MutableSet
val mutableSet = mutableSetOf("apple", "banana")
mutableSet.add("cherry")
mutableSet.remove("apple")

// 去重
val numbers = listOf(1, 2, 2, 3, 3, 4)
val uniqueNumbers = numbers.toSet()
```

### Set 常用操作

```kotlin
val setA = setOf(1, 2, 3, 4)
val setB = setOf(3, 4, 5, 6)

// 交集
val intersect = setA.intersect(setB)

// 并集
val union = setA.union(setB)

// 差集
val difference = setA.subtract(setB)

// 判断子集
val isSubset = setOf(1, 2).isSubsetOf(setA)

// 判断元素
val contains = setA.contains(3)
val containsAll = setA.containsAll(setOf(1, 2))
```

## Map 映射

### 创建 Map

```kotlin
// 只读 Map
val readOnlyMap = mapOf("name" to "Alice", "age" to "25")
val emptyMap = emptyMap<String, String>()

// 可变 MutableMap
val mutableMap = mutableMapOf("name" to "Bob")
mutableMap["age"] = "30"
mutableMap.put("city", "Beijing")
mutableMap.remove("age")

// 使用构建器创建
val map = buildMap {
    put("key1", "value1")
    put("key2", "value2")
}
```

### Map 常用操作

```kotlin
val userMap = mapOf("name" to "Alice", "age" to "25", "city" to "Shanghai")

// 访问元素
val name = userMap["name"]
val safeName = userMap.getOrDefault("nickname", "Unknown")
val nameOrCompute = userMap.getOrElse("nickname") { "No nickname" }

// 遍历
for ((key, value) in userMap) {
    println("$key = $value")
}

userMap.forEach { (key, value) ->
    println("$key = $value")
}

// 键和值的集合
val keys = userMap.keys
val values = userMap.values
val entries = userMap.entries

// 判断键是否存在
val hasName = userMap.containsKey("name")
val hasValue = userMap.containsValue("Alice")
```

## 集合转换操作

### map 与 flatMap

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// map - 对每个元素进行转换
val doubled = numbers.map { it * 2 }
val names = numbers.map { "Number $it" }

// mapNotNull - 转换并过滤 null
val parsed = listOf("1", "a", "3", "b").mapNotNull { it.toIntOrNull() }

// flatMap - 对每个元素转换后展平
val words = listOf("Hello World", "Kotlin Programming")
val allWords = words.flatMap { it.split(" ") }

val nestedLists = listOf(listOf(1, 2), listOf(3, 4), listOf(5, 6))
val flattened = nestedLists.flatten()
```

### filter 与过滤操作

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// filter - 保留满足条件的元素
val evens = numbers.filter { it % 2 == 0 }
val greaterThan5 = numbers.filter { it > 5 }

// filterNot - 保留不满足条件的元素
val odds = numbers.filterNot { it % 2 == 0 }

// filterNotNull - 过滤 null
val mixed: List<Int?> = listOf(1, null, 3, null, 5)
val nonNull = mixed.filterNotNull()

// filterIsInstance - 按类型过滤
val mixedTypes: List<Any> = listOf(1, "hello", 2.0, "world", 3)
val strings = mixedTypes.filterIsInstance<String>()

// take 与 drop
val first3 = numbers.take(3)
val last3 = numbers.takeLast(3)
val withoutFirst3 = numbers.drop(3)
val withoutLast3 = numbers.dropLast(3)

// takeWhile 与 dropWhile
val takeResult = numbers.takeWhile { it < 5 }
val dropResult = numbers.dropWhile { it < 5 }
```

### 排序操作

```kotlin
val numbers = listOf(3, 1, 4, 1, 5, 9, 2, 6)

// sorted - 返回排序后的新列表
val ascending = numbers.sorted()
val descending = numbers.sortedDescending()

// sortedBy - 按条件排序
data class Person(val name: String, val age: Int)
val people = listOf(Person("Alice", 25), Person("Bob", 20), Person("Charlie", 30))

val byAge = people.sortedBy { it.age }
val byName = people.sortedByDescending { it.name }

// sortedWith - 使用比较器
val customSorted = people.sortedWith(compareBy({ it.age }, { it.name }))

// shuffle 与 reversed
val shuffled = numbers.shuffled()
val reversed = numbers.reversed()
```

### 分组与分区

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// partition - 将集合分为两部分
val (evens, odds) = numbers.partition { it % 2 == 0 }

// groupBy - 按条件分组
val groupedByRemainder = numbers.groupBy { it % 3 }

data class Student(val name: String, val grade: Char)
val students = listOf(
    Student("Alice", 'A'),
    Student("Bob", 'B'),
    Student("Charlie", 'A'),
    Student("David", 'C'),
    Student("Eve", 'B')
)
val byGrade = students.groupBy { it.grade }

// chunked - 分块
val chunks = numbers.chunked(3)

// windowed - 滑动窗口
val windows = numbers.windowed(3, step = 2)
```

### 聚合操作

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// 基本聚合
val sum = numbers.sum()
val avg = numbers.average()
val min = numbers.minOrNull()
val max = numbers.maxOrNull()
val count = numbers.count()

// reduce - 从左到右累积
val sumByReduce = numbers.reduce { acc, num -> acc + num }

// fold - 带初始值的累积
val sumByFold = numbers.fold(0) { acc, num -> acc + num }
val product = numbers.fold(1) { acc, num -> acc * num }

// reduceRight / foldRight - 从右到左
val reversedConcat = numbers.reduceRight { num, acc -> num.toString() + acc }

// count - 计数
val evenCount = numbers.count { it % 2 == 0 }

// sumOf / maxOf / minOf
data class Product(val name: String, val price: Double)
val products = listOf(Product("A", 10.0), Product("B", 20.0), Product("C", 15.0))
val totalPrice = products.sumOf { it.price }
val maxPrice = products.maxOf { it.price }
```

### 关联操作

```kotlin
val names = listOf("Alice", "Bob", "Charlie")

// associate - 转换为 Map
val nameLengthMap = names.associate { it to it.length }

// associateBy - 以某个属性为键
val byFirstChar = names.associateBy { it.first() }

// associateWith - 以某个属性为值
val withLength = names.associateWith { it.length }

// groupBy 的结果也是 Map
val grouped = names.groupBy { it.length }
```

### 查找操作

```kotlin
val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// find - 返回第一个满足条件的元素
val firstEven = numbers.find { it % 2 == 0 }
val lastEven = numbers.findLast { it % 2 == 0 }

// first / last 带条件
val firstGreaterThan5 = numbers.first { it > 5 }

// single - 确保只有一个匹配元素
val single3 = listOf(1, 2, 3).single { it > 2 }

// binarySearch - 二分查找（需排序）
val sortedList = listOf(1, 3, 5, 7, 9)
val index = sortedList.binarySearch(5)
```

### zip 与 unzip

```kotlin
val names = listOf("Alice", "Bob", "Charlie")
val ages = listOf(25, 30, 35)

// zip - 将两个列表组合成对
val pairs = names.zip(ages)

// 带转换的 zip
val descriptions = names.zip(ages) { name, age -> "$name is $age years old" }

// unzip - 将对列表拆分为两个列表
val (unzippedNames, unzippedAges) = pairs.unzip()
```

## 序列 (Sequence)

Sequence 是一种惰性求值的集合，适合处理大量数据或链式操作。

```kotlin
// 创建 Sequence
val sequence = sequenceOf(1, 2, 3, 4, 5)
val fromIterable = listOf(1, 2, 3).asSequence()

// 使用 generateSequence
val naturalNumbers = generateSequence(1) { it + 1 }
val first10 = naturalNumbers.take(10).toList()

// 使用 sequence 构建器
val customSequence = sequence {
    yield(1)
    yieldAll(listOf(2, 3, 4))
    yield(5)
}

// 惰性求值示例
val result = (1..1_000_000).asSequence()
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .take(5)
    .toList()
```

### List vs Sequence 对比

```kotlin
// List - 立即求值，每步都创建新集合
val listResult = listOf(1, 2, 3, 4, 5)
    .filter { println("filter: $it"); it > 2 }
    .map { println("map: $it"); it * 2 }

// Sequence - 惰性求值，逐元素处理
val seqResult = listOf(1, 2, 3, 4, 5).asSequence()
    .filter { println("filter: $it"); it > 2 }
    .map { println("map: $it"); it * 2 }
    .toList()
```

## 集合与空安全

```kotlin
val nullableList: List<String?> = listOf("a", null, "b", null, "c")

// 过滤 null
val nonNull = nullableList.filterNotNull()

// map 中处理 null
val lengths = nullableList.map { it?.length }

// 使用 mapNotNull
val validLengths = nullableList.mapNotNull { it?.length }

// orEmpty - 空集合替代 null
val maybeList: List<String>? = null
val safeList = maybeList.orEmpty()
```

## 不可变集合与可变集合的选择

```kotlin
// 优先使用只读集合
fun getNames(): List<String> {
    return listOf("Alice", "Bob", "Charlie")
}

// 需要修改时使用可变集合
fun buildNameList(): List<String> {
    val names = mutableListOf<String>()
    names.add("Alice")
    names.add("Bob")
    return names.toList()
}

// 防御性拷贝
class NameProvider {
    private val _names = mutableListOf("Alice", "Bob")
    val names: List<String> get() = _names.toList()
}
```

## 最佳实践

1. **优先使用只读集合**：只在需要修改时使用可变集合
2. **使用 asSequence 处理大数据集**：当链式操作较多且数据量大时，使用 Sequence 提高性能
3. **善用集合操作符**：使用 filter、map、groupBy 等操作符替代手动循环
4. **注意空安全**：使用 filterNotNull、mapNotNull 等处理可空元素
5. **选择合适的集合类型**：根据需求选择 List、Set 或 Map
