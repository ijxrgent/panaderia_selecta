'use client'

import Link from 'next/link'
import { usePedidos } from '@/app/hooks/usePedidos'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './mis-pedidos.module.css'

export default function MisPedidosPage() {
  const { pedidos, loading } = usePedidos()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando tus pedidos...</p>
      </div>
    )
  }

  if (pedidos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>🧾</span>
        <h2>Aún no has realizado pedidos</h2>
        <p>Cuando hagas tu primer pedido aparecerá aquí</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mis pedidos</h1>
        <p className={styles.subtitle}>
          Revisa el estado y detalle de tus pedidos
        </p>
      </header>

      <div className={styles.pedidosList}>
        {pedidos.map((pedido) => (
          <div key={pedido.id} className={styles.pedidoCard}>
            <div className={styles.pedidoHeader}>
              <span className={styles.pedidoId}>Pedido #{pedido.id}</span>
              <span
                className={`${styles.estadoBadge} ${
                  styles[pedido.estado.toLowerCase()]
                }`}
              >
                {pedido.estado}
              </span>
            </div>

            <div className={styles.pedidoInfo}>
              <div>
                <span className={styles.label}>Fecha</span>
                <span className={styles.value}>
                  {new Date(pedido.fechaSolicitud).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className={styles.label}>Entrega</span>
                <span className={styles.value}>{pedido.tipoEntrega}</span>
              </div>

              <div>
                <span className={styles.label}>Total</span>
                <span className={styles.total}>{formatCOP(pedido.total)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link
                href={`/mis-pedidos/${pedido.id}`}
                className={styles.detalleButton}
              >
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
