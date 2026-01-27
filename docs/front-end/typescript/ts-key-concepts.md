
# TS 核心概念的对比

## any 和 unknown 的区别

unknown 类型在 TypeScript 中提供了一种更安全的方式来处理任意类型的值。它的实现原理是通过在编译时强制进行类型检查或类型断言来确保类型安全。相比 any 类型，unknown 类型提供了更高的类型安全性，但在使用时需要更多的类型检查和断言。通过使用 unknown 类型，可以在处理未知类型的数据时，避免许多潜在的运行时错误。

- any 类型的实现原理实际上并不是在编译器内部实现某种复杂的逻辑，而是通过跳过类型检查实现的
- unknown 类型也可以表示任何类型的值，但它更严格。在对 unknown 类型的值执行任何操作之前，必须先进行类型检查或类型断言。unknown 类型提供了更好的类型安全性。

## TS 中 const 和 readonly 的区别

const 和 readonly 的区别

| 特性 | const | readonly |
|------|-------|----------|
| 作用对象 | 变量绑定（不能重新赋值） | 对象的属性或数组的元素（不能修改其值） |
| 修改对象内容 | 允许修改对象的内容（如果对象是可变的） | 不允许修改对象的内容或数组的元素 |
| 作用范围 | 只作用于变量的绑定，限制的是变量的引用 | 作用于对象或数组元素，限制的是元素的可变性 |
| 数组示例 | 允许修改数组内容，但不能重新赋值整个数组 | 不能修改数组内容，包括添加、删除、修改元素 |
| 对象示例 | 允许修改对象的属性值，但不能重新赋值整个对象 | 不能修改对象的属性值，确保对象的属性为只读 |

结合使用 const 和 readonly

在某些情况下，你可能需要同时使用 const 和 readonly 来保证变量绑定和对象属性的不可变性。比如，你可以使用 const 来确保变量不重新赋值，使用 readonly 来确保对象或数组的元素不被修改。

```ts
// 使用 const 和 readonly 确保不可变性
const person: { readonly name: string; readonly age: number } = {
  name: 'Alice',
  age: 25,
};
// person = { name: 'Bob', age: 30 };  // 错误：不能重新赋值整个对象
person.name = 'Bob'; // 错误：不能修改 readonly 属性
```

## TS 中元组和普通数组的区别

元组适用于存储不同类型的元素，常用于表示具有固定结构的数据，如用户信息或数据库记录；而常规数组则用于存储同类型的元素，适合表示动态变化的集合。常规数组的长度是可变的，所有元素的类型通常相同；元组则具有固定长度，每个位置上的元素类型是明确的。通过合理使用元组和数组，可以提高 TypeScript 的类型推断和代码的类型安全性。

元组和常规数组的区别

| 特性 | 常规数组（Array） | 元组（Tuple） |
|------|------------------|--------------|
| 元素类型 | 元素类型通常相同 | 元素类型可以不同 |
| 长度 | 长度可变，元素个数可以变化 | 长度固定，元素个数固定 |
| 访问元素的类型 | 访问任何元素的类型是相同的 | 每个元素的类型可能不同，访问时有不同的类型 |
| 灵活性 | 适合存储同类型的元素 | 适合存储不同类型的元素，especially处理记录（如数据库记录）时 |
| 用途 | 通常用于存储相同类型的集合，如数字列表、字符串列表等 | 适用于固定结构的数据，如返回多个不同类型的值或记录

```ts
// 元组示例
let employee: [string, number?, boolean?] = ['Moment']; // 第二个和第三个元素可以缺少

// 数组示例
let numbers: number[] = [1, 2, 3]; // 所有元素都是数字类型
let names: string[] = ['Alice', 'Bob', 'Charlie']; // 所有元素都是字符串类型
```

## Type 和 interface 的区别

### 1. 基本用法：type 和 interface 定义对象类型

```ts
// 使用 interface
interface User {
  name: string;
  age: number;
}
 
// 使用 type
type UserType = {
  name: string;
  age: number;
};
 
const user1: User = { name: 'Alice', age: 25 };
const user2: UserType = { name: 'Bob', age: 30 };
```

### 2. 扩展（Extend）

- interface 可以通过继承的方式进行扩展：
- type 可以通过交叉类型（Intersection Types）来扩展：

```ts
interface User {
  name: string;
  age: number;
}
 
interface Admin extends User {
  role: string;
}
 
const admin: Admin = {
  name: 'Alice',
  age: 30,
  role: 'Administrator',
};

type UserType = {
  name: string;
  age: number;
};
 
type AdminType = UserType & {
  role: string;
};
 
const adminType: AdminType = {
  name: 'Bob',
  age: 35,
  role: 'Admin',
};
```

### 3. 声明合并（Declaration Merging）

- interface 可以声明合并，即相同名称的 interface 会被合并：
- type 不支持声明合并，会报错：

### 4. 联合类型和交叉类型

- type 支持定义 联合类型 和 交叉类型，而 interface 不支持。
- interface 无法直接用于定义联合类型。

```ts
// 联合类型
type Status = 'success' | 'error' | 'loading';
 
// 交叉类型
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age;
 
const person: Person = { name: 'Alice', age: 25 };
```

### 5. 类型别名

type 可以用来定义除对象之外的其他类型别名，例如基本类型、元组、联合类型等。
interface 则只能用于定义对象类型。

```ts
// 定义基本类型别名
type ID = number | string;
 
// 定义元组类型
type Point = [number, number];
 
const id: ID = 123;
const point: Point = [10, 20];
```

### 6. 实现（Implements）和继承（Extends）

- interface 在类的设计模式中更加常用，因为它允许声明合并并且有更强的类型扩展能力。
- type 也可以用于类的约束，但主要用于联合类型和其他复杂类型组合。

```ts
// interface 可以用来约束类的结构。
interface User {
  name: string;
  age: number;
}
 
class Person implements User {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

//  type 也可以约束类
type UserType = {
  name: string;
  age: number;
};
 
class PersonType implements UserType {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

### 7. 互操作性

interface 可以扩展 type，type 也可以扩展 interface，它们可以相互组合使用。

```ts
type Name = { name: string };
 
interface User extends Name {
  age: number;
}
 
const user: User = { name: 'Alice', age: 25 };


interface User {
  name: string;
  age: number;
}
 
type Admin = User & {
  role: string;
};
 
const admin: Admin = { name: 'Bob', age: 35, role: 'Admin' };
```

### 8. 复杂类型的表达能力

- interface 主要用于描述对象的结构，在联合类型和复杂组合类型场景下不如 type 灵活。
- type 支持联合类型、交叉类型、基本类型别名等复杂类型的组合，因此在处理复杂类型表达时，type 更加灵活。

### 9. 总结

- interface 的适用场景：
  - 定义对象类型，尤其是面向对象的设计模式。
  - 类的约束，接口扩展和实现（implements）。
  - 声明合并的场景（如第三方库中的类型定义）。
- type 的适用场景：
  - 联合类型、交叉类型等复杂类型定义。
  - 基本类型和元组类型别名。
  - 需要表达多个类型组合时更灵活。

| 特性               | interface                                                                 | type                                                                 |
|--------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------|
| 定义对象类型       | ✅                                                                        | ✅                                                                   |
| 定义基本类型别名   | ❌                                                                        | ✅                                                                   |
| 声明合并           | ✅                                                                        | ❌                                                                   |
| 扩展方式           | extends 继承                                                             | & 交叉类型                                                          |
| 支持联合类型       | ❌                                                                        | ✅                                                                   |
| 支持交叉类型       | ❌                                                                        | ✅                                                                   |
| 用于类的实现       | ✅                                                                        | ✅（但不常见）                                                      |
| 表达能力           | 适合对象结构定义                                                         | 适合复杂类型组合                                                    |
| 常用场景           | 面向对象设计，类与接口组合使用                                           | 联合类型、复杂类型定义，类型别名等                                  |
