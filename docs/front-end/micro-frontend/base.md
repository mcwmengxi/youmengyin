# 微前端

## 微前端概念  
微前端是借鉴了微服务的理念，将一个庞大的应用拆分成多个独立灵活的小型应用，每个应用都可以独立开发，独立运行，独立部署，还可以随意组合，这样就降低了耦合度，从而更加灵活。

### 微前端特性

- 技术栈无关 主框架不限制接入应用的技术栈，子应用可自主选择技术栈（vue，react，jq，ng等）
- 独立开发/部署 各个团队之间仓库独立，单独部署，互不依赖
- 增量升级 当一个应用庞大之后，技术升级或重构相当麻烦，而微应用具备渐进式升级的特性
- 独立运行时 微应用之间运行时互不依赖，有独立的状态管理

## 微前端方案

### iframe 方案

**优点**
1.接入比较简单
2.隔离非常稳完美

**不足**
1. dom割裂感严重，弹框只能在iframe，而且有滚动条
2. 通讯非常麻烦，而且刷新iframe url状态丢失
3.前进后退按钮无效

### qiankun 方案
>qiankun 方案是基于 single-spa 的微前端方案。

**优点**

1.`html entry` 的方式引入子应用，相比 `js entry` 极大的降低了应用改造的成本；
2. 完备的沙箱方案，js 沙箱做了 SnapshotSandbox、LegacySandbox、ProxySandbox 三套渐进增强方案，css 沙箱做了 strictStyleIsolation、experimentalStyleIsolation 两套适用不同场景的方案；
3.做了静态资源预加载能力；


**不足**

1. 适配成本比较高，工程化、生命周期、静态资源路径、路由等都要做一系列的适配工作；
2. css 沙箱采用严格隔离会有各种问题，js 沙箱在某些场景下执行性能下降严重；
3. 无法同时激活多个子应用，也不支持子应用保活；
4. 无法支持 vite 等 esmodule 脚本运行；

**底层原理** 

js沙箱原理 使用的是proxy进行快照然后用 with(window){} 包裹起来 with内的window其实就是proxy.window 我们声明变量 var name = 'nangong' 实际这个变量挂到了proxy.window 并不是真正的window

css沙箱原理 第一个就是shadowDom隔离 第二个类似于Vue的scoped [data-qiankun-426732]

### micro-app 方案

>micro-app 方案是基于 `web components + qiankun sandbox` 的微前端方案。

**优点**

1. 使用 webcomponet 加载子应用相比 single-spa 这种注册监听方案更加优雅；
2. 复用经过大量项目验证过 qiankun 的沙箱机制也使得框架更加可靠；
3. 组件式的 api 更加符合使用习惯，支持子应用保活；
4. 降低子应用改造的成本，提供静态资源预加载能力；


**不足**

1. css 沙箱依然无法绝对的隔离，js 沙箱做全局变量查找缓存，性能有所优化；
2. 支持 vite 运行，但必须使用 plugin 改造子应用，且 js 代码没办法做沙箱隔离；
3. 对于不支持 webcompnent 的浏览器没有做降级处理；
4. ~~接入成本较 qiankun 有所降低，但是路由依然存在依赖；~~ （虚拟路由已解决）
5. ~~多应用激活后无法保持各子应用的路由状态，刷新后全部丢失；~~ （虚拟路由已解决）

**底层原理** 
js隔离跟qiankun类似也是使用proxy + with，css隔离自定义前缀类似于scoped

### EMP 方案

> EMP 方案是基于 `webpack 5 module federation` 的微前端方案。


**优点**
1. webpack 联邦编译可以保证所有子应用依赖解耦；
2. 应用间去中心化的调用、共享模块；
3. 模块远程 ts 支持；

**不足**

1. 对 webpack 强依赖，老旧项目不友好；
2. 没有有效的 css 沙箱和 js 沙箱，需要靠用户自觉；
3. 子应用保活、多应用激活无法实现；
4. 主、子应用的路由可能发生冲突；

**底层原理** 

这个东西有点类似于拆包，也可以叫模块共享，例如React有个模块可以共享给Vue项目用Vue2的组件可以共享给Vue3用。

### 无界微前端 方案

**优点**

1. 接入简单只需要四五行代码
2.不需要针对vite额外处理
3.预加载
4.应用保活机制

**不足**
1. 隔离js使用一个空的iframe进行隔离
2. 子应用axios需要自行适配
3. iframe沙箱的src设置了主应用的host，初始化iframe的时候需要等待iframe的location.orign从'about:blank'初始化为主应用的host，这个采用的计时器去等待的不是很悠亚。

**底层原理** 

使用shadowDom 隔离css，js使用空的iframe隔离，通讯使用的是proxy

### 前置知识了解webComponents

### 前置知识2 monorepo架构