import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import corestackLogo from '../assets/corestack.png'

interface DocCard {
  icon: string
  name: string
  desc: string
  tag: string
  href: string
}

const TEMPLATES: DocCard[] = [
  {
    icon: '📋',
    name: 'Propuesta Comercial',
    desc: 'Propuesta técnica y económica completa. Portada, TOC, alcance, arquitectura, cronograma, presupuesto y firma.',
    tag: 'CS-PROP',
    href: '/corporate/proposal.html',
  },
  {
    icon: '⚙️',
    name: 'Reporte Técnico',
    desc: 'Estado del sistema, métricas de rendimiento, análisis de endpoints, seguridad y recomendaciones técnicas.',
    tag: 'CS-TECH',
    href: '/corporate/technical-report.html',
  },
  {
    icon: '⚖️',
    name: 'Contrato de Servicios',
    desc: 'Contrato de prestación de servicios con cláusulas de alcance, propiedad intelectual, pagos y confidencialidad.',
    tag: 'CS-CONT',
    href: '/corporate/contract.html',
  },
  {
    icon: '📊',
    name: 'Reporte Ejecutivo',
    desc: 'Dashboard de avance, KPIs, estado de sprints, control presupuestario y registro de riesgos del proyecto.',
    tag: 'CS-EXEC',
    href: '/corporate/executive-report.html',
  },
  {
    icon: '💰',
    name: 'Cotización Genérica',
    desc: 'Plantilla de cotización comercial editable. Conceptos, precios, condiciones y firma de aceptación.',
    tag: 'CS-COT',
    href: '/corporate/cotizacion.html',
  },
]

const BRAND: DocCard[] = [
  {
    icon: '🎨',
    name: 'Brand Guidelines',
    desc: 'Manual de identidad: paleta de colores, tipografía, logo, patrones gráficos, voz y tono de marca.',
    tag: 'Identidad',
    href: '/corporate/brand-guidelines.html',
  },
  {
    icon: '🏷️',
    name: 'Logo Pack',
    desc: 'Variaciones del logotipo, usos correctos e incorrectos, zona de protección, tamaños e iconos de app.',
    tag: 'Logo',
    href: '/corporate/logo-pack.html',
  },
  {
    icon: '✉️',
    name: 'Email Signature Kit',
    desc: '3 variaciones de firma corporativa. Edita tu nombre y cargo, copia con un clic e instala en Gmail, Outlook o Apple Mail.',
    tag: 'Email',
    href: '/corporate/email-signature.html',
  },
]

const PROPOSALS: DocCard[] = [
  {
    icon: '🏘️',
    name: 'Propuesta Villa Universitaria',
    desc: 'Propuesta completa para el proyecto Villa Universitaria. Portal inmobiliario con Residential Access integrado.',
    tag: 'Propuesta',
    href: '/propuestas/propuesta-villa-universitaria.html',
  },
  {
    icon: '🔲',
    name: 'Cotización Residential Access',
    desc: 'Cotización comercial para el sistema de acceso residencial con QR. Folio CS-RA-001. 4 planes disponibles.',
    tag: 'CS-RA-001',
    href: '/propuestas/cotizacion-residential-access.html',
  },
]

export default function CorporateIndex() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={corestackLogo} alt="Corestack" className="h-7" />
            <span className="text-slate-600 text-sm">|</span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Documentos Corporativos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5"
            >
              <FaArrowLeft size={10} />
              Home
            </button>
            <span className="text-xs text-slate-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors border border-slate-700 hover:border-red-500/50 rounded-lg px-3 py-1.5"
            >
              <FaSignOutAlt size={11} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            Sistema de Documentos Corporativos
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Templates <span className="text-blue-400">Corporativos</span>
          </h1>
          <p className="text-slate-500 text-base">
            Selecciona el documento que deseas abrir o imprimir como PDF
          </p>
        </div>

        {/* Templates section */}
        <Section title="Plantillas" subtitle="Documentos reutilizables para clientes y proyectos">
          <DocGrid cards={TEMPLATES} />
        </Section>

        <Section title="Identidad de Marca" subtitle="Recursos de diseño y guías de uso de la marca">
          <DocGrid cards={BRAND} />
        </Section>

        <Section title="Propuestas y Cotizaciones" subtitle="Documentos específicos por cliente o producto">
          <DocGrid cards={PROPOSALS} />
        </Section>

        <p className="text-center text-xs mt-8" style={{ color: '#F97316' }}>
          Cada documento puede imprimirse o exportarse como PDF desde el botón en la barra superior.<br />
          Edita directamente el HTML para personalizar datos del cliente, folio, fechas y montos.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-700">
        Corestack Solutions © {new Date().getFullYear()} ·{' '}
        <a href="/" className="hover:text-blue-400 transition-colors">corestacksolutions.com.mx</a>
      </footer>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">{title}</h2>
        <span className="text-xs text-slate-600">{subtitle}</span>
      </div>
      {children}
    </section>
  )
}

function DocGrid({ cards }: { cards: DocCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map(card => (
        <a
          key={card.href}
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col gap-2 transition-all duration-200 hover:bg-slate-800/70 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/40"
        >
          <div className="flex items-start justify-between">
            <span className="text-2xl">{card.icon}</span>
            <FaExternalLinkAlt size={10} className="text-slate-700 group-hover:text-blue-500 transition-colors mt-1" />
          </div>
          <div className="font-semibold text-sm text-white">{card.name}</div>
          <div className="text-xs text-slate-500 leading-relaxed flex-1">{card.desc}</div>
          <span className="inline-block bg-blue-950/60 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit mt-1">
            {card.tag}
          </span>
        </a>
      ))}
    </div>
  )
}
