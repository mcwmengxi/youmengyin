# UI 开发

## View 体系

Android 的 UI 基于 View 和 ViewGroup 构建的树形结构。

### View 与 ViewGroup

- **View**：所有 UI 组件的基类，代表屏幕上一个矩形区域
- **ViewGroup**：View 的子类，作为容器管理子 View 的布局

```
ViewGroup (布局容器)
├── View (控件)
├── View (控件)
└── ViewGroup (嵌套布局)
    ├── View (控件)
    └── View (控件)
```

### 常用控件

```xml
<!-- 文本 -->
<TextView
    android:id="@+id/tvTitle"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Hello Android"
    android:textSize="18sp"
    android:textColor="#333333" />

<!-- 按钮 -->
<Button
    android:id="@+id/btnSubmit"
    android:layout_width="match_parent"
    android:layout_height="48dp"
    android:text="提交" />

<!-- 输入框 -->
<EditText
    android:id="@+id/etInput"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="请输入内容"
    android:inputType="text" />

<!-- 图片 -->
<ImageView
    android:id="@+id/ivAvatar"
    android:layout_width="48dp"
    android:layout_height="48dp"
    android:scaleType="centerCrop"
    android:src="@drawable/avatar" />
```

### 尺寸单位

| 单位 | 说明 | 使用场景 |
|------|------|----------|
| `dp` (density-independent pixels) | 密度无关像素 | 布局尺寸 |
| `sp` (scale-independent pixels) | 缩放无关像素 | 字体大小 |
| `px` (pixels) | 实际像素 | 一般不使用 |

## 常用布局

### LinearLayout

线性布局，子 View 按水平或垂直方向排列。

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="第一行" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="第二行" />

</LinearLayout>
```

### ConstraintLayout

约束布局，Android 推荐的布局方式，性能优于嵌套布局。

```xml
<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/tvTitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="标题"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <Button
        android:id="@+id/btnAction"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="操作"
        app:layout_constraintTop_toBottomOf="@id/tvTitle"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

### FrameLayout

帧布局，子 View 层叠排列，适合显示单个子 View 或叠加效果。

```xml
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="200dp">

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:src="@drawable/background" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="覆盖文字" />

</FrameLayout>
```

### RelativeLayout

相对布局，子 View 通过相对位置排列。

```xml
<RelativeLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/tvCenter"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="居中" />

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_below="@id/tvCenter"
        android:layout_alignStart="@id/tvCenter"
        android:text="下方" />

</RelativeLayout>
```

## RecyclerView

RecyclerView 是 Android 中高效展示列表的组件，取代了传统的 ListView。

### 基本使用

**1. 添加依赖**

```gradle
implementation "androidx.recyclerview:recyclerview:1.3.2"
```

**2. 创建 Adapter**

```kotlin
class UserAdapter(
    private val users: List<User>,
    private val onItemClick: (User) -> Unit
) : RecyclerView.Adapter<UserAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvName: TextView = view.findViewById(R.id.tvName)
        val tvEmail: TextView = view.findViewById(R.id.tvEmail)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_user, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val user = users[position]
        holder.tvName.text = user.name
        holder.tvEmail.text = user.email
        holder.itemView.setOnClickListener { onItemClick(user) }
    }

    override fun getItemCount() = users.size
}
```

**3. 设置 RecyclerView**

```kotlin
val adapter = UserAdapter(users) { user ->
    Toast.makeText(this, user.name, Toast.LENGTH_SHORT).show()
}
recyclerView.adapter = adapter
recyclerView.layoutManager = LinearLayoutManager(this)
```

### 布局管理器

| LayoutManager | 效果 |
|---------------|------|
| `LinearLayoutManager` | 线性列表（水平/垂直） |
| `GridLayoutManager` | 网格布局 |
| `StaggeredGridLayoutManager` | 瀑布流布局 |

```kotlin
recyclerView.layoutManager = LinearLayoutManager(this)
recyclerView.layoutManager = GridLayoutManager(this, 2)
recyclerView.layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
```

### DiffUtil 高效更新

```kotlin
class UserDiffCallback(
    private val oldList: List<User>,
    private val newList: List<User>
) : DiffUtil.Callback() {

    override fun getOldListSize() = oldList.size
    override fun getNewListSize() = newList.size

    override fun areItemsTheSame(oldPos: Int, newPos: Int): Boolean {
        return oldList[oldPos].id == newList[newPos].id
    }

    override fun areContentsTheSame(oldPos: Int, newPos: Int): Boolean {
        return oldList[oldPos] == newList[newPos]
    }
}

val diffResult = DiffUtil.calculateDiff(UserDiffCallback(oldList, newList))
adapter.updateData(newList)
diffResult.dispatchUpdatesTo(adapter)
```

### ListAdapter 简化写法

```kotlin
class UserAdapter(
    private val onItemClick: (User) -> Unit
) : ListAdapter<User, UserAdapter.ViewHolder>(UserDiffItemCallback()) {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvName: TextView = view.findViewById(R.id.tvName)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_user, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val user = getItem(position)
        holder.tvName.text = user.name
        holder.itemView.setOnClickListener { onItemClick(user) }
    }
}

object UserDiffItemCallback : DiffUtil.ItemCallback<User>() {
    override fun areItemsTheSame(oldItem: User, newItem: User) = oldItem.id == newItem.id
    override fun areContentsTheSame(oldItem: User, newItem: User) = oldItem == newItem
}
```

## 自定义 View

### 自定义 View 步骤

1. 继承 View 或其子类
2. 重写 `onDraw()` 绘制内容
3. 重写 `onMeasure()` 测量尺寸
4. 自定义属性（可选）

### 简单自定义 View

```kotlin
class CircleView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var radius = 50f
    private var color = Color.BLUE
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = this@CircleView.color
        style = Paint.Style.FILL
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val cx = width / 2f
        val cy = height / 2f
        canvas.drawCircle(cx, cy, radius, paint)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val size = (radius * 2 + paddingLeft + paddingRight).toInt()
        setMeasuredDimension(
            resolveSize(size, widthMeasureSpec),
            resolveSize(size, heightMeasureSpec)
        )
    }
}
```

### 自定义属性

```xml
<!-- res/values/attrs.xml -->
<declare-styleable name="CircleView">
    <attr name="circleRadius" format="dimension" />
    <attr name="circleColor" format="color" />
</declare-styleable>
```

```xml
<!-- 布局中使用 -->
<com.example.CircleView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:circleRadius="40dp"
    app:circleColor="#FF5722" />
```

```kotlin
init {
    attrs?.let {
        val typedArray = context.obtainStyledAttributes(it, R.styleable.CircleView)
        radius = typedArray.getDimension(R.styleable.CircleView_circleRadius, 50f)
        color = typedArray.getColor(R.styleable.CircleView_circleColor, Color.BLUE)
        paint.color = color
        typedArray.recycle()
    }
}
```

## Material Design

Material Design 是 Google 的设计规范，提供了丰富的 UI 组件库。

### 添加依赖

```gradle
implementation "com.google.android.material:material:1.11.0"
```

### 常用组件

```xml
<!-- TextInputLayout -->
<com.google.android.material.textfield.TextInputLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="用户名"
    app:startIconDrawable="@drawable/ic_person">

    <com.google.android.material.textfield.TextInputEditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

</com.google.android.material.textfield.TextInputLayout>

<!-- FloatingActionButton -->
<com.google.android.material.floatingactionbutton.FloatingActionButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/ic_add"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent" />

<!-- Snackbar -->
```

```kotlin
Snackbar.make(view, "操作成功", Snackbar.LENGTH_SHORT)
    .setAction("撤销") {
    }
    .show()
```

### 主题配置

```xml
<!-- res/values/themes.xml -->
<style name="AppTheme" parent="Theme.Material3.Light.NoActionBar">
    <item name="colorPrimary">@color/purple_500</item>
    <item name="colorPrimaryVariant">@color/purple_700</item>
    <item name="colorOnPrimary">@color/white</item>
</style>
```

## Jetpack Compose

Jetpack Compose 是 Android 的现代声明式 UI 工具包，使用 Kotlin 构建原生 UI。

### 添加依赖

```gradle
implementation "androidx.compose.ui:ui:1.5.4"
implementation "androidx.compose.material3:material3:1.1.2"
implementation "androidx.compose.ui:ui-tooling-preview:1.5.4"
implementation "androidx.activity:activity-compose:1.8.2"
implementation "androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0"
debugImplementation "androidx.compose.ui:ui-tooling:1.5.4"
```

### Compose 基本概念

```kotlin
@Composable
fun Greeting(name: String) {
    Text(
        text = "Hello, $name!",
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.primary
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyTheme {
        Greeting("Android")
    }
}
```

### 常用布局

```kotlin
@Composable
fun UserProfile(user: User) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            painter = painterResource(id = R.drawable.avatar),
            contentDescription = "Avatar",
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = user.name, style = MaterialTheme.typography.headlineSmall)
        Text(text = user.email, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        items(users) { user ->
            UserProfile(user)
            HorizontalDivider()
        }
    }
}
```

### 状态管理

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(16.dp)
    ) {
        Text(text = "Count: $count", fontSize = 32.sp)
        Row {
            Button(onClick = { count++ }) {
                Text("+1")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = { count-- }) {
                Text("-1")
            }
        }
    }
}
```

### Compose 与 ViewModel

```kotlin
class UserViewModel : ViewModel() {
    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    fun loadUsers() {
        viewModelScope.launch {
            _users.value = userRepository.getUsers()
        }
    }
}

@Composable
fun UserScreen(viewModel: UserViewModel = viewModel()) {
    val users by viewModel.users.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadUsers()
    }

    LazyColumn {
        items(users) { user ->
            Text(text = user.name)
        }
    }
}
```

### Compose 导航

```kotlin
NavHost(navController = navController, startDestination = "home") {
    composable("home") {
        HomeScreen(
            onNavigateToDetail = { id ->
                navController.navigate("detail/$id")
            }
        )
    }
    composable(
        route = "detail/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.IntType })
    ) { backStackEntry ->
        val userId = backStackEntry.arguments?.getInt("userId") ?: return@composable
        DetailScreen(userId)
    }
}
```

## 对比：View 体系 vs Jetpack Compose

| 特性 | View 体系 | Jetpack Compose |
|------|-----------|-----------------|
| 范式 | 命令式 | 声明式 |
| 语言 | XML + Kotlin/Java | 纯 Kotlin |
| 状态管理 | 手动同步 | 自动重组 |
| 预览 | 需要运行 | @Preview 实时预览 |
| 学习曲线 | 较低 | 中等 |
| 生态 | 成熟 | 快速发展中 |
| 推荐 | 维护旧项目 | 新项目首选 |
