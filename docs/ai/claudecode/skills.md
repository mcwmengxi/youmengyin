---
description: Claude Code 技能库与最佳实践
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# Claude Code 技能库

> 🎯 **技能提升**：掌握高级技能和自动化工具，成为 Claude Code 高手

**相关文档：**

- 📖 [快速开始](./quickstart.md) - 核心指令速览
- 🗺️ [学习路径](./learning-path.md) - 完整学习路线图
- 💼 [进阶应用](./phase3-advanced.md) - 工作流和自动化
- 🚀 [高级特性](./phase4-expert.md) - 子代理和 MCP

---

## 🔥 Skills 集成

```bsah
npx skills add vuejs-ai/skills

```

## 🔥 Omni-Skills 集成

### 什么是 Omni-Skills？

Omni-Skills 是一个开源的 Claude Code 技能包集合，提供了预定义的技能模板和最佳实践。

### 快速开始

#### 安装设计技能包

```bash
npx awesome-omni-skills --claude --bundle design
```

这会下载并安装设计相关的技能包，包括：

- Figma 设计稿分析
- UI/UX 最佳实践
- 设计规范生成
- 组件设计模式

#### 可用技能包

| 技能包     | 描述           | 安装命令                                             |
| ---------- | -------------- | ---------------------------------------------------- |
| `design`   | UI/UX 设计技能 | `npx awesome-omni-skills --claude --bundle design`   |
| `frontend` | 前端开发技能   | `npx awesome-omni-skills --claude --bundle frontend` |
| `backend`  | 后端架构技能   | `npx awesome-omni-skills --claude --bundle backend`  |
| `devops`   | 运维和部署技能 | `npx awesome-omni-skills --claude --bundle devops`   |
| `security` | 安全审计技能   | `npx awesome-omni-skills --claude --bundle security` |
| `testing`  | 测试编写技能   | `npx awesome-omni-skills --claude --bundle testing`  |

#### 技能源地址

```
https://raw.githubusercontent.com/diegosouzapw/omni-skills/main/skills/omni-figma/SKILL.md
```

---

## 💡 高级提示词技巧

### 1. 链式思考（Chain of Thought）

引导 Claude 逐步思考复杂问题：

```bash
# 使用思维链提示
"Let's think step by step:
1. First, analyze the current code structure
2. Then, identify potential issues
3. Next, propose solutions
4. Finally, implement the best solution"
```

### 2. 角色设定（Role Playing）

为 Claude 设定特定角色以获得更专业的回答：

```bash
# 设定专家角色
"You are a senior software architect with 15 years of experience.
Review this code and provide feedback on:
- Architecture patterns
- Scalability concerns
- Performance optimizations
- Security considerations"

# 设定审查者角色
"You are a meticulous code reviewer.
Critically analyze this implementation for:
- Code quality
- Best practices
- Edge cases
- Documentation gaps"
```

### 3. 少样本学习（Few-Shot Learning）

提供示例让 Claude 学习模式：

```bash
"I'll show you examples of good commit messages:

Example 1:
feat(auth): add JWT token refresh mechanism
- Implemented token refresh endpoint
- Added refresh token rotation
- Updated documentation

Example 2:
fix(api): handle null user in profile service
- Added null check before accessing user properties
- Return 404 for non-existent users
- Added unit tests

Now generate a commit message for these changes: {describe changes}"
```

### 4. 对比分析（Before/After）

要求 Claude 提供对比改进：

```bash
"Refactor this function and show me:
1. The original code with issues highlighted
2. The refactored code with improvements
3. A diff comparison
4. Explanation of each change and its benefits"
```

---

## 🛠️ 自动化脚本库

### 1. 智能提交脚本

创建 `.claude/scripts/smart-commit.sh`：

```bash
#!/bin/bash
# Smart Commit with Claude Code

echo "🤖 Analyzing changes with Claude Code..."

# Get staged changes
CHANGES=$(git diff --cached)

if [ -z "$CHANGES" ]; then
  echo "❌ No staged changes found. Please stage your changes first."
  exit 1
fi

# Generate commit message
COMMIT_MSG=$(claude -p "Generate a concise conventional commit message based on these changes:
$CHANGES

Format: <type>(<scope>): <description>
Keep subject line under 72 characters.")

echo "📝 Generated commit message:"
echo "$COMMIT_MSG"
echo ""
read -p "Accept this commit message? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  git commit -m "$COMMIT_MSG"
  echo "✅ Commit successful!"
else
  echo "❌ Commit cancelled. You can manually edit the commit message."
fi
```

使用方法：

```bash
chmod +x .claude/scripts/smart-commit.sh
git add .
./scripts/smart-commit.sh
```

### 2. 代码审查脚本

创建 `.claude/scripts/auto-review.sh`：

```bash
#!/bin/bash
# Automatic Code Review

echo "🔍 Starting automated code review..."

FILES=$(git diff --name-only HEAD~1)

for file in $FILES; do
  if [[ $file == *.ts || $file == *.js || $file == *.vue ]]; then
    echo "Reviewing: $file"
    claude -p "Review this file for:
    - Code quality issues
    - Potential bugs
    - Security vulnerabilities
    - Performance concerns
    - Style guide violations

    File: $file"
  fi
done

echo "✅ Review complete!"
```

### 3. 批量类型检查脚本

```bash
#!/bin/bash
# Batch TypeScript Check

echo "📊 Running TypeScript check on all files..."

find src -name "*.ts" -type f | while read file; do
  echo "Checking: $file"
  npx tsc --noEmit "$file" 2>&1 | grep -v "error TS" || true
done

echo "✅ Type check complete!"
```

### 4. 文档生成脚本

```bash
#!/bin/bash
# Auto-generate Documentation

echo "📝 Generating API documentation..."

# Generate README
claude -p "Generate a comprehensive README.md for this project including:
- Project description
- Installation instructions
- Usage examples
- API reference
- Contributing guidelines
- License information" > README.md

# Generate API docs
mkdir -p docs/api
claude -p "Generate API documentation for all endpoints in the routes directory" > docs/api/endpoints.md

echo "✅ Documentation generated!"
```

---

## 📋 提示词模板库

### Bug 修复类

#### 模板 1：错误诊断

```markdown
## Context

- **Error**: {error message}
- **Location**: {file:line}
- **When**: {reproduction steps}

## Request

Please help me:

1. Diagnose the root cause
2. Suggest 2-3 possible fixes
3. Implement the recommended fix
4. Add tests to prevent regression
```

#### 模板 2：逻辑错误

```markdown
## Issue Description

The {feature} is not working correctly.

**Expected**: {what should happen}
**Actual**: {what actually happens}

## Code Context

{relevant code snippet}

## Analysis Needed

- What could cause this behavior?
- How to fix it without breaking other features?
- What edge cases should we consider?
```

### 代码重构类

#### 模板 3：性能优化

```markdown
## Goal

Optimize the performance of {function/module}.

## Current Issues

- Slow execution time: {metrics}
- High memory usage: {metrics}
- Bottleneck: {suspected area}

## Requirements

- Maintain backward compatibility
- Keep code readable
- Add performance tests

## Success Criteria

- Response time < {target}
- Memory usage < {target}
```

#### 模板 4：代码清理

```markdown
## Refactoring Task

Clean up and modernize {module/file}.

## Focus Areas

- Remove deprecated APIs
- Fix code smells
- Apply SOLID principles
- Improve naming
- Extract duplicate code
- Add TypeScript types

## Constraints

- Don't change public API
- Maintain test coverage
- Keep documentation updated
```

### 测试编写类

#### 模板 5：单元测试

```markdown
## Testing Task

Write comprehensive unit tests for {module}.

## Test Scenarios

✓ Happy path
✓ Edge cases
✓ Error handling
✓ Boundary conditions
✓ Concurrent operations

## Requirements

- Use {test framework}
- Mock external dependencies
- Achieve >90% coverage
- Include descriptive test names
```

#### 模板 6：集成测试

```markdown
## Integration Testing

Create integration tests for {feature/workflow}.

## Test Flow

1. Setup test data
2. Execute workflow
3. Verify results
4. Cleanup

## Assertions

- Database state
- API responses
- Side effects
- Error scenarios
```

### 文档编写类

#### 模板 7：API 文档

```markdown
## Documentation Need

Generate API documentation for {endpoint/service}.

## Include

- Endpoint URL and method
- Request parameters
- Request body schema
- Response schema
- Error codes
- Authentication requirements
- Rate limits
- Example requests/responses
```

#### 模板 8：技术设计文档

```markdown
## Design Document

Create a technical design document for {feature}.

## Sections

1. Overview and goals
2. Architecture diagram
3. Component design
4. Data model changes
5. API design
6. Security considerations
7. Performance considerations
8. Migration plan (if needed)
9. Testing strategy
10. Rollback plan
```

---

## 🎯 实战工作流模板

### 工作流 1：新功能开发

```bash
# Step 1: 需求分析
> /init
> Analyze requirements for {feature}
> Ask clarifying questions if needed

# Step 2: 技术方案
> Propose a technical implementation plan including:
> - Architecture design
> - Component breakdown
> - Data model changes
> - API design
> - Testing strategy

# Step 3: 分步实现
> Let's implement this step by step:
> Phase 1: Database migrations
> Phase 2: Backend services
> Phase 3: API endpoints
> Phase 4: Frontend components
> Phase 5: Integration and testing

# Step 4: 质量保证
> /review
> Write comprehensive tests
> Generate documentation
```

### 工作流 2：技术债务清理

```bash
# Step 1: 识别债务
> Identify technical debt in this codebase:
> - Code smells
> - Outdated patterns
> - Missing tests
> - Documentation gaps
> - Security vulnerabilities

# Step 2: 优先级排序
> Prioritize these issues by:
> - Impact on system stability
> - Security risk
> - Developer productivity
> - User experience

# Step 3: 制定计划
> Create a phased remediation plan:
> Phase 1: Critical issues (this sprint)
> Phase 2: High priority (next sprint)
> Phase 3: Medium priority (next month)
> Phase 4: Low priority (backlog)

# Step 4: 执行和改进
> Let's start with Phase 1
> Track progress and adjust plan as needed
```

### 工作流 3：代码审查准备

```bash
# Pre-submission checklist
> Before I submit this PR, please review:
> ✓ Code follows style guidelines
> ✓ All tests pass
> ✓ No TypeScript errors
> ✓ Documentation updated
> ✓ No console.log or debug code
> ✓ Error handling implemented
> ✓ Security considerations addressed

# Generate PR description
> Create a comprehensive PR description including:
> - Problem statement
> - Solution overview
> - Changes made
> - Testing performed
> - Screenshots (if UI changes)
> - Related issues
```

---

## 📊 效率提升技巧

### 1. 上下文管理

```bash
# 保持上下文简洁
> /compact  # After every 10-15 exchanges

# 清除无关上下文
> /clear  # When switching topics

# 恢复之前的会话
claude -r "session-name" "Continue working on {task}"
```

### 2. 并行任务处理

```bash
# 同时处理多个任务
> While you're generating tests, I'll ask another Claude instance to review the code

# 分工合作
> Split this refactoring into independent tasks that can be done in parallel
```

### 3. 增量验证

```bash
# 小步快跑，频繁验证
> Let's make this small change and run tests immediately
> Good, now let's proceed to the next step
```

### 4. 错误预防

```bash
# 提前识别潜在问题
> Before implementing, what could go wrong with this approach?

# 防御性编程
> Add error handling for all edge cases we identified
```

---

## 🔧 自定义技能配置

### Skills 的存放位置

| 级别       | 路径                                     | 使用范围         | 版本控制   |
| :--------- | :--------------------------------------- | :--------------- | :--------- |
| Enterprise | 由管理员配置（Managed Settings）         | 组织内所有用户   | 集中管理   |
| Personal   | `~/.claude/skills/<skill-name>/SKILL.md` | 你所有的项目     | 个人本地   |
| Project    | `.claude/skills/<skill-name>/SKILL.md`   | 当前项目         | 提交到 Git |
| Plugin     | `<plugin>/skills/<skill-name>/SKILL.md`  | 启用该插件的项目 | 随插件分发 |

同名优先级：Enterprise > Personal > Project。Plugin Skills 使用 plugin-name:skill-name 命名空间，不与其他级别冲突。

### 两大类型的 Skills：参考型和任务型

> 从工程角度，Skill 内容分为两类，参考型和任务型。参考型 Skill 影响“怎么做”，任务型 Skill 决定“做什么”。前者是语义环境，后者是具体行动。

| 类型                | 特征                              | 重点                                           | 典型列子                     |
| :------------------ | :-------------------------------- | :--------------------------------------------- | :--------------------------- |
| 参考型（Reference） | 提供知识、Claude 在当前对话中应用 | 强调“在什么场景下应用这些知识”                 | API 规范、代码风格、领域知识 |
| 任务型(Task)        | 执行具体操作步骤                  | 强调“这个操作做什么”，常斜杠命令使用`/command` | 部署流程、提交规范、代码生成 |

**参考型 Skill**

- 没有执行步骤：不是先做 A，再做 B，而是“遵循这些规范”。
- 没有输出模版：不要求 Claude 输出固定格式的报告。
- 没有设 disable-model-invocation:Claude 可以自动判断何时需要。
- 只读工具：allowed-tools 限制为 Read/Grep/Glob，因为规范查阅不需要修改代码。

description = [做什么] + [怎么做] + [什么时候用]

**任务型 Skill**

任务型 Skill 需要设置 disable-model-invocation:true（禁用模型调用）

### 创建个人 skill 文件

在 `~/.claude/skills/` 目录下创建个人技能：

#### 示例：Vue 3 专家技能(参考型)

创建 `~/.claude/skills/vue3-expert.md`：

````markdown
# Skill: Vue 3 Expert

## Role

You are a Vue 3 expert specializing in Composition API and modern Vue ecosystem.

## Expertise

- Vue 3 Composition API
- Pinia state management
- Vue Router 4
- Vite build optimization
- TypeScript with Vue 3
- Vue Test Utils

## Guidelines

- Always use `<script setup>` syntax
- Prefer Composition API over Options API
- Use TypeScript for all components
- Follow Vue 3 style guide
- Recommend Pinia over Vuex
- Use Vite for development

## Common Patterns

### Component Structure

    ```vue
    <script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    // Props
    const props = defineProps<{
      title: string
      count?: number
    }>()

    // Emits
    const emit = defineEmits<{
      update: [value: string]
      delete: []
    }>()

    // State
    const localCount = ref(0)

    // Computed
    const totalCount = computed(() => {
      return localCount.value + (props.count ?? 0)
    })

    // Watch
    watch(() => props.count, (newVal) => {
      console.log('Count changed:', newVal)
    })
    </script>
    ```

### State Management

    ```typescript
    // stores/user.ts
    import { defineStore } from 'pinia'

    export const useUserStore = defineStore('user', {
      state: () => ({
        user: null as User | null,
        isLoading: false
      }),
      actions: {
        async fetchUser(id: string) {
          this.isLoading = true
          try {
            this.user = await api.getUser(id)
          } finally {
            this.isLoading = false
          }
        }
      }
    })
    ```
````

#### 任务型技能

```markdown
.claude/skills/gitpush/ # skill 目录，名称即 skill 名
└── SKILL.md # 主文件（必需）

---

name: gitpush
description: 自动用 git 提交代码并推送到远程仓库。当用户输入 `/gitpush` 时触发此技能。功能包括：自动暂存所有更改、自动生成提交信息、自动提交到本地仓库、自动推送到远程分支。成功后报告提交状态、文件数量和耗时。
disable-model-invocation:true

---

# GitPush 技能

自动完成 git 提交流程：暂存 → 生成提交信息 → 提交 → 推送到远程仓库。

## 执行步骤

### 1. 检查 git 状态

使用 `git status` 检查当前仓库状态，确认是否有可提交的内容。

### 2. 暂存更改

如果有待提交的文件，执行 `git add -A` 暂存所有更改。

### 3. 生成提交信息

执行 `git diff --cached --stat` 获取暂存的变更统计，然后：

- 如果有新增文件，提取新增文件的文件名
- 如果有修改文件，提取修改的文件名
- 根据变更内容生成简洁的提交信息，格式：`feat: 描述` / `fix: 描述` / `docs: 描述` / `chore: 描述`

### 4. 执行提交

使用生成的提交信息执行 `git commit -m "提交信息"`

### 5. 推送到远程

执行 `git push` 推送到远程仓库。如果当前分支没有上游跟踪，执行 `git push -u origin master` 设置上游并推送。

## 输出格式

### 成功时

✓ 提交成功！

- 提交信息: xxx
- 变更文件: x 个新增, x 个修改, x 个删除
- 耗时: x 秒
- 远程推送: 已完成

### 失败时

✗ 提交失败
原因: [具体错误信息]

可能的原因：

- 无可提交的内容（工作区干净）
- 未连接到远程仓库
- 远程仓库拒绝推送（权限问题或冲突）
- 网络连接失败

### 无需提交时

✓ 工作区没有可提交的内容

## 注意事项

1. 始终使用 `git add -A` 暂存所有更改
2. 提交信息使用中文，简洁明了
3. 推送到当前分支的远程对应分支
4. 如果推送失败，尝试显示具体的 git 错误信息
5. 记录每个步骤的耗时，最后汇总报告
```

### 使用个人技能

```bash
> use the vue3-expert skill to create a user profile component
```

---

## 📚 学习资源

### 官方资源

- [Claude Code 官方文档](https://code.claude.com/docs)
- [Anthropic 博客](https://www.anthropic.com/news)
- [MCP 协议文档](https://modelcontextprotocol.io/)

### 社区资源

- [Omni-Skills GitHub](https://github.com/diegosouzapw/omni-skills)
- [cc-switch 项目](https://github.com/farion1231/cc-switch)
- [知乎专栏 - Claude Code 最佳实践](https://zhuanlan.zhihu.com/p/2009744974980331332)

### 进阶学习

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [AI Engineering Books](https://github.com/therealpekov/awesome-ai-engineering)

---

## 🎯 实践任务

### 任务 1：安装技能包

- [ ] 安装 design 技能包
- [ ] 安装 frontend 技能包
- [ ] 尝试使用一个技能完成实际任务
- [ ] 记录使用体验和改进建议

### 任务 2：创建提示词模板

- [ ] 为你的常用场景创建 3 个提示词模板
- [ ] 保存到 `.claude/prompts/` 目录
- [ ] 在实际项目中使用这些模板
- [ ] 持续优化模板质量

### 任务 3：自动化脚本

- [ ] 创建一个智能提交脚本
- [ ] 创建一个自动审查脚本
- [ ] 集成到你的日常工作流
- [ ] 分享给团队成员

### 任务 4：个人技能开发

- [ ] 基于你的专长领域创建个人技能
- [ ] 定义角色、准则和模式
- [ ] 在实际项目中应用
- [ ] 收集反馈并改进

---

## ✅ 技能检查清单

### 基础技能

- [ ] 熟练使用 Omni-Skills
- [ ] 掌握高级提示词技巧
- [ ] 能创建自动化脚本
- [ ] 建立了提示词模板库

### 进阶技能

- [ ] 能设计复杂工作流
- [ ] 会创建自定义技能
- [ ] 能优化团队工作流
- [ ] 建立了个人知识库

### 专家技能

- [ ] 能培训他人
- [ ] 贡献社区内容
- [ ] 创造新的最佳实践
- [ ] 推动技术发展

---
