'use client'

import styles from './actionbuttons.module.css'

interface Props {
  onCreateProduct: () => void
  onCreateCategory: () => void
}

export default function ActionButtons({
  onCreateProduct,
  onCreateCategory,
}: Props) {
  return (
    <div className={styles.container}>
      <button className={styles.primary} onClick={onCreateProduct}>
        + Crear producto
      </button>

      <button className={styles.secondary} onClick={onCreateCategory}>
        + Crear categoría
      </button>
    </div>
  )
}
