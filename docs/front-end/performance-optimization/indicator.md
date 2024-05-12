# 指标
所有的优化都是为了用户体验考虑的

## 1. 指标

### 1. 常规指标

1. FP: first print: 首次渲染时间
首次绘制包括了任何用户自定义的背景绘制，它是将第一个像素绘制到屏幕的时刻，用于应用页面，用户在视觉上首次出瑞不同于跳转之前的内容时间点，或者说是页面发生第一次绘制的时间点

2. FCP: first contentful paint: 首次内容绘制时间
指浏览器完成渲染 DOM 中第一个内容的时间点，这个元素可以是任何文本、图像、SVG 或者其他任何元素，此时用户应该在视觉上有直观的感受

3. FMP: first meaningful paint: 首次有意义绘制时间
指页面关镇元素渲染时间。这个概念并没有标准化定义，因为关键元素可以由开发者自己定义， 究竟什么是"有意义"的内容，只有开发者或者产品经理自己了解

4. TTI: time to interactive: 可交互时间
顾名思义，也就是用户可以下应用进行交互的时间。一般来说，我们认为为 domready 的时间，因为我们通常会在这时候绑定事件操作。如果页面中涉及交互的脚本没有下载完成，那么当然没有到达所谓的用户可交互时间。那么如何定义 domready 时间呢？

5. TTFB: time to first byte: 首字节时间(网络请求耗时)
TTFB 是发出页面请求到接收到就答数据第一个字节所花费的毫秒数

6. LCP: largest contentful paint: 最大内容绘制时间
衡量页面的加载体验，它表示视口内可见的最大内容元素的渲染时间。相比 FCP, 这个指标可以更加真实地反映具体内容加载速度。比如，如果页面渲染前有一个 loading 动画，那么 FCP 可能会以 loading 动画出现的时间为准，而 LCP 则会以 loading 动画之后的内容加载时间为准。
7. FID: first input delay: 首次输入延迟 
衡量可交互性，它表示用户和页面进行首次交互操作所花费的时间，它比TTL 更加提前，这个阶段虽然页面已经显示出部分内容，但并不能完全具备可交互性，对于用户的响应可能会有较大的延迟。

8. CLS: cumulative layout shift: 累积布局偏移
衡量视觉稳定性，表示页面的整个生命周期中，发生的每个意外的样式移动的所有单独布局更改得分的总和。所以这个分数当然越小越好。

9. TBT: total blocking time: 总阻塞


10. DCL: dom content loaded: 首次渲染时间

11. L: DOM onLoad

12 . 总下载时间
页面所有资源加载完成所需要的时间。一般可以统计 window.onload 事件触发的时间, 这样可以统计出同步加载的资源全部加载完的耗时。如果页面存在较多异步渲染，也可以将异步渲染全部完成的时间作为总下载时间

### 1.2 如何获取这些指标

| 字段 | 含义 |
| --- | --- |
| navigationStart | 加载起始时间，如果没有前一个页面的unload,则与fetchStart值相等 |
| redirectStart | 重定向开始时间(如果发生了HTTP重定向，每次重定向都和当前文档同域的话，就返回开始重定义的fetchStart的值。其他发问，则返回0)|
|redirectEnd| 重定向结束时间(如果发生了HTTP重定向，每次重定向都和当前文档同域的话，就返回最后一次重定向接受完数据的时间。其他情况返回0)|
|fetchStart| fetchStart 浏览器发起资源请求时，如果有缓存，则返回读取缓存的开始时间 |
|domainLookupStart| DNS 域名开始查询的时间，如果有本地的缓存或 keep-alive等，则返回 fetchStart |
|domainLookupEnd| domainLookupEnd 查询DNS的结束时间。如果没有发起DNS请求，同上 |
|connectStart|TCP开始建议连接时间，如果有本地的缓存或keep-alive等，则与fetchStart值相等|
|secureConnectionStart| https 连接开始的时间，如果不是安全连接则为0|
|connectEnd| TCP 完成握手的时间，如果有本地的缓存或 keep-alive等，则与 connectStart值相等|
|requestStart| HTTP 请求读取真实文档开始的时间，包括从本地缓存读取 |
|requestEnd| HTTP 请求读取真实文档结束的时间，包括从本地缓存读取 |
|responseStart| 返回浏览器从服务器收到(或从本地缓存读取)第一个字节是的 Unix 毫秒时间戳 |
|responseEnd| 返回浏览器从服务器收到(或从本在缓存读取，或从本地资源读取)最后一个字节时的 Unix 毫秒时间戳 |
|uploadEventStart| 前一个页面的unload的时间戳如果没有则为0|
|uploadEventEnd| 与unloadEventStart相对应，返回的是unload函数执行完成的时间戳|
|domLoading|这是当前网页DOM结构开始解析时的时间戳，是整个过程的起始时间戳，浏览器即将开始解析第一批收到的HTML文档字节，此时document.readState变成loading，并将抛出 readyStateChange事件|
|domInteractive|返回当前网页DOM结构结束解析、开始加载内嵌资源的时间戳，document.readyState变成interactive,并将抛出readyStateChange事件(注意只是DOM树解析完成，这时候并没有开始加载网页内的资源)|
|domContentLoadedEventStart|网页domContentLoaded事件发生的时间|
|domContentLoadedEventEnd|网页 domContentLoaded事件脚本执行完毕的时间，domReady的时间|
|domComplete| DOM 树解析完成，且资源也准备就绪的时间，domcument.readyState变成complete,并将抛出readystatechange事件 |
|loadEventStart|load事件发送给文档，也即load回调函数开始执行的时间|
|loadEventEnd|load回调函数执行完成的时间|


### 1.3 相关参数计算
| 字段 | 描述 | 计算方式 | 意义 |
| --- | --- |---- | ----|
|unload|前一个页面卸载耗时|unloadEventEnd - unloadEventStart | - |
|redirect|重定向耗时| redirectEnd - redirectStart | 重定向的时间|
| appCache | 缓存耗时 | domainLookupStart —— fetchStart| 读取缓存的时间|
| dns | DNS解析耗时 | dominsLookupEnd - domsinLookupStart | 可观察域名解析服务是否正常 |
| tcp | TCP 连接耗时 | connectEnd - connectStart |建立连接的耗时|
| ssl | SSL 安全连接耗时| connectEnd - secureConnectionStart|反映数据安全连接建立耗时|
| ttfb | Time to First Byte(TTFB)网络请求耗时| responseStart - requestStart | TTFB是发出页面请求到接收到应答数据第一个字节所花费的毫秒数 |
| response|响应数据传输耗时| responeseEnd - responseStart |观察网络是否正常|
| dom | DOM 解析耗时| domInteractive - responseEnd |观察DOM结构是否合理，是否有JS阻塞页面解析|
| dcl | DOMContentLoaded事件耗时| domContentLoadedEventEnd - domContentLoadedEventStart |当HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，无需等待样式表、图像和子框架的完成加载|
|resources|资源加载耗时| domComplete - domContentLoaded |可观察文档流是否过大|
|domReady|DOM阶段渲染耗时| domConentLoadedEventEnd - fetchStart| DOM树和页面资源加载完成时间，会触发 domContentLoaded事件|
|首次渲染耗时|首次渲染耗时| responseEnd-fetchStart|加载文档到看到第一帧非空图像的时间，也叫白屏时间|
|首次可交互时间|首次可交互时间|domInteracctive - fetchStart|DOM树解析完成时间，此时domcument.readyState为interactive|
|首包时间耗时|首包时间| responseStart - domainLookupStart|DNS解析到响应返回浏览器第一个字节的时间|
|页面完全加载时间|页面完全加载时间|loadEventStart - fetchStart|
|onLoad|onLoad事件耗时| loadEventEnd - loadEventStart|

### 1.4
```js
// rollup.config.js
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'optm'
  },
  plugins: [
    babel: ({
      exclude: 'node_modules/**'
    }),
    livereload({
      
    }),
    serve({
      open: true,
      port: 8866,
      openPage: '/index.html',
      contentBase: ''
    })
  ]
}
```

```js
// index.js

// FP FCP
const ob1 = new PerformanceObserver((entryList, observer) => {
  let entries = entryList.getEntries();
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].name === 'first-paint') {
      console.log('FP:', entries[i].startTime);
    }

    if (entries[i].name === 'first-contentful-paint') {
      console.log('FCP:', entries[i].startTime);
    }
  }
})

ob1.observe({
  // 'element', 'event', 'navigation', 'resource'
  entryTypes: ['paint']
});

// LCP
const ob2 = new PerformanceObserver((entryList, observer) => {
  let entries = entryList.getEntries();
  console.log(entries);
  const lastEntry = entries[entries.length - 1];
  console.log('Largest Contentful Paint:', lastEntry.startTime);
})

ob2.observe({
  entryType: ['largest-contentful-paint']
})

setTimeout(() => {
  const {
    fetchStart,
    connectEnd,
    connectStart,
    requestStart,
    responseStart,
    responseEnd,
    domLoading,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
  } = performance.timing;

  // 毫秒为单位
  console.log('connectTime(连接耗时)', connectEnd - connectStart)
  console.log('ttfbTime', responseStart - requestStart)
  console.log('responseTime（响应耗时）', responseEnd - responseStart)
  console.log('parseDomTime（DOM解析耗时）', loadEventStart - domLoading)
  console.log('DCL', domContentLoadedEventEnd - domContentLoadedEventStart)
  console.log('TTI', domInteractive - fetchStart)
  console.log('loadTime', loadEventStart - fetchStart)
})
```

```js
// lighthouse
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLaucher = require('chrome-launcher');

(
  async () => {
    // 启动一个Chrome
    const chrome = await chromeLauncher.launch();
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance'],
      port: chrome.port,
    };

    // 使用 lighthouse 对页面进行计算
    const res = await lighthouse('https://www.baidu.com', options);
    const { report } = res;
    
    // 写入报告
    rs.writeFileSync('report.html', report);

    await chrome.kill();
  }

)()
```

### 各种阶段
Appcache DNS TCP Request Response Processing
## 2. 场景 —— 需求

## 3. 维度

## 4. 成本

## 5. 剖析性能优化的方方页面
### 维度1：I/O 的维度
- App cache 阶段
  - 合理利用缓存
    - 强缓存
      - expries
      - cache-control
    - 协商缓存
      - last-modified
      - etag
- 合理利用 webpack 的 hash, 可以实现，让谇缓存的内容缓存
#### 缓存中的细节
1. 在浏览器中，直接输入的 url 指向的 html, 是不会缓存的。
2. 合理利用 webpack 的 hash, 可以实现，让该缓存的内容缓存
3. CDN 的情况下
4. 浏览器中如果没有了强缓存中的字段，还会走强缓存吗？肯定的
- DNS 的阶段
- TCP 的阶段
  - 三次握手怎么优化
    - http 1.0
    - http 1.1
    - http2
    - http3
- Req, Resp
  - JS 文件加载
    - aync defer

#### 如何让我的包体积，缩小到极致？
- uglify, minify
- runtime 运行时，我的 polyfill, 能够按需加载
```js
/**
 * a 页面中，我用了async / await --- babel --- babel-perset-env --- 转译后的代码
 * b 页面中，没有用
 * 
 * 根据不同的环境，加载不同的代码
 */
```
- tree shaking

- 图片格式
  - png, jpg, webp, base64

#### 首屏加载内容，如何进一步缩小
- code splitting. 代码分割

#### processing
- async defer
- css 要不要放前面
- 在不考虑 SSR 的情况下，我的接口请求，是不是可以放在 willMount 里面

### 维度2： 渲染的维度

#### 如何有效的避免频繁操作 dom
- 减少 dom 操作
```js
forEach(item => {
  a.appendChild(item);
})
```

#### 如何避免回流和重绘？

#### 利用 GPU 加速

requestIdelCallback
requestAnimationFrame

### 维度3： 内存的维度
vue2 -> vue3
享元模式
http2
data Object.freeze()

### 维度4： CPU的维度
密集计算，能不能用WebAss, Web wroker
后端同学，能不能算好了再给我？