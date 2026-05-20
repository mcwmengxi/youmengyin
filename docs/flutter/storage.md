# Flutter 数据存储 - 本地与云端 📦

## 1. SharedPreferences - 轻量键值存储

### 1.1 特点与应用场景

- **适用场景**: 用户设置、主题偏好、登录状态、小型配置
- **数据类型**: `String, int, double, bool, List<String>`
- **限制**: 不适合大量数据，异步操作

### 1.2 基本使用

```yaml
# pubspec.yaml
dependencies:
  shared_preferences: ^2.2.0

```

---

```dart
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  static const String _keyTheme = 'theme';
  static const String _keyToken = 'auth_token';
  static const String _keyUsername = 'username';

  // 保存数据
  Future<void> savePreferences() async {
    final prefs = await SharedPreferences.getInstance();
    
    await prefs.setString(_keyToken, 'eyJhbGciOi...');
    await prefs.setBool(_keyTheme, true);
    await prefs.setInt('login_count', 5);
    await prefs.setDouble('font_size', 16.0);
    await prefs.setStringList('recent_searches', ['Flutter', 'Dart', 'Firebase']);
  }

  // 读取数据
  Future<void> readPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    
    final token = prefs.getString(_keyToken);
    final isDarkMode = prefs.getBool(_keyTheme) ?? false;
    final loginCount = prefs.getInt('login_count') ?? 0;
    final fontSize = prefs.getDouble('font_size') ?? 14.0;
    final recentSearches = prefs.getStringList('recent_searches') ?? [];
    
    print('Token: $token');
    print('Dark Mode: $isDarkMode');
  }

  // 删除数据
  Future<void> clearPreference() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken); // 删除单个
    // await prefs.clear(); // 清空所有
  }

  // 检查 key 是否存在
  Future<bool> hasKey(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(key);
  }

  // 获取所有 keys
  Future<Set<String>> getAllKeys() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getKeys();
  }
}
```

### 1.3 封装示例 - 用户设置管理

```dart
class UserSettings {
  static late SharedPreferences _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // 主题模式 (getter/setter)
  static bool get isDarkMode => _prefs.getBool('dark_mode') ?? false;
  static set isDarkMode(bool value) => _prefs.setBool('dark_mode', value);

  // 语言设置
  static String get language => _prefs.getString('language') ?? 'zh_CN';
  static set language(String value) => _prefs.setString('language', value);

  // 通知开关
  static bool get notificationsEnabled => _prefs.getBool('notifications') ?? true;
  static set notificationsEnabled(bool value) => _prefs.setBool('notifications', value);

  // 用户 Token
  static String? get authToken => _prefs.getString('auth_token');
  static set authToken(String? value) {
    if (value == null) {
      _prefs.remove('auth_token');
    } else {
      _prefs.setString('auth_token', value);
    }
  }
}
```

## 2. SQLite - 关系型本地数据库

### 2.1 特点与应用场景

- **适用场景**: 离线缓存、用户数据、复杂查询、大量结构化数据
- **优势**: 支持事务、索引、复杂查询
- **推荐库**: sqflite (SQLite 的 Flutter 封装)

### 2.2 安装和初始化

```yaml
# pubspec.yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.8.0
```

---

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static Database? _database;
  static const String _tableName = 'users';

  // 获取数据库实例（单例）
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  // 初始化数据库
  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'app_database.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  // 创建表
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_tableName (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    ''');

    // 创建索引
    await db.execute(
      'CREATE INDEX idx_username ON $_tableName(username)'
    );
  }

  // 数据库升级
  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('ALTER TABLE $_tableName ADD COLUMN avatar_url TEXT');
    }
    if (oldVersion < 3) {
      await db.execute('ALTER TABLE $_tableName ADD COLUMN phone TEXT');
    }
  }
}
```

### 2.3 CRUD 操作

```dart
class UserRepository {
  final DatabaseHelper _dbHelper = DatabaseHelper();

  // Create - 插入数据
  Future<int> insertUser(Map<String, dynamic> user) async {
    final db = await _dbHelper.database;
    return await db.insert(
      'users',
      user,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  // Read - 查询单个
  Future<Map<String, dynamic>?> getUserById(int id) async {
    final db = await _dbHelper.database;
    final List<Map<String, dynamic>> maps = await db.query(
      'users',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    return maps.isNotEmpty ? maps.first : null;
  }

  // Read - 查询所有（带分页）
  Future<List<Map<String, dynamic>>> getUsers({
    int page = 1,
    int pageSize = 20,
  }) async {
    final db = await _dbHelper.database;
    final offset = (page - 1) * pageSize;
    
    return await db.query(
      'users',
      orderBy: 'created_at DESC',
      limit: pageSize,
      offset: offset,
    );
  }

  // Read - 条件查询
  Future<List<Map<String, dynamic>>> searchUsers(String keyword) async {
    final db = await _dbHelper.database;
    return await db.query(
      'users',
      where: 'username LIKE ? OR email LIKE ?',
      whereArgs: ['%$keyword%', '%$keyword%'],
    );
  }

  // Update - 更新数据
  Future<int> updateUser(int id, Map<String, dynamic> values) async {
    final db = await _dbHelper.database;
    return await db.update(
      'users',
      values,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Delete - 删除数据
  Future<int> deleteUser(int id) async {
    final db = await _dbHelper.database;
    return await db.delete(
      'users',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // 事务操作
  Future<void> transferData() async {
    final db = await _dbHelper.database;
    
    await db.transaction((txn) async {
      // 在事务中执行多个操作
      await txn.insert('users', {'username': 'user1', 'email': 'a@test.com'});
      await txn.insert('logs', {'action': 'create_user', 'timestamp': DateTime.now().toIso8601String()});
      
      // 如果任何操作失败，整个事务回滚
    });
  }

  // 原始 SQL 查询
  Future<List<Map<String, dynamic>>> rawQueryExample() async {
    final db = await _dbHelper.database;
    return await db.rawQuery('''
      SELECT u.*, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.age >= ?
      GROUP BY u.id
      HAVING COUNT(o.id) > ?
      ORDER BY order_count DESC
    ''', [18, 0]);
  }
}
```

### 2.4 数据模型映射

```dart
class User {
  final int? id;
  final String username;
  final String email;
  final int? age;
  final DateTime? createdAt;

  User({
    this.id,
    required this.username,
    required this.email,
    this.age,
    this.createdAt,
  });

  // 从 Map 创建对象
  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      username: map['username'],
      email: map['email'],
      age: map['age'],
      createdAt: map['created_at'] != null 
        ? DateTime.parse(map['created_at']) 
        : null,
    );
  }

  // 转换为 Map
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'age': age,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}

// 使用示例
class UserService {
  Future<User?> getUser(int id) async {
    final repo = UserRepository();
    final map = await repo.getUserById(id);
    return map != null ? User.fromMap(map) : null;
  }

  Future<int> createUser(User user) async {
    final repo = UserRepository();
    return await repo.insertUser(user.toMap());
  }
}
```

## 3. Firebase Storage - 云文件存储

### 3.1 特点与应用场景

- **适用场景**: 用户头像、图片上传、文件分享、媒体内容
- **优势**: CDN 加速、自动扩容、安全规则
- **集成**: 需要配合 Firebase Authentication

### 3.2 配置和初始化

```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_storage: ^11.6.0
  firebase_auth: ^4.16.0
```

---

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';

// firebase_options.dart (由 flutterfire configure 生成)
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  runApp(MyApp());
}
```

### 3.3 文件上传

```dart
class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // 上传图片（从 File/XFile/AssetEntity）
  Future<String> uploadImage({
    required String filePath,
    required String userId,
    String? customFileName,
  }) async {
    try {
      final file = XFile(filePath);
      final fileName = customFileName ?? '${DateTime.now().millisecondsSinceEpoch}.jpg';
      final ref = _storage.ref().child('users/$userId/images/$fileName');

      // 设置元数据
      final metadata = SettableMetadata(
        contentType: 'image/jpeg',
        customMetadata: {
          'uploaded_by': userId,
          'uploaded_at': DateTime.now().toIso8601String(),
        },
      );

      // 上传文件
      final uploadTask = ref.putFile(
        File(file.path),
        metadata,
      );

      // 监听上传进度
      uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
        print('进度: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%');
        
        switch (snapshot.state) {
          case TaskState.running:
            print('上传中...');
            break;
          case TaskState.paused:
            print('已暂停');
            break;
          case TaskState.success:
            print('上传成功 ✅');
            break;
          case TaskState.canceled:
            print('已取消');
            break;
          case TaskState.error:
            print('上传失败 ❌');
            break;
        }
      });

      // 等待完成并获取下载 URL
      final snapshot = await uploadTask;
      final downloadUrl = await snapshot.ref.getDownloadURL();
      
      return downloadUrl;
    } catch (e) {
      throw Exception('图片上传失败: $e');
    }
  }

  // 上传多个文件
  Future<List<String>> uploadMultipleImages({
    required List<String> filePaths,
    required String userId,
  }) async {
    final urls = <String>[];
    
    for (final path in filePaths) {
      final url = await uploadImage(
        filePath: path,
        userId: userId,
      );
      urls.add(url);
    }
    
    return urls;
  }

  // 分块上传（大文件）
  Future<String> uploadLargeFile({
    required String filePath,
    required String destinationPath,
  }) async {
    final file = File(filePath);
    final ref = _storage.ref().child(destinationPath);

    final uploadTask = ref.putFile(
      file,
      SettableMetadata(
        contentType: 'application/octet-stream',
      ),
    );

    final snapshot = await uploadTask;
    return await snapshot.ref.getDownloadURL();
  }
}
```

### 3.4 文件下载和管理

```dart
class FileDownloadService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // 获取下载 URL
  Future<String> getDownloadUrl(String path) async {
    try {
      final ref = _storage.ref().child(path);
      return await ref.getDownloadURL();
    } catch (e) {
      if (e is FirebaseException && e.code == 'object-not-found') {
        throw Exception('文件不存在');
      }
      rethrow;
    }
  }

  // 下载文件到本地
  Future<File> downloadToFile({
    required String storagePath,
    required String localPath,
  }) async {
    final ref = _storage.ref().child(storagePath);
    await ref.writeToFile(File(localPath));
    return File(localPath);
  }

  // 列出目录下的所有文件
  Future<ListResult> listFiles(String directory) async {
    final ref = _storage.ref().child(directory);
    return await ref.listAll();
  }

  // 使用示例：展示用户所有图片
  Future<List<String>> getUserImageUrls(String userId) async {
    final result = await listFiles('users/$userId/images');
    final urls = <String>[];
    
    for (final item in result.items) {
      final url = await item.getDownloadURL();
      urls.add(url);
    }
    
    return urls;
  }

  // 删除文件
  Future<void> deleteFile(String path) async {
    final ref = _storage.ref().child(path);
    await ref.delete();
  }

  // 更新元数据
  Future<void> updateMetadata({
    required String path,
    required SettableMetadata newMetadata,
  }) async {
    final ref = _storage.ref().child(path);
    await ref.updateMetadata(newMetadata);
  }

  // 获取文件元数据
  Future<FullMetadata> getMetadata(String path) async {
    final ref = _storage.ref().child(path);
    return await ref.getMetadata();
  }
}
```

## 4. Cloud Firestore - NoSQL 云数据库

### 4.1 特点与应用场景

- **适用场景**: 实时同步、离线支持、复杂查询、用户数据
- **数据模型**: Collection → Document → Field
- **优势**: 实时监听、离线持久化、强大的查询能力

### 4.2 安装和基本配置

```yaml

dependencies:
  cloud_firestore: ^4.14.0
  
```

---

```dart
import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  // 引用集合
  CollectionReference get usersRef => _firestore.collection('users');
  CollectionReference get postsRef => _firestore.collection('posts');
}
```

### 4.3 CRUD 操作

```dart
class PostRepository {
  final CollectionReference _postsRef = 
      FirebaseFirestore.instance.collection('posts');

  // Create - 添加文档
  Future<DocumentReference> addPost(Map<String, dynamic> post) async {
    return await _postsRef.add({
      ...post,
      'created_at': FieldValue.serverTimestamp(),
      'updated_at': FieldValue.serverTimestamp(),
    });
  }

  // Create - 设置文档（指定 ID）
  Future<void> setPostWithId({
    required String docId,
    required Map<String, dynamic> data,
    bool merge = true, // 合并而非覆盖
  }) async {
    await _postsRef.doc(docId).set(data, SetOptions(merge: merge));
  }

  // Read - 获取单个文档
  Future<DocumentSnapshot?> getPost(String docId) async {
    final doc = await _postsRef.doc(docId).get();
    return doc.exists ? doc : null;
  }

  // Read - 条件查询
  Future<QuerySnapshot> queryPosts({
    String? authorId,
    int limit = 20,
    DocumentSnapshot? startAfter,
  }) async {
    Query query = _postsRef
        .orderBy('created_at', descending: true)
        .limit(limit);

    if (authorId != null) {
      query = query.where('author_id', isEqualTo: authorId);
    }

    if (startAfter != null) {
      query = query.startAfterDocument(startAfter);
    }

    return await query.get();
  }

  // Read - 复杂查询（数组包含、范围查询等）
  Future<QuerySnapshot> advancedQuery() async {
    return await _postsRef
        .where('status', isEqualTo: 'published')
        .where('tags', arrayContainsAny: ['flutter', 'dart'])
        .where('likes', isGreaterThan: 100)
        .where('created_at', isGreaterThanOrEqualTo: DateTime(2024, 1, 1))
        .orderBy('likes', descending: true)
        .limit(10)
        .get();
  }

  // Update - 更新文档
  Future<void> updatePost(String docId, Map<String, dynamic> data) async {
    await _postsRef.doc(docId).update({
      ...data,
      'updated_at': FieldValue.serverTimestamp(),
    });
  }

  // Update - 原子操作（增减数值）
  Future<void> incrementLikes(String docId) async {
    await _postsRef.doc(docId).update({
      'likes': FieldValue.increment(1),
    });
  }

  Future<void> decrementStock(String docId) async {
    await _postsRef.doc(docId).update({
      'stock': FieldValue.increment(-1),
    });
  }

  // Update - 数组操作
  Future<void> addTag(String docId, String tag) async {
    await _postsRef.doc(docId).update({
      'tags': FieldValue.arrayUnion([tag]),
    });
  }

  Future<void> removeTag(String docId, String tag) async {
    await _postsRef.doc(docId).update({
      'tags': FieldValue.arrayRemove([tag]),
    });
  }

  // Delete - 删除文档
  Future<void> deletePost(String docId) async {
    await _postsRef.doc(docId).delete();
  }

  // 批量写入
  Future<void> batchOperation() async {
    final batch = _firestore.batch();

    // 批量添加
    final doc1Ref = _postsRef.doc();
    batch.set(doc1Ref, {'title': 'Post 1'});

    // 批量更新
    final doc2Ref = _postsRef.doc('post_123');
    batch.update(doc2Ref, {'title': 'Updated Title'});

    // 批量删除
    final doc3Ref = _postsRef.doc('post_456');
    batch.delete(doc3Ref);

    // 提交批量操作（原子性）
    await batch.commit();
  }

  // 事务操作
  Future<void> transactionExample(String fromId, String toId, int amount) async {
    await _firestore.runTransaction((transaction) async {
      final fromDoc = await transaction.get(_postsRef.doc(fromId));
      final toDoc = await transaction.get(_postsRef.doc(toId));

      final fromBalance = fromDoc.data()?['balance'] ?? 0;
      final toBalance = toDoc.data()?['balance'] ?? 0;

      if (fromBalance < amount) {
        throw Exception('余额不足');
      }

      transaction.update(_postsRef.doc(fromId), {
        'balance': fromBalance - amount,
      });

      transaction.update(_postsRef.doc(toId), {
        'balance': toBalance + amount,
      });
    });
  }
}
```

### 4.4 实时监听（Stream）

```dart
class RealtimeService {
  final CollectionReference _messagesRef = 
      FirebaseFirestore.instance.collection('messages');

  // 监听单个文档变化
  Stream<DocumentSnapshot> watchDocument(String docId) {
    return _messagesRef.doc(docId).snapshots();
  }

  // 监听集合查询结果
  Stream<QuerySnapshot> watchMessages({required String chatRoomId}) {
    return _messagesRef
        .where('room_id', isEqualTo: chatRoomId)
        .orderBy('sent_at')
        .snapshots();
  }

  // 使用示例：在 Widget 中实时显示数据
  StreamBuilder<QuerySnapshot>(
    stream: watchMessages(chatRoomId: 'room_123'),
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return Text('错误: ${snapshot.error}');
      }

      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      }

      final messages = snapshot.data!.docs;
      return ListView.builder(
        itemCount: messages.length,
        itemBuilder: (context, index) {
          final message = messages[index].data() as Map<String, dynamic>;
          return ListTile(
            title: Text(message['content']),
            subtitle: Text(message['sender_name']),
          );
        },
      );
    },
  )

  // 监听特定字段变化（需要手动比较）
  Stream<Map<String, dynamic>> watchSpecificField(String docId, String field) {
    return _messagesRef.doc(docId).snapshots().map((doc) {
      if (!doc.exists) return {};
      return doc.data() ?? {};
    });
  }
}
```

### 4.5 子集合（Subcollection）

```dart
class SubcollectionService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // 获取用户的订单（子集合）
  Future<QuerySnapshot> getUserOrders(String userId) async {
    return await _firestore
        .collection('users')
        .doc(userId)
        .collection('orders')
        .orderBy('created_at', descending: true)
        .get();
  }

  // 添加子文档
  Future<void> addOrderToUser({
    required String userId,
    required Map<String, dynamic> orderData,
  }) async {
    await _firestore
        .collection('users')
        .doc(userId)
        .collection('orders')
        .add({
          ...orderData,
          'created_at': FieldValue.serverTimestamp(),
        });
  }

  // 嵌套子集合（用户 → 订单 → 商品）
  Future<QuerySnapshot> getOrderItems({
    required String userId,
    required String orderId,
  }) async {
    return await _firestore
        .collection('users')
        .doc(userId)
        .collection('orders')
        .doc(orderId)
        .collection('items')
        .get();
  }
}
```

## 5. 存储方案对比与选择指南

| 存储方案 | 数据类型 | 适用场景 | 离线支持 | 复杂度 |
|---------|---------|---------|---------|--------|
| **SharedPreferences** | 键值对 | 用户设置、轻量配置 | ❌ | ⭐ |
| **SQLite** | 结构化关系数据 | 大量数据、复杂查询 | ✅ | ⭐⭐⭐ |
| **Firebase Storage** | 文件（图片/视频） | 用户生成内容、媒体文件 | ✅ | ⭐⭐ |
| **Cloud Firestore** | NoSQL 文档 | 实时应用、协作功能 | ✅ | ⭐⭐⭐⭐ |

### 选择建议

1. **简单配置** → SharedPreferences
2. **大量结构化数据 + 离线优先** → SQLite
3. **文件上传下载** → Firebase Storage
4. **实时同步 + 多端协作** → Cloud Firestore
5. **混合方案** → Firestore 存储元数据 + Storage 存储实际文件

## 6. 最佳实践与安全建议

### 6.1 数据安全

```dart
// Firebase Storage 安全规则示例
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 用户只能访问自己的文件夹
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
    
    // 公共读取的图片
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

// Firestore 安全规则示例
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户数据保护
    match /users/{userId} {
      allow read: if request.auth != null 
                 && (request.auth.uid == userId 
                     || resource.data.role == 'public');
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 6.2 性能优化

```dart
// 1. 离线持久化配置
await FirebaseFirestore.instance.enablePersistence(
  PersistenceSettings(synchronizeWrites: true),
);

// 2. 限制查询返回的字段
await _firestore
    .collection('posts')
    .select(['title', 'author', 'created_at']) // 只获取需要的字段
    .limit(10)
    .get();

// 3. 使用缓存策略
final options = GetOptions(source: Source.cache); // 仅从缓存
final options = GetOptions(source: Source.server); // 仅从服务器

// 4. 图片压缩后上传
Future<XFile> compressImage(XFile image) async {
  final compressed = await FlutterImageCompress.compressAndGetFile(
    image.path,
    '${Directory.systemTemp.path}/compressed.jpg',
    quality: 85,
    minWidth: 1024,
    minHeight: 1024,
  );
  return XFile(compressed!.path);
}
```

### 6.3 错误处理最佳实践

```dart
class SafeStorageService {
  Future<T> handleStorageErrors<T>(Future<T> Function() operation) async {
    try {
      return await operation();
    } on FirebaseException catch (e) {
      switch (e.code) {
        case 'permission-denied':
          throw Exception('没有权限访问此资源');
        case 'not-found':
          throw Exception('请求的资源不存在');
        case 'unauthenticated':
          throw Exception('请先登录');
        case 'quota-exceeded':
          throw Exception('存储空间不足');
        case 'object-not-found':
          throw Exception('文件不存在');
        default:
          throw Exception('存储操作失败: ${e.message}');
      }
    } catch (e) {
      throw Exception('未知错误: $e');
    }
  }

  // 使用示例
  Future<String> safeUpload(String path) async {
    return handleStorageErrors(() => uploadImage(filePath: path, userId: '123'));
  }
}
```

## 7. 常见问题与解决方案

### Q1: 如何处理大文件上传？

```dart
// 使用分块上传或压缩
Future<String> uploadLargeVideo(String videoPath) async {
  // 先压缩视频
  final compressed = await VideoCompress.compressVideo(
    videoPath,
    quality: VideoQuality.MediumQuality,
    includeAudio: true,
  );
  
  // 再上传
  return await uploadFile(compressed!.file!);
}
```

### Q2: 如何实现断点续传？

```dart
// 保存上传任务状态
class ResumableUpload {
  TaskSnapshot? _lastSnapshot;
  String? _uploadPath;

  Future<void> pauseUpload() async {
    // Firebase Storage SDK 支持暂停/恢复
    // 需要在 UI 层保存 task 引用
  }

  Future<void> resumeUpload(Task task) async {
    await task.resume();
  }
}
```

### Q3: 如何清理过期数据？

```dart
// 定时清理临时文件
Future<void> cleanupExpiredFiles() async {
  final tempDir = await getTemporaryDirectory();
  final files = tempDir.listSync();
  
  for (final file in files) {
    if (file is File) {
      final lastModified = await file.lastModified();
      final age = DateTime.now().difference(lastModified);
      
      if (age.inDays > 7) { // 超过7天
        await file.delete();
      }
    }
  }
}
```

---

## 📚 相关资源

- [SharedPreferences 官方文档](https://pub.dev/packages/shared_preferences)
- [sqflite 官方文档](https://pub.dev/packages/sqflite)
- [Firebase Storage 文档](https://firebase.google.com/docs/storage)
- [Cloud Firestore 文档](https://firebase.google.com/docs/firestore)
- [FlutterFire 配置工具](https://firebase.flutter.dev/docs/manual-installation/flutterfire-cli)
