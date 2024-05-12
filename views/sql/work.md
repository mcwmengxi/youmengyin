# 实际遇到的问题

## 1. 将`unicode` 转换成字符
1. 在`dbo`模式下，创建函数
```sql
ALTER   FUNCTION dbo.DecodeUnicode(@unicodeStr NVARCHAR(MAX))
RETURNS NVARCHAR(MAX)
AS
BEGIN
  DECLARE @result NVARCHAR(MAX) = N'';
  DECLARE @pos INT = 1;
  DECLARE @len INT = LEN(@unicodeStr);

  WHILE @pos <= @len
    BEGIN
      IF SUBSTRING(@unicodeStr, @pos, 2) = N'\u'
        BEGIN
          SET @result += NCHAR(
            CONVERT(
              INT,
              CONVERT(
                VARBINARY
                , '0x' + SUBSTRING(@unicodeStr, @pos + 2, 4)
                , 1
              )
            )
          );
          SET @pos += 6; -- 跳过已处理的 Unicode 转义字符
		END
      ELSE
	    BEGIN
          SET @result += SUBSTRING(@unicodeStr, @pos, 1);
          SET @pos += 1;
		END
    END
  RETURN @result;
END;
```
2. 调用函数
```sql
SELECT 
  '\u5f20\u4e09' AS unicode_data
  , dbo.DecodeUnicode('\u5f20\u4e09') AS deunicode_data
```
| unicode_data  |	deunicode_data   |
| -----------   | ------------------ |
| \u5f20\u4e09  |	张三	         |
