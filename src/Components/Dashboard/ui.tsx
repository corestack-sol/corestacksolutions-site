import type { ReactNode } from 'react'

// ─── Modal ────────────────────────────────────────────────────────
export function Modal({
  title, onClose, children, wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,26,46,0.92)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl p-6 max-h-[90vh] overflow-y-auto`}
        style={{ background: '#081A2E', border: '1px solid rgba(0,174,239,0.25)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Form atoms ───────────────────────────────────────────────────
export function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
        {label}{required && <span className="text-[#00AEEF] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const baseCls = 'w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#00AEEF]/50 transition-all'
const baseSty = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,174,239,0.15)' } as const

export function Inp({
  type = 'text', value, onChange, placeholder,
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={baseCls}
      style={baseSty}
    />
  )
}

export function Txt({
  value, onChange, placeholder, rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={baseCls + ' resize-none'}
      style={baseSty}
    />
  )
}

export function Sel({
  value, onChange, children,
}: {
  value: string
  onChange: (v: string) => void
  children: ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={baseCls}
      style={{ ...baseSty, appearance: 'none' as const }}
    >
      {children}
    </select>
  )
}

// ─── Modal footer actions ─────────────────────────────────────────
export function ModalActions({
  onCancel, submitLabel,
}: {
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'rgba(0,174,239,0.1)' }}>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-5 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
        style={{ background: '#00AEEF', color: '#081A2E' }}
      >
        {submitLabel}
      </button>
    </div>
  )
}

// ─── Confirm delete modal ─────────────────────────────────────────
export function ConfirmDelete({
  title, body, onCancel, onConfirm,
}: {
  title: string
  body: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-white/50 text-sm mb-1.5">{body}</p>
      <p className="text-white/25 text-xs mb-6">Esta acción no se puede deshacer.</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
        >
          Eliminar
        </button>
      </div>
    </Modal>
  )
}
