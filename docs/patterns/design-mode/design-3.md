[toc]
# 单例模式  

## 单例定义

单例模式的定义就是：`保证一个类只有一个实例，并提供一个访问他的全局站点`

**单例模式的核心是确保只有一个实例，并提供全局访问**
## 实现单例模式

我们只要用一个标识标记是否已经创建过对象，如果是，则在下一次获取时直接返回之前创建的实例

```js
class User {
  constructor(name) {
    this.name = name
    this.instance = null
  }
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new User(name)
    }
    return this.instance
  }
}

const user1 = User.getInstance('张三')
const user2 = User.getInstance('李四')

console.log(user2 === user1) // true
```

上面已经实现了一个简单的单例模式，但是这样意义并不是很大，下面一步步编写出更好的单例模式


## 不透明单例

```js
function SingleInstance(name: string) {
  this.instance = null
  this.name = name
}

SingleInstance.getInstance = function (name: string = '') {
  if (!this.instance) {
    this.instance = new SingleInstance(name)
  }
  return this.instance
}

const instance1 = SingleInstance.getInstance('测试1')
const instance2 = SingleInstance.getInstance('测试2')

console.log(instance1, instance2, instance1 === instance2) // true
```
## 透明单例

接下来来实现一个透明的单例模式，用户从这个类中创建对象的时候，可以像使用其他普通类一样进行使用

下面来实现创建一个唯一的 `div` 节点

```js
class Render {
  constructor(html) {
    if (!Render.instance) {
      Render.instance = this
      this.html = html
      this.init()
    }
    return Render.instance
  }
  init() {
    const div = document.createElement('div')
    div.innerText = this.html
    document.body.appendChild(div)
  }
}

const node1 = new Render('hello')
const node2 = new Render('hello2')

console.log(node1 === node2) // true
```

这个，不管我们 `new` 多少次这个类，始终都是创建一个实例

```js
// 自执行的匿名函数和闭包，并且让这个匿名函数返回真正的 SingleInstance 构造方法；闭包保留了之前实例的对象
var SingleInstance = (function () {
  let instance
  return function (name: string) {
    this.name = name
    return instance || (instance = this)
  }
})()

const instance1 = new SingleInstance('测试1')
const instance2 = new SingleInstance('测试2')

console.log(instance1, instance2, instance1 === instance2)

```

**问题**：

这种创建单例模式中，类既需要实例化对象，又要保证是单一对象；破坏了单一职责原则；  
如果单一实例类，需要创建多个不同对象时，还需要修改这个类  
把管理单一实例管理过程抽象出来（不变的逻辑），类对象只需要进行自己的实例化操作  

## 使用代理实现单例

用一个封装函数（代理函数）来包裹实际创建类的方法，负责管理单例的逻辑移到了代理类 proxySingletonCreateClass中

接下来使用代理方式，来再写一遍上面例子

```js
// 渲染类
class CreateDiv {
  constructor(html) {
    this.html = html
    this.init()
  }
  init() {
    const div = document.createElement('div')
    div.innerText = this.html
    document.body.appendChild(div)
  }
}

// 代理类
class Render {
  constructor(html) {
    if (!Render.instance) {
      Render.instance = new CreateDiv(html)
    }
    return Render.instance
  }
}

const node1 = new Render('hello')
const node2 = new Render('hello-121')

console.log(node1 === node2) // true
```
```js
function SingleInstance(name: string) {
  this.name = name
}
const proxySingletonCreateClass = (function () {
  let instance

  return function (...args: any) {
    if (!instance) {
      instance = new SingleInstance(...args)
    }
    return instance
  }
})()

const instance1 = new proxySingletonCreateClass('测试1')
const instance2 = new proxySingletonCreateClass('测试2')
console.log(instance1, instance2, instance1 === instance2)
```

## 关于JS中的单例模式的说明

前面提到的几种单例模式的实现，更多的是接近传统面向对象语言中的实现，单例对象从“类”中创建而来。在以类为中心的语言中，这是很自然的做法。比如在 Java 中，如果需要某个对象，就必须先定义一个类，对象总是从类中创建而来的。

但 JavaScript 其实是一门无类（ class-free）语言，也正因为如此，生搬单例模式的概念并无意义。在 JavaScript 中创建对象的方法非常简单，既然我们只需要一个“唯一”的对象，为什么要为它先创建一个“类”呢？这无异于穿棉衣洗澡，传统的单例模式实现在 JavaScript 中并不适用。

**单例模式的核心是确保只有一个实例，并提供全局访问**

全局变量不是单例模式，但在 JavaScript 开发中，我们经常会把全局变量当成单例来使用。例如：
`var a = {};`

当用这种方式创建对象 a 时，对象 a 确实是独一无二的。 如果 a 变量被声明在全局作用域下，则我们可以在代码中的任何位置使用这个变量，全局变量提供给全局访问是理所当然的。这样就满足了单例模式的两个条件。

但是全局变量存在很多问题，它很容易造成命名空间污染， JavaScript 中的变量也很容易被不小心覆盖

作为普通的开发者，我们有必要尽量减少全局变量的使用，即使需要，也要把它的污染降到最低。以下几种方式可以相对降低全局变量带来的命名污染。

### 使用命名空间

```js
var namespace1 = {
    a: function() {
        alert(1);
    },
    b: function() {
        alert(2);
    }
};
```

### 使用闭包封装私有变量

把一些变量封装在闭包的内部，只暴露一些接口跟外界通信

```js
var user = (function() {
    var __name = 'sven',
        __age = 29;
    return {
        getUserInfo: function() {
            return __name + '-' + __age;
        }
    }
})();
```

## 惰性单例

惰性单例是在需要的时候再创建出对象实例。

在透明单例和代理实现单例模式中，都需要使用一个自执行函数来实现，不使用时创建一个空单例对象；造成不必要的对象；
而且需要不同类的单例多想，需要多次重写上面的代码；


抽离管理单一实例过程（**不变逻辑**），然后将不同创建对象类(**可变逻辑**)作为参数传入该过程

```js
function SingleInstance(name: string) {
  this.name = name
}

const getInstance = (func) => {
  let instance
  return function (...args) {
    if (!instance) {
      instance = new func(...args)
    }

    return instance
  }
}

const instances = getInstance(SingleInstance)
let instance1 = instances('测试1')
let instance2 = instances('测试2')
console.log(instance1, instance2, instance1 === instance2)
```
把创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法可以独立变化而互不影响，当它们连接在一起的时候，就完成了创建唯一实例对象的功能。

惰性单例模式用在弹出框上面，下面就用一个提示框来展示一下惰性单例

```html
<button id="btn">展示浮窗</button>
<script>
  const render = (function () {
    let div
    return function () {
      if (!div) {
        div = document.createElement('div')
        div.style.display = 'none'
        div.innerText = '这是一个提示框'
        document.body.appendChild(div)
      }
      return div
    }
  })()

  document.getElementById('btn').addEventListener('click', () => {
    const node = render()
    node.style.display = 'block'
  })
</script>
```

## 通用惰性单例

在上面例子中，我们在页面中创建了一个唯一的 `div` 元素，但是这个函数并不灵活，如果想要吧 `div` 改为 `p` 那么就要重写一遍这个函数，所以接下来要封装一个通用想惰性单例模式

```js
function render(fn) {
  let instance
  return function () {
    return instance || (instance = fn())
  }
}
```

这样就抽离出了一个通用型的函数，接下来就可以这样使用：

```html
<button id="btn">点击</button>
<script>
  function render(fn) {
    let instance
    return function () {
      return instance || (instance = fn())
    }
  }

  function createDiv() {
    const div = document.createElement('div')
    div.innerText = '这是一个 div'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
  }

  function createInput() {
    const input = document.createElement('input')
    input.style.display = 'none'
    document.body.appendChild(input)
    return input
  }

  const createRenderDiv = render(createDiv)
  const createRenderInput = render(createInput)

  document.getElementById('btn').addEventListener('click', () => {
    const div = createRenderDiv()
    const input = createRenderInput()
    div.style.display = 'block'
    input.style.display = 'block'
  })
</script>
```
