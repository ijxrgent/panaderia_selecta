'use client'

import styles from './styles/confirmModal.module.css'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  message: string
  confirmText?: string
  cancelText?: string
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            onClick={onCancel}
            className={styles.cancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={styles.confirm}
            disabled={loading}
          >
            {loading ? 'Eliminando…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
