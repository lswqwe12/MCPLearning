/**
 * 练习数据 —— 对应《MCP全面知识学习网站.md》§6 的 JSON Schema
 * 三类题型：choice（选择题）、fill（填空题）、code（代码补全）
 * 覆盖全部 9 个章节，含正确答案与解析。
 */

export type ExerciseType = 'choice' | 'fill' | 'code';

interface ExerciseBase {
  /** 唯一标识，如 "ex-001" */
  id: string;
  type: ExerciseType;
  /** 关联章节 id，如 "basic-intro" */
  category: string;
  /** 题干 */
  question: string;
  /** 解析说明 */
  explanation: string;
}

/** 选择题 */
export interface ChoiceExercise extends ExerciseBase {
  type: 'choice';
  /** 选项列表 */
  options: string[];
  /** 正确选项下标（0-based） */
  correct: number;
}

/** 填空题 */
export interface FillExercise extends ExerciseBase {
  type: 'fill';
  /** 每个空对应的正确答案（按顺序，长度等于题干中 _____ 的数量） */
  correct: string[];
}

/** 代码补全 */
export interface CodeExercise extends ExerciseBase {
  type: 'code';
  /** 含填空占位符（____n____）的代码模板 */
  codeTemplate: string;
  /** 需要填写的位置序号 */
  fillIndex: number[];
  /** 与 fillIndex 对应的正确答案数组 */
  correct: string[];
}

export type Exercise = ChoiceExercise | FillExercise | CodeExercise;

/** 练习分类（对应章节）的展示标签 */
export const EXERCISE_CATEGORY_LABELS: Record<string, string> = {
  'basic-intro': 'MCP 基本介绍',
  architecture: '技术架构',
  'core-components': '核心组件',
  tools: 'Tools（工具）',
  prompts: 'Prompts（提示词）',
  resources: 'Resources（资源）',
  notifications: 'Notifications（通知）',
  workflow: '工作流程',
  communication: '通信机制',
  sampling: 'Sampling 与信息获取',
  'build-server': '构建 MCP Server',
  examples: '综合示例',
};

export const exercises: Exercise[] = [
  // ============ 第 1 章：MCP 基本介绍 ============
  {
    id: 'ex-001',
    type: 'choice',
    category: 'basic-intro',
    question: 'MCP 的全称是什么？',
    options: [
      'Model Context Protocol',
      'Model Control Protocol',
      'Multi-Channel Protocol',
      'Modular Communication Protocol',
    ],
    correct: 0,
    explanation: 'MCP 全称 Model Context Protocol（模型上下文协议）。',
  },
  {
    id: 'ex-002',
    type: 'choice',
    category: 'basic-intro',
    question: 'MCP 常被比喻为 AI 应用的什么接口？',
    options: ['HDMI 接口', 'USB-C 接口', '以太网接口', '蓝牙接口'],
    correct: 1,
    explanation:
      'MCP 被喻为 AI 应用的「USB-C 接口」——提供标准化的连接方式，一次构建、随处集成。',
  },
  {
    id: 'ex-003',
    type: 'choice',
    category: 'basic-intro',
    question: 'MCP 把传统「M 个应用 × N 个系统」的集成复杂度降低为？',
    options: ['M×N', 'M+N', 'M^N', 'N^M'],
    correct: 1,
    explanation:
      '传统做法每个应用都要为每个系统单独开发连接器（M×N）；MCP 让系统只需实现一次 Server，复杂度降为 M+N。',
  },
  {
    id: 'ex-004',
    type: 'fill',
    category: 'basic-intro',
    question: 'Model Context Protocol 的中文名称是 _____。',
    correct: ['模型上下文协议'],
    explanation: 'MCP = Model Context Protocol，中文译为「模型上下文协议」。',
  },

  // ============ 第 2 章：技术架构 ============
  {
    id: 'ex-005',
    type: 'choice',
    category: 'architecture',
    question: 'MCP 遵循哪种架构？',
    options: [
      '客户端-服务器',
      '客户端-宿主-服务器',
      '微服务架构',
      '发布-订阅架构',
    ],
    correct: 1,
    explanation: 'MCP 遵循「客户端-宿主-服务器（Client-Host-Server）」三层架构。',
  },
  {
    id: 'ex-006',
    type: 'choice',
    category: 'architecture',
    question: 'MCP 建立在哪种协议之上？',
    options: ['SOAP', 'GraphQL', 'JSON-RPC', 'gRPC'],
    correct: 2,
    explanation: 'MCP 建立在 JSON-RPC 之上，提供有状态会话协议。',
  },
  {
    id: 'ex-007',
    type: 'choice',
    category: 'architecture',
    question: '以下哪项体现了 MCP 的隐私与安全设计原则？',
    options: [
      '服务器应该读取整个对话以提供更好上下文',
      '服务器不能读取整个对话，只接收必要上下文',
      '服务器可以任意访问宿主的所有数据',
      '客户端与服务器之间无需安全边界',
    ],
    correct: 1,
    explanation:
      '设计原则之一：服务器不能读取整个对话，完整对话历史保留在宿主端，是隐私与安全的关键保障。',
  },
  {
    id: 'ex-008',
    type: 'fill',
    category: 'architecture',
    question: 'MCP 在逻辑上分为 _____ 层和 _____ 层。',
    correct: ['数据层', '传输层'],
    explanation: '数据层定义「说什么」（JSON-RPC 通信协议），传输层定义「怎么说」（通信机制与通道）。',
  },

  // ============ 第 3 章：核心组件 ============
  {
    id: 'ex-009',
    type: 'choice',
    category: 'core-components',
    question: '在 MCP 架构中，谁负责协调和管理多个客户端？',
    options: ['MCP Server', 'MCP Client', 'MCP Host', 'MCP Router'],
    correct: 2,
    explanation: 'MCP Host（宿主）负责创建并管理一个或多个客户端实例。',
  },
  {
    id: 'ex-010',
    type: 'choice',
    category: 'core-components',
    question: 'MCP Client 与 Server 之间是什么关系？',
    options: ['1:1', '1:N', 'N:N', '无固定关系'],
    correct: 0,
    explanation: '每个客户端与特定服务器保持 1:1 关系，一个客户端只服务一个服务器。',
  },
  {
    id: 'ex-011',
    type: 'choice',
    category: 'core-components',
    question: '以下哪项属于 MCP Host 的职责？',
    options: [
      '向客户端暴露 resources、tools 和 prompts',
      '维护与特定服务器的有状态会话',
      '控制客户端连接权限和生命周期',
      '独立运行、聚焦特定职责',
    ],
    correct: 2,
    explanation:
      '控制客户端连接权限和生命周期是 Host 的职责；其余分别对应 Server、Client、Server 的职责。',
  },
  {
    id: 'ex-012',
    type: 'fill',
    category: 'core-components',
    question: 'MCP 的三大内容原语是：_____、_____、_____。',
    correct: ['Tools', 'Prompts', 'Resources'],
    explanation: '三大内容原语分工：Tools 处理动作、Resources 处理数据、Prompts 处理模板（另有 Notifications 负责通知）。',
  },

  // ============ 第 4 章：Tools（工具） ============
  {
    id: 'ex-013',
    type: 'choice',
    category: 'tools',
    question: '工具（Tools）的控制权属于谁？',
    options: ['模型（Model）', '应用（Application）', '用户（User）', '服务器（Server）'],
    correct: 0,
    explanation: '工具是「模型控制」的——AI 模型可以自动发现和调用它们，但仍受人工监督。',
  },
  {
    id: 'ex-014',
    type: 'choice',
    category: 'tools',
    question: 'MCP 使用什么来定义和验证工具的接口？',
    options: ['XML Schema', 'JSON Schema', 'Protobuf', 'YAML'],
    correct: 1,
    explanation: 'MCP 使用 JSON Schema 定义并验证工具的输入输出。',
  },
  {
    id: 'ex-015',
    type: 'choice',
    category: 'tools',
    question: 'tools/list 方法的作用是？',
    options: [
      '执行一个工具',
      '发现可用工具',
      '删除一个工具',
      '更新工具定义',
    ],
    correct: 1,
    explanation: 'tools/list 用于发现可用工具，返回包含 Schema 的工具定义数组。',
  },
  {
    id: 'ex-016',
    type: 'code',
    category: 'tools',
    question: '补全以下 Python MCP Server 代码（3 个填空）。',
    codeTemplate: `from fastmcp import FastMCP

mcp = FastMCP("____1____")  # 填空1：服务器名称

@mcp.____2____()  # 填空2：工具装饰器
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return ____3____  # 填空3：返回值`,
    fillIndex: [1, 2, 3],
    correct: ['Math', 'tool', 'a + b'],
    explanation: 'FastMCP 通过 @mcp.tool() 装饰器暴露工具，返回 a + b 完成两数相加。',
  },

  // ============ 第 5 章：Prompts（提示词） ============
  {
    id: 'ex-017',
    type: 'choice',
    category: 'prompts',
    question: '提示词（Prompts）的控制权属于谁？',
    options: ['模型（Model）', '应用（Application）', '用户（User）', '服务器（Server）'],
    correct: 2,
    explanation: '提示词是「用户控制」的——由用户选择调用的交互模板。',
  },
  {
    id: 'ex-018',
    type: 'choice',
    category: 'prompts',
    question: '在三大原语分工中，Prompts 处理什么？',
    options: ['动作', '数据', '模板', '通知'],
    correct: 2,
    explanation: 'Tools 处理动作、Resources 处理数据、Prompts 处理模板。',
  },
  {
    id: 'ex-019',
    type: 'fill',
    category: 'prompts',
    question: '提示词模板中的 {{.code}} 是一种 _____ 占位符，调用时由用户提供的真实内容替换。',
    correct: ['参数'],
    explanation: '模板支持参数化，{{.code}} 是参数占位符，调用时替换为真实内容。',
  },

  // ============ 第 6 章：Resources（资源） ============
  {
    id: 'ex-020',
    type: 'choice',
    category: 'resources',
    question: '资源（Resources）的控制权属于谁？',
    options: ['模型（Model）', '应用（Application）', '用户（User）', '服务器（Server）'],
    correct: 1,
    explanation: '资源是「应用控制」的——由客户端附加和管理的上下文数据。',
  },
  {
    id: 'ex-021',
    type: 'choice',
    category: 'resources',
    question: '关于 MCP 资源（Resources），以下说法正确的是？',
    options: [
      '资源是可写的，模型可以修改资源内容',
      '资源是只读的数据源，用于提供上下文',
      '资源由模型自动发现并调用',
      '资源与工具没有区别',
    ],
    correct: 1,
    explanation: '资源是「只读」的数据源，用于提供上下文；变更类操作应暴露为工具。',
  },
  {
    id: 'ex-022',
    type: 'fill',
    category: 'resources',
    question: 'MCP 资源通过 _____ 标识，客户端可据此检索内容。',
    correct: ['URI'],
    explanation: '资源通过 URI 标识（如 resource://greeting），客户端可通过 URI 检索。',
  },

  // ============ 第 8 章：工作流程 ============
  {
    id: 'ex-023',
    type: 'choice',
    category: 'workflow',
    question: 'MCP 的能力协商（Capability Negotiation）发生在哪个阶段？',
    options: ['操作阶段', '关闭阶段', '初始化阶段', '任意阶段'],
    correct: 2,
    explanation: '客户端和服务器在「初始化期间」明确声明各自支持的能力。',
  },
  {
    id: 'ex-024',
    type: 'choice',
    category: 'workflow',
    question: '在 MCP 工作流架构分层中，Host 层负责什么？',
    options: [
      '定义通信格式和传输方式',
      'AI 推理，决定何时调用工具',
      '执行具体的工具操作',
      '维护 JSON-RPC 消息帧',
    ],
    correct: 1,
    explanation: 'Host 层负责 AI 推理（决定何时调用工具）；Protocol 层负责通信格式与传输。',
  },
  {
    id: 'ex-025',
    type: 'fill',
    category: 'workflow',
    question: '一次完整交互中，模型决策后由 _____ 把请求转发给服务器执行。',
    correct: ['MCP Client'],
    explanation: '工作流链路：模型决策 → MCP Client 转发 → Server 执行 → 结果回传。',
  },

  // ============ 第 9 章：通信机制 ============
  {
    id: 'ex-026',
    type: 'choice',
    category: 'communication',
    question: 'MCP 使用什么消息格式？',
    options: ['SOAP', 'REST', 'JSON-RPC 2.0', 'GraphQL'],
    correct: 2,
    explanation: 'MCP 建立在 JSON-RPC 2.0 之上，消息必须使用 UTF-8 编码。',
  },
  {
    id: 'ex-027',
    type: 'choice',
    category: 'communication',
    question: '适用于本地服务器、通常服务单个客户端的传输方式是？',
    options: ['STDIO', 'Streamable HTTP', 'WebSocket', 'SSE'],
    correct: 0,
    explanation: 'STDIO 将服务器作为子进程启动，通过 stdin/stdout 通信，适合本地单客户端场景。',
  },
  {
    id: 'ex-028',
    type: 'choice',
    category: 'communication',
    question: 'JSON-RPC Notification（通知）的特征是？',
    options: [
      '包含 id，期待响应',
      '不包含 id，不期待响应',
      '包含 id，不期待响应',
      '不包含 id，期待响应',
    ],
    correct: 1,
    explanation: 'Notification 类似请求但没有 id，因此不需要（也不期待）响应。',
  },
  {
    id: 'ex-029',
    type: 'fill',
    category: 'communication',
    question: 'MCP 协议使用 _____ 作为通信消息格式。',
    correct: ['JSON-RPC 2.0'],
    explanation: 'MCP 使用 JSON-RPC 2.0 作为消息格式，包含 Request、Response、Notification 三类。',
  },
  {
    id: 'ex-030',
    type: 'choice',
    category: 'communication',
    question: 'MCP 连接生命周期正确的三个阶段顺序是？',
    options: [
      '操作 → 初始化 → 关闭',
      '初始化 → 操作 → 关闭',
      '关闭 → 初始化 → 操作',
      '初始化 → 关闭 → 操作',
    ],
    correct: 1,
    explanation: '生命周期为：初始化（协商）→ 操作（通信）→ 关闭（优雅终止）。',
  },

  // ============ 第 7 章：Notifications（通知） ============
  {
    id: 'ex-034',
    type: 'choice',
    category: 'notifications',
    question: '以下哪项属于 MCP 通知（Notification）的典型用途？',
    options: [
      '通知客户端资源列表已变化',
      '定义工具的 JSON Schema',
      '协商协议版本',
      '建立传输连接',
    ],
    correct: 0,
    explanation:
      '通知用于单向推送实时更新，如资源/工具/提示词列表变更、进度、日志等，无需客户端轮询。',
  },
  {
    id: 'ex-035',
    type: 'choice',
    category: 'notifications',
    question: '客户端想接收某个资源的内容更新，应使用哪个协议方法？',
    options: [
      'resources/read',
      'resources/subscribe',
      'tools/call',
      'prompts/get',
    ],
    correct: 1,
    explanation:
      '通过 resources/subscribe 订阅指定 URI 的资源，服务器只在内容变化时推送通知。',
  },
  {
    id: 'ex-036',
    type: 'fill',
    category: 'notifications',
    question: '通知消息不包含 _____ 字段，因此接收方不会返回响应。',
    correct: ['id'],
    explanation: '通知与请求的关键区别在于：通知没有 id 字段，是单向消息，不期待响应。',
  },

  // ============ 第 10 章：Sampling 与 Elicitation ============
  {
    id: 'ex-037',
    type: 'choice',
    category: 'sampling',
    question: 'Sampling（采样）让服务器请求客户端做什么？',
    options: [
      '调用宿主 LLM 生成内容',
      '向用户索取表单输入',
      '订阅资源更新',
      '建立安全边界',
    ],
    correct: 0,
    explanation:
      'Sampling 是反向调用：服务器请求客户端让宿主 LLM 生成内容，核心方法是 sampling/createMessage。',
  },
  {
    id: 'ex-038',
    type: 'choice',
    category: 'sampling',
    question: 'Elicitation（信息获取）的核心方法是？',
    options: [
      'sampling/createMessage',
      'elicitation/create',
      'tools/call',
      'resources/read',
    ],
    correct: 1,
    explanation:
      'Elicitation 让服务器请求用户提供输入，核心方法是 elicitation/create。',
  },
  {
    id: 'ex-039',
    type: 'fill',
    category: 'sampling',
    question: 'Sampling 问模型，Elicitation 问 _____。',
    correct: ['用户'],
    explanation: 'Sampling 请求宿主 LLM 生成内容；Elicitation 请求用户填写输入。',
  },

  // ============ 第 11 章：构建第一个 MCP Server ============
  {
    id: 'ex-040',
    type: 'choice',
    category: 'build-server',
    question: 'FastMCP 中用哪个装饰器把函数暴露为工具？',
    options: ['@mcp.tool()', '@mcp.resource()', '@mcp.prompt()', '@mcp.route()'],
    correct: 0,
    explanation: '@mcp.tool() 把函数注册为工具；@mcp.resource(uri) 暴露资源；@mcp.prompt() 暴露提示词。',
  },
  {
    id: 'ex-041',
    type: 'choice',
    category: 'build-server',
    question: 'FastMCP 中 @mcp.resource(uri) 装饰器的作用是？',
    options: [
      '暴露一个可调用的工具',
      '暴露一个 URI 标识的资源',
      '暴露一个提示词模板',
      '启动服务器进程',
    ],
    correct: 1,
    explanation: '@mcp.resource(uri) 把函数注册为指定 URI 的资源，客户端可通过 URI 检索。',
  },
  {
    id: 'ex-042',
    type: 'code',
    category: 'build-server',
    question: '补全以下 FastMCP 服务器代码（2 个填空）。',
    codeTemplate: `from fastmcp import FastMCP

mcp = FastMCP("____1____")  # 填空1：服务器名称

@mcp.____2____()  # 填空2：工具装饰器
def get_weather(city: str) -> dict:
    """查询指定城市的实时天气"""
    return {"city": city, "temperature": 26}`,
    fillIndex: [1, 2],
    correct: ['weather-assistant', 'tool'],
    explanation:
      'FastMCP("weather-assistant") 创建服务器实例，@mcp.tool() 把 get_weather 注册为工具。',
  },

  // ============ 第 12 章：综合示例 ============
  {
    id: 'ex-031',
    type: 'choice',
    category: 'examples',
    question: '在旅行预订场景中，「创建日历事件」应暴露为哪种原语？',
    options: ['Resource', 'Tool', 'Prompt', 'Notification'],
    correct: 1,
    explanation: '创建日历事件是「变更操作」，属于动作，应暴露为 Tool。',
  },
  {
    id: 'ex-032',
    type: 'code',
    category: 'examples',
    question: '补全以下资源暴露代码（1 个填空）。',
    codeTemplate: `from fastmcp import FastMCP

mcp = FastMCP("DataServer")

@mcp.____1____("resource://greeting")  # 填空1：资源装饰器
def get_greeting() -> str:
    return "Hello, World!"`,
    fillIndex: [1],
    correct: ['resource'],
    explanation: '使用 @mcp.resource(uri) 装饰器把函数注册为 URI 标识的资源。',
  },
  {
    id: 'ex-033',
    type: 'code',
    category: 'examples',
    question: '补全以下搜索工具代码（3 个填空）。',
    codeTemplate: `from fastmcp import FastMCP

mcp = FastMCP("____1____")  # 填空1：服务器名称

@mcp.____2____()  # 填空2：工具装饰器
def search(q: str) -> str:
    """Search and return the query"""
    return ____3____  # 填空3：返回查询词 q`,
    fillIndex: [1, 2, 3],
    correct: ['Search', 'tool', 'q'],
    explanation: 'FastMCP("Search") 创建服务器，@mcp.tool() 注册工具，返回 q 完成搜索。',
  },
];

export const totalExercises = exercises.length;
