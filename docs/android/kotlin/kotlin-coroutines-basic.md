# Kotlin 协程基础

协程是 Kotlin 提供的轻量级并发解决方案。它允许以同步的方式编写异步代码，避免了回调地狱，使代码更易读和维护。

## 协程概述

### 协程 vs 线程

| 特性 | 线程 | 协程 |
|------|------|------|
| 创建成本 | 高（约 1MB 栈空间） | 低（约几百字节） |
| 数量限制 | 有限（通常几千个） | 几乎无限（百万级） |
| 切换成本 | 高（内核态切换） | 低（用户态切换） |
| 取消 | 不容易 | 容易（协作式取消） |

### 添加依赖

```gradle
dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}
```

## 第一个协程

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
```

## 协程构建器

### launch

```kotlin
// launch - 启动一个新协程，不返回结果
fun main() = runBlocking {
    val job = launch {
        delay(1000L)
        println("Task completed")
    }
    println("Waiting for task...")
    job.join()
    println("Done")
}
```

### async

```kotlin
// async - 启动一个新协程，返回 Deferred<T>（类似 Promise）
fun main() = runBlocking {
    val deferred1 = async {
        delay(1000L)
        "Result 1"
    }

    val deferred2 = async {
        delay(1500L)
        "Result 2"
    }

    // await() 挂起直到结果可用
    println(deferred1.await())
    println(deferred2.await())

    // 并行执行两个任务
    val result1 = async { fetchDataFromApi1() }
    val result2 = async { fetchDataFromApi2() }
    val combined = result1.await() + result2.await()
}
```

### runBlocking

```kotlin
// runBlocking - 桥接协程世界和非协程世界
// 通常用于 main 函数或测试
fun main() = runBlocking {
    println("Start")
    delay(1000L)
    println("End")
}
```

### withContext

```kotlin
// withContext - 切换协程的上下文
suspend fun fetchUserData(): User {
    return withContext(Dispatchers.IO) {
        // 在 IO 线程执行网络请求
        api.getUser()
    }
}

// 对比不同调度器
suspend fun demonstrateDispatchers() {
    withContext(Dispatchers.Main) {
        println("Main thread: ${Thread.currentThread().name}")
    }
    withContext(Dispatchers.IO) {
        println("IO thread: ${Thread.currentThread().name}")
    }
    withContext(Dispatchers.Default) {
        println("Default thread: ${Thread.currentThread().name}")
    }
}
```

## 挂起函数

### 基本概念

```kotlin
// suspend 关键字标记挂起函数
// 挂起函数只能在协程或其他挂起函数中调用
suspend fun fetchData(): String {
    delay(1000L)
    return "Data loaded"
}

suspend fun fetchMultipleData(): List<String> {
    val data1 = fetchData()
    val data2 = fetchData()
    return listOf(data1, data2)
}
```

### 挂起函数的组合

```kotlin
suspend fun getUser(id: String): User {
    delay(500L)
    return User(id, "Alice")
}

suspend fun getOrders(userId: String): List<Order> {
    delay(800L)
    return listOf(Order("1", userId), Order("2", userId))
}

// 顺序执行
suspend fun getUserOrdersSequential(userId: String): List<Order> {
    val user = getUser(userId)
    return getOrders(user.id)
}

// 并行执行
suspend fun getUserOrdersParallel(userId: String): Pair<User, List<Order>> {
    return coroutineScope {
        val userDeferred = async { getUser(userId) }
        val ordersDeferred = async { getOrders(userId) }
        Pair(userDeferred.await(), ordersDeferred.await())
    }
}
```

## 调度器 (Dispatchers)

```kotlin
// Main - 主线程（Android UI 线程）
withContext(Dispatchers.Main) {
    updateUI()
}

// IO - IO 操作（网络、文件、数据库）
withContext(Dispatchers.IO) {
    val data = networkClient.fetchData()
}

// Default - CPU 密集型任务
withContext(Dispatchers.Default) {
    val result = heavyComputation()
}

// Unconfined - 不限制调度器
withContext(Dispatchers.Unconfined) {
    println("Runs in caller thread initially")
}

// 自定义线程池
val customDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()
withContext(customDispatcher) {
    heavyTask()
}
customDispatcher.close()
```

## 作用域 (CoroutineScope)

### 作用域类型

```kotlin
// 1. runBlocking - 阻塞当前线程
runBlocking {
    launch { println("In runBlocking") }
}

// 2. coroutineScope - 挂起但不阻塞，等待所有子协程完成
suspend fun fetchData() = coroutineScope {
    launch { delay(1000L); println("Task 1") }
    launch { delay(500L); println("Task 2") }
    println("All tasks launched")
}

// 3. supervisorScope - 子协程失败不影响其他子协程
suspend fun resilientFetch() = supervisorScope {
    launch {
        throw Exception("Task 1 failed")
    }
    launch {
        delay(100L)
        println("Task 2 still runs")
    }
}
```

### 自定义作用域

```kotlin
class MyService {
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    fun start() {
        scope.launch {
            while (isActive) {
                doWork()
                delay(1000L)
            }
        }
    }

    fun stop() {
        scope.cancel()
    }
}
```

## Job 与生命周期

```kotlin
fun main() = runBlocking {
    val job = launch {
        repeat(5) { i ->
            println("Working $i...")
            delay(500L)
        }
    }

    delay(1200L)
    println("State: ${job.isActive}, ${job.isCancelled}, ${job.isCompleted}")

    job.cancel()
    job.join()
    println("After cancel: ${job.isActive}, ${job.isCancelled}, ${job.isCompleted}")
}
```

### Job 状态

```
                    等待中                     活跃
     New ────────► (isActive=true) ────────► Completing ────► Completed
                     │                           ▲
                     │ cancel                     │
                     ▼                           │
                  Cancelling ────────► Cancelled
```

## 协程取消

### 基本取消

```kotlin
fun main() = runBlocking {
    val job = launch {
        repeat(1000) { i ->
            // 检查取消状态
            if (!isActive) return@launch
            println("Working $i...")
            delay(500L)
        }
    }

    delay(1300L)
    job.cancel()
    println("Job cancelled")
}
```

### 协作式取消

```kotlin
suspend fun cancellableComputation() {
    var nextPrintTime = System.currentTimeMillis()
    var i = 0
    while (isActive) {
        val currentTime = System.currentTimeMillis()
        if (currentTime >= nextPrintTime) {
            println("Working ${i++}...")
            nextPrintTime += 500L
        }
    }
}

// 使用 ensureActive 检查取消
suspend fun processItems(items: List<Int>) {
    for (item in items) {
        ensureActive()
        processItem(item)
    }
}
```

### 不可取消的代码块

```kotlin
val job = launch {
    try {
        repeat(1000) { i ->
            println("Working $i...")
            delay(500L)
        }
    } finally {
        // finally 块中协程已取消，不能调用挂起函数
        // 除非使用 withContext(NonCancellable)
        withContext(NonCancellable) {
            delay(1000L)
            println("Cleanup completed")
        }
    }
}
```

## 超时处理

```kotlin
// withTimeout - 超时抛出 TimeoutCancellationException
suspend fun fetchWithTimeout(): String {
    return try {
        withTimeout(3000L) {
            fetchDataFromNetwork()
        }
    } catch (e: TimeoutCancellationException) {
        "Request timed out"
    }
}

// withTimeoutOrNull - 超时返回 null
suspend fun fetchWithTimeoutOrNull(): String? {
    return withTimeoutOrNull(3000L) {
        fetchDataFromNetwork()
    }
}
```

## 异常处理

### 异常传播

```kotlin
// launch 中的异常会立即传播
fun main() = runBlocking {
    val job = launch {
        throw IllegalArgumentException("Error in launch")
    }
    job.join()
    println("This line may not be reached")
}

// async 中的异常在 await() 时传播
suspend fun asyncExample() = coroutineScope {
    val deferred = async {
        throw IllegalArgumentException("Error in async")
    }
    try {
        deferred.await()
    } catch (e: IllegalArgumentException) {
        println("Caught: ${e.message}")
    }
}
```

### SupervisorJob

```kotlin
// SupervisorJob - 子协程失败不会取消其他子协程
val scope = CoroutineScope(SupervisorJob())

scope.launch {
    throw Exception("Child 1 failed")
}

scope.launch {
    delay(100L)
    println("Child 2 still running")
}
```

### CoroutineExceptionHandler

```kotlin
val handler = CoroutineExceptionHandler { _, exception ->
    println("Caught exception: $exception")
}

val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main + handler)

scope.launch {
    throw Exception("Something went wrong")
}
```

## 通道 (Channel)

```kotlin
import kotlinx.coroutines.channels.Channel

// 基本通道
suspend fun channelExample() = coroutineScope {
    val channel = Channel<Int>()

    launch {
        for (x in 1..5) {
            channel.send(x * x)
        }
        channel.close()
    }

    for (value in channel) {
        println(value)
    }
}

// 缓冲通道
suspend fun bufferedChannel() {
    val channel = Channel<Int>(capacity = 3)
    // 缓冲区满时 send 才会挂起
}

// 不同类型的 Channel
val rendezvousChannel = Channel<Int>()       // 容量为 0（默认）
val bufferedChannel2 = Channel<Int>(10)       // 容量为 10
val unlimitedChannel = Channel<Int>(Channel.UNLIMITED)  // 无限容量
val conflatedChannel = Channel<Int>(Channel.CONFLATED)  // 只保留最新值
```

## Flow 基础

```kotlin
import kotlinx.coroutines.flow.*

// 创建 Flow
fun simpleFlow(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100L)
        emit(i)
    }
}

// 收集 Flow
suspend fun collectFlow() {
    simpleFlow().collect { value ->
        println(value)
    }
}

// flowOf 和 asFlow
val numberFlow = flowOf(1, 2, 3, 4, 5)
val rangeFlow = (1..5).asFlow()

// Flow 操作符
suspend fun flowOperators() {
    (1..10).asFlow()
        .filter { it % 2 == 0 }
        .map { "Number $it" }
        .take(3)
        .collect { println(it) }
}
```

## select 表达式

```kotlin
// select - 等待多个挂起函数，选择最先完成的
suspend fun selectExample() = coroutineScope {
    val deferred1 = async { delay(100L); "Result 1" }
    val deferred2 = async { delay(200L); "Result 2" }

    val result = select<String> {
        deferred1.onAwait { it }
        deferred2.onAwait { it }
    }
    println("First result: $result")
}
```

## 最佳实践

1. **使用 suspend 函数而非回调**：保持代码简洁可读
2. **选择合适的调度器**：IO 操作用 Dispatchers.IO，CPU 密集型用 Dispatchers.Default
3. **正确处理协程生命周期**：在 ViewModel 中使用 viewModelScope，在 Activity/Fragment 中使用 lifecycleScope
4. **避免使用 GlobalScope**：容易造成内存泄漏
5. **使用结构化并发**：确保所有子协程在作用域结束时完成或取消
6. **合理处理异常**：使用 SupervisorJob 和 CoroutineExceptionHandler
