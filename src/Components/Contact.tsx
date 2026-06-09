import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import type { MainData, Language } from '../types'

const SERVICE_ID = 'service_7k401cs'
const TEMPLATE_ID = 'template_pdflzrf'
const PUBLIC_KEY = 'VSuaHZMYag503Ehkc'

interface ContactProps {
  data: MainData
  language: Language
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const Contact = ({ data, language }: ContactProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const t = {
    label: language === 'EN' ? 'Get In Touch' : 'Contáctanos',
    title: language === 'EN' ? "Let's Work Together" : 'Trabajemos Juntos',
    subtitle: data.contactmessage,
    namePh: language === 'EN' ? 'Your name' : 'Tu nombre',
    emailPh: language === 'EN' ? 'Your email' : 'Tu correo',
    subjectPh: language === 'EN' ? 'Subject' : 'Asunto',
    messagePh: language === 'EN' ? 'Your message' : 'Tu mensaje',
    send: language === 'EN' ? 'Send Message' : 'Enviar Mensaje',
    sending: language === 'EN' ? 'Sending...' : 'Enviando...',
    successMsg:
      language === 'EN'
        ? 'Message sent! We will get back to you soon.'
        : '¡Mensaje enviado! Te responderemos pronto.',
    errorMsg:
      language === 'EN'
        ? 'Something went wrong. Please try again.'
        : 'Ocurrió un error. Por favor intenta de nuevo.',
    address: language === 'EN' ? 'Address' : 'Dirección',
    phone: language === 'EN' ? 'Phone' : 'Teléfono',
    email: 'Email',
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          subject,
          message,
        },
        { publicKey: PUBLIC_KEY }
      )
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white disabled:opacity-50'

  const isSending = status === 'sending'

  return (
    <section id="contact" className="py-24 bg-slate-50">
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
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{t.title}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <FaCheckCircle className="text-green-500" size={40} />
                  <p className="text-gray-700 font-medium">{t.successMsg}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {language === 'EN' ? 'Send another message' : 'Enviar otro mensaje'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  exit={{ opacity: 0 }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.namePh}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      disabled={isSending}
                      className={inputClass}
                    />
                    <input
                      type="email"
                      placeholder={t.emailPh}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={isSending}
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder={t.subjectPh}
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    disabled={isSending}
                    className={inputClass}
                  />
                  <textarea
                    placeholder={t.messagePh}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={6}
                    disabled={isSending}
                    className={`${inputClass} resize-none`}
                  />

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <FaExclamationCircle size={14} />
                      {t.errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="self-start bg-blue-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSending && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isSending ? t.sending : t.send}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {[
              { label: t.address, value: data.address.street ? `${data.address.street}, ${data.address.city}` : data.address.city },
              { label: t.phone, value: data.phone },
              { label: t.email, value: data.email },
            ].map(item => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-gray-700 text-sm">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
