import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaCheckCircle, FaExclamationCircle, FaTrashAlt } from 'react-icons/fa'

const SERVICE_ID = 'service_7k401cs'
const TEMPLATE_ID = 'template_pdflzrf'
const PUBLIC_KEY = 'VSuaHZMYag503Ehkc'

type Status = 'idle' | 'sending' | 'success' | 'error'

const APPS = [
  'Residential Access',
  'QR Residential Access Control',
]

const DeleteAccount = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [app, setApp] = useState(APPS[0])
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<Status>('idle')

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
          subject: `Solicitud de eliminación de cuenta — ${app}`,
          message: `El usuario ${name} (${email}) solicita la eliminación de su cuenta y datos asociados en la app: ${app}.\n\nMotivo: ${reason || 'No especificado'}`,
        },
        { publicKey: PUBLIC_KEY }
      )
      setStatus('success')
      setName('')
      setEmail('')
      setReason('')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white disabled:opacity-50'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Corestack Solutions
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Icon + title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FaTrashAlt size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Solicitud de eliminación de cuenta
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Completa el formulario para solicitar la eliminación de tu cuenta y todos los datos asociados. Procesaremos tu solicitud en un plazo máximo de <strong>30 días hábiles</strong>.
            </p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <FaCheckCircle className="text-green-500 mx-auto mb-4" size={40} />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Solicitud enviada</h2>
              <p className="text-gray-500 text-sm">
                Hemos recibido tu solicitud. Te contactaremos al correo <strong>{email || 'proporcionado'}</strong> para confirmar la eliminación de tu cuenta y datos.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className={inputClass}
                  disabled={status === 'sending'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico de la cuenta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  disabled={status === 'sending'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Aplicación <span className="text-red-500">*</span>
                </label>
                <select
                  value={app}
                  onChange={e => setApp(e.target.value)}
                  className={inputClass}
                  disabled={status === 'sending'}
                >
                  {APPS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Motivo (opcional)
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Puedes indicar el motivo de tu solicitud..."
                  rows={3}
                  className={inputClass + ' resize-none'}
                  disabled={status === 'sending'}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
                  <FaExclamationCircle size={16} />
                  Ocurrió un error al enviar tu solicitud. Por favor intenta de nuevo.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Enviando solicitud...' : 'Solicitar eliminación de cuenta'}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Al enviar este formulario confirmas que eres el titular de la cuenta. La eliminación es irreversible y removerá todos tus datos de nuestros sistemas.
              </p>
            </form>
          )}
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Corestack Solutions · <a href="mailto:corestack.sol@gmail.com" className="hover:text-gray-600 transition-colors">corestack.sol@gmail.com</a>
      </footer>
    </div>
  )
}

export default DeleteAccount
