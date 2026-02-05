// src/app/productos/[id]/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/context/cartContext'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './producto-detalle.module.css'

interface ProductoDetalle {
  id: number
  nombre: string
  precio: number
  stock: number
  imagen: string | null
  categoria: {
    id: number
    nombre: string
  }
}

interface AddToCartButtonProps {
  producto: ProductoDetalle
}

export default function AddToCartButton({ producto }: AddToCartButtonProps) {
  const [cantidad, setCantidad] = useState(1)
  const [agregando, setAgregando] = useState(false)
  const { addToCart } = useCart()

  const handleAgregar = () => {
    if (producto.stock === 0) return

    setAgregando(true)

    // Agregar al carrito
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen ?? null, // ← OBLIGATORIO
    })

    // Reset después de un breve delay
    setTimeout(() => {
      setAgregando(false)
    }, 500)
  }

  const incrementar = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1)
    }
  }

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  // Si no hay stock, mostrar solo el estado
  if (producto.stock === 0) {
    return (
      <div className={styles.agotadoContainer}>
        <span className={styles.agotadoTexto}>Producto agotado</span>
        <p className={styles.agotadoDescripcion}>
          Recibirá una notificación cuando esté disponible nuevamente.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.carritoContainer}>
      <div className={styles.cantidadWrapper}>
        <span className={styles.cantidadLabel}>Cantidad:</span>
        <div className={styles.controlesCantidad}>
          <button
            className={styles.botonCantidad}
            onClick={decrementar}
            disabled={cantidad <= 1}
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className={styles.cantidadDisplay}>{cantidad}</span>
          <button
            className={styles.botonCantidad}
            onClick={incrementar}
            disabled={cantidad >= producto.stock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.subtotal}>
        <span className={styles.subtotalLabel}>Subtotal:</span>
        <span className={styles.subtotalValor}>
          {formatCOP(producto.precio * cantidad)}
        </span>
      </div>

      <button
        className={styles.botonAgregar}
        onClick={handleAgregar}
        disabled={agregando}
      >
        {agregando ? (
          <>
            <span className={styles.spinner} />
            Agregando...
          </>
        ) : (
          'Agregar al carrito'
        )}
      </button>
    </div>
  )
}
