export const ESTADOS_PEDIDO = [
  'PENDIENTE',
  'PROCESANDO',
  'LISTO',
  'ENTREGADO',
  'CANCELADO',
] as const

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number]
