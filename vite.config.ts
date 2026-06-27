import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const serveCorporate: Plugin = {
  name: 'serve-corporate',
  configureServer(server) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.middlewares.use((req: any, res: any, next) => {
      const url = (req.url ?? '').split('?')[0]
      // /corporate          → redirect → /corporate/index.html
      // /corporate/doc-name → redirect → /corporate/doc-name.html
      if (url === '/corporate') {
        res.writeHead(302, { Location: '/corporate/index.html' })
        res.end()
        return
      }
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
})
