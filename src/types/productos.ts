export interface Categoria {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
  detallesAdicionales?: string
  categoriaId: number
  imagen?: string | null
  categoria?: Categoria
  activo?: boolean
}

export interface ProductState {
  products: Producto[]
  loading: boolean
  error: string | null
  total: number
}
