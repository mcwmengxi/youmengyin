# xorm 

xorm是一个简单而强大的Go语言ORM库.通过它可以使数据库操作非常简便。
官网： `https://xorm.io/ `
中文文档：`https:gitea.com/xorm/xorm/src/branch/master/README_CN.md`

**特性**

- 支持Struct和数据库表之间的灵活映射，并支持自动同步
- 事务支持
- 同时支持原始SQL语句和ORM操作的混合执行
- 使用连写来简化调用
- 支持使用lD,ln,Where,,Limit,Join,Having,Table,SQL,Cols等函数和结构体等方式作为条件
- 
**安装**
```go
go get xorm.io/xorm
```

## 同步结构体到数据库
- 第一步创建引擎，driverName, dataSourceName 和 database/sql 接口相同

```go
import (
	"fmt"
	"time"
	"xorm.io/xorm"
	_ "github.com/go-sql-driver/mysql"
)
	var (
		userName string = "root"
		password string = "123456"
		ipAddress string = "127.0.0.1"
		port int = 3306
		db_name string = "go_blog"
		charset string = "utf8mb4"
	)
  func main()  {
    // root:123456@tcp(127.0.0.1:3306)/go_blog?charset=utf8mb4
    MysqlDataSources := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s", userName, password, ipAddress, port, db_name, charset)
    engine, err := xorm.NewEngine("mysql", MysqlDataSources)
  }
```
- 定义一个和表同步的结构体，并且自动同步结构体到数据库

```go
func main()  {
	type User struct {
    Id int64
    Username string
    Password string `xorm:"varchar(200)"`
    Created time.Time `xorm:"created"`
    Updated time.Time `xorm:"updated"`
	}

	tableStructErr := engine.Sync(new(User))
	if tableStructErr != nil {
		fmt.Println("表结构同步失败")
		panic(tableStructErr)
	}
}
```