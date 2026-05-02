import { motion } from "framer-motion";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import type { Language } from "../types";

interface PortfolioProps {
  language: Language;
}

const CONTENT = {
  EN: {
    label: "Our Work",
    title: "Featured Projects",
    subtitle: "Real solutions built for real people.",
    appName: "QR Residential Access Control",
    tag: "Mobile App · Access Control",
    description:
      "Smart access control system for residential communities. Automate vehicle barrier management, generate QR passes for guests and residents, and monitor every entry and exit in real time.",
    features: [
      "QR code-based access for residents & visitors",
      "Automated vehicle barrier control",
      "Real-time entry & exit monitoring",
      "Instant push notifications",
    ],
    available: "Available on",
    playStore: "Google Play",
    appStore: "App Store",
  },
  ES: {
    label: "Nuestro Trabajo",
    title: "Proyectos Destacados",
    subtitle: "Soluciones reales construidas para personas reales.",
    appName: "QR Residential Access Control",
    tag: "App Móvil · Control de Acceso",
    description:
      "Sistema inteligente de control de accesos para residenciales y condominios. Automatiza el manejo de barreras vehiculares, genera pases QR para visitantes y residentes, y monitorea cada entrada y salida en tiempo real.",
    features: [
      "Accesos por código QR para residentes y visitantes",
      "Control automatizado de barreras vehiculares",
      "Monitoreo de entradas y salidas en tiempo real",
      "Notificaciones push instantáneas",
    ],
    available: "Disponible en",
    playStore: "Google Play",
    appStore: "App Store",
  },
};

const Portfolio = ({ language }: PortfolioProps) => {
  const t = CONTENT[language];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
            {t.label}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {t.title}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-64 md:w-72">
              {/* Phone frame */}
              <div className="relative bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl ring-1 ring-slate-700">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-10" />
                {/* Screen */}
                <div className="rounded-[2rem] overflow-hidden bg-black aspect-[9/19.5]">
                  <video
                    src="/videos/QRRAC.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-blue-500 rounded-full scale-75 translate-y-8" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {t.tag}
              </span>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {t.appName}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t.description}</p>
            </div>

            <ul className="flex flex-col gap-2">
              {t.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 10 8"
                    >
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {t.available}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://apps.apple.com/mx/app/qr-residential-access-control/id6760604908?l=en-GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                >
                  <FaApple size={18} />
                  {t.appStore}
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.corestack.residenceapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                >
                  <FaGooglePlay size={16} />
                  {t.playStore}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
