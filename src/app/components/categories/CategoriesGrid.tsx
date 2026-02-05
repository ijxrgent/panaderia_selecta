'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './styles/categories-grid.module.css'
import type { Categoria } from '@/types/categoria'
import { getImageUrl } from '@/lib/image-utils'

interface Props {
  categories: Categoria[]
}

export default function CategoriesGrid({ categories }: Props) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <p>No hay categorías</p>
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Menú</h2>
      <div className={styles.grid}>
        {categories.map((cat) => {
          const imageUrl = getImageUrl(cat.imagen)

          return (
            <Link
              key={cat.id}
              href={`/productos?categoriaId=${cat.id}`} // Cambia esta línea
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={cat.nombre}
                    width={350}
                    height={250}
                    className={styles.image}
                    unoptimized={imageUrl.startsWith('/api/')}
                  />
                ) : (
                  <div className={styles.placeholder}>Sin imagen</div>
                )}
              </div>

              <h3 className={styles.name}>{cat.nombre}</h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
