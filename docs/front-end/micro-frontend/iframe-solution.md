# iframe 微前端方案

## 一、方案概述

iframe 是最原始、最简单的微前端实现方式。利用浏览器原生提供的 `<iframe>` 标签，将不同来源的页面嵌入到同一个父页面中运行，浏览器自动提供 JS 执行上下文隔离和 CSS 隔离。

## 二、使用方式

```html
<!-- 主应用 -->
<html>
<body>
  <div id="app">
    <nav>
      <a onclick="switchApp('/app1')">子应用A</a>
      <a onclick="switchApp('/app2')">子应用B</a>
    </nav>
    <iframe id="sub-app-frame" src="/app1"></iframe>
  </div>

  <script>
    function switchApp(url) {
      document.getElementById('sub-app-frame').src = url;
    }
  </script>
</body>
</html>
```

```javascript
// 主应用与子应用通信
// 主应用 → 子应用
const iframe = document.getElementById('sub-app-frame');
iframe.contentWindow.postMessage({ type: 'UPDATE', data: {} }, '*');

// 子应用接收消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'UPDATE') {
    // 处理主应用发来的消息
  }
});

// 子应用 → 主应用
window.parent.postMessage({ type: 'NAVIGATE', path: '/page1' }, '*');
```

## 三、优点

### 3.1 原生隔离，完美安全

每个 iframe 拥有独立的浏览器上下文（独立的 window、document、全局作用域），浏览器保证各 iframe 之间的 JS 和 CSS 完全隔离，无需任何额外的沙箱逻辑。

### 3.2 接入简单，无需改造

子应用无需做任何代码层面的改造，只需提供一个可访问的 URL 即可嵌入，对老旧系统极其友好。

### 3.3 技术栈完全无关

主应用和子应用可以使用完全不同的技术栈、构建工具、框架，互不影响。

### 3.4 独立部署天然支持

每个 iframe 对应独立的部署单元，天然满足独立部署的需求。

## 四、缺点与解决方案

### 4.1 DOM 割裂

**问题**：iframe 内部的弹窗、下拉菜单、Tooltip 等浮层组件被限制在 iframe 框内，无法覆盖到主应用的区域，且会出现双滚动条。

```text
┌──────────────────────────────────┐
│  主应用                          │
│  ┌──────────────────────────────┐│
│  │ 子应用（iframe）              ││ ← 弹窗被限制在这个框内
│  │  ┌──────────────┐            ││
│  │  │ 下拉菜单     │ ←出不去   ││
│  │  └──────────────┘            ││
│  └──────────────────────────────┘│
└──────────────────────────────────┘
```

**缓解方案**：子应用内部的 UI 组件尽量避免使用 position: fixed 的浮层，改用嵌入式布局。

### 4.2 URL 状态丢失

**问题**：刷新页面时 iframe 会回到初始 URL，子应用内部的路由状态丢失。浏览器前进后退对 iframe 内部无效。

**缓解方案**：
```javascript
// 主应用同步 URL 到 iframe
const iframe = document.querySelector('#sub-app-frame');
iframe.addEventListener('load', () => {
  // 监听子应用的路由变化消息
  window.addEventListener('message', (e) => {
    if (e.data.type === 'ROUTE_CHANGE') {
      // 更新主应用 URL（不刷新页面）
      history.replaceState(null, '', `?subapp=${e.data.path}`);
    }
  });
});

// 页面加载时从 URL 恢复 iframe 状态
const savedPath = new URLSearchParams(location.search).get('subapp');
if (savedPath) {
  iframe.src = `/app1${savedPath}`;
}
```

### 4.3 通信繁琐

**问题**：主应用与子应用之间的通信完全依赖 `postMessage`，数据传递需要序列化/反序列化，复杂对象的传递成本较高。

### 4.4 性能开销

**问题**：每个 iframe 都是完整的浏览器上下文，包含独立的 JS 引擎实例、DOM 树、渲染管线，内存开销大。过多的 iframe 会显著影响页面性能。

**缓解方案**：限制同屏 iframe 数量，对非活跃的 iframe 可考虑卸载或使用 `loading="lazy"` 延迟加载。

### 4.5 SEO 不友好

搜索引擎通常不会索引 iframe 内部的内容，对于需要 SEO 的场景不适用。

### 4.6 样式适配困难

iframe 内部无法继承主应用的 UI 主题/样式，需要各子应用自行维护一致的视觉风格。

## 五、现代化改进方案

一些框架在 iframe 基础上做了增强，试图解决上述缺陷：

| 改进点 | 传统 iframe | 现代框架增强 |
|--------|------------|------------|
| CSS 隔离 | 完美 | 完美 |
| JS 隔离 | 完美 | 完美（无界采用） |
| DOM 共享 | 完全隔离 | 支持 DOM 渲染到主应用 |
| 弹窗穿透 | 无法穿透 | 支持弹窗在主应用挂载 |
| 路由同步 | 需手动同步 | 框架自动同步 |

## 六、适用场景

适合使用 iframe 方案的场景：

- 不同团队开发的完全独立系统需要集成到统一入口
- 安全性要求极高的场景（如第三方页面嵌入）
- 简单的后台管理系统，子应用不涉及复杂交互
- 遗留系统（如老旧的 jQuery 项目）快速集成
- 需要嵌入不受自己控制的外部页面

不适合的场景：

- 需要无缝 UI 体验的 C 端应用
- 子应用间频繁通信的强交互场景
- 需要 SEO 的页面