# 架构设计要点

## 一、主应用与子应用生命周期管理

### 1.1 生命周期模型

微前端中最基础的生命周期模型（源自 single-spa，被 qiankun 等框架继承）：

```text
子应用完整生命周期：

register（注册） → load（加载） → bootstrap（初始化）
                                      ↓
                              ┌── active（激活）──┐
                              ↓                   ↓
                           mount（挂载）  ←→  unmount（卸载）
                              ↑                   ↑
                              └── inactive（失活）─┘
                                      ↓
                              unload（完全卸载/销毁）
```

| 阶段 | 说明 | 调用频率 | 典型行为 |
|------|------|---------|---------|
| **bootstrap** | 应用初始化 | 只调用一次 | 注册全局组件、初始化 SDK |
| **mount** | 应用挂载 | 每次激活时调用 | 渲染 DOM、监听事件、启动路由 |
| **unmount** | 应用卸载 | 每次失活时调用 | 销毁 DOM、移除监听、清理定时器 |
| **update** | 属性更新 | props 变化时调用 | 响应主应用传递的 props 变化 |

### 1.2 主应用的生命周期管理职责

```javascript
// 主应用层面需管理：
// 1. 子应用注册与加载
// 2. 路由匹配与激活
// 3. 全局状态分发
// 4. 错误边界处理

import { registerMicroApps, start, addGlobalUncaughtErrorHandler } from 'qiankun';

registerMicroApps([
  {
    name: 'app-vue',
    entry: '//localhost:8081',
    container: '#sub-app-container',
    activeRule: '/app-vue',
    props: { globalStore, user: 'admin' }
  }
]);

// 全局错误处理
addGlobalUncaughtErrorHandler((event) => {
  console.error('子应用异常:', event);
  // 展示降级 UI、上报错误
});

start();
```

### 1.3 子应用生命周期实现

```javascript
// Vue 3 子应用完整生命周期示例
let app, router, history;

function render(props = {}) {
  const { container, onGlobalStateChange, setGlobalState } = props;

  // 创建 router
  history = createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? '/app-vue' : '/'
  );
  router = createRouter({ history, routes });

  // 创建 app
  app = createApp(App);
  app.use(router);

  // 监听全局状态
  if (onGlobalStateChange) {
    onGlobalStateChange((state, prev) => {
      console.log('全局状态变化:', state);
    });
  }

  // 挂载
  app.mount(
    container ? container.querySelector('#app') : '#app'
  );
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  // 初始化全局资源（仅一次）
}

export async function mount(props) {
  render(props);  // 每次激活都重新渲染
}

export async function unmount(props) {
  app.unmount();       // 销毁 Vue 实例
  history.destroy();   // 销毁路由实例
  app = null;
  router = null;
  history = null;
}
```

### 1.4 保活模式下的生命周期

部分框架（micro-app、无界）支持保活模式，此时 `unmount` 不会真正销毁：

```javascript
// 保活模式下的生命周期差异
// 首次进入：bootstrap → mount
// 切换离开：应用 DOM 隐藏，不调用 unmount
// 再次进入：DOM 重新显示，不调用 mount，直接恢复
// 最终销毁：unmount 才真正执行
```

---

## 二、路由劫持与同步

### 2.1 路由模式对比

| 路由模式 | URL 示例 | 优点 | 缺点 |
|---------|---------|------|------|
| **hash** | `/#/app-vue/page1` | 兼容性好，无需服务端配置 | 不美观，SEO 差 |
| **history** | `/app-vue/page1` | 原生路径，SEO 友好 | 需服务端配置 fallback |

### 2.2 路由劫持原理

```javascript
// 微前端框架需要劫持路由变化，以触发子应用切换
// 劫持三类事件：

// 1. hash 变化
window.addEventListener('hashchange', () => {
  reroute(); // 重新匹配路由
});

// 2. history popstate（浏览器前进后退）
window.addEventListener('popstate', () => {
  reroute();
});

// 3. pushState / replaceState（编程式导航）
const rawPushState = window.history.pushState.bind(window.history);
window.history.pushState = function(state, title, url) {
  rawPushState(state, title, url);
  reroute();
};

const rawReplaceState = window.history.replaceState.bind(window.history);
window.history.replaceState = function(state, title, url) {
  rawReplaceState(state, title, url);
  reroute();
};
```

### 2.3 子应用路由配置

```javascript
// 主应用注册
registerMicroApps([
  {
    name: 'app-vue',
    activeRule: '/app-vue',  // 匹配 /app-vue 开头的路径
    activeRule: (location) => location.pathname.startsWith('/app-vue'),
  }
]);

// 子应用路由需与 activeRule 对齐
const router = createRouter({
  history: createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? '/app-vue' : '/'
  ),
  routes: [
    { path: '/', component: Home },      // 实际匹配 /app-vue/
    { path: '/list', component: List },  // 实际匹配 /app-vue/list
  ]
});
```

### 2.4 虚拟路由（micro-app）

```javascript
// micro-app 的虚拟路由方案：子应用路由变化不影响主应用 URL
<micro-app
  name="app1"
  url="http://localhost:8081"
  router-mode="pure"   // 虚拟路由模式
  keep-router-state     // 保持路由状态
/>
```

**原理**：子应用内部使用内存中的虚拟 location，路由变化不写入浏览器地址栏，完全隔离主/子应用的路由。

---

## 三、跨应用通信机制

### 3.1 通信方案对比

| 方案 | 复杂度 | 实时性 | 类型安全 | 解耦程度 | 适用场景 |
|------|--------|--------|---------|---------|---------|
| **Props 传递** | 低 | 低 | 弱 | 高 | 主→子单向传递配置 |
| **自定义事件** | 低 | 高 | 弱 | 高 | 简单的发布/订阅 |
| **全局状态（Shared Store）** | 中 | 高 | 中 | 中 | 共享业务状态 |
| **postMessage** | 中 | 高 | 弱 | 极高 | iframe / 跨域通信 |
| **EventBus** | 低 | 高 | 弱 | 中 | 事件驱动通信 |
| **Module Federation** | 高 | 高 | 强 | 低 | 运行时模块共享 |

### 3.2 Props 传递

```javascript
// 主应用通过 props 传递数据
registerMicroApps([
  {
    name: 'app-vue',
    entry: '//localhost:8081',
    container: '#sub-app-container',
    activeRule: '/app-vue',
    props: {
      user: { id: 1, name: 'admin' },
      globalStore,  // 共享状态
      basename: '/app-vue'
    }
  }
]);

// 子应用接收
export async function mount(props) {
  console.log(props.user);       // { id: 1, name: 'admin' }
  console.log(props.globalStore);
  console.log(props.basename);   // '/app-vue'
}
```

**优点**：简单直接，类型明确；**缺点**：单向（主→子），子应用无法通过 props 向主应用回传数据。

### 3.3 全局状态（Shared Store）

```javascript
// qiankun 全局状态
import { initGlobalState } from 'qiankun';

// 主应用初始化
const actions = initGlobalState({ user: 'admin', token: '' });

// 监听变化
actions.onGlobalStateChange((state, prev) => {
  console.log('主应用监听到变化:', state);
});

// 更新状态
actions.setGlobalState({ token: 'xxx' });

// 子应用中通过 mount props 访问
export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log('子应用监听到变化:', state);
  });
  // 子应用也可修改全局状态
  props.setGlobalState({ theme: 'dark' });
}
```

**优点**：双向通信，状态可追溯；**缺点**：全局状态膨胀时维护困难。

### 3.4 自定义事件 / EventBus

```javascript
// 主应用
class MicroEventBus {
  constructor() {
    this.events = {};
  }
  $on(event, callback) {
    (this.events[event] ||= []).push(callback);
  }
  $off(event, callback) {
    this.events[event] = this.events[event]?.filter(cb => cb !== callback);
  }
  $emit(event, ...args) {
    this.events[event]?.forEach(cb => cb(...args));
  }
}

const bus = new MicroEventBus();

// 主应用监听
bus.$on('sub-app:login', (data) => {
  console.log('子应用登录成功:', data);
});

// 子应用发送
bus.$emit('sub-app:login', { userId: 1, token: 'xxx' });
```

**优点**：解耦好，灵活；**缺点**：事件名需统一管理，缺少类型检查。

### 3.5 postMessage（跨域场景）

```javascript
// 主应用 → 子应用（iframe）
const iframe = document.getElementById('sub-app-frame');
iframe.contentWindow.postMessage({
  type: 'USER_UPDATE',
  payload: { user: 'admin' }
}, '*');

// 子应用接收
window.addEventListener('message', (event) => {
  // 校验来源
  if (event.origin !== 'https://main-app.com') return;
  const { type, payload } = event.data;
  if (type === 'USER_UPDATE') {
    console.log('收到主应用数据:', payload);
  }
});

// 子应用 → 主应用
window.parent.postMessage({
  type: 'ROUTE_CHANGE',
  payload: { path: '/page1' }
}, '*');
```

**优点**：跨域支持，浏览器原生 API；**缺点**：需序列化，复杂对象传递成本高，缺少类型安全。

### 3.6 通信方式选择建议

```text
同域 Webpack 项目   → qiankun 全局状态
同域组件化场景       → micro-app 数据通信
iframe 跨域场景      → postMessage
模块级共享           → Module Federation
低频事件通知         → 自定义事件
```

---

## 四、公共依赖管理

### 4.1 策略对比

| 策略 | 实现方式 | 优点 | 缺点 |
|------|---------|------|------|
| **externals** | 通过 script 标签全局引入，子应用排除打包 | 构建产物小，版本统一 | 需维护全局脚本，易冲突 |
| **共享模块（Shared）** | Webpack Module Federation shared | 运行时去重，自动协商版本 | 仅 Webpack 5 支持 |
| **workspace 协议** | Monorepo 内 pnpm workspace:* | 本地实时调试，无需发布 | 仅 Monorepo 内有效 |
| **独立打包** | 各自打包自己的依赖 | 完全解耦 | 重复加载，体积大 |

### 4.2 externals 配置

```javascript
// 主应用 index.html 全局引入
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.0/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.0/dist/vue-router.global.prod.js"></script>

// 各子应用 webpack 配置排除
module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-plus': 'ElementPlus',
  }
};
```

**版本控制要点**：
- 主版本升级需通知所有子应用同步升级
- 使用 CDN 锁定固定版本号，避免 `latest` 标签
- 建立公共依赖清单，定期审视依赖版本

### 4.3 Module Federation 共享依赖

```javascript
// webpack.config.js
new ModuleFederationPlugin({
  name: 'app_a',
  shared: {
    vue: {
      singleton: true,       // 全局唯一实例
      eager: false,          // 异步加载
      requiredVersion: '^3.3.0'
    },
    'vue-router': { singleton: true },
    lodash: {
      singleton: false,      // 允许各自版本
      requiredVersion: '^4.17.0'
    }
  }
});
```

### 4.4 Monorepo workspace 协议

```json
// apps/shell/package.json
{
  "dependencies": {
    "@shared/ui": "workspace:*",
    "@shared/utils": "workspace:^1.0.0"
  }
}
```

---

## 五、样式隔离方案

### 5.1 方案全景对比

| 方案 | 隔离强度 | 兼容性 | 实现复杂度 | 框架支持 |
|------|---------|--------|-----------|---------|
| **Shadow DOM** | 极高 | 弹窗/浮层有坑 | 低 | qiankun strictStyleIsolation |
| **CSS Modules** | 高 | 需构建工具 | 低（子应用自行配置） | 所有框架 |
| **BEM 命名规范** | 中（依赖约定） | 完美 | 极低 | 所有框架 |
| **postcss 前缀** | 高 | 好 | 低 | qiankun experimentalStyleIsolation |
| **CSS-in-JS** | 高 | 需运行时 | 中 | 所有框架 |
| **@scope** | 中（新标准） | Chrome 118+ | 极低 | 所有框架 |

### 5.2 Shadow DOM 隔离

```javascript
// qiankun strictStyleIsolation
start({
  sandbox: {
    strictStyleIsolation: true
  }
});

// 原理：为每个子应用容器创建 Shadow DOM
const container = document.getElementById('sub-app');
const shadow = container.attachShadow({ mode: 'open' });
shadow.innerHTML = `<div>子应用内容</div>`;
```

**注意**：如果子应用使用了 `document.body.appendChild` 挂载弹窗（如 Ant Design Modal），弹窗会脱离 Shadow DOM，导致样式丢失。解决方案：
- 使用 `getPopupContainer` 将弹窗挂载到 Shadow DOM 内
- 或改用 experimentalStyleIsolation

### 5.3 postcss 前缀方案

```javascript
// qiankun experimentalStyleIsolation
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});

// 原理：CSS 规则自动添加作用域前缀
// 原始：.title { color: red; }
// 转换：div[data-qiankun="app-vue"] .title { color: red; }

// 等效于 CSS 中的 @scope（Chrome 118+ 原生支持）
@scope (div[data-qiankun="app-vue"]) {
  .title { color: red; }
}
```

### 5.4 CSS Modules（推荐）

```javascript
// 子应用自行配置，无需框架支持
// vite.config.js
export default {
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
};
```

```vue
<!-- Vue SFC 中使用 -->
<style module>
.title { color: red; }
</style>
<template>
  <h1 :class="$style.title">标题</h1>
</template>
```

### 5.5 CSS-in-JS

```javascript
// 运行时方案（如 styled-components, emotion）
import styled from 'styled-components';
const Title = styled.h1`
  color: red;
  font-size: 24px;
`;
```

### 5.6 选型建议

```text
首选方案：CSS Modules（子应用构建时解决，零运行时开销）
备选方案：postcss 前缀（微前端框架层面解决，兼容性好）
特殊场景：Shadow DOM（需要极致隔离，且能处理好弹窗问题）
```

---

## 六、JS 沙箱机制

> 详见 [沙箱机制详解](./sandbox-mechanism.md)，此处做架构层面的补充。

### 6.1 沙箱选型决策

```text
需要支持多应用同时激活？
├── 是 → ProxySandbox（多例）
└── 否 → 需要兼容老旧浏览器？
         ├── 是 → SnapshotSandbox（快照）
         └── 否 → LegacySandbox（单例 Proxy）
```

### 6.2 沙箱的局限性

1. **无法拦截 eval / new Function / setTimeout 字符串**：完全绕过沙箱的执行方式
2. **无法拦截 DOM 事件**：`addEventListener` 挂载在真实 DOM 上，不受沙箱控制
3. **无法拦截 Web Worker**：Worker 有独立的全局作用域
4. **Proxy 性能开销**：频繁的变量访问经过 Proxy 拦截，在高频操作场景下可能成为瓶颈

### 6.3 沙箱逃逸场景与防护

```javascript
// 可能的逃逸方式及防护
// 1. eval 逃逸
eval('window.globalVar = "escaped"');  // 直接操作真实 window
// 防护：重写沙箱内的 eval，使其指向沙箱 window

// 2. 定时器字符串
setTimeout('window.globalVar = "escaped"', 0);
// 防护：同样需要在沙箱中重写 setTimeout

// 3. 直接访问 top / parent
window.top.globalVar = 'escaped';  // 绕过沙箱
// 防护：Proxy 中拦截 top/parent 等特殊属性，返回沙箱 proxy
```