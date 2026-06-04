# single-spa 微前端方案

## 一、方案概述

single-spa 是微前端领域的**先驱框架**，最早提出了"将多个 JavaScript 应用组合到一个页面中运行"的概念。它只做路由劫持和应用生命周期编排，不提供沙箱隔离、样式隔离等能力，是一个**极简的微前端调度器**。

- **仓库地址**：https://github.com/single-spa/single-spa
- **定位**：微前端路由器（只负责调度，不负责隔离）
- **qiankun 的底层依赖**：qiankun 是对 single-spa 的增强封装

## 二、核心原理

### 2.1 架构模型

```text
┌──────────────────────────────────────────────┐
│              single-spa                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 路由劫持  │  │ 生命周期  │  │ 应用注册  │   │
│  │ (hash +  │  │ (bootstrap│  │ (register │   │
│  │  history)│  │  mount    │  │ Application│  │
│  │          │  │  unmount) │  │ )         │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                              │
│  ❌ 无 JS 沙箱  ❌ 无 CSS 隔离  ❌ 无通信方案 │
└──────────────────────────────────────────────┘
```

### 2.2 路由劫持机制

single-spa 的核心是劫持路由事件，拦截 `hashchange` 和 `popstate`，并重写 `pushState` / `replaceState`：

```javascript
// single-spa 路由劫持简化原理
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function(...args) {
  const result = originalPushState.apply(this, args);
  // 通知 single-spa 路由已变化
  urlReroute();
  return result;
};

window.history.replaceState = function(...args) {
  const result = originalReplaceState.apply(this, args);
  urlReroute();
  return result;
};

window.addEventListener('hashchange', urlReroute);
window.addEventListener('popstate', urlReroute);
```

## 三、快速上手

### 3.1 注册子应用

```javascript
import { registerApplication, start } from 'single-spa';

// 注册子应用
registerApplication({
  name: 'app-vue',
  app: () => import('./app-vue/app-vue.js'), // 动态加载
  activeWhen: (location) => location.pathname.startsWith('/app-vue'),
  customProps: { user: 'admin' }            // 传递自定义 props
});

registerApplication({
  name: 'app-react',
  app: () => import('./app-react/app-react.js'),
  activeWhen: ['/app-react', '/app-react/'], // 支持数组匹配
});

start();
```

### 3.2 子应用生命周期

```javascript
// app-vue.js - 子应用入口
import Vue from 'vue';
import App from './App.vue';
import router from './router';

let vueInstance = null;

// 1. 初始化（只调用一次）
export function bootstrap() {
  return Promise.resolve().then(() => {
    console.log('app-vue bootstrapped');
  });
}

// 2. 挂载（每次路由匹配时调用）
export function mount(props) {
  return Promise.resolve().then(() => {
    vueInstance = new Vue({
      router,
      render: (h) => h(App),
    }).$mount();
    // 挂载到 single-spa 指定的容器
    document.getElementById('app').appendChild(vueInstance.$el);
  });
}

// 3. 卸载（每次路由离开时调用）
export function unmount() {
  return Promise.resolve().then(() => {
    vueInstance.$destroy();
    vueInstance.$el.remove();
    vueInstance = null;
  });
}

// 可选：更新 props
export function update(props) {
  console.log('props updated', props);
}
```

### 3.3 React 子应用示例

```javascript
// app-react.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

let rootElement;

export function bootstrap() {
  return Promise.resolve();
}

export function mount(props) {
  return Promise.resolve().then(() => {
    rootElement = document.getElementById('app');
    ReactDOM.render(
      <BrowserRouter basename="/app-react">
        <App />
      </BrowserRouter>,
      rootElement
    );
  });
}

export function unmount() {
  return Promise.resolve().then(() => {
    ReactDOM.unmountComponentAtNode(rootElement);
  });
}
```

## 四、应用加载方式

single-spa 支持三种加载方式：

| 方式 | 说明 | 示例 |
|------|------|------|
| **JS Entry** | 加载 JS 文件，需子应用打包为 UMD 格式 | `() => import('./app.js')` |
| **In-Browser Module** | 使用 ES Module | `() => import('./app.mjs')` |
| **Parcel** | 框架无关的组件挂载（不依赖路由） | `mountRootParcel(config, props)` |

### Parcel 模式（手动挂载，不依赖路由）

```javascript
import { mountRootParcel } from 'single-spa';

const parcelConfig = {
  bootstrap: () => Promise.resolve(),
  mount: (props) => {
    props.domElement.innerHTML = '<div>Hello Parcel</div>';
    return Promise.resolve();
  },
  unmount: () => Promise.resolve()
};

// 手动挂载到指定 DOM
const parcel = mountRootParcel(parcelConfig, {
  domElement: document.getElementById('sidebar'),
  customProp: 'value'
});

// 手动卸载
parcel.unmount();
```

## 五、核心 API

| API | 说明 |
|-----|------|
| `registerApplication(config)` | 注册子应用 |
| `start()` | 启动 single-spa |
| `triggerAppChange()` | 手动触发路由匹配 |
| `navigateToUrl(url)` | 编程式导航 |
| `getMountedApps()` | 获取已挂载的应用列表 |
| `mountRootParcel(config, props)` | 手动挂载 Parcel |
| `pathToActiveWhen(path)` | 生成 activeWhen 函数 |
| `unloadApplication(appName)` | 卸载应用 |

## 六、与 qiankun 的关键差异

| 维度 | single-spa | qiankun |
|------|-----------|---------|
| **定位** | 路由器/调度器 | 完整的微前端框架 |
| **加载方式** | JS Entry | HTML Entry |
| **JS 沙箱** | 无 | 三级沙箱（Snapshot/Legacy/Proxy） |
| **CSS 隔离** | 无 | Shadow DOM / 样式前缀 |
| **样式处理** | 需手动管理 | 自动加载/卸载子应用样式 |
| **子应用改造** | 必须打包 UMD + 导出生命周期 | 建议打包 UMD，但更简便 |
| **接入成本** | 高（需自行解决隔离） | 中 |
| **灵活性** | 极高（只做路由） | 中（封装度高） |

## 七、适用场景与局限性

### 适用场景

- 团队有较强的工程化能力，只需要路由调度，隔离自己解决
- 构建微前端框架的底层基础（如 qiankun 就是基于它）
- 所有子应用使用同一技术栈，不需要 JS/CSS 隔离
- 简单的微前端实验 / POC 项目

### 局限性

- **无 JS 沙箱**：子应用全局变量会相互污染，需亲自约束
- **无 CSS 隔离**：子应用样式冲突需自行解决（CSS Modules / BEM 等）
- **无子应用通信**：需自行实现通信机制
- **无预加载**：需自行实现静态资源预加载
- **JS Entry 限制**：子应用必须打包为 UMD 格式，对 Vite 等 ESM 工具不友好
- **无错误隔离**：一个子应用崩溃可能影响全局

## 八、总结

single-spa 是微前端的"骨架"，它定义了微前端的基本范式（路由劫持 + 生命周期），但**不提供任何开箱即用的隔离能力**。它适合作为其他微前端框架的底层依赖，或用于团队技术实力强、能自行解决隔离问题的场景。对于大多数项目，更推荐使用 qiankun、micro-app 等高层封装方案。