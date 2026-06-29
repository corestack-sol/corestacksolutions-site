import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const serveCorporate: Plugin = {
  name: 'serve-corporate',
  configureServer(server) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.middlewares.use((req: any, res: any, next) => {
      const url = (req.url ?? '').split('?')[0]
      // /corporate is now handled by the React SPA (PrivateRoute → CorporateIndex)
      // /corporate/doc-name → redirect → /corporate/doc-name.html (direct doc access in dev)
      if (/^\/corporate\/[\w-]+$/.test(url)) {
        res.writeHead(302, { Location: url + '.html' })
        res.end()
        return
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), serveCorporate],
  server: {
    proxy: {
      '/api': {
        target: 'https://corestacksolutions-api-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
