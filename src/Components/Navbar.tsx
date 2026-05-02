import { useState, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useActiveSection } from '../hooks/useActiveSection'
import type { Language } from '../types'

interface NavbarProps {
  language: Language
  toggleLanguage: () => void
}

const SECTION_IDS = ['home', 'about', 'resume', 'portfolio', 'testimonials', 'contact'] as const
type SectionId = (typeof SECTION_IDS)[number]

const LABELS: Record<Language, Record<SectionId, string>> = {
  EN: {
    home: 'Home',
    about: 'About',
    resume: 'Experience',
    portfolio: 'Portfolio',
    testimonials: 'Testimonials',
    contact: 'Contact',
  },
  ES: {
    home: 'Inicio',
    about: 'Nosotros',
    resume: 'Experiencia',
    portfolio: 'Portafolio',
    testimonials: 'Testimonios',
    contact: 'Contacto',
  },
}

const Navbar = ({ language, toggleLanguage }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={toggleLanguage}
          className="text-xs font-bold text-blue-400 border border-blue-400 px-3 py-1 rounded-full hover:bg-blue-400 hover:text-white transition-all duration-200"
        >
          {language === 'EN' ? 'ES' : 'EN'}
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {SECTION_IDS.map(id => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  active === id
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {LABELS[language][id]}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-sm px-6 pb-6 border-t border-slate-800">
          <ul className="flex flex-col gap-5 pt-4">
            {SECTION_IDS.map(id => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`text-sm font-medium ${
                    active === id ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {LABELS[language][id]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
