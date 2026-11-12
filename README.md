# 接单简历与作品集

- **日期**：2026-11-12
- **owner**：WorkBuddy
- **用途**：云队友等外包/自由工作平台上传用的 Word / PDF，以及可部署到 GitHub Pages / Vercel / Netlify 的在线简历。

一份数据，三份产物。改 `data/profile.json`，跑一次 `python3 tools/build.py`，Word、PDF、在线站点全部同步更新；加作品只需往 `projects` 数组里加一条，页面卡片、筛选、灯箱、打印版会自动带上。

## 目录

```
resume-online/
├── index.html                    在线简历（单页 · 4 套可切换主题）
├── assets/
│   ├── style.css                 设计令牌单源 + 4 套主题
│   ├── app.js                    数据渲染、粒子场、打字机、3D 卡片、筛选、灯箱
│   └── *.jpg / *.png / *.svg     作品证据图（含 idc-monitor 项目运行效果截图）
├── data/
│   ├── profile.json              ★ 唯一真源，只改这里
│   └── profile.js                构建生成，供 file:// 直接打开时用
├── print/resume.html             A4 打印版（构建生成）
├── downloads/
│   ├── Irving-接单简历.pdf       平台上传用（构建生成）
│   └── Irving-接单简历-v2.docx   平台上传用（构建生成）
├── tools/build.py                一键重建脚本（纯 Python 标准库）
├── netlify.toml / vercel.json
└── README.md
```

## 改内容

只要编辑 `data/profile.json`。常用字段：

| 想改什么 | 改哪里 |
|---|---|
| 姓名、电话、邮箱、微信、GitHub、在线简历地址 | `identity.name` / `identity.experience` / `identity.contacts[].value` |
| 个人简介、一句话定位 | `identity.intro` / `identity.focus` / `identity.pitch` |
| 能力域与熟练度 | `skills[]` |
| 新增或删减作品 | `projects[]`（`image` 放 `assets/` 下的相对路径） |
| 服务与报价 | `services[]` / `priceNote` |
| 默认视觉主题 | `meta.theme`（`deep-space` / `aurora-glass` / `neon-grid` / `blueprint`） |

改完执行：

```bash
cd /Users/irving/workstation/portfolio/resume-online
python3 tools/build.py
```

脚本会重建 `data/profile.js`、`print/resume.html`、Word、PDF，并跑一次引用机检（图片、CSS/JS、下载链接是否存在）。PDF 用本机 Google Chrome 无头打印生成；没装 Chrome 时会跳过 PDF，其余产物照常生成，可手动把 `print/resume.html` 在浏览器里「打印 → 存为 PDF」。

## 本地预览

直接双击 `index.html` 就能看（`data/profile.js` 是为 `file://` 准备的，不依赖服务器）。想更接近线上环境：

```bash
cd /Users/irving/workstation/portfolio/resume-online
python3 -m http.server 8080
# 打开 http://localhost:8080
```

## 部署

整个 `resume-online/` 目录就是一个静态站点根目录，零依赖、零构建命令。

**GitHub Pages**：本套已部署到用户级仓库 `beyondouyuan/beyondouyuan.github.io` 的 `master` 根，站点为 https://beyondouyuan.github.io/，push 即自动重建。通用做法：把本目录内容推到目标仓库的发布分支根；若改用 Actions 发布，需另行在**仓库根**的 `.github/workflows/` 新建 workflow，`path` 指向本目录；本交付目录不附带 workflow（子目录里的 workflow 不会被 GitHub 识别）。

**Vercel**：导入该仓库，Framework 选 Other / 留空，Build Command 与 Output Directory 都留空（`vercel.json` 已声明纯静态），Deploy。

**Netlify**：导入该仓库，`netlify.toml` 已写好 `publish = "."` 且 `command` 为空；也可以直接把整个目录拖到 Netlify Drop。

本套已完成这两项回填：`index.html` 的 `og:image` 用绝对地址 `https://beyondouyuan.github.io/assets/og-cover-3d.jpg`，`identity.contacts` 的「在线简历」填为站点地址并用 `display` 短版展示。换到别的域名时按同样方式改这两处，再重跑构建。

## 个人信息与剩余待补项

人工于 2026-11-12 确认的信息已写进 `data/profile.json` 的 `identity`，Word / PDF / 在线站点共用这一份真源：

| 字段 | 值 |
|---|---|
| 展示名（昵称） | `Irving` |
| 邮箱 | `beyondouyuan@gmail.com` |
| 备用邮箱 | `oujunyuan@163.com` |
| 电话 / 微信 | `18620902160`（同号） |
| GitHub | `https://github.com/beyondouyuan` |
| 在线简历 | `https://beyondouyuan.github.io/` |

GitHub 那条用了可选的 `display` 字段：页面和打印版显示不带协议头的短版 `github.com/beyondouyuan`，点击复制拿到的是完整 `https://` 地址，避免长网址在卡片里硬折行。

还有 1 处 `〔〕` **没有代填**——用户没提供，不编造：

- `identity.experience` → `〔工作年限〕`。另一会话文案里出现过「10 年+（2015 年起从事互联网研发）」，记在 `identity.knownCandidates` 里作来源记录，未经确认所以没启用。

**渲染层会自动跳过未填项**：打印版（`print/resume.html` → Word / PDF）不输出占位字段；在线站点「关于」不显示 EXPERIENCE 行、联系区不显示占位条目。所以现在这份 Word / PDF 可以直接上传平台，不会露出 `〔〕`。补齐后重跑构建即全量生效。

对外发布前还要确认一件事：广告 SDK 与聚合平台相关内容若涉及公司项目，需先做脱敏（去掉客户名、后台地址、接口细节）。动环大屏卡片与分享封面用的是项目自带运行效果截图，不含客户名称；其余从并发会话复制来的截图已做过客户标识马赛克。

## 项目状态口径

按人工 2026-11-13 要求，**代表作品不再展示项目状态**：卡片徽章、灯箱徽章、打印版标题后的状态括号、页面上的状态图例都已去掉。「其他可直接展示」区的简短状态标签保留（不在代表作品范围内）。

`data/profile.json` 的 `status` / `tone` / `statusLegend` 仍是内部真源，供日后需要时恢复展示或做内部核对；`result` 里的验收与进度描述按原样保留，没有把开发中写成已上线。

涉及 eCPM、留存、收益的地方只报可核实口径，不承诺收益数字。喵爪堆堆山已发布但广告位尚未开启、没有收益数据，页面里也照实写了。

## 技术说明

- 纯 HTML / CSS / JS，无框架、无 CDN、无构建步骤；断网也能打开。
- 颜色、间距、圆角、阴影、字体全部走 `assets/style.css` 顶部的 CSS 变量，4 套主题只覆盖变量，页面里没有散落的硬编码色值。
- 主题选择存 `localStorage`；右上角四个圆点切换 A 深空终端 / B 极光玻璃 / C 霓虹网格 / D 工程蓝图。
- 动效：Canvas 粒子星场（带鼠标排斥）、终端打字机、滚动显现、卡片 3D 倾斜、数字计数、作品筛选与灯箱。
- 无障碍：语义标签、`aria-pressed` / `aria-label`、键盘可开灯箱（Enter/Space，Esc 关闭）、焦点可见、`prefers-reduced-motion` 下关闭全部动效并显示静态文本。
- `@media print` 隐藏导航与动效；Word/PDF 用的是独立的 A4 打印页，不依赖屏幕样式。

## 与工作区其他文件的关系

本目录是**独立新建**的，没有改动以下任何文件：

- `portfolio/resume-site/`（已有的 `Irving-接单简历.docx` 与 `build_resume_docx.py`）
- `portfolio/resume-20261112/`（另一会话并行产出的文案、站点与素材）

`assets/` 里 5 张脱敏作品截图与 2 张架构图，是从 `resume-20261112/site/assets/` **复制**过来的，原文件保持只读未改；`work-idc-3d.png`、`work-idc-screen*.png`、`og-cover-3d.jpg`、`og-cover-screen.jpg` 是本项目自行生成的 idc-monitor 效果图，与 Doubao 的现场实拍件 `work-idc.jpg` / `og-cover.jpg` 不是一回事。两份 `owner: Doubao` 的文案只作为内容参考，未写入、未覆盖。

01 动环大屏的卡片图按人工要求**体现 3D 效果**，最终用的是项目 3D 模式的运行画面，不再使用现场实拍，也不再用那张 2D 降级态的 TV 端截图：

- `work-idc-3d.png`（1920×1080，当前 `profile.projects[0].image`）：把 `apps/projects/idc-monitor/frontend/dist`（2026-11-04 构建产物）按项目 `/api/v1` 契约在本地跑起来后截的图，`renderMode` 为默认的 `'3d'`，中央是 Three.js 透视机房场景——成排立体机柜、悬浮温度标签、告警高亮、地板网格，四周 12 个面板齐全。数据用的是项目自带 mock 契约的同结构假数据，不是生产数据。
- `og-cover-3d.jpg`（1200×630）：由同一张图等比缩到 1120×630 后左右补深蓝边生成，`index.html` 的 `og:image` 指向它。
- `work-idc-screen.png` / `work-idc-screen-16x9.png` / `og-cover-screen.jpg`：上一轮用的 TV 端 2D 降级态截图（`docs/discovery/assets/2026-10-16/kiosk/T004-kiosk-05-dashboard-2400x1080.png`），现在**保留作对照**，不再被产物引用。
- 旧的 `work-idc.jpg`、`og-cover.jpg` 是现场实拍裁切件，**已弃用**，保留仅供回溯。

关于 3D 开关的核实结论：项目 `frontend/src/store/config.ts` 的 `renderMode: '3d' | '2d'` **默认就是 `'3d'`**，`ConfigPanel.vue` 里有「3D 数字孪生 / 2D 平面」切换组，值会写进 localStorage；`RoomView.vue` 用 `v-if="config.renderMode === '3d'"` 决定挂不挂 Three.js 组件。所以不是配置没勾 3D，而是 10-16 那张 TV 端验收图拍在 T-027（10-17 归档的 Three.js 3D 改造）之前，中央那块只是 2D 平面 skew 伪 3D 的温度色块。项目里没有留存 3D 模式截图，这才本地补了一张。

## 公开副本的脱敏

对外部署的副本（`beyondouyuan.github.io`）只放**运行所需**的数据：`tools/build.py` 生成 `data/profile.js` 时会剔除 `meta.factBoundary`、`identity.knownCandidates`、`statusLegend` 以及各项目的 `status` / `tone` 等内部字段，完整真源 `data/profile.json` 不随公开副本发布。

对外联系方式（邮箱、电话、微信、GitHub、在线简历）按接单需要保留在页面与 Word / PDF 中，这是简历的用途所在；不公开的是内部状态口径与来源记录。若之后要把电话等也改成「面谈后提供」，改 `identity.contacts` 后重跑构建即可。
