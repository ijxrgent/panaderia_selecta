//src/app/components/CategorySelect.tsx
'use client'

import styles from './styles/category.module.css'

interface Categoria {
  id: number
  nombre: string
}

interface CategorySelectProps {
  categories: Categoria[]
  value: number | ''
  onChange: (id: number | '') => void
  label?: string
}

export default function CategorySelect({
  categories,
  value,
  onChange,
  label = 'Categoría',
}: CategorySelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <select
        className={styles.select}
        value={value}
        onChange={(e) =>
          onChange(e.target.value === '' ? '' : Number(e.target.value))
        }
      >
        <option value="">Seleccione una categoría</option>

        {categories.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}
