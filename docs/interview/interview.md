# 前端面试 - JavaScript【大厂相关】

[TOC]

## 一、阿里(25 问) 

### 1. 使⽤过的koa2中间件 



### 2. koa-body原理



### 3. 介绍⾃⼰写过的中间件 



 ### 4. 有没有涉及到Cluster

 

### 5. master挂了的话pm2怎么处理 



### 6. 如何和MySQL进⾏通信  



### 7. React声明周期及⾃⼰的理解 



### 8. 如何配置React-Router 



### 9. 路由的动态加载模块



### 10. 服务端渲染SSR



### 11. 介绍路由的 history 与 browser 的区别



### 12. 介绍Redux数据流的流程



### 13. Redux如何实现多个组件之间的通信，多个组件使⽤相同状态如何进⾏ 管理



### 14. 多个组件之间如何拆分各⾃的state，每块⼩的组件有⾃⼰的状态，它们 之间还有⼀些公共的状态需要维护，如何思考这块



### 15. 使⽤过的Redux中间件



### 16. 常⻅Http请求头



### 17. 如何解决跨域的问题



### 18. 移动端适配1px的问题 



### 19. 介绍flex布局



### 20. 使⽤过webpack⾥⾯哪些plugin和loader



### 21. webpack⾥⾯的插件是怎么实现的 ?



### 22. dev-server是怎么跑起来的 ?



### 23. 抽取公共⽂件是怎么配置的 ?



### 24. 项⽬中如何处理安全问题



### 25. 怎么实现this对象的深拷⻉



## 二、网易(26 问)

### 1. 介绍redux，主要解决什么问题 



### 2. ⽂件上传如何做断点续传 



### 3. 表单可以跨域吗 



### 4. promise、async有什么区别 



### 5. 搜索请求如何处理（防抖） 



### 6. 搜索请求中⽂如何请求 



### 7. 介绍观察者模式 



### 8. 介绍中介者模式 



### 9. 观察者和订阅-发布的区别，各⾃⽤在哪⾥ 



### 10. 介绍react优化 



### 11. 介绍http2.0 



### 12. 通过什么做到并发请求 



### 13. http1.1时如何复⽤tcp连接 



### 14. 介绍service worker 



### 15. 介绍css3中position:sticky 



### 16. redux请求中间件如何处理并发 



### 17. 介绍Promise，异常捕获 



### 18. 介绍position属性包括CSS3新增 



### 19. 浏览器事件流向 



### 20. 介绍事件代理以及优缺点 



### 21. React组件中怎么做事件代理 



### 22. React组件事件代理的原理 



### 23. 介绍this各种情况 



### 24. 前端怎么控制管理路由 



### 25. 使⽤路由时出现问题如何解决 



### 26. React怎么做数据的检查和变化



## 三、滴滴(28 问)

### 1. react-router怎么实现路由切换 

### 2. react-router⾥的标签和标签有什么区别 

### 3. 标签默认事件禁掉之后做了什么才实现了跳转 

### 4. React层⾯的性能优化 

### 5. 整个前端性能提升⼤致分⼏类 



### 6. import { Button } from 'antd'，打包的时候只打包button， 分模块加载，是怎么做到的 



### 7. 使⽤import时，webpack对node_modules⾥的依赖会做什么 



### 8. JS异步解决⽅案的发展历程以及优缺点 



### 9. Http报⽂的请求会有⼏个部分 



### 10. cookie放哪⾥，cookie能做的事情和存在的价值 



### 11. cookie和token都存放在header⾥⾯，为什么只劫持前者 



### 12. cookie和session有哪些⽅⾯的区别 



### 13. React中Dom结构发⽣变化后内部经历了哪些变化

###  

### 14. React挂载的时候有3个组件，textComponent、 composeComponent、domComponent，区别和关系，Dom结构发⽣变化 时怎么区分data的变化，怎么更新，更新怎么调度，如果更新的时候还有其 他任务存在怎么处理 



### 15. key主要是解决哪⼀类的问题，为什么不建议⽤索引index（重绘） 



### 16. Redux中异步的请求怎么处理 



### 17. Redux中间件是什么东⻄，接受⼏个参数（两端的柯⾥化函数） 



### 18. 柯⾥化函数两端的参数具体是什么东⻄ 



### 19. 中间件是怎么拿到store和action，然后怎么处理

###  

### 20. state是怎么注⼊到组件的，从reducer到组件经历了什么样的过程 



### 21. koa中response.send、response.rounded、response.json发⽣了

### 什么 事，浏览器为什么能识别到它是⼀个json结构或是html 



### 22. koa-bodyparser怎么来解析request 



### 23. webpack整个⽣命周期，loader和plugin有什么区别 



### 24. 介绍AST（Abstract Syntax Tree）抽象语法树 



### 25. 安卓Activity之间数据是怎么传递的 



### 26. 安卓4.0到6.0过程中WebView对js兼容性的变化 



### 27. WebView和原⽣是如何通信 



### 28. 跨域怎么解决，有没有使⽤过Apache等⽅案



## 四、头条(17 问)

### 1. 对async、await的理解，内部原理 



### 2. 介绍下Promise，内部实现 



### 3. 清除浮动 



### 4. 定位问题（绝对定位、相对定位等） 



### 5. 从输⼊URL到⻚⾯加载全过程 



### 6. tcp3次握⼿ 



### 7. tcp属于哪⼀层（1 物理层 -> 2 数据链路层 -> 3 ⽹络层(ip)-> 4 传输层 (tcp) -> 5 应⽤层(http)） 



### 8. redux的设计思想 



### 9. 接⼊redux的过程 



### 10. 绑定connect的过程 



### 11. connect原理 



### 12. webpack介绍 



### 13. == 和 ===的区别，什么情况下⽤相等== 



### 14. bind、call、apply的区别 



### 15. 动画的了解 



### 16. 介绍下原型链（解决的是继承问题吗） 



### 17. 对跨域的了解



### 五、有赞(24 问)

### 1. Linux 754 介绍 



### 2. 介绍冒泡排序，选择排序，冒泡排序如何优化 



### 3. transform动画和直接使⽤left、top改变位置有什么优缺点 



### 4. 如何判断链表是否有环 



### 5. 介绍⼆叉搜索树的特点 



### 6. 介绍暂时性死区 



### 7. ES6中的map和原⽣的对象有什么区别 



### 8. 观察者和发布-订阅的区别 



### 9. react异步渲染的概念,介绍Time Slicing 和 Suspense 



### 10. 16.X声明周期的改变 



### 11. 16.X中props改变后在哪个⽣命周期中处理 



### 12. 介绍纯函数 



### 13. 前端性能优化 



### 14. pureComponent和FunctionComponent区别 



### 15. 介绍JSX 16. 如何做RN在安卓和IOS端的适配 



### 17. RN为什么能在原⽣中绘制成原⽣组件（bundle.js） 



### 18. 介绍虚拟DOM 19. 如何设计⼀个localStorage，保证数据的实效性 



### 20. 如何设计Promise.all() 



### 21. 介绍⾼阶组件 



### 22. sum(2, 3)实现sum(2)(3)的效果 



### 23. react性能优化 



### 24. 两个对象如何⽐较



### 六、挖财(24 问)

### 1.  JS的原型 



### 2. 变量作⽤域链 



### 3. call、apply、bind的区别 



### 4. 防抖和节流的区别 



### 5. 介绍各种异步⽅案 



### 6. react⽣命周期 



### 7. 介绍Fiber 



### 8. 前端性能优化 



### 9. 介绍DOM树对⽐ 



### 10. react中的key的作⽤ 



### 11. 如何设计状态树 



### 12. 介绍css，xsrf 



### 13. http缓存控制 



### 14. 项⽬中如何应⽤数据结构 



### 15. native提供了什么能⼒给RN 



### 16. 如何做⼯程上的优化 



### 17. shouldComponentUpdate是为了解决什么问题 



### 18. 如何解决props层级过深的问题 



### 19. 前端怎么做单元测试 



### 20. webpack⽣命周期 



### 21. webpack打包的整个过程 



### 22. 常⽤的plugins 



### 23. pm2怎么做进程管理，进程挂掉怎么处理 



### 24. 不⽤pm2怎么做进程管理



## 七、泸江(23 问)

### 1. 介绍下浏览器跨域 



### 2. 怎么去解决跨域问题 



### 3. jsonp⽅案需要服务端怎么配合 



### 4. Ajax发⽣跨域要设置什么（前端） 



### 5. 加上CORS之后从发起到请求正式成功的过程 



### 6. xsrf跨域攻击的安全性问题怎么防范 



### 7. 使⽤Async会注意哪些东⻄ 



### 8. Async⾥⾯有多个await请求，可以怎么优化（请求是否有依赖） 



### 9. Promise和Async处理失败的时候有什么区别 



### 10. Redux在状态管理⽅⾯解决了React本身不能解决的问题 



### 11. Redux有没有做过封装 



### 12. react⽣命周期，常⽤的⽣命周期 



### 13. 对应的⽣命周期做什么事 



### 14. 遇到性能问题⼀般在哪个⽣命周期⾥解决 



### 15. 怎么做性能优化（异步加载组件...） 



### 16. 写react有哪些细节可以优化 



### 17. React的事件机制（绑定⼀个事件到⼀个组件上） 



### 18. 介绍下事件代理，主要解决什么问题 



### 19. 前端开发中⽤到哪些设计模式 



### 20. React/Redux中哪些功能⽤到了哪些设计模式 



### 21. JS变量类型分为⼏种，区别是什么 



### 22. JS⾥垃圾回收机制是什么，常⽤的是哪种，怎么处理的 



### 23. ⼀般怎么组织CSS（Webpack）



## 八、饿了吗(25 问)

### 1. ⼩程序⾥⾯开⻚⾯最多多少 



### 2. React⼦⽗组件之间如何传值 



### 3. Emit事件怎么发，需要引⼊什么 



### 4. 介绍下React⾼阶组件，和普通组件有什么区别 



###  5. ⼀个对象数组，每个⼦对象包含⼀个id和name，React如何渲染出全部的 name 



###  6. 在哪个⽣命周期⾥写 



###  7. 其中有⼏个name不存在，通过异步接⼝获取，如何做 



###  8. 渲染的时候key给什么值，可以使⽤index吗，⽤id好还是index好 a. webpack如何配sass，需要配哪些loader b. 配css需要哪些loader 



###  9. 如何配置把js、css、html单独打包成⼀个⽂件 



###  10. div垂直⽔平居中（flex、绝对定位） 



###  11. 两个元素块，⼀左⼀右，中间相距10像素 



###  12. 上下固定，中间滚动布局如何实现 



###  13. [1, 2, 3, 4, 5]变成[1, 2, 3, a, b, 5] 



###  14. 取数组的最⼤值（ES5、ES6） 



###  15. apply和call的区别 



###  16. ES5和ES6有什么区别 



###  17. some、every、find、filter、map、forEach有什么区别 



###  18. 上述数组随机取数，每次返回的值都不⼀样 



###  19. 如何找0-5的随机数，95-99呢 



###  20. ⻚⾯上有1万个button如何绑定事件 



###  21. 如何判断是button 



###  22. ⻚⾯上⽣成⼀万个button，并且绑定事件，如何做（JS原⽣操作DOM） 



###  23. 循环绑定时的index是多少，为什么，怎么解决 



###  24. ⻚⾯上有⼀个input，还有⼀个p标签，改变input后p标签就跟着变化， 如何处理 



###  25. 监听input的哪个事件，在什么时候触发



## 九、携程(7 问)

### 1. 对React看法，有没有遇到⼀些坑 



### 2. 对闭包的看法，为什么要⽤闭包 



### 3. ⼿写数组去重函数 



### 4. ⼿写数组扁平化函数 



### 5. 介绍下Promise的⽤途和性质 



### 6. Promise和Callback有什么区别 



### 7. React⽣命周期



## 十、喜马拉雅(30 问)

### 1. ES6新的特性 



### 2. 介绍Promise 



### 3. Promise有⼏个状态 



### 4. 说⼀下闭包 



### 5. React的⽣命周期 



### 6. componentWillReceiveProps的触发条件是什么 



### 7. React16.3对⽣命周期的改变 



### 8. 介绍下React的Filber架构 



### 9. 画Filber渲染树 



### 10. 介绍React⾼阶组件 



### 11. ⽗⼦组件之间如何通信 



### 12. Redux怎么实现属性传递，介绍下原理 



### 13. React-Router版本号 



### 14. ⽹站SEO怎么处理 



### 15. 介绍下HTTP状态码 



### 16. 403、301、302是什么 



### 17. 缓存相关的HTTP请求头 



### 18. 介绍HTTPS 



### 19. HTTPS怎么建⽴安全通道 



### 20. 前端性能优化（JS原⽣和React） 



### 21. ⽤户体验做过什么优化 



### 22. 对PWA有什么了解 



### 23. 对安全有什么了解 



### 24. 介绍下数字签名的原理 



### 25. 前后端通信使⽤什么⽅案 



### 26. RESTful常⽤的Method 



### 27. 介绍下跨域 



### 28. Access-Control-Allow-Origin在服务端哪⾥配置 



### 29. csrf跨站攻击怎么解决 



### 30. 前端和后端怎么联调



## 十一、兑吧(33 问)

### 1. localStorage和cookie有什么区别 



### 2. CSS选择器有哪些 



### 3. 盒⼦模型，以及标准情况和IE下的区别 



### 4. 如何实现⾼度⾃适应 



### 5. prototype和\_\_proto\_\_区别 



### 6. _construct是什么 



### 7. new是怎么实现的 



### 8. promise的精髓，以及优缺点 



### 9. 如何实现H5⼿机端的适配 



### 10. rem、flex的区别（root em） 



### 11. em和px的区别 



### 12. React生命周期 



### 13. 如何去除url中的#号 



### 14. Redux状态管理器和变量挂载到window中有什么区别 



### 15. webpack和gulp的优缺点 



### 16. 如何实现异步加载 



### 17. 如何实现分模块打包（多⼊⼝） 



### 18. 前端性能优化（1js css；2 图⽚；3 缓存预加载； 4 SSR； 5 多域名加 载；6 负载均衡） 



### 19. 并发请求资源数上限（6个） 



### 20. base64为什么能提升性能，缺点 



### 21. 介绍webp这个图⽚⽂件格式 



### 22. 介绍koa2 



### 23. Promise如何实现的 



### 24. 异步请求，低版本fetch如何低版本适配 



### 25. ajax如何处理跨域 



### 26. CORS如何设置 



### 27. jsonp为什么不⽀持post⽅法 



### 28. 介绍同源策略 



### 29. React使⽤过的⼀些组件 



### 30. 介绍Immuable 



### 31. 介绍下redux整个流程原理 



### 32. 介绍原型链



### 33. 如何继承



## 十二、微医(40 问)

### 1. 介绍JS数据类型，基本数据类型和引⽤数据类型的区别 

### 2. Array是Object类型吗 

### 3. 数据类型分别存在哪⾥ 

> a. var a = {name: "前端开发"}; 
>
> var b = a; 
>
> a = null那么b 输出什么 
>
> b. var a = {b: 1}存放在哪⾥ 
>
> c. var a = {b: {c: 1}}存放在哪⾥





### 4. 栈和堆的区别 



### 5. 垃圾回收时栈和堆的区别 



### 6. 数组⾥⾯有10万个数据，取第⼀个元素和第10万个元素的时间相差多少 



### 7. 栈和堆具体怎么存储 



### 8. 介绍闭包以及闭包为什么没清除 



### 9. 闭包的使⽤场景 



### 10. JS怎么实现异步 



### 11. 异步整个执⾏周期 



### 12. Promise的三种状态 



### 13. Async/Await怎么实现 



### 14. Promise和setTimeout执⾏先后的区别 



### 15. JS为什么要区分微任务和宏任务 



### 16. Promise构造函数是同步还是异步执⾏，then呢 



### 17. 发布-订阅和观察者模式的区别 



### 18. JS执⾏过程中分为哪些阶段 



### 19. 词法作⽤域和this的区别 



### 20. 平常是怎么做继承 



### 21. 深拷⻉和浅拷⻉ 



### 22. loadsh深拷⻉实现原理 



### 23. ES6中let块作⽤域是怎么实现的 



### 24. React中setState后发⽣了什么 a. setState为什么默认是异步 b. setState什么时候是同步的 



### 25. 为什么3⼤框架出现以后就出现很多native（RN）框架（虚拟DOM） 



### 26. 虚拟DOM主要做了什么 



### 27. 虚拟DOM本身是什么（JS对象）



### 28. 304是什么 



### 29. 打包时Hash码是怎么⽣成的 



### 30. 随机值存在⼀样的情况，如何避免 



### 31. 使⽤webpack构建时有⽆做⼀些⾃定义操作 



### 32. webpack做了什么 



### 33. a，b两个按钮，点击aba，返回顺序可能是baa，如何保证是 aba（Promise.then） 

> a. node接⼝转发有⽆做什么优化 
>
> b. node起服务如何保证稳定性，平缓降级，重启等



### 34. RN有没有做热加载 



### 35. RN遇到的兼容性问题 



### 36. RN如何实现⼀个原⽣的组件 



### 37. RN混原⽣和原⽣混RN有什么不同 



### 38. 什么是单⻚项⽬ 



### 39. 遇到的复杂业务场景 



### 40. Promise.all实现原理



## 十三、寺库(20 问)

### 1. 介绍Promise的特性，优缺点 



### 2. 介绍Redux 



### 3. RN的原理，为什么可以同时在安卓和IOS端运⾏ 



### 4. RN如何调⽤原⽣的⼀些功能 



### 5. 介绍RN的缺点 



### 6. 介绍排序算法和快排原理 



### 7. 堆和栈的区别 



### 8. 介绍闭包 



### 9. 闭包的核⼼是什么 



### 10. ⽹络的五层模型 



### 11. HTTP和HTTPS的区别 



### 12. HTTPS的加密过程 



### 13. 介绍SSL和TLS 



### 14. 介绍DNS解析 



### 15. JS的继承⽅法 



### 16. 介绍垃圾回收 



### 17. cookie的引⽤为了解决什么问题 



### 18. cookie和localStorage的区别 



### 19. 如何解决跨域问题 



### 20. 前端性能优化



## 十四、宝宝树(15 问)

### 1. 使⽤canvas绘图时如何组织成通⽤组件 



### 2. formData和原⽣的ajax有什么区别 



### 3. 介绍下表单提交，和formData有什么关系 



### 4. 介绍redux接⼊流程 



### 5. rudux和全局管理有什么区别（数据可控、数据响应） 



### 6. RN和原⽣通信 7. 介绍MVP怎么组织 



### 8. 介绍异步⽅案 



### 9. promise如何实现then处理 



### 10. koa2中间件原理 



### 11. 常⽤的中间件 



### 12. 服务端怎么做统⼀的状态处理 



### 13. 如何对相对路径引⽤进⾏优化 



### 14. node⽂件查找优先级 



### 15. npm2和npm3+有什么区别



## 十五、海康威视(15 问)

### 1. knex连接数据库响应回调 



### 2. 介绍异步⽅案 



### 3. 如何处理异常捕获 



### 4. 项⽬如何管理模块 



### 5. 前端性能优化 



### 6. JS继承⽅案 



### 7. 如何判断⼀个变量是不是数组 



### 8. 变量a和b，如何交换 



### 9. 事件委托 



### 10. 标签⽣成的Dom结构是⼀个类数组 



### 11. 类数组和数组的区别 



### 12. dom的类数组如何转成数组 



### 13. 介绍单⻚⾯应⽤和多⻚⾯应⽤ 



### 14. redux状态树的管理 



### 15. 介绍localstorage的API



## 十六、蘑菇街(15 问)

### 1. html语义化的理解 



### 2. \<b\> 和 \<strong\> 的区别



### 3. 对闭包的理解 



### 4. ⼯程中闭包使⽤场景 



### 5. 介绍this和原型 



### 6. 使⽤原型最⼤的好处 



### 7. react设计思路 



### 8. 为什么虚拟DOM⽐真实DOM性能好 



### 9. react常⻅的通信⽅式 



### 10. redux整体的⼯作流程 



### 11. redux和全局对象之间的区别 



### 12. Redux数据回溯设计思路 



### 13. 单例、⼯⼚、观察者项⽬中实际场景 



### 14. 项⽬中树的使⽤场景以及了解 



### 15. ⼯作收获



## 十七、酷家乐(21 问)

### 1. react⽣命周期 



### 2. react性能优化 



### 3. 添加原⽣事件不移除为什么会内存泄露 



### 4. 还有哪些地⽅会内存泄露 



### 5. setInterval需要注意的点 



### 6. 定时器为什么是不精确的 



### 7. setTimeout(1)和setTimeout(2)之间的区别 



### 8. 介绍宏任务和微任务 



### 9. promise⾥⾯和then⾥⾯执⾏有什么区别 



### 10. 介绍pureComponet 



### 11. 介绍Function Component 



### 12. React数据流 



### 13. props和state的区别 



### 14. 介绍react context 



### 15. 介绍class和ES5的类以及区别 



### 16. 介绍箭头函数和普通函数的区别 



### 17. 介绍defineProperty⽅法，什么时候需要⽤到 



### 18. for..in 和 object.keys的区别 



### 19. 介绍闭包，使⽤场景 



### 20. 使⽤闭包特权函数的使⽤场景 



### 21. get和post有什么区别



## 十八、百分点(14 问)

### 1. React15/16.x的区别 



### 2. 重新渲染render会做些什么 



### 3. 哪些⽅法会触发react重新渲染 



### 4. state和props触发更新的⽣命周期分别有什么区别 



### 5. setState是同步还是异步 



### 6. 对⽆状态组件的理解 



### 7. 介绍Redux⼯作流程 



### 8. 介绍ES6的功能 



### 9. let、const以及var的区别 



### 10. 浅拷⻉和深拷⻉的区别 



### 11. 介绍箭头函数的this 



### 12. 介绍Promise和then 



### 13. 介绍快速排序 



### 14. 算法：前K个最⼤的元素



## 十九、海风教育(14 问)

### 1. 对react看法，它的优缺点 



### 2. 使⽤过程中遇到的问题，如何解决的 



### 3. react的理念是什么（拿函数式编程来做⻚⾯渲染） 



### 4. JS是什么范式语⾔(⾯向对象还是函数式编程) 



### 5. koa原理，为什么要⽤koa(express和koa对⽐) 



### 6. 使⽤的koa中间件 



### 7. ES6使⽤的语法 



### 8. Promise 和 async/await 和 callback的区别 



### 9. Promise有没有解决异步的问题（promise链是真正强⼤的地⽅） 



### 10. Promise和setTimeout的区别（Event Loop） 



### 11. 进程和线程的区别（⼀个node实例就是⼀个进程，node是单线程，通过 事件循环来实现异步 



### 12. 介绍下DFS深度优先 



### 13. 介绍下观察者模式 



### 14. 观察者模式⾥⾯使⽤的数据结构(不具备顺序 ，是⼀个list)
