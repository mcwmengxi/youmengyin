## 断言和反射

>断言 把一个接口类型指定为它原始的类型
::: details 查看代码

```go

package assertion

import "fmt"
type Animial struct {
	Name string
}
type Person struct {
	Name string
}

func (p Person) create(val string){
	fmt.Println(val, "无限创造" )
} 
func AssertionFunc(){
	// 断言Assertion
	// p := Person{
	// 	Name: "人类",
	// }
	// is(p)
	is(Animial{})

}
func is(v interface{}){
	switch v.(type){

	case Animial:
		fmt.Println("动物")
	case Person:
		v.(Person).create(v.(Person).Name)
	}
}
```

:::

### 反射

>官方说法：在编译时不知道类型的情况下，可更新变量、运行时查看值、调用方法以及直接对他们的布局进行操作的机制，称为反射。
通俗一点就是：可以知道本数据的原始数据类型和数据内容，方法等、并且可以进行一定操作

为什么要用反射？

>我们通过接口或者其他的方式接收到了类型不固定的数据的时候，需要写太的swatch case断言代码，此时代码不灵活且通用性差，反射这时候就可以无视类型，改变原数据结构中的数据

reflect.TypeOf().Kind()用来判断类型
reflect.ValueOf0.Field(int) 用来获取值
reflect.FieldBylndex([] int{0,1}) 层级取值
reflect.ValueOf().Elem() 获取原始数据并操作
reflect.ValueOf() 获取输入参数接口中的数据的值
reflect.TypeOf() 动态获取输入参数接口中的值的类型

普通反射
struct反射
匿名或嵌入字段的反射
判断传入的类型是否是我们想要的类型
通过反射修改内容
通过反射调用方法