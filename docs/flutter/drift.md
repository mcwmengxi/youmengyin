# Drift 2.33.0 & drift_flutter - 类型安全的响应式 SQLite 数据库 🗄️

## 1. Drift 简介

### 1.1 什么是 Drift

Drift 是一个基于 SQLite 的响应式持久化库，为 Flutter 和 Dart 应用提供类型安全的数据库操作。

**核心特性**:

- **类型安全**: 基于表定义生成类型安全的代码，编译时即可发现 SQL 错误
- **响应式**: 任何 SQL 查询都可以转换为自动更新的 Stream
- **灵活**: 同时支持 Dart API 和原生 SQL 编写查询
- **跨平台**: 支持 Android、iOS、macOS、Windows、Linux 和 Web
- **高性能**: 内置 Isolate 支持，可在后台线程运行数据库操作
- **功能丰富**: 支持事务、迁移、复杂过滤、批量更新、JOIN、DAO 等

### 1.2 Drift vs sqflite

| 特性 | sqflite | Drift |
|------|---------|-------|
| 类型安全 | ❌ 手动映射 | ✅ 自动生成 |
| 响应式查询 | ❌ | ✅ Stream 支持 |
| 代码生成 | ❌ | ✅ build_runner |
| SQL 验证 | ❌ 运行时错误 | ✅ 编译时检查 |
| DAO 模式 | ❌ | ✅ 内置支持 |
| 迁移工具 | ❌ 手动 | ✅ 自动化工具 |
| Isolate 支持 | ❌ | ✅ 内置 |

### 1.3 包依赖说明

| 包名 | 用途 |
|------|------|
| `drift` | 核心库，纯 Dart，定义表和查询 |
| `drift_flutter` | Flutter 平台集成，提供 `driftDatabase()` 快速打开数据库 |
| `drift_dev` | 代码生成器（dev 依赖） |
| `build_runner` | 运行代码生成（dev 依赖） |

## 2. 安装与配置

### 2.1 添加依赖

```yaml
# pubspec.yaml
dependencies:
  drift: ^2.33.0
  drift_flutter: ^0.3.1
  path_provider: ^2.1.5

dev_dependencies:
  drift_dev: ^2.33.0
  build_runner: ^2.4.13
```

或使用命令行：

```bash
dart pub add drift drift_flutter path_provider dev:drift_dev dev:build_runner
```

### 2.2 Android 构建优化

`drift_flutter` 依赖 `sqlite3_flutter_libs`，默认包含 `armv8`、`armv7`、`x86`、`x86_64` 架构。大多数 Flutter 应用不需要 32 位 x86，在 `android/app/build.gradle` 中添加：

```groovy
android {
    defaultConfig {
        ndk {
            abiFilters 'arm64-v8a', 'armeabi-v7a', 'x86_64'
        }
    }
}
```

## 3. 定义表与数据库

### 3.1 定义表

每个表是一个继承 `Table` 的类，列通过 getter 定义：

```dart
import 'package:drift/drift.dart';

part 'database.g.dart';

class TodoItems extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text().withLength(min: 6, max: 32)();
  TextColumn get content => text().named('body')();
  IntColumn get category =>
      integer().nullable().references(TodoCategory, #id)();
  DateTimeColumn get createdAt => dateTime().nullable()();
}

class TodoCategory extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text()();
}
```

**列类型对照**:

| Dart 列类型 | SQLite 类型 | 说明 |
|-------------|-------------|------|
| `IntColumn` | INTEGER | 整数 |
| `TextColumn` | TEXT | 字符串 |
| `BoolColumn` | INTEGER | 布尔（0/1） |
| `RealColumn` | REAL | 浮点数 |
| `BlobColumn` | BLOB | 二进制数据 |
| `DateTimeColumn` | INTEGER | 时间戳（默认 unix 秒） |

**常用列约束**:

```dart
IntColumn get id => integer().autoIncrement()();
TextColumn get title => text().withLength(min: 1, max: 100)();
TextColumn get content => text().named('body')();
IntColumn get category => integer().nullable().references(TodoCategory, #id)();
IntColumn get priority => integer().withDefault(const Constant(0))();
BoolColumn get isDone => boolean().withDefault(const Constant(false))();
```

### 3.2 创建数据库类

```dart
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

@DriftDatabase(tables: [TodoItems, TodoCategory])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  AppDatabase.forTesting(super.e);

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'my_database');
  }
}
```

### 3.3 运行代码生成

```bash
# 单次生成
dart run build_runner build

# 监听文件变化，增量生成（推荐开发时使用）
dart run build_runner watch

# 清理后重新生成
dart run build_runner build --delete-conflicting-outputs
```

生成完成后，`database.g.dart` 文件将包含 `_$AppDatabase` 基类、`TodoItem` 数据类和 `TodoItemsCompanion` 类。

### 3.4 drift_flutter 的 driftDatabase 函数

`driftDatabase()` 是 `drift_flutter` 提供的核心函数，自动处理平台差异：

```dart
static QueryExecutor _openConnection() {
  return driftDatabase(
    name: 'app_db',
    native: DriftNativeOptions(
      databasePath: 'custom/path',
      shareAcrossIsolates: true,
    ),
    web: DriftWebOptions(
      sqlite3WasmUrl: Uri.parse('sqlite3.wasm'),
      driftWorkerUrl: Uri.parse('drift_worker.js'),
    ),
  );
}
```

**行为说明**:

- **原生平台**（Android/iOS/macOS/Linux/Windows）: 使用 `getApplicationDocumentsDirectory()` 存储数据库文件，文件名为 `$name.sqlite`
- **Web 平台**: 使用 drift 的 Web 支持（基于 sql.js）
- **`shareAcrossIsolates`**: 启用后通过 `IsolateNameServer` 创建共享数据库 Isolate，适用于 `WorkManager` 等多 Isolate 场景

### 3.5 手动配置数据库连接（不使用 drift_flutter）

```dart
import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:sqlite3/sqlite3.dart';
import 'package:sqlite3_flutter_libs/sqlite3_flutter_libs.dart';

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'db.sqlite'));

    if (Platform.isAndroid) {
      await applyWorkaroundToOpenSqlite3OnOldAndroidVersions();
    }

    final cachebase = (await getTemporaryDirectory()).path;
    sqlite3.tempDirectory = cachebase;

    return NativeDatabase.createInBackground(file);
  });
}
```

## 4. 查询操作（Select）

### 4.1 基本查询

```dart
@DriftDatabase(tables: [TodoItems, TodoCategory])
class AppDatabase extends _$AppDatabase {

  Future<List<TodoItem>> get allTodoItems => select(todoItems).get();

  Stream<List<TodoItem>> watchAllTodoItems => select(todoItems).watch();

  Future<TodoItem?> getTodoById(int id) {
    return (select(todoItems)..where((t) => t.id.equals(id)))
        .getSingleOrNull();
  }

  Stream<TodoItem?> watchTodoById(int id) {
    return (select(todoItems)..where((t) => t.id.equals(id)))
        .watchSingleOrNull();
  }
}
```

### 4.2 条件过滤（Where）

```dart
Future<List<TodoItem>> getTodoByCategory(int categoryId) {
  return (select(todoItems)..where((t) => t.category.equals(categoryId))).get();
}

Future<List<TodoItem>> searchTodos(String keyword) {
  return (select(todoItems)
        ..where((t) => t.title.like('%$keyword%') | t.content.like('%$keyword%')))
      .get();
}

Future<List<TodoItem>> getImportantTodos() {
  return (select(todoItems)
        ..where((t) => t.title.like('%important%') & t.createdAt.isNotNull()))
      .get();
}
```

**常用表达式**:

| 方法 | SQL 等价 | 说明 |
|------|---------|------|
| `equals(val)` | `= val` | 等于 |
| `isBiggerThan(val)` | `> val` | 大于 |
| `isSmallerThan(val)` | `< val` | 小于 |
| `isBetween(low, high)` | `BETWEEN low AND high` | 区间 |
| `like(pattern)` | `LIKE pattern` | 模糊匹配 |
| `contains(val)` | `LIKE '%val%'` | 包含 |
| `isIn(values)` | `IN (values)` | 在列表中 |
| `isNotNull()` | `IS NOT NULL` | 非空 |
| `a & b` | `a AND b` | 与 |
| `a \| b` | `a OR b` | 或 |
| `a.not()` | `NOT a` | 非 |

### 4.3 排序与分页

```dart
Future<List<TodoItem>> getSortedTodos({
  int page = 1,
  int pageSize = 20,
}) {
  final offset = (page - 1) * pageSize;
  return (select(todoItems)
        ..orderBy([(t) => OrderingTerm.desc(t.createdAt)])
        ..limit(pageSize, offset: offset))
      .get();
}

Future<List<TodoItem>> getTodosSortedByTitle() {
  return (select(todoItems)
        ..orderBy([
          (t) => OrderingTerm.asc(t.title),
          (t) => OrderingTerm.desc(t.createdAt),
        ]))
      .get();
}
```

### 4.4 JOIN 查询

```dart
class TodoWithCategory {
  final TodoItem todo;
  final TodoCategory? category;

  TodoWithCategory(this.todo, this.category);
}

Stream<List<TodoWithCategory>> watchTodosWithCategory() {
  final query = select(todoItems).join([
    leftOuterJoin(
      todoCategory,
      todoCategory.id.equalsExp(todoItems.category),
    ),
  ]);

  return query.watch().map((rows) {
    return rows.map((row) {
      return TodoWithCategory(
        row.readTable(todoItems),
        row.readTableOrNull(todoCategory),
      );
    }).toList();
  });
}
```

### 4.5 自定义列与别名

```dart
Future<List<(TodoItem, bool)>> loadEntriesWithImportance() {
  final isImportant = todoItems.content.like('%important%');

  return select(todoItems)
      .addColumns([isImportant])
      .map((row) {
        final entry = row.readTable(todoItems);
        final important = row.read(isImportant)!;
        return (entry, important);
      })
      .get();
}

Future<List<RouteWithPoints>> loadRoutes() async {
  final start = alias(geoPoints, 's');
  final destination = alias(geoPoints, 'd');

  final rows = await select(routes).join([
    innerJoin(start, start.id.equalsExp(routes.start)),
    innerJoin(destination, destination.id.equalsExp(routes.destination)),
  ]).get();

  return rows.map((row) {
    return RouteWithPoints(
      route: row.readTable(routes),
      start: row.readTable(start),
      destination: row.readTable(destination),
    );
  }).toList();
}
```

### 4.6 Group By 与聚合

```dart
Future<List<CategoryWithCount>> getCategoryTodoCounts() {
  final count = todoItems.id.count();
  final query = select(todoItems).join([
    innerJoin(todoCategory, todoCategory.id.equalsExp(todoItems.category)),
  ])
    ..addColumns([count])
    ..groupBy([todoCategory.id]);

  return query.map((row) {
    return CategoryWithCount(
      category: row.readTable(todoCategory),
      todoCount: row.read(count)!,
    );
  }).get();
}
```

## 5. 写入操作（Insert / Update / Delete）

### 5.1 插入数据

```dart
Future<int> addTodo(String title, String content, {int? categoryId}) {
  return into(todoItems).insert(TodoItemsCompanion.insert(
    title: title,
    content: content,
    category: Value(categoryId),
    createdAt: Value(DateTime.now()),
  ));
}

Future<int> addTodoReturning(String title, String content) {
  return into(todoItems).insertReturning(TodoItemsCompanion.insert(
    title: title,
    content: content,
  )).then((row) => row.id);
}
```

### 5.2 批量插入

```dart
Future<void> insertMultipleTodos() async {
  await batch((b) {
    b.insertAll(todoItems, [
      TodoItemsCompanion.insert(title: 'Task 1', content: 'Content 1'),
      TodoItemsCompanion.insert(title: 'Task 2', content: 'Content 2'),
      TodoItemsCompanion.insert(
        title: 'Task 3',
        content: 'Content 3',
        category: Value(1),
      ),
    ]);
  });
}
```

### 5.3 更新数据

```dart
Future<void> updateTodoCategory(int todoId, int categoryId) {
  return (update(todoItems)..where((t) => t.id.equals(todoId))).write(
    TodoItemsCompanion(category: Value(categoryId)),
  );
}

Future<void> replaceTodo(TodoItem todo) {
  return update(todoItems).replace(todo);
}

Future<void> markAllAsDone() {
  return (update(todoItems)..where((t) => t.isDone.equals(false)))
      .write(const TodoItemsCompanion(isDone: Value(true)));
}
```

### 5.4 Upsert（插入或更新）

```dart
class Users extends Table {
  TextColumn get email => text()();
  TextColumn get name => text()();

  @override
  Set<Column> get primaryKey => {email};
}

Future<int> createOrUpdateUser(User user) {
  return into(users).insertOnConflictUpdate(user);
}

Future<void> trackWord(String word) {
  return into(words).insert(
    WordsCompanion.insert(word: word),
    onConflict: DoUpdate(
      (old) => WordsCompanion.custom(usages: old.usages + Constant(1)),
    ),
  );
}
```

### 5.5 删除数据

```dart
Future<int> deleteTodo(int id) {
  return (delete(todoItems)..where((t) => t.id.equals(id))).go();
}

Future<int> deleteCompletedTodos() {
  return (delete(todoItems)..where((t) => t.isDone.equals(true))).go();
}
```

> ⚠️ **注意**: 如果不添加 `where` 条件，update 和 delete 将影响表中所有行！

## 6. Manager API（简化查询）

Drift 2.18+ 引入了 Manager API，提供更简洁的 ORM 风格查询方式。

### 6.1 查询

```dart
Future<void> managerExamples() async {

  final allTodos = await managers.todoItems.get();

  final todoStream = managers.todoItems.watch();

  final singleTodo = await managers.todoItems
      .filter((f) => f.id(1))
      .getSingle();
}
```

### 6.2 过滤

```dart
Future<void> filterExamples() async {

  await managers.todoItems
      .filter((f) => f.title("Title"))
      .get();

  await managers.todoItems
      .filter((f) => f.title("Title") & f.content("Content"))
      .get();

  await managers.todoItems
      .filter((f) => f.title("Title") | f.content.not.isNull())
      .get();

  await managers.todoItems
      .filter((f) => f.createdAt.isAfter(
        DateTime.now().subtract(Duration(days: 7)),
      ))
      .get();

  await managers.todoItems
      .filter((f) => f.title.startsWith('Title'))
      .get();
}
```

### 6.3 跨表过滤

```dart
Future<void> crossTableFilter() async {

  await managers.todoItems
      .filter((f) => f.category.name("School"))
      .get();

  await managers.todoCategory
      .filter((f) => f.todoItemsRefs((f) => f.id(1)))
      .get();
}
```

### 6.4 关联查询与预加载

```dart
Future<void> referenceExamples() async {

  final todosWithRefs = await managers.todoItems.withReferences().get();
  for (final (todo, refs) in todosWithRefs) {
    final category = await refs.category?.getSingle();
  }

  final prefetched = await managers.todoItems
      .withReferences((prefetch) => prefetch(category: true))
      .get();
  for (final (todo, refs) in prefetched) {
    final category = refs.category?.prefetchedData?.firstOrNull;
  }
}
```

### 6.5 排序

```dart
Future<void> orderExamples() async {

  await managers.todoItems
      .orderBy((o) => o.createdAt.asc())
      .get();

  await managers.todoItems
      .orderBy((o) => o.title.asc() & o.createdAt.desc())
      .get();
}
```

### 6.6 计数与存在性检查

```dart
Future<void> countAndExists() async {

  final count = await managers.todoItems.count();

  final filteredCount = await managers.todoItems
      .filter((f) => f.title("Title"))
      .count();

  final hasAny = await managers.todoItems.exists();

  final hasImportant = await managers.todoItems
      .filter((f) => f.title.contains("important"))
      .exists();
}
```

### 6.7 创建、更新、删除

```dart
Future<void> managerWrites() async {

  await managers.todoItems
      .create((o) => o(title: 'Title', content: 'Content'));

  await managers.todoItems.bulkCreate(
    (o) => [
      o(title: 'Title 1', content: 'Content 1'),
      o(title: 'Title 2', content: 'Content 2'),
    ],
  );

  await managers.todoItems
      .filter((f) => f.id.isIn([1, 2, 3]))
      .update((o) => o(content: Value('New Content')));

  var obj = await managers.todoItems
      .filter((f) => f.id(1))
      .getSingle();
  obj = obj.copyWith(content: 'Updated');
  await managers.todoItems.replace(obj);

  await managers.todoItems
      .filter((f) => f.id(5))
      .delete();
}
```

## 7. 响应式 Stream 查询

### 7.1 基本用法

```dart
Stream<List<TodoItem>> watchTodosByCategory(int categoryId) {
  return (select(todoItems)..where((t) => t.category.equals(categoryId)))
      .watch();
}

Stream<TodoItem?> watchSingleTodo(int id) {
  return (select(todoItems)..where((t) => t.id.equals(id)))
      .watchSingleOrNull();
}
```

### 7.2 在 Widget 中使用

```dart
class TodoListWidget extends StatelessWidget {
  final AppDatabase db;

  const TodoListWidget({super.key, required this.db});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<TodoItem>>(
      stream: db.watchAllTodoItems,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Center(child: CircularProgressIndicator());
        }
        final todos = snapshot.data!;
        return ListView.builder(
          itemCount: todos.length,
          itemBuilder: (context, index) {
            final todo = todos[index];
            return ListTile(
              title: Text(todo.title),
              subtitle: Text(todo.content),
            );
          },
        );
      },
    );
  }
}
```

## 8. DAO（数据访问对象）

### 8.1 定义 DAO

当查询方法增多时，使用 DAO 将数据库代码模块化：

```dart
part 'todos_dao.g.dart';

@DriftAccessor(tables: [TodoItems, TodoCategory])
class TodosDao extends DatabaseAccessor<AppDatabase> with _$TodosDaoMixin {
  TodosDao(super.db);

  Stream<List<TodoItem>> watchTodosInCategory(int categoryId) {
    return (select(todoItems)..where((t) => t.category.equals(categoryId)))
        .watch();
  }

  Future<List<TodoItem>> getUnfinishedTodos() {
    return (select(todoItems)..where((t) => t.isDone.equals(false))).get();
  }

  Future<void> markAsDone(int id) {
    return (update(todoItems)..where((t) => t.id.equals(id)))
        .write(const TodoItemsCompanion(isDone: Value(true)));
  }
}
```

### 8.2 注册 DAO

```dart
@DriftDatabase(tables: [TodoItems, TodoCategory], daos: [TodosDao])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'my_database');
  }
}
```

注册后，通过 `db.todosDao` 访问 DAO 实例。

## 9. 数据库迁移

### 9.1 手动迁移

```dart
@override
int get schemaVersion => 3;

@override
MigrationStrategy get migration {
  return MigrationStrategy(
    onCreate: (Migrator m) async {
      await m.createAll();
    },
    onUpgrade: (Migrator m, int from, int to) async {
      if (from < 2) {
        await m.addColumn(todoItems, todoItems.dueDate);
      }
      if (from < 3) {
        await m.addColumn(todoItems, todoItems.priority);
        await m.createTable(todoCategory);
      }
    },
  );
}
```

### 9.2 使用 make-migrations 工具（推荐）

**步骤 1**: 在 `build.yaml` 中配置数据库位置：

```yaml
targets:
  $default:
    builders:
      drift_dev:
        options:
          databases:
            my_database: lib/database.dart
```

**步骤 2**: 生成初始 schema 文件：

```bash
dart run drift_dev make-migrations
```

**步骤 3**: 修改表结构后，递增 `schemaVersion`，再次运行：

```bash
dart run drift_dev make-migrations
```

**步骤 4**: 使用生成的 step-by-step 迁移：

```dart
import 'database.steps.dart';

@DriftDatabase(tables: [TodoItems, TodoCategory])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 2;

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onUpgrade: _schemaUpgrade,
    );
  }
}

extension Migrations on GeneratedDatabase {
  OnUpgrade get _schemaUpgrade => stepByStep(
    from1To2: (m, schema) async {
      await m.createTable(schema.todoCategory);
      await m.addColumn(todoItems, todoItems.dueDate);
    },
  );
}
```

### 9.3 迁移后回调

```dart
@override
MigrationStrategy get migration {
  return MigrationStrategy(
    onUpgrade: (m, from, to) async {

    },
    beforeOpen: (details) async {
      if (details.wasCreated) {

      }
      await customStatement('PRAGMA foreign_keys = ON');
    },
  );
}
```

### 9.4 开发期间快速重置

开发时频繁修改 schema 可直接删除数据库重建：

```dart
@override
MigrationStrategy get migration {
  return MigrationStrategy(
    onUpgrade: (m, from, to) async {
      await m.deleteTable('todo_items');
      await m.deleteTable('todo_category');
      await m.createAll();
    },
  );
}
```

> ⚠️ 此方式会丢失所有数据，仅限开发环境使用！

## 10. 类型转换器

### 10.1 自定义类型转换器

```dart
import 'dart:convert';

class Preferences {
  final bool receiveEmails;
  final String selectedTheme;

  Preferences(this.receiveEmails, this.selectedTheme);

  factory Preferences.fromJson(Map<String, dynamic> json) =>
      Preferences(json['receiveEmails'] as bool, json['selectedTheme'] as String);

  Map<String, dynamic> toJson() => {
        'receiveEmails': receiveEmails,
        'selectedTheme': selectedTheme,
      };

  static JsonTypeConverter2<Preferences, String, Object?> converter =
      TypeConverter.json2(
    fromJson: (json) => Preferences.fromJson(json as Map<String, Object?>),
    toJson: (pref) => pref.toJson(),
  );
}
```

### 10.2 在表中使用

```dart
class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text()();
  TextColumn get preferences =>
      text().map(Preferences.converter).nullable()();
}
```

### 10.3 枚举类型

```dart
enum Status {
  none,
  running,
  stopped,
  paused,
}

class Tasks extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get status => intEnum<Status>()();
  TextColumn get label => textEnum<Status>().nullable()();
}
```

> ⚠️ 新增枚举值应追加到末尾，避免索引错乱。如需在中间插入，必须递增 schemaVersion 并执行数据迁移。

### 10.4 JSONB 支持（Drift 2.24+）

SQLite 3.45.0+ 支持 JSONB 二进制格式，更高效：

```dart
static JsonTypeConverter2<Preferences, Uint8List, Object?> binaryConverter =
    TypeConverter.jsonb(
  fromJson: (json) => Preferences.fromJson(json as Map<String, Object?>),
  toJson: (pref) => pref.toJson(),
);

class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  BlobColumn get preferences =>
      blob().map(Preferences.binaryConverter).nullable()();
}
```

## 11. 事务

### 11.1 基本事务

```dart
Future<void> transferTodo(int todoId, int newCategoryId) async {
  await transaction(() async {
    final todo = await (select(todoItems)..where((t) => t.id.equals(todoId)))
        .getSingle();
    await (update(todoItems)..where((t) => t.id.equals(todoId))).write(
      TodoItemsCompanion(category: Value(newCategoryId)),
    );
  });
}
```

### 11.2 批量操作

```dart
Future<void> batchUpdate() async {
  await batch((b) {
    b.update(
      todoItems,
      const TodoItemsCompanion(isDone: Value(true)),
      where: (t) => t.category.equals(1),
    );
    b.insertAll(todoItems, [
      TodoItemsCompanion.insert(title: 'New 1', content: 'Content 1'),
      TodoItemsCompanion.insert(title: 'New 2', content: 'Content 2'),
    ]);
  });
}
```

## 12. 自定义 SQL 查询

### 12.1 原始 SQL

```dart
Future<List<TodoItem>> customSqlQuery() {
  return customSelect(
    'SELECT * FROM todo_items WHERE category = ? ORDER BY created_at DESC',
    variables: [Variable.withInt(1)],
    readsFrom: {todoItems},
  ).map((row) => TodoItem(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        content: row.read<String>('body'),
        category: row.read<int?>('category'),
        createdAt: row.read<DateTime?>('created_at'),
        isDone: row.read<bool>('is_done'),
        dueDate: row.read<DateTime?>('due_date'),
        priority: row.read<int?>('priority'),
      )).get();
}
```

### 12.2 Drift 文件（.drift）

创建 `queries.drift` 文件：

```sql
import 'database.dart';

searchTodos:
SELECT * FROM todo_items WHERE title LIKE '%' || :keyword || '%';

todosByCategory:
SELECT * FROM todo_items WHERE category = :categoryId;
```

在数据库类中使用：

```dart
@DriftDatabase(tables: [TodoItems, TodoCategory], include: {'queries.drift'})
class AppDatabase extends _$AppDatabase {

}
```

运行 `build_runner` 后，会生成 `searchTodos()` 和 `todosByCategory()` 方法。

## 13. 多 Isolate 支持

### 13.1 使用 drift_flutter 共享 Isolate

```dart
AppDatabase() : super(driftDatabase(
  name: 'app_db',
  native: DriftNativeOptions(
    shareAcrossIsolates: true,
  ),
));
```

启用后，`drift_flutter` 会创建一个专用数据库 Isolate，多个 Isolate 可共享同一数据库连接而不会互相阻塞。

> ⚠️ 需要显式调用 `close()` 关闭数据库以停止共享 Isolate 服务。

### 13.2 手动 Isolate 方式

```dart
import 'package:drift/isolate.dart';

Future<DriftIsolate> createDriftIsolate() async {
  return DriftIsolate.inCurrent(
    () => DatabaseConnection(driftDatabase(name: 'app_db')),
  );
}

Future<AppDatabase> connectToDatabase() async {
  final isolate = await createDriftIsolate();
  return AppDatabase(await isolate.connect());
}
```

## 14. 完整实战示例

### 14.1 项目结构

```
lib/
├── database/
│   ├── database.dart
│   ├── database.g.dart
│   ├── tables/
│   │   ├── users.dart
│   │   └── posts.dart
│   └── daos/
│       ├── users_dao.dart
│       └── posts_dao.dart
├── repositories/
│   ├── user_repository.dart
│   └── post_repository.dart
└── main.dart
```

### 14.2 表定义

```dart
import 'package:drift/drift.dart';

class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get username => text().withLength(min: 3, max: 32)();
  TextColumn get email => text().withLength(min: 5, max: 128)();
  TextColumn get avatarUrl => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
}

class Posts extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text().withLength(min: 1, max: 200)();
  TextColumn get content => text()();
  IntColumn get authorId => integer().references(Users, #id)();
  BoolColumn get isPublished => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().nullable()();
}
```

### 14.3 DAO 定义

```dart
part 'posts_dao.g.dart';

@DriftAccessor(tables: [Posts, Users])
class PostsDao extends DatabaseAccessor<AppDatabase> with _$PostsDaoMixin {
  PostsDao(super.db);

  Future<List<Post>> getPublishedPosts() {
    return (select(posts)..where((p) => p.isPublished.equals(true))).get();
  }

  Stream<List<Post>> watchPostsByAuthor(int authorId) {
    return (select(posts)..where((p) => p.authorId.equals(authorId))).watch();
  }

  Future<Post> createPost(String title, String content, int authorId) {
    return into(posts).insertReturning(PostsCompanion.insert(
      title: title,
      content: content,
      authorId: authorId,
    ));
  }

  Future<void> publishPost(int id) {
    return (update(posts)..where((p) => p.id.equals(id))).write(
      PostsCompanion(isPublished: const Value(true)),
    );
  }
}
```

### 14.4 数据库类

```dart
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

@DriftDatabase(tables: [Users, Posts], daos: [PostsDao])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  AppDatabase.forTesting(super.e);

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'app_database');
  }

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      beforeOpen: (details) async {
        await customStatement('PRAGMA foreign_keys = ON');
      },
    );
  }
}
```

### 14.5 在应用中使用

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final database = AppDatabase();

  final postId = await database.postsDao.createPost(
    'Hello Drift',
    'This is my first post with Drift!',
    1,
  );

  database.postsDao.watchPostsByAuthor(1).listen((posts) {
    print('Posts updated: ${posts.length}');
  });

  runApp(MyApp(database: database));
}
```

## 15. 测试

### 15.1 内存数据库测试

```dart
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late AppDatabase db;

  setUp(() {
    db = AppDatabase.forTesting(NativeDatabase.memory());
  });

  tearDown(() async {
    await db.close();
  });

  test('insert and read todo', () async {
    final id = await db.addTodo('Test title', 'Test content');
    final todo = await db.getTodoById(id);

    expect(todo, isNotNull);
    expect(todo!.title, 'Test title');
    expect(todo.content, 'Test content');
  });

  test('watch todos stream updates', () async {
    final stream = db.watchAllTodoItems;

    expectLater(
      stream,
      emitsThrough(hasLength(1)),
    );

    await db.addTodo('Stream test', 'Content');
  });
}
```

## 16. 常见问题与最佳实践

### 16.1 最佳实践

- **使用 DAO 拆分查询逻辑**，避免数据库类过于臃肿
- **优先使用 Manager API** 进行简单 CRUD，复杂查询再用 Select API
- **使用 Companion 类进行部分更新**，区分"设为 null"和"不更新"
- **开发阶段使用 `make-migrations`** 工具管理 schema 变更
- **启用外键约束**：`PRAGMA foreign_keys = ON`
- **使用 `watch()` 替代手动刷新**，实现 UI 自动更新
- **批量操作使用 `batch()`**，比循环单条插入高效得多

### 16.2 常见问题

**Q: 代码生成报错 `part 'database.g.dart'` 找不到？**

A: 需要先运行 `dart run build_runner build` 生成代码。

**Q: 新增列后旧数据怎么办？**

A: 新列应设为 `nullable()` 或提供 `withDefault()`，迁移时用 `addColumn()` 添加。

**Q: 如何在 Web 平台使用 Drift？**

A: 需要下载 `sqlite3.wasm` 和 `drift_worker.js` 到 `web/` 目录，并在 `DriftWebOptions` 中配置 URL。

**Q: 如何查看生成的 SQL 语句？**

A: 在数据库构造函数中启用日志：

```dart
AppDatabase() : super(_openConnection()) {
  beforeOpen = () => driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
}
```

或使用 `DriftDevTools` 扩展查看。

**Q: `Value.absent()` vs `Value(null)` 的区别？**

A: `Value.absent()` 表示"不更新此列"，`Value(null)` 表示"将此列设为 NULL"。这是 Companion 类的核心设计。
