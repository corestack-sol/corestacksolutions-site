import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDashboard } from '../../hooks/useDashboard'
import type { ProjectModule, ModuleStatus, WeeklyUpdate, ProjectStatus } from '../../types/dashboard'
import { Modal, Field, Inp, Txt, Sel, ModalActions, ConfirmDelete } from './ui'

const LOGO = '/images/corestack.png'

// ─── Constants ────────────────────────────────────────────────────
const MOD_LABEL: Record<ModuleStatus, string> = {
  planned: 'Planificado', active: 'Activo', completed: 'Completado', blocked: 'Bloqueado',
}
const MOD_STYLE: Record<ModuleStatus, { bg: string; text: string; bar: string }> = {
  planned:   { bg: 'rgba(255,255,255,0.07)',  text: 'rgba(255,255,255,0.45)', bar: 'rgba(255,255,255,0.2)' },
  active:    { bg: 'rgba(0,174,239,0.12)',    text: '#00AEEF',                bar: 'linear-gradient(90deg,#00AEEF,#38BDF8)' },
  completed: { bg: 'rgba(16,185,129,0.12)',   text: '#10B981',                bar: '#10B981' },
  blocked:   { bg: 'rgba(239,68,68,0.12)',    text: '#EF4444',                bar: '#EF4444' },
}
const PROJ_STYLE: Record<ProjectStatus, { bg: string; text: string }> = {
  active:    { bg: 'rgba(0,174,239,0.12)',   text: '#00AEEF' },
  paused:    { bg: 'rgba(249,115,22,0.12)',  text: '#F97316' },
  completed: { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',  text: '#EF4444' },
}

function fmt(d: string) {
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

function parseLines(s: string): string[] {
  return s.split('\n').map(l => l.trim()).filter(Boolean)
}

// ─── Module form ──────────────────────────────────────────────────
type ModuleForm = {
  name: string; description: string; status: ModuleStatus
  progress: number; inScope: string; outOfScope: string
}
const EMPTY_MOD: ModuleForm = {
  name: '', description: '', status: 'planned', progress: 0, inScope: '', outOfScope: '',
}

function ModuleModal({
  initial, title, submitLabel, onClose, onSubmit,
}: {
  initial: ModuleForm
  title: string
  submitLabel: string
  onClose: () => void
  onSubmit: (f: ModuleForm) => void
}) {
  const [form, setForm] = useState<ModuleForm>(initial)
  const set = <K extends keyof ModuleForm>(k: K, v: ModuleForm[K]) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({ ...form, name: form.name.trim(), description: form.description.trim() })
  }

  return (
    <Modal title={title} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre del módulo" required>
            <Inp value={form.name} onChange={v => set('name', v)} placeholder="Autenticación y roles..." />
          </Field>
          <Field label="Estado">
            <Sel value={form.status} onChange={v => set('status', v as ModuleStatus)}>
              <option value="planned">Planificado</option>
              <option value="active">Activo</option>
              <option value="completed">Completado</option>
              <option value="blocked">Bloqueado</option>
            </Sel>
          </Field>
        </div>
        <Field label="Descripción">
          <Txt value={form.description} onChange={v => set('description', v)} placeholder="Qué cubre este módulo..." rows={2} />
        </Field>
        <Field label={`Progreso: ${form.progress}%`}>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={100} value={form.progress}
              onChange={e => set('progress', Number(e.target.value))}
              className="flex-1 accent-[#00AEEF] h-1.5"
            />
            <span className="text-[#00AEEF] font-bold text-sm w-10 text-right">{form.progress}%</span>
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Alcance incluido (uno por línea)">
            <Txt
              value={form.inScope}
              onChange={v => set('inScope', v)}
              placeholder={'Diseño UX/UI\nAutenticación\nPanel admin'}
              rows={4}
            />
          </Field>
          <Field label="Fuera de alcance (uno por línea)">
            <Txt
              value={form.outOfScope}
              onChange={v => set('outOfScope', v)}
              placeholder={'Integración ERP\nHardware externo'}
              rows={4}
            />
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel={submitLabel} />
      </form>
    </Modal>
  )
}

// ─── Weekly update form ───────────────────────────────────────────
type UpdateForm = { week: string; date: string; notes: string; completed: string }
const EMPTY_UPDATE = (): UpdateForm => ({
  week: '', date: new Date().toISOString().slice(0, 10), notes: '', completed: '',
})

function UpdateModal({
  onClose, onSubmit,
}: {
  onClose: () => void
  onSubmit: (f: UpdateForm) => void
}) {
  const [form, setForm] = useState<UpdateForm>(EMPTY_UPDATE())
  const set = <K extends keyof UpdateForm>(k: K, v: UpdateForm[K]) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.notes.trim()) return
    onSubmit({ ...form, notes: form.notes.trim() })
  }

  return (
    <Modal title="Nueva actualización semanal" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Semana">
            <Inp value={form.week} onChange={v => set('week', v)} placeholder="Semana 3" />
          </Field>
          <Field label="Fecha">
            <Inp type="date" value={form.date} onChange={v => set('date', v)} />
          </Field>
        </div>
        <Field label="Notas del avance" required>
          <Txt value={form.notes} onChange={v => set('notes', v)} placeholder="Esta semana completamos..." rows={3} />
        </Field>
        <Field label="Entregables completados (uno por línea)">
          <Txt
            value={form.completed}
            onChange={v => set('completed', v)}
            placeholder={'Módulo de login\nDiseño de pantallas\nIntegración API'}
            rows={3}
          />
        </Field>
        <ModalActions onCancel={onClose} submitLabel="Guardar actualización" />
      </form>
    </Modal>
  )
}

// ─── Module card ──────────────────────────────────────────────────
function ModuleCard({
  mod, projectId,
  onEdit, onDelete, onAddUpdate, onDeleteUpdate,
}: {
  mod: ProjectModule
  projectId: string
  onEdit: () => void
  onDelete: () => void
  onAddUpdate: () => void
  onDeleteUpdate: (updateId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const ss = MOD_STYLE[mod.status]
  const hasScope = mod.inScope.length > 0 || mod.outOfScope.length > 0

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#081A2E', border: '1px solid rgba(0,174,239,0.1)' }}
    >
      {/* Module header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold">{mod.name}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: ss.bg, color: ss.text }}
              >
                {MOD_LABEL[mod.status]}
              </span>
            </div>
            {mod.description && (
              <p className="text-white/35 text-xs mt-1 leading-relaxed">{mod.description}</p>
            )}
          </div>
          <span className="text-lg font-bold shrink-0" style={{ color: ss.text, fontFamily: 'Poppins,sans-serif' }}>
            {mod.progress}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${mod.progress}%`, background: ss.bar }}
          />
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(x => !x)}
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <span>{expanded ? '▲' : '▼'}</span>
            {expanded ? 'Ocultar detalle' : 'Ver detalle'}
            {mod.updates.length > 0 && (
              <span style={{ color: '#00AEEF', opacity: 0.6 }}>
                ({mod.updates.length} act.)
              </span>
            )}
          </button>
          <div className="flex gap-1">
            <button
              onClick={onAddUpdate}
              className="text-[11px] px-2.5 py-1 rounded-lg transition-all"
              style={{ color: 'rgba(0,174,239,0.65)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#00AEEF'
                e.currentTarget.style.background = 'rgba(0,174,239,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(0,174,239,0.65)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              + Actualización
            </button>
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
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(0,174,239,0.08)' }}>

          {/* Scope */}
          {hasScope && (
            <div
              className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5"
              style={{ background: 'rgba(0,0,0,0.18)' }}
            >
              {mod.inScope.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-2">
                    ✓ Alcance incluido
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {mod.inScope.map((item, i) => (
                      <li key={i} className="flex gap-2 text-xs text-white/45">
                        <span className="text-emerald-400/50 shrink-0 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {mod.outOfScope.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest mb-2">
                    ✗ Fuera de alcance
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {mod.outOfScope.map((item, i) => (
                      <li key={i} className="flex gap-2 text-xs text-white/45">
                        <span className="text-red-400/50 shrink-0 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Weekly updates */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest">
                Actualizaciones semanales
              </span>
              <button
                onClick={onAddUpdate}
                className="text-[11px] text-[#00AEEF]/50 hover:text-[#00AEEF] transition-colors"
              >
                + Agregar
              </button>
            </div>

            {mod.updates.length === 0 ? (
              <div className="text-white/20 text-xs text-center py-4">Sin actualizaciones registradas</div>
            ) : (
              <div className="flex flex-col gap-3">
                {mod.updates.map((u: WeeklyUpdate) => (
                  <div
                    key={u.id}
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(0,174,239,0.04)', border: '1px solid rgba(0,174,239,0.08)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {u.week && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(0,174,239,0.15)', color: '#00AEEF' }}
                            >
                              {u.week}
                            </span>
                          )}
                          {u.date && (
                            <span className="text-[11px] text-white/30">{fmt(u.date)}</span>
                          )}
                        </div>
                        <p className="text-sm text-white/65 leading-relaxed">{u.notes}</p>
                        {u.completed.length > 0 && (
                          <ul className="mt-2.5 flex flex-col gap-1">
                            {u.completed.map((item, i) => (
                              <li key={i} className="flex gap-1.5 text-xs text-emerald-400/70">
                                <span className="shrink-0">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteUpdate(u.id)}
                        className="text-white/20 hover:text-red-400 transition-colors text-xs shrink-0 mt-0.5"
                        title="Eliminar actualización"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const {
    projects, updateProject,
    addModule, updateModule, deleteModule,
    addUpdate, deleteUpdate,
  } = useDashboard()

  const project = projects.find(p => p.id === id)

  // Module modal
  const [modModal, setModModal] = useState<'add' | { mod: ProjectModule } | null>(null)
  const [toDeleteMod, setToDeleteMod] = useState<ProjectModule | null>(null)

  // Update modal — stores the moduleId
  const [updateModal, setUpdateModal] = useState<string | null>(null)
  const [toDeleteUpdate, setToDeleteUpdate] = useState<{ moduleId: string; updateId: string } | null>(null)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1321' }}>
        <div className="text-center">
          <div className="text-white/30 text-base mb-4">Proyecto no encontrado</div>
          <button
            onClick={() => nav('/dashboard')}
            className="px-5 py-2 rounded-lg text-sm font-semibold"
            style={{ background: '#00AEEF', color: '#081A2E' }}
          >
            ← Volver al dashboard
          </button>
        </div>
      </div>
    )
  }

  const avgProgress = project.modules.length
    ? Math.round(project.modules.reduce((a, m) => a + m.progress, 0) / project.modules.length)
    : 0
  const completedMods = project.modules.filter(m => m.status === 'completed').length
  const activeMods    = project.modules.filter(m => m.status === 'active').length
  const blockedMods   = project.modules.filter(m => m.status === 'blocked').length
  const ps = PROJ_STYLE[project.status]

  return (
    <div className="min-h-screen" style={{ background: '#0D1321', fontFamily: "'Inter',-apple-system,sans-serif" }}>

      {/* Nav */}
      <header
        className="sticky top-0 z-40 px-6 md:px-8 py-4 flex items-center justify-between"
        style={{ background: '#081A2E', borderBottom: '1px solid rgba(0,174,239,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav('/dashboard')}
            className="text-white/35 hover:text-white transition-colors text-sm"
          >
            ←
          </button>
          <img src={LOGO} alt="Corestack" className="h-6 opacity-75" />
          <span className="text-white/20">|</span>
          <span className="text-white/70 text-sm font-medium truncate max-w-[180px] sm:max-w-none">
            {project.name}
          </span>
        </div>
        <button
          onClick={() => setModModal('add')}
          className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          style={{ background: '#00AEEF', color: '#081A2E' }}
        >
          + Módulo
        </button>
      </header>

      <main className="px-6 md:px-8 py-8 max-w-5xl mx-auto">

        {/* Project header card */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: '#081A2E', border: '1px solid rgba(0,174,239,0.12)' }}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-white text-xl font-bold leading-tight">{project.name}</h1>
              <div className="text-white/40 text-sm mt-0.5">{project.client}</div>
            </div>
            {/* Inline status selector */}
            <select
              value={project.status}
              onChange={e => updateProject(project.id, { status: e.target.value as ProjectStatus })}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer shrink-0"
              style={{ background: ps.bg, color: ps.text, border: 'none', appearance: 'none' as const }}
            >
              <option value="active">● Activo</option>
              <option value="paused">● Pausado</option>
              <option value="completed">● Completado</option>
              <option value="cancelled">● Cancelado</option>
            </select>
          </div>

          {project.description && (
            <p className="text-white/45 text-sm leading-relaxed mb-4">{project.description}</p>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: `${avgProgress}%`, label: 'Progreso general',  color: '#00AEEF',  bg: 'rgba(0,174,239,0.06)'   },
              { value: activeMods,        label: 'En progreso',       color: '#F97316',  bg: 'rgba(249,115,22,0.06)'  },
              { value: completedMods,     label: 'Completados',       color: '#10B981',  bg: 'rgba(16,185,129,0.06)'  },
              { value: blockedMods,       label: 'Bloqueados',        color: '#EF4444',  bg: 'rgba(239,68,68,0.06)'   },
            ].map(k => (
              <div
                key={k.label}
                className="rounded-xl p-4 text-center"
                style={{ background: k.bg, border: `1px solid ${k.color}20` }}
              >
                <div className="text-2xl font-bold mb-0.5" style={{ color: k.color, fontFamily: 'Poppins,sans-serif' }}>
                  {k.value}
                </div>
                <div className="text-white/30 text-[11px]">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="mt-4">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${avgProgress}%`,
                  background: avgProgress === 100 ? '#10B981' : 'linear-gradient(90deg,#00AEEF,#38BDF8)',
                }}
              />
            </div>
          </div>

          {(project.startDate || project.dueDate) && (
            <div
              className="flex gap-6 mt-4 pt-4 text-[11px] text-white/25"
              style={{ borderTop: '1px solid rgba(0,174,239,0.08)' }}
            >
              {project.startDate && (
                <span>Inicio: <span className="text-white/50">{fmt(project.startDate)}</span></span>
              )}
              {project.dueDate && (
                <span>Entrega estimada: <span className="text-white/50">{fmt(project.dueDate)}</span></span>
              )}
            </div>
          )}
        </div>

        {/* Modules section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">
            Módulos
            <span className="text-white/30 font-normal ml-2 text-sm">({project.modules.length})</span>
          </h2>
          <button
            onClick={() => setModModal('add')}
            className="text-sm transition-colors"
            style={{ color: 'rgba(0,174,239,0.7)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#00AEEF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,174,239,0.7)'}
          >
            + Agregar módulo
          </button>
        </div>

        {project.modules.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ background: '#081A2E', border: '1px dashed rgba(0,174,239,0.15)' }}
          >
            <div className="text-white/15 text-4xl mb-3">⬡</div>
            <div className="text-white/35 text-sm mb-4">Sin módulos. Desglosa el proyecto en componentes.</div>
            <button
              onClick={() => setModModal('add')}
              className="px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: '#00AEEF', color: '#081A2E' }}
            >
              + Agregar primer módulo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {project.modules.map(m => (
              <ModuleCard
                key={m.id}
                mod={m}
                projectId={project.id}
                onEdit={() => setModModal({ mod: m })}
                onDelete={() => setToDeleteMod(m)}
                onAddUpdate={() => setUpdateModal(m.id)}
                onDeleteUpdate={updateId => setToDeleteUpdate({ moduleId: m.id, updateId })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Module modals */}
      {modModal === 'add' && (
        <ModuleModal
          title="Nuevo Módulo"
          submitLabel="Agregar módulo"
          initial={EMPTY_MOD}
          onClose={() => setModModal(null)}
          onSubmit={form => {
            addModule(project.id, {
              name: form.name,
              description: form.description,
              status: form.status,
              progress: form.progress,
              inScope: parseLines(form.inScope),
              outOfScope: parseLines(form.outOfScope),
            })
            setModModal(null)
          }}
        />
      )}

      {modModal !== null && modModal !== 'add' && (
        <ModuleModal
          title="Editar Módulo"
          submitLabel="Guardar cambios"
          initial={{
            name: modModal.mod.name,
            description: modModal.mod.description,
            status: modModal.mod.status,
            progress: modModal.mod.progress,
            inScope: modModal.mod.inScope.join('\n'),
            outOfScope: modModal.mod.outOfScope.join('\n'),
          }}
          onClose={() => setModModal(null)}
          onSubmit={form => {
            updateModule(project.id, modModal.mod.id, {
              name: form.name,
              description: form.description,
              status: form.status,
              progress: form.progress,
              inScope: parseLines(form.inScope),
              outOfScope: parseLines(form.outOfScope),
            })
            setModModal(null)
          }}
        />
      )}

      {/* Update modal */}
      {updateModal && (
        <UpdateModal
          onClose={() => setUpdateModal(null)}
          onSubmit={form => {
            addUpdate(project.id, updateModal, {
              week: form.week,
              date: form.date,
              notes: form.notes,
              completed: parseLines(form.completed),
            })
            setUpdateModal(null)
          }}
        />
      )}

      {/* Delete module confirm */}
      {toDeleteMod && (
        <ConfirmDelete
          title="Eliminar módulo"
          body={`¿Eliminar el módulo "${toDeleteMod.name}"? Se perderán todas sus actualizaciones.`}
          onCancel={() => setToDeleteMod(null)}
          onConfirm={() => {
            deleteModule(project.id, toDeleteMod.id)
            setToDeleteMod(null)
          }}
        />
      )}

      {/* Delete update confirm */}
      {toDeleteUpdate && (
        <ConfirmDelete
          title="Eliminar actualización"
          body="¿Eliminar esta actualización semanal?"
          onCancel={() => setToDeleteUpdate(null)}
          onConfirm={() => {
            deleteUpdate(project.id, toDeleteUpdate.moduleId, toDeleteUpdate.updateId)
            setToDeleteUpdate(null)
          }}
        />
      )}
    </div>
  )
}
