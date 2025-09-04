// window.color = 'red';
// let o = {
//  color: 'blue'
// };
// Function.prototype.myApply = function (ctx, ...args) {
//   if (typeof this !== "function") {
//     throw new TypeError('不是函数')
//   }
//   // 处理基本类型上下文 自动装箱
//   // ctx = Object(ctx)

//   ctx = ctx || globalThis
//   const key = Symbol()
//   ctx[key] = this
  
//   args = args && args[0] || []
//   const res = ctx[key](...args)
//   // 删除添加的属性
//   delete ctx[key]

//   return res
// }
// Function.prototype.myCall = function (ctx, ...args) {
//   if (typeof this !== "function") {
//     throw new TypeError('不是函数')
//   }
//   // 处理基本类型上下文 自动装箱
//   ctx = Object(ctx)

//   ctx = ctx || globalThis
//   const key = Symbol()
//   ctx[key] = this
//   const res = ctx[key](...args)
//   // 删除添加的属性
//   delete ctx[key]

//   return res
// }
// Function.prototype.myBind = function (ctx, ...args) {
//   if (typeof this !== "function") {
//     throw new TypeError('不是函数')
//   }
//   // 处理基本类型上下文 自动装箱
//   ctx = Object(ctx)

//   ctx = ctx || globalThis
//   const fn = Symbol()
//   ctx[fn] = this

//   const self = this
//   const func = (...others) => {
//     const target = this instanceof self ? this : ctx
//     return self.apply(target, [...args,...others])
//   }
//   if(this.prototype) {
//     func.prototype = Object.create(this.prototype)
//   }

//   return func
// }
// Function.prototype.myBind = function (ctx, ...args) {
//   return (...others) => this.myApply(ctx, [...args,...others])
// }
// function sayColor() {
//  console.log(this.color, this.length, ...arguments);

// }
// sayColor(); // red
// sayColor.myApply(this, [1, 2, 3], 'hh'); // red
// sayColor.myApply(window); // red
// sayColor.myApply(o); // blue 
// sayColor.myApply(1)

// let objectSayColor = sayColor.bind(o);
// objectSayColor([1,2,3],'hh'); // blue

const arr = [1, 2];
// arr.forEach((item, index) => {
//   arr.length = 10; // 动态增加数组长度
//   console.log(index); // 仅输出 0、1（初始长度内的索引）
// });
for (let i = 0; i < arr.length; i++) {
  arr.length = 10; // 动态增加数组长度
  console.log(i); // 仅输出 0、1（初始长度内的索引）
}

Promise.resolve().then(() => {
  console.log(0)
  return Promise.resolve(4)
}).then((res) => {
  console.log(res)
})
​
Promise.resolve().then(() => {
  console.log(1)
}).then(() => {
  console.log(2)
}).then(() => {
  console.log(3)
}).then(() => {
  console.log(5)
}).then(() =>{
  console.log(6)
})

// 0 1 2 3 4 5 6

