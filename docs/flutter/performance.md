# Flutter 性能优化 - 调优最佳实践 ⚡

## 1. 性能分析工具

### 1.1 Flutter DevTools

```bash
# 启动 DevTools
flutter pub global activate devtools
devtools

# 或在 VS Code 中使用
# Ctrl+Shift+P -> Flutter: Open DevTools
```

### 1.2 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **Jank (卡顿)** | < 5% | 帧渲染时间 > 16ms |
| **FPS** | 60 FPS | 每秒帧数 |
| **内存** | 合理范围 | 避免内存泄漏 |
| **CPU/GPU** | 均衡 | 避免 GPU 线程过载 |

## 2. 渲染性能优化

### 2.1 减少 Widget 重建

#### ❌ 错误示例：不必要的重建

```dart
class BadExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 每次父组件重建，所有子组件都会重建
        ExpensiveWidget(),
        AnotherExpensiveWidget(),
      ],
    );
  }
}
```

#### ✅ 正确示例：使用 const 和独立状态

```dart
class GoodExample extends StatefulWidget {
  @override
  State<GoodExample> createState() => _GoodExampleState();
}

class _GoodExampleState extends State<GoodExample> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 使用 const 避免重建
        const ExpensiveWidget(),

        // 只重建需要更新的部分
        Text('计数：$_counter'),
        
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: Text('增加'),
        ),
      ],
    );
  }
}
```

### 2.2 使用 const 构造函数

```dart
// ✅ 使用 const
const Text('Hello');
const Icon(Icons.home);
const EdgeInsets.all(16.0);
const Color(0xFF42A5F5);

// ❌ 不使用 const（每次都创建新实例）
Text('Hello');  // 每次 build 都会创建新实例
Icon(Icons.home);
```

### 2.3 列表优化

#### ListView.builder vs ListView

```dart
// ❌ ListView - 一次性创建所有子项
ListView(
  children: List.generate(10000, (index) => ListTile(title: Text('Item $index'))),
)

// ✅ ListView.builder - 按需创建子项
ListView.builder(
  itemCount: 10000,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)
```

#### ListView.separated

```dart
ListView.separated(
  itemCount: 100,
  separatorBuilder: (context, index) => Divider(height: 1),
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)
```

### 2.4 避免在 build 方法中创建对象

```dart
class OptimizedWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // ❌ 错误：每次 build 都创建新对象
    final list = List.generate(100, (i) => i * 2);
    final controller = ScrollController();

    // ✅ 正确：提取到外部或使用 late
    return Container();
  }
}

// ✅ 更好的方式
class BetterWidget extends StatefulWidget {
  @override
  State<BetterWidget> createState() => _BetterWidgetState();
}

class _BetterWidgetState extends State<BetterWidget> {
  late final List<int> _list;
  late final ScrollController _controller;

  @override
  void initState() {
    super.initState();
    _list = List.generate(100, (i) => i * 2);
    _controller = ScrollController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _controller,
      itemCount: _list.length,
      itemBuilder: (context, index) => Text('${_list[index]}'),
    );
  }
}
```

## 3. 内存优化

### 3.1 图片优化

```dart
// ✅ 使用缓存和压缩
Image.network(
  'https://example.com/image.jpg',
  cacheWidth: 300,   // 缓存时压缩宽度
  cacheHeight: 300,  // 缓存时压缩高度
  fit: BoxFit.cover,
)

// ✅ 使用 cached_network_image 包
CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  maxWidthDiskCache: 300,
  maxHeightDiskCache: 300,
)

// ✅ 手动管理图片缓存
void clearImageCache() {
  PaintingBinding.instance.imageCache.clear();
  PaintingBinding.instance.imageCache.clearLiveImages();
}

// 设置缓存大小限制
PaintingBinding.instance.imageCache.maximumSize = 100;
PaintingBinding.instance.imageCache.maximumSizeBytes = 50 << 20; // 50MB
```

### 3.2 及时释放资源

```dart
class ResourceManagingWidget extends StatefulWidget {
  @override
  State<ResourceManagingWidget> createState() => _ResourceManagingWidgetState();
}

class _ResourceManagingWidgetState extends State<ResourceManagingWidget> {
  AnimationController? _animationController;
  StreamSubscription? _subscription;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _initResources();
  }

  void _initResources() {
    _animationController = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    );

    _subscription = someStream.listen((event) {});
    
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {});
  }

  @override
  void dispose() {
    // ✅ 必须释放所有资源
    _animationController?.dispose();
    _subscription?.cancel();
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 3.3 避免内存泄漏

```dart
// ❌ 可能导致内存泄漏
class LeakingWidget extends StatefulWidget {
  @override
  State<LeakingWidget> createState() => _LeakingWidgetState();
}

class _LeakingWidgetState extends State<LeakingWidget> {
  final _dataService = DataService();  // 如果持有 context 引用会导致泄漏

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

// ✅ 安全的方式
class SafeWidget extends StatefulWidget {
  @override
  State<SafeWidget> createState() => _SafeWidgetState();
}

class _SafeWidgetState extends State<SafeWidget> {
  DataService? _dataService;

  @override
  void initState() {
    super.initState();
    _dataService = DataService();
  }

  @override
  void dispose() {
    _dataService?.dispose();
    _dataService = null;
    super.dispose();
  }
}
```

## 4. 异步操作优化

### 4.1 FutureBuilder 优化

```dart
// ✅ 正确使用 FutureBuilder
FutureBuilder<User>(
  future: _fetchUser(),  // 不要在这里创建新的 Future
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    } else if (snapshot.hasError) {
      return Text('错误：${snapshot.error}');
    } else if (snapshot.hasData) {
      return Text('欢迎，${snapshot.data!.name}');
    } else {
      return Text('无数据');
    }
  },
)
```

### 4.2 StreamBuilder 优化

```dart
// ✅ 使用 StreamBuilder 监听数据流
StreamBuilder<List<Message>>(
  stream: _messageService.messages,
  initialData: [],
  builder: (context, snapshot) {
    final messages = snapshot.data ?? [];
    if (messages.isEmpty) {
      return Center(child: Text('暂无消息'));
    }
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) => MessageTile(messages[index]),
    );
  },
)
```

### 4.3 并发处理

```dart
// ✅ 并行执行多个异步任务
Future<void> loadAllData() async {
  final results = await Future.wait([
    fetchUserData(),
    fetchPosts(),
    fetchNotifications(),
  ]);

  final user = results[0] as User;
  final posts = results[1] as List<Post>;
  final notifications = results[2] as List<Notification>;

  print('用户：$user');
  print('帖子数量：${posts.length}');
  print('通知数量：${notifications.length}');
}

// ✅ 带超时的并发执行
Future<void> loadWithTimeout() async {
  try {
    final result = await fetchData()
        .timeout(Duration(seconds: 10));
    print(result);
  } on TimeoutException {
    print('请求超时');
  }
}
```

## 5. 网络优化

### 5.1 请求缓存

```dart
import 'package:dio/dio.dart';
import 'package:dio_cache_interceptor/dio_cache_interceptor.dart';

final dio = Dio(BaseOptions(baseUrl: 'https://api.example.com'));

dio.interceptors.add(DioCacheInterceptor(
  options: CacheOptions(
    store: MemCacheStore(),
    policy: CachePolicy.requestForceCache,
    maxStale: const Duration(days: 7),
    priority: CachePriority.high,
  ),
));
```

### 5.2 数据预加载

```dart
class DataPreloader {
  static final DataPreloader _instance = DataPreloader._internal();
  factory DataPreloader() => _instance;
  DataPreloader._internal();

  final Map<String, dynamic> _cache = {};

  Future<T> preload<T>(String key, Future<T> Function() fetcher) async {
    if (_cache.containsKey(key)) {
      return _cache[key] as T;
    }

    final data = await fetcher();
    _cache[key] = data;
    return data;
  }

  void clearCache() {
    _cache.clear();
  }
}
```

### 5.3 分页加载

```dart
class PaginationController<T> {
  int _page = 1;
  bool _isLoading = false;
  bool _hasMore = true;
  final List<T> _items = [];

  List<T> get items => _items;
  bool get hasMore => _hasMore;
  bool get isLoading => _isLoading;

  Future<void> loadMore(Future<List<T>> Function(int page) fetcher) async {
    if (_isLoading || !_hasMore) return;

    _isLoading = true;

    try {
      final newItems = await fetcher(_page);
      
      if (newItems.isEmpty) {
        _hasMore = false;
      } else {
        _items.addAll(newItems);
        _page++;
      }
    } catch (e) {
      print('加载失败：$e');
    } finally {
      _isLoading = false;
    }
  }

  void reset() {
    _page = 1;
    _hasMore = true;
    _items.clear();
    _isLoading = false;
  }
}
```

## 6. 启动优化

### 6.1 减少首屏时间

```dart
void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ 预初始化服务
  Future.wait([
    SharedPreferences.getInstance(),
    Firebase.initializeApp(),
  ]).then((_) {
    runApp(MyApp());
  });
}
```

### 6.2 延迟加载

```dart
class LazyLoadingPage extends StatefulWidget {
  @override
  State<LazyLoadingPage> createState() => _LazyLoadingPageState();
}

class _LazyLoadingPageState extends State<LazyLoadingPage> {
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadHeavyData();
    });
  }

  Future<void> _loadHeavyData() async {
    await heavyInitialization();
    setState(() => _isLoaded = true);
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoaded) {
      return Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return HeavyContentWidget();
  }
}
```

## 7. 代码级优化

### 7.1 使用 Isolate 处理 CPU 密集型任务

```dart
import 'dart:isolate';

Future<ProcessedData> processInIsolate(RawData data) async {
  final receivePort = ReceivePort();
  
  await Isolate.spawn(
    _isolateEntryPoint,
    {'sendPort': receivePort.sendPort, 'data': data},
  );

  final sendPort = await receivePort.first as SendPort;
  final responsePort = ReceivePort();
  
  sendPort.send({'sendPort': responsePort.sendPort});
  
  return await responsePort.first as ProcessedData;
}

void _isolateEntryPoint(Map<String, dynamic> args) {
  final mainSendPort = args['sendPort'] as SendPort;
  final data = args['data'] as RawData;
  
  final isolateReceivePort = ReceivePort();
  mainSendPort.send(isolateReceivePort.sendPort);

  isolateReceivePort.listen((message) {
    if (message is Map && message.containsKey('sendPort')) {
      final responseSendPort = message['sendPort'] as SendPort;
      final processed = heavyComputation(data);
      responseSendPort.send(processed);
      isolateReceivePort.close();
    }
  });
}
```

### 7.2 使用 compute 函数

```dart
import 'package:flutter/foundation.dart';

Future<List<FilteredItem>> filterLargeList(List<Item> items) async {
  return compute(_filterItems, items);
}

List<FilteredItem> _filterItems(List<Item> items) {
  return items
      .where((item) => item.isActive && item.value > 100)
      .map((item) => FilteredItem.from(item))
      .toList();
}
```

### 7.3 避免不必要的 setState

```dart
// ❌ 错误：频繁调用 setState
class BadCounter extends StatefulWidget {
  @override
  State<BadCounter> createState() => _BadCounterState();
}

class _BadCounterState extends State<BadCounter> {
  int _count = 0;

  void increment() {
    for (int i = 0; i < 100; i++) {
      setState(() => _count++);  // 100次重建！
    }
  }
}

// ✅ 正确：批量更新
class GoodCounter extends StatefulWidget {
  @override
  State<GoodCounter> createState() => _GoodCounterState();
}

class _GoodCounterState extends State<GoodCounter> {
  int _count = 0;

  void increment() {
    setState(() {
      for (int i = 0; i < 100; i++) {
        _count++;  // 只触发一次重建
      }
    });
  }
}
```

## 8. 性能监控

### 8.1 自定义性能追踪

```dart
class PerformanceTracker {
  static final Map<String, Stopwatch> _timers = {};

  static void start(String label) {
    _timers[label] = Stopwatch()..start();
  }

  static void stop(String label) {
    final timer = _timers[label];
    if (timer != null) {
      timer.stop();
      print('$label 耗时：${timer.elapsedMilliseconds}ms');
      _timers.remove(label);
    }
  }
}

// 使用
PerformanceTracker.start('数据加载');
await loadData();
PerformanceTracker.stop('数据加载');
```

### 8.2 性能基准测试

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('列表滚动性能测试', (tester) async {
    await tester.pumpWidget(MyApp());

    final stopwatch = Stopwatch()..start();

    for (int i = 0; i < 100; i++) {
      await tester.fling(find.byType(ListView), Offset(0, -500), 10000);
      await tester.pumpAndSettle();
    }

    stopwatch.stop();

    print('100次滚动耗时：${stopwatch.elapsedMilliseconds}ms');

    expect(stopwatch.elapsedMilliseconds, lessThan(5000));  // 5秒内完成
  });
}
```

## 9. 最佳实践清单

### 9.1 渲染优化
- [ ] 使用 `const` 构造函数
- [ ] 使用 `ListView.builder` 替代 `ListView`
- [ ] 避免在 `build()` 中创建复杂对象
- [ ] 合理使用 `AutomaticKeepAliveClientMixin`
- [ ] 使用 `RepaintBoundary` 隔离重绘区域

### 9.2 内存优化
- [ ] 及时释放 `AnimationController`、`Timer`、`StreamSubscription`
- [ ] 使用图片缓存并设置合理大小
- [ ] 避免循环引用导致内存泄漏
- [ ] 大列表使用虚拟化（懒加载）

### 9.3 异步优化
- [ ] 使用 `FutureBuilder`/`StreamBuilder`
- [ ] 并行执行独立的异步任务
- [ ] 设置合理的超时时间
- [ ] 对耗时操作显示加载状态

### 9.4 代码质量
- [ ] 使用 `Isolate` 或 `compute` 处理 CPU 密集型任务
- [ ] 批量更新状态减少重建次数
- [ ] 定期进行性能分析和测试
- [ ] 关注关键路径的性能指标

## 10. 常见性能问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 页面卡顿 | 主线程阻塞 | 使用 Isolate、compute |
| 内存持续增长 | 内存泄漏 | 检查 dispose、取消订阅 |
| 列表滑动卡顿 | 未使用 builder | 改用 ListView.builder |
| 图片加载慢 | 未缓存/未压缩 | 使用 CachedNetworkImage |
| 首屏启动慢 | 同步初始化太多 | 延迟加载、并行初始化 |
| 动画不流畅 | 重建过于频繁 | 使用 AnimatedBuilder、const |
