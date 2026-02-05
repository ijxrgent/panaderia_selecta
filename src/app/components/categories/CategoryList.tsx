'use client'

import type { Categoria } from '@/types/categoria'
import styles from './styles/categoryList.module.css'
import DeleteCategoryButton from '../DeleteBtns/DeleteCategoryBtn'

interface CategoryListProps {
  categories: Categoria[]
  onCategoryDeleted: (id: number) => void
}

export default function CategoryList({
  categories,
  onCategoryDeleted,
}: CategoryListProps) {
  if (categories.length === 0) {
    return <p>No hay categorías creadas</p>
  }

  return (
    <ul className={styles.list}>
      {categories.map((categoria) => (
        <li key={categoria.id} className={styles.item}>
          {categoria.nombre}
          <DeleteCategoryButton
            categoryId={categoria.id}
            onDeleted={onCategoryDeleted}
          />
        </li>
      ))}
    </ul>
  )
}
