# ⭐Advanced Dart 高级特性

> 深入掌握 Dart 的高级特性，提升代码质量和性能
推荐使用 [Dart在线编辑器 → DartPad](https://dartpad.dev/) 来测试代码

---

## 🎯 Advanced Dart 学习路线图

```
┌─────────────────────────────────────────────────────┐
│                Advanced Dart 体系                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────┬──────────┬──────────┐                  │
│  │  Lists  │Collections│ Lambdas │                  │
│  └─────────┴──────────┴──────────┘                  │
│  ┌────────────────────────────────┐                 │
│  │    Functional Programming      │                 │
│  └────────────────────────────────┘                 │
│  ┌────────────┬───────────────────┐                 │
│  │  Isolates  │   Async / Await   │                 │
│  └────────────┴───────────────────┘                 │
│  ┌────────────────────────────────┐                 │
│  │       Core Libraries           │                 │
│  ├────────────────────────────────┤                 │
│  │          Streams               │                 │
│  ├────────────────────────────────┤                 │
│  │          Futures               │                 │
│  └────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

---

## 1. Lists (列表高级操作) 📋

### 1.1 列表创建与初始化

```dart
void listCreation() {
  // 基本创建方式
  var emptyList = <int>[];                    // 空列表
  var filledList = List.filled(5, 0);         // 固定长度，初始值 0
  var growableList = <String>[];              // 可增长列表
  
  // 使用生成器创建
  var generated = List.generate(10, (i) => i * i);     // [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
  var unfilled = List<int>.unmodifiable([1, 2, 3]);    // 不可变列表
  
  // 从可迭代对象创建
  var fromIterable = List.from([1, 2, 3]);
  var fromSet = [1, 2, 3].toSet().toList();            // Set → List
  
  // 展开运算符
  var list1 = [1, 2, 3];
  var list2 = [4, 5, 6];
  var combined = [...list1, ...list2];                 // [1, 2, 3, 4, 5, 6]
  
  // 条件展开
  bool includeExtra = true;
  var conditional = [...list1, if (includeExtra) ...list2]; // 条件性包含
  
  // for 循环展开
  var numbers = [1, 2, 3];
  var doubled = [for (var n in numbers) n * 2];        // [2, 4, 6]
}
```

### 1.2 列表高级操作

```dart
void advancedListOperations() {
  var numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  
  // 排序
  numbers.sort();                                      // 升序: [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]
  numbers.sort((a, b) => b.compareTo(a));              // 降序: [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]
  
  // 自定义排序规则
  var users = [
    {'name': 'Alice', 'age': 30},
    {'name': 'Bob', 'age': 25},
    {'name': 'Charlie', 'age': 35},
  ];
  users.sort((a, b) => (a['age'] as int).compareTo(b['age'] as int)); // 按年龄排序
  
  // 查找元素
  print(numbers.first);                                // 第一个元素
  print(numbers.last);                                 // 最后一个元素
  print(numbers.firstWhere((n) => n > 5));             // 第一个大于 5 的: 6
  print(numbers.lastWhere((n) => n < 5));              // 最后一个小于 5 的: 2
  print(numbers.where((n) => n == 5).toList());        // 所有等于 5 的: [5, 5, 5]
  print(numbers.indexWhere((n) => n == 5));            // 第一个 5 的索引: 2
  print(numbers.lastIndexWhere((n) => n == 5));        // 最后一个 5 的索引: 4
  
  // 单个或空
  print(numbers.singleWhere((n) => n == 9));           // 只有一个时返回该元素
  // numbers.singleWhere((n) => n == 5);              // ❌ 多个会抛异常
  print(numbers.singleWhere((n) => n == 5, orElse: () => -1)); // 多个返回默认值
  
  // 分组
  var grouped = numbers.groupListsBy((n) => n.isEven ? '偶数' : '奇数');
  // {奇数: [9, 5, 5, 5, 3, 3, 1, 1], 偶数: [6, 4, 2]}
  
  // 分割
  var parts = numbers.splitWhere((n) => n == 5);       // 按 5 分割成多个列表
  
  // 去重并保持顺序
  var unique = numbers.toSet().toList();
  // 或者使用 fold 保持插入顺序
  var orderedUnique = <int>[];
  for (var n in numbers) {
    if (!orderedUnique.contains(n)) {
      orderedUnique.add(n);
    }
  }
}
```

### 1.3 列表高阶函数

```dart
void higherOrderFunctions() {
  var numbers = [1, 2, 3, 4, 5];
  
  // map - 映射转换
  var doubled = numbers.map((n) => n * 2).toList();    // [2, 4, 6, 8, 10]
  var squared = numbers.map((n) => n * n).toList();    // [1, 4, 9, 16, 25]
  var toStrings = numbers.map((n) => '数字 $n').tolist();// ['数字 1', '数字 2', ...]
  
  // where / takeWhile / skipWhile - 过滤
  var evens = numbers.where((n) => n.isEven).toList(); // [2, 4]
  var lessThan3 = numbers.takeWhile((n) => n < 3).toList(); // [1, 2]
  var from3onwards = numbers.skipWhile((n) => n < 3).toList(); // [3, 4, 5]
  
  // expand - 展开（一对多）
  var nested = [[1, 2], [3, 4], [5]];
  var flattened = nested.expand((list) => list).toList(); // [1, 2, 3, 4, 5]
  
  // fold / reduce - 折叠聚合
  var sum = numbers.fold(0, (prev, curr) => prev + curr); // 总和: 15
  var product = numbers.fold(1, (prev, curr) => prev * curr); // 乘积: 120
  var maxVal = numbers.reduce((curr, next) => curr > next ? curr : next); // 最大值: 5
  var concatenated = numbers.fold('', (prev, curr) => '$prev$curr'); // 字符串连接: '12345'
  
  // forEach - 遍历执行
  numbers.forEach(print);                               // 打印每个元素
  numbers.asMap().forEach((index, value) {
    print('索引 $index: $value');                       // 带索引遍历
  });
  
  // every / any - 条件判断
  var allPositive = numbers.every((n) => n > 0);        // 是否全部满足: true
  var hasEven = numbers.any((n) => n.isEven);          // 是否存在满足的: true
  
  // take / skip / takeLast / skipLast - 截取
  var first3 = numbers.take(3).tolist();                // 前 3 个: [1, 2, 3]
  var skipFirst2 = numbers.skip(2).tolist();            // 跳过前 2 个: [3, 4, 5]
  var last2 = numbers.takeLast(2).tolist();             // 最后 2 个: [4, 5]
  
  // 链式调用示例
  var result = numbers
      .where((n) => n.isEven)
      .map((n) => n * n)
      .take(2)
      .tolist();
  // [4, 16] - 过滤偶数 → 平方 → 取前 2 个
}
```

### 1.4 不可变列表与视图

```dart
void immutableLists() {
  // UnmodifiableListView - 不可修改的视图
  var source = [1, 2, 3, 4, 5];
  var unmodifiableView = UnmodifiableListView(source);
  
  print(unmodifiableView[0]);                          // ✅ 可以读取: 1
  // unmodifiableView.add(6);                           // ❌ 编译错误！不能修改
  
  // 修改原列表会影响视图
  source.add(6);
  print(unmodifiableView.length);                       // 现在是 6
  
  // List.of 创建副本
  var copy = List.of(source);                           // 浅拷贝
  copy.add(7);
  print(source.length);                                 // 原列表不变: 6
  
  // const 列表 - 编译时常量
  const constantList = [1, 2, 3];
  // constantList.add(4);                              // ❌ 编译错误！完全不可变
  
  // 固定长度列表
  var fixedLength = List.filled(3, 0, growable: false);
  // fixedLength.add(4);                               // ❌ 运行时错误！不能改变长度
  fixedLength[0] = 99;                                  // ✅ 但可以修改元素
}
```

---

## 2. Collections (集合框架) 🗂️

### 2.1 Set 高级用法

```dart
void advancedSets() {
  // LinkedHashSet - 保持插入顺序
  var orderedSet = <int>{3, 1, 4, 1, 5, 9};
  print(orderedSet);                                    // {3, 1, 4, 5, 9} - 保持顺序
  
  // SplayTreeSet - 自动排序
  var treeSet = SplayTreeSet<int>();
  treeSet.addAll([3, 1, 4, 1, 5, 9]);
  print(treeSet);                                       // {1, 3, 4, 5, 9} - 自动排序
  
  // 自定义排序
  var customSorted = SplayTreeSet<String>((a, b) => b.compareTo(a));
  customSorted.addAll(['apple', 'banana', 'cherry']);
  print(customSorted);                                  // {cherry, banana, apple} - 降序
  
  // 集合运算
  var setA = {1, 2, 3, 4, 5};
  var setB = {4, 5, 6, 7, 8};
  
  print(setA.union(setB));                             // 并集: {1, 2, 3, 4, 5, 6, 7, 8}
  print(setA.intersection(setB));                      // 交集: {4, 5}
  print(setA.difference(setB));                        // 差集: {1, 2, 3}
  print(setB.difference(setA));                        // 差集: {6, 7, 8}
  
  // 子集判断
  var subset = {1, 2};
  print(subset.containsAll({1, 2}));                   // true
  print(setA.containsAll(subset));                     // true - subset 是 setA 的子集
  
  // 批量操作
  var mainSet = {1, 2, 3};
  mainSet.retainAll({1, 3});                            // 保留交集: {1, 3}
  mainSet.removeAll({1});                               // 移除指定: {3}
  
  // 查找
  var lookupSet = {'a', 'b', 'c'};
  print(lookupSet.lookup('b'));                         // 返回元素: 'b'
  print(lookupSet.lookup('x'));                         // 不存在返回 null
  
  // 转换为其他类型
  var listFromSet = lookupSet.tolist();                 // Set → List
  var stringFromSet = lookupSet.join(', ');             // Set → String: "a, b, c"
}
```

### 2.2 Map 高级用法

```dart
void advancedMaps() {
  // LinkedHashMap - 保持插入顺序
  var linkedMap = LinkedHashMap<String, int>();
  linkedMap['a'] = 1;
  linkedMap['b'] = 2;
  linkedMap['c'] = 3;
  print(linkedMap.keys);                                // (a, b, c) - 插入顺序
  
  // SplayTreeMap - 自动按键排序
  var treeMap = SplayTreeMap<String, int>();
  treeMap['cherry'] = 3;
  treeMap['apple'] = 1;
  treeMap['banana'] = 2;
  print(treeMap.keys);                                  // (apple, banana, cherry) - 排序后
  
  // HashMap - 无序（默认 Map 实现）
  var hashMap = HashMap<String, int>();
  hashMap.addAll({'x': 10, 'y': 20, 'z': 30});
  
  // Map 高阶函数
  var scores = {'math': 90, 'english': 85, 'science': 95};
  
  // mapValues - 转换所有值
  var adjustedScores = scores.map((key, value) =>
      MapEntry(key, value + 5));
  // {math: 95, english: 90, science: 100}
  
  // 过滤
  var highScores = scores.entries
      .where((entry) => entry.value >= 90)
      .map((entry) => MapEntry(entry.key, entry.value))
      .toMap();
  // {math: 90, science: 95}
  
  // 更新操作
  var counters = {'a': 1, 'b': 2, 'c': 3};
  
  // update - 存在则更新
  counters.update('a', (value) => value * 2);          // a: 2
  
  // update - 不存在则添加默认值
  counters.update('d', (value) => value * 2, ifAbsent: () => 10); // d: 10
  
  // putIfAbsent - 键不存在时才添加
  counters.putIfAbsent('e', () => 5);                  // e: 5
  counters.putIfAbsent('a', () => 100);                // a 不变，仍为 2
  
  // addAll - 合并 Map
  var extra = {'f': 6, 'g': 7};
  counters.addAll(extra);                               // 合并到 counters
  
  // addEntries - 添加条目
  counters.addEntries([
    MapEntry('h', 8),
    MapEntry('i', 9),
  ]);
  
  // removeWhere - 条件删除
  counters.removeWhere((key, value) => value < 5);     // 删除值小于 5 的
  
  // 从键列表创建 Map
  var keys = ['name', 'age', 'city'];
  var defaults = Map.fromIterables(keys, ['', 0, '']); // {name: '', age: 0, city: ''}
  
  // 嵌套 Map 操作
  var nestedData = {
    'users': [
      {'id': 1, 'name': 'Alice'},
      {'id': 2, 'name': 'Bob'},
    ],
    'total': 2,
  };
  
  // 安全访问嵌套 Map
  var userName = nestedData['users']?.cast<Map<String, dynamic>>()
      ?.firstWhere((u) => u['id'] == 1)?['name'];      // Alice
}
```

### 2.3 Queue (队列)

```dart
void queueUsage() {
  // 双端队列 - 可以在两端添加和移除
  var queue = Queue<int>();
  
  // 添加元素
  queue.addLast(1);                                     // 尾部添加: [1]
  queue.addLast(2);                                     // 尾部添加: [1, 2]
  queue.addFirst(0);                                    // 头部添加: [0, 1, 2]
  queue.addAll([3, 4, 5]);                              // 批量添加: [0, 1, 2, 3, 4, 5]
  
  // 移除元素
  var first = queue.removeFirst();                       // 移除头部: 0, 队列: [1, 2, 3, 4, 5]
  var last = queue.removeLast();                         // 移除尾部: 5, 队列: [1, 2, 3, 4]
  
  // 查看但不移除
  print(queue.first);                                   // 1
  print(queue.last);                                    // 4
  print(queue.isEmpty);                                 // false
  print(queue.length);                                  // 4
  
  // ListQueue vs DoubleLinkedQueue
  var listQueue = ListQueue<String>();                  // 基于 List，随机访问快
  var doubleQueue = DoubleLinkedQueue<String>();        // 基于链表，中间插入删除快
  
  // 使用场景：BFS 算法
  void bfs(List<List<int>> graph, int startNode) {
    var visited = Set<int>();
    var bfsQueue = Queue<int>();
    
    bfsQueue.add(startNode);
    visited.add(startNode);
    
    while (bfsQueue.isNotEmpty) {
      var node = bfsQueue.removeFirst();
      print('访问节点: $node');
      
      for (var neighbor in graph[node]) {
        if (!visited.contains(neighbor)) {
          visited.add(neighbor);
          bfsQueue.addLast(neighbor);
        }
      }
    }
  }
}
```

---

## 3. Lambdas (Lambda 表达式与闭包) 🔥

### 3.1 Lambda 表达式基础

```dart
void lambdaBasics() {
  // 匿名函数（Lambda）
  var add = (int a, int b) => a + b;                   // 箭头语法
  var multiply = (int a, int b) {                       // 完整语法块
    return a * b;
  };
  
  print(add(3, 5));                                     // 8
  print(multiply(4, 6));                                // 24
  
  // 作为参数传递
  var numbers = [1, 2, 3, 4, 5];
  var doubled = numbers.map((n) => n * 2).tolist();     // [2, 4, 6, 8, 10]
  var evens = numbers.where((n) => n % 2 == 0).tolist();// [2, 4]
  
  // 存储在变量中
  Function greet = (String name) => 'Hello, $name!';
  print(greet('Dart'));                                 // Hello, Dart!
  
  // 类型注解
  int Function(int, int) operation = (a, b) => a + b;
  void Function(String) logger = (msg) => print(msg);
  
  // 返回函数
  Function makeMultiplier(int factor) {
    return (int number) => number * factor;
  }
  
  var triple = makeMultiplier(3);
  print(triple(10));                                    // 30
  
  var quadruple = makeMultiplier(4);
  print(quadruple(10));                                 // 40
}
```

### 3.2 闭包 (Closures)

```dart
void closuresDemo() {
  // 闭包捕获外部变量
  String prefix = 'Hello';
  
  var greeter = (String name) => '$prefix, $name!';
  print(greeter('World'));                              // Hello, World!
  
  // 闭包可以修改变量的状态
  var counter = 0;
  var increment = () {
    counter++;
    return counter;
  };
  
  print(increment());                                   // 1
  print(increment());                                   // 2
  print(increment());                                   // 3
  print(counter);                                       // 3
  
  // 工厂模式 - 创建带私有状态的函数
  Function createCounter({int start = 0}) {
    var _count = start;                                 // 私有变量
    return () {
      _count++;
      return _count;
    };
  }
  
  var counterA = createCounter(start: 10);
  var counterB = createCounter(start: 0);
  
  print(counterA());                                    // 11
  print(counterA());                                    // 12
  print(counterB());                                    // 1
  print(counterB());                                    // 2
  
  // 回调函数模式
  void processItems(List items, Function callback) {
    for (var item in items) {
      callback(item);
    }
  }
  
  processItems(['a', 'b', 'c'], (item) {
    print('处理: $item');
  });
  
  // 事件处理器
  var handlers = <Function>[];
  
  for (var i = 0; i < 3; i++) {
    handlers.add(() => print('事件 $i'));
  }
  
  for (var handler in handlers) {
    handler();                                          // 事件 0, 事件 1, 事件 2
  }
}
```

### 3.3 高阶函数实战

```dart
void practicalHigherOrderFunctions() {
  // 自定义高阶函数
  
  // 1. 条件执行
  void executeIf(bool condition, Function action) {
    if (condition) {
      action();
    }
  }
  
  executeIf(true, () => print('条件为真，执行了!'));     // 条件为真，执行了!
  executeIf(false, () => print('这不会打印'));           // （不输出）
  
  // 2. 重试机制
  Future<T> retry<T>(Future<T> Function() operation, {
    int maxAttempts = 3,
    Duration delay = const Duration(seconds: 1),
  }) async {
    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (e) {
        if (attempt == maxAttempts) rethrow;
        await Future.delayed(delay);
      }
    }
    throw StateError('Unreachable');
  }
  
  // 3. 函数组合
  Function compose(Function f, Function g) {
    return (x) => f(g(x));
  }
  
  var doubleIt = (x) => x * 2;
  var addTen = (x) => x + 10;
  var doubleThenAdd = compose(addTen, doubleIt);
  print(doubleThenAdd(5));                              // 20 (5*2=10, 10+10=20)
  
  // 4. 管道操作符模拟
  extension Pipeline<T> on T {
    R pipe<R>(R Function(T) transform) => transform(this);
  }
  
  var result = 5
      .pipe((x) => x * 2)
      .pipe((x) => x + 10)
      .pipe((x) => x.toString())
      .pipe((s) => '结果: $s');
  print(result);                                        // 结果: 20
  
  // 5. 记忆化（缓存计算结果）
  Map<int, int> _cache = {};
  
  int fibonacciMemoized(int n) {
    if (_cache.containsKey(n)) {
      return _cache[n]!;
    }
    if (n <= 1) return n;
    _cache[n] = fibonacciMemoized(n - 1) + fibonacciMemoized(n - 2);
    return _cache[n]!;
  }
  
  print(fibonacciMemoized(50));                         // 12586269025（快速计算）
}
```

---

## 4. Functional Programming (函数式编程) 🎨

### 4.1 函数式编程核心概念

```dart
void functionalConcepts() {
  // 纯函数 - 相同输入总是产生相同输出，无副作用
  int pureAdd(int a, int b) => a + b;                   // ✅ 纯函数
  
  int impureAdd(int a, int b) {
    print('$a + $b');                                    // ❌ 有副作用（I/O）
    return a + b;
  }
  
  // 不可变性 - 数据一旦创建就不能修改
  var originalList = [1, 2, 3];
  var newList = [...originalList, 4];                    // 创建新列表而非修改原列表
  print(originalList);                                   // [1, 2, 3] - 未被修改
  
  // 一等函数 - 函数可以作为值传递
  List<int> applyOperation(
    List<int> numbers,
    int Function(int) operation,
  ) {
    return numbers.map(operation).tolist();
  }
  
  var nums = [1, 2, 3, 4, 5];
  print(applyOperation(nums, (n) => n * 2));            // [2, 4, 6, 8, 10]
  print(applyOperation(nums, (n) => n * n));            // [1, 4, 9, 16, 25]
  
  // 高阶函数 - 接收或返回函数
  Function createScaler(int factor) {
    return (int number) => number * factor;
  }
  
  var doubler = createScaler(2);
  var tripler = createScaler(3);
  
  print(doubler(5));                                    // 10
  print(tripler(5));                                    // 15
}
```

### 4.2 函数式数据处理

```dart
void functionalDataProcessing() {
  var users = [
    {'name': 'Alice', 'age': 28, 'score': 85},
    {'name': 'Bob', 'age': 34, 'score': 92},
    {'name': 'Charlie', 'age': 23, 'score': 78},
    {'name': 'Diana', 'age': 29, 'score': 95},
    {'name': 'Eve', 'age': 31, 'score': 88},
  ];
  
  // 链式管道 - 函数式风格的数据处理
  var topPerformers = users
      .where((user) => user['age'] as int > 25)         // 过滤年龄 > 25
      .where((user) => user['score'] as int >= 88)      // 过滤分数 >= 88
      .map((user) => user['name'])                      // 只提取名字
      .tolist();
  // [Bob, Diana, Eve]
  
  // 排序 + 映射 + 过滤
  var rankedUsers = users
      .where((user) => user['score'] as int >= 80)      // 过滤高分用户
      .tolist()
    ..sort((a, b) =>
        (b['score'] as int).compareTo(a['score'] as int))// 按分数降序
    ..sort((a, b) =>
        (a['age'] as int).compareTo(b['age'] as int));  // 同分按年龄升序
  
  // 分组统计
  var ageGroups = users.groupListsBy((user) {
    var age = user['age'] as int;
    if (age < 25) return '20-24';
    if (age < 30) return '25-29';
    return '30+';
  });
  // {20-24: [Charlie], 25-29: [Alice, Diana], 30+: [Bob, Eve]}
  
  // 聚合计算
  var averageScore = users
      .map((user) => user['score'] as int)
      .reduce((sum, score) => sum + score) /
      users.length;
  // 87.6
  
  // 复杂转换
  var summary = users.map((user) {
    var ageGroup = (user['age'] as int) < 30 ? '青年' : '中年';
    var level = (user['score'] as int) >= 90 ? '优秀' : '良好';
    return '${user['name']}: $ageGroup/$level';
  }).tolist();
  // [Alice: 青年/良好, Bob: 中年/优秀, Charlie: 青年/良好, Diana: 青年/优秀, Eve: 中年/良好]
}
```

### 4.3 函数式设计模式

```dart
void functionalPatterns() {
  // Maybe 模式 - 处理可能缺失的值
  class Maybe<T> {
    final T? _value;
    final bool _hasValue;
    
    Maybe._(this._value, this._hasValue);
    
    factory Maybe.some(T value) => Maybe._(value, true);
    factory Maybe.none() => Maybe._(null, false);
    
    R match<R>({
      required R Function(T value) some,
      required R Function() none,
    }) => _hasValue ? some(_value as T) : none();
    
    Maybe<R> map<R>(R Function(T) f) =>
        _hasValue ? Maybe.some(f(_value as T)) : Maybe.none();
    
    Maybe<R> flatMap<R>(Maybe<R> Function(T) f) =>
        _hasValue ? f(_value as T) : Maybe.none();
  }
  
  var result = Maybe.some(10)
      .map((x) => x * 2)
      .map((x) => x + 5)
      .match(some: (v) => '结果是 $v', none: () => '没有值');
  print(result);                                         // 结果是 25
  
  // Either 模式 - 处理成功或错误
  class Either<L, R> {
    final L? _left;
    final R? _right;
    final bool _isRight;
    
    Either._(this._left, this._right, this._isRight);
    
    factory Either.left(L value) => Either._(value, null, false);
    factory Either.right(R value) => Either._(null, value, true);
    
    T fold<T>(T Function(L left) onLeft, T Function(R right) onRight) =>
        _isRight ? onRight(_right as R) : onLeft(_left as L);
  }
  
  Either<String, int> safeDivide(int a, int b) {
    if (b == 0) return Either.left('除数不能为零');
    return Either.right(a ~/ b);
  }
  
  print(safeDivide(10, 3).fold(
    (error) => '错误: $error',
    (result) => '结果: $result',
  ));                                                   // 结果: 3
  
  print(safeDivide(10, 0).fold(
    (error) => '错误: $error',
    (result) => '结果: $result',
  ));                                                   // 错误: 除数不能为零
  
  // Currying - 柯里化
  Function curriedAdd(int a) {
    return (int b) {
      return (int c) => a + b + c;
    };
  }
  
  var add5 = curriedAdd(5);
  var add5And10 = add5(10);
  print(add5And10(15));                                 // 30
  
  // 部分应用
  void logWithLevel(String level, String message) {
    print('[$level] $message');
  }
  
  var infoLog = (String msg) => logWithLevel('INFO', msg);
  var errorLog = (String msg) => logWithLevel('ERROR', msg);
  
  infoLog('应用程序启动');                                // [INFO] 应用程序启动
  errorLog('数据库连接失败');                             // [ERROR] 数据库连接失败
}
```

### 4.4 不可变数据结构

```dart
void immutableDataStructures() {
  // 使用 @immutable 注解
  @immutable
  class Person {
    final String name;
    final int age;
    
    const Person(this.name, this.age);
    
    Person copyWith({String? name, int? age}) {
      return Person(
        name ?? this.name,
        age ?? this.age,
      );
    }
    
    @override
    bool operator ==(Object other) =>
        identical(this, other) ||
        other is Person && runtimeType == other.runtimeType && name == other.name && age == other.age;
    
    @override
    int get hashCode => name.hashCode ^ age.hashCode;
  }
  
  var person1 = Person('Alice', 28);
  var person2 = person1.copyWith(age: 29);              // 创建新实例
  
  print(person1.age);                                   // 28 - 未修改
  print(person2.age);                                   // 29 - 新对象
  
  // 不可变列表操作
  var original = [1, 2, 3, 4, 5];
  
  // 不修改原列表的操作
  var filtered = original.where((n) => n > 2).tolist();
  var mapped = original.map((n) => n * 2).tolist();
  var sorted = List.from(original)..sort();
  var reversed = original.reversed.tolist();
  var combined = [...original, 6, 7, 8];
  
  print(original);                                      // [1, 2, 3, 4, 5] - 始终不变
  
  // 深拷贝 vs 浅拷贝
  var shallowCopy = List.from(original);                // 浅拷贝
  var deepCopy = [...original];                          // 展开运算符（对于基本类型足够）
  
  // 对于复杂对象的深拷贝
  var complexOriginal = [
    {'id': 1, 'items': ['a', 'b']},
    {'id': 2, 'items': ['c']},
  ];
  
  var deepCopiedComplex = complexOriginal.map((item) => Map<String, dynamic>.from(item)).tolist();
}
```

---

## 5. Isolates (隔离区与并发) ⚡

### 5.1 Isolate 基础概念

```dart
import 'dart:isolate';

void isolateBasics() async {
  // Dart 是单线程模型，但支持通过 Isolates 实现真正的并行
  // 每个 Isolate 有自己的内存堆，不共享状态
  
  // 主 Isolate 信息
  print('主 Isolate ID: ${Isolate.current.debugName}');
  print('当前是否为主 Isolate: ${Isolate.current.debugName == "main"}');
  
  // Isolate 特点：
  // 1. 完全独立的内存空间
  // 2. 通过消息传递通信
  // 3. 无锁竞争问题
  // 4. 适合 CPU 密集型任务
}
```

### 5.2 创建和使用 Isolate

```dart
void isolateExample() async {
  // 方式 1: 使用 Isolate.spawn
  print('主线程开始: ${DateTime.now()}');
  
  var receivePort = ReceivePort();
  
  await Isolate.spawn(
    isolateEntryPoint,
    receivePort.sendPort,
  );
  
  receivePort.listen((message) {
    print('收到消息: $message');
    receivePort.close();
  });
  
  print('主线程继续执行...');
}

void isolateEntryPoint(SendPort sendPort) {
  // 这是运行在新 Isolate 中的代码
  print('新 Isolate 开始工作: ${DateTime.now()}');
  
  // 模拟耗时计算
  var result = heavyComputation();
  
  // 发送结果回主 Isolate
  sendPort.send(result);
}

int heavyComputation() {
  var sum = 0;
  for (var i = 0; i < 1000000000; i++) {
    sum += i;
  }
  return sum;
}
```

### 5.3 双向通信

```dart
void bidirectionalCommunication() async {
  // 创建端口对用于双向通信
  var mainReceivePort = ReceivePort();
  var mainSendPort = mainReceivePort.sendPort;
  
  var isolate = await Isolate.spawn(
    workerIsolate,
    mainSendPort,
  );
  
  // 等待 worker 发送它的 SendPort
  var workerSendPort = await mainReceivePort.first as SendPort;
  
  // 发送任务给 worker
  var responsePort = ReceivePort();
  workerSendPort.send({
    'task': '计算斐波那契',
    'number': 40,
    'responsePort': responsePort.sendPort,
  });
  
  // 接收响应
  var result = await responsePort.first;
  print('Worker 返回结果: $result');
  
  // 终止 Isolate
  isolate.kill(priority: Isolate.immediate);
}

void workerIsolate(SendPort mainSendPort) {
  // 创建自己的接收端口
  var workerReceivePort = ReceivePort();
  
  // 将 SendPort 发送给主 Isolate
  mainSendPort.send(workerReceivePort.sendPort);
  
  // 监听来自主 Isolate 的消息
  workerReceivePort.listen((message) {
    if (message is Map) {
      var task = message['task'];
      var number = message['number'];
      var responsePort = message['responsePort'] as SendPort;
      
      print('Worker 收到任务: $task');
      
      // 执行计算
      var result = computeFibonacci(number as int);
      
      // 发送响应
      responsePort.send({
        'task': task,
        'result': result,
      });
    }
  });
}

int computeFibonacci(int n) {
  if (n <= 1) return n;
  var a = 0, b = 1;
  for (var i = 2; i <= n; i++) {
    var temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
```

### 5.4 Compute Isolate 简化用法

```dart
import 'package:flutter/foundation.dart';

void computeExample() async {
  // Flutter 提供的便捷方法 - 自动管理 Isolate 生命周期
  
  print('开始时间: ${DateTime.now()}');
  
  // 在后台 Isolate 中执行计算
  var result = await compute(heavyCalculation, 1000000);
  
  print('结果: $result');
  print('结束时间: ${DateTime.now()}');
}

int heavyCalculation(int limit) {
  var sum = 0;
  for (var i = 0; i < limit; i++) {
    sum += i.isPrime ? i : 0;
  }
  return sum;
}

extension PrimeCheck on int {
  bool get isPrime {
    if (this < 2) return false;
    if (this == 2) return true;
    if (this % 2 == 0) return false;
    for (var i = 3; i * i <= this; i += 2) {
      if (this % i == 0) return false;
    }
    return true;
  }
}
```

### 5.5 Isolate 最佳实践

```dart
void isolateBestPractices() {
  // ✅ 适用场景
  // 1. CPU 密集型计算（图像处理、加密、大数据分析）
  // 2. 解析大型 JSON 或 XML
  // 3. 复杂算法运算
  
  // ❌ 不适用场景
  // 1. 简单的 I/O 操作（用 async/await 即可）
  // 2. 频繁的小任务（Isolate 创建开销大）
  // 3. 需要共享大量数据的场景（消息传递成本高）
  
  // 性能优化建议
  // 1. 复用 Isolate 而非频繁创建销毁
  // 2. 批量发送消息减少通信开销
  // 3. 对于简单场景优先使用 compute()
  // 4. 注意内存占用，每个 Isolate 有独立堆内存
}
```

---

## 6. Async / Await (异步编程) 🔄

### 6.1 异步基础

```dart
asyncBasics() async {
  // Future - 表示异步操作的最终完成（或失败）及其结果值
  Future<String> fetchUserData() async {
    // 模拟网络请求
    await Future.delayed(Duration(seconds: 1));
    return '{"name": "Alice", "age": 28}';
  }
  
  // 使用 async/await
  print('开始获取数据...');
  var jsonData = await fetchUserData();
  print('获取到的数据: $jsonData');
  print('数据获取完成!');
  
  // async 函数自动返回 Future
  Future<void> processData() async {
    print('处理中...');
    await Future.delayed(Duration(milliseconds: 500));
    print('处理完成');
  }
  
  await processData();
}
```

### 6.2 Future 操作

```dart
void futureOperations() async {
  // 创建 Future
  Future.value(42);                                     // 立即完成的 Future
  Future.error(Exception('出错了'));                     // 立即失败的 Future
  Future.delayed(Duration(seconds: 1), () => '延迟完成');// 延迟完成的 Future
  Future.microtask(() => '微任务');                       // 微任务队列
  Future.sync(() => '同步执行');                         // 同步执行但包装成 Future
  
  // then - 链式调用
  fetchData()
      .then((data) => parseData(data))
      .then((parsed) => saveToDatabase(parsed))
      .catchError((error) => handleError(error))
      .whenComplete(() => print('操作完成'));
  
  // catchError - 错误处理
  riskyOperation().catchError((error) {
    print('捕获到错误: $error');
    return defaultValue;
  });
  
  // timeout - 超时控制
  try {
    var result = await slowOperation().timeout(
      Duration(seconds: 3),
      onTimeout: () => throw TimeoutException('操作超时'),
    );
  } on TimeoutException catch (e) {
    print(e.message);
  }
  
  // asStream - 转 Stream
  futureAsStream().asStream().listen((data) {
    print('从 Stream 收到: $data');
  });
}

Future<String> fetchData() async {
  await Future.delayed(Duration(milliseconds: 100));
  return '原始数据';
}

dynamic parseData(String data) {
  return {'parsed': true, 'data': data};
}

dynamic saveToDatabase(dynamic parsed) {
  print('已保存: $parsed');
  return '保存成功';
}

void handleError(Object error) {
  print('处理错误: $error');
}

Future<dynamic> riskyOperation() async {
  await Future.delayed(Duration(milliseconds: 50));
  if (DateTime.now().millisecond % 2 == 0) {
    throw Exception('随机错误');
  }
  return '成功';
}

const defaultValue = '默认值';

Future<String> slowOperation() async {
  await Future.delayed(Duration(seconds: 5));
  return '慢速操作完成';
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);
}

Future<String> futureAsStream() async {
  await Future.delayed(Duration(milliseconds: 100));
  return 'Stream 数据';
}
```

### 6.3 并发控制

```dart
asyncConcurrencyControl() async {
  // 并行执行多个 Future
  var results = await Future.wait([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  print(results);                                       // [用户数据, 文章数据, 评论数据]
  
  // 带错误的并行执行
  try {
    var resultsWithError = await Future.wait([
      fetchUser(),
      failingOperation(),                                // 这个会失败
      fetchComments(),
    ]);
  } catch (e) {
    print('其中一个失败了: $e');                          // 第一个失败就停止
  }
  
  // eagerError: false - 即使某个失败也等待其他完成
  var resultsEager = await Future.wait([
    fetchUser(),
    failingOperation(),
    fetchComments(),
  ], eagerError: false);                                // 收集所有结果（包括错误）
  
  // Future.any - 任一完成即返回
  var fastestResult = await Future.any([
    slowOperation1(),
    fastOperation(),
    slowOperation2(),
  ]);
  print('最快完成的: $fastestResult');
  
  // forEach - 并发迭代
  var urls = ['url1', 'url2', 'url3'];
  await Future.forEach(urls, (url) async {
    await fetchUrl(url);
  });                                                    // 串行执行
  
  // 如果要并行执行
  await Future.wait(urls.map((url) => fetchUrl(url)));   // 并行执行
  
  // 限制并发数
  const maxConcurrent = 3;
  for (var i = 0; i < urls.length; i += maxConcurrent) {
    var batch = urls.skip(i).take(maxConcurrent);
    await Future.wait(batch.map(fetchUrl));
  }
}

Future<String> fetchUser() async {
  await Future.delayed(Duration(milliseconds: 200));
  return '用户数据';
}

Future<String> fetchPosts() async {
  await Future.delayed(Duration(milliseconds: 300));
  return '文章数据';
}

Future<String> fetchComments() async {
  await Future.delayed(Duration(milliseconds: 150));
  return '评论数据';
}

Future<Object> failingOperation() async {
  await Future.delayed(Duration(milliseconds: 100));
  throw Exception('操作失败');
}

Future<String> slowOperation1() async {
  await Future.delayed(Duration(seconds: 2));
  return '慢速1';
}

Future<String> fastOperation() async {
  await Future.delayed(Duration(milliseconds: 200));
  return '快速';
}

Future<String> slowOperation2() async {
  await Future.delayed(Duration(seconds: 2));
  return '慢速2';
}

Future<void> fetchUrl(String url) async {
  print('获取: $url');
  await Future.delayed(Duration(milliseconds: 100));
}
```

### 6.4 错误处理最佳实践

```dart
asyncErrorHandling() async {
  // try-catch-finally
  try {
    var data = await mightFail();
    process(data);
  } on SocketException catch (e) {
    print('网络错误: $e');
    handleNetworkError();
  } on FormatException catch (e) {
    print('格式错误: $e');
    handleFormatError();
  } catch (e, stackTrace) {
    print('未知错误: $e');
    print(stackTrace);
    reportError(e, stackTrace);
  } finally {
    cleanupResources();
  }
  
  // 重试逻辑
  const maxRetries = 3;
  Object? lastError;
  
  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      var result = await unreliableOperation();
      print('第 $attempt 次尝试成功');
      break;
    } catch (e) {
      lastError = e;
      print('第 $attempt 次尝试失败: $e');
      if (attempt < maxRetries) {
        await Future.delayed(Duration(seconds: attempt * 2)); // 指数退避
      }
    }
  }
  
  if (lastError != null) {
    throw StateError('经过 $maxRetries 次尝试后仍然失败');
  }
  
  // 超时 + 重试组合
  try {
    var result = await withTimeoutAndRetry(
      longRunningOperation,
      timeout: Duration(seconds: 10),
      maxAttempts: 3,
    );
    print('最终结果: $result');
  } catch (e) {
    print('最终失败: $e');
  }
}

Future<T> withTimeoutAndRetry<T>(
  Future<T> Function() operation, {
  required Duration timeout,
  int maxAttempts = 3,
}) async {
  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation().timeout(timeout);
    } catch (e) {
      if (attempt == maxAttempts) rethrow;
      await Future.delayed(Duration(seconds: attempt));
    }
  }
  throw StateError('Unreachable');
}

Future<String> mightFail() async => '数据';
void process(String data) {}
class SocketException implements Exception { final String message; SocketException(this.message); }
void handleNetworkError() {}
void handleFormatError() {}
void reportError(Object e, StackTrace stackTrace) {}
void cleanupResources() {}

Future<Object> unreliableOperation() async {
  if (DateTime.now().millisecond % 3 != 0) {
    throw Exception('随机失败');
  }
  return '成功';
}

Future<String> longRunningOperation() async {
  await Future.delayed(Duration(seconds: 5));
  return '长时间操作完成';
}
```

---

## 7. Core Libraries (核心库) 📚

### 7.1 dart:core - 核心库

```dart
void coreLibrary() {
  // 内置类型
  var num = 42;                                         // num 类型
  var integer = 42.toInt();                             // int
  var decimal = 3.14.toDouble();                         // double
  
  // String 方法
  var text = '  Hello World  ';
  text.trim();                                           // 'Hello World'
  text.padLeft(20, '*');                                 // '******  Hello World  '
  text.split(' ');                                       // ['', 'Hello', 'World', '', '']
  text.replaceAll('o', '0');                             // '  Hell0 W0rld  '
  text.contains('World');                                 // true
  text.startsWith('  H');                                // true
  text.endsWith('d  ');                                  // true
  text.indexOf('World');                                  // 9
  text.substring(2, 7);                                  // 'Hello'
  text.toUpperCase();                                    // '  HELLO WORLD  '
  text.toLowerCase();                                    // '  hello world  '
  text.codeUnits;                                        // Unicode 编码列表
  text.runes;                                            // Rune 对象
  
  // List 方法
  var list = [3, 1, 4, 1, 5, 9, 2, 6];
  list.length;                                            // 8
  list.isEmpty;                                           // false
  list.isNotEmpty;                                        // true
  list.first;                                             // 3
  list.last;                                              // 6
  list.reversed;                                          // (6, 2, 9, 5, 1, 4, 1, 3)
  list.contains(4);                                       // true
  list.indexOf(1);                                        // 1
  list.lastIndexOf(1);                                    // 3
  list.sublist(2, 5);                                     // [4, 1, 5]
  list.getRange(0, 3);                                    // (3, 1, 4)
  list.asMap();                                           // {0: 3, 1: 1, 2: 4, 3: 1, 4: 5, 5: 9, 6: 2, 7: 6}
  list.toSet();                                           // {3, 1, 4, 5, 9, 2, 6}
  list.join(', ');                                        // '3, 1, 4, 1, 5, 9, 2, 6'
  
  // Map 方法
  var map = {'a': 1, 'b': 2, 'c': 3};
  map.keys;                                               // (a, b, c)
  map.values;                                             // (1, 2, 3)
  map.length;                                             // 3
  map.isEmpty;                                            // false
  map.containsKey('a');                                   // true
  map.containsValue(2);                                   // true
  map.putIfAbsent('d', () => 4);                          // 添加 d: 4
  map.update('a', (v) => v * 10);                         // a: 10
  map.remove('b');                                        // 删除 b
  map.clear();                                            // 清空
  
  // Object 和 dynamic
  dynamic anything = 'string';
  anything = 123;
  anything = [1, 2, 3];
  
  // print 和 assert
  print('调试信息');
  assert(true, '断言失败信息');                             // debug 模式下检查
  
  // DateTime
  var now = DateTime.now();
  var specificDate = DateTime(2024, 12, 25, 14, 30);
  var fromEpoch = DateTime.fromMillisecondsSinceEpoch(1703503800000);
  
  print(now.year);                                        // 年
  print(now.month);                                       // 月
  print(now.day);                                         // 日
  print(now.hour);                                        // 时
  print(now.minute);                                      // 分
  print(now.second);                                      // 秒
  print(now.millisecond);                                 // 毫秒
  print(now.weekday);                                     // 星期几 (1-7)
  
  // Duration
  var duration = Duration(days: 1, hours: 2, minutes: 30);
  duration.inDays;                                        // 1
  duration.inHours;                                       // 26
  duration.inMinutes;                                     // 1590
  duration.inSeconds;                                     // 95400
  duration.inMilliseconds;                                // 95400000
  
  // 比较
  var later = now.add(duration);
  var earlier = now.subtract(duration);
  print(later.isAfter(now));                              // true
  print(earlier.isBefore(now));                           // true
  print(now.difference(later));                           // 负的 Duration
  
  // 格式化
  print(now.toIso8601String());                           // ISO 8601 格式
  print(now.toLocal());                                   // 转本地时间
  print(now.toUtc());                                     // 转 UTC 时间
  
  // 解析
  var parsedDate = DateTime.parse('2024-12-25T14:30:00');
  var parsedDuration = Duration.parse('1:30:45');         // 1小时30分45秒
}
```

### 7.2 dart:collection - 集合扩展库

```dart
import 'dart:collection';

void collectionLibrary() {
  // Queue - 双端队列
  var queue = Queue<String>();
  queue.addLast('first');                                 // 尾部添加
  queue.addFirst('before-first');                         // 头部添加
  queue.removeFirst();                                    // 移除头部
  queue.removeLast();                                     // 移除尾部
  
  // LinkedList - 双向链表
  var linkedList = LinkedList<MyEntry>();
  var entry1 = MyEntry(1);
  var entry2 = MyEntry(2);
  linkedList.add(entry1);
  linkedList.add(entry2);
  
  // HashMap - 哈希表实现
  var hashMap = HashMap<String, int>();
  hashMap['key1'] = 100;
  
  // LinkedHashMap - 保持插入顺序
  var linkedHashMap = LinkedHashMap<String, int>();
  linkedHashMap['a'] = 1;
  linkedHashMap['b'] = 2;
  linkedHashMap['c'] = 3;
  
  // SplayTreeMap - 自平衡二叉搜索树
  var treeMap = SplayTreeMap<String, int>();
  treeMap['banana'] = 2;
  treeMap['apple'] = 1;
  treeMap['cherry'] = 3;
  // 自动排序: {apple: 1, banana: 2, cherry: 3}
  
  // HashSet
  var hashSet = HashSet<int>();
  hashSet.addAll([1, 2, 3, 2, 1]);                       // {1, 2, 3}
  
  // LinkedHashSet - 保持插入顺序
  var linkedHashSet = LinkedHashSet<int>();
  linkedHashSet.addAll([3, 1, 4, 1, 5]);                 // {3, 1, 4, 5}
  
  // SplayTreeSet - 自动排序
  var splayTreeSet = SplayTreeSet<int>();
  splayTreeSet.addAll([3, 1, 4, 1, 5]);                  // {1, 3, 4, 5}
  
  // UnmodifiableListView - 不可修改视图
  var source = [1, 2, 3, 4, 5];
  var unmodifiable = UnmodifiableListView(source);
  print(unmodifiable[0]);                                // 1
  // unmodifiable.add(6);                                // ❌ 不能修改
}

class MyEntry extends LinkedListEntry<MyEntry> {
  final int value;
  MyEntry(this.value);
}
```

### 7.3 dart:convert - 编解码库

```dart
import 'dart:convert';

void convertLibrary() {
  // JSON 编解码
  var jsonString = '''
  {
    "name": "Alice",
    "age": 28,
    "skills": ["Dart", "Flutter", "Firebase"],
    "address": {
      "city": "Beijing",
      "country": "China"
    }
  }
  ''';
  
  // JSON 解码
  var jsonData = jsonDecode(jsonString);
  print(jsonData['name']);                               // Alice
  print(jsonData['skills']);                              // [Dart, Flutter, Firebase]
  print(jsonData['address']['city']);                     // Beijing
  
  // JSON 编码
  var userData = {
    'name': 'Bob',
    'age': 34,
    'isActive': true,
  };
  var encodedJson = jsonEncode(userData);
  print(encodedJson);                                     // {"name":"Bob","age":34,"isActive":true}
  
  // 美化输出
  var prettyJson = JsonEncoder.withIndent('  ').convert(userData);
  print(prettyJson);
  /*
  {
    "name": "Bob",
    "age": 34,
    "isActive": true
  }
  */
  
  // UTF-8 编解码
  var utf8Bytes = utf8.encode('你好世界');                 // 字节列表
  var decodedString = utf8.decode(utf8Bytes);              // 你好世界
  
  // Base64 编解码
  var base64Encoded = base64.encode(utf8Bytes);           // Base64 字符串
  var base64Decoded = base64.decode(base64Encoded);        // 字节列表
  
  // LineSplitter - 按行分割
  var multiLineText = '''第一行
第二行
第三行''';
  var lines = LineSplitter().convert(multiLineText);
  // ['第一行', '第二行', '第三行']
  
  // JsonCodec - 配置编解码器
  var codec = json.fused(utf8);                           // 组合 UTF-8 和 JSON
  var bytes = codec.encode(userData);                      // 直接编码为字节
  var decoded = codec.decode(bytes);                       // 从字节解码
}
```

### 7.4 dart:io - I/O 库（仅限服务器端）

```dart
import 'dart:io';

void ioLibrary() async {
  // 文件操作
  var file = File('example.txt');
  
  // 写入文件
  await file.writeAsString('Hello, Dart!\n这是第二行。');
  
  // 读取文件
  var contents = await file.readAsString();
  var lines = await file.readAsLines();
  var bytes = await file.readAsBytes();
  
  // 流式读取
  var stream = file.openRead();
  await for (var chunk in stream.transform(utf8.decoder)) {
    print(chunk);
  }
  
  // 文件信息
  var exists = await file.exists();
  var stat = await file.stat();
  print(stat.size);                                       // 文件大小
  print(stat.modified);                                   // 修改时间
  print(stat.type);                                       // 文件类型
  
  // 目录操作
  var dir = Directory('my_folder');
  
  if (!await dir.exists()) {
    await dir.create(recursive: true);                    // 递归创建
  }
  
  // 列出目录内容
  await for (var entity in dir.list()) {
    if (entity is File) {
      print('文件: ${entity.path}');
    } else if (entity is Directory) {
      print('目录: ${entity.path}');
    }
  }
  
  // HTTP 请求
  var url = Uri.parse('https://api.example.com/data');
  var httpClient = HttpClient();
  
  try {
    var request = await httpClient.getUrl(url);
    request.headers.set('Authorization', 'Bearer token123');
    
    var response = await request.close();
    
    if (response.statusCode == 200) {
      var responseBody = await response.transform(utf8.decoder).join();
      print(responseBody);
    }
  } finally {
    httpClient.close();
  }
  
  // Platform 信息
  print(Platform.operatingSystem);                         // 操作系统
  print(Platform.pathSeparator);                          // 路径分隔符
  print(Platform.numberOfProcessors);                     // CPU 核心数
  print(Platform.localHostname);                          // 主机名
  print(Platform.environment);                            // 环境变量
  
  // 进程
  var result = await Process.run('git', ['--version']);
  print(result.stdout);                                   // 标准输出
  print(result.stderr);                                   // 标准错误
  print(result.exitCode);                                 // 退出码
  
  // WebSocket
  var socket = await WebSocket.connect('wss://echo.websocket.org');
  socket.add('Hello WebSocket!');
  await for (var message in socket) {
    print('收到: $message');
  }
}
```

### 7.5 dart:math - 数学库

```dart
import 'dart:math';

void mathLibrary() {
  // 常量
  print(pi);                                              // π ≈ 3.14159...
  print(e);                                               // e ≈ 2.71828...
  print(ln2);                                             // ln(2) ≈ 0.6931...
  print(ln10);                                            // ln(10) ≈ 2.3025...
  print(sqrt2);                                           // √2 ≈ 1.41421...
  print(log2e);                                           // log₂(e) ≈ 1.4427...
  print(log10e);                                          // log₁₀(e) ≈ 0.4343...
  
  // 基本数学函数
  print(sqrt(16));                                        // 4.0 - 平方根
  print(pow(2, 10));                                      // 1024.0 - 幂运算
  print(sin(pi / 6));                                     // 0.5 - 正弦
  print(cos(pi / 3));                                     // 0.5 - 余弦
  print(tan(pi / 4));                                     // 1.0 - 正切
  print(asin(0.5));                                       // 弧度制反正弦
  print(acos(0.5));                                       // 弧度制反余弦
  print(atan(1.0));                                       // 弧度制反正切
  print(exp(1));                                          // e¹ ≈ 2.71828
  print(log(e));                                          // ln(e) = 1.0
  print(log10(100));                                      // log₁₀(100) = 2.0
  
  // 最大最小值
  print(min(3, 7));                                       // 3
  print(max(3, 7));                                       // 7
  
  // Random - 随机数生成
  var random = Random();
  print(random.nextInt(100));                             // 0-99 的随机整数
  print(random.nextDouble());                             // 0.0-1.0 的随机浮点数
  print(random.nextBool());                               // 随机布尔值
  
  // 种子随机数（可重现）
  var seededRandom = Random(42);
  print(seededRandom.nextInt(100));                       // 每次都相同
  
  // Point - 二维点
  var point = Point(3, 4);
  print(point.distanceTo(Point.origin));                  // 到原点的距离: 5.0
  print(point.magnitude);                                 // 向量长度: 5.0
  print(point.squaredMagnitudeTo(Point(6, 8)));          // 距离平方: 25.0
  
  // Rectangle - 矩形
  var rect = Rectangle(0, 0, 100, 100);
  print(rect.containsPoint(Point(50, 50)));               // true
  print(rect.intersects(Rectangle(50, 50, 100, 100)));   // true
  print(rect.leftTop);                                    // (0, 0)
  print(rect.rightBottom);                                // (100, 100)
  print(rect.area);                                       // 10000.0
  
  // 角度转换
  print(degrees(pi));                                    // 180.0 - 弧度转角度
  print(radians(180));                                    // π - 角度转弧度
  
  // 三角函数辅助
  var angle = pi / 4;                                     // 45°
  print(sin(angle));                                      // √2/2 ≈ 0.7071
  print(cos(angle));                                      // √2/2 ≈ 0.7071
  print(atan2(1, 1));                                     // π/4
}
```

---

## 8. Streams (流) 🌊

### 8.1 Stream 基础

```dart
void streamBasics() async {
  // 创建基本 Stream
  var countStream = Stream.periodic(Duration(seconds: 1), (count) => count)
      .take(5);                                          // 0, 1, 2, 3, 4（每秒一个）
  
  // 监听 Stream
  countStream.listen(
    (data) => print('收到数据: $data'),
    onError: (error) => print('错误: $error'),
    onDone: () => print('流结束'),
  );
  
  // 使用 async for
  print('开始监听...');
  await for (var value in countStream) {
    print('处理: $value');
  }
  print('监听结束');
  
  // StreamController - 手动控制流
  var controller = StreamController<String>();
  
  // 监听
  controller.stream.listen((event) {
    print('控制器事件: $event');
  });
  
  // 添加数据
  controller.add('事件 1');
  controller.add('事件 2');
  controller.addError(Exception('错误事件'));
  controller.add('事件 3');
  controller.close();                                    // 关闭流
  
  // 单订阅流 vs 广播流
  var singleSubscription = Stream.fromIterable([1, 2, 3]);
  singleSubscription.listen(print);                       // ✅ 第一次监听
  // singleSubscription.listen(print);                    // ❌ 第二次会抛异常
  
  var broadcast = singleSubscription.asBroadcastStream();
  broadcast.listen(print);                                // ✅ 可以多次监听
  broadcast.listen(print);                                // ✅ 可以多次监听
}
```

### 8.2 Stream 转换操作符

```dart
void streamTransformers() async {
  var numberStream = Stream.fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  
  // map - 转换每个元素
  var doubled = numberStream.map((n) => n * 2);
  // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  
  // where - 过滤
  var evens = numberStream.where((n) => n.isEven);
  // [2, 4, 6, 8, 10]
  
  // expand - 展开（一对多）
  var expanded = numberStream.expand((n) => [n, n * 10]);
  // [1, 10, 2, 20, 3, 30, 4, 40, ...]
  
  // take / skip - 截取
  var first3 = numberStream.take(3);                      // [1, 2, 3]
  var after5 = numberStream.skip(5);                      // [6, 7, 8, 9, 10]
  
  // takeWhile / skipWhile - 条件截取
  var lessThan5 = numberStream.takeWhile((n) => n < 5);   // [1, 2, 3, 4]
  var from5onwards = numberStream.skipWhile((n) => n < 5);// [5, 6, 7, 8, 9, 10]
  
  // distinct - 去重
  var withDuplicates = Stream.fromIterable([1, 2, 2, 3, 3, 3, 4]);
  var unique = withDuplicates.distinct();                 // [1, 2, 3, 4]
  
  // 链式调用示例
  var processed = numberStream
      .where((n) => n.isEven)                             // 过滤偶数
      .map((n) => n * n)                                  // 平方
      .take(3)                                            // 取前 3 个
      .tolist();                                          // 转为 List
  // [4, 16, 36]
  
  // transform - 使用自定义转换器
  var customTransformed = numberStream.transform(
    StreamTransformer.fromHandlers(
      handleData: (data, sink) {
        sink.add(data * 2);
      },
      handleError: (error, stackTrace, sink) {
        sink.addError(error, stackTrace);
      },
      handleDone: (sink) {
        sink.close();
      },
    ),
  );
  
  // asyncExpand - 异步展开
  var asyncExpanded = Stream.fromIterable([1, 2, 3])
      .asyncExpand((n) => Stream.fromIterable(
        List.generate(n, (i) => '$n-$i'),
      ));
  // [1-0, 2-0, 2-1, 3-0, 3-1, 3-2]
  
  // asyncMap - 异步映射
  var asyncMapped = Stream.fromIterable([1, 2, 3])
      .asyncMap((n) async {
        await Future.delayed(Duration(milliseconds: 100));
        return n * n;
      });
  // [1, 4, 9]（每个间隔 100ms）
}
```

### 8.3 Stream 聚合操作

```dart
void streamAggregation() async {
  var stream = Stream.fromIterable([1, 2, 3, 4, 5]);
  
  // toList / toSet - 收集为集合
  var list = await stream.tolist();                       // [1, 2, 3, 4, 5]
  var set = await stream.toSet();                         // {1, 2, 3, 4, 5}
  
  // length - 计算元素数量
  var count = await stream.length;                        // 5
  
  // isEmpty / isNotEmpty - 检查是否为空
  var empty = await stream.isEmpty;                       // false
  var notEmpty = await stream.isNotEmpty;                 // true
  
  // first / last - 获取首尾元素
  var firstElement = await stream.first;                  // 1
  var lastElement = await stream.last;                    // 5
  
  // firstWhere / lastWhere - 条件查找
  var firstEven = await stream.firstWhere((n) => n.isEven); // 2
  var lastOdd = await stream.lastWhere((n) => n.isOdd);   // 5
  
  // single - 确保只有一个元素
  var singleValue = await Stream.value(42).single;       // 42
  // await stream.single;                                // ❌ 多个元素会抛异常
  
  // elementAt - 按索引获取
  var third = await stream.elementAt(2);                 // 3（索引从 0 开始）
  
  // contains / any / every - 条件检查
  var hasThree = await stream.contains(3);               // true
  var hasEven = await stream.any((n) => n.isEven);       // true
  var allPositive = await stream.every((n) => n > 0);    // true
  
  // reduce / fold - 折叠聚合
  var sum = await stream.reduce((a, b) => a + b);         // 15
  var product = await stream.fold(1, (prev, curr) => prev * curr); // 120
  
  // join - 连接为字符串
  var joined = await stream.join(', ');                   // '1, 2, 3, 4, 5'
}
```

### 8.4 Stream 实战应用

```dart
void practicalStreamExamples() async {
  // 示例 1: 防抖（Debounce）
  Stream<T> debounce<T>(Stream<T> source, Duration duration) {
    var controller = StreamController<T>();
    Timer? timer;
    
    source.listen(
      (event) {
        timer?.cancel();
        timer = Timer(duration, () {
          controller.add(event);
        });
      },
      onError: controller.addError,
      onDone: () {
        timer?.cancel();
        controller.close();
      },
    );
    
    return controller.stream;
  }
  
  // 使用防抖处理搜索输入
  var searchController = StreamController<String>();
  var debouncedSearch = debounce(searchController.stream, Duration(milliseconds: 300));
  
  debouncedSearch.listen((query) {
    print('执行搜索: $query');
  });
  
  searchController.add('D');                              // 取消
  searchController.add('Da');                             // 取消
  searchController.add('Dar');                            // 取消
  searchController.add('Dart');                           // 300ms 后执行
  
  // 示例 2: 节流（Throttle）
  Stream<T> throttle<T>(Stream<T> source, Duration duration) {
    var controller = StreamController<T>();
    var lastEmitted = DateTime.now();
    
    source.listen(
      (event) {
        if (DateTime.now().difference(lastEmitted) >= duration) {
          lastEmitted = DateTime.now();
          controller.add(event);
        }
      },
      onError: controller.addError,
      onDone: controller.close,
    );
    
    return controller.stream;
  }
  
  // 使用节流处理滚动事件
  var scrollController = StreamController<double>();
  var throttledScroll = throttle(scrollController.stream, Duration(milliseconds: 100));
  
  throttledScroll.listen((position) {
    print('更新位置: $position');
  });
  
  // 示例 3: 重试机制
  Stream<T> retryStream<T>(
    Future<T> Function() fetcher, {
    int maxAttempts = 3,
    Duration delay = const Duration(seconds: 1),
  }) async* {
    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        yield await fetcher();
        return;
      } catch (e) {
        if (attempt == maxAttempts) rethrow;
        await Future.delayed(delay * attempt);
      }
    }
  }
  
  // 使用重试流
  await for (var data in retryStream(() async {
    if (DateTime.now().millisecond % 3 == 0) return '成功';
    throw Exception('失败');
  })) {
    print('收到数据: $data');
  }
  
  // 示例 4: 合并多个流
  var streamA = Stream.periodic(Duration(seconds: 1), (i) => 'A$i').take(3);
  var streamB = Stream.periodic(Duration(milliseconds: 500), (i) => 'B$i').take(6);
  
  // merge - 交替合并
  var merged = streamA.merge(streamB);
  // A0, B0, B1, A1, B2, B3, A2, B4, B5
  
  // zip - 配对合并
  var zipped = streamA.zip(streamB);
  // (A0, B0), (A1, B2), (A2, B4)
  
  // combineLatest - 最新值组合
  var combined = streamA.combineLatest(streamB, (a, b) => '$a + $b');
  
  // 示例 5: 流的状态管理
  class StreamStateManager<T> {
    T? _currentValue;
    final StreamController<T> _controller = StreamController.broadcast();
    
    Stream<T> get stream => _controller.stream;
    T? get currentValue => _currentValue;
    
    void update(T newValue) {
      _currentValue = newValue;
      _controller.add(newValue);
    }
    
    void dispose() {
      _controller.close();
    }
  }
  
  var counterState = StreamStateManager<int>();
  counterState.stream.listen((count) {
    print('计数器更新: $count');
  });
  
  counterState.update(1);                                 // 计数器更新: 1
  counterState.update(2);                                 // 计数器更新: 2
  counterState.update(3);                                 // 计数器更新: 3
  
  counterState.dispose();
}
```

### 8.5 Stream 最佳实践

```dart
void streamBestPractices() {
  // ✅ 最佳实践
  
  // 1. 及时取消订阅避免内存泄漏
  StreamSubscription? subscription;
  
  subscription = someStream.listen((data) {
    // 处理数据
  });
  
  // 在不需要时取消
  subscription?.cancel();
  
  // 2. 使用 pause/resume 控制流
  subscription?.pause();
  // ... 执行其他操作 ...
  subscription?.resume();
  
  // 3. 处理错误
  someStream.listen(
    (data) {},
    onError: (error) {
      print('流错误: $error');
    },
    onDone: () {
      print('流结束');
    },
    cancelOnError: false,                                // 不因错误而取消订阅
  );
  
  // 4. 使用 broadcast stream 时注意监听器数量
  var broadcastStream = someStream.asBroadcastStream();
  broadcastStream.listen(print);
  broadcastStream.listen(print);
  // 记得在所有监听器不再需要时取消
  
  // ❌ 常见错误
  
  // 1. 忘记关闭 StreamController
  // var controller = StreamController();
  // 应该在使用完毕后调用 controller.close()
  
  // 2. 在已关闭的流上添加数据
  // controller.close();
  // controller.add('data');                              // 会抛异常
  
  // 3. 多次监听单订阅流
  // singleSubscriptionStream.listen(print);
  // singleSubscriptionStream.listen(print);             // 抛 StateError
  
  // 4. 不处理错误导致未捕获的异步错误
  // errorStream.listen(print);                          // 如果流产生错误会 uncaught
  
  // 正确做法：始终处理错误或设置 error handling
}

Stream<int> get someStream => Stream.periodic(Duration(seconds: 1), (x) => x).take(10);
```

---

## 9. Futures (Future 详解) 🔮

### 9.1 Future 核心概念

```dart
void futureConcepts() {
  // Future 表示一个可能还没有完成的异步操作的结果
  // 三种状态：
  // 1. Uncompleted（未完成）- 异步操作还在进行中
  // 2. Completed with value（成功完成）- 操作成功完成并返回结果
  // 3. Completed with error（失败完成）- 操作失败并返回错误
  
  // 创建 Future 的方式
  
  // 方式 1: Future.value() - 立即完成的 Future
  Future<String> immediateFuture = Future.value('立即完成');
  
  // 方式 2: Future.error() - 立即失败的 Future
  Future<String> errorFuture = Future.error(Exception('出错了'));
  
  // 方式 3: Future.delayed() - 延迟完成的 Future
  Future<String> delayedFuture = Future.delayed(
    Duration(seconds: 1),
    () => '延迟 1 秒后完成',
  );
  
  // 方式 4: Future.microtask() - 在微任务队列中执行
  Future<String> microtaskFuture = Future.microtask(() => '微任务执行');
  
  // 方式 5: Future.sync() - 同步执行但包装成 Future
  Future<String> syncFuture = Future.sync(() => '同步执行');
  
  // 方式 6: async/await - 最常用的方式
  Future<String> asyncFuture() async {
    await Future.delayed(Duration(milliseconds: 100));
    return '异步操作结果';
  }
  
  // Future 类型注解
  Future<void> doSomething() async {}                    // 无返回值
  Future<int> calculate() async { return 42; }           // 返回 int
  Future<String?> maybeReturnNull() async { return null; } // 可空类型
  Future<never> neverCompletes() async {                 // 永远不会正常完成
    await Future.delayed(Duration(days: 365));
    throw Exception('永远不会到达这里');
  }
}
```

### 9.2 Future 链式调用

```dart
void futureChaining() async {
  // then - 成功回调
  fetchData()
    .then((data) {
      print('收到数据: $data');
      return processData(data);
    })
    .then((processed) {
      print('处理后: $processed');
      saveData(processed);
      return processed;
    })
    .catchError((error) {
      print('发生错误: $error');
      return null;
    })
    .whenComplete(() {
      print('无论成功失败都会执行');
    });
  
  // catchError - 错误处理
  riskyOperation()
    .then((result) => print('成功: $result'))
    .catchError((error) {
      print('捕获到错误: $error');
      return '默认值';
    });
  
  // whenComplete - 清理资源
  openConnection()
    .then((conn) => useConnection(conn))
    .whenComplete(() => closeConnection());
  
  // timeout - 设置超时
  slowOperation()
    .timeout(
      Duration(seconds: 3),
      onTimeout: () => throw TimeoutException('操作超时'),
    )
    .then((result) => print('结果: $result'))
    .catchError((error) {
      if (error is TimeoutException) {
        print('超时了: ${error.message}');
      }
    });
  
  // asStream - 将 Future 转换为单元素 Stream
  futureToStream().asStream().listen((data) {
    print('从 Stream 收到: $data');
  });
}

Future<String> fetchData() async {
  await Future.delayed(Duration(milliseconds: 100));
  return '原始数据';
}

dynamic processData(String data) => {'processed': data};
void saveData(dynamic data) {}
Future<Object> riskyOperation() async {
  if (DateTime.now().second % 2 == 0) {
    throw Exception('随机错误');
  }
  return '成功';
}

Future<Connection> openConnection() async => Connection();
Connection useConnection(Connection conn) => conn;
void closeConnection() {}

Future<String> slowOperation() async {
  await Future.delayed(Duration(seconds: 5));
  return '慢速操作完成';
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);
}

Future<String> futureToStream() async => '来自 Future';

class Connection {}
```

### 9.3 Future 并发模式

```dart
void futureConcurrencyPatterns() async {
  // 模式 1: Future.wait - 并行等待所有
  print('开始并行请求...');
  var startTime = DateTime.now();
  
  var results = await Future.wait([
    fetchUserData(),
    fetchUserPosts(),
    fetchUserComments(),
  ]);
  
  var duration = DateTime.now().difference(startTime);
  print('所有请求完成，耗时: ${duration.inMilliseconds}ms'); // 约 300ms（最慢的那个）
  print(results);                                         // [用户数据, 文章数据, 评论数据]
  
  // 模式 2: Future.any - 返回第一个完成的
  var fastest = await Future.any([
    slowServerRequest(),                                  // 可能需要 5 秒
    fastCacheLookup(),                                    // 只需 50ms
    fallbackLocalData(),                                  // 需要 100ms
  ]);
  print('最快响应: $fastest');                            // 来自缓存的数据
  
  // 模式 3: Future.forEach - 串行迭代
  var urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
  
  // 串行执行
  await Future.forEach(urls, (url) async {
    await fetchUrl(url);
  });                                                     // 总耗时约 500ms
  
  // 并行执行（使用 Future.wait）
  await Future.wait(urls.map(fetchUrl));                  // 总耗时约 100ms
  
  // 模式 4: 分批并发控制
  const batchSize = 3;
  for (var i = 0; i < urls.length; i += batchSize) {
    var batch = urls.skip(i).take(batchSize);
    print('处理批次 ${(i ~/ batchSize) + 1}');
    await Future.wait(batch.map(fetchUrl));
  }
  
  // 模式 5: 带进度的并发任务
  var tasks = [
    Task(name: '任务 1', weight: 3),
    Task(name: '任务 2', weight: 1),
    Task(name: '任务 3', weight: 2),
  ];
  
  var completedCount = 0;
  await Future.wait(tasks.map((task) async {
    var result = await executeTask(task);
    completedCount++;
    print('进度: $completedCount/${tasks.length} - ${task.name} 完成');
    return result;
  }));
  
  // 模式 6: Future.doWhile - 条件循环
  var page = 1;
  var allItems = [];
  
  await Future.doWhile(() async {
    var items = await fetchPage(page++);
    allItems.addAll(items);
    return items.isNotEmpty;                              // 还有更多数据则继续
  });
  
  print('总共获取 ${allItems.length} 条数据');
  
  // 模式 7: Future.deferred - 延迟创建
  var deferredFuture = Future.deferred(() async {
    print('Future 现在被创建了');
    return '延迟创建的结果';
  });
  // 此时 Future 还未被创建...
  await deferredFuture;                                   // 现在才真正创建和执行
}

Future<String> fetchUserData() async {
  await Future.delayed(Duration(milliseconds: 200));
  return '用户数据';
}

Future<String> fetchUserPosts() async {
  await Future.delayed(Duration(milliseconds: 300));
  return '文章数据';
}

Future<String> fetchUserComments() async {
  await Future.delayed(Duration(milliseconds: 150));
  return '评论数据';
}

Future<String> slowServerRequest() async {
  await Future.delayed(Duration(seconds: 5));
  return '服务器数据';
}

Future<String> fastCacheLookup() async {
  await Future.delayed(Duration(milliseconds: 50));
  return '缓存数据';
}

Future<String> fallbackLocalData() async {
  await Future.delayed(Duration(milliseconds: 100));
  return '本地数据';
}

Future<void> fetchUrl(String url) async {
  print("获取: $url");
  await Future.delayed(Duration(milliseconds: 100));
}

class Task {
  final String name;
  final int weight;
  Task({required this.name, required this.weight});
}

Future<String> executeTask(Task task) async {
  await Future.delayed(Duration(milliseconds: 100 * task.weight));
  return '${task.name} 完成';
}

Future<List<dynamic>> fetchPage(int page) async {
  await Future.delayed(Duration(milliseconds: 100));
  if (page > 3) return [];                               // 没有更多数据
  return ['item_${page}_1', 'item_${page}_2', 'item_${page}_3'];
}
```

### 9.4 Future 错误处理策略

```dart
void futureErrorHandlingStrategies() async {
  // 策略 1: try-catch-finally
  try {
    var data = await mightFail();
    processSuccess(data);
  } on NetworkException catch (e) {
    handleNetworkError(e);
  } on AuthException catch (e) {
    handleAuthError(e);
  } on ServerException catch (e) {
    handleServerError(e);
  } catch (e, stackTrace) {
    logError(e, stackTrace);
    showGenericErrorMessage();
  } finally {
    hideLoadingIndicator();
  }
  
  // 策略 2: 重试机制
  var result = await withRetry(
    unreliableOperation,
    maxAttempts: 3,
    delay: Duration(seconds: 1),
    backoffFactor: 2.0,                                  // 指数退避
  );
  print('最终结果: $result');
  
  // 策略 3: 超时 + 重试组合
  try {
    var data = await withTimeoutAndRetry(
      longRunningOperation,
      timeout: Duration(seconds: 10),
      maxRetries: 3,
    );
    print('成功获取数据: $data');
  } on TimeoutException {
    showTimeoutMessage();
    tryFallbackApproach();
  } catch (e) {
    showErrorMessage(e.toString());
  }
  
  // 策略 4: 降级处理
  var userData = await withFallback(
    fetchFromRemote,
    fallbacks: [
      fetchFromCache,
      fetchFromLocalStorage,
      () => getDefaultUserData(),
    ],
  );
  print(userData);
  
  // 策略 5: 错误聚合
  var results = await Future.wait([
    fetchPart1(),
    fetchPart2(),
    fetchPart3(),
  ], eagerError: false);                                 // 收集所有结果包括错误
  
  for (var result in results) {
    if (result is ErrorResult) {
      print('部分失败: ${result.error}');
    } else if (result is SuccessResult) {
      print('部分成功: ${result.data}');
    }
  }
  
  // 策略 6: Circuit Breaker（熔断器）
  var breaker = CircuitBreaker(
    failureThreshold: 5,
    resetTimeout: Duration(seconds: 30),
  );
  
  try {
    if (breaker.allowRequest()) {
      var result = await protectedOperation();
      breaker.recordSuccess();
      print('操作成功: $result');
    } else {
      print('电路断开，使用降级方案');
      await fallbackOperation();
    }
  } catch (e) {
    breaker.recordFailure();
    print('操作失败: $e');
  }
}

// 重试工具函数
Future<T> withRetry<T>(
  Future<T> Function() operation, {
  required int maxAttempts,
  required Duration delay,
  double backoffFactor = 1.0,
}) async {
  for (var attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (e) {
      if (attempt == maxAttempts) rethrow;
      
      var currentDelay = delay * pow(backoffFactor, attempt - 1).toInt();
      print('第 $attempt 次尝试失败，${currentDelay.inSeconds}s 后重试...');
      await Future.delayed(currentDelay);
    }
  }
  throw StateError('Unreachable');
}

// 超时 + 重试工具函数
Future<T> withTimeoutAndRetry<T>(
  Future<T> Function() operation, {
  required Duration timeout,
  required int maxRetries,
}) async {
  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation().timeout(timeout);
    } catch (e) {
      if (attempt == maxRetries) rethrow;
      await Future.delayed(Duration(seconds: attempt));
    }
  }
  throw StateError('Unreachable');
}

// 降级处理工具函数
Future<T> withFallback<T>(
  Future<T> Function() primary, {
  required List<Future<T> Function()> fallbacks,
}) async {
  try {
    return await primary();
  } catch (_) {}
  
  for (var fallback in fallbacks) {
    try {
      return await fallback();
    } catch (_) {}
  }
  
  throw StateError('所有方法都失败了');
}

// 自定义异常类
class NetworkException implements Exception {
  final String message;
  final int statusCode;
  NetworkException(this.message, this.statusCode);
}

class AuthException implements Exception {
  final String message;
  AuthException(this.message);
}

class ServerException implements Exception {
  final String message;
  final int code;
  ServerException(this.message, this.code);
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);
}

// 结果包装类
class SuccessResult<T> {
  final T data;
  SuccessResult(this.data);
}

class ErrorResult {
  final Object error;
  ErrorResult(this.error);
}

// 熔断器实现
class CircuitBreaker {
  final int failureThreshold;
  final Duration resetTimeout;
  int _failureCount = 0;
  DateTime? _lastFailureTime;
  bool _isOpen = false;
  
  CircuitBreaker({
    required this.failureThreshold,
    required this.resetTimeout,
  });
  
  bool allowRequest() {
    if (!_isOpen) return true;
    
    if (_lastFailureTime != null &&
        DateTime.now().difference(_lastFailureTime!) > resetTimeout) {
      _isOpen = false;
      _failureCount = 0;
      return true;
    }
    
    return false;
  }
  
  void recordSuccess() {
    _failureCount = 0;
    _isOpen = false;
  }
  
  void recordFailure() {
    _failureCount++;
    _lastFailureTime = DateTime.now();
    if (_failureCount >= failureThreshold) {
      _isOpen = true;
    }
  }
}

// 辅助函数
Future<String> mightFail() async => '成功数据';
void processSuccess(String data) {}
void handleNetworkError(NetworkException e) {}
void handleAuthError(AuthException e) {}
void handleServerError(ServerException e) {}
void logError(Object e, StackTrace st) {}
void showGenericErrorMessage() {}
void hideLoadingIndicator() {}

Future<Object> unreliableOperation() async {
  await Future.delayed(Duration(milliseconds: 50));
  if (DateTime.now().millisecond % 2 != 0) {
    throw Exception('随机失败');
  }
  return '成功';
}

Future<String> longRunningOperation() async {
  await Future.delayed(Duration(seconds: 5));
  return '长时间操作完成';
}

void showTimeoutMessage() {}
void tryFallbackApproach() {}
void showErrorMessage(String msg) {}

Future<String> fetchFromRemote() async {
  await Future.delayed(Duration(milliseconds: 200));
  if (DateTime.now().second % 3 == 0) throw Exception('远程失败');
  return '远程数据';
}

Future<String> fetchFromCache() async {
  await Future.delayed(Duration(milliseconds: 50));
  return '缓存数据';
}

Future<String> fetchFromLocalStorage() async {
  await Future.delayed(Duration(milliseconds: 30));
  return '本地存储数据';
}

String getDefaultUserData() => '默认用户数据';

Future<String> fetchPart1() async {
  await Future.delayed(Duration(milliseconds: 100));
  return SuccessResult('part1') as dynamic;
}

Future<String> fetchPart2() async {
  await Future.delayed(Duration(milliseconds: 100));
  if (DateTime.now().millisecond % 2 == 0) {
    return ErrorResult(Exception('part2 failed')) as dynamic;
  }
  return SuccessResult('part2') as dynamic;
}

Future<String> fetchPart3() async {
  await Future.delayed(Duration(milliseconds: 100));
  return SuccessResult('part3') as dynamic;
}

Future<String> protectedOperation() async => '保护的操作结果';
Future<void> fallbackOperation() async => print('降级操作完成');

int pow(double base, int exponent) {
  var result = 1;
  for (var i = 0; i < exponent; i++) {
    result = (result * base).toInt();
  }
  return result;
}
```

### 9.5 Future 性能优化技巧

```dart
void futurePerformanceTips() {
  // ✅ 性能优化最佳实践
  
  // 1. 避免不必要的 await
  // 差的做法 - 串行等待
  // var user = await fetchUser();
  // var posts = await fetchUserPosts(user.id);
  // var comments = await fetchUserComments(user.id);
  
  // 好的做法 - 并行执行
  // var results = await Future.wait([fetchUser(), fetchUserPosts(), fetchUserComments()]);
  // var user = results[0];
  // var posts = results[1];
  // var comments = results[2];
  
  // 2. 使用 compute 进行 CPU 密集型计算
  // import 'package:flutter/foundation.dart';
  // var result = await compute(heavyCalculation, largeDataSet);
  
  // 3. 缓存 Future 结果
  Map<String, Future<String>> cache = {};
  
  Future<String> getCachedData(String key) {
    if (!cache.containsKey(key)) {
      cache[key] = fetchDataForKey(key);
    }
    return cache[key]!;
  }
  
  // 4. 使用 Future.deferred 延迟创建
  // 只有在真正需要时才创建 Future
  // var deferred = Future.deferred(() => expensiveCreation());
  
  // 5. 及时取消不需要的 Future
  // StreamSubscription? sub;
  // sub = longLivedStream.listen(handleData);
  // 当不再需要时:
  // sub?.cancel();
  
  // 6. 批量处理减少 Future 数量
  // 差的做法 - 为每个项目创建单独的 Future
  // for (var item in items) {
  //   await processItem(item);
  // }
  
  // 好的做法 - 批量处理
  // const batchSize = 10;
  // for (var i = 0; i < items.length; i += batchSize) {
  //   var batch = items.skip(i).take(batchSize);
  //   await Future.wait(batch.map(processItem));
  // }
  
  // 7. 使用 Completer 手动控制 Future
  // 对于复杂场景，可以手动控制 Future 的完成
  /*
  var completer = Completer<String>();
  
  // 在某个时机完成
  completer.complete('结果');
  
  // 或者在某个时机失败
  completer.completeError(Exception('错误'));
  
  // 获取 Future
  var future = completer.future;
  */
  
  // ⚠️ 常见性能陷阱
  
  // 1. 内存泄漏 - 未取消的订阅
  // 2. 过多的并发 Future 导致资源耗尽
  // 3. 未处理的 Future 错误
  // 4. 阻塞事件循环的同步操作
  // 5. 过度使用 isolate 开销大于收益
}
```

---

## 📝 总结与最佳实践

### Advanced Dart 核心要点

```
┌─────────────────────────────────────────────────────┐
│              Advanced Dart 核心要点                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📋 Lists & Collections                              │
│     • 高阶函数链式调用                                │
│     • 不可变数据结构                                  │
│     • 高效的集合选择（Set vs List vs Map）            │
│                                                      │
│  🔥 Lambdas & Closures                               │
│     • 闭包捕获与状态保持                              │
│     • 高阶函数设计模式                                │
│     • 函数组合与柯里化                                │
│                                                      │
│  🎨 Functional Programming                           │
│     • 纯函数与不可变性                                │
│     • Maybe/Either 模式                              │
│     • 函数式数据处理管道                              │
│                                                      │
│  ⚡ Isolates                                         │
│     • 真正的并行计算                                  │
│     • 消息传递通信                                    │
│     • CPU 密集型任务优化                              │
│                                                      │
│  🔄 Async / Await & Futures                          │
│     • 并发控制模式                                    │
│     • 错误处理策略                                    │
│     • 性能优化技巧                                    │
│                                                      │
│  🌊 Streams                                          │
│     • 响应式编程                                      │
│     • 转换操作符                                      │
│     • 防抖、节流等实用模式                            │
│                                                      │
│  📚 Core Libraries                                   │
│     • dart:core - 基础类型与方法                      │
│     • dart:collection - 高级集合                      │
│     • dart:convert - 编解码                           │
│     • dart:math - 数学运算                            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 学习建议

1. **循序渐进** - 先掌握基础语法，再深入高级特性
2. **动手实践** - 使用 DartPad 测试每个代码示例
3. **理解原理** - 不仅知道怎么用，还要理解为什么
4. **阅读源码** - 查看 Flutter SDK 中高级特性的实现
5. **项目实战** - 在实际项目中应用这些知识
6. **性能意识** - 关注代码的性能影响，合理选择技术方案

### 推荐学习路径

```
入门 → 基础语法 → Lists/Collections → Lambdas/Closures
→ Functional Programming → Async/Await → Streams/Futures
→ Isolates → Core Libraries → 项目实战
```

> 💡 **提示**: 本文档涵盖了 Dart 的高级特性，建议配合官方文档和实际项目练习以加深理解。
>
> 📖 **参考资源**:
>
> - [Dart 官方文档](https://dart.dev/guides)
> - [Effective Dart](https://dart.dev/effective-dart)
> - [Dart API Reference](https://api.dart.dev)
> - [Flutter Dev 文档](https://docs.flutter.dev)
