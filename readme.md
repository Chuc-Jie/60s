# ⏰ 60s API

> 基于 [vikiboss/60s](https://github.com/vikiboss/60s) 的 **Vercel 自部署版本**，无需 Deno / Oak 运行时，即 fork 即用。

![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-22-6DA55F?logo=node.js&logoColor=white) [![群](https://img.shields.io/badge/%E4%BC%81%E9%B9%85%E7%BE%A4-595941841-ff69b4)](https://qm.qq.com/q/RpJXzgfAMG)

一系列 **高质量、开源、可靠、全球 CDN 加速** 的开放 API 集合。已适配 Vercel Serverless Functions，移除 Oak 框架依赖，65 个接口全部可用。

| 🕘 周期资讯 | 🔥 热门榜单 | 🍱 实用功能 | 🎤 消遣娱乐 |
|------------|------------|------------|------------|
| 60s读世界、AI新闻、汇率、壁纸、Epic、金价、油价… | 微博、知乎、抖音、B站、头条、小红书、百度… | 天气、翻译、二维码、IP查询、歌词、百科、哈希… | 段子、一言、KFC文案、答案之书、运势、摸鱼… |

## 🚀 快速开始

**线上实例**: [https://60s.youyer.top](https://60s.youyer.top)  
**接口文档**: [https://60s.youyer.top/docs](https://60s.youyer.top/docs)

```bash
# 健康检查
curl https://60s.youyer.top/health
# → ok

# 每日 60s（纯文本，适合推送）
curl "https://60s.youyer.top/v2/60s?encoding=text"

# 天气
curl "https://60s.youyer.top/v2/weather/realtime?query=北京"

# 微博热搜
curl "https://60s.youyer.top/v2/weibo?encoding=markdown"

# 查看全部接口
curl https://60s.youyer.top/
```

## 📦 一键部署（Vercel）

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 无需任何配置，直接 Deploy
4. 绑定自定义域名即可

> 项目已预置 `vercel.json`，Vercel 会自动识别并部署。

## 📋 通用参数

所有接口均支持 `?encoding=` 切换输出格式：

| 值 | 说明 |
|----|------|
| `json`（默认） | 结构化 JSON |
| `text` | 纯文本，适合终端/消息推送 |
| `markdown` | Markdown，适合文档/AI 消费 |

> `/v2/60s` 额外支持 `image`（图片直链）和 `image-proxy`（代理图片）。

## 🔧 与原项目的区别

| | 原项目 (vikiboss/60s) | 本 Fork |
|---|---|---|
| 框架 | Oak (Deno-first) | 原生 Node.js |
| 平台 | Deno Deploy | **Vercel** |
| 运行时 | Deno / Bun / Node / CF | 仅 Node.js (Vercel) |
| 依赖 | @oak/oak | ❌ 已移除 |
| 部署 | Docker / Deno Deploy / CF Workers | Vercel 一键 |
| 模块代码 | — | 核心逻辑零改动 |

详见 [VERCEL_MIGRATION.md](./VERCEL_MIGRATION.md)。

## 📁 项目结构

```
├── api/
│   └── index.ts          # Vercel Serverless Function 入口 + 路由
├── src/
│   ├── common.ts         # 公共工具（buildJson、md5、dayjs 等）
│   ├── config.ts         # 配置
│   ├── docs-content.ts   # /docs 页面
│   └── modules/          # 54 个业务模块（与原项目一致）
├── vercel.json           # Vercel 部署配置
├── VERCEL_MIGRATION.md   # 迁移技术记录
└── package.json
```

## 🤝 社区与致谢

- **原项目**: [vikiboss/60s](https://github.com/vikiboss/60s) — 感谢原作者的开源贡献
- **QQ 群**: [595941841](https://qm.qq.com/q/RpJXzgfAMG) (问题反馈、使用交流)
- **本项目**: [Chuc-Jie/60s](https://github.com/Chuc-Jie/60s)

## 🪪 License

[MIT](license) License © 2022-PRESENT Viki
