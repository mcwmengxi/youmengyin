# Flutter 实战进阶 - JSON 序列化/反序列化最佳实践 📦

## 1. 为什么需要 JSON 序列化？

在 Flutter 开发中，JSON 处理是不可或缺的技能：

- **网络请求**: API 返回的数据通常是 JSON 格式
- **本地存储**: SharedPreferences、数据库存储结构化数据
- **状态持久化**: 保存应用状态到本地

### 1.1 JSON 与 Dart 对象的映射关系

```
JSON          →    Dart
---------------------------
Object        →    Map<String, dynamic>
Array         →    List<dynamic>
String        →    String
Number        →    int / double
Boolean       →    bool
null          →    null
```

## 2. 手动序列化方案

### 2.1 基础模型类

```dart
class User {
  final int id;
  final String name;
  final String email;
  final DateTime? birthday;
  final Address? address;
  final List<String> tags;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.birthday,
    this.address,
    this.tags = const [],
  });

  // JSON → Dart 对象（反序列化）
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      birthday: json['birthday'] != null 
          ? DateTime.parse(json['birthday'] as String) 
          : null,
      address: json['address'] != null 
          ? Address.fromJson(json['address'] as Map<String, dynamic>) 
          : null,
      tags: (json['tags'] as List?)?.map((e) => e as String).toList() ?? [],
    );
  }

  // Dart 对象 → JSON（序列化）
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'birthday': birthday?.toIso8601String(),
      'address': address?.toJson(),
      'tags': tags,
    };
  }
}

class Address {
  final String province;
  final String city;
  final String district;
  final String detail;

  Address({
    required this.province,
    required this.city,
    required this.district,
    required this.detail,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      province: json['province'] as String? ?? '',
      city: json['city'] as String? ?? '',
      district: json['district'] as String? ?? '',
      detail: json['detail'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'province': province,
      'city': city,
      'district': district,
      'detail': detail,
    };
  }
}
```

### 2.2 处理复杂数据类型

```dart
class Product {
  final int id;
  final String name;
  final double price;
  final ProductStatus status;
  final List<ProductImage> images;
  final Map<String, String> attributes;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.status,
    required this.images,
    required this.attributes,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      status: ProductStatus.values.firstWhere(
        (e) => e.value == json['status'],
        orElse: () => ProductStatus.unknown,
      ),
      images: (json['images'] as List?)
              ?.map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      attributes: (json['attributes'] as Map?)?.cast<String, String>() ?? {},
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'status': status.value,
      'images': images.map((e) => e.toJson()).toList(),
      'attributes': attributes,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

// 枚举类型处理
enum ProductStatus {
  onSale('on_sale'),
  offSale('off_sale'),
  outOfStock('out_of_stock'),
  unknown('unknown');

  final String value;
  const ProductStatus(this.value);
}

class ProductImage {
  final String url;
  final int width;
  final int height;

  ProductImage({
    required this.url,
    required this.width,
    required this.height,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      url: json['url'] as String? ?? '',
      width: json['width'] as int? ?? 0,
      height: json['height'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'url': url,
      'width': width,
      'height': height,
    };
  }
}
```

### 2.3 空值安全处理

```dart
class SafeUser {
  final int? id;
  final String? name;
  final String? email;
  final List<String>? hobbies;

  SafeUser({
    this.id,
    this.name,
    this.email,
    this.hobbies,
  });

  factory SafeUser.fromJson(Map<String, dynamic> json) {
    return SafeUser(
      id: json['id'] as int?,
      name: json['name'] as String?,
      email: json['email'] as String?,
      hobbies: json['hobbies'] is List
          ? (json['hobbies'] as List).map((e) => e as String).toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (email != null) 'email': email,
      if (hobbies != null) 'hobbies': hobbies,
    };
  }
}
```

## 3. json_serializable 自动化方案

### 3.1 安装依赖

```yaml
# pubspec.yaml
dependencies:
  json_annotation: ^4.8.1

dev_dependencies:
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
```

### 3.2 基础用法

```dart
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final int id;
  final String name;
  final String email;
  
  User({
    required this.id,
    required this.name,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}
```

生成代码：

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 3.3 高级配置

```dart
@JsonSerializable(
  explicitToJson: true,     // 嵌套对象自动生成
  createFactory: true,      // 生成 fromJson 工厂方法
  createToJson: true,       // 生成 toJson 方法
  fieldRename: FieldRename.snake, // 字段命名风格：snake, kebab, pascal, camel
  ignoreUnannotated: true,  // 忽略未注解的字段
  includeIfNull: false,     // 不包含 null 值
)
class Product {
  @JsonKey(name: 'product_id')  // 自定义字段名
  final int productId;
  
  final String name;
  
  @JsonKey(defaultValue: 0.0)   // 默认值
  final double price;
  
  @JsonKey(includeIfNull: false) // 单独配置
  final String? description;
  
  @JsonKey(fromJson: _parseDateTime, toJson: _formatDateTime)
  final DateTime createdAt;
  
  @JsonKey(unknownEnumValue: ProductStatus.unknown)
  final ProductStatus status;
  
  final List<Image> images;
  final Map<String, String> attrs;

  Product({
    required this.productId,
    required this.name,
    required this.price,
    this.description,
    required this.createdAt,
    required this.status,
    required this.images,
    required this.attrs,
  });

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  // 自定义解析函数
  static DateTime _parseDateTime(dynamic value) {
    if (value == null) return DateTime.now();
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.parse(value);
    return DateTime.now();
  }

  // 自定义格式化函数
  static String _formatDateTime(DateTime date) {
    return date.toIso8601String();
  }
}

@JsonSerializable()
class Image {
  final String url;
  final int width;
  final int height;

  Image({
    required this.url,
    required this.width,
    required this.height,
  });

  factory Image.fromJson(Map<String, dynamic> json) => _$ImageFromJson(json);
  Map<String, dynamic> toJson() => _$ImageToJson(this);
}

enum ProductStatus {
  @JsonValue('on_sale')
  onSale,
  
  @JsonValue('off_sale')
  offSale,
  
  @JsonValue('out_of_stock')
  outOfStock,
  
  unknown,
}
```

### 3.4 泛型支持

```dart
@JsonSerializable(genericArgumentFactories: true)
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
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse(
      code: json['code'] as int? ?? 0,
      message: json['message'] as String? ?? '',
      data: fromJsonT != null && json['data'] != null
          ? fromJsonT(json['data'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson([Object? Function(T)? toJsonT]) {
    return {
      'code': code,
      'message': message,
      'data': toJsonT != null && data != null ? toJsonT(data as T) : null,
    };
  }
}

// 使用示例
class Order {
  final int id;
  final double amount;
  final DateTime createTime;

  Order({
    required this.id,
    required this.amount,
    required this.createTime,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);
}

// 调用
final response = ApiResponse<Order>.fromJson(
  jsonData,
  (json) => Order.fromJson(json as Map<String, dynamic>),
);

final order = response.data;
```

## 4. Freezed - 不可变对象 + 联合类型

### 4.1 安装依赖

```yaml
dependencies:
  freezed_annotation: ^2.4.1

dev_dependencies:
  build_runner: ^2.4.6
  freezed: ^2.4.5
  json_serializable: ^6.7.1
```

### 4.2 不可变数据类

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required int id,
    required String name,
    required String email,
    Address? address,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

@freezed
class Address with _$Address {
  const factory Address({
    required String province,
    required String city,
    required String district,
    String? detail,
  }) = _Address;

  factory Address.fromJson(Map<String, dynamic> json) => _$AddressFromJson(json);
}

// 使用
final user = User(
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com',
  address: Address(
    province: '广东省',
    city: '深圳市',
    district: '南山区',
  ),
);

// 复制并修改（copyWith）
final updatedUser = user.copyWith(
  name: '李四',
  address: user.address?.copyWith(detail: '科技园 A 栋'),
);

// 模式匹配
user.when(
  (id, name, email, address) {
    print('用户信息：$name');
  },
);
```

### 4.3 联合类型（Union Types）

```dart
@freezed
sealed class RequestResult with _$RequestResult {
  const factory RequestResult.success(dynamic data) = Success;
  const factory RequestResult.error(String message, int code) = Error;
  const factory RequestResult.loading() = Loading;
  
  factory RequestResult.fromJson(Map<String, dynamic> json) =>
      _$RequestResultFromJson(json);
}

// 使用
Widget buildResult(RequestResult result) {
  return result.when(
    success: (data) => Text('成功：$data'),
    error: (message, code) => Text('错误：$message ($code)'),
    loading: () => CircularProgressIndicator(),
  );
}
```

## 5. 实战案例：电商 APP 数据模型

### 5.1 完整的数据模型体系

```dart
// models/order.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'order.freezed.dart';
part 'order.g.dart';

@freezed
class Order with _$Order {
  const factory Order({
    required String orderId,
    required int status,
    required double totalAmount,
    required List<OrderItem> items,
    required Address shippingAddress,
    required DateTime createdAt,
    PaymentInfo? payment,
  }) = _Order;

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
}

@freezed
class OrderItem with _$OrderItem {
  const factory OrderItem({
    required int productId,
    required String productName,
    required String productImage,
    required double price,
    required int quantity,
  }) = _OrderItem;

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);
}

@freezed
class Address with _$Address {
  const factory Address({
    required String receiverName,
    required String receiverPhone,
    required String province,
    required String city,
    required String district,
    required String detail,
  }) = _Address;

  factory Address.fromJson(Map<String, dynamic> json) =>
      _$AddressFromJson(json);
}

@freezed
class PaymentInfo with _$PaymentInfo {
  const factory PaymentInfo({
    required String transactionId,
    required String method,
    DateTime? paidAt,
  }) = _PaymentInfo;

  factory PaymentInfo.fromJson(Map<String, dynamic> json) =>
      _$PaymentInfoFromJson(json);
}
```

### 5.2 API 响应封装

```dart
// models/api_response.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'api_response.freezed.dart';
part 'api_response.g.dart';

@freezed
class ApiResponse<T> with _$ApiResponse<T> {
  const factory ApiResponse({
    required int code,
    required String message,
    @JsonKey(unknownEnumValue: UnknownEnumValue.nullValue) T? data,
  }) = _ApiResponse<T>;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) =>
      _$ApiResponseFromJson(json, fromJsonT);
}

// 扩展方法
extension ApiResponseExtension<T> on ApiResponse<T> {
  bool get isSuccess => code == 200;
  bool get hasError => code != 200;
  
  T? get safeData => data;
  
  R mapData<R>(R Function(T value) mapper) {
    if (data == null) return null as R;
    return mapper(data as T);
  }
}
```

### 5.3 分页数据模型

```dart
// models/page_result.dart
@freezed
class PageResult<T> with _$PageResult<T> {
  const factory PageResult({
    required int page,
    required int pageSize,
    required int total,
    required List<T> list,
    @Default(false) bool hasMore,
  }) = _PageResult<T>;

  factory PageResult.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) =>
      _$PageResultFromJson(json, fromJsonT);
}

// 使用示例
Future<PageResult<Product>> loadProducts(int page) async {
  final response = await http.get('/products?page=$page');
  final json = jsonDecode(response.body);
  
  return PageResult<Product>.fromJson(json, (data) {
    return Product.fromJson(data as Map<String, dynamic>);
  });
}
```

## 6. 性能优化最佳实践

### 6.1 避免重复解析

```dart
// ❌ 不好的做法：每次都解析
class ProductListPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<ProductProvider>(
      builder: (context, provider, _) {
        return ListView.builder(
          itemCount: provider.products.length,
          itemBuilder: (context, index) {
            // 每次都从 JSON 解析，性能差
            final product = Product.fromJson(provider.products[index]);
            return ProductTile(product: product);
          },
        );
      },
    );
  }
}

// ✅ 好的做法：缓存解析结果
class ProductProvider with ChangeNotifier {
  final List<Product> _products = [];

  List<Product> get products => _products;

  void setProducts(List<Map<String, dynamic>> jsonList) {
    _products.clear();
    _products.addAll(
      jsonList.map((json) => Product.fromJson(json)).toList(),
    );
    notifyListeners();
  }
}
```

### 6.2 懒加载解析

```dart
class LazyProductList {
  final List<Map<String, dynamic>> _jsonList;
  final List<Product?> _cache;

  LazyProductList(this._jsonList) : _cache = List.filled(_jsonList.length, null);

  Product getProduct(int index) {
    return _cache[index] ??= Product.fromJson(_jsonList[index]);
  }

  int get length => _jsonList.length;
}
```

### 6.3 Isolate 异步解析

```dart
import 'dart:isolate';

Future<List<Product>> parseProductsInIsolate(
  List<Map<String, dynamic>> jsonList,
) async {
  return await compute(_parseProductList, jsonList);
}

List<Product> _parseProductList(List<Map<String, dynamic>> jsonList) {
  return jsonList.map((json) => Product.fromJson(json)).toList();
}

// 使用
final products = await parseProductsInIsolate(jsonData);
```

## 7. 错误处理与验证

### 7.1 自定义验证器

```dart
class ValidatedUser {
  final int id;
  final String name;
  final String email;

  ValidatedUser._({
    required this.id,
    required this.name,
    required this.email,
  });

  factory ValidatedUser.fromJson(Map<String, dynamic> json) {
    // ID 验证
    final id = json['id'] as int?;
    if (id == null || id <= 0) {
      throw FormatException('Invalid user id');
    }

    // 名称验证
    final name = json['name'] as String?;
    if (name == null || name.isEmpty || name.length > 50) {
      throw FormatException('Invalid user name');
    }

    // 邮箱验证
    final email = json['email'] as String?;
    if (email == null || !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email)) {
      throw FormatException('Invalid email format');
    }

    return ValidatedUser._(
      id: id,
      name: name,
      email: email,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }
}
```

### 7.2 容错处理

```dart
class RobustUser {
  final int id;
  final String name;
  final String email;

  RobustUser({
    required this.id,
    required this.name,
    required this.email,
  });

  factory RobustUser.fromJson(Map<String, dynamic> json) {
    return RobustUser(
      id: _parseInt(json['id'], defaultValue: 0),
      name: _parseString(json['name'], defaultValue: 'Unknown'),
      email: _parseString(json['email'], defaultValue: ''),
    );
  }

  static int _parseInt(dynamic value, {required int defaultValue}) {
    if (value == null) return defaultValue;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? defaultValue;
    if (value is double) return value.toInt();
    return defaultValue;
  }

  static String _parseString(dynamic value, {required String defaultValue}) {
    if (value == null) return defaultValue;
    if (value is String) return value.trim().isEmpty ? defaultValue : value.trim();
    return value.toString();
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }
}
```

## 8. 方案对比与选择

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 手动序列化 | 完全控制、无依赖 | 代码冗长、易出错 | 简单模型、特殊需求 |
| json_serializable | 自动生成、类型安全 | 需要代码生成、配置复杂 | 中大型项目、标准 API |
| freezed | 不可变对象、联合类型 | 学习曲线、构建时间长 | 复杂业务逻辑、状态管理 |

### 8.1 选择建议

- **个人小项目**: 手动序列化或 json_serializable
- **企业级应用**: json_serializable + freezed
- **快速原型**: 手动序列化（前期快）
- **长期维护**: json_serializable（类型安全）

## 9. 实用工具函数

```dart
// utils/json_utils.dart
class JsonUtils {
  // 安全解析整数
  static int parseInt(dynamic value, {int defaultValue = 0}) {
    if (value == null) return defaultValue;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? defaultValue;
    if (value is double) return value.toInt();
    return defaultValue;
  }

  // 安全解析双精度数
  static double parseDouble(dynamic value, {double defaultValue = 0.0}) {
    if (value == null) return defaultValue;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? defaultValue;
    return defaultValue;
  }

  // 安全解析字符串
  static String parseString(dynamic value, {String defaultValue = ''}) {
    if (value == null) return defaultValue;
    if (value is String) return value.trim();
    return value.toString();
  }

  // 安全解析布尔值
  static bool parseBool(dynamic value, {bool defaultValue = false}) {
    if (value == null) return defaultValue;
    if (value is bool) return value;
    if (value is int) return value != 0;
    if (value is String) {
      return ['true', '1', 'yes'].contains(value.toLowerCase());
    }
    return defaultValue;
  }

  // 安全解析日期
  static DateTime? parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    if (value is String) return DateTime.tryParse(value);
    return null;
  }

  // 安全解析列表
  static List<T> parseList<T>(
    dynamic value,
    T Function(dynamic) parser, {
    List<T> defaultValue = const [],
  }) {
    if (value == null || value is! List) return defaultValue;
    return value.whereType<Map>().map(parser).toList();
  }
}

// 使用示例
class User {
  final int id;
  final String name;
  final DateTime? createdAt;

  User({
    required this.id,
    required this.name,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: JsonUtils.parseInt(json['id']),
      name: JsonUtils.parseString(json['name'], defaultValue: 'Unknown'),
      createdAt: JsonUtils.parseDateTime(json['created_at']),
    );
  }
}
```

## 💡 小结

- 掌握手动序列化的基本方法
- 学会使用 json_serializable 提高效率
- 理解 freezed 的不可变对象优势
- 根据项目规模选择合适的方案
- 注意空值安全和错误处理
- 考虑性能优化（缓存、Isolate）

## 📚 推荐资源

- [json_serializable 官方文档](https://pub.dev/packages/json_serializable)
- [freezed 官方文档](https://pub.dev/packages/freezed)
- [Dart JSON 编码解码](https://dart.dev/library/dart-convert/dart-convert-library)

下一步：[本地存储](local-storage.md) → 学习如何将数据持久化到本地
