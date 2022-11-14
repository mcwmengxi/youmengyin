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
	statusCode int    `json:"code"`
	message    string `json: "msg"`
}

func struct_2() {
	var res1 Result
	res1.statusCode = 200
	res1.message = "success"

	//序列化
	var jsons, errs = json.Marshal(res1)
	fmt.Println(jsons, errs)
	if errs != nil {
		fmt.Println("errors: ", errs)
	}
	fmt.Println(string(jsons))

	fmt.Println("--------反序列化")
	//反序列化
	var res2 Result
	errs = json.Unmarshal(jsons, &res2)
	fmt.Println(jsons, errs)
	if errs != nil {
		fmt.Println("json unmarshal error:", errs)
	}
	fmt.Println("res2 :", res2)
}

```
:::
运行结果：

![](https://img-blog.csdnimg.cn/e8aaa8aedd374dbd86dbcb77fc1d7159.png)


## 改变数据

```
//demo_13.go
package main

import (
	"encoding/json"
	"fmt"
)

type Result struct {
	Code    int    `json:"code"`
	Message string `json:"msg"`
}

func main() {
	var res Result
	res.Code    = 200
	res.Message = "success"
	toJson(&res)
	
	setData(&res)
	toJson(&res)
}

func setData (res *Result) {
	res.Code    = 500
	res.Message = "fail"
}

func toJson (res *Result) {
	jsons, errs := json.Marshal(res)
	if errs != nil {
		fmt.Println("json marshal error:", errs)
	}
	fmt.Println("json data :", string(jsons))
}
```

运行结果：

![](https://github.com/xinliangnote/Go/blob/master/00-基础语法/images/05-结构体/5_go_3.png)