// src/app/register/page.tsx - VERSIÓN SIMPLIFICADA
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/authContext'
import Link from 'next/link'
import styles from './signin.module.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Solo validación básica
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Enviamos solo email y password (sin nombre)
      await register('', email, password) // nombre vacío
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear Cuenta</h1>
        <p className={styles.subtitle}>Solo necesitas email y contraseña</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={6}
            />
            <small className={styles.helperText}>Mínimo 6 caracteres</small>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className={styles.link}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
