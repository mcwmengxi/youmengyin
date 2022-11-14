## 概述

结构体是将零个或多个任意类型的变量，组合在一起的聚合数据类型，也可以看做是数据的集合。

## 声明结构体
::: details 查看代码
```go
package main

import "fmt"

func main() {
	struct_1()
}

type Person struct {
	name string
	age  int
}

func struct_1() {
	var p1 Person
	p1.name = "ng"
	p1.age = 25
	fmt.Println(p1, p1.name)

	p2 := Person{"ky", 23}
	fmt.Println(p2)
	p3 := Person{name: "kiku", age: 26}
	fmt.Println(p3)

	// 匿名结构体
	p4 := struct {
		week int
		day  int
	}{1, 3}
	fmt.Println(p4)
}
```
:::
运行结果：

![](https://img-blog.csdnimg.cn/93b5047bc6a241e6b3962164db04cb1d.png)


## 生成 JSON

::: details 查看代码
```go
type Result struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json: "message"`
}

func struct_2() {
	var res1 Result
	res1.StatusCode = 200
	res1.Message = "success"

	//序列化
	var jsons, errs = json.Marshal(res1)
	// fmt.Println(jsons, errs)
	if errs != nil {
		fmt.Println("errors: ", errs)
	}
	fmt.Println(string(jsons))

	fmt.Println("--------反序列化")
	//反序列化
	var res2 Result
	errs = json.Unmarshal(jsons, &res2)
	// fmt.Println(jsons, errs)
	if errs != nil {
		fmt.Println("json unmarshal error:", errs)
	}
	fmt.Println("res2 :", res2)
}

```
:::
运行结果：

![](https://img-blog.csdnimg.cn/2cc05495e6e04c679a142f2bf4ae40f6.png)



## 改变数据

::: details 查看代码
```go
func struct_3() {
	var res1 Result
	res1.StatusCode = 200
	res1.Message = "success"
	print(&res1)
	set(&res1)
	print(&res1)
}
func set(res *Result) {
	res.StatusCode = 500
	res.Message = "error message!"
}
func print(res *Result) {
	jsons, errs := json.Marshal(res)

	if errs != nil {
		fmt.Println("json unmarshal error:", errs)
	}
	fmt.Println("output :", string(jsons))
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/00116ac55f904dccb304524f19cc2b59.png)
