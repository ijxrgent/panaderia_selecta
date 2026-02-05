'use client'

import ProductCard from './ProductCard'
import styles from './styles/productGrid.module.css'
import { useCart } from '@/context/cartContext'

interface Product {
  id: number
  nombre: string
  precio: number
  imagen?: string | null
}

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart()

  if (!Array.isArray(products) || products.length === 0) {
    return <p className={styles.empty}>No hay productos disponibles</p>
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() =>
            addToCart({
              id: product.id,
              nombre: product.nombre,
              precio: product.precio,
              imagen: product.imagen ?? null,
            })
          }
        />
      ))}
    </div>
  )
}
