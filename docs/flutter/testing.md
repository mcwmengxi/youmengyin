# Flutter 测试 - 从单元测试到 BDD 🧪

## 1. 测试概览

Flutter 提供了完善的测试框架，支持多种测试类型：

```
测试金字塔
┌─────────────────────┐
│  Integration Test   │ ← 少量，端到端验证
├─────────────────────┤
│    Widget Test      │ ← 中等数量，组件级测试
├─────────────────────┤
│     Unit Test       │ ← 大量，函数/类级别测试
└─────────────────────┘
```

### 1.1 测试类型对比

| 类型 | 速度 | 依赖 | 用途 | 工具 |
|------|------|------|------|------|
| Unit Test | ⚡ 最快 | 无 | 测试逻辑、算法 | `test` 包 |
| Widget Test | 🔶 中等 | Widget | 测试 UI 组件 | `flutter_test` |
| Integration Test | 🐢 较慢 | 完整应用 | 端到端测试 | `integration_test` |

---

## 2. 单元测试 (Unit Testing)

### 2.1 基础概念

**单元测试**: 测试最小的可测试单元（函数、方法、类），不依赖 Flutter 框架。

### 2.2 项目结构

```
lib/
├── src/
│   ├── counter.dart        # 被测试代码
│   └── calculator.dart
test/
├── counter_test.dart       # 测试文件
└── calculator_test.dart
```

### 2.3 编写第一个单元测试

```dart
// lib/src/counter.dart
class Counter {
  int _value = 0;
  
  int get value => _value;
  
  void increment() => _value++;
  void decrement() => _value--;
  void reset() => _value = 0;
}
```

```dart
// test/counter_test.dart
import 'package:test/test.dart';
import 'package:my_app/src/counter.dart';

void main() {
  late Counter counter;

  setUp(() {
    counter = Counter();
  });

  group('Counter', () {
    test('初始值应该为 0', () {
      expect(counter.value, equals(0));
    });

    test('increment 应该增加计数', () {
      counter.increment();
      expect(counter.value, equals(1));
      
      counter.increment();
      counter.increment();
      expect(counter.value, equals(3));
    });

    test('decrement 应该减少计数', () {
      counter.decrement();
      expect(counter.value, equals(-1));
    });

    test('reset 应该重置为 0', () {
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.value, equals(0));
    });
  });
}
```

### 2.4 常用匹配器 (Matchers)

```dart
import 'package:test/test.dart';

void main() {
  test('常用匹配器示例', () {
    // 基本比较
    expect(value, equals(42));
    expect(value, isNotNull);
    expect(value, isNull);
    expect(value, isTrue);
    expect(value, isFalse);
    
    // 数值比较
    expect(value, greaterThan(10));
    expect(value, lessThan(100));
    expect(value, inInclusiveRange(1, 10));
    expect(closeTo(3.14, 0.01)); // 浮点数近似
    
    // 字符串
    expect(text, contains('hello'));
    expect(text, startsWith('Hello'));
    expect(text, endsWith('world'));
    expect(text, matches(r'^\d+$')); // 正则
    
    // 集合
    expect(list, isEmpty);
    expect(list, isNotEmpty);
    expect(list, hasLength(3));
    expect(list, containsAll([1, 2]));
    expect(list, everyElement(isA<int>()));
    
    // 类型检查
    expect(obj, isA<String>());
    expect(obj, throwsA(isA<FormatException>()));
    
    // 自定义匹配器
    expect(
      customMatcher,
      predicate((value) => value.isValid, 'is valid')
    );
  });
}
```

### 2.5 异步测试

```dart
import 'package:test/test.dart';

void main() {
  group('异步测试', () {
    test('Future 测试 - 使用 async/await', () async {
      final result = await fetchData();
      expect(result, isNotNull);
    });

    test('Future 测试 - 使用 completes', () {
      expect(fetchData(), completion(isNotNull));
    });

    test('Future 测试 - 抛出异常', () async {
      expect(
        () async => await fetchWithError(),
        throwsA(isA<NetworkException>()),
      );
    });

    test('Stream 测试', () async {
      final stream = countStream(5);
      
      expect(
        stream,
        emitsInOrder([
          1, 2, 3, 4, 5,
          emitsDone,
        ]),
      );
    });

    test('超时设置', () async {
      await Future.delayed(Duration(milliseconds: 100));
    }, timeout: Timeout(Duration(milliseconds: 200)));
  });
}

Future<String> fetchData() async {
  await Future.delayed(Duration(milliseconds: 50));
  return 'data';
}

Stream<int> countStream(int count) async* {
  for (int i = 1; i <= count; i++) {
    yield i;
  }
}
```

### 2.6 Mock 和 Stub

使用 `mockito` 或 `mocktail` 进行依赖模拟：

```yaml
# pubspec.yaml
dev_dependencies:
  mocktail: ^1.0.0
  build_runner: ^2.0.0
```

```dart
// test/auth_service_test.dart
import 'package:mocktail/mocktail.dart';
import 'package:test/test.dart';

// 创建 Mock 类
class MockAuthRepository extends Mock implements AuthRepository {}
class MockCacheService extends Mock implements CacheService {}

void main() {
  late AuthService authService;
  late MockAuthRepository authRepository;
  late MockCacheService cacheService;

  setUp(() {
    authRepository = MockAuthRepository();
    cacheService = MockCacheService();
    authService = AuthService(authRepository, cacheService);
  });

  group('AuthService', () {
    test('登录成功时返回用户信息', () async {
      // Arrange (准备)
      when(() => authRepository.login('user', 'pass'))
          .thenAnswer((_) async => User(id: '1', name: 'Test'));
      when(() => cacheService.saveUser(any()))
          .thenAnswer((_) async {});

      // Act (执行)
      final user = await authService.login('user', 'pass');

      // Assert (断言)
      expect(user, isNotNull);
      expect(user!.name, equals('Test'));
      
      // 验证调用
      verify(() => authRepository.login('user', 'pass')).called(1);
      verify(() => cacheService.saveUser(any())).called(1);
    });

    test('登录失败时抛出异常', () async {
      when(() => authRepository.login(any(), any()))
          .thenThrow(AuthException('Invalid credentials'));

      expect(
        () => authService.login('wrong', 'wrong'),
        throwsA(isA<AuthException>()),
      );
    });
  });
}
```

### 2.7 运行单元测试

```bash
# 运行所有测试
flutter test

# 运行指定文件
flutter test test/counter_test.dart

# 运行指定组的测试
flutter test --name "Counter"

# 覆盖率报告
flutter test --coverage

# 查看覆盖率结果
genhtml coverage/lcov.info -o coverage/html
```

---

## 3. Widget 测试 (Widget Testing)

### 3.1 基础概念

**Widget 测试**: 在隔离环境中测试单个 Widget 的行为和渲染，需要 Flutter 框架但不需要真实设备。

### 3.2 核心概念

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Widget 测试基础', (tester) async {
    // 1. 构建 Widget
    await tester.pumpWidget(MyApp());

    // 2. 查找 Widget
    final finder = find.text('Hello');

    // 3. 验证
    expect(finder, findsOneWidget);
  });
}
```

**关键 API**:

- `pumpWidget()`: 构建并渲染 Widget
- `pump()`: 触发一帧重建（动画等）
- `pumpAndSettle()`: 等待所有动画完成
- `find`: 查找 Widget 的工具类

### 3.3 查找器 (Finders)

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('查找器示例', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Column(
            children: [
              Text('标题'),
              Icon(Icons.star, key: Key('star_icon')),
              ElevatedButton(
                onPressed: () {},
                child: Text('点击我'),
              ),
            ],
          ),
        ),
      ),
    );

    // 通过文本查找
    find.text('标题');
    find.textContaining('标');  // 部分匹配

    // 通过 Key 查找
    find.byKey(Key('star_icon'));

    // 通过类型查找
    find.byType(ElevatedButton);
    find.byType(Icon);

    // 通过图标查找
    find.byIcon(Icons.star);

    // 组合查找
    find.ancestor(
      of: find.text('点击我'),
      matching: find.byType(ElevatedButton),
    );

    find.descendant(
      of: find.byType(Column),
      matching: find.byType(Text),
    );

    // 验证找到的数量
    expect(find.text('标题'), findsOneWidget);      // 找到 1 个
    expect(find.byType(Text), findsWidgets);         // 找到多个
    expect(find.text('不存在'), findsNothing);        // 找不到
    expect(find.byType(Text), findsNWidgets(2));      // 找到 N 个
  });
}
```

### 3.4 用户交互测试

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('交互测试示例', (tester) async {
    await tester.pumpWidget(CounterApp());

    // 初始状态验证
    expect(find.text('0'), findsOneWidget);

    // 点击按钮
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump(); // 触发重建

    // 验证更新后的状态
    expect(find.text('1'), findsOneWidget);

    // 连续多次点击
    for (int i = 0; i < 5; i++) {
      await tester.tap(find.byIcon(Icons.add));
    }
    await tester.pump();

    expect(find.text('6'), findsOneWidget);
  });

  testWidgets('输入框测试', (tester) async {
    await tester.pumpWidget(FormApp());

    // 输入文本
    await tester.enterText(find.byType(TextField), 'Hello World');
    await tester.pump();

    // 验证输入内容
    expect(find.text('Hello World'), findsOneWidget);

    // 测试表单验证
    await tester.tap(find.text('提交'));
    await tester.pumpAndSettle();

    expect(find.text('请输入有效邮箱'), findsOneWidget);
  });

  testWidgets('滚动测试', (tester) async {
    await tester.pumpWidget(ListApp());

    // 验证初始可见项
    expect(find.text('Item 0'), findsOneWidget);
    expect(find.text('Item 20'), findsNothing); // 不可见

    // 滚动列表
    await tester.drag(
      find.byType(ListView),
      Offset(0, -300), // 向上滚动
    );
    await tester.pumpAndSettle();

    // 验证滚动后
    expect(find.text('Item 20'), findsOneWidget);
  });

  testWidgets('手势测试', (tester) async {
    await tester.pumpWidget(GestureApp());

    // 点击中心位置
    await tester.tapAt(Offset(100, 200));
    await tester.pump();

    // 长按
    await tester.longPress(find.byType(GestureDetector));
    await tester.pump(const Duration(seconds: 1));

    // 拖拽
    await tester.drag(
      find.byType(Draggable),
      const Offset(50, 0),
    );
    await tester.pumpAndSettle();
  });
}
```

### 3.5 测试带状态的 Widget

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('Provider 状态管理测试', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => CounterNotifier(),
        child: MaterialApp(home: CounterPage()),
      ),
    );

    // 初始状态
    expect(find.text('Count: 0'), findsOneWidget);

    // 通过 context 获取 provider 并修改状态
    final context = tester.element(find.byType(CounterPage));
    Provider.of<CounterNotifier>(context, listen: false).increment();
    await tester.pump();

    expect(find.text('Count: 1'), findsOneWidget);
  });

  testWidgets('Riverpod 状态管理测试', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(home: RiverpodCounterPage()),
      ),
    );

    expect(find.text('0'), findsOneWidget);

    // 通过 container 读取和修改状态
    final container = ProviderScope.containerOf(
      tester.element(find.byType(RiverpodCounterPage)),
    );

    container.read(counterProvider.notifier).state++;
    await tester.pump();

    expect(find.text('1'), findsOneWidget);
  });
}
```

### 3.6 测试主题和国际化

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';

void main() {
  testWidgets('深色模式测试', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        themeMode: ThemeMode.dark,
        darkTheme: ThemeData.dark(),
        home: ThemedPage(),
      ),
    );

    final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
    expect(scaffold.backgroundColor, isNot(equals(Colors.white)));
  });

  testWidgets('多语言测试', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
        ],
        supportedLocales: [
          Locale('en', ''),
          Locale('zh', ''),
        ],
        locale: Locale('zh', 'CN'),
        home: LocalizedPage(),
      ),
    );

    expect(find.text('你好'), findsOneWidget);
  });

  testWidgets('响应式布局测试', (tester) async {
    // 设置屏幕尺寸为手机
    tester.view.physicalSize = const Size(360, 640);
    tester.view.devicePixelRatio = 1.0;

    await tester.pumpWidget(MaterialApp(home: ResponsivePage()));

    expect(find.byType(MobileLayout), findsOneWidget);

    // 切换到平板尺寸
    tester.view.physicalSize = const Size(1024, 768);
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(MaterialApp(home: ResponsivePage()));

    expect(find.byType(TabletLayout), findsOneWidget);
  });
}
```

### 3.7 测试动画

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('显式动画测试', (tester) async {
    await tester.pumpWidget(AnimatedPage());
    
    // 触发动画
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pump(); // 开始第一帧
    
    // 动画中间状态
    await tester.pump(const Duration(milliseconds: 500));
    
    // 验证动画进度
    final animation = tester.widgetList<AnimatedContainer>(
      find.byType(AnimatedContainer),
    ).first;
    
    expect(animation.duration, equals(const Duration(seconds: 1)));
    
    // 等待动画完成
    await tester.pumpAndSettle();
    
    // 验证最终状态
    expect(find.byType(CheckmarkIcon), findsOneWidget);
  });

  testWidgets('Hero 动画测试', (tester) async {
    await tester.pumpWidget(NavigationApp());
    
    // 导航到详情页触发 Hero 动画
    await tester.tap(find.text('查看详情'));
    await tester.pump(); // 开始导航
    await tester.pump(const Duration(milliseconds: 100)); // Hero 动画中间帧
    
    // 验证 Hero 动画正在进行
    expect(find.byType(Hero), findsWidgets);
    
    // 等待动画完成
    await tester.pumpAndSettle();
    
    // 验证导航完成
    expect(find.text('详情页'), findsOneWidget);
  });
}
```

---

## 4. 集成测试 (Integration Testing)

### 4.1 基础概念

**集成测试**: 在真实设备或模拟器上运行完整的应用程序，模拟真实用户操作。

### 4.2 配置环境

```yaml
# pubspec.yaml
dev_dependencies:
  integration_test:
    sdk: flutter
  flutter_driver:
    sdk: flutter
```

### 4.3 项目结构

```
lib/
├── main.dart
├── app.dart
integration_test/
├── app_test.dart          # 集成测试文件
└── login_flow_test.dart
test_driver/
├── app.dart               # 测试驱动入口
└── integration_test.dart
```

### 4.4 编写集成测试

```dart
// integration_test/app_test.dart
import 'package:integration_test/integration_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('端到端测试', () {
    testWidgets('完整的登录流程', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 验证初始页面是登录页
      expect(find.text('欢迎'), findsOneWidget);
      expect(find.byType(TextField), findsNWidgets(2));

      // 输入用户名和密码
      await tester.enterText(
        find.byKey(Key('username_field')),
        'test@example.com',
      );
      await tester.enterText(
        find.byKey(Key('password_field')),
        'password123',
      );
      await tester.pumpAndSettle();

      // 点击登录按钮
      await tester.tap(find.text('登录'));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // 验证跳转到首页
      expect(find.text('首页'), findsOneWidget);
      expect(find.text('test@example.com'), findsOneWidget);
    });

    testWidgets('购物车功能流程', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 先登录
      await _login(tester);

      // 进入商品列表
      await tester.tap(find.text('商品'));
      await tester.pumpAndSettle();

      // 添加商品到购物车
      expect(find.text('商品 A'), findsOneWidget);
      await tester.tap(find.byIcon(Icons.add_shopping_cart).first);
      await tester.pumpAndSettle();

      // 验证购物车数量更新
      expect(find.text('1'), findsOneWidget);

      // 进入购物车页面
      await tester.tap(find.byIcon(Icons.shopping_cart));
      await tester.pumpAndSettle();

      // 验证商品在购物车中
      expect(find.text('商品 A'), findsOneWidget);
      expect(find.text('¥99.00'), findsOneWidget);

      // 结算流程
      await tester.tap(find.text('去结算'));
      await tester.pumpAndSettle();

      expect(find.text('订单确认'), findsOneWidget);
      expect(find.text('总计: ¥99.00'), findsOneWidget);
    });

    testWidgets('性能基准测试', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // 使用 IntegrationTestWidgetsFlutterBinding 记录性能
      final binding = IntegrationTestWidgetsFlutterBinding.instance!;

      // 执行一系列操作并追踪性能
      await binding.traceAction(
        () async {
          for (int i = 0; i < 10; i++) {
            await tester.tap(find.byType(FloatingActionButton));
            await tester.pumpAndSettle();
          }
        },
        reportKey: 'scrolling_summary',
      );
    });
  });
}

Future<void> _login(WidgetTester tester) async {
  await tester.enterText(
    find.byKey(Key('username_field')),
    'test@example.com',
  );
  await tester.enterText(
    find.byKey(Key('password_field')),
    'password123',
  );
  await tester.tap(find.text('登录'));
  await tester.pumpAndSettle(Duration(seconds: 2));
}
```

### 4.5 测试驱动配置

```dart
// test_driver/app.dart
import 'package:integration_test/integration_test_driver.dart';

Future<void> main() => integrationDriver();
```

### 4.6 运行集成测试

```bash
# Android
flutter drive --driver=test_driver/app.dart --target=integration_test/app_test.dart

# iOS
flutter drive --driver=test_driver/app.dart --target=integration_test/app_test.dart

# Web
flutter drive \
  --driver=test_driver/app.dart \
  --target=integration_test/app_test.dart \
  -d chrome

# 指定设备
flutter drive \
  --driver=test_driver/app.dart \
  --target=integration_test/app_test.dart \
  -d emulator-5554
```

### 4.7 Firebase Test Lab 集成

```bash
# 上传到 Firebase Test Lab
firebase test lab run flutter \
  --app build/app/outputs/flutter-apk/app-debug.apk \
  --test build/app/outputs/apk/debug/app-debug-test.apk \
  --device model=Pixel2,version=30,locale=zh_CN,orientation=portrait \
  --results-bucket=your-bucket \
  --results-dir=integration-tests/$(date +%Y%m%d_%H%M%S)
```

---

## 5. TDD (测试驱动开发)

### 5.1 TDD 流程

```
Red-Green-Refactor 循环

┌─────────┐     ┌─────────┐     ┌─────────────┐
│   RED   │ ──► │  GREEN  │ ──► │  REFACTOR   │
│ 写失败测试│     │ 写最小代码 │     │  重构优化   │
└─────────┘     └─────────┘     └─────────────┘
     ▲                               │
     └───────────────────────────────┘
```

### 5.2 TDD 实践：计算器示例

#### 第一步：RED - 编写失败的测试

```dart
// test/calculator_test.dart
import 'package:test/test.dart';
import 'package:my_app/calculator.dart';

void main() {
  late Calculator calculator;

  setUp(() {
    calculator = Calculator();
  });

  group('加法运算', () {
    test('两个正整数相加', () {
      expect(calculator.add(2, 3), equals(5));
    });

    test('正负数相加', () {
      expect(calculator.add(-1, 5), equals(4));
    });

    test('处理大数', () {
      expect(
        calculator.add(999999999999, 1),
        equals(1000000000000),
      );
    });
  });

  group('除法运算', () {
    test('正常除法', () {
      expect(calculator.divide(10, 2), equals(5.0));
    });

    test('除以零应抛出异常', () {
      expect(
        () => calculator.divide(10, 0),
        throwsArgumentError,
      );
    });
  });

  group('历史记录', () {
    test('保存计算历史', () {
      calculator.add(2, 3);
      calculator.multiply(4, 5);

      expect(calculator.history.length, equals(2));
      expect(calculator.history[0], contains('2 + 3'));
    });

    test('清除历史', () {
      calculator.add(1, 2);
      calculator.clearHistory();

      expect(calculator.history, isEmpty);
    });
  });
}
```

#### 第二步：GREEN - 编写最小实现代码

```dart
// lib/calculator.dart
class Calculator {
  final List<String> history = [];

  int add(int a, int b) {
    final result = a + b;
    history.add('$a + $b = $result');
    return result;
  }

  int subtract(int a, int b) {
    return a - b;
  }

  double divide(double a, double b) {
    if (b == 0) {
      throw ArgumentError('Cannot divide by zero');
    }
    return a / b;
  }

  int multiply(int a, int b) {
    return a * b;
  }

  void clearHistory() {
    history.clear();
  }
}
```

#### 第三步：REFACTOR - 优化代码

```dart
// lib/calculator.dart (重构后)
class Calculator {
  final List<CalculationRecord> _history = [];
  
  List<CalculationRecord> get history => List.unmodifiable(_history);

  int add(int a, int b) {
    return _execute(Operation.add, a, b, a + b);
  }

  int subtract(int a, int b) {
    return _execute(Operation.subtract, a, b, a - b);
  }

  double divide(double a, double b) {
    if (b == 0) {
      throw ArgumentError('Cannot divide by zero');
    }
    return _executeDouble(Operation.divide, a, b, a / b);
  }

  int multiply(int a, int b) {
    return _execute(Operation.multiply, a, b, a * b);
  }

  void clearHistory() => _history.clear();

  T _execute<T>(Operation op, dynamic a, dynamic b, T result) {
    _history.add(CalculationRecord(op, a, b, result));
    return result;
  }

  T _executeDouble<T>(Operation op, double a, double b, double result) {
    _history.add(CalculationRecord(op, a, b, result));
    return result as T;
  }
}

enum Operation { add, subtract, multiply, divide }

class CalculationRecord {
  final Operation operation;
  final dynamic operandA;
  final dynamic operandB;
  final dynamic result;
  final DateTime timestamp;

  CalculationRecord(
    this.operation,
    this.operandA,
    this.operandB,
    this.result,
  ) : timestamp = DateTime.now();

  @override
  String toString() =>
      '$operandA $operation $operandB = $result';
}
```

### 5.3 TDD 最佳实践

```dart
// ✅ 好的 TDD 测试特点

// 1. 一个测试只验证一个行为
test('add 方法应该正确相加两个数', () {
  expect(calculator.add(2, 3), equals(5));
});

// 2. 使用有意义的描述
group('当输入边界值时', () {
  test('零值处理', () { ... });
  test('最大整数值', () { ... });
});

// 3. 遵循 AAA 模式 (Arrange-Act-Assert)
test('完整的 AAA 示例', () {
  // Arrange: 准备测试数据
  const input = [3, 1, 4, 1, 5];
  
  // Act: 执行被测方法
  final result = calculateAverage(input);
  
  // Assert: 验证结果
  expect(result, closeTo(2.8, 0.01));
});

// 4. 测试边界条件
group('边界条件测试', () {
  test('空列表', () {
    expect(() => calculateAverage([]), throwsArgumentError);
  });

  test('单元素列表', () {
    expect(calculateAverage([42]), equals(42.0));
  });

  test('包含 null 的列表', () {
    expect(
      () => calculateAverage([1, null, 3]),
      throwsTypeError,
    );
  });
});
```

---

## 6. BDD (行为驱动开发)

### 6.1 BDD 概念

**BDD**: 使用自然语言描述软件行为，让非技术人员也能理解测试用例。

```
Gherkin 语法:
Feature: 功能名称
  Scenario: 场景描述
    Given 前置条件
    When 执行操作
    Then 验证结果
```

### 6.2 配置 BDD 环境

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_bdd: ^1.0.0
  gherkin: ^0.14.0
  flutter_gherkin: ^2.0.0
```

### 6.3 编写 Feature 文件

```gherkin
# features/login.feature
Feature: 用户登录功能
  作为一名用户
  我想要能够登录系统
  以便访问我的个人账户

  Scenario: 使用正确的凭据成功登录
    Given 我在登录页面
    And 我输入用户名 "test@example.com"
    And 我输入密码 "password123"
    When 我点击登录按钮
    Then 我应该看到首页
    And 显示我的用户名

  Scenario: 使用错误的密码无法登录
    Given 我在登录页面
    And 我输入用户名 "test@example.com"
    And 我输入密码 "wrongpassword"
    When 我点击登录按钮
    Then 我应该看到错误提示 "密码错误"

  Scenario: 必填字段验证
    Given 我在登录页面
    When 我不输入任何信息直接点击登录
    Then 用户名字段应显示 "请输入用户名"
    And 密码字段应显示 "请输入密码"

  Scenario Outline: 各种无效的邮箱格式
    Given 我在登录页面
    And 我输入邮箱 "<email>"
    And 我输入密码 "password123"
    When 我点击登录按钮
    Then 我应该看到提示 "请输入有效的邮箱地址"

    Examples:
      | email           |
      | invalid          |
      | test@            |
      | @example.com     |
      | test .com        |

Feature: 购物车功能
  作为一名购物者
  我想要将商品添加到购物车
  以便稍后统一结算

  Scenario: 添加商品到购物车
    Given 我已登录系统
    And 我在商品列表页面
    When 我将 "iPhone 15" 加入购物车
    Then 购物车数量应显示 "1"
    And 购物车总价应为 "¥7999.00"

  Scenario: 修改商品数量
    Given 我的购物车中有 "1" 个 "iPhone 15"
    When 我将数量改为 "3"
    Then 购物车总价应为 "¥23997.00"

  Scenario: 移除商品
    Given 我的购物车中有 "iPhone 15"
    When 我移除此商品
    Then 购物车应为空
    And 显示 "您的购物车是空的"
```

### 6.4 实现 Step Definitions

```dart
// test_steps/login_steps.dart
import 'package:flutter_gherkin/flutter_gherkin.dart';
import 'package:gherkin/gherkin.dart';
import 'expect.dart';

Given1('我在登录页面', (context) async {
  await context.appDriver.waitForAbsent(context.appDriver.find.byValueKey('loading'));
  expect(await context.appDriver.isPresent(context.appDriver.find.byValueKey('login_page')), true);
});

And1('我输入用户名 {string}', (input, context) async {
  final field = context.appDriver.find.byValueKey('username_field');
  await context.appDriver.tap(field);
  await context.appDriver.enterText(field, input);
});

And1('我输入密码 {string}', (input, context) async {
  final field = context.appDriver.find.byValueKey('password_field');
  await context.appDriver.tap(field);
  await context.appDriver.enterText(field, input);
});

When1('我点击登录按钮', (context) async {
  final button = context.appDriver.find.byValueKey('login_button');
  await context.appDriver.tap(button);
  await context.appDriver.waitUntil(
    () async {
      return !await context.appDriver.isPresent(
        context.appDriver.find.byType(CircularProgressIndicator),
      );
    );
});

Then1('我应该看到首页', (context) async {
  await Future.delayed(Duration(seconds: 1));
  final homePage = context.appDriver.find.byValueKey('home_page');
  expect(await context.appDriver.isPresent(homePage), true);
});

Then1('显示我的用户名', (context) async {
  final username = context.appDriver.find.byValueKey('username_display');
  expect(await context.appDriver.isPresent(username), true);
});

Then1('我应该看到错误提示 {string}', (errorMessage, context) async {
  final error = context.appDriver.find.text(errorMessage);
  expect(await context.appDriver.isPresent(error), true);
});
```

### 6.5 配置测试执行器

```dart
// test_driver/bdd_config.dart
import 'package:flutter_gherkin/flutter_gherkin.dart';
import 'package:gherkin/gherkin.dart';

Future<void> main() {
  final config = FlutterTestConfiguration()
    ..features = [RegExp('features/*\\.feature')]
    ..reporters = [
      ProgressReporter(),
      TestRunSummaryReporter(),
      JsonReporter(path: './report.json'),
    ]
    ..stepDefinitions = [
      LoginSteps(),
      CartSteps(),
    ]
    ..stopAfterTestFailed = false
    ..tagExpression = "" 
    ..order = ExecutionOrder.sequential
    ..restartAppBetweenScenarios = true
    ..appMainFunction = () async {
      // 应用入口
    };

  return GherkinRunner().execute(config);
}
```

### 6.6 运行 BDD 测试

```bash
# 运行所有 feature 文件
flutter test_driver bdd_config.dart

# 运行特定 tag 的场景
flutter test_driver bdd_config.dart --tags "@smoke"

# 排除特定 tag
flutter test_driver bdd_config.dart --tags "not @wip"

# 生成报告
flutter test_driver bdd_config.dart --reporter html
```

### 6.7 BDD 与 TDD 结合

```dart
/// BDD + TDD 结合的最佳实践
///
/// 1. 先用 BDD 定义用户故事和验收标准
/// 2. 将 Story 拆分为技术任务
/// 3. 对每个任务使用 TDD 开发
/// 4. 用 BDD 场景做端到端验证

// Example: 用户注册功能

// BDD 层面 (feature 文件)
/*
Feature: 用户注册
  Scenario: 成功注册新用户
    Given 我在注册页面
    When 我填写有效的注册信息
    And 点击注册按钮
    Then 注册成功并跳转到首页
*/

// TDD 层面 (单元测试)
group('EmailValidator', () {
  test('应该接受有效的邮箱格式', () {
    expect(EmailValidator.isValid('test@example.com'), isTrue);
  });
  
  test('应该拒绝无效的邮箱格式', () {
    expect(EmailValidator.isValid('invalid'), isFalse);
  });
});

group('PasswordValidator', () {
  test('密码至少8位', () {
    expect(PasswordValidator.validate('short'), isNot(isNull));
  });
  
  test('密码应包含数字和字母', () {
    expect(PasswordValidator.validate('abcdefg'), isNot(isNull));
  });
});

group('RegistrationService', () {
  test('注册成功时应创建用户', () async {
    final service = RegistrationService(mockRepo);
    final user = await service.register('test@test.com', 'pass123456');
    expect(user, isNotNull);
    expect(user!.email, equals('test@test.com'));
  });
  
  test('重复邮箱应抛出异常', () async {
    when(mockRepo.exists(any)).thenAnswer((_) async => true);
    
    expect(
      () => service.register('existing@test.com', 'pass123'),
      throwsA(isA<UserAlreadyExistsException>()),
    );
  });
});
```

---

## 7. 测试最佳实践

### 7.1 测试原则

```dart
/// FAST 原则
///
/// F - Fast: 测试应该快速执行
/// A - Independent: 测试之间相互独立
/// S - Self-validating: 测试自动判断通过/失败
/// T - Timely: 及时编写测试

// ✅ 好的测试示例
describe('UserService', () {
  test('createUser 应该创建新用户', () async {
    // Fast: 不涉及网络请求，使用 mock
    final mockRepo = MockUserRepository();
    when(mockRepo.save(any))
        .thenAnswer((_) async => User(id: '1', name: 'Test'));
    
    final service = UserService(mockRepo);
    final user = await service.createUser(name: 'Test');
    
    // Self-validating: 明确的期望值
    expect(user.id, equals('1'));
    expect(user.name, equals('Test'));
    
    // Independent: 不依赖其他测试的状态
  });
});
```

### 7.2 测试命名规范

```dart
// ❌ 不好的命名
test('test1', () { ... });
test('它工作吗', () { ... });
test('login method', () { ... });

// ✅ 好的命名 - 清晰表达意图
test('当用户提供有效凭据时，login 应该返回用户对象', () {});
test('如果用户名为空，validateUsername 应该返回错误', () {});
test('当网络超时时，fetchData 应该抛出 TimeoutException', () {});

// 格式: 测试条件 + 触发动作 + 预期结果
// [当/如果] + [被测方法] + [应该] + [预期行为]
```

### 7.3 测试组织结构

```dart
// test/user_service_test.dart

import 'package:test/test.dart';
import 'package:mocktail/mocktail.dart';

void main() {
  late UserService userService;
  late MockUserRepository userRepository;
  late MockCacheService cacheService;

  /// 全局初始化
  setUpAll(() {
    // 一次性设置，如初始化数据库连接
  });

  /// 每个测试组前初始化
  setUp(() {
    userRepository = MockUserRepository();
    cacheService = MockCacheService();
    userService = UserService(userRepository, cacheService);
  });

  /// 每个测试组后清理
  tearDown(() {
    // 清理资源
  });

  /// 全局清理
  tearDownAll(() {
    // 关闭连接等
  });

  group('UserService - 用户查询', () {
    group('getUserById', () {
      test('当用户存在时，应该返回用户信息', () async {
        // Arrange
        when(() => userRepository.findById('1'))
            .thenAnswer((_) async => User(id: '1', name: 'Alice'));

        // Act
        final user = await userService.getUserById('1');

        // Assert
        expect(user, isNotNull);
        expect(user!.id, equals('1'));
        expect(user.name, equals('Alice'));
        verify(() => userRepository.findById('1')).called(1);
      });

      test('当用户不存在时，应该返回 null', () async {
        when(() => userRepository.findById('999'))
            .thenAnswer((_) async => null);

        final user = await userService.getUserById('999');

        expect(user, isNull);
      });

      test('当仓库抛出异常时，应该重新抛出', () async {
        when(() => userRepository.findById(any()))
            .thenThrow(DatabaseException('Connection failed'));

        expect(
          () => userService.getUserById('1'),
          throwsA(isA<DatabaseException>()),
        );
      });
    });
  });

  group('UserService - 用户创建', () {
    test('创建用户时应该验证邮箱格式', () {
      expect(
        () => userService.createUser(email: 'invalid', name: 'Test'),
        throwsArgumentError,
      );
    });

    test('创建成功后应该缓存用户信息', () async {
      when(() => userRepository.save(any()))
          .thenAnswer((_) async => User(id: '2', name: 'Bob'));

      await userService.createUser(email: 'bob@test.com', name: 'Bob');

      verify(() => cacheService.set('user_2', any())).called(1);
    });
  });
}
```

### 7.4 CI/CD 集成

```yaml
# .github/workflows/flutter_test.yml
name: Flutter Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          
      - name: Install dependencies
        run: flutter pub get
        
      - name: Run unit tests
        run: flutter test --coverage
        
      - name: Run widget tests
        run: flutter test test/widget/ --coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: coverage/lcov.info
        
  integration-test:
    runs-on: macos-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          
      - name: Run integration tests on iOS simulator
        run: |
          xcrun simctl boot "iPhone 14"
          flutter test integration_test/ -d "iPhone 14"
```

### 7.5 常见问题和解决方案

```dart
// 问题 1: setState() called after dispose()

testWidgets('异步操作后不应调用 setState', (tester) async {
  await tester.pumpWidget(MyAsyncWidget());
  
  // 触发异步操作
  await tester.tap(find.text('Fetch'));
  await tester.pump(); // 开始异步
  
  // 卸载 widget
  await tester.pumpWidget(Container());
  
  // 等待异步完成（不应报错）
  await tester.pump(const Duration(seconds: 2));
});

// 问题 2: 测试 Timer 和 AnimationController

testWidgets('测试定时器相关代码', (tester) async {
  await tester.pumpWidget(TimerWidget());
  
  // 使用 fake_async 处理时间
  // 或使用 elapse 方法
  await tester.pump(const Duration(seconds: 5));
  await tester.pumpAndSettle();
});

// 问题 3: Platform Channel 测试

testWidgets('测试 MethodChannel 调用', (tester) async {
  tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
    const MethodChannel('my_channel'),
    (methodCall) async {
      if (methodCall.method == 'getData') {
        return {'result': 'mock data'};
      }
      return null;
    },
  );
  
  await tester.pumpWidget(ChannelApp());
  await tester.pumpAndSettle();
  
  expect(find.text('mock data'), findsOneWidget);
});

// 问题 4: 网络请求测试

testWidgets('测试网络加载状态', (tester) async {
  // 使用 mock client
  final client = MockClient();
  when(client.get(any))
      .thenAnswer((_) async => Response(jsonEncode({'data': 'test'}), 200));
  
  await tester.pumpWidget(NetworkApp(client: client));
  
  // 加载中状态
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
  
  // 等待请求完成
  await tester.pumpAndSettle();
  
  // 数据展示状态
  expect(find.text('test'), findsOneWidget);
  expect(find.byType(CircularProgressIndicator), findsNothing);
});
```

---

## 8. 测试策略总结

### 8.1 何时使用哪种测试？

```
                    测试速度
                      快 ↑
                        │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    │    Unit Tests   │  Widget Tests   │
    │    (逻辑验证)    │  (UI 行为验证)   │
    │                 │                 │
    ├─────────────────┼─────────────────┤
    │                 │                 │
    │                 │Integration Tests│
    │                 │  (E2E 流程验证)  │
    │                 │                 │
    └─────────────────┴─────────────────┘
                        ↓
                     慢
```

### 8.2 推荐的测试比例

| 项目规模 | Unit | Widget | Integration |
|---------|------|--------|-------------|
| 小型项目 | 70% | 25% | 5% |
| 中型项目 | 60% | 30% | 10% |
| 大型项目 | 50% | 35% | 15% |

### 8.3 测试 Checklist

```markdown
## 新功能开发 Checklist

### 单元测试
- [ ] 所有公共方法都有测试覆盖
- [ ] 边界条件已测试（null、空集合、极值）
- [ ] 异常路径已测试
- [ ] 异步代码已正确测试
- [ ] Mock 依赖已合理设置

### Widget 测试
- [ ] Widget 能正常构建和渲染
- [ ] 用户交互产生正确的状态变化
- [ ] 错误状态能正确显示
- [ ] 不同主题下表现正确
- [ ] 动画行为符合预期

### 集成测试
- [ ] 核心用户流程可正常运行
- [ ] 关键业务逻辑端到端验证
- [ ] 性能指标在可接受范围
- [ ] 错误恢复机制有效
```

---

## 9. 参考资源

### 官方文档

- [Flutter Testing Documentation](https://docs.flutter.dev/testing)
- [Cookbook: An introduction to unit testing](https://docs.flutter.dev/cookbook/testing/unit/introduction)
- [Cookbook: Introduction to widget testing](https://docs.flutter.dev/cookbook/testing/widget/introduction)
- [Cookbook: Introduction to integration testing](https://docs.flutter.dev/cookbook/testing/integration/introduction)

### 推荐包

- [test](https://pub.dev/packages/test) - Dart 测试框架
- [flutter_test](https://pub.dev/packages/flutter_test) - Flutter 测试工具
- [mocktail](https://pub.dev/packages/mocktail) - Mock 库（无需 code generation）
- [mockito](https://pub.dev/packages/mockito) - 经典 Mock 库
- [bloc_test](https://pub.dev/packages/bloc_test) - Bloc 状态管理测试
- [golden_toolkit](https://pub.dev/packages/golden_toolkit) - 快照测试

### 进阶学习

- [Effective Dart: Testing](https://dart.dev/guides/language/effective-dart/testing)
- [Testing Flutter Applications - YouTube](https://www.youtube.com/watch?v=4MvFFXdkKQo)
