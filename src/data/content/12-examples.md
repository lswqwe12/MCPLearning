本章是收官章节，用一个「旅行预订」场景把前面学到的工具、组件、工作流串起来，并给出一个完整的 MCP Server 代码示例。

## 完整示例：旅行预订场景

在一个旅行规划场景中，AI 应用可能使用多个工具来帮助预订假期。这三个工具分别演示了「查询」「创建」「通知」三类典型动作：

### 1. 航班搜索

查询多家航空公司，返回结构化航班选项：

```text
searchFlights(origin: "NYC", destination: "Barcelona", date: "2024-06-15")
```

### 2. 日历日程

在用户日历中标记旅行日期：

```text
createCalendarEvent(title: "Barcelona Trip", startDate: "2024-06-15", endDate: "2024-06-22")
```

### 3. 邮件通知

向同事发送自动外出消息：

```text
sendEmail(to: "team@work.com", subject: "Out of Office", body: "...")
```

### 场景背后的分工

```text
User: "帮我订 6 月去巴塞罗那的行程"
        │
        ▼
AI (Host) 规划步骤
        │
        ├─▶ searchFlights(...)          → 航班 Server（查询类工具）
        ├─▶ createCalendarEvent(...)    → 日历 Server（变更类工具）
        └─▶ sendEmail(...)              → 邮件 Server（通知类工具）
```

- 每个工具都由**不同的 MCP Server** 提供。
- AI（Host）负责**编排**：决定调用哪些工具、以什么顺序、传什么参数。
- 各 Server 各司其职，**可组合**成一个完整的「旅行助手」。

## 简单 MCP Server 完整代码（Python）

一个「API 余额查询」MCP Server 的完整代码：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("api-balance-checker")

@mcp.tool()
def check_balance(provider: str) -> dict:
    """Check API balance for a given provider"""
    # 实现逻辑
    return {"provider": provider, "balance": 100.0}
```

代码要点：

- `FastMCP("api-balance-checker")` 创建服务器实例。
- `@mcp.tool()` 注册一个名为 `check_balance` 的工具。
- 函数签名 `provider: str -> dict` 自动映射为工具的 JSON Schema。
- 返回的字典会成为工具执行结果，回传给模型。

## 综合回顾

到这里，你已经完整走过了 MCP 的知识体系：

```text
入门层  1. 基本介绍 ──▶ 2. 技术架构
           │                │
核心层  3. 核心组件 ──▶ 4. Tools / 5. Prompts / 6. Resources / 7. Notifications
           │
进阶层  8. 工作流程 ──▶ 9. 通信机制 ──▶ 10. 采样与信息获取
           │
        11. 构建 MCP Server ──▶ 12. 综合示例
```

- **基本介绍**让你知道 MCP 是什么、为什么重要。
- **技术架构**让你理解分层设计与设计原则。
- **核心组件**让你掌握 Host/Client/Server 的职责。
- **三大原语**让你会用 Tools、Prompts、Resources。
- **通知机制**让你理解服务器如何实时推送变化。
- **工作流程**让你看懂一次交互如何跑通。
- **通信机制**让你吃透底层协议、错误处理与生命周期。
- **采样与信息获取**让你理解服务器反向调用客户端的能力。
- **构建 MCP Server**让你把知识落地为可运行的代码。
- **综合示例**让你把知识串成实战能力。

## 本章小结

- 旅行预订场景展示了**多工具、多服务器、可组合**的典型用法。
- AI（Host）负责**编排**，各 Server 负责**执行**。
- 一个 MCP Server 的核心代码只需「创建实例 + 注册工具」两步。
- 至此，MCP 的完整知识体系已闭环，可进入练习巩固。
