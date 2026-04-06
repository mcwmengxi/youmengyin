---
description: Claude Code 插件功能完全指南
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# Claude Code 插件功能完全指南

> 🔌 **插件系统**：扩展 Claude Code 能力，集成第三方工具和服务

---

## 📦 什么是插件？

插件（Plugins）是 Claude Code 的扩展机制，允许你：

- 🔗 连接外部 API 和服务
- 🛠️ 添加自定义工具和命令
- 📊 访问私有数据和资源
- ⚡ 自动化重复性任务
- 🎨 定制个性化工作流

---

## 🚀 快速开始

### 查看已安装插件

```bash
> /plugins
```

这会显示所有可用的插件列表及其状态。

### Plugin配置详解

- Discover: 发现插件，这里是官方推荐的一些好的插件，里边有具体的插件用途和大小。
- Installed: 已经安装的插件列表，你可以在这里管理你的插件。
- Marketplaces : 插件市场，你看到的带“*”的是官方插件市场。
- Errors: 过期的或者有错误的插件会在这里显示。

### 安装插件

>直接用键盘的右键移动选择Marketplaces(插件市场)，如果出现了claude-plugins-official说明你已经有了这个插件仓库列表了，然后我们就可以安装里边的插件了。

#### 方式一：从插件市场安装

```bash
> Install the GitHub plugin
```

#### 方式二：从 URL 安装

```bash
> Install plugin from: https://example.com/my-plugin.json
```

#### 方式三：本地安装

```bash
> Install plugin from ./path/to/plugin.json
```

---

### 插件列表

#### 1.external_plugins 目录插件列表(第三方插件)

| 插件名称      | 核心用途                                                     | 简单用法                                                     |
| :------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| laravel-boost | 为 Laravel（PHP 后端框架）开发提供专属增强能力，如代码生成、框架问题排查 | 向 Claude 发送指令：“用 laravel-boost 插件生成一个用户管理的 Controller”，Claude 调用插件适配 Laravel 语法/规范完成开发 |
| asana         | 对接 Asana（项目管理工具），实现任务查询/创建/更新/删除      | 指令示例：“通过 asana 插件创建一个名为‘需求评审’的任务，负责人为张三，截止日期2024-12-01” |
| greptile      | 对接 Greptile（代码搜索/分析工具），快速检索代码库、分析代码依赖/结构 | 指令示例：“用 greptile 插件搜索我们项目中处理支付逻辑的代码，并分析其调用链路” |
| firebase      | 对接 Firebase（Google 移动端/后端开发平台），操作数据库/存储/云函数等 | 指令示例：“通过 firebase 插件查询我的应用中近7天的用户注册数据，并导出为JSON” |
| discord       | 对接 Discord（社交/社区聊天平台），发送消息/查询频道/管理成员等 | 指令示例：“用 discord 插件给产品讨论频道发送本周迭代计划，并@所有成员” |
| context7      | 对接 Context7（上下文管理工具），扩展 Claude 的上下文处理/检索能力 | 指令示例：“用 context7 插件加载我上周的产品需求文档，并基于文档回答问题” |
| github        | 对接 GitHub（代码仓库平台），操作仓库/PR/Issue/代码检索等    | 指令示例：“通过 github 插件查看我的项目中#123号PR的代码改动，并给出评审意见” |
| gitlab        | 对接 GitLab（代码仓库/DevOps 平台），功能同 GitHub 插件（适配 GitLab 生态） | 指令示例：“用 gitlab 插件触发我的项目dev分支的CI/CD流水线，并查看运行状态” |
| imessage      | 对接苹果 iMessage 消息系统，发送/查询iMessage消息（适配苹果生态） | 指令示例：“用 imessage 插件给手机号138xxxx1234发送‘会议推迟1小时’的消息” |
| fakechat      | 模拟聊天场景（测试/演示用），生成虚拟聊天记录/模拟对话交互   | 指令示例：“用 fakechat 插件模拟客服与用户的对话，主题是‘退款申请’” |
| linear        | 对接 Linear（项目管理/工单工具），创建/查询/更新Linear工单/任务 | 指令示例：“通过 linear 插件创建一个bug工单，标题为‘支付按钮点击无响应’，优先级高” |
| supabase      | 对接 Supabase（开源Firebase替代方案），操作数据库/认证/存储等 | 指令示例：“用 supabase 插件给用户表添加‘会员等级’字段，并插入10条测试数据” |
| serena        | 对接 Serena（自动化/运维工具），执行运维指令/查询系统状态    | 指令示例：“通过 serena 插件查看服务器CPU使用率，并重启异常的应用服务” |
| playwright    | 对接 Playwright（前端自动化测试工具），生成/执行UI自动化测试脚本 | 指令示例：“用 playwright 插件生成登录页面的自动化测试脚本，并执行验证是否正常” |
| slack         | 对接 Slack（企业协作工具），发送消息/查询频道/管理工作流等   | 指令示例：“用 slack 插件给研发群发送‘接口文档已更新’的消息，并附上文档链接” |
| telegram      | 对接 Telegram（即时通讯工具），发送消息/管理机器人/查询聊天记录 | 指令示例：“通过 telegram 插件给我的机器人发送‘获取今日用户反馈’指令，并返回结果” |

#### 2、plugins 目录插件列表（官方插件）

| 插件名称                 | 核心用途                                                     | 简单用法                                                     |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| explanatory-output-style | 定制 Claude 回答的输出风格（解释型），让回答更详细、带逻辑拆解/步骤说明 | 指令示例：“启用 explanatory-output-style 插件，解释‘快速排序’的原理，要求分步骤说明” |
| claude-code-setup        | 快速配置 Claude 代码开发环境，适配不同语言/框架的代码编写规范 | 指令示例：“用 claude-code-setup 插件配置Python+Django的开发环境，生成基础项目结构” |
| csharp-lsp               | 集成 C# 语言服务器（LSP），增强C#代码的补全/诊断/重构能力    | 指令示例：“启用 csharp-lsp 插件，检查我这段C#代码的语法错误，并给出优化建议” |
| clangd-lsp               | 集成 Clangd（C/C++ LSP），增强C/C++代码分析/补全/调试能力    | 指令示例：“用 clangd-lsp 插件分析这段C++代码的内存泄漏风险，并给出修复方案” |
| agent-sdk-dev            | 基于 Claude Agent SDK 开发定制化智能代理，扩展自动化交互能力 | 指令示例：“用 agent-sdk-dev 插件开发一个自动回复用户问题的代理，触发词为‘产品咨询’” |
| example-plugin           | 插件开发示例模板，用于学习/参考如何开发自定义Claude插件      | 指令示例：“参考 example-plugin 插件的结构，帮我写一个简单的‘天气查询’插件骨架” |
| code-simplifier          | 简化复杂代码，保留核心逻辑，提升代码可读性/维护性            | 指令示例：“用 code-simplifier 插件简化这段Python爬虫代码，去掉冗余逻辑” |
| commit-commands          | 自动生成规范的Git Commit信息，适配Conventional Commits规范   | 指令示例：“用 commit-commands 插件根据我这次的代码改动（修复登录bug）生成Commit信息” |
| jdtls-lsp                | 集成 JDTLS（Java LSP），增强Java代码补全/诊断/重构能力       | 指令示例：“启用 jdtls-lsp 插件，重构这段Java代码的类结构，提升耦合度” |
| math-olympiad            | 针对奥数/复杂数学问题的解题增强，提供解题思路/步骤/公式推导  | 指令示例：“用 math-olympiad 插件解答这道奥数几何题，给出详细的推导步骤” |
| lua-lsp                  | 集成 Lua 语言服务器，增强Lua代码分析/补全/调试能力           | 指令示例：“用 lua-lsp 插件检查这段Lua脚本的语法错误，并优化性能” |
| kotlin-lsp               | 集成 Kotlin LSP，增强Kotlin代码补全/诊断/重构能力            | 指令示例：“启用 kotlin-lsp 插件，优化这段Android Kotlin代码的空指针处理” |
| frontend-design          | 前端设计辅助，生成UI组件/样式/交互逻辑，适配主流框架（React/Vue） | 指令示例：“用 frontend-design 插件生成一个Vue3的登录表单组件，包含校验逻辑” |
| mcp-server-dev           | 开发 MCP（Model Context Protocol）服务器，适配Claude插件交互协议 | 指令示例：“用 mcp-server-dev 插件搭建一个本地MCP服务器，测试我的自定义插件” |
| feature-dev              | 辅助功能开发全流程，从需求拆解→代码编写→测试用例生成         | 指令示例：“用 feature-dev 插件拆解‘用户头像上传’功能，生成开发步骤和测试用例” |
| hookify                  | 为Claude添加自定义钩子函数，触发特定操作（如指令过滤/结果处理） | 指令示例：“用 hookify 插件添加一个钩子，当检测到‘敏感词’时自动过滤回答内容” |
| learning-output-style    | 定制 Claude 回答的输出风格（学习型），适配学习场景（如知识点拆解/习题） | 指令示例：“启用 learning-output-style 插件，讲解‘HTTP状态码’，适配新手学习节奏” |
| gopls-lsp                | 集成 gopls（Go LSP），增强Go代码补全/诊断/重构能力           | 指令示例：“用 gopls-lsp 插件优化这段Go代码的并发逻辑，提升性能” |
| php-lsp                  | 集成 PHP LSP，增强PHP代码分析/补全/调试能力                  | 指令示例：“启用 php-lsp 插件，检查这段PHP接口代码的安全漏洞（如SQL注入）” |
| rust-analyzer-lsp        | 集成 rust-analyzer（Rust LSP），增强Rust代码分析/补全/调试能力 | 指令示例：“用 rust-analyzer-lsp 插件修复这段Rust代码的所有权问题” |
| ruby-lsp                 | 集成 Ruby LSP，增强Ruby代码补全/诊断/重构能力                | 指令示例：“启用 ruby-lsp 插件，重构这段Ruby on Rails代码的控制器逻辑” |
| plugin-dev               | 插件开发辅助工具，包含调试/测试/打包/发布流程支持            | 指令示例：“用 plugin-dev 插件调试我写的‘股票查询’插件，检查接口调用是否正常” |
| pyright-lsp              | 集成 Pyright（Python LSP），增强Python代码类型检查/补全/重构能力 | 指令示例：“用 pyright-lsp 插件检查这段Python代码的类型错误，并给出类型注解建议” |
| security-guidance        | 代码安全审计辅助，识别安全漏洞（如XSS/CSRF/越权）并给出修复建议 | 指令示例：“用 security-guidance 插件审计这段前端代码，检查是否有XSS漏洞” |
| pr-review-toolkit        | PR（Pull Request）评审辅助，自动分析代码改动、识别问题、生成评审意见 | 指令示例：“用 pr-review-toolkit 插件评审这个Python项目的#45号PR，列出需要修改的点” |
| skill-creator            | 自定义Claude技能生成工具，封装重复指令为可复用技能           | 指令示例：“用 skill-creator 插件创建一个‘每周周报生成’技能，触发后自动整理本周工作” |
| playground               | Claude 插件测试沙箱，用于快速验证自定义插件的功能/交互       | 指令示例：“在 playground 插件中测试我的‘翻译’插件，输入‘Hello’验证是否返回‘你好’” |
| ralph-loop               | 循环任务/流程自动化辅助，实现多步骤指令的循环执行/条件判断   | 指令示例：“用 ralph-loop 插件循环查询10个用户ID的订单数据，直到全部查询完成” |
| swift-lsp                | 集成 Swift LSP，增强Swift代码补全/诊断/重构能力（适配iOS/macOS开发） | 指令示例：“启用 swift-lsp 插件，优化这段iOS Swift代码的UI布局逻辑” |
| typescript-lsp           | 集成 TypeScript LSP，增强TS/JS代码类型检查/补全/重构能力     | 指令示例：“用 typescript-lsp 插件给这段React TS代码添加完整的类型注解” |

**补充说明**

1. 所有插件的核心调用逻辑：向 Claude 发送指令时明确指定“启用XX插件”+ 具体任务，Claude 会加载对应插件的能力完成交互；
2. external_plugins 需先配置对应外部服务的授权（如 API Key/Token）才能使用，plugins 多为内置能力，无需额外授权即可启用；
3. .mcp.json 是插件与 Claude 交互的核心配置文件，定义了插件的接口、参数、返回格式等协议规范。

## 🔧 内置插件类型

### 1. GitHub 插件

**功能：**

- 查看 Pull Requests 和 Issues
- 审查代码改动
- 管理 Projects 和 Milestones
- 检查 CI/CD 状态

**配置：**

```json
{
  "name": "github",
  "provider": "anthropic",
  "config": {
    "token": "ghp_xxx",
    "defaultRepo": "username/repo"
  }
}
```

**使用示例：**

```bash
# 查看 PRs
> Show me open PRs in the main repository

# 审查代码
> Review the changes in PR #123
> Check for security issues and suggest improvements

# 检查 Issue
> What's the status of issue #456?
> Summarize the discussion

# 查看 CI 状态
> Is the CI pipeline passing for PR #123?
> Show me failed tests
```

---

### 2. Google Drive 插件

**功能：**

- 读取和搜索文档
- 创建和更新文件
- 共享和权限管理
- 版本历史查看

**配置：**

```json
{
  "name": "google-drive",
  "provider": "google",
  "config": {
    "credentials": "~/.claude/google-credentials.json",
    "defaultFolder": "Project Docs"
  }
}
```

**使用示例：**

```bash
# 搜索文档
> Find all documents about "API design" in my Google Drive

# 读取内容
> Load the requirements document from the "Projects/Q1" folder

# 创建文档
> Create a new document with the meeting notes from today

# 更新内容
> Update the project timeline in "Plan.docx" with these dates
```

---

### 3. Jira 插件

**功能：**

- 查看和更新 Issues
- 创建和分配任务
- 查看 Sprint 进度
- 生成报告

**配置：**

```json
{
  "name": "jira",
  "provider": "atlassian",
  "config": {
    "apiToken": "your-api-token",
    "baseUrl": "https://your-company.atlassian.net",
    "defaultProject": "PROJ"
  }
}
```

**使用示例：**

```bash
# 查看 Issue
> Get details for PROJ-123
> Show me the description and comments

# 更新状态
> Move PROJ-123 to "In Progress"
> Assign PROJ-456 to john@example.com

# 创建 Issue
> Create a new bug report:
> Title: "Login fails with special characters"
> Description: "Users cannot login with email containing..."
> Priority: High

# Sprint 管理
> What's in the current sprint?
> Show me burn-down chart data
> List overdue tasks
```

---

### 4. Slack 插件

**功能：**

- 发送和读取消息
- 管理频道和对话
- 搜索历史记录
- 设置提醒和通知

**配置：**

```json
{
  "name": "slack",
  "provider": "slack",
  "config": {
    "botToken": "xoxb-your-bot-token",
    "teamId": "T01234567"
  }
}
```

**使用示例：**

```bash
# 发送消息
> Post "Deployment completed successfully!" to #devops

# 读取消息
> Show me unread messages in #project-alpha
> Get the latest discussion about "database migration"

# 搜索历史
> Search for messages from @john about "API changes"
> Find all links shared in #general this week

# 发送 DM
> Send a DM to @jane: "Can you review PR #123?"
```

---

### 5. Database 插件

**功能：**

- 执行 SQL 查询
- 查看表结构和数据
- 运行迁移脚本
- 导出数据

**配置：**

```json
{
  "name": "postgres",
  "provider": "database",
  "config": {
    "host": "localhost",
    "port": 5432,
    "database": "myapp",
    "user": "developer",
    "password": "${DB_PASSWORD}"
  }
}
```

**使用示例：**

```bash
# 查询数据
> Run: SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'

# 查看结构
> Show me the schema for the users table

# 数据分析
> How many orders were placed last month?
> What's the average order value by category?

# 数据导出
> Export all customer emails to CSV
```

---

### 6. Browser 插件

**功能：**

- 浏览网页内容
- 截图和录制
- 测试网页功能
- 抓取公开数据

**配置：**

```json
{
  "name": "browser",
  "provider": "puppeteer",
  "config": {
    "headless": true,
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

**使用示例：**

```bash
# 浏览网页
> Open https://example.com and summarize the content

# 截图
> Take a screenshot of the homepage

# 功能测试
> Click the login button and check if the form appears

# 数据抓取
> Extract all product prices from this page
```

---

## 🔨 创建自定义插件

### 插件结构

一个完整的插件包含以下文件：

```
my-plugin/
├── manifest.json          # 插件描述文件
├── index.js              # 主入口文件
├── README.md             # 使用说明
└── package.json          # 依赖配置
```

### manifest.json

```json
{
  "$schema": "https://claude.ai/schemas/plugin-manifest-v1.json",
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "description": "A custom plugin for internal tools",
  "author": "Your Name <your.email@example.com>",
  "main": "index.js",
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "capabilities": {
    "tools": [
      {
        "name": "get_user_info",
        "description": "Get user information from internal database",
        "parameters": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "The user ID to look up"
            }
          },
          "required": ["userId"]
        }
      },
      {
        "name": "create_report",
        "description": "Generate a report based on provided data",
        "parameters": {
          "type": "object",
          "properties": {
            "reportType": {
              "type": "string",
              "enum": ["daily", "weekly", "monthly"]
            },
            "startDate": {
              "type": "string",
              "format": "date"
            },
            "endDate": {
              "type": "string",
              "format": "date"
            }
          },
          "required": ["reportType", "startDate", "endDate"]
        }
      }
    ],
    "resources": [
      {
        "type": "file",
        "path": "/reports/*"
      }
    ]
  },
  "permissions": [
    "network:outbound",
    "filesystem:read"
  ],
  "configuration": {
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string",
        "description": "API key for authentication"
      },
      "baseUrl": {
        "type": "string",
        "description": "Base URL for the API"
      }
    }
  }
}
```

### index.js 实现

```javascript
// index.js
module.exports = {
  activate(context) {
    console.log('My Custom Plugin activated!');
    
    // 注册工具
    context.registerTool({
      name: 'get_user_info',
      handler: async (params) => {
        const { userId } = params;
        
        try {
          // 调用内部 API
          const response = await fetch(`${context.config.baseUrl}/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${context.config.apiKey}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`User not found: ${userId}`);
          }
          
          const userData = await response.json();
          
          return {
            success: true,
            data: userData,
            message: `Successfully retrieved user info for ${userId}`
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    });
    
    // 注册第二个工具
    context.registerTool({
      name: 'create_report',
      handler: async (params) => {
        const { reportType, startDate, endDate } = params;
        
        // 生成报告逻辑
        const report = await generateReport(reportType, startDate, endDate);
        
        // 保存到文件系统
        const filePath = `/reports/${reportType}-${Date.now()}.md`;
        await context.fs.writeFile(filePath, report.content);
        
        return {
          success: true,
          data: { filePath, summary: report.summary },
          message: `Report generated successfully: ${filePath}`
        };
      }
    });
  },
  
  deactivate() {
    console.log('My Custom Plugin deactivated');
  }
};

async function generateReport(type, start, end) {
  // 报告生成逻辑
  return {
    content: `# ${type} Report\n\nGenerated on ${new Date().toISOString()}`,
    summary: `Report covers period from ${start} to ${end}`
  };
}
```

### package.json

```json
{
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "description": "A custom plugin for internal tools",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "build": "echo 'No build step required'",
    "lint": "eslint ."
  },
  "keywords": [
    "claude-code",
    "plugin",
    "custom"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "node-fetch": "^2.6.9"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "jest": "^29.0.0"
  }
}
```

---

## 📋 插件开发最佳实践

### 1. 错误处理

```javascript
context.registerTool({
  name: 'safe_operation',
  handler: async (params) => {
    try {
      // 验证输入
      if (!params.requiredField) {
        return {
          success: false,
          error: 'Missing required field: requiredField'
        };
      }
      
      // 执行操作
      const result = await performOperation(params);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      // 记录错误日志
      console.error('Operation failed:', error);
      
      return {
        success: false,
        error: error.message,
        suggestion: 'Please check your input and try again'
      };
    }
  }
});
```

### 2. 安全性

```javascript
// ✅ 好的做法：使用环境变量
const apiKey = process.env.API_KEY || context.config.apiKey;

// ❌ 坏的做法：硬编码密钥
const apiKey = 'sk-1234567890'; // 绝对不要这样做！

// 验证用户权限
if (!context.user.hasPermission('read:data')) {
  return {
    success: false,
    error: 'Insufficient permissions'
  };
}

// 清理输入
const sanitizedInput = sanitize(params.userInput);
```

### 3. 性能优化

```javascript
// 使用缓存
const cache = new Map();

context.registerTool({
  name: 'cached_operation',
  handler: async (params) => {
    const cacheKey = JSON.stringify(params);
    
    // 检查缓存
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.result;
      }
    }
    
    // 执行实际操作
    const result = await expensiveOperation(params);
    
    // 更新缓存
    cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });
    
    return result;
  }
});
```

### 4. 日志记录

```javascript
context.registerTool({
  name: 'logged_operation',
  handler: async (params) => {
    console.log(`[MyPlugin] Starting operation with params:`, params);
    
    const startTime = Date.now();
    
    try {
      const result = await performOperation(params);
      
      const duration = Date.now() - startTime;
      console.log(`[MyPlugin] Operation completed in ${duration}ms`);
      
      return { success: true, data: result };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[MyPlugin] Operation failed after ${duration}ms:`, error);
      
      return { success: false, error: error.message };
    }
  }
});
```

---

## 🔍 调试插件

### 启用插件调试模式

```bash
claude --debug "plugins" "use my-plugin to do something"
```

### 查看插件日志

```bash
# 实时查看日志
tail -f ~/.claude/logs/plugins.log

# 过滤特定插件日志
grep "my-plugin" ~/.claude/logs/plugins.log
```

### 测试插件

创建测试文件 `test/plugin.test.js`：

```javascript
const { createMockContext } = require('@claude-code/plugin-test-utils');

describe('MyPlugin', () => {
  let context;
  let plugin;
  
  beforeEach(() => {
    context = createMockContext({
      config: {
        apiKey: 'test-key',
        baseUrl: 'http://test.example.com'
      }
    });
    plugin = require('../index');
  });
  
  test('should activate without errors', () => {
    expect(() => plugin.activate(context)).not.toThrow();
  });
  
  test('should register get_user_info tool', async () => {
    plugin.activate(context);
    
    const tool = context.getRegisteredTool('get_user_info');
    expect(tool).toBeDefined();
    
    const result = await tool.handler({ userId: '123' });
    expect(result.success).toBe(true);
  });
});
```

---

## 📦 发布插件

### 准备工作

1. **完善文档**
   - 编写详细的 README.md
   - 提供使用示例
   - 说明配置要求

2. **代码质量**
   - 通过 ESLint 检查
   - 单元测试覆盖率 >80%
   - 无安全漏洞

3. **版本管理**
   - 遵循语义化版本（SemVer）
   - 更新 CHANGELOG.md
   - 打 Git 标签

### 发布到插件市场

```bash
# 登录
npx @claude-code/plugin-cli login

# 验证插件
npx @claude-code/plugin-cli validate

# 发布
npx @claude-code/plugin-cli publish

# 查看发布状态
npx @claude-code/plugin-cli info my-plugin
```

### 私有插件分发

```bash
# 打包
npm pack

# 发布到私有 npm 仓库
npm publish --registry https://private-npm.company.com

# 或直接分享 tarball
cp my-plugin-1.0.0.tgz ~/shared-plugins/
```

---

## 🎯 实用插件推荐

### 开发效率类

| 插件名称 | 功能 | 安装方式 |
|---------|------|---------|
| `git-helper` | Git 操作自动化 | `claude install git-helper` |
| `docker-manager` | Docker 容器管理 | `claude install docker-manager` |
| `api-tester` | API 接口测试 | `claude install api-tester` |
| `log-analyzer` | 日志分析工具 | `claude install log-analyzer` |

### 项目管理类

| 插件名称 | 功能 | 安装方式 |
|---------|------|---------|
| `jira-assistant` | Jira 任务管理 | `claude install jira-assistant` |
| `time-tracker` | 时间跟踪统计 | `claude install time-tracker` |
| `meeting-notes` | 会议纪要生成 | `claude install meeting-notes` |

### 代码质量类

| 插件名称 | 功能 | 安装方式 |
|---------|------|---------|
| `security-scanner` | 安全漏洞扫描 | `claude install security-scanner` |
| `performance-profiler` | 性能分析 | `claude install performance-profiler` |
| `coverage-reporter` | 测试覆盖报告 | `claude install coverage-reporter` |

---

## 💡 插件使用技巧

### 1. 组合使用多个插件

```bash
# GitHub + Slack 联动
> Check if there are any critical PRs waiting for review
> If yes, post a notification to #code-review channel

# Jira + GitHub 联动
> Link issue PROJ-123 to the related PR
> Update Jira status when PR is merged

# Database + Report 联动
> Query last month's sales data
> Generate a summary report and save to Google Drive
```

### 2. 自动化工作流

```bash
# 每日站会自动化
> Every morning at 9 AM:
> 1. Check Jira for completed tasks
> 2. Review GitHub PRs from yesterday
> 3. Summarize progress
> 4. Post update to Slack #daily-updates
```

### 3. 条件触发

```bash
> When a new high-priority issue is created in Jira:
> - Notify the team lead on Slack
> - Create a branch in GitHub
> - Schedule a review meeting
```

---

## 🐛 常见问题

### Q1: 插件加载失败

**症状：**

```
Error: Failed to load plugin "my-plugin"
```

**解决方案：**

1. 检查 `manifest.json` 格式是否正确
2. 确认 `index.js` 路径正确
3. 查看错误日志获取详细信息
4. 验证依赖是否已安装

### Q2: 插件无法连接外部服务

**症状：**

```
Network error: Connection refused
```

**解决方案：**

1. 检查网络连接
2. 验证 API 密钥是否正确
3. 确认防火墙规则允许访问
4. 检查服务端点 URL

### Q3: 插件权限不足

**症状：**

```
Permission denied: Cannot access resource
```

**解决方案：**

1. 在 `manifest.json` 中申请所需权限
2. 检查用户是否有足够权限
3. 验证配置文件中的凭据

### Q4: 插件响应慢

**症状：**

```
Timeout: Plugin took too long to respond
```

**解决方案：**

1. 优化插件代码性能
2. 实现缓存机制
3. 使用异步操作
4. 增加超时时间配置

---

## 📚 学习资源

### 官方文档

- [Claude Code 插件开发指南](https://code.claude.com/docs/plugins)
- [插件 Manifest 规范](https://code.claude.com/docs/plugins/manifest)
- [插件 API 参考](https://code.claude.com/docs/plugins/api)

### 示例代码

- [官方插件示例仓库](https://github.com/anthropics/claude-code-plugin-examples)
- [社区插件集合](https://github.com/topics/claude-code-plugin)

### 工具链

- [插件开发 CLI](https://www.npmjs.com/package/@claude-code/plugin-cli)
- [插件测试工具](https://www.npmjs.com/package/@claude-code/plugin-test-utils)

---

## ✅ 实践任务

### 任务 1：安装和使用插件

- [ ] 安装 GitHub 插件
- [ ] 安装一个数据库插件
- [ ] 完成至少 3 个实际任务
- [ ] 记录使用体验

### 任务 2：创建简单插件

- [ ] 设计一个工具插件
- [ ] 编写 manifest.json
- [ ] 实现至少 2 个工具
- [ ] 本地测试通过

### 任务 3：发布插件

- [ ] 完善文档和示例
- [ ] 编写单元测试
- [ ] 发布到插件市场或私有仓库
- [ ] 收集用户反馈

---

## 🎯 技能检查清单

### 基础能力

- [ ] 能安装和配置插件
- [ ] 会使用常用插件
- [ ] 能排查插件问题
- [ ] 了解插件安全注意事项

### 进阶能力

- [ ] 能创建自定义插件
- [ ] 掌握插件开发最佳实践
- [ ] 会调试和测试插件
- [ ] 能优化插件性能

### 专家能力

- [ ] 能设计复杂插件架构
- [ ] 会发布和维护插件
- [ ] 能培训他人使用插件
- [ ] 为社区贡献插件

---

> 💡 **小贴士**：插件是扩展 Claude Code 能力的利器，但要注意安全性和性能影响。只安装可信来源的插件，并定期审查已安装插件的权限！

[← 返回高级特性](./phase4-expert.md) | [↩️ 返回学习路径](./learning-path.md) | [📚 技能库 →](./skills.md)
