# 进阶主题

## 协程

Kotlin 协程是轻量级的并发方案，简化异步编程，是 Android 异步开发的首选。

### 基本概念

| 概念 | 说明 |
|------|------|
| Coroutine | 协程，可挂起的计算实例 |
| suspend | 挂起函数标记，可在协程中调用 |
| Job | 协程任务，可取消 |
| Dispatcher | 调度器，决定协程在哪个线程执行 |
| Scope | 协程作用域，管理协程生命周期 |

### 调度器

| Dispatcher | 说明 | 使用场景 |
|------------|------|----------|
| `Dispatchers.Main` | 主线程 | UI 操作 |
| `Dispatchers.IO` | IO 线程池 | 网络、数据库、文件 |
| `Dispatchers.Default` | 计算线程池 | CPU 密集型任务 |
| `Dispatchers.Unconfined` | 不限定线程 | 特殊场景 |

### 启动协程

```kotlin
// launch - 启动协程，不返回结果
viewModelScope.launch {
    val users = repository.getUsers()
    _users.value = users
}

// async - 启动协程，返回 Deferred
viewModelScope.launch {
    val deferred1 = async { apiService.getUsers() }
    val deferred2 = async { apiService.getPosts() }
    val users = deferred1.await()
    val posts = deferred2.await()
}

// withContext - 切换调度器
suspend fun getUsers(): List<User> {
    return withContext(Dispatchers.IO) {
        apiService.getUsers()
    }
}
```

### 协程作用域

```kotlin
// viewModelScope - ViewModel 销毁时自动取消
viewModelScope.launch { }

// lifecycleScope - Activity/Fragment 销毁时自动取消
lifecycleScope.launch { }

// 自定义作用域
val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
scope.launch { }
scope.cancel()
```

### Flow

Flow 是协程的响应式数据流，类似 RxJava 的 Observable。

```kotlin
// 创建 Flow
fun getUsersFlow(): Flow<List<User>> = flow {
    val users = apiService.getUsers()
    emit(users)
}

// 冷流 - 每次收集都重新执行
viewModelScope.launch {
    getUsersFlow().collect { users ->
        _users.value = users
    }
}

// StateFlow - 热流，始终有值
private val _users = MutableStateFlow<List<User>>(emptyList())
val users: StateFlow<List<User>> = _users.asStateFlow()

// SharedFlow - 热流，多订阅者
private val _events = MutableSharedFlow<String>()
val events: SharedFlow<String> = _events.asSharedFlow()

viewModelScope.launch {
    _events.emit("User logged in")
}
```

### Flow 操作符

```kotlin
getUsersFlow()
    .map { users -> users.filter { it.isActive } }
    .flatMapLatest { users ->
        repository.getDetailsFlow(users)
    }
    .catch { e -> emit(emptyList()) }
    .flowOn(Dispatchers.IO)
    .collect { details ->
        _details.value = details
    }
```

### 协程异常处理

```kotlin
// try-catch
viewModelScope.launch {
    try {
        val data = repository.getData()
    } catch (e: HttpException) {
        _error.value = "网络错误"
    } catch (e: IOException) {
        _error.value = "连接失败"
    }
}

// CoroutineExceptionHandler
val handler = CoroutineExceptionHandler { _, exception ->
    Log.e("Coroutine", "Error", exception)
}

viewModelScope.launch(handler) {
    repository.getData()
}

// SupervisorJob - 子协程失败不影响其他子协程
viewModelScope.launch {
    supervisorScope {
        launch { task1() }
        launch { task2() }
    }
}
```

## 性能优化

### 布局优化

- 减少布局层级，使用 ConstraintLayout
- 使用 `<include>` 复用布局
- 使用 `<ViewStub>` 延迟加载
- 避免过度绘制

```xml
<ViewStub
    android:id="@+id/stubProgress"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout="@layout/progress_bar" />
```

```kotlin
val stub = findViewById<ViewStub>(R.id.stubProgress)
stub.inflate()
```

### 图片优化

```kotlin
// 使用 Glide 加载图片
Glide.with(this)
    .load(url)
    .placeholder(R.drawable.placeholder)
    .error(R.drawable.error)
    .override(800, 600)
    .into(imageView)

// 使用 Coil 加载图片（Kotlin 优先）
AsyncImage(
    model = url,
    contentDescription = "Photo",
    placeholder = painterResource(R.drawable.placeholder),
    error = painterResource(R.drawable.error),
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(128.dp)
)
```

### 内存优化

- 避免内存泄漏
- 使用弱引用
- 及时注销监听器
- 使用 LeakCanary 检测内存泄漏

```gradle
debugImplementation "com.squareup.leakcanary:leakcanary-android:2.12"
```

### 启动优化

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val startTime = System.currentTimeMillis()

        // 延迟初始化非必要组件
        AppStartupInitializer.init(this)

        val duration = System.currentTimeMillis() - startTime
        Log.d("Startup", "Application onCreate took ${duration}ms")
    }
}
```

## 内存管理

### 常见内存泄漏场景

```kotlin
// 1. 静态变量持有 Activity 引用
class LeakHelper {
    companion object {
        var activity: Activity? = null
    }
}

// 2. 内部类持有外部类引用
class MainActivity : AppCompatActivity() {
    inner class MyTask : AsyncTask<Void, Void, String>() {
        override fun doInBackground(vararg params: Void): String {
            return "result"
        }
    }
}

// 3. 未注销的广播接收器
class MainActivity : AppCompatActivity() {
    private val receiver = BroadcastReceiver()

    override fun onCreate(savedInstanceState: Bundle?) {
        registerReceiver(receiver, filter)
    }
}

// 4. Handler 持有 Activity 引用
class MainActivity : AppCompatActivity() {
    private val handler = Handler(Looper.getMainLooper()) {
        updateUI()
        true
    }
}
```

### 修复方案

```kotlin
// 1. 使用弱引用
class SafeHelper(activity: Activity) {
    private val activityRef = WeakReference(activity)
}

// 2. 使用静态内部类
class MainActivity : AppCompatActivity() {
    class SafeTask(activity: MainActivity) : AsyncTask<Void, Void, String>() {
        private val activityRef = WeakReference(activity)
        override fun doInBackground(vararg params: Void): String = "result"
    }
}

// 3. 及时注销
override fun onDestroy() {
    super.onDestroy()
    unregisterReceiver(receiver)
}

// 4. 使用协程替代 Handler
viewModelScope.launch {
    delay(3000)
    updateUI()
}
```

## 构建与打包

### Build Variants

```gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            versionNameSuffix "-debug"
            buildConfigField "String", "BASE_URL", "\"https://dev.api.example.com\""
            isMinifyEnabled = false
        }
        release {
            buildConfigField "String", "BASE_URL", "\"https://api.example.com\""
            isMinifyEnabled = true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    flavorDimensions += "environment"
    productFlavors {
        create("dev") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
        }
        create("prod") {
            dimension = "environment"
        }
    }
}
```

### ProGuard / R8

```proguard
# 保留模型类
-keep class com.example.model.** { *; }

# 保留反射调用的类
-keep class * implements java.io.Serializable { *; }

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-keep class retrofit2.** { *; }

# Gson
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
```

### 签名配置

```gradle
android {
    signingConfigs {
        create("release") {
            storeFile = file("keystore/release.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = "release"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

## 测试

### 单元测试

```gradle
testImplementation "junit:junit:4.13.2"
testImplementation "org.mockito:mockito-core:5.8.0"
testImplementation "org.mockito.kotlin:mockito-kotlin:5.2.1"
testImplementation "org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3"
```

```kotlin
class UserViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val repository = mockk<UserRepository>()
    private lateinit var viewModel: UserViewModel

    @Before
    fun setup() {
        viewModel = UserViewModel(repository)
    }

    @Test
    fun `loadUsers should update users state`() = runTest {
        val expectedUsers = listOf(
            User(id = 1, name = "Alice", email = "alice@test.com"),
            User(id = 2, name = "Bob", email = "bob@test.com")
        )
        coEvery { repository.getUsers() } returns expectedUsers

        viewModel.loadUsers()

        assertEquals(expectedUsers, viewModel.users.value)
    }

    @Test
    fun `loadUsers should handle error`() = runTest {
        coEvery { repository.getUsers() } throws IOException("Network error")

        viewModel.loadUsers()

        assertEquals("Network error", viewModel.error.value)
    }
}

class MainDispatcherRule : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(StandardTestDispatcher())
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
```

### UI 测试

```gradle
androidTestImplementation "androidx.test.ext:junit:1.1.5"
androidTestImplementation "androidx.test.espresso:espresso-core:3.5.1"
androidTestImplementation "androidx.compose.ui:ui-test-junit4:1.5.4"
debugImplementation "androidx.compose.ui:ui-test-manifest:1.5.4"
```

```kotlin
@RunWith(AndroidJUnit4::class)
class MainActivityTest {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun testDisplayTitle() {
        Espresso.onView(ViewMatchers.withId(R.id.tvTitle))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))
    }

    @Test
    fun testButtonClick() {
        Espresso.onView(ViewMatchers.withId(R.id.btnSubmit))
            .perform(ViewActions.click())

        Espresso.onView(ViewMatchers.withId(R.id.tvResult))
            .check(ViewAssertions.matches(ViewMatchers.withText("Success")))
    }
}
```

### Compose 测试

```kotlin
class UserScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun testUserListDisplayed() {
        val users = listOf(
            User(id = 1, name = "Alice", email = "alice@test.com"),
            User(id = 2, name = "Bob", email = "bob@test.com")
        )

        composeTestRule.setContent {
            UserList(users = users)
        }

        composeTestRule.onNodeWithText("Alice").assertIsDisplayed()
        composeTestRule.onNodeWithText("Bob").assertIsDisplayed()
    }

    @Test
    fun testCounterIncrement() {
        composeTestRule.setContent {
            Counter()
        }

        composeTestRule.onNodeWithText("Count: 0").assertIsDisplayed()
        composeTestRule.onNodeWithText("+1").performClick()
        composeTestRule.onNodeWithText("Count: 1").assertIsDisplayed()
    }
}
```

## 推荐学习路径

```
协程基础 → Flow → 性能优化 → 内存管理 → 构建打包 → 测试 → CI/CD
```

| 主题 | 优先级 | 说明 |
|------|--------|------|
| 协程 | ⭐⭐⭐⭐⭐ | Android 异步编程核心 |
| Flow | ⭐⭐⭐⭐⭐ | 响应式数据流 |
| 性能优化 | ⭐⭐⭐⭐ | 用户体验关键 |
| 测试 | ⭐⭐⭐⭐ | 代码质量保障 |
| 内存管理 | ⭐⭐⭐ | 避免内存泄漏 |
| 构建打包 | ⭐⭐⭐ | 发布流程 |
