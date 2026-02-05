'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cartContext'
import { useAuth } from '@/context/authContext'
import type { CrearPedidoDTO, TipoEntrega } from '@/types/pedidos'

function mapDeliveryType(type: 'pickup' | 'delivery'): TipoEntrega {
  return type === 'delivery' ? 'DOMICILIO' : 'RECOGER'
}

export function useCheckout() {
  const router = useRouter()
  const { user, token } = useAuth()
  const { items, deliveryType, checkoutData, total, clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')
  const [emailCliente, setEmailCliente] = useState('')

  const submitPedido = async () => {
    setLoading(true)
    setError(null)

    try {
      if (items.length === 0) {
        throw new Error('El carrito está vacío')
      }

      if (deliveryType === 'delivery' && !checkoutData.direccion) {
        throw new Error('La dirección es obligatoria para domicilio')
      }

      if (!user && (!nombreCliente || !telefonoCliente)) {
        throw new Error('Nombre y teléfono son obligatorios')
      }

      const payload: CrearPedidoDTO = {
        items: items.map((item) => ({
          productoId: item.product.id,
          cantidad: item.quantity,
        })),
        tipoEntrega: mapDeliveryType(deliveryType),
        direccionEntrega:
          deliveryType === 'delivery' ? checkoutData.direccion : undefined,

        nombreCliente: user ? undefined : nombreCliente,
        telefonoCliente: user ? undefined : telefonoCliente,
        emailCliente: user ? undefined : emailCliente || undefined,
      }

      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data: unknown = await res.json()

      if (!res.ok) {
        const message =
          typeof data === 'object' && data !== null && 'error' in data
            ? String((data as { error: string }).error)
            : 'Error al crear pedido'
        throw new Error(message)
      }

      clearCart()
      router.replace('/mis-pedidos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    total,

    nombreCliente,
    telefonoCliente,
    emailCliente,
    setNombreCliente,
    setTelefonoCliente,
    setEmailCliente,

    submitPedido,
  }
}
