'use client'

import Link from 'next/link'
import { usePedidos } from '@/app/hooks/usePedidos'
import { formatCOP } from '@/lib/formatCurrency'
import EstadoPedidoSelect from '@/app/components/pedidos/EstadoPedidoSelect'
import { useState } from 'react'
import styles from './page.module.css'

export default function PedidosAdminPage() {
  const [mostrarArchivados, setMostrarArchivados] = useState(false)
  const { pedidos, loading } = usePedidos(mostrarArchivados)
  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando pedidos...</p>
      </div>
    )
  }

  const filteredPedidos = pedidos.filter((p) => {
    const term = searchTerm.toLowerCase()

    return (
      p.id.toString().includes(term) ||
      p.usuario?.email?.toLowerCase().includes(term) ||
      p.nombreCliente?.toLowerCase().includes(term)
    )
  })

  const getEstadoClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado':
        return styles.estadoCompletado
      case 'pendiente':
        return styles.estadoPendiente
      case 'cancelado':
        return styles.estadoCancelado
      default:
        return styles.estadoDefault
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mostrarArchivados ? 'Pedidos archivados' : 'Pedidos'}
        </h1>

        <p className={styles.subtitle}>Administra los pedidos de tu tienda</p>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar pedidos por ID o email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tabs}>
        <button
          className={!mostrarArchivados ? styles.activeTab : ''}
          onClick={() => setMostrarArchivados(false)}
          data-icon="activos"
        >
          <span>Activos</span>
        </button>

        <button
          className={mostrarArchivados ? styles.activeTab : ''}
          onClick={() => setMostrarArchivados(true)}
          data-icon="archivados"
        >
          <span>Archivados</span>
        </button>
      </div>

      <div className={styles.resumen}>
        <p>
          Mostrando{' '}
          <span className={styles.resumenNumero}>{filteredPedidos.length}</span>{' '}
          de <span className={styles.resumenNumero}>{pedidos.length}</span>{' '}
          pedidos
        </p>
      </div>

      <div className={styles.pedidosLista}>
        {filteredPedidos.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No se encontraron pedidos</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          filteredPedidos.map((pedido) => (
            <div key={pedido.id} className={styles.pedidoCard}>
              <div className={styles.pedidoContent}>
                <div className={styles.pedidoHeader}>
                  <span className={styles.pedidoId}>#{pedido.id}</span>
                  <span
                    className={`${styles.estadoBadge} ${getEstadoClass(
                      pedido.estado
                    )}`}
                  >
                    {pedido.estado}
                  </span>
                  <EstadoPedidoSelect
                    pedidoId={pedido.id}
                    estadoActual={pedido.estado}
                    onSuccess={(nuevoEstado) => {
                      pedido.estado = nuevoEstado // visual inmediato
                    }}
                  />
                </div>

                <div className={styles.pedidoInfo}>
                  <div className={styles.clienteInfo}>
                    <p className={styles.infoLabel}>Cliente</p>
                    <p className={styles.infoValue}>
                      {pedido.usuario
                        ? pedido.usuario.email
                        : `${pedido.nombreCliente} (Invitado)`}
                    </p>
                  </div>

                  <div className={styles.detallesGrid}>
                    <div className={styles.detalleItem}>
                      <div className={styles.productosResumen}>
                        <p className={styles.infoLabel}>Productos</p>
                        <ul className={styles.productosLista}>
                          {pedido.items.map((item) => (
                            <li key={item.producto.nombre}>
                              {item.cantidad} × {item.producto.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className={styles.infoLabel}>Total</p>
                      <p className={styles.pedidoTotal}>
                        {formatCOP(pedido.total)}
                      </p>
                    </div>
                    <div className={styles.detalleItem}>
                      <p className={styles.infoLabel}>Entrega</p>
                      <p className={styles.infoValue}>{pedido.tipoEntrega}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.pedidoActions}>
                <Link
                  href={`/dashboard/pedidos/${pedido.id}`}
                  className={styles.verButton}
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
