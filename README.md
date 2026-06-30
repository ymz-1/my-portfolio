# Personal Portfolio / 个人作品集

一个个人作品集单页站。

A single-page developer portfolio with an indie-creator / pixel-game vibe. 

## 技术栈 / Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**（设计令牌写在 `globals.css` 的 `@theme inline`）
- **Framer Motion** — 进场 / 滚动 / 微交互动画
- **Three.js + React Three Fiber + drei** — 可选的低多边形 3D 场景（`components/three/HeroScene.tsx`）
- 自建组件（借鉴 Magic UI / Aceternity / cult-ui）

## 设计风格 / Design Language

- 配色：雾面紫灰（主色 `#a78bfa`、次色 `#7c7a90`、点缀 `#c4b5fd`），深色背景，仅深色主题
- 像素游戏感：像素字体（Press Start 2P，仅用于小标签/数字）、CRT 扫描线、8-bit 像素描边、闪烁光标
- 质感：全屏胶片噪点（grain）叠层、玻璃拟态卡片、发光圆形与网格母题
- Hero 为 qzq.at 式「名片卡片」：姓名 + 角色列表，外围同心虚线圆环与漂浮小图标

## 快速开始 / Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

其它命令：

```bash
npm run build    # 生产构建
npm run start    # 运行生产构建
npm run lint     # 代码检查
```

## 如何替换为你自己的内容 / Customize

几乎所有文字与数据都集中在一个文件里：

### `src/content/data.ts`

- `profile` — 姓名、头像缩写、所在地、邮箱、角色标签、自我介绍、`now` 近况状态
- `socialCards` — 首页 qzq.at 式频道卡片（平台、昵称、多项数据、简介）
- `socials` — About 区的简易社交卡片
- `skillGroups` — 技能分组与熟练度（0–100）
- `projects` — 项目列表（标题、描述、标签、链接、封面渐变色）
- `experiences` — 工作经历时间线
- `timeAllocation` / `interests` / `counters` — 数据可视化用的数字
- `contactLinks` — 底部 / 联系区的社交链接

> 带 `{ zh, en }` 的字段会随语言切换自动显示对应文本。

### 其它可改的地方

- UI 文案（按钮、标题、标签等）：`src/lib/i18n/dictionaries/zh.ts` 与 `en.ts`
- 配色 / 字体 / 设计令牌 / grain / 扫描线 / 像素工具：`src/app/globals.css`
- SEO / OG 元信息与字体：`src/app/layout.tsx`
- 3D 造型与配色：`src/components/three/HeroScene.tsx`

## 目录结构 / Structure

```
src/
  app/                 # 布局、全局样式、页面入口
  components/
    layout/            # 导航栏、页脚、回到顶部、章节容器
    sections/          # Hero / SocialCards / About / TechStack / Projects / Experience / Stats / Contact
    three/             # React Three Fiber 3D 场景（HeroScene）
    ui/                # 复用 UI 组件（GlowCard、Marquee、NumberTicker、SkillBar、icons…）
  content/data.ts      # ★ 集中内容（改这里）
  lib/
    i18n/              # 双语 Provider 与字典（zh / en）
    utils.ts           # cn() 工具
    useMediaQuery.ts   # 响应式断点 hook
```

## 页面分区 / Sections

首页（Home）名片卡片 → 频道卡片（Channels）→ 关于（About）→ 技术栈（Stack）→ 项目（Projects）→ 经历（Experience）→ 数据（Stats）→ 联系（Contact）。

## 备注 / Notes

- 仅深色主题。
- 双语通过轻量 `LanguageProvider`（Context + 字典）实现，导航栏右上角切换，偏好保存在 `localStorage`。
- 单页作品集，未接入文章 CMS；当前为占位内容。
