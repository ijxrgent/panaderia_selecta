'use client'

import { useState } from 'react'
import { FaTrash, FaTimes } from 'react-icons/fa'
import ConfirmModal from '../ui/ConfirmModal'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './styles/productList.module.css'
import Image from 'next/image'
import type { Producto } from '@/types/productos'
import { getImageUrl } from '@/lib/image-utils'
import { apiFetch } from '@/lib/api'

interface Props {
  products: Producto[]
  onProductDeleted: (id: number | number[]) => void
  deletingProducts?: number[]
  imageUrl?: string | null
}

export default function ProductList({ products, onProductDeleted }: Props) {
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const safeProducts = Array.isArray(products) ? products : []

  if (safeProducts.length === 0) {
    return <p className={styles.empty}>No hay productos creados</p>
  }

  const getProductImage = (product: Producto) => {
    return getImageUrl(product.imagen || product.imagen)
  }

  const toggleSelection = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const cancelSelection = () => {
    setSelectionMode(false)
    setSelectedIds([])
    setError(null)
  }

  const handleDeleteClick = () => {
    if (selectedIds.length > 0) {
      setShowConfirm(true)
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      console.log('🗑️ Eliminando productos:', selectedIds)

      // Eliminar uno por uno
      for (const id of selectedIds) {
        try {
          console.log(`Eliminando producto ID: ${id}`)
          await apiFetch(`/api/productos/${id}`, {
            method: 'DELETE',
          })
          console.log(`✅ Producto ${id} eliminado`)
        } catch (err) {
          console.error(`❌ Error eliminando producto ${id}:`, err)
          throw err
        }
      }

      // Notificar al componente padre
      onProductDeleted(selectedIds.length === 1 ? selectedIds[0] : selectedIds)

      // Limpiar
      setSelectedIds([])
      setSelectionMode(false)
      setShowConfirm(false)
    } catch (err) {
      console.error('❌ Error eliminando productos:', err)
      setError(
        err instanceof Error ? err.message : 'Error al eliminar productos'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setError(null)
  }

  const getModalTitle = () => {
    if (selectedIds.length === 1) {
      const product = products.find((p) => p.id === selectedIds[0])
      return `Eliminar "${product?.nombre}"`
    }
    return `Eliminar ${selectedIds.length} productos`
  }

  const getModalMessage = () => {
    if (error) {
      return `Error: ${error}`
    }

    if (selectedIds.length === 1) {
      return '¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.'
    }
    return `¿Seguro que quieres eliminar ${selectedIds.length} productos? Esta acción no se puede deshacer.`
  }

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div
        className={`${styles.header} ${selectionMode ? styles.headerSelection : ''}`}
      >
        {!selectionMode ? (
          <>
            <h2 className={styles.title}>Productos</h2>
            <button
              className={styles.iconButton}
              onClick={() => setSelectionMode(true)}
              title="Seleccionar productos"
            >
              <FaTrash />
            </button>
          </>
        ) : (
          <>
            <span className={styles.selectedCount}>
              {selectedIds.length} seleccionados
            </span>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                disabled={selectedIds.length === 0}
                onClick={handleDeleteClick}
                title="Eliminar productos seleccionados"
              >
                <FaTrash />
              </button>
              <button
                className={styles.iconButton}
                onClick={cancelSelection}
                title="Cancelar selección"
              >
                <FaTimes />
              </button>
            </div>
          </>
        )}
      </div>

      {/* GRID */}
      <div className={styles.contentContainer}>
        <div className={styles.grid}>
          {safeProducts.map((product) => {
            const imageUrl = getProductImage(product)

            return (
              <div key={product.id} className={styles.card}>
                {selectionMode && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.includes(product.id)}
                    onChange={(e) =>
                      toggleSelection(product.id, e.target.checked)
                    }
                  />
                )}

                <div className={styles.imageWrapper}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.nombre}
                      width={400}
                      height={120}
                      className={styles.image}
                      unoptimized={imageUrl.startsWith('/api/')}
                    />
                  ) : (
                    <div className={styles.placeholder}>Sin imagen</div>
                  )}
                </div>

                <div className={styles.content}>
                  <div className={styles.cardHeader}>
                    <span className={styles.name}>{product.nombre}</span>
                    <span className={styles.price}>
                      {formatCOP(product.precio)}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.category}>
                      {product.categoria?.nombre ?? 'Sin categoría'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        open={showConfirm}
        title={getModalTitle()}
        message={getModalMessage()}
        description=""
        confirmText={selectedIds.length === 1 ? 'Eliminar' : 'Eliminar todos'}
        cancelText="Cancelar"
        loading={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
