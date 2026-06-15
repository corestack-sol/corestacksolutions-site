import '../styles/corporate.css'

/* ================================================================
   CORESTACK SOLUTIONS — GENERADOR DE PROPUESTAS CORPORATIVAS
   Ruta: /propuesta
   ================================================================ */

const LOGO = '/images/corestack.png'
const ISO_PATTERN = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="104">
  <polygon points="60,2 118,32 60,62 2,32" fill="none" stroke="#00AEEF" stroke-width="0.6"/>
  <polygon points="2,32 60,62 60,102 2,72"  fill="none" stroke="#00AEEF" stroke-width="0.6"/>
  <polygon points="118,32 60,62 60,102 118,72" fill="none" stroke="#00AEEF" stroke-width="0.6"/>
</svg>`)}`

// ─── Subcomponentes reutilizables ───────────────────────────────

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="cs-page-header">
      <img src={LOGO} alt="Corestack Solutions" className="cs-page-header-logo" />
      <div className="cs-page-header-info">
        <div className="cs-page-header-title">{title}</div>
        <div className="cs-page-header-sub">{sub}</div>
      </div>
    </div>
  )
}

function PageFooter({ page, total, doc }: { page: number; total: number; doc: string }) {
  return (
    <div className="cs-page-footer">
      <span>Corestack Solutions © {new Date().getFullYear()}</span>
      <span className="cs-page-footer-center">CORESTACK SOLUTIONS</span>
      <span>
        {doc} · Pág. {page}/{total}
      </span>
    </div>
  )
}

// ─── PÁGINA 1: PORTADA ─────────────────────────────────────────

function CoverPage() {
  const today = new Date().toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="cs-page cs-cover">
      {/* Fondo isométrico */}
      <div className="cs-cover-bg">
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("${ISO_PATTERN}")`,
          backgroundSize: '90px 78px',
          opacity: 0.07,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to top, #00AEEF18, transparent)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
          background: 'linear-gradient(to left, rgba(0,174,239,0.06), transparent)',
        }} />
      </div>

      {/* Cuerpo */}
      <div className="cs-cover-body">
        <img src={LOGO} alt="Corestack Solutions" className="cs-cover-logo" />

        <div className="cs-cover-eyebrow">Propuesta Técnica y Comercial</div>

        <h1 className="cs-cover-title">
          Soluciones <em>Digitales</em><br />
          Empresariales
        </h1>

        <p className="cs-cover-subtitle">
          Propuesta de desarrollo de software · Versión 1.0
        </p>

        <div className="cs-cover-rule" />

        <div className="cs-cover-meta">
          <div className="cs-cover-meta-item">
            <span className="cs-cover-meta-label">Preparado para</span>
            <span className="cs-cover-meta-value">[Nombre del Cliente]</span>
          </div>
          <div className="cs-cover-meta-item">
            <span className="cs-cover-meta-label">Fecha de emisión</span>
            <span className="cs-cover-meta-value">{today}</span>
          </div>
          <div className="cs-cover-meta-item">
            <span className="cs-cover-meta-label">Validez</span>
            <span className="cs-cover-meta-value">30 días calendario</span>
          </div>
        </div>
      </div>

      <div className="cs-cover-footer">
        <span className="cs-cover-footer-brand">Corestack Solutions · corestacksolutions.com.mx</span>
        <span className="cs-cover-footer-contact">corestack.sol@gmail.com · +52 993 442 1347</span>
      </div>
    </div>
  )
}

// ─── PÁGINA 2: TABLA DE CONTENIDO ─────────────────────────────

function TOCPage() {
  const items = [
    { num: '01', label: 'Resumen Ejecutivo', pg: '3', sub: false },
    { num: '02', label: 'Alcance del Proyecto', pg: '4', sub: false },
    { num: '  2.1', label: 'Dentro del Alcance', pg: '4', sub: true },
    { num: '  2.2', label: 'Fuera del Alcance', pg: '4', sub: true },
    { num: '03', label: 'Arquitectura Técnica', pg: '5', sub: false },
    { num: '04', label: 'Plan de Trabajo y Cronograma', pg: '6', sub: false },
    { num: '05', label: 'Inversión y Presupuesto', pg: '7', sub: false },
    { num: '  5.1', label: 'Desglose por Módulo', pg: '7', sub: true },
    { num: '  5.2', label: 'Condiciones de Pago', pg: '7', sub: true },
    { num: '06', label: 'Casos de Éxito', pg: '8', sub: false },
    { num: '07', label: 'Análisis de Riesgos', pg: '9', sub: false },
    { num: '08', label: 'Conclusiones y Próximos Pasos', pg: '10', sub: false },
  ]

  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Tabla de Contenido" sub="Propuesta Técnica y Comercial" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Índice General</h1>
        <p>
          Este documento presenta la propuesta integral de Corestack Solutions para el desarrollo
          de su solución tecnológica, incluyendo alcance, arquitectura, cronograma e inversión.
        </p>

        <div className="cs-toc" style={{ marginTop: '1.5rem' }}>
          {items.map((it, i) => (
            <div key={i} className={`cs-toc-item${it.sub ? ' sub' : ''}`}>
              <span className="cs-toc-num">{it.num}</span>
              <span className="cs-toc-label">{it.label}</span>
              <span className="cs-toc-dots" />
              <span className="cs-toc-pg">{it.pg}</span>
            </div>
          ))}
        </div>

        {/* Bloque destacado de propuesta */}
        <div className="cs-highlight" style={{ marginTop: '2.5rem' }}>
          <h3>Acerca de esta propuesta</h3>
          <p>
            Corestack Solutions es una empresa de desarrollo de software fundamentada en la{' '}
            <strong>responsabilidad, el rigor técnico y el compromiso genuino</strong> con cada
            cliente. Diseñamos y construimos aplicaciones móviles y plataformas web con altos
            estándares de calidad, cumplimiento de plazos y atención personalizada.
          </p>
        </div>
      </div>

      <PageFooter page={2} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 3: RESUMEN EJECUTIVO ───────────────────────────────

function ExecutiveSummaryPage() {
  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Resumen Ejecutivo" sub="Visión general del proyecto" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Resumen Ejecutivo</h1>

        {/* KPIs */}
        <div className="cs-kpi-grid cols-4" style={{ margin: '1.25rem 0' }}>
          <div className="cs-kpi">
            <div className="cs-kpi-val">
              <span className="unit">+</span>2
            </div>
            <div className="cs-kpi-label">Apps desplegadas en producción</div>
          </div>
          <div className="cs-kpi orange">
            <div className="cs-kpi-val">
              100<span className="unit orange">%</span>
            </div>
            <div className="cs-kpi-label">Entrega en tiempo y forma</div>
          </div>
          <div className="cs-kpi">
            <div className="cs-kpi-val">
              24<span className="unit">h</span>
            </div>
            <div className="cs-kpi-label">Tiempo de respuesta máximo</div>
          </div>
          <div className="cs-kpi">
            <div className="cs-kpi-val">
              <span className="unit">+</span>5
            </div>
            <div className="cs-kpi-label">Años de experiencia técnica</div>
          </div>
        </div>

        {/* Columnas */}
        <div className="cs-exec">
          <div className="cs-exec-col left">
            <h3>Propuesta de Valor</h3>
            <p>
              Corestack Solutions propone el diseño, desarrollo e implementación de una solución
              tecnológica a medida que resuelva los desafíos operativos de su organización con
              resultados medibles y sostenibles a largo plazo.
            </p>
            <p>
              Nuestra metodología combina análisis de requerimientos riguroso, desarrollo ágil
              por sprints y comunicación transparente en cada etapa del proyecto.
            </p>

            <ul className="cs-exec-list">
              <li><span className="icon">✦</span>Desarrollo React Native / React 19 + TypeScript</li>
              <li><span className="icon">✦</span>Backend Node.js + REST API + MySQL</li>
              <li><span className="icon">✦</span>Integración Firebase, AWS, Google Cloud</li>
              <li><span className="icon">✦</span>Despliegue en App Store y Google Play</li>
              <li><span className="icon">✦</span>Soporte post-lanzamiento incluido</li>
            </ul>
          </div>

          <div className="cs-exec-col right">
            <h3>Objetivo del Proyecto</h3>
            <p>
              [Describir aquí el objetivo principal del proyecto para el cliente. Ejemplo: diseño
              y desarrollo de una aplicación móvil de gestión de accesos para conjuntos
              residenciales con integración de hardware para barreras automatizadas.]
            </p>
            <p>
              <strong>Resultado esperado:</strong> plataforma funcional, escalable y lista para
              producción, entregada en el plazo acordado con capacitación incluida.
            </p>

            <div className="cs-callout info" style={{ marginTop: '0.75rem' }}>
              <span className="cs-callout-icon">ℹ</span>
              <div className="cs-callout-body">
                <div className="cs-callout-title">Nota de alcance</div>
                <p>Esta propuesta cubre el desarrollo desde cero. Cualquier requerimiento
                  adicional será cotizado por separado mediante adenda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageFooter page={3} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 4: ALCANCE ──────────────────────────────────────────

function ScopePage() {
  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Alcance del Proyecto" sub="Definición de entregables y límites" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Alcance del Proyecto</h1>

        <h2>2.1 Módulos y Entregables</h2>

        <div className="cs-cards cols-3">
          {[
            { icon: '📱', title: 'App Móvil (iOS & Android)', body: 'React Native con TypeScript. Navegación multi-rol, autenticación, módulos funcionales acordados.', tag: 'Entregable principal' },
            { icon: '🔌', title: 'Backend y API REST', body: 'Node.js + Express + MySQL. Endpoints documentados, lógica de negocio, seguridad y control de acceso.', tag: 'Entregable principal' },
            { icon: '☁️', title: 'Despliegue en la Nube', body: 'Configuración de Firebase, Railway o AWS. CI/CD básico, dominios y certificados SSL incluidos.', tag: 'Infraestructura' },
            { icon: '🔔', title: 'Notificaciones Push', body: 'Firebase Cloud Messaging + Notifee para iOS y Android. Configuración de tópicos y segmentación.', tag: 'Módulo' },
            { icon: '📊', title: 'Panel Administrativo', body: 'Dashboard web (React 19) para gestión de usuarios, reportes y configuración del sistema.', tag: 'Módulo' },
            { icon: '🧪', title: 'QA y Pruebas', body: 'Testing funcional en dispositivos reales. Corrección de bugs previos al lanzamiento. 2 ciclos de revisión.', tag: 'Calidad' },
          ].map((c) => (
            <div key={c.title} className="cs-card">
              <span className="cs-card-icon">{c.icon}</span>
              <div className="cs-card-title">{c.title}</div>
              <div className="cs-card-body">{c.body}</div>
              <span className="cs-card-tag">{c.tag}</span>
            </div>
          ))}
        </div>

        <h2>2.2 Dentro y Fuera del Alcance</h2>

        <div className="cs-scope">
          <div className="cs-scope-box in">
            <div className="cs-scope-title">✅ Incluido</div>
            <ul>
              <li>Diseño UX/UI de pantallas acordadas</li>
              <li>Configuración inicial de Firebase (Auth + FCM)</li>
              <li>Publicación en Google Play y App Store</li>
              <li>Documentación técnica básica de API</li>
              <li>1 mes de soporte post-lanzamiento</li>
              <li>Capacitación remota a usuarios clave</li>
            </ul>
          </div>
          <div className="cs-scope-box out">
            <div className="cs-scope-title">❌ No incluido</div>
            <ul>
              <li>Integraciones con ERP o CRM de terceros</li>
              <li>Hardware físico (sensores, barreras, lectores)</li>
              <li>Mantenimiento mensual continuo</li>
              <li>Migración de datos de sistemas legados</li>
              <li>Soporte fuera del horario laboral (sin contrato)</li>
              <li>Cambios de alcance después de aprobación</li>
            </ul>
          </div>
        </div>
      </div>

      <PageFooter page={4} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 5: ARQUITECTURA ────────────────────────────────────

function ArchitecturePage() {
  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Arquitectura Técnica" sub="Stack y diseño del sistema" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Arquitectura Técnica</h1>
        <p>
          La solución propuesta sigue una arquitectura cliente-servidor desacoplada con comunicación
          asíncrona en tiempo real donde se requiera. Cada capa es independientemente escalable.
        </p>

        {/* Stack visual */}
        <div className="cs-arch">
          {[
            {
              title: 'CAPA DE PRESENTACIÓN', color: 'default',
              chips: ['React Native (iOS/Android)', 'React 19 (Web)', 'TypeScript Strict', 'Tailwind CSS'],
            },
            {
              title: 'CAPA DE ESTADO Y DATOS', color: 'default',
              chips: ['Zustand', 'TanStack Query', 'AsyncStorage', 'SecureStore'],
            },
            {
              title: 'CAPA DE COMUNICACIÓN', color: 'default',
              chips: ['Axios + Interceptors', 'Socket.IO', 'REST API', 'Firebase SDK'],
            },
            {
              title: 'CAPA DE BACKEND', color: 'orange',
              chips: ['Node.js + Express', 'MySQL', 'JWT Auth', 'Nodemailer'],
            },
            {
              title: 'INFRAESTRUCTURA EN LA NUBE', color: 'orange',
              chips: ['Firebase (Auth + FCM)', 'Railway / AWS', 'Cloudflare Workers', 'SSL/TLS'],
            },
          ].map((layer, i, arr) => (
            <div key={layer.title}>
              <div className="cs-arch-layer">
                <div className="cs-arch-layer-title">{layer.title}</div>
                <div className="cs-arch-components">
                  {layer.chips.map(c => (
                    <span key={c} className={`cs-arch-chip${layer.color === 'orange' ? ' orange' : ''}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              {i < arr.length - 1 && <div className="cs-arch-arrow">↕</div>}
            </div>
          ))}
        </div>

        <div className="cs-callout success" style={{ marginTop: '1rem' }}>
          <span className="cs-callout-icon">✔</span>
          <div className="cs-callout-body">
            <div className="cs-callout-title">Escalabilidad garantizada</div>
            <p>
              La arquitectura desacoplada permite agregar nuevos módulos o escalar verticalmente
              componentes individuales sin refactorizar el sistema completo. El backend está
              diseñado para soportar múltiples clientes (multitenancy) desde la primera versión.
            </p>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: '1rem' }}>
          <div>
            <h3>Seguridad</h3>
            <ul>
              <li>Autenticación JWT con refresh tokens</li>
              <li>HTTPS obligatorio en todos los endpoints</li>
              <li>Validación server-side con express-validator</li>
              <li>Rate limiting y protección contra fuerza bruta</li>
            </ul>
          </div>
          <div>
            <h3>Integraciones Cloud</h3>
            <ul>
              <li>Firebase Auth: gestión de identidades</li>
              <li>FCM: notificaciones push multiplataforma</li>
              <li>AWS S3 / Google Cloud Storage: archivos</li>
              <li>Railway: despliegue continuo del backend</li>
            </ul>
          </div>
        </div>
      </div>

      <PageFooter page={5} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 6: CRONOGRAMA ──────────────────────────────────────

function TimelinePage() {
  const items = [
    {
      date: 'Semana 1–2', title: 'Análisis y Diseño', color: 'done',
      badge: { label: 'Completado', type: 'green' },
      body: 'Levantamiento de requerimientos, wireframes UX, definición de API y arquitectura aprobada por el cliente.',
    },
    {
      date: 'Semana 3–6', title: 'Sprint 1: Módulo Core', color: '',
      badge: { label: 'Activo', type: 'blue' },
      body: 'Autenticación, roles de usuario, navegación base, conexión con API. Demo funcional al cierre del sprint.',
    },
    {
      date: 'Semana 7–10', title: 'Sprint 2: Módulos Principales', color: '',
      badge: { label: 'Planificado', type: 'orange' },
      body: 'Desarrollo de los módulos de negocio acordados. Integración con Firebase FCM. Pruebas unitarias.',
    },
    {
      date: 'Semana 11–12', title: 'Sprint 3: Integraciones y Cloud', color: '',
      badge: { label: 'Planificado', type: 'orange' },
      body: 'Despliegue en la nube, configuración de dominios, pruebas de carga y seguridad.',
    },
    {
      date: 'Semana 13', title: 'QA y Revisión Final', color: 'orange',
      badge: { label: 'QA', type: 'orange' },
      body: '2 ciclos de revisión con el cliente. Corrección de bugs. Preparación para publicación.',
    },
    {
      date: 'Semana 14', title: 'Lanzamiento y Entrega', color: 'orange',
      badge: { label: 'Entrega', type: 'blue' },
      body: 'Publicación en App Store y Google Play. Capacitación de usuarios. Inicio de periodo de soporte.',
    },
  ]

  const badgeClass: Record<string, string> = {
    green: 'cs-badge cs-badge-green',
    blue: 'cs-badge cs-badge-blue',
    orange: 'cs-badge cs-badge-orange',
    red: 'cs-badge cs-badge-red',
  }

  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Cronograma" sub="Plan de trabajo · 14 semanas" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Plan de Trabajo y Cronograma</h1>

        <div className="cs-kpi-grid cols-3" style={{ margin: '1rem 0 1.5rem' }}>
          <div className="cs-kpi">
            <div className="cs-kpi-val">14<span className="unit">sem</span></div>
            <div className="cs-kpi-label">Duración total del proyecto</div>
          </div>
          <div className="cs-kpi orange">
            <div className="cs-kpi-val">3</div>
            <div className="cs-kpi-label">Sprints de desarrollo</div>
          </div>
          <div className="cs-kpi">
            <div className="cs-kpi-val">2</div>
            <div className="cs-kpi-label">Ciclos de revisión QA</div>
          </div>
        </div>

        <div className="cs-timeline">
          {items.map((it) => (
            <div className="cs-tl-item" key={it.title}>
              <div className={`cs-tl-dot${it.color ? ` ${it.color}` : ''}`} />
              <div className="cs-tl-date">{it.date}</div>
              <div className="cs-tl-title">
                {it.title}
                <span className={badgeClass[it.badge.type]}>{it.badge.label}</span>
              </div>
              <div className="cs-tl-body">{it.body}</div>
            </div>
          ))}
        </div>

        <div className="cs-callout warning">
          <span className="cs-callout-icon">⚠</span>
          <div className="cs-callout-body">
            <div className="cs-callout-title">Nota sobre el cronograma</div>
            <p>
              Los plazos son estimaciones basadas en los requerimientos actuales. Cambios de
              alcance aprobados por ambas partes podrán ajustar las fechas de entrega de forma
              proporcional mediante adenda firmada.
            </p>
          </div>
        </div>
      </div>

      <PageFooter page={6} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 7: PRESUPUESTO ──────────────────────────────────────

function BudgetPage() {
  const items = [
    { module: 'Diseño UX/UI (pantallas acordadas)', est: '40 hrs', unit: '$350', total: '$14,000' },
    { module: 'Sprint 1 — Autenticación y estructura base', est: '80 hrs', unit: '$350', total: '$28,000' },
    { module: 'Sprint 2 — Módulos principales', est: '120 hrs', unit: '$350', total: '$42,000' },
    { module: 'Sprint 3 — Integraciones y cloud', est: '60 hrs', unit: '$350', total: '$21,000' },
    { module: 'QA y pruebas funcionales', est: '30 hrs', unit: '$300', total: '$9,000' },
    { module: 'Despliegue y publicación (stores)', est: '16 hrs', unit: '$300', total: '$4,800' },
    { module: 'Documentación técnica', est: '10 hrs', unit: '$300', total: '$3,000' },
    { module: 'Soporte post-lanzamiento (1 mes)', est: '20 hrs', unit: '$300', total: '$6,000' },
  ]

  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Presupuesto" sub="Inversión y condiciones de pago" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Inversión y Presupuesto</h1>

        <h2>5.1 Desglose por Módulo</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '8pt', marginBottom: '0.75rem' }}>
          Precios expresados en MXN (pesos mexicanos). Incluye IVA 16%.
        </p>

        <table className="cs-table">
          <thead>
            <tr>
              <th>Módulo / Entregable</th>
              <th style={{ textAlign: 'center' }}>Estimación</th>
              <th className="right">Tarifa/hr</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.module}>
                <td>{it.module}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{it.est}</td>
                <td className="right">{it.unit}</td>
                <td className="right" style={{ fontWeight: 600, color: 'var(--deep-navy)' }}>{it.total}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={2} style={{ color: 'white' }}>TOTAL DEL PROYECTO (estimado)</td>
              <td className="right" style={{ color: 'var(--core-blue)', fontFamily: 'Montserrat' }}></td>
              <td className="right" style={{ color: 'var(--tech-orange)', fontFamily: 'Montserrat', fontSize: '11pt' }}>
                $127,800
              </td>
            </tr>
          </tbody>
        </table>

        <h2>5.2 Condiciones de Pago</h2>

        <div className="cs-kpi-grid cols-3" style={{ margin: '0.75rem 0 1rem' }}>
          <div className="cs-kpi">
            <div className="cs-kpi-val">30<span className="unit">%</span></div>
            <div className="cs-kpi-label">Anticipo para inicio</div>
            <div className="cs-kpi-sub">$38,340 MXN</div>
          </div>
          <div className="cs-kpi orange">
            <div className="cs-kpi-val">40<span className="unit orange">%</span></div>
            <div className="cs-kpi-label">Al aprobar Sprint 2</div>
            <div className="cs-kpi-sub">$51,120 MXN</div>
          </div>
          <div className="cs-kpi">
            <div className="cs-kpi-val">30<span className="unit">%</span></div>
            <div className="cs-kpi-label">Entrega final</div>
            <div className="cs-kpi-sub">$38,340 MXN</div>
          </div>
        </div>

        <div className="cs-callout info">
          <span className="cs-callout-icon">ℹ</span>
          <div className="cs-callout-body">
            <div className="cs-callout-title">Validez y forma de pago</div>
            <p>
              Presupuesto válido por 30 días calendario. Transferencia bancaria o depósito directo.
              Los precios pueden ajustarse si los requerimientos cambian después de la firma del contrato.
            </p>
          </div>
        </div>
      </div>

      <PageFooter page={7} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 8: CASOS DE ÉXITO ──────────────────────────────────

function CaseStudiesPage() {
  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Casos de Éxito" sub="Proyectos destacados en producción" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Casos de Éxito</h1>
        <p>
          Los siguientes proyectos representan nuestra capacidad de llevar ideas complejas a
          soluciones robustas y funcionales en producción real.
        </p>

        <div className="cs-case">
          <div className="cs-case-header">
            <div>
              <div className="cs-case-name">Residential Access · Control de Acceso</div>
              <div className="cs-case-industry">Residencial · iOS & Android</div>
            </div>
            <span className="cs-badge cs-badge-green">En producción</span>
          </div>
          <div className="cs-case-body">
            <div>
              <p>
                Aplicación móvil para gestión de accesos en conjuntos residenciales. Permite a
                residentes y guardias controlar entradas y salidas con múltiples métodos de
                autenticación y registros en tiempo real.
              </p>
              <ul>
                <li>Roles diferenciados: residente, guardia, administrador</li>
                <li>Historial de accesos con filtros y exportación</li>
                <li>Control de barreras automatizadas vía Socket.IO</li>
                <li>Push notifications con Firebase + Notifee</li>
              </ul>
            </div>
            <div className="cs-case-metrics">
              <div className="cs-metric">
                <div className="cs-metric-val">iOS</div>
                <div className="cs-metric-label">App Store<br/>publicada</div>
              </div>
              <div className="cs-metric">
                <div className="cs-metric-val">✓</div>
                <div className="cs-metric-label">Tiempo real<br/>Socket.IO</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cs-case">
          <div className="cs-case-header">
            <div>
              <div className="cs-case-name">QR Residential Access Control · Versión Avanzada</div>
              <div className="cs-case-industry">Residencial · iOS & Android · Multiplataforma</div>
            </div>
            <span className="cs-badge cs-badge-blue">Producción</span>
          </div>
          <div className="cs-case-body">
            <div>
              <p>
                Evolución del sistema de control de acceso con mayor personalización, escaneo de
                códigos QR mediante Vision Camera, sistema de alertas clasificadas con chat
                integrado, y reservación de espacios comunes.
              </p>
              <ul>
                <li>Escáner QR nativo con Vision Camera</li>
                <li>Alertas clasificadas con chat en tiempo real</li>
                <li>Reservación de áreas comunes y manejo de pagos</li>
                <li>Notificaciones push segmentadas por rol</li>
              </ul>
            </div>
            <div className="cs-case-metrics">
              <div className="cs-metric">
                <div className="cs-metric-val">QR</div>
                <div className="cs-metric-label">Acceso sin<br/>contacto</div>
              </div>
              <div className="cs-metric">
                <div className="cs-metric-val">💬</div>
                <div className="cs-metric-label">Chat en<br/>alertas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cs-callout success">
          <span className="cs-callout-icon">★</span>
          <div className="cs-callout-body">
            <div className="cs-callout-title">Reconocimiento de clientes</div>
            <p>
              "QR Residential Access Control transformó por completo la gestión de accesos en
              nuestra comunidad. El soporte de Corestack durante toda la implementación fue
              excepcional." — Roberto Hernández, Administrador de Conjunto Residencial.
            </p>
          </div>
        </div>
      </div>

      <PageFooter page={8} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 9: RIESGOS ──────────────────────────────────────────

function RisksPage() {
  const risks = [
    {
      risk: 'Cambios de alcance durante desarrollo',
      impact: 'Retraso en entrega',
      prob: 'Medium',
      mit: 'Proceso formal de change request con impacto en tiempo y costo definido.',
    },
    {
      risk: 'Demora en revisiones y aprobaciones del cliente',
      impact: 'Extensión del cronograma',
      prob: 'Medium',
      mit: 'SLA de revisión: 3 días hábiles por ciclo. Aprobación tácita si no hay respuesta.',
    },
    {
      risk: 'Cambios en políticas de App Store / Google Play',
      impact: 'Retraso en publicación',
      prob: 'Low',
      mit: 'Seguimiento activo de lineamientos. Anticipar revisiones con 2 semanas de margen.',
    },
    {
      risk: 'Integración con hardware de terceros no documentado',
      impact: 'Bloqueante técnico',
      prob: 'High',
      mit: 'Solicitar documentación y acceso a hardware en semana 1. Definir protocolo mínimo viable.',
    },
    {
      risk: 'Falta de disponibilidad del cliente para pruebas',
      impact: 'Ciclos QA incompletos',
      prob: 'Medium',
      mit: 'Acordar agenda de pruebas en kickoff. Corestack provee entorno de staging accesible.',
    },
  ]

  const probClass: Record<string, string> = {
    High: 'cs-risk-badge high',
    Medium: 'cs-risk-badge medium',
    Low: 'cs-risk-badge low',
  }

  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Análisis de Riesgos" sub="Identificación y mitigación" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Análisis de Riesgos</h1>
        <p>
          La gestión proactiva de riesgos es parte de nuestra metodología. Identificamos los
          escenarios con mayor probabilidad de impacto y definimos estrategias de mitigación
          antes de que se materialicen.
        </p>

        <table className="cs-table" style={{ marginTop: '1.25rem' }}>
          <thead>
            <tr>
              <th>Riesgo</th>
              <th>Impacto</th>
              <th>Probabilidad</th>
              <th>Mitigación</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(r => (
              <tr key={r.risk}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '5cm' }}>{r.risk}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '8pt' }}>{r.impact}</td>
                <td>
                  <span className={probClass[r.prob]}>{r.prob}</span>
                </td>
                <td style={{ fontSize: '8pt', color: 'var(--text-secondary)' }}>{r.mit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Matriz de Riesgo</h2>

        <div className="cs-kpi-grid cols-3" style={{ margin: '0.75rem 0' }}>
          <div className="cs-kpi">
            <div className="cs-kpi-val" style={{ color: 'var(--success)', fontFamily: 'Poppins', fontSize: '12pt', fontWeight: 700 }}>
              2 riesgos
            </div>
            <div className="cs-kpi-label">Riesgo bajo · Monitoreados</div>
          </div>
          <div className="cs-kpi orange">
            <div className="cs-kpi-val" style={{ fontFamily: 'Poppins', fontSize: '12pt', fontWeight: 700 }}>
              3 riesgos
            </div>
            <div className="cs-kpi-label">Riesgo medio · Plan activo</div>
          </div>
          <div className="cs-kpi">
            <div className="cs-kpi-val" style={{ color: 'var(--danger)', fontFamily: 'Poppins', fontSize: '12pt', fontWeight: 700 }}>
              1 riesgo
            </div>
            <div className="cs-kpi-label">Riesgo alto · Acción inmediata</div>
          </div>
        </div>

        <div className="cs-callout warning" style={{ marginTop: '0.5rem' }}>
          <span className="cs-callout-icon">⚠</span>
          <div className="cs-callout-body">
            <div className="cs-callout-title">Riesgo crítico identificado</div>
            <p>
              La integración con hardware de terceros (barreras, sensores) es el riesgo de mayor
              impacto potencial. Se recomienda iniciar la validación técnica en la primera semana
              del proyecto para garantizar la viabilidad de la integración antes del Sprint 2.
            </p>
          </div>
        </div>
      </div>

      <PageFooter page={9} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── PÁGINA 10: CONCLUSIONES Y FIRMAS ─────────────────────────

function ConclusionsPage() {
  return (
    <div className="cs-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Conclusiones" sub="Próximos pasos y firma de aceptación" />

      <div className="cs-content" style={{ flex: 1 }}>
        <h1>Conclusiones y Próximos Pasos</h1>

        <div className="cs-highlight">
          <h3>Nuestra propuesta de valor</h3>
          <p>
            Corestack Solutions se compromete a entregar una solución tecnológica{' '}
            <strong>robusta, escalable y diseñada para crecer</strong> junto con su organización.
            Cada línea de código que escribimos está respaldada por responsabilidad técnica,
            comunicación transparente y foco absoluto en resultados medibles.
          </p>
        </div>

        <h2>Próximos Pasos</h2>

        <div className="cs-timeline" style={{ marginTop: '0.5rem' }}>
          <div className="cs-tl-item">
            <div className="cs-tl-dot" />
            <div className="cs-tl-date">Paso 1</div>
            <div className="cs-tl-title">Revisión y aprobación de la propuesta</div>
            <div className="cs-tl-body">
              El cliente revisa los términos, alcance y presupuesto. Se resuelven dudas
              en reunión de 45 minutos vía videoconferencia.
            </div>
          </div>
          <div className="cs-tl-item">
            <div className="cs-tl-dot" />
            <div className="cs-tl-date">Paso 2</div>
            <div className="cs-tl-title">Firma del contrato y anticipo</div>
            <div className="cs-tl-body">
              Se firma el contrato de servicios y se realiza el pago del anticipo del 30%.
              Corestack inicia la configuración de entornos.
            </div>
          </div>
          <div className="cs-tl-item">
            <div className="cs-tl-dot orange" />
            <div className="cs-tl-date">Paso 3</div>
            <div className="cs-tl-title">Kickoff meeting</div>
            <div className="cs-tl-body">
              Reunión de inicio de proyecto. Se presentan los equipos, se confirman
              requerimientos detallados y se acuerda el canal de comunicación oficial.
            </div>
          </div>
          <div className="cs-tl-item">
            <div className="cs-tl-dot orange" />
            <div className="cs-tl-date">Paso 4</div>
            <div className="cs-tl-title">Inicio del desarrollo · Sprint 1</div>
            <div className="cs-tl-body">
              Corestack Solutions inicia el desarrollo formal con entregables visibles
              al cierre de cada sprint. Reportes de avance semanales incluidos.
            </div>
          </div>
        </div>

        <div className="cs-divider" style={{ margin: '2rem 0 1.5rem' }}>
          <span>Firma de aceptación</span>
        </div>

        <div className="cs-sigs">
          <div className="cs-sig">
            <div className="cs-sig-space" />
            <div className="cs-sig-name">[Nombre del representante]</div>
            <div className="cs-sig-role">Representante Legal / Directivo</div>
            <div className="cs-sig-company">[Empresa del Cliente]</div>
          </div>
          <div className="cs-sig">
            <div className="cs-sig-space" />
            <div className="cs-sig-name">Corestack Solutions</div>
            <div className="cs-sig-role">Director de Proyecto</div>
            <div className="cs-sig-company">Corestack Solutions · corestacksolutions.com.mx</div>
          </div>
        </div>

        <p style={{
          marginTop: '2rem', fontSize: '7.5pt', color: 'var(--text-muted)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Esta propuesta tiene carácter confidencial y está destinada exclusivamente al destinatario indicado.
          La información contenida no debe reproducirse ni distribuirse sin autorización expresa de Corestack Solutions.
        </p>
      </div>

      <PageFooter page={10} total={10} doc="Propuesta" />
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────

const ProposalTemplate = () => {
  const handlePrint = () => window.print()

  return (
    <div className="cs-doc">
      {/* Toolbar (oculta en impresión) */}
      <div className="cs-toolbar">
        <div className="cs-toolbar-brand">
          <img src={LOGO} alt="Corestack Solutions" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
          <span>Corestack</span> · Generador de Propuestas
        </div>
        <div className="cs-toolbar-actions">
          <a href="/" style={{ textDecoration: 'none' }}>
            <button className="cs-btn cs-btn-ghost">← Volver al sitio</button>
          </a>
          <button className="cs-btn cs-btn-primary" onClick={handlePrint}>
            Imprimir / Exportar PDF
          </button>
        </div>
      </div>

      {/* Páginas */}
      <div className="cs-pages">
        <CoverPage />
        <TOCPage />
        <ExecutiveSummaryPage />
        <ScopePage />
        <ArchitecturePage />
        <TimelinePage />
        <BudgetPage />
        <CaseStudiesPage />
        <RisksPage />
        <ConclusionsPage />
      </div>
    </div>
  )
}

export default ProposalTemplate
