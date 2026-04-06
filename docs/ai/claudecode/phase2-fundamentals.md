---
description: Claude Code 基础技能 - 核心指令与提示词工程
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# 第二阶段：基础技能（3-5 天）

> 🎯 **学习目标**：掌握核心 Slash 命令，学会编写高质量的提示词，能够进行文件操作

---

## 2.1 核心 Slash 命令详解 🔧

### 会话相关命令

| 命令 | 用途 | 使用场景 |
|------|------|----------|
| `/help` | 显示所有可用命令 | 不确定有哪些命令可使用时，快速查询全部命令及说明 |
| `/clear` | 清空会话历史，重置上下文 | 开始新的任务、当前上下文过载导致操作卡顿，或需要切换项目时使用 |
| `/exit` | 退出 Claude Code | 完成工作，需要结束 Claude Code 操作时使用 |
| `/compact` | 压缩早期消息，保留关键信息 | 长对话中 Token 消耗过多，需要精简上下文、节省 Token 时使用 |
| `/rewind` 或双击 Esc | 撤销对话历史，返回之前状态 | Claude 编写内容出错，或需要回到之前的对话节点重新操作时使用 |

### 配置相关命令

| 命令 | 用途 | 使用场景 |
|------|------|----------|
| `/config` | 打开配置界面(交互式设置) | 需要修改 Claude Code 的各项设置,或查看当前配置参数时使用 |
| `/status` | 查看账户、模型、目录等状态 | 检查账户信息是否正常、确认当前工作目录是否正确,或查看所用模型版本时使用 |
| `/doctor` | 诊断安装和配置问题 | 使用过程中遇到无法正常运行、功能异常等问题,需要排查故障时使用 |
| `/cost` | 显示token使用和成本 | 需要监控 Token 消耗情况、优化使用成本,避免过度消耗时使用 |
| `/context` | 查看上下文使用情况 | 怀疑当前上下文过载,或想了解上下文占用情况时使用 |

### 项目管理命令

| 命令 | 用途 | 使用场景 |
|------|------|----------|
| `/init` | 生成CLAUDE.md项目指南文件 | 新项目启动时，需要持久化项目上下文、规范项目文档时使用 |
| `/memory` | 编辑CLAUDE.MD项目记忆 | 项目推进过程中，需要更新项目信息、添加项目约定规则时使用 |
| `# text` | 快速添加到CLAUDE.md | 使用过程中发现重要信息，需要快速记录到项目指南文件中时使用 |

### 常用命令

#### /init - 生成项目说明书

**功能：** 分析项目结构并生成项目说明文档

**使用场景：**

- 接手新项目时快速了解
- 生成项目文档
- 让 AI 理解项目上下文

**示例：**

```bash
> /init
```

**输出内容：**

- 项目结构概览
- 主要技术栈
- 核心文件说明
- 依赖关系

**实战：**

```bash
cd d:\Project\youmengyin
claude
> /init
```

这会让 Claude 分析你的博客项目结构。

---

#### /review - 代码审查

**功能：** 对代码进行质量检查和安全审计

**使用场景：**

- 提交前代码检查
- 发现潜在问题
- 代码优化建议

**示例：**

```bash
> /review
```

**审查内容：**

- 代码规范符合性
- 潜在 Bug
- 安全漏洞
- 性能问题
- 可维护性评估

**实战：**

```bash
# 审查特定文件
> /review src/main.js

# 审查最近的改动
> /review my recent changes

# 专项审查
> /review for security issues
> /review for performance issues
> /review for type errors
```

---

#### /add-dir - 添加关注目录

**功能：** 让 Claude 关注指定的目录，提高响应准确性

**使用场景：**

- 多仓库项目
- 只关心部分目录
- 提高扫描效率

**示例：**

```bash
> /add-dir ./src
> /add-dir ./components ./utils
```

**实战：**

```bash
# 在前端项目中
> /add-dir ./src/components ./src/views

# 在全栈项目中
> /add-dir ./frontend/src ./backend/api
```

---

#### /agents - 子代理管理

**功能：** 查看、创建和使用专用子代理

**示例：**

```bash
> /agents
```

**可用子代理类型：**

- `code-reviewer` - 代码审查专家
- `test-writer` - 测试编写专家
- `security-auditor` - 安全审计专家
- `performance-optimizer` - 性能优化专家
- `documentation-writer` - 文档编写专家

**使用子代理：**

```bash
> use the code-reviewer subagent to check auth module
> use the test-writer subagent for payment service
```

---

#### /compact - 压缩会话上下文

**功能：** 保留关键信息，压缩对话历史以节省 Token

**示例：**

```bash
> /compact
```

**压缩策略：**

- 保留重要结论
- 删除冗余对话
- 总结关键决策

**最佳实践：**

- 每 10-15 轮对话后压缩一次
- 在达成阶段性成果后压缩
- 在切换话题前压缩

---

#### /clear - 清空会话

**功能：** 完全清除当前会话历史

**示例：**

```bash
> /clear
```

**使用场景：**

- 开始全新话题
- 上下文污染时
- Token 不足时

---

### 快捷键汇总

| 快捷键     | 功能                          |
| :--------- | :---------------------------- |
| `Shift + Tab`  | 切换工作模式                  |
| `Esc`      | 停止生成                      |
| `Esc Esc`  | 执行 `/rewind`(撤销对话历史)  |
| `Ctrl + C` | 退出对话                      |
| `Ctrl + R` | 搜索命令历史                  |
| `?`        | 显示快捷键帮助                |
| `Tab`      | 文件路径自动补全（在@后使用） |

### 特殊语法

>Claude Code 还支持一些特殊语法，可实现快速记忆、文件应用、直接执行终端命令等功能，进一步拓展工具的使用场景。

| 命令        | 用途                         | 示例                               |
| :---------- | :--------------------------- | :--------------------------------- |
| `# text`    | 快速记忆（添加到CLAUDE.md）  | `# 要兼容手机和电脑样式，都要测试` |
| `@ path`    | 文件应用和自动补全           | `@src/app.js` ，`@config/*json`    |
| `! command` | 直接执行bash命令（某些版本） | `! git status`                     |

## 2.2 提示词工程 📝

### 提示词的基本结构

优秀的提示词包含以下要素：

```
[角色设定] + [任务描述] + [上下文信息] + [输出要求] + [约束条件]
```

### 好 vs 坏的提示词对比

#### ❌ 模糊的提示词

```bash
"fix the bug"
```

#### ✅ 清晰的提示词

```bash
"I'm getting a TypeError when calling getUserById in user.ts line 45. 
The error says 'Cannot read property id of undefined'. 
Please analyze the code and suggest a fix with explanation."
```

**差异分析：**

- 明确指出了错误类型（TypeError）
- 提供了具体位置（user.ts line 45）
- 给出了错误信息原文
- 说明了期望的输出（修复方案 + 解释）

---

### 提示词模板库

#### 1️⃣ 代码解释类

```bash
# 解释函数功能
"Explain what the {functionName} function does in {fileName}. 
Focus on its input parameters, return value, and side effects."

# 解释架构模式
"Explain the architecture pattern used in this project. 
What are the main layers and how do they interact?"
```

#### 2️⃣ Bug 修复类

```bash
# 报错修复
"I encountered this error when running {command}: 
{error message}

The error happens when I {action}. 
Here's the relevant code:
{code snippet}

Please identify the root cause and provide a fix."

# 逻辑错误
"The {feature} is not working as expected. 
Expected behavior: {expected}
Actual behavior: {actual}

Here's the code flow: {flow description}"
```

#### 3️⃣ 代码重构类

```bash
# 性能优化
"This function is slow when processing large datasets. 
Analyze the time complexity and suggest optimizations.
Current implementation: {code}"

# 代码异味清理
"Refactor this code to improve readability and maintainability.
Identify code smells and apply appropriate design patterns.
Code: {code}"
```

#### 4️⃣ 测试编写类

```bash
# 单元测试
"Write comprehensive unit tests for {moduleName}. 
Include:
- Happy path scenarios
- Edge cases
- Error handling
- Mock external dependencies

Test framework: {jest/mocha/vitest}"

# 集成测试
"Create integration tests for the {API endpoint}. 
Test authentication, validation, and business logic."
```

#### 5️⃣ 文档编写类

```bash
# API 文档
"Generate API documentation for these endpoints:
{endpoints list}

Include request/response examples, error codes, and authentication requirements."

# README
"Create a README.md for this project including:
- Project description
- Installation instructions
- Usage examples
- Contributing guidelines"
```

---

### 任务分解技巧

复杂任务应该分步骤执行：

#### ❌ 一次性的大任务

```bash
"Refactor the entire authentication system"
```

#### ✅ 分步骤执行

```bash
# Step 1: 分析现状
"Analyze the current authentication system. What are the main components?"

# Step 2: 识别问题
"What are the security vulnerabilities and code smells?"

# Step 3: 制定计划
"Propose a step-by-step refactoring plan with priorities"

# Step 4: 逐步实施
"Let's start with step 1: Update the password hashing mechanism"

# Step 5: 验证结果
"Run the tests to verify our changes work correctly"
```

---

### 追问技巧

通过追问获取更深入的信息：

```bash
# 要求举例
"Can you show me an example?"

# 要求解释原因
"Why did you choose this approach?"

# 询问替代方案
"What are the alternative solutions? Pros and cons?"

# 深入了解
"Can you elaborate on that point?"

# 确认理解
"So if I understand correctly, ... Is that right?"
```

---

## 2.3 文件操作 📁

### 读取文件

#### 查看文件内容

```bash
"Show me the content of src/main.js"
"What does package.json contain?"
"Display the configuration in .env file"
```

#### 查找特定代码

```bash
"Find all usages of axios in the codebase"
"Where is the authenticateUser function defined?"
"Search for TODO comments in TypeScript files"
```

#### 分析文件结构

```bash
"Analyze the structure of src/components directory"
"What are the main modules in this project?"
```

---

### 编辑文件

#### 修改现有代码

```bash
# 添加功能
"Add error handling to the login function in auth.js"

# 修复问题
"Fix the null pointer issue in user.ts line 45"

# 优化代码
"Refactor createUser to use async/await instead of promises"

# 更新依赖
"Update the API calls to use the new endpoint format"
```

#### 批量修改

```bash
"Replace all console.log with proper logging using winston"
"Update all var declarations to let or const"
"Add TypeScript types to all function parameters"
```

---

### 创建文件

#### 创建新文件

```bash
"Create a new test file for auth module at tests/auth.test.js"
"Generate a utility function file src/utils/formatDate.js"
"Create a configuration file config/database.json"
```

#### 生成完整文件

```bash
"Create a complete Express server setup in server.js with:
- CORS configuration
- Body parser middleware
- Error handling middleware
- Health check endpoint
- API routes mounting"
```

---

### 删除文件

```bash
"Remove the deprecated utils/oldHelpers.js file"
"Delete all .log files in the logs directory"
```

---

### 文件对比

```bash
"Compare the differences between v1 and v2 of the API"
"Show me what changed in the last commit"
```

---

## 2.4 实践任务 ✍️

### 任务 1：项目分析

- [ ] 进入你的项目目录
- [ ] 使用 `/init` 生成项目说明
- [ ] 使用 `/add-dir` 添加关注的目录
- [ ] 让 Claude 解释项目架构
- [ ] 记录关键发现

### 任务 2：代码审查

- [ ] 选择一个模块（如用户认证）
- [ ] 使用 `/review` 进行代码审查
- [ ] 根据建议修复至少一个问题
- [ ] 再次审查确认修复效果

### 任务 3：提示词练习

完成以下提示词编写：

- [ ] 编写一个 Bug 修复提示词（包含完整上下文）
- [ ] 编写一个代码重构提示词（明确目标和要求）
- [ ] 编写一个测试编写提示词（指定测试框架和覆盖范围）

### 任务 4：文件操作实战

- [ ] 让 Claude 读取一个你熟悉的文件
- [ ] 让它解释代码逻辑
- [ ] 提出一个优化建议并让它实现
- [ ] 创建一个相关的工具函数文件

### 任务 5：任务分解练习

选择一个复杂任务（如"优化登录流程"），练习：

- [ ] 将任务分解为 5 个以上小步骤
- [ ] 逐步执行并验证每个步骤
- [ ] 记录分解和执行过程

---

## 2.5 常见陷阱 ⚠️

### 陷阱 1：提示词太模糊

```bash
# ❌ 坏例子
"Make it better"

# ✅ 好例子
"Improve the error handling in the login function by adding retry logic 
and better error messages for users"
```

### 陷阱 2：缺少上下文

```bash
# ❌ 坏例子
"Fix this error" (没有提供错误信息)

# ✅ 好例子
"Fix this TypeError: Cannot read property 'name' of undefined 
at UserService.getUser (user.service.ts:45)
When calling getUser with userId = null"
```

### 陷阱 3：任务太大

```bash
# ❌ 坏例子
"Refactor the whole frontend"

# ✅ 好例子
"Let's refactor the component structure in phases. 
Phase 1: Extract reusable hooks from UserComponents. 
Phase 2: Convert class components to functional components..."
```

### 陷阱 4：不验证结果

```bash
# ❌ 坏做法
直接应用 AI 生成的代码

# ✅ 好做法
"Run the tests to verify the changes work"
"Check if there are any TypeScript errors"
"Review the generated code for potential issues"
```

---

## 2.6  Claude Code的四种工作模式 🧪

>快捷键切换：在 Claude Code 终端会话中，按下「Alt+M」组合键
>在VSCode设置中修改`Initial Permission Mode`选项进行修改，直接选择`acceptEdits`选项。
>在对话框模式下直接修改

### 模式一：acceptEdits模式-确认执行，掌控细节

>acceptEdits模式，也叫做Ask before Edits 先询问后编辑,我喜欢叫它采纳模式，又称接受修改模式，是 Claude Code 中「高效便捷优先」的工作模式，核心是在AI修改前，先给出修改方案（创建、修改、删除文件等），然后你确认是否修改。这也是最常用的一种模式，可以知道每一项修改的位置和文件，掌控感比较强。

### 模式二：plan 模式—— 三思而后行，安全可控

>plan 模式，全称“计划模式”，是 Claude Code 中主打“安全可控、精细化开发”的工作模式。该模式的核心是“先规划、后执行”，开启后 Claude Code 不会直接执行任何修改操作（处于只读模式），而是先对用户需求进行系统性分析，生成详细的执行计划，待用户审查、确认或修改计划后，再执行相应操作。

优点： 安全性极高，只读模式可避免意外修改文件；可控性强，用户能全程掌控操作细节，减少返工；适合复杂任务，通过系统性规划提升开发效率和代码质量——据社区调研，使用 plan 模式可使开发一次成功率从 45% 提升至 82%，返工次数减少 74%；计划可纳入 Git 管理，便于追溯决策过程。

缺点： 流程相对繁琐，比 acceptEdits 模式和 bypassPermissions 模式多了“规划-审查”的环节，不适合简单、紧急的临时任务；会消耗一定的额外 token（用于生成和优化计划）。

### 模式三：Edit automatically 自动编辑模式 —— 高效自动化，省心省时间

> Edit automatically 模式，又称自动执行模式，是 Claude Code 中「高效便捷优先」的工作模式，核心作用是让 AI 自动确认并执行所有文件操作（创建、修改、删除文件等），无需人工逐一步骤确认，全程自动化完成编程相关操作，大幅减少手动干预成本。

优点： 效率极高，无需用户手动确认每一步，减少交互成本，能快速完成基础开发任务；可通过 /permissions 命令配置自动接受的特定工具，实现精细化自动化。
缺点: 自主性强，风险相对较高——若 Claude Code 对需求解析出现偏差，会直接执行错误操作（如修改错误文件、运行不合理命令），可能导致代码异常或项目损坏；不适合复杂、高风险的开发任务。

### bypassPermissions 模式 —— 极致高效，风险自负

>bypassPermissions 模式,早期我们称为Yolo模式,是 Claude Code 中主打“极致高效、无任何干预”的工作模式，也是风险最高的模式。该模式的核心是“跳过所有确认和校验步骤”，直接执行所有修改操作。不推荐在核心项目或生产环境中使用。

## 2.7 学习检查清单 ✅

完成后确认掌握以下技能：

### 核心命令

- [ ] 熟练使用 `/init` 分析项目
- [ ] 熟练使用 `/review` 审查代码
- [ ] 熟练使用 `/add-dir` 指定目录
- [ ] 熟练使用 `/agents` 调用子代理
- [ ] 熟练使用 `/compact` 压缩上下文
- [ ] 熟练使用 `/clear` 清空会话

### 提示词工程

- [ ] 能写出结构清晰的提示词
- [ ] 能提供充分的上下文信息
- [ ] 能将大任务分解为小步骤
- [ ] 能通过追问获取更多信息
- [ ] 掌握至少 5 种提示词模板

### 文件操作

- [ ] 能让 Claude 读取和分析文件
- [ ] 能让 Claude 修改现有代码
- [ ] 能让 Claude 创建新文件
- [ ] 能验证修改的正确性

---

## 2.8 下一步 👣

完成基础技能后，你将进入**第三阶段：进阶应用**的学习，内容包括：

- 🔹 完整工作流（理解代码库、修复 Bug、重构、测试）
- 🔹 Plan Mode 计划模式详解
- 🔹 管道和脚本集成
- 🔹 CLAUDE.md 项目规范配置

**预计学习时间：** 1-2 周

---

## 📚 相关资源

- [官方文档 - 最佳实践](https://code.claude.com/docs/en/best-practices)
- [知乎 - Claude Code 最佳实践](https://zhuanlan.zhihu.com/p/2009744974980331332)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---

> 💡 **小贴士**：建立一个提示词模板库，收集优秀的提示词案例，这会大幅提高你的工作效率！

[← 返回入门基础](./phase1-basics.md) | [返回目录](./learning-path.md) | [下一阶段 →](./phase3-advanced.md)
