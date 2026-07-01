# 60s API · 深度实现分析报告

> 基于对全部 54 个模块源码的逐行审计，完整梳理 API 实现原理、数据来源、技术依赖和架构设计。

---

## 目录

1. [项目概况](#一项目概况)
2. [技术栈](#二技术栈)
3. [架构总览](#三架构总览)
4. [所有模块逐项分析](#四所有模块逐项分析)
   - [周期资讯（11 个）](#41-周期资讯-11-个)
   - [热门榜单（15 个）](#42-热门榜单-15-个)
   - [实用功能（16 个）](#43-实用功能-16-个)
   - [消遣娱乐（9 个）](#44-消遣娱乐-9-个)
   - [奥运 + Beta（3 个）](#45-奥运-beta3-个)
5. [数据来源全景图](#五数据来源全景图)
6. [技术手段分类](#六技术手段分类)
7. [依赖清单](#七依赖清单)

---

## 一、项目概况

| 维度 | 值 |
|------|-----|
| 接口总数 | 65 个（54 个模块，部分模块含多个端点） |
| 运行时 | Node.js（Vercel Serverless Functions） |
| 入口文件 | `api/index.ts`（~430 行） |
| 模块目录 | `src/modules/`（54 个文件） |
| 核心依赖 | dayjs, cheerio, tyme4ts, fontkit, whois-raw, yaqrcode, filesize, chinese-days |
| 原项目 | vikiboss/60s（Deno + Oak 框架） |

---

## 二、技术栈

### 2.1 运行时依赖

| 包名 | 版本 | 用途 | 哪个模块用 |
|------|------|------|------------|
| `dayjs` | 1.11 | 日期处理 + 时区转换 | 全局（`common.ts` 统一导出，几乎所有模块都用） |
| `cheerio` | 1.2 | HTML 解析（服务端 jQuery） | ai-news, gold-price, fuel-price, dongchedi, it-news |
| `tyme4ts` | 1.4 | 农历/干支/节气/宜忌计算 | 60s, 60s-rss, lunar |
| `fontkit` | 2.0 | TrueType/OpenType 字体文件解析 | maoyan/encode（猫眼票房数字解码） |
| `yaqrcode` | 0.2 | 二维码生成 | qrcode |
| `whois-raw` | 0.1 | WHOIS 域名查询（RDAP + 递归降级） | whois |
| `filesize` | 11.0 | 文件大小格式化 | ncm（网易云歌曲播放量格式化） |
| `chinese-days` | 1.5 | 中国节假日/工作日判断 | moyu |

### 2.2 Node.js 内置模块

| 模块 | 用途 | 哪个模块用 |
|------|------|------------|
| `node:crypto` | MD5/SHA 哈希、AES 解密 | hash, common(md5), fanyi（有道翻译 AES 解密）, maoyan/encode |
| `node:buffer` | 二进制数据操作 | hash, qrcode, maoyan/encode |
| `node:zlib` | Gzip / Brotli 压缩解压 | hash |
| `node:net` | TCP 连接（间接） | whois（通过 whois-raw 间接使用） |

### 2.3 平台适配层

| 组件 | 说明 |
|------|------|
| `api/index.ts` | Vercel Serverless Function 入口，含 fake Oak ctx + 65 条路由 |
| `vercel.json` | Vercel 部署配置（`includeFiles: "src/**"` + rewrites） |
| `src/common.ts` | 公共工具：JSON 构建、日期、MD5、QueryString、多源 fetch |

---

## 三、架构总览

### 3.1 请求链路

```
用户请求
  │
  ▼
Vercel rewrites → api/index.ts
  │
  ├── 解析 URL path → 匹配路由表（65 条映射）
  ├── 构造 fake Oak ctx（query params → ctx.request.url.searchParams）
  ├── 调用 module.handle() → 返回 Oak 中间件函数
  └── 中间件函数操作 ctx → 设置 ctx.response.body / status / headers
  │
  ▼
提取 ctx 中的 body/status/headers → 通过 nodeRes 返回给用户
```

### 3.2 每个模块的通用模式

```
handle() → 返回 async (ctx) => {
  1. 从 ctx.request.url.searchParams 提取参数
  2. 调用 #fetch() 获取/计算数据（含缓存逻辑）
  3. 根据 ctx.state.encoding 格式化输出到 ctx.response.body
}
```

### 3.3 缓存策略

项目中不使用 Redis 或数据库缓存，所有缓存均为**内存级 Map**：

| 策略 | 典型 TTL | 应用模块 |
|------|----------|----------|
| 短期缓存 | 10 秒 ~ 1 分钟 | hacker-news（10 秒防频繁请求） |
| 中期缓存 | 5 ~ 30 分钟 | weather, gold-price, fuel-price, epic |
| 长期缓存 | 直到进程重启 | exchange-rate, ip（城市信息） |
| 永久缓存 | 服务部署期间 | static data 类（JSON 文件在 import 时加载到内存） |

关键实现模式：

```ts
class ServiceWeather {
  cityCache = new Map<string, CityInfo>()     // 城市信息永久缓存
  weatherCache = new Map<string, { data: WeatherData; ts: number }>()  // 天气 10 分钟过期
}
```

### 3.4 响应编码（encoding）

所有模块支持三种标准编码，部分模块有额外格式：

| encoding | 输出格式 | 实现方式 |
|----------|----------|----------|
| `json`（默认） | `Common.buildJson(data)` → 固定 JSON 结构 `{code, message, data}` |
| `text` | 模板字符串拼接 | 手工格式化表格/换行 |
| `markdown` | Markdown 语法字符串 | 标题、表格、列表 |
| `image` | 302 重定向 | `/v2/60s` 重定向到图片 CDN |
| `image-proxy` | 直接返回二进制图片 | `/v2/60s` 先 fetch 图片再返回 |
| `audio` | 二进制音频 | `/v2/changya` 代理下载音频 |
| `html` | HTML 字符串 | `/v2/color` 颜色展示页 |

---

## 四、所有模块逐项分析

### 4.1 周期资讯（11 个）

#### 4.1.1 `/v2/60s` — 每天 60 秒读懂世界

| 维度 | 详情 |
|------|------|
| **数据来源** | GitHub 静态仓库 `vikiboss/60s-static-host`，通过 `60s-static.viki.moe` CDN |
| **数据格式** | JSON（`{date, title, image, tips, news[]}`） |
| **数据中的图片** | PNG 图片托管在同一 CDN |
| **更新机制** | 上游 GitHub Actions 每 30 分钟更新一次 |
| **缓存** | `Map<date, {data, ts}>`，永久缓存（已请求过的日期不再重复 fetch） |
| **额外类型** | `RouterMiddleware`（已移除）、`dayjs`（时区） |
| **日期处理** | 用 `dayjs` + `TZ_SHANGHAI` 确定"今天"，支持 `date` 参数查历史 |
| **强制刷新** | `force-update` 参数跳过缓存 |
| **RSS** | `/v2/60s/rss` 输出标准 RSS 2.0 XML，含全文、图片 `<enclosure>`、CDATA |

**数据流**：
```
用户请求 → 检查 Map 缓存 → 命中则返回
                  ↓ 未命中
           fetch 60s-static.viki.moe/60s/{date}.json
                  ↓
           解析 JSON → 存入缓存 → 返回
```

#### 4.1.2 `/v2/ai-news` — AI 资讯快报

| 维度 | 详情 |
|------|------|
| **数据来源** | <https://ai-bot.cn/daily-ai-news/> |
| **抓取方式** | `fetch` + `cheerio` 解析 HTML |
| **解析逻辑** | 用 cheerio 提取 `.daily-ai-news` 容器中的日期标题和每条新闻的标题、链接、摘要 |
| **缓存** | `Map<date, data>`，当日数据缓存 5 分钟 |
| **额外参数** | `all=1` 返回全部历史数据（不走缓存） |

#### 4.1.3 `/v2/it-news` — IT 之家资讯

| 维度 | 详情 |
|------|------|
| **数据来源** | <https://www.ithome.com/rss/> |
| **抓取方式** | `fetch` + `cheerio` 解析 RSS XML |
| **解析逻辑** | 从 `<item>` 提取标题、链接、描述、发布时间 |
| **额外端点** | `/v2/it-news/rank` 获取 IT 之家热门文章排行（日/周/月） |

#### 4.1.4 `/v2/bing` — 必应每日壁纸

| 维度 | 详情 |
|------|------|
| **数据来源** | `https://global.bing.com/HPImageArchive.aspx`（官方 JSON API） |
| **数据格式** | JSON `{images: [{url, title, copyright, ...}]}` |
| **图片拼接** | 将相对路径 `/th?id=xxx` 拼接为 `https://bing.com/th?id=xxx_1920x1080.jpg` 等分辨率 |
| **encoding=image** | 302 重定向到图片 UHD 直链 |

#### 4.1.5 `/v2/today-in-history` — 历史上的今天

| 维度 | 详情 |
|------|------|
| **数据来源** | `https://baike.baidu.com/cms/home/eventsOnHistory/{MM}.json`（百度百科 API） |
| **日期逻辑** | 月份从 dayjs 获取，不传 `date` 参数则取今天 |
| **数据格式** | JSON `{[day]: [{year, title, desc}]}` |

#### 4.1.6 `/v2/epic` — Epic 免费游戏

| 维度 | 详情 |
|------|------|
| **数据来源** | `https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions`（Epic 官方 API） |
| **参数** | `locale=zh-CN&country=CN&allowCountries=CN` |
| **数据量** | 返回全部促销游戏，筛选 `promotions.promotionalOffers` 中当前有效的免费项 |
| **缓存** | 内存 Map，5 分钟过期 |

#### 4.1.7 `/v2/exchange-rate` — 汇率换算

| 维度 | 详情 |
|------|------|
| **数据来源** | `https://open.er-api.com/v6/latest/{currency}` |
| **API 特性** | 免费、无需 Key、支持 160+ 币种 |
| **缓存策略** | 永久缓存（按基准货币分 key），每天首次请求自动过期 |
| **数据处理** | 提取 `rates` 对象，排序后返回前 30 条 |

#### 4.1.8 `/v2/gold-price` — 黄金价格

| 维度 | 详情 |
|------|------|
| **数据来源** | 两个渠道：`huangjinjiage.com.cn/panjia2.js` + `huangjinjiage.cn/jinrijinjia.html` |
| **抓取方式** | `fetch` + 正则解析 JS var 赋值 + `cheerio` 解析 HTML 表格 |
| **数据内容** | 国际金价、国内金价、金店零售价、回收价、银行金条价 |
| **编码格式** | JS 文件用正则 `/var\s+\w+\s*=\s*['"](.+)['"]/g` 解析 |

#### 4.1.9 `/v2/fuel-price` — 汽油价格

| 维度 | 详情 |
|------|------|
| **数据来源** | <http://www.qiyoujiage.com> |
| **抓取方式** | `fetch` + `cheerio` 解析 HTML |
| **参数** | `query=省份名`，GET 或 POST |
| **数据内容** | 该省份各城市 92 号/95 号/98 号/0 号柴油价格 |
| **静态数据** | 内置 `regions.json` 映射省份名到网站子页面 ID |

#### 4.1.10 `/v2/lunar` — 农历信息

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯计算（不需要网络请求） |
| **核心依赖** | `tyme4ts` — TypeScript 农历库 |
| **计算内容** | 农历日期、天干地支、生肖、节气、星座、宜忌、今日运势 |
| **扩展** | 60s 和 60s-rss 模块也通过 `common.ts` 使用 tyme4ts 计算节气/宜忌 |

### 4.2 热门榜单（15 个）

#### 通用模式

所有榜单类模块都遵循相同的轻量模式：`fetch API → 解析 JSON → 格式化输出`，无缓存、无复杂依赖。

#### 接口表格

| 接口 | 数据来源 API | 备注 |
|------|-------------|------|
| `/v2/weibo` | `weibo.com/ajax/side/hotSearch` | 微博官方接口 |
| `/v2/zhihu` | `api.zhihu.com/topstory/hot-lists/total` | 知乎官方接口 |
| `/v2/douyin` | `aweme-lq.snssdk.com/aweme/v1/hot/search/list/` | 抖音内部 API |
| `/v2/bili` | `api.bilibili.com/x/web-interface/wbi/search/square` + `app.bilibili.com/x/v2/search/trending/ranking` | 双重接口互相备份 |
| `/v2/toutiao` | `toutiao.com/hot-event/hot-board/` | 头条接口 |
| `/v2/rednote` | `edith.xiaohongshu.com/api/sns/v1/search/hot_list` | 小红书内部 API |
| `/v2/dongchedi` | `dongchedi.com/motor/searchpage/launcher/main/v1/` | 懂车帝官方接口，cheerio 补充解析 |
| `/v2/quark` | `iflow.quark.cn/iflow/api/v1/article/aggregation` | 夸克内部 API |
| `/v2/baidu/hot` | `top.baidu.com/board?tab=realtime` | 百度热搜 |
| `/v2/baidu/teleplay` | `top.baidu.com/board?tab=teleplay` | 百度电视剧榜 |
| `/v2/baidu/tieba` | `tieba.baidu.com/hottopic/browse/topicList` | 百度贴吧话题 |
| `/v2/ncm-rank/*` | `music.163.com/api/toplist` + `music.163.com/api/playlist/detail` | 网易云音乐官方 API，2 步获取（先拿榜单列表，再拿详情） |
| `/v2/maoyan/*` | `piaofang.maoyan.com/` 多个子路径 | **含字体反爬对抗**（见下文） |
| `/v2/hacker-news/*` | `hacker-news.firebaseio.com/v0/` | Firebase 官方 API，10 秒缓存 |
| `/v2/douban/weekly/*` | `m.douban.com/rexxar/api/v2/subject_collection/` | 豆瓣官方移动端 API，图片域名替换为 `doubanio.viki.moe` 代理 |

#### 猫眼票房反爬机制

猫眼票房数字使用自定义字体文件进行混淆。例如页面上的数字 `1` 实际渲染为特定字形的 Unicode 字符。模块通过以下步骤解密：

1. `fetch` 猫眼页面 HTML → 从中提取字体文件 URL（`.woff` 格式）
2. `fetch` 字体文件 → 用 `fontkit` 解析字体
3. 遍历字体的 **glyph**，比对字形路径或名称，建立 `glyph → 真实数字` 的映射表
4. 用映射表替换 HTML 中被混淆的数字字符

**依赖**: `fontkit`（字体解析）、`node:zlib`（可能用于 WOFF 解压）、`node:buffer`

### 4.3 实用功能（16 个）

#### 4.3.1 `/v2/weather/*` — 天气

| 维度 | 详情 |
|------|------|
| **数据来源** | `i.news.qq.com` 腾讯新闻天气频道 |
| **API 数量** | 3 个 API：城市搜索 + 实况/预报 + 空气质量 |
| **城市搜索** | `i.news.qq.com/city/like?source=pc&city={name}` |
| **实况+预报** | `i.news.qq.com/weather/common?weather_type=observe|forecast_1h|forecast_24h|index|alarm|...` |
| **空气质量** | `i.news.qq.com/weather/common?weather_type=air|rise` |
| **参数** | `query`（城市名）、`city`（辅助定位）、`province`（辅助定位）、`days`（预报天数，1-8） |
| **缓存** | 城市信息永久缓存，天气数据 10 分钟过期 |
| **响应内容** | 当前天气 + 逐小时预报 + 逐日预报 + 空气质量（AQI/PM2.5/PM10/O₃/NO₂/SO₂/CO）+ 日出日落 + 生活指数（20 项）+ 预警信息 |

#### 4.3.2 `/v2/fanyi` — 多语言翻译

| 维度 | 详情 |
|------|------|
| **数据来源** | `dict.youdao.com/webtranslate`（有道翻译 Web 版 API） |
| **认证机制** | 需要 `keyid` + `key`（从有道网页 `fanyi.youdao.com` 获取的临时 Key）+ AES-CBC 解密 |
| **加密细节** | 请求参数 `key` 从有道主页 JS 中正则提取；响应体用 AES-128-CBC 解密（key=`ydsecret://dict/key`，iv=`ydsecret://dict/iv`） |
| **支持语言** | 109 种语言，列表通过 `/v2/fanyi/langs` 获取 |
| **依赖** | `node:crypto`（AES 解密 + MD5 签名） |

**双向加密**：请求参数需 MD5 签名 + 响应体需 AES 解密，"破译"了有道的 Web 翻译协议。

#### 4.3.3 `/v2/hash` — 哈希计算

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯计算（不需要网络请求） |
| **算法** | MD5, SHA1, SHA256, SHA512, Base64（编码/解码）, Gzip, Brotli |
| **依赖** | `node:crypto`（哈希）, `node:zlib`（压缩）, `node:buffer` |
| **参数** | `content`（文本）、`algo`（算法选择） |

#### 4.3.4 `/v2/lyric` — 歌词查询

| 维度 | 详情 |
|------|------|
| **数据来源** | QQ 音乐多步 API 调用 |
| **流程** | 1. 搜索歌曲名 → 2. 获取 songmid → 3. 获取歌词（`lyric_new.fcg`） |
| **参数** | `query`（歌名）、`clean=1`（去除时间标签和元信息行） |

#### 4.3.5 `/v2/baike` — 百度百科

| 维度 | 详情 |
|------|------|
| **数据来源** | `baike.baidu.com/api/openapi/BaikeLemmaCardApi`（百度百科开放 API） |
| **参数** | `word=关键词` |
| **返回** | 词条摘要、图片、基本信息、链接 |

#### 4.3.6 `/v2/ip` — IP 查询

| 维度 | 详情 |
|------|------|
| **数据来源** | 两级策略：先用百度 `qifu-api.baidubce.com/ip/geo/v1/district`，失败则降级到 `api.ip.sb/geoip/{ip}` |
| **获取本机 IP** | 依次尝试 `api.ipify.org` → `ifconfig.me/ip` → `icanhazip.com` |
| **参数** | `ip`（可选，不传则查请求来源 IP） |

#### 4.3.7 `/v2/qrcode` — 二维码

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯生成（不需要网络请求） |
| **依赖** | `yaqrcode`（二维码生成库） |
| **参数** | `text`（内容）、`size`（尺寸,像素）、`level`（纠错级别 L/M/Q/H） |
| **输出** | 默认返回 GIF 图片（`image/gif`），二进制数据 |
| **encoding=text** | 输出 Base64 编码字符串 |

#### 4.3.8 `/v2/og` — Open Graph 解析

| 维度 | 详情 |
|------|------|
| **数据来源** | 目标网页 HTML |
| **解析方式** | `fetch` + `cheerio` 提取 `<meta property="og:*">` 标签 |
| **参数** | `url`（目标网页链接） |

#### 4.3.9 `/v2/password` — 随机密码

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯生成（不需要网络请求） |
| **素材** | `passwords.json`（内置单词库，import 时加载到内存） |
| **参数** | `length`（长度）、`symbols`/`numbers`/`lowercase`/`uppercase`（字符类型开关） |

#### 4.3.10 `/v2/color` — 颜色工具

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯计算 |
| **功能** | 随机颜色生成、颜色格式互转（HEX / RGB / HSL / CMYK / LAB）、专业配色方案（互补色、三角色、分裂互补等 8 种色彩理论） |

#### 4.3.11 `/v2/chemical` — 化学元素

| 维度 | 详情 |
|------|------|
| **数据来源** | 内置数据 + 补充 API |
| **功能** | 返回元素的原子序数、符号、质量、电子排布、物理性质等 |

#### 4.3.12 `/v2/whois` — WHOIS 查询

| 维度 | 详情 |
|------|------|
| **数据来源** | 全球 WHOIS 服务器 |
| **依赖** | `whois-raw`（Node.js 原生 TCP 连接 WHOIS 服务器） |
| **协议** | 优先 RDAP，失败则降级到传统 WHOIS |
| **注意** | **Vercel Serverless 不支持 TCP 出站连接**，此接口在 Vercel 上不可用 |

#### 4.3.13 `/v2/health` — 健康分析

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯计算（不需要网络请求） |
| **参数** | `height`（身高 cm）、`weight`（体重 kg）、`gender`（性别）、`age`（年龄） |
| **输出** | BMI、体脂率、BMR 基础代谢、标准三围（胸/腰/臀）、健康建议 |

#### 4.3.14 `/v2/moyu` — 摸鱼日历

| 维度 | 详情 |
|------|------|
| **数据来源** | 纯计算 + `chinese-days` 库 |
| **依赖** | `chinese-days`（中国节假日/补班日数据） |
| **输出** | 今天是否假期、距离周末/假期天数、年度进度百分比、倒计时 |

---

### 4.4 消遣娱乐（9 个）

所有消遣娱乐模块都是 **本地 JSON 数据 + 随机抽取**，完全不需要网络请求。

| 接口 | JSON 文件 | 内容 | 条数（约） |
|------|-----------|------|------------|
| `/v2/duanzi` | `duanzi.json` | 搞笑段子 | 100+ |
| `/v2/hitokoto` | `hitokoto.json` | 一言 | 100+ |
| `/v2/answer` | `answer.json` | 答案之书 | 200+ |
| `/v2/kfc` | 代码内数组 | KFC 疯狂星期四文案 | ~30 |
| `/v2/fabing` | `fabing.json` | 发病文学模板 | ~50 |
| `/v2/luck` | `luck.json` | 运势签文 | ~100 |
| `/v2/dad-joke` | `dad-joke.json` | 英文冷笑话 | ~100 |
| `/v2/awesome-js` | `awesome-js.json` | JS 面试题/知识 | ~500 |
| `/v2/changya` | API（唱鸭平台） | 随机一首唱歌音频 | 在线 |

> `changya` 是唯一需要网络的娱乐模块——从 `m.singduck.cn` 获取随机唱歌作品的音频。

---

### 4.5 奥运 + Beta（3 个）

| 接口 | 数据来源 | 说明 |
|------|----------|------|
| `/v2/olympics` | `olympics.com` 官方 API + `proxy.viki.moe` 代理 | 奥运奖牌榜，支持历届赛事查询 |
| `/v2/beta/kuan` | `api.coolapk.com` 酷安社区 API | 酷安热门话题 / 图文 |
| `/v2/beta/qq/profile` | `users.qzone.qq.com` QQ 空间 API | QQ 用户头像+昵称查询 |

---

## 五、数据来源全景图

### 5.1 按来源分类

```
本地数据（无网络，14 个）
├── 纯计算: lunar, hash, qrcode, color, health
├── JSON 文件: duanzi, hitokoto, answer, kfc, fabing, luck, dad-joke, awesome-js, password
└── npm 库数据: moyu(chinese-days), 60s(tyme4ts)

第三方 API（有网络，40 个）
├── 腾讯新闻: weather
├── 百度系: baike, today-in-history, ip(百度部分), baidu/hot/teleplay/tieba
├── 字节系: douyin, toutiao
├── 阿里系: quark
├── 网易系: ncm
├── 新浪: weibo
├── 知乎: zhihu
├── B站: bili
├── 小红书: rednote
├── 懂车帝: dongchedi
├── 猫眼: maoyan
├── 豆瓣: douban-weekly
├── 酷安: kuan
├── 唱鸭: changya
├── 腾讯音乐: lyric
├── 有道: fanyi
├── Epic Games: epic
├── Microsoft Bing: bing
├── 奥运: olympics
├── HN/Firebase: hacker-news
├── IT之家: it-news
├── 黄金价格: gold-price
├── 汽油价格: fuel-price
├── 汇率: exchange-rate
├── IP 归属: ip(multi)
├── DNS: whois(global whois servers)
├── AI 资讯: ai-news(ai-bot.cn)
├── OG 解析: og(any URL)
├── 60s 内容: 60s, 60s-rss(static-host)
└── QQ 空间: qq/profile
```

### 5.2 按请求方式分类

| 方式 | 数量 | 模块 |
|------|------|------|
| 简单 HTTP JSON API | 25 | weibo, zhihu, douyin, bili, toutiao, rednote, quark, baidu/*, ncm, hacker-news, epic, exchange-rate, ip, baike, today-in-history, bing, olympics, kuan, changya, douban-weekly, qq, it-news/rank |
| HTTP + cheerio 解析 HTML | 5 | ai-news, gold-price, fuel-price, dongchedi, it-news/RSS |
| 多步 API 调用 | 5 | weather(3步), lyric(3步), fanyi(鉴权+AES), maoyan(字体反爬), whois(RDAP+降级) |
| 纯本地计算/JSON | 14 | lunar, hash, qrcode, color, health, password, duanzi, hitokoto, answer, kfc, fabing, luck, dad-joke, awesome-js |
| 组合型 | 2 | 60s(JSON+tyme4ts), moyu(chinese-days+计算) |

---

## 六、技术手段分类

### 6.1 HTML 解析（cheerio）

5 个模块使用 cheerio 解析 HTML，原因是被抓取网站不提供 JSON API：

| 模块 | 解析目标 |
|------|----------|
| ai-news | `.daily-ai-news` 新闻列表 |
| gold-price | 金店价格表格 |
| fuel-price | 各省油价表格 |
| dongchedi | 热搜榜单 |
| it-news | RSS `<item>` 元素 |

### 6.2 加密/解密

| 模块 | 手段 | 用途 |
|------|------|------|
| fanyi | AES-128-CBC + MD5 签名 | 请求签名 & 响应解密（有道翻译协议） |
| hash | crypto 全算法 | 对外提供哈希服务 |
| common | MD5 | 内部缓存 Key 生成 |

### 6.3 字体解析（反爬）

| 模块 | 手段 | 原因 |
|------|------|------|
| maoyan/encode | fontkit 解析 .woff 字体 | 猫眼票房数字通过自定义字体混淆，需解析字体文件还原真实数字 |

### 6.4 多源降级

| 模块 | 策略 |
|------|------|
| ip | 百度 API → `ip.sb` 降级 |
| ip（本机IP） | `ipify.org` → `ifconfig.me` → `icanhazip.com` 三重降级 |
| whois | RDAP 协议 → 传统 WHOIS 降级 |
| 60s | Vercel CDN → GitHub 直链降级（`tryRepoUrl`） |

### 6.5 缓存策略对比

| 级别 | TTL | 场景 |
|------|-----|------|
| 无缓存 | 0 | 榜单类（实时数据） |
| 短期 | 10s | hacker-news（Firebase 限制） |
| 中期 | 5-30min | weather, gold-price, fuel-price, epic（变化慢） |
| 长期 | to restart | exchange-rate, ip（城市→省份映射） |
| 永久 | 部署周期 | 所有 JSON 文件（import 时一次性加载到内存） |

---

## 七、依赖清单

### 7.1 运行时依赖（8 个 npm 包）

| 包 | 版本 | 体积 | 用途 |
|----|------|------|------|
| `dayjs` | ^1.11 | ~7KB | 所有模块的日期/时区处理 |
| `cheerio` | ^1.2 | ~500KB | 5 个模块的 HTML 解析 |
| `tyme4ts` | ^1.4 | ~2MB | 农历/干支/节气/宜忌 |
| `fontkit` | ^2.0 | ~3MB | 猫眼字体反爬解析 |
| `whois-raw` | ^0.1 | ~20KB | WHOIS 域名查询 |
| `yaqrcode` | ^0.2 | ~50KB | 二维码生成 |
| `filesize` | ^11.0 | ~5KB | 网易云播放次数格式化 |
| `chinese-days` | ^1.5 | ~200KB | 中国节假日/补班日判断 |

### 7.2 Node.js 内置模块使用情况

```
node:crypto  —— hash, common(md5), fanyi(AES), maoyan/encode(DES)
node:buffer  —— hash, qrcode, maoyan/encode
node:zlib    —— hash(gzip/brotli)
node:net     —— whois(间接, 通过 whois-raw)
```

### 7.3 本地数据文件

| 文件 | 用途 | 大致条数 |
|------|------|----------|
| `duanzi.json` | 段子库 | ~150 |
| `hitokoto.json` | 一言库 | ~200 |
| `answer.json` | 答案之书 | ~300 |
| `fabing.json` | 发病文学模板 | ~60 |
| `luck.json` | 运势签文 | ~100 |
| `dad-joke.json` | 英文冷笑话 | ~120 |
| `awesome-js.json` | JS 面试题 | ~500 |
| `passwords.json` | 密码生成词库 | ~2000 |
| `regions.json` | 油价查询省份映射 | ~50 |
| `olympics/events.json` | 奥运赛事列表 | ~50 |
