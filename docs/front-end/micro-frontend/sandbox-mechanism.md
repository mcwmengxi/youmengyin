# 沙箱机制详解

沙箱（Sandbox）是微前端框架的核心能力，负责隔离各子应用的 JavaScript 和 CSS，确保它们不会相互干扰。本文深入解析主流微前端框架的沙箱实现原理。

---

## 一、JS 沙箱

JS 沙箱的目标是隔离子应用的全局变量、全局事件等副作用，确保子应用卸载后不污染全局环境。

### 1.1 SnapshotSandbox（快照沙箱）

最早的实现方案，在子应用激活时对全局 window 做快照，卸载时恢复快照。

```javascript
class SnapshotSandbox {
  constructor() {
    this.windowSnapshot = {};  // 激活前的 window 快照
    this.modifyPropsMap = {};  // 子应用运行期间的修改记录
  }

  active() {
    // 1. 记录激活前的 window 状态
    for (const key of Object.keys(window)) {
      this.windowSnapshot[key] = window[key];
    }
    // 2. 恢复子应用修改过的属性
    for (const key of Object.keys(this.modifyPropsMap)) {
      window[key] = this.modifyPropsMap[key];
    }
  }

  inactive() {
    // 1. 记录子应用运行期间的修改
    for (const key of Object.keys(window)) {
      if (window[key] !== this.windowSnapshot[key]) {
        this.modifyPropsMap[key] = window[key];
      }
    }
    // 2. 恢复 window 到激活前的状态
    for (const key of Object.keys(this.windowSnapshot)) {
      window[key] = this.windowSnapshot[key];
    }
  }
}
```

**缺点**：遍历 window 对象，属性越多性能越差；无法同时激活多个子应用。

### 1.2 LegacySandbox（代理沙箱）

使用 ES6 Proxy 拦截对 window 的读写操作，避免了全量遍历。

```javascript
class LegacySandbox {
  constructor() {
    this.modifiedProps = new Map();   // 子应用修改的属性
    this.addedProps = new Set();      // 子应用新增的属性
    this.currentUpdatedProps = new Map();

    this.proxy = new Proxy(window, {
      set: (target, prop, value) => {
        this.modifiedProps.set(prop, value);
        this.currentUpdatedProps.set(prop, value);
        target[prop] = value; // 实际修改全局 window
        return true;
      },
      get: (target, prop) => {
        // 特殊属性（如 top、parent）要逃逸到真实 window
        return target[prop];
      }
    });
  }

  active() {
    // 恢复子应用之前的修改
    for (const [prop, value] of this.currentUpdatedProps) {
      window[prop] = value;
    }
  }

  inactive() {
    // 还原修改为原始值
    for (const [prop] of this.modifiedProps) {
      window[prop] = this.originalValues.get(prop);
      this.currentUpdatedProps.delete(prop);
    }
  }
}
```

**优点**：性能远优于快照沙箱；**缺点**：仍然直接操作真实 window，无法同时激活多子应用。

### 1.3 ProxySandbox（多例沙箱）

qiankun 的主力沙箱方案，通过 Proxy 创建一个完全隔离的虚拟 window，支持多子应用同时激活。

```javascript
class ProxySandbox {
  constructor(name) {
    this.name = name;
    this.updatedValueSet = new Set();

    // fakeWindow 是一个纯空对象，所有子应用的变量都挂在它上面
    const fakeWindow = Object.create(null);
    const { proxy, sandboxRunning } = this;

    this.proxy = new Proxy(fakeWindow, {
      set(target, prop, value) {
        if (sandboxRunning) {
          // 拦截变量写入 - 写入到 fakeWindow 而非真实 window
          target[prop] = value;
          this.updatedValueSet.add(prop);
          this.latestSetProp = prop;
        }
        return true;
      },
      get(target, prop) {
        // 优先从 fakeWindow 取，取不到再回退到真实 window
        if (prop in target) return target[prop];
        // 从原始 window 上取值（如 document、setTimeout 等原生 API）
        const rawValue = rawWindow[prop];
        // 函数需要绑定到原始 window 执行
        return typeof rawValue === 'function'
          ? rawValue.bind(rawWindow)
          : rawValue;
      },
      has(target, prop) {
        return prop in target || prop in rawWindow;
      }
    });

    // 核心：使用 with + eval 让子应用代码中的变量操作落在 proxy 上
  }

  active() { this.sandboxRunning = true; }
  inactive() { this.sandboxRunning = false; }
}
```

**关键原理**：

```javascript
// 子应用的 JS 代码会被包裹在以下上下文中执行：
const wrapCode = `
  (function(window) {
    with(window) {
      ${subAppCode}
    }
  }).call(window, window);
`;

// 这里的 window 实际上是 Proxy 对象
// with(window) 后，内部 var/function 声明会落入 fakeWindow
// 因此：var name = 'test'  →  fakeWindow.name = 'test'
// 而不会污染真实 window
```

**ProxySandbox 的变量查找链路**：
```text
1. with(proxy) 内的变量声明 → 写入 fakeWindow
2. 变量读取 → 先查 fakeWindow → 再查 rawWindow（原生 API）
3. rawWindow 的函数（如 setTimeout）→ bind(rawWindow) 保持 this 正确
```

### 1.4 iframe 沙箱（无界方案）

无界采用了一个巧妙的思路：使用空的 iframe 作为 JS 沙箱。

```javascript
// 核心原理
const iframe = document.createElement('iframe');
iframe.src = 'about:blank';
document.body.appendChild(iframe);

// 在 iframe 的 contentWindow 中执行子应用代码
// 子应用的所有全局变量都存在于 iframe 的 window 上
// 与主应用的 window 天然隔离
iframe.contentWindow.eval(subAppCode);
```

**优点**：天然隔离，不需要实现复杂的 Proxy/with 逻辑；**缺点**：初始化时 `about:blank` 到目标 origin 的切换存在时序问题，某些依赖 `window.location` 的库（如 axios）需要适配。

### 1.5 JS 沙箱方案对比

| 方案 | 隔离程度 | 多应用激活 | 性能 | 实现复杂度 |
|------|---------|-----------|------|-----------|
| SnapshotSandbox | 中 | 不支持 | 低 | 低 |
| LegacySandbox | 中 | 不支持 | 中 | 中 |
| ProxySandbox | 高 | 支持 | 中 | 高 |
| iframe 沙箱 | 极高 | 支持 | 高 | 低（但适配成本高） |

---

## 二、CSS 沙箱

CSS 沙箱的目标是避免子应用之间的样式冲突。主流方案有以下几种：

### 2.1 Shadow DOM 严格隔离

```javascript
// qiankun 的 strictStyleIsolation
const shadow = element.attachShadow({ mode: 'open' });
shadow.innerHTML = `
  <head>
    <link rel="stylesheet" href="subapp/style.css">
  </head>
  <body>
    <!-- 子应用内容 -->
  </body>
`;
```

**优点**：近乎完美的 CSS 隔离，类似 iframe 的效果；**缺点**：很多第三方 UI 库（如 Ant Design、Element UI）的弹窗组件挂载在 `document.body` 上，会脱离 Shadow DOM 导致样式丢失。

### 2.2 样式前缀（Scoped CSS）

micro-app 和无界（非 Shadow DOM 模式）采用的方案。

```css
/* 原始样式 */
.title { color: red; }

/* 转换后样式 */
micro-app[name=subapp1] .title { color: red; }
```

**实现原理**：
1. 拦截子应用 `<style>` 标签内的 CSS 文本
2. 在每条 CSS 规则选择器前加上子应用的命名空间前缀
3. 为子应用根元素添加对应属性

**优点**：兼容性好，不影响弹窗挂载；**缺点**：无法 100% 隔离，`@keyframes`、`@font-face`、`body`、`html` 等选择器仍有冲突可能。

### 2.3 CSS Modules / CSS-in-JS

由子应用层面自行解决的方案，不依赖于微前端框架。

```javascript
// CSS Modules
import styles from './app.module.css';
element.className = styles.title; // 编译后的唯一类名 .title_abc123
```

**优点**：编译器级别保证，隔离效果最好；**缺点**：要求子应用使用特定构建工具和编码方式。

### 2.4 CSS 沙箱方案对比

| 方案 | 隔离程度 | 兼容性 | 性能 | 适用场景 |
|------|---------|--------|------|---------|
| Shadow DOM | 极高 | 弹窗/浮层有坑 | 高 | 样式简单的子应用 |
| 样式前缀 | 高 | 好 | 中（需运行时处理） | 通用场景 |
| CSS Modules | 极高 | 需构建工具支持 | 高 | 所有子应用统一规范 |

---

## 三、综合说明

在实际选型中，没有一种沙箱方案是完美的：

- **qiankun** 提供了 `strictStyleIsolation`（Shadow DOM）和 `experimentalStyleIsolation`（样式前缀）两种 CSS 隔离模式，以及三套 JS 沙箱自动降级
- **micro-app** 使用属性前缀做 CSS 隔离，JS 沙箱与 qiankun 类似
- **无界** 使用 Shadow DOM 做 CSS 隔离 + iframe 做 JS 隔离，实现了较好的平衡
- **EMP（Module Federation）** 没有沙箱机制，完全依赖团队规范

选择沙箱方案需要权衡隔离强度、兼容性和性能三者的关系。