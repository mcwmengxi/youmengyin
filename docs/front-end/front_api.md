## 1. call
```js
Function.prototype.myCall = function (context, ...args) {
  context = new Object(context) || window
  const fnSymbol = Symbol('temp')
  context[fnSymbol] = this
  context[fnSymbol](...args)
  Reflect.deleteProperty(context, fnSymbol)
}
```

## 2. apply
```js	
Function.prototype.myApply = function(context, args) {
  context = Object(context) || window
  const temp = Symbol('temp')			
  context[temp] = this
  context[temp](...args)
  Reflect.deleteProperty(context, temp)
}
```


## 3. bind
```js
Function.prototype.bind = function(context, ...args) {
  context = context || window
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  return function(..._args) {
    args = args.concat(_args)
    context[fnSymbol](...args);
    delete context[fnSymbol];
  }
}
```
## 4 instanceof
instanceof 运算符用于检测一个对象是否是某个构造函数的实例。其实现原理比较简单，即判断这个对象的原型链上是否有这个构造函数的原型。

具体来说，instanceof 运算符会依次检查对象的 __proto__ 属性指向的原型是否为构造函数的原型，如果一直找到了原型链的顶端还没找到构造函数的原型，则返回 false，否则返回 true。
```js
function myInstanceOf(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 测试
console.log(myInstanceOf([], Array)); // true
console.log(myInstanceOf(function() {}, Function)); // true
console.log(myInstanceOf({}, Array)); // false

```

## 5. new 
new 关键字用于创建一个用户定义的对象类型的实例或者具有构造函数的内置对象的实例。它的实现原理可以分为以下几个步骤：

- 创建一个新的空对象。
- 将这个空对象的原型（__proto__）指向构造函数的 prototype 属性。
- 执行构造函数，将空对象作为 this 上下文，并且传入参数。
- 如果构造函数返回了一个对象，则返回该对象；否则返回第一步创建的空对象。

```js
function myNew(constructor, ...args) {
  // 创建一个新的空对象，原型指向构造函数的 prototype 属性
  const obj = Object.create(constructor.prototype);
  // 执行构造函数，并将空对象作为 this 上下文
  const result = constructor.apply(obj, args);
  // 如果构造函数返回了一个对象，则返回该对象；否则返回空对象
  return result instanceof Object ? result : obj;
}

// 测试
function Person(name) {
  this.name = name;
}
const person = myNew(Person, 'Alice');
console.log(person.name); // 输出：Alice
console.log(person instanceof Person); // 输出：true

```
总之，new 关键字的实现原理比较简单，主要是通过创建一个空对象并将其原型指向构造函数的 prototype 属性，然后在执行构造函数时将空对象作为 this 上下文，最后根据构造函数的返回值返回相应的对象

## 6. 实现一个简单的Promise

### 6.1 Class Promise 版
#### 基本结构
```js
// 静态常量的声明
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  
  constructor(executer) {
    // 1. 默认状态 - PENDING
    this.status = PENDING;

    // 2. 维护内部成功失败的值
    this.value = undefined;
    this.reason = undefined;

    // 成功回调
    let resolve = value => {
      // 单向流转
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
    }

    // 失败回调
    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    }

    // 立即执行executer
    executer(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
```

#### 构造函数