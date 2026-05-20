# Flutter Widget 基础 - 理解组件体系 🧩

## 1. 什么是 Widget？

在 Flutter 中，**一切皆 Widget**。Widget 是构建 UI 的基本 building block（积木块）。

### 1.1 Widget 的特点

- **不可变性**: Widget 是不可变的，一旦创建就不能修改
- **轻量级**: Widget 对象很轻量，可以快速创建和销毁
- **组合性**: 通过组合小 Widget 来构建复杂的 UI
- **响应式**: 数据变化时，Widget 会自动重建

### 1.2 Widget 树

Flutter 应用就是一个巨大的 Widget 树：

```
MaterialApp
└── Scaffold
    ├── AppBar
    │   └── Text (标题)
    └── Body
        └── Center
            └── Column
                ├── Text
                ├── ElevatedButton
                └── Image
```

## 2. Widget 分类

### 2.1 按状态管理分类

#### StatelessWidget (无状态组件)

```dart
class MyCard extends StatelessWidget {
  final String title;
  final int count;

  const MyCard({super.key, required this.title, required this.count});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text('数量：$count'),
      ),
    );
  }
}
```

**使用场景**:

- 静态文本展示
- 图标显示
- 不需要变化的 UI

#### StatefulWidget (有状态组件)

```dart
class LikeButton extends StatefulWidget {
  const LikeButton({super.key});

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> {
  bool _isLiked = false;
  int _likeCount = 0;

  void _toggleLike() {
    setState(() {
      _isLiked = !_isLiked;
      _likeCount = _isLiked ? _likeCount + 1 : _likeCount - 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton(
          icon: Icon(_isLiked ? Icons.favorite : Icons.favorite_border),
          color: _isLiked ? Colors.red : Colors.grey,
          onPressed: _toggleLike,
        ),
        Text('$_likeCount'),
      ],
    );
  }
}
```

**生命周期方法**:

```dart
class _MyState extends State<MyWidget> {
  @override
  void initState() {
    super.initState();
    // 初始化状态，只调用一次
  }

  @override
  void didUpdateWidget(covariant MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Widget 配置变化时调用
  }

  @override
  void setState(VoidCallback fn) {
    super.setState(fn);
    // 更新状态并触发重建
  }

  @override
  void dispose() {
    // 清理资源，只调用一次
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 构建 UI，可能多次调用
    return Container();
  }
}
```

### 2.2 按功能分类

#### 基础 Widget

```dart
// Text - 文本
Text(
  'Hello Flutter',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
    height: 1.5, // 行高倍数
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis, // 超出省略号
)

// Image - 图片
Image.network(
  'https://example.com/image.jpg',
  width: 200,
  height: 150,
  fit: BoxFit.cover, // 填充方式
  loadingBuilder: (context, child, progress) {
    return CircularProgressIndicator(value: progress?.expectedTotalBytes != null
        ? progress!.cumulativeBytesLoaded / progress.expectedTotalBytes!
        : null);
  },
  errorBuilder: (context, error, stackTrace) {
    return Icon(Icons.error);
  },
)

// Icon - 图标
Icon(
  Icons.home_filled,
  size: 32,
  color: Colors.green,
)
```

#### 容器类 Widget

```dart
// Container - 全能容器
Container(
  constraints: BoxConstraints(maxWidth: 300, minHeight: 100),
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Colors.grey, width: 1),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.1),
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
    gradient: LinearGradient(
      colors: [Colors.blue, Colors.purple],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
  ),
  child: Text('内容'),
)

// DecoratedBox - 装饰容器
DecoratedBox(
  decoration: BoxDecoration(
    color: Colors.red,
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text('装饰容器'),
)
```

#### 交互 Widget

```dart
// GestureDetector - 手势检测
GestureDetector(
  onTap: () => print('点击'),
  onDoubleTap: () => print('双击'),
  onLongPress: () => print('长按'),
  onPanUpdate: (details) => print('拖动：${details.delta}'),
  child: Container(
    width: 100,
    height: 100,
    color: Colors.blue,
  ),
)

// InkWell - Material 风格涟漪效果
InkWell(
  onTap: () {},
  onHighlightChanged: (value) {},
  splashColor: Colors.blue.withOpacity(0.3),
  highlightColor: Colors.blue.withOpacity(0.1),
  borderRadius: BorderRadius.circular(8),
  child: Container(
    padding: EdgeInsets.all(16),
    child: Text('点击我有涟漪效果'),
  ),
)

// 按钮系列
ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  child: Text('凸起按钮'),
)

TextButton(
  onPressed: () {},
  child: Text('文本按钮'),
)

OutlinedButton(
  onPressed: () {},
  child: Text('边框按钮'),
)

IconButton(
  icon: Icon(Icons.add),
  onPressed: () {},
)
```

## 3. Widget 的关键属性

### 3.1 key 属性

Key 用于标识 Widget，在列表或状态保持时很重要：

```dart
// ValueKey - 基于值的 Key
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(
      key: ValueKey(items[index].id), // 使用 ID 作为 Key
      item: items[index],
    );
  },
)

// GlobalKey - 全局唯一 Key
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: TextFormField(),
)

// 使用
_formKey.currentState?.save();
_formKey.currentState?.validate();
```

### 3.2 通用参数

```dart
// key - 标识符
key: UniqueKey()

// 响应式参数
onPressed: () {}  // 点击回调
onChange: (v) {}  // 变化回调
child: ...        // 子组件
children: [...]   // 子组件列表
```

## 4. 自定义 Widget

### 4.1 提取 StatelessWidget

```dart
class UserProfile extends StatelessWidget {
  final String name;
  final String avatar;
  final String bio;

  const UserProfile({
    super.key,
    required this.name,
    required this.avatar,
    required this.bio,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            CircleAvatar(
              backgroundImage: NetworkImage(avatar),
              radius: 40,
            ),
            SizedBox(height: 12),
            Text(
              name,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(bio, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

// 使用
UserProfile(
  name: '张三',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Flutter 开发者',
)
```

### 4.2 提取 StatefulWidget

```dart
class SearchBar extends StatefulWidget {
  final Function(String) onSearch;
  final String hintText;

  const SearchBar({
    super.key,
    required this.onSearch,
    this.hintText = '搜索...',
  });

  @override
  State<SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      decoration: InputDecoration(
        hintText: widget.hintText,
        prefixIcon: Icon(Icons.search),
        suffixIcon: _controller.text.isNotEmpty
            ? IconButton(
                icon: Icon(Icons.clear),
                onPressed: () {
                  _controller.clear();
                  widget.onSearch('');
                },
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(24),
        ),
      ),
      onChanged: widget.onSearch,
      onSubmitted: (value) {
        // 回车搜索
      },
    );
  }
}
```

## 5. Widget 最佳实践

### 5.1 拆分小组件

```dart
// ❌ 不好的做法 - 大而全的 Widget
class BigWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('标题')),
      body: Column(
        children: [
          // 100 行代码...
        ],
      ),
    );
  }
}

// ✅ 好的做法 - 拆分成小组件
class MyPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildHeader(),
          _buildContent(),
          _buildFooter(),
        ],
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(title: Text('标题'));
  }

  Widget _buildHeader() {
    return Container();
  }

  Widget _buildContent() {
    return Container();
  }

  Widget _buildFooter() {
    return Container();
  }
}
```

### 5.2 使用 const 构造函数

```dart
// ✅ 使用 const 优化性能
const Text('静态文本')
const Icon(Icons.home)
const SizedBox(height: 8)

// 在 build 方法中使用 const
@override
Widget build(BuildContext context) {
  return Row(
    children: const [
      Icon(Icons.star),
      SizedBox(width: 8),
      Text('评分：4.8'),
    ],
  );
}
```

### 5.3 避免重复创建

```dart
// ❌ 每次 build 都创建新对象
@override
Widget build(BuildContext context) {
  final controller = TextEditingController(); // 错误！
  return TextField(controller: controller);
}

// ✅ 在 initState 中创建
class _MyWidgetState extends State<MyWidget> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}
```

## 6. 常用 Widget 速查表

### 6.1 布局类

| Widget | 用途 | 特点 |
|--------|------|------|
| Container | 通用容器 | 可设置宽高、边距、装饰等 |
| Row | 水平排列 | Flex 主轴为 horizontal |
| Column | 垂直排列 | Flex 主轴为 vertical |
| Stack | 层叠布局 | 子组件可以重叠 |
| ListView | 滚动列表 | 支持垂直/水平滚动 |
| GridView | 网格布局 | 二维网格排列 |
| Expanded | 弹性扩展 | 填充剩余空间 |
| Flexible | 灵活布局 | 可压缩可扩展 |

### 6.2 基础类

| Widget | 用途 |
|--------|------|
| Text | 文本 |
| Image | 图片 |
| Icon | 图标 |
| Divider | 分割线 |

### 6.3 交互类

| Widget | 用途 |
|--------|------|
| GestureDetector | 手势检测 |
| InkWell | Material 涟漪 |
| ElevatedButton | 凸起按钮 |
| TextField | 文本输入 |
| Checkbox | 复选框 |
| Switch | 开关 |

## 7. 练习与实战

### 练习 1: 商品卡片

创建一个商品展示卡片，包含：

- 商品图片
- 商品名称
- 价格
- 收藏按钮（可切换状态）

### 练习 2: 用户信息表单

创建一个完整的用户信息表单：

- 头像上传（使用占位图）
- 姓名输入
- 邮箱输入
- 性别选择（单选）
- 兴趣爱好（多选）
- 提交按钮

### 练习 3: 新闻列表

创建一个新闻列表页面：

- 使用 ListView
- 每条新闻包含标题、摘要、时间
- 点击有涟漪效果
- 支持下拉刷新

## 💡 小结

- Widget 是 Flutter UI 的基础单元
- 理解 StatelessWidget 和 StatefulWidget 的区别
- 学会组合小 Widget 构建复杂界面
- 掌握常用 Widget 的用法和属性
- 遵循最佳实践编写可维护的代码

下一步：[布局组件](layout-widgets.md) → 深入学习各种布局方式

---

# Flutter Widget 进阶 - 深入理解组件体系 🎯

## 8. Responsive Widgets (响应式组件)

响应式组件用于构建适应不同屏幕尺寸和方向的 UI。

### 8.1 LayoutBuilder

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return _buildWideLayout();
    } else {
      return _buildNarrowLayout();
    }
  },
)
```

### 8.2 MediaQuery

```dart
class ResponsiveText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final fontSize = screenWidth > 600 ? 24.0 : 16.0;

    return Text(
      '响应式文本',
      style: TextStyle(fontSize: fontSize),
    );
  }
}
```

### 8.3 OrientationBuilder

```dart
OrientationBuilder(
  builder: (context, orientation) {
    return orientation == Orientation.portrait
        ? _buildPortraitLayout()
        : _buildLandscapeLayout();
  },
)
```

### 8.4 响应式布局策略

```dart
class AdaptiveContainer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(_getResponsivePadding(context)),
      child: Column(
        children: [
          _buildHeader(context),
          _buildBody(context),
        ],
      ),
    );
  }

  double _getResponsivePadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 1200) return 48.0;
    if (width > 800) return 32.0;
    return 16.0;
  }
}
```

## 9. Inherited Widgets (继承组件)

InheritedWidget 是 Flutter 中高效向下传递数据的机制。

### 9.1 基础用法

```dart
class ThemeData extends InheritedWidget {
  final Color primaryColor;
  final Color secondaryColor;

  const ThemeData({
    super.key,
    required this.primaryColor,
    required this.secondaryColor,
    required super.child,
  });

  static ThemeData of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeData>()!;
  }

  @override
  bool updateShouldNotify(ThemeData oldWidget) {
    return primaryColor != oldWidget.primaryColor ||
           secondaryColor != oldWidget.secondaryColor;
  }
}

// 使用
class ThemedButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = ThemeData.of(context);
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.primaryColor,
      ),
      child: Text('主题按钮'),
    );
  }
}

// 在 widget 树顶部提供数据
ThemeData(
  primaryColor: Colors.blue,
  secondaryColor: Colors.green,
  child: ThemedButton(),
)
```

### 9.2 实际应用场景

```dart
class UserProvider extends InheritedWidget {
  final String userName;
  final String userAvatar;

  const UserProvider({
    super.key,
    required this.userName,
    required this.userAvatar,
    required super.child,
  });

  static UserProvider of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<UserProvider>()!;
  }

  @override
  bool updateShouldNotify(UserProvider oldWidget) {
    return userName != oldWidget.userName ||
           userAvatar != oldWidget.userAvatar;
  }
}

// 在深层组件中使用
class UserProfile extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final user = UserProvider.of(context);
    return CircleAvatar(
      backgroundImage: NetworkImage(user.userAvatar),
    );
  }
}
```

## 10. Stateless Widgets 深入解析

### 10.1 核心原则

```dart
class PureStatelessWidget extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback? onTap;

  const PureStatelessWidget({
    super.key,
    required this.title,
    required this.icon,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // 纯函数：相同输入总是返回相同输出
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon),
          SizedBox(width: 8),
          Text(title),
        ],
      ),
    );
  }
}
```

### 10.2 最佳实践

```dart
// ✅ 使用 const 构造函数优化性能
class OptimizedCard extends StatelessWidget {
  final String title;

  const OptimizedCard({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16), // 使用 const
        child: Text(title),
      ),
    );
  }
}

// ✅ 提取可复用的小组件
class ReusableComponents extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildSectionTitle('标题1'),
        _buildContent('内容1'),
        _buildSectionTitle('标题2'),
        _buildContent('内容2'),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Text(
        title,
        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildContent(String content) {
    return Text(content);
  }
}
```

### 10.3 组合模式

```dart
// 通过组合构建复杂组件
class ComplexCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String imageUrl;
  final VoidCallback onTap;

  const ComplexCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildImage(),
            _buildContent(),
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    return AspectRatio(
      aspectRatio: 16 / 9,
      child: Image.network(
        imageUrl,
        fit: BoxFit.cover,
      ),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }
}
```

## 11. Stateful Widgets 深入解析

### 11.1 状态管理最佳实践

```dart
class WellManagedStatefulWidget extends StatefulWidget {
  final int initialValue;

  const WellManagedStatefulWidget({super.key, this.initialValue = 0});

  @override
  State<WellManagedStatefulWidget> createState() => _WellManagedStatefulWidgetState();
}

class _WellManagedStatefulWidgetState extends State<WellManagedStatefulWidget> {
  late int _counter;
  late TextEditingController _controller;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _counter = widget.initialValue;
    _controller = TextEditingController();
    _initializeData();
  }

  Future<void> _initializeData() async {
    setState(() => _isLoading = true);
    try {
      // 异步初始化
      await Future.delayed(Duration(seconds: 1));
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  void didUpdateWidget(covariant WellManagedStatefulWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialValue != widget.initialValue) {
      _counter = widget.initialValue;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return CircularProgressIndicator();
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('计数器: $_counter'),
        SizedBox(height: 16),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('增加'),
        ),
      ],
    );
  }
}
```

### 11.2 状态分类与组织

```dart
class OrganizedState extends StatefulWidget {
  const OrganizedState({super.key});

  @override
  State<OrganizedState> createState() => _OrganizedStateState();
}

class _OrganizedStateState extends State<OrganizedState> {
  // UI 状态
  bool _isExpanded = false;
  bool _isSelected = false;

  // 数据状态
  List<String> _items = [];
  String _searchQuery = '';

  // 表单状态
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();

  // 加载状态
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final items = await _fetchItemsFromApi();
      if (mounted) {
        setState(() {
          _items = items;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  Future<List<String>> _fetchItemsFromApi() async {
    await Future.delayed(Duration(milliseconds: 500));
    return ['项目1', '项目2', '项目3'];
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return Center(child: CircularProgressIndicator());
    }

    if (_errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('错误: $_errorMessage'),
            ElevatedButton(
              onPressed: _loadItems,
              child: Text('重试'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: _items.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(_items[index]),
        );
      },
    );
  }
}
```

## 12. Styled Widgets (样式化组件)

样式化组件用于统一管理应用的主题和视觉风格。

### 12.1 ThemeData 全局主题

```dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.blue,
    brightness: Brightness.light,
    scaffoldBackgroundColor: Colors.grey[100],
    
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.blue,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    textTheme: TextTheme(
      headlineLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
      ),
      bodyMedium: TextStyle(
        fontSize: 16,
      ),
    ),
  ),
  
  darkTheme: ThemeData(
    brightness:Brightness.dark,
    primarySwatch: Colors.indigo,
  ),
  
  themeMode: ThemeMode.system,
  home: MyHomePage(),
)
```

### 12.2 Theme 组件局部覆盖

```dart
Theme(
  data: ThemeData(
    primaryColor: Colors.green,
    accentColor: Colors.orange,
  ),
  child: Card(
    child: ListTile(
      leading: Icon(Icons.star), // 会使用绿色
      title: Text('自定义主题区域'),
    ),
  ),
)
```

### 12.3 样式继承与扩展

```dart
class StyledContainer extends StatelessWidget {
  final Widget child;
  final Color? backgroundColor;
  final double? borderRadius;

  const StyledContainer({
    super.key,
    required this.child,
    this.backgroundColor,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      decoration: BoxDecoration(
        color: backgroundColor ?? theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(borderRadius ?? 12),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }
}
```

## 13. Material Widgets (Material Design 组件)

Material Widgets 是遵循 Google Material Design 设计规范的组件集合。

### 13.1 核心 Material 组件

#### AppBar 与 Scaffold

```dart
Scaffold(
  appBar: AppBar(
    title: Text('Material 应用'),
    backgroundColor: Theme.of(context).colorScheme.primary,
    foregroundColor: Colors.white,
    elevation: 0,
    actions: [
      IconButton(
        icon: Icon(Icons.search),
        onPressed: () {},
      ),
      IconButton(
        icon: Icon(Icons.more_vert),
        onPressed: () {},
      ),
    ],
  ),
  
  drawer: Drawer(
    child: ListView(
      children: [
        DrawerHeader(
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: Colors.white,
              ),
              SizedBox(height: 12),
              Text(
                '用户名',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            ],
          ),
        ),
        ListTile(
          leading: Icon(Icons.home),
          title: Text('首页'),
          onTap: () {},
        ),
        ListTile(
          leading: Icon(Icons.settings),
          title: Text('设置'),
          onTap: () {},
        ),
      ],
    ),
  ),
  
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
    tooltip: '添加',
  ),
  
  bottomNavigationBar: BottomNavigationBar(
    items: [
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: '首页',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.search),
        label: '搜索',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person),
        label: '我的',
      ),
    ],
    currentIndex: 0,
    onTap: (index) {},
  ),
  
  body: Center(
    child: Text('Material 内容'),
  ),
)
```

#### Material 按钮

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    // 主要操作按钮
    ElevatedButton.icon(
      onPressed: () {},
      icon: Icon(Icons.send),
      label: Text('发送'),
      style: ElevatedButton.styleFrom(
        minimumSize: Size(200, 48),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
      ),
    ),
    
    SizedBox(height: 16),
    
    // 文本按钮（次要操作）
    TextButton(
      onPressed: () {},
      child: Text('取消'),
    ),
    
    SizedBox(height: 16),
    
    // 边框按钮（轮廓按钮）
    OutlinedButton.icon(
      onPressed: () {},
      icon: Icon(Icons.share),
      label: Text('分享'),
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: Colors.blue),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
    
    SizedBox(height: 16),
    
    // 图标按钮
    IconButton(
      icon: Icon(Icons.favorite_border),
      onPressed: () {},
      tooltip: '收藏',
    ),
    
    SizedBox(height: 16),
    
    // 浮动操作按钮
    FloatingActionButton.small(
      onPressed: () {},
      child: Icon(Icons.edit),
      heroTag: 'edit_btn',
    ),
    
    SizedBox(width: 16),
    
    FloatingActionButton.extended(
      onPressed: () {},
      icon: Icon(Icons.add),
      label: Text('新建'),
    ),
  ],
)
```

#### Material 输入组件

```dart
Padding(
  padding: EdgeInsets.all(16),
  child: Form(
    child: Column(
      children: [
        TextFormField(
          decoration: InputDecoration(
            labelText: '用户名',
            hintText: '请输入用户名',
            prefixIcon: Icon(Icons.person),
            border: OutlineInputBorder(),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.grey),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.blue, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.red),
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请输入用户名';
            }
            return null;
          },
        ),
        
        SizedBox(height: 16),
        
        TextFormField(
          obscureText: true,
          decoration: InputDecoration(
            labelText: '密码',
            prefixIcon: Icon(Icons.lock),
            suffixIcon: IconButton(
              icon: Icon(Icons.visibility_off),
              onPressed: () {},
            ),
            border: OutlineInputBorder(),
          ),
        ),
        
        SizedBox(height: 16),
        
        DropdownButtonFormField<String>(
          decoration: InputDecoration(
            labelText: '选择城市',
            border: OutlineInputBorder(),
          ),
          items: ['北京', '上海', '广州', '深圳']
              .map((city) => DropdownMenuItem(
                    value: city,
                    child: Text(city),
                  ))
              .toList(),
          onChanged: (value) {},
        ),
        
        SizedBox(height: 16),
        
        SwitchListTile(
          title: Text('启用通知'),
          subtitle: Text('接收推送通知'),
          value: true,
          onChanged: (value) {},
        ),
        
        SizedBox(height: 16),
        
        CheckboxListTile(
          title: Text('同意条款'),
          value: false,
          onChanged: (value) {}),
      ],
    ),
  ),
)
```

#### Material 反馈组件

```dart
Column(
  children: [
    // SnackBar
    Builder(
      builder: (context) => ElevatedButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('操作成功'),
              action: SnackBarAction(
                label: '撤销',
                onPressed: () {},
              ),
              duration: Duration(seconds: 3),
            ),
          );
        },
        child: Text('显示 SnackBar'),
      ),
    ),
    
    SizedBox(height: 16),
    
    // Dialog
    ElevatedButton(
      onPressed: () {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('确认删除'),
            content: Text('确定要删除这个项目吗？此操作不可撤销。'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('取消'),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: Text('删除'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                ),
              ),
            ],
          ),
        );
      },
      child: Text('显示 Dialog'),
    ),
    
    SizedBox(height: 16),
    
    // BottomSheet
    ElevatedButton(
      onPressed: () {
        showModalBottomSheet(
          context: context,
          builder: (context) => Container(
            height: 200,
            child: Column(
              children: [
                ListTile(
                  leading: Icon(Icons.photo_library),
                  title: Text('相册'),
                  onTap: () => Navigator.pop(context),
                ),
                ListTile(
                  leading: Icon(Icons.camera_alt),
                  title: Text('相机'),
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
        );
      },
      child: Text('显示 BottomSheet'),
    ),
  ],
)
```

### 13.2 Material 卡片与列表

```dart
ListView(
  padding: EdgeInsets.all(16),
  children: [
    // 基础卡片
    Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '卡片标题',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            SizedBox(height: 8),
            Text('这是卡片的描述内容...'),
          ],
        ),
      ),
    ),
    
    SizedBox(height: 16),
    
    // 列表项
    Card(
      child: Column(
        children: [
          ListTile(
            leading: CircleAvatar(
              backgroundImage: NetworkImage('https://via.placeholder.com/150'),
            ),
            title: Text('张三'),
            subtitle: Text('Flutter 开发工程师'),
            trailing: Icon(Icons.more_vert),
            onTap: () {},
          ),
          Divider(height: 1),
          ListTile(
            leading: Icon(Icons.email),
            title: Text('zhangsan@example.com'),
          ),
          ListTile(
            leading: Icon(Icons.phone),
            title: Text('+86 138 0000 0000'),
          ),
        ],
      ),
    ),
    
    SizedBox(height: 16),
    
    // 选择卡片
    ChoiceChip(
      label: Text('选项 1'),
      selected: true,
      onSelected: (selected) {},
    ),
    
    SizedBox(width: 8),
    
    FilterChip(
      label: Text('筛选'),
      selected: false,
      onSelected: (selected) {},
    ),
  ],
)
```

## 14. Cupertino Widgets (iOS 风格组件)

Cupertino Widgets 是遵循 Apple iOS Human Interface Guidelines 设计规范的组件。

### 14.1 Cupertino 基础结构

```dart
CupertinoApp(
  theme: CupertinoThemeData(
    brightness: Brightness.light,
    primaryColor: CupertinoColors.systemBlue,
    barBackgroundColor: CupertinoColors.systemBackground,
    scaffoldBackgroundColor: CupertinoColors.systemGroupedBackground,
  ),
  home: CupertinoPageScaffold(
    navigationBar: CupertinoNavigationBar(
      middle: Text('iOS 风格应用'),
      backgroundColor: CupertinoColors.systemBackground,
      border: Border(
        bottom: BorderSide(
          color: CupertinoColors.separator,
          width: 0.5,
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          CupertinoButton(
            padding: EdgeInsets.zero,
            child: Icon(CupertinoIcons.search),
            onPressed: () {},
          ),
        ],
      ),
    ),
    child: SafeArea(
      child: Center(
        child: Text('iOS 内容'),
      ),
    ),
  ),
)
```

### 14.2 Cupertino 导航与标签栏

```dart
CupertinoTabScaffold(
  tabBar: CupertinoTabBar(
    items: [
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.house_fill),
        label: '首页',
      ),
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.search),
        label: '搜索',
      ),
      BottomNavigationBarItem(
        icon: Icon(CupertinoIcons.person_fill),
        label: '我的',
      ),
    ],
    currentIndex: 0,
    onTap: (index) {},
  ),
  tabBuilder: (context, index) {
    return CupertinoTabView(
      builder: (context) {
        switch (index) {
          case 0:
            return _buildHomePage();
          case 1:
            return _buildSearchPage();
          case 2:
            return _buildProfilePage();
          default:
            return _buildHomePage();
        }
      },
    );
  },
)
```

### 14.3 Cupertino 按钮与交互

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    // iOS 风格主要按钮
    SizedBox(
      width: double.infinity,
      child: CupertinoButton.filled(
        onPressed: () {},
        child: Text('确认操作'),
      ),
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格次要按钮
    SizedBox(
      width: double.infinity,
      child: CupertinoButton(
        onPressed: () {},
        color: CupertinoColors.systemGrey5,
        child: Text(
          '取消',
          style: TextStyle(color: CupertinoColors.label),
        ),
      ),
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格危险按钮
    SizedBox(
      width: double.infinity,
      child: CupertinoButton(
        onPressed: () {},
        color: CupertinoColors.systemRed,
        child: Text(
          '删除',
          style: TextStyle(color: CupertinoColors.white),
        ),
      ),
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格图标按钮
    CupertinoButton(
      padding: EdgeInsets.zero,
      onPressed: () {},
      child: Icon(
        CupertinoIcons.heart,
        color: CupertinoColors.systemRed,
        size: 28,
      ),
    ),
    
    SizedBox(height: 24),
    
    // iOS 开关
    Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('开启通知'),
        CupertinoSwitch(
          value: true,
          onChanged: (value) {},
        ),
      ],
    ),
    
    SizedBox(height: 16),
    
    // iOS 滑块
    CupertinoSlider(
      value: 0.5,
      onChanged: (value) {},
    ),
    
    SizedBox(height: 16),
    
    // iOS 分段控件
    SizedBox(
      width: double.infinity,
      child: CupertinoSegmentedControl<int>(
        children: {
          0: Text('日'),
          1: Text('周'),
          2: Text('月'),
          3: Text('年'),
        },
        onValueChanged: (value) {},
        groupValue: 0,
      ),
    ),
  ],
)
```

### 14.4 Cupertino 输入与选择

```dart
Padding(
  padding: EdgeInsets.all(16),
  child: Column(
    children: [
      // iOS 风格文本输入
      CupertinoTextField(
        placeholder: '请输入文本',
        placeholderStyle: TextStyle(
          color: CupertinoColors.placeholderText,
        ),
        prefix: Padding(
          padding: EdgeInsets.only(left: 12),
          child: Icon(CupertinoIcons.person_fill),
        ),
        suffix: Padding(
          padding: EdgeInsets.only(right: 12),
          child: Icon(CupertinoIcons.clear_circled_solid),
        ),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: CupertinoColors.systemGrey6,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: CupertinoColors.separator,
          ),
        ),
        style: TextStyle(
          fontSize: 16,
          color: CupertinoColors.label,
        ),
      ),
      
      SizedBox(height: 16),
      
      // iOS 风格安全文本输入
      CupertinoTextField(
        placeholder: '密码',
        obscureText: true,
        prefix: Padding(
          padding: EdgeInsets.only(left: 12),
          child: Icon(CupertinoIcons.lock_fill),
        ),
        decoration: BoxDecoration(
          color: CupertinoColors.systemGrey6,
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      
      SizedBox(height: 24),
      
      // iOS 风格选择器
      Container(
        height: 216,
        decoration: BoxDecoration(
          color: CupertinoColors.systemBackground,
          borderRadius: BorderRadius.circular(12),
        ),
        child: CupertinoPicker(
          itemExtent: 32,
          scrollController: FixedExtentScrollController(initialItem: 0),
          onSelectedItemChanged: (index) {},
          children: List.generate(10, (index) {
            return Center(
              child: Text(
                '选项 ${index + 1}',
                style: TextStyle(fontSize: 16),
              ),
            );
          }),
        ),
      ),
      
      SizedBox(height: 24),
      
      // iOS 风格日期时间选择器
      Container(
        height: 216,
        decoration: BoxDecoration(
          color: CupertinoColors.systemBackground,
          borderRadius: BorderRadius.circular(12),
        ),
        child: CupertinoDatePicker(
          mode: CupertinoDatePickerMode.dateAndTime,
          initialDateTime: DateTime.now(),
          onDateTimeChanged: (dateTime) {},
        ),
      ),
    ],
  ),
)
```

### 14.5 Cupertino 对话框与提示

```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    // iOS 风格警告对话框
    CupertinoButton(
      onPressed: () {
        showCupertinoDialog(
          context: context,
          builder: (context) => CupertinoAlertDialog(
            title: Text('提示'),
            content: Text('这是一个 iOS 风格的对话框'),
            actions: [
              CupertinoDialogAction(
                child: Text('取消'),
                isDefaultAction: true,
                onPressed: () => Navigator.pop(context),
              ),
              CupertinoDialogAction(
                child: Text('确定'),
                isDestructiveAction: true,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
      child: Text('显示 Alert'),
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格操作表
    CupertinoButton(
      onPressed: () {
        showCupertinoModalPopup(
          context: context,
          builder: (context) => CupertinoActionSheet(
            title: Text('选择操作'),
            message: Text('请选择一个操作'),
            actions: [
              CupertinoActionSheetAction(
                child: Text('拍照'),
                onPressed: () => Navigator.pop(context),
              ),
              CupertinoActionSheetAction(
                child: Text('从相册选择'),
                onPressed: () => Navigator.pop(context),
              ),
            ],
            cancelButton: CupertinoActionSheetAction(
              child: Text('取消'),
              isDefaultAction: true,
              onPressed: () => Navigator.pop(context),
            ),
          ),
        );
      },
      child: Text('显示 Action Sheet'),
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格加载指示器
    CupertinoActivityIndicator(
      radius: 16,
      color: CupertinoColors.activeBlue,
    ),
    
    SizedBox(height: 16),
    
    // iOS 风格进度条
    CupertinoLinearProgressIndicator(
      value: 0.7,
      color: CupertinoColors.activeBlue,
    ),
  ],
)
```

### 14.6 平台自适应组件

```dart
class AdaptiveUI extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isIOS = Theme.of(context).platform == TargetPlatform.iOS;
    
    return Scaffold(
      appBar: AppBar(title: Text('平台自适应')),
      body: Center(
        child: isIOS ? _buildCupertinoButtons() : _buildMaterialButtons(),
      ),
    );
  }

  Widget _buildCupertinoButtons() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CupertinoButton.filled(
          onPressed: () {},
          child: Text('iOS 按钮'),
        ),
      ],
    );
  }

  Widget _buildMaterialButtons() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton(
          onPressed: () {},
          child: Text('Android 按钮'),
        ),
      ],
    );
  }
}
```

---

# 📚 Widget 体系总结

## 核心概念回顾

| Widget 类型 | 特点 | 使用场景 |
|------------|------|---------|
| **Responsive** | 适配不同屏幕尺寸 | 多设备支持、响应式布局 |
| **Inherited** | 高效数据传递 | 主题、配置、状态共享 |
| **Stateless** | 无状态、不可变 | 静态展示、纯展示组件 |
| **Stateful** | 有状态、可变化 | 交互组件、动态数据 |
| **Styled** | 统一样式管理 | 主题系统、品牌一致性 |
| **Material** | Google 设计规范 | Android 应用 |
| **Cupertino** | Apple 设计规范 | iOS 应用 |

## 选择建议

1. **优先使用 StatelessWidget** - 如果组件不需要维护状态
2. **合理使用 StatefulWidget** - 仅在需要时使用，避免过度使用
3. **利用 InheritedWidget** - 向下传递数据时优先考虑
4. **响应式设计** - 使用 LayoutBuilder 和 MediaQuery 适配多屏幕
5. **平台一致性** - 根据目标平台选择 Material 或 Cupertino 组件
6. **样式统一** - 通过 ThemeData 管理全局主题

## 学习路径

1. ✅ **基础**: StatelessWidget & StatefulWidget
2. ✅ **进阶**: InheritedWidget & 响应式设计
3. ✅ **样式**: Styled Widgets & 主题系统
4. ✅ **平台**: Material Widgets & Cupertino Widgets
5. 🔄 **实战**: [状态管理](state-management.md)
6. 🔄 **项目**: [实战项目](practical-project.md)

---

💡 **提示**: 在实际项目中，通常会混合使用这些 Widget 类型和风格，根据产品需求和目标平台做出合适的选择！
