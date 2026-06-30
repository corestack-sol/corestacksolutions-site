export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

const RAILWAY = 'https://corestacksolutions-api-production.up.railway.app'

function getCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function isTokenAlive(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 > Date.now() : true
  } catch {
    return false
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // ── API proxy — avoids CORS in dev & prod ──
    if (url.pathname.startsWith('/api/')) {
      const target = new URL(url.pathname + url.search, RAILWAY)
      const upstream = new Request(target.toString(), {
        method: request.method,
        headers: request.headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        redirect: 'follow',
      })
      return fetch(upstream)
    }

    // ── Protect /corporate/* — requires valid session cookie ──
    if (url.pathname.startsWith('/corporate')) {
      const cookie = request.headers.get('Cookie') ?? ''
      const token = getCookie(cookie, 'cs_auth')
      if (!token || !isTokenAlive(token)) {
        return Response.redirect(new URL('/', url).toString(), 302)
      }
    }

    const res = await env.ASSETS.fetch(request)
    const out = new Response(res.body, res)
    out.headers.set('X-Worker', '1')
    return out
  },
}
