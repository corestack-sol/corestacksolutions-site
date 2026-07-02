# Corestack Solutions — API Specification v1.0

**Stack:** Node.js + Express + TypeScript · MySQL · JWT  
**Deploy:** Railway (backend) + PlanetScale o Railway MySQL (base de datos)  
**Frontend:** `corestacksolutions.com.mx` (Cloudflare Workers, ya existente)

---

## Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Base de datos — Esquema SQL](#3-base-de-datos--esquema-sql)
4. [Autenticación](#4-autenticación)
5. [Endpoints — Clientes](#5-endpoints--clientes)
6. [Endpoints — Proyectos y Módulos](#6-endpoints--proyectos-y-módulos)
7. [Endpoints — Documentos Corporativos](#7-endpoints--documentos-corporativos)
8. [Variables de entorno](#8-variables-de-entorno)
9. [Integración Frontend](#9-integración-frontend)
10. [Despliegue en Railway](#10-despliegue-en-railway)

---

## 1. Visión general

La API reemplaza el almacenamiento en `localStorage` del dashboard de proyectos y añade persistencia real a los documentos corporativos (propuestas, contratos, reportes, etc.).

```
corestacksolutions.com.mx          api.corestacksolutions.com.mx
┌─────────────────────────────┐    ┌────────────────────────────┐
│  React SPA (Cloudflare)     │───▶│  Express API (Railway)     │
│  /dashboard  → proyectos    │    │  /api/projects             │
│  /propuesta  → documentos   │    │  /api/documents            │
│  /corporate  → documentos   │    │  /api/clients              │
└─────────────────────────────┘    └──────────┬─────────────────┘
                                              │
                                   ┌──────────▼─────────────────┐
                                   │  MySQL (Railway / Planet)  │
                                   │  projects, modules,        │
                                   │  updates, documents,       │
                                   │  clients, users            │
                                   └────────────────────────────┘
```

**URL base del API:** `https://api.corestacksolutions.com.mx`  
**Prefijo de todas las rutas:** `/api`  
**Formato:** JSON  
**Autenticación:** Bearer JWT en header `Authorization`

---

## 2. Stack tecnológico

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── projects.ts
│   │   └── documents.ts
│   ├── middleware/
│   │   ├── auth.ts          ← verificar JWT
│   │   └── validate.ts      ← validar body con Zod
│   ├── db/
│   │   ├── connection.ts    ← pool MySQL2
│   │   └── schema.sql
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```

**Dependencias principales:**
```json
{
  "express": "^4.19",
  "mysql2": "^3.9",
  "jsonwebtoken": "^9.0",
  "bcryptjs": "^2.4",
  "zod": "^3.22",
  "cors": "^2.8",
  "dotenv": "^16.4"
}
```

---

## 3. Base de datos — Esquema SQL

```sql
-- ─── USUARIOS (acceso al dashboard) ──────────────────────────────
CREATE TABLE users (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,            -- bcrypt hash
  role        ENUM('admin','viewer') DEFAULT 'admin',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── CLIENTES ────────────────────────────────────────────────────
CREATE TABLE clients (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  name        VARCHAR(255) NOT NULL,
  company     VARCHAR(255),
  email       VARCHAR(255),
  phone       VARCHAR(50),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PROYECTOS ───────────────────────────────────────────────────
CREATE TABLE projects (
  id          VARCHAR(36)   PRIMARY KEY DEFAULT (UUID()),
  client_id   VARCHAR(36)   REFERENCES clients(id) ON DELETE SET NULL,
  name        VARCHAR(255)  NOT NULL,
  client_name VARCHAR(255)  NOT NULL,           -- nombre de cliente (texto libre)
  description TEXT,
  status      ENUM('active','paused','completed','cancelled') DEFAULT 'active',
  start_date  DATE,
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── MÓDULOS ────────────────────────────────────────────────────
CREATE TABLE project_modules (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  project_id  VARCHAR(36)  NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  status      ENUM('planned','active','completed','blocked') DEFAULT 'planned',
  progress    TINYINT UNSIGNED DEFAULT 0,       -- 0-100
  in_scope    JSON,                             -- string[]
  out_of_scope JSON,                            -- string[]
  sort_order  SMALLINT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── ACTUALIZACIONES SEMANALES ───────────────────────────────────
CREATE TABLE weekly_updates (
  id              VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  module_id       VARCHAR(36)  NOT NULL REFERENCES project_modules(id) ON DELETE CASCADE,
  week            VARCHAR(50),                  -- "Semana 3"
  date            DATE,
  notes           TEXT NOT NULL,
  completed_items JSON,                         -- string[]
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── DOCUMENTOS CORPORATIVOS ─────────────────────────────────────
CREATE TABLE documents (
  id          VARCHAR(36)  PRIMARY KEY DEFAULT (UUID()),
  type        ENUM(
                'proposal',
                'contract',
                'technical_report',
                'executive_report',
                'brand_guidelines',
                'logo_pack',
                'email_signature'
              ) NOT NULL,
  project_id  VARCHAR(36)  REFERENCES projects(id) ON DELETE SET NULL,
  client_id   VARCHAR(36)  REFERENCES clients(id)  ON DELETE SET NULL,
  status      ENUM('draft','sent','signed','archived') DEFAULT 'draft',
  fields      JSON         NOT NULL,            -- campos específicos por tipo de doc
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Estructura de `documents.fields` por tipo

```jsonc
// type: "proposal"
{
  "clientName":    "Empresa XYZ",
  "projectTitle":  "App de Gestión de Accesos",
  "version":       "1.0",
  "validityDays":  30,
  "budget":        127800,
  "paymentTerms":  [30, 40, 30],
  "scope":         ["App móvil iOS/Android", "Backend API REST"],
  "outOfScope":    ["Hardware físico", "Integración ERP"],
  "timeline":      14,
  "representative": "Carlos Mendez"
}

// type: "contract"
{
  "clientName":    "Empresa XYZ",
  "clientRfc":     "EMP123456XYZ",
  "startDate":     "2026-07-01",
  "endDate":       "2026-10-15",
  "totalAmount":   127800,
  "paymentPlan":   [{ "pct": 30, "label": "Anticipo" }, ...],
  "clauses":       []
}

// type: "technical_report" | "executive_report"
{
  "clientName":    "Empresa XYZ",
  "projectName":   "App de Accesos",
  "reportPeriod":  "Junio 2026",
  "progressPct":   65,
  "summary":       "...",
  "completedItems": [],
  "pendingItems":  [],
  "nextSteps":     []
}
```

---

## 4. Autenticación

### `POST /api/auth/login`

**Body:**
```json
{ "email": "corestack.fe@gmail.com", "password": "••••••••" }
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": { "id": "...", "email": "...", "role": "admin" }
}
```

**Response 401:**
```json
{ "error": "Credenciales inválidas" }
```

### `GET /api/auth/me`
Header: `Authorization: Bearer <token>`

**Response 200:**
```json
{ "id": "...", "email": "...", "role": "admin" }
```

### Middleware de autenticación

Todas las rutas `/api/projects`, `/api/documents`, `/api/clients` requieren el header `Authorization: Bearer <token>`. Si no es válido → `401 Unauthorized`.

---

## 5. Endpoints — Clientes

| Método | Ruta              | Descripción              |
|--------|-------------------|--------------------------|
| GET    | /api/clients      | Listar todos los clientes |
| POST   | /api/clients      | Crear cliente            |
| GET    | /api/clients/:id  | Obtener cliente          |
| PUT    | /api/clients/:id  | Actualizar cliente       |
| DELETE | /api/clients/:id  | Eliminar cliente         |

### `POST /api/clients`

**Body:**
```json
{
  "name": "Roberto Hernández",
  "company": "Conjunto Residencial Las Palmas",
  "email": "rhernandez@empresa.com",
  "phone": "+52 993 123 4567"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "Roberto Hernández",
  "company": "Conjunto Residencial Las Palmas",
  "email": "rhernandez@empresa.com",
  "phone": "+52 993 123 4567",
  "created_at": "2026-06-15T00:00:00.000Z"
}
```

---

## 6. Endpoints — Proyectos y Módulos

### Proyectos

| Método | Ruta               | Descripción           |
|--------|--------------------|-----------------------|
| GET    | /api/projects      | Listar proyectos      |
| POST   | /api/projects      | Crear proyecto        |
| GET    | /api/projects/:id  | Obtener proyecto completo (incluye módulos y updates) |
| PUT    | /api/projects/:id  | Actualizar proyecto   |
| DELETE | /api/projects/:id  | Eliminar proyecto     |

### `GET /api/projects`

**Response 200:**
```json
[
  {
    "id": "uuid",
    "name": "App Residential Access",
    "client_name": "Las Palmas",
    "status": "active",
    "start_date": "2026-06-01",
    "due_date": "2026-09-30",
    "progress": 45,       // ← calculado: promedio de módulos
    "modules_count": 4,
    "created_at": "..."
  }
]
```

### `GET /api/projects/:id`

**Response 200:**
```json
{
  "id": "uuid",
  "name": "App Residential Access",
  "client_name": "Las Palmas",
  "description": "...",
  "status": "active",
  "start_date": "2026-06-01",
  "due_date": "2026-09-30",
  "created_at": "...",
  "modules": [
    {
      "id": "uuid",
      "name": "Autenticación y roles",
      "description": "...",
      "status": "completed",
      "progress": 100,
      "in_scope": ["Login", "Registro", "Reset password"],
      "out_of_scope": ["SSO con Google"],
      "sort_order": 0,
      "updates": [
        {
          "id": "uuid",
          "week": "Semana 3",
          "date": "2026-06-16",
          "notes": "Se completó el módulo de autenticación.",
          "completed_items": ["Login JWT", "Refresh token"],
          "created_at": "..."
        }
      ]
    }
  ]
}
```

### `POST /api/projects`

**Body:**
```json
{
  "name": "App de Gestión",
  "client_name": "Empresa ABC",
  "description": "...",
  "status": "active",
  "start_date": "2026-07-01",
  "due_date": "2026-10-15"
}
```

### Módulos

| Método | Ruta                                  | Descripción             |
|--------|---------------------------------------|-------------------------|
| POST   | /api/projects/:id/modules             | Agregar módulo          |
| PUT    | /api/projects/:id/modules/:moduleId   | Editar módulo           |
| DELETE | /api/projects/:id/modules/:moduleId   | Eliminar módulo         |

### `POST /api/projects/:id/modules`

**Body:**
```json
{
  "name": "Panel administrativo",
  "description": "Dashboard web para gestión",
  "status": "planned",
  "progress": 0,
  "in_scope": ["Gestión de usuarios", "Reportes", "Configuración"],
  "out_of_scope": ["Integración BI", "Exportación a SAP"]
}
```

### Actualizaciones semanales

| Método | Ruta                                              | Descripción       |
|--------|---------------------------------------------------|-------------------|
| POST   | /api/projects/:id/modules/:moduleId/updates       | Agregar update    |
| DELETE | /api/projects/:id/modules/:moduleId/updates/:uid  | Eliminar update   |

### `POST /api/projects/:id/modules/:moduleId/updates`

**Body:**
```json
{
  "week": "Semana 4",
  "date": "2026-06-23",
  "notes": "Esta semana se completó el diseño de pantallas y se inició desarrollo.",
  "completed_items": ["Wireframes aprobados", "Componentes base creados"]
}
```

---

## 7. Endpoints — Documentos Corporativos

| Método | Ruta                       | Descripción                             |
|--------|----------------------------|-----------------------------------------|
| GET    | /api/documents             | Listar documentos                       |
| POST   | /api/documents             | Crear documento                         |
| GET    | /api/documents/:id         | Obtener documento con todos sus campos  |
| PUT    | /api/documents/:id         | Actualizar campos del documento         |
| DELETE | /api/documents/:id         | Eliminar documento                      |
| GET    | /api/documents/:id/preview | Retorna HTML renderizado del documento  |

### `POST /api/documents`

**Body:**
```json
{
  "type": "proposal",
  "project_id": "uuid-opcional",
  "client_id": "uuid-opcional",
  "status": "draft",
  "fields": {
    "clientName": "Empresa XYZ",
    "projectTitle": "App de Gestión de Accesos",
    "version": "1.0",
    "validityDays": 30,
    "budget": 127800,
    "scope": ["App móvil iOS/Android", "Backend API REST"],
    "outOfScope": ["Hardware físico"],
    "timeline": 14,
    "representative": "Carlos Mendez"
  }
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "type": "proposal",
  "status": "draft",
  "fields": { ... },
  "created_at": "2026-06-15T00:00:00.000Z"
}
```

### `GET /api/documents/:id/preview`

Retorna `text/html` con el documento renderizado con los `fields` del registro. Útil para mostrar en un `<iframe>` o para imprimir PDF desde el frontend.

### Filtros en GET /api/documents

```
GET /api/documents?type=proposal&status=draft
GET /api/documents?project_id=uuid
GET /api/documents?client_id=uuid
```

---

## 8. Variables de entorno

Archivo `.env` en la raíz del backend:

```env
# Servidor
PORT=3001
NODE_ENV=production

# Base de datos
DB_HOST=containers-us-west-xx.railway.app
DB_PORT=3306
DB_NAME=corestack_db
DB_USER=root
DB_PASSWORD=tu_password_segura

# JWT
JWT_SECRET=corestack_jwt_secret_muy_largo_y_aleatorio_2026
JWT_EXPIRES_IN=7d

# CORS — origen permitido
CORS_ORIGIN=https://corestacksolutions.com.mx
```

---

## 9. Integración Frontend

### Cambios en el dashboard (`useDashboard.ts`)

Reemplazar las funciones actuales (localStorage) por llamadas HTTP:

```typescript
// src/hooks/useDashboard.ts — versión con API

const API = 'https://api.corestacksolutions.com.mx/api'

function getToken() {
  return localStorage.getItem('cs_token') ?? ''
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

export function useDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/projects`, { headers: headers() })
      .then(r => r.json())
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  async function createProject(data: Omit<Project, 'id' | 'modules' | 'createdAt'>) {
    const res = await fetch(`${API}/projects`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    })
    const p = await res.json()
    setProjects(prev => [p, ...prev])
    return p
  }

  // ... resto de métodos igual (PUT/DELETE)
}
```

### Cambios en documentos corporativos

El botón "Guardar propuesta" en `/propuesta` llamará:

```typescript
async function saveDocument(fields: Record<string, unknown>) {
  const res = await fetch(`${API}/documents`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ type: 'proposal', status: 'draft', fields }),
  })
  return res.json()
}
```

### Login (nuevo componente)

Agregar ruta `/login` que llame a `POST /api/auth/login` y guarde el token:

```typescript
localStorage.setItem('cs_token', token)
```

---

## 10. Despliegue en Railway

### Pasos

1. Crear proyecto en [railway.app](https://railway.app)
2. Agregar servicio **MySQL** → copiar las variables de conexión a `.env`
3. Conectar repositorio del backend → Railway detecta Node.js automáticamente
4. Configurar variables de entorno en Railway Dashboard
5. Agregar dominio personalizado: `api.corestacksolutions.com.mx`
6. En Cloudflare, agregar registro CNAME apuntando al dominio de Railway

### `package.json` del backend (scripts clave)

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev src/index.ts",
    "db:migrate": "mysql2 -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < src/db/schema.sql"
  }
}
```

### Healthcheck

```
GET /health → 200 { "status": "ok", "db": "connected" }
```

Railway usa este endpoint para verificar que el servicio está activo.

---

## Resumen de rutas

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/modules
PUT    /api/projects/:id/modules/:moduleId
DELETE /api/projects/:id/modules/:moduleId
POST   /api/projects/:id/modules/:moduleId/updates
DELETE /api/projects/:id/modules/:moduleId/updates/:updateId

GET    /api/documents
POST   /api/documents
GET    /api/documents/:id
PUT    /api/documents/:id
DELETE /api/documents/:id
GET    /api/documents/:id/preview
```

---

*Corestack Solutions · API Spec v1.0 · Junio 2026*
