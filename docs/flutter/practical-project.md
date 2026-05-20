# Flutter 实战项目 - 完整应用开发 🎯

## 1. 项目架构设计

### 1.1 目录结构

```
lib/
├── main.dart                 # 应用入口
├── app.dart                  # 应用配置
├── config/                   # 配置文件
│   ├── constants.dart        # 常量定义
│   ├── theme.dart            # 主题配置
│   └── routes.dart           # 路由配置
├── models/                   # 数据模型
│   ├── user.dart
│   ├── product.dart
│   └── order.dart
├── providers/                # 状态管理
│   ├── user_provider.dart
│   ├── cart_provider.dart
│   └── theme_provider.dart
├── services/                 # 服务层
│   ├── api_service.dart      # API 服务
│   ├── storage_service.dart  # 存储服务
│   └── auth_service.dart     # 认证服务
├── pages/                    # 页面
│   ├── home/
│   │   ├── home_page.dart
│   │   └── widgets/
│   ├── product/
│   │   ├── product_list.dart
│   │   └── product_detail.dart
│   ├── cart/
│   │   └── cart_page.dart
│   └── profile/
│       └── profile_page.dart
├── widgets/                  # 公共组件
│   ├── custom_button.dart
│   ├── loading_widget.dart
│   └── error_widget.dart
└── utils/                    # 工具类
    ├── validator.dart        # 表单验证
    ├── formatter.dart        # 格式化工具
    └── logger.dart           # 日志工具
```

### 1.2 分层架构

```dart
// 数据层 (Data Layer)
models/ + services/

// 业务逻辑层 (Business Logic Layer)
providers/

// 展示层 (Presentation Layer)
pages/ + widgets/
```

## 2. 电商 APP 实战

### 2.1 项目初始化

```dart
// main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'providers/cart_provider.dart';
import 'providers/user_provider.dart';
import 'services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 初始化存储
  await StorageService().init();
  
  runApp(MyApp());
}

// app.dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: '电商商城',
            theme: themeProvider.lightTheme,
            darkTheme: themeProvider.darkTheme,
            themeMode: themeProvider.themeMode,
            initialRoute: '/',
            onGenerateRoute: AppRouter.generateRoute,
          );
        },
      ),
    );
  }
}
```

### 2.2 底部导航栏实现

```dart
// pages/main_scaffold.dart
class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  final _pages = [
    HomePage(),
    CategoryPage(),
    CartPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages.map((page) => KeepAliveWrapper(child: page)).toList(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Theme.of(context).primaryColor,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: '首页',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category_outlined),
            activeIcon: Icon(Icons.category),
            label: '分类',
          ),
          BottomNavigationBarItem(
            icon: Badge(
              child: Icon(Icons.shopping_cart_outlined),
            ),
            activeIcon: Icon(Icons.shopping_cart),
            label: '购物车',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: '我的',
          ),
        ],
      ),
    );
  }
}

// 保持页面状态
class KeepAliveWrapper extends StatefulWidget {
  final Widget child;
  const KeepAliveWrapper({super.key, required this.child});

  @override
  State<KeepAliveWrapper> createState() => _KeepAliveWrapperState();
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }

  @override
  bool get wantKeepAlive => true;
}
```

### 2.3 首页实现

```dart
// pages/home/home_page.dart
class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('电商商城'),
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              Navigator.pushNamed(context, '/search');
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // 刷新数据
          await Future.delayed(Duration(seconds: 1));
        },
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              // 搜索栏
              _buildSearchBar(context),
              
              // 轮播图
              _buildBanner(),
              
              // 功能图标
              _buildGridMenu(),
              
              // 推荐商品
              _buildRecommendProducts(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchBar(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: GestureDetector(
        onTap: () => Navigator.pushNamed(context, '/search'),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(24),
          ),
          child: Row(
            children: [
              Icon(Icons.search, color: Colors.grey),
              SizedBox(width: 8),
              Text(
                '搜索商品',
                style: TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBanner() {
    return Container(
      height: 180,
      margin: EdgeInsets.only(bottom: 16),
      child: PageView.builder(
        autoPlay: true,
        itemCount: 5,
        itemBuilder: (context, index) {
          return Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                'https://example.com/banner$index.jpg',
                fit: BoxFit.cover,
                width: double.infinity,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildGridMenu() {
    final icons = [
      {'icon': Icons.local_fire_department, 'label': '热销'},
      {'icon': Icons.new_releases, 'label': '新品'},
      {'icon': Icons.discount, 'label': '优惠'},
      {'icon': Icons.flash_on, 'label': '秒杀'},
    ];

    return Container(
      padding: EdgeInsets.all(16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 0.8,
        ),
        itemCount: icons.length,
        itemBuilder: (context, index) {
          final item = icons[index];
          return Column(
            children: [
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (item['icon'] as IconData) == Icons.local_fire_department
                      ? Colors.red.shade50
                      : Colors.blue.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(item['icon'] as IconData),
              ),
              SizedBox(height: 8),
              Text(item['label'] as String),
            ],
          );
        },
      ),
    );
  }

  Widget _buildRecommendProducts() {
    return Container(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '为你推荐',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {},
                child: Text('查看更多'),
              ),
            ],
          ),
          SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 0.7,
            ),
            itemCount: 10,
            itemBuilder: (context, index) {
              return ProductCard(
                productId: index.toString(),
                name: '商品 $index',
                price: 99.0 * (index + 1),
                image: 'https://example.com/product$index.jpg',
              );
            },
          ),
        ],
      ),
    );
  }
}
```

### 2.4 商品卡片组件

```dart
// widgets/product_card.dart
class ProductCard extends StatelessWidget {
  final String productId;
  final String name;
  final double price;
  final String image;
  final String? originalPrice;

  const ProductCard({
    super.key,
    required this.productId,
    required this.name,
    required this.price,
    required this.image,
    this.originalPrice,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/product/$productId');
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 商品图片
            AspectRatio(
              aspectRatio: 1,
              child: Stack(
                children: [
                  Image.network(
                    image,
                    fit: BoxFit.cover,
                    width: double.infinity,
                    loadingBuilder: (context, child, progress) {
                      if (progress == null) return child;
                      return Center(
                        child: CircularProgressIndicator(
                          value: progress.expectedTotalBytes != null
                              ? progress.cumulativeBytesLoaded /
                                  progress.expectedTotalBytes!
                              : null,
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return Center(child: Icon(Icons.error));
                    },
                  ),
                  // 角标
                  if (originalPrice != null)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '特价',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            
            // 商品信息
            Expanded(
              child: Padding(
                padding: EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 商品名称
                    Text(
                      name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 14),
                    ),
                    Spacer(),
                    // 价格
                    Row(
                      children: [
                        Text(
                          '¥${price.toStringAsFixed(2)}',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (originalPrice != null) ...[
                          SizedBox(width: 4),
                          Text(
                            '¥$originalPrice',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 2.5 购物车页面

```dart
// pages/cart/cart_page.dart
class CartPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('购物车'),
        actions: [
          TextButton(
            onPressed: () {
              // 编辑模式
            },
            child: Text('管理'),
          ),
        ],
      ),
      body: Consumer<CartProvider>(
        builder: (context, cart, _) {
          if (cart.items.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 80),
                  SizedBox(height: 16),
                  Text('购物车空空如也'),
                  SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/'),
                    child: Text('去逛逛'),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              // 商品列表
              Expanded(
                child: ListView.builder(
                  itemCount: cart.items.length,
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return Dismissible(
                      key: Key(item.product.id.toString()),
                      direction: DismissDirection.endToStart,
                      background: Container(
                        color: Colors.red,
                        alignment: Alignment.centerRight,
                        padding: EdgeInsets.only(right: 16),
                        child: Icon(Icons.delete, color: Colors.white),
                      ),
                      onDismissed: (_) {
                        cart.removeItem(item.product.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('已删除'),
                            action: SnackBarAction(
                              label: '撤销',
                              onPressed: () {
                                cart.addItem(item.product);
                              },
                            ),
                          ),
                        );
                      },
                      child: CartItemWidget(item: item),
                    );
                  },
                ),
              ),
              
              // 结算栏
              _buildCheckoutBar(context, cart),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCheckoutBar(BuildContext context, CartProvider cart) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // 全选
            Row(
              children: [
                Checkbox(
                  value: cart.isAllSelected,
                  onChanged: (value) {
                    cart.toggleSelectAll(value ?? false);
                  },
                ),
                Text('全选'),
              ],
            ),
            
            Spacer(),
            
            // 总价
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '合计：',
                  style: TextStyle(color: Colors.grey),
                ),
                Text(
                  '¥${cart.selectedTotal.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            
            SizedBox(width: 16),
            
            // 结算按钮
            ElevatedButton(
              onPressed: cart.selectedItems.isEmpty
                  ? null
                  : () {
                      Navigator.pushNamed(context, '/checkout');
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              child: Text('结算 (${cart.selectedCount})'),
            ),
          ],
        ),
      ),
    );
  }
}

// 购物车项组件
class CartItemWidget extends StatelessWidget {
  final CartItem item;

  const CartItemWidget({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // 选择框
          Checkbox(
            value: item.isSelected,
            onChanged: (value) {
              Provider.of<CartProvider>(context, listen: false)
                  .toggleSelect(item.product.id, value ?? false);
            },
          ),
          
          // 商品图片
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              item.product.image,
              width: 80,
              height: 80,
              fit: BoxFit.cover,
            ),
          ),
          
          SizedBox(width: 12),
          
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 8),
                Text(
                  '¥${item.product.price}',
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                // 数量控制
                Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        if (item.quantity > 1) {
                          cart.updateQuantity(item.product.id, item.quantity - 1);
                        }
                      },
                      icon: Icon(Icons.remove_circle_outline),
                      iconSize: 20,
                    ),
                    Text('${item.quantity}'),
                    IconButton(
                      onPressed: () {
                        cart.updateQuantity(item.product.id, item.quantity + 1);
                      },
                      icon: Icon(Icons.add_circle_outline),
                      iconSize: 20,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

### 2.6 个人中心页面

```dart
// pages/profile/profile_page.dart
class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('我的'),
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, '/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 用户信息头部
            _buildUserHeader(context),
            
            SizedBox(height: 16),
            
            // 订单入口
            _buildOrderSection(context),
            
            SizedBox(height: 16),
            
            // 功能菜单
            _buildMenuSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildUserHeader(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, user, _) {
        return Container(
          padding: EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.blue, Colors.purple],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Row(
            children: [
              // 头像
              CircleAvatar(
                radius: 40,
                backgroundImage: user.avatar != null
                    ? NetworkImage(user.avatar!)
                    : AssetImage('assets/default_avatar.png') as ImageProvider,
                child: user.avatar == null
                    ? Icon(Icons.person, size: 40)
                    : null,
              ),
              
              SizedBox(width: 16),
              
              // 用户信息
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user.name ?? '点击登录',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      user.phone ?? '登录后享受更多服务',
                      style: TextStyle(color: Colors.white70),
                    ),
                  ],
                ),
              ),
              
              // VIP 标识
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.amber,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  'VIP',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOrderSection(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          ListTile(
            title: Text('我的订单'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('查看全部'),
                Icon(Icons.chevron_right),
              ],
            ),
            onTap: () => Navigator.pushNamed(context, '/orders'),
          ),
          Divider(height: 1),
          Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildOrderItem(Icons.receipt_long, '待付款', context),
                _buildOrderItem(Icons.local_shipping, '待发货', context),
                _buildOrderItem(Icons.directions_car, '待收货', context),
                _buildOrderItem(Icons.rate_review, '评价', context),
                _buildOrderItem(Icons.bug_report, '售后', context),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItem(IconData icon, String label, BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 28),
        SizedBox(height: 4),
        Text(label),
      ],
    );
  }

  Widget _buildMenuSection(BuildContext context) {
    final menuItems = [
      {'icon': Icons.favorite_border, 'label': '我的收藏', 'route': '/favorites'},
      {'icon': Icons.location_on, 'label': '收货地址', 'route': '/address'},
      {'icon': Icons.card_giftcard, 'label': '优惠券', 'route': '/coupon'},
      {'icon': Icons.account_balance_wallet, 'label': '钱包', 'route': '/wallet'},
      {'icon': Icons.customer_service, 'label': '客服中心', 'route': '/service'},
      {'icon': Icons.info_outline, 'label': '关于我们', 'route': '/about'},
    ];

    return Container(
      color: Colors.white,
      child: Column(
        children: menuItems.map((item) {
          return ListTile(
            leading: Icon(item['icon'] as IconData),
            title: Text(item['label'] as String),
            trailing: Icon(Icons.chevron_right),
            onTap: () => Navigator.pushNamed(context, item['route'] as String),
          );
        }).toList(),
      ),
    );
  }
}
```

## 3. 性能优化

### 3.1 图片缓存

```dart
// 使用 cached_network_image
dependencies:
  cached_network_image: ^3.0.0

// 使用
CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
  memCacheWidth: 400, // 内存缓存宽度
)
```

### 3.2 列表优化

```dart
// 使用 const 组件
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return const ListTile(
      title: Text('静态文本'),
    );
  },
)

// 避免在列表中创建新对象
final _items = List.generate(100, (index) => Item('Item $index'));

ListView.builder(
  itemCount: _items.length,
  itemBuilder: (context, index) {
    return ItemWidget(item: _items[index]); // 不要在这里创建新对象
  },
)
```

### 3.3 懒加载

```dart
// 延迟加载大图片
Image.network(
  imageUrl,
  frameBuilder: (context, child, frame, loaded) {
    if (loaded) return child;
    return CircularProgressIndicator();
  },
)

// 分页加载
ListView.builder(
  itemCount: items.length + 1,
  itemBuilder: (context, index) {
    if (index == items.length) {
      _loadMore(); // 触发加载更多
      return CircularProgressIndicator();
    }
    return ItemWidget(item: items[index]);
  },
)
```

## 💡 小结

- 掌握完整的电商 APP 架构设计
- 学会实现常见的功能模块
- 理解性能优化的重要性
- 能够独立开发完整的 Flutter 应用
- 持续学习，关注 Flutter 生态发展

## 🎉 恭喜完成入门教程！

你已经完成了 Flutter 入门到实战的所有教程。接下来建议：

1. **多做项目实践**: 理论结合实践，动手做自己的项目
2. **阅读优秀源码**: 学习 GitHub 上的开源项目
3. **关注官方动态**: 跟进 Flutter 最新版本和特性
4. **参与社区讨论**: 加入 Flutter 开发者社区，交流经验

祝你 Flutter学习之旅顺利！🚀
