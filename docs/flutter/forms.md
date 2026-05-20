# Flutter 表单处理 - 验证与输入管理 📝

## 1. 表单基础

### 1.1 Form 和 TextFormField

```dart
class LoginForm extends StatefulWidget {
  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // 邮箱输入框
          TextFormField(
            controller: _emailController,
            decoration: InputDecoration(
              labelText: '邮箱',
              hintText: '请输入邮箱地址',
              prefixIcon: Icon(Icons.email),
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return '请输入邮箱';
              }
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                return '邮箱格式不正确';
              }
              return null;
            },
          ),

          SizedBox(height: 16),

          // 密码输入框
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(
              labelText: '密码',
              hintText: '请输入密码',
              prefixIcon: Icon(Icons.lock),
              suffixIcon: IconButton(
                icon: Icon(Icons.visibility),
                onPressed: () {},
              ),
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return '请输入密码';
              }
              if (value.length < 6) {
                return '密码至少6位';
              }
              return null;
            },
          ),

          SizedBox(height: 24),

          // 提交按钮
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                print('邮箱：${_emailController.text}');
                print('密码：${_passwordController.text}');
              }
            },
            child: Text('登录'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

### 1.2 FormField 状态

```dart
// 获取表单状态
_formKey.currentState!.validate();  // 验证所有字段
_formKey.currentState!.save();      // 保存所有字段
_formKey.currentState!.reset();     // 重置所有字段
```

## 2. 输入类型与键盘

### 2.1 TextInputType

```dart
TextFormField(
  keyboardType: TextInputType.text,        // 默认文本键盘
  // TextInputType.emailAddress,           // 邮箱键盘（带@）
  // TextInputType.phone,                 // 电话键盘（带数字）
  // TextInputType.number,                // 数字键盘
  // TextInputType.url,                   // URL 键盘（带.com）
  // TextInputType.multiline,             // 多行文本
  // TextInputType.datetime,              // 日期时间
  // TextInputType.name,                  // 名字输入
  // TextInputType.streetAddress,         // 街道地址
)
```

### 2.2 TextInputAction

```dart
TextFormField(
  textInputAction: TextInputAction.next,   // 下一个
  // textInputAction: TextInputAction.done,     // 完成
  // textInputAction: TextInputAction.search,   // 搜索
  // textInputAction: TextInputAction.send,     // 发送
  // textInputAction: TextInputAction.go,       // 前往
  onFieldSubmitted: (value) {
    print('提交：$value');
  },
)
```

### 2.3 输入格式化

```dart
// 限制最大长度
TextInputFormatter.withMaxLength(10)

// 只允许数字
FilteringTextInputFormatter.digitsOnly

// 自定义格式（如手机号）
class PhoneFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text.replaceAll(RegExp(r'\D'), '');
    if (text.length > 11) return oldValue;

    String formatted = '';
    for (int i = 0; i < text.length; i++) {
      if (i == 3 || i == 7) formatted += ' ';
      formatted += text[i];
    }

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

// 使用
TextFormField(
  inputFormatters: [
    LengthLimitingTextInputFormatter(11),
    FilteringTextInputFormatter.digitsOnly,
    PhoneFormatter(),
  ],
)
```

## 3. 表单验证策略

### 3.1 实时验证 vs 提交验证

```dart
// 实时验证（每次输入都验证）
TextFormField(
  autovalidateMode: AutovalidateMode.onUserInteraction,
  validator: (value) => value?.isEmpty ? '不能为空' : null,
)

// AutovalidateMode 选项：
// - disabled: 不自动验证（默认）
// - always: 始终验证
// - onUserInteraction: 用户交互时验证
```

### 3.2 异步验证

```dart
TextFormField(
  validator: (value) async {
    if (value == null || value.isEmpty) return '不能为空';

    // 检查用户名是否已存在
    final isExists = await checkUsernameExists(value);
    return isExists ? '用户名已存在' : null;
  },
)
```

### 3.3 自定义验证器

```dart
class Validators {
  static String? required(String? value, [String message = '此字段必填']) {
    return value?.trim().isEmpty ? message : null;
  }

  static String? email(String? value) {
    if (value == null || value.isEmpty) return '请输入邮箱';
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(value) ? null : '邮箱格式不正确';
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return '请输入手机号';
    final phoneRegex = RegExp(r'^1[3-9]\d{9}$');
    return phoneRegex.hasMatch(value) ? null : '手机号格式不正确';
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return '请输入密码';
    if (value.length < 6) return '密码至少6位';
    if (value.length > 20) return '密码最多20位';
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    if (value != password) return '两次密码不一致';
    return null;
  }
}

// 使用
TextFormField(
  validator: Validators.email,
)
```

## 4. 高级表单组件

### 4.1 下拉选择

```dart
String? _selectedValue;

DropdownButtonFormField<String>(
  value: _selectedValue,
  decoration: InputDecoration(
    labelText: '选择城市',
    border: OutlineInputBorder(),
  ),
  items: ['北京', '上海', '广州', '深圳'].map((city) {
    return DropdownMenuItem(
      value: city,
      child: Text(city),
    );
  }).toList(),
  onChanged: (value) {
    setState(() => _selectedValue = value);
  },
  validator: (value) => value == null ? '请选择城市' : null,
)
```

### 4.2 开关和复选框

```dart
// Switch
bool _switchValue = false;

SwitchListTile(
  title: Text('接收通知'),
  subtitle: Text('开启后将接收推送通知'),
  value: _switchValue,
  onChanged: (value) {
    setState(() => _switchValue = value);
  },
)

// Checkbox
bool _isChecked = false;

CheckboxListTile(
  title: Text('同意用户协议'),
  value: _isChecked,
  onChanged: (value) {
    setState(() => _isChecked = value ?? false);
  },
)
```

### 4.3 日期时间选择

```dart
DateTime? _selectedDate;

TextFormField(
  controller: TextEditingController(
    text: _selectedDate?.toString().split(' ')[0] ?? '',
  ),
  readOnly: true,
  decoration: InputDecoration(
    labelText: '出生日期',
    suffixIcon: Icon(Icons.calendar_today),
    border: OutlineInputBorder(),
  ),
  onTap: () async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  },
)
```

### 4.4 多行文本输入

```dart
TextFormField(
  maxLines: 5,
  minLines: 3,
  maxLength: 500,
  buildCounter: (context,
      {required currentLength, required isFocused, maxLength}) =>
      Text('$currentLength/$maxLength'),
  decoration: InputDecoration(
    labelText: '自我介绍',
    alignLabelWithHint: true,
    border: OutlineInputBorder(),
  ),
)
```

## 5. 表单状态管理

### 5.1 使用 Provider 管理表单

```dart
class FormData with ChangeNotifier {
  String _username = '';
  String _email = '';
  String _password = '';

  String get username => _username;
  String get email => _email;
  String get password => _password;

  void updateUsername(String value) {
    _username = value;
    notifyListeners();
  }

  void updateEmail(String value) {
    _email = value;
    notifyListeners();
  }

  void updatePassword(String value) {
    _password = value;
    notifyListeners();
  }

  bool validate() {
    return _username.isNotEmpty &&
        _email.contains('@') &&
        _password.length >= 6;
  }

  void reset() {
    _username = '';
    _email = '';
    _password = '';
    notifyListeners();
  }
}
```

### 5.2 表单提交处理

```dart
ElevatedButton(
  onPressed: () async {
    if (!_formKey.currentState!.validate()) return;

    try {
      // 显示加载状态
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => Center(child: CircularProgressIndicator()),
      );

      // 提交表单
      await submitForm({
        'email': _emailController.text,
        'password': _passwordController.text,
      });

      Navigator.pop(context); // 关闭加载
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('提交成功')),
      );
    } catch (e) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('提交失败：$e')),
      );
    }
  },
  child: Text('提交'),
)
```

## 6. 最佳实践

### 6.1 表单封装

```dart
class AppTextField extends StatelessWidget {
  final String label;
  final String? hint;
  final IconData? prefixIcon;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final bool obscureText;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;

  const AppTextField({
    super.key,
    required this.label,
    this.hint,
    this.prefixIcon,
    this.controller,
    this.validator,
    this.obscureText = false,
    this.keyboardType,
    this.inputFormatters,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        inputFormatters: inputFormatters,
        validator: validator,
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          filled: true,
          fillColor: Colors.grey[50],
        ),
      ),
    );
  }
}

// 使用
AppTextField(
  label: '用户名',
  hint: '请输入用户名',
  prefixIcon: Icons.person,
  controller: _usernameController,
  validator: Validators.required,
)
```

### 6.2 注意事项

1. **及时释放 Controller**: 在 `dispose()` 中释放所有 `TextEditingController`
2. **合理使用 GlobalKey**: 每个表单使用独立的 `GlobalKey<FormState>`
3. **用户体验优化**:
   - 添加合适的 `hintText` 引导用户输入
   - 使用 `autovalidateMode` 控制验证时机
   - 对错误信息提供清晰的提示
4. **安全性考虑**:
   - 密码输入使用 `obscureText: true`
   - 敏感数据不要在日志中打印
   - 使用 HTTPS 提交表单数据
