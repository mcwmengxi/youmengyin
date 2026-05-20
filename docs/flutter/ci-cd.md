# Flutter CI/CD 持续集成与部署 🚀

## 1. CI/CD 概述

### 1.1 什么是 CI/CD？

- **CI (Continuous Integration)**: 持续集成 - 自动化代码构建和测试
- **CD (Continuous Deployment)**: 持续部署 - 自动化应用发布和分发

### 1.2 Flutter CI/CD 的优势

- ✅ 自动化构建流程，减少人工错误
- ✅ 快速反馈代码质量问题
- ✅ 统一的构建环境，避免"在我机器上能跑"的问题
- ✅ 自动化测试，确保代码稳定性
- ✅ 快速分发到测试人员或应用商店

### 1.3 CI/CD 流程图

```
代码提交 → 触发构建 → 代码分析 → 单元测试 → 构建应用 → 部署/分发
```

---

## 2. GitHub Actions ⭐

### 2.1 简介

GitHub Actions 是 GitHub 提供的 CI/CD 服务，与 GitHub 仓库深度集成，免费额度充足。

**优点**:
- ✅ 与 GitHub 无缝集成
- ✅ 免费额度大（公开仓库无限，私有仓库每月 2000 分钟）
- ✅ 丰富的 Marketplace Actions
- ✅ 配置简单，YAML 文件即可

**缺点**:
- ❌ macOS Runner 需要付费（或使用 self-hosted）
- ❌ iOS 签名配置相对复杂

### 2.2 基础配置文件

创建 `.github/workflows/flutter-ci.yml`:

```yaml
name: Flutter CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  FLUTTER_VERSION: '3.16.0'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
          channel: 'stable'

      - name: Get dependencies
        run: flutter pub get

      - name: Run tests
        run: flutter test --coverage

      - name: Analyze code
        run: flutter analyze --no-fatal-infos

      - name: Build APK
        run: flutter build apk --release

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
```

### 2.3 完整工作流示例

```yaml
name: Flutter CI/CD Pipeline

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

env:
  FLUTTER_VERSION: '3.16.0'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      - run: flutter pub get
      - run: flutter test --coverage
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: coverage/lcov.info

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      - run: flutter pub get
      - run: flutter build appbundle --release
      - name: Upload AAB
        uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: build/app/outputs/bundle/release/app-release.aab

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
      - run: flutter pub get
      - name: Install CocoaPods dependencies
        run: cd ios && pod install
      - name: Build iOS (without signing)
        run: flutter build ios --release --no-codesign
```

### 2.4 常用 Actions 推荐

```yaml
# 缓存依赖，加速构建
- name: Cache Flutter dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.pub-cache
      .dart_tool
    key: ${{ runner.os }}-flutter-${{ hashFiles('pubspec.lock') }}

# 上传到 Firebase App Distribution
- name: Distribute to Firebase
  uses: wzieba/Firebase-Distribution-Github-Action@v1
  with:
    appId: ${{ secrets.FIREBASE_APP_ID }}
    serviceCredentialsFileContent: ${{ secrets.FIREBASE_CREDENTIALS }}
    groups: testers
    file: build/app/outputs/flutter-apk/app-release.apk

# 创建 GitHub Release
- name: Create Release
      uses: softprops/action-gh-release@v1
      with:
        files: build/app/outputs/flutter-apk/app-release.apk
```

### 2.5 Secrets 配置

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 说明 |
|------------|------|
| `FIREBASE_APP_ID` | Firebase 应用 ID |
| `FIREBASE_CREDENTIALS` | Firebase 服务账号 JSON |
| `KEYSTORE_BASE64` | Android 签名密钥（Base64 编码） |
| `KEYSTORE_PASSWORD` | 密钥库密码 |
| `KEY_ALIAS` | 密钥别名 |
| `KEY_PASSWORD` | 密钥密码 |

---

## 3. Fastlane 🎯

### 3.1 简介

Fastlane 是一款开源的自动化工具集合，专门用于移动应用的构建、测试和发布。

**优点**:
- ✅ 功能强大，支持完整的发布流程
- ✅ 截图自动化、元数据管理
- ✅ 支持多种平台（iOS、Android、Flutter）
- ✅ 活跃的社区和丰富的插件

**缺点**:
- ❌ 学习曲线较陡峭
- ❌ Ruby 依赖，环境配置复杂
- ❌ 维护成本较高

### 3.2 安装 Fastlane

```bash
# 安装 Fastlane (需要 Ruby 环境)
gem install fastlane

# 或使用 Homebrew (macOS)
brew install fastlane

# 初始化 Fastlane
cd your_flutter_project
fastlane init
```

### 3.3 Fastfile 配置

在项目根目录创建 `fastlane/Fastfile`:

```ruby
default_platform(:android)

platform :android do
  desc("运行测试")
  lane :test do
    gradle(
      task: "test",
      flavor: "development"
    )
  end

  desc("构建 Debug APK")
  lane :build_debug do
    gradle(
      task: "assembleDebug",
      flavor: "development",
      build_type: "Debug"
    )
  end

  desc("构建 Release APK")
  lane :build_release do
    gradle(
      task: "assembleRelease",
      build_type: "Release",
      print_command: false,
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"]
      }
    )
  end

  desc("上传到 Firebase App Distribution")
  lane :distribute_to_firebase do
    firebase_app_distribution(
      app: ENV["FIREBASE_APP_ID"],
      groups: "internal-testers",
      firebase_cli_token: ENV["FIREBASE_CLI_TOKEN"],
      release_notes: "新版本发布",
      apk_path: "../build/app/outputs/apk/release/app-release.apk"
    )
  end

  desc("上传到 Google Play")
  lane :upload_to_play_store do
    upload_to_play_store(
      track: "internal",
      aab_path: "../build/app/outputs/bundle/release/app-release.aab",
      json_key_data: ENV["GOOGLE_PLAY_SERVICE_ACCOUNT_JSON"],
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc("完整发布流程")
  lane :release do
    test
    build_release
    distribute_to_firebase
    upload_to_play_store
  end
end

platform :ios do
  desc("构建 iOS")
  lane :build do
    build_ios_app(
      scheme: "Runner",
      workspace: "./Runner.xcworkspace",
      export_method: "app-store"
    )
  end

  desc("上传到 TestFlight")
  lane :beta do
    build_ios_app(
      scheme: "Runner",
      workspace: "./Runner.xcworkspace"
    )
    upload_to_testflight
  end
end
```

### 3.4 常用 Fastlane 插件

```ruby
# Gemfile
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods"

plugins_path = File.join(File.dirname(__FILE__), '..', 'fastlane', 'Pluginfile')
eval(File.read(plugins_path), binding, plugins_path) if File.exist?(plugins_path)
```

```ruby
# fastlane/Pluginfile
gem 'fastlane-plugin-firebase_app_distribution'
gem 'fastlane-plugin-versioning_android'
gem 'fastlane-plugin-flutter'
```

### 3.5 Flutter 专用插件

```ruby
# 使用 flutter 插件
desc("Flutter 构建")
lane :flutter_build do
  flutter(
    task: "build",
    flavor: "production",
    build_number: ENV["BUILD_NUMBER"]
  )
end

# 自动版本号管理
lane :bump_version do
  increment_version_number(
    version_type: "patch"
  )
  increment_build_number(
    build_number: Time.now.to_i.to_s
  )
end
```

---

## 4. Codemagic ✨

### 4.1 简介

Codemagic 是专门为移动应用设计的 CI/CD 平台，对 Flutter 有原生支持。

**优点**:
- ✅ 对 Flutter 原生支持，开箱即用
- ✅ 可视化配置界面，无需写 YAML
- ✅ 内置硬件设备用于测试
- ✅ 支持云签名管理
- ✅ 免费套餐可用（500 分钟/月）

**缺点**:
- ❌ 高级功能需要付费
- ❌ 自定义灵活性相对较低

### 4.2 Codemagic 配置步骤

#### 步骤 1: 连接代码仓库

1. 登录 [Codemagic](https://codemagic.io/)
2. 点击 "Add Application"
3. 选择 GitHub/GitLab/Bitbucket
4. 授权并选择仓库

#### 步骤 2: 配置构建流程

在 Codemagic 控制台中：

```yaml
# codemagic.yaml (可选的声明式配置)
workflows:
  android-build:
    name: Android Build
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
    scripts:
      - name: Get dependencies
        script: flutter pub get
      - name: Run tests
        script: flutter test
      - name: Build APK
        script: flutter build apk --release
    artifacts:
      - build/app/outputs/**/*.apk
    publishing:
      email:
        recipients:
          - team@example.com
```

#### 步骤 3: Post-clone 脚本

```bash
#!/bin/sh
set -e # exit on first failed command

# 安装依赖
flutter pub get

# 如果有原生依赖
cd ios && pod install || true
cd ..
```

#### 步骤 4: Pre-clone 脚本（可选）

```bash
#!/bin/sh
# 设置环境变量
export FLUTTER_ROOT=/opt/flutter
export PATH=$PATH:$FLUTTER_ROOT/bin
```

### 4.3 Codemagic 环境变量

在 Codemagic 设置中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `CM_KEYSTORE` | Base64 编码的 keystore 文件 | - |
| `CM_KEYSTORE_PASSWORD` | Keystore 密码 | `password123` |
| `CM_KEY_ALIAS_PASSWORD` | Key 密码 | `keypass123` |
| `CM_KEY_ALIAS` | Key 别名 | `mykey` |

### 4.4 发布配置

```yaml
publishing:
  firebase:
    firebase_service_account: $FIREBASE_SERVICE_ACCOUNT
    firebase_token: $FIREBASE_TOKEN
    android:
      app_id: 1:123456789012:android:abc123
      groups: testers
      release_notes: "自动构建 #$CM_BUILD_ID"
  
  email:
    recipients:
      - user@example.com
    notify:
      success: true
      failure: true
```

---

## 5. Bitrise 🔧

### 5.1 简介

Bitrise 是另一个流行的移动端 CI/CD 平台，以易用性和强大的集成能力著称。

**优点**:
- ✅ 直观的图形化界面
- ✅ 丰富的 Step 库
- ✅ 良好的 Flutter 支持
- ✅ 强大的 API 和 Webhook 支持
- ✅ 免费套餐可用

**缺点**:
- ❌ 免费版构建时间有限
- ❌ 高级功能需要付费

### 5.2 Bitrise 工作流配置

#### 方法一：可视化编辑器（推荐新手）

1. 登录 [Bitrise](https://www.bitrise.io/)
2. 创建新 App
3. 连接 Git 仓库
4. 在 Workflow 编辑器中拖拽 Steps

#### 方法二：bitrise.yml 配置

```yaml
format_version: '11'
default_step_lib_source: https://github.com/bitrise-io/bitrise-steplib.git

workflows:
  primary:
    steps:
      - activate-ssh-key@4:
          run_if: '{{getenv "SSH_RSA_PRIVATE_KEY" | ne ""}}'
      - git-clone@6: {}
      - cache-pull@2: {}
      - flutter-installer@0:
          inputs:
            - flutter_version: 'stable'
      - flutter-analyze@0:
          inputs:
            - project_location: "."
      - flutter-test@0:
          inputs:
            - project_location: "."
      - flutter-build@0:
          inputs:
            project_location: "."
            platform: android
            build_flavor: ""
            is_debug_mode: "no"
            build_number: "$BITRISE_BUILD_NUMBER"
      - sign-apk@1:
          inputs:
            - keystore_url: "$BITRISEIO_ANDROID_KEYSTORE_URL"
            - keystore_password: "$KEYSTORE_PASSWORD"
            - key_alias: "$KEY_ALIAS"
            - key_password: "$KEY_PASSWORD"
      - deploy-to-bitrise-io@2: {}
      - cache-push@2: {}

  deploy-firebase:
    after_run:
      - primary
    steps:
      - firebase-app-distribution@0:
          inputs:
            - firebase_service_account_file_url: "$FIREBASE_SERVICE_ACCOUNT_URL"
            - firebase_tokens: "$FIREBASE_TOKEN"
            - app: "1:123456789012:android:abc123"
            - groups: "internal-testers"
            - release_notes: "Build #$BITRISE_BUILD_NUMBER"
```

### 5.3 Bitrise 常用 Steps

| Step 名称 | 说明 |
|-----------|------|
| `git-clone@6` | 克隆代码仓库 |
| `flutter-installer@0` | 安装指定版本的 Flutter SDK |
| `flutter-analyze@0` | 运行静态代码分析 |
| `flutter-test@0` | 运行单元测试 |
| `flutter-build@0` | 构建 Flutter 应用 |
| `sign-apk@1` | 签名 APK |
| `deploy-to-bitrise-io@2` | 上传构建产物到 Bitrise |
| `firebase-app-distribution@0` | 分发到 Firebase |
| `google-play-deploy@3` | 发布到 Google Play Store |

### 5.4 环境变量配置

在 Bitrise 的 **Workflow Editor → Env Vars** 中添加：

**Secrets (敏感信息)**：
```
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=your_key_alias
KEY_PASSWORD=your_key_password
FIREBASE_TOKEN=your_firebase_token
```

**App Env Vars (应用级)**：
```
FLUTTER_BUILD_NUMBER=$BITRISE_BUILD_NUMBER
FLUTTER_BUILD_NAME=1.0.0
```

---

## 6. Firebase App Distribution 📱

### 6.1 简介

Firebase App Distribution 是 Google 提供的应用分发服务，专门用于向测试人员分发预发布版本。

**优点**:
- ✅ 与 Firebase 生态深度集成
- ✅ 快速分发，测试人员即时收到通知
- ✅ 支持 A/B 测试
- ✅ 免费额度充足
- ✅ 支持自动化分发

**缺点**:
- ❌ 依赖 Firebase 项目
- ❌ 不适合正式商店发布

### 6.2 CLI 安装与配置

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录 Firebase
firebase login:ci

# 初始化 Firebase（如果尚未初始化）
firebase init
```

### 6.3 分发命令

```bash
# 分发 APK 到测试组
firebase appdistribution:distribute path/to/app.apk \
  --app 1:123456789012:android:abc123 \
  --groups "internal-testers,qa-team" \
  --release-notes "Bug fixes and improvements" \

# 分发给特定测试人员
firebase appdistribution:distribute path/to/app.aab \
  --app 1:123456789012:ios:def456 \
  --testers "tester1@example.com,tester2@example.com" \
  --release-notes "New features added"

# 使用 Firebase token（CI/CD 中使用）
firebase appdistribution:distribute path/to/app.apk \
  --app $FIREBASE_APP_ID \
  --token "$FIREBASE_CI_TOKEN" \
  --groups "testers"
```

### 6.4 在 CI/CD 中集成

#### GitHub Actions 示例

```yaml
- name: Distribute to Firebase App Distribution
  uses: wzieba/Firebase-Distribution-Github-Action@v1
  with:
    appId: ${{ secrets.FIREBASE_APP_ID }}
    serviceCredentialsFileContent: ${{ secrets.FIREBASE_CREDENTIALS }}
    groups: internal-testers
    file: build/app/outputs/flutter-apk/app-release.apk
    releaseNotes: |
      ## 更新内容
      - 修复了登录页面的 bug
      - 优化了性能
      - 新增了暗黑模式
```

#### Fastlane 示例

```ruby
firebase_app_distribution(
  app: "1:123456789012:android:abc123",
  groups: "internal-testers",
  firebase_cli_token: ENV["FIREBASE_CLI_TOKEN"],
  release_notes: changelog_from_git_commits,
  apk_path: "../build/app/outputs/apk/release/app-release.apk"
)
```

### 6.5 测试人员管理

通过 [Firebase Console](https://console.firebase.google.com/) 管理：

1. 进入 **Build > App Distribution**
2. 选择应用
3. 点击 **Testers and Groups**
4. 创建测试组或添加测试人员

**最佳实践**：
- 创建不同的测试组：`internal-testers`、`qa-team`、`beta-testers`
- 为每个组设置合适的权限级别
- 定期清理不活跃的测试人员

---

## 7. 实战：完整的 CI/CD 方案 🎯

### 7.1 推荐方案组合

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 开源项目 | GitHub Actions | 免费、社区友好 |
| 初创公司 | Codemagic | 易用、快速上手 |
| 企业级应用 | Bitrise + Fastlane | 功能强大、可定制 |
| 快速验证原型 | Firebase App Distribution | 最简单的分发方式 |

### 7.2 完整的 GitHub Actions 工作流

```yaml
name: Flutter CI/CD Complete Pipeline

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  FLUTTER_VERSION: '3.16.0'
  JAVA_VERSION: '17'

jobs:
  # ==================== 代码质量检查 ====================
  analyze:
    name: Analyze & Test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
          cache: true
          cache-key: flutter-${{ env.FLUTTER_VERSION }}-${{ hashFiles('**/pubspec.lock') }}

      - name: Install dependencies
        run: flutter pub get

      - name: Check formatting
        run: dart format --output=none --set-exit-if-changed .

      - name: Analyze code
        run: flutter analyze --no-fatal-infos

      - name: Run tests with coverage
        run: flutter test --coverage --machine > test-results.json

      - name: Upload coverage to Codecov
        if: success()
        uses: codecov/codecov-action@v3
        with:
          files: coverage/lcov.info
          fail_ci_if_error: false

  # ==================== Android 构建 ====================
  build-android:
    name: Build Android
    needs: analyze
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: ${{ env.JAVA_VERSION }}
          cache: 'gradle'

      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${{ env.FLUTTER_VERSION }}
          cache: true

      - name: Decode keystore
        if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')
        run: |
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 --decode > android/app/keystore.jks

      - name: Build APK (Debug)
        if: github.event_name == 'pull_request'
        run: |
          flutter pub get
          flutter build apk --debug

      - name: Build APK (Release)
        if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: |
          flutter pub get
          flutter build apk --release \
            --keystore=android/app/keystore.jks \
            --store-password=${{ secrets.KEYSTORE_PASSWORD }} \
            --key-password=${{ secrets.KEY_PASSWORD }} \
            --key-alias=${{ secrets.KEY_ALIAS }}

      - name: Upload APK artifacts
        uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/*.apk
          retention-days: 7

  # ==================== 分发到 Firebase ====================
  distribute:
    name: Distribute to Firebase
    needs: build-android
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: android-apk

      - name: Distribute app via Firebase
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: ${{ secrets.FIREBASE_APP_ID }}
          serviceCredentialsFileContent: ${{ secrets.FIREBASE_CREDENTIALS }}
          groups: internal-testers,qa-team
          file: app-release.apk
          releaseNotes: |
            🚀 自动构建 #${{ github.run_number }}
            
            **Commit**: ${{ github.sha }}
            **Branch**: ${{ github.ref_name }}
            **Author**: ${{ github.actor }}

  # ==================== 发布到 GitHub Releases ====================
  release:
    name: Create GitHub Release
    needs: build-android
    if: startsWith(github.ref, 'refs/tags/v')
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: android-apk

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          files: app-release.apk
          draft: false
          prerelease: ${{ contains(github.ref, '-beta') || contains(github.ref, '-alpha') }}
```

### 7.3 项目目录结构建议

```
your_flutter_project/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI 工作流
│       └── release.yml         # 发布工作流
├── android/
│   ├── app/
│   │   ├── build.gradle.kts    # 构建配置
│   │   └── keystore.jks        # 签名密钥（gitignore）
│   └── ...
├── ios/
│   └── ...
├── lib/
│   └── ...
├── test/
│   └── ...
├── fastlane/
│   ├── Fastfile               # Fastlane 配置
│   └── Pluginfile             # Fastlane 插件
├── codemagic.yaml              # Codemagic 配置（可选）
├── bitrise.yml                 # Bitrise 配置（可选）
├── firebase.json               # Firebase 配置
├── .gitignore                  # 忽略文件
└── README.md
```

### 7.4 .gitignore 必要配置

```gitignore
# 签名密钥（绝对不能提交！）
*.jks
*.keystore
*.p8
*.mobileprovision

# Firebase 服务账号
service-account.json
google-services.json
GoogleService-Info.plist

# 环境变量
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.iml

# 构建产物
build/
.dart_tool/
.packages
.pub-cache/

# macOS
.DS_Store
```

---

## 8. 最佳实践与技巧 💡

### 8.1 构建优化

```yaml
# 使用缓存加速构建
- uses: actions/cache@v4
  with:
    path: |
      ~/.pub-cache
      .dart_tool
      vendor/bundle
    key: ${{ runner.os }}-flutter-v2-${{ hashFiles('**/pubspec.lock') }}
    restore-keys: |
      ${{ runner.os }}-flutter-v2-

# 并行执行独立任务
jobs:
  test-unit:
    # 单元测试
  test-integration:
    # 集成测试
  lint:
    # 代码检查
```

### 8.2 版本管理策略

```dart
// pubspec.yaml
version: 1.0.0+1

// 自动递增版本号
// 在 CI/CD 中使用环境变量
flutter build apk --build-number=$BUILD_NUMBER --build-name=$VERSION_NAME
```

### 8.3 多环境配置

```yaml
# 不同环境的构建
flavors:
  development:
    dart-define: "ENV=development,API_URL=https://dev.api.com"
  staging:
    dart-define: "ENV=staging,API_URL=https://staging.api.com"
  production:
    dart-define: "ENV=production,API_URL=https://api.com"
```

### 8.4 安全最佳实践

✅ **必须做**：
- 所有敏感信息使用 Secrets 存储
- 使用最小权限原则
- 定期轮换 API Key 和 Token
- 启用分支保护规则
- 审计 CI/CD 日志

❌ **禁止做**：
- 将密钥硬编码在代码中
- 将密钥提交到版本控制
- 在日志中打印敏感信息
- 使用过期的证书

### 8.5 监控与通知

```yaml
# Slack 通知
- name: Send notification to Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Flutter CI/CD Result: ${{ job.status }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build ${{ job.status }}*\nRepo: ${{ github.repository }}\nBranch: ${{ github.ref }}\nCommit: ${{ github.sha }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

# 邮件通知
- name: Send email notification
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "❌ Flutter Build Failed - ${{ github.repository }}"
    body: "Build failed for commit ${{ github.sha }}"
    to: devops@example.com
    from: CI/CD Bot
```

---

## 9. 故障排除 🔍

### 9.1 常见问题

#### 问题 1：Flutter 版本不一致

```bash
Error: Could not resolve version constraint for Flutter
```

**解决方案**：
```yaml
# 固定 Flutter 版本
- uses: subosito/flutter-action@v2
  with:
    flutter-version: '3.16.0'
    channel: 'stable'
```

#### 问题 2：Android 签名失败

```
Failed to read key from keystore
```

**解决方案**：
1. 确保 keystore 文件正确解码
2. 检查密码是否正确
3. 验证 alias 是否匹配

```bash
# 本地验证 keystore
keytool -list -v -keystore your.keystore
```

#### 问题 3：iOS 构建失败

```
Code signing error: No matching provisioning profile found
```

**解决方案**：
1. 在 Apple Developer Portal 创建正确的 Provisioning Profile
2. 导入证书和 Profile 到 CI 环境
3. 使用 Match 管理签名文件

#### 问题 4：依赖安装超时

```bash
Timeout while waiting for pub get
```

**解决方案**：
```yaml
# 使用国内镜像（如果在中国大陆）
- name: Set up Chinese mirror
  run: |
    export PUB_HOSTED_URL=https://pub.flutter-io.cn
    export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
    flutter pub get
```

### 9.2 调试技巧

```yaml
# 启用详细日志
- name: Verbose build
  run: flutter build apk --verbose

# 查看环境信息
- name: Environment info
  run: |
    echo "Flutter version:"
    flutter --version
    echo "Java version:"
    java -version
    echo "Gradle version:"
    cd android && ./gradlew --version
```

---

## 10. 学习资源 📚

### 官方文档

- [Flutter 官方文档 - Testing](https://docs.flutter.dev/testing)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Fastlane 文档](https://fastlane.tools)
- [Codemagic 文档](https://docs.codemagic.io)
- [Bitrise 文档](https://devcenter.bitrise.io)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)

### 推荐文章

- [Flutter CI/CD 最佳实践](https://medium.com/flutter-community)
- [使用 GitHub Actions 自动化 Flutter 应用](https://blog.github.com)
- [Fastlane + Flutter 完整指南](https://medium.com/fastlane)

### 示例仓库

- [flutter-cd](https://github.com/invertase/flutter-cd) - React Native & Flutter CD 示例
- [flutter-ci-example](https://github.com) - 各种 CI 工具的示例配置

---

## 11. 总结对比 📊

| 特性 | GitHub Actions | Fastlane | Codemagic | Bitrise | Firebase App Dist |
|------|--------------|----------|-----------|---------|-------------------|
| **价格** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Flutter 支持** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **自定义能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **集成生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **适合场景** | 开源/技术团队 | 企业级/复杂流程 | 快速上手 | 移动团队优先 | 仅分发 |

### 推荐选择指南

🟢 **新手入门**：Codemagic 或 Firebase App Distribution
🟡 **中小型团队**：GitHub Actions + Firebase App Distribution
🔴 **大型企业**：Bitrise + Fastlane + 自建基础设施

---

> 💡 **提示**：选择 CI/CD 工具时，考虑团队规模、技术栈、预算和具体需求。大多数情况下，GitHub Actions + Firebase App Distribution 已经能满足 80% 的需求！