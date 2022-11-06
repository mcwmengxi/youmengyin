# Button 按钮

## 基本使用

`type` 属性配置不同的按钮类型

<qx-button>默认按钮</qx-button>
<qx-button type="primary">主要按钮</qx-button>
<qx-button type="success">成功按钮</qx-button>
<qx-button type="danger">危险按钮</qx-button>
<qx-button type="warning">警告按钮</qx-button>

::: details 显示代码

```html
<qx-button>默认按钮</qx-button>
<qx-button type="primary">主要按钮</qx-button>
<qx-button type="success">成功按钮</qx-button>
<qx-button type="danger">危险按钮</qx-button>
<qx-button type="warning">警告按钮</qx-button>
```

:::

## 简约按钮

`simple` 属性可以配置简约按钮

<qx-button simple>默认按钮</qx-button>
<qx-button simple type="primary">主要按钮</qx-button>
<qx-button simple type="success">成功按钮</qx-button>
<qx-button simple type="danger">危险按钮</qx-button>
<qx-button simple type="warning">警告按钮</qx-button>

::: details 显示代码

```html
<qx-button simple>默认按钮</qx-button>
<qx-button simple type="primary">主要按钮</qx-button>
<qx-button simple type="success">成功按钮</qx-button>
<qx-button simple type="danger">危险按钮</qx-button>
<qx-button simple type="warning">警告按钮</qx-button>
```

:::

## 图标按钮

`icon` 属性可以配置图标按钮

<qx-button icon="qx-ui-setting-filling">设置</qx-button>
<qx-button icon="qx-ui-qxui" type="primary">qx-ui</qx-button>
<qx-button icon="qx-ui-fabulous" type="success" />
<qx-button icon="qx-ui-discount" type="danger" />
<qx-button icon="qx-ui-chart-bar" type="warning" />

::: details 显示代码

```html
<qx-button icon="qx-ui-setting-filling">设置</qx-button>
<qx-button icon="qx-ui-qxui" type="primary">qx-ui</qx-button>
<qx-button icon="qx-ui-fabulous" type="success" />
<qx-button icon="qx-ui-discount" type="danger" />
<qx-button icon="qx-ui-chart-bar" type="warning" />
```

:::

## 禁用状态

`disabled` 属性可以配置禁用状态

<qx-button disabled>默认按钮</qx-button>
<qx-button disabled type="primary">主要按钮</qx-button>
<qx-button disabled type="success">成功按钮</qx-button>
<qx-button disabled type="danger">危险按钮</qx-button>
<qx-button disabled type="warning">警告按钮</qx-button>

<br />

<qx-button simple disabled>默认按钮</qx-button>
<qx-button simple disabled type="primary">主要按钮</qx-button>
<qx-button simple disabled type="success">成功按钮</qx-button>
<qx-button simple disabled type="danger">危险按钮</qx-button>
<qx-button simple disabled type="warning">警告按钮</qx-button>

::: details 显示代码

```html
<qx-button disabled>默认按钮</qx-button>
<qx-button disabled type="primary">主要按钮</qx-button>
<qx-button disabled type="success">成功按钮</qx-button>
<qx-button disabled type="danger">危险按钮</qx-button>
<qx-button disabled type="warning">警告按钮</qx-button>

<qx-button simple disabled>默认按钮</qx-button>
<qx-button simple disabled type="primary">主要按钮</qx-button>
<qx-button simple disabled type="success">成功按钮</qx-button>
<qx-button simple disabled type="danger">危险按钮</qx-button>
<qx-button simple disabled type="warning">警告按钮</qx-button>
```

:::

## 圆角按钮

`round` 属性可以配置圆角按钮

`square` 属性可以配置方形按钮

<qx-button round>默认按钮</qx-button>
<qx-button round type="primary">主要按钮</qx-button>
<qx-button round type="success">成功按钮</qx-button>
<qx-button round type="danger">危险按钮</qx-button>
<qx-button round type="warning">警告按钮</qx-button>

<br />

<qx-button square>默认按钮</qx-button>
<qx-button square type="primary">主要按钮</qx-button>
<qx-button square type="success">成功按钮</qx-button>
<qx-button square type="danger">危险按钮</qx-button>
<qx-button square type="warning">警告按钮</qx-button>

::: details 显示代码

```html
<qx-button round>默认按钮</qx-button>
<qx-button round type="primary">主要按钮</qx-button>
<qx-button round type="success">成功按钮</qx-button>
<qx-button round type="danger">危险按钮</qx-button>
<qx-button round type="warning">警告按钮</qx-button>

<qx-button square>默认按钮</qx-button>
<qx-button square type="primary">主要按钮</qx-button>
<qx-button square type="success">成功按钮</qx-button>
<qx-button square type="danger">危险按钮</qx-button>
<qx-button square type="warning">警告按钮</qx-button>
```

:::

## 按钮组

使用 `qx-button-group` 标签来嵌套按钮

<qx-button-group>
  <qx-button type="primary">上一页</qx-button>
  <qx-button type="primary">下一页</qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button simple type="primary">左</qx-button>
  <qx-button simple type="success">右</qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button icon="qx-ui-arrow-left-filling" type="primary"></qx-button>
  <qx-button icon="qx-ui-arrow-right-filling" type="success"></qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button type="primary">左</qx-button>
  <qx-button type="success">中</qx-button>
  <qx-button type="primary">右</qx-button>
</qx-button-group>

::: details 显示代码

```html
<qx-button-group>
  <qx-button type="primary">上一页</qx-button>
  <qx-button type="primary">下一页</qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button simple type="primary">左</qx-button>
  <qx-button simple type="success">右</qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button icon="qx-ui-arrow-left-filling" type="primary"></qx-button>
  <qx-button icon="qx-ui-arrow-right-filling" type="success"></qx-button>
</qx-button-group>

<qx-button-group>
  <qx-button type="primary">左</qx-button>
  <qx-button type="success">中</qx-button>
  <qx-button type="primary">右</qx-button>
</qx-button-group>
```

:::

## 不同尺寸

`size` 属性可以配置按钮尺寸

<qx-button size="mini" type="primary">小型按钮</qx-button>
<qx-button size="small" type="primary">中等按钮</qx-button>
<qx-button type="primary">正常大小</qx-button>
<qx-button size="large" type="primary">大号按钮</qx-button>

<br />

<qx-button simple size="mini" type="primary">小型按钮</qx-button>
<qx-button simple size="small" type="primary">中等按钮</qx-button>
<qx-button simple type="primary">正常大小</qx-button>
<qx-button simple size="large" type="primary">大号按钮</qx-button>

::: details 显示代码

```html
<qx-button size="mini" type="primary">小型按钮</qx-button>
<qx-button size="small" type="primary">中等按钮</qx-button>
<qx-button type="primary">正常大小</qx-button>
<qx-button size="large" type="primary">大号按钮</qx-button>

<qx-button simple size="mini" type="primary">小型按钮</qx-button>
<qx-button simple size="small" type="primary">中等按钮</qx-button>
<qx-button simple type="primary">正常大小</qx-button>
<qx-button simple size="large" type="primary">大号按钮</qx-button>
```

:::

## loading 状态

`loading` 属性可以配置 `loading` 状态下的按钮

<qx-button loading>默认按钮</qx-button>
<qx-button loading type="primary">主要按钮</qx-button>
<qx-button loading type="success">成功按钮</qx-button>
<qx-button loading type="danger">危险按钮</qx-button>
<qx-button loading type="warning">警告按钮</qx-button>

::: details 显示代码

```html
<qx-button loading>默认按钮</qx-button>
<qx-button loading type="primary">主要按钮</qx-button>
<qx-button loading type="success">成功按钮</qx-button>
<qx-button loading type="danger">危险按钮</qx-button>
<qx-button loading type="warning">警告按钮</qx-button>
```

:::

## Attributes

| 参数     | 说明           | 类型    | 可选值                                         | 默认值  |
| -------- | -------------- | ------- | ---------------------------------------------- | ------- |
| type     | 按钮的类型     | string  | default / primary / success / danger / warning | default |
| round    | 是否为圆角按钮 | boolean | ——                                             | false   |
| simple   | 简约按钮       | boolean | ——                                             | false   |
| disabled | 按钮是否禁用   | boolean | ——                                             | false   |
| icon     | 按钮上的 icon  | string  | ——                                             | ——      |
| size     | 按钮尺寸       | string  | large / small / mini                           | ——      |
| square   | 方形按钮       | boolean | ——                                             | false   |
| loading  | loading 状态   | boolean | ——                                             | false   |
| block    | 是否为块级元素 | boolean | ——                                             | false   |

<style scoped>
.qx-button-group,
.qx-button {
  margin: 5px;
}
.qx-button-group-vertical .qx-button,
.qx-button-group .qx-button {
  margin: 0;
}
</style>
