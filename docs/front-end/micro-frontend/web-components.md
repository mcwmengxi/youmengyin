# Web Components 前置知识

Web Components 是浏览器原生支持的组件化方案，由三个核心技术构成：Custom Elements、Shadow DOM 和 HTML Templates。理解 Web Components 是深入掌握 micro-app 等微前端方案的基础。

---

## 一、Custom Elements（自定义元素）

### 1.1 概念

Custom Elements 允许开发者定义自己的 HTML 标签，并为这些标签附加自定义行为和样式。

### 1.2 基本用法

```javascript
// 定义一个自定义元素
class MyCard extends HTMLElement {
  constructor() {
    super();
    // 元素初始化逻辑
  }

  // 元素被添加到 DOM 时调用
  connectedCallback() {
    this.innerHTML = `<div>Hello, I'm a custom card!</div>`;
  }

  // 元素从 DOM 移除时调用
  disconnectedCallback() {
    // 清理逻辑
  }

  // 属性变化时调用
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);
  }

  // 声明需要监听的属性
  static get observedAttributes() {
    return ['title', 'size'];
  }
}

// 注册自定义元素（名称必须包含短横线）
customElements.define('my-card', MyCard);
```

```html
<!-- 使用自定义元素 -->
<my-card title="卡片标题" size="large"></my-card>
```

### 1.3 生命周期

| 生命周期回调 | 触发时机 |
|-------------|---------|
| `constructor()` | 元素被创建时 |
| `connectedCallback()` | 元素插入 DOM 时 |
| `disconnectedCallback()` | 元素从 DOM 移除时 |
| `adoptedCallback()` | 元素移动到新文档时 |
| `attributeChangedCallback()` | 监听的属性发生变化时 |

### 1.4 在微前端中的应用

micro-app 方案正是基于 Custom Elements 实现：每个子应用被封装为一个自定义元素 `<micro-app>`，通过自定义元素的挂载/卸载生命周期来管理子应用的加载和销毁。

---

## 二、Shadow DOM（影子 DOM）

### 2.1 概念

Shadow DOM 提供 DOM 和 CSS 的封装隔离能力，让元素的内部结构、样式与外部页面完全隔离。

### 2.2 基本用法

```javascript
const host = document.getElementById('container');
const shadowRoot = host.attachShadow({ mode: 'open' });

shadowRoot.innerHTML = `
  <style>
    p { color: red; }       /* 只在 Shadow DOM 内部生效 */
  </style>
  <p>这段文字是红色的，但不会影响外部</p>
`;

// 外部样式不会渗透到 Shadow DOM 内部
// Shadow DOM 内部样式也不会泄露到外部
```

### 2.3 mode 模式

| Mode | 说明 |
|------|------|
| `open` | 外部可通过 `element.shadowRoot` 访问 Shadow DOM |
| `closed` | 外部无法访问，`element.shadowRoot` 返回 `null` |

### 2.4 隔离范围

Shadow DOM 的隔离是双向的：

- **CSS 样式隔离**：Shadow DOM 内部的样式不会影响外部，外部样式也不会穿透到内部（除继承属性，如 `color`、`font-size` 等）
- **DOM 选择隔离**：`document.querySelector()` 无法选中 Shadow DOM 内部的元素
- **事件隔离**：事件在 Shadow DOM 边界处可能被重定目标（retargeting）

### 2.5 在微前端中的应用

- **micro-app**：基于 Custom Elements 加载子应用，但 CSS 隔离主要依赖属性前缀方案（类似 Vue scoped），而非 Shadow DOM 的 `strictStyleIsolation`
- **qiankun**：提供 `strictStyleIsolation` 模式，利用 Shadow DOM 包裹子应用实现严格 CSS 隔离
- **无界**：使用 Shadow DOM 实现 CSS 隔离，同时用 iframe 实现 JS 隔离

---

## 三、HTML Templates（HTML 模板）

### 3.1 概念

`<template>` 标签定义不会在页面加载时渲染的 HTML 片段，可以在运行时通过 JavaScript 实例化。

### 3.2 基本用法

```html
<template id="card-template">
  <style>
    .card { border: 1px solid #eee; padding: 16px; }
  </style>
  <div class="card">
    <h3 class="title"></h3>
    <p class="content"></p>
  </div>
</template>

<script>
  const template = document.getElementById('card-template');
  const instance = template.content.cloneNode(true);
  instance.querySelector('.title').textContent = '卡片标题';
  instance.querySelector('.content').textContent = '卡片内容';
  document.body.appendChild(instance);
</script>
```

### 3.3 特性

- `<template>` 内的内容不会渲染、不会加载资源（如图片）
- `content` 属性返回 `DocumentFragment`，可高效克隆
- 通常与 Custom Elements + Shadow DOM 组合使用

---

## 四、三者组合实践

一个完整的 Web Component 通常同时使用三项技术：

```javascript
class MyCard extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('card-template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.title').textContent =
      this.getAttribute('title') || '默认标题';
  }
}

customElements.define('my-card', MyCard);
```

---

## 五、浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Custom Elements | 67+ | 63+ | 10.1+ | 79+ |
| Shadow DOM | 53+ | 63+ | 10+ | 79+ |
| HTML Templates | 54+ | 63+ | 9+ | 79+ |

微前端方案中，micro-app 依赖 Web Components 特性，不支持的浏览器需 polyfill。qiankun 和无界对此没有硬性依赖。