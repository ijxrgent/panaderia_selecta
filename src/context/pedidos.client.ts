interface CreatePedidoItem {
  productoId: number
  cantidad: number
}

interface CreatePedidoPayload {
  items: CreatePedidoItem[]
  tipoEntrega: 'DOMICILIO' | 'RECOGER'
  direccion?: string
  notas?: string
}

export async function createPedido(
  token: string,
  payload: CreatePedidoPayload
) {
  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Error al crear el pedido')
  }

  return data
}
