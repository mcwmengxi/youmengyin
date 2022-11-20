## 概述

前几篇文章分享了 array 数组、slice 切片、map 集合，这篇文章分享如何循环获取里面的元素，同时也是对前几篇文章的复习。

本篇文章会用到的关键字 for、range、break、continue、goto、switch。

## 循环 array、slice

::: details 查看代码
```go
func cycle_1()  {
  // 循环array
  // person := [4]string {"nangong", "kiku", "kyokyo"}
  // 循环slice
	person := []string {"nangong", "kiku", "kyokyo"}
	fmt.Printf("len=%d, cap=%d, array=%v\n", len(person), cap(person), person)
	fmt.Println("")

	for i := 0; i < len(person); i++ {
		fmt.Printf("person[%d]: %s\n", i, person[i])
	}
	fmt.Println("")
	
	for k,v := range person {
		fmt.Printf("person[%d]: %s\n", k, v)
	}
	// 只取一位时默认为k,可以提供占位符_替换不需要的变量
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/2f95693fdde1438dab6dd8086e59414c.png)


## 循环 map

::: details 查看代码
```go
// 循环map
func cycle_3()  {
	// person := []string {"nangong", "kiku", "kyokyo"}
	person := map[string]string{ "name": "nangong", "info": "..."}
	fmt.Printf("len=%d, map=%v\n", len(person), person)
	fmt.Println("")
	
	for k,v := range person {
		fmt.Printf("person[%s]: %s\n", k, v)
	}
	// 只取一位时默认为k,可以提供占位符_替换不需要的变量
}

```
:::
运行结果：

![](https://img-blog.csdnimg.cn/08c6488d34e34edebc8c9d1894a76c6a.png)


## break

跳出当前循环，可⽤于 for、switch、select。
::: details 查看代码

```go
package main

import "fmt"

func main() {
	for i := 1; i <= 10; i++ {
		if i == 6 {
			break
		}
		fmt.Println("i =", i)
	}
}
```
:::

## continue

跳过本次循环，只能用于 for。

::: details 查看代码
```go

package main

import "fmt"

func main() {
	for i := 1; i <= 10; i++ {
		if i == 6 {
			continue
		}
		fmt.Println("i =", i)
	}
}

```
:::


## goto

改变函数内代码执行顺序，不能跨函数使用。

::: details 查看代码
```go
package main

import "fmt"

func main() {
	fmt.Println("begin")

	for i := 1; i <= 10; i++ {
		if i == 6 {
			goto END
		}
		fmt.Println("i =", i)
	}

	END :
		fmt.Println("end")
}
```
:::


## switch

::: details 查看代码
```go

package main

import "fmt"

func main() {
	i := 3
	fmt.Printf("当 i = %d 时：\n", i)

	switch i {
		case 1:
			fmt.Println("输出 i =", 1)
		case 2:
			fmt.Println("输出 i =", 2)
		case 3:
			fmt.Println("输出 i =", 3)
			fallthrough
		case 4,5,6:
			fmt.Println("输出 i =", "4 or 5 or 6")
		default:
			fmt.Println("输出 i =", "xxx")
	}
}
```
:::

运行结果：

当 i = 1 时：输出 i = 1

当 i = 2 时：输出 i = 2

当 i = 3 时：

输出 i = 3

输出 i = 4 or 5 or 6

当 i = 4 时：输出 i = 4 or 5 or 6

当 i = 7 时：输出 i = xxx

**结论：**

- 默认每个 case 带有 break
- case 中可以有多个选项
- fallthrough 不跳出，并执行下一个 case


