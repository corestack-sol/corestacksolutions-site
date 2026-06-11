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
    label: 'What We Do',
    title: 'Solutions That Drive Business Results',
    subtitle:
      'We build technology that works — on time, on budget, and designed to scale with your business.',
    services: [
      {
        icon: <FaMobileAlt size={24} />,
        title: 'Mobile App Development',
        description:
          'Native and cross-platform apps for iOS and Android, published on App Store and Google Play. From concept to launch.',
      },
      {
        icon: <FaGlobe size={24} />,
        title: 'Web Platforms & Portals',
        description:
          'Modern web applications and business portals built with the latest technologies — fast, secure, and responsive.',
      },
      {
        icon: <FaLock size={24} />,
        title: 'Access Control Systems',
        description:
          'Smart access management solutions for residential and commercial properties — QR codes, barriers, real-time monitoring.',
      },
      {
        icon: <FaCogs size={24} />,
        title: 'Process Automation',
        description:
          'Digitize and automate your manual workflows to reduce errors, cut costs, and free up your team for what matters.',
      },
      {
        icon: <FaPlug size={24} />,
        title: 'API Integrations',
        description:
          'Connect your existing tools and platforms. We integrate payment gateways, CRMs, IoT devices, and third-party APIs.',
      },
      {
        icon: <FaLightbulb size={24} />,
        title: 'Tech Consulting',
        description:
          'Not sure where to start? We assess your needs and build a clear technology roadmap aligned with your business goals.',
      },
    ],
    whyTitle: 'Why Companies Choose Corestack',
    reasons: [
      {
        stat: '2+',
        label: 'Apps on App Store & Google Play',
        detail: 'Published and actively maintained mobile applications.',
      },
      {
        stat: '100%',
        label: 'Results-Focused',
        detail: 'Every project is scoped around measurable business outcomes.',
      },
      {
        stat: 'Full',
        label: 'End-to-End Development',
        detail: 'From design and development to deployment and support.',
      },
      {
        stat: 'Fast',
        label: 'Agile Delivery',
        detail: 'Short cycles, frequent releases, and constant communication.',
      },
    ],
  },
  ES: {
    label: 'Lo Que Hacemos',
    title: 'Soluciones que impulsan resultados para tu empresa',
    subtitle:
      'Construimos tecnología que funciona — a tiempo, dentro del presupuesto y diseñada para crecer con tu negocio.',
    services: [
      {
        icon: <FaMobileAlt size={24} />,
        title: 'Desarrollo de Apps Móviles',
        description:
          'Apps nativas y multiplataforma para iOS y Android, publicadas en App Store y Google Play. Del concepto al lanzamiento.',
      },
      {
        icon: <FaGlobe size={24} />,
        title: 'Plataformas Web Empresariales',
        description:
          'Aplicaciones web y portales de gestión modernos, construidos con tecnologías de vanguardia — rápidos, seguros y responsivos.',
      },
      {
        icon: <FaLock size={24} />,
        title: 'Sistemas de Control de Acceso',
        description:
          'Soluciones inteligentes para residenciales y negocios — códigos QR, barreras vehiculares y monitoreo en tiempo real.',
      },
      {
        icon: <FaCogs size={24} />,
        title: 'Automatización de Procesos',
        description:
          'Digitaliza y automatiza tus procesos manuales para reducir errores, bajar costos y liberar a tu equipo para lo que importa.',
      },
      {
        icon: <FaPlug size={24} />,
        title: 'Integraciones y APIs',
        description:
          'Conectamos tus herramientas existentes: pasarelas de pago, CRMs, dispositivos IoT y cualquier API de terceros.',
      },
      {
        icon: <FaLightbulb size={24} />,
        title: 'Consultoría Tecnológica',
        description:
          '¿No sabes por dónde empezar? Analizamos tus necesidades y construimos una hoja de ruta tecnológica clara alineada a tus metas.',
      },
    ],
    whyTitle: 'Por qué las empresas eligen Corestack',
    reasons: [
      {
        stat: '2+',
        label: 'Apps en App Store y Google Play',
        detail: 'Aplicaciones móviles publicadas y en mantenimiento activo.',
      },
      {
        stat: '100%',
        label: 'Enfoque en resultados',
        detail: 'Cada proyecto se define en torno a objetivos de negocio medibles.',
      },
      {
        stat: 'Full',
        label: 'Desarrollo integral',
        detail: 'Desde diseño y desarrollo hasta despliegue y soporte.',
      },
      {
        stat: 'Ágil',
        label: 'Entregas rápidas',
        detail: 'Ciclos cortos, entregas frecuentes y comunicación constante.',
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
