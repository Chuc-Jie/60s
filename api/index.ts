import { app } from '../src/app.ts'

export default async function handler(req: Request): Promise<Response> {
  try {
    return await app.fetch(req)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    const stack = e instanceof Error ? e.stack : ''
    return new Response(JSON.stringify({ error: message, stack }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
