# Kotlin 状态管理与 Flow

Flow 是 Kotlin 协程中处理数据流的解决方案，特别适合在 Android 中管理状态和响应式数据流。本节介绍 Flow 的核心概念和状态管理的最佳实践。

## Flow 基础

### 创建 Flow

```kotlin
import kotlinx.coroutines.flow.*

// flow 构建器
fun countdown(): Flow<Int> = flow {
    for (i in 5 downTo 1) {
        emit(i)
        delay(1000L)
    }
}

// flowOf
val numbers = flowOf(1, 2, 3, 4, 5)

// asFlow - 将集合或区间转换为 Flow
val rangeFlow = (1..10).asFlow()
val listFlow = listOf("a", "b", "c").asFlow()

// channelFlow - 支持在协程中发送值
fun events(): Flow<String> = channelFlow {
    launch {
        send("Event 1")
        delay(100L)
        send("Event 2")
    }
    send("Event 0")
}

// callbackFlow - 将回调转换为 Flow
fun locationUpdates(provider: LocationManager): Flow<Location> = callbackFlow {
    val listener = object : LocationListener {
        override fun onLocationChanged(location: Location) {
            trySend(location)
        }
    }
    provider.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0L, 0f, listener)
    awaitClose { provider.removeUpdates(listener) }
}
```

### 收集 Flow

```kotlin
// collect - 终端操作符
suspend fun collectExample() {
    countdown().collect { value ->
        println(value)
    }
}

// collectLatest - 只处理最新的值
suspend fun collectLatestExample() {
    flow {
        emit(1)
        delay(100L)
        emit(2)
        delay(100L)
        emit(3)
    }.collectLatest { value ->
        println("Processing $value")
        delay(200L)
        println("Done $value")
    }
}

// toList / toSet - 转为集合
suspend fun toListExample() {
    val list = flowOf(1, 2, 3).toList()
}

// first / firstOrNull - 获取第一个值
suspend fun firstExample() {
    val first = flowOf(1, 2, 3).first()
    val firstEven = flowOf(1, 3, 5).firstOrNull { it % 2 == 0 }
}

// single - 确保只有一个值
suspend fun singleExample() {
    val value = flowOf(1).single()
}
```

## Flow 操作符

### 转换操作符

```kotlin
// map - 转换每个值
suspend fun mapExample() {
    flowOf(1, 2, 3)
        .map { it * 2 }
        .collect { println(it) }
}

// mapLatest - 只转换最新的值
suspend fun mapLatestExample() {
    flow {
        emit("A")
        delay(100L)
        emit("B")
        delay(100L)
        emit("C")
    }.mapLatest { value ->
        "Processed $value"
    }.collect { println(it) }
}

// transform - 灵活转换，可以发射多个值
suspend fun transformExample() {
    flowOf(1, 2, 3)
        .transform { value ->
            emit("Value: $value")
            emit("Squared: ${value * value}")
        }
        .collect { println(it) }
}

// withIndex - 添加索引
suspend fun withIndexExample() {
    flowOf("a", "b", "c")
        .withIndex()
        .collect { (index, value) -> println("$index: $value") }
}
```

### 过滤操作符

```kotlin
// filter - 过滤值
suspend fun filterExample() {
    flowOf(1, 2, 3, 4, 5)
        .filter { it % 2 == 0 }
        .collect { println(it) }
}

// filterIsInstance - 按类型过滤
suspend fun filterIsInstanceExample() {
    flowOf(1, "hello", 2.0, "world")
        .filterIsInstance<String>()
        .collect { println(it) }
}

// filterNotNull - 过滤 null
suspend fun filterNotNullExample() {
    flowOf("a", null, "b", null, "c")
        .filterNotNull()
        .collect { println(it) }
}

// drop / take
suspend fun dropTakeExample() {
    flowOf(1, 2, 3, 4, 5)
        .drop(2)
        .collect { println(it) }

    flowOf(1, 2, 3, 4, 5)
        .take(3)
        .collect { println(it) }
}

// debounce - 防抖
suspend fun debounceExample() {
    flow {
        emit("K")
        delay(100L)
        emit("Ko")
        delay(100L)
        emit("Kot")
        delay(300L)
        emit("Kotl")
        delay(100L)
        emit("Kotlin")
    }.debounce(200L)
        .collect { println(it) }
}

// distinctUntilChanged - 去重连续相同值
suspend fun distinctExample() {
    flowOf(1, 1, 2, 2, 3, 2, 2)
        .distinctUntilChanged()
        .collect { println(it) }
}
```

### 组合操作符

```kotlin
// zip - 组合两个 Flow
suspend fun zipExample() {
    val names = flowOf("Alice", "Bob", "Charlie")
    val ages = flowOf(25, 30, 35)

    names.zip(ages) { name, age -> "$name is $age" }
        .collect { println(it) }
}

// combine - 任一 Flow 发射时组合
suspend fun combineExample() {
    val flow1 = flowOf("A", "B").onEach { delay(100L) }
    val flow2 = flowOf(1, 2, 3).onEach { delay(200L) }

    flow1.combine(flow2) { a, b -> "$a$b" }
        .collect { println(it) }
}

// merge - 合并多个 Flow
suspend fun mergeExample() {
    val flow1 = flowOf(1, 2, 3).onEach { delay(100L) }
    val flow2 = flowOf(4, 5, 6).onEach { delay(150L) }

    merge(flow1, flow2)
        .collect { println(it) }
}

// flattenMerge - 展平嵌套 Flow
suspend fun flattenExample() {
    flowOf(1, 2, 3)
        .map { value -> flowOf(value, value * 10) }
        .flattenMerge(concurrency = 2)
        .collect { println(it) }
}
```

### 错误处理操作符

```kotlin
// catch - 捕获上游异常
suspend fun catchExample() {
    flow {
        emit(1)
        throw RuntimeException("Error!")
    }.catch { e ->
        println("Caught: ${e.message}")
        emit(-1)
    }.collect { println(it) }
}

// retry - 重试
suspend fun retryExample() {
    var attempt = 0
    flow {
        attempt++
        if (attempt < 3) {
            throw RuntimeException("Attempt $attempt failed")
        }
        emit("Success on attempt $attempt")
    }.retry(3)
        .catch { e -> emit("Failed: ${e.message}") }
        .collect { println(it) }
}

// retryWhen - 条件重试
suspend fun retryWhenExample() {
    flow {
        emit(1)
        throw IOException("Network error")
    }.retryWhen { cause, attempt ->
        cause is IOException && attempt < 3L
    }.catch { emit(-1) }
        .collect { println(it) }
}
```

## StateFlow

### 基本 StateFlow

```kotlin
class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()

    fun increment() {
        _count.value = _count.value + 1
    }

    fun decrement() {
        _count.value = _count.value - 1
    }

    fun reset() {
        _count.value = 0
    }
}
```

### StateFlow vs LiveData

| 特性 | StateFlow | LiveData |
|------|-----------|----------|
| 初始值 | 必须提供 | 可选 |
| 生命周期感知 | 否（需配合 repeatOnLifecycle） | 是 |
| 协程支持 | 原生 | 需要扩展 |
| 线程安全 | 是 | 是 |
| 数据去重 | 自动（distinctUntilChanged） | 否 |

### 在 ViewModel 中使用 StateFlow

```kotlin
data class UiState(
    val users: List<User> = emptyList(),
    val loading: Boolean = false,
    val error: String? = null
)

class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true, error = null) }
            try {
                val users = repository.getUsers()
                _uiState.update { it.copy(users = users, loading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(loading = false, error = e.message) }
            }
        }
    }
}
```

## SharedFlow

### 基本 SharedFlow

```kotlin
class EventBus {
    private val _events = MutableSharedFlow<Event>()
    val events: SharedFlow<Event> = _events.asSharedFlow()

    suspend fun emit(event: Event) {
        _events.emit(event)
    }
}

data class Event(val type: String, val data: Any?)

// 使用
class MyViewModel(private val eventBus: EventBus) : ViewModel() {
    fun onButtonClick() {
        viewModelScope.launch {
            eventBus.emit(Event("button_click", null))
        }
    }
}
```

### SharedFlow 配置

```kotlin
// 配置缓冲和重播
val sharedFlow = MutableSharedFlow<String>(
    replay = 0,       // 新订阅者重播的历史值数量
    extraBufferCapacity = 0,  // 额外缓冲容量
    onBufferOverflow = BufferOverflow.SUSPEND  // 缓冲溢出策略
)

// 带重播的 SharedFlow（类似 BehaviorSubject）
val replayFlow = MutableSharedFlow<String>(
    replay = 1  // 新订阅者会收到最近的一个值
)
```

### StateFlow vs SharedFlow

```kotlin
// StateFlow - 适合表示状态
// 总是有值，新订阅者会收到当前值
// 自动去重（distinctUntilChanged）
val state = MutableStateFlow(initialValue)

// SharedFlow - 适合表示事件
// 可以没有值，新订阅者不一定收到历史值
// 不自动去重
val events = MutableSharedFlow<Event>()
```

## 在 Android 中收集 Flow

### 生命周期感知的收集

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 推荐方式：repeatOnLifecycle
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    updateUI(state)
                }
            }
        }

        // 收集多个 Flow
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                launch {
                    viewModel.uiState.collect { updateUI(it) }
                }
                launch {
                    viewModel.events.collect { handleEvent(it) }
                }
            }
        }
    }
}
```

### Fragment 中收集

```kotlin
class UserFragment : Fragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    binding.userName.text = state.userName
                    binding.progressBar.showIf(state.loading)
                }
            }
        }
    }
}
```

## 状态管理模式

### 单一状态模式 (Single State)

```kotlin
data class ProfileUiState(
    val user: User? = null,
    val loading: Boolean = false,
    val error: String? = null,
    val isEditing: Boolean = false
)

class ProfileViewModel(
    private val repository: UserRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    fun loadProfile(userId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true) }
            repository.getUser(userId)
                .onSuccess { user ->
                    _uiState.update { it.copy(user = user, loading = false) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(error = e.message, loading = false) }
                }
        }
    }

    fun startEditing() {
        _uiState.update { it.copy(isEditing = true) }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(isEditing = false) }
    }
}
```

### 分离状态与事件

```kotlin
class LoginViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    private val _events = Channel<LoginEvent>()
    val events: Flow<LoginEvent> = _events.receiveAsFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(loading = true) }
            try {
                val result = repository.login(email, password)
                _events.send(LoginEvent.NavigateToHome(result))
            } catch (e: Exception) {
                _events.send(LoginEvent.ShowError(e.message ?: "Login failed"))
            } finally {
                _uiState.update { it.copy(loading = false) }
            }
        }
    }
}

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val loading: Boolean = false
)

sealed class LoginEvent {
    data class NavigateToHome(val user: User) : LoginEvent()
    data class ShowError(val message: String) : LoginEvent()
}
```

### 使用密封类表示状态

```kotlin
sealed interface MovieUiState {
    object Loading : MovieUiState
    data class Success(val movies: List<Movie>) : MovieUiState
    data class Error(val message: String) : MovieUiState
}

class MovieViewModel(private val repository: MovieRepository) : ViewModel() {
    private val _uiState = MutableStateFlow<MovieUiState>(MovieUiState.Loading)
    val uiState: StateFlow<MovieUiState> = _uiState.asStateFlow()

    fun loadMovies() {
        viewModelScope.launch {
            _uiState.value = MovieUiState.Loading
            try {
                val movies = repository.getPopularMovies()
                _uiState.value = MovieUiState.Success(movies)
            } catch (e: Exception) {
                _uiState.value = MovieUiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

// 在 Activity/Fragment 中
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { state ->
            when (state) {
                is MovieUiState.Loading -> {
                    binding.progressBar.visible()
                    binding.recyclerView.gone()
                }
                is MovieUiState.Success -> {
                    binding.progressBar.gone()
                    binding.recyclerView.visible()
                    adapter.submitList(state.movies)
                }
                is MovieUiState.Error -> {
                    binding.progressBar.gone()
                    binding.errorText.text = state.message
                    binding.errorText.visible()
                }
            }
        }
    }
}
```

## Flow 测试

```kotlin
class UserViewModelTest {
    @get:Rule
    val mainRule = MainDispatcherRule()

    @Test
    fun uiState_emitsLoadingThenSuccess() = runTest {
        val repository = FakeUserRepository(listOf(User("1", "Alice")))
        val viewModel = UserViewModel(repository)

        val states = mutableListOf<UserUiState>()
        val job = launch(UnconfinedTestDispatcher()) {
            viewModel.uiState.toList(states)
        }

        viewModel.loadUsers()

        assertEquals(UserUiState.Loading, states[0])
        assertTrue(states[1] is UserUiState.Success)

        job.cancel()
    }

    @Test
    fun events_emitsNavigateEvent() = runTest {
        val viewModel = LoginViewModel(FakeLoginRepository())

        viewModel.login("test@example.com", "password")

        val event = viewModel.events.first()
        assertTrue(event is LoginEvent.NavigateToHome)
    }
}
```

## 最佳实践

1. **使用 StateFlow 表示 UI 状态**：自动去重，始终有值
2. **使用 SharedFlow/Channel 表示一次性事件**：导航、Toast 等
3. **使用 repeatOnLifecycle 收集 Flow**：确保生命周期安全
4. **使用密封类表示不同状态**：Loading、Success、Error
5. **使用 update 方法更新 StateFlow**：保证原子性更新
6. **将状态与事件分离**：避免事件丢失或重复消费
7. **为 Flow 添加超时和错误处理**：提高健壮性
