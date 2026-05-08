# 协程在 Android 中的应用

协程在 Android 开发中扮演着至关重要的角色，它简化了异步编程，使代码更加清晰和易于维护。本节介绍协程在 Android 中的实际应用模式。

## 协程作用域

### lifecycleScope

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // lifecycleScope 绑定 Activity 生命周期
        lifecycleScope.launch {
            // 当 Activity 销毁时自动取消
            val data = fetchData()
            updateUI(data)
        }

        // 在特定生命周期状态启动
        lifecycleScope.launchWhenStarted {
            // 只有在 Started 状态时才执行
            observeData()
        }

        lifecycleScope.launchWhenResumed {
            // 只有在 Resumed 状态时才执行
            refreshData()
        }
    }
}
```

### viewModelScope

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    // viewModelScope 绑定 ViewModel 生命周期
    fun loadUsers() {
        viewModelScope.launch {
            try {
                val users = repository.getUsers()
                _users.value = users
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}
```

### 自定义作用域

```kotlin
class MyService : Service() {
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        serviceScope.launch {
            doBackgroundWork()
        }
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }
}
```

## 网络请求

### 基本网络请求模式

```kotlin
class UserViewModel(
    private val apiService: ApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState

    fun loadUser(userId: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val user = withContext(Dispatchers.IO) {
                    apiService.getUser(userId)
                }
                _uiState.value = UiState.Success(user)
            } catch (e: HttpException) {
                _uiState.value = UiState.Error("服务器错误: ${e.code()}")
            } catch (e: IOException) {
                _uiState.value = UiState.Error("网络连接失败")
            }
        }
    }

    sealed class UiState {
        object Loading : UiState()
        data class Success(val user: User) : UiState()
        data class Error(val message: String) : UiState()
    }
}
```

### 并行网络请求

```kotlin
class DashboardViewModel(
    private val apiService: ApiService
) : ViewModel() {

    fun loadDashboard() {
        viewModelScope.launch {
            _loading.value = true
            try {
                // 并行请求多个接口
                val deferredUser = async { apiService.getUserProfile() }
                val deferredOrders = async { apiService.getOrders() }
                val deferredNotifications = async { apiService.getNotifications() }

                val user = deferredUser.await()
                val orders = deferredOrders.await()
                val notifications = deferredNotifications.await()

                _dashboard.value = DashboardData(user, orders, notifications)
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }
}
```

### 带重试的网络请求

```kotlin
suspend fun <T> retryIO(
    times: Int = 3,
    initialDelay: Long = 100,
    maxDelay: Long = 5000,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) {
        try {
            return block()
        } catch (e: IOException) {
            delay(currentDelay)
            currentDelay = (currentDelay * 2).coerceAtMost(maxDelay)
        }
    }
    return block()
}

// 使用
viewModelScope.launch {
    val data = retryIO { apiService.fetchData() }
}
```

## 数据库操作

### Room + 协程

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<User>>

    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserById(id: String): User?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: User)

    @Delete
    suspend fun deleteUser(user: User)

    @Query("DELETE FROM users")
    suspend fun deleteAll()
}

class UserRepository(
    private val userDao: UserDao,
    private val apiService: ApiService
) {
    fun getUsers(): Flow<List<User>> = userDao.getAllUsers()

    suspend fun refreshUsers() {
        val remoteUsers = apiService.getUsers()
        withContext(Dispatchers.IO) {
            userDao.insertUser(*remoteUsers.toTypedArray())
        }
    }
}
```

### 离线优先模式

```kotlin
class UserRepository(
    private val userDao: UserDao,
    private val apiService: ApiService
) {
    fun getUsers(): Flow<List<User>> = flow {
        // 先发射本地数据
        val localData = userDao.getAllUsers().first()
        emit(localData)

        // 然后尝试从网络获取最新数据
        try {
            val remoteData = apiService.getUsers()
            withContext(Dispatchers.IO) {
                userDao.insertUser(*remoteData.toTypedArray())
            }
            // Room 的 Flow 会自动发射更新后的数据
        } catch (e: Exception) {
            // 网络失败，使用本地数据
        }
    }
}
```

## 协程与生命周期

### Lifecycle 感知的协程

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // repeatOnLifecycle - 在特定生命周期状态下收集 Flow
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    updateUI(state)
                }
            }
        }
    }
}
```

### Fragment 中的协程

```kotlin
class UserFragment : Fragment() {
    private val viewModel: UserViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.users.collect { users ->
                    adapter.submitList(users)
                }
            }
        }
    }
}
```

## 协程取消与超时

### 结构化取消

```kotlin
class DownloadService : Service() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private var downloadJob: Job? = null

    fun startDownload(url: String) {
        downloadJob = scope.launch {
            try {
                val file = downloadFile(url)
                notifyDownloadComplete(file)
            } catch (e: CancellationException) {
                cleanupPartialDownload()
            } catch (e: Exception) {
                notifyDownloadFailed(e)
            }
        }
    }

    fun cancelDownload() {
        downloadJob?.cancel()
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
```

### 超时处理

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    fun loadWithTimeout() {
        viewModelScope.launch {
            val result = try {
                withTimeout(10_000L) {
                    repository.fetchData()
                }
                "Success"
            } catch (e: TimeoutCancellationException) {
                "Request timed out"
            }
            _status.value = result
        }
    }
}
```

## 协程与 WorkManager

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val data = inputData.getString("key") ?: return Result.failure()

            val result = withContext(Dispatchers.IO) {
                performSync(data)
            }

            val outputData = workDataOf("result" to result)
            Result.success(outputData)
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }

    private suspend fun performSync(data: String): String {
        delay(1000L)
        return "Synced: $data"
    }
}

// 调度工作
val syncRequest = OneTimeWorkRequestBuilder<SyncWorker>()
    .setInputData(workDataOf("key" to "value"))
    .setConstraints(
        Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()
    )
    .build()

WorkManager.getInstance(context).enqueue(syncRequest)
```

## 协程测试

### 测试挂起函数

```kotlin
class UserViewModelTest {
    @get:Rule
    val mainRule = MainDispatcherRule()

    @Test
    fun loadUsers_success() = runTest {
        val repository = mockk<UserRepository>()
        coEvery { repository.getUsers() } returns listOf(
            User("1", "Alice"),
            User("2", "Bob")
        )

        val viewModel = UserViewModel(repository)
        viewModel.loadUsers()

        val state = viewModel.uiState.value
        assertTrue(state is UserViewModel.UiState.Success)
        assertEquals(2, (state as UserViewModel.UiState.Success).users.size)
    }
}

class MainDispatcherRule : TestWatcher() {
    val testDispatcher = UnconfinedTestDispatcher()

    override fun starting(description: Description?) {
        Dispatchers.setMain(testDispatcher)
    }

    override fun finished(description: Description?) {
        Dispatchers.resetMain()
    }
}
```

### 测试 Flow

```kotlin
class UserRepositoryTest {
    @Test
    fun getUsers_emitsLocalThenRemote() = runTest {
        val localUsers = listOf(User("1", "Local Alice"))
        val remoteUsers = listOf(User("1", "Remote Alice"), User("2", "Bob"))

        val repository = UserRepository(localDao, remoteApi)
        val emissions = repository.getUsers().take(2).toList()

        assertEquals(localUsers, emissions[0])
        assertEquals(remoteUsers, emissions[1])
    }
}
```

## 常见模式

### 协程 + Result 封装

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
}

suspend fun <T> safeApiCall(call: suspend () -> T): Result<T> {
    return try {
        Result.Success(call())
    } catch (e: Exception) {
        Result.Error(e)
    }
}

class UserViewModel(private val repository: UserRepository) : ViewModel() {
    fun loadUser(id: String) {
        viewModelScope.launch {
            when (val result = safeApiCall { repository.getUser(id) }) {
                is Result.Success -> _user.value = result.data
                is Result.Error -> _error.value = result.exception.message
            }
        }
    }
}
```

### 协程 + Channel 通信

```kotlin
class SearchViewModel : ViewModel() {
    private val searchChannel = Channel<String>()
    private val _results = MutableStateFlow<List<SearchResult>>(emptyList())
    val results: StateFlow<List<SearchResult>> = _results

    init {
        viewModelScope.launch {
            searchChannel.receiveAsFlow()
                .debounce(300)
                .distinctUntilChanged()
                .collect { query ->
                    performSearch(query)
                }
        }
    }

    fun onSearchQueryChanged(query: String) {
        viewModelScope.launch {
            searchChannel.send(query)
        }
    }

    private suspend fun performSearch(query: String) {
        _results.value = repository.search(query)
    }
}
```

## 最佳实践

1. **使用结构化并发**：始终在合适的作用域中启动协程
2. **选择正确的调度器**：IO 操作用 Dispatchers.IO，UI 操作用 Dispatchers.Main
3. **使用 repeatOnLifecycle 收集 Flow**：避免在后台收集导致崩溃
4. **正确处理异常**：使用 try-catch 或 CoroutineExceptionHandler
5. **避免 GlobalScope**：使用 lifecycleScope 或 viewModelScope
6. **测试协程代码**：使用 runTest 和 TestDispatcher
7. **合理使用超时**：为网络请求设置合理的超时时间
