# 60s API 迁移到 Vercel — 技术记录

> 从 Deno/Oak 架构迁移到 Vercel Serverless Functions，所有 65 个 API 接口保持不变。

---

## 问题背景

原项目 [vikiboss/60s](https://github.com/vikiboss/60s) 基于 **Deno + Oak 框架**，设计目标是多运行时（Deno / Node / Bun / Cloudflare Workers），但**不包含 Vercel**。直接部署到 Vercel 遇到两个致命问题：

1. **Oak 不与 Vercel 兼容**：Oak 的 `.fetch()` 返回 `Request → Response` 的 Web API 格式，但 Vercel Node.js Runtime 使用的是传统 `(req, res)` 回调模式，两者无法对接。
2. **`.ts` 扩展名导入**：源码中所有 import 都带 `.ts` 后缀（如 `import { x } from './foo.ts'`），Vercel 内置的 ncc 打包器无法处理这种写法，编译直接失败。

---

## 最终方案总结

| 问题 | 解决 |
|------|------|
| `ERR_MODULE_NOT_FOUND src/modules/60s.module.ts` | esbuild 打包所有源码到单个 `api/index.mjs` |
| `default export returned a Response — signature is (req,res) => void` | 改用 Vercel 原生 `(req, res)` 回调接口 |
| CJS 的 `module.exports` 被覆盖 | 改用 ESM 格式，`export default` 无此问题 |
| Vercel 编译 `.ts` 入口失败 | 构建脚本先编译为 `.mjs`，然后删除 `.ts` |

### 改动量

| 类型 | 文件 |
|------|------|
| 删除 | `src/app.ts`、`src/router.ts`、7 个 middleware、4 个运行时入口 |
| 新增 | `scripts/build-vercel.mjs`（esbuild 构建脚本） |
| 修改 | `api/index.ts`（fake Oak ctx + 路由表）、`vercel.json`（buildCommand）、`package.json`（去 Oak/加 esbuild） |
| 模块 | 52 个文件的类型导入（去掉 `RouterMiddleware`），核心逻辑**一行未动** |

---

## 解决方案：三步改造

### 第 1 步：去掉 Oak，用适配层替代

不修改任何业务模块代码，只替换 HTTP 层。

**删掉的 4 类文件**（全部是 Oak 专属）：

| 文件 | 作用 |
|------|------|
| `src/app.ts` | Oak Application 实例 |
| `src/router.ts` | Oak Router 路由定义 |
| `src/middlewares/*`（7 个文件） | CORS、编码、错误处理、日志等 |
| `node.ts` / `deno.ts` / `bun.ts` / `cf-worker.ts` | 各运行时入口 |

**新增的核心文件**：`api/index.ts`（约 400 行）

```
api/index.ts
├── createOakCtx()     → 伪造 Oak ctx 对象（request / response / state）
├── 路由表（60+ 路径）  → 正则匹配，分发到各模块的 handle()
└── export default handler(req, res) → Vercel 原生入口
```

`createOakCtx()` 用一个普通对象模拟 Oak 的 `ctx`，让所有模块误以为还在 Oak 环境里：

```ts
// 模块代码完全不用改，它拿到的 ctx 长这样：
ctx.request.url.searchParams   // 原生 URL 对象，搜参正常
ctx.state.encoding             // encoding 参数值
ctx.response.body = data       // 设置响应体
ctx.response.status = 404      // 设置状态码
ctx.response.headers.set(...)  // 设置响应头
```

**改动量**：模块代码 0 行改动（仅去掉了类型注解 `RouterMiddleware`）。

### 第 2 步：适配 Vercel 的函数签名

Vercel 的 Node.js Runtime 期望的函数签名是：

```ts
// ❌ Vercel 不认这种（返回 Response 会被忽略）
export default (req: Request) => new Response('ok')

// ✅ 必须用传统 Node.js 回调
export default (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200)
  res.end('ok')
}
```

在 `api/index.ts` 的入口函数中做了转换：

```
IncomingMessage + ServerResponse
        ↓ 解析 headers / body
   标准 Request 对象
        ↓ 传给 createOakCtx()
   伪造的 Oak ctx
        ↓ 传给模块的 handle()
   ctx.response.body 被赋值
        ↓ 写回 ServerResponse
   响应发送到客户端
```

### 第 3 步：esbuild 打包

Vercel 自己的打包器（ncc）处理不了 `.ts` 扩展名导入，改用 esbuild 在构建阶段把所有源码打成一个文件。

**构建脚本** `scripts/build-vercel.mjs`：

```js
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['api/index.ts'],
  bundle: true,           // 全量打包，源码 + node_modules 都内联
  platform: 'node',
  target: 'node20',
  format: 'esm',          // ESM 格式，避免 CJS 的 module.exports 排序问题
  outfile: 'api/index.mjs',
  external: ['node:*'],   // Node.js 原生模块不打包
})

// 删掉 api/index.ts，Vercel 只看到编译后的 .mjs
unlinkSync('api/index.ts')
```

**vercel.json**：

```json
{
  "buildCommand": "pnpm run build:vercel",
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
}
```

构建流程：`Vercel clone 仓库 → pnpm install → pnpm run build:vercel（esbuild） → 部署 api/index.mjs`

---

## 最终架构

```
Vercel 请求
  │
  ▼
vercel.json rewrite: /(.*) → /api/index
  │
  ▼
api/index.mjs (esbuild 打包的 6.5MB ESM 单文件)
  ├── createOakCtx()       适配层
  ├── 路由匹配（正则）
  └── 分发到 src/modules/  所有业务模块（构建时内联）
       ├── 60s.module.ts
       ├── weather.module.ts
       ├── weibo.module.ts
       ├── ... (52 个模块)
       └── common.ts / config.ts
```

---

## 依赖变化

| 依赖 | 原项目 | 新项目 | 原因 |
|------|--------|--------|------|
| `@oak/oak` | 运行时依赖 | ❌ 移除 | Oak 与 Vercel 不兼容 |
| `esbuild` | — | ✅ devDependency | 构建时打包用 |

其余 10 个业务依赖（cheerio, dayjs, tyme4ts, fontkit...）全部保留不变。

---

## 踩过的坑

| 坑 | 现象 | 原因 | 解决 |
|----|------|------|------|
| CJS module.exports 被覆盖 | `require()` 返回空对象 | esbuild CJS 格式中，出口语句后面还有代码，后续模块初始化重置了 `module.exports` | 改用 ESM 格式 |
| Vercel 不认 Web API 签名 | 极简 handler 也 500 | Vercel Node.js Runtime 用的是 `(req, res)` 旧接口 | 入口改用 legacy 签名，手动转换 |
| 源码文件找不到 | `ERR_MODULE_NOT_FOUND src/modules/60s.module.ts` | Vercel 只部署 `api/` 下的文件，`src/` 目录不会被包含 | esbuild 全量打包到一个文件 |
| `includeFiles` 不编译 | 加了 `includeFiles` 但 `.ts` 文件不能被 Node.js 直接 import | Vercel 原样复制源文件但不编译 | 放弃 includeFiles，走 esbuild 打包 |

---

## 本地开发

```bash
pnpm install
pnpm run dev    # → http://localhost:4398（用 node.ts 启动，保留 Oak 风格本地开发）
```

如需测试 Vercel 构建产物：

```bash
pnpm run build:vercel
node -e "import('./api/index.mjs').then(m => {
  require('http').createServer(m.default).listen(3000)
})"
# → http://localhost:3000/health
```
