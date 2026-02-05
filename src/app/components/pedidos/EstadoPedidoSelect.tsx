'use client'

import { useState } from 'react'
import styles from './estadoPedidoSelect.module.css'
import { ESTADOS_PEDIDO, EstadoPedido } from '@/lib/pedidos/estados'
import { apiFetch } from '@/lib/api'

interface Props {
  pedidoId: number
  estadoActual: EstadoPedido
  onSuccess?: (nuevoEstado: EstadoPedido) => void
}

export default function EstadoPedidoSelect({
  pedidoId,
  estadoActual,
  onSuccess,
}: Props) {
  const [estado, setEstado] = useState<EstadoPedido>(estadoActual)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(nuevoEstado: EstadoPedido) {
    if (nuevoEstado === estadoActual) return

    setLoading(true)
    setError(null)

    try {
      // 👇 CAMBIA fetch por apiFetch
      await apiFetch(`/api/pedidos/${pedidoId}/estado`, {
        method: 'PUT',
        body: JSON.stringify({ nuevoEstado }),
      })

      setEstado(nuevoEstado)
      onSuccess?.(nuevoEstado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <select
        value={estado}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value as EstadoPedido)}
        className={styles.select}
      >
        {ESTADOS_PEDIDO.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      {loading && <span className={styles.loading}>⏳</span>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
