前面几章聚焦「服务器能为模型提供什么」（tools/resources/prompts）。但有一个反向的问题：**服务器自己需要模型的能力时怎么办？** 比如一个「代码审查」工具需要调用 LLM 来生成审查意见。这就是本章的主角——**Sampling（采样）** 与 **Elicitation（信息获取）**：让服务器反过来请求客户端（宿主）调用 LLM 或向用户索取输入。

## 为什么需要反向调用？

MCP 服务器通常是一个**不持有模型**的程序。它擅长访问文件、查数据库、发邮件，但遇到「需要生成一段自然语言」或「需要用户补充信息」时，就无能为力了。

于是 MCP 定义了**客户端能力**（Client Capabilities），让服务器可以反过来请求宿主：

- **Sampling**：请求宿主调用 LLM 生成内容。
- **Elicitation**：请求宿主向用户弹出表单、索取结构化输入。

```text
                正向（服务器能力）
   Server ── tools/resources/prompts ──▶ Client/Host

                反向（客户端能力）
   Server ── sampling / elicitation ──▶ Client/Host
```

这一双向设计让 MCP 从「单向的能力暴露」升级为「双向的能力协作」。

## Sampling（采样）

### 定义

Sampling 允许**服务器请求客户端让宿主 LLM 生成内容**。典型场景：一个「文本摘要」工具本身不做摘要，而是请求宿主调用模型完成摘要，再把结果返回给调用方。

### 协议操作

核心方法是 `sampling/createMessage`：服务器发送一条采样请求，客户端（宿主）执行 LLM 推理后返回生成的文本。

### 能力协商

Sampling 是**客户端**提供的能力。在初始化阶段：

- 客户端在 `capabilities` 中声明 `sampling: {}`，表示「我支持被你请求采样」。
- 服务器只有在确认客户端声明了该能力后，才会发起采样请求。

这保证了服务器不会向一个不支持采样的客户端发出无效请求。

### 请求结构

一条采样请求大致包含：

- `messages`：作为提示词的输入消息（如系统提示、用户提示）。
- `maxTokens`：期望生成的最大 token 数。
- `includeContext`：是否在采样上下文中附带资源等额外信息。
- `modelPreferences`：对模型选择的偏好（可选）。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "请对以下代码做简短评审：def add(a,b): return a+b"
        }
      }
    ],
    "maxTokens": 512
  }
}
```

### 安全与监督

Sampling 涉及「让模型生成内容」，因此同样受人工监督约束：

- 用户应能**看到并同意**采样请求。
- 服务器不应滥用采样能力绕过用户授权。
- 采样消耗的是宿主的模型配额，宿主应有节流与审计机制。

## Elicitation（信息获取）

### 定义

Elicitation 允许**服务器请求客户端向用户索取信息**，例如弹出一个表单，让用户填写参数或做出选择。核心方法是 `elicitation/create`。

### 与 Sampling 的区别

两者都是「反向请求」，但目标不同：

| 维度 | Sampling | Elicitation |
|------|----------|-------------|
| 请求的对象 | 宿主 LLM | 用户（人） |
| 返回的内容 | 模型生成的文本 | 用户填写的结构化输入 |
| 典型场景 | 摘要、翻译、代码评审 | 表单填写、确认选择、补充信息 |
| 核心方法 | `sampling/createMessage` | `elicitation/create` |

> 一句话：**Sampling 问模型，Elicitation 问用户。**

### 典型场景

- 服务器需要用户在多个选项中确认，再继续执行。
- 服务器需要收集额外的业务参数（如日期范围、权限范围）。
- 服务器在危险操作前，要求用户显式确认。

## 反向调用的完整链路

以「代码审查工具请求采样」为例：

```text
1. Client ── tools/call ─────────▶ Server（用户触发了 code_review 工具）
2. Server ── sampling/createMessage ──▶ Client（服务器请求 LLM 生成审查意见）
3. Client ── Host 调用 LLM ────────▶ 生成审查意见
4. Client ◀── 生成结果 ─────────────── Host
5. Client ── 结果返回给 Server ──▶（Server 拿到审查意见）
6. Server ── tools/call 结果 ──────▶ Client（工具执行完成）
```

可以看到，Server 在中间「反客为主」地请求了一次采样，但整体仍是围绕最初的工具调用展开的。

## 本章小结

- MCP 不仅让服务器暴露能力，也定义了**客户端能力**让服务器反向调用。
- **Sampling** 让服务器请求宿主 LLM 生成内容（`sampling/createMessage`）。
- **Elicitation** 让服务器请求用户提供输入（`elicitation/create`）。
- 两者都受**能力协商**与**人工监督**约束，是 MCP 双向协作能力的关键。
