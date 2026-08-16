前面学完了概念、架构、原语与通信机制，本章把知识落地：**从零构建一个完整的 MCP Server**。我们使用官方推荐的 Python FastMCP 框架，逐步注册工具、资源与提示词，并演示如何运行与调试。

## 环境准备

MCP 官方 Python SDK 名为 `mcp`，其中内置了 `FastMCP` 这一高级框架。安装：

```bash
pip install mcp
```

FastMCP 是官方 Python SDK 提供的高级接口，用装饰器即可把普通 Python 函数暴露为 MCP 能力，大幅降低开发门槛。

## 构建目标

我们要构建一个「天气助手」服务器，具备三类能力：

1. **一个工具**：`get_weather(city)` —— 查询城市天气（动作）。
2. **一个资源**：`weather://summary` —— 提供天气摘要（数据）。
3. **一个提示词**：`weather_report` —— 生成天气播报模板（模板）。

## 步骤一：创建服务器实例

一切从一个 `FastMCP` 实例开始，服务器名称用于标识与展示：

```python
from fastmcp import FastMCP

mcp = FastMCP("weather-assistant")
```

## 步骤二：注册工具

用 `@mcp.tool()` 把函数暴露为工具。**类型注解会自动生成 JSON Schema**，**docstring 会作为工具描述**（这对模型正确调用至关重要）：

```python
@mcp.tool()
def get_weather(city: str) -> dict:
    """查询指定城市的实时天气"""
    # 这里模拟查询结果，实际可接入天气 API
    return {"city": city, "temperature": 26, "condition": "晴"}
```

## 步骤三：注册资源

用 `@mcp.resource(uri)` 把函数暴露为 URI 标识的资源：

```python
@mcp.resource("weather://summary")
def weather_summary() -> str:
    """返回今日天气摘要"""
    return "今日多云转晴，气温 24~30°C，适合出行。"
```

## 步骤四：注册提示词

用 `@mcp.prompt()` 暴露可复用的提示词模板，支持参数化：

```python
@mcp.prompt()
def weather_report(city: str) -> str:
    """生成指定城市的天气播报提示词"""
    return f"请用播报员的语气，播报{city}今天的天气情况。"
```

## 完整代码

把以上几步合并，就是一个可运行的 MCP Server：

```python
from fastmcp import FastMCP

mcp = FastMCP("weather-assistant")

@mcp.tool()
def get_weather(city: str) -> dict:
    """查询指定城市的实时天气"""
    return {"city": city, "temperature": 26, "condition": "晴"}

@mcp.resource("weather://summary")
def weather_summary() -> str:
    """返回今日天气摘要"""
    return "今日多云转晴，气温 24~30°C，适合出行。"

@mcp.prompt()
def weather_report(city: str) -> str:
    """生成指定城市的天气播报提示词"""
    return f"请用播报员的语气，播报{city}今天的天气情况。"

if __name__ == "__main__":
    mcp.run()
```

## 运行与调试

FastMCP 提供了便捷的开发与调试命令：

```bash
# 以 stdio 传输方式运行（本地单客户端场景）
python weather_server.py

# 使用 MCP Inspector 可视化调试
mcp dev weather_server.py
```

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) 是官方提供的开发工具，可以在浏览器中直观地：

- 查看服务器暴露了哪些 tools/resources/prompts。
- 手动调用工具并查看返回结果。
- 检查初始化、能力协商等底层消息。

把服务器接入宿主应用（如 Claude Desktop）时，需要在宿主配置中登记该服务器的启动命令，宿主会以子进程方式拉起它，通过 stdio 与之通信。

## 最佳实践

构建一个高质量的 MCP Server，应遵循以下原则（也呼应了第二章的设计原则）：

1. **单一职责**：一个服务器聚焦一类能力（如只做天气），多个服务器组合成复杂助手。
2. **写好 docstring**：工具描述直接决定模型「何时、为何」调用它，务必清晰准确。
3. **用好类型注解**：类型注解自动映射为 JSON Schema，是参数校验的第一道关卡。
4. **只暴露必要能力**：遵循「服务器不能读取整个对话」原则，只访问完成任务所需的最小数据。
5. **遵守安全约束**：涉及敏感操作的工具，应在执行前请求用户授权，并做好审计。

## 本章小结

- 构建一个 MCP Server 的核心步骤：**创建实例 → 注册 tool/resource/prompt → 运行**。
- FastMCP 用**装饰器**把普通函数暴露为 MCP 能力，类型注解自动生成 Schema。
- 用 `mcp dev` 与 MCP Inspector 可以快速调试与验证。
- 遵循单一职责、清晰描述、最小权限等最佳实践，是写出可靠服务器的关键。
