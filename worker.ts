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

    // ── API proxy (dev & prod, avoids CORS) ──
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

    // ── /corporate and /corporate/ → React SPA (not the static HTML directory) ──
    if (url.pathname === '/corporate' || url.pathname === '/corporate/') {
      return env.ASSETS.fetch(new Request(new URL('/index.html', url).toString(), request))
    }

    // ── Protect /corporate/*.html ──
    if (url.pathname.startsWith('/corporate/') && url.pathname.endsWith('.html')) {
      const cookie = request.headers.get('Cookie') ?? ''
      const token = getCookie(cookie, 'cs_auth')
      if (!token || !isTokenAlive(token)) {
        return Response.redirect(new URL('/', url).toString(), 302)
      }
    }

    return env.ASSETS.fetch(request)
  },
}
