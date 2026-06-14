import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { api } from '../lib/api'
import type { AuthResponse, RegisterInput, UserProfile } from '../types'

/* eslint-disable react-refresh/only-export-components */
interface AuthContextValue {
  token: string | null
  user: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'gpmitconnect_token'
const USER_KEY = 'gpmitconnect_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as UserProfile) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get<UserProfile>('/auth/me')
        setUser(data)
        localStorage.setItem(USER_KEY, JSON.stringify(data))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void syncProfile()
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: normalizedEmail,
      password,
    })
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      role: input.role,
      yearOfStudy: input.yearOfStudy?.trim() || null,
      division: input.division?.trim() || null,
      phoneNumber: input.phoneNumber?.trim() || null,
    })
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [loading, login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
