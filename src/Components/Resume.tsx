import { motion } from 'framer-motion'
import type { ResumeData, Language } from '../types'

interface ResumeProps {
  data: ResumeData
  language: Language
}

const Resume = ({ data, language }: ResumeProps) => {
  const t = {
    title: language === 'EN' ? 'How We Work' : 'Cómo Trabajamos',
    specializations: language === 'EN' ? 'Our Process' : 'Nuestro Proceso',
    work: language === 'EN' ? 'Live Projects' : 'Proyectos en Producción',
    skills: language === 'EN' ? 'Tech Stack' : 'Stack Tecnológico',
  }

  return (
    <section id="resume" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">
            {language === 'EN' ? 'Our Approach' : 'Nuestra Metodología'}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{t.title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-blue-600 rounded" />
              {t.specializations}
            </h3>
            <div className="flex flex-col gap-4">
              {data.education.map(edu => (
                <motion.div
                  key={edu.school}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                  <p className="text-blue-600 text-sm mt-1">{edu.degree}</p>
                  <p className="text-gray-400 text-xs mt-1">{edu.graduated}</p>
                  <p className="text-gray-600 text-sm mt-3">{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-blue-600 rounded" />
              {t.work}
            </h3>
            <div className="flex flex-col gap-4">
              {data.work.map(job => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h4 className="font-semibold text-gray-900">{job.company}</h4>
                  <p className="text-blue-600 text-sm mt-1">{job.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{job.years}</p>
                  <p className="text-gray-600 text-sm mt-3">{job.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Resume
