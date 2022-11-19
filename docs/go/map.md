## 概述

Map 集合是无序的 key-value 数据结构。

Map 集合中的 key / value 可以是任意类型，但所有的 key 必须属于同一数据类型，所有的 value 必须属于同一数据类型，key 和 value 的数据类型可以不相同。

## 声明 Map

::: details 查看代码
```go
package main

import "fmt"

func main()  {
	map_1()
}

func map_1()  {
	// 声明 Map
	var p1 map[int]string;
	p1 = make(map[int]string)
	p1[1] = "null"
	p1[0] = "0"
	fmt.Println(p1)

	// 合并
	var p2 map[string]string = make(map[string]string)
	p2["name"] = "nangong"
	fmt.Println(p2)

	var p3 map[int]string = map[int]string{1:"gh"}
	p3[2] = "gg"
	fmt.Println(p3)

	// 也可以简写
	p4 := map[string]string{ "name": "kiku", "sex": "femal"}
	fmt.Println(p4)
}
```
:::

运行结果：

![](https://img-blog.csdnimg.cn/aabe52a075ae4cd49b3a2ed4152fd4c7.png)


## 生成 JSON

::: details 查看代码
```go
// 生成json数据
func map_2()  {
	res := make(map[string]interface{})
	res["statusCode"] = 200
	res["message"] = "success"
	res["object"] = map[string]interface{}{
		"username": "admin",
		"token": "fjrerekkkkkkkekemw",
		"lastUpdateTime": "2011-20-20 30:12:22",
		"tags": []string{"阴阳师","原神"},
	}

	fmt.Println(res)
	fmt.Println("")
	// 序列化
	jsons, errs := json.Marshal(res)
	if errs != nil {
		fmt.Println("errors: ", errs)
	}
	fmt.Println("")
	fmt.Println("json: ", string(jsons))

	//反序列化
	res2 := make(map[string]interface{})
	errs = json.Unmarshal([]byte(jsons), &res2)
	if errs != nil {
		fmt.Println("errors: ", errs)
	}
	fmt.Println("")
	fmt.Println("map: ", res2)
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/7bfd3def66c049c9886dece5cbcc3dfc.png)


## 编辑和删除

::: details 查看代码
```go
// 编辑和删除
func map_3()  {
	res := make(map[string]interface{})
	res["statusCode"] = 200
	res["message"] = "success"
	res["object"] = map[string]interface{}{
		"username": "admin",
		"token": "fjrerekkkkkkkekemw",
		"lastUpdateTime": "2011-20-20 30:12:22",
		"tags": []string{"阴阳师","原神"},
	}
	fmt.Println(res)
	fmt.Println("")

	res["statusCode"] = 500
	fmt.Println("after update: ", res)
	fmt.Println("")

	delete(res, "message")
	fmt.Println("after delete: ", res)
	fmt.Println("")

}

```
:::
运行结果：

![](https://img-blog.csdnimg.cn/e4a29265cd1047f08dd49499dc388c78.png)
