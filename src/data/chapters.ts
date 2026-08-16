/**
 * 章节元数据 —— 对应《MCP全面知识学习网站.md》§4 的知识章节
 * 内容文本（Markdown）硬编码于 src/data/content/*.md，经 chapterContents.ts 导入。
 */

export type ChapterLayer = 'intro' | 'core' | 'advanced';

export interface Chapter {
  /** 路由/唯一标识，如 "basic-intro" */
  id: string;
  /** 章节序号，1-based */
  order: number;
  /** 完整标题 */
  title: string;
  /** 侧边栏短标题（可选，默认用 title） */
  shortTitle?: string;
  /** 所属知识层级 */
  layer: ChapterLayer;
  /** 一句话摘要，用于卡片/列表展示 */
  summary: string;
}

export interface ChapterLayerGroup {
  layer: ChapterLayer;
  label: string;
  description: string;
}

/** 知识层级分组（对应文档 §9.1 知识地图） */
export const LAYER_GROUPS: ChapterLayerGroup[] = [
  { layer: 'intro', label: '入门层', description: '无前置依赖，建立 MCP 基础认知' },
  { layer: 'core', label: '核心层', description: '掌握核心原语、通知与组件' },
  { layer: 'advanced', label: '进阶层', description: '贯通工作流、通信、采样与综合实战' },
];

export const chapters: Chapter[] = [
  {
    id: 'basic-intro',
    order: 1,
    title: 'MCP 基本介绍',
    layer: 'intro',
    summary:
      'MCP（Model Context Protocol）是连接 LLM 应用与外部数据源、工具的开放协议，被喻为 AI 应用的「USB-C 接口」。',
  },
  {
    id: 'architecture',
    order: 2,
    title: '技术架构',
    layer: 'intro',
    summary:
      'MCP 遵循「客户端-宿主-服务器」架构，建立在 JSON-RPC 之上，分为数据层与传输层，遵循四大设计原则。',
  },
  {
    id: 'core-components',
    order: 3,
    title: '核心组件',
    layer: 'core',
    summary:
      'Host（宿主）、Client（客户端）、Server（服务器）三者的角色划分、职责边界与 1:1 连接关系。',
  },
  {
    id: 'tools',
    order: 4,
    title: 'Tools（工具）',
    layer: 'core',
    summary:
      '模型控制的可执行函数，通过 JSON Schema 定义接口，提供 tools/list 与 tools/call 协议操作。',
  },
  {
    id: 'prompts',
    order: 5,
    title: 'Prompts（提示词）',
    layer: 'core',
    summary:
      '用户控制的预定义模板，标准化地向客户端暴露可复用的提示词模板，处理「模板」类能力。',
  },
  {
    id: 'resources',
    order: 6,
    title: 'Resources（资源）',
    layer: 'core',
    summary:
      '应用控制的结构化只读数据，为模型提供额外上下文，如文件、数据库、GitHub 等资源。',
  },
  {
    id: 'notifications',
    order: 7,
    title: 'Notifications（通知）',
    layer: 'core',
    summary:
      '服务器主动、单向推送实时更新：资源/工具/提示词列表变更、进度上报与日志消息，配合订阅机制按需送达。',
  },
  {
    id: 'workflow',
    order: 8,
    title: '工作流程',
    layer: 'advanced',
    summary:
      '从用户提问到返回结果的完整交互链路、Host/Protocol 分层、能力协商与典型交互序列。',
  },
  {
    id: 'communication',
    order: 9,
    title: '通信机制',
    layer: 'advanced',
    summary:
      'JSON-RPC 2.0 消息格式与错误处理、STDIO 与 Streamable HTTP 传输方式、生命周期管理与扩展机制。',
  },
  {
    id: 'sampling',
    order: 10,
    title: 'Sampling 与 Elicitation',
    shortTitle: '采样与信息获取',
    layer: 'advanced',
    summary:
      '服务器反向调用客户端能力：请求宿主 LLM 采样生成内容，或向用户索取结构化输入。',
  },
  {
    id: 'build-server',
    order: 11,
    title: '构建第一个 MCP Server',
    shortTitle: '构建 MCP Server',
    layer: 'advanced',
    summary:
      '用 FastMCP 从零构建一个完整服务器，逐步注册工具、资源与提示词，并演示运行与调试。',
  },
  {
    id: 'examples',
    order: 12,
    title: '综合示例',
    layer: 'advanced',
    summary:
      '以旅行预订场景串联多个工具调用，给出完整 MCP Server 代码示例，巩固全章知识。',
  },
];

/** 便捷查找：按 id 获取章节 */
export const getChapterById = (id: string): Chapter | undefined =>
  chapters.find((c) => c.id === id);

/** 按层级分组章节，用于侧边栏导航 */
export const getChaptersByLayer = (layer: ChapterLayer): Chapter[] =>
  chapters.filter((c) => c.layer === layer);

export const totalChapters = chapters.length;
