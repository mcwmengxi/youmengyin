---
tags:
 - 模板
title: markdown 测试页
date: 2023/03/07
---


#

## 🍦 前言

## 🦚

## 🚀

## 🛰️

## 🥕

## ⏳

## 🐬

## 🍀 写在最后

## markdown 语法

- [ ] 代办
- [x] 已完成

_斜体_ _斜体_

> **粗体**

**_粗斜体_**

### 三级标题

~~这个要被删除~~

-列表

-列表 1

- 嵌套列表

- 嵌套列表 1

  - 再嵌套

    - 再再嵌套

1. 有序列表

2. 有序列表 1

   1. 嵌套有序列表

      1. 再嵌套一个
      2. 在嵌套一个 1

   2. shift+返回上一级列表

      1. shift+]到下一级列表

Ctrl+end 键离开列表（~~这只是个注释~~）

[这是一个百度链接](https://baidu.com)

![这是一张图片](https://img2.baidu.com/it/u=3422252224,2922222092&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500)

> 这是一段索引
>
> 这也是

> > 这是嵌套引用
>
> 这是不嵌套引用

```python
print("我是代码")
```

```c++
sout<<"我也是代码";
```

| 表头 1           | 表头 2   |
| ---------------- | -------- |
| 我是表格的一部分 | 俺也一样 |
| 1                |          |
| 3                |          |
| 4                |          |
|                  |          |

---

我是两种不同的分割线

---

`俺是深色方块`

## 功能测试页

### 鼠标划过 - 边框高亮

<BorderHover />

### vite-plugin-markdown-preview

```vue preview
<template>
  <div class="flex-row-center rounded-lg w-full h-40 bg-blue-500">vue 组件预览测试</div>
</template>
```

### 时间线

::: timeline 2023-05-24

- **do some thing1**
- do some thing2
- 23

:::

::: timeline 2023-05-23

- ![测试图片](https://zx-picture-bed.oss-cn-beijing.aliyuncs.com/images/CodeSnap.png)
- do some thing4

:::

### 代办

- [ ] 模型资源预览
- [ ] 博客概览信息（文章数，网站运行天数，字数，访问量等等）,参考 Hexo 系列主题
- [x] 文章支持短链

近期完成：

::: details 详情

- [x] 推荐文章支持隐藏日期和序号的展示
- [x] 自定义主题色，防止展示时页面颜色闪烁
- [x] 标签和友链标题支持定制

:::

<br/>

::: details 待办事项选用

- [ ] &nbsp;&nbsp;markdown-it-task-checkbox
- [x] &nbsp;&nbsp;emoji

:::
