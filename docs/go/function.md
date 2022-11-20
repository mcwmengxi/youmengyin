## 概述

学习了一些基础语法，开始学习写函数了，分享几个自己写的函数。

- MD5
- 获取当前时间戳
- 获取当前时间字符串
- 生成签名

## 函数定义

::: details 查看代码
```go
func function_name(input1 type1, input2 type2) (type1, type2) {
   // 函数体
   // 返回多个值
   return value1, value2
}
```
:::

- 函数用 `func` 声明。
- 函数可以有一个或多个参数，需要有参数类型，用 `,` 分割。
- 函数可以有一个或多个返回值，需要有返回值类型，用 `,` 分割。
- 函数的参数是可选的，返回值也是可选的。

## 值传递

传递参数时，将参数复制一份传递到函数中，对参数进行调整后，不影响参数值。

Go 语言默认是值传递。

## 引用传递

传递参数时，将参数的地址传递到函数中，对参数进行调整后，影响参数值。


::: details 查看代码
```go
package main

import (
	"encoding/json"
	"fmt"
)

func main()  {
	function_1()
}
type Result struct {
	StatusCode int "json:StatusCode"
	Object string "json:Object"
}
func function_1()  {
	var res Result
	res.StatusCode    = 200
	res.Object = "success"
	toJson(&res)
	
	setData(&res)
	toJson(&res)	
}
func setData (res *Result) {
	res.StatusCode    = 500
	res.Object = "fail"
}

func toJson (res *Result) {
	jsons, errs := json.Marshal(res)
	if errs != nil {
			fmt.Println("json marshal error:", errs)
	}
	fmt.Println("json data :", string(jsons))
}
```
:::

运行结果：

![](https://img-blog.csdnimg.cn/d4354211546742a3987c8f5cc789fa6a.png)


## MD5

::: details 查看代码

```go
// MD5 方法
func function_2(str string) string {
	sercet := md5.New()
	fmt.Println(sercet)
	sercet.Write([]byte(str))
	
	return hex.EncodeToString(sercet.Sum(nil))
}

	fmt.Printf("MD5(%s): %s\n", "123456", function_2("123456"))
```
:::

运行结果：

![](https://img-blog.csdnimg.cn/8a42c75047f14e4483cb0e2fd44e8482.png)


## 获取当前时间字符串、获取当前时间戳

::: details 查看代码
```go
func function_3()  {
	// 当前时间戳
	t := time.Now().Unix()
	// 当前时间字符串
	formatTime := time.Now().Format("2006-01-02 15:04:05")
	fmt.Println(t, formatTime)
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/f237ddcb1bb94b0aa515b102333ec26e.png)



## 生成签名

::: details 查看代码

```go
func function_4(params map[string]interface{})  string{
	var key []string
	var str = ""
	for k, _ := range params {
		key = append(key, k)
	}
	sort.Strings(key)
	fmt.Println("key ==>", key)
	for i := 0; i < len(key); i++ {
		if i == 0 {
			str = fmt.Sprintf("%v=%v", key[i], params[key[i]])
		} else {
			str = str + fmt.Sprintf("&xl_%v=%v", key[i], params[key[i]])
		}
	}
	fmt.Println("str: ", str)
	// 自定义密钥
	var secret = "123456789"

	// 自定义签名算法
	sign := function_2(function_2(str) + function_2(secret))
	return sign
}

```
:::

运行结果：

![](https://img-blog.csdnimg.cn/a9d74e29de954103881b842810d882ca.png)


也可以在签名方法中，增加时间戳 和 secret 在配置文件中读取。