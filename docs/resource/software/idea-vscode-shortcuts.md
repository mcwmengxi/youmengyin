---
description: IDEA 与 VSCode 快捷键对照表
---

<BackTop />

# IDEA 与 VSCode 快捷键对照表

## 通用编辑

| 功能          | IDEA                         | VSCode                                  |
| ------------- | ---------------------------- | --------------------------------------- |
| 复制当前行    | `Ctrl + D`                   | `Shift + Alt + ↑ / ↓`                   |
| 删除当前行    | `Ctrl + Y`                   | `Ctrl + Shift + K`                      |
| 大小写转换    | `Ctrl + Shift + U`           | `Ctrl + Shift + U`                      |
| 展开/折叠代码 | `Ctrl + +/-`                 | `Ctrl + Shift + [/]`                    |
| 展开/折叠所有 | `Ctrl + Shift + +/-`         | `Ctrl + K Ctrl + 0 / Ctrl + K Ctrl + J` |
| 移动代码行    | `Alt + Shift + ↑ / ↓`        | `Alt + ↑ / ↓`                           |
| 移动代码块    | `Ctrl + Shift + Alt + ↑ / ↓` | `Alt + Shift + ↑ / ↓`                   |

## 查找与替换

| 功能        | IDEA                      | VSCode             |
| ----------- | ------------------------- | ------------------ |
| 查找        | `Ctrl + F`                | `Ctrl + F`         |
| 替换        | `Ctrl + R`                | `Ctrl + H`         |
| 文件内查找  | `Ctrl + Shift + F`        | `Ctrl + Shift + F` |
| 全局查找    | `Ctrl + Shift + Alt + F7` | `Ctrl + Shift + F` |
| 全局替换    | `Ctrl + Shift + R`        | `Ctrl + Shift + H` |
| 查找 Action | `Ctrl + Shift + A`        | `Ctrl + Shift + P` |

## 导航

| 功能       | IDEA                 | VSCode                  |
| ---------- | -------------------- | ----------------------- |
| 跳转至符号 | `Ctrl + F12`         | `Ctrl + Shift + O`      |
| 跳转至类   | `Ctrl + N`           | `Ctrl + P` (输入文件名) |
| 跳转至文件 | `Ctrl + Shift + N`   | `Ctrl + P`              |
| 跳转至行   | `Ctrl + G`           | `Ctrl + G`              |
| 后退/前进  | `Ctrl + Alt + ← / →` | `Alt + ← / →`           |
| 跳转到声明 | `Ctrl + B`           | `F12` 或 `Ctrl + Click` |
| 查找用法   | `Alt + F7`           | `Shift + Alt + F12`     |
| 快速修复   | `Alt + Enter`        | `Ctrl + .`              |

## 代码操作

| 功能            | IDEA             | VSCode                               |
| --------------- | ---------------- | ------------------------------------ |
| 格式化代码      | `Ctrl + Alt + L` | `Ctrl + Shift + I`                   |
| 优化导入        | `Ctrl + Alt + O` | `Ctrl + Shift + O`                   |
| 代码补全        | `Ctrl + Space`   | `Ctrl + Space`                       |
| 快速生成        | `Alt + Insert`   | `Ctrl + Enter`                       |
| 重构 - 重命名   | `Shift + F6`     | `F2`                                 |
| 重构 - 提取方法 | `Ctrl + Alt + M` | `Ctrl + Shift + R` (选择 "提取方法") |
| Surround With   | `Ctrl + Alt + T` | `Ctrl + Shift + T`                   |
| 内联            | `Ctrl + Alt + N` | `Ctrl + Shift + R` (选择 "内联")     |

## 注释

| 功能     | IDEA               | VSCode             |
| -------- | ------------------ | ------------------ |
| 行注释   | `Ctrl + /`         | `Ctrl + /`         |
| 块注释   | `Ctrl + Shift + /` | `Ctrl + Shift + A` |
| 文档注释 | `/** + Tab`        | `/** + Enter`      |

## 调试与运行

| 功能     | IDEA          | VSCode |
| -------- | ------------- | ------ |
| 运行     | `Shift + F10` | `F5`   |
| 调试     | `Shift + F9`  | `F5`   |
| 单步跳过 | `F8`          | `F10`  |
| 单步进入 | `F7`          | `F11`  |
| 继续执行 | `F9`          | `F5`   |
| 设置断点 | `Ctrl + F8`   | `F9`   |

## 版本控制

| 功能     | IDEA               | VSCode             |
| -------- | ------------------ | ------------------ |
| 提交     | `Ctrl + K`         | `Ctrl + Shift + G` |
| 推送     | `Ctrl + Shift + K` | `Ctrl + Shift + G` |
| 差异查看 | `Ctrl + D`         | `Ctrl + Shift + D` |

## IDEA 特有快捷键

以下是 IDEA 独有且非常实用的快捷键，VSCode 中没有直接对应的功能：

### 代码分析与重构

| 快捷键                  | 功能     | 说明                   |
| ----------------------- | -------- | ---------------------- |
| `Ctrl + Alt + V`        | 提取变量 | 将表达式提取为局部变量 |
| `Ctrl + Alt + C`        | 提取常量 | 将表达式提取为常量     |
| `Ctrl + Alt + P`        | 提取参数 | 将表达式提取为方法参数 |
| `Ctrl + Alt + M`        | 提取方法 | 将代码块提取为独立方法 |
| `Ctrl + Shift + Delete` | 撤销重构 | 撤销上一次重构操作     |
| `Ctrl + W`              | 扩展选中 | 逐步扩展代码选中范围   |
| `Ctrl + Shift + W`      | 缩小选中 | 逐步缩小代码选中范围   |

### 文件与项目结构

| 快捷键                   | 功能             | 说明                       |
| ------------------------ | ---------------- | -------------------------- |
| `Ctrl + F12`             | 弹出文件结构     | 快速查看和跳转文件内的成员 |
| `Ctrl + H`               | 显示类继承结构   | 查看类的层次结构           |
| `Ctrl + Shift + H`       | 显示方法层次结构 | 查看方法的调用层次         |
| `Ctrl + Alt + H`         | 显示调用层次结构 | 查看方法被调用的位置       |
| `Ctrl + N`               | 跳转到类         | 按类名搜索并跳转           |
| `Ctrl + Shift + N`       | 跳转到文件       | 按文件名搜索并跳转         |
| `Ctrl + Shift + Alt + N` | 跳转到符号       | 跳转到方法、字段等符号     |
| `Alt + F1`               | 选择并定位       | 选择当前文件并在导航栏定位 |
| `Ctrl + E`               | 最近文件         | 弹出最近打开的文件列表     |
| `Ctrl + Tab`             | 切换文件         | 在打开的文件间快速切换     |

### 代码生成

| 快捷键         | 功能         | 说明                                      |
| -------------- | ------------ | ----------------------------------------- |
| `Alt + Insert` | 生成代码     | 生成构造方法、getter/setter 等            |
| `Ctrl + J`     | 插入模板     | 插入 Live Template（如 `sout`、`for` 等） |
| `iter` + Tab   | 迭代循环     | 生成增强 for 循环                         |
| `itar` + Tab   | 数组迭代     | 生成数组迭代循环                          |
| `psvm` + Tab   | main 方法    | 生成 public static void main              |
| `ifn` + Tab    | null 检查    | 生成 if (xxx == null)                     |
| `inn` + Tab    | 非 null 检查 | 生成 if (xxx != null)                     |

### 书签与标记

| 快捷键        | 功能           | 说明                     |
| ------------- | -------------- | ------------------------ |
| `F11`         | 添加书签       | 为当前行添加书签         |
| `Ctrl + F11`  | 添加带编号书签 | 添加可快速跳转的编号书签 |
| `Shift + F11` | 显示书签       | 查看和管理所有书签       |
| `Ctrl + 数字` | 跳转到书签     | 快速跳转到对应编号的书签 |

### 其他实用快捷键

| 快捷键                   | 功能          | 说明                                   |
| ------------------------ | ------------- | -------------------------------------- |
| `Ctrl + Shift + A`       | 查找 Action   | 通过动作名称搜索 IDEA 功能             |
| `Ctrl + Alt + S`         | 打开 Settings | 打开 IDEA 设置对话框                   |
| `Ctrl + Alt + Shift + S` | 打开项目结构  | 打开项目结构设置                       |
| `Ctrl + D`               | 复制行/比较   | 向下复制当前行，或在差异查看时并列显示 |
| `Ctrl + Y`               | 删除行        | 删除当前行                             |
| `Ctrl + Shift + U`       | 大小写切换    | 切换选中内容的大小写                   |
| `Ctrl + /`               | 行注释        | 切换行注释                             |
| `Ctrl + Shift + /`       | 块注释        | 切换块注释                             |
| `Alt + F7`               | 查找用法      | 查找光标所在符号的所有使用位置         |
| `Ctrl + B`               | 跳转到声明    | 跳转到变量或方法的声明处               |
| `Ctrl + Alt + B`         | 跳转到实现    | 跳转到接口或抽象方法的实现             |
| `Alt + Enter`            | 快速修复      | 显示意图操作和快速修复建议             |
| `Ctrl + O`               | 重写方法      | 选择并插入需要重写的方法               |
| `Ctrl + I`               | 实现接口      | 选择并插入需要实现的方法               |
| `Ctrl + F6`              | 更改签名      | 修改方法的名称、参数等                 |

## 修改 IDEA 快捷键映射

如果希望 IDEA 的快捷键与 VSCode 一致，可以通过以下步骤进行映射：

### 方法一：通过 Settings 修改

1. 打开 IDEA，选择 **File → Settings**（或 `Ctrl + Alt + S`）
2. 左侧菜单选择 **Keymap**
3. 在搜索框中搜索需要修改的动作名称
4. 右键点击该动作，选择 **Add Keyboard Shortcut**
5. 按下希望设置的快捷键组合
6. 点击 **OK** 保存

### 方法二：导入 VSCode Keymap 插件

JetBrains 官方提供了 VSCode Keymap 插件，可以一键导入 VSCode 的快捷键习惯：

1. 打开 IDEA，进入 **File → Settings → Plugins**
2. 搜索 **VSCode Keymap** 或 **Key Promoter X**
3. 点击 **Install** 安装插件
4. 重启 IDEA 后生效

### 常用 IDEA 快捷键修改建议

| 原 IDEA 快捷键   | 修改为                | 功能                                   |
| ---------------- | --------------------- | -------------------------------------- |
| `Ctrl + D`       | `Shift + Alt + ↑ / ↓` | 复制当前行（改为上下复制而非向下复制） |
| `Ctrl + Y`       | `Ctrl + Shift + K`    | 删除当前行（与 VSCode 保持一致）       |
| `Ctrl + Alt + L` | `Ctrl + Shift + I`    | 格式化代码                             |
| `Ctrl + Alt + O` | `Ctrl + Shift + O`    | 优化导入                               |

### 注意事项

- 修改快捷键时需注意避免与其他快捷键冲突
- 建议优先使用 VSCode Keymap 插件，减少手动配置工作量
- 部分快捷键可能因插件冲突无法生效，需逐一排查
