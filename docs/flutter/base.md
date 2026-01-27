# Flutter

## 安装

Flutter doctor 运行`Network resources` 报错

- 打开flutter根目录

1. 找到配置flutter的目录，并且通过cd切换进去即可; 
   当找不到时，可以通过find命令查找如下文件名即可:find / -name "*.http_host_validator.dart"
2. vim flutter/packages/flutter_tools/lib/src/http_host_validator.dart
3. 替换 kMaven（修改地址如下：http://maven.aliyun.com/nexus/content/groups/public/）
4. rm -rf flutter/bin/cache
5. flutter doctor

- 设置国内网络代理地址:

1. sudo vim .bash_profile
2. 添加如下代理即可:
   export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
   export PUB_HOSTED_URL=https://pub.flutter-io.cn 
3. source .bash_profile


## 多版本管理flutter版本

1.window包管理工具choco安装

```bash
# cmd安装
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

# powershell安装
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1')) 

```

**常用指令Commands**

```bash
choco list -li 查看本地安装的软件
choco search nodejs 查找安装包
choco install sublimetext3 下载
choco uninstall sublimetext3 卸载
choco upgrade sublimetext3 更新（update）
```
**更改本地仓库**

```bash
# cmd
setx ChocolateyInstall D:\Chocolatey /M
# powershell
& setx.exe ChocolateyInstall D:\Chocolatey /M
```
2.常见问题解决

```bash
choco install fvm

Flutter unable find git in your PATH
# git 权限问题，执行以下命令来解决 
# 或者将flutter sdk目录加入, git安全目录
git config --global --add safe.directory '*'
git config --global --add safe.directory C:/src/flutter
```


### Android Studio下载Gradle超时解决方案

![flutter run 卡在 Running Gradle task 'assembleDebug'... 但具体卡在哪里?](https://juejin.cn/post/7288561954485223463)

```bash
# gradle-wrapper目录下的gradle-wrapper.properties文件中添加如下配置
# 腾讯云
distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-7.6.3-all.zip
```

**清理和重新构建**

```bash
cd android
./gradlew clean
./gradlew build

如果vscode debug报错，尝试更换flutter sdk版本 
删除`android`目录，`fvm flutter cretate .`重新生成android目录
```

**配置vscode调试环境**

# 项目根目录下指定flutter sdk版本, 生成.fvm目录和.fvmrc配置文件, `fvm use 3.19.5`


```json
// settings.json 指定flutter sdk路径
{
  "dart.flutterSdkPath": ".fvm/versions/3.19.5",
  "search.exclude": {
    "**/.fvm": true
  },
  "files.watcherExclude": {
    "**/.fvm": true
  }
}

// launch.json,配置多版本调试环境

{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "pollka-snow-dev",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart",
      "args": ["--flavor", "dev"]
    },
    {
      "name": "pollka-snow-dev(profile)",
      "request": "launch",
      "type": "dart",
      "flutterMode": "profile",
      "program": "lib/main_dev.dart",
      "args": ["--flavor", "dev"]
    },
    {
      "name": "pollka-snow-qa",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_qa.dart",
      "args": ["--flavor", "qa"]
    },
    {
      "name": "pollka-snow-product",
      "request": "launch",
      "type": "dart",
      "program": "lib/main_product.dart",
      "args": ["--flavor", "product"]
    }
  ]
}

```

** android端同步多版本配置 ** 

```js
// 在android app目录的build.gradle中添加如下拓展配置
android {
  //Add this code for flavor
  flavorDimensions "default"
  productFlavors {
      dev {
          dimension "default"
          versionNameSuffix "--dev"
      }
      stage {
          dimension "default"
          versionNameSuffix "--stage"
      }
      prod {
          dimension "default"
      }
  }
}
```