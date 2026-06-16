import { useState, useEffect } from 'react'
import type { Project, ProjectModule, WeeklyUpdate } from '../types/dashboard'

const KEY = 'corestack_projects'

function load(): Project[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function useDashboard() {
  const [projects, setProjects] = useState<Project[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(projects))
  }, [projects])

  return {
    projects,

    createProject(data: Omit<Project, 'id' | 'modules' | 'createdAt'>): Project {
      const p: Project = { ...data, id: crypto.randomUUID(), modules: [], createdAt: new Date().toISOString() }
      setProjects(prev => [p, ...prev])
      return p
    },

    updateProject(id: string, data: Partial<Omit<Project, 'id' | 'modules' | 'createdAt'>>) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    },

    deleteProject(id: string) {
      setProjects(prev => prev.filter(p => p.id !== id))
    },

    addModule(projectId: string, data: Omit<ProjectModule, 'id' | 'updates'>): ProjectModule {
      const m: ProjectModule = { ...data, id: crypto.randomUUID(), updates: [] }
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, modules: [...p.modules, m] } : p))
      return m
    },

    updateModule(projectId: string, moduleId: string, data: Partial<Omit<ProjectModule, 'id' | 'updates'>>) {
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, modules: p.modules.map(m => m.id === moduleId ? { ...m, ...data } : m) }
          : p
      ))
    },

    deleteModule(projectId: string, moduleId: string) {
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, modules: p.modules.filter(m => m.id !== moduleId) } : p
      ))
    },

    addUpdate(projectId: string, moduleId: string, data: Omit<WeeklyUpdate, 'id'>) {
      const u: WeeklyUpdate = { ...data, id: crypto.randomUUID() }
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, modules: p.modules.map(m => m.id === moduleId ? { ...m, updates: [u, ...m.updates] } : m) }
          : p
      ))
    },

    deleteUpdate(projectId: string, moduleId: string, updateId: string) {
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              modules: p.modules.map(m =>
                m.id === moduleId ? { ...m, updates: m.updates.filter(u => u.id !== updateId) } : m
              ),
            }
          : p
      ))
    },
  }
}
