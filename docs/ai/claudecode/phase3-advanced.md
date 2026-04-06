---
description: Claude Code 进阶应用 - 工作流、计划模式与自动化
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# 第三阶段：进阶应用（1-2 周）

> 🎯 **学习目标**：掌握完整的工作流，学会使用 Plan Mode，能够集成管道和脚本，建立项目规范

---

## 3.1 完整工作流实战 🔄

### 工作流 1：理解新代码库 🔍

当你接手一个新项目时，按以下步骤快速理解代码库：

#### Step 1: 宏观概览

```bash
cd /path/to/project
claude

> Give me an overview of this codebase
> What type of project is this?
> What are the main technologies used?
```

#### Step 2: 架构分析

```bash
> Explain the main architecture patterns
> How is the project structured?
> What are the key directories and their purposes?
```

#### Step 3: 核心模块识别

```bash
> What are the core modules/components?
> Show me the dependency graph between modules
> Which files are the entry points?
```

#### Step 4: 数据模型理解

```bash
> What are the key data models/entities?
> Show me the database schema or data structures
> How do data flow through the application?
```

#### Step 5: 关键逻辑追踪

```bash
> Trace the execution flow for user authentication
> How does a request travel through the system?
> Where is the business logic implemented?
```

#### 实战案例：分析博客项目

```bash
cd d:\Project\youmengyin

> /init
> Analyze this VitePress blog project structure
> What are the main content directories?
> How is the build process configured?
> Explain the deployment workflow
```

---

### 工作流 2：修复 Bug 🐛

系统化的 Bug 修复流程：

#### Step 1: 问题定位

```bash
> I'm seeing this error when I run npm test:
> {粘贴错误信息}
> 
> What could be causing this?
```

#### Step 2: 根因分析

```bash
> Analyze the stack trace and find the root cause
> Where in the code is this issue originating from?
> What are the possible scenarios that trigger this bug?
```

#### Step 3: 解决方案建议

```bash
> Suggest 2-3 ways to fix this issue
> What are the pros and cons of each approach?
> Which solution do you recommend and why?
```

#### Step 4: 实施修复

```bash
> Let's implement the recommended fix
> Update the code in {filename}
> Add proper error handling
```

#### Step 5: 验证测试

```bash
> Run the tests to verify the fix works
> Check if there are any regression issues
> Are there any edge cases we should test?
```

#### 实战案例：修复 TypeScript 空指针错误

```bash
> I'm getting "Cannot read property 'id' of undefined" in user.ts line 45
> The error happens when calling getUserById with a null ID
> 
> Please analyze and fix this issue
> Add proper null checks and error handling
> Write a test case to prevent regression
```

---

### 工作流 3：重构代码 ♻️

安全有效的代码重构流程：

#### Step 1: 代码异味检测

```bash
> Find code smells in the authentication module
> Identify deprecated API usage
> Point out violations of SOLID principles
> Where are the performance bottlenecks?
```

#### Step 2: 重构计划制定

```bash
> Propose a refactoring plan for {module}
> What design patterns would improve this code?
> How can we reduce coupling between components?
> Prioritize the improvements by impact
```

#### Step 3: 分步实施

```bash
> Let's start with step 1: Extract duplicate code into utility functions
> Now step 2: Convert callbacks to promises
> Next, step 3: Add TypeScript types
> Finally, step 4: Optimize the critical path
```

#### Step 4: 回归测试

```bash
> Run all tests to ensure nothing broke
> Check for any TypeScript errors
> Verify the performance improvement
```

#### 实战案例：重构工具函数

```bash
> Refactor utils.js to use ES2024 features
> Replace lodash imports with native implementations
> Add JSDoc comments and TypeScript types
> Improve error handling throughout
```

---

### 工作流 4：编写测试 🧪

完整的测试覆盖策略：

#### Step 1: 测试策略规划

```bash
> Analyze the auth module and identify what needs testing
> What are the critical paths that must be covered?
> What edge cases should we consider?
> Aim for at least 90% code coverage
```

#### Step 2: 单元测试编写

```bash
> Write unit tests for the login function
> Include:
> - Valid credentials (happy path)
> - Invalid password
> - Non-existent user
> - SQL injection attempts
> - Rate limiting scenarios
```

#### Step 3: 集成测试编写

```bash
> Create integration tests for the auth API
> Test the complete authentication flow
> Mock external dependencies (email service, etc.)
> Verify database transactions
```

#### Step 4: 运行和优化

```bash
> Run the tests and show me the coverage report
> Fix any failing tests
> Add more edge case tests based on coverage gaps
> Optimize slow tests
```

#### 实战案例：为博客系统添加测试

```bash
> Write comprehensive tests for the markdown parser
> Test cases:
> - Standard markdown syntax
> - Custom extensions (task lists, etc.)
> - Edge cases (empty content, special characters)
> - Security (XSS prevention)
```

---

## 3.2 Plan Mode（计划模式）详解 📋

### 什么是 Plan Mode？

Plan Mode 是 Claude Code 的只读分析模式，专门用于：

- 复杂重构前的分析
- 多文件修改的规划
- 架构调整的评估
- 技术债务的识别

**关键特性：**

- ✅ 只执行只读操作（不会修改文件）
- ✅ 深入分析和详细规划
- ✅ 风险评估和影响分析
- ✅ 提供多种方案对比

---

### 启动 Plan Mode

#### 方式一：命令行启动

```bash
claude --permission-mode plan
```

#### 方式二：会话中切换

```bash
> Switch to plan mode
```

或使用快捷键：

- `Shift+Tab` - 切换模式

---

### Plan Mode 典型使用场景

#### 场景 1：大型重构前

```bash
claude --permission-mode plan

> I want to refactor the authentication system from session-based to JWT
> Analyze the current implementation
> Identify all files that need changes
> Propose a detailed migration plan
> What are the risks and how to mitigate them?
> Estimate the effort required
```

#### 场景 2：依赖升级评估

```bash
> We need to upgrade from Vue 2 to Vue 3
> Scan the codebase for breaking changes
> List all incompatible APIs we're using
> Create a step-by-step migration guide
> What are the gotchas we should watch out for?
```

#### 场景 3：性能优化规划

```bash
> The page load time is too slow (>5s)
> Analyze the rendering pipeline
> Identify performance bottlenecks
> Propose optimization strategies
> Prioritize by impact and effort
```

#### 场景 4：安全审计

```bash
> Conduct a security audit of the payment module
> Check for OWASP Top 10 vulnerabilities
> Review input validation and sanitization
> Assess authentication and authorization logic
> Provide remediation recommendations
```

---

### Plan Mode 输出模板

一个完整的 Plan Mode 分析应包含：

```markdown
## 现状分析
- 当前架构/实现描述
- 存在的问题列表
- 影响范围评估

## 改进方案
- 方案 A（推荐）
  - 详细描述
  - 优点
  - 缺点
  - 实施步骤
  
- 方案 B（备选）
  - ...

## 实施计划
1. 第一阶段：准备工作
   - 任务清单
   - 预计时间
   
2. 第二阶段：核心改动
   - 任务清单
   - 预计时间
   
3. 第三阶段：验证和回滚方案
   - 测试计划
   - 回滚步骤

## 风险评估
- 风险 1 + 缓解措施
- 风险 2 + 缓解措施

## 成功标准
- [ ] 指标 1
- [ ] 指标 2
```

---

## 3.3 管道和脚本集成 🔗

### 处理管道内容

#### 分析日志文件

```bash
cat logs/error.log | claude -p "Analyze these errors and categorize them by severity"
```

#### 代码审查

```bash
git diff HEAD~1 | claude -p "Review this code change for bugs and security issues"
```

#### 批量检查

```bash
find . -name "*.ts" -type f | xargs cat | claude -p "Check for type safety issues"
```

---

### 实时监控场景

#### 应用监控

```bash
tail -f app.log | claude -p "Alert me if you see any of these patterns:
- ERROR
- Exception
- Failed to connect
- Timeout"
```

#### CI/CD 监控

```bash
tail -f ci-pipeline.log | claude -p "Monitor the build process and explain any failures"
```

#### 安全监控

```bash
tail -f access.log | claude -p "Detect suspicious patterns like:
- Multiple failed login attempts
- SQL injection attempts
- Unusual request rates"
```

---

### 批量操作

#### 安全检查

```bash
git diff main --name-only | claude -p "Review these changed files for security vulnerabilities"
```

#### 代码质量检查

```bash
git diff main --stat | grep "\.ts$" | cut -d'|' -f1 | xargs cat | claude -p "Check for TypeScript best practices"
```

#### 依赖审计

```bash
npm list --depth=0 | claude -p "Identify outdated or vulnerable dependencies"
```

---

### 自动化脚本

#### 创建自动化检查脚本

```bash
> Create a bash script that:
> 1. Runs ESLint
> 2. Runs TypeScript compiler check
> 3. Runs unit tests
> 4. Checks for console.log statements
> 5. Generates a report
```

生成的脚本示例：

```bash
#!/bin/bash
# quality-check.sh

echo "🔍 Running code quality checks..."

# ESLint
echo "Checking linting..."
npm run lint

# TypeScript
echo "Checking types..."
npx tsc --noEmit

# Tests
echo "Running tests..."
npm test

# Console.log check
echo "Checking for console.log..."
if grep -r "console\.log" src/; then
  echo "⚠️ Found console.log statements"
else
  echo "✅ No console.log found"
fi

echo "Quality check complete!"
```

#### 使用 Claude 增强脚本

```bash
#!/bin/bash
# smart-commit.sh

echo "Analyzing changes..."
git diff --cached | claude -p "Generate a concise commit message based on these changes"
```

---

## 3.4 CLAUDE.md 配置 📖

### 什么是 CLAUDE.md？

>给Claude的"项目入职手册"，Claude 每次开始对话时，都会自动阅读这份手册，了解你的项目背景，明确项目的技术栈，编程规范

CLAUDE.md 是项目的编码规范配置文件，用于：

- 定义项目的编码标准
- 说明架构约束
- 提供审查清单
- 统一团队实践

---

### 创建高效的CLAUDE.md

在你的项目根目录创建 `CLAUDE.md`：

CLAUDE.md编写要遵循的三核心原则：

- 核心原则 1：少即是多（Less is More）
  CLAUDE.md 的每一行，都会在每一次对话开始时被自动注入上下文，这意味着消耗更多的Token，花更多的钱。也就是说冗余不是无害的，而是持续消耗的。所以保持精简不是建议，而是必须。

- 核心原则 2：具体优于泛泛

非常常见、但几乎没有任何效果的写法。

```sh
# 项目规范
## 代码质量
请写出高质量的代码。代码应该是可读的。使用有意义的变量名。
保持代码整洁。遵循最佳实践。不要写重复的代码。
```

真正有价值CLAUDE.md，应该是如下所示：

```sh
# 项目：个人博客

## 技术栈
- vue + vitepress

## 目录结构
docs/
|—— ai/ # 相关文档
|—— background/ # 
|—— javascript/ #
|—— flutter/

 ## 组件规范
 ## 常用命令
 ## 详细文档
```

- 核心原则 3： 用引用实现渐进式规范

>CLAUDE.md 的职责是定义默认决策，而不是承载全部知识。对于非核心、但可能被用到的内容，正确的做法是引用，而不是复制。

```sh
...
 ## 详细文档
 - 数据库设计: 见 `docs/database.md`
 - API 规范: 见 `docs/api-spec.md`
 - 部署流程: 见 `docs/deployment.md`
```

这样做有两个好处：

1. CLAUDE.md 保持轻量，启动成本低。
2. 当Claude需要进一步细节信息时，可以按需读取引用文件。

```sh
# Project Guidelines

## 1. Coding Standards

### Naming Conventions
- Variables: camelCase (`userName`, `totalCount`)
- Classes/Components: PascalCase (`UserProfile`, `AuthService`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- Files: kebab-case for config, PascalCase for components

### Code Style
- Use TypeScript strict mode for all new files
- Follow ESLint rules (see .eslintrc.js)
- Max function length: 50 lines
- Max file length: 500 lines
- Use arrow functions for callbacks

### Documentation
- All public APIs must have JSDoc comments
- Complex logic should have inline comments
- Keep README.md up to date

## 2. Architecture

### Design Patterns
- Use React functional components with hooks
- Follow the container/presentational pattern
- Implement repository pattern for data access
- Use dependency injection for services

### File Structure
```

src/
├── components/     # Reusable UI components
├── views/         # Page components
├── services/      # Business logic
├── repositories/  # Data access
├── utils/         # Utility functions
└── types/         # TypeScript types

```

### State Management
- Use Zustand for global state
- React Query for server state
- Local state for component-specific data

## 3. Testing Requirements

### Test Coverage
- Minimum 80% code coverage
- All critical paths must be tested
- Edge cases for public APIs

### Test Structure
```typescript
describe('AuthService', () => {
  describe('login', () => {
    it('should authenticate with valid credentials', async () => {
      // Arrange
      // Act
      // Assert
    });
    
    it('should throw error for invalid credentials', async () => {
      // Test error case
    });
  });
});
```

### Claude Code 的五层记忆架构

>我们来学一下Claude Code的五层记忆架构。其实你可以简单理解为放的位置和名称不同，所属的层级就不同。

```mermaid
graph LR
    A[企业策略级记忆设定] --> B[用户级内容设定]
    B --> C[项目级团队共享规范]
    C --> D[本地级个人工作空间]
    D --> E[规则目录：分类组织]
```

#### 企业策略级记忆设定

>企业策略级记忆设定的作用是组织范围内的指令，由 IT/DevOps 统一管理和部署组织。适合内容是，公司编码标准、安全策略、合规要求以及禁止使用的库或模式。通过配置管理系统（MDM、Group Policy、Ansible 等）部署，确保在所有开发者机器上一致分发。

- Windwos:C:\Program Files\ClaudeCode\CLAUDE.md
- macOS: /Library/Application Support/ClaudeCode/CLAUDE.md
- Linux: /etc/claude-code/CLAUDE.md

```sh
# 公司开发策略

## 安全要求
- 禁止在代码中硬编码任何密钥或敏感信息
- 所有 API 调用必须使用 HTTPS
- 用户输入必须经过验证和清理

## 合规要求
- 所有日志必须排除 PII（个人身份信息）
- 数据库连接必须使用加密传输

## 禁止项
- 禁止使用未经审批的第三方库
- 禁止直接访问生产数据库
```

如果你是小团队，可以直接跳过企业级设定这一层，不影响任何使用。

#### 用户级内容设定

用户级内容设定承载的是你的全局偏好，即跨所有项目生效的个人偏好，如个人代码风格，沟通语言设置，通用工作习惯等。比如说我希望所有的 PPT 都是 16:9，黑体字。这种设置就应该放在此处。

位置：~/.claude/CLAUDE.md

```sh
# 个人偏好

## 沟通方式
- 使用中文回复
- 代码注释使用英文
- 解释简洁直接，不要过多铺垫

## 通用代码风格
- 缩进使用 2 空格
- 优先使用 async/await
- 变量命名使用 camelCase
- 常量命名使用 UPPER_SNAKE_CASE

## 我的常用工具
- 包管理器: uv
- 编辑器: VS Code
- 终端: zsh
```

#### 项目级团队共享规范

团队共享规范是团队共享的项目知识，应该提交到 Git。适合存放的内容包括项目架构和技术栈、团队编码规范、重要的设计决策和常用命令。

位置：项目根目录的 `./CLAUDE.md`

#### 本地级个人工作空间

个人工作空间用于记载个人工作笔记，不提交到 Git，适合内容包括本地环境配置、个人调试技巧、当前工作备注，敏感信息（测试账号等）。

位置：项目根目录的`./CLAUDE.local.md`

记得把 `CLAUDE.local.md` 加入 `.gitignore！`

#### 规则目录：分类组织

>Rules 是按主题组织的规则文件，支持条件作用域（也就是视情况来确定是否加载该记忆内容），适合场景包括 CLAUDE.md 变得太长时，不同文件类型需要不同规范时，以及前后端分离的项目。

位置：`.claude/rules/*.md`

```sh
.claude/
└── rules/
    ├── typescript.md      # TypeScript 规范
    ├── testing.md         # 测试规范
    ├── api-design.md      # API 设计规范
    └── security.md        # 安全规范
```

## 4. Security Checklist

Before committing code, verify:

- [ ] No hardcoded secrets
- [ ] Input validation on all user inputs
- [ ] SQL queries use parameterized statements
- [ ] XSS prevention measures in place
- [ ] Authentication checks implemented
- [ ] Error messages don't leak sensitive info

## 5. Performance Guidelines

- Lazy load heavy components
- Implement virtual scrolling for long lists
- Cache expensive computations
- Debounce/throttle frequent operations
- Monitor bundle size (< 500KB initial)

## 6. Git Commit Convention

Format: `<type>(<scope>): <description>`

Examples:

- `feat(auth): add JWT token refresh`
- `fix(api): handle null response in getUser`
- `refactor(utils): optimize date formatting`
- `docs(readme): update installation steps`

Types: feat, fix, docs, style, refactor, test, chore

```

---

### 在对话中使用 CLAUDE.md

让 Claude 遵循项目规范：

```bash
> According to our CLAUDE.md, what naming convention should I use for this?

> Review this code against our project guidelines in CLAUDE.md

> Generate a new component following our architecture standards

> Check if this PR complies with our security checklist
```

---

### 团队最佳实践

#### 1. 建立规范库

为不同类型的项目创建 CLAUDE.md 模板：

- `CLAUDE.md.frontend` - 前端项目规范
- `CLAUDE.md.backend` - 后端项目规范
- `CLAUDE.md.fullstack` - 全栈项目规范

#### 2. 定期更新

- 每季度 review 一次规范
- 根据团队反馈调整
- 跟踪新技术和最佳实践

#### 3. 培训新人

- 将 CLAUDE.md 作为入职文档
- 用 `/init` 让新人快速了解项目
- 定期检查规范执行情况

---

## 3.5 实践任务 ✍️

### 任务 1：完整工作流练习

选择一个真实项目，完成：

- [ ] 使用工作流 1 分析项目架构
- [ ] 找出一个实际存在的 Bug 并修复
- [ ] 对一个模块进行重构优化
- [ ] 为核心功能编写测试用例

### 任务 2：Plan Mode 实战

- [ ] 对一个复杂功能启动 Plan Mode
- [ ] 获取详细的分析和规划
- [ ] 根据计划实施改动
- [ ] 记录 Plan Mode 的价值

### 任务 3：管道集成

- [ ] 创建一个日志分析管道
- [ ] 创建一个代码审查管道
- [ ] 创建一个批量检查脚本
- [ ] 集成到日常工作流中

### 任务 4：创建 CLAUDE.md

- [ ] 为当前项目创建 CLAUDE.md
- [ ] 包含编码规范、架构说明、审查清单
- [ ] 让团队成员 review 并提出建议
- [ ] 在实际项目中应用这个规范

---

## 3.6 学习检查清单 ✅

### 工作流掌握

- [ ] 能快速理解新代码库
- [ ] 能系统化修复 Bug
- [ ] 能安全重构代码
- [ ] 能编写完整测试

### Plan Mode 应用

- [ ] 理解 Plan Mode 的用途
- [ ] 能在合适场景使用
- [ ] 能解读分析报告
- [ ] 能按计划实施改动

### 管道和脚本

- [ ] 会使用管道处理数据
- [ ] 能创建自动化脚本
- [ ] 能集成到工作流中
- [ ] 能提高团队效率

### CLAUDE.md 配置

- [ ] 理解 CLAUDE.md 的作用
- [ ] 能创建项目规范文档
- [ ] 能在团队中推广使用
- [ ] 能持续维护和更新

---

## 3.7 下一步 👣

完成进阶应用后，你将进入**第四阶段：高级特性**的学习，内容包括：

- 🔹 Subagents 子代理系统深度使用
- 🔹 MCP 协议集成外部工具
- 🔹 高级调试技巧
- 🔹 多模型切换策略

**预计学习时间：** 2-3 周

---

## 📚 相关资源

- [官方文档 - 工作流示例](https://code.claude.com/docs/en/workflows)
- [官方文档 - Plan Mode](https://code.claude.com/docs/en/plan-mode)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

> 💡 **小贴士**：建立一个工作流模板库，收集常用的命令组合和提示词模板，这会大幅提高你的工作效率！

[← 返回基础技能](./phase2-fundamentals.md) | [返回目录](./learning-path.md) | [下一阶段 →](./phase4-expert.md)
