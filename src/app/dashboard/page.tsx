'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api'
import type { Categoria } from '@/types/categoria'

import CategorySelect from '../components/categories/CategorySelect'
import ProductForm from '../components/products/ProductForm'
import CategoryForm from '../components/categories/CategoryForm'
import CategoryList from '../components/categories/CategoryList'
import ProductList from '../components/products/ProductList'
import Pagination from '../components/ui/Pagination'

import { useProductos } from '../productos/hooks/useProducts'

import Link from 'next/link'
import { FaClipboardList } from 'react-icons/fa'

import styles from './styles/page.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // -----------------------------
  // URL params (igual que /productos)
  // -----------------------------
  const currentPage = parseInt(searchParams.get('page') || '1')
  const searchFromUrl = searchParams.get('search') || ''
  const categoriaFromUrl = searchParams.get('categoriaId') || ''
  const limit = 10

  const categoriaId =
    categoriaFromUrl && !isNaN(Number(categoriaFromUrl))
      ? Number(categoriaFromUrl)
      : ''

  // -----------------------------
  // Estados locales UI
  // -----------------------------
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaIdForm, setCategoriaIdForm] = useState<number | ''>('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [deletingProducts, setDeletingProducts] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  // -----------------------------
  // Productos PAGINADOS (fuente ÚNICA)
  // -----------------------------
  const { products, total, loading, refetch } = useProductos({
    page: currentPage,
    limit,
    buscar: searchFromUrl,
    categoriaId,
  })

  // -----------------------------
  // Cargar categorías
  // -----------------------------
  useEffect(() => {
    apiFetch('/api/categorias')
      .then((data: Categoria[]) => setCategorias(data))
      .catch((err) => setError(err.message))
  }, [])

  // -----------------------------
  // Actualizar URL (igual que /productos) - CORREGIDO
  // -----------------------------
  const updateURLParams = useCallback(
    (updates: {
      page?: number
      search?: string
      categoriaId?: number | ''
    }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.page !== undefined) {
        if (updates.page === 1) {
          params.delete('page')
        } else {
          params.set('page', updates.page.toString())
        }
      }

      if (updates.search !== undefined) {
        if (updates.search === '') {
          params.delete('search')
        } else {
          params.set('search', updates.search)
        }
      }

      if (updates.categoriaId !== undefined) {
        if (updates.categoriaId === '') {
          params.delete('categoriaId')
        } else {
          params.set('categoriaId', updates.categoriaId.toString())
        }
      }

      // Resetear a página 1 cuando cambia búsqueda o categoría
      if (
        updates.page === undefined &&
        (updates.search !== undefined || updates.categoriaId !== undefined)
      ) {
        params.delete('page')
      }

      router.push(`/dashboard?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updateURLParams({ page })
    },
    [updateURLParams]
  )

  // -----------------------------
  // Eliminar productos
  // -----------------------------
  const handleProductDeleted = async (ids: number | number[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids]
    setDeletingProducts(idsArray)

    try {
      refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setDeletingProducts([])
    }
  }

  // -----------------------------
  // Render
  // -----------------------------
  if (error) return <p>Error: {error}</p>

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.section}>
        <div className="actions">
          <button
            onClick={() => {
              setShowProductForm(true)
              setShowCategoryForm(false)
            }}
            className={styles.primaryButton}
          >
            + Crear producto
          </button>

          <button
            onClick={() => {
              setShowCategoryForm(true)
              setShowProductForm(false)
            }}
            className={styles.secondaryButton}
          >
            + Crear categoría
          </button>
          <Link
            href="/dashboard/pedidos"
            className={`${styles.actionButton} ${styles.secondary}`}
          >
            <FaClipboardList />
            <span>Ver pedidos</span>
          </Link>
        </div>
      </div>

      {showProductForm && (
        <div className={styles.section}>
          <CategorySelect
            categories={categorias}
            value={categoriaIdForm}
            onChange={setCategoriaIdForm}
          />

          <ProductForm
            categoriaId={categoriaIdForm}
            onCreated={() => {
              setShowProductForm(false)
              router.push('/dashboard?page=1')
              router.refresh()
              refetch()
            }}
          />
        </div>
      )}

      {showCategoryForm && (
        <div className={styles.section}>
          <CategoryForm
            onCreated={(categoria) => {
              setCategorias((prev) => [...prev, categoria])
              setCategoriaIdForm(categoria.id)
              setShowCategoryForm(false)
            }}
          />
        </div>
      )}

      <div className={styles.section}>
        <h2>Categorías</h2>
        <CategoryList
          categories={categorias}
          onCategoryDeleted={(id) =>
            setCategorias((prev) => prev.filter((c) => c.id !== id))
          }
        />
      </div>

      <div className={styles.section}>
        <ProductList
          products={products}
          deletingProducts={deletingProducts}
          onProductDeleted={handleProductDeleted}
        />
      </div>

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / limit)}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      )}
    </div>
  )
}
