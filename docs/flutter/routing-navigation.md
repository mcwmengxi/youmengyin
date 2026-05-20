# Flutter 路由与导航 - 页面跳转和参数传递 🗺️

## 1. Navigator 基础

### 1.1 路由栈概念

Flutter 使用**栈 (Stack)** 来管理路由，遵循 **后进先出 (LIFO)** 原则：

```
┌─────────────┐
│   Page C    │ ← 栈顶（当前页面）
├─────────────┤
│   Page B    │
├─────────────┤
│   Page A    │ ← 栈底（首页）
└─────────────┘
```

### 1.2 基本导航操作

```dart
// 推入新页面（跳转到新页面）
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => PageB()),
);

// 弹出当前页面（返回上一页）
Navigator.pop(context);

// 替换当前页面
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => PageB()),
);

// 弹出到指定页面
Navigator.popUntil(context, ModalRoute.withName('/pageA'));

// 推入并移除所有之前的页面
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => PageB()),
  (route) => false,
);
```

## 2. 命名路由

### 2.1 配置路由表

```dart
MaterialApp(
  // 初始路由
  initialRoute: '/',
  
  // 路由表
  routes: {
    '/': (context) => HomePage(),
    '/detail': (context) => DetailPage(),
    '/profile': (context) => ProfilePage(),
  },
  
  // 未找到路由时的处理
  onGenerateRoute: (settings) {
    switch (settings.name) {
      case '/product':
        final productId = settings.arguments as String;
        return MaterialPageRoute(
          builder: (context) => ProductPage(productId: productId),
        );
      default:
        return MaterialPageRoute(
          builder: (context) => NotFoundPage(),
        );
    }
  },
  
  // 捕获所有路由（优先级最高）
  onUnknownRoute: (settings) {
    return MaterialPageRoute(
      builder: (context) => ErrorPage(),
    );
  },
)
```

### 2.2 使用命名路由导航

```dart
// 跳转到命名路由
Navigator.pushNamed(context, '/detail');

// 带参数跳转
Navigator.pushNamed(
  context,
  '/product',
  arguments: {'id': '123', 'name': '商品名称'},
);

// 替换当前路由
Navigator.pushReplacementNamed(context, '/home');

// 弹出到命名路由
Navigator.popUntil(context, ModalRoute.withName('/home'));
```

### 2.3 接收参数

```dart
class ProductPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 获取参数
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final productId = args?['id'];
    final productName = args?['name'];
    
    return Scaffold(
      appBar: AppBar(title: Text(productId ?? '商品')),
      body: Center(child: Text('商品 ID: $productId')),
    );
  }
}
```

## 3. 类型安全路由

### 3.1 使用路由参数对象

```dart
// 定义参数类
class ProductRouteArgs {
  final String id;
  final String name;
  
  ProductRouteArgs({required this.id, required this.name});
}

// 路由配置
onGenerateRoute: (settings) {
  if (settings.name == '/product') {
    final args = settings.arguments as ProductRouteArgs;
    return MaterialPageRoute(
      builder: (context) => ProductPage(
        productId: args.id,
        productName: args.name,
      ),
    );
  }
},

// 使用
Navigator.pushNamed(
  context,
  '/product',
  arguments: ProductRouteArgs(id: '123', name: '商品'),
);
```

### 3.2 封装路由工具类

```dart
class RouterUtil {
  static void push(BuildContext context, String routeName, {Object? args}) {
    Navigator.pushNamed(context, routeName, arguments: args);
  }

  static void pop(BuildContext context, [Object? result]) {
    Navigator.pop(context, result);
  }

  static void pushAndClear(BuildContext context, String routeName) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      routeName,
      (route) => false,
    );
  }

  static void goBackTo(BuildContext context, String routeName) {
    Navigator.popUntil(context, ModalRoute.withName(routeName));
  }
}

// 使用
RouterUtil.push(context, '/detail');
RouterUtil.pop(context);
```

## 4. 页面传值

### 4.1 向后传递数据

```dart
// 页面 A - 发送请求并等待结果
final result = await Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => PageB()),
);

print('从页面 B 返回的数据：$result');

// 页面 B - 返回数据
Navigator.pop(context, {'selected': '选项 A', 'value': 100});
```

### 4.2 实战案例：选择器页面

```dart
// 页面 A - 主页面
class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _selectedCity = '请选择城市';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('首页')),
      body: ListTile(
        title: Text(_selectedCity),
        trailing: Icon(Icons.chevron_right),
        onTap: () async {
          final city = await Navigator.push<String>(
            context,
            MaterialPageRoute(builder: (context) => CitySelectorPage()),
          );
          
          if (city != null && mounted) {
            setState(() {
              _selectedCity = city;
            });
          }
        },
      ),
    );
  }
}

// 页面 B - 城市选择器
class CitySelectorPage extends StatelessWidget {
  final cities = ['北京', '上海', '广州', '深圳', '杭州'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('选择城市')),
      body: ListView.builder(
        itemCount: cities.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(cities[index]),
            onTap: () {
              Navigator.pop(context, cities[index]);
            },
          );
        },
      ),
    );
  }
}
```

## 5. 路由过渡动画

### 5.1 内置动画

```dart
// 淡入淡出
PageRouteBuilder(
  pageBuilder: (context, animation, secondaryAnimation) => PageB(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    return FadeTransition(
      opacity: animation,
      child: child,
    );
  },
)

// 滑动进入
PageRouteBuilder(
  pageBuilder: (context, animation, secondaryAnimation) => PageB(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    const begin = Offset(1.0, 0.0);
    const end = Offset.zero;
    const curve = Curves.ease;
    
    var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
    
    return SlideTransition(
      position: animation.drive(tween),
      child: child,
    );
  },
)

// 缩放进入
PageRouteBuilder(
  pageBuilder: (context, animation, secondaryAnimation) => PageB(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    return ScaleTransition(
      scale: animation,
      child: child,
    );
  },
)
```

### 5.2 自定义动画

```dart
class CustomPageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;
  
  CustomPageRoute({required this.page})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => page,
          transitionDuration: Duration(milliseconds: 500),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return RotateTransition(
              turns: animation,
              child: child,
            );
          },
        );
}

// 使用
Navigator.push(
  context,
  CustomPageRoute(page: PageB()),
);
```

### 5.3 全局设置动画

```dart
MaterialApp(
  theme: ThemeData(
    pageTransitionsTheme: PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
  ),
)
```

## 6. 路由守卫

### 6.1 登录验证

```dart
class AuthGuard extends RouteGuard {
  @override
  bool canNavigate(RouteSettings settings) {
    // 检查是否登录
    return AuthService().isLoggedIn;
  }

  @override
  Future<void> onNavigationDenied(
    BuildContext context,
    RouteSettings settings,
  ) async {
    // 跳转到登录页
    await Navigator.pushNamed(context, '/login');
    
    // 登录成功后重新导航
    if (AuthService().isLoggedIn) {
      Navigator.pushReplacementNamed(context, settings.name!);
    }
  }
}

// 使用
onGenerateRoute: (settings) {
  if (requiresAuth(settings.name)) {
    if (!AuthService().isLoggedIn) {
      return MaterialPageRoute(
        builder: (context) => LoginPage(returnUrl: settings.name),
      );
    }
  }
  // ...正常路由逻辑
}
```

### 6.2 实际案例

```dart
class LoginPage extends StatelessWidget {
  final String? returnUrl;

  const LoginPage({super.key, this.returnUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('登录')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            // 执行登录
            await login();
            
            if (!context.mounted) return;
            
            // 登录成功，返回原页面
            if (returnUrl != null) {
              Navigator.pushReplacementNamed(context, returnUrl!);
            } else {
              Navigator.pushReplacementNamed(context, '/home');
            }
          },
          child: Text('登录'),
        ),
      ),
    );
  }
}
```

## 7. 底部导航栏 + 路由

### 7.1 实现方案

```dart
class MainScaffold extends StatefulWidget {
  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;
  
  final _pages = [
    HomePage(),
    SearchPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '首页'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: '搜索'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}
```

### 7.2 保持状态

```dart
// 使用 PageStorageKey 保持滚动位置等状态
IndexedStack(
  index: _currentIndex,
  children: [
    HomePage(key: PageStorageKey('home')),
    SearchPage(key: PageStorageKey('search')),
    ProfilePage(key: PageStorageKey('profile')),
  ],
)
```

## 8. Hero 动画

### 8.1 基础用法

```dart
// 页面 A - 起始组件
Hero(
  tag: 'hero-tag',
  child: Image.network('https://example.com/image.jpg'),
  onTap: () {
    Navigator.push(context, MaterialPageRoute(builder: (_) => DetailPage()));
  },
)

// 页面 B - 目标组件
Hero(
  tag: 'hero-tag', // 相同的 tag
  child: Image.network('https://example.com/image.jpg'),
)
```

### 8.2 自定义 Hero 动画

```dart
Hero(
  tag: 'hero-tag',
  flightShuttleBuilder: (
    flightContext,
    animation,
    flightDirection,
    fromHeroContext,
    toHeroContext,
  ) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.blue, width: 2),
      ),
      child: Image.network('https://example.com/image.jpg'),
    );
  },
  child: Image.network('https://example.com/image.jpg'),
)
```

## 9. 路由监听

### 9.1 RouteAware

```dart
class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with RouteAware {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  void didPush() {
    // 当路由被推入时
    print('HomePage 被推入');
  }

  @override
  void didPopNext() {
    // 当覆盖在上面的路由被弹出时
    print('覆盖的路由被弹出');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(...);
  }
}

// 配置 RouteObserver
final RouteObserver<ModalRoute> routeObserver = RouteObserver<ModalRoute>();

MaterialApp(
  navigatorObservers: [routeObserver],
  home: HomePage(),
)
```

## 10. 自动路由库 - Auto Route

### 10.1 安装

```yaml
dependencies:
  auto_route: ^7.0.0

dev_dependencies:
  build_runner: ^2.0.0
  auto_route_generator: ^7.0.0
```

### 10.2 使用

```dart
// 1. 定义路由注解
@MaterialAutoRouter(
  replaceInRouteName: 'Page,Route',
  routes: <AutoRoute>[
    AutoRoute(page: HomePage, initial: true),
    AutoRoute(page: DetailPage),
    AutoRoute(page: ProductPage, path: '/product/:id'),
  ],
)
class $RootRouter {}

// 2. 生成路由
flutter pub run build_runner build

// 3. 使用
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _appRouter.config(),
    );
  }
}

// 导航
context.router.push(DetailRoute());
context.router.push(ProductRoute(id: '123'));
context.router.pop();
```

## 11. 常见问题

### Q1: 如何在弹窗中导航？

```dart
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    actions: [
      TextButton(
        onPressed: () {
          Navigator.pop(context); // 关闭对话框
          Navigator.pushNamed(context, '/detail'); // 跳转
        },
        child: Text('确定'),
      ),
    ],
  ),
);
```

### Q2: 如何防止重复点击跳转？

```dart
class _HomePageState extends State<HomePage> {
  bool _isNavigating = false;

  Future<void> _navigateToDetail() async {
    if (_isNavigating) return;
    
    _isNavigating = true;
    await Navigator.pushNamed(context, '/detail');
    _isNavigating = false;
  }
}
```

### Q3: 如何处理深层链接？

```dart
MaterialApp(
  onDeepLink: (Uri uri) {
    // uri.pathSegments[0] = 'product'
    // uri.pathSegments[1] = '123'
    Navigator.pushNamed(context, '/product/${uri.pathSegments[1]}');
  },
)
```

## 💡 小结

- 掌握 Navigator 的基本操作
- 理解路由栈的工作原理
- 学会使用命名路由和参数传递
- 能够自定义路由动画
- 了解路由守卫和权限控制
- 根据项目需求选择合适的路由方案

下一步：[网络请求](networking.md) → 学习 HTTP 请求和数据交互
