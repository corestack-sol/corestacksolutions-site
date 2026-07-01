# Corestack Solutions — Sitio Web

Sitio corporativo de Corestack Solutions (software y automatización, Villahermosa, Tabasco), construido con React + Vite y desplegado en Cloudflare Workers.

## Stack

- **React 19** + **React Router** — SPA
- **Vite** — build y dev server
- **Tailwind CSS**
- **TypeScript**
- **Cloudflare Workers** (`worker.ts` + `wrangler.json`) — hosting, proxy de `/api` y protección de `/corporate` por cookie de sesión
- API backend externa (Railway) consumida vía `/api/*`

## Scripts

```
npm run dev       # servidor de desarrollo (vite)
npm run build     # type-check (tsc) + build de producción → dist/
npm run preview   # sirve el build de producción localmente
npm run deploy    # build + despliegue a Cloudflare Workers (wrangler)
```

## Estructura

```
src/
  Components/       componentes de página (Header, Resume, Portfolio, Contact, etc.)
  Components/Dashboard/  panel de proyectos (/dashboard)
  contexts/          AuthContext (sesión JWT)
  api/                llamadas al backend (/api/auth/*)
  hooks/              hooks compartidos (datos de currículum, sección activa, etc.)
  styles/             CSS de la sección corporativa
  types/

public/
  corporate/          plantillas HTML de documentos corporativos (propuesta, contrato,
                       reportes, brand kit); servidas bajo /corporate y protegidas por
                       cookie de sesión (ver worker.ts)
  propuestas/          propuestas comerciales para clientes específicos, servidas bajo
                       /propuestas (acceso directo por link, sin login)
  images/, videos/     assets estáticos
  resumeES.json, resumeEN.json  contenido del currículum/portafolio (ES/EN)

propuestas/            documentos fuente de propuestas (brief, PDF) — no se sirven
                       directamente; su versión final vive en public/propuestas/
docs/                  documentación interna (spec de API, playbook de ventas)
```

## Rutas principales

- `/` — sitio principal (resume/portfolio)
- `/corporate` — panel de documentos corporativos (requiere login)
- `/dashboard`, `/dashboard/:id` — panel de proyectos
- `/propuesta` — plantilla de propuesta
- `/privacy-policy`, `/delete-account` — páginas de política para la app de acceso residencial QR
