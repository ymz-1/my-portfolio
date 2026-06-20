# Cloudflare 部署说明（改完集成工具后）

> 沉淀自架构讨论。原站点使用 **Cloudflare Pages + Next.js 静态导出**；集成 AI 文章生成器、Insight Radar 及 API 代理后，部署方式需要调整。

---

## 1. 原来 Cloudflare 上是怎么工作的

- `next.config.ts` 配置了 **`output: 'export'`**
- 执行 `npm run build` 生成 **`out/`** 目录（纯 HTML/CSS/JS）
- Cloudflare Pages 只托管静态文件，**不需要 Node 服务器**

这种模式非常适合个人作品集。

---

## 2. 改完之后和之前有什么本质区别

集成工具后，当前配置**已不再是静态导出**，主要变化如下：

| 能力 | 原来（静态导出） | 现在 |
|------|------------------|------|
| `output: 'export'` | ✅ 有 | ❌ 已去掉 |
| `rewrites` 把 `/api/*` 转发到 Python / Insight 后端 | ❌ 不支持 | ✅ 有（需 Node 运行时） |
| `/tools/ai-article`、`/tools/insight-radar` 的 Route Handler | ❌ 无 | ✅ 有（动态服务端路由） |
| `npm run start` / Node 服务器 | 不需要 | 本地/生产需要 |

**结论：** 网站从「纯静态站」变成了「**带服务端能力的 Next.js 应用**」。

### 当前相关配置（供对照）

**`next.config.ts`**

- 无 `output: 'export'`
- `rewrites`：
  - Insight Radar：`/api/keywords`、`/api/hotspots`、`/api/settings`、`/api/notifications`、`/api/check-hotspots`
  - WebSocket：`/socket.io/:path*`
  - Python 后端：其余 `/api/:path*` → `BACKEND_URL`（默认 `http://localhost:8567`）

**嵌入工具**

- AI 文章：Vue 构建产物 → `public/tools/ai-article/`，路由 `/tools/ai-article`
- Insight Radar：React 构建产物 → `public/tools/insight-radar/`，路由 `/tools/insight-radar`

**构建命令**

```bash
npm run build
# = build:ai-tool + build:insight-radar + next build
```

---

## 3. 在 Cloudflare 上分别会怎样

### 3.1 个人站首页（项目、文章、技能栈、联系等）

- 内容本身大多是静态 React 页面，**理论上仍可静态化**
- 但**按当前配置直接 build**，Cloudflare Pages **不会再**得到以前那种完整的 `out/` 静态包
- 两个工具路由依赖服务端 Route Handler（`src/app/tools/*/route.ts`），**纯静态 Pages 无法处理**

### 3.2 嵌入的两个工具

| 部分 | 能否放 Cloudflare Pages | 说明 |
|------|-------------------------|------|
| 前端静态资源 | ✅ 可以 | 已在 `public/tools/...`，本质是静态文件 |
| Python FastAPI 后端 | ❌ 不能 | 需单独部署（VPS、Railway、Render 等） |
| Insight Radar Express 后端 | ❌ 不能 | 同上，默认端口 3001 |
| `/api/*` 反向代理 | ❌ 纯静态 Pages 不行 | 依赖 Next.js `rewrites`，需 Node 或 Workers |
| WebSocket `/socket.io` | ❌ 纯静态不行 | Insight Radar 实时通知需要 |

工具页**界面可能能打开**，但没有后端时：**登录、生成文章、热点监控等功能会失败**。

### 3.3 若仍用 Cloudflare Pages「纯静态托管」

- ❌ 不能：`next start`、API 代理、Route Handler、Socket.io
- ⚠️ 可以：只部署静态资源（需改回静态方案，或手动只上传 `public` + 静态化首页）
- ⚠️ 工具 API 必须：后端部署到别处 + Workers 转发，或前端改 API 基地址（需 CORS）

### 3.4 若继续用 Cloudflare 全家桶

- 需 **Cloudflare Workers / Pages Functions / OpenNext** 等 Next.js 适配
- Next.js 16 + `rewrites` + 动态路由 + 外部后端，**比原来复杂**，不一定开箱即用
- **Python 后端仍不能**跑在 Pages 上，必须单独部署

---

## 4. 可选部署方案

### 方案 A：继续以 Cloudflare Pages 为主（改动相对小）

适合：主要展示作品集，工具可接受「后端在别处」。

1. **作品集**：恢复或保持 **静态导出**（`output: 'export'`），生成 `out/` 部署 Pages
2. **工具前端**：继续 build 到 `public/tools/...`，随静态站一起发布
3. **后端**：
   - Python：`python-backend`，单独部署
   - Insight Radar：`insight-radar/server`，单独部署
4. **API 连通**（三选一或组合）：
   - Cloudflare **Workers** 把 `你的域名/api/*` 转发到后端公网地址
   - 前端 API 基地址改为后端独立域名（需改 Vue/React 配置 + CORS）
   - 子域名分离：`api.example.com` → 后端，`www.example.com` → Pages

**注意：** 恢复静态导出后，需处理 `/tools/ai-article`、`/tools/insight-radar` 的入口（例如直接用 `public` 下 `index.html`，或 `_redirects` / SPA fallback）。

### 方案 B：保留「一个域名搞定一切」（当前架构意图）

适合：本地/生产都是 `next dev` / `next start`，同一域名访问站和 API 代理。

推荐平台：

- **Vercel**（Next.js 原生，rewrites 支持较好）
- **Railway / Render / Fly.io**（Next + 多服务）
- **自有 VPS**（Nginx/Caddy：`/` → Next，`/api` → 各后端）

Cloudflare 可只做 **DNS + CDN**，源站指向上述平台。

### 方案 C：只展示作品集，工具暂不上线

- Cloudflare Pages 静态部署首页即可
- 工具卡片链接可保留，但无后端时功能不可用（或链到 `#` / 敬请期待）

---

## 5. 本地开发对照（当前架构）

需要 **多个进程**：

```bash
# 终端 1：Python 后端（AI 文章）
cd python-backend
python -m app.main
# 默认 :8567

# 终端 2：Insight Radar 后端
cd insight-radar/server
npm install && npm run dev
# 默认 :3001

# 终端 3：Next.js 个人站（含 rewrites）
cd my-portfolio
npm run dev
# :3000
```

环境变量（生产示例）：

- `BACKEND_URL` → Python 后端地址
- `INSIGHT_BACKEND_URL` → Insight Radar 后端地址

---

## 6. 一句话总结

| 问题 | 答案 |
|------|------|
| 还能不能像之前一样 CF 静态部署？ | **不能原样沿用**，当前不是 static export |
| 首页还能不能上 Cloudflare？ | **可以**，但要回到静态方案或换 CF 的 Next 运行时 |
| 两个工具还能不能用？ | **前端能托管**；**完整功能必须另有后端 + API 代理** |
| 最省事的线上方案？ | 作品集静态上 CF Pages；后端单独部署；或整体迁到带 Node 的平台 |

---

## 7. 新窗口改代码时可优先决策的问题

1. **是否恢复 `output: 'export'`？**（决定能否继续「只部署 out」）
2. **工具是要「完整可用」还是「仅展示入口」？**
3. **后端打算部署在哪？**（决定 API / WebSocket 怎么连）
4. **是否坚持 Cloudflare Pages，还是可以换 Vercel/VPS？**

确定以上四点后，再改 `next.config.ts`、构建脚本和工具里的 API 基地址会更清晰。

---

## 8. 相关文件索引

| 文件 | 作用 |
|------|------|
| `next.config.ts` | rewrites、是否 static export |
| `package.json` | `build` / `build:ai-tool` / `build:insight-radar` |
| `src/app/tools/ai-article/route.ts` | AI 工具 HTML 入口（非静态导出时需要） |
| `src/app/tools/insight-radar/route.ts` | Insight 工具 HTML 入口 |
| `public/tools/ai-article/` | AI 工具前端构建产物 |
| `public/tools/insight-radar/` | Insight 前端构建产物 |
| `python-backend/` | AI 文章 FastAPI 后端 |
| `insight-radar/server/` | Insight Radar Express 后端 |

---

*文档生成时间：2026-06-18*
