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

### Omit 实现原理

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
