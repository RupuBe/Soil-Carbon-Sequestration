import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ViewMode = 'farmer' | 'research'

interface AuthValue {
  isAuthed: boolean
  userName: string
  userEmail: string
  viewMode: ViewMode
  login: (email: string, name?: string) => void
  logout: () => void
  setViewMode: (m: ViewMode) => void
}

const AuthContext = createContext<AuthValue | null>(null)

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(() => read('sc.authed') === '1')
  const [userName, setUserName] = useState(() => read('sc.userName') || 'Farmer')
  const [userEmail, setUserEmail] = useState(() => read('sc.userEmail') || '')
  const [viewMode, setViewModeState] = useState<ViewMode>(
    () => (read('sc.viewMode') as ViewMode) || 'farmer',
  )

  const login = useCallback((email: string, name?: string) => {
    setIsAuthed(true)
    write('sc.authed', '1')
    setUserEmail(email)
    write('sc.userEmail', email)
    if (name) {
      setUserName(name)
      write('sc.userName', name)
    }
  }, [])

  const logout = useCallback(() => {
    setIsAuthed(false)
    write('sc.authed', '0')
  }, [])

  const setViewMode = useCallback((m: ViewMode) => {
    setViewModeState(m)
    write('sc.viewMode', m)
  }, [])

  const value = useMemo(
    () => ({
      isAuthed,
      userName,
      userEmail,
      viewMode,
      login,
      logout,
      setViewMode,
    }),
    [isAuthed, userName, userEmail, viewMode, login, logout, setViewMode],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
