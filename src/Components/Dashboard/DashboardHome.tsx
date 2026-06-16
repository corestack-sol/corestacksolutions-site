import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../../hooks/useDashboard'
import type { Project, ProjectStatus } from '../../types/dashboard'
import { Modal, Field, Inp, Txt, Sel, ModalActions, ConfirmDelete } from './ui'

const LOGO = '/images/corestack.png'

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: 'Activo',
  paused: 'Pausado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const STATUS_STYLE: Record<ProjectStatus, { bg: string; text: string }> = {
  active:    { bg: 'rgba(0,174,239,0.12)',   text: '#00AEEF' },
  paused:    { bg: 'rgba(249,115,22,0.12)',  text: '#F97316' },
  completed: { bg: 'rgba(16,185,129,0.12)',  text: '#10B981' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',   text: '#EF4444' },
}

type ProjectForm = Omit<Project, 'id' | 'modules' | 'createdAt'>
const EMPTY: ProjectForm = { name: '', client: '', description: '', startDate: '', dueDate: '', status: 'active' }

function fmt(d: string) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Project form modal ───────────────────────────────────────────
function ProjectModal({
  initial, title, submitLabel, onClose, onSubmit,
}: {
  initial: ProjectForm
  title: string
  submitLabel: string
  onClose: () => void
  onSubmit: (form: ProjectForm) => void
}) {
  const [form, setForm] = useState<ProjectForm>(initial)
  const set = <K extends keyof ProjectForm>(k: K, v: ProjectForm[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.client.trim()) return
    onSubmit({ ...form, name: form.name.trim(), client: form.client.trim(), description: form.description.trim() })
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre del proyecto" required>
            <Inp value={form.name} onChange={v => set('name', v)} placeholder="App de gestión..." />
          </Field>
          <Field label="Cliente" required>
            <Inp value={form.client} onChange={v => set('client', v)} placeholder="Empresa ABC" />
          </Field>
        </div>
        <Field label="Descripción">
          <Txt value={form.description} onChange={v => set('description', v)} placeholder="Descripción breve del proyecto..." rows={2} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Inicio">
            <Inp type="date" value={form.startDate} onChange={v => set('startDate', v)} />
          </Field>
          <Field label="Entrega">
            <Inp type="date" value={form.dueDate} onChange={v => set('dueDate', v)} />
          </Field>
          <Field label="Estado">
            <Sel value={form.status} onChange={v => set('status', v as ProjectStatus)}>
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </Sel>
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel={submitLabel} />
      </form>
    </Modal>
  )
}

// ─── Project card ─────────────────────────────────────────────────
function ProjectCard({
  project,
  onNavigate,
  onEdit,
  onDelete,
}: {
  project: Project
  onNavigate: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const progress = project.modules.length
    ? Math.round(project.modules.reduce((a, m) => a + m.progress, 0) / project.modules.length)
    : 0
  const completedMods = project.modules.filter(m => m.status === 'completed').length
  const ss = STATUS_STYLE[project.status]

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all"
      style={{ background: '#081A2E', border: '1px solid rgba(0,174,239,0.1)' }}
      onClick={onNavigate}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,174,239,0.1)')}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-white font-semibold truncate">{project.name}</div>
          <div className="text-white/40 text-xs mt-0.5">{project.client}</div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0"
          style={{ background: ss.bg, color: ss.text }}
        >
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      {project.description && (
        <p className="text-white/35 text-xs leading-relaxed line-clamp-2">{project.description}</p>
      )}

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-white/30">Progreso general</span>
          <span className="font-semibold" style={{ color: progress === 100 ? '#10B981' : '#00AEEF' }}>
            {progress}%
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: progress === 100 ? '#10B981' : 'linear-gradient(90deg,#00AEEF,#38BDF8)',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-[11px] text-white/30">
          <span>{project.modules.length} módulo{project.modules.length !== 1 ? 's' : ''}</span>
          {completedMods > 0 && (
            <span className="text-emerald-400/60">{completedMods} completado{completedMods !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={onEdit}
            className="text-[11px] px-2.5 py-1 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-[11px] px-2.5 py-1 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>

      {(project.startDate || project.dueDate) && (
        <div
          className="flex gap-4 pt-3 text-[11px] text-white/25 border-t"
          style={{ borderColor: 'rgba(0,174,239,0.08)' }}
        >
          {project.startDate && <span>Inicio: {fmt(project.startDate)}</span>}
          {project.dueDate && <span>Entrega: {fmt(project.dueDate)}</span>}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────
export default function DashboardHome() {
  const nav = useNavigate()
  const { projects, createProject, updateProject, deleteProject } = useDashboard()

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [toDelete, setToDelete] = useState<Project | null>(null)

  const active    = projects.filter(p => p.status === 'active').length
  const completed = projects.filter(p => p.status === 'completed').length
  const modules   = projects.reduce((a, p) => a + p.modules.length, 0)

  return (
    <div className="min-h-screen" style={{ background: '#0D1321', fontFamily: "'Inter',-apple-system,sans-serif" }}>

      {/* Nav */}
      <header
        className="sticky top-0 z-40 px-6 md:px-8 py-4 flex items-center justify-between"
        style={{ background: '#081A2E', borderBottom: '1px solid rgba(0,174,239,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <img src={LOGO} alt="Corestack" className="h-7 opacity-90" />
          <span className="text-white/20 hidden sm:block">|</span>
          <span className="text-white/75 text-sm font-medium hidden sm:block">Dashboard de Proyectos</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-white/35 hover:text-white/70 text-sm transition-colors hidden sm:block">
            ← Sitio web
          </a>
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#00AEEF', color: '#081A2E' }}
          >
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      <main className="px-6 md:px-8 py-8 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Proyectos totales', value: projects.length, color: '#fff' },
            { label: 'Activos',           value: active,           color: '#00AEEF' },
            { label: 'Completados',       value: completed,        color: '#10B981' },
            { label: 'Módulos totales',   value: modules,          color: '#F97316' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ background: '#081A2E', border: '1px solid rgba(0,174,239,0.08)' }}
            >
              <div className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: 'Poppins,sans-serif' }}>
                {s.value}
              </div>
              <div className="text-white/35 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Project grid or empty state */}
        {projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: '#081A2E', border: '1px dashed rgba(0,174,239,0.18)' }}
          >
            <div className="text-5xl mb-4" style={{ color: 'rgba(0,174,239,0.25)', fontFamily: 'Montserrat,sans-serif' }}>◈</div>
            <div className="text-white/60 font-semibold text-base mb-1">Sin proyectos</div>
            <div className="text-white/25 text-sm mb-6 text-center max-w-xs">
              Crea el primero para comenzar a gestionar avances semanales por módulos
            </div>
            <button
              onClick={() => setCreating(true)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: '#00AEEF', color: '#081A2E' }}
            >
              + Crear primer proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onNavigate={() => nav(`/dashboard/${p.id}`)}
                onEdit={() => setEditing(p)}
                onDelete={() => setToDelete(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create modal */}
      {creating && (
        <ProjectModal
          title="Nuevo Proyecto"
          submitLabel="Crear proyecto"
          initial={EMPTY}
          onClose={() => setCreating(false)}
          onSubmit={form => {
            const p = createProject(form)
            setCreating(false)
            nav(`/dashboard/${p.id}`)
          }}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <ProjectModal
          title="Editar Proyecto"
          submitLabel="Guardar cambios"
          initial={{ name: editing.name, client: editing.client, description: editing.description, startDate: editing.startDate, dueDate: editing.dueDate, status: editing.status }}
          onClose={() => setEditing(null)}
          onSubmit={form => {
            updateProject(editing.id, form)
            setEditing(null)
          }}
        />
      )}

      {/* Delete confirm */}
      {toDelete && (
        <ConfirmDelete
          title="Eliminar proyecto"
          body={`¿Eliminar "${toDelete.name}"? Se perderán todos sus módulos y actualizaciones.`}
          onCancel={() => setToDelete(null)}
          onConfirm={() => {
            deleteProject(toDelete.id)
            setToDelete(null)
          }}
        />
      )}
    </div>
  )
}
