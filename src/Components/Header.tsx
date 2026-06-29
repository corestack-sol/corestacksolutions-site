import { motion } from 'framer-motion'
import { FaFacebook, FaWhatsapp, FaChevronDown } from 'react-icons/fa'
import Logo from './Logo'
import Navbar from './Navbar'
import type { MainData, Language } from '../types'

interface HeaderProps {
  data: MainData
  language: Language
  toggleLanguage: () => void
}

const ICON_MAP: Record<string, React.ReactNode> = {
  facebook: <FaFacebook size={22} />,
  whatsapp: <FaWhatsapp size={22} />,
}

const SECTORS: Record<string, string[]> = {
  EN: ['Restaurants', 'Agriculture', 'Industry', 'Residential', 'Education', 'Healthcare', 'Logistics', 'Retail', 'Construction'],
  ES: ['Restaurantes', 'Agricultura', 'Industria', 'Residenciales', 'Educación', 'Salud', 'Logística', 'Comercio', 'Construcción'],
}

const Header = ({ data, language, toggleLanguage }: HeaderProps) => (
  <section id="home" className="relative min-h-screen bg-slate-900 flex flex-col">
    <Navbar language={language} toggleLanguage={toggleLanguage} />

    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 max-w-3xl"
      >
        <Logo />

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
          {data.name}
        </h1>

        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          <span className="text-blue-400 font-semibold">{data.occupation}</span>
          {' — '}
          {data.description}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {SECTORS[language].map(sector => (
            <span
              key={sector}
              className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium tracking-wide"
            >
              {sector}
            </span>
          ))}
          <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs font-medium tracking-wide">
            {language === 'EN' ? 'more...' : 'más...'}
          </span>
        </div>

        <div className="flex items-center gap-5">
          {data.social.map(network => (
            <a
              key={network.name}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
            >
              {ICON_MAP[network.name] ?? null}
            </a>
          ))}
        </div>

        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/30"
        >
          {language === 'EN' ? 'Learn More' : 'Saber más'}
        </motion.button>
      </motion.div>
    </div>

    <button
      onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-200 animate-bounce"
      aria-label="Scroll down"
    >
      <FaChevronDown size={24} />
    </button>
  </section>
)

export default Header
