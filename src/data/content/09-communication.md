本章深入 MCP 的通信机制：消息格式、传输方式、生命周期管理、版本协商与扩展机制。这是理解 MCP「底层如何工作」的核心章节。

## 基础协议

MCP 使用 **JSON-RPC 2.0** 作为消息格式。JSON-RPC 消息必须使用 **UTF-8** 编码。

JSON-RPC 是一个轻量的远程过程调用协议，特点是简单、语言无关，非常适合作为 MCP 的消息载体。

## 消息类型

MCP 的通信消息分为三类：

| 类型 | 是否包含 `id` | 是否期待响应 | 说明 |
|------|--------------|-------------|------|
| **Request（请求）** | 是 | 是 | 包含 `jsonrpc`、`id`、`method` 和可选的 `params` |
| **Response（响应）** | 是 | 否（本身是响应） | 包含 `jsonrpc`、`id`、`result` 或 `error` |
| **Notification（通知）** | 否 | 否 | 类似请求但没有 `id`，不需要响应 |

> 关键区别：**Request 有 id 且期待响应；Notification 无 id 且不期待响应**——这是区分「一问一答」与「单向通知」的核心。

## 传输方式

MCP 支持两种主要传输方式：

| 传输方式 | 说明 | 适用场景 |
|---------|------|---------|
| **STDIO** | 客户端将 MCP 服务器作为子进程启动，服务器从 stdin 读取 JSON-RPC 消息，向 stdout 发送消息 | 本地服务器，通常服务单个客户端 |
| **Streamable HTTP** | 客户端使用 HTTP POST 向 MCP 端点发送 JSON-RPC 消息 | 远程服务器，服务多个客户端 |

选择依据：本地、单客户端的场景用 STDIO（简单、安全）；远程、多客户端的场景用 Streamable HTTP（可扩展、可跨网络）。

## 生命周期管理

MCP 定义了严格的客户端-服务器连接生命周期，分为三个阶段：

### 1. 初始化（Initialization）

能力协商和协议版本协商，必须是客户端和服务器之间的**第一次交互**：

- 客户端和服务器建立**协议版本兼容性**。
- **交换和协商能力**。
- **共享实现信息**（名称、版本）。
- 初始化请求**不能**是 JSON-RPC 批处理的一部分。
- 初始化完成后，客户端必须发送 `initialized` 通知。

### 2. 操作（Operation）

正常的协议通信阶段，双方在此阶段进行工具调用、资源检索、提示词获取等。

### 3. 关闭（Shutdown）

优雅终止连接，释放资源。

## 初始化请求示例

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}
```

## 服务器响应示例

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "logging": {},
      "prompts": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "tools": { "listChanged": true }
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    }
  }
}
```

从这两条消息可以看出初始化阶段交换了什么：`protocolVersion`（版本）、`capabilities`（能力）、`clientInfo`/`serverInfo`（实现信息）。

## 版本协商

- 客户端在 `initialize` 请求中发送其支持的协议版本。
- 如果服务器支持该版本，以相同版本响应。
- 否则，服务器以自己支持的版本响应。
- 如果客户端不支持服务器响应的版本，应**断开连接**。

## JSON-RPC 错误处理

当请求无法正常完成时，服务器返回一个**错误对象**（代替 `result`），其结构为：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": { "detail": "缺少必填字段 city" }
  }
}
```

错误对象包含三个字段：

| 字段 | 说明 |
|------|------|
| `code` | 整数错误码，遵循 JSON-RPC 2.0 规范 |
| `message` | 简短的错误描述 |
| `data`（可选） | 附加的错误详情 |

常见的错误码：

| 错误码 | 含义 |
|--------|------|
| `-32700` | 解析错误（Parse error）：无效 JSON |
| `-32600` | 无效请求（Invalid Request）：JSON 不是有效的请求对象 |
| `-32601` | 方法不存在（Method not found） |
| `-32602` | 参数无效（Invalid params） |
| `-32603` | 内部错误（Internal error） |

要点：

- 错误响应同样通过 `id` 与请求**一一对应**，客户端据此定位失败的是哪个请求。
- 业务层面的错误通常用 `-32603` 或自定义的服务器错误码，并通过 `data` 携带细节。
- 客户端应**优雅处理错误**，而不是在收到错误后直接崩溃或无限重试。

## 扩展机制

MCP 定义可选的扩展，添加模块化、专业化或实验性功能：

- **Tasks**：长时间运行的异步操作执行。
- **Skills over MCP**：Agent 工作流的结构化指令。
- **MCP Apps**：在对话中内联渲染的交互式 UI 元素（图表、表单、视频播放器）。

这些扩展让 MCP 在核心协议之外不断生长，覆盖更丰富的应用场景。

## 安全与信任

- 用户必须**明确同意并理解**所有数据访问和操作。
- 用户必须**保留对共享数据和操作的控制权**。
- 实现者应提供**清晰的 UI** 用于审查和授权活动。

安全原则贯穿 MCP 的整个生命周期，是协议设计的底线。

## 本章小结

- MCP 使用 **JSON-RPC 2.0** + UTF-8，消息分为 Request/Response/Notification。
- 传输方式有 **STDIO**（本地）与 **Streamable HTTP**（远程）。
- 生命周期为 **初始化 → 操作 → 关闭**，初始化阶段完成版本与能力协商。
- 请求失败时通过 **JSON-RPC 错误对象**（code/message/data）返回，客户端应优雅处理。
- 扩展机制（Tasks/Skills/MCP Apps）让协议持续演进，安全原则贯穿始终。
