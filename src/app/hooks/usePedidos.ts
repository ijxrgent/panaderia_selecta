// src/app/hooks/usePedidos.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import type { Pedido } from '@/types/pedidos'

export function usePedidos(archivado?: boolean) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Debug: verificar token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('panaderia_token')
        console.log('🔐 Token disponible:', token ? 'SÍ' : 'NO')
        if (token) {
          console.log(
            '📝 Token (primeros 10 chars):',
            token.substring(0, 10) + '...'
          )
        }
      }

      const query =
        typeof archivado === 'boolean' ? `?archivado=${archivado}` : ''
      const url = `/api/pedidos${query}`

      console.log('🌐 Fetching pedidos from:', url)

      const data = await apiFetch(url)
      console.log('✅ Response recibida:', data)

      if (Array.isArray(data)) {
        setPedidos(data)
      } else if (Array.isArray(data.pedidos)) {
        setPedidos(data.pedidos)
      } else if (Array.isArray(data.data)) {
        setPedidos(data.data)
      } else {
        console.warn('⚠️ Respuesta inesperada:', data)
        setPedidos([])
      }
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err)
      setError(err instanceof Error ? err.message : 'Error cargando pedidos')
    } finally {
      setLoading(false)
    }
  }, [archivado])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  return { pedidos, loading, error, refetch: fetchPedidos }
}
