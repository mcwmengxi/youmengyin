# 架构设计

## 架构模式概述

Android 应用的架构模式经历了从 MVC 到 MVVM 的演进，Google 推荐使用 MVVM + Jetpack 组件。

```
MVC → MVP → MVVM → MVI
```

## MVC（Model-View-Controller）

最传统的架构模式，Android 中 Controller 和 View 耦合较重。

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  View    │────→│ Controller  │────→│  Model  │
│ (XML)    │←────│ (Activity)  │←────│ (Data)  │
└─────────┘     └─────────────┘     └─────────┘
```

### 问题

- Activity 同时承担 View 和 Controller 职责，代码臃肿
- View 和 Controller 耦合，难以测试
- Model 直接操作 View，职责不清

## MVP（Model-View-Presenter）

通过 Presenter 解耦 View 和 Model。

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  View    │←───→│ Presenter   │←───→│  Model  │
│(Activity)│     │ (Logic)     │     │ (Data)  │
└─────────┘     └─────────────┘     └─────────┘
```

### 实现

```kotlin
interface UserContract {
    interface View {
        fun showUsers(users: List<User>)
        fun showError(message: String)
        fun showLoading()
        fun hideLoading()
    }

    interface Presenter {
        fun loadUsers()
        fun deleteUser(id: Long)
    }
}

class UserPresenter(
    private val view: UserContract.View,
    private val repository: UserRepository
) : UserContract.Presenter {

    override fun loadUsers() {
        view.showLoading()
        repository.getUsers(object : Callback<List<User>> {
            override fun onSuccess(users: List<User>) {
                view.hideLoading()
                view.showUsers(users)
            }

            override fun onError(message: String) {
                view.hideLoading()
                view.showError(message)
            }
        })
    }

    override fun deleteUser(id: Long) {
        repository.deleteUser(id)
    }
}
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| View 和 Model 解耦 | 接口过多 |
| Presenter 可测试 | Presenter 容易膨胀 |
| 职责清晰 | 手动管理生命周期 |

## MVVM（Model-View-ViewModel）

Google 推荐的架构模式，通过数据绑定和观察者模式实现 View 和 ViewModel 的解耦。

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  View    │←───→│ ViewModel   │←───→│  Model  │
│(Activity)│     │ (State)     │     │(Repo)   │
└─────────┘     └─────────────┘     └─────────┘
   观察              持有状态           数据源
```

### ViewModel

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

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
                _users.value = repository.getUsers()
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _loading.value = false
            }
        }
    }

    fun refresh() {
        loadUsers()
    }
}
```

### 在 Activity 中观察

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycleScope.launch {
            viewModel.users.collect { users ->
                adapter.submitList(users)
            }
        }

        lifecycleScope.launch {
            viewModel.loading.collect { isLoading ->
                progressBar.isVisible = isLoading
            }
        }

        viewModel.loadUsers()
    }
}
```

### LiveData 版本

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    fun loadUsers() {
        viewModelScope.launch {
            _loading.value = true
            try {
                _users.value = repository.getUsers()
            } catch (e: Exception) {
            } finally {
                _loading.value = false
            }
        }
    }
}

// Activity 中观察
viewModel.users.observe(this) { users ->
    adapter.submitList(users)
}
```

## Jetpack 核心组件

### ViewModel

ViewModel 在配置更改（如屏幕旋转）时保留数据。

```kotlin
class MyViewModel : ViewModel() {
    val data = mutableStateOf("initial")

    override fun onCleared() {
    }
}

// Activity 中获取
val viewModel: MyViewModel by viewModels()

// Fragment 中获取（与 Activity 共享）
val sharedViewModel: MyViewModel by activityViewModels()
```

### LiveData

LiveData 是可观察的数据持有者，具有生命周期感知能力。

```kotlin
val liveData = MutableLiveData<String>()

// 更新数据
liveData.value = "主线程更新"
liveData.postValue("子线程更新")

// 观察数据
liveData.observe(lifecycleOwner) { value ->
    textView.text = value
}

// 转换
val upperCase = Transformations.map(liveData) { it.uppercase() }
val filtered = Transformations.switchMap(liveData) { query ->
    repository.search(query)
}
```

### Lifecycle

Lifecycle 组件帮助管理 Activity/Fragment 的生命周期。

```kotlin
class MyObserver : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun onStart() {
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun onStop() {
    }
}

// 注册观察者
lifecycle.addObserver(MyObserver())
```

### Navigation

Navigation 组件处理应用内导航。

```gradle
implementation "androidx.navigation:navigation-fragment-ktx:2.7.6"
implementation "androidx.navigation:navigation-ui-ktx:2.7.6"
```

```xml
<!-- res/navigation/nav_graph.xml -->
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.HomeFragment"
        android:label="Home">
        <action
            android:id="@+id/action_home_to_detail"
            app:destination="@id/detailFragment" />
    </fragment>

    <fragment
        android:id="@+id/detailFragment"
        android:name="com.example.DetailFragment"
        android:label="Detail">
        <argument
            android:name="userId"
            app:argType="long" />
    </fragment>

</navigation>
```

```kotlin
// 导航到目标
findNavController().navigate(R.id.action_home_to_detail)

// 传递参数
val action = HomeFragmentDirections.actionHomeToDetail(userId = 123L)
findNavController().navigate(action)

// 返回
findNavController().navigateUp()
```

### DataBinding

DataBinding 将布局中的 UI 组件绑定到数据源。

```gradle
android {
    buildFeatures {
        dataBinding true
    }
}
```

```xml
<layout xmlns:android="http://schemas.android.com/apk/res/android">
    <data>
        <variable
            name="user"
            type="com.example.User" />
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{user.name}" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{user.email}" />

    </LinearLayout>
</layout>
```

```kotlin
val binding = ActivityMainBinding.inflate(layoutInflater)
setContentView(binding.root)
binding.user = currentUser
```

## 依赖注入

### Hilt

Hilt 是 Google 基于 Dagger 的依赖注入框架，简化了 Android 的 DI 使用。

```gradle
implementation "com.google.dagger:hilt-android:2.50"
ksp "com.google.dagger:hilt-compiler:2.50"
```

```kotlin
@HiltAndroidApp
class MyApplication : Application()

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    @Inject lateinit var repository: UserRepository

    @Inject lateinit var analytics: AnalyticsService
}

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(context, AppDatabase::class.java, "app.db").build()
    }

    @Provides
    fun provideUserDao(database: AppDatabase): UserDao {
        return database.userDao()
    }
}

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val userDao: UserDao,
    private val apiService: ApiService
) : UserRepository {

    override suspend fun getUsers(): List<User> {
        val remoteUsers = apiService.getUsers()
        userDao.insertAll(remoteUsers)
        return remoteUsers
    }
}
```

### Hilt 注入 ViewModel

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {

    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    fun loadUsers() {
        viewModelScope.launch {
            _users.value = repository.getUsers()
        }
    }
}

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModels()
}
```

## Clean Architecture

Clean Architecture 将应用分为多个层次，每层有独立的职责。

```
┌─────────────────────────────────────────┐
│              Presentation               │
│         (UI / ViewModel / State)        │
├─────────────────────────────────────────┤
│               Domain                    │
│        (Use Cases / Entities)           │
├─────────────────────────────────────────┤
│                Data                     │
│    (Repository / DataSource / API)      │
└─────────────────────────────────────────┘
```

### Domain 层

```kotlin
data class User(
    val id: Long,
    val name: String,
    val email: String
)

interface UserRepository {
    suspend fun getUsers(): List<User>
    suspend fun getUserById(id: Long): User
}

class GetUsersUseCase(private val repository: UserRepository) {
    suspend operator fun invoke(): List<User> {
        return repository.getUsers()
    }
}

class GetUserByIdUseCase(private val repository: UserRepository) {
    suspend operator fun invoke(id: Long): User {
        return repository.getUserById(id)
    }
}
```

### Data 层

```kotlin
class UserRepositoryImpl(
    private val apiService: ApiService,
    private val userDao: UserDao
) : UserRepository {

    override suspend fun getUsers(): List<User> {
        val localUsers = userDao.getAllUsersList()
        if (localUsers.isNotEmpty()) return localUsers

        val remoteUsers = apiService.getUsers()
        userDao.insertAll(remoteUsers)
        return remoteUsers
    }

    override suspend fun getUserById(id: Long): User {
        return userDao.getUserById(id) ?: apiService.getUserById(id)
    }
}
```

### Presentation 层

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val getUsersUseCase: GetUsersUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    sealed class UiState {
        data object Loading : UiState()
        data class Success(val users: List<User>) : UiState()
        data class Error(val message: String) : UiState()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val users = getUsersUseCase()
                _uiState.value = UiState.Success(users)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

## 架构模式对比

| 特性 | MVC | MVP | MVVM | MVI |
|------|-----|-----|------|-----|
| View 和 Model 解耦 | ❌ | ✅ | ✅ | ✅ |
| 可测试性 | 低 | 高 | 高 | 高 |
| 状态管理 | 分散 | Presenter | ViewModel | 单一 State |
| 数据绑定 | 无 | 手动 | 自动 | 单向数据流 |
| 复杂度 | 低 | 中 | 中 | 高 |
| 推荐度 | 旧项目 | 可选 | 推荐 | 大型项目 |
