# js语法篇

## 1. 如何判断一个数据是`NaN`
`NaN`表示非数字,但是用`typeof`检测是`number`类型
```js
console.log(typeof NaN) // number
```
> 所以利用`NaN`的定义： 用`typeof`判断是否为`number`类型并且判断是否满足`isnan`
利用`NaN`是唯一个不等于任何自身的特点`n !== n`
```js
let n = Number('a') // NaN
console.log('是否是NaN', n != n) // 是否是NaN, true
console.log(Object.is(n, NaN)) // true
```
## 2. JS 中 `null` 和 `undefined` 区别
- 相同点: 用`if`判断时，两者都会被转换成`false`
- 不同点:
  1. `number`转换的值不同`Number(null)` 为`0`,  `Number(undefined)`为`NaN`
  ```js
  console.log(Number(null)) // 0
  console.log(Number(undefined)) // NaN
  ```
  2. `Null` 表示一个值被定义了，但是这个值是空值
  3. `Undefined` 变量声明但未赋值

## 3. map 和 for...each的区别
map() 和 forEach() 是 JavaScript 中常用的数组方法，它们有以下区别：

1. 返回值：

- map() 方法会返回一个新的数组，其中包含根据回调函数处理原始数组中每个元素后的结果。
- forEach() 方法没有返回值，它只是遍历数组中的每个元素，并对每个元素执行回调函数，但不会改变原始数组。
2. 副作用：

- map() 方法不会修改原始数组，它会创建一个新的数组来存储处理后的结果。
- forEach() 方法也不会修改原始数组，但是可以在回调函数中对原始数组进行修改。
3. 链式调用：

- 由于 map() 返回一个新数组，因此可以方便地进行链式调用，例如 array.map().filter().reduce()。
- forEach() 没有返回值，无法进行链式调用。

4. 使用场景：

- map() 适合在需要对数组中的每个元素进行处理并生成新数组时使用。
- forEach() 适合在需要遍历数组并执行一些操作，如打印元素、修改原数组等情况下使用。
### 示例代码：
```js
// 使用 map() 方法
const numbers = [1, 2, 3];
const doubledNumbers = numbers.map(num => num * 2);
console.log(doubledNumbers); // 输出: [2, 4, 6]

// 使用 forEach() 方法
const colors = ['red', 'green', 'blue'];
colors.forEach(color => console.log(color));
```
综上所述，map() 和 forEach() 在功能和用法上有所不同，开发者可以根据具体需求选择合适的方法来操作数组。

## 4. 数组常用方法

## 5. js 数组去重有哪些方法
在 JavaScript 中，有多种方法可以实现数组去重。以下是一些常见的方法：

1. 使用 Set 数据结构：Set 是 ES6 中引入的一种新的数据结构，它可以存储唯一值。可以通过将数组转换为 Set，然后再将 Set 转换回数组来去重。
```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```
2. 使用 indexOf 方法：使用数组的 indexOf 方法遍历数组，判断元素在数组中的索引位置，如果不是第一次出现，则剔除。
```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = arr.filter((value, index, self) => {
  return self.indexOf(value) === index;
});
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```
3. 使用 includes 方法：使用数组的 includes 方法判断元素是否已经存在于新数组中，如果不存在，则添加到新数组中。
```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [];
arr.forEach((value) => {
  if (!uniqueArr.includes(value)) {
    uniqueArr.push(value);
  }
});
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```
4. 使用 reduce 方法：使用数组的 reduce 方法迭代数组，将元素添加到新数组中，但仅当新数组中不存在该元素时。
```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = arr.reduce((prev, curr) => {
  if (!prev.includes(curr)) {
    prev.push(curr);
  }
  return prev;
}, []);
console.log(uniqueArr); // [1, 2, 3, 4, 5]
```
这些方法都可以用于实现数组去重，具体选择哪种方法取决于个人偏好和需求。