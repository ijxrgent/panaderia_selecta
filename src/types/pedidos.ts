export type EstadoPedido =
  | 'PENDIENTE'
  | 'PROCESANDO'
  | 'LISTO'
  | 'ENTREGADO'
  | 'CANCELADO'

export type TipoEntrega = 'DOMICILIO' | 'RECOGER'

export interface PedidoItemDTO {
  productoId: number
  cantidad: number
}

export interface CrearPedidoDTO {
  items: PedidoItemDTO[]
  tipoEntrega: TipoEntrega
  direccionEntrega?: string

  // Invitado
  nombreCliente?: string
  telefonoCliente?: string
  emailCliente?: string
}

export interface PedidoItem {
  id: number
  cantidad: number
  precioUnit: number
  producto: {
    id: number
    nombre: string
    precio: number
    imagen?: string | null
  }
}

export interface Pedido {
  id: number
  total: number
  estado: EstadoPedido
  tipoEntrega: TipoEntrega

  archivado: boolean
  fechaArchivado: string | null

  direccionEntrega: string | null

  nombreCliente: string | null
  telefonoCliente: string | null
  emailCliente: string | null

  fechaSolicitud: string

  createdAt: string
  updatedAt: string

  usuario: {
    id: number
    email: string
    nombre: string | null
  } | null

  items: {
    id: number
    cantidad: number
    precioUnit: number
    producto: {
      id: number
      nombre: string
      precio: number
      imagen: string | null
    }
  }[]
}
