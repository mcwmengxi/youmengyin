---
description: Claude Code 入门基础 - 环境搭建与基本命令
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

# 第一阶段：入门基础（1-2 天）

> 🎯 **学习目标**：成功安装 Claude Code 并掌握基本命令，能够进行简单的交互

---

## 1.1 环境搭建 ⚙️

### 安装 Claude Code

根据你的操作系统选择安装方式：

#### Windows PowerShell
```powershell
irm https://claude.ai/install.ps1 | iex
```

#### macOS / Linux
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Homebrew (macOS)
```bash
brew install --cask claude-code
```

#### npm (跨平台)
```bash
npm install -g @anthropic-ai/claude-code
```

### 验证安装
```bash
claude --version
```

---

## 1.2 配置 API 🔑

### 方法一：环境变量配置

#### Windows (PowerShell)
```powershell
$env:ANTHROPIC_BASE_URL="https://dashscope.aliyuncs.com/apps/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="YOUR_DASHSCOPE_API_KEY"
$env:ANTHROPIC_MODEL="qwen3-coder-plus"
```

#### macOS / Linux (Bash/Zsh)
```bash
export ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/apps/anthropic
export ANTHROPIC_AUTH_TOKEN=YOUR_DASHSCOPE_API_KEY
export ANTHROPIC_MODEL=qwen3-coder-plus
```

### 方法二：配置文件

#### Windows 配置文件
位置：`C:\Users\[用户名]\.claude\settings.json`

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "ANTHROPIC_MODEL": "qwen3-coder-plus",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

#### macOS / Linux 配置文件
位置：`~/.claude/settings.json`

内容同上。

### 模型推荐配置

#### 阿里百炼模型（性价比高）
```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://dashscope.aliyuncs.com/apps/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxx",
    "ANTHROPIC_MODEL": "qwen3-coder-plus"
  }
}
```

#### Claude 官方模型（效果最佳）
```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-ant-xxxxx",
    "ANTHROPIC_MODEL": "claude-sonnet-4-20250514"
  }
}
```

---

## 1.3 第一个命令 🎉

### 启动交互式 REPL
```bash
claude
```

你会看到欢迎界面和提示符 `>`。

### 查看帮助
```bash
> /help
```

这会显示所有可用的命令列表。

### 退出程序
```bash
> exit
```

或使用快捷键：
- `Ctrl+C` - 强制退出
- `Ctrl+D` - 发送 EOF

---

## 1.4 基本启动方式 🚀

### 方式一：交互式会话
```bash
claude
```
进入交互式对话模式，可以连续提问。

### 方式二：带初始查询启动
```bash
claude "解释一下什么是闭包"
```
直接提出问题并开始对话。

### 方式三：单次查询（推荐用于脚本）
```bash
claude -p "解释这段代码的功能"
```
执行一次查询后自动退出。

### 方式四：继续最近的会话
```bash
claude -c
```
恢复上一次未完成的对话。

---

## 1.5 常用 Flags 📌

| Flag | 说明 | 示例 |
|------|------|------|
| `--continue`, `-c` | 继续最近的会话 | `claude -c` |
| `--dangerously-skip-permissions` | 跳过所有权限提示 | `claude --dangerously-skip-permissions` |
| `--permission-mode plan` | 计划模式（只读分析） | `claude --permission-mode plan` |
| `--allowedTools` | 允许的工具列表 | `claude --allowedTools Read,Edit` |
| `--add-dir` | 添加额外工作目录 | `claude --add-dir ./src` |
| `--debug` | 启用调试模式 | `claude --debug "api,mcp"` |
| `--chrome` | 启用 Chrome 浏览器集成 | `claude --chrome` |

---

## 1.6 会话管理命令 💬

### /clear - 清空上下文
当对话历史太长或想开始时：
```bash
> /clear
```

**使用场景：**
- 开始新话题
- 清除错误的上下文信息
- 释放 Token 额度

### /compact - 压缩上下文
保留重要信息，压缩对话历史：
```bash
> /compact
```

**使用场景：**
- 长对话后节省 Token
- 保留关键结论
- 提高后续响应速度

### /resume - 恢复会话
恢复指定的会话：
```bash
claude -r "session-name" "继续昨天的工作"
```

---

## 1.7 实践任务 ✍️

完成以下任务来巩固学习：

### 任务 1：完成首次安装
- [ ] 选择适合的安装方式并完成安装
- [ ] 运行 `claude --version` 验证安装
- [ ] 截图记录版本号

### 任务 2：配置 API Key
- [ ] 获取 API Key（阿里百炼或 Anthropic 官方）
- [ ] 选择环境变量或配置文件方式完成配置
- [ ] 测试连接是否成功

### 任务 3：第一次交互
- [ ] 使用 `claude` 启动交互式会话
- [ ] 输入 `/help` 查看帮助
- [ ] 问一个问题："你好，请介绍一下你自己"
- [ ] 使用 `exit` 退出

### 任务 4：尝试不同启动方式
- [ ] 用 `claude "解释什么是递归"` 启动
- [ ] 用 `claude -p "1+1 等于几"` 执行单次查询
- [ ] 比较两种方式的差异

### 任务 5：体验会话管理
- [ ] 进行 5 轮对话
- [ ] 使用 `/compact` 压缩对话
- [ ] 使用 `/clear` 清空对话
- [ ] 观察 Token 使用情况

---

## 1.8 常见问题 ❓

### Q1: 安装失败怎么办？
**解决方案：**
1. 检查网络连接
2. 尝试使用 npm 安装：`npm install -g @anthropic-ai/claude-code`
3. 检查 Node.js 版本（建议 v16+）

### Q2: API Key 无效？
**解决方案：**
1. 确认 API Key 格式正确
2. 检查是否有余额
3. 确认 Base URL 配置正确
4. 查看错误日志获取详细信息

### Q3: 响应速度很慢？
**解决方案：**
1. 检查网络连接
2. 切换到更近的服务器节点
3. 使用 `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` 禁用非必要流量

### Q4: 如何查看日志？
```bash
claude --debug "api" "你的问题"
```
日志会输出到控制台。

---

## 1.9 学习检查清单 ✅

完成后确认以下技能点：

- [ ] 成功安装 Claude Code
- [ ] 正确配置 API Key
- [ ] 能够启动交互式会话
- [ ] 会使用 `/help` 查看帮助
- [ ] 掌握至少 3 种启动方式
- [ ] 理解 `/clear` 和 `/compact` 的作用
- [ ] 完成所有实践任务

---

## 1.10 下一步 👣

完成入门基础后，你将进入**第二阶段：基础技能**的学习，内容包括：

- 🔹 核心 Slash 命令详解（`/init`, `/review`, `/agents` 等）
- 🔹 提示词工程技巧
- 🔹 文件读写操作
- 🔹 实际项目开发流程

**预计学习时间：** 3-5 天

---

## 📚 相关资源

- [官方文档 - 安装指南](https://code.claude.com/docs/getting-started/installation)
- [官方文档 - CLI 参考](https://code.claude.com/docs/en/cli-reference)
- [阿里百炼 API 文档](https://help.aliyun.com/zh/dashscope/)
- [CC Switch - 快速切换模型源](https://github.com/farion1231/cc-switch)

---

> 💡 **小贴士**：建议在学习过程中做好笔记，记录遇到的问题和解决方案，这将在后续学习中发挥重要作用！

[返回目录](./learning-path.md) | [下一阶段 →](./phase2-fundamentals.md)
