// src/context/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

// Tipo para el usuario
export type User = {
  id: number
  email: string
  nombre: string | null
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT'
}

// Tipo para el contexto
type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (nombre: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props para el Provider
type AuthProviderProps = {
  children: ReactNode
}

// Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar datos al iniciar (desde localStorage)
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedToken = localStorage.getItem('panaderia_token')
        const storedUser = localStorage.getItem('panaderia_user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error cargando autenticación:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthData()
  }, [])

  // Función Login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en login')
      }

      // Guardar en estado y localStorage
      const { accessToken, user: userData } = data

      localStorage.setItem('panaderia_token', accessToken)
      localStorage.setItem('panaderia_user', JSON.stringify(userData))

      setToken(accessToken)
      setUser(userData)

      // Redirigir según rol
      if (userData.role === 'ADMIN' || userData.role === 'EMPLOYEE') {
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función Register
  const register = async (nombre: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'CLIENT',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en registro')
      }

      // Auto-login después de registro
      await login(email, password)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función Logout
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('panaderia_token')
    localStorage.removeItem('panaderia_user')

    // Limpiar estado
    setToken(null)
    setUser(null)

    // Redirigir a home
    router.replace('/')
  }

  // Valor del contexto
  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }

  return context
}
