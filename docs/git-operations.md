# Git 操作记录（2026-06-20）

> 本文档总结本次会话中由 Agent 协助执行的 Git 操作，便于日后查阅与在新窗口恢复上下文。  
> 仓库：https://github.com/ymz-1/my-portfolio

---

## 1. 操作概览

| 序号 | 操作类型 | 说明 | 结果 |
|------|----------|------|------|
| 1 | `git commit` | 作品集功能与品牌更新 | `62793f1` |
| 2 | `git push origin master` | 首次推送（用户请求「保存代码」后） | 成功 |
| 3 | `git merge --abort` | 用户自行 pull/merge 产生冲突后恢复 | 回到 `141ad2b` |
| 4 | `git commit` | 停止跟踪工具源码、调整构建 | `241784c` |
| 5 | `git push origin master` | 推送清理后的 master | 成功 |
| 6 | `git push origin master:main --force-with-lease` | 将 main 对齐 master（Cloudflare 用 main） | 成功 |

**当前远程状态（操作结束时）：**

- `origin/master` 与 `origin/main` 均指向 **`241784c`**
- 本地工作区干净，与远程同步

---

## 2. 提交详情

### Commit 1：`62793f1`

```
Restore static export with project detail pages and rebrand to 小叶.

Add /projects routes and case-study content, enable Cloudflare-friendly static build with dev-only API rewrites, and update Hero branding.
```

**主要变更（25 个文件）：**

| 类别 | 内容 |
|------|------|
| 静态导出 | `next.config.ts` 恢复 `output: 'export'`，API rewrites 仅 development |
| 项目页 | 新增 `/projects/`、`/projects/[slug]/` 及 `src/content/projects/*` |
| 组件 | `ProjectCard`、`ProjectDetailView`、`ProjectsGrid` |
| 删除 | `src/app/tools/*/route.ts`（与静态导出不兼容） |
| 部署 | `public/_redirects`（Cloudflare 工具路径） |
| 文档 | `docs/architecture.md`、`docs/cloudflare-deployment.md` |
| 品牌 | 小叶 / 8bit游牧人、`heroGreeting`、头像等 |
| 导航 | 子页面 Navbar 链接适配 |

**未纳入此次提交：**

- `新建文本文档.md`
- `需求文档.md`

---

### Commit 2：`141ad2b`（用户本地提交，非 Agent 创建）

```
commit
```

**内容：** 仅新增上述两个 Markdown 文档（248 + 52 行）。

---

### Commit 3：`241784c`

```
Stop tracking bundled tool sources and build site only for deploy.

Ignore python-backend and insight-radar locally; Cloudflare builds with build:site and public/tools assets.
```

**主要变更（205 个文件，净删约 4.4 万行）：**

| 类别 | 内容 |
|------|------|
| 停止跟踪 | `git rm -r --cached python-backend insight-radar`（**本地目录仍保留**） |
| `.gitignore` | 新增 `/python-backend/`、`/insight-radar/` |
| `package.json` | `build` 改为 `npm run build:site`（不再在 CI 构建工具源码） |
| 保留 | `public/tools/` 静态构建产物仍在仓库中 |

---

## 3. 推送与分支

### 3.1 分支关系（操作前的问题）

```
本地 master  ──► 最新代码（小叶、项目页…）
远程 master  ──► 曾落后于本地，后已同步
远程 main    ──► Cloudflare 监听分支，曾停留在旧 commit（67268da）
```

**问题：**

1. Cloudflare 绑定 **`main`**，代码却先推到 **`master`**
2. 用户 merge 远程旧 `main` 时，`data.ts`、`layout.tsx` 出现冲突（远程为旧版「构建日志 / Your Name」）

### 3.2 冲突处理

```bash
git merge --abort
```

- 取消进行中的 merge
- 工作区恢复为 **`141ad2b`**（本地代码为准，含小叶品牌与项目页）
- 清除所有 `<<<<<<<` 冲突标记

### 3.3 推送命令记录

```bash
# 第一次完整推送（6 个 commit：2e497d7..141ad2b）
git push origin master

# 清理工具源码后
git push origin master

# 让 Cloudflare 使用的 main 与 master 一致
git push origin master:main --force-with-lease
```

**`--force-with-lease` 原因：** 远程 `main` 与本地历史已分叉（含 `67268da Update data.ts` 等旧提交），需以本地为准覆盖，且避免误覆盖他人新 push。

---

## 4. 操作时间线（示意）

```mermaid
gitGraph
  commit id: "9ea0f9f"
  commit id: "2e497d7"
  commit id: "db62627"
  commit id: "fd8ffcb"
  commit id: "632a839"
  commit id: "9dd6760"
  commit id: "62793f1" tag: "Agent commit 1"
  commit id: "141ad2b" tag: "User docs"
  commit id: "241784c" tag: "Agent commit 2"
  branch main
  checkout main
  commit id: "67268da" type: HIGHLIGHT
  checkout master
  merge main id: "冲突" type: REVERSE
```

说明：用户曾尝试把旧 `main` merge 进 `master` 导致冲突；最终通过 `merge --abort` + `master:main` force-with-lease 统一到 `241784c`。

---

## 5. 当前仓库结构（Git 视角）

**仍在 Git 中跟踪：**

- Next.js 主站（`src/`、`public/` 除忽略项）
- `public/tools/ai-article/`、`public/tools/insight-radar/`（预构建静态文件）
- `docs/`、`public/_redirects`、`public/avatar.png` 等

**已不再跟踪（仅本地存在）：**

- `/python-backend/` — AI 文章 Vue 前端 + Python 后端源码
- `/insight-radar/` — Insight Radar React 前端 + Express 后端源码

**本地仍可用的脚本（未删除）：**

```bash
npm run build:ai-tool        # 需本地有 python-backend/
npm run build:insight-radar  # 需本地有 insight-radar/
npm run build:site           # Cloudflare / 默认 npm run build
```

---

## 6. Cloudflare Pages 建议配置

| 配置项 | 推荐值 |
|--------|--------|
| Production branch | **`main`** |
| Build command | `npm install && npm run build` |
| Output directory | **`out`** |
| Node version | 20+ |

构建产物为静态 `out/`，不含 Node 运行时；工具演示依赖 `public/tools/` 中的 HTML/JS。

---

## 7. 注意事项与后续建议

1. **默认开发分支**  
   本地当前在 `master`；若希望与 Cloudflare 一致，可 `git checkout -B main origin/main` 并以后在 `main` 上开发。

2. **不要再 merge 旧远程 main**  
   除非确认远程无意外更新；冲突时优先 `git merge --abort`，以本地/远程最新 `main` 为准。

3. **工具源码不在 GitHub**  
   换机器克隆仓库后没有 `python-backend/`、`insight-radar/`，需单独备份或从别处拷贝；重打工具前端前要保证本地仍有源码。

4. **推送 main 需确认**  
   `master:main --force-with-lease` 会改写远程 `main` 历史，多人协作时需事先沟通。

5. **未 push 过的文件**  
   若仍有 `新建文本文档.md`、`需求文档.md` 仅本地存在，是否提交由你自行决定。

---

## 8. 快速核对命令

```bash
# 查看当前分支与远程是否一致
git status
git log origin/main -3 --oneline
git log origin/master -3 --oneline

# 确认工具源码仅本地、未跟踪
git check-ignore -v python-backend/app/main.py
ls python-backend insight-radar

# 确认工具静态资源仍在 Git
git ls-files public/tools | head
```

---

*文档生成：2026-06-20 · 对应远程 HEAD：`241784c`*
