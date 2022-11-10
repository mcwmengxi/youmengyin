## 概述

在声明变量之前，咱们先了解下变量的数据类型，这篇文章主要涉及 字符串、布尔、数字，其他类型后面开篇再说。

## 数据类型

#### 字符串

`string`

只能用一对双引号（""）或反引号（``）括起来定义，不能用单引号（''）定义！

#### 布尔

`bool`

只有 true 和 false，默认为 false。

#### 数字

**整型**

`int8` `uint8` 

`int16` `uint16`

`int32` `uint32`

`int64` `uint64`

`int` `uint`，具体长度取决于 CPU 位数。

**浮点型**

`float32` `float64`

## 常量声明

**常量**，在程序编译阶段就确定下来的值，而程序在运行时无法改变该值。

**单个常量声明**

第一种：const 变量名称 数据类型 = 变量值

如果不赋值，使用的是该数据类型的默认值。

第二种：const 变量名称 = 变量值

根据变量值，自行判断数据类型。

**多个常量声明**

第一种：const 变量名称,变量名称 ... ,数据类型 = 变量值,变量值 ...

第二种：const 变量名称,变量名称 ...  = 变量值,变量值 ...

**测试代码**

::: details 查看代码
```go
package main

import (
	"fmt"
)

func main() {
	demo_1()
}
// 常量声明
func demo_1() {
	const a uint8 = 10
	const str string = "1"
	const str_1, str_2 string = "str_1", "str_2"
	const str_3, str_4 = "str_33", "str_44"
	fmt.Println(a, str, str_1, str_2, str_3, str_4)
}
```
:::

运行结果：

![](https://github.com/xinliangnote/Go/blob/master/00-基础语法/images/02-变量声明/2_go_1.png)

## 变量声明

**单个变量声明**

第一种：var 变量名称 数据类型 = 变量值

如果不赋值，使用的是该数据类型的默认值。

第二种：var 变量名称 = 变量值

根据变量值，自行判断数据类型。

第三种：变量名称 := 变量值

省略了 var 和数据类型，变量名称一定要是未声明过的。

**多个变量声明**

第一种：var 变量名称,变量名称 ... ,数据类型 = 变量值,变量值 ...

第二种：var 变量名称,变量名称 ...  = 变量值,变量值 ...

第三种：变量名称,变量名称 ... := 变量值,变量值 ...

**测试代码**

::: details 查看代码
```go
package main

import (
	"fmt"
)

func main() {
	demo_2()
}
//变量声明
func demo_2() {
	var num_1, num_2 uint8 = 1, 2
	num_3, num_4 := 3, 4

	name, age := "ymy", 5
	fmt.Println(num_1, num_2, num_3, num_4, name, age)

	var age_1 uint8 = 31
	var age_2 = 32
	age_3 := 33
	fmt.Println(age_1, age_2, age_3)

	var age_4, age_5, age_6 int = 31, 32, 33
	fmt.Println(age_4, age_5, age_6)

	var name_1, age_7 = "Tom", 30
	fmt.Println(name_1, age_7)

	name_2, is_boy, height := "Jay", true, 180.66
	fmt.Println(name_2, is_boy, height)
}

```
:::

运行结果：

![](https://github.com/xinliangnote/Go/blob/master/00-基础语法/images/02-变量声明/2_go_2.png)

## 输出方法

**fmt.Print**：输出到控制台（仅只是输出）

**fmt.Println**：输出到控制台并换行

**fmt.Printf**：仅输出格式化的字符串和字符串变量（整型和整型变量不可以）

**fmt.Sprintf**：格式化并返回一个字符串，不输出。

测试代码
::: details 查看代码
```go
package main

import (
	"fmt"
)

func main() {
	demo_3()
}
func demo_3() {
	fmt.Print("输出到控制台不换行")
	fmt.Println("输出到控制台并换行")
	fmt.Printf("name=%s,age=%d\n", "Tom", 30)
	fmt.Printf("name=%s,age=%d,height=%v\n", "Tom", 30, fmt.Sprintf("%.2f", 180.567))
}
```
:::

运行结果：

![](https://github.com/xinliangnote/Go/blob/master/00-基础语法/images/02-变量声明/2_go_3.png)
