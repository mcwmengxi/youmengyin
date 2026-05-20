# Flutter Material Design - Material 风格组件 🎨

## 1. Material Design 简介

Material Design 是 Google 推出的设计语言，Flutter 完美实现了这套设计规范。

### 1.1 核心概念

- **Material (材质)**: UI 的基本单元，有厚度和阴影
- **Elevation (海拔)**: Z 轴高度，决定阴影大小
- **Motion (动效)**: 有意义的动画过渡
- **Color (色彩)**: 系统化的配色方案

### 1.2 在 Flutter 中使用

```dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.blue,      // 主色调
    colorScheme: ColorScheme.light(), // 配色方案
    fontFamily: 'Roboto',             // 字体
  ),
  home: ...
)
```

## 2. Scaffold - 页面骨架

Scaffold 提供了标准的 Material 页面结构：

```dart
Scaffold(
  // 顶部应用栏
  appBar: AppBar(
    title: Text('标题'),
    leading: IconButton(icon: Icon(Icons.menu), onPressed: () {}),
    actions: [
      IconButton(icon: Icon(Icons.search), onPressed: () {}),
      IconButton(icon: Icon(Icons.more_vert), onPressed: () {}),
    ],
    backgroundColor: Colors.blue,
    elevation: 4,
  ),
  
  // 主体内容
  body: Center(child: Text('内容')),
  
  // 底部导航栏
  bottomNavigationBar: BottomNavigationBar(
    items: [...],
    currentIndex: 0,
    onTap: (index) {},
  ),
  
  // 浮动操作按钮
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
  
  // FAB 位置
  floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
  
  // 侧边抽屉
  drawer: Drawer(...),
  endDrawer: Drawer(...),
  
  // 底部状态栏
  bottomSheet: Container(...),
  
  // 背景色
  backgroundColor: Colors.grey[100],
  
  // 是否显示安全区域
  extendBody: true,
  extendBodyBehindAppBar: true,
)
```

## 3. AppBar - 顶部应用栏

### 3.1 基础用法

```dart
AppBar(
  // 标题
  title: Text('我的应用'),
  
  // 左侧前导组件
  leading: IconButton(
    icon: Icon(Icons.arrow_back),
    onPressed: () => Navigator.pop(context),
  ),
  
  // 右侧操作按钮
  actions: [
    IconButton(icon: Icon(Icons.search), onPressed: () {}),
    IconButton(icon: Icon(Icons.favorite), onPressed: () {}),
    PopupMenuButton<String>(
      onSelected: (value) {},
      itemBuilder: (context) => [
        PopupMenuItem(value: 'settings', child: Text('设置')),
        PopupMenuItem(value: 'logout', child: Text('退出')),
      ],
    ),
  ],
  
  // 底部 TabBar
  bottom: TabBar(
    tabs: [
      Tab(text: '推荐'),
      Tab(text: '热门'),
      Tab(text: '关注'),
    ],
  ),
  
  // 样式
  backgroundColor: Colors.blue,
  foregroundColor: Colors.white,
  elevation: 4,
  centerTitle: true,
  
  // 渐变背景
  flexibleSpace: Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        colors: [Colors.blue, Colors.purple],
      ),
    ),
  ),
)
```

### 3.2 可折叠 AppBar

```dart
SliverAppBar(
  expandedHeight: 200,  // 展开时的高度
  pinned: true,         // 固定在顶部
  snap: false,          // 是否允许快速滑动
  floating: false,      // 是否悬浮
  
  flexibleSpace: FlexibleSpaceBar(
    title: Text('标题'),
    background: Image.network(
      'https://example.com/header.jpg',
      fit: BoxFit.cover,
    ),
  ),
)
```

## 4. 按钮系列

### 4.1 ElevatedButton - 凸起按钮

```dart
ElevatedButton(
  onPressed: () {
    print('点击了');
  },
  onLongPress: () {
    print('长按');
  },
  style: ElevatedButton.styleFrom(
    // 背景色
    backgroundColor: Colors.blue,
    foregroundColor: Colors.white,
    
    // 禁用状态
    disabledBackgroundColor: Colors.grey,
    disabledForegroundColor: Colors.white70,
    
    // 内边距
    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    
    // 形状
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    
    // 阴影
    elevation: 4,
  ),
  child: Text('凸起按钮'),
)
```

### 4.2 TextButton - 文本按钮

```dart
TextButton(
  onPressed: () {},
  style: TextButton.styleFrom(
    foregroundColor: Colors.blue,
    textStyle: TextStyle(fontSize: 16),
  ),
  child: Text('文本按钮'),
)
```

### 4.3 OutlinedButton - 边框按钮

```dart
OutlinedButton(
  onPressed: () {},
  style: OutlinedButton.styleFrom(
    foregroundColor: Colors.blue,
    side: BorderSide(color: Colors.blue, width: 2),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  child: Text('边框按钮'),
)
```

### 4.4 IconButton - 图标按钮

```dart
IconButton(
  icon: Icon(Icons.favorite),
  selectedIcon: Icon(Icons.favorite, color: Colors.red),
  onPressed: () {},
  color: Colors.grey,
  selectedColor: Colors.red,
  iconSize: 24,
  tooltip: '收藏',
)
```

### 4.5 FloatingActionButton - 浮动操作按钮

```dart
// 基础款
FloatingActionButton(
  onPressed: () {},
  child: Icon(Icons.add),
  backgroundColor: Colors.blue,
  foregroundColor: Colors.white,
  elevation: 6,
  tooltip: '添加',
)

// 迷你款
FloatingActionButton.small(
  onPressed: () {},
  child: Icon(Icons.add),
)

// 扩展款（带文字）
FloatingActionButton.extended(
  onPressed: () {},
  icon: Icon(Icons.add),
  label: Text('添加'),
)

// 大尺寸
FloatingActionButton.large(
  onPressed: () {},
  child: Icon(Icons.add),
)
```

## 5. 卡片组件

### 5.1 Card - 基础卡片

```dart
Card(
  // 阴影
  elevation: 4,
  shadowColor: Colors.black26,
  
  // 圆角
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
  
  // 裁剪
  clipBehavior: Clip.antiAlias,
  
  // 颜色
  color: Colors.white,
  
  // 子组件
  child: Column(
    children: [
      Image.network('https://example.com/image.jpg'),
      Padding(
        padding: EdgeInsets.all(16),
        child: Text('卡片内容'),
      ),
    ],
  ),
)
```

### 5.2 ListTile - 列表项

```dart
ListTile(
  // 前导图标
  leading: CircleAvatar(
    backgroundImage: NetworkImage('https://example.com/avatar.jpg'),
  ),
  
  // 标题
  title: Text(
    '标题',
    maxLines: 1,
    overflow: TextOverflow.ellipsis,
  ),
  
  // 副标题
  subtitle: Text('副标题信息'),
  
  // 尾随组件
  trailing: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(Icons.star, color: Colors.amber),
      Icon(Icons.chevron_right),
    ],
  ),
  
  // 是否启用
  enabled: true,
  
  // 选中状态
  selected: true,
  selectedColor: Colors.blue,
  
  // 点击回调
  onTap: () {},
  onLongPress: () {},
  
  // 形状
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(8),
  ),
  
  // 内边距
  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
)
```

## 6. 对话框

### 6.1 AlertDialog - 提示框

```dart
AlertDialog(
  // 图标
  icon: Icon(Icons.warning, color: Colors.amber, size: 40),
  
  // 标题
  title: Text('确认删除？'),
  
  // 内容
  content: Text('此操作不可撤销，请谨慎操作。'),
  
  // 操作按钮
  actions: [
    TextButton(
      onPressed: () => Navigator.pop(context, 'cancel'),
      child: Text('取消'),
    ),
    ElevatedButton(
      onPressed: () => Navigator.pop(context, 'confirm'),
      child: Text('确定'),
    ),
  ],
  
  // 按钮对齐
  actionsAlignment: MainAxisAlignment.spaceEvenly,
  
  // 可滚动
  scrollable: true,
)

// 显示对话框
showDialog(
  context: context,
  builder: (context) => AlertDialog(...),
).then((value) {
  if (value == 'confirm') {
    // 执行删除
  }
});
```

### 6.2 SimpleDialog - 简单选择框

```dart
SimpleDialog(
  title: Text('请选择'),
  children: [
    SimpleDialogOption(
      onPressed: () => Navigator.pop(context, 'option1'),
      child: ListTile(leading: Icon(Icons.home), title: Text('选项 1')),
    ),
    SimpleDialogOption(
      onPressed: () => Navigator.pop(context, 'option2'),
      child: ListTile(leading: Icon(Icons.settings), title: Text('选项 2')),
    ),
  ],
)
```

### 6.3 BottomSheet - 底部动作条

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true,  // 可控制高度
  builder: (context) => Container(
    padding: EdgeInsets.all(16),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ListTile(
          leading: Icon(Icons.share),
          title: Text('分享'),
          onTap: () {},
        ),
        ListTile(
          leading: Icon(Icons.report),
          title: Text('举报'),
          onTap: () {},
        ),
        ListTile(
          leading: Icon(Icons.cancel),
          title: Text('取消'),
          onTap: () => Navigator.pop(context),
        ),
      ],
    ),
  ),
);
```

## 7. Snack Bar - 提示条

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    // 内容
    content: Text('操作成功'),
    
    // 标题
    contentPadding: EdgeInsets.all(16),
    
    // 行为
    action: SnackBarAction(
      label: '撤销',
      textColor: Colors.yellow,
      onPressed: () {},
    ),
    
    // 持续时间
    duration: Duration(seconds: 3),
    
    // 样式
    backgroundColor: Colors.green,
    behavior: SnackBarBehavior.floating,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    
    // 前置图标
    leading: Icon(Icons.check_circle, color: Colors.white),
  ),
);
```

## 8. 输入组件

### 8.1 TextField - 文本输入框

```dart
TextField(
  // 控制器
  controller: _controller,
  
  // 焦点节点
  focusNode: _focusNode,
  
  // 装饰
  decoration: InputDecoration(
    // 标签
    labelText: '用户名',
    labelStyle: TextStyle(color: Colors.blue),
    
    // 提示文字
    hintText: '请输入用户名',
    hintStyle: TextStyle(color: Colors.grey),
    
    // 前缀图标/文字
    prefixIcon: Icon(Icons.person),
    prefixText: '+86 ',
    
    // 后缀图标/文字
    suffixIcon: IconButton(
      icon: Icon(Icons.clear),
      onPressed: () => _controller.clear(),
    ),
    
    // 边框
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    
    // 启用状态
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.grey),
    ),
    
    // 聚焦状态
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.blue, width: 2),
    ),
    
    // 错误状态
    errorText: '用户名不能为空',
    errorBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Colors.red),
    ),
    
    // 填充
    filled: true,
    fillColor: Colors.grey[100],
    
    // 辅助文字
    helperText: '帮助信息',
    counterText: '0/20',
  ),
  
  // 输入类型
  keyboardType: TextInputType.text,  // 文本
  keyboardType: TextInputType.number,  // 数字
  keyboardType: TextInputType.emailAddress,  // 邮箱
  keyboardType: TextInputType.phone,  // 电话
  
  // 键盘动作
  textInputAction: TextInputAction.done,  // 完成
  textInputAction: TextInputAction.next,  // 下一项
  textInputAction: TextInputAction.search,  // 搜索
  
  // 密码模式
  obscureText: true,
  obscuringCharacter: '●',
  
  // 最大长度
  maxLength: 20,
  maxLengthEnforcement: MaxLengthEnforcement.enforced,
  
  // 最大行数
  maxLines: 1,
  minLines: 1,
  
  // 自动聚焦
  autofocus: false,
  
  // 只读
  readOnly: false,
  
  // 启用
  enabled: true,
  
  // 文本对齐
  textAlign: TextAlign.start,
  
  // 文本样式
  style: TextStyle(fontSize: 16),
  
  // 输入验证
  inputFormatters: [
    LengthLimitingTextInputFormatter(20),
    FilteringTextInputFormatter.allow(RegExp('[0-9a-zA-Z]')),
  ],
  
  // 回调
  onChanged: (value) {},
  onSubmitted: (value) {},
  onTap: () {},
)
```

### 8.2 TextFormField - 表单输入框

```dart
Form(
  key: _formKey,
  child: TextFormField(
    decoration: InputDecoration(labelText: '邮箱'),
    
    // 验证器
    validator: (value) {
      if (value == null || value.isEmpty) {
        return '请输入邮箱';
      }
      if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
        return '请输入有效的邮箱';
      }
      return null;
    },
    
    // 保存回调
    onSaved: (value) {
      _email = value!;
    },
    
    // 自动填充
    autofillHints: [AutofillHints.email],
  ),
)

// 使用
_formKey.currentState?.validate();
_formKey.currentState?.save();
```

## 9. 选择组件

### 9.1 Checkbox - 复选框

```dart
Checkbox(
  value: _isChecked,
  tristate: false,  // 是否支持三态
  onChanged: (value) {
    setState(() {
      _isChecked = value;
    });
  },
  activeColor: Colors.blue,
  checkColor: Colors.white,
)

// CheckboxListTile
CheckboxListTile(
  value: _isChecked,
  title: Text('同意协议'),
  subtitle: Text('请阅读并同意用户协议'),
  secondary: Icon(Icons.info),
  onChanged: (value) {},
  activeColor: Colors.blue,
  controlAffinity: ListTileControlAffinity.leading,
)
```

### 9.2 Switch - 开关

```dart
Switch(
  value: _isOn,
  onChanged: (value) {
    setState(() {
      _isOn = value;
    });
  },
  activeColor: Colors.blue,
  activeTrackColor: Colors.blue.withOpacity(0.5),
  inactiveThumbColor: Colors.grey,
  inactiveTrackColor: Colors.grey.shade300,
)

// SwitchListTile
SwitchListTile(
  value: _isOn,
  title: Text('夜间模式'),
  subtitle: Text('保护您的眼睛'),
  secondary: Icon(Icons.dark_mode),
  onChanged: (value) {},
)
```

### 9.3 Radio - 单选

```dart
Radio<int>(
  value: 1,
  groupValue: _selectedValue,
  onChanged: (value) {
    setState(() {
      _selectedValue = value;
    });
  },
  activeColor: Colors.blue,
)

// RadioListTile
RadioListTile<int>(
  value: 1,
  groupValue: _selectedValue,
  title: Text('选项 1'),
  subtitle: Text('描述信息'),
  secondary: Icon(Icons.star),
  onChanged: (value) {},
)
```

### 9.4 Slider - 滑块

```dart
Slider(
  value: _sliderValue,
  min: 0,
  max: 100,
  divisions: 10,  // 分段数
  label: _sliderValue.round().toString(),
  onChanged: (value) {
    setState(() {
      _sliderValue = value;
    });
  },
  activeColor: Colors.blue,
  inactiveColor: Colors.grey,
)

// RangeSlider - 范围滑块
RangeSlider(
  values: _rangeValues,
  min: 0,
  max: 100,
  divisions: 10,
  labels: RangeLabels(
    _rangeValues.start.round().toString(),
    _rangeValues.end.round().toString(),
  ),
  onChanged: (values) {
    setState(() {
      _rangeValues = values;
    });
  },
)
```

## 10. 进度指示

### 10.1 CircularProgressIndicator - 圆形进度条

```dart
// 确定性进度
CircularProgressIndicator(
  value: 0.5,  // 0.0 - 1.0
  strokeWidth: 4,
  backgroundColor: Colors.grey,
  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
)

// 不确定进度（加载中）
CircularProgressIndicator(
  strokeWidth: 4,
  backgroundColor: Colors.grey,
  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
)
```

### 10.2 LinearProgressIndicator - 线性进度条

```dart
// 确定性进度
LinearProgressIndicator(
  value: 0.7,
  minHeight: 8,
  backgroundColor: Colors.grey,
  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
)

// 不确定进度
LinearProgressIndicator(
  minHeight: 8,
  backgroundColor: Colors.grey,
  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
)
```

## 11. 主题与配色

### 11.1 ThemeData 配置

```dart
MaterialApp(
  theme: ThemeData(
    // 主色调
    primarySwatch: Colors.blue,
    primaryColor: Colors.blue,
    
    // 强调色
    accentColor: Colors.amber,
    
    // 配色方案
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blue,
      brightness: Brightness.light,
    ),
    
    // 字体
    fontFamily: 'Roboto',
    textTheme: TextTheme(
      headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
      bodyLarge: TextStyle(fontSize: 16),
    ),
    
    // 组件主题
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
      ),
    ),
    
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(),
      filled: true,
      fillColor: Colors.grey[100],
    ),
  ),
  
  // 暗黑模式
  darkTheme: ThemeData.dark(),
  themeMode: ThemeMode.system,  // 跟随系统
  
  home: ...
)
```

### 11.2 使用主题

```dart
// 获取主题
final theme = Theme.of(context);
final colorScheme = Theme.of(context).colorScheme;

// 使用主题色
Container(
  color: theme.primaryColor,
  child: Text(
    '文本',
    style: theme.textTheme.headlineMedium,
  ),
)

// 根据亮度调整
Color? iconColor = Theme.brightnessOf(context) == Brightness.dark
    ? Colors.white
    : Colors.black;
```

## 12. 实战案例

### 12.1 登录页面

```dart
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('登录'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo
                FlutterLogo(size: 80),
                SizedBox(height: 32),
                
                // 标题
                Text(
                  '欢迎回来',
                  style: Theme.of(context).textTheme.headlineMedium,
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 8),
                Text(
                  '请登录您的账号',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 48),
                
                // 邮箱输入
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: '邮箱',
                    prefixIcon: Icon(Icons.email),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return '请输入邮箱';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                
                // 密码输入
                TextFormField(
                  controller: _passwordController,
                  decoration: InputDecoration(
                    labelText: '密码',
                    prefixIcon: Icon(Icons.lock),
                  ),
                  obscureText: true,
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return '请输入密码';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: Text('忘记密码？'),
                  ),
                ),
                SizedBox(height: 24),
                
                // 登录按钮
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  child: _isLoading
                      ? SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(Colors.white),
                          ),
                        )
                      : Text('登录'),
                ),
                SizedBox(height: 16),
                
                // 注册链接
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('还没有账号？'),
                    TextButton(
                      onPressed: () {},
                      child: Text('立即注册'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() => _isLoading = true);
      
      // 模拟登录请求
      await Future.delayed(Duration(seconds: 2));
      
      setState(() => _isLoading = false);
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('登录成功')),
      );
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

## 💡 小结

- 掌握 Material Design 核心组件
- 学会使用 Scaffold 构建标准页面
- 理解各种按钮、卡片、对话框的使用场景
- 能够自定义主题和配色
- 多参考官方示例和最佳实践

下一步：[状态管理](state-management.md) → 学习如何管理应用状态
