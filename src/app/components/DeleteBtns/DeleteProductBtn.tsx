'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import ConfirmModal from '../ui/ConfirmModal'
import styles from './styles/deleteButton.module.css'

interface Props {
  productId: number
  onDeleted: (id: number) => void
}

export default function DeleteProductButton({ productId, onDeleted }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await apiFetch(`/api/productos/${productId}`, { method: 'DELETE' })
      onDeleted(productId)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className={styles.delete} onClick={() => setOpen(true)}>
        Eliminar
      </button>

      <ConfirmModal
        open={open}
        title="Eliminar producto"
        message=""
        description="¿Seguro que quieres eliminar este producto?"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  )
}
