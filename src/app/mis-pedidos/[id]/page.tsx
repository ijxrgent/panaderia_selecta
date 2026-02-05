'use client'

import { useParams, notFound } from 'next/navigation'
import { usePedidos } from '@/app/hooks/usePedidos'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './page-id.module.css'

export default function PedidoDetallePage() {
  const params = useParams()
  const pedidoId = Number(params.id)

  const { pedidos, loading } = usePedidos()

  if (!Number.isInteger(pedidoId)) {
    notFound()
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Cargando pedido...</p>
      </div>
    )
  }

  const pedido = pedidos.find((p) => p.id === pedidoId)

  // 🔐 Seguridad extra: si no es su pedido → 404
  if (!pedido) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pedido #{pedido.id}</h1>
        <span
          className={`${styles.estado} ${styles[pedido.estado.toLowerCase()]}`}
        >
          {pedido.estado}
        </span>
      </header>

      <section className={styles.info}>
        <div>
          <span className={styles.label}>Fecha</span>
          <span className={styles.value}>
            {new Date(pedido.fechaSolicitud).toLocaleString()}
          </span>
        </div>

        <div>
          <span className={styles.label}>Entrega</span>
          <span className={styles.value}>{pedido.tipoEntrega}</span>
        </div>

        {pedido.direccionEntrega && (
          <div>
            <span className={styles.label}>Dirección</span>
            <span className={styles.value}>{pedido.direccionEntrega}</span>
          </div>
        )}
      </section>

      <section className={styles.items}>
        <h2 className={styles.sectionTitle}>Productos</h2>

        <div className={styles.itemsHeader}>
          <span>Producto</span>
          <span>Cant.</span>
          <span>Precio</span>
          <span>Subtotal</span>
        </div>

        {pedido.items.map((item) => (
          <div key={item.id} className={styles.itemRow}>
            <span>{item.producto.nombre}</span>
            <span>{item.cantidad}</span>
            <span>{formatCOP(item.precioUnit)}</span>
            <span>{formatCOP(item.precioUnit * item.cantidad)}</span>
          </div>
        ))}
      </section>

      <footer className={styles.totalContainer}>
        <span>Total</span>
        <span className={styles.total}>{formatCOP(pedido.total)}</span>
      </footer>
    </div>
  )
}
