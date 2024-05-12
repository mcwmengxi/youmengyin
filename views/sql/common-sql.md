# 常用SQL语句

## 1. 增
### 1.1 创建表
#### 1.1.1 使用select快速建表
```sql
SELECT
  Column1,
  Column2,
  Column3
INTO NewTable
FROM OldTable;

-- 使用SELECT INTO语句创建的新表将不包含任何索引、约束和其他对象。
-- 如果需要添加索引、约束或其他结构，请在创建新表之后，按需使用ALTER TABLE语句进行修改。
-- 在使用SELECT INTO创建新表时，确保新表不存在，以避免意外替换或覆盖现有表。
```

## 2. 删
### 2.1 删除表的中数据
```sql
-- 方式1: 使用 TRUNCATE
TRUNCATE TABLE table_name;
-- 方式2：使用 DELETE
DELETE FROM table_name
WHERE condition;
```

## 3. 改
### 3.1 更新数据
```sql
UPDATE users
SET age = 30, email = 'john@example.com'
WHERE name = 'John';
```
### 3.2 UPDATE使用CASE...WHEN语句
```sql
-- 将男改成女，将女改成男
UPDATE Salary
  SET sex = 
    CASE 
      WHEN sex = 'm' THEN 'f'
      WHEN sex = 'f' THEN 'm'
    END;
```
## 4. 查
### 4.1 JOIN相关
#### 4.1.1 JOIN案例
```sql
SELECT
  Customers.CustomerID,
  Customers.CustomerName,
  Orders.OrderID,
  Orders.OrderDate
FROM Customers
LEFT JOIN Orders ON
  Customers.CustomerID = Orders.CustomerID
```
### 4.2 对数据进行去重操作
#### 4.2.1 使用group by...having
```sql
-- sql server
SELECT
  supplier_code
  , supplier
FROM [ODS].[ods_inv_d_d08_supplier_mapping]
GROUP BY
  supplier_code
  , supplier
HAVING COUNT(1) > 1
```
### 4.3 逆透视
| ProductName | JanuarySales | FebruarySales | MarchSales |
| ----------- | ------------ | ------------- | ---------- |
| ProductA    |    1000      |   	1500       |    1200    |
| Product B   |    800       |    900        |	  700     |
| Product C   |    1200      |    1000       |  	800     |

```sql
SELECT ProductName, SalesMonth, SalesAmount
FROM
(
  SELECT ProductName, JanuarySales, FebruarySales, MarchSales
  FROM Sales
) p
UNPIVOT
(
  SalesAmount FOR SalesMonth IN (JanuarySales, FebruarySales, MarchSales)
) as UnpivotedData;
```
| ProductName |	SalesMonth    |  SalesAmount  |
| ----------- | ------------  | ------------- |
| Product A   |	JanuarySales	|     1000      |
| Product A   |	FebruarySales	|     1500      |
| Product A   |	MarchSales	  |     1200      |
| Product B   |	JanuarySales	|     800       |
| Product B   |	FebruarySales	|     900       |
| Product B   |	MarchSales	  |     700       |
| Product C   |	JanuarySales	|     1200      |
| Product C   |	FebruarySales	|     1000      |
| Product C   |	MarchSales	  |     800       |


### 4.4 各种函数操作
#### 1. 日期型
- 1. 将字符串转换成日期
```sql
SELECT CONVERT(VARCHAR(10), CAST('2022-10' + '-01' AS DATE), 23)
-- 2022-10-01
```
#### 2. 数字型
- 1. 将varchar '92284.27'转换成float
```sql
-- CONVERT
SELECT
  CONVERT(FLOAT, '92284.27')
  , CAST('92284.27' AS FLOAT)
```
#### 3. 字符串
- 1. REPLACE
```sql
SELECT 'abc_def_efg', REPLACE('abc_def_efg', '_', '**')
--  abc_def_efg, abc**def**efg
```
#### 4. case...when
```sql
SELECT
  name,
  score,
  CASE 
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    WHEN score >= 60 THEN 'D'
    ELSE 'E'
  END AS grade
FROM student;
```

## 5. 其他
### 5.1 sql 书写顺序
```sql
SELECT column1, column2, aggregate_function(column3)
FROM table1
LEFT JOIN table2 ON table1.column = table2.column
-- 筛选条件
WHERE condition1
-- 分组
GROUP BY column1, column2
HAVING condition2
-- 排序
ORDER BY column1 ASC, column2 DESC;

-- sql 子句的执行顺序
-- 1. FROM：指定从中检索数据的表
-- 2. WHERE：根据指定的条件筛选行
-- 3. Group BY：根据指定的列或表达式对行进行分组
-- 4. HAVING：根据条件筛选分组的行
-- 5. SELECT: 选择将在结果集中返回的列或表达式
-- 6. DISTINCT: 去重
-- 7. ORDER BY: 根据指定的列表达式对结果集进行排序
-- 8. LIMIT: 限制结果集中返回的行数
-- 注意：DBMS可能会以等价但不同的顺序执行一个查询
```


