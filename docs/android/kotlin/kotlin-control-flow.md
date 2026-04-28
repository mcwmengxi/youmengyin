# Kotlin 控制流程与范围函数

## 条件表达式

### if 表达式

在 Kotlin 中，`if` 是一个表达式，它可以返回一个值。

```kotlin
fun max(a: Int, b: Int): Int {
    return if (a > b) a else b
}

// 作为表达式使用
val maxVal = if (a > b) a else b

// 多分支 if
val result = if (score >= 90) {
    "优秀"
} else if (score >= 80) {
    "良好"
} else if (score >= 60) {
    "及格"
} else {
    "不及格"
}
```

### when 表达式

`when` 是 Kotlin 中的多分支表达式，类似于其他语言的 `switch` 但功能更强大。

```kotlin
// 基本用法
fun describe(obj: Any): String =
    when (obj) {
        1 -> "数字 1"
        "hello" -> "字符串 hello"
        is Long -> "长整型数字"
        !is String -> "不是字符串"
        else -> "未知类型"
    }

// 使用任意表达式作为条件
fun caseExample(x: Int, y: Int) {
    when (x) {
        y -> println("相等")
        y + 1 -> println("x 比 y 大 1")
        y - 1 -> println("x 比 y 小 1")
        else -> println("其他情况")
    }
}

// 检查值是否在范围内
fun isInRange(value: Int) {
    when (value) {
        in 1..10 -> println("在 1-10 范围内")
        !in 10..20 -> println("不在 10-20 范围内")
        else -> println("在 10-20 范围内")
    }
}

// 智能转换
fun caseWithSmartCast(obj: Any) {
    when (obj) {
        is String -> println("字符串长度: ${obj.length}")
        is Int -> println("数字的绝对值: ${kotlin.math.abs(obj)}")
        else -> println("其他类型")
    }
}
```

## 循环

### for 循环

```kotlin
// 遍历集合
val items = listOf("apple", "banana", "cherry")
for (item in items) {
    println(item)
}

// 遍历索引
for (index in items.indices) {
    println("Item at $index is ${items[index]}")
}

// 使用 withIndex
for ((index, value) in items.withIndex()) {
    println("Item at $index is $value")
}

// 遍历范围
for (i in 1..5) {
    print("$i ")  // 输出: 1 2 3 4 5
}

// 步长循环
for (i in 1..10 step 2) {
    print("$i ")  // 输出: 1 3 5 7 9
}

// 降序循环
for (i in 10 downTo 1) {
    print("$i ")  // 输出: 10 9 8 7 6 5 4 3 2 1
}
```

### while 和 do...while 循环

```kotlin
var i = 0
while (i < 5) {
    println(i)
    i++
}

do {
    println("至少执行一次")
    i--
} while (i > 0)
```

## 循环控制

### Break 和 Continue

```kotlin
// 标签的使用
loop@ for (i in 1..3) {
    for (j in 1..3) {
        println("i = $i, j = $j")
        if (i == 2 && j == 2) {
            break@loop  // 跳出外层循环
        }
    }
}

// continue 使用标签
outer@ for (i in 1..3) {
    for (j in 1..3) {
        if (i == 2 && j == 2) {
            continue@outer  // 跳到外层循环开始
        }
        println("i = $i, j = $j")
    }
}
```

## 范围函数

范围函数允许我们在对象的上下文中执行代码块，使代码更简洁易读。

### let 函数

```kotlin
// let 用于非空对象执行操作
val str: String? = "Hello Kotlin"
val length = str?.let { 
    println("字符串长度: ${it.length}")
    it.length 
}

// 链式调用中的 let
fun processString(input: String?): Int? {
    return input?.let { s ->
        s.trim()
    }?.let { trimmed ->
        if (trimmed.isNotEmpty()) trimmed.length else null
    }
}
```

### run 函数

```kotlin
// 作为扩展函数使用
val person = Person("Alice", 25)
val description = person.run {
    "姓名: $name, 年龄: $age"  // this 可以省略
}

// 作为独立函数使用
val result = run {
    val x = 5
    val y = 10
    x * y
}
```

### with 函数

```kotlin
val person = Person("Bob", 30)
val result = with(person) {
    println("正在处理 $name")
    "已处理: $name, 年龄: $age"
}
```

### apply 和 also 函数

```kotlin
// apply 返回调用它的对象，主要用于配置对象
val person = Person("Charlie", 35).apply {
    age = 36
    // this 指向 person 对象
}

// also 返回调用它的对象，主要用于附加操作
val numbers = mutableListOf(1, 2, 3).also { list ->
    println("列表大小: ${list.size}")  // it 可以替换为自定义名称
}
```

### takeIf 和 takeUnless 函数

```kotlin
// takeIf 在条件为真时返回对象，否则返回 null
val positiveNumber = (-5).takeIf { it > 0 }  // null
val positiveNumber2 = (5).takeIf { it > 0 }  // 5

// takeUnless 在条件为假时返回对象，否则返回 null
val negativeNumber = (-5).takeUnless { it > 0 }  // -5
val negativeNumber2 = (5).takeUnless { it > 0 }  // null

// 实际应用示例
fun processValidInput(input: String): String? {
    return input.takeIf { it.isNotBlank() }
        ?.takeIf { it.length >= 3 }
        ?.trim()
}
```

## 综合示例

```kotlin
data class User(val name: String, val age: Int, val email: String?)

fun processUsers(users: List<User>): List<String> {
    return users
        .filter { it.age >= 18 }  // 过滤成年人
        .map { user ->  // 使用范围函数处理每个用户
            user.run {
                "${name.substring(0, minOf(name.length, 3))}... - $age years old"
            }
        }
}

fun demonstrateControlFlow(user: User?) {
    user?.let { u ->  // 确保用户不为空
        when {
            u.age < 13 -> println("${u.name} 未成年（儿童）")
            u.age < 18 -> println("${u.name} 未成年（青少年）")
            u.age < 65 -> println("${u.name} 成年人")
            else -> println("${u.name} 老年人")
        }
        
        u.email?.let { email ->
            if (email.contains("@")) {
                println("有效邮箱: $email")
            } else {
                println("无效邮箱: $email")
            }
        } ?: println("未提供邮箱")
    } ?: println("用户信息为空")
}

// 实际应用：数据验证
fun validateUserData(name: String?, age: Int?, email: String?): String? {
    return name?.takeIf { it.isNotBlank() }
        ?.let { validName ->
            age?.takeIf { it in 1..120 }
                ?.let { validAge ->
                    email?.takeIf { it.contains("@") }
                        ?.let { validEmail ->
                            // 所有条件都满足，创建用户
                            User(validName, validAge, validEmail).toString()
                        } ?: "邮箱格式不正确"
                } ?: "年龄必须在1-120之间"
        } ?: "姓名不能为空"
}
```

## 最佳实践

1. **选择合适的范围函数**：
   - `apply` 用于对象配置
   - `also` 用于附加操作
   - `run` 用于需要返回值的复杂逻辑
   - `let` 用于安全调用
   - `with` 用于无接收者的上下文调用

2. **使用 when 替代复杂的 if-else 链**：
   - 代码更清晰
   - 编译器确保覆盖所有情况

3. **利用智能转换**：
   - 使用 `is` 检查类型后无需显式转换
   - 避免重复的类型转换代码