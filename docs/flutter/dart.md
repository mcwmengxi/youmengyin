# ⭐Dart基础语法速通

>官方文档就完事了：[Introduction to Dart(英文)](https://dart.dev/language) OR [《Dart简介》(中文)](https://dart.cn/language)
推荐使用 [Dart在线编辑器 → DartPad](https://dartpad.dev/) 来写和跑测试Demo

## 1. 常识

- main() 函数：Dart程序的运行入口，一种特殊且必须的 顶层函数。
- print() 函数：将文本输出到控制台，支持 字符串插值，使用 $变量名 将变量嵌入到字符串中；
- 注释：Dart 支持三种类型的注释：单行注释 (//)、块级注释 (/*注释内容*/)、文档注释 (///)，使用建议 ：块级注释只用来临时注释一段代码，其它所有的注释都应该用单行注释。文档注释 用于 dart doc 生成代码的API文档。更多注释建议可查阅[《Effective Dart: Documentation》](https://link.juejin.cn/?target=https%3A%2F%2Fdart.dev%2Feffective-dart%2Fdocumentation)。

## 5. 类

### 5.1. 类定义及使用

直接使用 class 关键字定义

```dart
class Account {
  // 定义两个成员变量
  late String name;
  late int age;

  // 添加构造函数
  Account(this.name, this.age);

  void showInfo() {
    print("$name → $age");
  }
}

void main(List<String> args) {
  print(args);
  // 可以使用new关键字创建对象，也可以省略
  var account = Account("南宫",35);
  account.showInfo();
}
```

### 5.2. 构造函数

>有四种形式的构造函数：类名构造函数、命名构造函数、常量构造函数 及 工厂构造函数。

定义一个类，没定义构造函数，默认会有一个 无参构造函数，如果有父类，还会调用父类的无参构造函数。

先说说 `类名构造函数`， 就是和类同名的函数，可以参数化，但不能有返回值，如：

```dart
  Account(this.name, this.age);
  
```

`命名构造函数`，就是用 类名.修饰符 定义的函数：
可以使用命名构造函数为类提供多个构造函数，不过有一点要记住：命名构造函数不可继承。

```dart
  Account.simple(String name): this(name, 18);

  var account = Account.simple("南宫1");
```

 `常量构造函数`，如果类创建的对象永远不会改变，可以在编译期就创建这个常量实例，并定义一个常量构造函数，并且确保所有成员变量都是final的。

```dart
// 不能有函数体 const可以省略 入参是变量 外层不能有const
class Circle {
  final double radius; // 常量成员变量
  const Circle(this.radius); // 常量构造函数
  double get area => 3.14 * radius * radius; // 计算圆的面积
}

double radius = 10;
var circle = Circle(radius); 
print(circle.area);
```

 `工厂构造函数`，就是定义私有构造函数，然后使用 factory 关键字进行定义，根据不同情况创建不同的对象返回，简易代码示例如下：

```dart
class MyClass {
  final String name;
  final int age;
  MyClass._(this.name, this.age);

  factory MyClass(String name, int age) {
        // 在构造对象之前可以进行一些逻辑处理
    if (name == 'invalid') {
      return MyClass('', 0); // 返回null表示构造失败
    }

    return MyClass._(name, age);
  }
}
```

### 5.3. get/set修饰符

就是可以在 获取值 和 等号赋值时 进行一些方法调用，简单代码示例如下：

```dart
class Example {
  DateTime? launchData;

  int? get launchYear => launchData?.year;

  set launchYear(int? year) {
    launchData = DateTime(year ?? DateTime.now().year, 1, 1);
  }
}
```

### 5.4. 对象操作符

三个主要的操作符：as → 类型强转，is → 类型判断， .. → 级联操作(链式) ，简单代码示例：

```dart
var account = Account("南宫", 26);
// 强转
(account as Account).printInfo();

// 类型判断
if(account is Account) {
  print("当前对象为Account类型")
}

// 链式调用
account
  ..name = "小猪"
  ..age = 18;

```

### 5.5. 继承

子类使用 `extends` 关键字来继承父类，子类会继承父类里的属性和方法 (构造方法除外)，可以使用 super 关键字调用父类属性/方法，或者给父类构造方法传参，贴下官方例子：

```dart
/// 使用 extends 关键字声明继承的父类
class Orbiter extends Spacecraft {
  double altitude;
 /// 定义一个构造函数，用于初始化时从父类继承的属性
  Orbiter(super.name, DateTime super.launchDate, this.altitude);
}

```

### 5.6. 接口和抽象类

Dart里的接口跟Java有些不同，我们先思考下，引入接口是为了解决什么问题？

抽象出一类事物的功能，以便更灵活地进行扩展？

这是接口的作用，更深层次的目的是：解决多继承的二义性问题。这里的二义性问题，指的是多继承中 方法和属性名称的冲突，使得编译器无法确定该使用哪个父类的方法和属性。Java中是这样限制的：

接口中只能定义抽象成员和方法，不进行实现，强制子类必须实现。代码示例如下：

```java
interface A {
 public void test();
}

interface B {
 public void test();
}

class C implements A,B {
 @Override
 public void test() {
  System.out.println("Test");
 }
}

public class HelloWorld {
    public static void main(String []args) {
       C c = new C();
  c.test();
    }
}

```

回到Dart这边，没有 interface 关键字，所有类都被隐式定义成一个接口，任何类都可以作为接口被实现。那Dart是如何解决多继承/实现的二义性问题的？子类必须将父类中所有属性和方法全部重写。代码示例如下：

```dart
class A {
  String name;
  A(this.name);
  void printTest() => print("A");
}

class B {
  String name;
  B(this.name);
  void printTest() => print("B");
}

class C  implements A, B {
  @override
  String name = 'c';

  @override
  void printTest() {
    // TODO: implement printTest
    print('c$name');
  } 

 }
```

如果想实现Java中那种 通过接口来定义标准 的方式，可以使用 抽象类 (使用abstract修饰) 来实现。Dart中的抽象类不能被实例化，可以包含 抽象方法 (没有方法体) 和 非抽象方法 (有方法体)，代码示例如下：

```dart
class A {
  String name;
  A(this.name);
  void printTest() => print("A");
}

class B {
  String name;
  B(this.name);
  void printTest() => print("B");
}

class C  implements A, B {
  @override
  String name = 'c';

  @override
  void printTest() {
    // TODO: implement printTest
    print('c$name');
  } 

 }

 abstract class PlayerController {
  String playerName;
  PlayerController(this.playerName);
  void play();
  void pause();
  void destory(){
    print("播放器销毁了");
  } 
 }

 abstract class VolumeController {
  int volume = 0;
  void increase();
  void reduction();
 }

 class MusicPlayer extends
     PlayerController implements  VolumeController {
  @override
  String playerName = "音乐播放器";
 
  @override
  int volume = 30;

  MusicPlayer(super.playerName);
 
  @override
  void increase() {
    print("音量增加，当前音量：${++volume}");
  }
 
  @override
  void pause() {
    print("音乐播放器暂停了...");
  }
 
  @override
  void play() {
     print("音乐播放器开始播放...");
  }
 
  @override
  void reduction() {
    print("音量减少，当前音量：${--volume}");
  } 
  
 }
 void main(List<String> args) {
   C c = C();
   c.printTest();

    var player = MusicPlayer('music-player');
    player.play();  // 输出：音乐播放器开始播放...
    player.increase();  // 输出：音量增加，当前音量：31
    player.reduction(); // 输出：音量减少，当前音量：30
    player.pause(); // 输出：音乐播放器暂停了...
    player.destory(); // 输出：播放器销毁了


}
```

### 5.7. Mixins（混入）

Dart中允许使用 with 关键字，将其它类的功能添加到另一个类中 (该类可以复用其中的方法和属性)，从而能实现多继承。使用 mixin 关键字来定义一个混入类，使用代码示例如下：

```dart
mixin Swim {
  void swim() => print("能游泳");
}

class Animal {}

// 使用 on子句 指定该mixin可以混入的类类型，只能混入到继承了Animal的类中
mixin Fly on Animal {
  void fly() => print("能飞翔");
}


class Fish with Swim {}

// 混入Fly类，需要继承Animal类
class Duck extends Animal with Swim, Fly {}

void main() {
  var fish = Fish();
  fish.swim();  // 输出：能游泳
  var duck = Duck();
  duck.fly();   // 输出：能飞翔
  duck.swim();  // 输出：能游泳
}

```

### 5.8. 枚举和密封类

Dart中使用 enum 关键字定义枚举类型，枚举中的成员都有一个对应的索引值，从0开始.
枚举支持 扩展方法，如给定索引值，获取对应的枚举类型
增强型枚举，就是让枚举包含其它数据类型，代码示例如下：

```dart
enum TimeSlot {
  morning,
  afternoon,
  evening
}
extension TimeSlotType on TimeSlot {
  static TimeSlot getTypeFormIndex(int index) => TimeSlot.values[index];
}

enum Week {
  monday(cnStr: "周一", count: 1),
  tuesday(cnStr: "周二", count: 2),
  wednesday(cnStr: "周三", count: 3),
  thursday(cnStr: "周四", count: 4),
  friday(cnStr: "周五", count: 5),
  saturday(cnStr: "周六", count: 6),
  sunday(cnStr: "周日", count: 7);  // 最后一个成员要用分号;结尾！！！

  const Week({required this.cnStr, required this.count});
  final String cnStr;
  final int count;
}
void main() {
  for (var element in TimeSlot.values) {
    print(element);
    print("${element.index}=${element.name}");  // 输出：0=morning
  }
  print('--------------------');
  var type = TimeSlotType.getTypeFormIndex(1);
  print(type); // 输出：TimeSlot.afternoon

  print('--------------------');
  print(Week.friday.cnStr); // 输出：周五
  print(Week.friday.count); // 输出：周五
}
```

😄 `Dart`竟然和`Kotlin`一样有 密封类：限制类的结构层次，确保所有子类都被显示列出，在处理复杂状态、模式匹配和不处理不完整数据时非常有用。使用 `sealed` 关键字进行修饰，使用代码示例如下：

```dart
// sealed修饰的类是抽象类，无法被实例化！
sealed class RequestStatus {}

class Success extends RequestStatus {}

class Failure extends RequestStatus {}

String getStatusString(RequestStatus status) {
  return switch (status) {
    Success() => "请求成功",
    Failure() => "请求失败"
  };
}

void main(List<String> args) {
  print(getStatusString(Success()));
}
```

## 6. 异步

### 6.1. Future-异步任务

Dart 为事件队列的任务提供了一层封装 → Future，表示 一个在未来时间才会完成的任务。把一个函数体放入 Future，就完成了 同步任务到异步任务的包装。Future还提供 链式调用，可在异步任务完成后依次执行链路上的其它函数体。异步函数返回时，内部执行动作未结束，有两种选择：

- 异步处理：在返回的 Future 对象上注册一个 then，等Future执行体结束后，再进行异步处理；
- 同步等待：同步等待 Future 执行体结束，需在调用处使用 await，调用处的函数体使用 async，因为Dart里的await不是堵塞等待，而是 异步等待。

```dart
import 'package:http/http.dart' as http;

// 异步等待请求加载完毕，注意async和await关键字的位置
Future<void> loadData() async {
  var dataURL = Uri.parse('https://jsonplaceholder.typicode.com/posts');
  http.Response response = await http.get(dataURL);
  setState(() {
    widgets = jsonDecode(response.body);
  });
}
```
