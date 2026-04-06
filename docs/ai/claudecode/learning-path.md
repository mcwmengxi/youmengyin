---
description: Claude Code 从入门到精通学习路径
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# Claude Code 从入门到精通学习路径

> 💡 **配套资源**：
>
> - 📚 [技能库](./skills.md) - 高级技能、提示词模板、自动化脚本
> - 🔌 [插件功能](./plugins.md) - 插件开发和使用完全指南
> - 🚀 [快速开始](./quickstart.md) - 核心指令速览
> - 📖 [使用指南](./index.md) - 完整功能说明

## 📚 学习路线图

```mermaid
graph LR
    A[入门阶段] --> B[基础阶段]
    B --> C[进阶阶段]
    C --> D[高级阶段]
    D --> E[精通阶段]
```

## 🌱 第一阶段：入门基础（1-2 天）

### 1.1 环境搭建

**学习目标：** 成功安装并配置 Claude Code

- [ ] **安装 Claude Code**
  - Windows PowerShell 安装
  - macOS/Linux 安装
  - npm 全局安装
  - 验证安装：`claude --version`

- [ ] **基础配置**
  - API Key 配置（阿里百炼/官方 API）
  - 环境变量配置
  - 配置文件位置：`C:\Users\[用户名]\.claude\settings.json`

- [ ] **第一个命令**

  ```bash
  claude
  /help
  exit
  ```

### 1.2 基本命令掌握

**学习目标：** 熟练使用基础命令

- [ ] **启动方式**
  - `claude` - 交互式 REPL
  - `claude "query"` - 带查询启动
  - `claude -p "query"` - 单次查询
  - `claude -c` - 继续最近会话

- [ ] **会话管理**
  - `/clear` - 清空上下文
  - `/compact` - 压缩上下文
  - `exit` / `Ctrl+C` - 退出

- [ ] **常用 Flags**
  - `--continue`, `-c`
  - `--dangerously-skip-permissions`
  - `--debug`

**实践任务：**

1. 完成首次安装和配置
2. 用不同方式启动 Claude Code
3. 执行简单的代码解释任务

**参考文档：** [`index.md`](./index.md) - 安装和基本命令部分

---

## 🚀 第二阶段：基础技能（3-5 天）

### 2.1 核心指令使用

**学习目标：** 掌握常用 Slash 命令

- [ ] **项目理解指令**

  ```bash
  /init          # 生成项目说明书
  /add-dir       # 添加关注目录
  /review        # 代码审查
  ```

- [ ] **上下文管理**

  ```bash
  /compact       # 压缩会话
  /clear         # 清空会话
  /agents        # 查看子代理
  ```

- [ ] **开发工作流**

  ```bash
  /commit        # 创建 Git 提交
  /test          # 运行测试
  /fix           # 修复问题
  ```

### 2.2 提示词工程

**学习目标：** 写出清晰有效的提示词

- [ ] **提示词结构**
  - 明确任务描述
  - 提供充分上下文
  - 指定输出格式
  - 设置约束条件

- [ ] **最佳实践**

  ```bash
  # ❌ 模糊的提示
  "fix the bug"
  
  # ✅ 清晰的提示
  "I'm getting a TypeError when calling getUserById in user.ts line 45. 
   The error says 'Cannot read property id of undefined'. 
   Please analyze the code and suggest a fix."
  ```

- [ ] **任务分解技巧**
  - 复杂任务拆分为小步骤
  - 逐步验证每个步骤
  - 使用追问获取更多信息

### 2.3 文件操作

**学习目标：** 熟练让 Claude 编辑和管理文件

- [ ] **读取文件**

  ```bash
  "show me the content of src/main.js"
  "what does the config.json file contain?"
  ```

- [ ] **编辑文件**

  ```bash
  "update user.ts to add null check"
  "refactor this function to use async/await"
  ```

- [ ] **创建文件**

  ```bash
  "create a new test file for auth module"
  "generate a README.md with installation instructions"
  ```

**实践任务：**

1. 使用 `/init` 生成当前项目文档
2. 让 Claude 分析一个模块的代码结构
3. 完成一次完整的代码重构
4. 编写单元测试

**参考文档：** [`quickstart.md`](./quickstart.md) - 核心指令部分

---

## 🔥 第三阶段：进阶应用（1-2 周）

### 3.1 工作流模式

**学习目标：** 掌握不同场景的工作流

- [ ] **理解新代码库**

  ```bash
  cd /path/to/project
  claude
  > give me an overview of this codebase
  > explain the main architecture patterns
  > what are the key data models?
  > show me the dependency graph
  ```

- [ ] **修复 Bug**

  ```bash
  claude "I'm seeing an error when I run npm test"
  claude "analyze the stack trace and find the root cause"
  claude "suggest ways to fix the @ts-ignore in user.ts"
  claude "update user.ts to add the null check"
  claude "run tests to verify the fix"
  ```

- [ ] **重构代码**

  ```bash
  claude "find deprecated API usage"
  claude "refactor utils.js to use ES2024 features"
  claude "identify code smells in the authentication module"
  claude "propose a refactoring plan"
  claude "implement the refactoring step by step"
  ```

- [ ] **编写测试**

  ```bash
  claude "write tests for the auth module"
  claude "achieve 90% code coverage"
  claude "run the tests and fix any failures"
  claude "add edge case tests"
  ```

### 3.2 Plan Mode（计划模式）

**学习目标：** 在修改前制定详细计划

- [ ] **启动计划模式**

  ```bash
  claude --permission-mode plan
  ```

- [ ] **使用场景**
  - 复杂重构前的分析
  - 多文件修改的规划
  - 架构调整的评估
  - 技术债务的识别

- [ ] **典型流程**

  ```bash
  # 1. 启动计划模式
  claude --permission-mode plan
  
  # 2. 分析现状
  > Analyze the current authentication system
  
  # 3. 识别问题
  > What are the potential security issues?
  
  # 4. 制定方案
  > Propose a detailed refactoring plan
  
  # 5. 评估风险
  > What could go wrong with this approach?
  ```

### 3.3 管道和脚本集成

**学习目标：** 将 Claude Code 集成到工作流中

- [ ] **处理管道内容**

  ```bash
  cat logs.txt | claude -p "explain these errors"
  git diff | claude -p "review this code change"
  ```

- [ ] **实时监控**

  ```bash
  tail -f app.log | claude -p "alert if you see anomalies"
  ```

- [ ] **批量操作**

  ```bash
  git diff main --name-only | claude -p "review for security issues"
  find . -name "*.ts" | xargs claude -p "check for type errors"
  ```

- [ ] **自动化脚本**

  ```bash
  # 创建自动化检查脚本
  claude "create a script that runs linting, tests, and security checks"
  ```

### 3.4 CLAUDE.md 配置

**学习目标：** 建立项目编码规范

- [ ] **创建 CLAUDE.md**

  ````
  # Project Guidelines
  
  ## Coding Standards
  - Use TypeScript for all new files
  - Follow ESLint rules
  - Write tests for new features
  - Use camelCase for variables
  - Use PascalCase for classes
  
  ## Architecture
  - Use React functional components
  - Follow the service/repository pattern
  - Dependency injection for services
  
  ## Review Checklist
  - [ ] Tests pass
  - [ ] No TypeScript errors
  - [ ] Code is documented
  - [ ] No console.log in production code
  ```

- [ ] **最佳实践**
  - 包含项目结构说明
  - 定义命名规范
  - 列出技术栈版本
  - 提供代码示例

**实践任务：**

1. 完成一个完整的 Bug 修复流程
2. 对一个模块进行重构优化
3. 为项目创建 CLAUDE.md 规范文档
4. 使用管道命令分析日志文件

**参考文档：** [`index.md`](./index.md) - 工作流和 Plan Mode 部分

---

## 🎯 第四阶段：高级特性（2-3 周）

### 4.1 Subagents（子代理）

**学习目标：** 创建和使用专用子代理

- [ ] **查看可用子代理**

  ```bash
  > /agents
  ```

- [ ] **使用特定子代理**

  ```bash
  > use the code-reviewer subagent to check auth module
  > use the test-writer subagent for the payment service
  ```

- [ ] **创建自定义子代理**

  ```bash
  > /agents
  # 选择 "Create New subagent"
  # 定义子代理职责：
  # - 名称：security-auditor
  # - 职责：安全检查、漏洞扫描
  # - 专长：OWASP Top 10、安全最佳实践
  ```

- [ ] **常见子代理类型**
  - Code Reviewer - 代码审查
  - Test Writer - 测试编写
  - Security Auditor - 安全审计
  - Performance Optimizer - 性能优化
  - Documentation Writer - 文档编写

### 4.2 MCP 集成

**学习目标：** 使用 Model Context Protocol 连接外部工具

- [ ] **配置 MCP**

  ```bash
  claude mcp
  ```

- [ ] **常见 MCP 服务器**
  - Google Drive - 访问文档
  - Jira - 任务管理
  - Slack - 团队协作
  - GitHub - 代码仓库
  - Custom Tools - 自定义工具

- [ ] **实际应用场景**

  ```bash
  # 连接 Jira 获取需求
  > fetch requirements from Jira project YOU-123
  
  # 从 Google Drive 读取设计文档
  > load the API design doc from Google Drive
  
  # 同步到 GitHub
  > create a PR on GitHub
  ```

### 4.3 调试技巧

**学习目标：** 掌握高级调试方法

- [ ] **启用调试模式**

  ```bash
  claude --debug "api,mcp"
  claude --debug "api"
  claude --debug "!statsig,!file"  # 排除某些调试
  ```

- [ ] **查看 API 请求**

  ```bash
  claude --debug "api" "analyze this code"
  ```

- [ ] **性能优化**

  ```bash
  # 禁用非必要流量
  ANTHROPIC_AUTH_TOKEN="xxx"
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
  ```

### 4.4 模型切换

**学习目标：** 根据场景选择合适的模型

- [ ] **配置不同模型**

  ```json
  {
    "env": {
      "ANTHROPIC_MODEL": "qwen3-coder-plus"
    }
  }
  ```

- [ ] **模型选择策略**
  - 简单任务：轻量级模型
  - 复杂分析：强大模型
  - 代码生成：专用代码模型
  - 成本敏感：经济型模型

- [ ] **快速切换工具**
  - 使用 [cc-switch](https://github.com/farion1231/cc-switch)
  - 配置多个模型配置文件
  - 环境变量快速切换

**实践任务：**

1. 创建一个专用的代码审查子代理
2. 配置 MCP 连接一个外部服务
3. 使用调试模式分析一次复杂的代码问题
4. 对比不同模型在相同任务上的表现

---

## 🏆 第五阶段：精通实战（持续学习）

### 5.1 复杂项目管理

**学习目标：** 管理大型项目的开发流程

- [ ] **多目录管理**

  ```bash
  claude --add-dir ./frontend --add-dir ./backend
  ```

- [ ] **版本控制集成**

  ```bash
  claude commit
  claude "create a PR for this feature"
  claude "review my recent code changes"
  ```

- [ ] **持续集成**

  ```bash
  # CI/CD 脚本中使用 Claude
  claude -p "run full test suite and report coverage"
  claude -p "check for breaking changes"
  ```

### 5.2 代码质量保障

**学习目标：** 建立完整的代码质量体系

- [ ] **静态分析**

  ```bash
  claude "check for type errors in all TypeScript files"
  claude "find potential null pointer exceptions"
  ```

- [ ] **安全审计**

  ```bash
  claude "audit for SQL injection vulnerabilities"
  claude "check for XSS security issues"
  claude "review authentication implementation"
  ```

- [ ] **性能审查**

  ```bash
  claude "identify performance bottlenecks"
  claude "suggest optimizations for database queries"
  ```

### 5.3 团队协作

**学习目标：** 在团队中高效使用 Claude Code

- [ ] **知识共享**
  - 建立团队的 CLAUDE.md 规范
  - 分享优秀的提示词模板
  - 创建常见问题解决方案库

- [ ] **Code Review 流程**

  ```bash
  # 提交前自查
  claude /review
  
  # 互相审查
  claude "review this PR for code quality"
  ```

- [ ] **新人培训**
  - 制定学习路径文档
  - 提供实践项目
  - 定期分享会

### 5.4 最佳实践总结

**学习目标：** 形成自己的方法论

- [ ] **提示词优化清单**
  - [ ] 任务描述是否具体？
  - [ ] 上下文信息是否充分？
  - [ ] 输出格式是否明确？
  - [ ] 约束条件是否清晰？

- [ ] **工作流程检查清单**
  - [ ] 先理解再修改
  - [ ] 小步快跑，频繁验证
  - [ ] 重要修改先用 Plan Mode
  - [ ] 提交前必须 review

- [ ] **常见陷阱避免**
  - 不要一次性做太大改动
  - 不要盲目相信 AI 生成的代码
  - 不要忘记运行测试验证
  - 不要忽略错误提示

### 5.5 持续学习资源

**学习目标：** 保持对新技术的敏感度

- [ ] **官方资源**
  - 文档：<https://code.claude.com/docs>
  - CLI 参考：<https://code.claude.com/docs/en/cli-reference>
  - 最佳实践：<https://code.claude.com/docs/en/best-practices>

- [ ] **社区资源**
  - GitHub Issues - 问题反馈和新特性
  - Discord 社区 - 与其他用户交流
  - 技术博客 - 学习他人经验

- [ ] **实践提升**
  - 参与开源项目
  - 分享使用心得
  - 教授他人使用

**实践任务：**

1. 主导一个完整的项目重构
2. 建立团队的 Claude Code 使用规范
3. 撰写一篇技术分享文章
4. 帮助团队成员学习使用 Claude Code

---

## 📊 能力评估表

| 能力维度 | 入门 | 基础 | 进阶 | 高级 | 精通 |
|---------|------|------|------|------|------|
| **命令使用** | 知道基本命令 | 熟练使用常用命令 | 灵活运用各种命令 | 创造自己的工作流 | 优化团队工作流 |
| **提示词工程** | 能写简单提示 | 结构化的提示词 | 精准的 task 描述 | 复杂的 multi-step | 教学他人 |
| **代码理解** | 理解单文件 | 理解模块 | 理解系统架构 | 发现设计问题 | 提出优化方案 |
| **问题解决** | 解决简单 bug | 独立修复问题 | 系统性解决问题 | 预防问题发生 | 建立质量体系 |
| **工具集成** | 基础使用 | 管道集成 | MCP 连接 | 自定义工具 | 生态建设 |

---

## 🎓 认证路径（建议）

### Level 1: Claude Code User

- ✅ 完成入门阶段学习
- ✅ 通过基础命令测试
- ✅ 完成 3 个实践任务

### Level 2: Claude Code Developer

- ✅ 完成基础 + 进阶阶段学习
- ✅ 展示 5 个实际项目案例
- ✅ 编写项目 CLAUDE.md

### Level 3: Claude Code Expert

- ✅ 完成所有阶段学习
- ✅ 贡献社区资源（文章/工具）
- ✅ 能够培训他人

---

## 💡 学习建议

1. **循序渐进** - 不要跳级学习，每个阶段都要扎实掌握
2. **大量实践** - 理论结合实践，每学一个知识点都要动手练习
3. **总结反思** - 记录学习笔记，总结成功经验和失败教训
4. **分享交流** - 加入社区，与他人交流学习心得
5. **持续更新** - AI 工具发展迅速，保持学习的习惯

---

## 📝 学习记录模板

```
## Day X - 学习内容

### 学习的知识点
- 知识点 1
- 知识点 2

### 实践任务
- [ ] 任务 1
- [ ] 任务 2

### 遇到的问题
- 问题 1 + 解决方案
- 问题 2 + 解决方案

### 心得体会
...
```

---

**祝你学习顺利！🚀**

如有问题，欢迎查阅相关文档或加入社区讨论。
