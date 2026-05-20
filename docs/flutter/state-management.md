# Flutter 状态管理 - 从 setState 到 Provider 🔄

## 1. 什么是状态管理？

**状态 (State)**: 应用中可变的数据，如用户信息、购物车数据、主题设置等。

**状态管理**: 如何高效、可维护地管理和更新这些状态。

### 1.1 为什么需要状态管理？

```dart
// ❌ 问题：状态分散在多个组件中
class PageA extends StatefulWidget {
  int _counter = 0;
}

class PageB extends StatefulWidget {
  int _counter = 0; // 重复的状态
}

// ✅ 解决：集中管理状态
class CounterProvider extends ChangeNotifier {
  int _counter = 0;
  int get counter => _counter;
  
  void increment() {
    _counter++;
    notifyListeners();
  }
}
```

### 1.2 状态分类

- **临时状态**: 只在当前页面有效，如输入框内容
- **应用状态**: 全局共享，如用户信息、主题设置

## 2. setState - 最基础的状态管理

### 2.1 基本用法

```dart
class CounterApp extends StatefulWidget {
  @override
  State<CounterApp> createState() => _CounterAppState();
}

class _CounterAppState extends State<CounterApp> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('计数器')),
      body: Center(child: Text('$_counter')),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### 2.2 setState 原理

```dart
// setState 源码简化版
void setState(VoidCallback fn) {
  fn();  // 先执行回调，修改状态
  markNeedsBuild();  // 标记需要重建
}
```

### 2.3 最佳实践

```dart
// ✅ 正确：在 setState 中同步修改状态
setState(() {
  _counter++;
});

// ❌ 错误：异步修改后调用 setState
someAsyncOperation().then((value) {
  _value = value;
  setState(() {}); // 可能已经 dispose
});

// ✅ 正确：检查是否 mounted
someAsyncOperation().then((value) {
  if (!mounted) return;
  setState(() {
    _value = value;
  });
});

// ✅ 更好：使用 async/await
Future<void> loadData() async {
  final data = await fetchData();
  if (!mounted) return;
  setState(() {
    _data = data;
  });
}
```

### 2.4 性能优化

```dart
// ❌ 避免：不必要的 setState
@override
Widget build(BuildContext context) {
  print('build'); // 会频繁打印
  return Container();
}

// ✅ 拆分小组件，减少重建范围
class ParentWidget extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        StaticWidget(),  // 不依赖状态的组件
        DynamicWidget(), // 只有这个需要重建
      ],
    );
  }
}
```

## 3. 状态提升 (State Lifting)

### 3.1 父子组件状态共享

```dart
// 父组件持有状态
class ParentWidget extends StatefulWidget {
  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
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
        DisplayWidget(count: _counter),
        IncrementButton(onIncrement: _increment),
      ],
    );
  }
}

// 子组件通过参数接收状态
class DisplayWidget extends StatelessWidget {
  final int count;

  const DisplayWidget({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Text('计数：$count');
  }
}

class IncrementButton extends StatelessWidget {
  final VoidCallback onIncrement;

  const IncrementButton({super.key, required this.onIncrement});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onIncrement,
      child: Text('+1'),
    );
  }
}
```

### 3.2 跨层级状态共享

```dart
// 通过构造函数层层传递
class GrandParentWidget extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return ParentWidget(
      onAction: () {
        setState(() {
          // 更新状态
        });
      },
    );
  }
}

class ParentWidget extends StatelessWidget {
  final VoidCallback onAction;

  const ParentWidget({super.key, required this.onAction});

  @override
  Widget build(BuildContext context) {
    return ChildWidget(onAction: onAction);
  }
}

class ChildWidget extends StatelessWidget {
  final VoidCallback onAction;

  const ChildWidget({super.key, required this.onAction});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onAction,
      child: Text('点击'),
    );
  }
}
```

**问题**: 代码冗长，传递繁琐 → 需要更好的解决方案

## 4. InheritedWidget - Flutter 内置的共享状态

### 4.1 基本用法

```dart
// 1. 创建 InheritedWidget
class DataProvider extends InheritedWidget {
  final int count;
  final Function(int) updateCount;

  const DataProvider({
    super.key,
    required this.count,
    required this.updateCount,
    required Widget child,
  }) : super(child: child);

  @override
  bool updateShouldNotify(DataProvider oldWidget) {
    return count != oldWidget.count;
  }

  // 便捷方法获取数据
  static DataProvider? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<DataProvider>();
  }
}

// 2. 使用
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = DataProvider.of(context);
    return Text('计数：${provider?.count ?? 0}');
  }
}

// 3. 包装应用
class MyApp extends StatefulWidget {
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _count = 0;

  void _updateCount(int value) {
    setState(() {
      _count = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return DataProvider(
      count: _count,
      updateCount: _updateCount,
      child: MaterialApp(home: HomePage()),
    );
  }
}
```

### 4.2 优缺点

**优点**:

- Flutter 原生支持
- 自动依赖管理

**缺点**:

- 模板代码多
- 不能直接修改状态
- 使用不够方便

## 5. Provider - 推荐的状态管理方案

### 5.1 安装

```yaml
# pubspec.yaml
dependencies:
  provider: ^6.0.0
```

### 5.2 ChangeNotifierProvider - 基础用法

```dart
// 1. 创建数据模型
class CounterNotifier with ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // 通知监听者重建
  }
}

// 2. 提供 Provider
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => CounterNotifier(),
      child: MaterialApp(
        home: HomePage(),
      ),
    );
  }
}

// 3. 消费状态
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 方式 1: Provider.of
    final counter = Provider.of<CounterNotifier>(context);
    
    return Scaffold(
      appBar: AppBar(title: Text('计数器')),
      body: Center(
        child: Text('${counter.count}'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => counter.increment(),
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### 5.3 Consumer - 更简洁的消费方式

```dart
// 方式 2: Consumer Widget
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('计数器')),
      body: Center(
        child: Consumer<CounterNotifier>(
          builder: (context, counter, child) {
            return Text('${counter.count}');
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Provider.of<CounterNotifier>(context, listen: false).increment(),
        child: Icon(Icons.add),
      ),
    );
  }
}

// 方式 3: Consumer + Selector（只 rebuild 需要的部分）
Selector<CounterNotifier, int>(
  selector: (_, counter) => counter.count,
  builder: (context, count, child) {
    return Text('$count');
  },
)
```

### 5.4 MultiProvider - 多个 Provider

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CounterNotifier()),
    ChangeNotifierProvider(create: (_) => UserProvider()),
    ChangeNotifierProvider(create: (_) => ThemeProvider()),
    Provider.value(value: Config()),
  ],
  child: MaterialApp(...),
)
```

### 5.5 实战案例：购物车

```dart
// 1. 商品模型
class Product {
  final int id;
  final String name;
  final double price;

  Product({required this.id, required this.name, required this.price});
}

// 2. 购物车项
class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  double get totalPrice => product.price * quantity;
}

// 3. 购物车 Provider
class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => _items;

  int get itemCount => _items.length;

  double get totalAmount {
    var total = 0.0;
    for (var item in _items) {
      total += item.totalPrice;
    }
    return total;
  }

  void addItem(Product product) {
    final index = _items.indexWhere((item) => item.product.id == product.id);
    
    if (index >= 0) {
      _items[index].quantity++;
    } else {
      _items.add(CartItem(product: product));
    }
    
    notifyListeners();
  }

  void removeItem(int productId) {
    _items.removeWhere((item) => item.product.id == productId);
    notifyListeners();
  }

  void updateQuantity(int productId, int quantity) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0 && quantity > 0) {
      _items[index].quantity = quantity;
      notifyListeners();
    }
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}

// 4. 商品列表页
class ProductListPage extends StatelessWidget {
  final products = [
    Product(id: 1, name: '商品 A', price: 99),
    Product(id: 2, name: '商品 B', price: 199),
    Product(id: 3, name: '商品 C', price: 299),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('商品列表'),
        actions: [
          IconButton(
            icon: Badge(
              label: Consumer<CartProvider>(
                builder: (context, cart, _) {
                  return Text('${cart.itemCount}');
                },
              ),
              onPressed: () {
                Navigator.pushNamed(context, '/cart');
              },
            ),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (context, index) {
          final product = products[index];
          return ListTile(
            title: Text(product.name),
            subtitle: Text('¥${product.price}'),
            trailing: ElevatedButton(
              onPressed: () {
                Provider.of<CartProvider>(context, listen: false)
                    .addItem(product);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('已添加到购物车')),
                );
              },
              child: Text('添加'),
            ),
          );
        },
      ),
    );
  }
}

// 5. 购物车页面
class CartPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('购物车')),
      body: Consumer<CartProvider>(
        builder: (context, cart, _) {
          if (cart.items.isEmpty) {
            return Center(child: Text('购物车空空如也'));
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  itemCount: cart.items.length,
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return ListTile(
                      title: Text(item.product.name),
                      subtitle: Text('¥${item.product.price}'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: Icon(Icons.remove),
                            onPressed: () {
                              cart.updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                              );
                            },
                          ),
                          Text('${item.quantity}'),
                          IconButton(
                            icon: Icon(Icons.add),
                            onPressed: () {
                              cart.updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                              );
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [BoxShadow(color: Colors.black12)],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '总计：¥${cart.totalAmount.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        // 结算逻辑
                      },
                      child: Text('去结算'),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
```

## 6. 其他状态管理方案简介

### 6.1 Riverpod - Provider 的改进版

[Riverpod3.0](riverpod.md) → 学习Riverpod3.0

```dart
// 编译时安全，不需要 BuildContext
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
}

// 使用
class HomePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```

### 6.2 Bloc - 基于流的状态管理

```dart
// 事件
abstract class CounterEvent {}
class IncrementEvent extends CounterEvent {}

// 状态
class CounterState {
  final int count;
  CounterState(this.count);
}

// Bloc
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<IncrementEvent>((event, emit) {
      emit(CounterState(state.count + 1));
    });
  }
}
```

### 6.3 GetX - 轻量级方案

```dart
class CounterController extends GetxController {
  var count = 0.obs;

  void increment() => count++;
}

// 使用
class HomePage extends GetView<CounterController> {
  @override
  Widget build(BuildContext context) {
    return Obx(() => Text('${controller.count}'));
  }
}
```

### 6.4 MobX - 响应式编程

```dart
class Counter = _Counter with _$Counter;

abstract class _Counter with Store {
  @observable
  int count = 0;

  @action
  void increment() {
    count++;
  }
}
```

## 7. 状态管理方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| setState | 简单直接 | 状态耦合 | 简单页面、临时状态 |
| InheritedWidget | 原生支持 | 模板代码多 | 底层封装 |
| Provider | 易上手、官方推荐 | 需要 BuildContext | 中小型项目 |
| Riverpod | 编译时安全、灵活 | 学习曲线 | 中大型项目 |
| Bloc | 可测试性强、规范 | 代码量大 | 企业级应用 |
| GetX | 轻量、功能全 | 侵入性强 | 快速开发 |
| MobX | 响应式、简洁 | 需要代码生成 | 复杂交互 |

## 8. 选择建议

### 8.1 初学者路线

```
setState → Provider → Riverpod/Bloc
```

### 8.2 项目规模选择

- **个人小项目**: setState + Provider
- **中小型项目**: Provider / GetX
- **中大型项目**: Riverpod / Bloc
- **企业级应用**: Bloc + Clean Architecture

### 8.3 最佳实践

```dart
// 1. 按功能拆分 Provider
class UserProvider with ChangeNotifier { ... }

class ProductProvider with ChangeNotifier { ... }

class CartProvider with ChangeNotifier { ... }

// 2. 组合使用
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => UserProvider()),
    ChangeNotifierProvider(create: (_) => ProductProvider()),
    ChangeNotifierProvider(create: (_) => CartProvider()),
  ],
  child: MyApp(),
)

// 3. 局部刷新
Consumer<UserProvider>(
  builder: (context, user, _) {
    return Text(user.name); // 只 rebuild 这部分
  },
)

// 4. 避免不必要的监听
ElevatedButton(
  onPressed: () {
    Provider.of<CartProvider>(context, listen: false).clear();
  },
  child: Text('清空购物车'),
)
```

## 💡 小结

- setState 是最基础的状态管理
- 状态提升可以解决简单的共享问题
- Provider 是官方推荐的通用方案
- 根据项目规模选择合适的方案
- 不要过度设计，够用就好

下一步：[路由与导航](routing-navigation.md) → 学习页面跳转和参数传递
