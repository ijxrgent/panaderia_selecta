'use client'

import Image from 'next/image'
import { formatCOP } from '@/lib/formatCurrency'
import Link from 'next/link'
import styles from './styles/productCard.module.css'
import { getImageUrl } from '@/lib/image-utils'

interface Product {
  id: number
  nombre: string
  precio: number
  imagen?: string | null // ← CAMBIAR de imageUrl a imagen
}

interface Props {
  product: Product
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  const imageUrl = getImageUrl(product.imagen)
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.nombre}
            width={400}
            height={200}
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className={styles.placeholder}>Sin imagen</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.nombre}</h3>
          <span className={styles.price}>{formatCOP(product.precio)}</span>
        </div>

        <div className={styles.actions}>
          <Link href={`/productos/${product.id}`} className={styles.details}>
            Ver detalles
          </Link>

          <button
            className={styles.add}
            onClick={() => {
              console.log('ADD', product)
              onAddToCart?.(product)
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
