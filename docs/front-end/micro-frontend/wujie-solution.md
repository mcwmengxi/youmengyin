# 无界微前端方案

## 一、方案概述

无界（Wujie）是腾讯开源的微前端框架，首创了 **iframe + Shadow DOM** 的组合方案。它用 iframe 实现 JS 隔离，用 Shadow DOM 实现 CSS 隔离，同时通过 Web Component 将子应用的 DOM 渲染到主应用的容器中，解决了传统 iframe 的 DOM 割裂问题。

- **仓库地址**：https://github.com/Tencent/wujie
- **核心理念**：继承 iframe 的优点（完美隔离），补足 iframe 的缺点（DOM 割裂、通信困难）

## 二、快速上手

### 2.1 主应用

```javascript
// main.js
import WujieVue from 'wujie-vue3'; // 或 wujie-vue2 / wujie-react

const { setupApp, bus } = WujieVue;

// 预配置子应用（可选）
setupApp({
  name: 'sub-app',
  url: 'http://localhost:8081',
  exec: true,       // 预执行
  alive: true,      // 保活模式
  fetch: (url, options) => {
    return window.fetch(url, options); // 自定义 fetch 钩子
  }
});
```

```html
<!-- 使用无界组件 -->
<template>
  <WujieVue
    name="sub-app"
    url="http://localhost:8081"
    :alive="true"
    :sync="true"
  />
</template>
```

### 2.2 子应用

子应用无需安装任何 SDK，无需改造代码（Vite/Webpack 均原生支持）。

```javascript
// 子应用完全不需要改动，保持原有的开发方式
import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

## 三、核心架构

### 3.1 渲染原理

```text
┌─────────────────────────────────────────────────────┐
│ 主应用页面                                          │
│                                                     │
│  <wujie-app>  (Web Component)                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Shadow Root                                     │ │
│  │  ┌────────────────────────────────────────────┐ │ │
│  │  │ 子应用 DOM（从 iframe 中"搬"出来）          │ │ │
│  │  │ <html>                                     │ │ │
│  │  │   <head>                                   │ │ │
│  │  │     <style>/* 子应用样式，被 Shadow 隔离 */   │ │ │
│  │  │   </head>                                  │ │ │
│  │  │   <body>                                   │ │ │
│  │  │     <div id="app">子应用内容</div>           │ │ │
│  │  │   </body>                                  │ │ │
│  │  │ </html>                                    │ │ │
│  │  └────────────────────────────────────────────┘ │ │
│  │                                                 │ │
│  │  (隐藏的 iframe 只用于 JS 沙箱)                  │ │
│  │  <iframe style="display:none">                  │ │
│  │    <!-- JS 在这里执行 -->                       │ │
│  │  </iframe>                                      │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**关键步骤**：

1. 创建隐藏的 iframe，加载子应用 HTML
2. 在 iframe 中执行子应用的 JS（获得 JS 隔离）
3. 将 iframe 内的 DOM 树取出，渲染到 Web Component 的 Shadow Root 中
4. 子应用的 DOM 在主应用中可见（解决了弹窗问题），但样式被 Shadow DOM 隔离

### 3.2 JS 隔离机制

```javascript
// 无界使用空的 iframe 作为 JS 沙箱
function createSandbox(appName) {
  const iframe = document.createElement('iframe');
  // 设置 src 为 about:blank，创建干净的全局环境
  iframe.src = 'about:blank';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // 在 iframe 的 contentWindow 中执行子应用代码
  // 所有全局变量都存在于 iframe.window 上
  // 与主应用的 window 天然隔离
  const sandbox = iframe.contentWindow;

  return {
    // 在沙箱中执行代码
    execScript(code) {
      sandbox.eval(code);
    },
    // 获取沙箱 window
    getWindow() {
      return sandbox;
    },
    // 销毁沙箱
    destroy() {
      document.body.removeChild(iframe);
    }
  };
}
```

### 3.3 CSS 隔离机制

```javascript
// 无界使用 Shadow DOM 作为 CSS 隔离
class WujieApp extends HTMLElement {
  constructor() {
    super();
    // 创建 Shadow DOM（closed 模式防止外部操作）
    const shadow = this.attachShadow({ mode: 'closed' });

    // 子应用的所有 DOM 和样式都在 shadow 内部
    // Shadow DOM 的样式天然与外部分离
    this.shadowRoot = shadow;
  }

  // 将子应用的 DOM 元素"搬运"到 Shadow Root 中
  renderElement(iframeDocument) {
    const html = iframeDocument.documentElement.cloneNode(true);
    this.shadowRoot.appendChild(html);
  }
}
```

## 四、关键特性

### 4.1 保活模式

```javascript
<WujieVue name="app1" :alive="true" />

// 保活模式的子应用不会销毁，只是隐藏/显示
// 切换回来时立即恢复，无白屏
// 类似于 Vue 的 <keep-alive>
```

### 4.2 预加载

```javascript
import { preloadApp } from 'wujie';

// 空闲时预加载子应用（不渲染）
preloadApp({
  name: 'app1',
  url: 'http://localhost:8081',
});

// 或通过 setupApp 配置 exec: true
setupApp({ name: 'app1', url: 'http://localhost:8081', exec: true });
```

### 4.3 路由同步

```html
<!-- 子应用路由变化会同步到主应用 URL -->
<WujieVue name="app1" url="http://localhost:8081" :sync="true" />

<!-- 支持自动同步和手动控制 -->
```

### 4.4 插件系统

```javascript
import { addPlugin } from 'wujie';

addPlugin({
  // 子应用渲染前
  beforeLoad: (appWindow) => {
    console.log('子应用即将加载');
  },
  // 子应用渲染后
  afterLoad: (appWindow) => {
    console.log('子应用加载完成');
  },
  // 子应用卸载前
  beforeUnmount: (appWindow) => {
    console.log('子应用即将卸载');
  },
  // 子应用卸载后
  afterUnmount: (appWindow) => {
    console.log('子应用已卸载');
  },
});
```

## 五、数据通信

### 5.1 Props 通信

```html
<!-- 主应用传参 -->
<WujieVue name="app1" url="http://localhost:8081" :props="{ user: 'admin' }" />

<!-- 子应用接收 -->
<script>
  // 通过 window.$wujie.props 获取
  const props = window.$wujie.props;
  console.log(props.user); // 'admin'
</script>
```

### 5.2 事件总线

```javascript
// 主应用监听
import WujieVue from 'wujie-vue3';
const { bus } = WujieVue;

bus.$on('sub-app-message', (data) => {
  console.log('收到子应用消息:', data);
});

// 子应用发送
window.$wujie.bus.$emit('sub-app-message', { type: 'UPDATE' });
```

## 六、已知问题与适配

### 6.1 axios 适配

子应用使用 axios 等网络库时需注意：

```javascript
// axios 在 iframe 沙箱中会自动适配，但需注意拦截器设置
// 如遇到跨域问题，可在主应用配置 fetch 钩子
setupApp({
  name: 'app1',
  url: 'http://localhost:8081',
  fetch: (url, options) => {
    // 对请求做自定义处理
    return window.fetch(url, {
      ...options,
      credentials: 'include',
    });
  },
});
```

### 6.2 全局弹窗

由于子应用的 DOM 在主应用的 Shadow DOM 内渲染，弹窗可以"穿透"到主应用层面，体验优于传统 iframe。但若使用 `document.body.appendChild` 的方式挂载弹窗（如 Ant Design、Element Plus 的 Modal），弹窗会落入 iframe 的 body 而非 Shadow DOM 内的 body，需要框架层适配。

### 6.3 about:blank 初始化时序

iframe 从 `about:blank` 到目标 host 的切换需要等待：

```javascript
// 无界通过轮询检测 origin 变化
// 伪代码
function waitForOrigin(iframe, expectedOrigin) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (iframe.contentWindow.location.origin !== 'null') {
        clearInterval(timer);
        resolve();
      }
    }, 10); // 10ms 轮询，不够优雅
  });
}
```

## 七、优劣势总结

| 优势 | 劣势 |
|------|------|
| 接入成本最低，子应用零改造 | 框架较新，社区生态不如 qiankun |
| Vite/Webpack 均原生支持 | axios 等库需自行适配 |
| JS 隔离（iframe）天然可靠 | iframe 初始化有 10ms 轮询等待 |
| CSS 隔离（Shadow DOM）接近完美 | 大型第三方组件库弹窗有适配坑 |
| 支持保活、预加载、多应用激活 | 腾讯内部实践为主 |
| DOM 渲染在主应用，无割裂感 | 踩坑经验相对较少 |