# node 框架详解

```js
function discount (ctx, next) {
  console.log('starting discount ...')
  next(ctx * 0.8)
  console.log('ending discount ...')
}

function num (ctx, next) {
  console.log('starting num ...')
  next(ctx * 10)
  console.log('ending num ...')
}

function express (ctx, next) {
  console.log('starting express ...')
  next(ctx + 12) // 不包邮，12运费
  console.log('ending express ...')
}


const sell = compose([num, discount, express])
sell(150) // 1212 元

//               [num, discount, express]
function compose (args) {
  let result;
  return function (ctx) { // ctx 初始化时，是我们放进支的 150 元，我们要不断地计算这个值
    let i = 0;
    let dispath = function (i, ctx) {
      let fn;
      if (i < args.length) {
        fn = args[i]; // fn 就是每一个函数
      }

      if (i === args.length) {
        result = ctx;
        return;
      }

      return fn(ctx, dispath.bind(null, ++i))
    }

    dispath(i, ctx)
    return result;
  }
}
```

## express 与 koa
### express / koa 有什么区别？
#### 概念
express 是一个基于 node.js 平台的一个灵活的 web 应用开发框架，connect 中间件
koa2 相对来说，更新一些，也是由express 原班人马打造的框架

#### 集成性
exporess 内置了视图、static 等部分
koa 要通过中间件来实现

### express 案例
```js
const express = requrie('express')
const path = require('path')

const app = express()

// 配置静态资源
// public 目录下最好放一个 index.html, 这样当服务启动时，默认会返回这个文件，
// 而不是返回 404，
app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
```

### Koa 案例
```js
const Koa = require('koa')
const app = new Koa()

// 中间件1
app.use((ctx, next) => {
  console.log(1)
  next()
  console.log(2)
})

// 中间件2
app.use((ctx, next) => {
  console.log(3)
  next()
  console.log(4)
})

app.listen(8000, '0.0.0.0', () => {
  console.log('server is running at http://localhost:8000')
})

```
```js
const Koa = require('koa')
const app = new Koa()

const api = () => new Promise ((resolve) => {
  setTimeout(() => {
    console.log('timing...')
    resolve(100)
  }, 100)
})
app.use(async (ctx, next) => {
  console.log('querying start 1')
  const result = await api();
  ctx.result = result;
  await next();
  console.log('querying end 1')
})

app.use(async (ctx, next) => {
  console.log('querying star 2', ctx.result)
  next();
  console.log('querying end 2')
})

app.use(async (ctx, next) => {
  console.log('querying start 3')
  next();
  console.log('querying end 3')
})

const main = ctx => {
  ctx.body = 'hello world'
}

app.use(main)
```

```js
// 入口方法
listen(...args) {
  debug('listen')
  const server = http.createServer(this.callback())
  return server.listen(...args)
}

callback() {
  const fn = compose(this.middleware)
  if (!this.listenerCount('error')) this.on('error', this.onerror)

  const handleRequest = (req, res) => {
    const ctx = this.createContext(req, res)
    return this.handleRequest(ctx, fn)
  }

  return handleRequest
}

handleRequest(ctx, fnMiddleware) {
  const res = ctx.res
  res.statusCode = 404
  const onerror = err => ctx.onerror(err)
  // 这里等到response 再看
  const handleResponse = () => respond(ctx)
  // 给请求结束增加一个回调，这个onerror 是 ctx 的 onerror, 不是app的 onerror
  onFinished(res, onerror)
  return fnMiddleware(ctx).then(handleResponse).catch(onerror)
}

use(fn) {
  this.middleware.push(fn)
  return this
}

createContext(req, res) {
  // 每次请求，ctx都是一个新的对象
  const context = Object.create(this.context)
  const request = context.request = Object.create(this.request)
  const response = context.response = Object.create(this.response)

  context.app = request.app = response.app = this
  context.req = request.req = response.req = req
  context.res = request.res = response.res = res

  request.ctx = response.ctx = context
  request.response = response
  request.request = request;
  
  context.originalUrl = request.originalUrl = req.url
  context.state = {}

  return context;
}
```

```js
// koa 的 compose

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise
   * 
   */

  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i < = index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i
      let fn = middleware[i]
      if (i === middleware.length) {
        fn = next
      }
      if (!fn) {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      } 
    }
  }
}
```

## sequelize

## 