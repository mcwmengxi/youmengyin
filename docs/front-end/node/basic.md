# node 基础

## 1. node 是什么
`node.js` 是一个 `js` 的服务端，运行环境。基于V8, 在 JS 语言规范的基础上，封装了一些服务端的 runtime, 让我们能够简单地实现非常鑫的业务功能。
- 高性能的 `web` 服务器
- `commonjs` 规范为标准，`node` 是 `cjs` 的实现

## 2. node 能做什么
- 跨端开发：weex, RN, PC
- 后端开发：koa, express, egg
- 前端开发：webpack, rollup
- 工具开发：脚本，脚手架，命令行工具

## 3. node 的问题
- js 是单线程，很脆弱`cluster / pm2`
- node 对 `mongoDB, mysql, redis` 支持比较好

## 4. nvm、nrm、npm、yarn
- nvm: `node version manager` 
  - 当我需要多个版本的时候，我可以通过 `nvm` 去切换
- nrm: `node registry manager`
  - 当你需要切换 `npm` 源的时候，我可以通过 `nrm
- npm: `node package manager`
  
- yarn: `node package manager`
```bash
'5.0.3'：表示安装指定5.0.3版本
'^5.0.3'：表示安装5.x.x的最新版本
'~5.0.3'：表示安装5.0.x的最新版本
```

```js
// package.json
{
  "name": 'node-demo',
  "version": "1.0.0",
  'description': 'this is a demo',
  'main': 'index.js',
  "scripts": {
    "test": 'node ./test.js'
  },
  "author": '',
  "license": 'ISC'
}

/**
 * main:
 *  1. 入口文件
 *  2. 当别人 require('node-demo') 的时候，会默认找 main 字段
 *  3. 如果没有 main 字段，会找 index.js
 *  4. 如果没有 index.js，会报
 * 
 */
```
### npm 和 yarn 的区别
- npm 还没有到 v5 版本的时候
  - lock 的机制，差别是很大的
  - npm V5.0x: 根据`package-lock.json` 下载的
  - npm v5.1.0 - v5.4.2: 如果 `package.json`有符合的更新版本，忽略`package-lock.json`, 按照`package.json`进行安装
  - npm v5.4.2 以上，如果 pkg 和 lock 兼容，则根据 lock 安装，如果不兼容，则根据 pkg 安装，然后更新lock
- yarn 就是 v5.4.2 以上的规则 
  - lock
  - 扁平化安装
  - 网络更好一引起，yarn 请求派对
  - 缓存机制
##### 什么是扁平化安装，为什么会造成幽灵依赖
### npm 的包依赖关系
### dependencies 项目依赖
```js
npm i -S
loadsh
import {debounce} from 'lodash'
```
#### devDependencies 开发依赖
```js
npm i -D
weback rollup eslint
```
#### peerDependencies 依赖
- 不能单独运行
- 我能正确运行的前提，是安装了核心包
- 我不希望核心包被重复下载

#### bundleDependencies

#### optionalDependencies

### 组件发布 npm 仓库
npm publish 对组件进行发包
```json
{
  "name": "node-demo",
  // cjs
  "main": 'lib/index.js',
  // esm
  "module": 'lib/index.js',
  "files": [
    "/lib",
    "/dist",
  ]
}

// npm i node-demo
// import nodeDemo from 'node-demo'
```

### npm link 软链接

## CJS
### 模块化的方案
- 隔离变量
- 相互通信
```js
function foo() {
  var bar = 1;
  var bar2 = 2;
}
```

```js
var obj = {
  a: {

  }
}

function resolve(a) {
  var bar = 2;
  var baz = 2;
  a = {
    bar,
    baz
  }
}

resolve(obj.a);
```


```js
var module = {
  exports: {

  }
}

function resolve(module, exports) {
  var bar = 2;
  var baz = 2;

  module.exports = {
    bar,
    baz
  }
}

resolve(module, module.exports);
```

```js
// 实现一个简单的 require.js
// const xxx = require('xxx');

const { readFileSync } = require('fs');
const { resolve } = require('path');
function my_require(filename) {
  const fileContext = readFileSync(resolve(__dirname, filename), 'utf-8');
  const warpped = `(function (require, module, exports) {
    ${fileContext}
  })`;
  
  const scripts = new Script(warpped, {
    filename: 'index.js',
  })

  const module = {
    exports: {
      
    }
  }

  const func = scripts.runInThisContext();
  func(my_require, module, module.exports);

  return module.exports;
}

global.my_require = my_require;

my_require('./index.js');
```

```js
console.log('hello ')
```
## 其它
```js
//index.js
console.log('Hello World!');

<script src="index.js"></script>
console.log('Hello World!');
```
执行上面代码, 会有两个过程
1. 需要被解析：`console` 是一个对象。`log` 是一个函数，`Hello World` 是一个字符串， 作为 `log` 的参数
2. 需要被执行：`hello world` 这句话被打印出来。

解析是v8在做，是否能被执行，是宿主环境决定的。
node: V8 + node API (操作磁盘`fs, path`, 处理网络`http,net`, 多进程`cluster`，操作系统`os`，加密`opensssl`，压缩`zlib`)
chrome: V8 + 浏览器API (处理和显示dom`document`, 窗口`window`, 屏幕`screen`)

node 是一个架构，js是作为这个架构的语言，V8是用来解析这个语言的。

**写前端的本质，就是操作DOM和BOM**

**写node的本质，就是操作OS的资源？**

**写代码的本质，就是操作宿主环境提供的API,来实现应有的功能**