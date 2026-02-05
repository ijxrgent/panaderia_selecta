'use client'

import { useCallback, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductGrid from '../components/products/ProductGrid'
import CustomDropdown from './CustomDropdown'
import styles from './page.module.css'
import { useCart } from '@/context/cartContext'
import Pagination from '../components/ui/Pagination'
import { useProductos } from './hooks/useProducts'
import { useCategorias } from './hooks/useCategories'
import { SearchIcon } from '../components/ui/Icons'

export default function ProductosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Leer parámetros de la URL
  const currentPage = parseInt(searchParams.get('page') || '1')
  const searchFromUrl = searchParams.get('search') || ''
  const categoriaFromUrl = searchParams.get('categoriaId') || ''

  const limit = 10

  // Convertir categoriaFromUrl a number o string vacío
  const categoriaId = categoriaFromUrl
    ? isNaN(Number(categoriaFromUrl))
      ? ''
      : Number(categoriaFromUrl)
    : ''

  // Estado local para el input de búsqueda
  const [localSearch, setLocalSearch] = useState(searchFromUrl)
  const [isSearching, setIsSearching] = useState(false)

  // Sincronizar el estado local cuando cambia la URL
  useEffect(() => {
    setLocalSearch(searchFromUrl)
  }, [searchFromUrl])

  // Agrega esto al componente ProductosPage, después de los otros hooks
  useEffect(() => {
    console.log('Categoría desde URL:', {
      categoriaFromUrl,
      categoriaId,
      searchParams: searchParams.toString(),
    })
  }, [categoriaFromUrl, categoriaId, searchParams])

  // Usar hooks personalizados
  const { products, total, loading, error } = useProductos({
    page: currentPage,
    limit,
    buscar: searchFromUrl,
    categoriaId,
  })

  console.log('📊 Productos en página:', {
    total: total,
    productsCount: products.length,
    categoriaId,
    searchFromUrl,
  })

  const { categorias } = useCategorias()
  const { addToCart } = useCart()

  // Función para actualizar la URL con los filtros
  const updateURLParams = useCallback(
    (updates: {
      page?: number
      search?: string
      categoriaId?: number | ''
    }) => {
      const params = new URLSearchParams(searchParams.toString())

      // Manejar página
      if (updates.page !== undefined) {
        if (updates.page === 1) {
          params.delete('page')
        } else {
          params.set('page', updates.page.toString())
        }
      }

      // Manejar búsqueda
      if (updates.search !== undefined) {
        if (updates.search === '') {
          params.delete('search')
        } else {
          params.set('search', updates.search)
        }
      }

      // Manejar categoría
      if (updates.categoriaId !== undefined) {
        if (updates.categoriaId === '') {
          params.delete('categoriaId')
        } else {
          params.set('categoriaId', updates.categoriaId.toString())
        }
      }

      // Resetear a página 1 cuando cambian filtros (excepto si ya estamos cambiando página)
      if (
        updates.page === undefined &&
        (updates.search !== undefined || updates.categoriaId !== undefined)
      ) {
        params.delete('page')
      }

      router.push(`/productos?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  // Handler para cambio de página
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateURLParams({ page: newPage })
    },
    [updateURLParams]
  )

  // Handler para búsqueda local
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }

  // Handler para enviar búsqueda (con botón o Enter)
  const handleSearchSubmit = useCallback(() => {
    if (localSearch !== searchFromUrl) {
      setIsSearching(true)
      updateURLParams({ search: localSearch })

      // Pequeño delay para mostrar feedback visual
      setTimeout(() => setIsSearching(false), 300)
    }
  }, [localSearch, searchFromUrl, updateURLParams])

  // Handler para tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Handler para limpiar búsqueda
  const handleClearSearch = useCallback(() => {
    setLocalSearch('')
    updateURLParams({ search: '' })
  }, [updateURLParams])

  // Handler para cambio de categoría
  const handleCategoryChange = useCallback(
    (value: number | '') => {
      console.log('🔘 Categoría seleccionada:', value)
      updateURLParams({ categoriaId: value })
    },
    [updateURLParams]
  )

  // Preparar opciones para el dropdown
  const dropdownOptions = [
    { id: '' as const, nombre: 'Todas las categorías' },
    ...categorias.map((c) => ({ id: c.id, nombre: c.nombre })),
  ]

  // Estados de carga y error
  if (loading && currentPage === 1) {
    return <p className={styles.status}>Cargando productos…</p>
  }

  if (error) {
    return <p className={styles.error}>{error}</p>
  }

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Nuestros productos</h1>

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar producto…"
            value={localSearch}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={styles.search}
          />
          <button
            onClick={handleSearchSubmit}
            disabled={isSearching || localSearch === searchFromUrl}
            className={styles.searchButton}
            title="Buscar"
            aria-label="Buscar productos"
          >
            <SearchIcon className={styles.searchIcon} />
          </button>
        </div>

        <div className={styles.dropdownContainer}>
          <CustomDropdown
            options={dropdownOptions}
            value={categoriaId}
            onChange={handleCategoryChange}
            placeholder="Todas las categorías"
          />
        </div>
      </div>

      {/* Mostrar estado de búsqueda */}
      {searchFromUrl && (
        <div className={styles.searchStatus}>
          <span>
            Resultados para: <strong>{searchFromUrl}</strong>
          </span>
          <button onClick={handleClearSearch} className={styles.clearButton}>
            Limpiar
          </button>
        </div>
      )}

      {/* Loading durante búsqueda o cambio de página */}
      {loading && currentPage > 1 && (
        <div className={styles.loadingMore}>Cargando más productos...</div>
      )}

      <ProductGrid
        products={products}
        onAddToCart={(product) => addToCart(product)}
      />

      {/* Paginación - solo mostrar si hay productos */}
      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / limit)}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      )}
    </section>
  )
}
