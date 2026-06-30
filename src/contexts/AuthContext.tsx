import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGetMe, type AuthUser } from '../api/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginModalOpen: boolean
  setSession: (token: string, user: AuthUser) => void
  logout: () => void
  openLoginModal: () => void
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'corestack_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) {
      setIsLoading(false)
      return
    }
    apiGetMe(stored)
      .then(u => {
        setToken(stored)
        setUser(u)
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  function setSession(t: string, u: AuthUser) {
    localStorage.setItem(TOKEN_KEY, t)
    document.cookie = `cs_auth=${t}; path=/; SameSite=Strict; max-age=${7 * 24 * 3600}`
    setToken(t)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = 'cs_auth=; path=/; max-age=0'
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginModalOpen,
        setSession,
        logout,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
