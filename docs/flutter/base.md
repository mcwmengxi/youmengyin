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