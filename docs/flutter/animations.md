# Flutter 动画系统完全指南 🎬

## 1. Animation Controller - 动画控制器

### 1.1 基本概念

`AnimationController` 是 Flutter 动画系统的核心，用于控制动画的播放、暂停、停止等。

```dart
class _MyWidgetState extends State<MyWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this, // 提供 Ticker
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

### 1.2 核心属性

```dart
AnimationController(
  duration: Duration(milliseconds: 500), // 动画时长
  reverseDuration: Duration(milliseconds: 300), // 反向时长
  value: 0.0, // 初始值 (0.0 - 1.0)
  lowerBound: 0.0, // 下界
  upperBound: 1.0, // 上界
  animationBehavior: AnimationBehavior.normal, // 动画行为
  vsync: this, // Ticker 提供者
)
```

### 1.3 常用方法

```dart
// 播放动画（从当前值到 upperBound）
_controller.forward();

// 反向播放（从当前值到 lowerBound）
_controller.reverse();

// 从起始到结束播放
_controller.forward(from: 0.0);

// 重复播放
_controller.repeat();

// 往复播放
_controller.repeat(reverse: true);

// 停止动画
_controller.stop();

// 重置到初始值
_controller.reset();

// 设置特定值（带动画）
_controller.animateTo(0.5, duration: Duration(milliseconds: 300));

// 驱动到目标值
_controller.animateBack(0.0);
```

### 1.4 监听器

```dart
// 添加状态监听器
_controller.addStatusListener((status) {
  switch (status) {
    case AnimationStatus.dismissed:
      print('动画已重置');
      break;
    case AnimationStatus.forward:
      print('正在正向播放');
      break;
    case AnimationStatus.reverse:
      print('正在反向播放');
      break;
    case AnimationStatus.completed:
      print('动画完成');
      _controller.reverse(); // 完成后反向
      break;
  }
});

// 添加值变化监听器
_controller.addListener(() {
  print('当前值: ${_controller.value}');
  setState(() {}); // 触发重建
});
```

### 1.5 完整示例：缩放动画

```dart
class ScaleAnimationDemo extends StatefulWidget {
  @override
  _ScaleAnimationDemoState createState() => _ScaleAnimationDemoState();
}

class _ScaleAnimationDemoState extends State<ScaleAnimationDemo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 1000),
      vsync: this,
    );

    // 创建 Tween 并绑定 controller
    _animation = Tween<double>(begin: 1.0, end: 1.5).animate(_controller)
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          _controller.reverse();
        } else if (status == AnimationStatus.dismissed) {
          _controller.forward();
        }
      });

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          return Transform.scale(
            scale: _animation.value,
            child: Container(
              width: 200,
              height: 200,
              color: Colors.blue,
              child: Icon(Icons.star, size: 100, color: Colors.white),
            ),
          );
        },
      ),
    );
  }
}
```

## 2. Animated Builder - 动画构建器

### 2.1 基本用法

`AnimatedBuilder` 用于构建由动画驱动的 Widget。

```dart
AnimatedBuilder(
  animation: _animation, // 要监听的动画
  builder: (BuildContext context, Widget? child) {
    // 当动画值改变时重建
    return Transform.rotate(
      angle: _animation.value * 2 * pi,
      child: child,
    );
  },
  child: MyStaticWidget(), // 不参与动画的部分
)
```

### 2.2 性能优化：child 参数

```dart
// ✅ 正确：静态部分放在 child 中，避免重复构建
AnimatedBuilder(
  animation: _controller,
  child: Container(
    width: 200,
    height: 200,
    color: Colors.red,
  ),
  builder: (context, child) {
    return Transform.rotate(
      angle: _controller.value * 2 * 3.14159,
      child: child, // 复用同一个实例
    );
  },
)

// ❌ 错误：每次都重建静态部分
AnimatedBuilder(
  animation: _controller,
  builder: (context, child) {
    return Transform.rotate(
      angle: _controller.value * 2 * 3.14159,
      child: Container( // 每帧都重建！
        width: 200,
        height: 200,
        color: Colors.red,
      ),
    );
  },
)
```

### 2.3 多个动画组合

```dart
class ComplexAnimation extends StatefulWidget {
  @override
  _ComplexAnimationState createState() => _ComplexAnimationState();
}

class _ComplexAnimationState extends State<ComplexAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  late Animation<Color?> _colorAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    // 缩放动画
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.5).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    // 旋转动画
    _rotationAnimation = Tween<double>(begin: 0.0, end: 2 * pi).animate(
      CurvedAnimation(parent: _controller, curve: Curves.linear),
    );

    // 颜色动画
    _colorAnimation = ColorTween(begin: Colors.blue, end: Colors.red).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _controller.repeat(reverse: true);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Transform.rotate(
              angle: _rotationAnimation.value,
              child: Container(
                width: 150,
                height: 150,
                color: _colorAnimation.value,
                child: Icon(Icons.favorite, size: 80, color: Colors.white),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

## 3. Animated Widget - 动画组件

### 3.1 自定义 AnimatedWidget

继承 `AnimatedWidget` 创建可复用的动画组件：

```dart
class RotatingWidget extends AnimatedWidget {
  const RotatingWidget({
    Key? key,
    required Animation<double> animation,
  }) : super(key: key, listenable: animation);

  @override
  Widget build(BuildContext context) {
    final animation = listenable as Animation<double>;
    return Transform.rotate(
      angle: animation.value * 2 * pi,
      child: Container(
        width: 100,
        height: 100,
        color: Colors.green,
      ),
    );
  }
}

// 使用
class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    )..repeat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: RotatingWidget(animation: _controller),
      ),
    );
  }
}
```

### 3.2 内置 AnimatedWidget 组件

Flutter 提供了许多内置的动画组件：

#### AnimatedContainer

```dart
class AnimatedContainerDemo extends StatefulWidget {
  @override
  _AnimatedContainerDemoState createState() => _AnimatedContainerDemoState();
}

class _AnimatedContainerDemoState extends State<AnimatedContainerDemo> {
  double _width = 100;
  double _height = 100;
  Color _color = Colors.blue;
  BorderRadiusGeometry _borderRadius = BorderRadius.circular(8);

  void _animate() {
    setState(() {
      _width = _width == 100 ? 200 : 100;
      _height = _height == 100 ? 200 : 100;
      _color = _color == Colors.blue ? Colors.red : Colors.blue;
      _borderRadius = _borderRadius == BorderRadius.circular(8)
          ? BorderRadius.circular(50)
          : BorderRadius.circular(8);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        AnimatedContainer(
          width: _width,
          height: _height,
          decoration: BoxDecoration(
            color: _color,
            borderRadius: _borderRadius,
          ),
          duration: Duration(seconds: 1),
          curve: Curves.easeInOut,
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: _animate,
          child: Text('Animate'),
        ),
      ],
    );
  }
}
```

#### AnimatedOpacity

```dart
AnimatedOpacity(
  opacity: _visible ? 1.0 : 0.0,
  duration: Duration(milliseconds: 500),
  child: Container(
    width: 200,
    height: 200,
    color: Colors.blue,
  ),
)

// 控制显隐
void toggleVisibility() {
  setState(() {
    _visible = !_visible;
  });
}
```

#### AnimatedPadding

```dart
AnimatedPadding(
  padding: EdgeInsets.all(_expanded ? 32.0 : 8.0),
  duration: Duration(seconds: 1),
  curve: Curves.easeInOut,
  child: Container(
    color: Colors.blue,
    child: Text('Animated Padding'),
  ),
)
```

#### AnimatedAlign

```dart
AnimatedAlign(
  alignment: _aligned ? Alignment.topRight : Alignment.bottomLeft,
  duration: Duration(seconds: 1),
  curve: Curves.fastOutSlowIn,
  child: Container(
    width: 50,
    height: 50,
    color: Colors.red,
  ),
)
```

#### AnimatedDefaultTextStyle

```dart
AnimatedDefaultTextStyle(
  style: TextStyle(
    fontSize: _large ? 36 : 24,
    color: _large ? Colors.blue : Colors.red,
    fontWeight: FontWeight.bold,
  ),
  duration: Duration(milliseconds: 300),
  child: Text('Animated Text'),
)
```

### 3.3 ImplicitlyAnimatedWidget 与 ExplicitlyAnimatedWidget

**隐式动画 (Implicit)**：
- 自动处理 AnimationController
- 只需提供新值和 duration
- 例如：`AnimatedContainer`, `AnimatedOpacity`

**显式动画 (Explicit)**：
- 手动控制 AnimationController
- 更精细的控制
- 例如：使用 `AnimationController` + `AnimatedBuilder`

## 4. Curved Animation - 曲线动画

### 4.1 内置曲线

```dart
CurvedAnimation(
  parent: _controller,
  curve: Curves.easeInOut, // 应用曲线
)

// 常用曲线类型：
// Curves.linear - 线性
// Curves.easeIn - 渐入
// Curves.easeOut - 渐出
// Curves.easeInOut - 渐入渐出
// Curves.bounceOut - 弹跳效果
// Curves.elasticOut - 弹性效果
// Curves.decelerate - 减速
// Curves.fastOutSlowIn - 先快后慢（Material 标准）
```

### 4.2 进出曲线分离

```dart
CurvedAnimation(
  parent: _controller,
  // 正向播放时使用的曲线
  curve: Curves.easeIn,
  // 反向播放时使用的曲线
  reverseCurve: Curves.easeOut,
)
```

### 4.3 自定义曲线

```dart
class CustomCurve extends Curve {
  @override
  double transformInternal(double t) {
    // t 范围是 0.0 到 1.0
    // 返回值也应该是 0.0 到 1.0
    return sin(t * pi / 2); // 正弦曲线
  }
}

// 使用自定义曲线
CurvedAnimation(
  parent: _controller,
  curve: CustomCurve(),
)
```

### 4.4 Interval 分段控制

```dart
// 将动画分成多个阶段
AnimationController _controller = AnimationController(
  duration: Duration(seconds: 3),
  vsync: this,
);

// 第一阶段：0% - 33%
Animation<double> _opacity = Tween(begin: 0.0, end: 1.0).animate(
  CurvedAnimation(
    parent: _controller,
    curve: Interval(0.0, 0.33, curve: Curves.easeInOut),
  ),
);

// 第二阶段：33% - 66%
Animation<double> _size = Tween(begin: 50.0, end: 150.0).animate(
  CurvedAnimation(
    parent: _controller,
    curve: Interval(0.33, 0.66, curve: Curves.elasticOut),
  ),
);

// 第三阶段：66% - 100%
Animation<double> _rotation = Tween(begin: 0.0, end: 2*pi).animate(
  CurvedAnimation(
    parent: _controller,
    curve: Interval(0.66, 1.0, curve: Curves.easeInOut),
  ),
);
```

### 4.5 完整示例：复杂曲线动画

```dart
class CurvedAnimationDemo extends StatefulWidget {
  @override
  _CurvedAnimationDemoState createState() => _CurvedAnimationDemoState();
}

class _CurvedAnimationDemoState extends State<CurvedAnimationDemo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _bounceAnimation;
  late Animation<double> _elasticAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    // 弹跳曲线
    _bounceAnimation = Tween<double>(begin: 0, end: 300).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.bounceOut,
      ),
    );

    // 弹性曲线
    _elasticAnimation = Tween<double>(begin: 50, end: 150).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );
  }

  void _startAnimation() {
    _controller.reset();
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // 弹跳动画
        AnimatedBuilder(
          animation: _bounceAnimation,
          builder: (context, child) {
            return Container(
              margin: EdgeInsets.only(top: _bounceAnimation.value),
              width: 60,
              height: 60,
              color: Colors.orange,
              shape: BoxShape.circle,
            );
          },
        ),

        // 弹性动画
        AnimatedBuilder(
          animation: _elasticAnimation,
          builder: (context, child) {
            return Container(
              width: _elasticAnimation.value,
              height: _elasticAnimation.value,
              color: Colors.purple,
            );
          },
        ),

        ElevatedButton(
          onPressed: _startAnimation,
          child: Text('Start Animation'),
        ),
      ],
    );
  }
}
```

## 5. Hero 动画 - 页面转场英雄动画

### 5.1 基本 Hero 动画

Hero 动画用于在页面切换时实现共享元素的转场效果。

```dart
// 第一个页面
class PageA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => PageB()),
        );
      },
      child: Hero(
        tag: 'image-hero', // 必须唯一
        child: Image.network(
          'https://example.com/image.jpg',
          width: 100,
          height: 100,
        ),
      ),
    );
  }
}

// 第二个页面
class PageB extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Detail Page')),
      body: Center(
        child: Hero(
          tag: 'image-hero', // 相同的 tag
          child: Image.network(
            'https://example.com/image.jpg',
            width: 300,
            height: 300,
          ),
        ),
      ),
    );
  }
}
```

### 5.2 Hero 的属性

```dart
Hero(
  tag: 'unique-tag', // 唯一标识符（必需）
  child: MyWidget(),

  // 可选属性
  createRectTween: (begin, end) => MaterialRectCenterArcTween( // 自定义路径
    begin: begin,
    end: end,
  ),
  flightShuttleBuilder: (flightContext, animation, flightDirection,
      fromHeroContext, toHeroContext) { // 自定义飞行中的 widget
    return Icon(Icons.star, size: 50);
  },
  placeholderBuilder: (context, heroSize, child) { // 占位符
    return Opacity(opacity: 0.5, child: child);
  },
  transitionOnUserGestures: true, // 用户手势触发时是否执行动画
)
```

### 5.3 Hero 动画的占位符

```dart
Hero(
  tag: 'avatar',
  placeholderBuilder: (context, size, child) {
    // 在 Hero 动画执行期间显示的占位符
    return Container(
      width: size.width,
      height: size.height,
      color: Colors.grey[300],
      child: CircularProgressIndicator(),
    );
  },
  child: CircleAvatar(
    backgroundImage: NetworkImage(url),
  ),
)
```

### 5.4 自定义 Hero 动画路径

```dart
class RadialHero extends StatelessWidget {
  final String tag;
  final Widget child;
  final double? maxRadius;

  const RadialHero({
    Key? key,
    required this.tag,
    required this.child,
    this.maxRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: tag,
      createRectTween: (begin, end) {
        return MaterialRectCenterArcTween(begin: begin, end: end);
      },
      flightShuttleBuilder: (flightContext, animation, direction,
          fromContext, toContext) {
        final radiusAnimation = Tween<double>(
          begin: 0.0,
          end: maxRadius ?? MediaQuery.of(flightContext).size.longestSide * 0.6,
        ).animate(CurvedAnimation(
          parent: animation,
          curve: Curves.easeOut,
        ));

        return AnimatedBuilder(
          animation: radiusAnimation,
          builder: (context, _) {
            return ClipOval(
              child: SizedBox.fromSize(
                size: Size.fromRadius(radiusAnimation.value),
                child: child,
              ),
            );
          },
        );
      },
      child: child,
    );
  }
}
```

### 5.5 多个 Hero 动画

```dart
class ListPage extends StatelessWidget {
  final List<String> images = [
    'url1', 'url2', 'url3'
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: images.length,
      itemBuilder: (context, index) {
        return ListTile(
          leading: Hero(
            tag: 'image-$index', // 每个 item 有唯一的 tag
            child: CircleAvatar(
              backgroundImage: NetworkImage(images[index]),
            ),
          ),
          title: Text('Item $index'),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => DetailPage(imageIndex: index),
              ),
            );
          },
        );
      },
    );
  }
}

class DetailPage extends StatelessWidget {
  final int imageIndex;

  const DetailPage({Key? key, required this.imageIndex}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Detail')),
      body: Center(
        child: Hero(
          tag: 'image-$imageIndex', // 匹配对应的 tag
          child: Image.network(images[imageIndex]),
        ),
      ),
    );
  }
}
```

## 6. Opacity 动画 - 透明度动画

### 6.1 AnimatedOpacity

最简单的透明度动画方式：

```dart
class FadeDemo extends StatefulWidget {
  @override
  _FadeDemoState createState() => _FadeDemoState();
}

class _FadeDemoState extends State<FadeDemo> {
  bool _visible = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        AnimatedOpacity(
          opacity: _visible ? 1.0 : 0.0,
          duration: Duration(milliseconds: 500),
          curve: Curves.easeInOut,
          child: Container(
            width: 200,
            height: 200,
            color: Colors.deepPurple,
          ),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          child: Text('Toggle Fade'),
          onPressed: () {
            setState(() {
              _visible = !_visible;
            });
          },
        ),
      ],
    );
  }
}
```

### 6.2 使用 AnimationController + Opacity

更精细的控制：

```dart
class CustomFadeAnimation extends StatefulWidget {
  @override
  _CustomFadeAnimationState createState() => _CustomFadeAnimationState();
}

class _CustomFadeAnimationState extends State<CustomFadeAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(_controller);

    _controller.repeat(reverse: true); // 循环淡入淡出
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _opacityAnimation,
        builder: (context, child) {
          return Opacity(
            opacity: _opacityAnimation.value,
            child: Container(
              width: 200,
              height: 200,
              color: Colors.teal,
              child: Center(
                child: Text(
                  'Fading Text',
                  style: TextStyle(fontSize: 24, color: Colors.white),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

### 6.3 渐显渐隐列表项

```dart
class FadeInList extends StatefulWidget {
  @override
  _FadeInListState createState() => _FadeInListState();
}

class _FadeInListState extends State<FadeInList>
    with TickerProviderStateMixin {
  List<AnimationController> _controllers = [];

  @override
  void initState() {
    super.initState();
    // 为每个项目创建独立的控制器
    for (int i = 0; i < 10; i++) {
      var controller = AnimationController(
        duration: Duration(milliseconds: 500),
        vsync: this,
      );
      _controllers.add(controller);

      // 错开启动时间
      Future.delayed(Duration(milliseconds: i * 100), () {
        if (mounted) controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controllers.forEach((c) => c.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 10,
      itemBuilder: (context, index) {
        return AnimatedBuilder(
          animation: _controllers[index],
          builder: (context, child) {
            return Opacity(
              opacity: _controllers[index].value,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(0.3, 0),
                  end: Offset.zero,
                ).animate(CurvedAnimation(
                  parent: _controllers[index],
                  curve: Curves.easeOut,
                )),
                child: ListTile(
                  leading: Icon(Icons.star),
                  title: Text('Item $index'),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
```

### 6.4 交叉淡入淡出 (Crossfade)

```dart
class CrossFadeDemo extends StatefulWidget {
  @override
  _CrossFadeDemoState createState() => _CrossFadeDemoState();
}

class _CrossFadeDemoState extends State<CrossFadeDemo> {
  bool _showFirst = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        AnimatedCrossFade(
          firstChild: Container(
            width: 200,
            height: 200,
            color: Colors.orange,
            child: Center(child: Text('First')),
          ),
          secondChild: Container(
            width: 200,
            height: 200,
            color: Colors.purple,
            child: Center(child: Text('Second')),
          ),
          crossFadeState: _showFirst
              ? CrossFadeState.showFirst
              : CrossFadeState.showSecond,
          duration: Duration(milliseconds: 500),
          layoutBuilder: (topChild, topChildKey, bottomChild, bottomChildKey) {
            return Stack(
              clipBehavior: Clip.none,
              children: <Widget>[
                Positioned(
                  key: bottomChildKey,
                  left: 0.0,
                  top: 0.0,
                  right: 0.0,
                  child: bottomChild,
                ),
                Positioned(
                  key: topChildKey,
                  child: topChild,
                ),
              ],
            );
          },
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _showFirst = !_showFirst;
            });
          },
          child: Text('Switch'),
        ),
      ],
    );
  }
}
```

## 7. 高级动画技巧

### 7.1 物理模拟动画 (PhysicsSimulation)

```dart
class PhysicsAnimationDemo extends StatefulWidget {
  @override
  _PhysicsAnimationDemoState createState() => _PhysicsAnimationDemoState();
}

class _PhysicsAnimationDemoState extends State<PhysicsAnimationDemo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController.unbounded(vsync: this);
    
    // 弹簧物理模拟
    final spring = SpringDescription(
      mass: 1,           // 质量
      stiffness: 200,   // 刚度
      damping: 10,      // 阻尼
    );

    _animation = _controller.drive(
      SpringSimulation(spring, 0, 1, 0),
    );

    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value * 200),
          child: child,
        );
      },
      child: Container(width: 50, height: 50, color: Colors.red),
    );
  }
}
```

### 7.2 手势驱动动画

```dart
class GestureDrivenAnimation extends StatefulWidget {
  @override
  _GestureDrivenAnimationState createState() => _GestureDrivenAnimationState();
}

class _GestureDrivenAnimationState extends State<GestureDrivenAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
  }

  void _onPanUpdate(DragUpdateDetails details) {
    _controller.value += details.delta.dx / 300;
  }

  void _onPanEnd(DragEndDetails details) {
    if (_controller.value > 0.5) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanUpdate: _onPanUpdate,
      onPanEnd: _onPanEnd,
      child: AnimatedBuilder(
        animation: _animation,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(_animation.value * 200, 0),
            child: Transform.rotate(
              angle: _animation.value * pi,
              child: child,
            ),
          );
        },
        child: Container(
          width: 100,
          height: 100,
          color: Colors.blue,
        ),
      ),
    );
  }
}
```

### 7.3 动画编排 (Chained Animations)

```dart
class ChainedAnimationDemo extends StatefulWidget {
  @override
  _ChainedAnimationDemoState createState() => _ChainedAnimationDemoState();
}

class _ChainedAnimationDemoState extends State<ChainedAnimationDemo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeIn;
  late Animation<double> _slideIn;
  late Animation<double> _scaleUp;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    // 编排多个动画按顺序或同时执行
    _fadeIn = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );

    _slideIn = Tween<double>(begin: 50.0, end: 0.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.25, 0.75, curve: Curves.easeOut),
      ),
    );

    _scaleUp = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.5, 1.0, curve: Curves.elasticOut),
      ),
    );

    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Opacity(
            opacity: _fadeIn.value,
            child: Transform.translate(
              offset: Offset(0, _slideIn.value),
              child: Transform.scale(
                scale: _scaleUp.value,
                child: child,
              ),
            ),
          );
        },
        child: Container(
          width: 150,
          height: 150,
          color: Colors.indigo,
          child: Icon(Icons.check, size: 80, color: Colors.white),
        ),
      ),
    );
  }
}
```

## 8. 最佳实践与性能优化 ⚡

### 8.1 选择合适的动画方式

| 场景 | 推荐方案 |
|------|---------|
| 简单的 UI 变化 | `AnimatedContainer`, `AnimatedOpacity` |
| 复杂的自定义动画 | `AnimationController` + `AnimatedBuilder` |
| 页面转场 | `Hero` 动画 |
| 列表项动画 | `AnimatedList` 或手动实现 |
| 手势交互 | 结合 `GestureDetector` |

### 8.2 性能优化建议

```dart
// ✅ 1. 使用 const 构造函数
const MyWidget()

// ✅ 2. 在 AnimatedBuilder 中使用 child 参数缓存静态内容
AnimatedBuilder(
  animation: _controller,
  child: StaticWidget(), // 这部分不会重建
  builder: (context, child) {
    return Transform.rotate(angle: _controller.value, child: child);
  },
)

// ✅ 3. 避免在 build 方法中创建 Animation 对象
// ❌ 错误：每次 build 都创建新对象
@override
Widget build(BuildContext context) {
  final anim = Tween(...).animate(_controller);
  return ...;
}

// ✅ 正确：在 initState 中创建
late Animation _anim;
@override
void initState() {
  _anim = Tween(...).animate(_controller);
}

// ✅ 4. 及时释放资源
@override
void dispose() {
  _controller.dispose();
  super.dispose();
}

// ✅ 5. 合理设置动画帧率
AnimationController(
  vsync: this,
  // 默认 60fps，对于简单动画可以降低
)
```

### 8.3 常见问题解决

**动画卡顿**：
- 确保不在动画回调中做耗时操作
- 使用 `RepaintBoundary` 隔离动画区域
- 检查是否有不必要的 setState

**内存泄漏**：
- 始终在 dispose 中调用 `_controller.dispose()`
- 使用 `mounted` 检查组件状态

**动画不流畅**：
- 使用硬件加速（Transform, Opacity）
- 避免频繁重建复杂的 widget 树
- 考虑使用 `AnimatedBuilder` 替代 `setState`

## 9. 实用工具类

### 9.1 动画工具 Mixin

```dart
mixin AnimationHelper<T extends StatefulWidget> on State<T>, SingleTickerProviderStateMixin {
  late AnimationController controller;
  
  Animation<double> createTweenAnimation({
    required double begin,
    required double end,
    Curve curve = Curves.linear,
  }) {
    return Tween<double>(begin: begin, end: end).animate(
      CurvedAnimation(parent: controller, curve: curve),
    );
  }

  Animation<Color?> createColorAnimation({
    required Color begin,
    required Color end,
    Curve curve = Curves.linear,
  }) {
    return ColorTween(begin: begin, end: end).animate(
      CurvedAnimation(parent: controller, curve: curve),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}

// 使用示例
class MyAnimatedWidget extends StatefulWidget {
  @override
  _MyAnimatedWidgetState createState() => _MyAnimatedWidgetState();
}

class _MyAnimatedWidgetState extends State<MyAnimatedWidget> with AnimationHelper {
  late Animation<double> _scaleAnim;
  late Animation<Color?> _colorAnim;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    );
    
    _scaleAnim = createTweenAnimation(begin: 1.0, end: 1.5, curve: Curves.easeInOut);
    _colorAnim = createColorAnimation(begin: Colors.blue, end: Colors.red);
    
    controller.repeat(reverse: true);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnim.value,
          child: Container(
            width: 100,
            height: 100,
            color: _colorAnim.value,
          ),
        );
      },
    );
  }
}
```

### 9.2 动画预设配置

```dart
class AnimationPresets {
  static const Duration fast = Duration(milliseconds: 200);
  static const Duration medium = Duration(milliseconds: 400);
  static const Duration slow = Duration(milliseconds: 800);

  static const Curve defaultCurve = Curves.easeInOut;
  static const Curve bounceCurve = Curves.bounceOut;
  static const Curve elasticCurve = Curves.elasticOut;

  static AnimationController createFastController(TickerProvider vsync) =>
      AnimationController(duration: fast, vsync: vsync);

  static AnimationController createMediumController(TickerProvider vsync) =>
      AnimationController(duration: medium, vsync: vsync);

  static AnimationController createSlowController(TickerProvider vsync) =>
      AnimationController(duration: slow, vsync: vsync);
}
```

## 📚 总结

Flutter 动画系统的核心概念：

1. **AnimationController**: 动画的大脑，控制时间线和状态
2. **Tween**: 定义值的范围（开始值 → 结束值）
3. **CurvedAnimation**: 添加缓动曲线使动画更自然
4. **AnimatedBuilder/AnimatedWidget**: 将动画值转换为视觉效果
5. **Hero**: 实现跨页面的元素过渡动画
6. **Implicit Animations**: 如 `AnimatedContainer`，自动管理动画控制器

掌握这些核心概念，你就能创建流畅、专业的动画效果！🎉
