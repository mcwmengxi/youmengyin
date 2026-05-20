# Flutter 网络请求 - HTTP 与数据处理 🌐

## 1. HTTP 基础

### 1.1 常用 HTTP 方法

```dart
// GET - 获取数据
GET /api/users/123

// POST - 创建数据
POST /api/users
Body: {"name": "张三", "email": "zhangsan@example.com"}

// PUT - 更新数据（全量）
PUT /api/users/123
Body: {"name": "李四", "email": "lisi@example.com"}

// PATCH - 更新数据（部分）
PATCH /api/users/123
Body: {"name": "王五"}

// DELETE - 删除数据
DELETE /api/users/123
```

### 1.2 HTTP 状态码

- **2xx 成功**: 200 OK, 201 Created
- **3xx 重定向**: 301 Moved, 304 Not Modified
- **4xx 客户端错误**: 400 Bad Request, 401 Unauthorized, 404 Not Found
- **5xx 服务器错误**: 500 Internal Server Error, 503 Service Unavailable

## 2. Dio - 强大的 HTTP 客户端

### 2.1 安装和配置

```yaml
# pubspec.yaml
dependencies:
  dio: ^5.0.0
```

### 2.2 基本使用

```dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio();

  ApiService() {
    // 基础配置
    _dio.options.baseUrl = 'https://api.example.com';
    _dio.options.connectTimeout = Duration(seconds: 30);
    _dio.options.receiveTimeout = Duration(seconds: 30);
    
    // 添加拦截器
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        print('请求：${options.method} ${options.path}');
        return handler.next(options);
      },
      onResponse: (response, handler) {
        print('响应：${response.statusCode}');
        return handler.next(response);
      },
      onError: (error, handler) {
        print('错误：${error.response?.statusCode}');
        return handler.next(error);
      },
    ));
  }

  // GET 请求
  Future<Response> getUsers() async {
    return await _dio.get('/users');
  }

  // POST 请求
  Future<Response> createUser(Map<String, dynamic> data) async {
    return await _dio.post('/users', data: data);
  }

  // PUT 请求
  Future<Response> updateUser(String id, Map<String, dynamic> data) async {
    return await _dio.put('/users/$id', data: data);
  }

  // DELETE 请求
  Future<Response> deleteUser(String id) async {
    return await _dio.delete('/users/$id');
  }
}
```

### 2.3 请求参数

```dart
// Query 参数
final response = await dio.get(
  '/users',
  queryParameters: {
    'page': 1,
    'limit': 20,
    'keyword': '搜索词',
  },
);

// Path 参数
final response = await dio.get('/users/123');

// Body 参数（JSON）
final response = await dio.post(
  '/users',
  data: {
    'name': '张三',
    'age': 25,
    'email': 'zhangsan@example.com',
  },
);

// FormData（文件上传）
final formData = FormData.fromMap({
  'file': await MultipartFile.fromFile(
    filePath,
    filename: 'image.jpg',
  ),
  'description': '图片描述',
});

final response = await dio.post('/upload', data: formData);
```

### 2.4 响应处理

```dart
try {
  final response = await dio.get('/users/123');
  
  // 状态码
  print('状态码：${response.statusCode}');
  
  // 响应数据
  print('数据：${response.data}');
  
  // 响应头
  print('Headers: ${response.headers}');
  
  // 解析 JSON
  final userData = response.data as Map<String, dynamic>;
  print('用户名：${userData['name']}');
  
} on DioException catch (e) {
  // 错误处理
  if (e.type == DioExceptionType.connectionTimeout) {
    print('连接超时');
  } else if (e.type == DioExceptionType.receiveTimeout) {
    print('接收超时');
  } else if (e.response?.statusCode == 404) {
    print('资源不存在');
  } else if (e.response?.statusCode == 401) {
    print('未授权');
  } else {
    print('其他错误：${e.message}');
  }
}
```

## 3. 封装网络层

### 3.1 统一响应模型

```dart
class ApiResponse<T> {
  final int code;
  final String message;
  final T? data;

  ApiResponse({
    required this.code,
    required this.message,
    this.data,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJson,
  ) {
    return ApiResponse(
      code: json['code'] ?? 0,
      message: json['message'] ?? '',
      data: fromJson != null ? fromJson(json['data']) : null,
    );
  }

  bool get isSuccess => code == 200;
}
```

### 3.2 数据模型类

```dart
class User {
  final int id;
  final String name;
  final String email;
  final String? avatar;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.avatar,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      avatar: json['avatar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatar': avatar,
    };
  }
}
```

### 3.3 完整的服务层封装

```dart
class HttpService {
  static final HttpService _instance = HttpService._internal();
  factory HttpService() => _instance;
  HttpService._internal();

  final Dio _dio = Dio();
  final String _baseUrl = 'https://api.example.com';

  // 初始化配置
  void init() {
    _dio.options.baseUrl = _baseUrl;
    _dio.options.connectTimeout = Duration(seconds: 30);
    _dio.options.receiveTimeout = Duration(seconds: 30);

    // 添加日志拦截器
    _dio.interceptors.add(LogInterceptor(
      request: true,
      requestHeader: true,
      requestBody: true,
      responseHeader: true,
      responseBody: true,
      error: true,
    ));

    // 添加认证拦截器
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // 添加 token
        final token = StorageService().getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        // 统一处理响应
        final responseData = response.data;
        if (responseData is Map) {
          final code = responseData['code'];
          if (code == 401) {
            // Token 过期，跳转登录
            _handleTokenExpired();
          }
        }
        return handler.next(response);
      },
      onError: (error, handler) {
        // 统一错误处理
        _handleError(error);
        return handler.next(error);
      },
    ));
  }

  // GET 请求
  Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
      );
      return _parseResponse(response, fromJson);
    } catch (e) {
      return _handleException(e);
    }
  }

  // POST 请求
  Future<ApiResponse<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return _parseResponse(response, fromJson);
    } catch (e) {
      return _handleException(e);
    }
  }

  // PUT 请求
  Future<ApiResponse<T>> put<T>(
    String path, {
    dynamic data,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.put(path, data: data);
      return _parseResponse(response, fromJson);
    } catch (e) {
      return _handleException(e);
    }
  }

  // DELETE 请求
  Future<ApiResponse<T>> delete<T>(
    String path, {
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final response = await _dio.delete(path);
      return _parseResponse(response, fromJson);
    } catch (e) {
      return _handleException(e);
    }
  }

  // 解析响应
  ApiResponse<T> _parseResponse<T>(
    Response response,
    T Function(dynamic)? fromJson,
  ) {
    final data = response.data;
    if (data is Map) {
      return ApiResponse.fromJson(data, fromJson);
    }
    return ApiResponse(
      code: response.statusCode ?? 200,
      message: 'success',
      data: fromJson != null ? fromJson(data) : data as T,
    );
  }

  // 处理异常
  ApiResponse<T> _handleException<T>(dynamic e) {
    if (e is DioException) {
      switch (e.type) {
        case DioExceptionType.connectionTimeout:
          return ApiResponse(code: -1, message: '连接超时');
        case DioExceptionType.receiveTimeout:
          return ApiResponse(code: -1, message: '响应超时');
        case DioExceptionType.badResponse:
          return ApiResponse(
            code: e.response?.statusCode ?? -1,
            message: '请求失败',
          );
        default:
          return ApiResponse(code: -1, message: '网络错误');
      }
    }
    return ApiResponse(code: -1, message: '未知错误');
  }

  // Token 过期处理
  void _handleTokenExpired() {
    // 清除本地 token
    StorageService().removeToken();
    // 跳转到登录页
    // Navigator.pushNamed(context, '/login');
  }

  // 错误处理
  void _handleError(DioException error) {
    // 显示错误提示
    print('错误：${error.message}');
  }
}
```

## 4. 实战案例

### 4.1 用户登录

```dart
class AuthService {
  final _http = HttpService();

  Future<ApiResponse<User>> login(String email, String password) async {
    return await _http.post<User>(
      '/auth/login',
      data: {
        'email': email,
        'password': password,
      },
      fromJson: (json) => User.fromJson(json),
    );
  }

  Future<ApiResponse<void>> logout() async {
    return await _http.post('/auth/logout');
  }

  Future<ApiResponse<User>> getCurrentUser() async {
    return await _http.get<User>(
      '/user/me',
      fromJson: (json) => User.fromJson(json),
    );
  }
}

// 使用
class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final response = await AuthService().login(
      _emailController.text,
      _passwordController.text,
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (response.isSuccess) {
      // 保存 token
      await StorageService().saveToken(response.data!.toString());
      // 跳转首页
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      // 显示错误
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response.message)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('登录')),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(labelText: '邮箱'),
              validator: (v) => v?.isEmpty ?? true ? '请输入邮箱' : null,
            ),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: '密码'),
              obscureText: true,
              validator: (v) => v?.isEmpty ?? true ? '请输入密码' : null,
            ),
            ElevatedButton(
              onPressed: _isLoading ? null : _handleLogin,
              child: _isLoading
                  ? CircularProgressIndicator()
                  : Text('登录'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 4.2 列表数据加载

```dart
class ProductListPage extends StatefulWidget {
  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  final _productService = ProductService();
  List<Product> _products = [];
  bool _isLoading = false;
  bool _hasMore = true;
  int _currentPage = 1;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    if (_isLoading || !_hasMore) return;

    setState(() => _isLoading = true);

    final response = await _productService.getProducts(
      page: _currentPage,
      limit: 20,
    );

    setState(() => _isLoading = false);

    if (response.isSuccess && response.data != null) {
      setState(() {
        _products.addAll(response.data!);
        _currentPage++;
        _hasMore = response.data!.length >= 20;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('商品列表')),
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            _products = [];
            _currentPage = 1;
            _hasMore = true;
          });
          await _loadData();
        },
        child: ListView.builder(
          itemCount: _products.length + 1,
          itemBuilder: (context, index) {
            if (index == _products.length) {
              return _isLoading
                  ? Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : Container();
            }
            final product = _products[index];
            return ListTile(
              title: Text(product.name),
              subtitle: Text('¥${product.price}'),
              onTap: () {
                Navigator.pushNamed(context, '/product/${product.id}');
              },
            );
          },
        ),
      ),
    );
  }
}
```

### 4.3 文件上传

```dart
class UploadService {
  final _http = HttpService();

  Future<ApiResponse<String>> uploadImage(String filePath) async {
    final file = File(filePath);
    final fileName = filePath.split('/').last;

    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(
        file.path,
        filename: fileName,
      ),
      'type': 'image',
    });

    return await _http.post<String>(
      '/upload/image',
      data: formData,
      fromJson: (json) => json['url'] as String,
    );
  }
}

// 使用
Future<void> pickAndUploadImage() async {
  final ImagePicker picker = ImagePicker();
  final XFile? image = await picker.pickImage(source: ImageSource.gallery);

  if (image != null) {
    final response = await UploadService().uploadImage(image.path);
    
    if (response.isSuccess && response.data != null) {
      print('上传成功：${response.data}');
    }
  }
}
```

## 5. JSON 序列化

### 5.1 手动序列化

```dart
class Product {
  final int id;
  final String name;
  final double price;
  final String description;
  final List<String> images;
  final Category category;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.images,
    required this.category,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      description: json['description'] ?? '',
      images: (json['images'] as List?)?.map((e) => e.toString()).toList() ?? [],
      category: Category.fromJson(json['category'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'description': description,
      'images': images,
      'category': category.toJson(),
    };
  }
}

class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
    };
  }
}
```

### 5.2 使用 json_serializable

```yaml
dependencies:
  json_annotation: ^4.8.0

dev_dependencies:
  build_runner: ^2.0.0
  json_serializable: ^6.0.0
```

```dart
import 'package:json_annotation/json_annotation.dart';

part 'product.g.dart';

@JsonSerializable()
class Product {
  final int id;
  final String name;
  final double price;
  final String description;
  final List<String> images;
  final Category category;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.images,
    required this.category,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);
}

@JsonSerializable()
class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}
```

生成代码：
```bash
flutter pub run build_runner build
```

## 6. 网络状态监听

### 6.1 使用 connectivity_plus

```yaml
dependencies:
  connectivity_plus: ^5.0.0
```

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

class NetworkService {
  static final NetworkService _instance = NetworkService._internal();
  factory NetworkService() => _instance;
  NetworkService._internal();

  final Connectivity _connectivity = Connectivity();
  StreamSubscription? _subscription;
  bool _isConnected = true;

  void init() {
    _subscription = _connectivity.onConnectivityChanged.listen((result) {
      _updateConnectionStatus(result);
    });
  }

  void _updateConnectionStatus(List<ConnectivityResult> result) {
    final wasConnected = _isConnected;
    _isConnected = !result.contains(ConnectivityResult.none);

    if (!wasConnected && _isConnected) {
      // 网络恢复
      print('网络已连接');
    } else if (wasConnected && !_isConnected) {
      // 网络断开
      print('网络已断开');
    }
  }

  bool get isConnected => _isConnected;

  void dispose() {
    _subscription?.cancel();
  }
}
```

## 💡 小结

- 掌握 Dio 的基本使用方法
- 学会封装统一的网络层
- 理解 JSON 序列化和反序列化
- 能够处理各种网络异常情况
- 实现下拉刷新和上拉加载更多
- 注意网络安全和性能优化

下一步：[本地存储](local-storage.md) → 学习数据持久化方案
