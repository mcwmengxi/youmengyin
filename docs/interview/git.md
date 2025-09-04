# git 相关面试题

## 说说Git中 fork, clone,branch这三个概念，有什么区别

- fork 只能对代码仓进行操作，且 fork 不属于 git 的命令，通常用于代码仓托管平台的一种“操作”。是复制一个远程仓库到你的 GitHub 账户下，通常用于开源项目的贡献。
- clone 是 git 的一种命令，它的作用是将文件从远程代码仓下载到本地，从而形成一个本地代码仓
- branch 特征与 fork 很类似，fork 得到的是一个新的、自己的代码仓，而 branch 得到的是一个代码仓的一个新分支。在一个仓库内创建不同的开发路径，使得多个开发任务可以并行进行。

## 什么是 git flow，如何配置一个 git flow

git-flow 并不会为 Git 扩展任何新的功能，它仅仅使用了脚本来捆绑了一系列 Git 命令来完成一些特定的工作流程。

进行开发分支、发布分支的命名、开发、修复、发布等行为做了规范命名。

可以基于工具 gitflow 进行初始化，，，，等

## git rebase 和 git merge 有什么区别

- git merge:

  将两个分支的历史整合在一起，创建一个新的“合并提交”。
  保留了所有提交的完整历史，形成了一棵“树状图”，显示了分支的合流点。

- git rebase:

  将一个分支的所有提交“移动”到另一个分支的基础上。
  通过重新应用提交，改变了提交的历史，使得提交看起来像是线性的。

## 常用的 git 命令有哪些

<https://github.com/gg8899/fe-interview/issues/91>

## 多分支怎么出来协同开发的情况

协同环境开发的环境，使用多分支开发模式。同时保持代码的整洁和组织性。

- 主分支 Main/Master
- 开发分支 Develop
- 功能分支 Feature
- 修复分支 Fix/Bugfix
- 发布分支 Release
- 热修复分支 Hotfix
- 多分支协同开发的好处：

多分支协同开发的好处：

- 提高开发效率：多个开发者可以在各自的分支上工作，互不干扰，且可以并行完成多个任务。
- 更高的代码质量：通过功能分支和修复分支的管理，可以确保每个小功能或修复都经过单独测试，避免直接对主分支造成影响。
- 更易于追踪和回溯：每个分支都有明确的目的和任务，能够帮助团队轻松追踪问题来源和变动历史。

stash 命令

- git stash 当前工作目录（未暂存的更改）和暂存区（已暂存的更改）都保存到一个栈中，并将工作目录和暂存区恢复到最近一次提交的状态。
- git stash list 列出所有的stash内容。每个stash都会被标记一个编号，如stash@{0}。
- git stash apply 应用最近一次保存的stash（不删除stash）。你也可以指定要应用的特定stash编号。
- git stash pop 应用最近一次保存的stash并删除它。如果指定了stash编号，它会应用并删除对应的stash。
- git stash drop 删除指定的stash（不应用）。如果不指定编号，会删除最近一个stash。
- git stash clear 删除所有的stash，清空stash栈。

## 如何在 git 提交的时候避开提交的校验

在 git 提交的时候通常设置两个 hooks 用来拦截不规范的代码提交：

pre-commit
pre-push
如果要跳过校验的话。这样做：

git push origin 分支名 --no-verify
git commit -m "提交信息" --no-verify   # 或简写为 -n

仅对git合并冲突时跳过校验

```bash

#!/bin/sh
#. "$(dirname "$0")/_/husky.sh"

# Define the rebase and merge paths
REBASE_PATH="$(git rev-parse --git-path rebase-merge)"      # directory
MERGE_PATH="$(git rev-parse --git-path MERGE_HEAD)"         # file

# Check if the rebase or merge path exists.
# If they don't, it's a normal commit and we can run the pre-commit hook
if [ -d "$REBASE_PATH" ] || [ -f "$MERGE_PATH" ]; then
  echo "Skipping Husky pre-commit hook: We are in the middle of a rebase or merge."
else
  echo "Running Husky pre-commit hook: Formatting affected files"
  npm run lint-staged
fi

```

## git pull 和 git fetch 有什么区别

git pull 和 git fetch 都是用来从远程仓库获取更新的命令，但它们有些区别：

- git fetch：

  git fetch 会从远程仓库下载所有最新的提交和分支更新，但是它不会自动合并这些更改到你本地的工作目录。
  获取完更新后，远程分支的更新会被保存在你本地的远程追踪分支中（例如 origin/main），你需要手动执行 git merge 或 git rebase 来将这些更改合并到当前分支。
- git pull：

  git pull 会先执行 git fetch，然后会自动尝试合并远程的更改到你当前的工作分支。
  如果有冲突，需要你解决冲突后才能完成合并。
  简而言之，git fetch 是获取更新而不做任何更改，而 git pull 则是获取并且直接合并更新。

## 说说 git 发生冲突的场景？如何解决

Git冲突通常发生在多个开发人员在相同的代码文件的同一部分进行修改时，Git无法自动合并这些更改。常见的场景包括：

1. 多个人在同一行上进行修改：例如，A和B分别在同一个文件的相同位置进行了不同的更改。当A先提交并推送，B在拉取最新的代码后也试图推送自己的更改时，Git就无法自动合并这些冲突。

2. 删除和修改同一文件：如果某个文件被A删除了，而B在本地修改了该文件，这时在合并时也会产生冲突。

3. 合并分支时的冲突：例如，你在一个分支上进行了一些修改，而另一个开发者在主分支上进行了不同的修改。当你尝试将你的分支合并到主分支时，Git可能会因为内容不一致而产生冲突。

解决Git冲突的步骤：

1. **发现冲突**：执行git pull或git merge时，如果Git发现无法自动合并的内容，它会标记出冲突的文件，并显示冲突的信息。

2. **检查冲突**的文件：打开冲突的文件，Git会用特殊的标记来显示冲突的地方，通常是：

    ```bash
    /<<<<<<< HEAD
    你的修改内容
    ======= 

    合并的修改内容
    />>>>>>> branch-name
    ```

    你需要决定保留哪一部分，或者合并两者的内容。

3. **解决冲突**：编辑文件，选择要保留的代码，删除标记部分。确保文件的逻辑正确且能通过编译或运行。

    添加解决后的文件：冲突解决后，使用 `git add <file>`命令标记这些文件已解决冲突。

4. **提交合并**：最后，使用git commit提交合并的结果。如果是合并分支时发生的冲突，Git会自动生成一条合并信息，你可以编辑它，或者直接提交。

5. **推送更新**：解决冲突并提交后，使用git push将更新推送到远程仓库。

这就是Git冲突的处理过程。关键是理解冲突的内容，手动合并并确保代码的正确性。

## 什么是 Git Hook？前端开发中有哪些应用场景

Git Hook 是 Git 提供的一种机制，允许用户在 Git 运行特定操作（如提交、推送、合并等）之前或之后执行自定义脚本。通过 Git Hook，开发者可以在工作流程中加入自动化的步骤，例如代码检查、自动测试、格式化代码等。Git Hook 脚本通常存放在项目的 .git/hooks 目录下。

Git Hook 的常见类型：
pre-commit: 在 git commit 命令执行前触发，可以用于代码格式检查、静态分析等。
commit-msg: 用于验证提交信息的格式，确保提交信息符合规范。
pre-push: 在 git push 之前触发，常用于执行自动化测试，确保代码在推送前是可工作的。
post-merge: 在执行 git merge 后触发，常用于同步环境或自动化处理合并后的一些工作。
前端开发中的应用场景：
代码格式化与规范检查：

使用 pre-commit hook 在提交前自动运行代码格式化工具（如 Prettier 或 ESLint），确保代码符合团队的风格规范。
单元测试与自动化测试：

在 pre-push hook 中，触发单元测试或集成测试，确保没有破坏现有功能。
提交信息规范：

使用 commit-msg hook 验证提交信息格式，确保符合规范（如遵循 Angular 规范、使用简洁的提交信息等）。
依赖管理与版本控制：

在合并或推送时使用 Git Hook 来检查是否有未更新的依赖，确保依赖的版本与项目的要求一致。
构建与打包：

在推送之前或合并后触发构建脚本，确保代码是最新的、已构建并准备好部署。
通过使用 Git Hook，前端开发团队可以确保开发过程中自动化的质量控制，减少人为错误，提高工作效率。

## 如何修改最近的提交信息

你可以使用以下命令来修改最近一次提交的信息：

git commit --amend [-m "修改的信息“]
这个命令会打开你的默认文本编辑器，让你修改提交信息。如果你不想修改代码，只修改提交信息，可以在修改完成后保存并退出编辑器。

如果你已经推送过该提交到远程仓库，并且想要更新远程仓库上的提交信息，可以使用：

git push --force
但请注意，使用 --force 推送会覆盖远程仓库中的提交，因此在多人协作时要小心使用。

git rebase -i  是 Git 中用来交互式地修改提交历史的命令。它允许你对多个提交进行修改、删除、合并等操作。

## 前端项目中 .gitignore 文件的作用是什么？通常会忽略哪些文件

.gitignore 的作用

- 避免提交无用文件：比如编译产物、日志文件、依赖文件等，这些文件通常不需要版本控制。
- 保护敏感信息：防止提交包含密码、API Key、环境变量等敏感信息的文件（如 .env）。
- 减少仓库体积：忽略大文件或自动生成的文件（如 node_modules），提高 Git 操作效率。
- 统一团队规范：确保所有开发者忽略相同的文件，避免冲突。

```bash
# 依赖
node_modules/

# 构建产物
dist/
build/
*.js.map
*.css.map

# 环境变量
.env
.env.local

# 日志
*.log
npm-debug.log*

# 编辑器
.vscode/
.idea/
.DS_Store

# 测试
coverage/
.nyc_output/

```

## 如何查看提交历史？有哪些常用选项？

要查看提交历史，通常有几种常用的方法和选项。以下是几种常用的方式，适用于 Git 等版本控制工具：

1. `git log`

    这是查看 Git 提交历史的基本命令。它显示了提交的历史记录，默认按时间倒序列出所有提交。

    ```bash
    git log
    ```

2. `git log --oneline`

    如果你希望简洁地查看每次提交，可以使用 --oneline 选项，这样每次提交将以一行显示，包括简短的提交哈希值和提交信息。

    ```bash
    git log --oneline
    ```

3. `git log --graph`  

    用于以图形化方式展示提交历史，帮助理解分支合并的情况。

    ```bash
    git log --graph
    ```

4. `git log --author=<author_name>`

    如果你只想查看特定作者的提交，可以使用此选项来过滤提交。

    ```bash
    git log --author="作者名称"
    ```

5. `git log --since="date" 和 git log --until="date"`

    这些选项允许你指定查看某一时间段内的提交。

    ```bash
    git log --since="2025-01-01" --until="2025-07-01"
    ```

6. `git log --stat`

    此命令显示每个提交所做的修改统计信息，包括文件修改的行数。

    ```bash
    git log --stat
    ```

7. `git log -p`

    如果你想查看每次提交时具体的差异（diff），可以使用 -p。

    ```bash
    git log -p
    ```

8. `git log --reverse`

    默认情况下，git log 会按时间倒序显示提交记录。使用 --reverse 选项可以按时间顺序显示提交历史。

    ```bash
    git log --reverse
    ```

9. `git log --abbrev-commit`
    显示缩短版的提交哈希值。

    ```bash
    git log --abbrev-commit
    ```

    这些选项可以组合使用，帮助你根据不同需求来查看提交历史。比如：

    `git log --oneline --graph --author="John" --since="2025-01-01"`

10. `git log --since="2023-01-01"`

    该命令将显示从 2023年1月1日 以来的所有提交历史。

    `git log --since="2023-01-01"`

11. `git log --until="2023-12-31"`

    该命令将显示到 2023年12月31日 为止的所有提交历史。
    `git log --until="2023-12-31"`

12. 如果你想要查看2023年全年的提交记录，可以将这两个选项组合起来：

    ```bash
      git log --since="2023-01-01" --until="2023-12-31"
    ```

    这样，你就能查看 2023年1月1日 到 2023年12月31日 之间的所有提交记录。
