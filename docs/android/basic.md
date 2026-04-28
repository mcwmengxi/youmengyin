# Android 基础组件

## 移动生态概览

### 移动互联网

移动互联网是互联网技术与移动通信技术融合的产物，智能手机的普及推动了移动应用的爆发式增长。Android 作为全球市场份额最大的移动操作系统，是移动开发的重要平台。

### App 背后的团队结构

一个完整的 App 团队通常包括：

- **产品经理**：需求分析、产品规划
- **UI/UX 设计师**：界面设计、交互设计
- **Android 开发工程师**：客户端开发
- **iOS 开发工程师**：客户端开发
- **后端开发工程师**：服务端 API 开发
- **测试工程师**：质量保障
- **运维工程师**：部署与监控

### 国内 APP 的赛道和代表

| 赛道 | 代表应用 |
|------|----------|
| 社交 | 微信、QQ、微博 |
| 短视频 | 抖音、快手 |
| 电商 | 淘宝、京东、拼多多 |
| 出行 | 滴滴、高德地图 |
| 外卖 | 美团、饿了么 |
| 内容社区 | 小红书、知乎、B站 |

## Activity

Activity 是 Android 应用的核心组件，代表一个用户可以交互的屏幕。

### Activity 生命周期

```
        ┌──────────┐
        │ onCreate  │
        └─────┬─────┘
              ↓
        ┌──────────┐
        │ onStart   │
        └─────┬─────┘
              ↓
        ┌──────────┐
        │ onResume  │ ←──── 可见且可交互
        └─────┬─────┘
              ↓
        ┌──────────┐
        │ onPause   │ ←──── 失去焦点
        └─────┬─────┘
              ↓
        ┌──────────┐
        │ onStop    │ ←──── 不可见
        └─────┬─────┘
              ↓
        ┌──────────┐
        │ onDestroy │ ←──── 销毁
        └──────────┘
```

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        Log.d("Lifecycle", "onCreate")
    }

    override fun onStart() {
        super.onStart()
        Log.d("Lifecycle", "onStart")
    }

    override fun onResume() {
        super.onResume()
        Log.d("Lifecycle", "onResume")
    }

    override fun onPause() {
        super.onPause()
        Log.d("Lifecycle", "onPause")
    }

    override fun onStop() {
        super.onStop()
        Log.d("Lifecycle", "onStop")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d("Lifecycle", "onDestroy")
    }

    override fun onRestart() {
        super.onRestart()
        Log.d("Lifecycle", "onRestart")
    }
}
```

### Activity 启动模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `standard` | 默认模式，每次启动都创建新实例 | 大多数场景 |
| `singleTop` | 栈顶复用，如果已在栈顶则不创建新实例 | 通知消息详情页 |
| `singleTask` | 栈内复用，清除其上所有 Activity | 应用主页 |
| `singleInstance` | 独立栈，全局唯一实例 | 来电页面 |

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTop" />
```

### Activity 间数据传递

```kotlin
// 发送数据
val intent = Intent(this, DetailActivity::class.java).apply {
    putExtra("key_title", "Hello Android")
    putExtra("key_id", 123)
}
startActivity(intent)

// 接收数据
val title = intent.getStringExtra("key_title")
val id = intent.getIntExtra("key_id", -1)

// 获取返回结果
startActivityForResult(intent, REQUEST_CODE)

override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE && resultCode == RESULT_OK) {
        val result = data?.getStringExtra("result")
    }
}
```

## Service

Service 是没有用户界面、在后台长时间运行的应用组件。

### Service 类型

| 类型 | 说明 | 特点 |
|------|------|------|
| Started Service | 通过 `startService()` 启动 | 独立于启动者运行 |
| Bound Service | 通过 `bindService()` 绑定 | 与绑定者生命周期关联 |
| Foreground Service | 前台服务 | 显示通知，不易被系统杀死 |

### Service 基本用法

```kotlin
class MusicService : Service() {
    override fun onCreate() {
        super.onCreate()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return binder
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    inner class LocalBinder : Binder() {
        fun getService(): MusicService = this@MusicService
    }

    private val binder = LocalBinder()
}
```

```xml
<service android:name=".MusicService" />
```

### 启动和绑定 Service

```kotlin
// 启动 Service
val intent = Intent(this, MusicService::class.java)
startService(intent)

// 停止 Service
stopService(intent)

// 绑定 Service
val connection = object : ServiceConnection {
    override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
        val binder = service as MusicService.LocalBinder
        val musicService = binder.getService()
    }

    override fun onServiceDisconnected(name: ComponentName?) {}
}
bindService(intent, connection, Context.BIND_AUTO_CREATE)
```

## BroadcastReceiver

BroadcastReceiver 用于接收系统或应用发出的广播通知。

### 广播类型

| 类型 | 说明 |
|------|------|
| 标准广播 | 异步发送，所有接收者几乎同时收到 |
| 有序广播 | 同步发送，按优先级依次接收，可截断 |
| 本地广播 | 只在应用内传播，更安全 |

### 静态注册

```xml
<receiver android:name=".NetworkReceiver">
    <intent-filter>
        <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
    </intent-filter>
</receiver>
```

### 动态注册

```kotlin
class MainActivity : AppCompatActivity() {
    private val receiver = NetworkReceiver()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        registerReceiver(receiver, filter)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(receiver)
    }
}

class NetworkReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            ConnectivityManager.CONNECTIVITY_ACTION -> {
                val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
                val networkInfo = cm.activeNetworkInfo
                val isConnected = networkInfo?.isConnected == true
            }
        }
    }
}
```

### 自定义广播

```kotlin
// 发送广播
val intent = Intent("com.example.ACTION_CUSTOM")
intent.putExtra("message", "Hello Broadcast")
sendBroadcast(intent)

// 接收广播
class CustomReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val message = intent.getStringExtra("message")
    }
}
```

## ContentProvider

ContentProvider 是 Android 中跨应用数据共享的标准方式。

### 基本概念

- **URI**：统一资源标识符，格式为 `content://authority/path/id`
- **CRUD 操作**：增删改查四种数据操作

### 自定义 ContentProvider

```kotlin
class NoteProvider : ContentProvider() {

    override fun onCreate(): Boolean {
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<String>?,
        selection: String?,
        selectionArgs: Array<String>?,
        sortOrder: String?
    ): Cursor? {
        return null
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<String>?
    ): Int {
        return 0
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    override fun getType(uri: Uri): String? {
        return null
    }
}
```

### 访问系统 ContentProvider

```kotlin
val cursor = contentResolver.query(
    ContactsContract.Contacts.CONTENT_URI,
    null,
    null,
    null,
    null
)

cursor?.use {
    while (it.moveToNext()) {
        val name = it.getString(it.getColumnIndexOrThrow(ContactsContract.Contacts.DISPLAY_NAME))
    }
}
```

## Fragment

Fragment 是 Activity 中的模块化部分，拥有自己的生命周期，可以组合到 Activity 中实现灵活的 UI。

### Fragment 生命周期

```
onAttach → onCreate → onCreateView → onViewCreated → onStart → onResume
                                                                        ↓
onPause → onStop → onDestroyView → onDestroy → onDetach
```

### 创建 Fragment

```kotlin
class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }

    companion object {
        fun newInstance(title: String): HomeFragment {
            return HomeFragment().apply {
                arguments = Bundle().apply {
                    putString("title", title)
                }
            }
        }
    }
}
```

### Fragment 事务

```kotlin
supportFragmentManager.beginTransaction().apply {
    replace(R.id.container, HomeFragment.newInstance("Home"))
    addToBackStack(null)
    commit()
}
```

### Fragment 通信

```kotlin
// Fragment → Activity（通过接口）
interface OnFragmentListener {
    fun onFragmentEvent(data: String)
}

// Activity → Fragment（通过方法调用）
val fragment = supportFragmentManager.findFragmentById(R.id.container) as? HomeFragment
fragment?.updateData("new data")

// Fragment → Fragment（通过 ViewModel 共享数据）
class SharedViewModel : ViewModel() {
    val selected = MutableLiveData<String>()
}
```

## Intent

Intent 是 Android 中组件间通信的核心机制。

### Intent 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 显式 Intent | 指定目标组件 | `Intent(this, DetailActivity::class.java)` |
| 隐式 Intent | 指定动作，由系统匹配 | `Intent(Intent.ACTION_VIEW, Uri.parse(url))` |

### 显式 Intent

```kotlin
val intent = Intent(this, DetailActivity::class.java)
startActivity(intent)
```

### 隐式 Intent

```kotlin
// 打开网页
val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.example.com"))
startActivity(webIntent)

// 拨打电话
val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:10086"))
startActivity(callIntent)

// 发送邮件
val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
    data = Uri.parse("mailto:example@email.com")
    putExtra(Intent.EXTRA_SUBJECT, "Subject")
    putExtra(Intent.EXTRA_TEXT, "Body text")
}
startActivity(emailIntent)
```

### Intent Filter

```xml
<activity android:name=".DeepLinkActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="www.example.com"
            android:pathPrefix="/detail" />
    </intent-filter>
</activity>
```

## AndroidManifest.xml

AndroidManifest.xml 是 Android 应用的核心配置文件。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".MyApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".DetailActivity" />
        <service android:name=".MusicService" />
        <receiver android:name=".NetworkReceiver" />
        <provider android:name=".NoteProvider"
            android:authorities="com.example.provider" />

    </application>
</manifest>
```

## Context

Context 是 Android 中访问系统资源和服务的入口。

| 类型 | 说明 | 作用域 |
|------|------|--------|
| Application Context | 全局上下文 | 应用级别，生命周期与 Application 相同 |
| Activity Context | Activity 上下文 | Activity 级别，生命周期与 Activity 相同 |

```kotlin
val appContext = applicationContext
val activityContext = this

// 获取系统服务
val layoutManager = getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

// 注意：与 UI 相关的操作应使用 Activity Context
// 长生命周期的对象应使用 Application Context，避免内存泄漏
```
