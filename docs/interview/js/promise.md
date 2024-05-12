# Promise

## 1. Promise的了解
1. 什么是`Promise`?
我们都知道，`Promise`是承诺的意思，承诺它过一段时间会给你一个结果。
`Promise`是一种解决异步编程的方案，相比回调函数和事件更合理和更强大。
从语法上讲，promise 是一个对象，从它可以获取异步操作的消息
2. `promise`有三种状态: `pending`初始状态也叫等待状态，`fulfiled`成功状态,`rejected`失败状态;状态一旦改变,就不会再变。创造`promise`实例后，它会立即执行
3. `Promise`的两个特点
- `Promise`对象的状态不受外界影响
- `Promise`的状态一旦改变，就不会再变，任何时候都可以得到这个结果，状态不可以逆
4. `Promise`的二个缺点
- 无法取消`Promise`,一旦新建它就会立即执行，无法中途取消
- 如果不设置回调函数，`Promise`内部抛出的错误，不会反映到外部
- 当处于`pending`(等待)状态时，无法得知目前进展到哪一个阶段是刚刚开始还是即将完成

## 2. Promise 的 all 和 race 有什么区别
`Promise.all()` 和 `Promise.race()` 都是用于处理多个 Promise 对象的方法，但它们的行为有所不同：
1. `Promise.all()`:
- Promise.all() 方法接收一个包含多个 Promise 对象的可迭代对象（比如数组）作为参数，并返回一个新的 Promise 对象。

- 当传入的所有 Promise 对象都成功（resolved）时，Promise.all() 返回的 Promise 对象才会变为成功状态，其结果是一个包含所有 Promise 结果的数组，数组中的顺序与传入的 Promise 对象顺序一致。

- 如果传入的 Promise 对象中有任何一个失败（rejected），则返回的 Promise 对象会立即变为失败状态，并返回该失败的原因。
```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);

Promise.all([promise1, promise2])
  .then(values => {
    console.log(values); // [1, 2]
  })
  .catch(error => {
    console.error(error);
  });

```
2. `Promise.race()`:
- `Promise.race()` 方法接收一个包含多个 Promise 对象的可迭代对象作为参数，并返回一个新的 Promise 对象。
- 当传入的多个 Promise 对象中有任何一个状态发生变化（无论是成功还是失败），返回的 Promise 对象就会采用第一个状态发生变化的 Promise 对象的状态和值。
- 其他未被采用的 Promise 对象仍然会继续执行，但其结果不会影响返回的 Promise 对象。
```js
const promise1 = new Promise(resolve => setTimeout(() => resolve('one'), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve('two'), 500);

Promise.race([promise1, promise2])
  .then(value => {
    console.log(value); // 'two' (因为 promise2 先完成)
  })
  .catch(error => {
    console.error(error);
  });

```
3. 总结来说
Promise.all() 等待所有 Promise 对象都完成后才返回结果，而 Promise.race() 则返回最先完成的 Promise 对象的结果。
