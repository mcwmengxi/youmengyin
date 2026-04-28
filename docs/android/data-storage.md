# 数据存储

## 概述

Android 提供了多种数据存储方案，适用于不同的场景：

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| SharedPreferences | 轻量级键值对 | 简单配置信息 |
| DataStore | 协程友好的键值对 | 替代 SharedPreferences |
| 文件存储 | 内部/外部存储 | 文件读写 |
| SQLite | 关系型数据库 | 结构化数据 |
| Room | SQLite 的抽象层 | 推荐 ORM 方案 |

## SharedPreferences

SharedPreferences 是 Android 最简单的数据持久化方案，适合存储少量键值对数据。

### 基本用法

```kotlin
val sharedPref = getSharedPreferences("app_config", Context.MODE_PRIVATE)

// 写入数据
sharedPref.edit().apply {
    putString("username", "Alice")
    putInt("age", 25)
    putBoolean("is_logged_in", true)
    apply()
}

// 读取数据
val username = sharedPref.getString("username", "默认值")
val age = sharedPref.getInt("age", 0)
val isLoggedIn = sharedPref.getBoolean("is_logged_in", false)

// 删除数据
sharedPref.edit().remove("username").apply()

// 清空所有数据
sharedPref.edit().clear().apply()
```

### apply() vs commit()

| 方法 | 同步/异步 | 返回值 | 推荐度 |
|------|-----------|--------|--------|
| `apply()` | 异步 | 无 | 推荐 |
| `commit()` | 同步 | Boolean | 特殊场景 |

### SharedPreferences 的局限

- 不支持类型安全
- 同步问题（`apply()` 可能丢数据）
- 全局可访问，容易混乱
- 不支持协程
- ANR 风险（SP 文件过大时）

## DataStore

DataStore 是 Jetpack 提供的数据存储方案，使用协程和 Flow 实现异步操作，是 SharedPreferences 的替代品。

### Preferences DataStore

```kotlin
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

object PreferencesKeys {
    val USERNAME = stringPreferencesKey("username")
    val AGE = intPreferencesKey("age")
    val IS_LOGGED_IN = booleanPreferencesKey("is_logged_in")
}

// 写入数据
suspend fun saveUsername(context: Context, username: String) {
    context.dataStore.edit { preferences ->
        preferences[PreferencesKeys.USERNAME] = username
    }
}

// 读取数据
fun getUsername(context: Context): Flow<String> {
    return context.dataStore.data.map { preferences ->
        preferences[PreferencesKeys.USERNAME] ?: "默认值"
    }
}

// 在 Activity/Fragment 中使用
lifecycleScope.launch {
    getUsername(this@MainActivity).collect { username ->
        tvUsername.text = username
    }
}
```

### Proto DataStore

Proto DataStore 使用 Protocol Buffers 存储类型化的对象。

```protobuf
// src/main/proto/user.proto
syntax = "proto3";

option java_package = "com.example.datastore";
option java_multiple_files = true;

message UserPreferences {
  string username = 1;
  int32 age = 2;
  bool is_logged_in = 3;
}
```

```kotlin
val Context.userPreferencesStore: DataStore<UserPreferences> by dataStore(
    fileName = "user_preferences.pb",
    serializer = UserPreferencesSerializer
)

object UserPreferencesSerializer : Serializer<UserPreferences> {
    override val defaultValue: UserPreferences = UserPreferences.getDefaultInstance()

    override suspend fun readFrom(input: InputStream): UserPreferences {
        return UserPreferences.parseFrom(input)
    }

    override suspend fun writeTo(t: UserPreferences, output: OutputStream) {
        t.writeTo(output)
    }
}

// 写入
suspend fun updateUsername(context: Context, username: String) {
    context.userPreferencesStore.update { current ->
        current.toBuilder().setUsername(username).build()
    }
}

// 读取
fun getUsername(context: Context): Flow<String> {
    return context.userPreferencesStore.data.map { it.username }
}
```

## 文件存储

### 内部存储

应用私有目录，其他应用无法访问，卸载应用时删除。

```kotlin
// 写入文件
val filename = "notes.txt"
context.openFileOutput(filename, Context.MODE_PRIVATE).use {
    it.write("Hello File Storage".toByteArray())
}

// 读取文件
val content = context.openFileInput(filename).bufferedReader().use {
    it.readText()
}

// 删除文件
context.deleteFile(filename)

// 获取内部存储路径
val filesDir = context.filesDir
val cacheDir = context.cacheDir
```

### 外部存储

需要权限，Android 10+ 使用分区存储（Scoped Storage）。

```kotlin
// 检查外部存储是否可用
fun isExternalStorageWritable(): Boolean {
    return Environment.getExternalStorageState() == Environment.MEDIA_MOUNTED
}

// 应用专属外部存储（不需要权限）
val externalFilesDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS)
val externalCacheDir = context.externalCacheDir

// 写入文件
File(externalFilesDir, "data.json").writeText("{\"key\": \"value\"}")
```

### 分区存储（Android 10+）

```kotlin
// 使用 MediaStore 访问公共媒体文件
val collection = MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)

val contentValues = ContentValues().apply {
    put(MediaStore.Images.Media.DISPLAY_NAME, "photo.jpg")
    put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
}

val uri = contentResolver.insert(collection, contentValues)
uri?.let {
    contentResolver.openOutputStream(it).use { outputStream ->
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, outputStream)
    }
}
```

## SQLite

SQLite 是 Android 内置的轻量级关系型数据库。

### SQLiteOpenHelper

```kotlin
class DatabaseHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "app.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_USERS = "users"
        const val COLUMN_ID = "id"
        const val COLUMN_NAME = "name"
        const val COLUMN_EMAIL = "email"
    }

    override fun onCreate(db: SQLiteDatabase) {
        val createTable = """
            CREATE TABLE $TABLE_USERS (
                $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COLUMN_NAME TEXT NOT NULL,
                $COLUMN_EMAIL TEXT NOT NULL
            )
        """.trimIndent()
        db.execSQL(createTable)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_USERS")
        onCreate(db)
    }
}
```

### CRUD 操作

```kotlin
val dbHelper = DatabaseHelper(context)
val db = dbHelper.writableDatabase

// 插入
val values = ContentValues().apply {
    put(COLUMN_NAME, "Alice")
    put(COLUMN_EMAIL, "alice@example.com")
}
val newRowId = db.insert(TABLE_USERS, null, values)

// 查询
val cursor = db.query(
    TABLE_USERS,
    arrayOf(COLUMN_ID, COLUMN_NAME, COLUMN_EMAIL),
    "$COLUMN_NAME = ?",
    arrayOf("Alice"),
    null, null, null
)

cursor.use {
    while (it.moveToNext()) {
        val id = it.getLong(it.getColumnIndexOrThrow(COLUMN_ID))
        val name = it.getString(it.getColumnIndexOrThrow(COLUMN_NAME))
        val email = it.getString(it.getColumnIndexOrThrow(COLUMN_EMAIL))
    }
}

// 更新
val updateValues = ContentValues().apply {
    put(COLUMN_EMAIL, "newalice@example.com")
}
db.update(TABLE_USERS, updateValues, "$COLUMN_NAME = ?", arrayOf("Alice"))

// 删除
db.delete(TABLE_USERS, "$COLUMN_NAME = ?", arrayOf("Alice"))
```

## Room

Room 是 Jetpack 提供的 SQLite 抽象层，编译时检查 SQL 语句，推荐使用。

### 添加依赖

```gradle
implementation "androidx.room:room-runtime:2.6.1"
implementation "androidx.room:room-ktx:2.6.1"
ksp "androidx.room:room-compiler:2.6.1"
```

### Entity（实体）

```kotlin
@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,

    @ColumnInfo(name = "name")
    val name: String,

    @ColumnInfo(name = "email")
    val email: String,

    @ColumnInfo(name = "created_at")
    val createdAt: Long = System.currentTimeMillis()
)
```

### Dao（数据访问对象）

```kotlin
@Dao
interface UserDao {

    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<User>>

    @Query("SELECT * FROM users WHERE id = :userId")
    suspend fun getUserById(userId: Long): User?

    @Query("SELECT * FROM users WHERE name LIKE :searchQuery")
    fun searchUsers(searchQuery: String): Flow<List<User>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: User): Long

    @Insert
    suspend fun insertAll(users: List<User>)

    @Update
    suspend fun updateUser(user: User)

    @Delete
    suspend fun deleteUser(user: User)

    @Query("DELETE FROM users WHERE id = :userId")
    suspend fun deleteById(userId: Long)
}
```

### Database（数据库）

```kotlin
@Database(entities = [User::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
```

### 数据库迁移

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE users ADD COLUMN phone TEXT")
    }
}

Room.databaseBuilder(context, AppDatabase::class.java, "app_database")
    .addMigrations(MIGRATION_1_2)
    .build()
```

### 在 ViewModel 中使用 Room

```kotlin
class UserViewModel(private val userDao: UserDao) : ViewModel() {

    val users: Flow<List<User>> = userDao.getAllUsers()

    fun addUser(name: String, email: String) {
        viewModelScope.launch {
            userDao.insertUser(User(name = name, email = email))
        }
    }

    fun deleteUser(user: User) {
        viewModelScope.launch {
            userDao.deleteUser(user)
        }
    }
}

class UserViewModelFactory(private val userDao: UserDao) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(UserViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return UserViewModel(userDao) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

### Room + Compose

```kotlin
@Composable
fun UserScreen(viewModel: UserViewModel = viewModel()) {
    val users by viewModel.users.collectAsState(initial = emptyList())

    LazyColumn {
        items(users) { user ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(text = user.name, fontWeight = FontWeight.Bold)
                    Text(text = user.email, color = Color.Gray)
                }
                IconButton(onClick = { viewModel.deleteUser(user) }) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete")
                }
            }
        }
    }
}
```

## 存储方案选择指南

```
需要存储什么？
├── 简单键值对配置
│   ├── 数据量小 → SharedPreferences / DataStore Preferences
│   └── 需要类型安全 → DataStore Preferences
├── 结构化数据
│   ├── 简单查询 → Room
│   └── 复杂关系 → Room + 迁移策略
├── 文件
│   ├── 应用私有 → 内部存储
│   ├── 需要持久化 → 外部存储（应用专属目录）
│   └── 公共媒体 → MediaStore / SAF
└── 需要跨应用共享 → ContentProvider
```
