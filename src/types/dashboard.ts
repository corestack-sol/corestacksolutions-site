export type ModuleStatus = 'planned' | 'active' | 'completed' | 'blocked'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export interface WeeklyUpdate {
  id: string
  date: string
  week: string
  notes: string
  completed: string[]
}

export interface ProjectModule {
  id: string
  name: string
  description: string
  status: ModuleStatus
  progress: number
  inScope: string[]
  outOfScope: string[]
  updates: WeeklyUpdate[]
}

export interface Project {
  id: string
  name: string
  client: string
  description: string
  startDate: string
  dueDate: string
  status: ProjectStatus
  modules: ProjectModule[]
  createdAt: string
}
