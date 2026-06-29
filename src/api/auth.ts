const BASE = import.meta.env.VITE_API_URL ?? ''

export interface AuthUser {
  id: string | number
  email: string
  role?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>
    throw new Error(typeof err.message === 'string' ? err.message : 'Credenciales incorrectas')
  }
  return res.json() as Promise<LoginResponse>
}

export async function apiGetMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Token inválido')
  return res.json() as Promise<AuthUser>
}
