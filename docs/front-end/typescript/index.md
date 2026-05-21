# TypeScript 学习指南

> 从类型基础到工程实践的完整学习路径

## 📚 学习路径总览

本指南按照由浅入深的方式组织 TypeScript 知识体系，帮助你系统性地掌握这门强类型语言：

```
入门基础 → 类型系统 → 面向对象 → 高级类型 → 工程实践 → 深入原理
```

---

## 第一阶段：TypeScript 入门（base 系列）

系统学习 TypeScript 基础知识，建立完整的类型思维

### 1.1 认识 TypeScript

- [1. 前言与安装](./base/base-1.md)
  - TypeScript 简介（JavaScript 的超集）
  - 为什么要学习 TypeScript
  - 安装与配置环境
  - tsc 编译命令的使用
  - 第一个 TypeScript 程序

### 1.2 基础类型

- [2. 基础类型](./base/base-2.md)
  - boolean 布尔类型
  - number 数字类型（支持二进制、八进制、十六进制）
  - string 字符串类型（模板字符串）
  - void 空值类型
  - null 和 undefined
  - any 任意类型

### 1.3 类与面向对象

- [3. 类](./base/base-3.md)
  - class 类的定义
  - constructor 构造函数
  - extends 继承
  - public / private / protected 修饰符
  - 抽象类（abstract）
  - getter / setter 存取器
  - static 静态属性和方法
  - implements 实现接口

### 1.4 接口 Interfaces

- [4. 接口](./base/base-4.md)
  - 接口的定义与用途
  - 用接口定义对象形状（Shape）
  - 可选属性 `?`
  - 只读属性 `readonly`
  - 任意属性
  - 接口继承接口
  - 接口继承类

### 1.5 函数类型

- [5. 函数的类型](./base/base-5.md)
  - 函数声明式定义
  - 函数表达式定义
  - 参数类型约束
  - 返回值类型约束
  - 用接口定义函数形状
  - 可选参数和默认参数
  - 剩余参数
  - 函数重载

### 1.6 类型进阶

- [6. 类型别名/字面量类型](./base/base-6.md)
  - type 类型别名
  - 字符串字面量类型
  - 联合类型 `|`
  - 交叉类型 `&`
  - 内置对象类型
  - 类数组（ArrayLike）

### 1.7 声明文件

- [7. 声明文件](./base/base-7.md)
  - declare 关键字
  - .d.ts 文件的作用
  - 第三方库的类型声明
  - @types 类型包
  - 全局声明 vs 模块声明

### 1.8 装饰器 Decorator

- [8. 装饰器](./base/base-8.md)
  - 装饰器的基本概念
  - experimentalDecorators 配置
  - 类装饰器
  - 方法装饰器
  - 属性装饰器
  - 参数装饰器
  - 装饰器工厂
  - AOP 面向切面编程思想

### 1.9 泛型 Generics

- [9. 泛型与声明合并](./base/base-9.md)
  - 泛型函数 `<T>`
  - 泛型接口
  - 泛型类
  - 泛型约束 `extends`
  - 多个泛型参数
  - 声明合并

### 1.10 工程化配置

- [10. 代码检查与编译选项](./base/base-10.md)
  - ESLint + TypeScript 配置
  - tsconfig.json 详解
  - compilerOptions 常用选项
  - strict 严格模式
  - 自动编译与热更新

---

## 第二阶段：核心概念速查

快速查阅 TypeScript 核心知识点

- [TypeScript 入门速查](./base.md)

  - VSCode Inlay Hints 配置
  - 原始类型标注语法
  - 对象类型与 interface
  - 数组类型定义
  - TypeScript Playground 使用

- [基础类型详解](./basic.md)

  - Boolean、Number、String
  - null 与 undefined
  - void 类型
  - any vs unknown 类型层级
  - Object vs object vs {}
  - top type 与 bottom type

- [数据类型实战](./type.md)
  - 原始类型的完整用法
  - 字面量联合类型
  - 对象类型详细定义
  - 可选属性与必填属性
  - 数组类型多种写法
  - 元组 Tuple 类型
  - 枚举 enum
  - 联合类型与交叉类型

---

## 第三阶段：类型系统深入

掌握 TypeScript 强大的类型推断与保护机制

- [TS 核心：类型保护](./ts-core.md)
  - typeof 类型检查
  - instanceof 类型检查
  - 自定义类型保护函数
  - 可辨识联合（Discriminated Union）
  - in 操作符类型保护
  - 类型断言 as
  - 非空断言 !

---

## 第四阶段：高级类型系统

深入理解 TypeScript 的类型体操与工具类型

### 4.1 泛型编程

- [泛型完全指南](./generics.md)
  - 为什么需要泛型
  - 泛型函数的编写
  - 泛型数组处理
  - 泛型接口设计
  - 泛型类的实现
  - 泛型约束（extends）
  - 条件泛型
  - 泛型在框架中的应用

### 4.2 工具类型 Utility Types

- [高级类型 Advanced Type](./advanced-type.md)
  - **Partial<T>** - 所有属性变为可选
  - **Required<T>** - 所有属性变为必填
  - **Readonly<T>** - 只读属性
  - **Pick<T, K>** - 选取部分属性
  - **Omit<T, K>** - 排除部分属性
  - **Record<K, V>** - 键值对映射
  - **Exclude<T, U>** - 排除联合类型成员
  - **Extract<T, U>** - 提取联合类型成员
  - **NonNullable<T>** - 排除 null 和 undefined
  - **ReturnType<T>** - 获取函数返回值类型
  - **Parameters<T>** - 获取函数参数类型元组
  - 工具类型的实现原理
  - 组合使用多个工具类型

### 4.3 映射类型 Mapped Types

- [映射类型](./mapped-types.md)
  - 映射类型基本语法 `[Key in keyof Type]`
  - 遍历接口属性
  - 修改属性可选性 `?`
  - 修改属性只读性 readonly
  - 映射类型 + 条件类型
  - 映射类型 + infer
  - 实际应用场景

### 4.4 类型变异性

- [逆变、协变、双向协变和不变](./covariance-contravariance-bivariance-invariance.md)
  - 协变（Covariance）
  - 逆变（Contravariance）
  - 双向协变（Bivariance）
  - 不变性（Invariance）
  - 函数参数的严格检查
  - strictFunctionTypes 配置

---

## 第五阶段：装饰器进阶

掌握装饰器的实际应用场景

- [装饰器完全指南](./decorator.md)
  - 📖 装饰器概述与原理
  - 🚀 TS 5.0+ 新版装饰器 vs 旧版
  - 🏗️ 类装饰器（修改/替换类）
  - 🔧 方法装饰器（拦截方法调用）
  - 🔐 访问器装饰器
  - 📦 属性装饰器
  - 📝 参数装饰器
  - 🏭 装饰器工厂模式
  - ⚡ 元数据反射（reflect-metadata）
  - 💡 实际应用案例（日志、验证、缓存等）

---

## 第六阶段：其他重要特性

- [其它特性](./other.md)
  - tsconfig.json 配置生成
  - 类的定义与实例化
  - public / private / protected 修饰符
  - 访问控制符的实际应用
  - 抽象类与接口的区别

---

## 第七阶段：工程实践与最佳实践

将 TypeScript 应用于真实项目开发

### 7.1 最佳实践

- [TS 类型定义最佳实践](./ts-best-practice.md)
  - ✅ 不要使用 any（用 unknown 替代）
  - ✅ 类型声明统一放在 .d.ts 文件
  - ✅ 使用 import type 导入类型
  - ✅ 使用 TS 原始类型而非包装类型
  - ✅ eslint-ts-plugin 规则推荐
  - ✅ 严格的 tsconfig.json 配置建议
  - ✅ 项目目录结构规范

### 7.2 核心概念对比

- [TS 核心概念对比](./ts-key-concepts.md)
  - **any vs unknown** 的区别与选择
  - **const vs readonly** 的使用场景
  - **Tuple vs Array** 的区别与应用
  - **interface vs type** 的取舍
  - **enum vs const object** 的优劣
  - **class vs interface** 的设计哲学

### 7.3 编译原理

- [TS 编译原理](./ts-compilation-principles.md)
  - TypeScript 编译流程
  - 词法分析、语法分析、语义分析
  - 类型检查机制
  - Code Generation（代码生成）
  - Source Map 生成
  - 增量编译策略
  - TypeScript 与 Babel 的关系

---

## 🔗 学习路径推荐

### 🌱 初学者路径（零基础 → 入门）

```
base-1（认识TS）→ base-2（基础类型）→ base-3（类）→ base-4（接口）
→ base-5（函数）→ base-6（类型别名）→ base.md（速查巩固）
```

**预计时间**：2-3 周

### 🚀 进阶开发者路径（有 JS 基础 → 熟练）

```
basic.md → type.md → ts-core.md → generics.md → advanced-type.md
→ mapped-types.md → decorator.md
```

**预计时间**：2-3 周

### 🎯 高级工程师路径（精通 → 专家）

```
ts-key-concepts.md → covariance-contravariance-bivariance-invariance.md
→ ts-best-practice.md → ts-compilation-principles.md
→ supertask（并发控制实践）
```

**预计时间**：持续学习

### 🏗️ 实战项目路径

```
base-7（声明文件）→ base-9（泛型）→ base-10（工程配置）
→ ts-best-practice.md（最佳实践）→ decorator.md（装饰器应用）
```

---

## 📊 知识体系图谱

```
┌─────────────────────────────────────────────────────────────┐
│                    TypeScript 知识体系                        │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│   基础语法    │   类型系统    │   面向对象    │    工程化         │
├─────────────┼─────────────┼─────────────┼───────────────────┤
│ • 变量声明   │ • 原始类型   │ • 类 Class   │ • tsconfig.json   │
│ • 函数定义   │ • 对象类型   │ • 接口Interface│ • ESLint集成     │
│ • 类型注解   │ • 数组类型   │ • 继承Extends│ • 声明文件.d.ts   │
│ • 类型推断   │ • 元组Tuple  │ • 泛型Generic│ • 打包构建       │
│             │ • 枚举Enum   │ • 装饰器     │ • 单元测试        │
├─────────────┴─────────────┴─────────────┴───────────────────┤
│                     高级特性                                 │
│  ┌──────────┬──────────┬──────────┬─────────────────────┐   │
│  │ 条件类型  │ 映射类型  │ 工具类型  │ 类型变异性           │   │
│  │ infer    │ keyof    │ Partial │ 协变/逆变            │   │
│  │ extends  │ in       │ Pick    │ 严格函数类型          │   │
│  └──────────┴──────────┴──────────┴─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 学习建议

### 对于 JavaScript 开发者

1. **先理解"为什么"**：TypeScript 解决了什么问题？（类型安全、IDE 支持、重构信心）
2. **保持 JS 思维**：TS 是 JS 的超集，不要被类型吓到
3. **善用 IDE**：VSCode + TypeScript 是黄金组合
4. **渐进式采用**：可以从一个文件开始，逐步迁移整个项目

### 对于后端转前端开发者

1. **关注差异点**：TS 的类型系统和 Java/C# 有相似但不同
2. **理解结构化类型**：duck typing vs nominal typing
3. **熟悉 JS 运行时**：TS 编译后的代码就是 JS

### 学习资源

- **官方文档**：[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- **在线练习**：[TypeScript Playground](https://www.typescriptlang.org/play)
- **中文教程**：[TypeScript 入门教程](https://ts.xcatliu.com/)
- **深度类型**：[Type Challenges](https://github.com/type-challenges/type-challenges)

---

## 📁 配套资源

- 本目录包含配套图片资源（[images/](./images/)），辅助理解概念：
  - execute-order.png - 执行顺序图解
  - simple-di.png - 依赖注入示意图
- base 目录提供 10 章系统性教程，适合从头学起
- 所有示例代码均可直接运行测试
- 建议结合 VSCode 编辑器进行实验性学习

---

## 🔄 与 JavaScript 学习路线对接

如果你已经完成了 [JavaScript 学习指南](../javascript/index.md)，那么：

| JavaScript 阶段 | 对应 TypeScript 内容                        |
| --------------- | ------------------------------------------- |
| 语言基础        | base-1 ~ base-6                             |
| 函数编程        | base-5, generics                            |
| 面向对象        | base-3, base-4                              |
| 异步编程        | type.md (Promise 类型)                      |
| DOM/API         | base-7 (声明文件)                           |
| 工程实践        | ts-best-practice, ts-compilation-principles |

**推荐顺序**：先完成 JavaScript 基础 → 再学习 TypeScript 类型系统 → 最后结合项目实践

---

_持续更新中...欢迎贡献和完善！_
