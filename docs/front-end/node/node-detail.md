# node API

## Buffer

### Buffer 是什么
是一个计算机的数据结构，表示的是一个固定长度的缓冲序列。
File -> Buffer 的缓冲区 -> wait 进程再去处理

### Buffer 的 API
#### 声明
```js
// 1. 创建一个长度为 5 字节的内存
const buf = Buffer.alloc(5);

// 2. 创建一个长度为 5 的 Buffer，并初始化
const buf2 = Buffer.from('张三');

const buf3 = Buffer.from([0xe9, 0xba, 0x93]);
console.log(buf1)
console.log(buf2)
console.log(buf3.toString())
```
#### 拼接
```js
const buf4 = Buffer.from('张三');
let new_buf = Buffer.alloc(6);

buf4.copy(new_buf, 0, 0, 3);
buf2.copy(new_buf, 3, 0, 3);

console.log(new_buf.toString())
console.log(new_buf.toString('utf-8'))
console.log(new_buf.toString('hex'))
console.log(new_buf.toString('utf-8', 0, 6))
console.log(new_buf.toString('base64'))
/**
 * base -> baseURL
 * 1. + -> -
 * 2. / -> _
 * 3. = 去掉
 */

// 判断数据是否是 Buffer 类型
console.log(Buffer.isBuffer(new_buf))
console.log(Buffer.isBuffer(buf1))
```

```js
let buf = Buffer.alloc(100);

fs.open(path.resolve(__dirname, './a.js'), 'r', function (err, rfd) {
  fs.read(rfd, buf, 0, 100, 0, function (err, bytesRead) {
    console.log(buf);

    fs.open(path.resolve(__dirname, './b.js'), 'w', 0o666, function(err, wfd) {
      fs.write(wfd, buf, 0, 100, 0 , function(err, written) {
        console.log('写入成功');
      })
    })
  })
})
```
#### node 显示乱码
1. 中文，特殊语言是编码解码不一致
```js
const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, '../../readme.md'), 'utf-8', (err, data) => {
  console.log(data)
  fs.writeFile(path.resolve(__dirname, '../../re.md'), data, (err) => {
    console.log('success')
  })
})
fs.readFile(path.resolve(__dirname, '../../readme.md'), 'latin1', (err, data) => {
  console.log(data)  
})
```
## stream
```js

let arr = []
const res = fs.createReadStream(path.resolve(__dirname, '../../a.js'), {
  flags: 'r',
  start: 0,
  end: 1000,
  highwateMark: 20, // 64k
  autoClose: true,
  emitClose: true,
});

res.on('open', function(fd) {
  console.log('fd', fd);
})

res.on('data', function(data) {
  console.log('data', data);
})

res.on('end', function(data) {
  console.log('end', Buffer.concat(arr).toString())
})
```

```js
// 压缩文件
const zlib = require('zlib');

const res = fs.createReadStream(path.resolve(__dirname, '../../a.js'))
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(path.resolve(__dirname, '../../a.js.gz')));
```

## eventEmitter
发布订阅 和 观察者模式
我让我的函数，在该执行的时候，进行执行
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})
.then(res => {
  console.log('xxx')
})
```

```js
const e = new EventEmitter();
e.on('text', (params) => {
  console.log('text', params)
})

e.emit('text', '123')
```

```js
// 手写发布订阅
function EventEmitter() {
  this._events = {

  }
}
EventEmitter.prototype.on = function(eventName, cb) {
  if (!this._events) {
    this._events = {}
  }
  let eventList = this._events[eventName] || (this._events[eventName] = []);
  eventList.push(cb)

}

EventEmitter.prototype.emit = function(eventName, ...rest) {
  this._events[eventName] && this._events[eventName].forEach(cb => cb(...rest))
}

EventEmitter.prototype.off = function(eventName, cb) {
  if (this._events[eventName]) {
    this._events[eventName] = this._events[eventName]
      .filter(item => (item !== cb) && (item.cb !== cb))
  }
}

EventEmitter.prototype.once = function(eventName, cb) {
  const once = (...rest) => {
    cb(...rest);
    this.off(eventName, once);
  }

  this.on(eventName, once);
}

const e = new EventEmitter();
const handle1 = function (msg) {
  console.log('handle1: ', msg);
}

const handle2 = function (msg) {
  console.log('handle2: ', msg);
}

e.on('data', handle1)

e.once('data', handle2)

e.off('data', handle2)
setTimeout(() => {
  e.emit('data', '123')
  e.emit('data', '张三')
})
// emit 和 on 是 无耦合的
```

```ts
abstract class Observer {
  subject: Subject;
  constructor(subject: Subject) {
    this.subject = subject;
    this.subject.attach(this);
  }

  abstract run(data: String | Number): void;
}

class Subject {
  deps: Array<Observer>;
  state: Number;

  constructor() {
    this.deps = [];
    this.state = 0;
  }

  attach(obs: Observer) {
    this.deps.push(obs);
  }

  setState(num: Number) {
    this.state = num;
    this.notifyAllObserver()
  }

  notifyAllObserver() {
    this.deps.forEach(obs => {
      obs.run(this.state);
    })
  }
}


class BinaryObserver extends Observer {
  constructor(subject: Subject) {
    super(subject);
  }

  run(data: String | Number): void {
    console.log('hello this is the binary observer:', data.toString(2));
  }
}

class ArrayObserver extends Observer {
  constructor(subject: Subject) {
    super(subject);
  }

  run(data: Number) {
    console.log('hello this is the array observer', data.toString(8));
  }
}

const subject = new Subject();
const obs = new  BinaryObserver(subject);
const obs2 = new ArrayObserver(subject);
subject.setState(10);
```

## node 事件循环
AIO 异步非阻塞 I/O
餐厅的服务员
### node.js 运行机制
- V8 解析 JavaScript 脚本
- 解析后的 JS 代码，调用 Node API
- libuv 库负责 Node API 的执行, 将不同的任务，分配给不同的线程，形成一个 Event Loop 事件循环
- 以异步的方式将任务的执行结果返回给 V8 引擎
- V8 再将结果返回给用户

### node.js 事件循环的阶段
      procsss.nectTick / Promise ...
                |
    |------------------------|  
|——>|          timers        | 定时器：setTimeout, setInterval
|   |________________________|
|     process.nextTick / promise...
|               |
|   |------------------------|  
|   |  pending callbacks     | 执行延迟到下一个循环迭代的 I/O 回调
|   |________________________|
|     process.nextTick / promise...
|               |
|   |------------------------|  
|   |       idle,prepare     | 系统内部使用，闲置阶段
|   |________________________|
|     process.nextTick / promise...
|               |                     |-----------------|
|   |------------------------|        |   incoming,     |
|——>|       poll 轮询阶段     | <------|   connections,  |
|   |________________________|        |   data, etc.    |
|     process.nextTick / promise...   |_________________|
|               |
|   |------------------------|  
|——>|  check 检查阶段         | setImmediate
|   |________________________|
|     process.nextTick / promise...
|               |
|   |------------------------|  
|——>|  close callbacks       | 关闭回调函数
|   |________________________| socket.on('close', func...)
1. timer 阶段
  执行 setTimeout / setInterval 回调函数, 并且是由 poll 阶段控制的
2. pending callbacks
  执行部分的回调，除了 close, times, setImmediate 设置的回调
3. idle, prepare

4. poll - 在适当的条件下，node会在这里阻塞
  如果没有 timer, 会发生两件事情
  - 如果 poll 队列不为空，会遍历回调队列并同步执行
  - 如果 poll 队列为空
    - 有 setImmediate 会直接结束 poll 阶段进入 check 阶段
    - 如果没有 setImmediate 会等待回调函数加入 poll 队列，并立即执行回调函数
3. check 阶段

```js
async function async1() {
  console.log('async1 started');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2')
}
console.log('script start');
setTimeout(() => {
  console.log('setTimeout0')
  setTimeout(() => {
    console.log('setTimeout1')
  }, 0)

  setImmediate(() => {
    console.log('setImmediate')
  })
}, 0);

async1();

process.nextTick(() => {
  console.log('nextTick')
})

new Promise(resolve => {
  console.log('promise1')
  resolve();
  console.log('promise2')
}).then(() => {
  console.log('promise.then')
})
console.log('script end');
```

## 安全
1. 通信链路 - https
  1. 证书
  2. 非对称加密
  3. 对称加密
2. JWT(header, payload, signature) 或者 authentication cookie 到底存在哪里？
- cookie 存储
  HttpOnly cookie  / JS enabled / xss enabled
  
  secure cookie / https / 
  
  Samesite cookie / cors enabled / csrf enabled

3. helmetjs


## path

>path模块在不同的操作系统是有差异的(windows | posix)

- path.dirname
  
这个API和basename正好互补

dirname API 返回 `/aaaa/bbbb/cccc` 除了最后一个路径的其他路径。
basename API 返回 最后一个路径 index.html

- path.extname

返回扩展名

- path.join

用于拼接路径

- path.reslove

用于将相对路径解析并且返回绝对路径
```js
// 传入了多个绝对路径 它将返回最右边的绝对路径
path.resolve('/aaa','/bbb','/ccc')
//   /ccc

// 传入绝对路径 + 相对路径
path.resolve(__dirname,'./index.js')

// 如果只传入相对路径
path.resolve('./index.js')
// 返回工作目录 + index.js
```

- path.parse path.format

parse用于解析文件路径
path.format 和 path.parse 正好互补

```js
path.parse('/home/user/dir/file.txt')
{
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
```

## os

- os.type()	它在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'
- os.platform()	返回标识为其编译 Node.js 二进制文件的操作系统平台的字符串。 该值在编译时设置。 可能的值为 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos'、以及 'win32'
- os.release()	返回操作系统的版本例如10.xxxx win10
- os.homedir()	返回用户目录 例如c:\user\xiaoman 原理就是 windows echo %USERPROFILE% posix $HOME
- os.arch()	返回cpu的架构 可能的值为 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'
- os.cpus() 获取CPU的线程以及详细信息
- os.networkInterfaces() 获取网络信息

```js
// vite配置项可以打开浏览器 open:true
function openBrowser(url: string) {
  if (platform() === 'darwin') {  // macOS
    exec(`open ${url}`); //执行shell脚本
  } else if (platform() === 'win32') {  // Windows
    exec(`start ${url}`); //执行shell脚本
  } else {  // Linux, Unix-like
    exec(`xdg-open ${url}`); //执行shell脚本
  }
}

// Example usage
openBrowser('https://www.juejin.cn');
```

## process

>process 是Nodejs操作当前进程和控制当前进程的API，并且是挂载到globalThis下面的全局API

1. process.arch
返回操作系统 CPU 架构 跟我们之前讲的os.arch 一样 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'

2. process.cwd()
返回当前的工作目录 例如在 F:\project\node> 执行的脚本就返回这个目录 也可以和path拼接代替__dirname使用

3. process.argv
获取执行进程后面的参数 返回是一个数组 后面我们讲到命令行交互工具的时候会很有用，各种cli脚手架也是使用这种方式接受配置参数例如webpack

```bash
$ pnpm dev --open --true

> file-upload@1.0.0 dev D:\learn-project\node\file-upload
> ts-node-dev --respawn --transpile-only  ./src/index.ts "--open" "--true"

[INFO] 16:59:10 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.4.3)
[
  'D:\\Software\\nodejs\\node.exe',
  './src/index.ts',
  '--open',
  '--true'
]
```
4. process.memoryUsage
用于获取当前进程的内存使用情况。该方法返回一个对象，其中包含了各种内存使用指标，如 rss（Resident Set Size，常驻集大小）、heapTotal（堆区总大小）、heapUsed（已用堆大小）和 external（外部内存使用量）等

5. process.exit()
调用 process.exit() 将强制进程尽快退出，即使仍有未完全完成的异步操作挂起

6. process.kill
与exit类似，kill用来杀死一个进程，接受一个参数进程id可以通过process.pid 获取

7. process.env
用于读取操作系统所有的环境变量，也可以修改和查询环境变量。

>修改 注意修改并不会真正影响操作系统的变量，而是只在当前线程生效，线程结束便释放。

## child_process

>子进程是Nodejs核心API，如果你会shell命令，他会有非常大的帮助，或者你喜欢编写前端工程化工具之类的，他也有很大的用处，以及处理CPU密集型应用

### **创建子进程**

Nodejs创建子进程共有7个API `Sync`同步API, 不加是异步API

spawn  执行命令
exec   执行命令
execFile   执行可执行文件
fork   创建node子进程
execSync 执行命令 同步执行
execFileSync 执行可执行文件 同步执行
spawnSync 执行命令 同步执行

### usage

- **exec**

```bash
child_process.exec(command, [options], callback)
```
- execSync

```bash
# 获取node版本号 如果要执行单次shell命令execSync方便一些
const nodeVersion  = execSync('node -v')
console.log(nodeVersion.toString("utf-8"))

# 打开谷歌浏览器 使用exec可以打开一些软件例如 wx 谷歌 qq音乐等 以下会打开百度并且进入无痕模式
execSync("start chrome http://www.baidu.com --incognito")
```

- execFile

execFile 适合执行可执行文件，例如执行一个node脚本，或者shell文件，windows可以编写cmd脚本，posix，可以编写sh脚本

- spawn

>spawn 用于执行一些实时获取的信息因为spawn返回的是流边执行边返回，exec是返回一个完整的buffer，buffer的大小是200k，如果超出会报错，而spawn是无上限的。

>spawn在执行完成后会抛出close事件监听，并返回状态码，通过状态码可以知道子进程是否顺利执行。exec只能通过返回的buffer去识别完成状态，识别起来较为麻烦

```bash
const { stdout, stderr } = spawn('netstat', ['-an'], {})
stdout.on('data', (data) => {
  log(data.toString())
})
```

>exec -> execFile -> spawn
exec是底层通过execFile实现 execFile底层通过spawn实现

- fork
>场景适合大量的计算，或者容易阻塞主进程操作的一些代码，就适合开发fork

fork底层使用的是IPC通道进行通讯的

```javascript
// index.js
const {fork} = require('child_process')

const testProcess = fork('./test.js')

testProcess.send('我是主进程')

testProcess.on("message",(data)=>{
    console.log('我是主进程接受消息111：',data)
})


// test.js
process.on('message',(data)=>{

    console.log('子进程接受消息：',data)
})

process.send('我是子进程')

```

## utils

- utils.promisify utils.callbackify

>将promise类型与回调函数相互转换的API

- utils.format
```bash
util.format('%s-----%s %s/%s','foo','bar','xm','zs')
//foo-----bar xm/zs  可以返回指定的格式
```

## fs

1. fs支持同步和异步两种模式 增加了Sync fs 就会采用同步的方式运行代码，会阻塞下面的代码，不加Sync就是异步的模式不会阻塞。

2. fs新增了promise版本，只需要在引入包后面增加/promise即可，fs便可支持promise回调。

3. fs返回的是一个buffer二进制数据 每两个十六进制数字表示一个字节

### **常用API 介绍**

读取文件 `readFile` 读一个参数 读取的路径，第二个参数是个配置项 encoding 支持各种编码 utf-8之类的, flag 

使用可读流读取 使用场景适合读取大文件

```javascript
const readStream = fs.createReadStream('./index.txt',{
    encoding:"utf8"
})

readStream.on('data',(chunk)=>{
    console.log(chunk)
})

readStream.on('end',()=>{
    console.log('close')
})
```

创建、删除文件夹 如果开启 recursive 可以递归创建多个文件夹

```javascript
fs.mkdir('path/test/ccc', { recursive: true },(err)=>{

})

fs.rm('path', { recursive: true },(err)=>{

})
```

监听文件的变化 返回监听的事件如change,和监听的内容filename
```javascript
fs.watch('./test2.txt',(event,filename)=>{
    
    console.log(event,filename)
})

```

### 注意事项

```javascript
const fs = require('node:fs')

fs.readFile('./index.txt', {
    encoding: 'utf-8',
    flag: 'r'
}, (err, dataStr) => {
    if (err) throw err
    console.log('fs')
})

setImmediate(() => {
    console.log('setImmediate')
})

```
为什么先走setImmediate 呢，而不是fs

Node.js 读取文件的时候是使用libuv进行调度的,而setImmediate是由V8进行调度的,文件读取完成后`libuv`才会将 fs的结果 推入V8的队列

### 写入内容、追加内容

writeFile 写入文件，第二个参数是内容，第三个参数是配置项，flag 写文件模式，默认是w+, 设置flag为a也可以追内容 encoding编码 mode权限
appendFile 追加内容，第二个参数是内容，第三个参数是配置项，flag 写文件模式，默认是a+

### 可写流
createWriteStream

我们可以创建一个可写流 打开一个通道，可以一直写入数据，用于处理大量的数据写入，写入完成之后调用end 关闭可写流，监听finish 事件 写入完成

```javascript
let verse = [
  '待到秋来九月八',
  '我花开后百花杀',
  '冲天香阵透长安',
  '满城尽带黄金甲'
]

let writeStream = createWriteStream('index.txt')

verse.forEach(item => {
  writeStream.write(item + '\n')
})

writeStream.end()
writeStream.on('finish',()=>{
  console.log('写入完成')
})
```

### 硬链接 和 软连接

```js
fs.linkSync('./index.txt', './index2.txt') //硬链接

fs.symlinkSync('./index.txt', './index3.txt' ,"file") //软连接
```

硬链接的作用和用途如下：

1. 文件共享：硬链接允许多个文件名指向同一个文件，这样可以在不同的位置使用不同的文件名引用相同的内容。这样的共享文件可以节省存储空间，并且在多个位置对文件的修改会反映在所有引用文件上。
2. 文件备份：通过创建硬链接，可以在不复制文件的情况下创建文件的备份。如果原始文件发生更改，备份文件也会自动更新。这样可以节省磁盘空间，并确保备份文件与原始文件保持同步。

3. 文件重命名：通过创建硬链接，可以为文件创建一个新的文件名，而无需复制或移动文件。这对于需要更改文件名但保持相同内容和属性的场景非常有用。

软链接的一些特点和用途如下：

1. 软链接可以创建指向文件或目录的引用。这使得你可以在不复制或移动文件的情况下引用它们，并在不同位置使用不同的文件名访问相同的内容。

2. 软链接可以用于创建快捷方式或别名，使得你可以通过一个简短或易记的路径来访问复杂或深层次的目录结构。

3. 软链接可以用于解决文件或目录的位置变化问题。如果目标文件或目录被移动或重命名，只需更新软链接的目标路径即可，而不需要修改引用该文件或目录的其他代码。
