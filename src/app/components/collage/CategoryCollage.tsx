'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './category-collage.module.css'

interface Product {
  id: number
  nombre: string
  imagen: string
  categoria: {
    nombre: string
  }
}

interface Props {
  products: Product[] // uno por categoría
}

export default function CategoryCollage({ products }: Props) {
  return (
    <section className={styles.collage}>
      {products.map((product, index) => (
        <Link
          key={product.id}
          href={`/productos/${product.id}`}
          className={`${styles.item} ${styles[`item${index + 1}`]}`}
        >
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            className={styles.image}
            priority={index === 0}
          />

          <div className={styles.overlay}>
            <span className={styles.category}>{product.categoria.nombre}</span>
            <h3>{product.nombre}</h3>
          </div>
        </Link>
      ))}
    </section>
  )
}
