// api/index.ts — Vercel Serverless Function entry
// Lightweight Oak ctx adapter to reuse all existing modules unchanged.

// ============= Fake Oak ctx for Vercel =============

interface FakeOakCtx {
  request: {
    url: URL
    headers: Headers
    ip: string
    method: string
    _bodyJson?: Record<string, any>
    body: { json: () => Promise<any> }
  }
  state: { encoding?: string }
  response: {
    body: any
    status: number
    headers: Headers
    redirect(url: string): void
    type: string
  }
  params: Record<string, string>
}

function createOakCtx(req: Request, params: Record<string, string> = {}): FakeOakCtx {
  const url = new URL(req.url)
  const encoding = url.searchParams.get('encoding') || undefined
  const responseHeaders = new Headers()

  let _status = 200
  let _body: any = null
  let _type = ''

  const ctx: FakeOakCtx = {
    request: {
      url,
      headers: req.headers,
      ip:
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1',
      method: req.method,
      _bodyJson: undefined,
      body: {
        json: async () => {
          try {
            return await req.clone().json()
          } catch {
            return {}
          }
        },
      },
    },
    state: { encoding },
    response: {
      get body() {
        return _body
      },
      set body(v: any) {
        _body = v
      },
      get status() {
        return _status
      },
      set status(s: number) {
        _status = s
      },
      headers: responseHeaders,
      redirect(u: string) {
        _status = 302
        responseHeaders.set('Location', u)
      },
      get type() {
        return _type
      },
      set type(t: string) {
        _type = t
        if (!responseHeaders.has('Content-Type')) {
          responseHeaders.set('Content-Type', t)
        }
      },
    },
    params,
  }

  return ctx
}

// ============= Router =============

import { service60s } from '../src/modules/60s.module.ts'
import { service60sRss } from '../src/modules/60s-rss.module.ts'
import { serviceAINews } from '../src/modules/ai-news.module.ts'
import { serviceAnswer } from '../src/modules/answer/answer.module.ts'
import { serviceAwesomeJs } from '../src/modules/awesome-js/awesome-js.module.ts'
import { serviceBaike } from '../src/modules/baike.module.ts'
import { serviceBili } from '../src/modules/bili.module.ts'
import { serviceBing } from '../src/modules/bing.module.ts'
import { serviceChangYa } from '../src/modules/changya.module.ts'
import { serviceChemical } from '../src/modules/chemical.module.ts'
import { serviceDouyin } from '../src/modules/douyin.module.ts'
import { serviceDuanzi } from '../src/modules/duanzi/duanzi.module.ts'
import { serviceEpic } from '../src/modules/epic.module.ts'
import { serviceExRate } from '../src/modules/exchange-rate.module.ts'
import { serviceFabing } from '../src/modules/fabing/fabing.module.ts'
import { serviceFanyi } from '../src/modules/fanyi/fanyi.module.ts'
import { serviceHash } from '../src/modules/hash.module.ts'
import { serviceHitokoto } from '../src/modules/hitokoto/hitokoto.module.ts'
import { serviceIP } from '../src/modules/ip.module.ts'
import { serviceKfc } from '../src/modules/kfc.module.ts'
import { serviceLuck } from '../src/modules/luck/luck.module.ts'
import { serviceLunar } from '../src/modules/lunar/lunar.module.ts'
import { serviceMaoyan } from '../src/modules/maoyan/maoyan.module.ts'
import { serviceNcm } from '../src/modules/ncm.module.ts'
import { serviceOG } from '../src/modules/og.module.ts'
import { serviceQQ } from '../src/modules/qq.module.ts'
import { serviceQRCode } from '../src/modules/qrcode/qrcode.module.ts'
import { serviceTodayInHistory } from '../src/modules/today-in-history.module.ts'
import { serviceToutiao } from '../src/modules/toutiao.module.ts'
import { serviceWeather } from '../src/modules/weather.module.ts'
import { serviceWeibo } from '../src/modules/weibo.module.ts'
import { serviceZhihu } from '../src/modules/zhihu.module.ts'
import { serviceDadJoke } from '../src/modules/dad-joke/dad-joke.module.ts'
import { serviceHackerNews } from '../src/modules/hacker-news.module.ts'
import { serviceRednote } from '../src/modules/rednote.module.ts'
import { serviceBaidu } from '../src/modules/baidu.module.ts'
import { serviceDongchedi } from '../src/modules/dongchedi.module.ts'
import { serviceHealth } from '../src/modules/health.module.ts'
import { servicePassword } from '../src/modules/password/password.module.ts'
import { serviceColor } from '../src/modules/color.module.ts'
import { serviceKuan } from '../src/modules/kuan.module.ts'
import { serviceLyric } from '../src/modules/lyric.module.ts'
import { serviceMoyu } from '../src/modules/moyu.module.ts'
import { serviceFuelPrice } from '../src/modules/fuel-price/fuel-price.module.ts'
import { GoldPriceService } from '../src/modules/gold-price.module.ts'
import { serviceQuark } from '../src/modules/quark.module.ts'
import { serviceWhois } from '../src/modules/whois.module.ts'
import { olympicsService } from '../src/modules/olympics/olympics.module.ts'
import { serviceDoubanWeekly } from '../src/modules/douban-weekly.module.ts'
import { serviceITNews } from '../src/modules/it-news.module.ts'

const serviceGoldPrice = new GoldPriceService()

type HandlerFn = () => (ctx: FakeOakCtx, next: () => Promise<void>) => Promise<void>

interface RouteEntry {
  pattern: string | RegExp
  handler: HandlerFn
  params?: (pathname: string) => Record<string, string>
}

const routes: RouteEntry[] = [
  { pattern: '/', handler: () => rootHandler },
  { pattern: '/health', handler: () => healthHandler },
  { pattern: '/endpoints', handler: () => endpointsHandler },

  { pattern: '/v2/60s', handler: () => service60s.handle() },
  { pattern: '/v2/60s/rss', handler: () => service60sRss.handle() },
  { pattern: '/v2/answer', handler: () => serviceAnswer.handle() },
  { pattern: '/v2/baike', handler: () => serviceBaike.handle() },
  { pattern: '/v2/bili', handler: () => serviceBili.handle() },
  { pattern: '/v2/bing', handler: () => serviceBing.handle() },
  { pattern: '/v2/changya', handler: () => serviceChangYa.handle() },
  { pattern: '/v2/chemical', handler: () => serviceChemical.handle() },
  { pattern: '/v2/douyin', handler: () => serviceDouyin.handle() },
  { pattern: '/v2/duanzi', handler: () => serviceDuanzi.handle() },
  { pattern: '/v2/epic', handler: () => serviceEpic.handle() },
  { pattern: '/v2/exchange-rate', handler: () => serviceExRate.handle() },
  { pattern: '/v2/fabing', handler: () => serviceFabing.handle() },
  { pattern: '/v2/hitokoto', handler: () => serviceHitokoto.handle() },
  { pattern: '/v2/ip', handler: () => serviceIP.handle() },
  { pattern: '/v2/kfc', handler: () => serviceKfc.handle() },
  { pattern: '/v2/luck', handler: () => serviceLuck.handle() },
  { pattern: '/v2/today-in-history', handler: () => serviceTodayInHistory.handle() },
  { pattern: '/v2/toutiao', handler: () => serviceToutiao.handle() },
  { pattern: '/v2/weibo', handler: () => serviceWeibo.handle() },
  { pattern: '/v2/zhihu', handler: () => serviceZhihu.handle() },
  { pattern: '/v2/lunar', handler: () => serviceLunar.handle() },
  { pattern: '/v2/ai-news', handler: () => serviceAINews.handle() },
  { pattern: '/v2/it-news', handler: () => serviceITNews.handle() },
  { pattern: '/v2/it-news/rank', handler: () => serviceITNews.handleRank() },
  { pattern: '/v2/awesome-js', handler: () => serviceAwesomeJs.handle() },
  { pattern: '/v2/qrcode', handler: () => serviceQRCode.handle() },
  { pattern: '/v2/dad-joke', handler: () => serviceDadJoke.handle() },
  { pattern: '/v2/rednote', handler: () => serviceRednote.handle() },
  { pattern: '/v2/dongchedi', handler: () => serviceDongchedi.handle() },
  { pattern: '/v2/moyu', handler: () => serviceMoyu.handle() },
  { pattern: '/v2/quark', handler: () => serviceQuark.handle() },
  { pattern: '/v2/whois', handler: () => serviceWhois.handle() },

  { pattern: '/v2/health', handler: () => serviceHealth.handle() },
  { pattern: '/v2/password', handler: () => servicePassword.handle() },
  { pattern: '/v2/password/check', handler: () => servicePassword.handleCheck() },

  { pattern: '/v2/maoyan/all/movie', handler: () => serviceMaoyan.handleAllMovie() },
  { pattern: '/v2/maoyan/realtime/movie', handler: () => serviceMaoyan.handleRealtime('movie') },
  { pattern: '/v2/maoyan/realtime/tv', handler: () => serviceMaoyan.handleRealtime('tv') },
  { pattern: '/v2/maoyan/realtime/web', handler: () => serviceMaoyan.handleRealtime('web') },

  { pattern: '/v2/hacker-news/new', handler: () => serviceHackerNews.handle('new') },
  { pattern: '/v2/hacker-news/top', handler: () => serviceHackerNews.handle('top') },
  { pattern: '/v2/hacker-news/best', handler: () => serviceHackerNews.handle('best') },

  { pattern: '/v2/baidu/hot', handler: () => serviceBaidu.handleHotSearch() },
  { pattern: '/v2/baidu/teleplay', handler: () => serviceBaidu.handleTeleplay() },
  { pattern: '/v2/baidu/tieba', handler: () => serviceBaidu.handleTieba() },

  { pattern: '/v2/weather/realtime', handler: () => serviceWeather.handle() },
  { pattern: '/v2/weather/forecast', handler: () => serviceWeather.handleForecast() },

  { pattern: '/v2/ncm-rank/list', handler: () => serviceNcm.handleRank() },
  {
    pattern: /^\/v2\/ncm-rank\/(.+)$/,
    handler: () => serviceNcm.handleRankDetail(),
    params: (pathname) => {
      const m = pathname.match(/^\/v2\/ncm-rank\/(.+)$/)
      return m ? { id: m[1] } : {}
    },
  },

  { pattern: '/v2/color/random', handler: () => serviceColor.handle() },
  { pattern: '/v2/color/palette', handler: () => serviceColor.handlePalette() },

  { pattern: '/v2/lyric', handler: () => serviceLyric.handle() },
  { pattern: '/v2/fuel-price', handler: () => serviceFuelPrice.handle() },
  { pattern: '/v2/gold-price', handler: () => serviceGoldPrice.handle() },
  { pattern: '/v2/olympics', handler: () => olympicsService.handle() },
  { pattern: '/v2/olympics/events', handler: () => olympicsService.handleEventList() },

  { pattern: '/v2/douban/weekly/movie', handler: () => serviceDoubanWeekly.handle('movie') },
  { pattern: '/v2/douban/weekly/tv_chinese', handler: () => serviceDoubanWeekly.handle('tv_chinese') },
  { pattern: '/v2/douban/weekly/tv_global', handler: () => serviceDoubanWeekly.handle('tv_global') },
  { pattern: '/v2/douban/weekly/show_chinese', handler: () => serviceDoubanWeekly.handle('show_chinese') },
  { pattern: '/v2/douban/weekly/show_global', handler: () => serviceDoubanWeekly.handle('show_global') },

  // Body-aware routes (support POST)
  { pattern: '/v2/og', handler: () => serviceOG.handle() },
  { pattern: '/v2/hash', handler: () => serviceHash.handle() },
  { pattern: '/v2/fanyi', handler: () => serviceFanyi.handle() },
  { pattern: '/v2/fanyi/langs', handler: () => serviceFanyi.handleLangs() },

  // Beta
  { pattern: '/v2/beta/kuan', handler: () => serviceKuan.handle() },
  { pattern: '/v2/beta/qq/profile', handler: () => serviceQQ.handle() },

  // Legacy compat
  { pattern: '/v2/exchange_rate', handler: () => serviceExRate.handle() },
  { pattern: '/v2/today_in_history', handler: () => serviceTodayInHistory.handle() },
  { pattern: '/v2/maoyan', handler: () => serviceMaoyan.handleAllMovie() },
  { pattern: '/v2/baidu/realtime', handler: () => serviceBaidu.handleHotSearch() },
  { pattern: '/v2/weather', handler: () => serviceWeather.handle() },
  { pattern: '/v2/ncm-rank', handler: () => serviceNcm.handleRank() },
  { pattern: '/v2/color', handler: () => serviceColor.handle() },
]

import { Common } from '../src/common.ts'

function getEndpoints(): string[] {
  return routes.filter((r) => typeof r.pattern === 'string').map((r) => r.pattern as string)
}

// Root/home handler
async function rootHandler(ctx: FakeOakCtx, next: () => Promise<void>) {
  ctx.response.headers.set('Content-Type', 'application/json; charset=utf-8')
  ctx.response.body = JSON.stringify({ ...Common.getApiInfo(), endpoints: getEndpoints() }, null, 2)
  await next()
}

// Health check
async function healthHandler(ctx: FakeOakCtx, next: () => Promise<void>) {
  ctx.response.body = 'ok'
  await next()
}

// List all endpoints
async function endpointsHandler(ctx: FakeOakCtx, next: () => Promise<void>) {
  ctx.response.headers.set('Content-Type', 'application/json; charset=utf-8')
  ctx.response.body = JSON.stringify(getEndpoints())
  await next()
}

// ============= Main Vercel handler =============

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    })
  }

  const url = new URL(req.url)
  const pathname = url.pathname

  // Favicon redirect
  if (pathname === '/favicon.ico') {
    return Response.redirect('https://avatar.viki.moe', 302)
  }

  // Match route
  let matchedRoute: RouteEntry | undefined
  let params: Record<string, string> = {}

  for (const route of routes) {
    if (typeof route.pattern === 'string') {
      if (route.pattern === pathname) {
        matchedRoute = route
        break
      }
    } else {
      if (route.pattern.test(pathname)) {
        matchedRoute = route
        params = route.params ? route.params(pathname) : {}
        break
      }
    }
  }

  if (!matchedRoute) {
    return new Response(
      JSON.stringify({
        code: 404,
        message: '404, 接口被吃掉了，请检查！应用接口需要在 Base URL 后面带上版本号，如 /v2/60s',
      }),
      { status: 404, headers: corsHeaders('application/json') },
    )
  }

  const ctx = createOakCtx(req, params)

  try {
    const middleware = matchedRoute.handler()
    await middleware(ctx, async () => {})

    // Build response from ctx
    const respStatus = ctx.response.status
    const respBody = ctx.response.body
    const respHeaders = new Headers(ctx.response.headers)

    // CORS
    respHeaders.set('Access-Control-Allow-Origin', '*')

    // Redirect
    if (respStatus >= 300 && respStatus < 400) {
      const loc = respHeaders.get('Location') || '/'
      return new Response(null, { status: respStatus, headers: { ...Object.fromEntries(respHeaders), Location: loc } })
    }

    // Determine content type
    if (!respHeaders.has('Content-Type')) {
      respHeaders.set('Content-Type', 'application/json; charset=utf-8')
    }

    // Serialize body
    let body: BodyInit | null = null

    if (respBody instanceof ReadableStream) {
      return new Response(respBody, { status: respStatus, headers: respHeaders })
    }

    if (respBody instanceof Uint8Array || respBody instanceof ArrayBuffer) {
      body = respBody
    } else if (typeof respBody === 'string') {
      body = respBody
    } else if (respBody === null || respBody === undefined) {
      body = null
    } else {
      body = JSON.stringify(respBody)
    }

    return new Response(body, { status: respStatus, headers: respHeaders })
  } catch (err: any) {
    console.error('[60s-api]', err)
    return new Response(
      JSON.stringify({ code: 500, message: `服务器出错了... ${err.message || err}` }),
      { status: 500, headers: corsHeaders('application/json') },
    )
  }
}

function corsHeaders(ct: string): Record<string, string> {
  return {
    'Content-Type': ct,
    'Access-Control-Allow-Origin': '*',
  }
}
