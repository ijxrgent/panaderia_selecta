//src/app/productos/hooks/useCategories.ts
'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import type { Categoria } from '@/types/categoria'

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchCategorias = async () => {
      try {
        setLoading(true)
        const data = await apiFetch('/api/categorias', {
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        setCategorias(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        if (controller.signal.aborted) return

        const error = err as Error
        setError(
          error.name === 'AbortError' ? null : 'Error al cargar las categorías'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchCategorias()

    return () => controller.abort()
  }, [])

  return { categorias, loading, error }
}
