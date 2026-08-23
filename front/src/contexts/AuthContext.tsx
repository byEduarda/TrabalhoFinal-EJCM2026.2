import { createContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface AuthContextType {
  token: string | null
  signIn: (data: { email: string; password: string }) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('@App:token')
    if (storedToken) {
      setToken(storedToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
    }
  }, [])

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post('/login', { email, password })
    const { token: newToken } = response.data

    setToken(newToken)
    localStorage.setItem('@App:token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const signOut = () => {
    localStorage.removeItem('@App:token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}