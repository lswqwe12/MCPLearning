Notifications（通知）是 MCP 中「实时更新」的担当。前面三章的工具、提示词、资源都是「请求-响应」式的主动拉取；而通知让服务器能够**主动、单向地把变化推送给客户端**，无需客户端轮询。本章讲解通知的定义、类型、订阅机制与代码实现。

## 什么是通知？

在 MCP 的 JSON-RPC 消息体系中，通知（Notification）是一类**没有 `id`、不期待响应**的消息。

| 消息类型 | 是否包含 `id` | 是否期待响应 | 方向 |
|---------|--------------|-------------|------|
| Request（请求） | 是 | 是 | 一问一答 |
| Response（响应） | 是 | 否（本身是响应） | 对请求的应答 |
| **Notification（通知）** | **否** | **否** | **单向推送** |

> 关键点：通知是「单向」的——发送方发完即结束，接收方**不会**返回任何响应。这使通知非常适合传递「状态变化」这类无需确认的实时信息。

## 通知：第四种核心原语

MCP 规范在核心原语中列出了四种：`tools`、`resources`、`prompts`、`notifications`。其中前三者是**内容原语**（提供动作、数据、模板），而**通知是一种「消息机制」**，为前三者提供实时更新的能力。

它们的关系可以这样理解：

- **Tools / Resources / Prompts** 回答「服务器能做什么」。
- **Notifications** 回答「如何把『这些能力或数据发生了变化』这件事实时告诉客户端」。

因此通知并不独立于三大原语存在，而是贯穿其中：资源变了、工具列表变了、提示词变了，都可以通过通知告知客户端。

## 通知的主要用途

### 1. 资源变更通知

当某个资源的 URI 列表或内容发生变化时，服务器可以主动通知客户端刷新：

- `notifications/resources/list_changed`：资源列表发生了变化。
- `notifications/resources/updated`：某个已订阅资源的**内容**被更新。

### 2. 工具 / 提示词列表变更通知

当服务器动态增删工具或提示词时，通知客户端重新拉取列表：

- `notifications/tools/list_changed`：工具列表发生变化。
- `notifications/prompts/list_changed`：提示词列表发生变化。

### 3. 进度通知

对于长时间运行的操作，服务器用进度通知持续汇报进展，避免客户端「干等」：

- `notifications/progress`：携带 `progressToken` 与 `progress`（0-100 或 -1 表示未知）字段。

### 4. 日志消息

服务器通过 `notifications/message` 向客户端发送日志（调试、信息、警告、错误等级别），方便排障与监控。

## 订阅机制（Subscription）

对于「资源更新」这类高频通知，MCP 采用**订阅机制**来避免无效推送——客户端先订阅感兴趣的资源，服务器只在相关内容变化时才推送。

订阅的核心协议操作：

| 方法 | 用途 |
|------|------|
| `resources/subscribe` | 订阅指定 URI 的资源 |
| `resources/unsubscribe` | 取消订阅指定 URI 的资源 |

订阅是否可用，取决于双方在**初始化阶段**声明的能力（capability）：

- 服务器声明 `resources: { subscribe: true }`，表示支持订阅。
- 客户端声明 `resources: { listChanged: true }` 等，表示能处理相应通知。

只有双方都声明了对应能力，订阅与通知才会生效——这再次体现了「能力协商」在 MCP 中的基础作用。

## 通知消息示例

一条「资源列表已变化」的通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}
```

一条「进度更新」的通知：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "req-001",
    "progress": 42,
    "total": 100
  }
}
```

注意这两条消息都**没有 `id` 字段**——这正是通知与请求最直观的区别。

## 代码示例（Python - FastMCP）

FastMCP 简化了通知的发送，你通常不需要手动拼 JSON-RPC 消息。例如，一个在资源变化后广播通知的服务器：

```python
from fastmcp import FastMCP

mcp = FastMCP("file-watcher")

# 当文件系统发生变化时，通知客户端刷新资源列表
def on_file_changed():
    # FastMCP 内部会生成对应的 notifications/resources/list_changed 消息
    ...

# 对长时间运行的工具上报进度
@mcp.tool()
async def long_task(progress) -> str:
    """A long-running task that reports progress"""
    # 通过进度令牌逐步上报 progress
    ...
    return "done"
```

要点：

- 通知的**触发方是服务器**，客户端只负责接收与刷新。
- 订阅机制让通知「按需推送」，而非无差别广播。
- 进度通知让长任务对用户**可见、可控**。

## 与请求（Request）的本质区别

| 维度 | Request | Notification |
|------|---------|--------------|
| 是否有 `id` | 有 | 无 |
| 是否有响应 | 有（Response） | 无 |
| 语义 | 请求对方做某事并等待结果 | 告知对方某事已发生 |
| 典型场景 | `tools/call`、`resources/read` | 列表变更、进度、日志 |

理解这一区别，就理解了 MCP 消息体系里「拉」与「推」两种模式的边界。

## 本章小结

- 通知是**无 `id`、不期待响应**的单向消息，是第四种核心原语。
- 它服务于三大内容原语的**实时更新**：资源、工具、提示词列表变更等。
- **订阅机制**（subscribe/unsubscribe）让通知按需推送，受能力协商约束。
- 进度通知与日志消息让长任务与运维**可观测、可控**。
