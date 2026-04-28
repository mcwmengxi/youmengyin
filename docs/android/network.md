# 网络编程

## HTTP 基础

### HTTP 请求方法

| 方法 | 说明 | 用途 |
|------|------|------|
| GET | 获取资源 | 查询数据 |
| POST | 提交数据 | 创建资源 |
| PUT | 更新资源 | 全量更新 |
| PATCH | 部分更新 | 增量更新 |
| DELETE | 删除资源 | 删除数据 |

### HTTP 状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器错误 |

### 网络权限

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## OkHttp

OkHttp 是 Square 开源的高性能 HTTP 客户端，是 Android 网络请求的基础库。

### 添加依赖

```gradle
implementation "com.squareup.okhttp3:okhttp:4.12.0"
implementation "com.squareup.okhttp3:logging-interceptor:4.12.0"
```

### 基本 GET 请求

```kotlin
val client = OkHttpClient()

val request = Request.Builder()
    .url("https://api.example.com/users")
    .build()

client.newCall(request).enqueue(object : Callback {
    override fun onFailure(call: Call, e: IOException) {
        e.printStackTrace()
    }

    override fun onResponse(call: Call, response: Response) {
        val body = response.body?.string()
        body?.let {
            withContext(Dispatchers.Main) {
                textView.text = it
            }
        }
    }
})
```

### POST 请求

```kotlin
val json = """{"name": "Alice", "email": "alice@example.com"}"""

val mediaType = "application/json; charset=utf-8".toMediaType()
val requestBody = json.toRequestBody(mediaType)

val request = Request.Builder()
    .url("https://api.example.com/users")
    .post(requestBody)
    .build()

client.newCall(request).enqueue(object : Callback {
    override fun onFailure(call: Call, e: IOException) {}
    override fun onResponse(call: Call, response: Response) {}
})
```

### 添加请求头

```kotlin
val request = Request.Builder()
    .url("https://api.example.com/users")
    .addHeader("Authorization", "Bearer $token")
    .addHeader("Content-Type", "application/json")
    .build()
```

### 拦截器

```kotlin
val loggingInterceptor = HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
}

val authInterceptor = Interceptor { chain ->
    val request = chain.request().newBuilder()
        .addHeader("Authorization", "Bearer ${getToken()}")
        .build()
    chain.proceed(request)
}

val client = OkHttpClient.Builder()
    .addInterceptor(authInterceptor)
    .addNetworkInterceptor(loggingInterceptor)
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .build()
```

### 文件上传

```kotlin
val file = File("/path/to/file.jpg")
val requestBody = file.asRequestBody("image/jpeg".toMediaType())

val multipartBody = MultipartBody.Builder()
    .setType(MultipartBody.FORM)
    .addFormDataPart("name", "Alice")
    .addFormDataPart("avatar", file.name, requestBody)
    .build()

val request = Request.Builder()
    .url("https://api.example.com/upload")
    .post(multipartBody)
    .build()
```

## Retrofit

Retrofit 是 Square 开发的类型安全 HTTP 客户端，基于 OkHttp，使用注解描述 API。

### 添加依赖

```gradle
implementation "com.squareup.retrofit2:retrofit:2.9.0"
implementation "com.squareup.retrofit2:converter-gson:2.9.0"
implementation "com.squareup.retrofit2:converter-moshi:2.9.0"
```

### 定义 API 接口

```kotlin
interface ApiService {

    @GET("users")
    suspend fun getUsers(): List<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") userId: Long): User

    @GET("users")
    suspend fun searchUsers(@Query("name") name: String): List<User>

    @POST("users")
    suspend fun createUser(@Body user: User): User

    @PUT("users/{id}")
    suspend fun updateUser(@Path("id") userId: Long, @Body user: User): User

    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") userId: Long): Response<Unit>

    @FormUrlEncoded
    @POST("login")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): LoginResponse

    @Multipart
    @POST("upload")
    suspend fun uploadFile(
        @Part file: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): UploadResponse

    @Headers("Cache-Control: max-age=640000")
    @GET("users")
    suspend fun getCachedUsers(): List<User>
}
```

### 创建 Retrofit 实例

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .client(okHttpClient)
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val apiService = retrofit.create(ApiService::class.java)
```

### 在 ViewModel 中使用

```kotlin
class UserViewModel(private val apiService: ApiService) : ViewModel() {

    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun loadUsers() {
        viewModelScope.launch {
            _loading.value = true
            try {
                _users.value = apiService.getUsers()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun createUser(name: String, email: String) {
        viewModelScope.launch {
            try {
                val newUser = apiService.createUser(User(name = name, email = email))
                _users.value = _users.value + newUser
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}
```

### Retrofit 注解速查

| 注解 | 说明 | 示例 |
|------|------|------|
| `@GET` | GET 请求 | `@GET("users")` |
| `@POST` | POST 请求 | `@POST("users")` |
| `@PUT` | PUT 请求 | `@PUT("users/{id}")` |
| `@DELETE` | DELETE 请求 | `@DELETE("users/{id}")` |
| `@PATCH` | PATCH 请求 | `@PATCH("users/{id}")` |
| `@Path` | 路径参数 | `@Path("id") id: Long` |
| `@Query` | 查询参数 | `@Query("page") page: Int` |
| `@Body` | 请求体 | `@Body user: User` |
| `@Field` | 表单字段 | `@Field("name") name: String` |
| `@Header` | 请求头 | `@Header("Auth") token: String` |
| `@Multipart` | 多部分上传 | `@Multipart` |
| `@FormUrlEncoded` | 表单编码 | `@FormUrlEncoded` |

## WebSocket

WebSocket 提供全双工通信，适合实时消息、聊天等场景。

### OkHttp WebSocket

```kotlin
val client = OkHttpClient()

val request = Request.Builder()
    .url("wss://api.example.com/ws")
    .build()

val webSocket = client.newWebSocket(request, object : WebSocketListener() {
    override fun onOpen(webSocket: WebSocket, response: Response) {
        webSocket.send("Hello Server!")
    }

    override fun onMessage(webSocket: WebSocket, text: String) {
        withContext(Dispatchers.Main) {
            textView.text = text
        }
    }

    override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
    }

    override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
        webSocket.close(1000, null)
    }

    override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
        t.printStackTrace()
    }
})

client.dispatcher.executorService.shutdown()
```

## JSON 解析

### Gson

```gradle
implementation "com.google.code.gson:gson:2.10.1"
```

```kotlin
val gson = Gson()

val json = """{"name": "Alice", "age": 25}"""
val user = gson.fromJson(json, User::class.java)

val userJson = gson.toJson(user)
```

### Moshi

```gradle
implementation "com.squareup.moshi:moshi:1.15.0"
implementation "com.squareup.moshi:moshi-kotlin:1.15.0"
```

```kotlin
val moshi = Moshi.Builder()
    .addLast(KotlinJsonAdapterFactory())
    .build()

val adapter = moshi.adapter(User::class.java)

val user = adapter.fromJson(json)
val jsonString = adapter.toJson(user)
```

### Kotlin Serialization

```gradle
implementation "org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2"
```

```kotlin
@Serializable
data class User(
    val name: String,
    val age: Int,
    val email: String? = null
)

val user = Json.decodeFromString<User>(json)
val jsonString = Json.encodeToString(user)
```

## 网络状态监测

```kotlin
class NetworkMonitor(context: Context) {

    private val connectivityManager =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    val isOnline: Flow<Boolean> = callbackFlow {
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                trySend(true)
            }

            override fun onLost(network: Network) {
                trySend(false)
            }
        }

        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(request, callback)

        val currentState = connectivityManager.activeNetwork?.let { true } ?: false
        trySend(currentState)

        awaitClose {
            connectivityManager.unregisterNetworkCallback(callback)
        }
    }
}
```

## 网络请求最佳实践

1. **使用协程**：避免回调地狱，使用 `suspend` 函数
2. **统一错误处理**：封装 Result 类型或自定义异常
3. **请求拦截器**：统一添加 Token、日志
4. **缓存策略**：离线可用，减少请求
5. **超时设置**：合理设置连接和读取超时
6. **重试机制**：网络不稳定时自动重试

```kotlin
sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}

suspend fun <T> safeApiCall(call: suspend () -> T): Result<T> {
    return try {
        Result.Success(call())
    } catch (e: IOException) {
        Result.Error(e)
    } catch (e: HttpException) {
        Result.Error(e)
    }
}
```
