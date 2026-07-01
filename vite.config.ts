import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

// docs/formatos is the source of truth (organized under docs/).
// Vite only serves files under public/, so mirror it there before dev/build runs —
// keeps public/docs/formatos from drifting out of sync by hand.
const syncDocsToPublic: Plugin = {
  name: 'sync-docs-to-public',
  config() {
    copyDir(path.resolve(__dirname, 'docs/formatos'), path.resolve(__dirname, 'public/docs/formatos'))
  },
}

const serveDocFormatos: Plugin = {
  name: 'serve-doc-formatos',
  configureServer(server) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.middlewares.use((req: any, res: any, next) => {
      const url = (req.url ?? '').split('?')[0]
      // /docs/formatos/doc-name → redirect → /docs/formatos/doc-name.html (direct doc access in dev)
      if (/^\/docs\/formatos\/[\w-]+$/.test(url)) {
        res.writeHead(302, { Location: url + '.html' })
        res.end()
        return
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [syncDocsToPublic, react(), serveDocFormatos],
  server: {
    proxy: {
      '/api': {
        target: 'https://corestacksolutions-api-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
