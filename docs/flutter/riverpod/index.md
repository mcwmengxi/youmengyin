# Riverpod 3.0 完全指南 🚀

## 目录

1. [Riverpod 简介](#1-riverpod-简介)
2. [为什么选择 Riverpod 3.0](#2-为什么选择-riverpod-30)
3. [环境配置与安装](#3-环境配置与安装)
4. [核心概念](#4-核心概念)
5. [Provider 类型详解](#5-provider-类型详解)
6. [代码生成（@riverpod）](#6-代码生成riverpod)
7. [Consumer 组件](#7-consumer-组件)
8. [Riverpod 3.0 新特性](#8-riverpod-30-新特性)
9. [高级用法](#9-高级用法)
10. [性能优化](#10-性能优化)
11. [测试](#11-测试)
12. [最佳实践](#12-最佳实践)
13. [从 Riverpod 2.x 迁移](#13-从-riverpod-2x-迁移)
14. [常见问题与解决方案](#14-常见问题与解决方案)
15. [学习资源](#15-学习资源)

---

## 1. Riverpod 简介

### 1.1 什么是 Riverpod？

**Riverpod** 是 Flutter/Dart 的响应式缓存和数据绑定框架，由 Provider 的原作者 Remi Rousselet 开发。它不是 Provider 的简单升级，而是一次彻底的重构。

```dart
// Riverpod 的核心理念：编译期安全 + 真正的依赖注入
final counterProvider = Provider<int>((ref) => 0);
```

### 1.2 Riverpod vs Provider 对比

| 特性 | Provider | Riverpod |
|------|----------|----------|
| 编译期安全 | ❌ 运行时错误 | ✅ 编译期检测 |
| 依赖 BuildContext | ✅ 必需 | ❌ 不需要 |
| 组合状态 | ❌ 需要 ProxyProvider | ✅ 原生支持 |
| 可测试性 | ⚠️ 依赖 Widget 树 | ✅ 纯逻辑测试 |
| 自动销毁 | ❌ 手动管理 | ✅ autoDispose |
| 异步支持 | ⚠️ 基础 | ✅ 完善 |

---

## 2. 为什么选择 Riverpod 3.0

### 2.1 Riverpod 3.0 的重大改进

#### ✨ 统一的 API

- **Notifier 模型**统一了状态管理方式
- **@riverpod 代码生成**成为核心工作流
- 移除了冗余的接口（AutoDispose* 系列合并）

#### 🔄 自动重试机制

- Provider 失败时自动重试
- 支持指数退避策略
- 可自定义重试逻辑

#### 💾 离线持久化（实验性）

- Provider 状态可持久化到本地数据库
- 应用重启后可恢复状态
- 支持 SQLite 等多种存储方案

#### 🎯 Mutations（实验性）

- UI 可响应副作用（表单提交、按钮点击等）
- 显示加载/成功/错误状态
- 解决 ref.read 与 autoDispose 的冲突

#### 🔧 其他重要改进

- **Ref.mounted**: 类似 BuildContext.mounted
- **泛型支持**: 代码生成支持类型参数
- **暂停/恢复**: ref.listen 支持手动暂停/恢复
- **新的测试工具**: ProviderContainer.test() 等

---

## 3. 环境配置与安装

### 3.1 添加依赖

```yaml
# pubspec.yaml
dependencies:
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0

dev_dependencies:
  build_runner: ^2.4.0
  riverpod_generator: ^3.0.0
  custom_lint: ^0.6.0
  riverpod_lint: ^3.0.0
```

### 3.2 运行代码生成

```bash
dart run build_runner watch
```

### 3.3 配置 analysis_options.yaml

```yaml
include: package:riverpod_lint/riverpod_lint.yaml
```

---

## 4. 核心概念

### 4.1 Provider（提供者）

Provider 是 Riverpod 的核心，负责创建和暴露状态。

```dart
// 基础 Provider
final greetingProvider = Provider<String>((ref) => 'Hello Riverpod!');

// 使用
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final greeting = ref.watch(greetingProvider);
    return Text(greeting);
  }
}
```

### 4.2 Ref（引用对象）

`ref` 是 Provider 与外部交互的桥梁：

```dart
final userProvider = FutureProvider<User>((ref) async {
  // 监听其他 Provider
  final token = ref.watch(authTokenProvider);

  // 获取当前状态
  final container = ref.container;

  // 使 Provider 失效（重新执行）
  ref.invalidate(self);

  // 检查是否挂载（Riverpod 3.0 新增）
  if (ref.mounted) {
    // 安全地更新状态
  }

  return fetchUser(token);
});
```

### 4.3 ProviderScope（作用域）

ProviderScope 是 Provider 的容器，通常在应用根部使用：

```dart
void main() {
  runApp(
    ProviderScope(
      // Riverpod 3.0: 可配置全局重试逻辑
      retry: (retryCount, error) {
        if (retryCount > 5) return null;
        return Duration(seconds: retryCount * 2);
      },
      child: MyApp(),
    ),
  );
}
```

### 4.4 Consumer（消费者）

Consumer 是消费 Provider 状态的组件：

```dart
// ConsumerWidget - 无状态的消费者
class Counter extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('Count: $count');
  }
}

// ConsumerStatefulWidget - 有状态的消费者
class Timer extends ConsumerStatefulWidget {
  @override
  ConsumerState<Timer> createState() => _TimerState();
}

class _TimerState extends ConsumerState<Timer> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(Duration(seconds: 1), (_) {
      // 在 State 中使用 ref
      ref.read(timerProvider.notifier).increment();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final seconds = ref.watch(timerProvider);
    return Text('Seconds: $seconds');
  }
}
```

---

## 5. Provider 类型详解

### 5.1 Provider

最基础的 Provider，用于暴露不可变值或计算值。

```dart
// 暴露常量
final configProvider = Provider<Config>((ref) => Config());

// 计算值（自动缓存）
final fullNameProvider = Provider<String>((ref) {
  final user = ref.watch(userProvider);
  return '${user.firstName} ${user.lastName}';
});
```

### 5.2 Notifier & NotifierProvider（推荐 ⭐）

Riverpod 3.0 推荐的状态管理方式，用于管理可变状态。

```dart
// 定义 Notifier
class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
  void decrement() => state--;
  void reset() => state = 0;
}

// 创建 Provider
final counterProvider = NotifierProvider<Counter, int>(Counter.new);

// 使用
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    final notifier = ref.read(counterProvider.notifier);

    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: notifier.increment,
          child: Text('+'),
        ),
        ElevatedButton(
          onPressed: notifier.decrement,
          child: Text('-'),
        ),
      ],
    );
  }
}
```

### 5.3 AsyncNotifier & AsyncNotifierProvider（推荐 ⭐）

用于管理异步状态，如 API 请求、数据库操作等。

```dart
class UserNotifier extends AsyncNotifier<User?> {
  @override
  FutureOr<User?> build() async {
    // 初始加载用户数据
    return fetchCurrentUser();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => fetchCurrentUser());
  }

  Future<void> updateProfile(String name) async {
    state = await AsyncValue.guard(() async {
      final user = await future!;
      return updateUser(user.id, name: name);
    });
  }
}

final userProvider = AsyncNotifierProvider<UserNotifier, User?>(UserNotifier.new);

// UI 中处理异步状态
class UserProfile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProvider);

    return userAsync.when(
      data: (user) => user != null
          ? Text('Hello, ${user.name}!')
          : const Text('Not logged in'),
      loading: () => const CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

### 5.4 FutureProvider

用于一次性异步操作。

```dart
final weatherProvider = FutureProvider<Weather>((ref) async {
  final city = ref.watch(selectedCityProvider);
  return fetchWeather(city);
});

// 使用
class WeatherWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherAsync = ref.watch(weatherProvider);

    return weatherAsync.when(
      data: (weather) => Text('${weather.temperature}°C'),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}
```

### 5.5 StreamProvider

用于监听数据流（如 WebSocket、Firebase 实时数据库）。

```dart
final messagesProvider = StreamProvider<List<Message>>((ref) {
  final chatRoom = ref.watch(currentChatRoomProvider);
  return listenToMessages(chatRoom);
});

class ChatMessages extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messagesAsync = ref.watch(messagesProvider);

    return messagesAsync.when(
      data: (messages) => ListView.builder(
        itemCount: messages.length,
        itemBuilder: (context, index) => Text(messages[index].text),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}
```

### 5.6 StateProvider（Legacy ⚠️）

简单的可变状态，已标记为 legacy，建议使用 Notifier 替代。

```dart
// Legacy 方式（不推荐）
final counterProvider = StateProvider<int>((ref) => 0);

// 推荐方式
final counterProvider = NotifierProvider<Counter, int>(Counter.new);
```

### 5.7 ChangeNotifierProvider（Legacy ⚠️）

基于 ChangeNotifier 的 Provider，已标记为 legacy。

```dart
// Legacy 方式（不推荐）
final settingsProvider = ChangeNotifierProvider<Settings>((ref) => Settings());

// 推荐方式
final settingsProvider = NotifierProvider<SettingsNotifier, Settings>(
  SettingsNotifier.new,
);
```

---

## 6. 代码生成（@riverpod）

### 6.1 为什么使用代码生成？

- ✅ **类型安全**: 编译期检查所有 Provider 引用
- ✅ **减少样板代码**: 自动生成 Provider 定义
- ✅ **更好的 IDE 支持**: 自动补全和导航
- ✅ **lint 规则**: 静态分析捕获常见错误

### 6.2 基本语法

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'counter.g.dart';

// 函数式 Provider
@riverpod
String greeting(GreetingRef ref) => 'Hello!';

// 带 Family 参数的 Provider
@riverpod
User user(UserRef ref, String userId) {
  return fetchUser(userId);
}

// Notifier（同步）
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}

// AsyncNotifier（异步）
@riverpod
class UserRepository extends _$UserRepository {
  @override
  Future<User> build() async {
    return fetchCurrentUser();
  }

  Future<void> updateName(String name) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final user = await future;
      return updateUser(user.id, name: name);
    });
  }
}
```

### 6.3 生成的代码使用

```dart
// 生成的 Provider 变量名规则：
// - 函数式: 原函数名 + Provider
//   greeting -> greetingProvider
// - 类式: 原类名去掉 $ 前缀 + Provider
//   _$Counter -> counterProvider

// 使用生成的 Provider
final greeting = ref.watch(greetingProvider);
final user = ref.watch(userProvider('123'));
final count = ref.watch(counterProvider);
final userAsync = ref.watch(userRepositoryProvider);
```

### 6.4 高级注解选项

```dart
// keepAlive: false 表示 autoDispose（默认 true）
@riverpod
@KeepAlive()
class TemporaryData extends _$TemporaryData {
  @override
  List<Item> build() => [];
}

// 自定义重试逻辑
Duration myRetry(int retryCount, Object error) {
  if (error is NetworkError && retryCount > 3) return null;
  return Duration(seconds: retryCount);
}

@riverpod(retry: myRetry)
class RobustFetcher extends _$RobustFetcher {
  @override
  Future<Data> build() async {
    return fetchData();
  }
}

// 泛型支持（Riverpod 3.0 新增）
@riverpod
T multiply<T extends num>(MultiplyRef ref, T a, T b) {
  return a * b as T;
}

// 使用
final intResult = ref.watch(multiplyProvider<int>(2, 3));
final doubleResult = ref.watch(multiplyProvider<double>(2.5, 3.5));
```

---

## 7. Consumer 组件

### 7.1 ConsumerWidget

最常用的 Consumer 组件，适用于无状态场景。

```dart
class ProductList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);
    final cart = ref.watch(cartProvider);

    return productsAsync.when(
      data: (products) => ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final product = products[index];
          final inCart = cart.contains(product.id);
          return ListTile(
            title: Text(product.name),
            trailing: IconButton(
              icon: Icon(inCart ? Icons.shopping_cart : Icons.add_shopping_cart),
              onPressed: () {
                if (inCart) {
                  ref.read(cartProvider.notifier).remove(product.id);
                } else {
                  ref.read(cartProvider.notifier).add(product.id);
                }
              },
            ),
          );
        },
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }
}
```

### 7.2 ConsumerStatefulWidget

适用于需要生命周期的复杂场景。

```dart
class VideoPlayer extends ConsumerStatefulWidget {
  final String videoUrl;

  const VideoPlayer({super.key, required this.videoUrl});

  @override
  ConsumerState<VideoPlayer> createState() => _VideoPlayerState();
}

class _VideoPlayerState extends ConsumerState<VideoPlayer> {
  VideoPlayerController? _controller;

  @override
  void initState() {
    super.initState();
    _initController();
  }

  void _initController() async {
    _controller = VideoPlayerController.network(widget.videoUrl);
    await _controller!.initialize();
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final isFavorite = ref.watch(favoritesProvider).contains(widget.videoUrl);

    return Column(
      children: [
        _controller != null && _controller!.value.isInitialized
            ? AspectRatio(
                aspectRatio: _controller!.value.aspectRatio,
                child: VideoPlayer(_controller!),
              )
            : const Container(),
        IconButton(
          icon: Icon(isFavorite ? Icons.favorite : Icons.favorite_border),
          onPressed: () {
            ref.read(favoritesProvider.notifier).toggle(widget.videoUrl);
          },
        ),
      ],
    );
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}
```

### 7.3 Consumer

细粒度控制重建范围。

```dart
class ComplexWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 只有这部分会重建
        Consumer(
          builder: (context, ref, child) {
            final count = ref.watch(counterProvider);
            return Text('Count: $count');
          },
        ),
        // 这部分不会重建
        const Text('Static content'),
      ],
    );
  }
}
```

---

## 8. Riverpod 3.0 新特性

### 8.1 自动重试（Automatic Retry）

Provider 失败时自动重试，使用指数退避策略。

```dart
// 全局配置（在 ProviderScope 中）
void main() {
  runApp(
    ProviderScope(
      retry: (retryCount, error) {
        // 不重试特定错误
        if (error is AuthenticationError) return null;

        // 限制重试次数
        if (retryCount > 5) return null;

        // 自定义延迟：200ms, 400ms, 800ms, ... 最大 6.4s
        return Duration(milliseconds: 200 * (1 << retryCount));
      },
      child: MyApp(),
    ),
  );
}

// 单个 Provider 配置
@riverpod
class ResilientFetcher extends _$ResilientFetcher {
  @override
  Future<Data> build() async {
    return fetchData(); // 失败时会自动重试
  }
}

// 或者在非代码生成模式下
final resilientProvider = AsyncNotifierProvider<ResilientFetcher, Data>(
  ResilientFetcher.new,
  retry: (retryCount, error) {
    if (retryCount > 3) return null;
    return Duration(seconds: retryCount);
  },
);
```

### 8.2 Ref.mounted（新增）

类似 BuildContext.mounted，用于异步操作后检查 Provider 是否仍然有效。

```dart
@riverpod
class TodoList extends _$TodoList {
  @override
  List<Todo> build() => [];

  Future<void> addTodo(String title) async {
    // 发送请求到服务器
    final newTodo = await api.addTodo(title);

    // Riverpod 3.0: 检查 Provider 是否仍然挂载
    if (!ref.mounted) return;

    // 安全地更新状态
    state = [...state, newTodo];
  }

  Future<void> deleteTodo(String id) async {
    await api.deleteTodo(id);

    // 如果用户已经离开页面，不更新状态
    if (!ref.mounted) return;

    state = state.where((todo) => todo.id != id).toList();
  }
}
```

### 8.3 Mutations（实验性）

用于处理副作用（表单提交、按钮点击等），UI 可响应其状态。

```dart
// 定义 Mutation
final submitFormMutation = Mutation<void>();

// UI 中使用
class SubmitButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mutation = ref.watch(submitFormMutation);

    return switch (mutation) {
      MutationIdle() => ElevatedButton(
          onPressed: () => _submitForm(ref),
          child: const Text('Submit'),
        ),
      MutationPending() => const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            SizedBox(width: 8),
            Text('Submitting...'),
          ],
        ),
      MutationSuccess() => const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: Colors.green),
            SizedBox(width: 8),
            Text('Submitted!', style: TextStyle(color: Colors.green)),
          ],
        ),
      MutationError(:final error) => ElevatedButton(
          onPressed: () => _submitForm(ref),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
          child: Text('Retry ($error)'),
        ),
    };
  }

  void _submitForm(WidgetRef ref) {
    submitFormMutation.run2(ref, () async {
      await ref.read(formProvider.notifier).submit();
    });
  }
}
```

### 8.4 离线持久化（实验性）

将 Provider 状态持久化到本地数据库。

```dart
// 首先定义 Storage Provider
@riverpod
Future<JsonSqFliteStorage> storage(StorageRef ref) async {
  final dbPath = join(await getDatabasesPath(), 'app.db');
  return JsonSqFliteStorage.open(dbPath);
}

// 使用离线持久化的 Notifier
@riverpod
@JsonPersist() // 需要配合注解
class TodosNotifier extends _$TodosNotifier {
  @override
  Future<List<Todo>> build() async {
    // 启用持久化
    persist(
      ref.watch(storageProvider.future),
      key: 'todos',
      // options: const StorageOptions(cacheTime: StorageCacheTime.days(7)),
    );

    // 先显示缓存数据，然后获取最新数据
    final todos = await fetchTodosFromServer();
    return todos;
  }

  Future<void> add(Todo todo) async {
    // 修改状态会自动持久化到数据库
    state = AsyncData([...await future, todo]);
  }

  Future<void> toggleComplete(String id) async {
    final currentTodos = await future;
    state = AsyncData(
      currentTodos.map((todo) {
        if (todo.id == id) {
          return todo.copyWith(completed: !todo.completed);
        }
        return todo;
      }).toList(),
    );
  }
}
```

### 8.5 暂停/恢复支持

手动暂停和恢复 Provider 监听。

```dart
class ComplexDashboard extends ConsumerStatefulWidget {
  @override
  ConsumerState<ComplexDashboard> createState() => _ComplexDashboardState();
}

class _ComplexDashboardState extends ConsumerState<ComplexDashboard> {
  ProviderSubscription<AsyncValue<List<Message>>>? _subscription;

  @override
  void initState() {
    super.initState();
    // 开始监听
    _subscription = ref.listen(messagesProvider, (prev, next) {
      // 处理新消息
      showNotification('New message received');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            icon: Icon(Icons.notifications_pause),
            onPressed: () {
              // 暂停通知
              _subscription?.pause();
            },
          ),
          IconButton(
            icon: Icon(Icons.notifications_active),
            onPressed: () {
              // 恢复通知
              _subscription?.resume();
            },
          ),
        ],
      ),
      body: MessagesList(),
    );
  }

  @override
  void dispose() {
    _subscription?.close();
    super.dispose();
  }
}
```

### 8.6 泛型支持（代码生成）

生成的 Provider 可以定义类型参数。

```dart
@riverpod
T identity<T>(IdentityRef ref, T value) {
  return value;
}

// 使用
final intValue = ref.watch(identityProvider<int>(42));
final stringValue = ref.watch(identityProvider<String>('hello'));

// 更复杂的例子
@riverpod
List<T> filterItems<T extends Filterable>(
  FilterItemsRef ref,
  List<T> items,
  String query,
) {
  if (query.isEmpty) return items;
  return items.where((item) => item.matches(query)).toList();
}

// 使用
final filteredProducts = ref.watch(
  filterItemsProvider<Product>(products, searchQuery),
);
```

---

## 9. 高级用法

### 9.1 Provider 组合

一个 Provider 可以依赖其他 Provider。

```dart
// 基础 Provider
final configProvider = Provider<AppConfig>((ref) => AppConfig());
final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

// 组合 Provider
final authenticatedApiClientProvider = Provider<ApiClient>((ref) {
  final config = ref.watch(configProvider);
  final auth = ref.watch(authProvider);
  return AuthenticatedApiClient(
    baseUrl: config.apiBaseUrl,
    token: auth.token,
  );
});

// 使用组合的 Provider
final userProfileProvider = FutureProvider<UserProfile>((ref) async {
  final client = ref.watch(authenticatedApiClientProvider);
  return client.getProfile();
});
```

### 9.2 Family（参数化 Provider）

向 Provider 传递外部参数创建不同的实例。

```dart
// 函数式 Family Provider
final userProvider = FutureProvider.family<User, String>((ref, userId) async {
  return fetchUser(userId);
});

// 使用
class UserPage extends ConsumerWidget {
  final String userId;

  const UserPage({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProvider(userId));

    return userAsync.when(
      data: (user) => Text('Welcome, ${user.name}!'),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => Text('Error: $err'),
    );
  }
}

// Notifier Family（代码生成）
@riverpod
class ProductDetail extends _$ProductDetail {
  @override
  Future<Product> build(String productId) async {
    return fetchProduct(productId);
  }

  Future<void> addToCart() async {
    final product = await future;
    ref.read(cartProvider.notifier).add(product);
  }
}

// 使用
final productDetail = ref.watch(productDetailProvider('prod_123'));
```

### 9.3 AutoDispose（自动销毁）

当没有监听者时自动销毁 Provider。

```dart
// 代码生成方式
@riverpod
// 默认 keepAlive: true，设置为 false 启用 autoDispose
@KeepAlive() // 显式声明保持存活
class SearchResults extends _$SearchResults {
  @override
  Future<List<Result>> build(String query) async {
    if (query.isEmpty) return [];
    return searchApi(query);
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => searchApi(ref.self.arg));
  }
}

// 非代码生成方式
final searchResultsProvider =
    AutoDisposeFutureProvider.family<List<Result>, String>((ref, query) async {
  if (query.isEmpty) return [];
  return searchApi(query);
});
```

### 9.4 Select（选择性监听）

只监听状态的一部分，减少不必要的重建。

```dart
class UserProfile extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      // 只监听 name 字段
      UserName(),
      // 只监听 age 字段
      UserAge(),
      // 只监听 email 字段
      UserEmail(),
    );
  }
}

class UserName extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 只订阅 name，name 不变时不重建
    final name = ref.watch(userProvider.select((user) => user.name));
    print('UserName rebuilding');
    return Text('Name: $name', style: Theme.of(context).textTheme.headline6);
  }
}

class UserAge extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 只订阅 age，age 不变时不重建
    final age = ref.watch(userProvider.select((user) => user.age));
    print('UserAge rebuilding');
    return Text('Age: $age');
  }
}
```

### 9.5 Provider 覆盖（Testing/Mocking）

覆盖 Provider 用于测试或开发环境切换。

```dart
// 在测试中
test('shows loading then data', () async {
  final container = ProviderContainer(
    overrides: [
      userRepositoryProvider.overrideWith(() => MockUserRepository()),
    ],
  );

  // 或者使用 Riverpod 3.0 的新方法
  final container = ProviderContainer.test(
    overrides: [
      // 只覆盖 build 方法
      userRepositoryProvider.overrideWithBuild(() async {
        return User(id: '1', name: 'Test User', email: 'test@test.com');
      }),
    ],
  );

  addTearDown(container.dispose);

  final userAsync = container.read(userRepositoryProvider);
  expect(userAsync.value, isA<User>());
});

// 在 Widget 测试中
testWidgets('displays user profile', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        userRepositoryProvider.overrideWithBuild(() async {
          return User(id: '1', name: 'Test User');
        }),
      ],
      child: MaterialApp(home: ProfilePage()),
    ),
  );

  // Riverpod 3.0: 直接获取 container
  final container = tester.container();

  expect(find.text('Test User'), findsOneWidget);
});

// 开发环境覆盖
void main() {
  final isDev = bool.fromEnvironment('dart.vm.product', defaultValue: false);

  runApp(
    ProviderScope(
      overrides: [
        if (isDev)
          apiBaseUrlProvider.overrideWithValue('https://dev.api.example.com'),
      ],
      child: MyApp(),
    ),
  );
}
```

### 9.6 ProviderScoping（作用域限定）

在不同层级覆盖 Provider。

```dart
class AdminApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isAdmin = ref.watch(isAdminProvider);

    return isAdmin
        ? ProviderScope(
            // 只在这个子树中覆盖
            overrides: [
              permissionsProvider.overrideWithValue(AdminPermissions()),
            ],
            child: AdminDashboard(),
          )
        : const AccessDeniedPage();
  }
}

// UncontrolledProviderScope（Riverpod 3.0 新增）
class FeatureFlagWrapper extends ConsumerWidget {
  final Widget child;
  final bool enableNewFeature;

  const FeatureFlagWrapper({
    super.key,
    required this.child,
    required this.enableNewFeature,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return UncontrolledProviderScope(
      container: ProviderContainer(
        parent: ProviderScope.containerOf(context),
        overrides: [
          featureFlagProvider.overrideWithValue(enableNewFeature),
        ],
      ),
      child: child,
    );
  }
}
```

---

## 10. 性能优化

### 10.1 减少 Widget 重建

```dart
// ❌ 错误：整个列表都会重建
class ProductListBad extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productsProvider); // 任何产品变化都触发重建
    return ListView.builder(
      itemCount: products.length,
      itemBuilder: (context, index) => ProductTile(product: products[index]),
    );
  }
}

// ✅ 正确：使用 select 精确监听
class ProductListGood extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productIds = ref.watch(productsProvider.select(
      (products) => products.map((p) => p.id).toList(),
    )); // 只监听 ID 列表变化

    return ListView.builder(
      itemCount: productIds.length,
      itemBuilder: (context, index) =>
          ProductItem(productId: productIds[index]),
    );
  }
}

class ProductItem extends ConsumerWidget {
  final String productId;

  const ProductItem({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 每个产品独立监听
    final product = ref.watch(
      productsProvider.select((products) => products.firstWhere(
            (p) => p.id == productId,
          )),
    );
    return ProductTile(product: product);
  }
}
```

### 10.2 合理使用 ref.read vs ref.watch

```dart
class ActionButtons extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ✅ 使用 ref.watch 显示状态
    final isConnected = ref.watch(connectionStatusProvider);

    return Row(
      children: [
        // ✅ 使用 ref.read 触发事件（不需要监听）
        ElevatedButton(
          onPressed: () => ref.read(notifierProvider.notifier).doSomething(),
          child: Text('Action'),
        ),

        // ✅ 根据条件禁用按钮
        ElevatedButton(
          onPressed: isConnected
              ? () => ref.read(apiProvider.notifier).fetchData()
              : null,
          child: Text('Fetch Data'),
        ),
      ],
    );
  }
}
```

### 10.3 防抖和取消网络请求

```dart
@riverpod
class SearchSuggestions extends _$SearchSuggestions {
  Timer? _debounce;

  @override
  Future<List<Suggestion>> build(String query) async {
    if (query.isEmpty) return [];

    // 防抖：等待用户停止输入
    await Future.delayed(const Duration(milliseconds: 300));

    // 检查查询是否已更改（取消过期请求）
    if (ref.self.arg != query) throw CancelledException();

    return searchApi(query);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }
}

// 使用
class SearchBar extends ConsumerStatefulWidget {
  @override
  ConsumerState<SearchBar> createState() => _SearchBarState();
}

class _SearchBarState extends ConsumerState<SearchBar> {
  final _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onQueryChanged);
  }

  void _onQueryChanged() {
    final query = _controller.text;
    // 取消之前的请求并开始新的搜索
    ref.invalidate(searchSuggestionsProvider(query));
  }

  @override
  Widget build(BuildContext context) {
    final suggestionsAsync = ref.watch(searchSuggestionsProvider(_controller.text));

    return Column(
      children: [
        TextField(controller: _controller),
        suggestionsAsync.when(
          data: (suggestions) => SuggestionsList(suggestions: suggestions),
          loading: () => const SizedBox.shrink(),
          error: (_, __) => const SizedBox.shrink(),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

### 10.4 下拉刷新实现

```dart
class RefreshableProductList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);

    return RefreshIndicator(
      onRefresh: () async {
        // 使用 invalidate 或 refresh
        await ref.refresh(productsProvider.future);
        // 或
        // ref.invalidate(productsProvider);
        // await ref.read(productsProvider.future);
      },
      child: productsAsync.when(
        data: (products) => ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) => ProductTile(product: products[index]),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: ErrorWidget(
            error: error,
            onRetry: () => ref.invalidate(productsProvider),
          ),
        ),
      ),
    );
  }
}
```

---

## 11. 测试

### 11.1 Provider 单元测试

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  group('CounterProvider', () {
    test('initial value is 0', () {
      // Riverpod 3.0: 使用 ProviderContainer.test 自动清理
      final container = ProviderContainer.test();

      expect(container.read(counterProvider), 0);
    });

    test('increment works', () async {
      final container = ProviderContainer.test();

      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 1);

      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 2);
    });

    test('decrement works', () {
      final container = ProviderContainer.test();

      container.read(counterProvider.notifier).decrement();
      expect(container.read(counterProvider), -1);
    });

    test('reset works', () {
      final container = ProviderContainer.test();

      container.read(counterProvider.notifier).increment();
      container.read(counterProvider.notifier).increment();
      container.read(counterProvider.notifier).reset();
      expect(container.read(counterProvider), 0);
    });
  });

  group('UserRepository', () {
    test('fetches user successfully', () async {
      final container = ProviderContainer.test(
        overrides: [
          // Riverpod 3.0: 只覆盖 build 方法
          userRepositoryProvider.overrideWithBuild(() async {
            return User(id: '1', name: 'Test User', email: 'test@test.com');
          }),
        ],
      );

      final userAsync = container.read(userRepositoryProvider);

      expect(userAsync.value, isA<User>());
      expect(userAsync.value!.name, 'Test User');
    });

    test('handles errors', () async {
      final container = ProviderContainer.test(
        overrides: [
          userRepositoryProvider.overrideWithBuild(() async {
            throw Exception('Network error');
          }),
        ],
      );

      final userAsync = container.read(userRepositoryProvider);

      expect(userAsync.hasError, true);
      expect(userAsync.error, isA<Exception>());
    });
  });
}
```

### 11.2 Widget 测试

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  group('CounterWidget', () {
    testWidgets('displays initial count', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(home: CounterWidget()),
        ),
      );

      expect(find.text('Count: 0'), findsOneWidget);
    });

    testWidgets('increments when button pressed', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(home: CounterWidget()),
        ),
      );

      // 点击增加按钮
      await tester.tap(find.byType(ElevatedButton).first);
      await tester.pumpAndSettle();

      expect(find.text('Count: 1'), findsOneWidget);

      // 再次点击
      await tester.tap(find.byType(ElevatedButton).first);
      await tester.pumpAndSettle();

      expect(find.text('Count: 2'), findsOneWidget);
    });

    testWidgets('works with overridden provider', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            counterProvider.overrideWith((ref) => 42),
          ],
          child: MaterialApp(home: CounterWidget()),
        ),
      );

      expect(find.text('Count: 42'), findsOneWidget);
    });

    // Riverpod 3.0: 使用 tester.container()
    testWidgets('can access container in tests', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(home: CounterWidget()),
        ),
      );

      // 获取 container
      final container = tester.container();

      // 直接操作 provider
      container.read(counterProvider.notifier).increment();
      await tester.pump();

      expect(find.text('Count: 1'), findsOneWidget);
    });
  });
}
```

### 11.3 测试异步 Provider

```dart
group('Async Providers', () {
  testWidgets('shows loading indicator', (tester) async {
    final completer = Completer<User>();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          userProvider.overrideWith((ref) => completer.future),
        ],
        child: MaterialApp(home: UserProfile()),
      ),
    );

    // 应该显示加载指示器
    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    // 完成异步操作
    completer.complete(User(id: '1', name: 'John'));
    await tester.pumpAndSettle();

    // 应该显示用户信息
    expect(find.text('John'), findsOneWidget);
  });

  testWidgets('handles errors gracefully', (tester) async {
    final completer = Completer<User>();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          userProvider.overrideWith((ref) => completer.future),
        ],
        child: MaterialApp(home: UserProfile()),
      ),
    );

    // 触发错误
    completer.completeError(Exception('Failed to load'));
    await tester.pumpAndSettle();

    // 应该显示错误信息
    expect(find.textContaining('Error'), findsOneWidget);
  });
});
```

---

## 12. 最佳实践

### 12.1 项目结构建议

```
lib/
├── main.dart                    # 入口文件，包含 ProviderScope
├── providers/
│   ├── auth_provider.dart       # 认证相关 Provider
│   ├── providers.dart           # 导出所有 Provider
│   └── ...
├── models/
│   ├── user.dart
│   └── ...
├── repositories/
│   ├── auth_repository.dart
│   └── ...
├── screens/
│   ├── home/
│   │   └── home_screen.dart
│   └── ...
└── widgets/
    └── ...
```

### 12.2 Provider 组织原则

```dart
// providers/auth_provider.dart
part 'auth_provider.g.dart';

// Repository Provider（数据层）
@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  return AuthRepositoryImpl(
    apiClient: ref.watch(apiClientProvider),
    localStorage: ref.watch(localStorageProvider),
  );
}

// State Provider（业务层）
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() {
    // 监听其他 Provider
    ref.listenSelf((previous, next) {
      // 状态变化时的副作用
      if (previous?.isAuthenticated == true && !next.isAuthenticated) {
        // 用户登出
        ref.read(routerProvider).go('/login');
      }
    });

    return const AuthState.initial();
  }

  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    state = await AsyncValue.guard(() async {
      final user = await ref.watch(authRepositoryProvider).login(email, password);
      return AuthState.authenticated(user);
    });
  }

  Future<void> logout() async {
    await ref.watch(authRepositoryProvider).logout();
    state = const AuthState.unauthenticated();
  }
}

// 导出所有认证相关 Provider
export 'auth_provider.dart';
```

### 12.3 状态设计原则

```dart
// ✅ 好的做法：不可变状态
@freezed
class Todo with _$Todo {
  const factory Todo({
    required String id,
    required String title,
    required bool completed,
    DateTime? createdAt,
  }) = _Todo;

  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}

// ✅ 好的做法：使用 sealed class 表示状态
sealed class AuthState {
  const AuthState();
}

class Initial extends AuthState {
  const Initial();
}

class Loading extends AuthState {
  const Loading();
}

class Authenticated extends AuthState {
  final User user;
  const Authenticated(this.user);
}

class Unauthenticated extends AuthState {
  const Unauthenticated();
}

class Error extends AuthState {
  final String message;
  const Error(this.message);
}
```

### 12.4 错误处理模式

```dart
@riverpod
class DataManager extends _$DataManager {
  @override
  Future<Data> build() async {
    return fetchData();
  }

  Future<void> refresh() async {
    state = const AsyncLoading<Data>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => fetchData());
  }

  Future<void> update(Item item) async {
    state = await AsyncValue.guard(() async {
      final currentData = state.valueOrNull ?? await future;
      return updateData(currentData, item);
    });
  }
}

// UI 中统一处理错误
class DataView extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dataAsync = ref.watch(dataManagerProvider);

    return dataAsync.when(
      skipLoadingOnRefresh: false, // 刷新时也显示加载指示器
      data: (data) => DataContent(data: data),
      loading: () => const LoadingSpinner(),
      error: (error, stackTrace) => ErrorMessage(
        error: error,
        onRetry: () => ref.read(dataManagerProvider.notifier).refresh(),
      ),
    );
  }
}
```

### 12.5 内存泄漏预防

```dart
// ✅ 正确：在异步操作后检查 mounted
@riverpod
class SafeNotifier extends _$SafeNotifier {
  @override
  Future<Data> build() async {
    return initialData;
  }

  Future<void> longRunningOperation() async {
    // 执行耗时操作
    final result = await performLongTask();

    // Riverpod 3.0: 检查是否仍然挂载
    if (!ref.mounted) return;

    // 安全更新状态
    state = AsyncData(result);
  }

  // 使用 ref.onDispose 清理资源
  @override
  Future<Data> build() async {
    // 注册清理回调
    ref.onDispose(() {
      // 清理资源
      controller?.close();
      timer?.cancel();
    });

    controller = stream.listen((event) {
      if (!ref.mounted) return;
      // 处理事件
    });

    return initialData;
  }
}
```

---

## 13. 从 Riverpod 2.x 迁移

### 13.1 主要破坏性变更

| 变更 | 2.x | 3.0 |
|------|-----|-----|
| StateProvider | `package:riverpod/riverpod.dart` | `package:riverpod/legacy.dart` |
| StateNotifierProvider | `package:riverpod/riverpod.dart` | `package:riverpod/legacy.dart` |
| ChangeNotifierProvider | `package:riverpod/riverpod.dart` | `package:riverpod/legacy.dart` |
| AutoDisposeNotifier | 单独的类 | 合并到 Notifier |
| AutoDisposeAsyncNotifier | 单独的类 | 合并到 AsyncNotifier |

### 13.2 迁移步骤

#### 步骤 1: 更新依赖版本

```yaml
dependencies:
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0

dev_dependencies:
  riverpod_generator: ^3.0.0
  riverpod_lint: ^3.0.0
```

#### 步骤 2: 替换 import 语句

```dart
// 2.x
import 'package:riverpod/riverpod.dart';

// 3.0（如果使用了 legacy provider）
import 'package:riverpod/legacy.dart';
```

#### 步骤 3: 迁移到 Notifier 模式

```dart
// 2.x: StateNotifier + StateNotifierProvider
class Counter extends StateNotifier<int> {
  Counter() : super(0);

  void increment() => state++;
}

final counterProvider = StateNotifierProvider<Counter, int>((ref) => Counter());

// 3.x: Notifier + NotifierProvider
class Counter extends Notifier<int> {
  @override
  int build() => 0;

  void increment() => state++;
}

final counterProvider = NotifierProvider<Counter, int>(Counter.new);

// 或使用代码生成
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}
```

#### 步骤 4: 更新 AutoDispose Provider

```dart
// 2.x: 单独的 AutoDispose* 类
class Search extends AutoDisposeNotifier<List<Result>> {
  @override
  List<Result> build() => [];
}

// 3.x: 统一使用 @KeepAlive() 注解
@riverpod
@KeepAlive() // 显式保持存活（默认行为）
class Search extends _$Search {
  @override
  List<Result> build() => [];
}

// 或者使用 autoDispose
final searchProvider = AutoDisposeNotifierProvider<Search, List<Result>>(
  Search.new,
);
```

#### 步骤 5: 处理生命周期变更

```dart
// 2.x: Notifier 在 rebuild 时可能被重新创建
// 3.x: Notifier 跨 rebuild 保持不变（ reverted from dev.16）

@riverpod
class MyNotifier extends _$MyNotifier {
  int _internalCounter = 0; // 这个变量会在 rebuild 后保留

  @override
  int build() {
    ref.onDispose(() {
      // 仅在 Provider 被销毁时调用
      print('Disposed');
    });
    return 0;
  }

  void someMethod() {
    _internalCounter++; // 安全
    state = _internalCounter;
  }
}
```

### 13.3 迁移检查清单

- [ ] 更新 pubspec.yaml 中的所有 Riverpod 相关包
- [ ] 运行 `flutter pub get`
- [ ] 将 `StateProvider` 迁移到 `Notifier`
- [ ] 将 `StateNotifierProvider` 迁移到 `NotifierProvider`
- [ ] 将 `ChangeNotifierProvider` 迁移到 `Notifier`
- [ ] 更新 `AutoDispose*` Provider 到统一的 API
- [ ] 添加 `ref.mounted` 检查到异步操作
- [ ] 测试所有 Provider 的功能
- [ ] 检查是否有意外的 Provider 重建
- [ ] 验证错误处理流程正常工作

---

## 14. 常见问题与解决方案

### Q1: ProviderNotFoundException

**问题**: 运行时报错 `ProviderNotFoundException`

**原因**: 忘记将 widget 包裹在 `ProviderScope` 中

**解决**:

```dart
void main() {
  runApp(
    ProviderScope( // ✅ 必须添加
      child: MyApp(),
    ),
  );
}
```

### Q2: 过度重建导致性能问题

**问题**: 更新一个字段导致整个 widget 重建

**解决**:

```dart
// 使用 select 精确监听
final name = ref.watch(userProvider.select((user) => user.name));

// 或拆分成更小的 widget
class UserName extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final name = ref.watch(userProvider.select((u) => u.name));
    return Text(name);
  }
}
```

### Q3: 异步操作后 setState called after dispose()

**问题**: 异步操作完成后调用 `setState` 但 widget 已销毁

**解决**:

```dart
// Riverpod 3.0: 使用 ref.mounted
Future<void> fetchData() async {
  final result = await api.getData();

  if (!ref.mounted) return; // ✅ 检查是否挂载

  state = AsyncData(result);
}
```

### Q4: 如何在非 Widget 代码中使用 Provider？

**解决**:

```dart
// 方法 1: 通过参数传递
void someFunction(Ref ref) {
  final value = ref.watch(someProvider);
}

// 方法 2: 在 Repository/Service 中使用
@riverpod
MyService myService(MyServiceRef ref) {
  return MyServiceImpl(
    config: ref.watch(configProvider),
  );
}

// 方法 3: 使用 ProviderContainer（测试或初始化代码）
void main() async {
  final container = ProviderContainer();
  final value = container.read(someProvider);
  container.dispose();
}
```

### Q5: 如何处理复杂的表单状态？

**解决**:

```dart
@riverpod
class FormNotifier extends _$FormNotifier {
  @override
  FormState build() => FormState.initial();

  void updateField(String field, dynamic value) {
    state = state.copyWith(fields: {...state.fields, ...{field: value}});
    _validate();
  }

  Future<void> submit() async {
    if (!state.isValid) return;

    state = state.copyWith(isSubmitting: true);
    state = await AsyncValue.guard(() async {
      await api.submit(state.fields);
      return state.copyWith(isSubmitting: false, isSubmitted: true);
    });
  }

  void _validate() {
    final errors = Validator.validate(state.fields);
    state = state.copyWith(errors: errors, isValid: errors.isEmpty);
  }
}
```

### Q6: 如何实现全局状态（如主题、语言）？

**解决**:

```dart
@riverpod
class ThemeNotifier extends _$ThemeNotifier {
  @override
  ThemeData build() {
    // 从本地存储读取初始值
    final isDark = ref.watch(localStorageProvider).getBool('isDark') ?? false;
    return isDark ? ThemeData.dark() : ThemeData.light();
  }

  void toggleTheme() {
    final isDark = state.brightness == Brightness.dark;
    state = isDark ? ThemeData.light() : ThemeData.dark();

    // 持久化
    ref.read(localStorageProvider).setBool('isDark', !isDark);
  }
}

// 在 Material App 中使用
class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);

    return MaterialApp(
      theme: theme,
      home: HomePage(),
    );
  }
}
```

---

## 15. 学习资源

### 官方资源

- 📚 **官方文档**: <https://riverpod.dev/docs/introduction/getting_started>
- 🆕 **What's New in 3.0**: <https://riverpod.dev/docs/whats_new>
- 🔄 **迁移指南**: <https://riverpod.dev/docs/3.0_migration>
- 💡 **FAQ**: <https://riverpod.dev/docs/root/faq>
- ✅ **DO/DON'T**: <https://riverpod.dev/docs/root/do_dont>

### 教程

- 🎯 **Your First Riverpod App**: <https://riverpod.dev/docs/tutorials/first_app>
- 🧪 **Testing Guide**: <https://riverpod.dev/docs/how_to/testing>
- ⚡ **Performance Optimization**: <https://riverpod.dev/docs/how_to/select>

### 社区资源

- 📦 **Pub 包**: <https://pub.dev/packages/flutter_riverpod>
- 💬 **GitHub Discussions**: <https://github.com/rrousselGit/riverpod/discussions>
- 🐛 **Issue Tracker**: <https://github.com/rrousselGit/riverpod/issues>
- 🎬 **YouTube 教程**: 搜索 "Riverpod 3.0 tutorial"

### 推荐学习路径

```
1. 基础阶段（1-2天）
   ├─ 阅读 Getting Started
   ├─ 完成 First App 教程
   └─ 理解 Provider/Ref/Consumer 概念

2. 进阶阶段（3-5天）
   ├─ 学习 Notifier/AsyncNotifier
   ├─ 掌握代码生成 (@riverpod)
   ├─ 练习 Provider 组合和 Family
   └─ 了解 AutoDispose 和生命周期

3. 高级阶段（5-7天）
   ├─ 学习 Riverpod 3.0 新特性
   ├─ 掌握性能优化技巧
   ├─ 练习测试 Provider 和 Widget
   └─ 实现完整项目（如 TODO App）

4. 专家阶段（持续）
   ├─ 研究源码实现原理
   ├─ 探索实验性特性（Mutations/Offline）
   ├─ 贡献开源社区
   └─ 分享最佳实践
```

---

## 16. 实战案例：完整 TODO 应用

### 16.1 项目结构

```
lib/
├── main.dart
├── models/
│   └── todo.dart
├── providers/
│   ├── todo_provider.dart
│   ├── filter_provider.dart
│   └── providers.dart
├── screens/
│   ├── home_screen.dart
│   └── detail_screen.dart
└── widgets/
    ├── todo_item_widget.dart
    ├── todo_list_widget.dart
    └── filter_chips_widget.dart
```

### 16.2 数据模型

```dart
// models/todo.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'todo.freezed.dart';
part 'todo.g.dart';

@freezed
class Todo with _$Todo {
  const factory Todo({
    required String id,
    required String title,
    required String description,
    @Default(false) bool completed,
    @Default(Priority.medium) Priority priority,
    DateTime? createdAt,
    DateTime? completedAt,
  }) = _Todo;

  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}

enum Priority { low, medium, high }

enum Filter { all, active, completed }

extension FilterX on Filter {
  bool apply(Todo todo) {
    return switch (this) {
      Filter.all => true,
      Filter.active => !todo.completed,
      Filter.completed => todo.completed,
    };
  }
}
```

### 16.3 Provider 层实现

```dart
// providers/todo_provider.dart
part 'todo_provider.g.dart';

@riverpod
class TodoList extends _$TodoList {
  @override
  List<Todo> build() {
    // 初始化时从本地存储加载
    ref.onDispose(() {
      print('TodoList disposed');
    });

    return _loadFromLocalStorage();
  }

  List<Todo> _loadFromLocalStorage() {
    // 模拟从本地存储加载
    return [];
  }

  void add(Todo todo) {
    if (!ref.mounted) return;
    state = [...state, todo];
    _saveToLocalStorage();
  }

  void remove(String id) {
    state = state.where((todo) => todo.id != id).toList();
    _saveToLocalStorage();
  }

  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          todo.copyWith(
            completed: !todo.completed,
            completedAt: todo.completed ? null : DateTime.now(),
          )
        else
          todo,
    ];
    _saveToLocalStorage();
  }

  void updatePriority(String id, Priority priority) {
    state = [
      for (final todo in state)
        if (todo.id == id) todo.copyWith(priority: priority) else todo,
    ];
    _saveToLocalStorage();
  }

  void reorder(int oldIndex, int newIndex) {
    if (newIndex > oldIndex) newIndex -= 1;
    final item = state.removeAt(oldIndex);
    state = [...state..insert(newIndex, item)];
    _saveToLocalStorage();
  }

  void clearCompleted() {
    state = state.where((todo) => !todo.completed).toList();
    _saveToLocalStorage();
  }

  void toggleAll() {
    final allCompleted = state.every((todo) => todo.completed);
    state = [
      for (final todo in state)
        todo.copyWith(
          completed: !allCompleted,
          completedAt: !allCompleted ? DateTime.now() : null,
        ),
    ];
    _saveToLocalStorage();
  }

  void _saveToLocalStorage() {
    // 实际项目中保存到 SharedPreferences 或 SQLite
    print('Saving ${state.length} todos');
  }
}
```

### 16.4 过滤 Provider

```dart
// providers/filter_provider.dart
@riverpod
class FilterNotifier extends _$FilterNotifier {
  @override
  Filter build() => Filter.all;

  void setFilter(Filter filter) => state = filter;
}

// 组合 Provider：过滤后的 Todo 列表
@riverpod
List<Todo> filteredTodos(FilteredTodosRef ref) {
  final todos = ref.watch(todoListProvider);
  final filter = ref.watch(filterNotifierProvider);

  return todos.where(filter.apply).toList();
}

// 统计信息 Provider
@riverpod
TodoStats todoStats(TodoStatsRef ref) {
  final todos = ref.watch(todoListProvider);

  return TodoStats(
    total: todos.length,
    active: todos.where((t) => !t.completed).length,
    completed: todos.where((t) => t.completed).length,
  );
}

@freezed
class TodoStats with _$TodoStats {
  const factory TodoStats({
    required int total,
    required int active,
    required int completed,
  }) = _TodoStats;
}
```

### 16.5 UI 实现 - 主页面

```dart
// screens/home_screen.dart
class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filteredTodos = ref.watch(filteredTodosProvider);
    final stats = ref.watch(todoStatsProvider);
    final filter = ref.watch(filterNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Riverpod TODO'),
        actions: [
          if (stats.completed > 0)
            PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'clear_completed':
                    ref.read(todoListProvider.notifier).clearCompleted();
                  case 'toggle_all':
                    ref.read(todoListProvider.notifier).toggleAll();
                }
              },
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'toggle_all',
                  child: Text('Toggle All (${stats.active} active)'),
                ),
                PopupMenuItem(
                  value: 'clear_completed',
                  child: Text('Clear Completed ($stats.completed)'),
                ),
              ],
            ),
        ],
      ),
      body: Column(
        children: [
          // 统计信息
          _StatsBar(stats: stats),

          // 过滤器芯片
          FilterChipsWidget(
            currentFilter: filter,
            onFilterChanged: (f) =>
                ref.read(filterNotifierProvider.notifier).setFilter(f),
          ),

          // Todo 列表
          Expanded(
            child: filteredTodos.isEmpty
                ? _EmptyState(filter: filter)
                : ReorderableListView.builder(
                    itemCount: filteredTodos.length,
                    onReorder: (oldIndex, newIndex) {
                      // 需要转换索引到原始列表
                      final originalOldIndex =
                          state.indexWhere((t) => t == filteredTodos[oldIndex]);
                      ref.read(todoListProvider.notifier)
                          .reorder(originalOldIndex, newIndex);
                    },
                    itemBuilder: (context, index) {
                      final todo = filteredTodos[index];
                      return Dismissible(
                        key: ValueKey(todo.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          color: Colors.red,
                          child: const Padding(
                            padding: EdgeInsets.only(right: 16),
                            child: Icon(Icons.delete, color: Colors.white),
                          ),
                        ),
                        confirmDismiss: (direction) async {
                          return await showDialog<bool>(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: const Text('Delete Todo?'),
                                  content:
                                      Text('Delete "${todo.title}"?'),
                                  actions: [
                                    TextButton(
                                      onPressed: () =>
                                          Navigator.pop(ctx, false),
                                      child: const Text('Cancel'),
                                    ),
                                    TextButton(
                                      onPressed: () =>
                                          Navigator.pop(ctx, true),
                                      child: const Text('Delete'),
                                    ),
                                  ],
                                ),
                              ) ??
                              false;
                        },
                        onDismissed: (_) {
                          ref.read(todoListProvider.notifier).remove(todo.id);
                        },
                        child: TodoItemWidget(
                          todo: todo,
                          onToggle: () => ref
                              .read(todoListProvider.notifier)
                              .toggle(todo.id),
                          onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => DetailScreen(todoId: todo.id),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }

  Future<void> _showAddDialog(BuildContext context, WidgetRef ref) async {
    final controller = TextEditingController();

    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New Todo'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Enter todo...'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, controller.text),
            child: const Text('Add'),
          ),
        ],
      ),
    );

    if (result != null && result.isNotEmpty && context.mounted) {
      ref.read(todoListProvider.notifier).add(
            Todo(
              id: DateTime.now().millisecondsSinceEpoch.toString(),
              title: result,
              description: '',
              createdAt: DateTime.now(),
            ),
          );
    }
  }
}

class _StatsBar extends ConsumerWidget {
  final TodoStats stats;

  const _StatsBar({required this.stats});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Theme.of(context).colorScheme.surfaceVariant,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('Total: ${stats.total}'),
          Text('Active: ${stats.active}'),
          Text('Done: ${stats.completed}'),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final Filter filter;

  const _EmptyState({required this.filter});

  @override
  Widget build(BuildContext context) {
    final message = switch (filter) {
      Filter.all => 'No todos yet. Tap + to add one!',
      Filter.active => 'All todos are done! 🎉',
      Filter.completed => 'No completed todos yet.',
    };

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.check_circle_outline,
            size: 64,
            color: Theme.of(context).disabledColor,
          ),
          const SizedBox(height: 16),
          Text(
            message,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).disabledColor,
                ),
          ),
        ],
      ),
    );
  }
}
```

### 16.6 UI 组件

```dart
// widgets/todo_item_widget.dart
class TodoItemWidget extends ConsumerWidget {
  final Todo todo;
  final VoidCallback onTap;
  final VoidCallback onToggle;

  const TodoItemWidget({
    super.key,
    required this.todo,
    required this.onTap,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return ListTile(
      leading: Checkbox(
        value: todo.completed,
        onChanged: (_) => onToggle(),
      ),
      title: Text(
        todo.title,
        style: TextStyle(
          decoration: todo.completed ? TextDecoration.lineThrough : null,
          color: todo.completed ? theme.disabledColor : null,
        ),
      ),
      subtitle: todo.description.isNotEmpty ? Text(todo.description) : null,
      trailing: _PriorityIcon(priority: todo.priority),
      onTap: onTap,
    );
  }
}

class _PriorityIcon extends StatelessWidget {
  final Priority priority;

  const _PriorityIcon({required this.priority});

  @override
  Widget build(BuildContext context) {
    return Icon(
      switch (priority) {
        Priority.low => Icons.arrow_downward,
        Priority.medium => Icons.remove,
        Priority.high => Icons.arrow_upward,
      },
      color: switch (priority) {
        Priority.low => Colors.green,
        Priority.orange => Colors.orange,
        Priority.high => Colors.red,
      },
      size: 20,
    );
  }
}

// widgets/filter_chips_widget.dart
class FilterChipsWidget extends StatelessWidget {
  final Filter currentFilter;
  final ValueChanged<Filter> onFilterChanged;

  const FilterChipsWidget({
    super.key,
    required this.currentFilter,
    required this.onFilterChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: Filter.values.map((filter) {
          final isSelected = currentFilter == filter;
          return FilterChip(
            label: Text(filter.name.toUpperCase()),
            selected: isSelected,
            onSelected: (_) => onFilterChanged(filter),
            selectedColor: Theme.of(context).colorScheme.primaryContainer,
          );
        }).toList(),
      ),
    );
  }
}
```

### 16.7 详情页面

```dart
// screens/detail_screen.dart
class DetailScreen extends ConsumerWidget {
  final String todoId;

  const DetailScreen({super.key, required this.todoId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 使用 select 只监听特定的 todo
    final todo = ref.watch(
      todoListProvider.select(
        (todos) => todos.firstWhere((t) => t.id == todoId),
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(todo.completed ? 'Completed' : 'Edit Todo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Delete?'),
                      content: const Text('Are you sure?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, false),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(ctx, true),
                          child: const Text('Delete'),
                        ),
                      ],
                    ),
                  ) ??
                  false;

              if (confirmed && context.mounted) {
                ref.read(todoListProvider.notifier).remove(todoId);
                if (context.mounted) Navigator.pop(context);
              }
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: TextEditingController(text: todo.title)
                ..selection = TextSelection.fromPosition(
                  TextPosition(offset: todo.title.length),
                ),
              decoration: const InputDecoration(
                labelText: 'Title',
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                // 使用 ref.read 避免不必要的重建
                // 实际应该使用 debounce
              },
            ),
            const SizedBox(height: 16),
            TextField(
              controller: TextEditingController(text: todo.description),
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<Priority>(
              value: todo.priority,
              decoration: const InputDecoration(
                labelText: 'Priority',
                border: OutlineInputBorder(),
              ),
              items: Priority.values.map((priority) {
                return DropdownMenuItem(
                  value: priority,
                  child: Text(priority.name.toUpperCase()),
                );
              }).toList(),
              onChanged: (priority) {
                if (priority != null) {
                  ref.read(todoListProvider.notifier).updatePriority(
                        todoId,
                        priority,
                      );
                }
              },
            ),
            const Spacer(),
            FilledButton.icon(
              onPressed: () {
                ref.read(todoListProvider.notifier).toggle(todoId);
                ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(todo.completed ? 'Marked active' : 'Completed!')),
                    );
              },
              icon: Icon(todo.completed ? Icons.undo : Icons.check_circle),
              label: Text(todo.completed ? 'Mark as Active' : 'Mark Complete'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 16.8 入口文件

```dart
// main.dart
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Riverpod TODO Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
```

---

## 17. Clean Architecture + Riverpod

### 17.1 架构分层

```
lib/
├── core/                          # 核心层
│   ├── network/                   # 网络配置
│   │   ├── api_client.dart
│   │   └── exceptions.dart
│   ├── storage/                   # 本地存储
│   │   ├── local_storage.dart
│   │   └── secure_storage.dart
│   └── utils/                     # 工具类
│       └── logger.dart
│
├── features/                      # 功能模块
│   ├── auth/                      # 认证模块
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── auth_local_datasource.dart
│   │   │   │   └── auth_remote_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── user_model.dart
│   │   │   └── repositories/
│   │   │       └── auth_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.dart
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart
│   │   │   └── usecases/
│   │   │       ├── login_usecase.dart
│   │   │       ├── logout_usecase.dart
│   │   │       └── get_current_user_usecase.dart
│   │   └── presentation/
│   │       ├── providers/
│   │       │   └── auth_provider.dart
│   │       └── pages/
│   │           ├── login_page.dart
│   │           └── profile_page.dart
│   │
│   └── products/                  # 产品模块
│       └── ...                    # 同上结构
│
├── shared/                        # 共享组件
│   ├── widgets/
│   └── providers/
│
└── main.dart
```

### 17.2 Domain 层（纯 Dart，无框架依赖）

```dart
// features/auth/domain/entities/user.dart
@freezed
class User with _$User {
  const factory User({
    required String id,
    required String email,
    required String name,
    String? avatarUrl,
    DateTime? createdAt,
  }) = _User;
}

// features/auth/domain/repositories/auth_repository.dart
abstract class AuthRepository {
  Future<User> login({required String email, required String password});
  Future<void> logout();
  Future<User?> getCurrentUser();
  Future<User> updateProfile({String? name, String? avatarUrl});
  Stream<User?> get authStateChanges;
}

// features/auth/domain/usecases/login_usecase.dart
class LoginUseCase {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  Future<Result<User>> call({
    required String email,
    required String password,
  }) async {
    try {
      if (!EmailValidator.isValid(email)) {
        return Result.failure(InvalidEmailError());
      }
      if (password.length < 6) {
        return Result.failure(WeakPasswordError());
      }

      final user = await _repository.login(email: email, password: password);
      return Result.success(user);
    } on ServerException catch (e) {
      return Result.failure(ServerError(e.message));
    } on NetworkException {
      return Result.failure(NetworkError());
    }
  }
}
```

### 17.3 Data 层实现

```dart
// features/auth/data/datasources/auth_remote_datasource.dart
@riverpod
AuthRemoteDataSource authRemoteDataSource(AuthRemoteDataSourceRef ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRemoteDataSourceImpl(apiClient);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _client;

  AuthRemoteDataSourceImpl(this._client);

  @override
  Future<UserModel> login(String email, String password) async {
    final response = await _client.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data);
    } else if (response.statusCode == 401) {
      throw InvalidCredentialsException();
    } else {
      throw ServerException('Login failed');
    }
  }
}

// features/auth/data/repositories/auth_repository_impl.dart
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl(
    this._remoteDataSource,
    this._localDataSource,
    this._networkInfo,
  );

  @override
  Future<User> login({required String email, required String password}) async {
    final userModel = await _remoteDataSource.login(email, password);
    await _localDataSource.cacheUser(userModel.toEntity());
    return userModel.toEntity();
  }

  @override
  Future<void> logout() async {
    await Future.wait([
      _remoteDataSource.logout(),
      _localDataSource.clearCache(),
    ]);
  }

  @override
  Future<User?> getCurrentUser() async {
    return _localDataSource.getCachedUser();
  }

  @override
  Stream<User?> get authStateChanges {
    return _localDataSource.authStateStream;
  }
}
```

### 17.4 Presentation 层 - Riverpod Provider

```dart
// features/auth/presentation/providers/auth_provider.dart
part 'auth_provider.g.dart';

// Repository Provider
@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  return AuthRepositoryImpl(
    ref.watch(authRemoteDataSourceProvider),
    ref.watch(authLocalDataSourceProvider),
    ref.watch(networkInfoProvider),
  );
}

// UseCase Providers
@riverpod
LoginUseCase loginUseCase(LoginUseCaseRef ref) {
  return LoginUseCase(ref.watch(authRepositoryProvider));
}

// State Notifier
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() {
    // 监听认证状态变化
    ref.listenSelf((previous, next) {
      next.whenOrNull(
        authenticated: (user) {
          // 登录成功后的副作用
          ref.read(analyticsServiceProvider).logEvent('login_success');
        },
        unauthenticated: () {
          // 登出后清除相关状态
          ref.invalidate(cartProvider);
          ref.invalidate(notificationsProvider);
        },
      );
    });

    // 尝试恢复登录状态
    _initializeAuth();

    return const AuthState.initial();
  }

  Future<void> _initializeAuth() async {
    final user = await ref.read(authRepositoryProvider).getCurrentUser();
    if (user != null && mounted) {
      state = AuthState.authenticated(user);
    }
  }

  Future<void> login(String email, String password) async {
    state = const AuthState.loading();

    state = await AsyncValue.guard(() async {
      final useCase = ref.read(loginUseCaseProvider);
      final result = await useCase(email: email, password: password);

      return result.fold(
        (failure) => throw AppException.fromFailure(failure),
        (user) => AuthState.authenticated(user),
      ) as AuthState;
    });
  }

  Future<void> loginWithGoogle() async {
    state = const AuthState.loading();

    // 使用 Mutation 处理第三方登录
    googleSignInMutation.run2(ref, () async {
      final credential = await GoogleAuthProvider.credential();
      final user = await ref.read(authRepositoryProvider).signInWithGoogle(credential);
      return AuthState.authenticated(user);
    });
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AuthState.unauthenticated();
  }

  Future<void> updateProfile({String? name, String? avatarUrl}) async {
    final currentUser = state.maybeWhen(
      authenticated: (user) => user,
      orElse: () => null,
    );

    if (currentUser == null) return;

    state = await AsyncValue.guard(() async {
      final updatedUser = await ref.read(authRepositoryProvider).updateProfile(
            name: name ?? currentUser.name,
            avatarUrl: avatarUrl ?? currentUser.avatarUrl,
          );
      return AuthState.authenticated(updatedUser);
    });
  }
}

// State 定义
@freezed
sealed class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated(User user) = _Authenticated;
  const factory AuthState.unauthenticated() = _Unauthenticated;
  const factory AuthState.error(String message) = _Error;
}
```

### 17.5 页面实现

```dart
// features/auth/presentation/pages/login_page.dart
class LoginPage extends ConsumerStatefulWidget {
  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final isConnected = ref.watch(connectionStatusProvider);

    ref.listen(authNotifierProvider, (prev, next) {
      next.whenOrNull(
        authenticated: (user) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const HomePage()),
            (route) => false,
          );
        },
        error: (error, _) {
          ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(error.toString())),
              );
        },
      );
    });

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 60),
                Text(
                  'Welcome Back',
                  style: Theme.of(context).textTheme.headlineLarge,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Sign in to continue',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).hintColor,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),

                // Email Field
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    }
                    if (!value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Password Field
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  textInputAction: TextInputAction.done,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock_outlined),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword
                          ? Icons.visibility_off
                          : Icons.visibility),
                      onPressed: () =>
                          setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    if (value.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                  onFieldSubmitted: (_) => _submitForm(),
                ),
                const SizedBox(height: 24),

                // Login Button
                FilledButton(
                  onPressed: authState.isLoading || !isConnected
                      ? null
                      : _submitForm,
                  child: authState.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Sign In'),
                ),
                const SizedBox(height: 16),

                // Divider
                Row(
                  children: [
                    const Expanded(child: Divider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'OR',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                    const Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 16),

                // Social Login Buttons
                OutlinedButton.icon(
                  onPressed: isConnected
                      ? () => ref
                          .read(authNotifierProvider.notifier)
                          .loginWithGoogle()
                      : null,
                  icon: Image.asset('assets/google.png', height: 20),
                  label: const Text('Continue with Google'),
                ),

                if (!isConnected) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.wifi_off, color: Colors.orange.shade700),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'No internet connection',
                            style: TextStyle(color: Colors.orange.shade700),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 24),

                // Register Link
                TextButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const RegisterPage()),
                  ),
                  child: const Text("Don't have an account? Sign Up"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState?.validate() ?? false) {
      FocusScope.of(context).unfocus();
      ref.read(authNotifierProvider.notifier).login(
            _emailController.text.trim(),
            _passwordController.text,
          );
    }
  }
}
```

---

## 18. Riverpod vs Bloc vs GetX 对比（2025）

### 18.1 能力矩阵对比

| 维度 | Riverpod 3.0 | Bloc 8.0 | GetX 5.0 |
|------|-------------|----------|----------|
| **类型安全** | ⭐⭐⭐⭐⭐ 编译期检测 | ⭐⭐⭐⭐ 运行时+代码生成 | ⭐⭐ 动态类型 |
| **学习曲线** | ⭐⭐⭐ 中等 | ⭐⭐ 较陡峭 | ⭐⭐⭐⭐⭐ 简单 |
| **代码量** | ⭐⭐⭐⭐ 简洁 | ⭐⭐ 冗长 | ⭐⭐⭐⭐⭐ 极简 |
| **可测试性** | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 良好 | ⭐⭐ 一般 |
| **性能** | ⭐⭐⭐⭐⭐ 精细控制 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐ 一般 |
| **架构支持** | ⭐⭐⭐⭐⭐ 灵活 | ⭐⭐⭐⭐⭐ Clean Arch | ⭐⭐ 有限 |
| **生态成熟度** | ⭐⭐⭐⭐ 快速增长 | ⭐⭐⭐⭐⭐ 成熟稳定 | ⭐⭐⭐⭐ 社区活跃 |
| **团队协作** | ⭐⭐⭐⭐⭐ lint强制规范 | ⭐⭐⭐⭐ 强制模式 | ⭐⭐ 自由度高 |

### 18.2 同一功能三种写法对比

#### 场景：计数器 + 异步数据获取

```dart
// ========== Riverpod 3.0 写法 ==========
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}

@riverpod
Future<User> user(UserRef ref, String userId) async {
  final token = ref.watch(authTokenProvider);
  return fetchUser(token, userId);
}

// UI
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    final userAsync = ref.watch(userProvider('123'));

    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: Text('+'),
        ),
        userAsync.when(
          data: (u) => Text(u.name),
          loading: () => CircularProgressIndicator(),
          error: (e, _) => Text('Error: $e'),
        ),
      ],
    );
  }
}

// ========== Bloc 8.0 写法 ==========
// Events
abstract class CounterEvent {}
class Increment extends CounterEvent {}

abstract class UserEvent {}
class FetchUser extends UserEvent {
  final String userId;
  FetchUser(this.userId);
}

// States
abstract class CounterState {}
class CounterInitial extends CounterState {
  final int count;
  CounterInitial(this.count);
}

abstract class UserState {}
class UserInitial extends UserState {}
class UserLoading extends UserState {}
class UserLoaded extends UserState {
  final User user;
  UserLoaded(this.user);
}
class UserError extends UserState {
  final String message;
  UserError(this.message);
}

// Blocs
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterInitial(0)) {
    on<Increment>((event, emit) {
      emit(CounterInitial(state.count + 1));
    });
  }
}

class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepository repository;

  UserBloc(this.repository) : super(UserInitial()) {
    on<FetchUser>((event, emit) async {
      emit(UserLoading());
      try {
        final user = await repository.getUser(event.userId);
        emit(UserLoaded(user));
      } catch (e) {
        emit(UserError(e.toString()));
      }
    });
  }
}

// UI
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => CounterBloc()),
        BlocProvider(create: (_) => UserBloc(repository)),
      ],
      child: Column(
        children: [
          BlocBuilder<CounterBloc, CounterState>(
            builder: (context, state) => Text('Count: ${state.count}'),
          ),
          ElevatedButton(
            onPressed: () => context.read<CounterBloc>().add(Increment()),
            child: Text('+'),
          ),
          BlocConsumer<UserBloc, UserState>(
            listener: (context, state) {
              if (state is UserError) {
                ScaffoldMessenger.showSnackBar(SnackBar(
                  content: Text(state.message)));
              }
            },
            builder: (context, state) {
              if (state is UserLoading) return CircularProgressIndicator();
              if (state is UserLoaded) return Text(state.user.name);
              if (state is UserError) return Text('Error: ${state.message}');
              return SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }
}

// ========== GetX 5.0 写法 ==========
// Controller
class CounterController extends GetxController {
  final count = 0.obs;

  void increment() => count++;
}

class UserController extends GetxController {
  final user = Rxn<User>();
  final isLoading = false.obs;

  Future<void> fetchUser(String userId) async {
    isLoading.value = true;
    try {
      user.value = await UserRepository().getUser(userId);
    } finally {
      isLoading.value = false;
    }
  }
}

// UI
class MyWidget extends StatelessWidget {
  final counterController = Get.put(CounterController());
  final userController = Get.put(UserController());

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Obx(() => Text('Count: ${counterController.count.value}')),
        ElevatedButton(
          onPressed: counterController.increment,
          child: Text('+'),
        ),
        Obx(() {
          if (userController.isLoading.value) return CircularProgressIndicator();
          final u = userController.user.value;
          if (u != null) return Text(u.name);
          return SizedBox.shrink();
        }),
      ],
    );
  }
}
```

### 18.3 选型建议

#### 选择 Riverpod 3.0 当

- ✅ **大型企业项目**：需要强类型安全和团队协作规范
- ✅ **Clean Architecture**：需要灵活的依赖注入和分层架构
- ✅ **高测试覆盖率**：需要轻松 mock 和单元测试
- ✅ **复杂状态管理**：多层级 Provider 组合、Family 参数化
- ✅ **长期维护项目**：编译期错误检测减少运行时 bug

#### 选择 Bloc 当

- ✅ **事件驱动业务**：复杂的业务流程、审批流、工作流
- ✅ **团队已有 Bloc 经验**：迁移成本过高时
- ✅ **需要严格的状态转换追踪**：每个事件都有明确的状态变化
- ✅ **HydratedBloc 需求**：自动状态持久化

#### 选择 GetX 当

- ✅ **个人/MVP 项目**：快速原型开发
- ✅ **简单应用**：状态管理需求不复杂
- ✅ **学习资源有限**：希望快速上手
- ✅ **小型团队**：不需要严格的架构约束

---

## 19. 高级技巧与设计模式

### 19.1 Repository Pattern + Riverpod

```dart
// 定义抽象接口
abstract class TodoRepository {
  Future<List<Todo>> getAll();
  Future<Todo> getById(String id);
  Future<Todo> create(Todo todo);
  Future<Todo> update(Todo todo);
  Future<void> delete(String id);
  Stream<List<Todo>> watchAll();
}

// 不同环境使用不同实现
@riverpod
TodoRepository todoRepository(TodoRepositoryRef ref) {
  final isDev = ref.watch(environmentConfigProvider).isDev;

  return isDev
      ? MockTodoRepository()
      : RemoteTodoRepository(
          client: ref.watch(apiClientProvider),
          localCache: ref.watch(todoCacheProvider),
        );
}

// 在 Notifier 中使用
@riverpod
class Todos extends _$Todos {
  @override
  Future<List<Todo>> build() async {
    return ref.watch(todoRepositoryProvider).getAll();
  }

  Future<void> add(Todo todo) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final created = await ref.read(todoRepositoryProvider).create(todo);
      return [created, ...await future];
    });
  }
}
```

### 19.2 缓存策略实现

```dart
@riverpod
class CachedData extends _$CachedData {
  DateTime? _lastFetch;
  Duration _cacheDuration = const Duration(minutes: 5);

  @override
  Future<Data> build() async {
    // 先尝试从缓存读取
    final cached = ref.watch(cacheStorageProvider).get<Data>('my_data');

    if (cached != null &&
        _lastFetch != null &&
        DateTime.now().difference(_lastFetch!) < _cacheDuration) {
      return cached;
    }

    // 缓存过期或不存在，从网络获取
    _lastFetch = DateTime.now();
    final data = await fetchDataFromNetwork();

    // 更新缓存
    ref.read(cacheStorageProvider).set('my_data', data);

    return data;
  }

  Future<void> forceRefresh() async {
    _lastFetch = null; // 重置缓存时间
    ref.invalidate(self); // 触发重新构建
  }
}
```

### 19.3 乐观更新（Optimistic Updates）

```dart
@riverpod
class LikeNotifier extends _$LikeNotifier {
  @override
  Future<LikeState> build(String postId) async {
    return LikeState(
      isLiked: await checkIfLiked(postId),
      count: await getLikeCount(postId),
    );
  }

  Future<void> toggleLike() async {
    final previous = state.valueOrNull;

    if (previous == null) return;

    // 乐观更新：立即更新 UI
    state = AsyncData(previous.copyWith(
      isLiked: !previous.isLiked,
      count: previous.isLiked ? previous.count - 1 : previous.count + 1,
    ));

    try {
      // 发送请求到服务器
      await toggleLikeOnServer(postId);
    } catch (e) {
      // 失败时回滚
      if (mounted) {
        state = AsyncData(previous);
      }
      rethrow;
    }
  }
}

@freezed
class LikeState with _$LikeState {
  const factory LikeState({
    required bool isLiked,
    required int count,
  }) = _LikeState;
}
```

### 19.4 无限滚动 / 分页加载

```dart
@riverpod
class PaginatedList extends _$PaginatedList {
  static const _pageSize = 20;

  @override
  Future<PaginatedData<Item>> build() async {
    return _fetchPage(1);
  }

  Future<PaginatedData<Item>> _fetchPage(int page) async {
    final items = await api.fetchItems(page: page, pageSize: _pageSize);
    final hasMore = items.length == _pageSize;

    return PaginatedData(
      items: items,
      page: page,
      hasMore: hasMore,
      isLoadingMore: false,
    );
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || current.isLoadingMore || !current.hasMore) return;

    // 显示加载更多状态
    state = AsyncData(current.copyWith(isLoadingMore: true));

    try {
      final nextPage = await _fetchPage(current.page + 1);

      state = AsyncData(current.copyWith(
        items: [...current.items, ...nextPage.items],
        page: nextPage.page,
        hasMore: nextPage.hasMore,
        isLoadingMore: false,
      ));
    } catch (e) {
      state = AsyncData(current.copyWith(isLoadingMore: false));
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading<PaginatedData<Item>>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => _fetchPage(1));
  }
}

@freezed
class PaginatedData<T> with _$PaginatedData<T> {
  const factory PaginatedData({
    required List<T> items,
    required int page,
    required bool hasMore,
    @Default(false) bool isLoadingMore,
  }) = _PaginatedData<T>;
}

// UI 中使用
class InfiniteScrollList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final paginatedAsync = ref.watch(paginatedListProvider);

    return paginatedAsync.when(
      data: (paginated) => NotificationListener<ScrollNotification>(
        onNotification: (notification) {
          if (notification is ScrollEndNotification &&
              notification.metrics.pixels >=
                  notification.metrics.maxScrollExtent - 200 &&
              paginated.hasMore &&
              !paginated.isLoadingMore) {
            ref.read(paginatedListProvider.notifier).loadMore();
          }
          return false;
        },
        child: ListView.builder(
          itemCount: paginated.items.length +
              (paginated.hasMore ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == paginated.items.length) {
              return paginated.isLoadingMore
                  ? const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : const SizedBox.shrink();
            }
            return ItemTile(item: paginated.items[index]);
          },
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => ErrorView(
        error: err,
        onRetry: () => ref.read(paginatedListProvider.notifier).refresh(),
      ),
    );
  }
}
```

### 19.5 多语言（Internationalization）与 Riverpod

```dart
@riverpod
class LocaleNotifier extends _$LocaleNotifier {
  @override
  Locale build() {
    // 从本地存储读取保存的语言设置
    final savedLocale = ref.watch(localStorageProvider).getString('locale');
    if (savedLocale != null) {
      return Locale(savedLocale);
    }
    return PlatformDispatcher.instance.locale;
  }

  void setLocale(Locale locale) {
    state = locale;
    ref.watch(localStorageProvider).setString('locale', locale.languageCode);
  }
}

// 配合 intl 或 flutter_localizations 使用
class LocalizedApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeNotifierProvider);

    return MaterialApp(
      locale: locale,
      localizationsDelegates: [
        S.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: S.delegate.supportedLocales,
      home: HomePage(),
    );
  }
}

// 在 widget 中使用翻译
class GreetingWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeNotifierProvider);

    return Text(
      S.of(context).hello_world, // 使用 intl 生成的翻译方法
    );
  }
}
```

### 19.6 主题切换与持久化

```dart
@riverpod
class ThemeModeNotifier extends _$ThemeModeNotifier {
  static const _themeKey = 'theme_mode';

  @override
  ThemeMode build() {
    final stored = ref.watch(sharedPreferencesProvider).getString(_themeKey);
    if (stored == null) return ThemeMode.system;

    return switch (stored) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  void setThemeMode(ThemeMode mode) {
    state = mode;
    ref.read(sharedPreferencesProvider).setString(_themeKey, mode.name);
  }

  void toggleDarkMode() {
    final newMode = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    setThemeMode(newMode);
  }
}

// Material App 中使用
class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeNotifierProvider);

    return MaterialApp(
      themeMode: themeMode,
      theme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.blue,
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: HomePage(),
    );
  }
}

// 设置页面中的主题切换
class ThemeSettings extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeNotifierProvider);

    return SegmentedButton<ThemeMode>(
      segments: const [
        ButtonSegment(value: ThemeMode.system, icon: Icon(Icons.brightness_auto), label: Text('System')),
        ButtonSegment(value: ThemeMode.light, icon: Icon(Icons.light_mode), label: Text('Light')),
        ButtonSegment(value: ThemeMode.dark, icon: Icon(Icons.dark_mode), label: Text('Dark')),
      ],
      selected: {themeMode},
      onSelectionChanged: (modes) {
        ref.read(themeModeNotifierProvider).setThemeMode(modes.first);
      },
    );
  }
}
```

### 19.7 权限管理与 Riverpod

```dart
@riverpod
class PermissionNotifier extends _$PermissionNotifier {
  @override
  Map<PermissionType, PermissionStatus> build() {
    return {};
  }

  Future<void> requestPermission(PermissionType type) async {
    final status = await _request(type);
    if (!ref.mounted) return;

    state = {...state, type: status};

    if (status.isDenied) {
      // 可以显示说明或引导用户去设置
    }
  }

  Future<PermissionStatus> _request(PermissionType type) async {
    return switch (type) {
      PermissionType.camera => await Permission.camera.status,
      PermissionType.location => await Permission.location.status,
      PermissionType.notification => await Permission.notification.status,
      PermissionType.storage => await Permission.storage.status,
    };
  }

  Future<bool> checkAndRequest(PermissionType type) async {
    final status = state[type] ?? await _request(type);

    if (status.isGranted) return true;

    if (status.isPermanentlyDenied) {
      // 引导用户去系统设置
      await openAppSettings();
      return false;
    }

    return await requestPermission(type).then((s) => s.isGranted);
  }
}

enum PermissionType { camera, location, notification, storage }

// 使用示例
class CameraButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final permissions = ref.watch(permissionNotifierProvider);
    final cameraStatus = permissions[PermissionType.camera];

    return IconButton(
      icon: const Icon(Icons.camera_alt),
      onPressed: cameraStatus == PermissionStatus.granted
          ? () => _openCamera(context, ref)
          : () => _requestCameraPermission(context, ref),
    );
  }

  void _requestCameraPermission(BuildContext context, WidgetRef ref) async {
    final granted = await ref
        .read(permissionNotifierProvider.notifier)
        .checkAndRequest(PermissionType.camera);

    if (!granted && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Camera permission is required')),
      );
    }
  }

  void _openCamera(BuildContext context, WidgetRef ref) {
    // 打开相机
  }
}
```

---

## 20. 常见陷阱与反模式

### 20.1 ❌ 反模式：在 build 方法中执行副作用

```dart
// 错误做法
@riverpod
class BadNotifier extends _$BadNotifier {
  @override
  int build() {
    // ❌ 不要在 build 中执行副作用！
    analytics.logEvent('provider_initialized'); // 每次 rebuild 都会执行
    ref.read(otherProvider.notifier).doSomething(); // 可能导致无限循环
    return 0;
  }
}

// 正确做法
@riverpod
class GoodNotifier extends _$GoodNotifier {
  @override
  int build() {
    // ✅ 使用 ref.onDispose 注册清理回调
    ref.onDispose(() {
      print('Clean up resources');
    });

    // ✅ 使用 ref.listenSelf 监听状态变化
    ref.listenSelf((prev, next) {
      // 只在特定条件下执行副作用
    });

    return 0;
  }

  // ✅ 副作用应该在显式调用的方法中
  void performAction() {
    analytics.logEvent('action_performed');
    state++;
  }
}
```

### 20.2 ❌ 反模式：过度拆分 Provider

```dart
// 错误做法：过度拆分
@riverpod
String firstName(FirstNameRef ref) => 'John';
@riverpod
String lastName(LastNameRef ref) => 'Doe';
@riverpod
int age(AgeRef ref) => 30;
@riverpod
String email(EmailRef ref) => 'john@example.com';

// 正确做法：逻辑内聚的对象
@freezed
class UserProfile with _$UserProfile {
  const factory UserProfile({
    required String firstName,
    required String lastName,
    required int age,
    required String email,
  }) = _UserProfile;
}

@riverpod
UserProfile userProfile(UserProfileRef ref) {
  return UserProfile(
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john@example.com',
  );
}

// 需要精细控制时使用 select
class UserNameDisplay extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final name = ref.watch(
      userProfileProvider.select((p) => '${p.firstName} ${p.lastName}'),
    );
    return Text(name);
  }
}
```

### 20.3 ❌ 反模式：在 ConsumerWidget 中进行复杂计算

```dart
// 错误做法
class ExpensiveWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(largeListProvider);

    // ❌ 每次 rebuild 都会重新计算
    final filtered = items
        .where((item) => item.isActive && item.price > 100)
        .map((item) => item.copyWith(discount: calculateDiscount(item)))
        .toList()
      ..sort((a, b) => a.price.compareTo(b.price));

    return ListView.builder(itemBuilder: (context, index) => ...);
  }
}

// 正确做法：将计算放在 Provider 中
@riverpod
List<ProcessedItem> processedItems(ProcessedItemsRef ref) {
  final items = ref.watch(largeListProvider);

  // ✅ Provider 会自动缓存结果，只在依赖变化时重新计算
  return items
      .where((item) => item.isActive && item.price > 100)
      .map((item) => item.copyWith(discount: calculateDiscount(item)))
      .toList()
    ..sort((a, b) => a.price.compareTo(b.price));
}

class EfficientWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final processedItems = ref.watch(processedItemsProvider);
    return ListView.builder(...);
  }
}
```

### 20.4 ❌ 反模式：忽略异步操作的错误处理

```dart
// 错误做法
@riverpod
class UnsafeNotifier extends _$UnsafeNotifier {
  @override
  Future<Data> build() async {
    return fetchData(); // 如果失败，没有错误处理
  }

  void updateData() async {
    // ❌ 没有等待，错误被吞掉
    ref.read(someRepositoryProvider).update(data);
  }
}

// 正确做法
@riverpod
class SafeNotifier extends _$SafeNotifier {
  @override
  Future<Data> build() async {
    return ref.watch(asyncInitProvider);
  }

  Future<void> updateData() async {
    state = const AsyncLoading<Data>().copyWithPrevious(state);

    // ✅ 使用 AsyncValue.guard 自动捕获异常
    state = await AsyncValue.guard(() async {
      final currentData = state.valueOrNull ?? await future;
      return ref.read(someRepositoryProvider).update(currentData);
    });
  }
}
```

### 20.5 ❌ 反模式：直接修改状态对象

```dart
// 错误做法
@riverpod
class MutableNotifier extends _$MutableNotifier {
  @override
  List<Item> build() => [];

  void addItem(Item item) {
    // ❌ 直接修改！违反不可变性原则
    state.add(item); // 这不会触发重建！
  }

  void updateFirst() {
    // ❌ 直接修改内部对象
    state[0] = state[0].copyWith(name: 'new name');
  }
}

// 正确做法
@riverpod
class ImmutableNotifier extends _$ImmutableNotifier {
  @override
  List<Item> build() => [];

  void addItem(Item item) {
    // ✅ 创建新的列表实例
    state = [...state, item];
  }

  void updateFirst() {
    // ✅ 创建新的对象实例
    if (state.isNotEmpty) {
      state = [
        state[0].copyWith(name: 'new name'),
        ...state.sublist(1),
      ];
    }
  }
}
```

### 20.6 性能陷阱清单

| 陷阱 | 问题 | 解决方案 |
|------|------|---------|
| 大型 Widget 整体监听 | 不必要的重建 | 使用 `select()` 或拆分 Widget |
| build 中的复杂计算 | 每次 rebuild 都重复计算 | 移到独立 Provider |
| 忽略 `const` 构造函数 | 子 Widget 不必要重建 | 尽可能使用 `const` |
| 过度使用 `ref.read` | 状态变化不触发重建 | 区分读/监听场景 |
| Family 参数频繁变化 | 创建过多 Provider 实例 | 合理设计参数或缓存 |
| 未取消的异步操作 | 内存泄漏 | 使用 `ref.mounted` 检查 |
| 深层嵌套的 Consumer | 代码难以维护 | 扁平化结构或提取组件 |

---

## 21. Riverpod 生态扩展包

### 21.1 推荐插件列表

| 包名 | 用途 | 版本 |
|------|------|------|
| `flutter_riverpod` | 核心 Flutter 集成 | ^3.0.0 |
| `riverpod_annotation` | 代码生成注解 | ^3.0.0 |
| `riverpod_generator` | 代码生成器 | ^3.0.0 |
| `riverpod_lint` | Lint 规则 | ^3.0.0 |
| `riverpod_sqflite` | SQLite 离线持久化 | ^0.1.0 |
| `hooks_riverpod` | Hooks 集成 | ^3.0.0 |
| `flutter_riverpod_context` | BuildContext 扩展 | ^1.0.0 |
| `riverpod_persistence` | 状态持久化 | 最新版 |

### 21.2 riverpod_annotation 完整配置

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^3.0.0
  riverpod_annotation: ^3.0.0
  json_annotation: ^4.8.0
  freezed_annotation: ^2.3.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.0
  riverpod_generator: ^3.0.0
  json_serializable: ^6.7.0
  freezed: ^2.4.0
  custom_lint: ^0.6.0
  riverpod_lint: ^3.0.0

# analysis_options.yaml
include: package:riverpod_lint/riverpod_lint.yaml

analyzer:
  errors:
    invalid_annotation_target: ignore
  plugins:
    - custom_lint
```

### 21.3 常用组合模式

```dart
// Riverpod + Freezed = 不可变状态
@freezed
sealed class AppState with _$AppState {
  const factory AppState.initial() = _Initial;
  const factory AppState.loading() = _Loading;
  const factory AppState.data(T data) = _Data<T>;
  const factory AppState.error(AppError error) = _Error;
}

// Riverpod + Dio = 网络请求
@riverpod
Dio dio(DioRef ref) {
  final config = ref.watch(apiConfigProvider);

  return Dio(BaseOptions(
    baseUrl: config.baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
  ))
    ..interceptors.addAll([
      LogInterceptor(),
      AuthInterceptor(ref.watch(authProvider)),
      RetryInterceptor(dioOption: DioOption()),
    ]);
}

// Riverpod + GoRouter = 导航管理
@riverpod
GoRouter goRouter(GoRouterRef ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    initialLocation: authState.isAuthenticated ? '/home' : '/login',
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isLoggingIn = state.matchedLocation == '/login';

      if (!isAuthenticated && !isLoggingIn) return '/login';
      if (isAuthenticated && isLoggingIn) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => LoginPage()),
      GoRoute(path: '/home', builder: (_, __) => HomePage()),
    ],
  );
}

// Riverpod + Shared Preferences = 本地存储
@riverpod
SharedPreferences sharedPreferences(SharedPreferencesRef ref) {
  return SharedPreferences.getInstance();
}

// Riverpod + Connectivity Plus = 网络状态
@riverpod
Stream<ConnectivityResult> connectivityStatus(ConnectivityStatusRef ref) {
  return Connectivity().onConnectivityChanged;
}

@riverpod
bool isConnected(IsConnectedRef ref) {
  final status = ref.watch(connectivityStatusProvider).valueOrNull;
  return status != ConnectivityResult.none;
}
```

---

## 22. 总结与展望

### 22.1 Riverpod 3.0 核心优势总结

```
┌─────────────────────────────────────────────────────────────┐
│                    RIVERPOD 3.0                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏗️  架构优势                                              │
│  ├─ 编译期安全：引用错误在编译时发现                         │
│  ├─ 无 Context 依赖：真正的依赖注入                         │
│  ├─ 组合式设计：Provider 可自由组合                          │
│  └─ 测试友好：无需 Widget 树即可测试                        │
│                                                             │
│  ⚡  性能优势                                               │
│  ├─ 精细重建控制：select() 减少不必要的渲染                 │
│  ├─ 自动暂停：不可见的 Provider 自动暂停                    │
│  ├─ 缓存机制：相同参数返回缓存的值                           │
│  └─ 内存管理：autoDispose 自动释放                          │
│                                                             │
│  🎯  开发体验                                               │
│  ├─ 代码生成：@riverpod 减少样板代码                        │
│  ├─ Lint 规则：自动检测常见错误                             │
│  ├─ IDE 支持：完整的类型推断和补全                          │
│  └─ 文档完善：官方文档详尽且持续更新                        │
│                                                             │
│  🔮  未来特性（实验性）                                     │
│  ├─ 离线持久化：Provider 状态本地缓存                       │
│  ├─ Mutations：结构化的副作用处理                           │
│  ├─ Runs：声明式的操作流程                                  │
│  └─ 更多...                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 22.2 学习路线图（更新版）

```
Week 1-2: 基础入门
├─ Day 1-2: 安装配置，理解核心概念
│   ├─ Provider / Ref / Consumer
│   ├─ ProviderScope 的作用
│   └─ 第一个 Counter 示例
├─ Day 3-4: Provider 类型
│   ├─ Provider, Notifier, AsyncNotifier
│   ├─ FutureProvider, StreamProvider
│   └─ Family 参数化
└─ Day 5-7: 代码生成
    ├─ @riverpod 注解语法
    ├─ build_runner 配置
    └─ 完成 TODO App 基础功能

Week 3-4: 进阶提升
├─ Week 3: 高级用法
│   ├─ Provider 组合与依赖
│   ├─ select() 性能优化
│   ├─ AutoDispose 生命周期
│   └─ Provider 覆盖与测试
└─ Week 4: 实战项目
    ├─ Clean Architecture 集成
    ├─ 认证流程完整实现
    ├─ 列表/分页/搜索功能
    └─ 单元测试 & Widget 测试

Week 5-6: 专家深入
├─ Week 5: Riverpod 3.0 新特性
│   ├─ 自动重试机制
│   ├─ Ref.mounted 安全检查
│   ├─ Mutations 实验
│   └─ 离线持久化实验
└─ Week 6: 架构与优化
    ├─ 大型项目架构设计
    ├─ 性能分析与优化
    ├─ 源码阅读与原理理解
    └─ 开源贡献准备
```

### 22.3 最终建议

1. **从项目开始学习**：不要只看文档，动手做项目是最好的学习方式
2. **遵循官方推荐**：优先使用 `@riverpod` + `Notifier` 模式
3. **编写测试**：养成先写测试的习惯，能让你更深入理解 Riverpod
4. **关注社区**：关注官方 GitHub 和 Discord，了解最新动态
5. **逐步迁移**：如果是老项目，按照迁移指南逐步升级，不要一次性重写

---

## 总结

Riverpod 3.0 是一次重大的升级，带来了：

✅ **更简洁的 API** - 统一的 Notifier 模型  
✅ **更强的类型安全** - 代码生成 + lint 规则  
✅ **更好的开发体验** - IDE 支持 + 编译期错误检测  
✅ **更强大的功能** - 自动重试、离线持久化、Mutations  
✅ **更好的性能** - 精细的重建控制和暂停/恢复支持  

**核心要点**:

1. 使用 `@riverpod` 代码生成作为主要开发方式
2. 使用 `Notifier` / `AsyncNotifier` 管理状态
3. 使用 `select()` 减少不必要的重建
4. 使用 `ref.mounted` 进行安全的异步操作
5. 编写测试确保 Provider 的正确性
6. 结合 Clean Architecture 构建可维护的大型项目

祝你在 Riverpod 3.0 的学习和使用中取得成功！🎉

---

## 23. Riverpod 3.0 深度特性解析（2025 最新）

### 23.1 Runs - 声明式操作流程

Riverpod 3.0 引入了 **Runs** 概念，用于声明式地管理复杂的异步操作流程。

```dart
@riverpod
Future<OrderResult> placeOrder(PlaceOrderRef ref, OrderRequest request) async {
  // 使用 run() 声明式地定义操作流程
  return ref.run<OrderResult>((ref) async {
    // 步骤 1: 验证库存
    final inventory = await ref.watch(checkInventoryProvider(request.itemId).future);

    if (inventory.quantity < request.quantity) {
      throw OutOfStockError(itemId: request.itemId);
    }

    // 步骤 2: 锁定库存
    final lockResult = await ref.run((ref) async {
      return await ref.watch(lockInventoryProvider(
        LockRequest(itemId: request.itemId, quantity: request.quantity),
      ).future);
    });

    // 步骤 3: 处理支付
    final paymentResult = await ref.run((ref) async {
      return await ref.watch(processPaymentProvider(
        PaymentRequest(amount: request.totalAmount, orderId: lockResult.orderId),
      ).future);
    }).catchError((error) {
      // 支付失败时自动回滚库存锁定
      ref.invalidate(lockInventoryProvider);
      rethrow;
    });

    // 步骤 4: 创建订单
    final order = await ref.watch(createOrderProvider(
      CreateOrderRequest(
        userId: request.userId,
        items: request.items,
        paymentId: paymentResult.paymentId,
      ),
    ).future);

    // 步骤 5: 发送确认通知
    ref.listenSelf((prev, next) {
      if (next.hasValue && !next.isLoading) {
        ref.read(notificationServiceProvider).sendOrderConfirmation(order.id);
      }
    });

    return OrderResult(orderId: order.id, status: 'confirmed');
  });
}

// UI 中使用 Runs
class CheckoutButton extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(placeOrderProvider(_currentRequest));

    return FilledButton(
      onPressed: orderAsync.isLoading ? null : () => _placeOrder(ref),
      child: orderAsync.when(
        data: (_) => const Text('Place Order'),
        loading: () => const SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
        error: (err, _) => Text('Retry ($err)'),
      ),
    );
  }
}
```

### 23.2 Declarative Programming 声明式编程模式

```dart
// 传统命令式写法
@riverpod
class ImperativeNotifier extends _$ImperativeNotifier {
  Timer? _timer;
  StreamSubscription? _subscription;

  @override
  Future<Data> build() async {
    _timer = Timer.periodic(const Duration(seconds: 30), (_) {
      refresh();
    });

    _subscription = _eventStream.listen((event) {
      handleEvent(event);
    });

    ref.onDispose(() {
      _timer?.cancel();
      _subscription?.cancel();
    });

    return fetchData();
  }

  Future<void> refresh() async {
    state = const AsyncLoading<Data>().copyWithPrevious(state);
    state = await AsyncValue.guard(() => fetchData());
  }
}

// Riverpod 3.0 声明式写法 ✅
@riverpod
class DeclarativeNotifier extends _$DeclarativeNotifier {
  @override
  Future<Data> build() async {
    // 自动定时刷新（声明式）
    ref.watchAutoRefresh(
      const Duration(seconds: 30),
      () => ref.invalidate(self),
    );

    // 自动监听事件流（声明式）
    ref.watchStream(_eventStream, (event) {
      handleEvent(event);
    });

    // 资源自动清理（声明式）
    ref.onDispose(() {
      print('Resources cleaned up');
    });

    return fetchData();
  }

  Future<void> handleEvent(Event event) async {
    state = await AsyncValue.guard(() => processData(event));
  }
}
```

### 23.3 Enhanced AutoDispose 增强

```dart
@riverpod
class SmartCache extends _$SmartCache {
  @override
  Future<List<Item>> build(String category) async {
    // 使用 cacheTime 控制缓存时间
    ref.cacheTime = const Duration(minutes: 5);

    // 使用 maxSize 限制缓存大小
    ref.maxCacheSize = 100;

    // 使用 evictionStrategy 定义淘汰策略
    ref.evictionStrategy = CacheEvictionStrategy.lru;

    return fetchItems(category);
  }

  Future<void> prefetchRelated(String relatedCategory) async {
    // 预加载相关数据，使用共享缓存
    final relatedItems = await ref.watch(smartCacheProvider(relatedCategory).future);

    print('Prefetched ${relatedItems.length} items for $relatedCategory');
  }
}

// 全局缓存配置
void main() {
  runApp(
    ProviderScope(
      overrides: [
        autoDisposeCacheConfigProvider.overrideWithValue(AutoDisposeCacheConfig(
          defaultCacheTime: const Duration(minutes: 10),
          maxEntriesPerFamily: 50,
          cleanupInterval: const Duration(minutes: 5),
          onEviction: (key, value) {
            logger.info('Cache evicted: $key');
          },
        )),
      ],
      child: MyApp(),
    ),
  );
}
```

### 23.4 Advanced Error Handling 高级错误处理

```dart
// 自定义错误类型层次结构
sealed class AppException implements Exception {
  const AppException(this.message, {this.code, this.stackTrace});

  final String message;
  final String? code;
  final StackTrace? stackTrace;

  String get userMessage;
}

class NetworkException extends AppException {
  const NetworkException(super.message, {super.code, super.stackTrace});

  @override
  String get userMessage => '网络连接失败，请检查网络设置';
}

class ServerException extends AppException {
  final int statusCode;

  const ServerException(super.message, {required this.statusCode, super.code, super.stackTrace});

  @override
  String get userMessage => switch (statusCode) {
    401 => '登录已过期，请重新登录',
    403 => '没有权限执行此操作',
    404 => '请求的资源不存在',
    500 => '服务器内部错误，请稍后重试',
    _ => '服务器异常 ($statusCode)',
  };
}

class ValidationException extends AppException {
  final Map<String, List<String>> fieldErrors;

  const ValidationException(super.message, {required this.fieldErrors, super.code, super.stackTrace});

  @override
  String get userMessage => '输入信息有误，请检查后重试';
}

// 统一错误处理 Notifier
@riverpod
class ErrorHandlingNotifier<T> extends _$ErrorHandlingNotifier<T> {
  @override
  AsyncValue<T> build() {
    // 配置全局错误处理器
    ref.onError((error, stackTrace) {
      _reportToAnalytics(error, stackTrace);
      _showUserFriendlyMessage(error);
    });

    // 配置重试策略
    ref.retryPolicy = RetryPolicy.exponentialBackoff(
      maxRetries: 3,
      initialDelay: const Duration(milliseconds: 500),
      maxDelay: const Duration(seconds: 10),
      retryableErrors: [NetworkException, ServerException],
    );

    return const AsyncValue.loading();
  }

  void _reportToAnalytics(Object error, StackTrace? stackTrace) {
    final appException = error is AppException ? error : AppException.unknown(error.toString());

    ref.read(analyticsProvider).logError(
      exception: appException,
      stackTrace: stackTrace,
      context: runtimeType.toString(),
    );
  }

  void _showUserFriendlyMessage(Object error) {
    final message = switch (error) {
      AppException e => e.userMessage,
      _ => '发生了未知错误',
    };

    ref.read(toastProvider).showError(message);
  }
}

// 使用示例
@riverpod
class UserProfileNotifier extends _$UserProfileNotifier {
  @override
  AsyncValue<UserProfile> build() {
    // 继承错误处理能力
    _setupErrorHandling();

    // 初始加载
    _loadProfile();

    return const AsyncValue.loading();
  }

  void _setupErrorHandling() {
    ref.onError((error, stackTrace) {
      if (error is ServerException && error.statusCode == 401) {
        // 特殊处理：未认证
        ref.read(authProvider.notifier).logout();
        ref.read(routerProvider).push('/login');
      }
    });
  }

  Future<void> _loadProfile() async {
    state = await AsyncValue.guard(() async {
      final userId = ref.watch(authProvider)?.id;
      if (userId == null) throw const ServerException('Not authenticated', statusCode: 401);

      return ref.watch(userRepositoryProvider).getProfile(userId);
    });
  }
}
```

### 23.5 Concurrent Operations 并发操作管理

```dart
@riverpod
class ConcurrentUploads extends _$ConcurrentUploads {
  static const maxConcurrentUploads = 3;

  @override
  Future<UploadState> build() async {
    return UploadState.initial();
  }

  Future<void> uploadFiles(List<File> files) async {
    final uploadTasks = files.map((file) => _uploadFile(file)).toList();

    // 使用 Semaphore 控制并发数
    final semaphore = Semaphore(maxConcurrentUploads);

    state = UploadState.uploading(
      totalFiles: files.length,
      completedFiles: 0,
      currentFile: files.first.name,
      progress: 0.0,
    );

    try {
      await Future.wait(uploadTasks.map((task) async {
        await semaphore.acquire();
        try {
          await task;
        } finally {
          semaphore.release();
        }
      }));

      state = UploadState.completed(files: files.map((f) => f.path).toList());
    } catch (e) {
      state = UploadState.failed(error: e.toString());
    }
  }

  Future<String> _uploadFile(File file) async {
    final progressController = StreamController<double>();

    // 监听上传进度
    ref.listen(progressController.stream, (progress) {
      final currentState = state.valueOrNull;
      if (currentState is Uploading) {
        state = currentState.copyWith(progress: progress);
      }
    });

    try {
      final url = await ref.watch(storageRepositoryProvider).uploadFile(
            file,
            onProgress: progressController.add,
          );

      final currentState = state.valueOrNull;
      if (currentState is Uploading) {
        state = currentState.copyWith(
          completedFiles: currentState.completedFiles + 1,
          currentFile: completedFiles < currentState.totalFiles
              ? files[currentState.completedFiles].name
              : null,
        );
      }

      return url;
    } finally {
      await progressController.close();
    }
  }
}

// 状态定义
@freezed
sealed class UploadState with _$UploadState {
  const factory UploadState.initial() = Initial;
  const factory UploadState.uploading({
    required int totalFiles,
    required int completedFiles,
    String? currentFile,
    required double progress,
  }) = Uploading;
  const factory UploadState.completed({required List<String> files}) = Completed;
  const factory UploadState.failed({required String error}) = Failed;
}
```

---

## 24. 企业级架构模式与微服务集成

### 24.1 Feature-Driven Architecture + Riverpod

```
lib/
├── core/
│   ├── design_system/           # 设计系统
│   │   ├── theme/
│   │   ├── components/
│   │   └── tokens/
│   ├── network/                 # 网络层
│   │   ├── interceptors/
│   │   ├── adapters/
│   │   └── error_handling/
│   ├── storage/                 # 存储层
│   │   ├── local/
│   │   ├── secure/
│   │   └── cloud/
│   └── utils/                   # 工具类
│       ├── validators/
│       ├── formatters/
│       └── extensions/
│
├── features/
│   ├── dashboard/               # 仪表盘模块
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   ├── repositories/
│   │   │   └── models/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── usecases/
│   │   │   └── repositories/
│   │   ├── presentation/
│   │   │   ├── providers/
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   └── routes/
│   │   └── providers.dart       # 模块导出
│   │
│   ├── analytics/               # 分析模块
│   ├── notifications/           # 通知模块
│   ├── settings/                # 设置模块
│   └── ...
│
├── shared/                      # 共享模块
│   ├── constants/
│   ├── routing/
│   └── providers/
│
└── main.dart
```

### 24.2 微服务 API Gateway 集成

```dart
// core/network/api_gateway.dart
@riverpod
ApiGateway apiGateway(ApiGatewayRef ref) {
  final config = ref.watch(apiConfigProvider);
  final authInterceptor = ref.watch(authInterceptorProvider);
  final loggingInterceptor = ref.watch(loggingInterceptorProvider);
  final retryInterceptor = ref.watch(retryInterceptorProvider);

  return ApiGatewayImpl(
    baseUrl: config.gatewayUrl,
    interceptors: [
      loggingInterceptor,
      authInterceptor,
      retryInterceptor,
      TimeoutInterceptor(timeout: const Duration(seconds: 30)),
    ],
    adapters: [
      GrpcAdapter(),
      RestAdapter(),
      WebSocketAdapter(),
    ],
  );
}

// 使用 Gateway 的 Repository
@riverpod
class MicroserviceRepository extends _$MicroserviceRepository {
  @override
  Future<MicroserviceRepository> build() async {
    final gateway = ref.watch(apiGatewayProvider);

    return CompositeMicroserviceRepository(
      userService: gateway.createClient<UserService>('user-service'),
      orderService: gateway.createClient<OrderService>('order-service'),
      inventoryService: gateway.createClient<InventoryService>('inventory-service'),
      notificationService: gateway.createClient<NotificationService>('notification-service'),
    );
  }
}

// 业务逻辑层
@riverpod
class OrderWorkflow extends _$OrderWorkflow {
  @override
  Future<WorkflowState> build(OrderContext context) async {
    return WorkflowState.initial(context);
  }

  Future<void> execute() async {
    final repository = ref.watch(microserviceRepositoryProvider.future);

    state = WorkflowState.validating(state.context);

    // 步骤 1: 验证用户权限
    final hasPermission = await repository.then(
      (repo) => repo.userService.checkPermission(
        userId: state.context.userId,
        permission: 'order:create',
      ),
    );

    if (!hasPermission && mounted) {
      state = WorkflowState.denied(reason: 'Insufficient permissions');
      return;
    }

    // 步骤 2: 检查库存
    state = WorkflowState.checkingInventory(state.context);

    final inventoryStatus = await repository.then(
      (repo) => repo.inventoryService.checkAvailability(
        items: state.context.items,
      ),
    );

    if (!inventoryStatus.available && mounted) {
      state = WorkflowState.outOfStock(unavailableItems: inventoryStatus.unavailableItems);
      return;
    }

    // 步骤 3: 预留库存
    state = WorkflowState.reservingInventory(state.context);

    final reservationId = await repository.then(
      (repo) => repo.inventoryService.reserve(
        items: state.context.items,
        ttl: const Duration(minutes: 15),
      ),
    );

    // 步骤 4: 处理支付
    state = WorkflowState.processingPayment(state.context);

    try {
      final paymentResult = await repository.then(
        (repo) => repo.orderService.processPayment(
          amount: state.context.totalAmount,
          method: state.context.paymentMethod,
          reservationId: reservationId,
        ),
      );
    } catch (e) {
      // 回滚库存预留
      await repository.then((repo) => repo.inventoryService.releaseReservation(reservationId));
      rethrow;
    }

    // 步骤 5: 创建订单
    state = WorkflowState.creatingOrder(state.context);

    final order = await repository.then(
      (repo) => repo.orderService.create(
        userId: state.context.userId,
        items: state.context.items,
        paymentId: paymentResult.id,
        reservationId: reservationId,
      ),
    );

    // 步骤 6: 发送通知
    unawaited(repository.then((repo) => repo.notificationService.send(
      type: 'order_created',
      recipients: [state.context.userId],
      data: {'orderId': order.id},
    )));

    state = WorkflowState.completed(order: order);
  }
}
```

### 24.3 Multi-Tenant 多租户支持

```dart
@riverpod
class TenantConfig extends _$TenantConfig {
  @override
  Future<TenantConfiguration> build(String tenantId) async {
    final config = await ref.watch(tenantRepositoryProvider).getConfig(tenantId);

    // 应用租户特定配置
    _applyTenantSpecificSettings(config);

    return config;
  }

  void _applyTenantSpecificSettings(TenantConfiguration config) {
    // 设置 API 基础 URL
    ref.read(apiBaseUrlProvider.notifier).state = config.apiBaseUrl;

    // 设置功能开关
    ref.read(featureFlagsProvider.notifier).state = config.featureFlags;

    // 设置主题
    ref.read(themeProvider.notifier).state = config.theme;

    // 设置国际化
    ref.read(localeProvider.notifier).state = config.defaultLocale;
  }
}

// 租户感知的 Provider
@riverpod
TenantAwareRepository tenantAwareRepository(TenantAwareRepositoryRef ref) {
  final tenantId = ref.watch(currentTenantProvider);
  final baseRepository = ref.watch(baseRepositoryProvider);

  return TenantAwareRepositoryDecorator(
    delegate: baseRepository,
    tenantId: tenantId,
    headers: {
      'X-Tenant-ID': tenantId,
      'X-Tenant-Config-Version': ref.watch(tenantConfigProvider(tenantId)).valueOrNull?.version ?? '1',
    },
  );
}
```

### 24.4 Event-Driven Architecture 事件驱动架构

```dart
// 核心事件总线
@riverpod
EventBus eventBus(EventBusRef ref) {
  final bus = EventBus();

  ref.onDispose(() => bus.dispose());

  return bus;
}

// 事件定义
sealed class AppEvent {
  const AppEvent();
}

class UserLoggedIn extends AppEvent {
  final User user;
  const UserLoggedIn(this.user);
}

class OrderPlaced extends AppEvent {
  final Order order;
  const OrderPlaced(this.order);
}

class PaymentFailed extends AppEvent {
  final String reason;
  const PaymentFailed(this.reason);
}

// 事件处理器
@riverpod
class EventHandler extends _$EventHandler {
  @override
  void build() {
    final bus = ref.watch(eventBusProvider);

    // 注册事件处理器
    bus.on<UserLoggedIn>(_handleUserLogin);
    bus.on<OrderPlaced>(_handleOrderPlaced);
    bus.on<PaymentFailed>(_handlePaymentFailed);

    ref.onDispose(() {
      bus.off<UserLoggedIn>(_handleUserLogin);
      bus.off<OrderPlaced>(_handleOrderPlaced);
      bus.off<PaymentFailed>(_handlePaymentFailed);
    });
  }

  void _handleUserLogin(UserLoggedIn event) async {
    // 更新用户状态
    ref.read(userProvider.notifier).state = event.user;

    // 初始化用户相关数据
    unawaited(ref.read(cartProvider.notifier).load());
    unawaited(ref.read(notificationsProvider.notifier).load());

    // 记录分析事件
    ref.read(analyticsProvider).login(userId: event.user.id);

    // 同步用户偏好设置
    final prefs = await ref.read(preferencesRepositoryProvider).get(event.user.id);
    if (prefs != null) {
      ref.read(themeProvider.notifier).state = prefs.theme;
      ref.read(localeProvider.notifier).state = prefs.locale;
    }
  }

  void _handleOrderPlaced(OrderPlaced event) async {
    // 更新订单历史
    ref.read(orderHistoryProvider.notifier).add(event.order);

    // 发送确认通知
    ref.read(notificationServiceProvider).sendOrderConfirmation(event.order.id);

    // 更新库存缓存
    ref.invalidate(inventoryProvider);

    // 触发成就检查
    unawaited(ref.read(achievementProvider.notifier).checkAchievements(event.order));

    // 记录分析事件
    ref.read(analyticsProvider).purchase(orderId: event.order.id, value: event.order.total);
  }

  void _handlePaymentFailed(PaymentFailed event) {
    // 显示错误提示
    ref.read(toastProvider).showError('支付失败: ${event.reason}');

    // 记录错误日志
    ref.read(loggerProvider).error('Payment failed', error: event.reason);

    // 分析追踪
    ref.read(analyticsProvider).event(name: 'payment_failed', properties: {'reason': event.reason});
  }
}

// 在业务逻辑中发布事件
@riverpod
class OrderNotifier extends _$OrderNotifier {
  @override
  Future<OrderState> build() {
    final bus = ref.watch(eventBusProvider);
    ref.onDispose(() => /* 清理 */);

    return OrderState.initial();
  }

  Future<void> placeOrder(OrderRequest request) async {
    state = const OrderState.loading();

    try {
      final order = await _processOrder(request);

      // 发布事件，让其他模块响应
      ref.read(eventBusProvider).emit(OrderPlaced(order));

      state = OrderState.success(order);
    } catch (e) {
      // 发布失败事件
      ref.read(eventBusProvider).emit(PaymentFailed(e.toString()));

      state = OrderState.error(e.toString());
    }
  }
}
```

---

## 25. 性能监控、调试工具与错误追踪

### 25.1 Riverpod DevTools 集成

```dart
void main() {
  runApp(
    ProviderScope(
      observers: [
        // 开发环境启用详细日志
        if (kDebugMode) RiverpodLogger(),

        // 性能监控
        RiverpodPerformanceMonitor(),

        // 错误追踪
        RiverpodErrorTracker(sentry: SentryClient()),
      ],
      child: MyApp(),
    ),
  );
}

// 日志观察者
class RiverpodObserver extends ProviderObserver {
  @override
  void didAddProvider(
    ProviderBase<Object?> provider,
    Object? value,
    ProviderContainer container,
  ) {
    log('[ADD] $provider → $value');
  }

  @override
  void didDisposeProvider(
    ProviderBase<Object?> provider,
    ProviderContainer container,
  ) {
    log('[DISPOSE] $provider');
  }

  @override
  void didUpdateProvider(
    ProviderBase<Object?> provider,
    Object? previousValue,
    Object? newValue,
    ProviderContainer container,
  ) {
    if (provider.name == 'counterProvider') {
      log('[UPDATE] $provider: $previousValue → $newValue');
    }
  }

  @override
  void providerDidFail(
    ProviderBase<Object?> provider,
    Object error,
    StackTrace stackTrace,
    ProviderContainer container,
  ) {
    log('[FAIL] $provider: $error\n$stackTrace');
  }
}
```

### 25.2 性能分析仪表板

```dart
@riverpod
class PerformanceDashboard extends _$PerformanceDashboard {
  final _metrics = <String, PerformanceMetric>{};

  @override
  Stream<PerformanceReport> build() {
    // 每 10 秒收集一次性能数据
    return Stream.periodic(const Duration(seconds: 10), (_) {
      return PerformanceReport(
        timestamp: DateTime.now(),
        providerMetrics: Map.from(_metrics),
        memoryUsage: _getMemoryUsage(),
        rebuildCount: _getRebuildCount(),
      );
    });
  }

  void recordMetric(String providerName, Duration duration) {
    _metrics[providerName] ??= PerformanceMetric(providerName: providerName);
    _metrics[providerName]!.record(duration);
  }

  double _getMemoryUsage() {
    // 获取当前内存使用情况
    return ProcessInfo.currentRss / (1024 * 1024); // MB
  }

  int _getRebuildCount() {
    // 统计 rebuild 次数
    return _metrics.values.fold(0, (sum, metric) => sum + metric.callCount);
  }
}

// 使用装饰器包装 Provider 以收集性能指标
class MonitoredNotifier<T> extends Notifier<T> {
  late final Stopwatch _stopwatch;
  late final String _providerName;

  @override
  T build() {
    _providerName = runtimeType.toString();
    _stopwatch = Stopwatch();

    ref.onDispose(() {
      final elapsed = _stopwatch.elapsedMilliseconds;
      ref.read(performanceDashboardProvider.notifier)
          .recordMetric(_providerName, Duration(milliseconds: elapsed));
    });

    _stopwatch.start();
    return initialValue;
  }

  T get initialValue => throw UnimplementedError('Must implement');
}
```

### 25.3 内存泄漏检测

```dart
@riverpod
class LeakDetector extends _$LeakDetector {
  final _activeProviders = <String, int>{};
  final _providerStackTraces = <String, StackTrace>{};

  @override
  Stream<LeakReport> build() {
    // 定期检查泄漏
    return Stream.periodic(const Duration(seconds: 30), (_) {
      final leaks = <LeakInfo>[];

      _activeProviders.forEach((name, count) {
        if (count > _expectedMaxInstances(name)) {
          leaks.add(LeakInfo(
            providerName: name,
            instanceCount: count,
            expectedMax: _expectedMaxInstances(name),
            createdAt: _providerStackTraces[name],
          ));
        }
      });

      return LeakReport(
        timestamp: DateTime.now(),
        potentialLeaks: leaks,
        totalProviders: _activeProviders.length,
      );
    });
  }

  int _expectedMaxInstances(String providerName) {
    // 根据经验或配置返回预期的最大实例数
    if (providerName.contains('Family')) return 20;
    if (providerName.contains('Dialog')) return 5;
    return 1;
  }

  void trackProviderCreation(String name) {
    _activeProviders[name] = (_activeProviders[name] ?? 0) + 1;
    _providerStackTraces[name] = StackTrace.current;
  }

  void trackProviderDisposal(String name) {
    _activeProviders[name] = (_activeProviders[name] ?? 1) - 1;
    if (_activeProviders[name] <= 0) {
      _activeProviders.remove(name);
      _providerStackTraces.remove(name);
    }
  }
}

// 自动跟踪的 Mixin
mixin ProviderLifecycleTracking on Notifier {
  late final String _trackingId;

  @override
  build() {
    _trackingId = '${runtimeType}_${DateTime.now().millisecondsSinceEpoch}';

    ref.read(leakDetectorProvider.notifier).trackProviderCreation(_trackingId);

    ref.onDispose(() {
      ref.read(leakDetectorProvider.notifier).trackProviderDisposal(_trackingId);
    });

    return super.build();
  }
}
```

### 25.4 集成 Sentry 错误追踪

```dart
@riverpod
SentryClient sentryClient(SentryClientRef ref) {
  final config = ref.watch(appConfigProvider);

  return SentryClient(
    dsn: config.sentryDsn,
    environment: config.environment,
    release: config.version,
    beforeSend: (event, hint) {
      // 过滤敏感信息
      return _filterSensitiveData(event);
    },
    tracesSampleRate: 1.0, // 开发环境 100% 采样
  );
}

// Riverpod 错误报告器
@riverpod
class RiverpodErrorReporter extends _$RiverpodErrorReporter {
  @override
  void build() {
    final sentry = ref.watch(sentryClientProvider);

    // 全局错误捕获
    ref.onError((error, stackTrace) {
      _reportError(error, stackTrace, sentry);
    });
  }

  void _reportError(Object error, StackTrace? stackTrace, SentryClient sentry) {
    final breadcrumb = Breadcrumb(
      category: 'riverpod',
      message: 'Provider error',
      level: BreadcrumbLevel.error,
      data: {
        'error_type': error.runtimeType.toString(),
        'error_message': error.toString(),
      },
    );

    sentry.captureException(
      error: error,
      stackTrace: stackTrace,
      withScope: (scope) {
        scope.setBreadcrumb(breadcrumb);
        scope.setTag('source', 'riverpod');
        scope.setExtra('provider_context', {
          'state': state.toString(),
          'timestamp': DateTime.now().toIso8601String(),
        });
      },
    );
  }
}
```

---

## 26. 团队协作规范与 Code Review 检查清单

### 26.1 Riverpod 代码规范

#### 文件组织规范

```dart
// ✅ 正确的文件命名和组织
// providers/auth/
//   ├── auth_provider.dart          # 主要 Provider 定义
//   ├── auth_state.dart             # 状态类定义
//   └── auth_provider.g.dart       # 生成的代码（不要提交到 Git）

// providers/auth/auth_provider.dart
part 'auth_provider.g.dart';
part 'auth_state.dart';  // 如果状态复杂，单独文件

@riverpod
class AuthNotifier extends _$AuthNotifier {
  // 实现...
}
```

#### 命名规范

```dart
// ✅ 正确命名
@riverpod
class UserProfileNotifier extends _$UserProfileNotifier { }  // 类名: *Notifier
final userProfileProvider = ...;                             // 变量名: *Provider

@riverpod
Future<User> fetchUser(FetchUserRef ref, String id) { }     // 函数名: 动词开头
final fetchUserProvider = ...;                               // 变量名: 函数名+Provider

// ❌ 错误命名
@riverpod
class UserData extends _$UserData { }                        // 缺少 Notifier 后缀
final userProfileData = ...;                                 // 不一致的命名
```

#### 注释规范

```dart
/// 认证状态管理
///
/// 负责管理用户的认证状态，包括登录、登出、token 刷新等。
///
/// 使用示例:
/// ```dart
/// final authState = ref.watch(authNotifierProvider);
/// ```
///
/// 依赖:
/// - [AuthRepository] 用于认证操作
/// - [TokenStorage] 用于 token 存储
@riverpod
class AuthNotifier extends _$AuthNotifier {
  /// 初始化认证状态
  ///
  /// 尝试从本地存储恢复登录状态，
  /// 如果 token 有效则自动设置为已认证状态。
  @override
  AuthState build() {
    // 实现细节注释要简洁明了
    ref.onDispose(() => _cleanup());
    return _initializeFromStorage();
  }

  /// 用户登录
  ///
  /// [email] 用户邮箱地址
  /// [password] 用户密码
  ///
  /// 抛出 [AuthenticationException] 当认证失败时
  Future<void> login(String email, String password) async {
    // ...
  }
}
```

### 26.2 Code Review 检查清单

#### Provider 定义检查 ☑️

```markdown
## Provider Review Checklist

### 基本规范
- [ ] 是否使用 `@riverpod` 注解？
- [ ] 是否包含 `part '*.g.dart'`？
- [ ] 命名是否符合规范（*Notifier, *Provider）？
- [ ] 是否有必要的文档注释？

### 状态管理
- [ ] `build()` 方法是否只做初始化工作？
- [ ] 是否避免在 `build()` 中执行副作用？
- [ ] 异步操作后是否检查 `ref.mounted`？
- [ ] 状态更新是否创建新实例（不可变性）？

### 错误处理
- [ ] 异步方法是否使用 `AsyncValue.guard()`？
- [ ] 是否有自定义错误类型？
- [ ] 错误信息对用户是否友好？

### 性能优化
- [ ] UI 层是否使用 `select()` 减少重建？
- [ ] Family 参数设计是否合理？
- [ ] 是否需要 `autoDispose` 或缓存配置？

### 测试覆盖
- [ ] 是否有对应的单元测试？
- [ ] 是否测试了正常流程和错误场景？
- [ ] Mock 是否正确实现依赖接口？

### 安全性
- [ ] 敏感数据是否加密存储？
- [ ] API 调用是否有认证拦截器？
- [ ] 是否有权限检查？
```

#### 架构审查要点 🔍

```markdown
## Architecture Review Points

### 分层合规性
- [ ] Provider 是否在正确的分层？（data/domain/presentation）
- [ ] 是否违反了依赖方向规则？
- [ ] 抽象接口是否合理？

### 依赖关系
- [ ] 循环依赖是否存在？
- [ ] Provider 组合是否过于复杂？
- [ ] 是否有过度拆分或过度合并的情况？

### 可维护性
- [ ] 单个文件是否过长（建议 <300 行）？
- [ ] 单个 Provider 职责是否清晰？
- [ ] 是否容易理解和测试？

### 可扩展性
- [ ] 新增功能是否方便？
- [ ] 是否支持多环境配置？
- [ ] 是否考虑了未来需求变化？
```

### 26.3 Git 工作流集成

```yaml
# .github/workflows/riverpod_review.yml
name: Riverpod Code Review

on:
  pull_request:
    paths:
      - '**/*_provider.dart'
      - '**/providers/**'

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          channel: 'stable'

      - name: Install dependencies
        run: flutter pub get

      - name: Run code generation
        run: dart run build_runner build --delete-conflicting-outputs

      - name: Analyze code
        run: dart analyze --fatal-infos

      - name: Run Riverpod lints
        run: dart run custom_lint

      - name: Run tests
        run: flutter test --coverage

      - name: Check coverage
        uses: VeryGoodOpenSource/very_good_coverage@v2
        with:
          min_coverage: 80

      - name: Comment PR
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const coverage = fs.readFileSync('coverage/lcov.info', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 📊 Riverpod Code Review Report\n\n`
                     + `- **Analysis**: ✅ Passed\n`
                     + `- **Lint**: ✅ Passed\n`
                     + `- **Tests**: ✅ Passed\n`
                     + `- **Coverage**: ${coverage}% 🎯\n\n`
                     + `---\n`
                     + `*Generated by Riverpod Review Bot*`
            });
```

---

## 27. 完整测试策略与 E2E 测试

### 27.1 测试金字塔

```
                    ╱╲
                   ╱E2E╲                    ← 少量端到端测试
                  ╱─────╲
                 ╱Integration╲              ← 集成测试
                ╱───────────╲
               ╱   Widget     ╲             ← Widget 测试
              ╱───────────────╲
             ╱    Unit         ╲            ← 大量单元测试
            ╱─────────────────╲
           ╱   Provider Tests  ╲          ← Provider 单元测试
          ╱───────────────────╲
```

### 27.2 Provider 单元测试完整示例

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

// Mock 类
class MockAuthRepository extends Mock implements AuthRepository {}
class MockLocalStorage extends Mock implements LocalStorage {}

void main() {
  group('AuthNotifier', () {
    late MockAuthRepository mockAuthRepo;
    late MockLocalStorage mockLocalStorage;

    setUp(() {
      mockAuthRepo = MockAuthRepository();
      mockLocalStorage = MockLocalStorage();
    });

    group('initial state', () {
      test('should be in initial state when no saved session', () async {
        // Arrange
        when(() => mockLocalStorage.getSavedSession())
            .thenAnswer((_) async => null);

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // Act
        final state = container.read(authNotifierProvider);

        // Assert
        expect(state, const AuthState.initial());

        addTearDown(container.dispose);
      });

      test('should restore session when valid token exists', () async {
        // Arrange
        final savedSession = SavedSession(token: 'valid_token', expiresAt: DateTime.now().add(Duration(days: 1)));
        when(() => mockLocalStorage.getSavedSession())
            .thenAnswer((_) async => savedSession);
        when(() => mockAuthRepo.validateToken('valid_token'))
            .thenAnswer((_) async => true);
        when(() => mockAuthRepo.getCurrentUser())
            .thenAnswer((_) async => User(id: '1', name: 'Test'));

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // Act
        final stateAsync = container.read(authNotifierProvider);

        // Assert
        expect(stateAsync.isLoading, true);

        await container.pump(); // 等待异步完成

        final updatedState = container.read(authNotifierProvider);
        expect(updatedState, AuthState.authenticated(User(id: '1', name: 'Test')));

        addTearDown(container.dispose);
      });
    });

    group('login', () {
      test('should login successfully with valid credentials', () async {
        // Arrange
        when(() => mockAuthRepo.login('test@example.com', 'password123'))
            .thenAnswer((_) async => User(id: '1', name: 'Test User'));
        when(() => mockLocalStorage.saveSession(any()))
            .thenAnswer((_) async {});

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // Act
        await container.read(authNotifierProvider.notifier)
            .login('test@example.com', 'password123');

        // Assert
        final state = container.read(authNotifierProvider);
        expect(state, AuthState.authenticated(User(id: '1', name: 'Test User')));

        verify(() => mockAuthRepo.login('test@example.com', 'password123')).called(1);
        verify(() => mockLocalStorage.saveSession(any())).called(1);

        addTearDown(container.dispose);
      });

      test('should fail with invalid credentials', () async {
        // Arrange
        when(() => mockAuthRepo.login('wrong@email.com', 'wrong'))
            .thenThrow(AuthenticationException.invalidCredentials());

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // Act & Assert
        await expectLater(
          container.read(authNotifierProvider.notifier)
              .login('wrong@email.com', 'wrong'),
          throwsA(isA<AuthenticationException>()),
        );

        final state = container.read(authNotifierProvider);
        expect(state, isA<AuthError>());

        addTearDown(container.dispose);
      });

      test('should show loading state during login', () async {
        // Arrange
        final completer = Completer<User>();
        when(() => mockAuthRepo.login(any(), any()))
            .thenAnswer((_) => completer.future);

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // 开始登录（不等待完成）
        final future = container.read(authNotifierProvider.notifier)
            .login('test@example.com', 'password123');

        // 检查加载状态
        await container.pump();
        let loadingState = container.read(authNotifierProvider);
        expect(loadingState, const AuthState.loading());

        // 完成登录
        completer.complete(User(id: '1', name: 'Test'));
        await future;

        // 检查最终状态
        final finalState = container.read(authNotifierProvider);
        expect(finalState, AuthState.authenticated(User(id: '1', name: 'Test')));

        addTearDown(container.dispose);
      });
    });

    group('logout', () {
      test('should clear session and state on logout', () async {
        // Arrange
        when(() => mockAuthRepo.logout())
            .thenAnswer((_) async {});
        when(() => mockLocalStorage.clearSession())
            .thenAnswer((_) async {});

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // 先登录
        container.read(authNotifierProvider.notifier)
            .emit(AuthState.authenticated(User(id: '1', name: 'Test')));

        // Act
        await container.read(authNotifierProvider.notifier).logout();

        // Assert
        final state = container.read(authNotifierProvider);
        expect(state, const AuthState.unauthenticated());

        verify(() => mockAuthRepo.logout()).called(1);
        verify(() => mockLocalStorage.clearSession()).called(1);

        addTearDown(container.dispose);
      });
    });

    group('side effects', () {
      test('should invalidate dependent providers on logout', () async {
        // Arrange
        when(() => mockAuthRepo.logout())
            .thenAnswer((_) async {});
        when(() => mockLocalStorage.clearSession())
            .thenAnswer((_) async {});

        final container = ProviderContainer(
          overrides: [
            authRepositoryProvider.overrideWith((ref) => mockAuthRepo),
            localStorageProvider.overrideWith((ref) => mockLocalStorage),
          ],
        );

        // 监听其他 Provider 的失效
        var cartInvalidated = false;
        var notificationsInvalidated = false;

        container.listen<AsyncValue<Cart>>(cartProvider, (prev, next) {
          cartInvalidated = true;
        });

        container.listen<AsyncValue<List<Notification>>>(notificationsProvider, (prev, next) {
          notificationsInvalidated = true;
        });

        // Act
        await container.read(authNotifierProvider.notifier).logout();

        // Assert
        expect(cartInvalidated, true);
        expect(notificationsInvalidated, true);

        addTearDown(container.dispose);
      });
    });
  });
}
```

### 27.3 Widget 测试完整示例

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  group('LoginPage', () {
    late MockAuthNotifier mockAuthNotifier;

    setUp(() {
      mockAuthNotifier = MockAuthNotifier();
    });

    Widget buildSubject() {
      return ProviderScope(
        overrides: [
          authNotifierProvider.overrideWith((ref) => mockAuthNotifier),
        ],
        child: MaterialApp(home: LoginPage()),
      );
    }

    testWidgets('renders login form correctly', (tester) async {
      await tester.pumpWidget(buildSubject());

      // 检查基本元素存在
      expect(find.text('Welcome Back'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2));
      expect(find.byType(FilledButton), findsOneWidget);
    });

    testWidgets('shows validation errors for empty fields', (tester) async {
      await tester.pumpWidget(buildSubject());

      // 点击登录按钮（不填写表单）
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // 应该显示验证错误
      expect(find.text('Please enter your email'), findsOneWidget);
      expect(find.text('Please enter your password'), findsOneWidget);
    });

    testWidgets('shows validation error for invalid email', (tester) async {
      await tester.pumpWidget(buildSubject());

      // 输入无效邮箱
      await tester.enterText(find.byKey(Key('email_field')), 'invalid-email');
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.text('Please enter a valid email'), findsOneWidget);
    });

    testWidgets('calls login on valid form submission', (tester) async {
      // Arrange
      when(() => mockAuthNotifier.login(any(), any()))
          .thenAnswer((_) async {});

      await tester.pumpWidget(buildSubject());

      // 填写表单
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');

      // 提交
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // 验证调用
      verify(() => mockAuthNotifier.login('test@example.com', 'password123')).called(1);
    });

    testWidgets('shows loading indicator during login', (tester) async {
      // Arrange
      final completer = Completer<void>();
      when(() => mockAuthNotifier.login(any(), any()))
          .thenAnswer((_) => completer.future);

      await tester.pumpWidget(buildSubject());

      // 填写并提交
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');
      await tester.tap(find.byType(FilledButton));
      await tester.pump(); // 触发一帧

      // 应该显示加载指示器
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.byIcon(Icons.visibility), findsNothing); // 按钮应该被禁用

      // 完成
      completer.complete();
      await tester.pumpAndSettle();
    });

    testWidgets('navigates to home on successful login', (tester) async {
      // Arrange
      when(() => mockAuthNotifier.login(any(), any()))
          .thenAnswer((_) async {
        // 模拟状态变化
        mockAuthNotifier.emit(AuthState.authenticated(User(id: '1', name: 'Test')));
      });

      await tester.pumpWidget(buildSubject());

      // 提交表单
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // 应该导航到首页
      expect(find.byType(HomePage), findsOneWidget);
    });

    testWidgets('shows error message on login failure', (tester) async {
      // Arrange
      when(() => mockAuthNotifier.login(any(), any()))
          .thenThrow(AuthenticationException.invalidCredentials());

      await tester.pumpWidget(buildSubject());

      // 提交表单
      await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(Key('password_field')), 'password123');
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      // 应该显示错误消息
      expect(find.textContaining('invalid credentials'), findsOneWidget);
    });

    testWidgets('toggles password visibility', (tester) async {
      await tester.pumpWidget(buildSubject());

      // 密码字段默认应该是隐藏的
      var passwordField = tester.widget<TextField>(find.byKey(Key('password_field')));
      expect(passwordField.obscureText, true);

      // 点击眼睛图标
      await tester.tap(find.byIcon(Icons.visibility_off));
      await tester.pump();

      // 密码字段应该可见
      passwordField = tester.widget<TextField>(find.byKey(Key('password_field')));
      expect(passwordField.obscureText, false);

      // 再次点击
      await tester.tap(find.byIcon(Icons.visibility));
      await tester.pump();

      // 密码字段应该再次隐藏
      passwordField = tester.widget<TextField>(find.byKey(Key('password_field')));
      expect(passwordField.obscureText, true);
    });
  });
}
```

### 27.4 Integration Test 集成测试

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:myapp/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('End-to-End Authentication Flow', () {
    testWidgets('complete login and logout flow', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 1. 应该看到登录页面
      expect(find.text('Welcome Back'), findsOneWidget);
      expect(find.byType(LoginPage), findsOneWidget);

      // 2. 填写无效表单并验证
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle();

      expect(find.text('Please enter your email'), findsOneWidget);

      // 3. 填写有效表单
      await tester.enterText(
        find.byType(TextFormField).first,
        'testuser@example.com',
      );
      await tester.enterText(
        find.byType(TextFormField).last,
        'securepassword123',
      );
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle(Duration(seconds: 3)); // 等待网络请求

      // 4. 应该导航到首页
      expect(find.byType(HomePage), findsOneWidget);
      expect(find.text('Welcome, Test User!'), findsOneWidget);

      // 5. 测试侧边栏菜单
      await tester.tap(find.byIcon(Icons.menu));
      await tester.pumpAndSettle();

      expect(find.text('Logout'), findsOneWidget);

      // 6. 登出
      await tester.tap(find.text('Logout'));
      await tester.pumpAndSettle(Duration(seconds: 2));

      // 7. 应该回到登录页面
      expect(find.byType(LoginPage), findsOneWidget);
      expect(find.text('Welcome Back'), findsOneWidget);
    });

    testWidgets('handles network errors gracefully', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 模拟离线状态（通过 mocking 或实际关闭网络）
      // 这里假设有切换网络状态的按钮

      await tester.enterText(
        find.byType(TextFormField).first,
        'test@example.com',
      );
      await tester.enterText(
        find.byType(TextFormField).last,
        'password123',
      );
      await tester.tap(find.byType(FilledButton));
      await tester.pumpAndSettle(Duration(seconds: 5));

      // 应该显示友好的错误消息
      expect(
        find.textContaining('network'),
        findsOneWidget,
        reason: 'Should show network error message',
      );

      // 应用不应该崩溃
      expect(find.byType(LoginPage), findsOneWidget);
    });
  });

  group('CRUD Operations Flow', () {
    testWidgets('create, read, update, delete todo item', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 登录
      await _login(tester);
      await tester.pumpAndSettle();

      // 导航到 TODO 页面
      await tester.tap(find.text('Todos'));
      await tester.pumpAndSettle();

      // 创建 TODO
      await tester.tap(find.byIcon(Icons.add));
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'Buy groceries');
      await tester.tap(find.text('Add'));
      await tester.pumpAndSettle();

      // 验证创建
      expect(find.text('Buy groceries'), findsOneWidget);

      // 更新 TODO（标记完成）
      await tester.tap(find.byType(Checkbox));
      await tester.pumpAndSettle();

      var todoItem = tester.widget<ListTile>(
        find.ancestor(of: find.text('Buy groceries'), matching: find.byType(ListTile)),
      );
      expect(todoItem.title!.style?.decoration, isNotNull); // 应该有删除线

      // 删除 TODO
      await tester.drag(find.text('Buy groceries'), Offset(-500, 0));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();

      // 验证删除
      expect(find.text('Buy groceries'), findsNothing);
    });
  });
}

Future<void> _login(WidgetTester tester) async {
  await tester.enterText(
    find.byType(TextFormField).first,
    'test@example.com',
  );
  await tester.enterText(
    find.byType(TextFormField).last,
    'password123',
  );
  await tester.tap(find.byType(FilledButton));
  await tester.pumpAndSettle(Duration(seconds: 3));
}
```

### 27.5 性能测试

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  group('Performance Tests', () {
    test('provider should not rebuild unnecessarily', () async {
      final container = ProviderContainer.test();
      var rebuildCount = 0;

      container.listen<int>(counterProvider, (prev, next) {
        rebuildCount++;
      });

      // 多次读取相同的值
      for (var i = 0; i < 100; i++) {
        container.read(counterProvider);
      }

      // 应该没有触发任何重建
      expect(rebuildCount, 0);

      // 只有一次实际的修改
      container.read(counterProvider.notifier).increment();
      expect(rebuildCount, 1);

      addTearDown(container.dispose);
    });

    test('select should filter updates correctly', () async {
      final container = ProviderContainer.test();
      var nameUpdateCount = 0;
      var ageUpdateCount = 0;

      container.listen<String>(
        userProvider.select((u) => u.name),
        (prev, next) => nameUpdateCount++,
      );

      container.listen<int>(
        userProvider.select((u) => u.age),
        (prev, next) => ageUpdateCount++,
      );

      // 只更新 name
      container.read(userProvider.notifier).updateName('New Name');

      expect(nameUpdateCount, 1);
      expect(ageUpdateCount, 0); // age 不应该更新

      // 只更新 age
      container.read(userProvider.notifier).updateAge(25);

      expect(nameUpdateCount, 1); // name 不应该再次更新
      expect(ageUpdateCount, 1);

      addTearDown(container.dispose);
    });

    testWidgets('widget should not rebuild more than necessary', (tester) async {
      var buildCount = 0;

      await tester.pumpWidget(
        ProviderScope(
          child: Builder(
            builder: (context) {
              buildCount++;
              return TestWidget();
            },
          ),
        ),
      );

      // 初始构建
      expect(buildCount, greaterThanOrEqualTo(1));

      // 触发一个不相关的 Provider 变化
      final container = ProviderScope.containerOf(tester.element(find.byType(TestWidget)));
      container.read(unrelatedProvider.notifier).update('new value');
      await tester.pump();

      // TestWidget 不应该重建
      final buildsAfterUnrelatedChange = buildCount;
      expect(buildsAfterUnrelatedChange, equals(1));

      // 触发相关的 Provider 变化
      container.read(counterProvider.notifier).increment();
      await tester.pump();

      // TestWidget 应该重建
      expect(buildCount, greaterThan(buildsAfterUnrelatedChange));
    });
  });
}
```

---

## 附录：快速参考卡

### A. 常用代码模板

```dart
// ========== 同步 Notifier ==========
@riverpod
class MyNotifier extends _$MyNotifier {
  @override
  StateType build() {
    // 初始化逻辑
    ref.onDispose(() => /* 清理资源 */);
    return initialState;
  }

  void action() {
    state = newState; // 更新状态
  }
}

// ========== 异步 Notifier ==========
@riverpod
class MyAsyncNotifier extends _$MyAsyncNotifier {
  @override
  Future<StateType> build() async {
    // 异步初始化
    return await loadData();
  }

  Future<void> action() async {
    state = const AsyncLoading<StateType>().copyWithPrevious(state);
    state = await AsyncValue.guard(() async {
      // 可能抛出异常的操作
      return result;
    });
  }
}

// ========== 函数式 Provider ==========
@riverpod
ReturnType myFunction(MyFunctionRef ref) {
  final dependency = ref.watch(otherProvider);
  return compute(dependency);
}

// ========== Family Provider ==========
@riverpod
ReturnType parameterized(ParameterizedRef ref, ParamType param) {
  return process(param);
}

// ========== ConsumerWidget ==========
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(myNotifierProvider);
    
    return state.when(
      data: (data) => DataWidget(data: data),
      loading: () => LoadingWidget(),
      error: (error, stack) => ErrorWidget(error: error),
    );
  }
}
```

### B. 常用 Ref 方法速查

| 方法 | 用途 | 示例 |
|------|------|------|
| `ref.watch()` | 监听并订阅 Provider | `ref.watch(counterProvider)` |
| `ref.read()` | 读取但不订阅 | `ref.read(counterProvider.notifier)` |
| `ref.invalidate()` | 使 Provider 失效 | `ref.invalidate(dataProvider)` |
| `ref.refresh()` | 强制刷新 | `await ref.refresh(dataProvider)` |
| `ref.listen()` | 监听变化并回调 | `ref.listen(provider, callback)` |
| `ref.mounted` | 检查是否挂载 | `if (ref.mounted) { ... }` |
| `ref.onDispose()` | 注册清理回调 | `ref.onDispose(() => dispose())` |

### C. 迁移速查表

| Riverpod 2.x | Riverpod 3.0 |
|--------------|-------------|
| `StateProvider<T>` | `Notifier<T>` |
| `StateNotifierProvider<S, T>` | `NotifierProvider<N, T>` |
| `AutoDisposeNotifier<T>` | `@riverpod` + `@KeepAlive()` |
| `context.read(provider)` | `ref.read(provider)` |
| `context.watch(provider)` | `ref.watch(provider)` |
| 无 | `ref.mounted` |
| 无 | `retry:` 参数 |
| 无 | `Mutations` |
| 无 | `Runs` |

---

**文档版本**: 3.0.0  
**最后更新**: 2025-01-09  
**作者**: Riverpod 学习小组  
**适用版本**: Flutter 3.x / Dart 3.x / Riverpod ^3.0.0

**反馈与贡献**: 如有问题或建议，欢迎提交 Issue 或 PR！
