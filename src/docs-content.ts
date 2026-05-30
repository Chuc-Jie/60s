// API docs HTML — light theme
export const docsHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>60s API — 接口文档 | 60s.youyer.top</title>
<style>
:root{--bg:#fff;--card:#f8f9fa;--border:#e2e8f0;--text:#1a202c;--dim:#64748b;--accent:#2563eb;--green:#16a34a;--orange:#d97706;--radius:6px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
.container{max-width:1000px;margin:0 auto;padding:20px 24px}
header{text-align:center;padding:56px 0 36px;border-bottom:2px solid var(--border);margin-bottom:36px}
header h1{font-size:2.2em;font-weight:700;margin-bottom:6px;letter-spacing:-.5px}
header p{color:var(--dim);font-size:1em}
.badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:.82em;font-weight:500;margin:3px}
.bg-green{background:#dcfce7;color:var(--green)}.bg-blue{background:#dbeafe;color:var(--accent)}.bg-orange{background:#fef3c7;color:var(--orange)}
.endpoint{display:inline-block;font-family:'SF Mono','Fira Code',monospace;font-size:.88em;color:var(--accent);white-space:nowrap}
.endpoint a{color:var(--accent);text-decoration:none}
h2{font-size:1.3em;font-weight:700;margin:44px 0 14px;padding-bottom:6px;border-bottom:2px solid var(--border)}
h3{font-size:1.05em;font-weight:600;margin:28px 0 8px;color:var(--text)}
table{width:100%;border-collapse:collapse;margin:10px 0 18px;font-size:.92em}
th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border)}
th{color:var(--dim);font-weight:600;font-size:.82em;text-transform:uppercase;letter-spacing:.5px;background:var(--card)}
td{vertical-align:top}
td:first-child{font-family:'SF Mono','Fira Code',monospace;color:var(--accent);white-space:nowrap;font-size:.88em}
td:nth-child(2){color:var(--dim);font-size:.88em;max-width:340px}
tr:hover td{background:#f1f5f9}
.code-block{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;overflow-x:auto;margin:10px 0 18px;font-size:.88em;position:relative}
.code-block .lang{position:absolute;top:10px;right:14px;color:var(--dim);font-size:.75em;font-weight:500}
pre{margin:0;font-family:'SF Mono','Fira Code',monospace;white-space:pre-wrap;word-break:break-all}
.note{background:#eff6ff;border-left:3px solid var(--accent);padding:10px 16px;border-radius:var(--radius);margin:10px 0;font-size:.9em;color:var(--dim)}
.note strong{color:var(--text)}
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:14px 0 24px}
.toc a{color:var(--accent);text-decoration:none;padding:6px 16px;border:1px solid var(--border);border-radius:20px;font-size:.88em;font-weight:500;transition:.15s}
.toc a:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.back-top{position:fixed;bottom:24px;right:24px;width:38px;height:38px;background:var(--bg);border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dim);font-size:1.1em;text-decoration:none;box-shadow:0 1px 4px rgba(0,0,0,.08);transition:.15s}
.back-top:hover{box-shadow:0 2px 8px rgba(0,0,0,.15);color:var(--accent)}
footer{text-align:center;padding:36px 0;color:var(--dim);font-size:.85em;border-top:2px solid var(--border);margin-top:56px}
footer a{color:var(--accent);text-decoration:none}
@media(max-width:640px){header h1{font-size:1.6em}.container{padding:12px}td:first-child{font-size:.78em}}
</style>
</head>
<body><div class="container">

<header>
  <h1>⏰ 60s API</h1>
  <p>高质量、开源、可靠的开放 API 集合</p>
  <p style="margin-top:16px">
    <span class="badge bg-green">Vercel 自部署</span>
    <span class="badge bg-blue">65+ 接口</span>
    <span class="badge bg-blue">完全免费</span>
    <span class="badge bg-orange">全球 CDN</span>
  </p>
</header>

<!-- 快速开始 -->
<h2>🚀 快速开始</h2>
<p>所有接口以 <code>https://60s.youyer.top</code> 为根路径，默认返回 JSON。</p>

<div class="code-block"><span class="lang">curl</span>
<pre># 健康检查
curl https://60s.youyer.top/health

# 获取今日 60s（纯文本，适合消息推送）
curl "https://60s.youyer.top/v2/60s?encoding=text"

# 获取今日 60s 图片（重定向到图片直链）
curl "https://60s.youyer.top/v2/60s?encoding=image"

# 微博热搜
curl "https://60s.youyer.top/v2/weibo?encoding=markdown"

# 北京实时天气
curl "https://60s.youyer.top/v2/weather/realtime?query=北京"</pre>
</div>

<!-- 参数约定 -->
<h2>📋 参数约定</h2>

<h3>响应格式 <code>encoding</code></h3>
<p>所有接口支持通过 <code>?encoding=</code> 切换格式，默认 <code>json</code>：</p>
<table>
  <tr><th>值</th><th>说明</th><th>适用场景</th></tr>
  <tr><td><code>json</code></td><td>结构化 JSON</td><td>程序调用、二次开发</td></tr>
  <tr><td><code>text</code></td><td>格式化的纯文本</td><td>终端、Shell 脚本、消息推送</td></tr>
  <tr><td><code>markdown</code></td><td>Markdown 格式</td><td>AI 消费、文档展示、机器人</td></tr>
</table>
<p class="note">
  <strong>/v2/60s</strong> 额外支持 <code>image</code>（重定向到图片直链）和 <code>image-proxy</code>（代理图片）；<br>
  <strong>/v2/changya</strong> 支持 <code>audio</code>（重定向音频）；<strong>/v2/qrcode</strong> 默认返回 GIF 图片；<strong>/v2/color</strong> 支持 <code>html</code>。
</p>

<h3>时间戳</h3>
<p>涉及时间的字段均提供两种格式：格式化字符串（如 <code>updated</code>）和 13 位时间戳（后缀 <code>_at</code>，如 <code>updated_at</code>）。</p>

<h3>参数传递</h3>
<p>GET 使用 query 参数；<code>/v2/fanyi</code>、<code>/v2/hash</code>、<code>/v2/og</code>、<code>/v2/lyric</code>、<code>/v2/fuel-price</code> 同时支持 POST JSON body。</p>

<div class="toc">
  <a href="#news">🕘 周期资讯</a>
  <a href="#hot">🔥 热门榜单</a>
  <a href="#util">🍱 实用功能</a>
  <a href="#fun">🎤 消遣娱乐</a>
  <a href="#olympics">🏅 奥运</a>
  <a href="#beta">🧪 Beta</a>
</div>

<!-- 周期资讯 -->
<h2 id="news">🕘 周期资讯</h2>

<h3>每天 60 秒读懂世界 <span class="endpoint">GET /v2/60s</span></h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期，YYYY-MM-DD 格式，默认今天</td></tr>
  <tr><td><code>encoding</code></td><td>json / text / markdown / image / image-proxy</td></tr>
  <tr><td><code>force-update</code></td><td>跳过缓存，强制拉取数据源最新数据</td></tr>
</table>
<div class="code-block"><pre># 纯文本（适合推送）
curl "https://60s.youyer.top/v2/60s?encoding=text"

# 获取图片链接（直接浏览器打开即可看到图片）
curl "https://60s.youyer.top/v2/60s?encoding=image"

# JSON 中取图片链接
curl "https://60s.youyer.top/v2/60s" | jq .data.image

# 指定日期
curl "https://60s.youyer.top/v2/60s?date=2025-06-15&encoding=text"</pre></div>
<p class="note">RSS 订阅：<code>/v2/60s/rss</code>，返回标准 XML。</p>

<h3>AI 资讯快报 <span class="endpoint">GET /v2/ai-news</span></h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期，YYYY-MM-DD 格式，默认今天</td></tr>
  <tr><td><code>all</code></td><td>设为 1 获取全部历史数据</td></tr>
  <tr><td><code>encoding</code></td><td>json / text / markdown</td></tr>
</table>
<p class="note">来源 ai-bot.cn，非每日更新，注意判空。建议 22:00 后调用。</p>

<h3>更多</h3>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/bing</span></td><td><code>encoding</code>: json / text / markdown / image</td><td>必应每日壁纸</td></tr>
  <tr><td><span class="endpoint">GET /v2/exchange-rate</span></td><td><code>currency</code>：基准货币（默认 CNY）</td><td>当日各货币汇率</td></tr>
  <tr><td><span class="endpoint">GET /v2/today-in-history</span></td><td><code>date</code>：可选，默认今天</td><td>历史上的今天</td></tr>
  <tr><td><span class="endpoint">GET /v2/epic</span></td><td><code>encoding</code></td><td>Epic 免费游戏</td></tr>
  <tr><td><span class="endpoint">GET /v2/gold-price</span></td><td><code>encoding</code></td><td>黄金价格（实时 + 金店 + 银行 + 回收）</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/fuel-price</span></td><td><code>region</code>：地区名（如"北京"）</td><td>汽油价格</td></tr>
  <tr><td><span class="endpoint">GET /v2/lunar</span></td><td><code>date</code>：可选，默认今天</td><td>农历 / 干支 / 节气 / 星座 / 宜忌 / 运势</td></tr>
  <tr><td><span class="endpoint">GET /v2/it-news</span></td><td><code>limit</code>：数量（默认 20，最大 50）</td><td>IT 之家 RSS 资讯</td></tr>
  <tr><td><span class="endpoint">GET /v2/it-news/rank</span></td><td><code>type</code>：day / week / month</td><td>IT 之家热榜</td></tr>
</table>

<!-- 热门榜单 -->
<h2 id="hot">🔥 热门榜单</h2>
<table>
  <tr><th>接口</th><th>频率</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/weibo</span></td><td>实时</td><td>微博热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/zhihu</span></td><td>实时</td><td>知乎热榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/douyin</span></td><td>实时</td><td>抖音热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/bili</span></td><td>实时</td><td>B 站热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/toutiao</span></td><td>实时</td><td>头条热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/rednote</span></td><td>实时</td><td>小红书热点</td></tr>
  <tr><td><span class="endpoint">GET /v2/dongchedi</span></td><td>实时</td><td>懂车帝热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/quark</span></td><td>实时</td><td>夸克热点</td></tr>
  <tr><td><span class="endpoint">GET /v2/baidu/hot</span></td><td>实时</td><td>百度热搜</td></tr>
  <tr><td><span class="endpoint">GET /v2/baidu/teleplay</span></td><td>实时</td><td>百度电视剧榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/baidu/tieba</span></td><td>实时</td><td>百度贴吧话题</td></tr>
  <tr><td><span class="endpoint">GET /v2/ncm-rank/list</span></td><td>实时</td><td>网易云榜单列表</td></tr>
  <tr><td><span class="endpoint">GET /v2/ncm-rank/:id</span></td><td>实时</td><td>网易云榜单详情（<code>size</code> 控制数量）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/all/movie</span></td><td>时更</td><td>全球票房总榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/movie</span></td><td>实时</td><td>猫眼实时票房（<code>date</code> 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/tv</span></td><td>实时</td><td>猫眼电视收视（<code>date</code> 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/web</span></td><td>实时</td><td>猫眼网剧热度（<code>date</code> 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/hacker-news/top</span></td><td>~10min 缓存</td><td>HN 热门（<code>limit</code> 控制数量）</td></tr>
  <tr><td><span class="endpoint">GET /v2/hacker-news/new</span></td><td>~10min 缓存</td><td>HN 最新</td></tr>
  <tr><td><span class="endpoint">GET /v2/hacker-news/best</span></td><td>~10min 缓存</td><td>HN 最佳</td></tr>
  <tr><td><span class="endpoint">GET /v2/douban/weekly/movie</span></td><td>周更</td><td>豆瓣口碑电影榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/douban/weekly/tv_chinese</span></td><td>周更</td><td>豆瓣华语剧集榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/douban/weekly/tv_global</span></td><td>周更</td><td>豆瓣全球剧集榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/douban/weekly/show_chinese</span></td><td>周更</td><td>豆瓣华语综艺榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/douban/weekly/show_global</span></td><td>周更</td><td>豆瓣全球综艺榜</td></tr>
</table>

<div class="code-block"><pre># 微博热搜纯文本
curl "https://60s.youyer.top/v2/weibo?encoding=text"

# 网易云热歌榜 Top 10
curl "https://60s.youyer.top/v2/ncm-rank/3778678?encoding=text&size=10"

# Hacker News 最佳 5 条
curl "https://60s.youyer.top/v2/hacker-news/best?limit=5&encoding=markdown"</pre></div>

<!-- 实用功能 -->
<h2 id="util">🍱 实用功能</h2>

<h3>实时天气 <span class="endpoint">GET /v2/weather/realtime</span></h3>
<table><tr><th>参数</th><th>说明</th></tr><tr><td><code>query</code></td><td>城市名，默认"北京"</td></tr></table>

<h3>天气预报 <span class="endpoint">GET /v2/weather/forecast</span></h3>
<table><tr><th>参数</th><th>说明</th></tr><tr><td><code>query</code></td><td>城市名，默认"北京"</td></tr><tr><td><code>days</code></td><td>天数，默认 7，最大 8</td></tr></table>

<div class="code-block"><pre>curl "https://60s.youyer.top/v2/weather/realtime?query=深圳&encoding=text"
curl "https://60s.youyer.top/v2/weather/forecast?query=上海&days=3"</pre></div>

<h3>更多</h3>
<table>
  <tr><th>接口</th><th>关键参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET/POST /v2/fanyi</span></td><td><code>text</code> 原文，<code>to</code> 目标语言，<code>from</code> 源语言</td><td>有道翻译，支持 109 种语言</td></tr>
  <tr><td><span class="endpoint">GET /v2/fanyi/langs</span></td><td>—</td><td>支持语言列表</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/lyric</span></td><td><code>query</code> 歌名，<code>clean</code> 去信息行</td><td>QQ 音乐歌词</td></tr>
  <tr><td><span class="endpoint">GET /v2/baike</span></td><td><code>word</code> 关键词</td><td>百度百科</td></tr>
  <tr><td><span class="endpoint">GET /v2/ip</span></td><td><code>ip</code> 可选，不传用请求 IP</td><td>IP 归属地</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/hash</span></td><td><code>content</code> 文本</td><td>MD5 / SHA / Base64 / Gzip / Brotli</td></tr>
  <tr><td><span class="endpoint">GET /v2/qrcode</span></td><td><code>text</code>，<code>size</code>（默认256），<code>level</code></td><td>二维码（直接返回 GIF）</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/og</span></td><td><code>url</code> 目标链接</td><td>OG 元信息解析</td></tr>
  <tr><td><span class="endpoint">GET /v2/password</span></td><td><code>length</code>，<code>symbols</code>/<code>numbers</code>/等</td><td>随机密码生成</td></tr>
  <tr><td><span class="endpoint">GET /v2/password/check</span></td><td><code>password</code></td><td>密码强度检测</td></tr>
  <tr><td><span class="endpoint">GET /v2/color/random</span></td><td>—</td><td>随机颜色 / 格式转换</td></tr>
  <tr><td><span class="endpoint">GET /v2/color/palette</span></td><td><code>color</code>：HEX 颜色值</td><td>专业配色方案（8 种色彩理论）</td></tr>
  <tr><td><span class="endpoint">GET /v2/chemical</span></td><td><code>id</code> 可选，不传随机</td><td>化学物质信息</td></tr>
  <tr><td><span class="endpoint">GET /v2/whois</span></td><td><code>domain</code> 域名</td><td>WHOIS 查询</td></tr>
  <tr><td><span class="endpoint">GET /v2/health</span></td><td><code>height</code>/<code>weight</code>/<code>gender</code>/<code>age</code></td><td>健康分析（BMI/体脂/BMR/三围）</td></tr>
  <tr><td><span class="endpoint">GET /v2/moyu</span></td><td><code>date</code> 可选，默认今天</td><td>摸鱼日历</td></tr>
</table>

<!-- 消遣娱乐 -->
<h2 id="fun">🎤 消遣娱乐</h2>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/hitokoto</span></td><td><code>id</code> 可选，不传随机</td><td>一言</td></tr>
  <tr><td><span class="endpoint">GET /v2/duanzi</span></td><td><code>id</code> 可选，不传随机</td><td>搞笑段子</td></tr>
  <tr><td><span class="endpoint">GET /v2/answer</span></td><td><code>id</code> 可选，不传随机</td><td>答案之书</td></tr>
  <tr><td><span class="endpoint">GET /v2/kfc</span></td><td>—</td><td>疯狂星期四文案</td></tr>
  <tr><td><span class="endpoint">GET /v2/fabing</span></td><td><code>name</code> 称呼（默认"主人"）</td><td>发病文学</td></tr>
  <tr><td><span class="endpoint">GET /v2/luck</span></td><td><code>id</code> 可选，不传随机</td><td>运势</td></tr>
  <tr><td><span class="endpoint">GET /v2/dad-joke</span></td><td><code>id</code> 可选，不传随机</td><td>英文冷笑话</td></tr>
  <tr><td><span class="endpoint">GET /v2/awesome-js</span></td><td><code>id</code> 可选，不传随机</td><td>JS 面试题</td></tr>
  <tr><td><span class="endpoint">GET /v2/changya</span></td><td>—</td><td>唱鸭随机唱歌（支持 audio 编码）</td></tr>
</table>

<!-- 奥运 -->
<h2 id="olympics">🏅 奥运</h2>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/olympics</span></td><td><code>id</code>：赛事 ID，默认当前</td><td>奥运奖牌榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/olympics/events</span></td><td>—</td><td>历史奥运赛事列表</td></tr>
</table>

<!-- Beta -->
<h2 id="beta">🧪 Beta</h2>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/beta/kuan</span></td><td>—</td><td>酷安热门话题</td></tr>
  <tr><td><span class="endpoint">GET /v2/beta/qq/profile</span></td><td><code>qq</code>，<code>size</code>（头像尺寸）</td><td>QQ 用户信息</td></tr>
</table>

<footer>
  <p>基于 <a href="https://github.com/vikiboss/60s">vikiboss/60s</a> 开源项目 · 自部署于 Vercel</p>
  <p style="margin-top:4px">官方文档 <a href="https://docs.60s-api.viki.moe">docs.60s-api.viki.moe</a> · 反馈 QQ 群 595941841</p>
</footer>

</div>
<a class="back-top" href="#" title="回到顶部">↑</a>
</body></html>`
