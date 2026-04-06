---
description: Claude Code 高级特性 - 子代理、MCP 与调试技巧
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# 第四阶段：高级特性（2-3 周）

> 🎯 **学习目标**：掌握 Subagents 子代理系统，学会 MCP 协议集成，精通高级调试技巧，灵活运用多模型策略

---

## 4.1 Subagents（子代理）深度使用 🤖

### 什么是 Subagents？

Subagents 是 Claude Code 的专用代理系统，允许你调用在特定领域有专长的子代理来处理任务。

**核心优势：**

- 🎯 **专业化** - 每个子代理在特定领域有深度知识
- ⚡ **高效性** - 针对性更强，响应更精准
- 🔧 **可定制** - 可以创建符合团队需求的子代理
- 📦 **可复用** - 优秀的子代理可以在团队间共享

---

### 四种适合子代理的任务

- 高噪声输出任务，这类任务的特点是：执行过程中会产生大量中间信息，但主对话真正关心的，只是一个结论。例如跑测试，一次测试会输出几百行日志，而我们关心的只是这次测试是否跑成功了。

- 角色边界非常明确的任务，有些事情，你只希望Claude “看”，而不希望它“做”;有些操作，只能在特定目录、特定范围内发生； 这些就需要用子代理。比如分析项目需要优化的地方，但不做修改，让子代理给你持续的修改建议。

- 可以并行展开的研究型任务，当你需要同时执行数据库设计、API接口、修改前端UI和后端业务逻辑代码，这些任务往往是互相独立的。与其在主对话里来回切换，可以让多个子代理各自完成自己的任务，再把结果汇总回来。这时候子代理的价值不只是隔离上下文，更是天然的并行加速器。

- 可以拆成清晰阶段的流水线任务，比如先定位代码位置，再做代码审查，然后进行修改，最后跑测试验证。用子代理可以把每一段责任固定下来，让流畅更清晰，也让每一步上下文更加干净。这不是为了复杂化流程，而是为了避免不同阶段的信息互相污染。

### 查看可用子代理

```bash
> /agents
```

这会显示所有可用的子代理列表，通常包括：

#### 内置子代理类型

| 子代理 | 专长领域 | 典型用途 |
|--------|---------|---------|
| `code-reviewer` | 代码审查 | 发现 Bug、代码异味、安全漏洞 |
| `test-writer` | 测试编写 | 单元测试、集成测试、E2E 测试 |
| `security-auditor` | 安全审计 | OWASP Top 10、渗透测试、合规检查 |
| `performance-optimizer` | 性能优化 | 瓶颈分析、算法优化、资源管理 |
| `documentation-writer` | 文档编写 | API 文档、README、技术文档 |
| `refactoring-specialist` | 重构专家 | 设计模式应用、代码质量提升 |
| `debugging-expert` | 调试专家 | 复杂 Bug 定位、根因分析 |

---

### 使用子代理

#### 基础用法

```bash
# 直接调用
> use the code-reviewer subagent to check the authentication module

# 指定任务
> use the test-writer subagent to create tests for payment service

# 专项审查
> use the security-auditor subagent to audit for SQL injection vulnerabilities
```

#### 组合使用

```bash
# 先审查后修复
> use the code-reviewer to identify issues
> use the refactoring-specialist to fix them
> use the test-writer to add regression tests

# 性能优化流程
> use the performance-optimizer to find bottlenecks
> implement the optimizations
> use the test-writer to verify no functionality broke
```

---

### 创建自定义子代理

```sh
your-project/
└── .claude/
    └── agents/
        └── code-reviewer.md
```

#### 方式一：通过对话创建

```bash
> /agents
# 选择 "Create New subagent"

# 然后定义：
Name: api-design-expert
Description: Specialized in RESTful API design and best practices
Expertise:
  - REST API design principles
  - GraphQL schema design
  - API versioning strategies
  - OpenAPI/Swagger specification
  - Rate limiting and throttling
  - Authentication patterns (OAuth2, JWT)

Instructions:
  - Always check for RESTful constraints
  - Suggest appropriate HTTP methods
  - Recommend proper status codes
  - Ensure consistent naming conventions
  - Consider pagination, filtering, sorting
  - Address security concerns upfront
```

#### 方式二：配置文件创建

在项目目录创建 `.claude/agents/api-design-expert.md`：

```sh
# Agent: API Design Expert

## Role
You are an experienced API architect specializing in RESTful and GraphQL API design.

## Expertise Areas
1. REST API Design
   - Resource modeling
   - HTTP method selection
   - Status code usage
   - HATEOAS implementation

2. API Security
   - Authentication (OAuth2, JWT, API Keys)
   - Authorization (RBAC, ABAC)
   - Rate limiting
   - Input validation

3. API Documentation
   - OpenAPI/Swagger
   - GraphQL schema documentation
   - Example requests/responses

4. Performance
   - Caching strategies
   - Pagination
   - Field selection
   - Batch operations

## Response Guidelines
- Always provide concrete examples
- Reference industry standards (RFC 7231, etc.)
- Consider backward compatibility
- Suggest monitoring and logging strategies
- Address versioning from the start

## Common Checklists

### REST API Review Checklist
- [ ] Resources are nouns
- [ ] Using plural nouns for endpoints
- [ ] Appropriate HTTP methods
- [ ] Correct status codes
- [ ] Proper error handling
- [ ] Versioning strategy
- [ ] Documentation complete

### Security Checklist
- [ ] Authentication required
- [ ] Authorization checks
- [ ] Input validation
- [ ] Rate limiting
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted
```

```sh
---
name: code-reviewer
description: Review code for security issues and best practices. Use after code changes.
tools: Read, Grep, Glob
model: qwen3.5-plus
---
你是一个代码审查专家。

当被调用时：
1. 首先理解代码变更的范围
2. 检查安全问题
3. 检查代码规范
4. 提供改进建议


输出格式：
## 审查结果
- 安全问题：[列表]
- 规范问题：[列表]
- 建议：[列表]
```

---

### 实战场景：代码审查工作流

```bash
# Step 1: 初步审查
> use the code-reviewer subagent to analyze the user registration flow

# Step 2: 安全专项
> use the security-auditor to check for:
> - Password storage security
> - Input validation
> - SQL injection prevention
> - XSS protection

# Step 3: 性能评估
> use the performance-optimizer to evaluate:
> - Database query efficiency
> - Email sending async handling
> - Caching opportunities

# Step 4: 测试覆盖
> use the test-writer to create comprehensive tests covering:
> - Happy path registration
> - Duplicate email handling
> - Invalid input scenarios
> - Security edge cases

# Step 5: 文档完善
> use the documentation-writer to create:
> - API documentation
> - Usage examples
> - Error code reference
```

---

## 4.2 MCP（Model Context Protocol）集成 🔌

### 什么是 MCP？

MCP 是 Model Context Protocol 的缩写，是一种用于连接 AI 模型与外部数据源和工具的协议。

**核心价值：**
- 🔗 **连接能力** - 连接到各种外部服务
- 📊 **数据访问** - 实时获取业务数据
- 🛠️ **工具集成** - 使用第三方工具
- 🔄 **双向交互** - 读取和写入数据

> 💡 **提示**：MCP 是插件的一种形式。想了解如何创建自定义插件？查看 [🔌 插件功能完全指南](./plugins.md)

---

### 配置 MCP

#### 启动配置向导

```bash
claude mcp
```

这会启动交互式配置向导。

#### 手动配置文件

在 `~/.claude/mcp.json` 或项目级的 `.claude/mcp.json` 中配置：

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-drive"],
      "env": {
        "GOOGLE_DRIVE_API_KEY": "your-api-key"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_API_TOKEN": "your-jira-token",
        "JIRA_BASE_URL": "https://your-company.atlassian.net"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "options": {
        "allowedDirectories": ["/path/to/project"]
      }
    }
  }
}
```

---

### 常见 MCP 服务器

#### 1. Google Drive 集成

**安装：**

```bash
npm install -g @modelcontextprotocol/server-google-drive
```

**配置：**

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "xxx",
        "GOOGLE_CLIENT_SECRET": "xxx",
        "GOOGLE_REFRESH_TOKEN": "xxx"
      }
    }
  }
}
```

**使用示例：**

```bash
> Load the API design document from my Google Drive folder "Project Docs"
> Find all documents related to "authentication flow"
> Create a new document with the meeting notes
```

---

#### 2. GitHub 集成

**安装：**

```bash
npm install -g @modelcontextprotocol/server-github
```

**配置：**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

**使用示例：**

```bash
> List open pull requests in repository youmengyin/blog
> Create a PR from branch feature/auth to main
> Add a comment to issue #123
> Show me recent commits to the main branch
> Check CI/CD status for PR #456
```

---

#### 3. Jira 集成

**安装：**

```bash
npm install -g @modelcontextprotocol/server-jira
```

**配置：**

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_API_TOKEN": "xxx",
        "JIRA_BASE_URL": "https://your-company.atlassian.net"
      }
    }
  }
}
```

**使用示例：**

```bash
> Fetch requirements from Jira project YOU-123
> Update the status of YOU-456 to "In Progress"
> List all blockers in the current sprint
> Create a subtask for technical debt
```

---

#### 4. Slack 集成

**安装：**

```bash
npm install -g @modelcontextprotocol/server-slack
```

**配置：**

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-xxx",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

**使用示例：**

```bash
> Post the deployment status to #devops channel
> List unread messages in #project-alpha
> Send a DM to @john about the code review
> Search for messages about "database migration"
```

---

#### 5. 文件系统集成

**安装：**

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**配置：**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

**使用示例：**

```bash
> Read the configuration from ./config/app.json
> Watch for changes in the logs directory
> Create a backup of all .md files
> Find all TODO comments in source files
```

---

### 自定义 MCP 服务器

你可以创建自己的 MCP 服务器来集成内部工具。

#### 示例：公司内部 API 集成

创建 `mcp-server-internal/index.js`：

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'internal-api-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_user_info',
        description: 'Get user information from internal database',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'create_project',
        description: 'Create a new project in the system',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            ownerId: { type: 'string' },
          },
          required: ['name', 'ownerId'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_user_info') {
    // Call internal API
    const response = await fetch(`https://api.internal/users/${args.userId}`);
    const data = await response.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  if (name === 'create_project') {
    const response = await fetch('https://api.internal/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

---

## 4.3 高级调试技巧 🐛

### 启用调试模式

#### 基础调试

```bash
claude --debug "api" "your question"
```

#### 多类别调试

```bash
claude --debug "api,mcp,tools" "your question"
```

#### 排除某些类别

```bash
claude --debug "!statsig,!file" "your question"
```

---

### 调试类别说明

| 类别 | 说明 | 使用场景 |
|------|------|---------|
| `api` | API 请求/响应 | 排查通信问题、查看 Token 使用 |
| `mcp` | MCP 协议交互 | 调试外部工具集成 |
| `tools` | 工具调用 | 查看工具执行详情 |
| `file` | 文件操作 | 追踪文件读写 |
| `statsig` | 功能标记 | 调试 A/B 测试相关 |
| `all` | 全部日志 | 完整调试信息 |

---

### 实战：API 问题排查

#### 问题：Claude 无法访问 API

```bash
# Step 1: 启用 API 调试
claude --debug "api" "test connection"

# Step 2: 查看输出
# 检查：
# - Base URL 是否正确
# - Authentication header 是否存在
# - Response status code
# - Error message 详情

# Step 3: 验证配置
cat ~/.claude/settings.json

# Step 4: 测试连接
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api-base-url/v1/chat/completions
```

---

### 实战：MCP 集成问题

#### 问题：GitHub 集成不工作

```bash
# Step 1: 检查 MCP 配置
cat ~/.claude/mcp.json

# Step 2: 启用 MCP 调试
claude --debug "mcp" "list my GitHub repos"

# Step 3: 验证 Token
# 在 GitHub 设置中检查 Token 权限：
# - repo (Full control of private repositories)
# - user (Read user profile)

# Step 4: 测试 MCP 服务器
npx -y @modelcontextprotocol/server-github
# 应该能看到可用的工具列表

# Step 5: 查看详细错误
claude --debug "mcp,tools" "show github repos"
```

---

### 性能调试

#### 查看 API 延迟

```bash
claude --debug "api" "complex analysis task"
```

在输出中查找：

```
[API] Request sent: {...}
[API] Response received: {...}
[API] Latency: 1234ms
[API] Tokens used: prompt=500, completion=300
```

#### 优化建议

```bash
# 禁用非必要流量
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

# 使用更具体的提示（减少往返次数）
# ❌ 模糊："analyze this code"
# ✅ 具体："find all null pointer exceptions in user.ts"

# 压缩长对话
> /compact
```

---

### 日志分析技巧

#### 提取关键信息

```bash
# 运行并保存日志
claude --debug "api" "your task" > debug.log 2>&1

# 搜索错误
grep -i "error" debug.log

# 查看 API 调用
grep "\[API\]" debug.log

# 统计 Token 使用
grep "Tokens used" debug.log
```

---

## 4.4 多模型切换策略 🎭

### 为什么需要多模型？

不同模型有不同的特点：

| 模型 | 优势 | 适用场景 | 成本 |
|------|------|---------|------|
| `claude-sonnet-4` | 最强推理 | 复杂分析、代码生成 | $$$$ |
| `claude-3.5-haiku` | 快速响应 | 简单问答、快速迭代 | $$ |
| `qwen3-coder-plus` | 性价比高 | 日常开发、代码审查 | $ |
| `qwen3-coder` | 经济实惠 | 简单任务、批量处理 | ¢ |

---

### 配置多模型

#### 方式一：多个配置文件

创建多个配置文件：

**~/.claude/config-claude.json**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxx",
    "ANTHROPIC_MODEL": "claude-sonnet-4-20250514"
  }
}
```

**~/.claude/config-qwen.json**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-dashscope-xxx",
    "ANTHROPIC_MODEL": "qwen3-coder-plus"
  }
}
```

#### 方式二：环境变量切换

**PowerShell**

```powershell
# 使用 Claude
$env:ANTHROPIC_MODEL="claude-sonnet-4-20250514"
$env:ANTHROPIC_BASE_URL="https://api.anthropic.com"

# 使用 Qwen
$env:ANTHROPIC_MODEL="qwen3-coder-plus"
$env:ANTHROPIC_BASE_URL="https://dashscope.aliyuncs.com/apps/anthropic"
```

**Bash/Zsh**

```bash
# 使用 Claude
export ANTHROPIC_MODEL="claude-sonnet-4-20250514"
export ANTHROPIC_BASE_URL="https://api.anthropic.com"

# 使用 Qwen
export ANTHROPIC_MODEL="qwen3-coder-plus"
export ANTHROPIC_BASE_URL="https://dashscope.aliyuncs.com/apps/anthropic"
```

---

### 快速切换工具：cc-switch

#### 安装

```bash
git clone https://github.com/farion1231/cc-switch.git
cd cc-switch
npm install
```

#### 使用

```bash
# 列出所有配置
npx cc-switch list

# 切换到 Claude 配置
npx cc-switch use claude

# 切换到 Qwen 配置
npx cc-switch use qwen

# 创建新配置
npx cc-switch create my-config
```

#### 配置示例

```json
// ~/.claude/profiles/claude.json
{
  "name": "Claude Sonnet",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxx",
    "ANTHROPIC_MODEL": "claude-sonnet-4-20250514"
  }
}

// ~/.claude/profiles/qwen.json
{
  "name": "Qwen Coder",
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-dashscope-xxx",
    "ANTHROPIC_MODEL": "qwen3-coder-plus"
  }
}
```

---

### 智能路由策略

根据任务类型自动选择模型：

```bash
# 简单任务 -> 经济模型
claude -p "What's the syntax for arrow functions?"

# 复杂分析 -> 强大模型
claude --model claude-sonnet-4 "Analyze this architecture and suggest improvements"

# 代码生成 -> 代码专用模型
claude --model qwen3-coder-plus "Generate a complete Express.js CRUD API"

# 创意写作 -> 通用模型
claude --model claude-3-opus "Write creative commit messages"
```

---

### 成本优化策略

#### 1. 分层使用

```bash
# 第一层：探索阶段（便宜模型）
claude --model qwen3-coder "Give me an overview of this codebase"

# 第二层：深入分析（中等模型）
claude --model qwen3-coder-plus "Identify potential issues in the auth flow"

# 第三层：关键决策（最强模型）
claude --model claude-sonnet-4 "Propose a detailed refactoring plan with risk assessment"
```

#### 2. 缓存结果

```bash
# 将常用分析结果保存到文件
claude --model qwen3-coder "Analyze project structure" > project-analysis.md

# 后续直接使用缓存的结果
cat project-analysis.md | head -50
```

#### 3. 批量处理

```bash
# 批量任务使用经济模型
find . -name "*.ts" | xargs -I {} claude --model qwen3-coder -p "Check {} for type errors"
```

---

## 4.5 实践任务 ✍️

### 任务 1：子代理实战

- [ ] 创建一个自定义子代理（如：代码规范检查员）
- [ ] 定义子代理的职责和专长
- [ ] 在实际项目中使用这个子代理
- [ ] 记录使用效果和改进建议

### 任务 2：MCP 集成

- [ ] 配置一个 MCP 服务器（GitHub/Google Drive/Jira）
- [ ] 完成至少 3 个实际任务
- [ ] 尝试创建自定义 MCP 服务器（可选）
- [ ] 编写集成文档

### 任务 3：调试技巧练习

- [ ] 启用调试模式解决一个问题
- [ ] 分析调试日志找出根因
- [ ] 总结常用的调试命令
- [ ] 建立调试检查清单

### 任务 4：多模型管理

- [ ] 配置至少 2 个不同的模型
- [ ] 使用 cc-switch 快速切换
- [ ] 对比不同模型在相同任务上的表现
- [ ] 制定成本优化策略

---

## 4.6 学习检查清单 ✅

### Subagents 掌握

- [ ] 理解子代理的概念和价值
- [ ] 熟练使用内置子代理
- [ ] 能创建自定义子代理
- [ ] 能在实际项目中应用子代理

### MCP 集成能力

- [ ] 理解 MCP 协议的作用
- [ ] 能配置常见的 MCP 服务器
- [ ] 能在对话中使用 MCP 工具
- [ ] 了解如何创建自定义 MCP 服务器

### 调试技能

- [ ] 熟练使用各种调试参数
- [ ] 能通过日志定位问题
- [ ] 掌握性能调试技巧
- [ ] 能分析和优化 API 使用

### 多模型策略

- [ ] 了解不同模型的特点
- [ ] 能配置和切换多个模型
- [ ] 会使用快速切换工具
- [ ] 能制定成本优化策略

---

## 4.7 下一步 👣

完成高级特性后，你将进入**第五阶段：精通实战**的学习，内容包括：

- 🔹 复杂项目管理实战
- 🔹 代码质量保障体系
- 🔹 团队协作最佳实践
- 🔹 持续学习和社区贡献

**预计学习时间：** 持续学习

---

## 📚 相关资源

- [官方文档 - Subagents](https://code.claude.com/docs/en/subagents)
- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP Servers 集合](https://github.com/modelcontextprotocol/servers)
- [cc-switch 项目](https://github.com/farion1231/cc-switch)
- [模型定价和限制](https://code.claude.com/docs/en/models)

---

> 💡 **小贴士**：建立一个 MCP 服务器配置模板库，收集常用的配置示例，方便快速集成新工具！

[← 返回进阶应用](./phase3-advanced.md) | [返回目录](./learning-path.md) | [下一阶段 →](./phase5-mastery.md)
