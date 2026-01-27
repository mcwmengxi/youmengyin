# 里程碑 2024

## 2024-01-29

## 2024-03-08

[listen EACCES: permission denied 0.0.0.0:1216错误解决](https://github.com/vitejs/vite/issues/5801)

```bash
net stop winnat
net start winnat
```

## 2024-03-26

**📚 Nest 通关秘籍**<https://github.com/thinkasany/docs>

**学习资料**

- <https://github.com/CavinHuang/books>
- <https://github.com/gujiwuqing/my-note-website>
- <https://github.com/marhal3721/notes>

```bash
#运行next项目 已经build好了
pm2 start npm --name "next-blog" -- run start

# 若要使其开机自启或保持持续运行，可以做如下操作
pm2 save
pm2 startup
```

## 2024-10-25

[winget](!https://ujimatsu-chiya.github.io/OTHERS/winget/)

```shell
// 自定义安装fnm
winget install Schniz.fnm -l D:\software\winget\fnm

// 列出当前已经安装的所有软件
winget list 


// 设置环境变量
set FNM_DIR D:\software\winget\fnm

// 建议使用命令 winget list 列出的 ID 进行定位
// 选项 --rainbow，那么命令运行时进度条都将会变成彩色
winget install -e --id Git.Git -l "D:\git"
winget uninstall Git.Git --rainbow

```

## 2024-10-26

判断item是否在元组中

```typescript

type IsInTuple<T, K> = T extends [infer F, ...infer R] ? (F extends K ? true : IsInTuple<R, K>) : false;

// 示例 1: 元组中包含指定类型
type Result1 = IsInTuple<[number, string, boolean], string>; // true

// 示例 2: 元组中不包含指定类型
type Result2 = IsInTuple<[number, boolean, number], string>; // false

// 示例 3: 空元组
type Result3 = IsInTuple<[], string>; // false

// 示例 4: 元组中包含多个指定类型
type Result4 = IsInTuple<[string, number, string, boolean], string>; // true


// 根据一个元组 U 来过滤掉对象 T 中的某些属性
/**
 * 创建一个类型，该类型从对象T中排除了特定的属性，同时确保这些属性不会被设置为null
 * 这个类型的目的是确保在继承自T的新类型中，某些属性（由U指定）是不可设置为null的
 * 
 * @template T - 原始对象类型，从中选择属性
 * @template U - 属性名称数组类型，指定哪些属性不应为null
 */
type U_I_NoNull<T, U extends Array<keyof T>> = { [K in keyof T as ItemInTu<U, K> extends true ? never : K]: T[K] } & {
 [K in keyof T as ItemInTu<U, K> extends true ? K : never]-?: T[K];
};

// 示例
type SourceType = { a?: number; b: string; c: boolean };
type KeysToRemove = ['a', 'c'];

type ResultType = U_I_NoNull<SourceType, KeysToRemove>; // { b: string }

export const postAccountUserDelete = <RNU extends (keyof AT_Doc)[] = [], NUDATA extends (keyof AT_UserVO)[] = []>(
 data: U_I_NoNull<AT_UserVO, NUDATA>
) => {
 return axios.post<U_I_NoNull<AT_Doc, RNU>>(`/api/admin/account/user/delete.ac`, data);
};

export declare interface AT_Doc {
 status: number;
 message: string;
 data: object;
 trace: string;
 exception: boolean;
 ok: boolean;
}
export declare interface AT_UserVO {
 optimisticLockVersion: number;
 updateTime: string;
 createTime: string;
 limitFlag: boolean;
 cid: number;
 id: number;
 /*工号*/
 workSn: string;
 /*登陆名*/
 loginName: string;
 /*是否子账号，0：主账号，1：子账号，2：微信账号*/
 accountType: number;
 /*密码*/
 password: string;
 /*真实姓名*/
 name: string;
 /*手机号*/
 phone: string;
 /*部门Id*/
 departmentId: number;
 /*职位Id*/
 positionId: number;
 /*微信账号 id*/
 assistantId: number;
 /*Cid*/
 isCid: number;
 /*用户Id*/
 isUid: number;
 /*最后一次登陆时间*/
 lastLoginTime: string;
 /*状态*/
 status: number;
 /*备注*/
 remark: string;
}

```

## 2024-11-25

>Vue 文档指出，onActivated 和 onDeactivated 钩子不仅适用于 `<KeepAlive>` 缓存的根组件，也适用于缓存树中的后代组件。然而，我们面临的问题是 onActivated 没有在缓存组件的条件后代（用 v-if 切换的那些）上被调用。

作为 v-if 更改后未在后代组件上调用 onActivated 的问题的潜在解决方法，可以考虑改用 v-show。这似乎解决了问题并确保了预期的行为，因为当使用 v-show 切换组件时，生命周期钩子会正确触发。

[onActivated 在惰性挂载的子组件中没有触发](!https://github.com/vuejs/core/issues/10806)
