// API docs HTML for 60s.youyer.top
export const docsHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>60s API — 接口文档</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⏰</text></svg>">
<style>
:root{--bg:#0a0a0f;--card:#111118;--border:#1e1e2a;--text:#e4e4ec;--dim:#7c7c8a;--accent:#7c8aff;--green:#4ade80;--orange:#f59e0b;--red:#f87171;--surface:#16161f;--hover:#1c1c28}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:1040px;margin:0 auto;padding:0 24px}
/* nav */
.nav{position:sticky;top:0;z-index:10;background:rgba(10,10,15,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1040px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:52px}
.nav-logo{font-size:1.05em;font-weight:700;color:var(--text);text-decoration:none;display:flex;align-items:center;gap:8px}
.nav-logo span{color:var(--dim);font-weight:400;font-size:.85em}
/* hero */
.hero{padding:72px 0 48px;text-align:center}
.hero h1{font-size:2.8em;font-weight:800;letter-spacing:-.02em;margin-bottom:8px;background:linear-gradient(135deg,var(--accent),#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--dim);font-size:1.1em;max-width:560px;margin:12px auto}
.hero .tags{display:flex;justify-content:center;gap:8px;margin-top:20px;flex-wrap:wrap}
.tag{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:.82em;font-weight:500}
.tag-pri{background:rgba(124,138,255,.12);color:var(--accent)}
.tag-sec{background:rgba(74,222,128,.1);color:var(--green)}
.tag-ter{background:rgba(245,158,11,.1);color:var(--orange)}
/* sections */
.section{margin:40px 0}
.section h2{font-size:1.35em;font-weight:700;margin-bottom:20px;display:flex;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.section h3{font-size:1.05em;font-weight:600;color:var(--accent);margin:24px 0 8px}
.section a{color:var(--accent);text-decoration:none}
.section a:hover{text-decoration:underline}
/* toc */
.toc{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 32px}
.toc a{color:var(--dim);text-decoration:none;padding:6px 16px;border:1px solid var(--border);border-radius:20px;font-size:.85em;transition:all .15s}
.toc a:hover{color:var(--text);border-color:var(--accent);background:rgba(124,138,255,.08)}
/* table */
.tbl-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:8px;margin:12px 0 24px}
table{width:100%;border-collapse:collapse;font-size:.9em}
th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border)}
th{background:var(--surface);color:var(--dim);font-weight:600;font-size:.82em;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}
td{color:var(--text)}
td:first-child{font-family:'SF Mono','Fira Code','Cascadia Code',monospace;font-size:.85em;color:var(--accent);white-space:nowrap}
td:nth-child(2){color:var(--dim);font-size:.85em}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--hover)}
/* endpoint badge */
.ep{display:inline-flex;align-items:center;gap:6px}
.ep-method{font-size:.7em;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.03em}
.ep-method.get{background:rgba(74,222,128,.12);color:var(--green)}
.ep-method.post{background:rgba(245,158,11,.12);color:var(--orange)}
.ep-path{font-family:'SF Mono','Fira Code',monospace;font-size:.88em;color:var(--accent)}
.freq{display:inline-block;font-size:.75em;color:var(--dim);background:var(--surface);padding:1px 8px;border-radius:4px}
/* code */
pre{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px 20px;overflow-x:auto;margin:8px 0 20px;font-size:.85em;line-height:1.6}
code{font-family:'SF Mono','Fira Code','Cascadia Code',monospace;font-size:.88em}
pre .cmt{color:#555}
pre .cmd{color:var(--accent)}
pre .url{color:var(--green)}
pre .param{color:var(--orange)}
/* notes */
.note{background:rgba(124,138,255,.06);border-left:3px solid var(--accent);padding:12px 16px;border-radius:0 6px 6px 0;margin:16px 0;font-size:.88em;color:var(--dim)}
.note b{color:var(--text)}
/* footer */
footer{text-align:center;padding:48px 0;color:var(--dim);font-size:.82em;border-top:1px solid var(--border);margin-top:64px}
footer a{color:var(--accent)}
/* quick start tabs */
.qs{margin:8px 0 20px}
.qs-tabs{display:flex;gap:0}
.qs-tab{padding:8px 18px;font-size:.82em;color:var(--dim);background:var(--surface);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;cursor:pointer;margin-right:4px;transition:all .15s}
.qs-tab.on{color:var(--text);background:var(--card)}
.qs-pane{display:none;background:var(--card);border:1px solid var(--border);border-radius:0 8px 8px 8px;padding:16px 20px}
.qs-pane.on{display:block}
@media(max-width:640px){.hero h1{font-size:1.8em}.hero p{font-size:.95em}td:first-child{font-size:.78em}pre{font-size:.8em}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner"><a class="nav-logo" href="/">⏰ 60s API <span>/ docs</span></a></div></nav>

<div class="wrap">
<header class="hero">
  <h1>60s API</h1>
  <p>高质量、开源、可靠的开放 API 集合 — 每天 60 秒读懂世界、热门榜单、天气翻译、娱乐消遣，65+ 接口全部免费</p>
  <div class="tags">
    <span class="tag tag-pri">Vercel 自部署</span>
    <span class="tag tag-sec">65+ 接口</span>
    <span class="tag tag-ter">完全免费开源</span>
  </div>
</header>

<!-- 快速开始 -->
<div class="section">
  <h2>🚀 快速开始</h2>
  <p style="margin-bottom:14px;color:var(--dim)">根路径 <code style="color:var(--accent)">https://60s.youyer.top</code>，所有接口默认返回 JSON。</p>
  <div class="qs">
    <div class="qs-tabs"><div class="qs-tab on" onclick="s('c')">curl</div><div class="qs-tab" onclick="s('p')">Python</div><div class="qs-tab" onclick="s('n')">Node.js</div></div>
    <div class="qs-pane on" id="c"><pre><span class="cmt"># 健康检查</span>
curl <span class="url">https://60s.youyer.top/health</span>

<span class="cmt"># 今日 60s 纯文本</span>
curl "<span class="url">https://60s.youyer.top/v2/60s</span><span class="param">?encoding=text</span>"

<span class="cmt"># 微博热搜 Markdown</span>
curl "<span class="url">https://60s.youyer.top/v2/weibo</span><span class="param">?encoding=markdown</span>"</pre></div>
    <div class="qs-pane" id="p"><pre><span class="cmt"># 健康检查</span>
<span class="cmd">import</span> requests
r = requests.get(<span class="url">'https://60s.youyer.top/health'</span>)
<span class="cmd">print</span>(r.text)  <span class="cmt"># → ok</span>

<span class="cmt"># 查天气</span>
r = requests.get(<span class="url">'https://60s.youyer.top/v2/weather/realtime'</span>,
                 params={<span class="param">'query'</span>: <span class="param">'北京'</span>})
<span class="cmd">print</span>(r.json()[<span class="param">'data'</span>][<span class="param">'weather'</span>][<span class="param">'temperature'</span>])</pre></div>
    <div class="qs-pane" id="n"><pre><span class="cmt">// 健康检查</span>
<span class="cmd">const</span> r = <span class="cmd">await</span> fetch(<span class="url">'https://60s.youyer.top/health'</span>)
console.<span class="cmd">log</span>(<span class="cmd">await</span> r.text())  <span class="cmt">// → ok</span>

<span class="cmt">// 获取热搜</span>
<span class="cmd">const</span> { data } = <span class="cmd">await</span> fetch(<span class="url">'https://60s.youyer.top/v2/weibo'</span>).then(r => r.json())
data.slice(0,10).forEach((e,i) => console.<span class="cmd">log</span>(\`<span class="param">\${</span>i+1<span class="param">}</span>. <span class="param">\${</span>e.title<span class="param">}</span>\`))</pre></div>
  </div>
</div>

<!-- 参数约定 -->
<div class="section">
  <h2>📋 参数约定</h2>
  <h3>响应格式 <code>encoding</code></h3>
  <div class="tbl-wrap"><table>
    <tr><th>值</th><th>说明</th><th>场景</th></tr>
    <tr><td><code>json</code></td><td>结构化 JSON（默认）</td><td>程序调用、二次开发</td></tr>
    <tr><td><code>text</code></td><td>格式化的纯文本</td><td>终端、脚本、消息推送</td></tr>
    <tr><td><code>markdown</code></td><td>Markdown 格式</td><td>AI 消费、文档、机器人</td></tr>
  </table></div>
  <p class="note"><b>特殊格式：</b><code>/v2/60s</code> 额外支持 <code>image</code> / <code>image-proxy</code>；<code>/v2/changya</code> 支持 <code>audio</code>；<code>/v2/qrcode</code> 默认返回图片；<code>/v2/color</code> 支持 <code>html</code>。</p>
  <h3>时间戳 / 命名</h3>
  <p style="color:var(--dim);font-size:.9em">时间字段提供两种格式：字符串（如 <code>updated</code>）+ 13 位毫秒时间戳（后缀 <code>_at</code>，如 <code>updated_at</code>）。链接字段统一命名 <code>link</code>，封面图统一命名 <code>cover</code>。</p>
</div>

<!-- TOC -->
<div class="toc">
  <a href="#news">🕘 周期资讯</a><a href="#hot">🔥 热门榜单</a><a href="#util">🍱 实用功能</a><a href="#fun">🎤 消遣娱乐</a><a href="#olympics">🏅 奥运</a><a href="#beta">🧪 Beta</a>
</div>

<!-- 周期资讯 -->
<div class="section" id="news"><h2>🕘 周期资讯</h2>

<h3>每天 60 秒读懂世界</h3>
<div class="tbl-wrap"><table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期 YYYY-MM-DD，默认今天</td></tr>
  <tr><td><code>encoding</code></td><td>text / json / markdown / image / image-proxy</td></tr>
  <tr><td><code>force-update</code></td><td>跳过缓存强制刷新</td></tr>
</table></div>
<pre><span class="cmt"># 纯文本（适合推送）</span>
curl "<span class="url">https://60s.youyer.top/v2/60s</span><span class="param">?encoding=text&date=2025-06-15</span>"</pre>
<p class="note"><b>RSS 订阅：</b><code>/v2/60s/rss</code> 返回标准 XML。</p>

<h3>AI 资讯快报</h3>
<div class="tbl-wrap"><table>
  <tr><th>参数</th><th>说明</th></tr>
  <tr><td><code>date</code></td><td>日期，默认今天（非每日更新，注意判空）</td></tr>
  <tr><td><code>all</code></td><td>设为 1 获取全部历史</td></tr>
</table></div>

<h3>其他资讯</h3>
<div class="tbl-wrap"><table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/bing</span></span></td><td><code>encoding</code>: text/json/markdown/image</td><td>必应每日壁纸</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/exchange-rate</span></span></td><td><code>currency</code> 基准货币，默认 CNY</td><td>当日汇率</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/today-in-history</span></span></td><td><code>date</code> 可选</td><td>历史上的今天（百度百科）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/epic</span></span></td><td>—</td><td>Epic 免费游戏</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/gold-price</span></span></td><td>—</td><td>黄金价格（实时+金店+银行+回收）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/fuel-price</span></span></td><td><code>region</code> 地区，支持 POST</td><td>汽油价格</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/lunar</span></span></td><td><code>date</code> 可选</td><td>农历/干支/节气/星座/宜忌</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/it-news</span></span></td><td><code>limit</code> 默认20最大50</td><td>IT 之家 RSS</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/it-news/rank</span></span></td><td><code>type</code>: day/week/month</td><td>IT 之家热榜</td></tr>
</table></div>
</div>

<!-- 热门榜单 -->
<div class="section" id="hot"><h2>🔥 热门榜单</h2>
<div class="tbl-wrap"><table>
  <tr><th>接口</th><th>频率</th><th>说明</th></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/weibo</span></span></td><td><span class="freq">实时</span></td><td>微博热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/zhihu</span></span></td><td><span class="freq">实时</span></td><td>知乎热榜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douyin</span></span></td><td><span class="freq">实时</span></td><td>抖音热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/bili</span></span></td><td><span class="freq">实时</span></td><td>B 站热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/toutiao</span></span></td><td><span class="freq">实时</span></td><td>头条热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/rednote</span></span></td><td><span class="freq">实时</span></td><td>小红书热点</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/dongchedi</span></span></td><td><span class="freq">实时</span></td><td>懂车帝热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/quark</span></span></td><td><span class="freq">实时</span></td><td>夸克热点</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/baidu/hot</span></span></td><td><span class="freq">实时</span></td><td>百度热搜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/baidu/teleplay</span></span></td><td><span class="freq">实时</span></td><td>百度电视剧榜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/baidu/tieba</span></span></td><td><span class="freq">实时</span></td><td>百度贴吧话题</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/ncm-rank/list</span></span></td><td><span class="freq">实时</span></td><td>网易云榜单列表</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/ncm-rank/:id</span></span></td><td><span class="freq">实时</span></td><td>网易云榜单详情（<code>size</code> 控制数量）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/maoyan/all/movie</span></span></td><td><span class="freq">时更</span></td><td>全球票房总榜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/maoyan/realtime/movie</span></span></td><td><span class="freq">实时</span></td><td>猫眼实时票房</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/maoyan/realtime/tv</span></span></td><td><span class="freq">实时</span></td><td>猫眼电视收视</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/maoyan/realtime/web</span></span></td><td><span class="freq">实时</span></td><td>猫眼网剧热度</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/hacker-news/top</span></span></td><td><span class="freq">~10min</span></td><td>HN 热门（<code>limit</code> 控制）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/hacker-news/new</span></span></td><td><span class="freq">~10min</span></td><td>HN 最新</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/hacker-news/best</span></span></td><td><span class="freq">~10min</span></td><td>HN 最佳</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douban/weekly/movie</span></span></td><td><span class="freq">周更</span></td><td>豆瓣口碑电影</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douban/weekly/tv_chinese</span></span></td><td><span class="freq">周更</span></td><td>豆瓣华语剧集</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douban/weekly/tv_global</span></span></td><td><span class="freq">周更</span></td><td>豆瓣全球剧集</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douban/weekly/show_chinese</span></span></td><td><span class="freq">周更</span></td><td>豆瓣华语综艺</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/douban/weekly/show_global</span></span></td><td><span class="freq">周更</span></td><td>豆瓣全球综艺</td></tr>
</table></div>
</div>

<!-- 实用功能 -->
<div class="section" id="util"><h2>🍱 实用功能</h2>

<h3>实时天气</h3>
<pre><span class="cmt"># 深圳实时天气</span>
curl "<span class="url">https://60s.youyer.top/v2/weather/realtime</span><span class="param">?query=深圳&encoding=text</span>"</pre>

<h3>天气预报</h3>
<pre><span class="cmt"># 上海 3 天预报</span>
curl "<span class="url">https://60s.youyer.top/v2/weather/forecast</span><span class="param">?query=上海&days=3</span>"</pre>

<h3>全部实用功能</h3>
<div class="tbl-wrap"><table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="ep"><span class="ep-method post">POST</span><span class="ep-path">/v2/fanyi</span></span></td><td><code>text</code> 原文，<code>to</code>/<code>from</code> 语言</td><td>有道翻译（109 种语言）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/fanyi/langs</span></span></td><td>—</td><td>支持语言列表</td></tr>
  <tr><td><span class="ep"><span class="ep-method post">POST</span><span class="ep-path">/v2/lyric</span></span></td><td><code>query</code> 歌名，<code>clean</code> 去信息行</td><td>QQ 音乐歌词</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/baike</span></span></td><td><code>word</code> 关键词</td><td>百度百科</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/ip</span></span></td><td><code>ip</code> 可选</td><td>IP 归属地</td></tr>
  <tr><td><span class="ep"><span class="ep-method post">POST</span><span class="ep-path">/v2/hash</span></span></td><td><code>content</code> 文本</td><td>MD5/SHA/Base64/Gzip/Brotli</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/qrcode</span></span></td><td><code>text</code> 内容，<code>size</code>/<code>level</code></td><td>二维码（返回 GIF 图片）</td></tr>
  <tr><td><span class="ep"><span class="ep-method post">POST</span><span class="ep-path">/v2/og</span></span></td><td><code>url</code> 目标链接</td><td>OG 元信息解析</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/password</span></span></td><td><code>length</code>/<code>symbols</code>/<code>numbers</code></td><td>随机密码生成</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/password/check</span></span></td><td><code>password</code></td><td>密码强度（评分+破解时间）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/color/random</span></span></td><td>—</td><td>随机颜色 / 格式转换</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/color/palette</span></span></td><td><code>color</code> HEX</td><td>8 种色彩理论配色</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/chemical</span></span></td><td><code>id</code> 可选</td><td>化学物质</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/whois</span></span></td><td><code>domain</code> 域名</td><td>WHOIS（RDAP+递归）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/health</span></span></td><td><code>height</code>/<code>weight</code>/<code>gender</code>/<code>age</code></td><td>健康分析（BMI/体脂/BMR）</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/moyu</span></span></td><td><code>date</code> 可选</td><td>摸鱼日历</td></tr>
</table></div>
</div>

<!-- 消遣娱乐 -->
<div class="section" id="fun"><h2>🎤 消遣娱乐</h2>
<div class="tbl-wrap"><table>
  <tr><th>接口</th><th>参数</th><th>说明</th></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/hitokoto</span></span></td><td><code>id</code> 可选</td><td>一言</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/duanzi</span></span></td><td><code>id</code> 可选</td><td>搞笑段子</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/answer</span></span></td><td><code>id</code> 可选</td><td>答案之书</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/kfc</span></span></td><td>—</td><td>疯狂星期四文案</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/fabing</span></span></td><td><code>name</code> 称呼</td><td>发病文学</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/luck</span></span></td><td><code>id</code> 可选</td><td>运势</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/dad-joke</span></span></td><td><code>id</code> 可选</td><td>英文冷笑话</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/awesome-js</span></span></td><td><code>id</code> 可选</td><td>JS 面试题</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/changya</span></span></td><td>—</td><td>随机唱歌（支持 <code>audio</code>）</td></tr>
</table></div>
</div>

<!-- 奥运 / Beta -->
<div class="section" id="olympics"><h2>🏅 奥运</h2>
<div class="tbl-wrap"><table>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/olympics</span></span></td><td><code>id</code> 赛事 ID</td><td>奖牌榜</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/olympics/events</span></span></td><td>—</td><td>历史赛事列表</td></tr>
</table></div></div>

<div class="section" id="beta"><h2>🧪 Beta</h2>
<div class="tbl-wrap"><table>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/beta/kuan</span></span></td><td>—</td><td>酷安热门话题</td></tr>
  <tr><td><span class="ep"><span class="ep-method get">GET</span><span class="ep-path">/v2/beta/qq/profile</span></span></td><td><code>qq</code> / <code>size</code></td><td>QQ 用户信息</td></tr>
</table></div></div>

<footer>
  <p>基于 <a href="https://github.com/vikiboss/60s">vikiboss/60s</a> 开源 · 自部署于 Vercel</p>
  <p style="margin-top:4px">官方文档 <a href="https://docs.60s-api.viki.moe">docs.60s-api.viki.moe</a> · 反馈 QQ 群 595941841</p>
</footer>
</div>
<script>function s(id){document.querySelectorAll('.qs-tab').forEach(e=>e.classList.remove('on'));document.querySelectorAll('.qs-pane').forEach(e=>e.classList.remove('on'));event.target.classList.add('on');document.getElementById(id).classList.add('on')}</script>
</body></html>`
