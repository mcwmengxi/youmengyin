# ts-core

## 类型保护

TypeScript 的类型保护（Type Guards）是一种机制，用于在代码中根据特定条件细化变量的类型，从而确保代码在运行时更安全和准确。类型保护可以通过几种不同的方式实现，包括类型断言、typeof 检查、instanceof 检查和用户定义的类型保护函数。

### typeof 检查

typeof 检查主要用于基本类型（如 string、number、boolean、symbol）的类型保护。

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value;
  }
  if (typeof padding === 'string') {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${typeof padding}'.`);
}
```

### instanceof 检查

instanceof 检查用于对象类型之间的类型保护。它通常用于检查一个对象是否是某个类的实例。

```ts
class Bird {
  fly() {
    console.log('Flying');
  }
}
 
class Fish {
  swim() {
    console.log('Swimming');
  }
}
 
type Pet = Bird | Fish;
 
function getPetAction(pet: Pet) {
  if (pet instanceof Bird) {
    pet.fly();
  } else if (pet instanceof Fish) {
    pet.swim();
  }
}
 
const bird = new Bird();
const fish = new Fish();
 
getPetAction(bird); // Flying
getPetAction(fish); // Swimming
```

### 自定义类型保护

自定义类型保护是通过定义一个返回类型谓词（type predicate）的函数实现的。类型谓词的格式是 parameterName is Type，表示如果函数返回 true，则该参数属于指定的类型。

```ts
interface Bird {
  kind: 'bird';
  fly(): void;
}
 
interface Fish {
  kind: 'fish';
  swim(): void;
}
 
type Pet = Bird | Fish;
 
function isBird(pet: Pet): pet is Bird {
  return pet.kind === 'bird';
}
 
function getPetAction(pet: Pet) {
  if (isBird(pet)) {
    pet.fly();
  } else {
    pet.swim();
  }
}
 
const bird: Bird = { kind: 'bird', fly: () => console.log('Flying') };
const fish: Fish = { kind: 'fish', swim: () => console.log('Swimming') };
 
getPetAction(bird); // Flying
getPetAction(fish); // Swimming

```

### 联合类型和类型保护

联合类型（Union Types）可以结合类型保护来使用，以确保在不同的分支中变量的类型是确定的。

```ts
type StringOrNumber = string | number;

function processValue(value: StringOrNumber) {
  if (typeof value === 'string') {
    console.log('String value:', value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log('Number value:', value.toFixed(2));
  } else {
    console.log('Unexpected type');
  }
}

processValue('hello'); // String value: HELLO
processValue(123.456); // Number value: 123.46

```

### in 关键字实现类型保护

在 TypeScript 中，in 关键字可以用于实现类型保护（Type Guards），帮助你在类型不明确时进行类型检查，并保证特定类型的属性在安全范围内使用。in 关键字可以检查对象中是否存在某个属性，从而进行类型保护。

```ts
interface Cat {
  meow: () => void;
}
 
interface Dog {
  bark: () => void;
}
 
type Pet = Cat | Dog;

function makeSound(pet: Pet) {
  if ('meow' in pet) {
    pet.meow(); // TypeScript 知道这里是 Cat 类型
  } else {
    pet.bark(); // TypeScript 知道这里是 Dog 类型
  }
}
```

## 函数重载

1. 顺序很重要：当使用重载时，签名的顺序非常重要。TypeScript 会按照从上到下的顺序匹配签名，匹配到第一个合适的签名就停止。
2. 实现体与签名的关系：你不能为每个重载签名编写单独的实现体。你只需要一个实现体，它需要处理所有可能的签名情况。
3. 类型推导：虽然 TypeScript 支持重载，但你仍然需要确保函数体中能正确推导出参数类型，并处理不同的参数类型。否则，可能会导致类型不匹配的错误。

```ts
// 定义重载签名
export function arrayDeduplication<T>(arr: T[]): T[];
export function arrayDeduplication<T>(arr: T[], compareFn?: string): T[];
export function arrayDeduplication<T>(
  arr: T[],
  compareFn?: (value: T, othVal: T) => boolean
): T[];

// 实现函数
export function arrayDeduplication<T>(...args: any[]): T[] {
  const list = args[0];
  let compareFn = args[1] ?? defaultComparator;

  if (typeof compareFn === 'string') {
    const key = compareFn as keyof T;
    compareFn = (value: T, othVal: T) => value[key] === othVal[key];
  }

  return list.reduce((acc: T[], cur: T) => {
    if (!acc.some((item: T) => compareFn(item, cur))) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

```

重载参数较宽泛时的注意事项

当你在重载中使用较宽泛的类型时，应该将它放在签名列表的最后。如果你把 any 或 string | number 这样的类型放在前面，TypeScript 会匹配到最后一个签名，使得前面的重载签名失效。

```ts
// 错误的重载签名顺序
function combine(x: any, y: any): any;
function combine(x: number, y: number): number;
function combine(x: string, y: string): string;
// 正确的重载签名顺序
function combine(x: number, y: number): number;
function combine(x: string, y: string): string;
function combine(x: any, y: any): any;
 
function combine(x: any, y: any): any {
  return x + y;
}
```

## TS的类

TypeScript 类在es6的Class基础上增加了完整的类型系统、访问控制、抽象类等特性

### 静态成员与非静态成员的区别

1. 非静态成员：属于每个实例对象。每创建一个新的对象，都会创建一组独立的非静态成员。
2. 静态成员：属于类本身，而不是实例。静态成员可以通过类名直接访问，不需要实例化对象。

### 访问修饰符（public, private, protected）

TypeScript 中的访问修饰符用于控制类成员的访问权限：

- public：公有成员，可以在类的外部访问（默认修饰符）。
- private：私有成员，只能在类的内部访问，不能在外部或者子类中访问。
- protected：受保护的成员，可以在类的内部和子类中访问，但不能在类的外部访问。

### 继承与方法重写

TypeScript 支持类的继承，通过 extends 关键字可以继承父类的属性和方法。继承允许子类扩展父类的功能，并且可以重写父类的方法。
在子类的构造函数中，super 用于调用父类的构造函数，从而初始化父类的属性。子类还可以重写父类的方法来改变行为。

### 抽象类和抽象方法

抽象类是不能被实例化的类，它们通常用作基类，定义子类必须实现的抽象方法。抽象方法在抽象类中没有具体实现，必须由子类提供具体实现。

### 接口（Interfaces）

接口定义了一组类必须实现的规范。接口只定义方法的签名，而不提供方法的具体实现。
