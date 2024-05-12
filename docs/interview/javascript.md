## 导致页面加载白屏时间长的原因有哪些？怎么进行优化？

原因

- css加载放在head中会阻塞渲染，加载时间长会出现页面白屏
- js加载和执行会阻塞页面解析和渲染，加载时间长会出现页面白屏

## 微前端中的应用隔离是什么？

分为主应用和微应用 js代码的隔离，css的隔离，

**css隔离**
- css module 或者命名空间的方式
添加特定的前缀，postcss插件 打包添加特定前缀
- 微应用之间 css隔离，使用scoped link style 打标 去标
- shodow dom

**js隔离**

- sandbox 沙箱机制 window 全局事件
- js with windwow.Proxy 对象

## 闭包 

理思路： 

- 将概念
  - 红宝书 闭包是指有权访问另一个函数作用域中变量的函数
  - mdn: 指那些能够访问自由变量的函数，这里的自由变量是指外部作用域
    - 涉及到那些作用域
      - 全局作用域
      - 局部作用域
      - 词法作用域 -->作用域链（js继承方式）
      - 执行上下文

- 优缺点
  - 优点 私有化数据，在私有化数据的基础上保持数据
    - 任何在函数中定义的变量，都可以看作是私有变量 
      举个例子 防抖 
  - 缺点 可能会导致内存泄漏，内部的变量不会被自动回收掉
    - 垃圾回收机制
      - 标记清除
      - 引用计数
      - 新生代 老生代
- 说用途
  - 防抖节流 
  - vue 
  - react

## 1. 手写防抖函数

```ts
function Debounce(fn:Function, delay:number){
  let timer
  
  let _this = this
  return function(...args){
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(_this, args)
    },delay)
  }
}
```

## 1. 前端需要注意哪些 SEO ?

1. 网站结构布局 :
    - 控制首页链接数量 网站首页是权重最高的地方。不能过少( "蜘蛛" 不愿爬 )、不能过多(链接过多会影响用户体验，降低页面权重).
    - 扁平化页面结构布局,例如目录结构尽量不超过 3 级( 超过 3 级，"蜘蛛" 就可能不愿意向下爬了 )。
    - 导航优化, 网站导航尽量使用文字，如果需要使用图片则必须添加 alt 和 title 属性, 另外也可以在图片未能正常加载的时候给用户友好体验。
    - 页面头部主要放置(logo 、主导航及用户信息)、页面主体放置(左边放面包屑以及正文,右边放热门文章和相关文章【 可以起到挽留用户，增强页面权重的作用 】)。在设计分页的时候推荐 1 2 3 4 5 6 这种，不推荐 首页
      下一页 尾页 这种、页面底部放置(版权信息和友链)。
    - 把重要的内容放在前面(搜索引擎是从上到下抓取的)。
    - 页面大小最好不超过 100k ， 如果页面加载速度慢可能会遗失部分用户且一旦超时 "蜘蛛" 便不在抓取收录。
2. 代码优化 :
    - 可以利用 title 标签和 meta 标签的 description、keywords 属性来设置关键词和概括页面内容( 并且关键词尽量不要重复出现、关键词也切记过多 )。
    - html 代码书写要符合 W3C 规范( 注重标签语义化 )。
        + a 标签：站内链接要加上 title 属性来告知 "蜘蛛" 和 用户一些链接的关键信息、站外链接要加上 el="nofollow" 属性，告诉 "蜘蛛" 不要去爬。
        + h1 标签：一个页面最多出现 1 个 h1 标签(用于承载站点的最重要的标题或者页面的 logo)。
        + table 标签：表格标签的标题应该使用 \<caption\> 标包裹签来定义。
        + strong 和 em 标签：strong 标签包裹的内容相对于其他标签会引起搜索引擎的重视。em 的强调效果要低于 strong。
        + 文本缩进尽量不使用 `&nbsp;`，而是用 css 来控制。版权符号使用 `&copy;` 而不是直接使用符号 `©`。
        + 尽可能少的使用 js 来动态的渲染内容，因为 "蜘蛛" 抓不到动态渲染的内容(React 和 Vue 大行其道的年代的解决方案另说)。
        + 慎用 `display: none;` "蜘蛛" 可能不会抓取其中的内容，对于不想展示的内容可以 z-index 、偏移度 足够大。
        + 减少使用 iframe，"蜘蛛" 不会去抓 iframe 中的内容。
3. 增加自己的网站的导入链接
4. 提高网站的加载速度( 编码层面、资源加载层面等 )
5. 向各大搜索引擎登录入口提交尚未被搜索引擎收录的链接。
6. 生成站点地图 sitemap

## 2. HTTP 的几种请求方式和用途 ?

**比较常见的 :**

- GET 请求：请求资源
- POST 请求：传输请求实体
- PUT 请求：传输文件
- DELETE 请求：删除文件
- HEAD 请求：获取响应报头首部
- OPTIONS 请求：询问服务器支持的 HTTP 方法

其中有几点需要说明一下 :

1. POST 请求与 PUT 请求很像，比较容易混淆，二者的区别在于 :
   如果是一个更新操作，不会有新的资源产生则使用 PUT 请求，如果有新的资源产生就应该使用 POST 请求<br>
   也即 : GET、POST、PUT、DELATE 分别对应着【 查、增、更、删 】( 这种请求也被称为 REST 风格请求 )

2. OPTIONS 请求平常看不到，在哪可以看到 ? OPTIONS 请求在跨域请求数据的场景中是可以看到的。所以后端针对于浏览器发出真实请求之前的嗅探请求 OPTIONS
   ，就应该做出正确的响应，否则后面的真实的请求是不会发出的。实际上这个 OPTIONS 请求就是一个询问后端支持即将要发送请求属性的程度，如果满足即将发送的请求的发送条件则该请求会在 OPTIONS 请求得到响应之后发送。

3. HEAD 请求也不是常见的请求，代表什么意思 ? 浏览器发送 HEAD 请求是不会有实质的响应体返回的，但会返回响应体首部。

- 通常被用来检查资源的有效性。
- 检查超链接的有效性。
- 检查网页是否被篡改。
- 可用于机器人获取网页标准信息,获取 rss 种子信息或传递安全认证信息。

## 3. 从浏览器地址栏输入 URL 到页面显示的步骤?

1. 【url解析】浏览器对url进行解析
  - url 包括( 协议、网络地址、资源路径 )
  - 如果是合法地址浏览器会进行相应的操作，如果不是合法地址会转给默认的搜索引擎，由搜索引擎对该字段进行搜索【 就和你直接在谷歌浏览器的地址栏上输入要搜索的内容一样，当 url 不合法的时候一般默认的搜索引擎都会进行类似的搜索 】。
2. 【DNS域名解析】将url中的域名解析成ip地址
  - 缓存中查找
    + 浏览器缓存中查找对应的缓存的DNS域名解析记录
    + 然后本机host文件中查找解析记录
    + 最后到路由器缓存中查找解析记录  
  - DNS服务器查找
    + 先在本地DNS服务器中查找解析记录
    + 然后进行递归查询(本地DNS服务器向上一层DNS服务器请求(权限域名服务器->顶级域名服务器->根域名服务器),直至递归请求到根域名服务器)
3. 【TCP3次握手基于ip建立TCP连接】
  - 客户端向服务端发送SYN数据包
  - 服务端接收SYN数据包，并返回SYN-ACK数据包
  - 客户端接收SYN-ACK数据包，并发送ACK数据包
4. 基于建立好的 TCP 连接，客户端向服务器发送请求。
5. 服务器接收到请求，解析请求，返回响应。
6. 【 TCP 4 次挥手断开 TCP 连接 】:
  - 客户端发送 Fin=1 报文、Ack=Z 报文、Seq=X 报文【 (客户端) : 我要关闭 TCP 连接了，如果你那边也关闭的话记得 Ack 告诉我是 X 
  - 服务器接收客户端传来的报文并返回 Ack = X+1 报文、Seq=Z 报文【 (服务器) : 我这边知道你打算关闭 TCP 连接了，为了让你知，在传 ACK 的时候我会将刚才的 Fin 值 1 也一并加上并返回，但是我这边数据还没有传送完，所以当我传送完的时候， ACK 我会告诉你是 X 】
  - 服务器发送 Fin=1、Ack=X、Seq=Y 报文【 (服务器) : 我这边数据传输完了，可以关闭了，ACK 给你传了 X，如果你那边已经决定断开则 ACK 给我回传一个 Y 】
  - 客户端发送 Ack=Y、Seq=X 报文【 (浏览器) : 我决定断开了，ACK 给你传个 Y 】
7. 浏览器接收响应数据并解析 html 、js、css 等资源
8. 浏览器布局并渲染
9. 页面呈现

## 4. 如何进行网站性能优化 ?

**浏览器处理用户请求的过程 :**

重定向 -> 拉取缓存 -> DNS 查询 -> 建立 TCP 连接 -> 发起请求 -> 接收响应 -> 处理 HTML 元素 -> 元素加载完成

### 一、网络性能优化 :

#### 减少请求次数

**1. 使用缓存**

## 5.异步并发限制怎么做？

### 5.1 实现一个带并发限制的promise异步调度器

实现思路：

先把要执行的promise function 存到数组内
最多执行为2，那我们必然是要启动的时候就要让两个promise函数执行
设置一个临时变量，表示当前执行ing几个promise
然后一个promise执行完成将临时变量-1
然后借助递归重复执行

```js
class Scheduler {
  constructor(){
    this.promises = []
    this.limits = 2
    this.count = 0
  }

  add(promiseCreator){
    this.promises.push(promiseCreator)
  }
  async send() {
    if (this.promises.length === 0 || this.count >= this.limits) { return }
    this.count++
    await this.promises.shift()()
    this.count--
    this.send.bind(this)()
    // this.promises.shift()().then(() => {
    //   this.count--
    //   this.send.bind(this)()
    // })
  }
  run() {
    for (let i = 0; i < this.limits; i++) {
      this.send.bind(this)()
    }
  }
}

var scheduler = new Scheduler()

const  timeout = (time) => {
  return new Promise(resolve=>{
      setTimeout(resolve,time)
  })
}
const addTask = (time,order) => {
  scheduler.add(()=> timeout(time).then( ()=>console.log(order) ) )
}
// 3421 控制并发为后执行是2314
addTask(1000,1)
addTask(500,2)
addTask(300,3)
addTask(400,4)

scheduler.run()

```

### 5.2 前端如果 100 个请求，你怎么用 Promise 去控制并发？

```js
// 设计一个函数，可以限制请求的并发，同时请求结束之后，调用callback函数
sendRequest(requestList: , limits, callback): voidsendRequest([
		() => request('1'), 
		() => request('2'), 
		() => request('3'), 
		() => request('4')],3, //并发数
		(res)=>{
			console.log(res)
}) 
function request (url,time=1){
		return new Promise((resolve,reject)=>{
			setTimeout(()=>{
				console.log('请求结束：'+url);
				if(Math.random() > 0.5){
					resolve('成功')
				}else{
					reject('错误;')
				}
			},time*1e3)
		})
}
```

**await实现**

1. 用race的特性可找到并发任务里最快结束的请求
2. 用for await 可保证for结构体下面的代码是最后await后的微任务，而在最后一个微任务下，可保证所有的promise已经存入promises里（如果没命中任何一个await，即限制并发数>任务数的时候，虽然不是在微任务当中，也可以保证所有的promise都在里面），最后利用allSettled，等待所有的promise状态转变后，调用回调函数
3. 并发任务池用Set结构存储，可通过指针来删除对应的任务，通过闭包引用该指针从而达到 动态控制并发池数目
4. for await 结构体里，其实await下面，包括结构体外都是属于微任务（前提是有一个await里面的if被命中），至于这个微任务什么时候被加入微任务队列，要看请求的那里的在什么时候开始标记（resolve/reject）
5. for await 里其实已经在此轮宏任务当中并发执行了，await后面的代码被挂起来，等前一个promise转变状态–>移出pool–>将下一个promise捞起加入pool当中 -->下一个await等待最快的promise，如此往复。

```js
async function sendRequest(requestList,limits,callback){
  // 维护一个promise队列
  const promises = [] 
  const pool = new Set() // 当前的并发池,用Set结构方便删除
  // 开始并发执行所有的任务
  for(let request of requestList){
    // 开始执行前，先await 判断 当前的并发任务是否超过限制
    if (pool.size >= limits) { 
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool).catch(err => err)
    }

    const promise = request()
    const cb = () => {
      pool.delete(promise) // 从并发池中删除
    }
    promise.then(cb,cb)
    pool.add(promise) // 添加到并发池
    promises.push(promise) // 添加到promise队列
    // 一旦有一个请求完成，就从并发池中删除，并且从队列中删除
  }
  // 等最后一个for await 结束，这里是属于最后一个 await 后面的 微任务

  // 注意这里其实是在微任务当中了，当前的promises里面是能确保所有的promise都在其中(前提是await那里命中了if)
  Promise.allSettled(promises).then(callback,callback)
}
```

**采用递归调用来实现**

```js
function multiRequest(urls, maxNum) {
 const len = urls.length; // 请求总数量
 const res = new Array(len).fill(0); // 请求结果数组
 let sendCount = 0; // 已发送的请求数量
 let finishCount = 0; // 已完成的请求数量
 return new Promise((resolve, reject) => {
     // 首先发送 maxNum 个请求，注意：请求数可能小于 maxNum，所以也要满足条件2
     // 同步的 创建maxNum个next并行请求 然后才去执行异步的fetch 所以一上来就有5个next并行执行
     while (sendCount < maxNum && sendCount < len) { 
         next();
     }
     function next () {
         let current = sendCount ++; // 当前发送的请求数量，后加一 保存当前请求url的位置
         // 递归出口
         if (finishCount >= len) { 
         // 如果所有请求完成，则解决掉 Promise，终止递归
             resolve(res);
             return;
         }
         const url = urls[current];
         fetch(url).then(result => {
             finishCount ++;
             res[current] = result;
             if (current < len) { // 如果请求没有发送完，继续发送请求
                 next();
             }
         }, err => {
             finishCount ++;
             res[current] = err;
             if (current < len) { // 如果请求没有发送完，继续发送请求
                 next();
             }
         });
     }
 });
}

```

