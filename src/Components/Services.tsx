import { motion } from 'framer-motion'
import {
  FaMobileAlt,
  FaGlobe,
  FaLock,
  FaCogs,
  FaPlug,
  FaLightbulb,
  FaCheckCircle,
} from 'react-icons/fa'
import type { Language } from '../types'

interface ServicesProps {
  language: Language
}

const CONTENT = {
  EN: {
    label: 'What We Solve',
    title: 'Business results, not just technology',
    subtitle:
      'Before writing a single line of code, we diagnose the real problem. Every solution is designed around a measurable outcome.',
    services: [
      {
        icon: <FaMobileAlt size={24} />,
        title: 'Mobile Operations',
        description:
          'Your team operates from anywhere — logs, approvals, alerts and reports from their phone. No spreadsheets, no calls to confirm data.',
      },
      {
        icon: <FaGlobe size={24} />,
        title: 'Operational Control Panel',
        description:
          'Complete visibility of your operation from a browser. Real-time data, automatic reports, and user management — no software to install on every device.',
      },
      {
        icon: <FaLock size={24} />,
        title: 'Access Control & Traceability',
        description:
          'Eliminate the risk of operating without verifiable records. Every access is logged automatically — with timestamp, date, and profile — without depending on anyone to record it.',
      },
      {
        icon: <FaCogs size={24} />,
        title: 'Manual Work Elimination',
        description:
          'We identify which processes consume the most time and convert them into automatic flows. Fewer errors, fewer operational hours, and records that generate themselves.',
      },
      {
        icon: <FaPlug size={24} />,
        title: 'Integration with Existing Systems',
        description:
          'We connect the new solution to what you already use. No replacing your entire operation: we build on what works and remove what creates friction.',
      },
      {
        icon: <FaLightbulb size={24} />,
        title: 'Free Operational Diagnosis',
        description:
          'Before any proposal, we analyze how your business operates today. We identify where the losses are and what solution generates the highest return. No cost, no commitment.',
      },
    ],
    whyTitle: 'What Sets Us Apart',
    reasons: [
      {
        stat: 'Local',
        label: 'Based in Tabasco',
        detail: 'On-site support when needed — no national response times, no third parties.',
      },
      {
        stat: 'Direct',
        label: 'No Intermediaries',
        detail: 'The team that builds your solution is the one that supports it. No call centers, no tickets.',
      },
      {
        stat: 'Custom',
        label: 'No Templates',
        detail: 'Every solution starts from a real diagnosis. What we build today grows with you — no starting over.',
      },
      {
        stat: '100%',
        label: 'Post-Delivery Support',
        detail: 'The project ends when the client operates with full autonomy, not when we deliver.',
      },
    ],
  },
  ES: {
    label: 'Lo Que Resolvemos',
    title: 'Resultados de negocio, no solo tecnología',
    subtitle:
      'Antes de escribir una línea de código, diagnosticamos el problema real. Cada solución se diseña en torno a un resultado medible.',
    services: [
      {
        icon: <FaMobileAlt size={24} />,
        title: 'Operación Móvil',
        description:
          'Tu equipo opera desde cualquier lugar — registros, aprobaciones, alertas y reportes desde el celular. Sin hojas de cálculo, sin llamadas para confirmar datos.',
      },
      {
        icon: <FaGlobe size={24} />,
        title: 'Panel de Control Operativo',
        description:
          'Visibilidad completa de tu operación desde un navegador. Datos en tiempo real, reportes automáticos y gestión de usuarios — sin instalar nada en cada equipo.',
      },
      {
        icon: <FaLock size={24} />,
        title: 'Control y Trazabilidad de Accesos',
        description:
          'Elimina el riesgo de operar sin registros verificables. Cada acceso queda documentado automáticamente — con hora, fecha y perfil — sin depender de nadie que lo registre.',
      },
      {
        icon: <FaCogs size={24} />,
        title: 'Eliminación de Trabajo Manual',
        description:
          'Identificamos qué procesos consumen más tiempo y los convertimos en flujos automáticos. Menos errores, menos horas operativas y registros que se generan solos.',
      },
      {
        icon: <FaPlug size={24} />,
        title: 'Integración con lo que ya tienes',
        description:
          'Conectamos la nueva solución con los sistemas que ya usas. Sin reemplazar toda la operación: sumamos sobre lo que funciona y eliminamos lo que genera fricción.',
      },
      {
        icon: <FaLightbulb size={24} />,
        title: 'Diagnóstico Operativo sin Costo',
        description:
          'Antes de cualquier propuesta, analizamos cómo opera tu negocio hoy. Identificamos dónde están las pérdidas y qué solución genera el mayor retorno. Sin costo, sin compromiso.',
      },
    ],
    whyTitle: 'Lo que nos diferencia',
    reasons: [
      {
        stat: 'Local',
        label: 'Presencia en Tabasco',
        detail: 'Soporte en sitio cuando se necesita — sin tiempos de respuesta nacionales ni terceros.',
      },
      {
        stat: 'Directo',
        label: 'Sin Intermediarios',
        detail: 'El equipo que desarrolla tu solución es quien responde. Sin call centers, sin tickets.',
      },
      {
        stat: 'A Medida',
        label: 'Sin Plantillas',
        detail: 'Cada solución parte del diagnóstico real. Lo que se construye crece contigo sin empezar de cero.',
      },
      {
        stat: '100%',
        label: 'Acompañamiento Post-Entrega',
        detail: 'El proyecto termina cuando el cliente opera con autonomía, no cuando entregamos.',
      },
    ],
  },
}

const Services = ({ language }: ServicesProps) => {
  const t = CONTENT[language]

  return (
    <section id="services" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
            {t.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            {t.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
        </motion.div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {t.services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {s.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            {t.whyTitle}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.reasons.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <FaCheckCircle className="text-blue-400 mb-1" size={20} />
                <span className="text-3xl font-bold text-blue-400">{r.stat}</span>
                <span className="text-white font-semibold text-sm">{r.label}</span>
                <span className="text-slate-400 text-xs leading-relaxed">{r.detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
