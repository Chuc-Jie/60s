# 60s API · Vercel 改造记录

> 本文档记录将 [vikiboss/60s](https://github.com/vikiboss/60s) 从 Deno/Oak 架构迁移到 Vercel Serverless Functions 所做的一切改动，以及每项改动的理由。

---

## 概述

原项目基于 **Deno + Oak** 框架，支持 Deno / Bun / Node.js / Cloudflare Workers 多种运行时。改造目标是在**不修改 54 个业务模块核心逻辑**的前提下，适配 **Vercel Serverless Functions**。

### 改造原则

1. **业务代码零改动** — 54 个 `src/modules/*` 的 `#fetch()` 数据获取逻辑一行不动
2. **最小依赖** — 移除 Oak，不引入新框架
3. **Vercel 原生** — 使用 Vercel 默认的 TypeScript 编译，无需自定义构建

### 最终效果

所有 65 个 API 接口在 Vercel 上正常运行，域名 `https://60s.youyer.top`。

---

## 一、新建核心文件

### 1.1 `api/index.ts` — Vercel 入口 + 轻量 Oak ctx 适配层

**改动**：新建约 430 行，是整个改造的核心。

**内容**：
- 一个 `FakeOakCtx` 接口，模拟 Oak 框架的 `ctx.request` / `ctx.response` / `ctx.state`
- 一个 `createOakCtx()` 函数，从 Vercel 的 `(req, res)` 原生对象构建 fake ctx
- 一个 65 条路由表，将 URL 路径映射到各模块的 `handle()` 方法
- 一个 `export default async function handler(nodeReq, nodeRes)` 主函数

**为什么要这么写**：

Oak 的 `ctx` 对象是 54 个模块与 HTTP 层的唯一接口。如果不用 fake ctx，就要重构每个模块的 `handle()` 方法，把 `ctx.response.body = xxx` 改成 `return xxx`——54 个文件，每个都要改输出格式逻辑，风险大、测试成本高。

fake ctx 的思路是：让模块代码"以为"自己在 Oak 环境里跑，实际上运行时是一个普通的 JavaScript 对象，我们拦截它的 `body` / `status` / `headers` 赋值，最后通过 Vercel 的 `nodeRes` 返回。

**关键设计细节**：

```
模块代码中            →    fake ctx 实际行为
─────────────────────────────────────────────
ctx.request.url.searchParams.get('query')  →  new URL(req.url).searchParams.get()
ctx.state.encoding                        →  从 query 参数提取
ctx.response.body = data                  →  存入内部变量
ctx.response.status = 400                 →  存入内部变量
ctx.response.headers.set(k, v)            →  存入内部 Map
ctx.response.redirect(url)                →  设置 302 + Location 头
ctx.request.ip                            →  读 x-forwarded-for 头
ctx.request.body.json()                   →  从 nodeReq 读 body 解析 JSON
```

**为什么不直接用 Oak**：

Vercel 的 Node.js runtime 使用 CJS `(req, res)` 回调接口。Oak 的 `app.fetch(req: Request)` 需要 Web API 的 `Request` 对象。Vercel 在 Node.js runtime 中不自动提供 `Request` 对象（它给的是 `IncomingMessage`）。强行对接会导致 `TypeError: request.headers.get is not a function`（Oak 内部调用 `request.headers.get()` 但 `IncomingMessage.headers` 是普通对象，没有 `.get()` 方法）。

因此直接写 fake ctx + 原生 `(req, res)` 是唯一可行的方案，不经过 Oak 的 `app.fetch`。

---

## 二、删除 Oak 依赖

### 2.1 `package.json` — 移除 `@oak/oak`

**改动**：从 `dependencies` 中删除 `"@oak/oak": "npm:@jsr/oak__oak@^17.2.0"`

**为什么**：fake ctx 替代了 Oak 的全部功能，不再需要这个依赖。同时也移除了 `esbuild`（见下一节）。

### 2.2 删除 Oak 框架文件

**改动**：删除以下文件

| 文件 | 作用 | 为什么删 |
|------|------|----------|
| `src/app.ts` | Oak Application 初始化 + 中间件注册 | 不再需要 Oak 应用实例 |
| `src/router.ts` | Oak Router + 全部路由定义 | 路由已移到 `api/index.ts` 路由表 |
| `src/middlewares/blacklist.ts` | IP 黑名单 | 在 Vercel 入口中内联实现 |
| `src/middlewares/cors.ts` | CORS 头 | 在 Vercel 入口中内联实现 |
| `src/middlewares/debug.ts` | 请求日志 | 在 Vercel 入口中内联实现 |
| `src/middlewares/encoding.ts` | encoding 参数提取 | fake ctx 中 `createOakCtx()` 已处理 |
| `src/middlewares/favicon.ts` | favicon 重定向 | 在 Vercel 入口中内联实现 |
| `src/middlewares/handle-global-error.ts` | 全局错误处理 | 在 Vercel 入口的 try/catch 中实现 |
| `src/middlewares/not-found.ts` | 404 处理 | 在 Vercel 入口的路由匹配失败时处理 |

**为什么删而不是保留**：这些文件都强依赖 Oak 的 `Middleware` / `RouterMiddleware` 类型。保留它们意味着保留 Oak 类型依赖，与"去掉 Oak"的目标矛盾。而且每个中间件的逻辑就 5-15 行，内联到入口里反而更清晰。

### 2.3 删除运行时入口文件

| 文件 | 作用 | 为什么删 |
|------|------|----------|
| `node.ts` | Node.js 入口（`app.listen()`） | Vercel 不需要监听端口 |
| `deno.ts` | Deno 入口 | 不再支持 Deno |
| `bun.ts` | Bun 入口 | 不再支持 Bun |
| `cf-worker.ts` | Cloudflare Workers 入口（`export default { fetch: app.fetch }`） | 不再部署到 CF |

**为什么删**：这些文件都 import 了 `src/app.ts`（Oak 应用实例），而 `src/app.ts` 已被删除。保留它们会导致编译失败。

---

## 三、模块代码的类型修复

### 3.1 52 个文件中移除 `RouterMiddleware` 类型导入

**改动**：每个 `src/modules/*.ts` 文件中删除一行：

```diff
- import type { RouterMiddleware } from '@oak/oak'
```

以及删除 `handle()` 方法的返回类型注解：

```diff
- handle(): RouterMiddleware<'/path'> {
+ handle() {
```

**为什么**：`RouterMiddleware` 是 Oak 的类型。去掉 Oak 后这个类型不存在，TypeScript 编译会报错。去掉后 TypeScript 会从 `return async (ctx) => { ... }` 自动推断返回类型，不影响功能。

这 52 个文件没有任何功能逻辑改动。

### 3.2 `src/common.ts` — 类型兼容性修复

**改动 1**：`getParam()` 方法签名

```diff
- static async getParam(name: string, request: Request & { ... }, parseBody = false) {
+ static async getParam(
+   name: string,
+   request: { url: URL; _bodyJson?: ...; body?: ... | null },
+   parseBody = false,
+ ) {
```

**为什么**：原来依赖 Oak 的 `Request` 类型（它把 `request.url` 重定义为 `URL` 对象而非字符串）。去掉 Oak 后，标准 `Request` 的 `url` 是 `string`，没有 `.searchParams` 属性。改为自定义类型，匹配 fake ctx 实际传入的对象。

**改动 2**：`qs()` 方法

```diff
+ if (typeof params === 'string') return params
+ if (params instanceof URLSearchParams) return params.toString()
- result.append(key, item)
+ result.append(key, String(item))
- return new URLSearchParams(entries).toString()
+ return new URLSearchParams(entries as [string, string][]).toString()
```

**为什么**：`URLSearchParams` 构造函数在严格类型检查下要求 `string` 值，但 `Primitive` 类型包含 `number | boolean | null | undefined`。加上显式转换和类型断言。

**改动 3**：`requireArguments()` 方法签名

```diff
- static requireArguments(name, response: RouterContext<...>['response']) {
+ static requireArguments(name, response: { status: number; body: any }) {
```

**为什么**：`RouterContext` 是 Oak 类型。改为只声明实际用到的两个属性。

**改动 4**：`request.body` 空值检查

```diff
  if (!json) {
+   if (!request.body?.json) return value
    request._bodyJson = await request.body.json()
  }
```

**为什么**：`request.body` 在新类型中是可选的（`body?: ... | null`），加上空值保护。

---

## 四、配置文件改动

### 4.1 `src/config.ts` — 消息和链接更新

**改动**：

```diff
- github: 'https://github.com/vikiboss/60s',
+ github: 'https://github.com/Chuc-Jie/60s',
+ upstream: 'https://github.com/vikiboss/60s',

- export const COMMON_MSG = `获取成功。当前部署平台 Deno Deploy Classic...`
+ export const COMMON_MSG = `获取成功。开源地址 ${config.github}，官方源 ${config.upstream}，官方反馈群 ${config.group}。`
```

**为什么**：
1. 原项目的公告消息说"Deno Deploy 即将停服"——这会让用户以为我们的服务也要停，实际我们跑在 Vercel 上不受影响
2. `github` 改为自己的 fork 地址，让用户知道谁在维护这个实例
3. 保留 `upstream` 指向上游，尊重原作者

### 4.2 `vercel.json` — Vercel 部署配置

**最终版本**：

```json
{
  "functions": {
    "api/index.ts": {
      "includeFiles": "src/**"
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
}
```

**为什么这个配置能工作**：

1. `functions.api/index.ts` — 告诉 Vercel 只有一个 serverless function，入口是 `api/index.ts`
2. `includeFiles: "src/**"` — **关键配置**。Vercel 默认只打包入口文件及其 trace 到的 `node_modules`，不会自动包含 `src/` 下的源文件。加上这个后，Vercel 编译入口时会把所有 `src/**` 文件一并打包，使得 `import '../src/modules/60s.module.ts'` 能正确解析
3. `rewrites` — 把 `GET /health`、`GET /v2/60s` 等所有请求都路由到 `/api/index`

> ⚠️ 这个配置经历了很多试错。见 [VERCEL_MIGRATION.md](./VERCEL_MIGRATION.md) 中的踩坑记录。

---

## 五、新增功能文件

### 5.1 `src/docs-content.ts` — API 文档页面

**改动**：新建约 280 行，包含完整的 HTML 文档页面。

**为什么**：原项目的文档托管在外部平台（Apifox / Wolai）。自部署版本需要一个自带的文档页，方便用户快速查阅所有接口。

### 5.2 `api/index.ts` 中的 `/docs` 路由

**为什么 typescript 文件放在 `src/` 而非 `api/`**：

Vercel 会把 `api/` 目录下的每个 `.ts` 都当成独立的 serverless function。如果把 `docs-content.ts` 放在 `api/`，Vercel 会尝试把它编译为一个函数，但它只 export 了一个 HTML 字符串，没有合法的 handler，会导致编译失败。放到 `src/` 后它只是一个被 import 的普通模块，不会触发 Vercel 的函数检测。

---

## 六、文档文件

### 6.1 `readme.md` — 重写

**改动**：从 204 行精简到 98 行。

**为什么**：
- 原 README 写了 Deno Deploy、Docker、Bun、Cloudflare Workers 等我们不支持的部署方式
- 示例 URL 都指向 `60s.viki.moe`，需要换成自己的域名
- 需要明确标识这是 Vercel fork 版本

### 6.2 `VERCEL_MIGRATION.md` — 迁移技术记录

**改动**：新建约 200 行。

记录了 esbuild 打包 vs includeFiles 两种方案的探索过程、4 个关键踩坑问题的根因和解决方案。

---

## 七、合并上游更新

### 7.1 weather 模块：新增 `city` / `province` 参数

**改动**：从上游 `vikiboss/60s:main` 合并 `src/modules/weather.module.ts` 的 59 行改动。

**为什么**：上游修复了一个实际问题——搜索"市中区"、"东城区"等模糊地名时查不到天气。新增 `city` 和 `province` 可选参数辅助腾讯天气 API 定位。

合并后需要重新去掉 `RouterMiddleware` 类型导入（上游代码仍依赖 Oak 类型）。

---

## 改动量统计

| 类别 | 数量 | 说明 |
|------|------|------|
| 新建文件 | 5 | `api/index.ts`, `src/docs-content.ts`, `vercel.json`, `VERCEL_MIGRATION.md`, 重写 `readme.md` |
| 删除文件 | 14 | 1 个 app + 1 个 router + 7 个 middleware + 4 个运行时入口 + 1 个构建脚本 |
| 修改文件 | 56 | 52 个模块（去类型导入）+ `common.ts` + `config.ts` + `package.json` + `weather` 合并 |
| 模块核心代码改动 | **0 行** | 所有 `#fetch()` 数据获取逻辑未动 |

---

## 为什么不改模块核心代码

这是整个改造最重要的设计决策。每个模块的核心都在 `#fetch()` 私有方法里——它负责从外部 API 获取数据、解析 HTML、处理缓存。这些逻辑经过了原项目的大量使用和验证，改动风险极高。

fake ctx 适配层的本质是**在 HTTP 层和业务层之间插入一个轻量转换层**，让模块以为自己还在 Oak 环境里。这样一来：

- ✅ 业务逻辑零风险
- ✅ 上游更新可以直接合并（只需重新去一次类型）
- ✅ 适配层的 430 行代码承担了所有平台差异
- ✅ 65 个接口一次性全部可用，无需逐个改

如果采用"逐个模块重写"的方案，需要修改 54 个文件的输出格式化逻辑（`ctx.response.body = formatText(data)` → `return formatText(data)`），工作量数倍于此，且容易引入回归 bug。

---

## 八、平台兼容性分析

### 8.1 当前支持的平台

我们当前的 handler 签名是：

```ts
export default async function handler(nodeReq, nodeRes) { ... }
```

这是 **Node.js 标准的 `(IncomingMessage, ServerResponse)` 回调**，和 `http.createServer(handler).listen()` 完全一致。因此：

| 平台 | 能否部署 | 原因 |
|------|----------|------|
| **Vercel** | ✅ | 原生就是这个接口 |
| **普通 VPS/服务器** | ✅ | 一行代码 `createServer(handler).listen(4399)` |
| **Docker** | ✅ | 容器里跑 Node.js 即可 |
| **Railway / Render / Fly.io** | ✅ | 这些平台都接受标准 Node.js HTTP handler |
| **Cloudflare Workers** | ❌ | 要求 `export default { fetch(request) }` 签名，不兼容 |
| **Deno Deploy** | ❌ | 要求 `Deno.serve(fetch)` 接口，不兼容 |

### 8.2 为什么 54 个模块不受平台限制

模块依赖的是 fake ctx，它只关心这三件事：

```ts
ctx.request.url.searchParams  // URL 参数提取
ctx.response.body = xxx       // 响应体设置
ctx.state.encoding            // 编码类型
```

跟底层是哪个 HTTP 平台**完全无关**。fake ctx 就是一层隔离：

```
平台 A (Vercel)       →  fake ctx  ← 54 个模块（不动）
平台 B (普通服务器)    →  fake ctx  ← 54 个模块（不动）
平台 C (Cloudflare)   →  fake ctx  ← 54 个模块（不动）
```

换平台只需写一个新的入口文件（适配该平台的 HTTP 接口 → fake ctx），**模块代码一个都不用动**。

---

## 九、多平台架构设计

### 9.1 为什么不能一个文件自动判断平台

每个平台对入口文件的**导出格式**有硬性要求，且这些要求在**编译时**就确定了：

| 平台 | 要求 | 冲突点 |
|------|------|--------|
| Vercel | `export default function (req, res) {}` | CJS 回调风格 |
| Cloudflare Workers | `export default { fetch(request) {} }` | 对象导出风格 |
| Deno Deploy | `Deno.serve((request) => {})` | 是执行**语句**，不是导出 |
| 普通服务器 | `createServer(handler).listen()` | 是**启动逻辑**，不是导出 |

一个文件不可能同时满足这些互斥的导出格式——它们在编译时就绑定到各自平台了，不存在运行时"检测并切换"。

### 9.2 正确架构：共享核心 + 薄包装

将 `api/index.ts` 中的请求处理逻辑抽离为公共核心 `src/handler.ts`，各平台写一个 5-10 行的入口文件：

```
                           ┌─→ api/index.ts            (Vercel)
54 个业务模块                │   转 (req, res) → fake ctx → handler
(src/modules/*)  ──→       ├─→ server.ts               (普通服务器)
[一行不改]                   │   createServer(handler)
                           ├─→ cf-worker.ts            (Cloudflare Workers)
                           │   转 (Request) → fake ctx → handler
                           └─→ deno-serve.ts           (Deno Deploy)
                               转 (Request) → fake ctx → handler
```

以 Cloudflare Workers 为例，新增只需一个文件：

```ts
// cf-worker.ts — Cloudflare Workers 入口
import { handleRequest } from './src/handler.ts'

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request)
  }
}
```

其中 `src/handler.ts` 接收 `Request`，构造 fake ctx，返回 `Response`。这个核心逻辑和当前 `api/index.ts` 的处理部分完全相同，只是去掉了 `(req, res)` 的转换层，直接工作在 `Request → Response` 上。
