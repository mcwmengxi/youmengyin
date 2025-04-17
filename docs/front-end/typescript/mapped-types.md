# 映射类型

在 TypeScript 中，映射类型（Mapped Types）是一种通过遍历一个类型的属性并对其进行修改、扩展或生成新类型的强大工具。通过映射类型，你可以基于现有类型动态创建新的类型。

映射类型的基础语法利用了 TypeScript 中的 in 关键字，允许你对类型中的每个属性进行处理和转换。映射类型使你能够灵活地操作对象类型的结构，控制对象的每个属性如何被类型化。

## 基本语法

```ts
type MappedType<Type> = {
  [Key in keyof Type]: NewType;
};
```

- Type：是我们要遍历的类型。
- keyof Type：表示类型 Type 中所有键的联合类型。keyof Type 获取 Type 的所有属性名，并将其作为键来进行映射。
- [Key in keyof Type]：表示遍历 Type 中的每个键 Key。
- NewType：是每个键对应的新类型。

## 基本的映射类型

```ts
interface Person {
  name: string;
  age: number;
}
 
type StringifiedPerson = {
  [P in keyof Person]: string;
};
```

## 映射类型与可选属性

映射类型还允许我们更灵活地控制属性的可选性、只读性等。你可以使用 ? 或 readonly 来修改属性的特性。

```ts
interface Person {
  name: string;
  age: number;
}
type OptionalPerson = {
  [P in keyof Person]?: Person[P];
};
type ReadonlyPerson = {
  readonly [P in keyof Person]: Person[P];
};

```

## 映射类型的条件类型

映射类型还可以与 条件类型 结合使用，创建更加动态和复杂的类型映射。比如，如果你想将所有 number 类型的属性转成 string，而不改变其他类型的属性，你可以使用条件类型来判断每个属性的类型。

```ts
interface Person {
  name: string;
  age: number;
}
type TransformNumbers<T> = {
  [P in keyof T]: T[P] extends number ? string : T[P];
};
type PersonWithNumbers = TransformNumbers<Person>;
```

## 使用 as 操作符修改键

有时我们需要在映射类型中修改属性的名字，可以通过 as 操作符来实现。例如，将所有属性的键都加上一个前缀：

```ts
interface Person {
  name: string;
  age: number;
}
type PrefixedPerson = {
  [K in keyof Person as `prefix_${K & string}`]: Person[K];
};
```

## 映射类型与 in 的更多用法

in 关键字在映射类型中的作用是遍历 keyof T 中的每个键来创建新的类型。可以通过以下方式对它进行更复杂的操作：

只选择特定的键：通过条件类型或其他类型操作，来决定哪些键需要被映射或修改。

生成新类型：你可以通过映射类型来生成基于现有类型的全新类型，如创建只包含某些属性的对象类型。

```ts
interface Person {
  name: string;
  age: number;
}
type PickNumberProperties<T> = {
  [P in keyof T]: T[P] extends number ? T[P] : never;
};
type NumberProperties = PickNumberProperties<Person>;
```

## 总结

映射类型是 TypeScript 中的一种强大工具，允许我们通过遍历现有类型的属性并修改或生成新类型。它通过 in 和 keyof 关键字，可以动态地对对象类型的每个属性进行转换，支持修改属性的类型、添加修饰符（如 readonly、optional）等操作。映射类型还支持与条件类型结合使用，从而实现更复杂的转换逻辑。此外，TypeScript 提供了内置的映射类型工具，如 Partial、Readonly、Required 和 Record，帮助开发者高效处理对象类型。
