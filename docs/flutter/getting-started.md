# Flutter 入门指南 - 创建你的第一个应用 🚀

## 1. 项目结构解析

创建一个新的 Flutter 项目后，你会看到以下目录结构：

```
my_app/
├── android/          # Android 平台相关代码
├── ios/             # iOS 平台相关代码
├── lib/             # Dart 代码目录（主要工作区域）
│   └── main.dart    # 应用入口文件
├── test/            # 测试文件目录
├── pubspec.yaml     # 项目配置文件（依赖、资源等）
└── README.md        # 项目说明文档
```

## 2. Hello World 示例

### 2.1 最简应用

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('我的第一个 Flutter 应用'),
        ),
        body: const Center(
          child: Text('Hello, World!'),
        ),
      ),
    );
  }
}
```

### 2.2 代码解析

- **`main()` 函数**：程序入口，调用 `runApp()` 启动应用
- **`MaterialApp`**：Material Design 风格的顶层组件
- **`Scaffold`**：提供标准的 Material 页面结构（AppBar、Body 等）
- **`AppBar`**：顶部应用栏
- **`Center`**：使子组件居中的布局
- **`Text`**：文本显示组件

## 3. StatefulWidget vs StatelessWidget

### 3.1 无状态组件 (StatelessWidget)

适用于不需要动态更新的 UI：

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text('静态文本');
  }
}
```

### 3.2 有状态组件 (StatefulWidget)

适用于需要动态更新的 UI：

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('计数：$_counter'),
        ElevatedButton(
          onPressed: _increment,
          child: const Text('点击 +1'),
        ),
      ],
    );
  }
}
```

### 3.3 关键区别

| StatelessWidget | StatefulWidget |
|----------------|----------------|
| 不可变状态 | 可变状态 |
| 性能更好 | 需要管理状态 |
| 适用于静态 UI | 适用于交互 UI |
| 只有 build 方法 | 有 createState 方法 |

## 4. 常用 Widget 速查

### 4.1 基础组件

```dart
// 文本
Text('Hello', style: TextStyle(fontSize: 20, color: Colors.blue))

// 图片
Image.network('https://example.com/image.png')
Image.asset('assets/images/logo.png')

// 图标
Icon(Icons.home, size: 24, color: Colors.red)

// 按钮
ElevatedButton(onPressed: () {}, child: Text('按钮'))
TextButton(onPressed: () {}, child: Text('文本按钮'))
IconButton(icon: Icon(Icons.favorite), onPressed: () {})
```

### 4.2 输入组件

```dart
// 文本输入框
TextField(
  decoration: InputDecoration(
    labelText: '用户名',
    hintText: '请输入用户名',
    prefixIcon: Icon(Icons.person),
  ),
  onChanged: (value) {
    print('输入内容：$value');
  },
)

// 下拉选择
DropdownButton<String>(
  value: selectedValue,
  items: ['选项 1', '选项 2'].map((item) {
    return DropdownMenuItem(value: item, child: Text(item));
  }).toList(),
  onChanged: (value) {
    setState(() {
      selectedValue = value;
    });
  },
)
```

### 4.3 容器与装饰

```dart
Container(
  width: 200,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(12),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        blurRadius: 8,
        offset: Offset(0, 4),
      ),
    ],
  ),
  child: Text('容器内容'),
)
```

## 5. 热重载 (Hot Reload)

Flutter 的核心特性之一，让你无需重新编译即可看到代码更改的效果。

### 5.1 使用方法

- VS Code: `Ctrl+S` 保存时自动热重载
- Android Studio: 点击闪电图标或按 `Ctrl+Alt+\`
- 命令行: 按 `r` 键

### 5.2 热重载 vs 热重启

- **热重载 (r)**: 保持应用状态，快速更新 UI
- **热重启 (R)**: 重置应用状态，重新初始化变量

## 6. 调试技巧

### 6.1 Debug Banner

默认情况下，Debug 模式会在右上角显示"DEBUG"标签：

```dart
MaterialApp(
  debugShowCheckedModeBanner: false, // 隐藏 Debug 标签
  home: ...
)
```

### 6.2 打印日志

```dart
// 控制台输出
print('调试信息：$data');

// 使用 debugPrint（更适合长文本）
debugPrint('详细信息：$longString');
```

### 6.3 Flutter Inspector

在 IDE 中打开 Flutter Inspector 可以可视化查看 Widget 树结构。

## 7. WidgetsBindingObserver - 应用生命周期监听

`WidgetsBindingObserver` 是一个混入类（Mixin），允许你监听应用级别的事件和状态变化。

### 7.1 基本用法

```dart
class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    // 注册观察者
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    // 移除观察者，防止内存泄漏
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  /// 应用生命周期变化
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        print('应用恢复前台运行');
        // 恢复动画、重新加载数据等
        break;
      case AppLifecycleState.paused:
        print('应用进入后台');
        // 暂停动画、保存数据等
        break;
      case AppLifecycleState.inactive:
        print('应用处于非活动状态');
        // 例如：接听电话、分屏模式
        break;
      case AppLifecycleState.detached:
        print('应用仍托管但视图已分离');
        break;
      case AppLifecycleState.hidden:
        print('应用隐藏但仍运行');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('生命周期监听')),
      body: Center(child: Text('查看控制台输出')),
    );
  }
}
```

### 7.2 常用回调方法

#### 屏幕亮度变化

```dart
@override
void didChangePlatformBrightness() {
  final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
  
  if (brightness == Brightness.dark) {
    print('系统切换到深色模式');
  } else {
    print('系统切换到浅色模式');
  }
  
  // 通知主题更新
  setState(() {});
}
```

#### 本地化设置变化

```dart
@override
void didChangeLocales(List<Locale>? locales) {
  print('系统语言发生变化: $locales');
  // 重新加载本地化资源
}
```

#### 内存警告

```dart
@override
void didHaveMemoryPressure() {
  print('收到内存警告！');
  // 释放缓存、清理不需要的资源
  imageCache.clear();
  imageCache.clearLiveImages();
}
```

#### 无障碍服务变化

```dart
@override
void didChangeAccessibilityFeatures() {
  final features = WidgetsBinding.instance.platformDispatcher.accessibilityFeatures;
  
  print('粗体文本: ${features.boldText}');
  print('减少动画: ${features.disableAnimations}');
  print('高对比度: ${features.highContrast}');
  
  // 根据无障碍设置调整 UI
  setState(() {});
}

```

#### 文本缩放因子变化

```dart
@override
void didChangeTextScaleFactor() {
  final scale = WidgetsBinding.instance.platformDispatcher.textScaleFactor;
  print('文本缩放因子: $scale');
  
  // 重新计算布局
  setState(() {});
}

```

### 7.3 实际应用场景

#### 场景 1: 视频播放器

```dart
class VideoPlayerPage extends StatefulWidget {
  @override
  State<VideoPlayerPage> createState() => _VideoPlayerPageState();
}

class _VideoPlayerPageState extends State<VideoPlayerPage>
    with WidgetsBindingObserver {
  VideoPlayerController?_controller;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeVideo();
  }

  void _initializeVideo() {
    _controller = VideoPlayerController.networkUrl(
      Uri.parse('<https://example.com/video.mp4>'),
    )..initialize().then((_) {
      setState(() {});
      _controller?.play();
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      // 应用进入后台时暂停视频
      _controller?.pause();
    } else if (state == AppLifecycleState.resumed) {
      // 应用恢复时继续播放
      _controller?.play();
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _controller?.value.isInitialized ?? false
          ? AspectRatio(
              aspectRatio:_controller!.value.aspectRatio,
              child: VideoPlayer(_controller!),
            )
          : Center(child: CircularProgressIndicator()),
    );
  }
}

```

#### 场景 2: 实时数据同步

```dart
class ChatPage extends StatefulWidget {
  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> with WidgetsBindingObserver {
  Timer?_syncTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _startSync();
  }

  void _startSync() {
    _syncTimer = Timer.periodic(Duration(seconds: 5), (timer) {
      _syncMessages();
    });
  }

  void _syncMessages() {
    // 从服务器获取新消息
    print('同步消息...');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      // 进入后台时停止同步
      _syncTimer?.cancel();
      print('停止同步');
    } else if (state == AppLifecycleState.resumed) {
      // 恢复时重新启动同步
      _startSync();
      _syncMessages(); // 立即同步一次
      print('恢复同步');
    }
  }

  @override
  void dispose() {
    _syncTimer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('聊天')),
      body: Center(child: Text('聊天内容')),
    );
  }
}

```

#### 场景 3: 深色模式适配

```dart
class ThemeAwareWidget extends StatefulWidget {
  @override
  State<ThemeAwareWidget> createState() => _ThemeAwareWidgetState();
}

class _ThemeAwareWidgetState extends State<ThemeAwareWidget>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangePlatformBrightness() {
    // 系统主题变化时自动更新
    setState(() {});
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = MediaQuery.of(context).platformBrightness == Brightness.dark;

    return Container(
      color: isDark ? Colors.black : Colors.white,
      child: Text(
        '当前主题: ${isDark ? "深色" : "浅色"}',
        style: TextStyle(
          color: isDark ? Colors.white : Colors.black,
        ),
      ),
    );
  }
}

```

### 7.4 注意事项

```dart
// ✅ 正确：在 initState 中添加，在 dispose 中移除
@override
void initState() {
  super.initState();
  WidgetsBinding.instance.addObserver(this);
}

@override
void dispose() {
  WidgetsBinding.instance.removeObserver(this);
  super.dispose();
}

// ❌ 错误：忘记移除观察者会导致内存泄漏
@override
void dispose() {
  // 缺少 removeObserver
  super.dispose();
}

// ⚠️ 注意：某些回调可能在 widget 销毁后仍然触发
@override
void didChangeAppLifecycleState(AppLifecycleState state) {
  if (!mounted) return; // 检查 widget 是否还在树中
  
  setState(() {
    // 安全地更新状态
  });
}

```

## 8. 其他常用知识点

### 8.1 GlobalKey 的高级用法

#### 访问子组件状态

```dart
class FormPage extends StatefulWidget {
  @override
  State<FormPage> createState() => _FormPageState();
}

class _FormPageState extends State<FormPage> {
  final_formKey = GlobalKey<FormState>();
  final _emailFieldKey = GlobalKey<FormFieldState>();

  void _validateAndSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      // 获取特定字段的值
      final email = _emailFieldKey.currentState?.value;
      print('邮箱: $email');

      _formKey.currentState?.save();
      // 提交表单
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            key:_emailFieldKey,
            decoration: InputDecoration(labelText: '邮箱'),
            validator: (value) {
              if (value?.isEmpty ?? true) {
                return '请输入邮箱';
              }
              return null;
            },
          ),
          ElevatedButton(
            onPressed: _validateAndSubmit,
            child: Text('提交'),
          ),
        ],
      ),
    );
  }
}

```

#### 跨组件通信

```dart
class ParentWidget extends StatefulWidget {
  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  final_childKey = GlobalKey<_ChildWidgetState>();

  void _callChildMethod() {
    // 调用子组件的方法
    _childKey.currentState?.refreshData();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ChildWidget(key: _childKey),
        ElevatedButton(
          onPressed:_callChildMethod,
          child: Text('刷新子组件'),
        ),
      ],
    );
  }
}

class ChildWidget extends StatefulWidget {
  const ChildWidget({super.key});

  @override
  State<ChildWidget> createState() => _ChildWidgetState();
}

class _ChildWidgetState extends State<ChildWidget> {
  void refreshData() {
    print('刷新数据');
    setState(() {
      // 更新数据
    });
  }

  @override
  Widget build(BuildContext context) {
    return Text('子组件');
  }
}

```

### 8.2 InheritedWidget - 高效的数据共享

```dart
// 创建 InheritedWidget
class AppTheme extends InheritedWidget {
  final ThemeData theme;
  final bool isDarkMode;

  const AppTheme({
    super.key,
    required this.theme,
    required this.isDarkMode,
    required super.child,
  });

  static AppTheme? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<AppTheme>();
  }

  @override
  bool updateShouldNotify(AppTheme oldWidget) {
    return theme != oldWidget.theme || isDarkMode != oldWidget.isDarkMode;
  }
}

// 使用
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AppTheme(
      theme: ThemeData.light(),
      isDarkMode: false,
      child: MaterialApp(
        home: HomePage(),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final appTheme = AppTheme.of(context);

    return Scaffold(
      backgroundColor: appTheme?.theme.scaffoldBackgroundColor,
      body: Text('当前主题: ${appTheme?.isDarkMode ? "深色" : "浅色"}'),
    );
  }
}

```

### 8.3 FocusNode - 焦点管理

```dart
class FocusExample extends StatefulWidget {
  @override
  State<FocusExample> createState() => _FocusExampleState();
}

class _FocusExampleState extends State<FocusExample> {
  final_focusNode1 = FocusNode();
  final _focusNode2 = FocusNode();

  @override
  void initState() {
    super.initState();

    // 监听焦点变化
    _focusNode1.addListener(() {
      if (_focusNode1.hasFocus) {
        print('字段 1 获得焦点');
      } else {
        print('字段 1 失去焦点');
      }
    });
  }

  void _switchFocus() {
    if (_focusNode1.hasFocus) {
      FocusScope.of(context).requestFocus(_focusNode2);
    } else {
      FocusScope.of(context).requestFocus(_focusNode1);
    }
  }

  @override
  void dispose() {
    _focusNode1.dispose();
    _focusNode2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          focusNode: _focusNode1,
          decoration: InputDecoration(labelText: '字段 1'),
        ),
        TextField(
          focusNode:_focusNode2,
          decoration: InputDecoration(labelText: '字段 2'),
        ),
        ElevatedButton(
          onPressed: _switchFocus,
          child: Text('切换焦点'),
        ),
      ],
    );
  }
}

```

### 8.4 ScrollController - 滚动控制

```dart
class ScrollExample extends StatefulWidget {
  @override
  State<ScrollExample> createState() => _ScrollExampleState();
}

class _ScrollExampleState extends State<ScrollExample> {
  final_scrollController = ScrollController();
  bool _showToTopButton = false;

  @override
  void initState() {
    super.initState();

    // 监听滚动位置
    _scrollController.addListener(() {
      if (_scrollController.offset > 300 && !_showToTopButton) {
        setState(() {
          _showToTopButton = true;
        });
      } else if (_scrollController.offset <= 300 && _showToTopButton) {
        setState(() {
          _showToTopButton = false;
        });
      }
    });
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  void _scrollToPosition(double offset) {
    _scrollController.animateTo(
      offset,
      duration: Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ListView.builder(
          controller: _scrollController,
          itemCount: 100,
          itemBuilder: (context, index) {
            return ListTile(title: Text('项目 $index'));
          },
        ),
        if (_showToTopButton)
          Positioned(
            right: 16,
            bottom: 16,
            child: FloatingActionButton(
              onPressed: _scrollToTop,
              child: Icon(Icons.arrow_upward),
            ),
          ),
      ],
    );
  }
}

```

### 8.5 ValueNotifier & ValueListenableBuilder

轻量级的状态管理方案：

```dart
class CounterExample extends StatelessWidget {
  // 创建 ValueNotifier
  final ValueNotifier<int> _counter = ValueNotifier<int>(0);

  void _increment() {
    _counter.value++;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('ValueNotifier 示例')),
      body: Center(
        // 只重建 ValueListenableBuilder 部分
        child: ValueListenableBuilder<int>(
          valueListenable: _counter,
          builder: (context, value, child) {
            return Text(
              '计数: $value',
              style: TextStyle(fontSize: 24),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed:_increment,
        child: Icon(Icons.add),
      ),
    );
  }
}

```

### 8.6 AnimationController - 动画控制

```dart
class AnimationExample extends StatefulWidget {
  @override
  State<AnimationExample> createState() => _AnimationExampleState();
}

class _AnimationExampleState extends State<AnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController_controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    _animation = Tween<double>(begin: 0, end: 300).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );

    // 监听动画状态
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        print('动画完成');
      }
    });
  }

  void _startAnimation() {
    _controller.forward(from: 0);
  }

  void _reverseAnimation() {
    _controller.reverse();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Container(
              width:_animation.value,
              height: _animation.value,
              color: Colors.blue,
            );
          },
        ),
      ),
      floatingActionButton: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed:_startAnimation,
            child: Icon(Icons.play_arrow),
          ),
          SizedBox(width: 16),
          FloatingActionButton(
            onPressed:_reverseAnimation,
            child: Icon(Icons.reverse),
          ),
        ],
      ),
    );
  }
}

```

## 9. 常见问题

### Q1: 为什么界面没有更新？

确保使用了 `setState()` 来触发 UI 重建：

```dart
// ❌ 错误示例
void updateData() {
  _data = newData; // 不会触发 UI 更新
}

// ✅ 正确示例
void updateData() {
  setState(() {
    _data = newData;
  });
}

```

### Q2: 如何处理用户交互？

大多数交互组件都有回调参数：

```dart
ElevatedButton(
  onPressed: () {
    // 处理点击事件
  },
  child: Text('点击我'),
)
```

### Q3: 如何添加资源文件？

1. 在 `pubspec.yaml` 中声明：

``yaml
flutter:
  assets:
    - assets/images/
    - assets/icons/logo.png

```

2. 使用 `Image.asset()` 加载：

```dart
Image.asset('assets/icons/logo.png')
```

## 10. 实战练习

### 练习 1: 个人名片应用

创建一个显示个人信息的页面，包含：

- 头像（圆形）
- 姓名
- 职业
- 联系方式（电话、邮箱）

### 练习 2: 待办事项列表

创建一个简单的 TODO 列表：

- 显示任务列表
- 可以添加新任务
- 可以标记任务完成
- 可以删除任务

### 练习 3: 天气卡片

创建一个天气展示卡片：

- 显示城市名称
- 显示温度和天气状况
- 根据温度改变背景颜色
- 显示未来几天的天气预报

### 练习 4: 生命周期感知应用

创建一个应用，能够：

- 检测应用进入/离开后台
- 在后台时暂停定时器
- 恢复时重新加载数据
- 显示应用状态指示器

## 11. 下一步学习

完成本教程后，建议继续学习：

1. ✅ [Widget 基础](widget-basics.md) - 深入理解 Widget 体系
2. ✅ [布局组件](layout-widgets.md) - 掌握各种布局方式
3. ✅ [状态管理](state-management.md) - 学习状态管理方案
4. ✅ [路由导航](routing-navigation.md) - 页面跳转与传参

## 💡 提示

- 多写代码多实践，理论结合实践
- 善用 [pub.dev](https://pub.dev) 查找第三方包
- 阅读官方文档和示例代码
- 加入 Flutter 社区，参与讨论

祝你学习愉快！🎉
