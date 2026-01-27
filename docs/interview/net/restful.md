RESTful API（Representational State Transfer API）是一种基于 HTTP 的网络接口设计风格，广泛用于网络应用之间的交互。REST 本质上是一组架构原则和约束，而不是具体的标准或协议。一个 Web 服务被称为“RESTful”，意味着它遵循 REST 的设计原则，提供高效、可靠且可扩展的网络服务。

RESTful 设计强调无状态通信，每个请求都应包含处理该请求所需的所有信息，服务器不应维护客户端的会话状态。此外，RESTful API 采用分层架构，允许系统的不同部分独立扩展和优化。

#### 1\. URI 设计[](#1-uri-设计)

RESTful API 采用清晰且易读的 URI（统一资源定位符）来表示资源（宾语），而使用 HTTP 方法（如 GET、POST、PUT、DELETE）来表示对资源的操作（动词）。遵循以下最佳实践可以确保 API 的一致性和可维护性。

##### 1.1 HTTP 方法与 CRUD 操作的映射[](#11-http-方法与-crud-操作的映射)

| HTTP 方法 | 操作 | 说明 |
| --- | --- | --- |
| GET | 读取（Read） | 获取资源列表或单个资源 |
| POST | 创建（Create） | 创建新资源 |
| PUT | 更新（Update） | 进行完整的资源更新 |
| PATCH | 部分更新（Update） | 更新资源的部分字段 |
| DELETE | 删除（Delete） | 删除指定的资源 |

**示例**

```text
GET /users           # 获取所有用户
GET /users/123       # 获取 ID 为 123 的用户
POST /users          # 创建新用户
PUT /users/123       # 更新 ID 为 123 的用户信息
PATCH /users/123     # 部分更新用户信息
DELETE /users/123    # 删除 ID 为 123 的用户
```

##### 1.2 URL 设计原则[](#12-url-设计原则)

###### ✅ 使用名词表示资源，而非动词[](#-使用名词表示资源而非动词)

错误示例：

```text
/getAllUsers
/createNewUser
/deleteAllOrders
```

正确示例：

URI 应该专注于资源的表示，而非操作行为。

###### ✅ 使用复数形式表示集合[](#-使用复数形式表示集合)

```text
/users       # 表示所有用户
/users/123   # 表示某个特定用户
```

###### ✅ 使用嵌套关系表示层级[](#-使用嵌套关系表示层级)

```text
/users/123/posts       # 获取用户 123 发表的所有文章
/posts/456/comments    # 获取文章 456 的所有评论
```

###### ✅ 避免过深的 URL 层级[](#-避免过深的-url-层级)

❌ 不推荐：

```text
GET /users/123/orders/456/items/789
```

✅ 推荐：

```text
GET /orders/456/items/789
```

对于复杂的查询，可以使用查询参数：

#### 2\. HTTP 状态码[](#2-http-状态码)

RESTful API 通过 HTTP 状态码指示请求结果，正确使用状态码可以减少客户端的解析成本，提高交互的清晰度。

##### 2.1 常见状态码[](#21-常见状态码)

| 状态码 | 含义 | 适用场景 |
| --- | --- | --- |
| **200 OK** | 请求成功 | 适用于 `GET` 请求 |
| **201 Created** | 资源创建成功 | 适用于 `POST` 请求，响应头应包含 `Location` 指向新资源 |
| **204 No Content** | 操作成功但无返回内容 | 适用于 `PUT`、`PATCH` 或 `DELETE` 请求 |
| **400 Bad Request** | 请求格式错误 | 客户端提交的数据无效 |
| **401 Unauthorized** | 需要身份验证 | 客户端未提供身份凭证或凭证无效 |
| **403 Forbidden** | 权限不足 | 客户端身份验证成功但无权限访问资源 |
| **404 Not Found** | 资源不存在 | 访问了错误的 URL |
| **405 Method Not Allowed** | 请求方法不被允许 | 资源不支持该 HTTP 方法 |
| **409 Conflict** | 资源冲突 | 适用于并发修改的情况 |
| **429 Too Many Requests** | 请求过多 | 触发 API 访问速率限制 |
| **500 Internal Server Error** | 服务器内部错误 | 服务器端出现异常 |

**示例**

```text
HTTP/1.1 201 Created
Location: /users/123
Content-Type: application/json
{
  "id": 123,
  "name": "John Doe"
}
```

#### 3\. 服务器响应格式[](#3-服务器响应格式)

##### 3.1 统一使用 JSON 作为返回格式[](#31-统一使用-json-作为返回格式)

RESTful API 应返回结构化的 JSON 数据，并在响应头中指定：

```text
Content-Type: application/json
```

**示例**

```text
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

##### 3.2 发生错误时返回适当的状态码[](#32-发生错误时返回适当的状态码)

错误信息应提供足够的上下文，帮助客户端理解问题。

❌ 错误示例（不推荐）

```text
HTTP/1.1 200 OK
Content-Type: application/json
{
  "status": "failure",
  "error": "Invalid user ID"
}
```

✅ 推荐：

```text
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Invalid user ID",
  "detail": "User ID must be a positive integer"
}
```

##### 3.3 API 响应应包含链接（HATEOAS）[](#33-api-响应应包含链接hateoas)

在 RESTful 设计中，返回的 JSON 结构可以包含指向相关资源的链接。

**示例**

```text
{
  "id": 123,
  "name": "John Doe",
  "_links": {
    "self": { "href": "/users/123" },
    "orders": { "href": "/users/123/orders" }
  }
}
```

#### 4\. API 设计最佳实践[](#4-api-设计最佳实践)

##### ✅ 4.1 一致性[](#-41-一致性)

所有资源的 URL 结构应保持一致，避免混用不同的风格。例如，不要在同一 API 中既使用 `/user` 又使用 `/users`。

##### ✅ 4.2 采用分页机制[](#-42-采用分页机制)

对于返回大量数据的请求，应提供分页参数：

```text
GET /users?page=2&limit=20
```

标准响应格式：

```text
{
  "total": 100,
  "page": 2,
  "limit": 20,
  "data": [
    { "id": 21, "name": "Alice" },
    { "id": 22, "name": "Bob" }
  ]
}
```

##### ✅ 4.3 允许跨域访问（CORS）[](#-43-允许跨域访问cors)

如果 API 需要支持跨域请求，应在响应头中添加：

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

##### ✅ 4.4 避免暴露敏感信息[](#-44-避免暴露敏感信息)

+ API 响应不应包含数据库 ID 或密码哈希。
+ 仅返回客户端所需的字段，避免返回不必要的数据。

##### ✅ 4.5 采用版本控制[](#-45-采用版本控制)

避免在 URL 级别硬编码版本号，如 `/v1/users`，推荐使用 HTTP 头：

```text
Accept: application/vnd.myapi.v1+json
```

#### 5\. 结论[](#5-结论)

RESTful API 设计强调资源的表述、无状态交互和标准化 HTTP 方法。通过遵循一致的 URL 规则、合理使用状态码、提供结构化的 JSON 响应、优化性能（如分页、缓存）以及实现安全性控制（如身份验证和 CORS），我们可以构建一个高效、易扩展、可维护的 API。

RESTful 设计不仅使 API 更具可读性，也提升了开发和使用的便捷性。良好的 API 设计是构建现代 Web 应用程序的关键。
