import { motion } from 'framer-motion'
import type { MainData, Language } from '../types'

interface AboutProps {
  data: MainData
  language: Language
}

const About = ({ data, language }: AboutProps) => {
  const t = {
    about: language === 'EN' ? 'About Us' : 'Sobre Nosotros',
    contact: language === 'EN' ? 'Contact Details' : 'Datos de Contacto',
    location: language === 'EN' ? 'Location' : 'Ubicación',
    phone: language === 'EN' ? 'Phone' : 'Teléfono',
    email: language === 'EN' ? 'Email' : 'Correo',
  }

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`/images/${data.image}`}
              alt="Corestack Solutions"
              className="w-40 h-auto mx-auto object-contain"
            />
          </motion.div>

          <motion.div
            className="md:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
                {t.about}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                {data.name}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{data.bio}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.contact}</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5">📍</span>
                  <div>
                    <p className="font-medium text-gray-700">{t.location}</p>
                    <p className="text-gray-500">{data.address.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5">📞</span>
                  <div>
                    <p className="font-medium text-gray-700">{t.phone}</p>
                    <p className="text-gray-500">{data.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:col-span-2">
                  <span className="text-blue-500 mt-0.5">✉️</span>
                  <div>
                    <p className="font-medium text-gray-700">{t.email}</p>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
