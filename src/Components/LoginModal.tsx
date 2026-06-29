import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { apiLogin } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'
import corestackLogo from '../assets/corestack.png'

export default function LoginModal() {
  const { loginModalOpen, closeLoginModal, setSession } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (!loginModalOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await apiLogin(email, password)
      setSession(token, user)
      closeLoginModal()
      navigate('/corporate')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeLoginModal()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 10, 24, 0.82)', backdropFilter: 'blur(6px)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(0,174,239,0.18), 0 32px 64px rgba(0,0,0,0.6)' }}
      >
        {/* ── Header con gradiente corporativo ── */}
        <div
          className="relative px-7 pt-8 pb-7 flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(145deg, #0B1629 0%, #0f2554 60%, #0B1629 100%)',
            borderBottom: '1px solid rgba(0,174,239,0.2)',
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <FaTimes size={14} />
          </button>

          {/* Glow detrás del logo */}
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.2) 0%, transparent 70%)' }}
          />

          <img src={corestackLogo} alt="Corestack Solutions" className="h-9 mb-4 relative" />

          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
            style={{ color: '#00AEEF' }}
          >
            Corestack Solutions
          </p>
          <h2 className="text-white font-bold text-lg leading-tight">Acceso Corporativo</h2>
          <p className="text-white/40 text-xs mt-1">Portal interno · Área restringida</p>
        </div>

        {/* ── Formulario ── */}
        <div style={{ background: '#0B1629' }}>
          <form onSubmit={handleSubmit} className="px-7 pt-6 pb-2 flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#00AEEF' }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="correo@corestack.com"
                className="rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,174,239,0.2)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.7)')}
                onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.2)')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#00AEEF' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,174,239,0.2)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.7)')}
                onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.2)')}
              />
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-xs"
                style={{
                  background: 'rgba(220,38,38,0.12)',
                  border: '1px solid rgba(220,38,38,0.35)',
                  color: '#fca5a5',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg py-2.5 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 mt-1"
              style={{
                background: loading
                  ? 'rgba(0,174,239,0.3)'
                  : 'linear-gradient(90deg, #0078b8 0%, #00AEEF 100%)',
                color: loading ? 'rgba(255,255,255,0.4)' : '#fff',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(0,174,239,0.35)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                  Verificando…
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="text-center text-[10px] py-5" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Acceso restringido — solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  )
}
