# PYTHON 基础
## 1. list列表
### 1. 用一行代码，剔除列表所有可能的假植
```python
a = [3, 2, None, 1, '']
print(list(filter(bool, a)))
```
## 2. 对象

## 3. 各种函数


## 其他各种模块
### JSON
> 在python中，JSON是一种常用的数据格式，用于存储和表示结构化数据。JSON(JavsScript Object Notation)是一种轻量级的数据交换格式，易于阅读和编写，并易于解析和生成。
> Python提供了内置的json模块，用于在JSON和Python数据类型之间进行转换。该模块包含了json.dumps()和json.loads()函数。
- 1. json.dumps()
```python
import json
# dumps 编码 可以将Python数据类型(如字典、列表)转换为JSON字符串。
# indent参数：确定缩进级别，使结果更加易读
# sort_keys参数：根据键对字典进行排序
data = {
  "name": "Alice",
  "age": 25,
  "city": "New York"
}
json_data = json.dumps(data, indent = 4)
print(json_data)
```

- 2. json.loads()
```python
# loads 解码 可以将json字符串转换为Python的数据类型
decode_data = json.loads(json_data)
print(decoded_data)
print(decoded_data['name'])
```

- 3. json.dump()
```python
# dump()将数据类型编码为json格式，并将其写入文件中
with open('data.json', 'w') as file:
  json.dump(data, file, indent=4)
```
- 4. json.load()
```python
# load从文件中读取json字符串，并将其解码为Python类型类型。
with open('data.json', 'r') as file:
  loaded_data = json.load(file)

print(loaded_data)
```

### random
#### 1. 在python列表中随机抽取两个元素？
```python
import random
a = [3, 1, 2, 5, 9]
random.sample(a, 2) # [2, 5]
```