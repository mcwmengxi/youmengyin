# Advanced Type

TS 类型系统贴心的为开发者提供了部分常用的内置全局工具类型

## Partial

Partial 工具类型可以将一个类型的所有属性都变为可选的

### 基本使用

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

// 原始用户对象
const user: User = {
  id: 1,
  name: 'csdss',
  age: 18,
};

// 更新用户信息，只修改部分属性
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}
const updatedUser = updateUser(user, { age: 20 });
console.log(updatedUser); // { id: 1, name: 'Moment', age: 20 }

```

### 实现原理

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### Partial 进阶使用

Partial 类型可以应用于更多复杂的场景，尤其是在结合其他 TypeScript 特性和工具类型时。例如，可以将其与递归类型、联合类型和条件类型结合使用，以处理更复杂的数据结构。

```ts
interface Address {
  street: string;
  city: string;
  zipcode: string;
}

interface User {
  id: number;
  name: string;
  address: Address;
}

// 递归地将所有嵌套属性变为可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const user: DeepPartial<User> = {
  id: 1,
  address: {
    city: '西安',
  },
};

```

### 与联合类型结合使用

处理联合类型时，Partial 可以与条件类型结合使用，以确保所有可能的类型都变为可选。

```ts
interface Admin {
  id: number;
  name: string;
  role: 'admin';
  age: number;
}

interface RegularUser {
  id: number;
  name: string;
  role: 'user';
}

type UserType = Admin | RegularUser;

type PartialUserType<T> = T extends any ? Partial<T> : never;

const partialAdmin: PartialUserType<Admin> = {
  name: 'Moment',
  age: 18,
};

const partialUser: PartialUserType<RegularUser> = {
  role: 'user',
};
```

### 与映射类型和条件类型结合使用

可以创建更复杂的类型转换，通过条件类型和映射类型来处理不同类型的属性。

```ts
interface Profile {
  username: string;
  email: string;
  id: number;
  age?: number;
  contact?: {
    phone: string;
    address?: {
      street: string;
      city: string;
    };
  };
}

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends { [P in K]: T[K] } ? never : K;
}[keyof T];
type OptionalKeys<T> = {
  [K in keyof T]-?: object extends { [P in K]: T[K] } ? K : never;
}[keyof T];

// 递归处理属性 (DeepPartial<T>): 对于嵌套的对象，递归地将所有属性设为可选。
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
// 组合处理结果 (DeepPartialOptional<T>): 将必需属性保持原状并递归处理，将可选属性变为递归可选。
type DeepPartialOptional<T> = {
  [K in RequiredKeys<T>]: DeepPartial<T[K]>;
} & {
  [K in OptionalKeys<T>]?: DeepPartial<T[K]>;
};
type PartialProfile = DeepPartialOptional<Profile>;

```

### 与实用工具类型结合

通过与内置工具类型操作一起使用，以实现更复杂的数据结构

```ts
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  obj?: {
    a: number;
    b?: string;
  };
}

type PartiallyRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

// 部分必需属性
const product: PartiallyRequired<Product, 'id' | 'name'> = {
  id: 1,
  name: 'hhh',
  description: 'dfd',
  obj: {
    a: 1,
    b: 'sdsd',
  },
};
```

## Omit

Omit 工具类型可以从一个类型中排除指定的属性，创建一个新的类型。
它的主要使用场景有以下几个方面：

1. 去除不需要的属性：当你有一个类型，但不需要其中的一些属性时，可以使用 Omit 去除这些属性。
2. 创建子类型：从一个大型类型中派生出较小的子类型，只包含某些特定的属性。

### Omit 基本使用

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserWithoutPassword = Omit<User, 'password'>;

const user: UserWithoutPassword = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  // password: 'password123', // 错误：password 是必需的
};

```

### Omit **实现原理**

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Omit 进阶使用

Omit 类型可以应用于更多复杂的场景，尤其是在结合其他 TypeScript 特性和工具类型时。例如，可以将其与递归类型、联合类型和条件类型结合使用，以处理更复杂的数据结构。

#### 动态类型与 Omit 结合使用

结合条件类型和 Omit 可以实现更加动态的类型操作。

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type ConditionalOmit<T, K extends keyof any, U> = T extends U ? Omit<T, K> : T;

type AdminUser = User & { admin: true };
type RegularUser = User & { admin?: false };

// 根据某些条件有选择性地移除类型中的属性
type UserWithoutPassword<T> = ConditionalOmit<T, 'password', { admin?: false }>;

const adminUser: UserWithoutPassword<AdminUser> = {
  id: 1,
  name: 'kyo',
  email: 'kyo@qq.com',
  password: 'kyo',
  admin: true,
};
// 如果 T 满足 { admin?: false } 条件（即普通用户），则移除 T 中的 password 属性。
const regularUser: UserWithoutPassword<RegularUser> = {
  id: 2,
  name: 'kyo',
  email: 'kyo@qq.com',
  // password: 'kyo', // 被省略
  admin: false,
};

```

#### 递归 Omit

通过递归类型实现嵌套类型的 Omit 操作。

```ts
interface NestedObject {
  id: number;
  details: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
    };
  };
}

type DeepOmit<T, K extends keyof any> = T extends object
  ? { [P in Exclude<keyof T, K>]: DeepOmit<T[P], K> }
  : T;

type DeepOmitHelper<T, K extends keyof any> = {
  [P in keyof T]: P extends K
    ? never
    : T[P] extends infer TP
    ? TP extends object
      ? DeepOmit<TP, K>
      : TP
    : never;
};
// 使用 Pick 和映射类型来删除被设置为 never 的属性。
// 从 DeepOmitHelper 中挑选出所有非 never 的属性键，创建一个新的类型。
type DeepOmit1<T, K extends keyof any> = Pick<
  DeepOmitHelper<T, K>,
  {
    [P in keyof DeepOmitHelper<T, K>]: DeepOmitHelper<T, K>[P] extends never
      ? never
      : P;
  }[keyof DeepOmitHelper<T, K>]
>;
type neB = DeepOmit1<NestedObject, 'email'>;
const ne: neB = {
  id: 1,
  details: {
    name: 'kyo',
    address: {
      street: '中山大道',
      city: '西安',
    },
  },
};
```

#### 使用 Omit 构建 REST API 响应类型

在构建 REST API 时，通常需要根据请求的不同返回不同的响应类型。Omit 可以用于构建响应类型，排除不需要的属性。

```ts
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建一个请求体类型，省略 id 和时间戳
type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

const newUser: CreateUserRequest = {
  name: 'kyo',
  email: 'kyo@qq.com',
  password: 'kyo',
};

// 创建一个响应体类型，省略 password
type UserResponse = Omit<User, 'password'>;

const userResponse: UserResponse = {
  id: 1,
  name: 'kyo',
  email: 'kyo@qq.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  // password 被省略
};

```

## Pick

Pick 工具类型可以从一个类型中选择指定的属性，创建一个新的类型。
它的主要使用场景有以下几个方面：

### Pick基本使用

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserContactInfo = Pick<User, 'name' | 'email'>;

const contactInfo: UserContactInfo = {
  name: 'df',
  email: 'df@qq.com',
};
```

### Pick实际的应用

1. 选择性暴露接口，在 API 返回值或前端组件中，只暴露必要的属性：

    ```ts
    type PublicUserInfo = Pick<User, 'name' | 'email'>;
    ```

2. 创建子类型，从一个大型类型中派生出较小的子类型，只包含某些特定的属性。

    ```ts
    interface CreateUserRequest extends Pick<User, 'name' | 'email' | 'age'> {}
    ```

3. 提取特定的属性，在处理复杂的数据结构时，可以提取出需要的属性，简化类型定义。

    ```ts
    function sendEmail(user: Pick<User, 'email'>) {}
    ```

### Pick 实现原理

1. T 是源类型。
2. K 是一个属性名的联合类型，表示要从 T 中选取的属性。
3. P in K 表示循环 K 中的每个属性 P，并将其添加到新的类型中。
4. T[P] 表示 T 类型中属性 P 的类型。

  ```ts
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  ```

### Pick 进阶使用

#### 结合泛型函数使用

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
}

function getUserInfo<T extends keyof User>(
  user: User,
  keys: T[]
): Pick<User, T> {
  const result = {} as Pick<User, T>;
  keys.forEach((key) => {
    result[key] = user[key];
  });
  return result;
}

const user: User = {
  id: 1,
  name: 'Moment',
  email: 'moment@qq.com',
  age: 18,
  address: '西安',
};

const userInfo = getUserInfo(user, ['name', 'email']);
console.log(userInfo);
```

#### 动态选择属性

通过结合条件类型、映射类型、索引类型查询、索引访问类型和工具类型，实现查找出接口中的可选类型

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address?: string;
}

// 判断属性是否为可选
type IsOptional<T, K extends keyof T> = object extends Pick<T, K>
  ? true
  : false;

// ex
type a = IsOptional<User, 'id'>; // true
type b = IsOptional<User, 'name'>; // false
type c = IsOptional<User, 'address'>; // true
type d = IsOptional<User, 'age'>; // false

// 提取可选属性的键，并排除掉 undefined 类型
type OptionalKeys<T> = {
  [K in keyof T]-?: IsOptional<T, K> extends true ? K : never;
}[keyof T];
type OptionalKeysV2<T> = Exclude<
  {
    [K in keyof T]: undefined extends T[K] ? K : never;
  }[keyof T],
  undefined
>;
// ex
type e = OptionalKeys<User>; // "id" | "address"

// 使用 Pick 提取可选属性的类型
type UserOptionalProperties = Pick<User, OptionalKeys<User>>;

const userOptionalProps: UserOptionalProperties = {
  address: '123',
};
```

#### 深层属性选择

使用递归类型，可以实现从嵌套对象中选择属性。

```ts
interface Address {
  street: string;
  city: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: Address;
}

// 判断属性是否为可选
type IsOptional<T, K extends keyof T> = object extends Pick<T, K>
  ? true
  : false;

type DeepPick<T, K extends keyof T> = {
  [P in K]: T[P] extends object ? DeepPick<T[P], keyof T[P]> : T[P];
};
// ex
type UserAddressOnly = Pick<User, 'address'>; // true

const example: UserAddressOnly = {
  address: {
    street: '中山大道',
    city: '广州',
  },
};

```

#### 条件类型与 Pick 结合使用

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// 选择布尔类型的属性
type BooleanProperties<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];
type UserBooleanProperties = Pick<User, BooleanProperties<User>>;

const userBooleanProps: BooleanProperties<User> = 'isActive';
const boo: UserBooleanProperties = {
  isActive: false,
};

```

#### 结合 Exclude 使用

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
  isActive: boolean;
}

// 排除特定类型的属性
type ExcludeProperties<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

type NonStringProperties<T> = Pick<T, ExcludeProperties<T, string>>;
type UserNonStringProperties = NonStringProperties<User>;

const user: UserNonStringProperties = {
  age: 18,
  id: 7,
  isActive: true,
};

```

## Exclude

`Exclude<T, U>` 是 TypeScript 提供的条件类型工具，用于从类型 T 中排除类型 U 的部分。它返回一个新类型，包含所有 T 中的类型，但不包括 U 中的类型。Exclude 常用于从联合类型中移除特定的类型，帮助我们精确控制类型的结构。实现上，它通过条件类型的判断机制，决定哪些类型应该被排除。总结来说，Exclude 是一种高效的类型过滤工具，适用于处理类型之间的排除逻辑。

### Exclude 基本使用

```ts
type Fruit = 'apple' | 'banana' | 'orange';
type ExcludeBanana = Exclude<Fruit, 'banana'>; // ExcludeBanana 是 'apple' | 'orange'
```

### Exclude 实现原理

```ts
type Exclude<T, U> = T extends U? never : T;
```

## Extract

Extract<T, U> 是 TypeScript 的一个条件类型工具，用于从联合类型 T 中提取出与类型 U 兼容的部分。它帮助我们筛选出符合特定条件的类型，常用于提取多个类型中的子集。Extract 的实现基于条件类型机制，通过判断类型是否兼容，决定哪些类型应被保留。最终，它返回一个新的类型，只包含 T 中与 U 兼容的部分。

### Extract 基本使用

```ts
type A = string | number | boolean; // A 是 string | number | boolean
type B = number | boolean | null | '123'; // B 是 number | boolean

// Extract A 中与 B 兼容的部分，结果是 number | boolean
type Result = Extract<A, B>; // Result 是 number | boolean

type Fruit = 'apple' | 'banana' | 'orange';
type Citrus = 'orange' | 'lemon';
 
// 提取 Fruit 中与 Citrus 兼容的部分，结果是 'orange'
type ExtractResult = Extract<Fruit, Citrus>; // ExtractResult 是 'orange'

```

### Extract 实现原理

```ts
type Extract<T, U> = T extends U? T : never;
```

## NonNullable

`NonNullable<T>` 是 TypeScript 的一个条件类型工具，用于从类型 T 中移除 null 和 undefined。它返回一个新类型，其中不包含 null 和 undefined，确保类型中只保留有效的值类型。NonNullable 常用于确保函数参数或变量的值不会是 null 或 undefined，提高代码的类型安全性。通过 NonNullable，我们可以避免在处理类型时出现空值相关的错误。

### NonNullable 基本使用

```ts
type Callback = (value: string | null | undefined) => void;

// 使用 NonNullable 去掉参数中的 null 和 undefined
type NonNullableCallback = (
  value: NonNullable<string | null | undefined>
) => void;

// 结果：NonNullableCallback 的参数类型是 string
const callback: NonNullableCallback = (value) => {
  console.log(value);
};

callback('Hello'); // 输出：Hello
// callback(null); // 错误：类型 'null' 不能赋值给类型 'string

```

### NonNullable 实现原理

```ts
type NonNullable<T> = T extends null | undefined? never : T;
type NonNullable<T> = T & {}
```

## ReturnType

 `ReturnType` 是 TypeScript 提供的一个内置条件类型工具，用于获取一个函数类型的 返回值类型。它可以帮助你从一个函数类型中提取出该函数的返回值类型，而不需要手动定义返回值的类型。

### ReturnType 基本使用

```ts
function add(a: number, b: number): number {
  return a + b;
}

// 使用 ReturnType 提取 add 函数的返回类型
type AddReturnType = ReturnType<typeof add>;
```

### ReturnType 与函数重载

如果函数有多个重载签名，ReturnType 会返回函数所有重载签名中 最后一个签名 的返回类型。

```ts
function greet(name: string): string;
function greet(age: number): number;
function greet(value: any): any {
  if (typeof value === 'string') {
    return `Hello, ${value}`;
  }
  return value * 2;
}

// 使用 ReturnType 提取 greet 函数的返回类型
type GreetReturnType = ReturnType<typeof greet>;
```

### ReturnType 实现原理

T extends (...args: any[]) => infer R：检查 T 是否为一个函数类型，infer R 会推断出该函数的返回类型 R。

如果 T 是函数类型，那么返回值类型就是 R，否则返回 never。

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

## Readonly

在 TypeScript 中，Readonly 是一个非常实用的内置工具类型，它用于将对象类型的所有属性变成只读，即这些属性在创建后不能被修改。Readonly 可以帮助我们保证数据的不可变性，这在很多场景下非常有用，特别是在管理状态、传递配置等情况下。

### Readonly 基本使用

```ts
interface Point {
  readonly x: number;
  y: number;
}
 
const point: Readonly<Point> = { x: 10, y: 20 };
 
// 错误：'x' 是只读属性，不能修改
point.x = 15; // 报错：无法分配到 "x" 因为它是只读属性
 
// 错误：'y' 变成了只读属性
point.y = 25; // 报错：无法分配到 "y" 因为它是只读属性
```

### Readonly 实现原理

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## Record

Record 是 TypeScript 提供的一个内置工具类型，它允许你构建一个对象类型，映射特定的键到指定的值类型。它通过映射类型（Mapped Types）实现，能够有效地将一组特定的键映射到某个类型的值。Record 在实际开发中非常有用，尤其是当你需要定义某些固定键并确保每个键对应的值符合特定类型时。

### Record 基本使用

```ts
type User = 'admin' | 'editor' | 'viewer';
type UserPermissions = Record<User, boolean>;

const userPermissions: Partial<UserPermissions> = {
  admin: true,
  editor: false,
};

const ids = ['id1', 'id2', 'id3'] as const;
type Id = (typeof ids)[number]; // 'id1' | 'id2' | 'id3'

const userInfo: Record<Id, { name: string; age: number }> = {
  id1: { name: 'Alice', age: 30 },
  id2: { name: 'Bob', age: 25 },
  id3: { name: 'Charlie', age: 28 },
};


```

### Record 实现原理

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

## Required

在 TypeScript 中，Required 是一个 内置的泛型工具类型，用于将类型中的所有属性变为 必填。

### Required 基本使用

```ts
interface User {
  id: number;
  name?: string; // 可选属性
  age?: number; // 可选属性
}

type RequiredUser = Required<User>;

const user1: RequiredUser = {
  id: 1,
  name: 'Alice',
  age: 30,
};

// 错误：缺少 name 和 age 属性
const user2: RequiredUser = {
  id: 2,
};

```

### Required 实现原理

```ts
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};
```
