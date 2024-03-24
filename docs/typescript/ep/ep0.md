# Typescript入门

## 1. 前言

`TypeScript = JavaScript + 类型 + Babel `

通过 `Ctrl(Command) + Shift + P` 打开命令面板，找到「打开工作区设置」`Open Workspace Settings`


推荐开启的配置项主要是这几个：

- 补全搜索词，使用`typescript inlay hints`”：`

- `Function Like Return Types`，显示推导得到的函数返回值类型；

- `Parameter Names`，显示函数入参的名称；

- `Parameter Types`，显示函数入参的类型；

- `Variable Types`，显示变量的类型。

这些配置的主要能力就是把参数名，参数类型，以及推导得到的类型等等信息直接展示在屏幕上

`TypeScript Playground` 是非常好用的 TS 代码在线编辑工具与分享工具

## 2.原始类型与对象类型

```typescript
// 对于原始类型的类型标注相对简单，我们使用 : 类型 的语法来实现
const userNick = 'zddd'; // 字符串
const userAge = 18; // 数字
const userMarried = false; // 布尔值
const userNull = null; // null
const userUndefined = undefined; // undefined

// 数组类型，Array<数组类型> 或 数组类型[]
const userObject = {}; // 对象
const userList = []; // 数组
```

对象类型，我们需要首先使用`TypeScript`的语法，先编写一个`interface`接口,
再使用这个接口来作为对象类型变量的类型标注

```typescript
interface User {
  userName: string;
  userAge: number;
  userMarried: boolean;
}
const user: User = {
  userName: 'test',
  userAge: 20,
  userMarried: false,
};

```

实际上，将对象类型抽象为一个接口，我们能够在后续很方便地复用这个类型标注，以及在类型编程中，对这个接口类型进行各种处理获得新的类型

接口的属性类型可以是任意有效的类型, 接口加上数组类型，就可以描述一个成员是对象的数组类型

```typescript
interface JobModel {
  // ...
}

interface Job {
  currentModel: JobModel;
}

interface User {
  userJob: Job;
}
```

避免项目中出现 Magic Value，即莫名其妙的一个值，没有任何的注释, typescript提供了一个更好的常量定义方式枚举

```typescript
enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser = 10002,
  VIPUser = 10003,
  Admin = 10010,
  // ... 
}

// 数字类型的值，枚举能够自动累加值

enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser,
  VIPUser,
  Admin = 10010,
  // ...
}

```

枚举中可以同时支持数字、字符串、函数计算等成员
Typescript在版本号5.0.2中进行了优化，意味着：可以在含有字符串成员的枚举中使用计算值

```typescript
function generate() {
  return Math.random() * 10000;
}

enum UserLevelCode {
  Visitor = 10001,
  NonVIPUser = 10002,
  VIPUser,
  Admin,
  Mixed = 'Mixed',
  Random = generate(),
  // ...
}

```

除了常见的原始类型与对象类型以外，随着 ES6 的引入，Set 类型与 Map 类型的使用率也在不断上升

```typescript
const set = new Set<number>();

set.add(1);
set.add('2'); // X 类型“string”的参数不能赋给类型“number”的参数。

const map = new Map<number, string>();

map.set(1, '1');
map.set('2', '2'); // X 类型“string”的参数不能赋给类型“number”的参数。

```

## 3.函数类型与重载

函数表达式与函数声明

```typescript
function sum(a: number, b: number): number {
  return a + b;
}

const sum = function(a: number, b: number): number {
  return a + b;
};

```

`type Sum =` 的语法称为类型别名, 使用类型别名保存函数类型

```typescript
type Sum = (a: number, b: number) => number;

const sum: Sum = function(a, b) {
  return a + b;
};

```

在 5.1 版本中，即允许了 `undefined` 作为无显式 `return` 语句函数的返回值类型,之前一直返回的是`void`


除了类型标注以外，在 `TypeScript` 的函数还带来了一位新朋友-函数重载
可以解决函数可能存在多种入参组合、多种返回值的情况

```typescript
function sum(base: number, incre: number): number;
function sum(baseArray: number[], incre: number): number[];
function sum(incre: number, baseArray: number[]): number[];
function sum(baseArray: number[], increArray: number[]): number[];
function sum(x: number | number[], y: number | number[]): number | number[] { }

```

## 4.TypeScript中的Class

使用` private` 关键字，将 `name` 和 `age` 属性标记为私有的，并使用与 `private `对应的 `public` 关键字，提供了 `getName` 这样的公开方法
Class 中的方法也支持重载，语法也完全一致

```typescript
class Person {
  private name: string;
  private age: number;

  constructor(personName: string, personAge: number) {
    this.name = personName;
    this.age = personAge;
  }

  public getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }

  public getName(): string {
    return this.name;
  }

  public getUpperCaseName(): string {
    return this.name.toLocaleUpperCase();
  }
}

const person = new Person('Linbudu', 18);

console.log(person.name); // 属性“name”为私有属性，只能在类“Person”中访问。
console.log(person.getName()); // Linbudu
console.log(person.getUpperCaseName()); // LINBUDU

export class DateUtils {
  static isSameDate(){ }
  static diffDate(){ }
}

export class NumberUtils { }
export class UserListUtils { }
// ...
```

## 5.any、unknown类型与类型断言

any 类型 = 万能类型 + 放弃类型检查
unknown 类型，用于表示万能类型的同时，保留类型检查

但只使用unknown类型，编译器无法识别成预期的类型，需要类型断言来辅助

```typescript
interface IUser {
  name: string;
  job?: IJob;
}

interface IJob {
  title: string;
}

const user: IUser = {
  name: 'foo',
  job: {
    title: 'bar',
  },
};

const { name, job = {} as IJob } = user;

const { title } = job; // 类型“{}”上不存在属性“title”。

```

## 6.类型别名、联合类型与交叉类型

类比 || 与 && 的关系

enum 是用来定义一组有名字的常量集合，而 type 是用来定义类型或类型的组合

## 7.泛型

```typescript
function factory<T1, T2, T3>(input: T1, arg1: T2, arg2: T3): T1 {
  // ...
}
```

## 8.类型声明

`TypeScript` 又是怎么让我们不需要为 npm 包编写类型就能享受到类型提示的？类型声明此时闪亮登场，你可以理解为它是存在于全局的 TS 类型，当你访问数组变量，它会读取 `Array` 这个顶级对象在全局声明的类型，然后为你提供对应的类型提示，对于 npm 包也是如此

类型声明这个概念在 `TypeScript` 中，需要专门的 .d.ts 文件来进行书写，这里的 d 即是 declaration 声明之意。我们打开  `@types/lodash/common/string.d.ts`，其中包含了 `Lodash` 中所有字符串相关方法的类型声明，简化后看起来是这样的：

```typescript
declare module "lodash" {
  camelCase(string?: string): string;
  capitalize(string?: string): string;
  endsWith(string?: string): string;
  // ...
}

```

首先是 `declare module "lodash"` ，这是我们从未了解过的语法，可以称它为模块类型声明，它的作用其实就是告诉 `TypeScript `，我们要为模块（module）lodash 进行类型声明（declare），在导入这个模块并访问属性时，你需要提示这个对象上具有 `camelCase`，`capitalize `等方法

而模块类型声明不仅仅可以声明三方模块，还可以为一些非 JS/TS 类型的文件提供类型声明，比如我们后面会了解到的在 Vite 初始化项目中，为 CSS Modules 提供了类型声明：

```typescript
// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses
  export default classes
}
// ...

```

对变量的声明。比如你在 TS 文件中写个 window，然后尝试访问这个 window 的类型：

```typescript
declare var window: Window & typeof globalThis;

interface Window {
  // ...
}
```

## 9.内置工具类型

- `Partial`，它接收一个对象类型，并将这个对象类型的所有属性都标记为可选
- `Required`，将属性标记为必选的
- `Readonly` 将对象类型所有属性标记为只读的 
- 索引签名类型，用于声明一个内部属性键类型一致、键值类型也一致的对象类型，而 TypeScript 中基于索引签名类型提供了一个简化版本 `Record`
- 用于对象类型裁剪的 `Pick` 与 `Omit`
- 对象类型的处理是内置工具类型中占比较大的部分, 除此以外，集合类型与函数类型也占有一席之地。比如集合类型的 `Exclude` 和 `Extract`(差集 与 交集)

```typescript

type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

// OptionalUserProps = UserProps - RequiredUserProps
type OptionalUserProps = Exclude<UserProps, RequiredUserProps>;

const optionalUserProps: OptionalUserProps = 'age'; // 'age' | 'phone' | 'address';

type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

type RequiredUserPropsOnly = Extract<UserProps, RequiredUserProps>;

const requiredUserPropsOnly: RequiredUserPropsOnly = 'name'; // 'name' | 'email';

```

- `Parameters` 和 `ReturnType` 这两个类型来提取函数的参数类型与返回值类型

```typescript
const addHandler = (x: number, y: number) => x + y;

type Add = typeof addHandler; // (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;

```

- 异步函数类型，提取出的返回值类型是一个 `Promise<string>` 这样的类型，如果我想提取 `Promise `内部的 `string` 类型呢？贴心的 `TypeScript` 为你准备了 `Awaited` 类

```js

const promise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 1000);
});

type PromiseInput = Promise<string>;
type AwaitedPromiseInput = Awaited<PromiseInput>; // string


// 定义一个函数，该函数返回一个 Promise 对象
async function getPromise() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("Hello, World!");
    }, 1000);
  });
}

type Result = Awaited<ReturnType<typeof getPromise>>; // string 类型

```

## 10.模板字符串类型

```typescript
type Version = \`${number}.${number}.${number}\`;

const v1: Version = '1.1.0';
const v2: Version = '1.0'; // 报错：类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
const v3: Version = 'a.0.0'; // 报错：类型 "a.0" 不能赋值给类型 `${number}.${number}.${number}`

```

类型别名的函数式用法和模板字符串类型也可以有紧密的合作

```typescript
type SayHello<T extends string | number> = `Hello ${T}`;

type Greet1 = SayHello<"linbudu">; // "Hello linbudu"
type Greet2 = SayHello<599>; // "Hello 599"

```

自动分发特性，即当一个模板字符串类型中的插槽传入了联合类型时，这个模板字符串类型会自动被扩展为使用所有联合类型的组合

## 11.配置typescript

>TypeScript 提供的编译能力和 Webpack 并不是一个维度的，它只能进行语法降级和类型定义的生成

按配置的能力来划分，可以分为产物控制、输入与输出控制、类型声明、代码检查

产物控制部分，这也是通常配置最频繁的部分，主要是 target 与 module 这两个配置项，它们分别控制产物语法的 ES 版本以及使用的模块（CommonJs / ES Module）

```typescript
const arr = [1, 2, 3];

for (let i of arr) {
  console.log(i);
}

const obj = {
  a: 1,
  b: 2,
  c: 3
};

for (let key in obj) {
  console.log(key);
}


// 编译后
// ES6
"use strict";
const arr = [1, 2, 3];
for (let i of arr) {
    console.log(i);
}
const obj = {
    a: 1,
    b: 2,
    c: 3
};
for (let key in obj) {
    console.log(key);
}

// ES5
"use strict";
var arr = [1, 2, 3];
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var i = arr_1[_i];
    console.log(i);
}
var obj = {
    a: 1,
    b: 2,
    c: 3
};
for (var key in obj) {
    console.log(key);
}

```

如果我们的 target 指定了一个版本，比如 es5，但你又希望使用 es6 中才有的 Promise 语法，此时就需要在 lib 配置项中新增 'es2015.promise'，来告诉 TypeScript 你的目标环境中需要启用这个能力，否则就会得到一个错误

```json
{
  "compilerOptions": {
    "lib": ["ES2015"],
    "target": "ES5"
  }
}

```

在 TypeScript 中，我们首先使用 include 和 exclude 这两个配置项来确定要包括哪些代码文件，再通过 outDir 选项配置你要存放输出文件的文件夹，比如你可以这么配置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "src/generated",
    "**/*.spec.ts"
  ]
}

```

TypeScript 会加载所有 node_modules 中 所有 @types 文件夹下的声明文件，假设我们的项目中被三方依赖安装了大量的 @types 文件，导致类型加载缓慢或者冲突，此时就可以使用 types 配置项来显式指定你需要加载的类型定义

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "react"],
  }
}

```

**类型相关的配置项**
也是一个重要的组成部分，这里我们只挑几个使用频率最高

declaration ，它的作用就一个——控制是否生成 .d.ts 文件，如果禁用的话你的编译产物将只包含 JS 文件，
与之相对的是 emitDeclarationOnly，如果启用，则只会生成 .d.ts 文件，而不会生成 JS 文件，
如果你两个都不想要呢？——请使用 noEmit ！启用后将不会输出 JS 文件与声明文件，但类型检查能力还是能保留的

将 tsc 和其它编译工具组合在一起。比如，使用 Webpack 进行语法降级，只是使用 TS 来生成类型声明文件（此时就可以启用 emitDeclarationOnly），或进行类型检查（此时启用 noEmit）等等。


**检查相关的配置**

noImplicitAny，当 TypeScript 无法推断出你这个变量或者参数到底是什么类型时，它只能默默给一个 any 类型

noUnusedLocals 与 noUnusedParameters，类似于 ESLint 中的 no-unused-var，它会检查你的代码中是否有声明了但没有被使用的变量/函数。

noImplicitReturns，启用这个配置项会要求你的函数中所有分支代码块都必须有显示的 return 语句，我们知道 JavaScript 中不写 return （即这里的 Implicit Returns）和只写一个简单的 return 的效果是完全一致的，但从类型层面来说却不一致，它标志着你到底是没有返回值还是返回了一个 undefined 类型的值。


## 12.实战

```typescript
/// <reference types="vite/client" />
```

使用三斜线指令来导入 vite/client 下的类型定义，我们不需要了解具体使用，只需要知道其作用是将 npm 包 'vite' 下的 'client.d.ts' 文件中的类型声明导入即可

```typescript
// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}

// CSS
declare module '*.css' {
  const css: string
  export default css
}

// images
declare module '*.png' {
  const src: string
  export default src
}
```
这里的类型声明主要是提供了你导入 .module.css，.css，.png 这些非常规代码文件时的类型声明


在 React 中，我们可以使用 React.FC 类型来描述一个函数式组件的类型，并通过它为属性类型预留的泛型坑位，来描述这个组件的属性类型

```typescript
import * as React from 'react';

interface HomeProps {
  owner: string;
}

const Home: React.FC<HomeProps> = ({ owner }) => {
  return <>Home of {owner}</>;
};

const App1: React.FC = () => {
  // √
  return <Home owner='me' />;
};

const App2: React.FC = () => {
  // X 不能将类型“number”分配给类型“string”。
  return <Home owner={599} />;
};

```

