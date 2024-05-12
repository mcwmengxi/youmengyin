# 工作中遇到的情况

## 1. js
### 1.生成`FormData`数据
```js
// 生成formData数据
const createFormData = obj => {
  const formData = new FormData()
  Object.keys(obj).forEach(item => {
    if (!Array.isArray(obj[item])) {
      formData.append(item, obj[item])
    } else {
      obj[item].forEach(childItem => {
        formData.append(`${item}[]`, childItem)
      })
    }
  })
  return formData
}
```
### 2. 将字符串和 `unicode` 码互相转换

```js
// 1. 将字符串转换为unicode码
let char = '三';
let unicode = char.charCodeAt(0).toString(16);
unicode = '\u' + '0000'.substr(0, 4 - unicode.length) + unicode;

// 输出结果为：\u4e09

// 2. 将 unicode 码转换为字符串
console.log(`\u4e09`) // 使用 ES6+ 模板字符串转换
// 输出结果为：三
```

### 3. 使用位运算实现权限组合
```js
// 定义基础权限
const READ = 0b1;
const CREATE = 0b10;
const UPDATE = 0b100;
const DELETE = 0b1000;

// 通过上面的基础权限构造出复杂权限
const xxx = READ | UPDATE | DELETE

// 判断是否有读权限
console.log((xxx & READ) === 0)
```

### 4. 怎么实现常见登录业务的
## 模块
### 1. depcheck
> 超级好用的依赖检查工具`depcheck`
```txt
npm i -g depcheck

depcheck
```
### 2. 解决 npm或pnpm : 无法加载文件 `C:\Users\hp\AppData\Roaming\npm\cnpm.ps1`
因为在此系统上禁止运行脚本

1. 以管理员身份打开 powershell 
2. 运行 `set-ExecutionPolicy RemoteSigned` 
3. 选择 `Y` 或者 `A`