'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'

export default function MiPerfilPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return <p>Cargando perfil...</p>
  }

  if (!user) {
    return null // evita flicker
  }

  return (
    <section>
      <h1>Mi perfil</h1>
      <p>
        <strong>Nombre:</strong> {user.nombre ?? '—'}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Rol:</strong> {user.role}
      </p>
    </section>
  )
}
