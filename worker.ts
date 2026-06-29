export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

const RAILWAY = 'https://corestacksolutions-api-production.up.railway.app'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

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

    return env.ASSETS.fetch(request)
  },
}
