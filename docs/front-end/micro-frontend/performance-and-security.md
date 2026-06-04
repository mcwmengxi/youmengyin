# 性能优化与安全

## 一、性能优化

### 1.1 预加载与缓存策略

#### 预加载机制

```javascript
// qiankun 预加载配置
import { start } from 'qiankun';

start({
  prefetch: 'all',        // 所有子应用都预加载
  // prefetch: 'populate', // 浏览器空闲时预加载
  // prefetch: ['app-vue'] // 仅预加载指定应用
  // prefetch: false       // 关闭预加载
});

// prefetch 模式对比：
// 'all'       → 首个子应用加载完成后立即预加载所有子应用
// 'populate'  → 利用 requestIdleCallback 在浏览器空闲时逐步加载
// []          → 仅预加载数组中指定的子应用
```

```javascript
// micro-app 预加载
import { preFetch } from '@micro-zoe/micro-app';

// 静态资源预加载（空闲时）
preFetch([
  { name: 'app1', url: 'http://localhost:8081' },
  { name: 'app2', url: 'http://localhost:8082' }
]);

// 手动预加载
preFetch({ name: 'app1', url: 'http://localhost:8081' });
```

```javascript
// 无界预加载
import { preloadApp } from 'wujie';

preloadApp({
  name: 'app1',
  url: 'http://localhost:8081',
  exec: true  // 预执行 JS（提前初始化沙箱）
});
```

#### 缓存策略

```javascript
// 1. 静态资源强缓存
// Nginx 配置
location ~* \.(js|css|png|jpg|gif|svg|woff|woff2)$ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}

// 2. HTML 协商缓存
location ~* \.html$ {
  expires -1;
  add_header Cache-Control "no-cache";  // 每次验证
}

// 3. 子应用入口缓存策略
// 主应用中配置 fetch 钩子实现缓存
const cache = new Map();

registerMicroApps([
  {
    name: 'app-vue',
    entry: '//localhost:8081',
    // 自定义 fetch，实现缓存
    fetch: (url, ...args) => {
      if (cache.has(url)) return cache.get(url);
      const res = window.fetch(url, ...args);
      cache.set(url, res);
      return res;
    }
  }
]);
```

### 1.2 子应用按需加载与 Prefetch

#### 路由级懒加载

```javascript
// 主应用中按路由懒加载子应用
import { loadMicroApp } from 'qiankun';

const router = createRouter({
  routes: [
    {
      path: '/app-vue/:pathMatch(.*)*',
      // 只有访问时才加载子应用
      beforeEnter: () => {
        if (!window.__APP_VUE_LOADED__) {
          loadMicroApp({
            name: 'app-vue',
            entry: '//localhost:8081',
            container: '#sub-app-container',
          });
          window.__APP_VUE_LOADED__ = true;
        }
      }
    }
  ]
});
```

#### 预加载时机

```javascript
// 智能预加载策略
// 1. 鼠标悬停时预加载
document.querySelectorAll('[data-prefetch]').forEach(link => {
  link.addEventListener('mouseenter', () => {
    const appName = link.dataset.prefetch;
    preFetch({ name: appName, url: entryMap[appName] });
  });
});

// 2. 首屏加载完成后预加载其他子应用
window.addEventListener('load', () => {
  requestIdleCallback(() => {
    preFetch(otherApps);
  });
});

// 3. 空闲时预加载（利用 requestIdleCallback）
function idlePreload(apps) {
  const preloadNext = (deadline) => {
    if (apps.length > 0 && deadline.timeRemaining() > 10) {
      const app = apps.shift();
      preFetch({ name: app.name, url: app.url });
      requestIdleCallback(preloadNext);
    }
  };
  requestIdleCallback(preloadNext);
}
```

### 1.3 公共依赖提取与 Tree Shaking

#### 公共依赖提取

```javascript
// 方案1：externals（全局引入）
// index.html
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.0/dist/vue.runtime.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-router@4.2.0/dist/vue-router.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/element-plus@2.3.0/dist/index.full.min.js"></script>

// 每个子应用排除打包
// webpack.config.js
module.exports = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-plus': 'ElementPlus',
  }
};
```

```javascript
// 方案2：Module Federation shared
new ModuleFederationPlugin({
  name: 'app_a',
  shared: {
    vue: {
      singleton: true,
      eager: false,
      requiredVersion: '^3.3.0'
    },
    'element-plus': {
      singleton: true,
      eager: false,
      requiredVersion: '^2.3.0'
    }
  }
});
```

#### 依赖重复检测

```bash
# 使用 webpack-bundle-analyzer 检测重复依赖
pnpm add -D webpack-bundle-analyzer

# 分析构建产物
npx webpack-bundle-analyzer dist/stats.json

# 或在 Monorepo 中检查依赖版本一致性
npx syncpack list-mismatches
```

### 1.4 子应用加载性能优化

```javascript
// 1. 并行加载（多个子应用同时加载）
import { loadMicroApp } from 'qiankun';

Promise.all([
  loadMicroApp({ name: 'app-header', entry: '//localhost:8081', container: '#header' }),
  loadMicroApp({ name: 'app-sidebar', entry: '//localhost:8082', container: '#sidebar' }),
]).then(() => {
  console.log('所有子应用加载完成');
});

// 2. 骨架屏/加载态
const LoadingComponent = {
  template: `
    <div class="micro-app-loading">
      <div class="skeleton"></div>
      <p>加载中...</p>
    </div>
  `
};

registerMicroApps([
  {
    name: 'app-vue',
    entry: '//localhost:8081',
    container: '#sub-app-container',
    loader: (loading) => {
      // 自定义加载状态
      if (loading) {
        render(LoadingComponent, '#sub-app-container');
      }
    }
  }
]);

// 3. 设置加载超时
start({
  prefetch: 'all',
  // 子应用加载超时处理
  loader: (loading) => {
    const timer = setTimeout(() => {
      // 超时降级：显示错误提示或使用缓存版本
      showFallbackUI();
    }, 5000);
    loading.then(() => clearTimeout(timer));
  }
});
```

### 1.5 性能监控

```javascript
// 监控子应用加载性能
function reportAppPerformance(appName, metrics) {
  // 上报到监控平台
  fetch('/api/monitor', {
    method: 'POST',
    body: JSON.stringify({
      app: appName,
      type: 'micro-app-load',
      ...metrics
    })
  });
}

// 使用 PerformanceObserver 监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name.includes('sub-app')) {
      reportAppPerformance('app-vue', {
        duration: entry.duration,
        startTime: entry.startTime,
        entryType: entry.entryType
      });
    }
  }
});
observer.observe({ entryTypes: ['resource', 'navigation'] });
```

---

## 二、安全防护

### 2.1 防止样式污染

#### 子应用样式隔离最佳实践

```css
/* 1. 避免使用全局选择器 */
/* ❌ 错误 */
body { font-family: sans-serif; }
* { box-sizing: border-box; }

/* ✅ 正确 */
.app-root { font-family: sans-serif; }
.app-root * { box-sizing: border-box; }

/* 2. 避免使用 @keyframes 全局名称 */
/* ❌ 错误 */
@keyframes fadeIn { from { opacity: 0; } }

/* ✅ 正确 */
@keyframes app-vue-fadeIn { from { opacity: 0; } }

/* 3. 重置样式限制在容器内 */
/* ❌ 错误 */
html, body { margin: 0; padding: 0; }

/* ✅ 正确 */
.app-container, .app-container * { margin: 0; padding: 0; }
```

#### 框架层面的防护

```javascript
// qiankun experimentalStyleIsolation
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});

// 原理：运行时动态添加作用域前缀
// 原始：.title { color: red; }
// 转换：div[data-qiankun="app-vue"] .title { color: red; }

// micro-app 自动前缀
// <micro-app name="app1"> 内的样式自动添加作用域
```

### 2.2 防止 JS 污染

#### 子应用编码规范

```javascript
// 1. 避免污染全局变量
// ❌ 错误
window.myGlobal = 'value';
var globalVar = 'value';  // 在非严格模式下会挂到 window

// ✅ 正确
(function() {
  'use strict';
  const localVar = 'value';
  // 或使用模块作用域（ES Module 天然隔离）
})();

// 2. 避免修改原生原型
// ❌ 错误
Array.prototype.customMethod = function() {};

// ✅ 正确：使用工具函数
function customMethod(arr) { ... }

// 3. 全局事件监听要清理
// ❌ 错误
window.addEventListener('resize', handler);

// ✅ 正确
export function unmount() {
  window.removeEventListener('resize', handler);
}

// 4. 定时器要清理
let timers = [];
export function mount() {
  timers.push(setInterval(() => {}, 1000));
}
export function unmount() {
  timers.forEach(clearInterval);
  timers = [];
}
```

#### 沙箱逃逸检测

```javascript
// 开发环境检测沙箱逃逸
if (process.env.NODE_ENV === 'development') {
  const originalWindow = {};

  // 记录初始 window 状态
  Object.keys(window).forEach(key => {
    originalWindow[key] = window[key];
  });

  // 卸载时检测
  function checkWindowLeak() {
    const leaks = [];
    Object.keys(window).forEach(key => {
      if (!(key in originalWindow)) {
        leaks.push(key);
      }
    });
    if (leaks.length > 0) {
      console.warn('⚠️ 检测到全局变量泄漏:', leaks);
    }
  }
}
```

### 2.3 跨域与安全沙箱

#### CORS 配置

```javascript
// 子应用开发服务器
// vite.config.js
export default {
  server: {
    cors: true,
    // 或更严格的配置
    cors: {
      origin: ['https://main-app.com', 'http://localhost:8080'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  }
};

// Webpack DevServer
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
};
```

#### 生产环境安全配置

```nginx
# Nginx 配置
server {
    # 子应用静态资源
    location /sub-app-order/ {
        # 限制跨域来源
        add_header Access-Control-Allow-Origin "https://main-app.com";
        add_header Access-Control-Allow-Methods "GET";

        # 安全头
        add_header X-Content-Type-Options "nosniff";
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";

        alias /var/www/sub-app-order/;
        try_files $uri $uri/ /index.html;
    }
}
```

#### 子应用安全校验

```javascript
// 主应用中校验子应用来源
const ALLOWED_ORIGINS = [
  'https://cdn.example.com',
  'https://sub-app.example.com'
];

function validateSubAppEntry(entry) {
  const url = new URL(entry);
  if (!ALLOWED_ORIGINS.includes(url.origin)) {
    throw new Error(`不允许的子应用来源: ${url.origin}`);
  }
  return entry;
}

registerMicroApps([
  {
    name: 'app-order',
    entry: validateSubAppEntry('https://cdn.example.com/app-order/index.html'),
    container: '#sub-app-container',
    activeRule: '/app-order'
  }
]);
```

#### 子应用敏感信息处理

```javascript
// 子应用不应暴露敏感信息到全局
// ❌ 错误
window.__TOKEN__ = 'xxx';
window.__USER_INFO__ = { id: 1, role: 'admin' };

// ✅ 正确：通过 props 或通信机制获取
export async function mount(props) {
  const token = props.token;  // 主应用传递
  // 或通过全局状态获取
  props.onGlobalStateChange((state) => {
    const token = state.token;
  });
}
```

### 2.4 错误隔离

```javascript
// 主应用错误边界
import { addGlobalUncaughtErrorHandler } from 'qiankun';

addGlobalUncaughtErrorHandler((event) => {
  const { appOrParcelName, error } = event;
  console.error(`子应用 ${appOrParcelName} 发生错误:`, error);

  // 上报错误
  reportError({
    app: appOrParcelName,
    message: error.message,
    stack: error.stack
  });

  // 展示降级 UI
  document.getElementById('sub-app-container').innerHTML = `
    <div class="error-fallback">
      <p>模块加载失败，请刷新重试</p>
      <button onclick="location.reload()">刷新</button>
    </div>
  `;
});

// 子应用内部错误边界
// 每个子应用内部也应添加错误边界
// Vue: errorHandler / React: ErrorBoundary
```

---

## 三、性能优化清单

| 优化项 | 方案 | 预期收益 |
|--------|------|---------|
| **子应用预加载** | prefetch: 'all' / 'populate' | 减少首次加载等待时间 50%+ |
| **公共依赖 externals** | 提取 Vue/React/UI 库到全局 | 减少总体积 30-50% |
| **CSS Modules** | 构建时隔离，无运行时开销 | 零性能损耗 |
| **子应用按需加载** | 路由级懒加载 + loadMicroApp | 减少首屏加载体积 |
| **CDN 缓存** | 强缓存 JS/CSS，协商缓存 HTML | 二次加载几乎瞬时 |
| **骨架屏** | 加载中展示骨架屏 | 提升感知性能 |
| **并行加载** | 多子应用同时加载 | 减少总加载时间 |
| **Tree Shaking** | 确保 sideEffects 配置正确 | 减少无用代码 |