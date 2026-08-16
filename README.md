# MCP Learning Hub · MCP 全面知识学习网站

一个面向 AI 开发者与技术学习者的 **MCP（Model Context Protocol）协议学习平台**。纯静态、无需后端，覆盖从入门到进阶的完整知识体系，配套交互式练习与学习进度追踪。

> MCP 是连接 LLM 应用与外部数据源、工具的开放协议，被喻为 AI 应用的「USB-C 接口」。本项目以中文系统化讲解 MCP 的概念、架构、核心原语、通信机制与实战构建。

## ✨ 功能特性

- 📚 **12 个知识章节**，按「入门 → 核心 → 进阶」三层组织，内容基于官方规范与社区资料整理
- 🖊️ **Markdown 渲染 + 代码高亮**（react-markdown + rehype-highlight / highlight.js）
- ✍️ **三种题型练习**：选择题、填空题、代码补全，提交即判分并显示解析
- 📈 **学习进度追踪**：已读/已完成章节、练习得分，自动持久化到 `localStorage`
- 🔍 **全文搜索**：⌘K / Ctrl+K 唤起命令面板，检索章节正文与练习题
- 🌗 **明暗主题切换**：跟随系统偏好，支持手动切换，无闪烁（FOUC）加载
- 📱 **响应式设计**：桌面端常驻侧边栏，移动端抽屉式导航

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3（`darkMode: 'class'`） |
| 路由 | React Router 6（路由级代码分割） |
| Markdown | react-markdown + remark-gfm |
| 代码高亮 | rehype-highlight + highlight.js |
| 图标 | lucide-react |
| 状态 | React Context + `localStorage` |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

构建产物输出至 `dist/`，可直接部署到任意静态托管平台（Vercel / Netlify / GitHub Pages 等）。

## 📁 项目结构

```
src/
├── components/
│   ├── layout/          # 应用布局：侧边栏、顶栏
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── practice/        # 练习卡片（按题型分发渲染）
│   │   └── ExerciseCard.tsx
│   ├── MarkdownContent.tsx   # Markdown 渲染 + 标题锚点
│   ├── SearchModal.tsx       # 命令面板搜索
│   └── TableOfContents.tsx   # 章节目录 + 滚动高亮
├── context/
│   ├── ProgressContext.tsx   # 学习进度状态与持久化
│   └── ThemeContext.tsx      # 明暗主题状态
├── data/
│   ├── chapters.ts           # 章节元数据（12 章）
│   ├── chapterContents.ts    # 章节正文映射（?raw 导入）
│   ├── exercises.ts          # 练习数据（42 题）
│   └── content/*.md          # 章节正文 Markdown
├── lib/
│   ├── markdown.ts           # 标题提取 / slugify
│   ├── progress.ts           # 进度数据模型与读写
│   └── search.ts             # 全文搜索索引与匹配
├── pages/
│   ├── HomePage.tsx
│   ├── KnowledgePage.tsx
│   ├── KnowledgeDetailPage.tsx
│   └── PracticePage.tsx
├── App.tsx                   # 路由配置 + Provider 组装
├── main.tsx
└── index.css                 # Tailwind + Markdown 样式 + 暗色代码高亮
```

## 📖 知识体系

| 层级 | 章节 |
|------|------|
| 入门层 | 1. MCP 基本介绍 · 2. 技术架构 |
| 核心层 | 3. 核心组件 · 4. Tools（工具） · 5. Prompts（提示词） · 6. Resources（资源） · 7. Notifications（通知） |
| 进阶层 | 8. 工作流程 · 9. 通信机制 · 10. Sampling 与信息获取 · 11. 构建第一个 MCP Server · 12. 综合示例 |

## 🔧 内容扩展指南

所有内容均硬编码于 `src/data/`，无需后端。

**新增章节**：

1. 在 `src/data/content/` 下创建 Markdown 文件（`h2`/`h3` 会自动生成目录锚点）。
2. 在 `src/data/chapters.ts` 中登记章节元数据（`id`、`order`、`title`、`layer`、`summary`）。
3. 在 `src/data/chapterContents.ts` 中通过 `?raw` 导入并映射该章节正文。

**新增练习题**：

在 `src/data/exercises.ts` 中按题型追加，支持三类：

- `choice`：选择题（`options` + `correct` 下标）
- `fill`：填空题（题干 `_____` 占位，`correct` 为字符串数组）
- `code`：代码补全（`codeTemplate` 用 `____n____` 占位，`fillIndex` + `correct`）

> 章节正文通过 `?raw` 懒加载，仅当进入章节详情页或搜索时才打包正文，保证首屏体积可控。

## 🎨 设计规范

- **主色**：科技蓝 `#2563EB` · **辅助色**：紫 `#7C3AED`
- **功能色**：成功 `#10B981` / 警告 `#F59E0B` / 错误 `#EF4444`
- **字体**：正文 Inter + PingFang SC，代码 JetBrains Mono
- **断点**：桌面 `>1024px` / 平板 `768–1024px` / 移动 `<768px`

## 📄 License

[MIT](./LICENSE)
