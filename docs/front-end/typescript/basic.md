# typescript

## 基础类型
基础类型：Boolean、Number、String、null、undefined 以及 ES6 的 Symbol 和 ES10 的 BigInt

void常表示没有返回值的函数
而null与undefined是所有类型的子类型，可以赋值给其他类型的变量(在不检查NULL类型的条件下)

```typescript
//这样写会报错 void类型不可以分给其他类型
let test: void = undefined
let num2: string = "1"
 
num2 = test

"strictNullChecks": false,  /* 是否强制检查NULL类型 */
```

## 任意类型

类型按层级包含下一级的类型,unknown比any更安全一些
// any任意类型 unknown不知道的类型
//1.top type顶级类型any unknown
//2.0bject
//3.Number String Boolean
//4.number string boolean
//5.1 'nang' false
//6.never

```typescript
如果是any类型在对象没有这个属性的时候还在获取是不会报错的
let obj:any = {b:1}
obj.a

如果是unknow 是不能调用属性和方法
let obj:unknown = {b:1,ccc:():number=>213}
obj.b
obj.ccc()
```

## Object 、object 、字面量{}

Object类型是所有Object类的实例的类型。 由以下两个接口来定义：

Object 接口定义了 Object.prototype 原型对象上的属性；
ObjectConstructor 接口定义了 Object 类的属性， 如上面提到的 Object.create()。
这个类型是跟原型链有关的原型链顶层就是Object，所以值类型和引用类型最终都指向Object，所以他包含所有类型。

::: details 显示代码
```typescript
interface Object {
    /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
    constructor: Function;

    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns a date converted to a string using the current locale. */
    toLocaleString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    /**
     * Determines whether an object has a property with the specified name.
     * @param v A property name.
     */
    hasOwnProperty(v: PropertyKey): boolean;

    /**
     * Determines whether an object exists in another object's prototype chain.
     * @param v Another object whose prototype chain is to be checked.
     */
    isPrototypeOf(v: Object): boolean;

    /**
     * Determines whether a specified property is enumerable.
     * @param v A property name.
     */
    propertyIsEnumerable(v: PropertyKey): boolean;
}
```
:::

object只能用于引用类型，可以将原始类型筛选出来，可以用做泛型约束
```typescript
let o:object = {}//正确
let o1:object = []//正确
let o2:object = ()=>123 //正确
let b:object = '123' //错误
let c:object = 123 //错误

字面量和Object类型一样，但是无法对变量进行修改
let a1: {} = {name:1} //正确
let a2: {} =  () => 123//正确
let a3: {} = 123//正确
```

## 接口和对象类型

- 通过索引签名解决接口返回参数不一致的问题

```typescript
//在这个例子当中我们看到接口中并没有定义C但是并没有报错
//应为我们定义了[propName: string]: any;
//允许添加新的任意属性
interface Person {
    b?:string,
    readonly a:string,
    [propName: string]: any;
    cb:()=>void
}
 
const person:Person  = {
    a:"213",
    c:"123",
    cb:()=>{
        console.log(123)
    }
}

```

- 接口定义函数
```typescript
interface Func {
  (args: string): string[]
}

const func:Func = (params: string) => {
  return [params,params]
}
```
## 数组类型

-伪数组不能赋值给any类型的数组，只能通过接口来实现

::: details 显示代码 

```typescript
function Arr(...args:any): void {
  console.log(arguments)
  //错误的arguments 是类数组不能这样定义
  let arr:number[] = arguments
}
Arr(111, 222, 333)
 
function Arr(...args:any): void {
    console.log(arguments) 
    //ts内置对象IArguments 定义
    let arr:IArguments = arguments
}
Arr(111, 222, 333)
 
//其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：
interface IArguments {
  [index: number]: any;
  length: number;
  callee: Function;
}
```
:::
## 函数类型
> 函数类型

```javascript
  function fnuu(params: number): void
  function fnuu(params: string, params2: number): void
  function fnuu(params: any, params2?: any): void {
      console.log(params)
      console.log(params2)
  }
  
  fnuu(123)
  fnuu('123', 456)
```
## 类型断言 | 联合类型 | 交叉类型

- 联合类型 |
- 交叉类型 &
```typescript
let myPhone: number | string  = '010-820'

People & Man
```

- 类型断言
值 as 类型 value as string　
<类型>值 `<string>`value

```typescript
(window as any).abc = 123
//可以使用any临时断言在 any 类型的变量上，访问任何属性都是允许的。
```
滥用类型断言可能会导致运行时错误,编译时会删除掉类型断言

## 内置对象

- ECMAScript 的内置对象
Boolean、Number、string、RegExp、Date、Error

- DOM 和 BOM 的内置对象
Document、HTMLElement、Event、NodeList 等

::: details 查看代码
```typescript
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
//读取div 这种需要类型断言 或者加个判断应为读不到返回null
let div:HTMLElement = document.querySelector('div') as HTMLDivElement
document.addEventListener('click', function (e: MouseEvent) {
    
});
//dom元素的映射表
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
    "article": HTMLElement;
    "aside": HTMLElement;
    "audio": HTMLAudioElement;
    "b": HTMLElement;
    "base": HTMLBaseElement;
    "bdi": HTMLElement;
    "bdo": HTMLElement;
    "blockquote": HTMLQuoteElement;
    "body": HTMLBodyElement;
    "br": HTMLBRElement;
    "button": HTMLButtonElement;
    "canvas": HTMLCanvasElement;
    "caption": HTMLTableCaptionElement;
    "cite": HTMLElement;
    "code": HTMLElement;
    "col": HTMLTableColElement;
    "colgroup": HTMLTableColElement;
    "data": HTMLDataElement;
    "datalist": HTMLDataListElement;
    "dd": HTMLElement;
    "del": HTMLModElement;
    "details": HTMLDetailsElement;
    "dfn": HTMLElement;
    "dialog": HTMLDialogElement;
    "dir": HTMLDirectoryElement;
    "div": HTMLDivElement;
    "dl": HTMLDListElement;
    "dt": HTMLElement;
    "em": HTMLElement;
    "embed": HTMLEmbedElement;
    "fieldset": HTMLFieldSetElement;
    "figcaption": HTMLElement;
    "figure": HTMLElement;
    "font": HTMLFontElement;
    "footer": HTMLElement;
    "form": HTMLFormElement;
    "frame": HTMLFrameElement;
    "frameset": HTMLFrameSetElement;
    "h1": HTMLHeadingElement;
    "h2": HTMLHeadingElement;
    "h3": HTMLHeadingElement;
    "h4": HTMLHeadingElement;
    "h5": HTMLHeadingElement;
    "h6": HTMLHeadingElement;
    "head": HTMLHeadElement;
    "header": HTMLElement;
    "hgroup": HTMLElement;
    "hr": HTMLHRElement;
    "html": HTMLHtmlElement;
    "i": HTMLElement;
    "iframe": HTMLIFrameElement;
    "img": HTMLImageElement;
    "input": HTMLInputElement;
    "ins": HTMLModElement;
    "kbd": HTMLElement;
    "label": HTMLLabelElement;
    "legend": HTMLLegendElement;
    "li": HTMLLIElement;
    "link": HTMLLinkElement;
    "main": HTMLElement;
    "map": HTMLMapElement;
    "mark": HTMLElement;
    "marquee": HTMLMarqueeElement;
    "menu": HTMLMenuElement;
    "meta": HTMLMetaElement;
    "meter": HTMLMeterElement;
    "nav": HTMLElement;
    "noscript": HTMLElement;
    "object": HTMLObjectElement;
    "ol": HTMLOListElement;
    "optgroup": HTMLOptGroupElement;
    "option": HTMLOptionElement;
    "output": HTMLOutputElement;
    "p": HTMLParagraphElement;
    "param": HTMLParamElement;
    "picture": HTMLPictureElement;
    "pre": HTMLPreElement;
    "progress": HTMLProgressElement;
    "q": HTMLQuoteElement;
    "rp": HTMLElement;
    "rt": HTMLElement;
    "ruby": HTMLElement;
    "s": HTMLElement;
    "samp": HTMLElement;
    "script": HTMLScriptElement;
    "section": HTMLElement;
    "select": HTMLSelectElement;
    "slot": HTMLSlotElement;
    "small": HTMLElement;
    "source": HTMLSourceElement;
    "span": HTMLSpanElement;
    "strong": HTMLElement;
    "style": HTMLStyleElement;
    "sub": HTMLElement;
    "summary": HTMLElement;
    "sup": HTMLElement;
    "table": HTMLTableElement;
    "tbody": HTMLTableSectionElement;
    "td": HTMLTableDataCellElement;
    "template": HTMLTemplateElement;
    "textarea": HTMLTextAreaElement;
    "tfoot": HTMLTableSectionElement;
    "th": HTMLTableHeaderCellElement;
    "thead": HTMLTableSectionElement;
    "time": HTMLTimeElement;
    "title": HTMLTitleElement;
    "tr": HTMLTableRowElement;
    "track": HTMLTrackElement;
    "u": HTMLElement;
    "ul": HTMLUListElement;
    "var": HTMLElement;
    "video": HTMLVideoElement;
    "wbr": HTMLElement;
}
```
:::

- Promise
通过约束Promise内置对象的泛型判断返回值具体类型
```typescript
function promise():Promise<number>{
   return new Promise<number>((resolve,reject)=>{
       resolve(1)
   })
}
 
promise().then(res=>{
    console.log(res)
})
```

## 类Class

- private 代表定义的变量私有的只能在内部访问,不能在外部访问
- protected 代表定义的变量私有的只能在内部和继承的子类中访问 不能在外部访问

抽象类，只能用作基类，其他派生类通过继承获得抽象类的属性

## 元组

数组的变种，限制每个item类型, 常用于table的columns或数据、excel
- 对于越界的元素的类型会被限制为联合类型

## 枚举

数字枚举、字符串枚举、异构枚举（混合）、接口枚举、const枚举、反向映射

```typescript
   enum Types {
      yyds,
      dddd
   }
   interface A {
      red:Types.yyds
   }
 
   let obj:A = {
      red:Types.yyds
   }

```
常量枚举
```typescript
const enum Col {
  Success = 'success',
  No = 'no'
};
console.log(Col.Success);
console.log(Col.No);

------>
;
console.log("success" /* Col.Success */);
console.log("no" /* Col.No */);


// 正常枚举编译结果
enum Col {
  Success = 'success',
  No = 'no'
};
console.log(Col.Success);
console.log(Col.No);

----->
var Col;
(function (Col) {
    Col["Success"] = "success";
    Col["No"] = "no";
})(Col || (Col = {}));
;
console.log(Col.Success);
console.log(Col.No);
```

反向映射

key->value & value->key

```typescript
enum Enum {
   fall
}
let a = Enum.fall;
console.log(a); //0
let nameOfA = Enum[a]; 
console.log(nameOfA); //fall

```

## 类型推论|类型别名

type 和 interface 还是一些区别的 虽然都可以定义类型
-interface可以继承  type 只能通过 & 交叉类型合并
-type 可以定义 联合类型 和 可以使用一些操作符 interface不行
-interface 遇到重名的会合并 type 不行

```typescript
// 通过extends的类型不同结果也会不同
type a = 1 extends number ? 1 : 0 //1
type a = 1 extends never ? 1 : 0 //0
```
## never类型
never 类型来表示不应该存在的状态(很抽象是不是)
```typescript
  //void类型只是没有返回值 但本身不会出错
  function Void():void {
      console.log();
  }

  //只会抛出异常没有返回值
  function Never():never {
  throw new Error('aaa')
  }
```
- never在联合类型中会被直接移除

```type A = void | number | never```

TS的类型检查将会找到一些回归面不够广的错误
```
   switch (value) {
       case "1":
           break 
       case "2":
          break 
       default:
          //是用于场景兜底逻辑
          const error:never = value;
          return error
   }
```

## Symbol

## 泛型

函数泛型
```typescript
function Sub<T,U>(a:T,b:U):Array<T|U> {
    const params:Array<T|U> = [a,b]
    return params
}
 
 
Sub<Boolean,number>(false,1)

```
泛型接口、泛型类

```typescript
interface MyInter<T> {
   (arg: T): T
}
 
function fn<T>(arg: T): T {
   return arg
}
 
let result: MyInter<number> = fn
result(123)

class Sub<T>{
   attr: T[] = [];
   add (a:T):T[] {
      return [a]
   }
}
 
let s = new Sub<number>()
s.attr = [1,2,3]
s.add(123)
 
let str = new Sub<string>()
str.attr = ['1','2','3']
str.add('123')

```
keyof约束对象

```typescript
function prop<T, K extends keyof T>(obj: T, key: K) {
   return obj[key]
}
 
 
let o = { a: 1, b: 2, c: 3 }
 
prop(o, 'a') 
prop(o, 'd') //此时就会报错发现找不到

```
字面量泛型
```typescript
let foo: { <T>(arg: T): T }
 
foo = function <T>(arg:T):T {
   return arg
}
 
foo(123)

```

## tsconfig.json
::: details 查看代码
```json
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}
 
// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
   "src/**/*"
],
// 指定一个排除列表（include的反向操作）
 "exclude": [
   "demo.typescript"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
 "files": [
   "demo.typescript"
]
```
:::

1.include
指定编译文件默认是编译当前目录下所有的ts文件

2.exclude
指定排除的文件

3.target
指定编译js 的版本例如es5  es6

4.allowJS
是否允许编译js文件

5.removeComments
是否在编译过程中删除文件中的注释

6.rootDir
编译文件的目录

7.outDir
输出的目录

8.sourceMap
代码源文件

9.strict
严格模式

10.module
默认common.js  可选es6模式 amd  umd 等

## 命名空间

- 内部模块，主要用于组织代码，避免命名冲突。
- 命名空间内的类默认私有
- 通过 export 暴露
- 通过 namespace 关键字定义

TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的（因此对模块也是可见的）

- 合并命名空间

```ts
// 通过export导出才能读取它的值，类似与局部作用域
namespace A {
  export const a: number = 20;
  export const func = <T>(arg: T): T => {
    console.log(arg);
    return arg;
  };
  func(a);
}
namespace A {
  export const c: number = 10;
  export namespace b {
    export class Vue {
      parameters: string;
      constructor(parameters: string) {
        this.parameters = parameters;
      }
    }
  }
}
A.a
```

- 抽离命名空间

a.ts
```ts
export namespace V {
    export const a = 1
}
```
b.ts
```ts
import {V} from '../observer/index'
 
console.log(V);
 //{a:1}
```

- 嵌套命名空间 和命名空间的简化
```ts
namespace A {
  export const c: number = 10;
  export namespace b {
    export class Vue {
      parameters: string;
      constructor(parameters: string) {
        this.parameters = parameters;
      }
    }
  }
}

import X = A.b.Vue
new X("adss");
```

## 三斜线指令

三斜线指令是包含单个XML标签的单行注释。 注释的内容会做为编译器指令使用。

三斜线指令仅可放在包含它的文件的最顶端。 一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。 如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

- 声明文件间的依赖

/// <reference path="..." />指令是三斜线指令中最常见的一种。 它用于声明文件间的依赖。

三斜线引用告诉编译器在编译过程中要引入的额外的文件。
可以把它理解能import，它可以告诉编译器在编译过程中要引入的额外的文件

```ts
// d.ts
namespace D {
  export const d: string = "12";
}

// *.ts
/// <reference path="./c.ts" />
console.log(D.d);
```

- 声明文件引入

把 /// <reference types="node" />引入到声明文件，表明这个文件使用了 @types/node/index.d.ts里面声明的名字；并且，这个包需要在编译阶段与声明文件一起被包含进来。

仅当在你需要写一个d.ts文件时才使用这个指令。
```ts
///<reference types="node" />
/// <reference types="vite/client" />
...
```
tips:如果你在配置文件配置了noResolve或者自身调用自身文件会报错

## 声明文件d.ts

### 声明文件declare

>当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能

```ts
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型
/// <reference /> 三斜线指令

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

有一些第三方包确实没有声明文件,我们可以自己去定义.d.ts创建一个文件去声明
index.ts
```ts
import express from 'express'
 
 
const app = express()
 
const router = express.Router()
 
app.use('/api', router)
 
router.get('/list', (req, res) => {
    res.json({
        code: 200
    })
})
 
app.listen(9001,()=>{
    console.log(9001)
})

```

express.d.ts
```ts
declare module 'express' {
    interface Router {
        get(path: string, cb: (req: any, res: any) => void): void
    }
    interface App {
 
        use(path: string, router: any): void
        listen(port: number, cb?: () => void): void
    }
    interface Express {
        (): App
        Router(): Router
 
    }
    const express: Express
    export default express
}

```

## 混入mixins

- 对象混入

>可以使用es6的Object.assign合并多个对象，此时 people会被推断成一个交差类型 Name & Age & sex;
```ts
interface Name {
    name: string
}
interface Age {
    age: number
}
interface Sex {
    sex: number
}
 
let people1: Name = { name: "小满" }
let people2: Age = { age: 20 }
let people3: Sex = { sex: 1 }
 
const people = Object.assign(people1,people2,people3)

```

- 类的混入

严格模式要关闭不然编译不过
D类实现接口是为了将要mixin进来的属性方法创建出占位属性。告诉编译器这些成员在运行时是可用的。 这样就能使用mixin带来的便利，虽说需要提前定义一些占位属性
```ts
class MinA {
  type: boolean = false;
  changeType() {
    this.type = !this.type;
  }
}

class MinB {
  name: string = "张三";
  getName(): string {
    return this.name;
  }
}

class D implements MinA, MinB {
  type: boolean = false;
  name: string;
  changeType: () => void;
  getName: () => string;
}

// Object.getOwnPropertyNames()可以获取对象自身的属性，除去他继承来的属性，
// 对它所有的属性遍历，它是一个数组，遍历一下它所有的属性名
Mixins(D, [MinA, MinB]);
function Mixins(curCls: any, itemCls: any[]) {
  itemCls.forEach((item) => {
    Object.getOwnPropertyNames(item.prototype).forEach((name) => {
      curCls.prototype[name] = item.prototype[name];
    });
  });
}

const d = new D();
console.log(d.type, d);
d.changeType();
console.log(d.type);

```