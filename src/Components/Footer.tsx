import { FaFacebook, FaWhatsapp, FaArrowUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import type { MainData } from '../types'

interface FooterProps {
  data: MainData
}

const ICON_MAP: Record<string, React.ReactNode> = {
  facebook: <FaFacebook size={18} />,
  whatsapp: <FaWhatsapp size={18} />,
}

const Footer = ({ data }: FooterProps) => (
  <footer className="bg-slate-900 py-12 border-t border-slate-800">
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        {data.social.map(network => (
          <a
            key={network.name}
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-400 transition-colors duration-200"
          >
            {ICON_MAP[network.name] ?? null}
          </a>
        ))}
      </div>

      <p className="text-slate-600 text-sm">
        Encoded with ♥ by the{' '}
        <span className="text-slate-400 font-medium">Corestack Solutions</span> team
      </p>

      <Link
        to="/privacy-policy"
        className="text-slate-600 text-xs hover:text-blue-400 transition-colors duration-200"
      >
        Privacy Policy — QR Residential Access Control
      </Link>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-slate-600 hover:text-blue-400 transition-colors duration-200 mt-2"
        aria-label="Back to top"
      >
        <FaArrowUp size={16} />
      </button>
    </div>
  </footer>
)

export default Footer
