# qiankun 微前端方案

## 一、方案概述

qiankun（乾坤）是蚂蚁金服开源的微前端框架，基于 [single-spa](https://single-spa.js.org/) 封装，提供了更简单易用的 API。它通过 **HTML Entry** 方式加载子应用，并提供完善的 JS 沙箱和 CSS 隔离方案。

- **仓库地址**：https://github.com/umijs/qiankun
- **核心依赖**：single-spa、import-html-entry

## 二、快速上手

### 2.1 主应用

```javascript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'app-vue',
    entry: '//localhost:8081',
    container: '#sub-app-container',
    activeRule: '/app-vue',
  },
  {
    name: 'app-react',
    entry: '//localhost:8082',
    container: '#sub-app-container',
    activeRule: '/app-react',
  },
]);

start();
```

### 2.2 子应用（Vue 3 示例）

```javascript
// main.js - 子应用入口
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

let app, router, history;

function render(props = {}) {
  const { container } = props;
  history = createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? '/app-vue' : '/'
  );
  router = createRouter({ history, routes: [...] });
  app = createApp(App);
  app.use(router);
  app.mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 导出 qiankun 生命周期钩子
export async function bootstrap() {
  console.log('子应用初始化');
}

export async function mount(props) {
  render(props);
}

export async function unmount() {
  app.unmount();
  history.destroy();
  app = router = history = null;
}
```

### 2.3 子应用 Webpack 配置

```javascript
// vue.config.js 或 webpack.config.js
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'  // 允许跨域
    },
    port: 8081
  },
  configureWebpack: {
    output: {
      library: 'app-vue',          // 导出为 UMD 格式
      libraryTarget: 'umd',
    }
  }
};

// Vite 项目需额外配置（qiankun 对 Vite 支持不完善）
// vite.config.js
export default {
  // qiankun 需要 UMD 格式，Vite 默认 ESM，需要插件适配
};
```

## 三、生命周期

每个子应用需导出三个生命周期钩子：

```javascript
// bootstrap：子应用首次加载时调用，用于全局资源初始化
export async function bootstrap() {
  // 初始化全局配置、注册全局组件等
}

// mount：每次子应用激活时调用，用于渲染应用
export async function mount(props) {
  // props 包含：container, onGlobalStateChange, setGlobalState
}

// unmount：每次子应用卸载时调用，用于清理资源
export async function unmount() {
  // 卸载 Vue 实例、销毁路由、清理定时器等
}
```

生命周期调用时机：

```text
首次进入子应用：  bootstrap → mount
离开子应用：      unmount
再次进入子应用：  mount（不会再调 bootstrap）
```

## 四、HTML Entry 加载原理

qiankun 通过 `import-html-entry` 库解析子应用的 HTML，提取其中的 JS 和 CSS：

```javascript
// import-html-entry 核心流程
import { importEntry } from 'import-html-entry';

const { template, execScripts, assetPublicPath } =
  await importEntry('//localhost:8081');

// template: 子应用的 DOM 结构
// execScripts: JS 执行器（sandbox 包裹）
// assetPublicPath: 静态资源路径

// 1. 将 DOM 插入容器
container.innerHTML = template;

// 2. 在沙箱中执行 JS
const sandbox = new ProxySandbox('app-vue');
sandbox.active();
await execScripts(sandbox.proxy);
```

相比于 single-spa 的 JS Entry 方式，HTML Entry 的优势：
- 子应用无需额外构建配置即可接入
- 自动处理样式和静态资源路径
- 更贴近子应用独立运行时的行为

## 五、JS 沙箱

qiankun 提供了三套 JS 沙箱，按优先级自动降级选择：

| 沙箱 | 核心机制 | 场景 |
|------|---------|------|
| ProxySandbox | Proxy + fakeWindow + with | 默认，支持多应用激活 |
| LegacySandbox | Proxy + 快照 | 单例场景 |
| SnapshotSandbox | 快照遍历 | Proxy 不可用时的降级 |

> 详细原理见 [沙箱机制详解](./sandbox-mechanism.md)

## 六、CSS 隔离

qiankun 提供两种 CSS 隔离方案：

```javascript
// strictStyleIsolation - Shadow DOM 模式
start({
  sandbox: {
    strictStyleIsolation: true  // 为每个子应用创建 Shadow DOM
  }
});

// experimentalStyleIsolation - 样式前缀模式
start({
  sandbox: {
    experimentalStyleIsolation: true  // 给样式加前缀 [data-qiankun=appName]
  }
});
```

## 七、全局状态管理

qiankun 提供了简单的全局状态管理方案：

```javascript
import { initGlobalState } from 'qiankun';

// 主应用
const actions = initGlobalState({ user: 'admin', token: '' });

// 监听状态变化
actions.onGlobalStateChange((state, prevState) => {
  console.log('state changed:', state, prevState);
});

// 设置状态（会通知所有应用）
actions.setGlobalState({ token: 'xxx' });

// 子应用中通过 mount 的 props 获取
export async function mount(props) {
  // props.onGlobalStateChange - 监听
  // props.setGlobalState - 修改
}
```

## 八、预加载

```javascript
import { start, prefetchApps } from 'qiankun';

// 配置预加载策略
start({
  prefetch: 'all'  // 'all' | 'populate' | []
  // all: 所有子应用 prefetch
  // populate: 根据当前浏览器空闲时间智能加载
});
```

## 九、常见问题与解决

### 9.1 子应用静态资源 404

子应用需使用相对路径或运行时注入 publicPath：

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

### 9.2 子应用路由 base 配置

子应用路由需要匹配主应用的 `activeRule`：

```javascript
// 主应用：activeRule: '/app-vue'
// 子应用路由 base：
const router = createRouter({
  history: createWebHistory('/app-vue'),  // 与 activeRule 一致
  routes: [...]
});
```

### 9.3 Vite 子应用适配

qiankun 原生不支持 ESM（Vite 的产物格式），需借助 `vite-plugin-qiankun` 等社区插件，或改用 micro-app / 无界。

### 9.4 多应用同时激活

qiankun 默认情况下同一时间只能激活一个子应用。若需多应用共存，可使用 `loadMicroApp` 手动加载：

```javascript
import { loadMicroApp } from 'qiankun';

const app = loadMicroApp({
  name: 'app-sidebar',
  entry: '//localhost:8081',
  container: '#sidebar-container',
});
```

## 十、优劣势总结

| 优势 | 劣势 |
|------|------|
| 社区最成熟、踩坑经验多 | 升级维护趋于停滞 |
| 沙箱方案完善，三级降级 | Vite 支持不完善 |
| HTML Entry 降低接入成本 | 子应用改造量较大 |
| 阿里内部大量实践验证 | 不能同时激活多个常规子应用 |