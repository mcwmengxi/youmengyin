# 算法题

## 1. 盛水最多的容器
```js
/**
 * 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0)
 *  和 (i, height[i]) 。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
 * 返回容器可以储存的最大水量。
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    // 定义左指针，从索引0开始
    let left = 0;
    // 定义右指针，从数组的最后一个元素开始
    let right = height.length - 1;
    // 定义一个变量用于存储最大水量
    let area = 0;

    // 只有当left小于right的时候才开始计算最大水量
    while(left < right) {
        // 计算left 和 right之间的面积：(right - left) * Math.min(height[left], height[right])
        // right - left : 长，
        // Math.max(height[left], height[right]): 宽
        // 面积 = 长 * 宽
        let newArea = (right - left) * Math.min(height[left], height[right]);

        // 判断新得到的面积是否大于原来的面积，如果大于，就赋值给area
        area = newArea > area ? newArea : area;

        // 指针移动：两个指针的值，谁最小移动那个
        if(height[left] > height[right]) {
            right--; // 右指针：从右向左移动
        } else {
            left++; // 左指针：从左向右移动
        }
    }
    // 返回最大水量
    return area;
};
```

## 2. 排序数组
### 2.1 快速排序
```js
function quickSort(arr) {
  // 如果数组长度小于等于1，直接返回该数组
  if (arr.length <= 1) {
    return arr;
  }
  let left = [];
  let right = [];
  let pivot = arr[0]; // 取第一个元素作为基准点
  for (var i = 1; i < arr.length; i++) {
    // 将小于基准点的元素放入左侧数组
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      // 将大于等于基准点的元素放入右侧数组
      right.push(arr[i]);
    }
  }
  // 使用递归对左右两个数组进行快速排序，并将结果拼接起来
  return quickSort(left).concat(pivot, quickSort(right));

}

// 示例
const array = [3, 5, 2, 10, 8, 7, 6, 1, 9, 4];
const sortedArray = quickSort(array);
console.log(sortedArray); // 输出：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
### 2.1 冒泡排序
```js
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
const arr = [5, 3, 8, 4, 2];
console.log(bubbleSort(arr));

```
## 3. 买卖股票的最佳时机
```js
/**给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定
 * 股票第 i 天的价格。你只能选择 某一天 买入这只股票，并选择在
 * 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获
 * 取的最大利润。
 * 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利
 * 润，返回 0 。
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let minprice = Number.MAX_SAFE_INTEGER;
    let maxprofit = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minprice) {
            minprice = prices[i];
        } else if (prices[i] - minprice > maxprofit) {
            maxprofit = prices[i] - minprice;
        }
    }
    return maxprofit;
};

const data = maxProfit([7,1,5,3,6,4])
console.log(data) // 5
```