import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGooglePlay,
  FaApple,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import type { Language } from "../types";

interface PortfolioProps {
  language: Language;
}

type AppEntry = {
  id: string;
  appName: string;
  tag: string;
  description: string;
  features: string[];
  appStoreUrl: string;
  playStoreUrl: string;
  video?: string;
  showLogo?: boolean;
  liveUrl?: string;
};

const APPS: Record<Language, AppEntry[]> = {
  EN: [
    {
      id: "residential",
      appName: "Residential Access",
      tag: "Mobile App · Access Control",
      description:
        "Smart access control system for residential communities. Automate vehicle barrier management, generate QR passes for guests and residents, and monitor every entry and exit in real time.",
      features: [
        "QR code-based access for residents & visitors",
        "Automated vehicle barrier control",
        "Real-time entry & exit monitoring",
        "Instant push notifications",
      ],
      showLogo: true,
      liveUrl: "https://residentialaccess.corestack-sol.workers.dev",
      appStoreUrl:
        "https://apps.apple.com/mx/app/qr-residential-access-control/id6760604908?l=en-GB",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.corestack.residenceapp",
    },
    {
      id: "qrrac",
      appName: "QR Residential Access Control",
      tag: "Mobile App · Access Control",
      description:
        "Advanced access control platform for residential communities. Built for maximum customization — manage QR visitor access, automated barriers, real-time monitoring, classified alerts with built-in chat threads, common area reservations, and integrated payment management.",
      features: [
        "QR code-based access for visitors",
        "Automated vehicle barrier control",
        "Real-time entry & exit monitoring",
        "Classified alerts with in-thread chat",
        "Common area reservation system",
        "Integrated payment management",
      ],
      video: "/videos/QRRAC.mov",
      liveUrl: "https://qrresidentialaccesscontrol.corestack-sol.workers.dev",
      appStoreUrl:
        "https://apps.apple.com/mx/app/qr-residential-access-control/id6760604908?l=en-GB",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.corestack.residenceapp",
    },
  ],
  ES: [
    {
      id: "residential",
      appName: "Residential Access",
      tag: "App Móvil · Control de Acceso",
      description:
        "Sistema inteligente de control de accesos para residenciales y condominios. Automatiza el manejo de barreras vehiculares, genera pases QR para visitantes y residentes, y monitorea cada entrada y salida en tiempo real.",
      features: [
        "Accesos por código QR para visitantes",
        "Control automatizado de barreras vehiculares",
        "Monitoreo de entradas y salidas en tiempo real",
        "Notificaciones push instantáneas",
        "Historial y auditoría de accesos",
        "Idioma español e inglés",
      ],
      showLogo: true,
      liveUrl: "https://residentialaccess.corestack-sol.workers.dev",
      appStoreUrl:
        "https://apps.apple.com/mx/app/qr-residential-access-control/id6760604908?l=en-GB",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.corestack.residenceapp",
    },
    {
      id: "qrrac",
      appName: "QR Residential Access Control",
      tag: "App Móvil · Control de Acceso",
      description:
        "Plataforma avanzada de control de accesos para residenciales y condominios. Diseñada para mayor personalización — gestiona accesos QR para visitantes, barreras vehiculares automatizadas, monitoreo en tiempo real, alertas clasificadas con chat integrado, reservación de espacios comunes y manejo de pagos.",
      features: [
        "Accesos por código QR para visitantes",
        "Control automatizado de barreras vehiculares",
        "Monitoreo de entradas y salidas en tiempo real",
        "Alertas clasificadas con chat integrado",
        "Reservación de espacios comunes",
        "Manejo de pagos integrado",
      ],
      video: "/videos/QRRAC.mov",
      liveUrl: "https://qrresidentialaccesscontrol.corestack-sol.workers.dev",
      appStoreUrl:
        "https://apps.apple.com/mx/app/qr-residential-access-control/id6760604908?l=en-GB",
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.corestack.residenceapp",
    },
  ],
};

const LABELS = {
  EN: {
    label: "Our Work",
    title: "Featured Projects",
    subtitle: "Real solutions built for real people.",
    available: "Available on",
    playStore: "Google Play",
    appStore: "App Store",
  },
  ES: {
    label: "Nuestro Trabajo",
    title: "Proyectos Destacados",
    subtitle: "Soluciones reales construidas para personas reales.",
    available: "Disponible en",
    playStore: "Google Play",
    appStore: "App Store",
  },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 420 : -420, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -420 : 420,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

const Portfolio = ({ language }: PortfolioProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const apps = APPS[language];
  const t = LABELS[language];
  const app = apps[current];

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + apps.length) % apps.length);
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
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

        {/* Carousel wrapper */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={app.id + language}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative w-64 md:w-72">
                  {app.liveUrl && (
                    <a
                      href={app.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-20 rounded-[2.5rem]"
                      aria-label={`Ver ${app.appName}`}
                    />
                  )}
                  <div className="relative bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl ring-1 ring-slate-700">
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-10" />
                    {/* Screen */}
                    <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[9/19.5]">
                      {app.video ? (
                        <video
                          src={app.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/images/scrn1.jpg"
                          alt={app.appName}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {app.tag}
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {app.appName}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2">
                  {app.features.map((f) => (
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
                      href={app.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                    >
                      <FaApple size={18} />
                      {t.appStore}
                    </a>
                    <a
                      href={app.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors duration-200"
                    >
                      <FaGooglePlay size={16} />
                      {t.playStore}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
            aria-label="Previous app"
          >
            <FaChevronLeft size={14} />
          </button>

          <div className="flex gap-2">
            {apps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
                }`}
                aria-label={`App ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
            aria-label="Next app"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
