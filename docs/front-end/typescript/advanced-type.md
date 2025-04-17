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
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

type PartialProfile = RequiredKeys<Profile>;
```
