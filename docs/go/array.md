## 概述

数组是一个由固定长度的特定类型元素组成的序列，一个数组可以由零个或多个元素组成，一旦声明了，数组的长度就固定了，不能动态变化。

`len()` 和 `cap()` 返回结果始终一样。 

## 声明数组
::: details 查看代码

```go
package main

import (
	"fmt"
)

func main() {
	array_1()
	fmt.Println("---------")
	array_2()
}

// 一维数组
func array_1() {
	var arr_1 = [5]int{1, 2, 3, 4, 5}
	arr_2 := [5]int{1, 2, 3, 4}
	arr_3 := [...]int{1, 4}

	// 不指定以最大下标为长度
	arr_4 := [...]int{9: 4, 0: 6, 1: 8}
	arr_5 := [11]int{9: 4, 0: 6, 1: 8}
	// 默认全为0
	var arr_6 [5]int
	fmt.Println(arr_1, arr_2, arr_3, arr_4, arr_5, arr_6)
}

// 二维数组
func array_2() {
	var arr_1 = [2][5]int{{1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}}
	arr_2 := [2][5]int{{1, 2, 3, 4, 5}, {1, 2, 3, 4, 5}}
	// 不指定默认为0,只能任意外层数组的个数
	arr_3 := [...][3]int{{1, 2, 4}, {2, 4}, {1: 1, 0: 1, 2: 4}}

	// 指定数组长度后不可扩展
	arr_4 := [...]int{2: 4, 0: 6, 1: 8}
	arr_5 := arr_4
	fmt.Println(arr_1, arr_2, arr_3, arr_4, arr_5, arr_4 == arr_5)
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/e522c97e71854298855069c2d2a96848.png)

## 注意事项

一、数组不可动态变化问题，一旦声明了，其长度就是固定的。

```go
var arr_1 = [5] int {1, 2, 3, 4, 5}
arr_1[5] = 6
fmt.Println(arr_1)
```
运行会报错：invalid array index 5 (out of bounds for 5-element array)

二、数组是值类型问题，在函数中传递的时候是传递的值，如果传递数组很大，这对内存是很大开销。


::: details 查看代码

```go
package main

import (
	"fmt"
)

func main() {
	transfer()
}

func transfer() {
	var arr = [5]int{1, 2, 3, 4, 5}
	modifyArr(arr)
	fmt.Println(arr)
}
func modifyArr(a [5]int) {
	a[1] = 20
	fmt.Println("qaq", a)
}
```
::: 
运行结果：

![](https://img-blog.csdnimg.cn/083c41c9fd344ac78496c637a2c1a0b7.png)

::: details 查看代码
```go
package main

import (
	"fmt"
)

func main() {
	transfer_1()
}

func transfer_1() {
	var arr = [5]int{1, 2, 3, 4, 5}
	modifyArr_1(&arr)
	fmt.Println(arr, &arr)
}
func modifyArr_1(a *[5]int) {
	a[1] = 20
	fmt.Println("qaq_1", a, &a)
}
```
::: 
运行结果：

![](https://img-blog.csdnimg.cn/3d288c0ef8c849a3a41f6ce65809ffd2.png)


三、数组赋值问题，同样类型的数组（长度一样且每个元素类型也一样）才可以相互赋值，反之不可以。

::: details 查看代码
``` go
//数组赋值
func transfer_2() {
	var arr = [5]int{1, 2, 3, 4, 5}
	arr_1 := arr
	// var arr_2 [6] int = arr // cannot use arr (variable of type [5]int) as [6]int value
	fmt.Println(arr_1, arr_1 == arr)
}
```
:::
运行会报错：cannot use arr (type [5]int) as type [6]int in assignment