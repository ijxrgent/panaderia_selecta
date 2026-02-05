// src/components/ui/Pagination.tsx
'use client'

import styles from './styles/pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean // <-- Nueva prop opcional
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false, // <-- Valor por defecto
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Función para manejar el clic considerando el estado disabled
  const handlePageClick = (page: number) => {
    if (!disabled) {
      onPageChange(page)
    }
  }

  return (
    <nav className={`${styles.pagination} ${disabled ? styles.disabled : ''}`}>
      <button
        className={styles.arrow}
        disabled={disabled || currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        ←
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.page} ${
            page === currentPage ? styles.active : ''
          }`}
          disabled={disabled}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={styles.arrow}
        disabled={disabled || currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        →
      </button>
    </nav>
  )
}
