# Kotlin 多平台开发

Kotlin Multiplatform (KMP) 是 Kotlin 的核心特性之一，允许使用同一套代码在多个平台上运行。它不是取代各平台原生开发，而是共享业务逻辑，同时保留平台特定的 UI 实现。

## KMP 概述

### 支持的平台

| 平台    | 目标        | 说明                    |
| ------- | ----------- | ----------------------- |
| Android | JVM         | 原生支持                |
| iOS     | Native      | 通过 Kotlin/Native 编译 |
| JVM     | JVM         | 桌面应用、服务端        |
| JS      | JavaScript  | Web 前端                |
| Wasm    | WebAssembly | Web（实验性）           |

### 共享策略

```
┌─────────────────────────────────────────────┐
│                 共享模块                      │
│  ┌─────────────────────────────────────┐    │
│  │         commonMain                  │    │
│  │    通用业务逻辑、数据模型             │    │
│  └─────────────────────────────────────┘    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │androidMain│  │  iosMain │  │  jvmMain │  │
│  │ Android   │  │   iOS    │  │  Desktop │  │
│  │ 平台实现  │  │ 平台实现  │  │ 平台实现  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

## 项目配置

### build.gradle.kts (项目级)

```kotlin
plugins {
    kotlin("multiplatform") version "1.9.0" apply false
    kotlin("android") version "1.9.0" apply false
    id("com.android.application") version "8.1.0" apply false
    id("com.android.library") version "8.1.0" apply false
}
```

### 共享模块配置

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("native.cocoapods")
    id("com.android.library")
}

kotlin {
    android {
        compilations.all {
            kotlinOptions {
                jvmTarget = "1.8"
            }
        }
    }

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    cocoapods {
        summary = "Shared module"
        homepage = "https://example.com"
        version = "1.0"
        ios.deploymentTarget = "14.0"
        podfile = project.file("../iosApp/Podfile")
        framework {
            baseName = "shared"
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.4.1")
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val androidMain by getting {
            dependencies {
                implementation("androidx.core:core-ktx:1.12.0")
            }
        }
        val androidUnitTest by getting
        val iosMain by creating {
            dependsOn(commonMain)
        }
        val iosTest by creating {
            dependsOn(commonTest)
        }
    }
}
```

## expect/actual 机制

### 声明平台差异 API

```kotlin
// commonMain - 声明期望的平台 API
expect class Platform() {
    val name: String
}

expect fun getPlatformName(): String

expect class DateFormatter() {
    fun format(timestamp: Long): String
}
```

### Android 实现

```kotlin
// androidMain
actual class Platform actual constructor() {
    actual val name: String = "Android ${android.os.Build.VERSION.SDK_INT}"
}

actual fun getPlatformName(): String = "Android"

actual class DateFormatter actual constructor() {
    private val sdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
    actual fun format(timestamp: Long): String = sdf.format(Date(timestamp))
}
```

### iOS 实现

```kotlin
// iosMain
actual class Platform actual constructor() {
    actual val name: String = "iOS"
}

actual fun getPlatformName(): String = "iOS"

actual class DateFormatter actual constructor() {
    actual fun format(timestamp: Long): String {
        val date = NSDate(timeIntervalSince1970 = timestamp / 1000.0)
        val formatter = NSDateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        return formatter.stringFromDate(date)
    }
}
```

### JVM 实现

```kotlin
// jvmMain
actual class Platform actual constructor() {
    actual val name: String = "JVM"
}

actual fun getPlatformName(): String = "JVM"

actual class DateFormatter actual constructor() {
    private val sdf = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    actual fun format(timestamp: Long): String = sdf.format(java.util.Date(timestamp))
}
```

## 共享业务逻辑

### 数据模型

```kotlin
// commonMain
@Serializable
data class User(
    val id: String,
    val name: String,
    val email: String,
    val createdAt: Long
)

@Serializable
data class ApiResponse<T>(
    val data: T?,
    val error: String?,
    val success: Boolean
)
```

### Repository 模式

```kotlin
// commonMain
interface UserRepository {
    suspend fun getUser(id: String): User
    suspend fun saveUser(user: User)
    fun observeUsers(): Flow<List<User>>
}

class UserRepositoryImpl(
    private val api: UserApi,
    private val cache: UserCache
) : UserRepository {

    override suspend fun getUser(id: String): User {
        val cached = cache.get(id)
        if (cached != null) return cached

        val remote = api.getUser(id)
        cache.put(remote)
        return remote
    }

    override suspend fun saveUser(user: User) {
        cache.put(user)
        api.updateUser(user)
    }

    override fun observeUsers(): Flow<List<User>> {
        return cache.observeAll()
    }
}
```

### 网络请求

```kotlin
// commonMain
interface UserApi {
    suspend fun getUser(id: String): User
    suspend fun updateUser(user: User): User
}

class KtorUserApi(private val httpClient: HttpClient) : UserApi {
    override suspend fun getUser(id: String): User {
        return httpClient.get("https://api.example.com/users/$id").body()
    }

    override suspend fun updateUser(user: User): User {
        return httpClient.put("https://api.example.com/users/${user.id}") {
            contentType(ContentType.Application.Json)
            setBody(user)
        }.body()
    }
}
```

### Ktor HttpClient 配置

```kotlin
// commonMain
fun createHttpClient(): HttpClient {
    return HttpClient {
        install(ContentNegotiation) {
            json(Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            })
        }
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.INFO
        }
        defaultRequest {
            header("Content-Type", "application/json")
        }
    }
}
```

## 共享 ViewModel

### 使用 KMM-ViewModel

```kotlin
// commonMain
class SharedViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true) }
            try {
                val user = repository.getUser(id)
                _uiState.update { it.copy(user = user, loading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(error = e.message, loading = false) }
            }
        }
    }

    data class UiState(
        val user: User? = null,
        val loading: Boolean = false,
        val error: String? = null
    )
}
```

## 数据存储

### 使用多平台设置

```kotlin
// commonMain
class SettingsRepository(private val settings: Settings) {
    var token: String
        get() = settings.getString("auth_token", "")
        set(value) = settings.putString("auth_token", value)

    var userId: String
        get() = settings.getString("user_id", "")
        set(value) = settings.putString("user_id", value)

    var isLoggedIn: Boolean
        get() = settings.getBoolean("is_logged_in", false)
        set(value) = settings.putBoolean("is_logged_in", value)

    fun clear() = settings.clear()
}
```

### SQLDelight 数据库

```kotlin
// commonMain - Database.sq
// CREATE TABLE User (
//     id TEXT NOT NULL PRIMARY KEY,
//     name TEXT NOT NULL,
//     email TEXT NOT NULL,
//     createdAt INTEGER NOT NULL
// );
//
// selectAll:
// SELECT * FROM User;
//
// selectById:
// SELECT * FROM User WHERE id = ?;
//
// insert:
// INSERT OR REPLACE INTO User(id, name, email, createdAt)
// VALUES (?, ?, ?, ?);
//
// deleteById:
// DELETE FROM User WHERE id = ?;

class UserCache(private val database: Database) {
    fun getAll(): List<User> {
        return database.userQueries.selectAll().executeAsList().map { it.toUser() }
    }

    fun get(id: String): User? {
        return database.userQueries.selectById(id).executeAsOneOrNull()?.toUser()
    }

    fun put(user: User) {
        database.userQueries.insert(user.id, user.name, user.email, user.createdAt)
    }
}
```

## Compose Multiplatform

### 共享 UI

```kotlin
// commonMain
@Composable
fun UserScreen(viewModel: SharedViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when {
            uiState.loading -> {
                CircularProgressIndicator()
            }
            uiState.error != null -> {
                Text("Error: ${uiState.error}")
                Button(onClick = { viewModel.loadUser("1") }) {
                    Text("Retry")
                }
            }
            uiState.user != null -> {
                UserProfile(user = uiState.user!!)
            }
        }
    }
}

@Composable
fun UserProfile(user: User) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = user.name, style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = user.email, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
```

### Android 入口

```kotlin
// androidMain
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                UserScreen(viewModel = getViewModel())
            }
        }
    }
}
```

### iOS 入口

```kotlin
// iosMain - 通过 ComposeUIViewController
fun MainViewController() = ComposeUIViewController {
    AppTheme {
        UserScreen(viewModel = getViewModel())
    }
}
```

## 资源管理

### 多平台资源

```kotlin
// build.gradle.kts
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("dev.icerock.moko:resources:0.23.0")
            }
        }
    }
}

// 使用
object MR : MR() {
    object strings : StringResource {
        val app_name = StringResource("app_name")
        val welcome = StringResource("welcome")
    }
}
```

## 测试

### 共享测试

```kotlin
// commonTest
class UserRepositoryTest {

    @Test
    fun getUser_returnsCachedWhenAvailable() = runTest {
        val cache = InMemoryUserCache()
        val api = FakeUserApi()
        val repository = UserRepositoryImpl(api, cache)

        val user = User("1", "Alice", "alice@example.com", 0L)
        cache.put(user)

        val result = repository.getUser("1")
        assertEquals(user, result)
    }

    @Test
    fun getUser_fetchesFromApiWhenNotCached() = runTest {
        val cache = InMemoryUserCache()
        val api = FakeUserApi()
        val user = User("1", "Alice", "alice@example.com", 0L)
        api.addUser(user)

        val repository = UserRepositoryImpl(api, cache)
        val result = repository.getUser("1")

        assertEquals(user, result)
        assertEquals(user, cache.get("1"))
    }
}
```

## 项目结构

```
MyApp/
├── shared/                     # 共享模块
│   ├── src/
│   │   ├── commonMain/         # 通用代码
│   │   │   └── kotlin/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── api/
│   │   │       └── viewmodel/
│   │   ├── commonTest/         # 通用测试
│   │   ├── androidMain/        # Android 实现
│   │   ├── iosMain/            # iOS 实现
│   │   └── jvmMain/            # JVM 实现
│   └── build.gradle.kts
├── androidApp/                 # Android 应用
│   └── src/main/
├── iosApp/                     # iOS 应用
│   └── iosApp/
└── build.gradle.kts            # 项目级配置
```

## 最佳实践

1. **共享业务逻辑而非 UI**：网络请求、数据存储、业务规则适合共享
2. **使用 expect/actual 处理平台差异**：保持通用 API 的一致性
3. **合理划分共享边界**：不是所有代码都需要共享
4. **使用 Ktor 处理网络**：多平台原生的 HTTP 客户端
5. **使用 SQLDelight 处理数据库**：类型安全的多平台数据库
6. **编写共享测试**：确保通用逻辑在所有平台上正确
7. **关注 iOS 互操作**：注意 Kotlin/Native 的内存模型差异
8. **逐步迁移**：从共享少量代码开始，逐步扩大共享范围
