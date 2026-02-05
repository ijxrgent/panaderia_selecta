//src/app/productos/hooks/useProducts.ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { apiFetch } from '@/lib/api'
import type { Producto } from '@/types/productos'

interface UseProductosParams {
  page: number
  limit: number
  buscar?: string
  categoriaId?: number | ''
}

interface UseProductosState {
  products: Producto[]
  total: number
  loading: boolean
  error: string | null
}

interface ProductoAPI {
  id: number
  nombre: string
  precio: number
  imagen: string | null
  categoriaId: number
  categoria?: {
    id: number
    nombre: string
    descripcion?: string | null
    imagen?: string | null
  }
}

export function useProductos({
  page,
  limit,
  buscar,
  categoriaId,
}: UseProductosParams) {
  const [state, setState] = useState<UseProductosState>({
    products: [],
    total: 0,
    loading: true,
    error: null,
  })

  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = () => {
    setRefreshKey((k) => k + 1)
  }

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const fetchProductos = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }))

        const params = new URLSearchParams({
          pagina: page.toString(),
          limite: limit.toString(),
        })

        if (buscar) params.set('buscar', buscar)
        if (categoriaId) params.set('categoriaId', categoriaId.toString())

        const data = await apiFetch(`/api/productos?${params.toString()}`, {
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        console.log('📦 API Response:', data) // 👈 Debug temporal
        const apiProducts: ProductoAPI[] = data.productos ?? []
        console.log('🔢 Productos recibidos:', apiProducts.length) // 👈 Debug

        // Mapeo CORREGIDO
        const mappedProducts: Producto[] = apiProducts.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          categoriaId: p.categoriaId,
          imagen: p.imagen,
          categoria: p.categoria,
        }))

        setState({
          products: mappedProducts,
          total: data.total ?? 0,
          loading: false,
          error: null,
        })
      } catch {
        if (controller.signal.aborted) return

        setState({
          products: [],
          total: 0,
          loading: false,
          error: 'Error al cargar los productos',
        })
      }
    }

    fetchProductos()

    return () => controller.abort()
  }, [page, limit, buscar, categoriaId, refreshKey])

  return {
    ...state,
    refetch,
  }
}
