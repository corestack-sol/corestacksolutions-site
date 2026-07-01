export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  JWT_SECRET: string
}

const RAILWAY = 'https://corestacksolutions-api-production.up.railway.app'

function getCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function base64UrlDecode(input: string): Uint8Array<ArrayBuffer> {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Verifies the HMAC-SHA256 signature against `secret` — never trusts the
// token's own `alg` header, so it can't be tricked into accepting `alg: none`.
async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [headerB64, payloadB64, signatureB64] = parts

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const signature = base64UrlDecode(signatureB64)
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as Record<string, unknown>
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return null
    return payload
  } catch {
    return null
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

    // ── Protect /corporate (dashboard) and /docs/formatos/* (document templates) —
    // both require a session cookie with a valid signature ──
    if (url.pathname.startsWith('/corporate') || url.pathname.startsWith('/docs/formatos')) {
      const cookie = request.headers.get('Cookie') ?? ''
      const token = getCookie(cookie, 'cs_auth')
      const payload = token ? await verifyJwt(token, env.JWT_SECRET) : null
      if (!payload) {
        return Response.redirect(new URL('/', url).toString(), 302)
      }
      // Serve the asset but prevent edge caching so the auth check always runs
      const res = await env.ASSETS.fetch(request)
      const out = new Response(res.body, res)
      out.headers.set('Cache-Control', 'private, no-store')
      return out
    }

    return env.ASSETS.fetch(request)
  },
}
