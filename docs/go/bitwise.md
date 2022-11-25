## 位运算

G0语言支持的位运算符如下表所示。假定A为60，B为13：

| 运算符 | 描述                                               | 实例                                 |
| ------ | -------------------------------------------------- | ------------------------------------ |
| &      | 按位与运算符"&"是双目运算符。都是1结果为1，否则是0 | (A&B)结果为12，二进制为00001100      |
|   \|     | 按位或运算符"\|"是双目运算符。都是0结果为0，否是是1 | (A\|B)结果为61，二进制为00111101 |
| ^ | 按位异或运算符"∧"是双目运算符。不同则为1，相同为0 | (A^B)结果为49，二进制为00110001 |
| &^ | 位清空，a&^b,对于b上的每个数值，如果为0，则取a对应位上的数值，如果为1，则取0. | (A&^B)结果为48，二进制为00110000 |
| << | 左移运算符"<<"是双目运算符。左移n位就是乘以2的次方。其功能把"<<"左边的运算数的各二进位全部左移若干位，由"<<"右边的数指定移动的位数，高位丢弃，低位补0。 | A<<2结果为240，二进制为11110000 |
| >> | 右移运算符">>"是双目运算符。右移n位就是除以2的次方。其功能是把">>"左边的运算数的各二进位全 | A>>2结果为15，二进制为00001111 |


::: details 查看代码
```go
package main

import "fmt"

// 所有的位运算都是建立在二进制的基础上
func main() {
	bitwise_1()
	fmt.Println("-----")
	bitwise_2()
	fmt.Println("-----")
	bitwise_3()
}

func bitwise_1() {
	// &
	//12  0000 1100
	//60  0011 1100
	//&   0000 1100 ==> 12
	 a := 12 & 60
	fmt.Printf("%d, 二进制%b\n",12 & 60,a)
	// |
	//12  0000 1100
	//60  0011 1100
	//|   0011 1100 ==> 60
	fmt.Printf("%d, 二进制%b\n",12 | 60,(12 | 60))
}
func bitwise_2() {
	// 按位异或,相同为0,不同为1
	// ^
	//12  0000 1100
	//60  0011 1100
	//^   0011 0000 ==> 48
	fmt.Printf("%d, 二进制%b\n",12 ^ 60,(12 ^ 60))

	// 位清空，a&^b,对于b上的每个数值，如果为0，则取a对应位上的数值，如果为1，则取0.
	// &^
	//12  0000 1100
	//60  0011 1100
	//&^  0000 0000 ==> 0
	//置换 0011 0000 ==> 48
	fmt.Printf("%d, 二进制%b\n",12 &^ 60,(12 &^ 60))
	fmt.Printf("%d, 二进制%b\n",60 &^ 12,(60 &^ 12))
}

func bitwise_3() {
	// 左移 << 2
	//12   0000 1100
	//<<2  0011 0000 ==> 48
	//60   0011 1100
	//<<2  1111 0000 ==> 240
	fmt.Printf("%d, 二进制%b\n",12 << 2,(12 << 2 ))
	fmt.Printf("%d, 二进制%b\n",60 << 2,(60 << 2))
	// 右移 >>2
	//12   0000 1100
	//>>2  0000 0011 ==> 3
	//60   0011 1100
	//>>2  0000 1111 ==> 15
	fmt.Printf("%d, 二进制%b\n",12 >> 2,(12 >> 2 ))
	fmt.Printf("%d, 二进制%b\n",60 >> 2,(60 >> 2))
}
```
:::










