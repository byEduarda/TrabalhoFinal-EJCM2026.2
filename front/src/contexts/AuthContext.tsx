import { createContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'

interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: AuthUser | null
  signIn: (data: { email: string; password: string }) => Promise<void>
  signOut: () => void
  updateUser: (data: Partial<AuthUser>) => void
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('@App:token')
    const storedUser = localStorage.getItem('@App:user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
  }, [])

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post('/login', { email, password })
    const { token: newToken, user: newUser } = response.data

    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('@App:token', newToken)
    localStorage.setItem('@App:user', JSON.stringify(newUser))
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const signOut = () => {
    localStorage.removeItem('@App:token')
    localStorage.removeItem('@App:user')
    setToken(null)
    setUser(null)
  }

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((current) => {
      if (!current) return current
      const updated = { ...current, ...data }
      localStorage.setItem('@App:user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}