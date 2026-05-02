import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa'
import type { TestimonialsData, Language } from '../types'

interface TestimonialsProps {
  data: TestimonialsData
  language: Language
}

const Testimonials = ({ data, language }: TestimonialsProps) => {
  const [current, setCurrent] = useState(0)
  const items = data.testimonials

  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)
  const next = () => setCurrent(c => (c + 1) % items.length)

  return (
    <section id="testimonials" className="py-24 bg-slate-800">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
          {language === 'EN' ? 'What clients say' : 'Lo que dicen nuestros clientes'}
        </span>
        <h2 className="text-3xl font-bold text-white mt-2 mb-14">
          {language === 'EN' ? 'Client Testimonials' : 'Testimonios'}
        </h2>

        {items.length > 0 && (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-700/60 rounded-2xl p-8 md:p-12 border border-slate-600/40"
              >
                <FaQuoteLeft className="text-blue-400 text-3xl mx-auto mb-6 opacity-80" />
                <p className="text-slate-200 text-lg leading-relaxed mb-8 italic">
                  "{items[current].text}"
                </p>
                <div className="flex flex-col items-center gap-1">
                  <cite className="text-blue-400 font-semibold not-italic text-sm">
                    — {items[current].user}
                  </cite>
                  <span className="text-slate-500 text-xs">{items[current].profile}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prev}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                  aria-label="Previous"
                >
                  <FaChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        i === current ? 'bg-blue-400 w-4' : 'bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                  aria-label="Next"
                >
                  <FaChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
