'use client'

import { useParams, notFound } from 'next/navigation'
import { usePedidos } from '@/app/hooks/usePedidos'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './page.module.css'

export default function PedidoAdminDetallePage() {
  const params = useParams()
  const pedidoId = Number(params.id)

  const { pedidos, loading } = usePedidos()

  if (!Number.isInteger(pedidoId)) {
    notFound()
  }

  if (loading) {
    return <p>Cargando pedido...</p>
  }

  const pedido = pedidos.find((p) => p.id === pedidoId)

  if (!pedido) {
    notFound()
  }

  return (
    <div className={styles.container}>
      <h1>Pedido #{pedido.id}</h1>

      <p>
        <strong>Estado:</strong>
        <span
          className={`${styles.estado} ${styles[`estado-${pedido.estado.toLowerCase()}`]}`}
        >
          {pedido.estado}
        </span>
      </p>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <p>
            <strong>Cliente:</strong>
          </p>
          <p>
            {pedido.usuario
              ? pedido.usuario.email
              : `${pedido.nombreCliente} (Invitado)`}
          </p>
        </div>

        <div className={styles.infoCard}>
          <p>
            <strong>Entrega:</strong> {pedido.tipoEntrega}
          </p>
          {pedido.direccionEntrega && (
            <p>
              <strong>Dirección:</strong> {pedido.direccionEntrega}
            </p>
          )}
        </div>
      </div>

      <h2>Productos</h2>

      <div className={styles.productList}>
        {pedido.items.map((item) => (
          <div key={item.id} className={styles.productItem}>
            <div className={styles.productQuantity}>{item.cantidad}</div>
            <div className={styles.productName}>{item.producto.nombre}</div>
            <div className={styles.productPrice}>
              {formatCOP(item.precioUnit)}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalContainer}>
        <span className={styles.totalLabel}>Total del pedido</span>
        <div className={styles.totalAmount}>{formatCOP(pedido.total)}</div>
      </div>
    </div>
  )
}
