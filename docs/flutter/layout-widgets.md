# Flutter 布局组件 - 掌握各种布局方式 📐

## 1. 布局基础概念

### 1.1 约束 (Constraints)

Flutter 的布局遵循**约束传递模型**：

```
父级 → 子级：传递约束（最小/最大宽高）
子级 → 父级：返回尺寸
父级 → 子级：设置位置
```

### 1.2 布局三要素

```dart
// 1. 尺寸
width: 200
height: 100
constraints: BoxConstraints(maxWidth: 300)

// 2. 间距
padding: EdgeInsets.all(16)      // 内边距
margin: EdgeInsets.all(8)        // 外边距

// 3. 对齐
alignment: Alignment.center
mainAxisAlignment: MainAxisAlignment.spaceEvenly
```

## 2. 基础布局组件

### 2.1 Container - 全能容器

```dart
Container(
  // 尺寸
  width: double.infinity,  // 占满宽度
  height: 200,
  constraints: BoxConstraints(
    minWidth: 100,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 400,
  ),
  
  // 间距
  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  margin: EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
  
  // 对齐
  alignment: Alignment.center,
  
  // 装饰
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Colors.grey, width: 1),
    boxShadow: [
      BoxShadow(
        color: Colors.black12,
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  ),
  
  // 变换
  transform: Matrix4.rotationZ(0.1),
  
  child: Text('内容'),
)
```

### 2.2 SizedBox - 定高宽

```dart
// 固定尺寸
SizedBox(
  width: 200,
  height: 100,
  child: Child(),
)

// 无限尺寸
SizedBox(
  width: double.infinity,
  child: Child(),
)

// 仅高度
SizedBox(
  height: 200,
  child: Child(),
)

// 间距用途
Row(
  children: [
    Text('标题'),
    SizedBox(width: 16),  // 水平间距
    Text('内容'),
    SizedBox(height: 8),  // 垂直间距
  ],
)
```

### 2.3 Padding - 内边距

```dart
Padding(
  padding: EdgeInsets.only(
    left: 16,
    top: 8,
    right: 16,
    bottom: 8,
  ),
  child: Child(),
)

// 常用简写
padding: EdgeInsets.all(16)              // 四边相同
padding: EdgeInsets.symmetric(           // 对称
  horizontal: 16,
  vertical: 8,
)
```

### 2.4 ConstrainedBox - 约束盒子

```dart
// 基本用法
ConstrainedBox(
  constraints: BoxConstraints(
    minWidth: 100,
    maxWidth: 300,
    minHeight: 50,
    maxHeight: 200,
  ),
  child: Container(color: Colors.blue),
)

// 常见场景 1: 限制最大宽度（响应式设计）
ConstrainedBox(
  constraints: BoxConstraints(maxWidth: 600),
  child: Center(
    child: Text('内容居中，最大宽度 600'),
  ),
)

// 常见场景 2: 最小高度保证
ConstrainedBox(
  constraints: BoxConstraints(minHeight: 200),
  child: ListView(
    children: [
      // 即使内容很少，也至少占用 200px 高度
      Text('短内容'),
    ],
  ),
)

// 常见场景 3: 宽高比约束
ConstrainedBox(
  constraints: BoxConstraints.tightFor(
    width: 200,
    height: 200,
  ),
  child: Image.network('https://example.com/image.jpg'),
)

// 常见场景 4: 仅限制宽度
ConstrainedBox(
  constraints: BoxConstraints(
    maxWidth: double.infinity,  // 不限制最大宽度
    minWidth: 100,               // 最小宽度 100
  ),
  child: Text('自适应宽度，但不少于 100px'),
)

// 常见场景 5: 组合约束
Column(
  children: [
    ConstrainedBox(
      constraints: BoxConstraints(
        minHeight: 100,
        maxHeight: 300,
      ),
      child: SingleChildScrollView(
        child: Text('可滚动内容，高度在 100-300 之间'),
      ),
    ),
  ],
)
```

**BoxConstraints 工厂方法：**

```dart
// 1. 宽松约束（允许任何尺寸）
BoxConstraints.loose(Size(200, 100))
// 等价于：minWidth: 0, maxWidth: 200, minHeight: 0, maxHeight: 100

// 2. 紧密约束（强制指定尺寸）
BoxConstraints.tight(Size(200, 100))
// 等价于：minWidth: 200, maxWidth: 200, minHeight: 100, maxHeight: 100

// 3. 展开约束（填满可用空间）
BoxConstraints.expand()
// 等价于：minWidth: double.infinity, maxWidth: double.infinity, 
//          minHeight: double.infinity, maxHeight: double.infinity

BoxConstraints.expand(width: 200, height: 100)
// 等价于：minWidth: 200, maxWidth: 200, minHeight: 100, maxHeight: 100

// 4. 自定义约束
BoxConstraints(
  minWidth: 50,
  maxWidth: 200,
  minHeight: 30,
  maxHeight: 150,
)
```

**ConstrainedBox vs Container 的 constraints：**

```dart
// ✅ 推荐：简单约束使用 ConstrainedBox
ConstrainedBox(
  constraints: BoxConstraints(maxWidth: 300),
  child: Text('内容'),
)

// ✅ 推荐：需要装饰、间距等使用 Container
Container(
  constraints: BoxConstraints(maxWidth: 300),
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(color: Colors.white),
  child: Text('内容'),
)

// ❌ 避免：仅为了约束而使用 Container
Container(
  constraints: BoxConstraints(maxWidth: 300),
  child: Text('内容'),
)
```

**实战示例：响应式卡片布局**

```dart
ConstrainedBox(
  constraints: BoxConstraints(maxWidth: 400),
  child: Card(
    child: Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '标题',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text('内容会自动换行，卡片最大宽度为 400px'),
        ],
      ),
    ),
  ),
)
```

## 3. 线性布局

### 3.1 Row - 水平排列

```dart
Row(
  // 主轴（水平方向）对齐
  mainAxisAlignment: MainAxisAlignment.start,     // 左对齐（默认）
  mainAxisAlignment: MainAxisAlignment.end,       // 右对齐
  mainAxisAlignment: MainAxisAlignment.center,    // 居中
  mainAxisAlignment: MainAxisAlignment.spaceBetween, // 两端对齐，中间等距
  mainAxisAlignment: MainAxisAlignment.spaceAround,  // 两端留一半间距
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,  // 所有间距相等
  
  // 交叉轴（垂直方向）对齐
  crossAxisAlignment: CrossAxisAlignment.start,    // 顶部对齐
  crossAxisAlignment: CrossAxisAlignment.end,      // 底部对齐
  crossAxisAlignment: CrossAxisAlignment.center,   // 居中
  crossAxisAlignment: CrossAxisAlignment.stretch,  // 拉伸填满（默认）
  crossAxisAlignment: CrossAxisAlignment.baseline, // 基线对齐（需要 textBaseline）
  
  // 文本基线（当使用 baseline 时）
  textBaseline: TextBaseline.alphabetic,
  
  // 子组件
  children: [
    Widget1(),
    Widget2(),
    Widget3(),
  ],
)
```

### 3.2 Column - 垂直排列

```dart
Column(
  // 主轴（垂直方向）对齐
  mainAxisAlignment: MainAxisAlignment.start,     // 顶部对齐
  
  // 交叉轴（水平方向）对齐
  crossAxisAlignment: CrossAxisAlignment.start,   // 左对齐
  
  // 子组件
  children: [
    Text('标题', style: TextStyle(fontSize: 20)),
    SizedBox(height: 8),
    Text('内容'),
  ],
)
```

### 3.3 Expanded & Flexible - 弹性布局

```dart
Row(
  children: [
    // Expanded - 强制填充剩余空间
    Expanded(
      flex: 2,  // 占用 2 份
      child: Container(color: Colors.red),
    ),
    
    // Flexible - 可压缩可扩展
    Flexible(
      flex: 1,  // 占用 1 份
      fit: FlexFit.loose,  // 不强制填满
      child: Container(color: Colors.blue),
    ),
    
    // 固定宽度
    Container(
      width: 100,
      color: Colors.green,
    ),
  ],
)

// 实际效果：假设总宽度 400
// Expanded: 200px (2 份)
// Flexible: 100px (1 份，如果内容小于 100)
// Fixed: 100px
```

### 3.4 Spacer - 弹性间隔

```dart
Row(
  children: [
    Text('左侧'),
    Spacer(),  // 自动填充剩余空间
    Text('右侧'),
  ],
)

// 等同于
Row(
  children: [
    Text('左侧'),
    Expanded(child: Container()),
    Text('右侧'),
  ],
)

// 自定义比例
Row(
  children: [
    Text('左'),
    Spacer(flex: 2),  // 2 份空间
    Text('中'),
    Spacer(flex: 1),  // 1 份空间
    Text('右'),
  ],
)
```

## 4. 层叠布局

### 4.1 Stack - 堆叠

```dart
Stack(
  // 定位方式
  clipBehavior: Clip.none,  // 允许超出裁剪
  
  // 对齐
  alignment: Alignment.center,  // 子组件居中对齐
  
  children: [
    // 底层 - 背景图
    Image.network('https://example.com/bg.jpg'),
    
    // 中层 - 内容
    Padding(
      padding: EdgeInsets.all(16),
      child: Text('叠加内容'),
    ),
    
    // 顶层 - 角标
    Positioned(
      top: 0,
      right: 0,
      child: Container(
        padding: EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(8),
          ),
        ),
        child: Text('NEW', style: TextStyle(color: Colors.white)),
      ),
    ),
  ],
)
```

### 4.2 Positioned - 绝对定位

```dart
Stack(
  children: [
    Container(width: 300, height: 200, color: Colors.grey),
    
    // 左上角
    Positioned(
      left: 0,
      top: 0,
      child: Text('左上'),
    ),
    
    // 右上角
    Positioned(
      right: 0,
      top: 0,
      child: Text('右上'),
    ),
    
    // 左下角
    Positioned(
      left: 0,
      bottom: 0,
      child: Text('左下'),
    ),
    
    // 右下角
    Positioned(
      right: 0,
      bottom: 0,
      child: Text('右下'),
    ),
    
    // 居中
    Positioned.fill(  // 填满整个 Stack
      child: Center(
        child: Text('居中'),
      ),
    ),
  ],
)
```

### 4.3 IndexedStack - 索引堆叠

```dart
// 只显示指定索引的子组件，其他隐藏但保持状态
IndexedStack(
  index: _currentIndex,  // 当前显示的索引
  children: [
    HomePage(),    // index: 0
    SearchPage(),  // index: 1
    ProfilePage(), // index: 2
  ],
)

// 常用于底部导航栏切换页面
BottomNavigationBar(
  currentIndex: _currentIndex,
  onTap: (index) {
    setState(() => _currentIndex = index);
  },
  items: [
    BottomNavigationBarItem(icon: Icon(Icons.home), label: '首页'),
    BottomNavigationBarItem(icon: Icon(Icons.search), label: '搜索'),
    BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
  ],
)
```

## 5. 滚动布局

### 5.1 ListView - 列表

```dart
// 1. 普通列表
ListView(
  scrollDirection: Axis.vertical,  // 滚动方向
  padding: EdgeInsets.all(8),
  children: [
    ListTile(title: Text('项目 1')),
    ListTile(title: Text('项目 2')),
    ListTile(title: Text('项目 3')),
  ],
)

// 2. 动态列表（性能更好）
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index]),
    );
  },
)

// 3. 分离式列表（可添加分割线）
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (context, index) => Divider(),
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index]));
  },
)

// 4. 水平列表
ListView(
  scrollDirection: Axis.horizontal,
  children: [
    Container(width: 100, color: Colors.red),
    Container(width: 100, color: Colors.blue),
    Container(width: 100, color: Colors.green),
  ],
)
```

### 5.2 GridView - 网格

```dart
// 1. 计数网格
GridView.count(
  crossAxisCount: 3,  // 列数
  mainAxisSpacing: 8, // 主轴间距
  crossAxisSpacing: 8, // 交叉轴间距
  childAspectRatio: 1, // 子组件宽高比
  children: [
    Container(color: Colors.red),
    Container(color: Colors.blue),
    Container(color: Colors.green),
  ],
)

// 2. 动态网格
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    mainAxisSpacing: 16,
    crossAxisSpacing: 16,
    childAspectRatio: 16 / 9,
  ),
  itemCount: items.length,
  itemBuilder: (context, index) {
    return Card(child: Center(child: Text('Item $index')));
  },
)

// 3. 自适应网格
GridView.extent(
  maxCrossAxisExtent: 200,  // 子组件最大宽度
  children: [...],
)
```

### 5.3 SingleChildScrollView - 单区域滚动

```dart
SingleChildScrollView(
  scrollDirection: Axis.vertical,
  padding: EdgeInsets.all(16),
  child: Column(
    children: [
      // 长表单、长内容等
      ...formFields,
    ],
  ),
)

// 避免键盘遮挡
SingleChildScrollView(
  reverse: true,  // 从底部开始
  child: Column(
    children: [
      // 内容
    ],
  ),
)
```

## 6. 对齐与定位

### 6.1 Align - 对齐

```dart
Align(
  alignment: Alignment.topLeft,     // 左上
  alignment: Alignment.topCenter,   // 上中
  alignment: Alignment.topRight,    // 右上
  alignment: Alignment.centerLeft,  // 左中
  alignment: Alignment.center,      // 正中
  alignment: Alignment.centerRight, // 右中
  alignment: Alignment.bottomLeft,  // 左下
  alignment: Alignment.bottomCenter,// 下中
  alignment: Alignment.bottomRight, // 右下
  
  // 自定义坐标 (-1, -1) 到 (1, 1)
  alignment: Alignment(0.5, 0.5),   // 偏右下
  
  child: Text('对齐内容'),
)
```

### 6.2 Center - 居中

```dart
// Center 是 Align 的特例
Center(
  child: Text('居中内容'),
)

// 等同于
Align(
  alignment: Alignment.center,
  child: Text('居中内容'),
)
```

## 7. 响应式布局

### 7.1 LayoutBuilder - 根据父级约束布局

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      // 平板/桌面布局
      return Row(children: [...]);
    } else {
      // 手机布局
      return Column(children: [...]);
    }
  },
)
```

### 7.2 MediaQuery - 获取屏幕信息

```dart
// 获取屏幕尺寸
final screenWidth = MediaQuery.of(context).size.width;
final screenHeight = MediaQuery.of(context).size.height;

// 获取设备像素比
final pixelRatio = MediaQuery.of(context).devicePixelRatio;

// 获取安全区域（避开刘海屏、底部横条等）
final safeAreaTop = MediaQuery.of(context).padding.top;
final safeAreaBottom = MediaQuery.of(context).padding.bottom;

// 使用示例
Container(
  width: screenWidth * 0.5,  // 屏幕宽度的一半
  height: screenHeight - 200,
)

// SafeArea - 安全区域
SafeArea(
  child: Scaffold(...),
)
```

### 7.3 FittedBox - 自适应缩放

```dart
FittedBox(
  fit: BoxFit.contain,  // 保持比例适应
  fit: BoxFit.cover,    // 填满裁剪
  fit: BoxFit.fill,     // 拉伸填满
  child: Text('超大文字', style: TextStyle(fontSize: 100)),
)
```

## 8. 实战案例

### 8.1 商品卡片布局

```dart
Card(
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // 商品图片
      AspectRatio(
        aspectRatio: 16 / 9,
        child: Image.network(
          'https://example.com/product.jpg',
          fit: BoxFit.cover,
        ),
      ),
      
      // 商品信息
      Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '商品名称',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Text(
                  '¥199',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Spacer(),
                IconButton(
                  icon: Icon(Icons.favorite_border),
                  onPressed: () {},
                ),
              ],
            ),
          ],
        ),
      ),
    ],
  ),
)
```

### 8.2 个人中心布局

```dart
Column(
  children: [
    // 头部用户信息
    Container(
      padding: EdgeInsets.fromLTRB(16, 40, 16, 24),
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundImage: NetworkImage(avatarUrl),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  userName,
                  style: TextStyle(
                    fontSize: 20,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  userBio,
                  style: TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
    
    // 功能菜单
    Expanded(
      child: ListView(
        children: [
          _buildMenuItem(Icons.shopping_bag, '我的订单'),
          _buildMenuItem(Icons.favorite, '我的收藏'),
          _buildMenuItem(Icons.location_on, '收货地址'),
          _buildMenuItem(Icons.settings, '设置'),
        ],
      ),
    ),
  ],
)

Widget _buildMenuItem(IconData icon, String title) {
  return ListTile(
    leading: Icon(icon, color: Colors.blue),
    title: Text(title),
    trailing: Icon(Icons.chevron_right),
    onTap: () {},
  );
}
```

### 8.3 登录表单布局

```dart
SingleChildScrollView(
  padding: EdgeInsets.all(24),
  child: Column(
    children: [
      SizedBox(height: 60),
      
      // Logo
      FlutterLogo(size: 80),
      
      SizedBox(height: 40),
      
      // 标题
      Text(
        '欢迎登录',
        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      ),
      
      SizedBox(height: 40),
      
      // 邮箱输入框
      TextField(
        decoration: InputDecoration(
          labelText: '邮箱',
          prefixIcon: Icon(Icons.email),
          border: OutlineInputBorder(),
        ),
      ),
      
      SizedBox(height: 16),
      
      // 密码输入框
      TextField(
        obscureText: true,
        decoration: InputDecoration(
          labelText: '密码',
          prefixIcon: Icon(Icons.lock),
          border: OutlineInputBorder(),
        ),
      ),
      
      SizedBox(height: 24),
      
      // 登录按钮
      SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            padding: EdgeInsets.symmetric(vertical: 16),
          ),
          child: Text('登录', style: TextStyle(fontSize: 16)),
        ),
      ),
      
      SizedBox(height: 16),
      
      // 注册链接
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('还没有账号？'),
          TextButton(
            onPressed: () {},
            child: Text('立即注册'),
          ),
        ],
      ),
    ],
  ),
)
```

## 9. 布局调试技巧

### 9.1 使用调试工具

```dart
// 显示尺寸调试信息
debugPaintSizeEnabled = true;

// 在 Debug 模式下查看布局边界
MaterialApp(
  debugShowMaterialGrid: true,  // 显示网格
  home: ...
)
```

### 9.2 常见布局问题

**问题 1: 溢出错误 (Overflow)**

```dart
// ❌ 错误：Row 内子组件超出屏幕
Row(
  children: [
    Text('很长的文本很长的文本...'),
  ],
)

// ✅ 解决：使用 Expanded 或 Flexible
Row(
  children: [
    Expanded(
      child: Text(
        '很长的文本...',
        overflow: TextOverflow.ellipsis,
      ),
    ),
  ],
)
```

**问题 2: 无限高度/宽度**

```dart
// ❌ 错误：ListView 在 Column 中没有约束
Column(
  children: [
    ListView(...),  // 会报错
  ],
)

// ✅ 解决：使用 Expanded 或设置高度
Column(
  children: [
    Expanded(
      child: ListView(...),
    ),
  ],
)
```

## 💡 小结

- 理解 Flutter 的约束传递模型
- 掌握常用布局组件的使用场景
- 学会组合不同的布局方式
- 注意性能和响应式设计
- 多实践，多做布局练习

下一步：[Material Design](material-design.md) → 学习 Material 风格组件
