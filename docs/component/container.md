# Container 布局容器

## 基本使用

用于布局的容器组件，方便快速搭建页面的基本结构：

`<qx-container>`：外层容器

`<qx-header>`：顶栏容器

`<qx-aside>`：侧边栏容器

`<qx-main>`：主要区域容器

`<qx-footer>`：底栏容器

常见页面布局

<qx-container>
  <qx-header>Header</qx-header>
  <qx-main>Main</qx-main>
</qx-container>

<br />

<qx-container>
  <qx-header>Header</qx-header>
  <qx-main>Main</qx-main>
  <qx-footer>Footer</qx-footer>
</qx-container>

<br />

<qx-container>
  <qx-aside width="200px">Aside</qx-aside>
  <qx-main>Main</qx-main>
</qx-container>

<br />

<qx-container>
  <qx-header>Header</qx-header>
  <qx-container>
    <qx-aside width="200px">Aside</qx-aside>
    <qx-main>Main</qx-main>
  </qx-container>
</qx-container>

<br />

<qx-container>
  <qx-header>Header</qx-header>
  <qx-container>
    <qx-aside width="200px">Aside</qx-aside>
    <qx-container>
      <qx-main>Main</qx-main>
      <qx-footer>Footer</qx-footer>
    </qx-container>
  </qx-container>
</qx-container>

<br />

<qx-container>
  <qx-aside width="200px">Aside</qx-aside>
  <qx-container>
    <qx-header>Header</qx-header>
    <qx-main>Main</qx-main>
  </qx-container>
</qx-container>

<br />

<qx-container>
  <qx-aside width="200px">Aside</qx-aside>
  <qx-container>
    <qx-header>Header</qx-header>
    <qx-main>Main</qx-main>
    <qx-footer>Footer</qx-footer>
  </qx-container>
</qx-container>

::: details 显示代码

```html
<template>
  <qx-container>
    <qx-header>Header</qx-header>
    <qx-main>Main</qx-main>
  </qx-container>

  <qx-container>
    <qx-header>Header</qx-header>
    <qx-main>Main</qx-main>
    <qx-footer>Footer</qx-footer>
  </qx-container>

  <qx-container>
    <qx-aside width="200px">Aside</qx-aside>
    <qx-main>Main</qx-main>
  </qx-container>

  <qx-container>
    <qx-header>Header</qx-header>
    <qx-container>
      <qx-aside width="200px">Aside</qx-aside>
      <qx-main>Main</qx-main>
    </qx-container>
  </qx-container>

  <qx-container>
    <qx-header>Header</qx-header>
    <qx-container>
      <qx-aside width="200px">Aside</qx-aside>
      <qx-container>
        <qx-main>Main</qx-main>
        <qx-footer>Footer</qx-footer>
      </qx-container>
    </qx-container>
  </qx-container>

  <qx-container>
    <qx-aside width="200px">Aside</qx-aside>
    <qx-container>
      <qx-header>Header</qx-header>
      <qx-main>Main</qx-main>
    </qx-container>
  </qx-container>

  <qx-container>
    <qx-aside width="200px">Aside</qx-aside>
    <qx-container>
      <qx-header>Header</qx-header>
      <qx-main>Main</qx-main>
      <qx-footer>Footer</qx-footer>
    </qx-container>
  </qx-container>
</template>

<style scoped>
  .qx-header,
  .qx-footer {
    background: #6b8bf5;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  .qx-aside {
    background: rgb(101, 173, 240);
    color: #fff;
    text-align: center;
    line-height: 200px;
  }
  .qx-main {
    background: #3178c6;
    color: #fff;
    text-align: center;
    line-height: 160px;
  }
</style>
```

:::

## qx-container Attributes

| 参数      | 说明             | 类型   | 可选值                | 默认值 |
| --------- | ---------------- | ------ | --------------------- | ------ |
| direction | 子元素的排列方向 | string | horizontal / vertical | ——     |

## qx-header Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 顶栏高度 | string | ——     | 60px   |

## qx-aside Attributes

| 参数  | 说明       | 类型   | 可选值 | 默认值 |
| ----- | ---------- | ------ | ------ | ------ |
| width | 侧边栏宽度 | string | ——     | 200px  |

## qx-footer Attributes

| 参数   | 说明     | 类型   | 可选值 | 默认值 |
| ------ | -------- | ------ | ------ | ------ |
| height | 底栏高度 | string | ——     | 60px   |

<style scoped>
  .qx-header,
  .qx-footer {
    background: #6b8bf5;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  .qx-aside {
    background: rgb(101, 173, 240);
    color: #fff;
    text-align: center;
    line-height: 200px;
  }
  .qx-main {
    background: #3178c6;
    color: #fff;
    text-align: center;
    line-height: 160px;
  }
</style>
