---
description: Claude Code 完整使用指南
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# Claude Code 使用指南

Claude Code 是一个强大的 AI 编码工具，支持读取代码库、编辑文件、运行命令。

## 安装

### macOS / Linux / WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

### Homebrew (macOS)

```bash
brew install --cask claude-code
```

### npm

```bash
npm install -g @anthropic-ai/claude-code
```

## 配置(替换大模型)

替换大模型-阿里千问（Qwen3）

### 方法1.环境变量配置

```bash
ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/apps/anthropic
ANTHROPIC_AUTH_TOKEN=YOUR_DASHSCOPE_API_KEY   # 用百炼 API KEY 替换 YOUR_DASHSCOPE_API_KEY
ANTHROPIC_MODEL=qwen3-coder-plus # 可按需替换为其他支持的模型。
```

### 方法2.配置系统配置文件

windows 系统配置文件目录：C:\Users[用户名].claude\settings.json

<!-- qwen3-coder-plus -->

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "xxxxx",
    "ANTHROPIC_MODEL": "qwen3-coder-plus",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

<!-- claude模型 -->

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://htsajwyhqfzijtujsfnefjhfegtu.func.edgecloudapp.com/v1/155f884022127beda83e7ed36ec143c3/webding-ai",
    "ANTHROPIC_AUTH_TOKEN": "xxxxxx",
    "ANTHROPIC_MODEL": "claude-sonnet-4-6",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

## 多个模型如何能快速切换

[CC Switch](https://github.com/farion1231/cc-switch)

## VSCode中使用Claude Code

>安装claude code 插件

## 基本命令

| 命令                          | 说明                     |
| ----------------------------- | ------------------------ |
| `claude`                      | 启动交互式 REPL          |
| `claude "query"`              | 带初始提示启动           |
| `claude -p "query"`           | 单次查询后退出           |
| `claude -c`                   | 当前目录中继续最近的会话 |
| `claude -r "session" "query"` | 恢复指定会话             |
| `claude update`               | 更新到最新版本           |
| `claude commit`               | 创建 Git 提交            |
| `/clear`                      | 清除对话历史             |
| `/help`                       | 显示可用命令             |
| `exit` 或 `Ctrl+C`            | 退出                     |

## 常用 Flags

| Flag                             | 说明                   |
| -------------------------------- | ---------------------- |
| `--continue`, `-c`               | 继续最近的会话         |
| `--dangerously-skip-permissions` | 跳过所有权限提示       |
| `--permission-mode plan`         | 计划模式（只读分析）   |
| `--allowedTools`                 | 允许的工具列表         |
| `--add-dir`                      | 添加额外工作目录       |
| `--debug`                        | 启用调试模式           |
| `--chrome`                       | 启用 Chrome 浏览器集成 |

## 常见工作流

### 1. 理解新代码库

```bash
cd /path/to/project
claude
> give me an overview of this codebase
> explain the main architecture patterns
> what are the key data models?
```

### 2. 修复 Bug

```bash
claude "I'm seeing an error when I run npm test"
claude "suggest ways to fix the @ts-ignore in user.ts"
claude "update user.ts to add the null check"
```

### 3. 重构代码

```bash
claude "find deprecated API usage"
claude "refactor utils.js to use ES2024 features"
claude "run tests for the refactored code"
```

### 4. 编写测试

```bash
claude "write tests for the auth module"
claude "run the tests and fix any failures"
```

### 5. 创建 PR

```bash
claude "commit my changes with a descriptive message"
claude "create a PR for this feature"
```

### 6. 代码审查

```bash
claude "review my recent code changes for security issues"
claude "check for type errors"
```

## Plan Mode（计划模式）

用于复杂重构或多文件修改前的计划。

```bash
# 启动计划模式
claude --permission-mode plan

# 单次查询
claude --permission-mode plan -p "Analyze the auth system"
```

在计划模式下：

- Claude 只执行只读操作
- 使用 Shift+Tab 切换模式
- 适合探索代码库和规划复杂变更

## 管道和脚本

```bash
# 处理管道内容
cat logs.txt | claude -p "explain these errors"

# 监控日志
tail -f app.log | claude -p "alert if you see anomalies"

# 批量操作
git diff main --name-only | claude -p "review for security issues"
```

## CLAUDE.md 配置

在项目根目录创建 `CLAUDE.md` 文件来设置编码规范：

````
# Project Guidelines

## Coding Standards

- Use TypeScript for all new files
- Follow ESLint rules
- Write tests for new features

## Architecture

- Use React functional components
- Follow the service/repository pattern

## Review Checklist

- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Code is documented
```

## Subagents（子代理）

创建专用子代理处理特定任务：

```bash
# 查看可用子代理
> /agents

# 使用特定子代理
> use the code-reviewer subagent to check auth module

# 创建自定义子代理
> /agents
# 选择 "Create New subagent"
```

## MCP 集成

Model Context Protocol 用于连接外部数据源：

```bash
# 配置 MCP
claude mcp

# 常见 MCP 服务器
- Google Drive
- Jira
- Slack
- 自定义工具
```

**📚 扩展阅读：**
- [🔌 插件功能完全指南](./plugins.md) - 学习如何创建和使用插件扩展能力
- [MCP 协议文档](https://modelcontextprotocol.io/)

## 最佳实践

1. **明确描述任务** - 越具体越好
2. **提供上下文** - 包含错误信息、文件路径
3. **分步骤执行** - 复杂任务分解为小步骤
4. **验证结果** - 让 Claude 运行测试验证
5. **使用 CLAUDE.md** - 设置项目规范

## 调试技巧

```bash
# 启用调试
claude --debug "api,mcp"

# 查看 API 请求
claude --debug "api"

# 排除某些调试
claude --debug "!statsig,!file"
```

## 故障排除

| 问题     | 解决方案                   |
| -------- | -------------------------- |
| 登录失败 | 运行 `claude` 重新登录     |
| 权限问题 | 检查 `--allowedTools` 设置 |
| 更新失败 | 手动运行 `claude update`   |
| 性能慢   | 使用更具体的提示           |

## 资源

- 文档: <https://code.claude.com/docs>
- CLI 参考: <https://code.claude.com/docs/en/cli-reference>
- 最佳实践: <https://code.claude.com/docs/en/best-practices>
- claude code 最佳实践:<https://zhuanlan.zhihu.com/p/2009744974980331332>

[Claude Code 消耗监控统计神器](https://cloud.tencent.com/developer/article/2623892)
[CCUsage](https://sspai.com/post/101733)
[在 VSCode 中直接使用 Claude Code 编程](https://blog.csdn.net/weixin_64316191/article/details/157771642)
[ccswich 可以快速切换 Claude code 源](https://github.com/farion1231/cc-switch)
