# Android 中的 Kotlin 实践

Kotlin 已成为 Android 开发的首选语言。本节介绍 Kotlin 在 Android 开发中的最佳实践、常用模式和注意事项。

## Activity 与 Fragment

### Activity 基本结构

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupViews()
        observeData()
    }

    private fun setupViews() {
        binding.toolbar.setTitle(R.string.app_name)
        binding.fab.setOnClickListener {
            navigateToCreateScreen()
        }
    }

    private fun observeData() {
        viewModel.data.observe(this) { data ->
            updateUI(data)
        }
    }
}
```

### Fragment 最佳实践

```kotlin
class UserFragment : Fragment() {
    private var _binding: FragmentUserBinding? = null
    private val binding get() = _binding!!

    private val viewModel: UserViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentUserBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupViews()
        observeData()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setupViews() {
        binding.recyclerView.adapter = userAdapter
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.refresh()
        }
    }

    private fun observeData() {
        viewModel.users.observe(viewLifecycleOwner) { users ->
            userAdapter.submitList(users)
        }
    }
}
```

## ViewModel

### 基本 ViewModel

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    init {
        loadUsers()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = repository.getUsers()
                _users.value = result
            } catch (e: Exception) {
                handleError(e)
            } finally {
                _loading.value = false
            }
        }
    }

    fun refresh() {
        loadUsers()
    }

    private fun handleError(exception: Exception) {
        // 处理错误
    }
}
```

### ViewModel 工厂

```kotlin
class UserViewModelFactory(
    private val repository: UserRepository
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(UserViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return UserViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

// 在 Fragment 中使用
class UserFragment : Fragment() {
    private val viewModel: UserViewModel by viewModels {
        UserViewModelFactory(UserRepository())
    }
}
```

## ViewBinding 与数据绑定

### ViewBinding

```kotlin
// 在 build.gradle 中启用
android {
    buildFeatures {
        viewBinding = true
    }
}

// Activity 中使用
class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.userName.text = "Alice"
        binding.userEmail.text = "alice@example.com"
    }
}
```

### DataBinding

```kotlin
// 在 build.gradle 中启用
android {
    buildFeatures {
        dataBinding = true
    }
}

// 布局文件 activity_profile.xml
// <layout>
//     <data>
//         <variable name="user" type="com.example.User" />
//     </data>
//     <LinearLayout>
//         <TextView android:text="@{user.name}" />
//         <TextView android:text="@{user.email}" />
//     </LinearLayout>
// </layout>

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_profile)

        binding.user = User("Alice", "alice@example.com")
        binding.lifecycleOwner = this
    }
}
```

## RecyclerView

### Adapter 实现

```kotlin
class UserAdapter : ListAdapter<User, UserAdapter.UserViewHolder>(UserDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return UserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class UserViewHolder(
        private val binding: ItemUserBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(user: User) {
            binding.userName.text = user.name
            binding.userEmail.text = user.email
            binding.root.setOnClickListener {
                onItemClickListener?.invoke(user)
            }
        }
    }

    private var onItemClickListener: ((User) -> Unit)? = null

    fun setOnItemClickListener(listener: (User) -> Unit) {
        onItemClickListener = listener
    }
}

class UserDiffCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: User, newItem: User): Boolean {
        return oldItem == newItem
    }
}
```

## Intent 与导航

### 类型安全的 Intent

```kotlin
// 使用伴生对象封装 Intent 参数
class DetailActivity : AppCompatActivity() {
    companion object {
        private const val EXTRA_USER_ID = "extra_user_id"
        private const val EXTRA_USER_NAME = "extra_user_name"

        fun createIntent(context: Context, userId: String, userName: String): Intent {
            return Intent(context, DetailActivity::class.java).apply {
                putExtra(EXTRA_USER_ID, userId)
                putExtra(EXTRA_USER_NAME, userName)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val userId = intent.getStringExtra(EXTRA_USER_ID) ?: return
        val userName = intent.getStringExtra(EXTRA_USER_NAME) ?: return

        setupWith(userId, userName)
    }
}

// 调用
startActivity(DetailActivity.createIntent(this, "123", "Alice"))
```

### 使用扩展函数简化 Intent

```kotlin
inline fun <reified T : Activity> Context.intentFor(vararg params: Pair<String, Any?>): Intent {
    return Intent(this, T::class.java).apply {
        params.forEach { (key, value) ->
            when (value) {
                is String -> putExtra(key, value)
                is Int -> putExtra(key, value)
                is Long -> putExtra(key, value)
                is Boolean -> putExtra(key, value)
                is Parcelable -> putExtra(key, value)
                is Serializable -> putExtra(key, value)
            }
        }
    }
}

inline fun <reified T : Activity> Context.startActivity(vararg params: Pair<String, Any?>) {
    startActivity(intentFor<T>(*params))
}

// 使用
startActivity<DetailActivity>(
    "userId" to "123",
    "userName" to "Alice"
)
```

## SharedPreferences 封装

```kotlin
class PreferenceManager(context: Context) {
    private val prefs = context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)

    var userId: String
        get() = prefs.getString("user_id", "") ?: ""
        set(value) = prefs.edit().putString("user_id", value).apply()

    var isLoggedIn: Boolean
        get() = prefs.getBoolean("is_logged_in", false)
        set(value) = prefs.edit().putBoolean("is_logged_in", value).apply()

    var lastSyncTime: Long
        get() = prefs.getLong("last_sync_time", 0L)
        set(value) = prefs.edit().putLong("last_sync_time", value).apply()

    fun clear() {
        prefs.edit().clear().apply()
    }
}

// 使用委托属性简化
class DelegatedPreference<T>(
    private val prefs: SharedPreferences,
    private val key: String,
    private val defaultValue: T
) : ReadWriteProperty<Any?, T> {
    override fun getValue(thisRef: Any?, property: KProperty<*>): T {
        @Suppress("UNCHECKED_CAST")
        return when (defaultValue) {
            is String -> prefs.getString(key, defaultValue) as T
            is Int -> prefs.getInt(key, defaultValue) as T
            is Long -> prefs.getLong(key, defaultValue) as T
            is Boolean -> prefs.getBoolean(key, defaultValue) as T
            is Float -> prefs.getFloat(key, defaultValue) as T
            else -> throw IllegalArgumentException("Unsupported type")
        }
    }

    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        prefs.edit().apply {
            when (value) {
                is String -> putString(key, value)
                is Int -> putInt(key, value)
                is Long -> putLong(key, value)
                is Boolean -> putBoolean(key, value)
                is Float -> putFloat(key, value)
                else -> throw IllegalArgumentException("Unsupported type")
            }
        }.apply()
    }
}
```

## 权限处理

```kotlin
// 封装权限请求
class PermissionManager(
    private val activity: FragmentActivity,
    private val permissions: Array<String>
) {
    private var onGranted: (() -> Unit)? = null
    private var onDenied: ((List<String>) -> Unit)? = null

    fun onGranted(action: () -> Unit): PermissionManager {
        onGranted = action
        return this
    }

    fun onDenied(action: (List<String>) -> Unit): PermissionManager {
        onDenied = action
        return this
    }

    fun request() {
        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(activity, it) != PackageManager.PERMISSION_GRANTED
        }

        if (needed.isEmpty()) {
            onGranted?.invoke()
        } else {
            // 使用 Activity Result API
        }
    }
}

// 使用
PermissionManager(this, arrayOf(
    Manifest.permission.CAMERA,
    Manifest.permission.WRITE_EXTERNAL_STORAGE
))
    .onGranted { startCamera() }
    .onDenied { deniedPermissions -> showPermissionRationale(deniedPermissions) }
    .request()
```

## 通知

```kotlin
object NotificationHelper {
    private const val CHANNEL_ID = "default_channel"

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Default Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Default notification channel"
            }
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    fun showNotification(context: Context, title: String, message: String) {
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(context)
            .notify(System.currentTimeMillis().toInt(), notification)
    }
}
```

## 常用扩展函数

```kotlin
// View 扩展
fun View.visible() { visibility = View.VISIBLE }
fun View.invisible() { visibility = View.INVISIBLE }
fun View.gone() { visibility = View.GONE }

fun View.showIf(condition: Boolean) {
    visibility = if (condition) View.VISIBLE else View.GONE
}

inline fun View.onClick(crossinline action: () -> Unit) {
    setOnClickListener { action() }
}

// Context 扩展
fun Context.showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

fun Context.isNetworkAvailable(): Boolean {
    val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    return cm.activeNetworkInfo?.isConnected == true
}

// ImageView 扩展
fun ImageView.loadUrl(url: String) {
    Glide.with(this).load(url).into(this)
}

fun ImageView.loadCircleUrl(url: String) {
    Glide.with(this).load(url).circleCrop().into(this)
}

// String 扩展
fun String.toEditable(): Editable = Editable.Factory.getInstance().newEditable(this)
```

## 最佳实践

1. **使用 ViewBinding 替代 findViewById**：类型安全，避免空指针
2. **使用 ViewModel 管理UI数据**：配置变更时保留数据
3. **使用 lifecycleScope 和 viewModelScope**：自动管理协程生命周期
4. **避免在 Activity/Fragment 中写业务逻辑**：使用 ViewModel 和 Repository 分层
5. **使用 sealed class 表示 UI 状态**：类型安全的状态管理
6. **合理使用扩展函数**：减少工具类，提高代码可读性
7. **使用 Parcelize 替代手写 Parcelable**：减少样板代码
