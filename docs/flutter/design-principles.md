# Flutter 设计原则与模式 🎨

## 目录

- [1. OOP 面向对象编程](#1-oop-面向对象编程)
- [2. SOLID 原则](#2-solid-原则)
- [3. 设计模式 (Design Patterns)](#3-设计模式-design-patterns)
- [4. 依赖注入 (Dependency Injection)](#4-依赖注入-dependency-injection)
- [5. 实战应用与最佳实践](#5-实战应用与最佳实践)

---

## 1. OOP 面向对象编程 🧩

### 1.1 OOP 三大特性

#### 封装 (Encapsulation)

```dart
// ✅ 好的封装：隐藏内部实现细节
class BankAccount {
  String _accountNumber; // 私有属性
  double _balance = 0;

  BankAccount(this._accountNumber);

  // 公开方法控制访问
  void deposit(double amount) {
    if (amount > 0) {
      _balance += amount;
    }
  }

  bool withdraw(double amount) {
    if (amount > 0 && amount <= _balance) {
      _balance -= amount;
      return true;
    }
    return false;
  }

  // 只读访问
  double get balance => _balance;
}

// ❌ 差的封装：直接暴露内部状态
class BadBankAccount {
  double balance; // 直接暴露
}
```

#### 继承 (Inheritance)

```dart
// 基类
abstract class Animal {
  String name;
  Animal(this.name);

  void makeSound();
  void eat();
}

// 子类继承并扩展
class Dog extends Animal {
  Dog(String name) : super(name);

  @override
  void makeSound() => print('$name says: Woof!');

  @override
  void eat() => print('$name is eating dog food');

  // 子类特有方法
  void fetch() => print('$name is fetching the ball!');
}

class Cat extends Animal {
  Cat(String name) : super(name);

  @override
  void makeSound() => print('$name says: Meow!');

  @override
  void eat() => print('$name is eating fish');
}
```

#### 多态 (Polymorphism)

```dart
// 多态：同一接口，不同实现
void animalConcert(Animal animal) {
  animal.makeSound(); // 运行时决定调用哪个方法
}

void main() {
  List<Animal> animals = [Dog('Buddy'), Cat('Whiskers')];

  for (var animal in animals) {
    animalConcert(animal); // 多态调用
  }
}
```

### 1.2 Dart OOP 特性

```dart
// Mixin - Dart 特有的代码复用方式
mixin Flyable {
  void fly() => print('Flying...');
}

mixin Swimmable {
  void swim() => print('Swimming...');
}

class Duck with Flyable, Swimmable {
  void quack() => print('Quack!');
}

// 抽象类与接口
abstract class Shape {
  double get area;
  double get perimeter;
}

class Circle implements Shape {
  final double radius;

  Circle(this.radius);

  @override
  double get area => 3.14159 * radius * radius;

  @override
  double get perimeter => 2 * 3.14159 * radius;
}

// 扩展方法 (Extension)
extension StringExtension on String {
  bool get isValidEmail {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
  }

  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
```

---

## 2. SOLID 原则 📐

### 2.1 S - 单一职责原则 (Single Responsibility Principle)

**一个类应该只有一个引起它变化的原因**

```dart
// ❌ 违反 SRP：类承担多个职责
class UserManagement {
  void saveUser(User user) { /* 数据库操作 */ }
  void sendEmail(User user) { /* 发邮件 */ }
  void validateUser(User user) { /* 验证逻辑 */ }
  void generateReport(User user) { /* 生成报表 */ }
}

// ✅ 遵循 SRP：每个类单一职责
class UserRepository {
  void save(User user) { /* 只负责数据持久化 */ }
}

class EmailService {
  void sendWelcomeEmail(User user) { /* 只负责发送邮件 */ }
}

class UserValidator {
  bool validate(User user) { /* 只负责验证 */ }
}

class ReportGenerator {
  void generateUserReport(User user) { /* 只负责生成报表 */ }
}
```

### 2.2 O - 开闭原则 (Open/Closed Principle)

**对扩展开放，对修改关闭**

```dart
// ❌ 违反 OCP：每次添加新折扣类型都要修改原类
class DiscountCalculator {
  double calculateDiscount(String type, double price) {
    switch (type) {
      case 'student':
        return price * 0.8;
      case 'senior':
        return price * 0.85;
      case 'vip':
        return price * 0.7;
      default:
        return price; // 每次新增类型都要修改这里
    }
  }
}

// ✅ 遵循 OCP：使用策略模式，对扩展开放
abstract class DiscountStrategy {
  double calculate(double price);
}

class StudentDiscount implements DiscountStrategy {
  @override
  double calculate(double price) => price * 0.8;
}

class VipDiscount implements DiscountStrategy {
  @override
  double calculate(double price) => price * 0.7;
}

class HolidayDiscount implements DiscountStrategy {
  @override
  double calculate(double price) => price * 0.65;
}

// 添加新折扣只需新建类，无需修改现有代码
class DiscountCalculator {
  final DiscountStrategy strategy;

  DiscountCalculator(this.strategy);

  double calculate(double price) => strategy.calculate(price);
}
```

### 2.3 L - 里氏替换原则 (Liskov Substitution Principle)

**子类必须能够替换其父类**

```dart
// ❌ 违反 LSP：子类改变了父类的行为语义
class Rectangle {
  double width;
  double height;

  Rectangle(this.width, this.height);

  setWidth(double w) => width = w;
  setHeight(double h) => height = h;
  double get area => width * height;
}

class Square extends Rectangle {
  Square(double side) : super(side, side);

  @override
  setWidth(double w) {
    width = w;
    height = w; // 正方形宽高必须相等
  }

  @override
  setHeight(double h) {
    width = h;
    height = h;
  }
}

// 问题：Square 不能完美替代 Rectangle
void testRectangle(Rectangle r) {
  r.setWidth(5);
  r.setHeight(10);
  print(r.area); // Rectangle: 50, Square: 100 ❌ 行为不一致
}

// ✅ 遵循 LSP：使用组合而非强制继承
abstract class Shape {
  double get area;
}

class BetterRectangle implements Shape {
  final double width;
  final double height;

  BetterRectangle(this.width, this.height);

  @override
  double get area => width * height;
}

class BetterSquare implements Shape {
  final double side;

  BetterSquare(this.side);

  @override
  double get area => side * side;
}
```

### 2.4 I - 接口隔离原则 (Interface Segregation Principle)

**客户端不应该被迫依赖它不使用的接口**

```dart
// ❌ 违反 ISP：过于臃肿的接口
abstract class Worker {
  void work();
  void eat();
  void sleep();
  void code();
  void test();
  void deploy();
}

class Developer implements Worker {
  @override
  void work() { /* ... */ }
  @override
  void eat() { /* ... */ }
  @override
  void sleep() { /* ... */ }
  @override
  void code() { /* ... */ }
  @override
  void test() { /* 强制实现不需要的方法 */ }
  @override
  void deploy() { /* 强制实现不需要的方法 */ }
}

// ✅ 遵循 ISP：细粒度接口
interface Workable {
  void work();
}

interface Codeable {
  void code();
}

interface Testable {
  void test();
}

interface Deployable {
  void deploy();
}

class GoodDeveloper implements Workable, Codeable {
  @override
  void work() { /* ... */ }

  @override
  void code() { /* ... */ }
  // 只实现需要的接口
}

class DevOpsEngineer implements Workable, Deployable {
  @override
  void work() { /* ... */ }

  @override
  void deploy() { /* ... */ }
}
```

### 2.5 D - 依赖倒置原则 (Dependency Inversion Principle)

**依赖于抽象，不依赖于具体**

```dart
// ❌ 违反 DIP：高层模块直接依赖低层模块
class OrderService {
  final MySqlDatabase _database; // 直接依赖具体实现

  OrderService(this._database);

  void saveOrder(Order order) {
    _database.insert(order);
  }
}

// ✅ 遵循 DIP：依赖抽象（接口）
abstract class Database {
  void insert(dynamic data);
  void update(dynamic data);
  void delete(int id);
  List<dynamic> query(String sql);
}

class MySqlDatabase implements Database {
  @override
  void insert(dynamic data) { /* MySQL 实现 */ }
  @override
  void update(dynamic data) { /* MySQL 实现 */ }
  @override
  void delete(int id) { /* MySQL 实现 */ }
  @override
  List<dynamic> query(String sql) { /* MySQL 实现 */ }
}

class PostgreSqlDatabase implements Database {
  @override
  void insert(dynamic data) { /* PostgreSQL 实现 */ }
  @override
  void update(dynamic data) { /* PostgreSQL 实现 */ }
  @override
  void delete(int id) { /* PostgreSQL 实现 */ }
  @override
  List<dynamic> query(String sql) { /* PostgreSQL 实现 */ }
}

class BetterOrderService {
  final Database _database; // 依赖抽象

  BetterOrderService(this._database);

  void saveOrder(Order order) {
    _database.insert(order);
  }
}
```

### 2.6 SOLID 原则总结表

| 原则 | 核心思想 | 关键点 |
|------|----------|--------|
| **S**RP | 单一职责 | 一个类只做一件事 |
| **O**CP | 开闭原则 | 对扩展开放，对修改关闭 |
| **L**SP | 里氏替换 | 子类可替换父类 |
| **I**SP | 接口隔离 | 接口要小而精 |
| **D**IP | 依赖倒置 | 依赖抽象，不依赖具体 |

---

## 3. 设计模式 (Design Patterns) 🏗️

### 3.1 创建型模式 (Creational Patterns)

#### 单例模式 (Singleton)

```dart
// ✅ Flutter 中常用的单例模式
class AuthService {
  static final AuthService _instance = AuthService._internal();

  factory AuthService() => _instance;

  AuthService._internal();

  String? _token;
  User? _currentUser;

  bool get isAuthenticated => _token != null;

  Future<void> login(String email, String password) async {
    // 登录逻辑
    _token = 'generated_token';
  }

  void logout() {
    _token = null;
    _currentUser = null;
  }
}

// 使用
final auth = AuthService();
await auth.login('user@example.com', 'password');
```

#### 工厂模式 (Factory Method)

```dart
// 抽象产品
abstract class Button {
  Widget render();
}

// 具体产品
class MaterialButton implements Button {
  @override
  Widget render() {
    return ElevatedButton(
      onPressed: () {},
      child: Text('Material Button'),
    );
  }
}

class CupertinoButton implements Button {
  @override
  Widget render() {
    return CupertinoButton(
      onPressed: () {},
      child: Text('Cupertino Button'),
    );
  }
}

// 工厂
enum PlatformType { material, cupertino }

class ButtonFactory {
  static Button createButton(PlatformType platform) {
    switch (platform) {
      case PlatformType.material:
        return MaterialButton();
      case PlatformType.cupertino:
        return CupertinoButton();
    }
  }
}

// 使用
final button = ButtonFactory.createButton(PlatformType.material);
button.render();
```

#### 建造者模式 (Builder)

```dart
// 复杂对象的分步构建
class AlertDialogBuilder {
  String? _title;
  String? _content;
  List<Widget>? _actions;
  VoidCallback? _onConfirm;

  AlertDialogBuilder setTitle(String title) {
    _title = title;
    return this;
  }

  AlertDialogBuilder setContent(String content) {
    _content = content;
    return this;
  }

  AlertDialogBuilder setActions(List<Widget> actions) {
    _actions = actions;
    return this;
  }

  AlertDialogBuilder onConfirm(VoidCallback callback) {
    _onConfirm = callback;
    return this;
  }

  AlertDialog build() {
    return AlertDialog(
      title: Text(_title ?? ''),
      content: Text(_content ?? ''),
      actions: _actions,
    );
  }
}

// 使用链式调用
final dialog = AlertDialogBuilder()
    .setTitle('确认删除')
    .setContent('确定要删除这个项目吗？')
    .setActions([
      TextButton(onPressed: () {}, child: Text('取消')),
      TextButton(onPressed: () {}, child: Text('确定')),
    ])
    .build();
```

### 3.2 结构型模式 (Structural Patterns)

#### 适配器模式 (Adapter)

```dart
// 将不兼容的接口转换为兼容的接口
// 第三方支付 SDK 接口
class AlipaySDK {
  void payWithAlipay(String orderId, double amount) {
    print('支付宝支付: $orderId - ¥$amount');
  }
}

class WeChatPaySDK {
  void wechatPayment(String transactionId, double money) {
    print('微信支付: $transactionId - ¥$money');
  }
}

// 统一接口
abstract class PaymentGateway {
  void pay(String orderId, double amount);
}

// 适配器
class AlipayAdapter implements PaymentGateway {
  final AlipaySDK _alipay = AlipaySDK();

  @override
  void pay(String orderId, double amount) {
    _alipay.payWithAlipay(orderId, amount);
  }
}

class WeChatAdapter implements PaymentGateway {
  final WeChatPaySDK _wechat = WeChatPaySDK();

  @override
  void pay(String orderId, double amount) {
    _wechat.wechatPayment(orderId, amount);
  }
}

// 使用统一接口
class PaymentService {
  void processPayment(PaymentGateway gateway, String orderId, double amount) {
    gateway.pay(orderId, amount);
  }
}
```

#### 装饰器模式 (Decorator)

```dart
// 动态地给对象添加额外功能
abstract class DataSource {
  String readData();
  void writeData(String data);
}

class BasicDataSource implements DataSource {
  @override
  String readData() => '原始数据';

  @override
  void writeData(String data) => print('写入: $data');
}

// 装饰器基类
abstract class DataSourceDecorator implements DataSource {
  final DataSource _wrappee;

  DataSourceDecorator(this._wrappee);
}

// 加密装饰器
class EncryptedDataSource extends DataSourceDecorator {
  EncryptedDataSource(DataSource source) : super(source);

  @override
  String readData() {
    final encrypted = _wrappee.readData();
    return _decrypt(encrypted); // 解密
  }

  @override
  void writeData(String data) {
    final encrypted = _encrypt(data); // 加密
    _wrappee.writeData(encrypted);
  }

  String _decrypt(String data) => data; // 简化示例
  String _encrypt(String data) => data; // 简化示例
}

// 缓存装饰器
class CachedDataSource extends DataSourceDecorator {
  String? _cache;

  CachedDataSource(DataSource source) : super(source);

  @override
  String readData() {
    if (_cache != null) {
      return _cache!; // 从缓存读取
    }
    final data = _wrappee.readData();
    _cache = data;
    return data;
  }

  @override
  void writeData(String data) {
    _cache = data;
    _wrappee.writeData(data);
  }
}
```

#### 代理模式 (Proxy)

```dart
// 为其他对象提供代理以控制对这个对象的访问
abstract class Image {
  void display();
}

class RealImage implements Image {
  final String _filename;

  RealImage(this._filename) {
    _loadFromDisk(); // 重载操作
  }

  void _loadFromDisk() {
    print('加载图片: $_filename');
  }

  @override
  void display() {
    print('显示图片: $_filename');
  }
}

class ProxyImage implements Image {
  final String _filename;
  RealImage? _realImage;

  ProxyImage(this._filename);

  @override
  void display() {
    if (_realImage == null) {
      _realImage = RealImage(_filename); // 延迟加载
    }
    _realImage!.display();
  }
}

// 使用
void main() {
  final image = ProxyImage('photo.jpg');
  // 此时图片还未加载
  image.display(); // 第一次显示时才加载
  image.display(); // 直接显示，无需重新加载
}
```

### 3.3 行为型模式 (Behavioral Patterns)

#### 观察者模式 (Observer)

```dart
// Flutter 中的 ChangeNotifier 就是观察者模式的实现
class CounterNotifier extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // 通知所有观察者
  }

  void decrement() {
    _count--;
    notifyListeners();
  }
}

// 自定义观察者模式实现
abstract class Observer {
  void update(String message);
}

class Subject {
  final List<Observer> _observers = [];

  void attach(Observer observer) {
    _observers.add(observer);
  }

  void detach(Observer observer) {
    _observers.remove(observer);
  }

  void notifyObservers(String message) {
    for (var observer in _observers) {
      observer.update(message);
    }
  }
}

class LogObserver implements Observer {
  @override
  void update(String message) {
    print('[Log] $message');
  }
}

class AnalyticsObserver implements Observer {
  @override
  void update(String message) {
    print('[Analytics] Tracking: $message');
  }
}
```

#### 策略模式 (Strategy)

```dart
// 定义一系列算法，将它们封装起来，并且使它们可以相互替换
abstract class SortingStrategy {
  List<int> sort(List<int> data);
}

class BubbleSort implements SortingStrategy {
  @override
  List<int> sort(List<int> data) {
    // 冒泡排序实现
    var result = List<int>.from(data);
    for (int i = 0; i < result.length - 1; i++) {
      for (int j = 0; j < result.length - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          var temp = result[j];
          result[j] = result[j + 1];
          result[j + 1] = temp;
        }
      }
    }
    return result;
  }
}

class QuickSort implements SortingStrategy {
  @override
  List<int> sort(List<int> data) {
    // 快速排序实现
    if (data.length <= 1) return data;
    var pivot = data[data.length ~/ 2];
    var less = data.where((x) => x < pivot).toList();
    var equal = data.where((x) == pivot).toList();
  var greater = data.where((x) > pivot).toList();
    return [...sort(less), ...equal, ...sort(greater)];
  }
}

class SortContext {
  SortingStrategy _strategy;

  SortContext(this._strategy);

  set strategy(SortingStrategy s) => _strategy = s;

  List<int> executeSort(List<int> data) => _strategy.sort(data);
}

// 使用
void main() {
  var context = SortContext(BubbleSort());
  print(context.executeSort([5, 3, 8, 1])); // 使用冒泡排序

  context.strategy = QuickSort();
  print(context.executeSort([5, 3, 8, 1])); // 切换为快速排序
}
```

#### 命令模式 (Command)

```dart
// 将请求封装成对象
abstract class Command {
  void execute();
  void undo();
}

class TextEditor {
  String _text = '';

  String get text => _text;

  void write(String content) {
    _text += content;
  }

  void delete(int chars) {
    if (_text.length >= chars) {
      _text = _text.substring(0, _text.length - chars);
    }
  }
}

class WriteCommand implements Command {
  final TextEditor _editor;
  final String _content;

  WriteCommand(this._editor, this._content);

  @override
  void execute() => _editor.write(_content);

  @override
  void undo() => _editor.delete(_content.length);
}

class CommandManager {
  final List<Command> _history = [];
  int _currentIndex = -1;

  void execute(Command command) {
    command.execute();
    _history.add(command);
    _currentIndex++;
  }

  void undo() {
    if (_currentIndex >= 0) {
      _history[_currentIndex].undo();
      _currentIndex--;
    }
  }

  void redo() {
    if (_currentIndex < _history.length - 1) {
      _currentIndex++;
      _history[_currentIndex].execute();
    }
  }
}
```

### 3.4 Flutter 常用设计模式速查表

| 模式 | 类型 | Flutter 应用场景 |
|------|------|------------------|
| **单例** | 创建型 | AuthService、Theme、Database |
| **工厂** | 创建型 | 平台特定组件创建、Widget 工厂 |
| **建造者** | 创建型 | AlertDialog、复杂 Widget 构建 |
| **观察者** | 行为型 | ChangeNotifier、Stream、BLoC |
| **策略** | 行为型 | 主题切换、算法选择、验证规则 |
| **命令** | 行为型 | 撤销/重做、操作队列 |
| **适配器** | 结构型 | 第三方 SDK 适配、数据格式转换 |
| **装饰器** | 结构型 | Widget 组合、功能增强 |

---

## 4. 依赖注入 (Dependency Injection) 💉

### 4.1 什么是依赖注入

**依赖注入 (DI)** 是一种实现控制反转 (IoC) 的技术，让对象在外部获取它的依赖，而不是在内部创建。

```dart
// ❌ 硬编码依赖：紧密耦合
class UserService {
  final DatabaseHelper _db = DatabaseHelper(); // 直接创建依赖
  final ApiService _api = ApiService();         // 直接创建依赖

  User? getUser(int id) {
    return _db.query(id); // 无法测试，无法切换实现
  }
}

// ✅ 依赖注入：松耦合
class BetterUserService {
  final DatabaseHelper _db;
  final ApiService _api;

  BetterUserService({
    required DatabaseHelper db,
    required ApiService api,
  })  : _db = db,
        _api = api;

  User? getUser(int id) {
    return _db.query(id); // 可以轻松替换和测试
  }
}
```

### 4.2 DI 的三种方式

#### 构造函数注入 (推荐)

```dart
class UserRepository {
  final Database _database;

  // 通过构造函数注入
  UserRepository(this._database);

  Future<User?> findById(int id) async {
    return await _database.query('users', where: 'id = ?', whereArgs: [id]);
  }
}

// 使用
final db = MySqlDatabase();
final repository = UserRepository(db);
```

#### Setter 注入

```dart
class AnalyticsService {
  Tracker? _tracker;

  // 通过 setter 注入可选依赖
  set tracker(Tracker t) => _tracker = t;

  void trackEvent(String event) {
    _tracker?.track(event);
  }
}

// 使用
final analytics = AnalyticsService();
analytics.tracker = FirebaseTracker(); // 可选设置
```

#### 接口注入

```dart
abstract class Injectable {
  void inject(DependencyContainer container);
}

class MyService implements Injectable {
  late Logger _logger;

  @override
  void inject(DependencyContainer container) {
    _logger = container.get<Logger>();
  }
}
```

### 4.3 手动实现简单的 DI 容器

```dart
// 简易 DI 容器
class ServiceLocator {
  static final ServiceLocator _instance = ServiceLocator._();
  static ServiceLocator get instance => _instance;

  ServiceLocator._();

  final Map<Type, dynamic> _services = {};
  final Map<Type, Function> _factories = {};

  // 注册单例
  void registerSingleton<T>(T service) {
    _services[T] = service;
  }

  // 注册工厂
  void registerFactory<T>(Function factory) {
    _factories[T] = factory;
  }

  // 获取服务
  T get<T>() {
    if (_services.containsKey(T)) {
      return _services[T] as T;
    }
    if (_factories.containsKey(T)) {
      return _factories[T]() as T;
    }
    throw Exception('Service $T not registered');
  }

  // 清理
  void unregister<T>() {
    _services.remove(T);
    _factories.remove(T);
  }
}

// 使用
void setupDependencies() {
  final locator = ServiceLocator.instance;

  // 注册数据库
  locator.registerSingleton(Database());

  // 注册仓库（带依赖）
  locator.registerFactory<UserRepository>(
    () => UserRepository(locator.get<Database>()),
  );

  // 注册服务
  locator.registerFactory<UserService>(
    () => UserService(locator.get<UserRepository>()),
  );
}
```

### 4.4 使用 GetIt 库（推荐）

GetIt 是 Flutter/Dart 社区最流行的 DI 库。

```yaml
# pubspec.yaml
dependencies:
  get_it: ^7.6.0
```

```dart
// lib/di/injection.dart
import 'package:get_it/get_it.dart';

final getIt = GetIt.instance;

void setupDependencies() {
  // 注册单例
  getIt.registerLazySingleton<Database>(() => Database());
  getIt.registerLazySingleton<ApiService>(() => ApiService());

  // 注册工厂（每次获取新实例）
  getIt.registerFactory<UserRepository>(
    () => UserRepository(getIt<Database>()),
  );

  getIt.registerFactory<UserService>(
    () => UserService(getIt<UserRepository>(), getIt<ApiService>()),
  );

  // 注册异步单例
  getIt.registerSingletonAsync<AuthService>(() async {
    final service = AuthService();
    await service.initialize();
    return service;
  });
}

// 在 main.dart 中初始化
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupDependencies();
  runApp(MyApp());
}

// 在任何地方使用
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final userService = getIt<UserService>();
    // 使用 userService...
  }
}
```

### 4.5 使用 injectable 代码生成（进阶）

```yaml
# pubspec.yaml
dependencies:
  injectable: ^2.3.0
  get_it: ^7.6.0

dev_dependencies:
  injectable_generator: ^2.4.0
  build_runner: ^2.4.0
```

```dart
// 使用注解自动注册
@singleton
class AuthService {
  // ...
}

@lazySingleton
class Database {
  // ...
}

@factoryMethod
UserRepository createUserRepo(Database db) => UserRepository(db);

// 生成配置
// 运行: flutter pub run build_runner build
```

### 4.6 DI 最佳实践对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **构造函数注入** | 明确、不可变、编译期检查 | 参数可能变多 | 必选依赖 |
| **Setter 注入** | 灵活、可选依赖 | 可能忘记设置 | 可选依赖 |
| **DI 容器** | 自动化管理、集中配置 | 学习成本、魔法代码 | 大型项目 |
| **手动 DI** | 简单透明、易于理解 | 样板代码多 | 小型项目 |

---

## 5. 实战应用与最佳实践 💡

### 5.1 架构分层与设计原则结合

```dart
// 典型的 Flutter 项目架构
lib/
├── core/
│   ├── di/                    # 依赖注入配置
│   │   └── injection.dart
│   ├── utils/                 # 工具类
│   └── constants/             # 常量
├── data/
│   ├── models/                # 数据模型 (遵循 OOP 封装)
│   ├── repositories/          # 仓库实现 (遵循 DIP)
│   └── datasources/           # 数据源 (遵循 ISP)
├── domain/
│   ├── entities/              # 业务实体
│   ├── repositories/          # 仓库接口 (抽象)
│   └── usecases/              # 用例 (遵循 SRP)
└── presentation/
    ├── pages/                 # 页面
    ├── widgets/               # 组件 (使用 Builder 模式)
    └── providers/             # 状态管理 (观察者模式)
```

### 5.2 综合示例：用户认证模块

```dart
// ========== Domain Layer ==========

// 实体 (Entity)
class User {
  final int id;
  final String email;
  final String name;

  User({required this.id, required this.email, required this.name});
}

// 仓库接口 (遵循 DIP)
abstract class AuthRepository {
  Future<User?> login(String email, String password);
  Future<void> logout();
  Future<User?> getCurrentUser();
}

// 用例 (遵循 SRP)
class LoginUseCase {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  Future<Result<User>> execute(String email, String password) async {
    try {
      final user = await _repository.login(email, password);
      if (user != null) {
        return Success(user);
      }
      return Failure('Invalid credentials');
    } catch (e) {
      return Failure(e.toString());
    }
  }
}

// ========== Data Layer ==========

// 数据模型转换 (适配器模式)
class UserModel extends User {
  UserModel({
    required super.id,
    required super.email,
    required super.name,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      name: json['name'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'name': name,
  };
}

// 仓库实现
class AuthRepositoryImpl implements AuthRepository {
  final RemoteDataSource _remoteDataSource;
  final LocalDataSource _localDataSource;

  AuthRepositoryImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<User?> login(String email, String password) async {
    final response = await _remoteDataSource.login(email, password);
    if (response != null) {
      await _localDataSource.cacheUser(response);
      return response.toEntity();
    }
    return null;
  }

  @override
  Future<void> logout() async {
    await _remoteDataSource.logout();
    await _localDataSource.clearCache();
  }

  @override
  Future<User?> getCurrentUser() async {
    final cached = await _localDataSource.getCachedUser();
    return cached?.toEntity();
  }
}

// ========== Presentation Layer ==========

// Provider (观察者模式)
class AuthProvider extends ChangeNotifier {
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;

  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider({
    required LoginUseCase loginUseCase,
    required LogoutUseCase logoutUseCase,
  })  : _loginUseCase = loginUseCase,
        _logoutUseCase = logoutUseCase;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _loginUseCase.execute(email, password);

    result.when(
      success: (user) {
        _user = user;
        _isLoading = false;
      },
      failure: (error) {
        _error = error;
        _isLoading = false;
      },
    );

    notifyListeners();
  }
}

// ========== DI 配置 ==========

void configureDependencies() {
  // Data sources
  getIt.registerLazySingleton<RemoteDataSource>(() => ApiDataSource());
  getIt.registerLazySingleton<LocalDataSource>(() => SharedPreferencesDataSource());

  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(getIt(), getIt()),
  );

  // Use cases
  getIt.registerFactory<LoginUseCase>(() => LoginUseCase(getIt()));
  getIt.registerFactory<LogoutUseCase>(() => LogoutUseCase(getIt()));

  // Providers
  getIt.registerFactory<AuthProvider>(
    () => AuthProvider(loginUseCase: getIt(), logoutUseCase: getIt()),
  );
}
```

### 5.3 设计决策检查清单

在设计 Flutter 应用架构时，问自己这些问题：

#### OOP 检查
- [ ] 类是否只暴露必要的方法？（封装）
- [ ] 继承关系是否合理？是否应该用组合替代？
- [ ] 是否正确使用了多态？

#### SOLID 检查
- [ ] **S**: 这个类是否有且仅有一个改变的原因？
- [ ] **O**: 新增功能是否可以不修改原有代码？
- [ ] **L**: 子类能否完美替代父类而不破坏程序？
- [ ] **I**: 接口是否足够小？客户端是否被迫实现不需要的方法？
- [ ] **D**: 高层模块是否依赖抽象而非具体实现？

#### 设计模式检查
- [ ] 选择的设计模式是否解决了实际问题？
- [ ] 是否过度设计了？（YAGNI 原则）
- [ ] 团队成员是否都能理解这个模式？

#### DI 检查
- [ ] 依赖是否通过构造函数注入？
- [ ] 是否避免了服务定位器反模式？
- [ ] 测试时是否可以轻松 mock 依赖？

### 5.4 常见陷阱与解决方案

```dart
// ❌ 陷阱 1: 过度使用单例
class AntiPattern {
  // 所有东西都做成单例导致隐式依赖，难以测试
  static final instance = AntiPattern._();
}

// ✅ 解决: 合理使用 DI
class GoodPattern {
  final Dependency dep;
  GoodPattern(this.dep); // 显式依赖
}

// ❌ 陷阱 2: God Class (上帝类)
class UserManager {
  // 包含了验证、持久化、网络请求、UI 更新等所有功能
  // 违反 SRP
}

// ✅ 解决: 职责分离
class UserValidator { /* 只负责验证 */ }
class UserRepository { /* 只负责数据持久化 */ }
class UserApiService { /* 只负责网络请求 */ }

// ❌ 陷阱 3: 过度设计
// 对于简单应用引入复杂的框架和模式

// ✅ 解决: KISS 原则 (Keep It Simple, Stupid)
// 从简单开始，根据实际需求逐步引入复杂性
```

### 5.5 推荐学习路径

1. **基础阶段**: 掌握 OOP 三大特性（封装、继承、多态）
2. **进阶阶段**: 理解并应用 SOLID 五大原则
3. **熟练阶段**: 学会常用的设计模式（单例、工厂、观察者、策略）
4. **高级阶段**: 掌握依赖注入及其在项目中的应用
5. **专家阶段**: 能够根据业务场景灵活运用各种设计原则和模式

---

## 📚 参考资源

- [SOLID Principles - Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns - GoF Book](https://en.wikipedia.org/wiki/Design_Patterns)
- [Flutter Architecture Samples](https://github.com/bloc/flutter_architecture_samples)
- [GetIt Package](https://pub.dev/packages/get_it)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
