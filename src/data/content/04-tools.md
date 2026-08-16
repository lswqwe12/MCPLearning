Tools（工具）是 MCP 三大核心原语中的「动作」担当。本章讲解工具的定义、控制权、工作原理、协议操作与代码实现。

## 定义

工具是允许模型执行操作或检索信息的**可执行函数**。MCP 允许服务器公开可由语言模型调用的工具——例如「搜索航班」「创建日历事件」「发送邮件」等。

## 控制权：模型控制（Model-controlled）

工具是**模型控制**的——AI 模型可以自动发现和调用它们。

但这并不意味着「模型可以为所欲为」。MCP 强调**人工监督**，应用可以通过多种机制实现用户控制（见下文「用户交互机制」）。因此更准确的理解是：

> **调用决策由模型发起，最终执行受用户/应用监督。**

## 工具的工作原理

- **Schema 定义的接口**：工具是对 LLM 可调用的接口，用结构化的 Schema 描述输入输出。
- **JSON Schema 进行验证**：MCP 使用 JSON Schema 来约束与校验工具的参数。
- **单一操作**：每个工具执行**一个**操作，具有明确定义的输入和输出，符合单一职责原则。
- **用户同意**：工具执行前可能需要**用户同意**（取决于安全策略）。

## 协议操作

| 方法 | 用途 | 返回 |
|------|------|------|
| `tools/list` | 发现可用工具 | 包含 Schema 的工具定义数组 |
| `tools/call` | 执行特定工具 | 工具执行结果 |

流程是典型的「先发现、后调用」：

```text
Client ── tools/list ──────▶ Server
Client ◀── 工具定义数组 ────── Server

Client ── tools/call ──────▶ Server
Client ◀── 执行结果 ────── Server
```

## 工具调用结果

`tools/call` 的执行结果通常包含一个**内容数组**（`content`），每一项是文本、图片等结构化内容：

```json
{
  "content": [
    { "type": "text", "text": "查询结果：纽约 → 巴塞罗那，共 3 个航班。" }
  ],
  "isError": false
}
```

要点：

- **`content`**：工具返回给模型的内容列表，支持多种类型（文本、图片、资源引用等）。
- **`isError`**：布尔值，标记这次工具执行是否「业务上失败」。`true` 表示工具执行出错（但协议层面仍是一次成功响应）。
- 模型读到 `content` 后，据此继续推理，生成面向用户的最终回答。

> 区分「协议错误」与「业务错误」：协议错误用 JSON-RPC 的 `error` 对象返回（见通信机制一章）；工具业务失败则通过结果中的 `isError: true` 表达。

## 工具定义示例（JSON Schema）

一个「搜索航班」的工具定义如下：

```json
{
  "name": "searchFlights",
  "description": "Search for available flights",
  "inputSchema": {
    "type": "object",
    "properties": {
      "origin": { "type": "string", "description": "Departure city" },
      "destination": { "type": "string", "description": "Arrival city" },
      "date": { "type": "string", "format": "date", "description": "Travel date" }
    },
    "required": ["origin", "destination", "date"]
  }
}
```

要点：

- `name`：工具的唯一标识，模型调用时引用它。
- `description`：帮助模型理解「何时、为何」使用该工具——这段文本对模型的选择质量影响很大。
- `inputSchema`：用 JSON Schema 描述参数，模型据此生成结构化的调用参数。
- `required`：声明必填参数，缺一不可。

## 代码示例（Python - FastMCP）

使用 FastMCP 定义工具非常简洁，装饰器 `@mcp.tool()` 即可把一个普通函数暴露为 MCP 工具：

```python
from fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers together"""
    return a + b
```

要点：

- `FastMCP("Math")` 创建一个名为 Math 的服务器。
- `@mcp.tool()` 把 `add` 函数注册为工具，函数签名与 docstring 会自动生成对应的 Schema。
- 函数的**类型注解**（`a: int, b: int -> int`）会被映射为 JSON Schema 的参数约束。

## 用户交互机制

为了让「模型控制」的工具调用始终处于人的监督之下，宿主应用通常提供：

- **在 UI 中显示可用工具**：让用户知道模型能调用哪些能力。
- **单个工具执行的审批对话框**：执行前弹出确认。
- **预先批准某些安全操作的权限设置**：对可信操作免去重复确认。
- **显示所有工具执行及其结果的活动日志**：全程可审计。

## 本章小结

- Tools 是**模型控制**的可执行函数，处理「动作」。
- 工具用 **JSON Schema** 定义接口，遵循单一操作原则。
- 协议上通过 `tools/list` 发现、`tools/call` 调用。
- 模型负责发起调用，但**人工监督**贯穿始终。
