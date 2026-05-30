// Minimal debug handler
export default function handler() {
  return new Response('OK from Vercel', {
    headers: { 'content-type': 'text/plain' },
  })
}
