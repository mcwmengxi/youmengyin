# Kotlin 简介与环境搭建

## Kotlin 概述

Kotlin 是由 JetBrains 开发的一种现代化、静态类型的编程语言。它于 2017 年被 Google 宣布为 Android 开发的一级语言，具有以下特点：

- **简洁性**：相比 Java，Kotlin 代码更简洁，减少了样板代码
- **安全性**：通过空安全机制避免了空指针异常
- **互操作性**：与 Java 100% 互操作，可以在现有项目中逐步迁移
- **多平台**：不仅可用于 Android 开发，还能用于服务端、Web 前端、桌面应用等

## 环境搭建

### 1. Android Studio 配置

Android Studio 已经内置了对 Kotlin 的完整支持：

1. 创建新项目时选择 "Include Kotlin support"
2. 对于现有项目，使用 `Tools > Kotlin > Configure Kotlin in Project`
3. 在 Gradle 文件中添加 Kotlin 插件

### 2. 独立开发环境

如果想单独学习 Kotlin 语法：

1. 访问 [Kotlin 官网](https://kotlinlang.org/) 下载编译器
2. 使用 Kotlin REPL 进行交互式学习
3. 使用在线编辑器 [Try Kotlin](https://try.kotlinlang.org/)

## 第一个 Kotlin 程序

```kotlin
fun main() {
    println("Hello, Kotlin!")
}

// 或者带参数的版本
fun main(args: Array<String>) {
    println("Hello, ${args.getOrNull(0) ?: "World"}!")
}
```

## Kotlin vs Java 主要差异

| 特性 | Java | Kotlin |
|------|------|--------|
| 变量声明 | `int age = 25;` | `var age = 25` |
| 常量声明 | `final int age = 25;` | `val age = 25` |
| 字符串模板 | `"Name: " + name` | `"Name: $name"` 或 `"Name: ${expression}"` |
| 空安全 | 无内置支持 | `var name: String? = null` |
| getter/setter | 需要显式定义 | 属性自动提供 |
| 导入 | `import package.ClassName;` | `import package.ClassName` |

## Kotlin 代码结构

```kotlin
// 包声明
package com.example.myapp

// 导入语句
import kotlin.collections.*

// 函数定义
fun greet(name: String): String {
    return "Hello, $name!"
}

// 类定义
class Person(val name: String, var age: Int) {
    fun greet() = "Hi, I'm $name"
}

// 全局变量
val PI = 3.14159
```

## 项目配置示例

### build.gradle (Module: app)

```gradle
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'

android {
    compileSdkVersion 33
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    implementation 'androidx.core:core-ktx:1.6.0'
    // 其他依赖...
}
```

## 学习资源

- [官方文档](https://kotlinlang.org/docs/home.html)
- [Kotlin 语言中文站](https://www.kotlincn.net/)
- [Kotlin Koans](https://play.kotlinlang.org/koans) - 交互式练习