# micro-app 微前端方案

## 一、方案概述

micro-app 是京东零售开源的微前端框架，核心思路是将 **Web Components** 与 **qiankun 的沙箱机制** 结合。它没有沿袭 single-spa 的注册监听模式，而是通过 Custom Elements 将子应用封装为类 Web 组件。

- **仓库地址**：https://github.com/micro-zoe/micro-app
- **核心理念**：像使用组件一样使用子应用

## 二、快速上手

### 2.1 主应用

```javascript
// main.js
import microApp from '@micro-zoe/micro-app';
microApp.start();
```

```html
<!-- 页面中使用 -->
<template>
  <div>
    <h1>主应用</h1>
    <!-- 像使用普通组件一样使用子应用 -->
    <micro-app name="sub-app" url="http://localhost:8081" />
  </div>
</template>
```

### 2.2 子应用

子应用无需引入任何 SDK，无需做任何改造，保持原有的开发方式即可（这是 micro-app 最大的卖点）。

```javascript
// 子应用完全不需要改动，像独立运行时一样开发
import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

## 三、核心特点

### 3.1 组件化 API

对比 qiankun 的注册式 API，micro-app 的设计更符合前端开发习惯：

```html
<!-- qiankun 方式：注册 + 路由匹配 -->
<script>
  registerMicroApps([
    { name: 'app1', entry: '//...', activeRule: '/app1' }
  ]);
</script>

<!-- micro-app 方式：直接用组件标签 -->
<micro-app name="app1" url="http://localhost:8081" />
```

### 3.2 虚拟路由（重要创新）

micro-app 实现了虚拟路由系统，解决了子应用路由和主应用路由冲突的问题。

```javascript
// 虚拟路由使得：
// 1. 子应用内部路由变化不影响主应用 URL
// 2. 多个子应用各自拥有独立的路由状态
// 3. 页面刷新后子应用路由状态可以恢复

<micro-app
  name="app1"
  url="http://localhost:8081"
  router-mode="pure"  // 虚拟路由模式
  keep-router-state   // 保持路由状态
/>
```

### 3.3 子应用保活

```html
<micro-app
  name="app1"
  url="http://localhost:8081"
  keep-alive   <!-- 开启保活模式 -->
/>
```

开启保活后，子应用切换时不会销毁，而是隐藏 DOM，再次激活时直接显示，无需重新加载和渲染。

### 3.4 预加载

```javascript
import { start, preFetch } from '@micro-zoe/micro-app';

start();

// 预加载子应用（空闲时自动加载）
preFetch([
  { name: 'app1', url: 'http://localhost:8081' },
  { name: 'app2', url: 'http://localhost:8082' },
]);
```

## 四、数据通信

### 4.1 主应用 → 子应用

```javascript
// 主应用传数据
const app = document.querySelector('micro-app[name=app1]');
app.data = { user: 'admin', role: 'dev' };

// 子应用接收
window.microApp.getData();  // 获取主应用传递的数据

// 子应用监听数据变化
window.addEventListener('datachange', (e) => {
  console.log('主应用数据变化:', e.detail.data);
});
```

### 4.2 子应用 → 主应用

```javascript
// 子应用发送数据
window.microApp.dispatch({ type: 'UPDATE', value: 'hello' });

// 主应用监听
const app = document.querySelector('micro-app[name=app1]');
app.addEventListener('datachange', (e) => {
  console.log('子应用数据变化:', e.detail.data);
});
```

## 五、JS 沙箱

micro-app 的 JS 沙箱与 qiankun 类似，使用 Proxy + with 方案。不同之处在于：

```javascript
// micro-app 优化：全局变量查找缓存
// 对于频繁访问的 document、location 等全局对象做缓存
// 减少每次变量查找时需要遍历原始 window 的开销

const CACHE_KEY = ['document', 'location', 'history', 'navigator'];

// 首次访问时从原始 window 获取并存入缓存
// 后续访问直接从缓存读取，避免反复 bind
```

**与 qiankun 的区别**：micro-app 在变量查找时做了更积极的缓存优化，减少了 Proxy 拦截的性能开销。

## 六、CSS 隔离

micro-app 默认采用属性前缀方案（类似 Vue scoped）：

```html
<!-- 子应用 DOM 自动添加唯一属性 -->
<micro-app name="app1">
  <div data-micro-app="app1">
    <h1 class="title">标题</h1>
  </div>
</micro-app>

<!-- CSS 被改写添加前缀 -->
<style>
  /* 原始：.title { color: red; } */
  /* 改写：micro-app[name=app1] .title { color: red; } */
</style>
```

通过这种方式，样式作用域被限制在对应子应用的容器内。

## 七、JS 沙箱模式

```html
<!-- 默认沙箱模式（Proxy + with） -->
<micro-app name="app1" url="http://localhost:8081" />

<!-- iframe 沙箱模式（更强隔离但限制更多） -->
<micro-app name="app1" url="http://localhost:8081" sandbox />

<!-- 关闭沙箱（性能最优，但无隔离） -->
<micro-app name="app1" url="http://localhost:8081" disable-sandbox />
```

## 八、Vite 子应用支持

micro-app 支持 Vite 子应用，但需要改造：

```javascript
// 子应用需要安装适配插件
// vite.config.js
import microAppPlugin from '@micro-zoe/micro-app/vite-plugin';

export default {
  plugins: [
    microAppPlugin('app1')  // 传入子应用名
  ]
};
```

**限制**：使用 Vite 插件模式时，JS 沙箱不生效（因为 ESM 模块机制与 with + Proxy 沙箱的冲突），需要自行注意全局变量隔离。

## 九、优劣势总结

| 优势 | 劣势 |
|------|------|
| 接入成本极低，子应用零改造 | Vite 模式下 JS 沙箱不生效 |
| 组件式 API，符合开发习惯 | CSS 隔离不够彻底，前缀方案有穿透风险 |
| 完整的虚拟路由，解决路由冲突 | 对 Web Components 有浏览器版本要求 |
| 支持子应用保活和多应用激活 | 社区生态不如 qiankun 成熟 |
| 与 qiankun 的沙箱兼容 | 京东内部实践为主，外部大厂案例较少 |