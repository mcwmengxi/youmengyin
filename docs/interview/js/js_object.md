# 对象

## 1. `Object.create(null)`和`{}`区别？
`Object.create(null)`创建一个没有原型的新对象。这意味着生成的对象没有继承的属性或方法。它通常用作简单的字典对象，因为它允许设置和访问键，而不会与继承的属性或方法发生任何潜在冲突。
```js
const obj = Object.create(null); // 返回了一个没有任何属性的对象
console.log(obj.__proto__); // undefined
```
`{}`用`object`创建了一个新对象。`{}`的原型是`Object.prototype`。这意味着生成的对象继承了`Object.prototype`的所有属性和方法。这在某些情况下是有用的，但如果不小心，也可能导致意想不到的行为。
```js
const obj2 = {};
console.log(obj2.__proto__ === Object.prototype) // true
```

## 2. 分别介绍一下原型、原型链、作用域和作用域链的含义和使用场景

1. 原型（Prototype）：
- 含义：在 JavaScript 中，每个对象都有一个原型（prototype）。原型是一个对象，其他对象可以通过原型实现属性和方法的继承。当我们访问一个对象的属性或方法时，如果该对象本身没有定义这个属性或方法，JavaScript 引擎会沿着原型链向上查找，直到找到对应的属性或方法为止。
- 使用场景：原型经常被用于实现对象之间的继承关系。通过将一个对象设置为另一个对象的原型，可以让后者继承前者的属性和方法，从而实现代码复用和逻辑分离。

2. 原型链（Prototype Chain）：
- 含义：原型链是由对象的原型组成的链式结构。当我们访问一个对象的属性或方法时，如果该对象本身没有定义这个属性或方法，JavaScript 引擎会沿着原型链向上查找，直到找到对应的属性或方法为止。这样的查找过程就是原型链的运行机制。
- 使用场景：原型链的存在使得 JavaScript 中的对象可以实现属性和方法的继承，从而可以更加灵活地组织和管理代码。

3. 作用域（Scope）：
- 含义：作用域是指在程序中定义变量的区域，它规定了变量的可访问性和生命周期。JavaScript 中有全局作用域和局部作用域（函数作用域），变量在不同的作用域中具有不同的可访问性。
- 使用场景：作用域的存在使得我们可以在程序中定义变量，并且在不同的作用域中进行变量的访问和管理。合理的作用域设计可以避免变量污染和提高代码的可维护性。

4. 作用域链（Scope Chain）：
- 含义：作用域链是 JavaScript 中用于解析标识符的一种机制。当代码在一个作用域中访问变量或函数时，JavaScript 引擎会根据作用域链进行标识符解析，从当前作用域开始，逐级向上查找，直到找到对应的标识符为止。
- 使用场景：作用域链的存在使得 JavaScript 中的函数可以访问外部作用域中定义的变量和函数，从而实现闭包等特性，提供了更灵活的编程方式。

总之，原型、原型链、作用域和作用域链是 JavaScript 中非常重要的概念，它们的正确理解和使用对于编写高质量的 JavaScript 代码至关重要。对这些概念的深入理解可以帮助我们更好地利用 JavaScript 的特性和语言特点来编写优秀的程序和应用。


## 3. 请简述原型/原型链/(原型) 继承
### 1. 什么是原型:
任何对象实例都有一个原型，也叫原型对象，这个原型对象由对象的内置属性 `_proto_` 指向它的构造函数的`prototype`指向的对象，即任何对象都是由一个构造函数创建的，但是不是每一个对象都有`prototype`只有方法才有`prototype`
### 2. 什么是原型链?
原型链基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。我们知道，每个构造函数都有一个原型对象，每个原型对象都有一个指向构造函数的指针，而实例又包涵一个指向原型对象的内部指针。
原型链的核心就是依赖对象的`_proto_`的指向，当自身不存在的属性时，就一层层的扒出创建对象的构造函数，直至到`Object`时，就没有`_proto_`指向了。因为`_proto_`实质找的是`prototype`，所以我们只要找这个链条上的构造函数的`prototype`。其中`Object.prototype` 是没有`_proto_` 属性的，它==`null`.

### 3. (原型) 继承
每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含指向原型对象内部的指针。我们让原型对象 (1)等于另一个原型对象的实例(2)此时原型对象 (2) 将包含一个指向原型对象 (1) 的指针再让原型对象(2)的实例等于原型对象 (3)，如此层层递进就构成了实例和原型的链条，这就是原型链的概念每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数想指针(constructon)，而实例对象都包含一个指向原型对象的内部指针(proto )。如果让原型对象等于另一个原型对象的实例，此时的原型对象将包含一个指向另一个原型的指针( proto )，另一个原型也包含着一个指向另一个构造函数的指针(constructor)。假如另个原型又是另一个类型的实例......这就构成了实例与原型的链条。也叫原型链原型继承是jis 的一种继承方式，原型链作为实现继承的主要方法,其基本思路是利用原型让一个引用类型继承另一个引用类型的属性和方法原型继承:利用原型中的成员可以被和其相关的对象共享这一特性，可以实现继承，这种实现继承的方式，就叫做原型继承.

## 3. 继承
#### 1. 原型链继承（Prototype Inheritance）： 这是 JavaScript 中最基本的继承方式，通过将子类的原型指向父类的实例来实现继承。示例代码如下：
```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  Animal.call(this, name);
}

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom

```
#### 2. 构造函数继承（Constructor Inheritance）： 通过在子类的构造函数中调用父类的构造函数来实现继承。示例代码如下：
```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  Animal.call(this, name);
}

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom

```
#### 3. 组合继承（Combination Inheritance）： 结合原型链继承和构造函数继承的方式，使子类既能继承父类的属性和方法，又能保持独立的实例。示例代码如下:
```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  Animal.call(this, name);
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom

```
#### 4. 原型式继承（Prototype Chain Inheritance）： 通过使用一个空对象作为中介，将父类的实例作为子类的原型来实现继承。示例代码如下：
```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  var obj = Object.create(Animal.prototype);
  obj.name = name;
  return obj;
}

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom

```

#### 5. 寄生式继承（Parasitic Inheritance）： 在原型式继承的基础上，增强子类对象，并返回一个新的对象以实现继承。示例代码如下：

```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  var obj = Object.create(Animal.prototype);
  obj.name = name;
  obj.sayHello = function() {
    console.log("Meow, I'm " + this.name);
  };
  return obj;
}

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Meow, I'm Tom

```
#### 6. 寄生组合式继承（Parasitic Combination Inheritance）： 在组合继承的基础上，优化父类构造函数的调用，避免在子类原型中创建无用的属性和方法。示例代码如下：

```js
// 父类
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function() {
  console.log("Hello, I'm " + this.name);
}

// 子类
function Cat(name) {
  Animal.call(this, name);
}

(function() {
  var Super = function() {};
  Super.prototype = Animal.prototype;
  Cat.prototype = new Super();
})();

Cat.prototype.constructor = Cat;

// 测试
var cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom
```

#### 7. ES6 的 class 继承： 在 ES6 中引入了 class 关键字来定义类和继承关系，使用 extends 关键字来实现继承。示例代码如下：
```js
// 父类
class Animal {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log("Hello, I'm " + this.name);
  }
}

// 子类
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

// 测试
let cat = new Cat("Tom");
cat.sayHello(); // 输出：Hello, I'm Tom
```


## 4. JS 的 new 操作符做了哪些事情
`new`操作符新建了一个空对象，这个对象原型指向构造函数的`prototype`，执行构造函数后返回这个对象

## 5. 改变函数内部 this 指针的指向函数 (bind，apply，call 的区别)
通过`apply`和`call`改变函数的`this`指向，他们两个函数的第一个参数都是一样的表示要改变指向的那个对象,第二个参数,`apply`是数组，而`call`则是`arg1,arg2...`这种形式。通过 `bind`改变`this`作用域会返回一个新的函数，这个函数不会马上执行

