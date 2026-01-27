# 基础手写题

## 1，call / apply / bind

### call

```javascript
Function.prototype.myCall = function (ctx, ...args) {
  if (typeof this !== "function") {
    throw new TypeError('不是函数')
  }
  // 处理基本类型上下文 自动装箱
  // ctx = Object(ctx)

  ctx = ctx || globalThis
  const fn = Symbol()
  ctx[fn] = this
  const res = ctx[fn](...args)
  // 删除添加的属性
  delete ctx[fn]

  return res
}
```

### apply

```javascript
Function.prototype.myApply = function (ctx, ...args) {
  if (typeof this !== "function") {
    throw new TypeError('不是函数')
  }
  // 处理基本类型上下文 自动装箱
  // ctx = Object(ctx)

  ctx = ctx || globalThis
  const fn = Symbol()
  ctx[fn] = this
  
  args = args && args[0] || []
  const res = ctx[fn](...args)
  // 删除添加的属性
  delete ctx[fn]

  return res
}
```

### bind

[Javascript中bind方法原生实现](https://zhuanlan.zhihu.com/p/49924137)

```javascript
Function.prototype.myBind = function (ctx) {
  if (typeof this !== "function") {
    throw new TypeError('不是函数')
  }

  ctx = ctx || globalThis

  //缓存原型方法，提升性能。
  slice = Array.prototype.slice,
  //获取除第一个以外的参数，第一个参数是上下文，其它才是真正的参数。
  args = slice.call(arguments, 1)
  const self = this;
  const func = function () {
    //把原型链指向要bind操作的函数，也就是原函数。
    this.prototype = self.prototype;
    //如果是new操作符实例出来对象，则为this。
    //如果是直接执行方法，则为context
    const target = this instanceof self ? this : ctx
    return self.apply(target, args.concat(slice.call(arguments)))
  }

  func.prototype = undefined

  return func
}
```
