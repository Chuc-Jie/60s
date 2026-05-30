// Auto-generated docs HTML for 60s.youyer.top
// Based on official docs: https://docs.60s-api.viki.moe/llms.txt
export const docsHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>60s API — 接口文档 | 60s.youyer.top</title>
<style>
:root{--bg:#0d1117;--card:#161b22;--border:#30363d;--text:#c9d1d9;--dim:#8b949e;--accent:#58a6ff;--green:#3fb950;--orange:#d2991d;--pink:#db61a2}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1000px;margin:0 auto;padding:20px 24px}
header{text-align:center;padding:60px 0 40px;border-bottom:1px solid var(--border);margin-bottom:40px}
header h1{font-size:2.4em;margin-bottom:8px}
header p{color:var(--dim);font-size:1.05em}
.badge{display:inline-block;padding:3px 14px;border-radius:12px;font-size:.85em;margin:4px}
.bg-green{background:#1a3a2a;color:var(--green)}.bg-blue{background:#1a2a3a;color:var(--accent)}.bg-orange{background:#2a1f1a;color:var(--orange)}
.endpoint{display:inline-block;background:var(--card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;font-family:monospace;font-size:.88em;color:var(--accent);white-space:nowrap}
.endpoint a{color:var(--accent);text-decoration:none}
h2{font-size:1.5em;margin:48px 0 16px;padding-bottom:8px;border-bottom:1px solid var(--border)}
h3{font-size:1.15em;margin:28px 0 10px;color:var(--accent)}
table{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:.92em}
th,td{padding:9px 12px;text-align:left;border-bottom:1px solid var(--border)}
th{color:var(--dim);font-weight:600;white-space:nowrap;font-size:.85em}
td:first-child{font-family:monospace;color:var(--accent);white-space:nowrap}
td:nth-child(2){color:var(--dim);font-size:.85em;max-width:320px}
tr:hover td{background:var(--card)}
.code-block{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:16px;overflow-x:auto;margin:12px 0 20px;font-size:.88em;position:relative}
.code-block .lang{position:absolute;top:8px;right:12px;color:var(--dim);font-size:.75em}
pre{margin:0;font-family:'SF Mono','Fira Code',monospace;white-space:pre-wrap;word-break:break-all}
.note{background:#1a2a3a;border-left:3px solid var(--accent);padding:10px 16px;border-radius:4px;margin:12px 0;font-size:.9em;color:var(--dim)}
.note strong{color:var(--text)}
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 28px}
.toc a{color:var(--accent);text-decoration:none;padding:5px 14px;border:1px solid var(--border);border-radius:20px;font-size:.88em;transition:.2s}
.toc a:hover{background:var(--card);border-color:var(--accent)}
.back-top{position:fixed;bottom:24px;right:24px;width:40px;height:40px;background:var(--card);border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--dim);font-size:1.2em;text-decoration:none;opacity:.7;transition:.2s}
.back-top:hover{opacity:1;border-color:var(--accent)}
footer{text-align:center;padding:40px 0;color:var(--dim);font-size:.85em;border-top:1px solid var(--border);margin-top:60px}
footer a{color:var(--accent)}
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

<!-- ====== 快速开始 ====== -->
<h2>🚀 快速开始</h2>
<p>所有接口根路径：<code>https://60s.youyer.top</code></p>

<div class="code-block"><span class="lang">curl</span>
<pre># 健康检查
curl https://60s.youyer.top/health
# → ok

# 查看所有接口
curl https://60s.youyer.top/

# 获取今日 60s（纯文本，适合推送）
curl "https://60s.youyer.top/v2/60s?encoding=text"

# 微博热搜（Markdown）
curl "https://60s.youyer.top/v2/weibo?encoding=markdown"

# 北京实时天气
curl "https://60s.youyer.top/v2/weather/realtime?query=北京"</pre>
</div>

<!-- ====== 参数约定 ====== -->
<h2>📋 参数约定</h2>

<h3>响应格式 <code>encoding</code></h3>
<p>所有接口均支持通过 <code>?encoding=</code> 切换格式，默认 <code>json</code>：</p>
<table>
  <tr><th>值</th><th>说明</th><th>适用场景</th></tr>
  <tr><td><code>json</code></td><td>结构化 JSON</td><td>程序调用、二次开发</td></tr>
  <tr><td><code>text</code></td><td>格式化的纯文本</td><td>终端、Shell 脚本、消息推送</td></tr>
  <tr><td><code>markdown</code></td><td>Markdown 格式</td><td>AI 消费、文档展示、机器人</td></tr>
</table>
<p class="note"><strong>/v2/60s</strong> 额外支持 <code>image</code>（重定向图片）和 <code>image-proxy</code>（代理图片）；<strong>/v2/changya</strong> 支持 <code>audio</code>；<strong>/v2/qrcode</strong> 默认返回 GIF 图片；<strong>/v2/color</strong> 支持 <code>html</code>。</p>

<h3>时间戳</h3>
<p>涉及时间的字段均提供两种格式：格式化的字符串（如 <code>updated</code>）和 13 位毫秒时间戳（后缀 <code>_at</code>，如 <code>updated_at</code>）。</p>

<h3>参数传递</h3>
<p>GET 请求使用 query 参数；<code>/v2/fanyi</code>、<code>/v2/hash</code>、<code>/v2/og</code>、<code>/v2/lyric</code>、<code>/v2/fuel-price</code> 同时支持 POST JSON body。</p>

<div class="toc">
  <a href="#news">🕘 周期资讯</a>
  <a href="#hot">🔥 热门榜单</a>
  <a href="#util">🍱 实用功能</a>
  <a href="#fun">🎤 消遣娱乐</a>
  <a href="#olympics">🏅 奥运</a>
  <a href="#beta">🧪 Beta</a>
</div>

<!-- ====== 周期资讯 ====== -->
<h2 id="news">🕘 周期资讯</h2>

<h3>每天 60 秒读懂世界</h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期，格式 YYYY-MM-DD，默认今天</td></tr>
  <tr><td><code>encoding</code></td><td>text / json / markdown / image / image-proxy</td></tr>
  <tr><td><code>force-update</code></td><td>跳过缓存，强制拉取最新数据</td></tr>
</table>
<div class="code-block"><pre>curl "https://60s.youyer.top/v2/60s?encoding=text&date=2025-06-15"</pre></div>
<p class="note">RSS 订阅可用 <code>/v2/60s/rss</code>，返回标准 XML。</p>

<h3>AI 资讯快报</h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期，格式 YYYY-MM-DD，默认今天</td></tr>
  <tr><td><code>all</code></td><td>设为 1 获取全部历史数据</td></tr>
  <tr><td><code>encoding</code></td><td>text / json / markdown</td></tr>
</table>
<div class="code-block"><pre>curl "https://60s.youyer.top/v2/ai-news?encoding=text"</pre></div>
<p class="note">数据来源 ai-bot.cn，非每日更新，注意判空。</p>

<h3>更多周期资讯</h3>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/bing</span></td><td><code>encoding</code>: text/json/markdown/image</td><td>必应每日壁纸</td></tr>
  <tr><td><span class="endpoint">GET /v2/exchange-rate</span></td><td><code>currency</code> 基准货币，默认 CNY</td><td>当日汇率</td></tr>
  <tr><td><span class="endpoint">GET /v2/today-in-history</span></td><td><code>date</code> 可选，默认今天</td><td>历史上的今天（百度百科）</td></tr>
  <tr><td><span class="endpoint">GET /v2/epic</span></td><td><code>encoding</code></td><td>Epic 免费游戏</td></tr>
  <tr><td><span class="endpoint">GET /v2/gold-price</span></td><td><code>encoding</code></td><td>黄金价格（实时+金店+银行+回收）</td></tr>
  <tr><td><span class="endpoint">GET /v2/fuel-price</span></td><td><code>region</code> 地区（如北京），支持 POST</td><td>汽油价格</td></tr>
  <tr><td><span class="endpoint">GET /v2/lunar</span></td><td><code>date</code> 可选，默认今天</td><td>农历/干支/节气/星座/宜忌/运势</td></tr>
  <tr><td><span class="endpoint">GET /v2/it-news</span></td><td><code>limit</code> 数量（默认20，最大50）</td><td>IT 之家 RSS 资讯</td></tr>
  <tr><td><span class="endpoint">GET /v2/it-news/rank</span></td><td><code>type</code>: day / week / month</td><td>IT 之家热榜</td></tr>
</table>

<!-- ====== 热门榜单 ====== -->
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
  <tr><td><span class="endpoint">GET /v2/ncm-rank/:id</span></td><td>实时</td><td>网易云榜单详情（size 参数控制数量）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/all/movie</span></td><td>时更</td><td>全球票房总榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/movie</span></td><td>实时</td><td>猫眼实时票房（date 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/tv</span></td><td>实时</td><td>猫眼电视收视（date 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/maoyan/realtime/web</span></td><td>实时</td><td>猫眼网剧热度（date 可选）</td></tr>
  <tr><td><span class="endpoint">GET /v2/hacker-news/top</span></td><td>~10min 缓存</td><td>HN 热门（limit 控制数量）</td></tr>
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

# 网易云热歌榜
curl "https://60s.youyer.top/v2/ncm-rank/3778678?encoding=text&size=10"

# HN 最佳
curl "https://60s.youyer.top/v2/hacker-news/best?limit=5&encoding=markdown"</pre></div>

<!-- ====== 实用功能 ====== -->
<h2 id="util">🍱 实用功能</h2>

<h3>实时天气 <span class="endpoint">GET /v2/weather/realtime</span></h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>query</code></td><td>城市名，默认北京</td></tr>
</table>
<div class="code-block"><pre>curl "https://60s.youyer.top/v2/weather/realtime?query=深圳&encoding=text"</pre></div>

<h3>天气预报 <span class="endpoint">GET /v2/weather/forecast</span></h3>
<table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>query</code></td><td>城市名，默认北京</td></tr>
  <tr><td><code>days</code></td><td>天数，默认 7，最大 8</td></tr>
</table>
<div class="code-block"><pre>curl "https://60s.youyer.top/v2/weather/forecast?query=上海&days=3"</pre></div>

<h3>更多实用功能</h3>
<table>
  <tr><th>接口</th><th>关键参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET/POST /v2/fanyi</span></td><td><code>text</code> 原文，<code>to</code> 目标语言（默认 auto），<code>from</code> 源语言</td><td>有道翻译，109 种语言</td></tr>
  <tr><td><span class="endpoint">GET /v2/fanyi/langs</span></td><td>—</td><td>翻译支持语言列表</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/lyric</span></td><td><code>query</code> 歌名，<code>clean</code> 是否去信息行（默认 true）</td><td>QQ 音乐歌词</td></tr>
  <tr><td><span class="endpoint">GET /v2/baike</span></td><td><code>word</code> 关键词</td><td>百度百科词条</td></tr>
  <tr><td><span class="endpoint">GET /v2/ip</span></td><td><code>ip</code> 可选，不传用请求来源 IP</td><td>IP 归属地查询</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/hash</span></td><td><code>content</code> 文本</td><td>MD5 / SHA1 / SHA256 / SHA512 / Base64 / Gzip / Brotli</td></tr>
  <tr><td><span class="endpoint">GET /v2/qrcode</span></td><td><code>text</code> 内容，<code>size</code> 尺寸，<code>level</code> 纠错</td><td>二维码（直接返回 GIF 图片）</td></tr>
  <tr><td><span class="endpoint">GET/POST /v2/og</span></td><td><code>url</code> 目标链接</td><td>Open Graph 元信息解析</td></tr>
  <tr><td><span class="endpoint">GET /v2/password</span></td><td><code>length</code> 长度，<code>symbols</code>/<code>numbers</code>/<code>lowercase</code>/<code>uppercase</code></td><td>随机密码生成</td></tr>
  <tr><td><span class="endpoint">GET /v2/password/check</span></td><td><code>password</code> 密码</td><td>密码强度检测（评分+破解时间）</td></tr>
  <tr><td><span class="endpoint">GET /v2/color/random</span></td><td>—</td><td>随机颜色 / 格式转换（支持 html 编码）</td></tr>
  <tr><td><span class="endpoint">GET /v2/color/palette</span></td><td><code>color</code> HEX 颜色</td><td>专业配色方案（8 种色彩理论）</td></tr>
  <tr><td><span class="endpoint">GET /v2/chemical</span></td><td><code>id</code> 可选，不传随机</td><td>化学物质信息</td></tr>
  <tr><td><span class="endpoint">GET /v2/whois</span></td><td><code>domain</code> 域名</td><td>WHOIS 查询（RDAP + 递归降级）</td></tr>
  <tr><td><span class="endpoint">GET /v2/health</span></td><td><code>height</code>/<code>weight</code>/<code>gender</code>/<code>age</code></td><td>健康分析（BMI/体脂/BMR/三围/建议）</td></tr>
  <tr><td><span class="endpoint">GET /v2/moyu</span></td><td><code>date</code> 可选，默认今天</td><td>摸鱼日历（假期/工作日/倒计时/进度）</td></tr>
</table>

<div class="code-block"><pre># 翻译
curl -X POST "https://60s.youyer.top/v2/fanyi" -d '{"text":"hello world","to":"zh"}'

# 生成二维码（浏览器直接打开即可看到图片）
curl "https://60s.youyer.top/v2/qrcode?text=https://60s.youyer.top"

# 密码强度检测
curl "https://60s.youyer.top/v2/password/check?password=MyP@ssw0rd"</pre></div>

<!-- ====== 消遣娱乐 ====== -->
<h2 id="fun">🎤 消遣娱乐</h2>

<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/hitokoto</span></td><td><code>id</code> 可选，不传随机</td><td>一言</td></tr>
  <tr><td><span class="endpoint">GET /v2/duanzi</span></td><td><code>id</code> 可选，不传随机</td><td>搞笑段子</td></tr>
  <tr><td><span class="endpoint">GET /v2/answer</span></td><td><code>id</code> 可选，不传随机</td><td>答案之书</td></tr>
  <tr><td><span class="endpoint">GET /v2/kfc</span></td><td>—</td><td>疯狂星期四文案</td></tr>
  <tr><td><span class="endpoint">GET /v2/fabing</span></td><td><code>name</code> 称呼，默认"主人"</td><td>发病文学</td></tr>
  <tr><td><span class="endpoint">GET /v2/luck</span></td><td><code>id</code> 可选，不传随机</td><td>运势</td></tr>
  <tr><td><span class="endpoint">GET /v2/dad-joke</span></td><td><code>id</code> 可选，不传随机</td><td>英文冷笑话</td></tr>
  <tr><td><span class="endpoint">GET /v2/awesome-js</span></td><td><code>id</code> 可选，不传随机</td><td>JS 面试题</td></tr>
  <tr><td><span class="endpoint">GET /v2/changya</span></td><td>—</td><td>唱鸭随机唱歌（支持 audio 编码直接播）</td></tr>
</table>

<!-- ====== 奥运 ====== -->
<h2 id="olympics">🏅 奥运</h2>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/olympics</span></td><td><code>id</code> 赛事 ID，默认当前</td><td>奥运奖牌榜</td></tr>
  <tr><td><span class="endpoint">GET /v2/olympics/events</span></td><td>—</td><td>历史奥运赛事列表</td></tr>
</table>

<!-- ====== Beta ====== -->
<h2 id="beta">🧪 Beta（不稳定）</h2>
<table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="endpoint">GET /v2/beta/kuan</span></td><td>—</td><td>酷安热门话题</td></tr>
  <tr><td><span class="endpoint">GET /v2/beta/qq/profile</span></td><td><code>qq</code> QQ 号，<code>size</code> 头像尺寸</td><td>QQ 用户信息</td></tr>
</table>

<footer>
  <p>基于 <a href="https://github.com/vikiboss/60s">vikiboss/60s</a> 开源项目 · 自部署于 Vercel · 实例域名为个人使用</p>
  <p style="margin-top:6px">官方文档 <a href="https://docs.60s-api.viki.moe">docs.60s-api.viki.moe</a> · 反馈 QQ 群 595941841</p>
</footer>

</div>
<a class="back-top" href="#" title="回到顶部">↑</a>
</body></html>`
