# 泛型

泛型（Generics）是 TypeScript 的一个强大功能，它允许我们在定义函数、类或接口时，使用类型参数来进行类型的约束。通过泛型，我们可以在保持类型安全的同时，实现代码的复用。

使用泛型的最大优势是能够让你编写可重用的代码，同时确保类型安全。假设你在写一个函数，它能处理多种类型的数据，但你不确定到底是哪种类型。使用泛型可以帮助你在不丧失类型检查的情况下，处理不同的数据类型。

## 泛型的基本用法

### 泛型函数

泛型函数允许你在函数定义时指定类型参数。比如：

```ts
// function identity<T>(arg: T): T {
//   return arg;
// }
const identity = <T>(arg: T): T => {
  return arg;
};

const num = identity(42); // num 的类型是 number
const str = identity('Moment'); // str 的类型是 string
```

### 泛型数组

你可以使用泛型来定义数组类型：

```ts
function logArray<T>(arr: T[]): void {
  arr.forEach((item) => console.log(item));
}
 
logArray([1, 2, 3]); // 输出数字
logArray(['a', 'b', 'c']); // 输出字符串
```

### 泛型接口

接口也可以使用泛型，通常用于定义那些在类型不确定时仍然能有效工作的接口：

```ts
interface Box<T> {
  value: T;
}

const numBox: Box<number> = { value: 42 };
```

### 泛型类

泛型类与泛型函数类似，允许你在类定义时指定类型参数：

```ts
class Container<T> {
  value: T;
 
  constructor(value: T) {
    this.value = value;
  }
 
  getValue(): T {
    return this.value;
  }
}
 
const numContainer = new Container(42);
const strContainer = new Container('Moment');
 
console.log(numContainer.getValue()); // 42
console.log(strContainer.getValue()); // "Moment"
```

## 泛型约束

有时你可能希望泛型类型参数能够满足某种条件，比如它必须是一个特定类型的子类。可以使用泛型约束来实现：

```ts
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength([1, 2, 3]); // 输出 3
logLength('Hello'); // 输出 5

// 下面的代码会报错，因为 number 类型没有 `length` 属性
// logLength(123);

// 指定默认类型参数
function wrap<T = string>(value: T): T {
  return value;
}

const wrapped = wrap(23); // 自动推断为 number 类型
const wrappedString = wrap('Hello'); // 使用默认的 string 类型
```

## 项目场景：API 请求库

假设你在开发一个 API 请求库，功能是发送 HTTP 请求并处理响应数据。因为 API 返回的数据格式会根据不同的接口而有所不同，因此你希望能够保证每次请求都能按照正确的类型来处理响应数据。

如下代码所示：

```ts
async function apiRequest<T>(
  url: string,
  method: string = 'GET',
  body: any = null
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // 假设 API 返回的 JSON 数据符合 T 类型
  return response.json();
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// 请求用户数据
async function fetchUserData(userId: number): Promise<User> {
  const url = `https://api.example.com/users/${userId}`;
  return apiRequest<User>(url); // 传入 User 类型作为泛型参数
}

// 请求商品数据
async function fetchProductData(productId: number): Promise<Product> {
  const url = `https://api.example.com/products/${productId}`;
  return apiRequest<Product>(url); // 传入 Product 类型作为泛型参数
}

async function main() {
  try {
    const user = await fetchUserData(1);
    console.log(user.id, user.name); // 类型安全，user 是 User 类型

    const product = await fetchProductData(101);
    console.log(product.id, product.title, product.price); // 类型安全，product 是 Product 类型
  } catch (error) {
    console.error(error);
  }
}

main();

```

## 总结

TypeScript 的泛型（Generics）允许我们在函数、类和接口中使用类型参数，从而实现代码的复用和类型安全。通过泛型，我们可以处理多种类型的数据，并确保返回值符合预期的结构。它支持类型约束、多个类型参数和默认类型，使得代码更加灵活和可维护。泛型在实际项目中尤其适用于处理动态类型的数据，如 API 请求库中确保响应数据的类型安全。
