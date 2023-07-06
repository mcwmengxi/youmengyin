# Redis

- 单机版mysql 
1.数据量太大，机器放不下
2.数据索引 B+Tree,内存也不够
3.访问量变大(读写混合)

- Memcached(缓存) + mysql +垂直拆分
优化数据结构和索引 
文件缓存IO
Memcached(缓存) 读写分离

- 分库分表 水平拆分(集群)
- 
## NoSQL
>什么是NoSQL


NoSQL=Not Only SQL(不仅仅是SQL)
关系型数据库:表格,行,列
泛指非关系型数据库的,随着web2.0互联网的诞生!传统的关系型数据库很难对付web2.0时代!尤其是超大规模的高并发的社区!暴露出来很多难以克服的问题,NoSQL在当今大数据环境下发展的十分迅速,Redis是发展最快的,而且是我们当下必须要掌握的一个技术!
很多的数据类型用户的个人信息,社交网络,地理位置。这些数据类型的存储不需要一个固定的格式!不需要多月的操作就可以横向扩展的! Map<String,Object>使用键值对来控制! 

>NoSql 特点

解耦!
1、方便扩展(数据之间没有关系,很好扩展!)
2、大数据量高性能(Redis一秒写8万次,读取11万,NoSQL的缓存记录级,是一种细粒度的缓存,性能会比较高!)
3、数据类型是多样型的!(不需要事先设计数据库!随取随用!如果是数据量十分大的表,很多人就无法设计了!) 
4、传统RDBMS和NoSQL
```
传统的RDBMS
-结构化组织
-SQL
-数据和关系都存在单独的表中
-操作操作,数据定义语言
-严格的一致性
-基础的事务
```
```
Nosql
-不仅仅是数据
-没有固定的查询语言
-键值对存储,列存储,文档存储,图形数据库(社交关系)
-最终一致性
-CAP定理和BASE(异地多活)
-高性能,高可用,高可扩 
```
## NoSQL的四大分类
**KV键值对:**
新浪:Redis
美团:Redis+Tair·
阿里、百度:Redis+memecache

**文档型数据库(bson格式和json一样):**
- MongoDB(一般必须要掌握)
	-  MongoDB是一个基于分布式文件存储的数据库,C++编写,主要用来处理大量的文档!
	-  MongoDB是一个介于关系型数据库和非关系型数据中中间的产品!MongoDB是非关系型数据库中功能最丰富,最像关系型数据库的!

- ConthDB

**列存储数据库**
- HBase
- 分布式文件系统

**图关系数据库**

## Redis
>Redis是什么？

Redis(Remote Dictionary Server),即远程字典服务!是一个开源的使用ANSIC语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库,并提供多种语言的API. 

redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件,并且在此基础上实现了master-slave(主从)同步。免费和开源!是当下最热门的NoSQL技术之一!也被人们称之为结构化数据库!

>Redis能干什么？

1、内存存储、持久化,内存中是断电即失、所以说持久化很重要(rdb、aof)
2、效率高,可以用于高速缓存
3、发布订阅系统
4、地图信息分析
5、计时器、计数器(浏览量!) 

>特性

1、多样的数据类型
2、持久化
3、集群
4、事务 

## 安装Redis
移动到opt目录下 `mv redis-6.2.6.tar.gz /opt`
解压文件 `tar -zxvf redis-5.0.8.tar.gz`
安装gcc环境`yum install gcc-c++` gcc -v
redis安装目录下执行`make`命令
二次确认`make install`
Linux默认安装路径`/usr/local/bin`
conf复制到/usr/local/bin/mengxi目录下作为自定义配置 `cp /opt/redis-6.2.6/redis.conf mengxi`
daemonize yes 
注释bind
protected-mode no
以当前目录下配置启动 `redis-server mengxi/redis.conf`
客户端`redis-cli -p 6379` shutdown停止 quit退出