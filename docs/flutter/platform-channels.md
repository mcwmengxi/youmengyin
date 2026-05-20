# Flutter 平台交互 - Platform Channels 📱

## 1. 平台通道概述

### 1.1 什么是平台通道？

**Platform Channels** 是 Flutter 与原生平台（Android/iOS）之间通信的桥梁，允许 Flutter 调用原生代码的功能。

### 1.2 三种通道类型

| 类型 | 用途 | 特点 |
|------|------|------|
| **MethodChannel** | 方法调用 | 双向通信，支持返回值 |
| **EventChannel** | 事件流 | 单向数据流，持续监听 |
| **BasicMessageChannel** | 消息传递 | 基础消息收发 |

### 1.3 数据类型支持

```dart
// Flutter 端支持的数据类型
null
bool
int
double
String
Uint8List
Int32List
Int64List
Float64List
List (上述类型的列表)
Map<String, Object> (上述类型的映射)
```

## 2. MethodChannel - 方法调用

### 2.1 基本用法

#### Flutter 端

```dart
import 'package:flutter/services.dart';

class PlatformService {
  static const _channel = MethodChannel('com.example.app/platform');

  // 获取电池电量
  Future<int> getBatteryLevel() async {
    try {
      final int result = await _channel.invokeMethod('getBatteryLevel');
      return result;
    } on PlatformException catch (e) {
      print('Failed to get battery level: ${e.message}');
      return -1;
    }
  }

  // 获取设备信息
  Future<Map<String, dynamic>> getDeviceInfo() async {
    try {
      final Map<dynamic, dynamic> result =
          await _channel.invokeMethod<Map>('getDeviceInfo') ?? {};
      return Map<String, dynamic>.from(result);
    } catch (e) {
      print('Failed: $e');
      return {};
    }
  }

  // 带参数的方法调用
  Future<void> showToast(String message) async {
    try {
      await _channel.invokeMethod('showToast', {'message': message});
    } catch (e) {
      print('Failed to show toast: $e');
    }
  }
}
```

#### Android 端 (Kotlin)

```kotlin
// MainActivity.kt
class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(
            flutterEngine.dartExecutor.binaryMessenger,
            "com.example/app/platform"
        ).setMethodCallHandler { call, result ->
            when (call.method) {
                "getBatteryLevel" -> {
                    val batteryLevel = getBatteryLevel()
                    if (batteryLevel != -1) {
                        result.success(batteryLevel)
                    } else {
                        result.error("UNAVAILABLE", "Battery level not available.", null)
                    }
                }

                "getDeviceInfo" -> {
                    val deviceInfo = HashMap<String, Any>()
                    deviceInfo["brand"] = Build.BRAND
                    deviceInfo["model"] = Build.MODEL
                    deviceInfo["version"] = Build.VERSION.RELEASE
                    result.success(deviceInfo)
                }

                "showToast" -> {
                    val message = call.argument<String>("message")
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
                    result.success(null)
                }

                else -> result.notImplemented()
            }
        }
    }

    private fun getBatteryLevel(): Int {
        val batteryManager = getSystemService(BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }
}
```

#### iOS 端 (Swift)

```swift
// AppDelegate.swift
import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    
    let controller = window?.rootViewController as! FlutterViewController
    
    let platformChannel = FlutterMethodChannel(
      name: "com.example/app/platform",
      binaryMessenger: controller.binaryMessenger
    )
    
    platformChannel.setMethodCallHandler { [weak self] (call, result) in
      switch call.method {
      
      case "getBatteryLevel":
        self?.receiveBatteryLevel(result: result)
        
      case "getDeviceInfo":
        let deviceInfo: [String: Any] = [
          "name": UIDevice.current.name,
          "systemVersion": UIDevice.current.systemVersion,
          "model": UIDevice.current.model,
        ]
        result(deviceInfo)
        
      case "showToast":
        if let args = call.arguments as? [String: Any],
           let message = args["message"] as? String {
          self?.showToast(message: message)
        }
        result(nil)
        
      default:
        result(FlutterMethodNotImplemented)
      }
    }
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  private func receiveBatteryLevel(result: @escaping FlutterResult) {
    UIDevice.current.isBatteryMonitoringEnabled = true
    
    let batteryLevel = Int(UIDevice.current.batteryLevel * 100)
    if batteryLevel >= 0 {
      result(batteryLevel)
    } else {
      result(FlutterError(
        code: "UNAVAILABLE",
        message: "Battery info unavailable",
        details: nil
      ))
    }
  }
  
  private func showToast(message: String) {
    let alert = UIAlertController(
      title: nil,
      message: message,
      preferredStyle: .alert
    )
    alert.addAction(UIAlertAction(title: "OK", style: .default))
    self.window?.rootViewController?.present(alert, animated: true)
  }
}
```

### 2.2 在 Widget 中使用

```dart
class BatteryWidget extends StatefulWidget {
  @override
  State<BatteryWidget> createState() => _BatteryWidgetState();
}

class _BatteryWidgetState extends State<BatteryWidget> {
  final _platformService = PlatformService();
  int _batteryLevel = 0;

  @override
  void initState() {
    super.initState();
    _getBatteryLevel();
  }

  Future<void> _getBatteryLevel() async {
    final level = await _platformService.getBatteryLevel();
    setState(() => _batteryLevel = level);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('当前电量：$_batteryLevel%'),
        ElevatedButton(
          onPressed: _getBatteryLevel,
          child: Text('刷新'),
        ),
      ],
    );
  }
}
```

## 3. EventChannel - 事件流

### 3.1 监听传感器数据

#### Flutter 端

```dart
import 'dart:async';
import 'package:flutter/services.dart';

class SensorService {
  static const _eventChannel = EventChannel('com.example.app/sensors');

  Stream<double>? _accelerometerStream;

  Stream<double> get accelerometerStream {
    _accelerometerStream ??= _eventChannel
        .receiveBroadcastStream()
        .map((event) => event as double);
    return _accelerometerStream!;
  }
}

// 使用
class AccelerometerWidget extends StatefulWidget {
  @override
  State<AccelerometerWidget> createState() => _AccelerometerWidgetState();
}

class _AccelerometerWidgetState extends State<AccelerometerWidget> {
  double _x = 0, _y = 0, _z = 0;
  late StreamSubscription _subscription;

  @override
  void initState() {
    super.initState();
    _subscription = SensorService().accelerometerStream.listen((data) {
      setState(() {
        // 假设返回的是包含 x,y,z 的 Map
        _x = data['x'] ?? 0;
        _y = data['y'] ?? 0;
        _z = data['z'] ?? 0;
      });
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('X: $_x'),
        Text('Y: $_y'),
        Text('Z: $_z'),
      ],
    );
  }
}
```

#### Android 端

```kotlin
EventChannel(
    flutterEngine.dartExecutor.binaryMessenger,
    "com.example/app/sensors"
).setStreamHandler(object : EventChannel.StreamHandler {

    private var sensorManager: SensorManager? = null
    private var accelerometerSensor: Sensor? = null
    private var sensorEventListener: SensorEventListener? = null

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        accelerometerSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        sensorEventListener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent?) {
                event?.let {
                    val data = mapOf(
                        "x" to it.values[0],
                        "y" to it.values[1],
                        "z" to it.values[2]
                    )
                    events?.success(data)
                }
            }

            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }

        sensorManager?.registerListener(
            sensorEventListener,
            accelerometerSensor,
            SensorManager.SENSOR_DELAY_NORMAL
        )
    }

    override fun onCancel(arguments: Any?) {
        sensorManager?.unregisterListener(sensorEventListener)
        sensorEventListener = null
    }
})
```

## 4. BasicMessageChannel - 消息传递

### 4.1 基本用法

```dart
// Flutter 端
static const _messageChannel =
    BasicMessageChannel<dynamic>('com.example.app/message', StandardMessageCodec());

// 发送消息并等待回复
Future<String> sendMessage(String message) async {
  final reply = await _messageChannel.send(message);
  return reply as String;
}

// 接收消息
_messageChannel.setMessageHandler((message) async {
  print('收到原生消息：$message');
  return 'Flutter 收到：$message';
});
```

## 5. 实战案例

### 5.1 调用相机拍照

```dart
class CameraService {
  static const _channel = MethodChannel('com.example.app/camera');

  Future<String?> takePicture() async {
    try {
      final String? path = await _channel.invokeMethod('takePicture');
      return path;
    } catch (e) {
      print('拍照失败：$e');
      return null;
    }
  }
}
```

### 5.2 获取位置信息

```dart
class LocationService {
  static const _channel = MethodChannel('com.example.app/location');

  Stream<Map<String, double>>? _locationStream;

  Stream<Map<String, double>> get locationStream {
    final eventChannel = EventChannel('com.example.app/location/stream');
    _locationStream ??= eventChannel
        .receiveBroadcastStream()
        .map((event) => Map<String, double>.from(event));
    return _locationStream!;
  }

  Future<Map<String, double>> getCurrentLocation() async {
    try {
      final Map<dynamic, dynamic> result =
          await _channel.invokeMethod('getCurrentLocation');
      return {
        'latitude': result['latitude'],
        'longitude': result['longitude'],
      };
    } catch (e) {
      print('获取位置失败：$e');
      rethrow;
    }
  }
}
```

### 5.3 文件操作

```dart
class FileService {
  static const _channel = MethodChannel('com.example.app/files');

  Future<String> getFilePath(String filename) async {
    try {
      final String path = await _channel.invokeMethod(
        'getFilePath',
        {'filename': filename},
      );
      return path;
    } catch (e) {
      print('获取文件路径失败：$e');
      rethrow;
    }
  }

  Future<bool> saveFile(String path, String content) async {
    try {
      final bool success = await _channel.invokeMethod(
        'saveFile',
        {'path': path, 'content': content},
      );
      return success;
    } catch (e) {
      print('保存文件失败：$e');
      return false;
    }
  }

  Future<String?> readFile(String path) async {
    try {
      final String? content = await _channel.invokeMethod(
        'readFile',
        {'path': path},
      );
      return content;
    } catch (e) {
      print('读取文件失败：$e');
      return null;
    }
  }
}
```

## 6. 最佳实践

### 6.1 错误处理

```dart
class SafePlatformCall {
  static Future<T> safeCall<T>(Future<T> Function() call, {
    T? defaultValue,
    void Function(Object error)? onError,
  }) async {
    try {
      return await call();
    } on PlatformException catch (e) {
      print('PlatformException: ${e.code} - ${e.message}');
      onError?.call(e);
      return defaultValue ?? (throw e);
    } on MissingPluginException catch (e) {
      print('MissingPluginException: 插件未实现');
      onError?.call(e);
      return defaultValue ?? (throw e);
    } catch (e) {
      print('Unexpected error: $e');
      onError?.call(e);
      return defaultValue ?? (throw e);
    }
  }
}

// 使用
final batteryLevel = await SafePlatformCall.safeCall(
  () => _platformService.getBatteryLevel(),
  defaultValue: -1,
  onError: (e) => ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('获取电量失败')),
  ),
);
```

### 6.2 封装平台服务

```dart
abstract class PlatformInterface {
  Future<int> getBatteryLevel();
  Future<Map<String, dynamic>> getDeviceInfo();
  Future<void> showToast(String message);
}

class PlatformServiceImpl implements PlatformInterface {
  static const _channel = MethodChannel('com.example.app/platform');

  @override
  Future<int> getBatteryLevel() async {
    return await _channel.invokeMethod('getBatteryLevel');
  }

  @override
  Future<Map<String, dynamic>> getDeviceInfo() async {
    final result = await _channel.invokeMethod('getDeviceInfo');
    return Map<String, dynamic>.from(result);
  }

  @override
  Future<void> showToast(String message) async {
    await _channel.invokeMethod('showToast', {'message': message});
  }
}

// 使用依赖注入
final platformService = GetIt.I<PlatformInterface>();
```

### 6.3 性能优化

1. **缓存通道实例**: 避免重复创建通道对象
2. **批量调用**: 减少跨平台调用次数
3. **异步处理**: 使用 `async/await` 避免阻塞 UI
4. **错误重试**: 对网络等不稳定操作添加重试机制

### 6.4 注意事项

- **线程安全**: Android 端确保在主线程回调
- **内存泄漏**: 及时取消 EventChannel 订阅
- **版本兼容**: 处理不同 API 版本的兼容性
- **权限管理**: 确保已获取必要权限
