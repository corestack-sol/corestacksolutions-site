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
    href: '/docs/formatos/proposal.html',
  },
  {
    icon: '⚙️',
    name: 'Reporte Técnico',
    desc: 'Estado del sistema, métricas de rendimiento, análisis de endpoints, seguridad y recomendaciones técnicas.',
    tag: 'CS-TECH',
    href: '/docs/formatos/technical-report.html',
  },
  {
    icon: '⚖️',
    name: 'Contrato de Servicios',
    desc: 'Contrato de prestación de servicios con cláusulas de alcance, propiedad intelectual, pagos y confidencialidad.',
    tag: 'CS-CONT',
    href: '/docs/formatos/contract.html',
  },
  {
    icon: '📊',
    name: 'Reporte Ejecutivo',
    desc: 'Dashboard de avance, KPIs, estado de sprints, control presupuestario y registro de riesgos del proyecto.',
    tag: 'CS-EXEC',
    href: '/docs/formatos/executive-report.html',
  },
  {
    icon: '💰',
    name: 'Cotización Genérica',
    desc: 'Plantilla de cotización comercial editable. Conceptos, precios, condiciones y firma de aceptación.',
    tag: 'CS-COT',
    href: '/docs/formatos/cotizacion.html',
  },
]

const BRAND: DocCard[] = [
  {
    icon: '🎨',
    name: 'Brand Guidelines',
    desc: 'Manual de identidad: paleta de colores, tipografía, logo, patrones gráficos, voz y tono de marca.',
    tag: 'Identidad',
    href: '/docs/formatos/brand-guidelines.html',
  },
  {
    icon: '🏷️',
    name: 'Logo Pack',
    desc: 'Variaciones del logotipo, usos correctos e incorrectos, zona de protección, tamaños e iconos de app.',
    tag: 'Logo',
    href: '/docs/formatos/logo-pack.html',
  },
  {
    icon: '✉️',
    name: 'Email Signature Kit',
    desc: '3 variaciones de firma corporativa. Edita tu nombre y cargo, copia con un clic e instala en Gmail, Outlook o Apple Mail.',
    tag: 'Email',
    href: '/docs/formatos/email-signature.html',
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
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(card => (
        <a
          key={card.href}
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl overflow-hidden border border-slate-700/60 shadow-md hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-1 transition-all duration-200 flex flex-col"
        >
          {/* Dark section — icon + title */}
          <div className="relative bg-[#0B1629] flex flex-col items-center justify-center gap-3 px-6 py-8">
            <span className="text-4xl drop-shadow-md">{card.icon}</span>
            <span className="text-white font-bold text-sm text-center leading-snug tracking-wide">
              {card.name}
            </span>
            <FaExternalLinkAlt
              size={9}
              className="absolute top-3 right-3 text-slate-600 group-hover:text-blue-400 transition-colors"
            />
          </div>

          {/* Light section — description + tag, flex-1 fills remaining height */}
          <div className="bg-white px-5 py-4 flex flex-col gap-3 flex-1">
            <p className="text-slate-500 text-xs leading-relaxed flex-1">{card.desc}</p>
            <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit">
              {card.tag}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
