'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import ConfirmModal from '../ui/ConfirmModal'
import styles from './styles/deleteButton.module.css'

interface Props {
  categoryId: number
  onDeleted: (id: number) => void
}

interface ApiError {
  status?: number
  message?: string
}

export default function DeleteCategoryButton({ categoryId, onDeleted }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // modal de error
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = async () => {
    setLoading(true)

    try {
      await apiFetch(`/api/categorias/${categoryId}`, {
        method: 'DELETE',
      })

      onDeleted(categoryId)
      setOpen(false)
    } catch (err) {
      const error = err as ApiError

      if (error.status === 409) {
        setErrorMessage(
          error.message ??
            'No se puede eliminar la categoría porque tiene productos asociados.'
        )
      } else {
        setErrorMessage('Error al eliminar la categoría.')
      }

      setOpen(false)
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className={styles.delete} onClick={() => setOpen(true)}>
        Eliminar
      </button>

      {/* 🧨 MODAL CONFIRMACIÓN */}
      <ConfirmModal
        open={open}
        title="Eliminar categoría"
        description="Acción irreversible"
        message="¿Seguro que quieres eliminar esta categoría? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />

      {/* 🚫 MODAL ERROR */}
      <ConfirmModal
        open={errorOpen}
        title="No se puede eliminar la categoría"
        description="Categoría en uso"
        message={errorMessage}
        confirmText="Entendido"
        cancelText=""
        onCancel={() => setErrorOpen(false)}
        onConfirm={() => setErrorOpen(false)}
      />
    </>
  )
}
