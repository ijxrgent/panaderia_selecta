'use client'

import { useCheckout } from './hooks/useCheckout'
import { useCart } from '@/context/cartContext'
import { useAuth } from '@/context/authContext'

export default function CheckoutPage() {
  const { user } = useAuth()
  const {
    items,
    deliveryType,
    setDeliveryType,
    checkoutData,
    setCheckoutData,
    total,
  } = useCart()

  const {
    loading,
    error,
    submitPedido,
    nombreCliente,
    telefonoCliente,
    emailCliente,
    setNombreCliente,
    setTelefonoCliente,
    setEmailCliente,
  } = useCheckout()

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>Tu carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      {/* ================= ENTREGA ================= */}
      <section>
        <h2>Tipo de entrega</h2>

        <label>
          <input
            type="radio"
            value="pickup"
            checked={deliveryType === 'pickup'}
            onChange={() => setDeliveryType('pickup')}
          />
          Recoger en el local
        </label>

        <label>
          <input
            type="radio"
            value="delivery"
            checked={deliveryType === 'delivery'}
            onChange={() => setDeliveryType('delivery')}
          />
          Domicilio
        </label>

        {deliveryType === 'delivery' && (
          <div>
            <input
              type="text"
              placeholder="Dirección de entrega"
              value={checkoutData.direccion ?? ''}
              onChange={(e) => setCheckoutData({ direccion: e.target.value })}
            />
          </div>
        )}
      </section>

      {/* ================= DATOS CLIENTE ================= */}
      {!user && (
        <section>
          <h2>Datos del cliente</h2>

          <input
            type="text"
            placeholder="Nombre completo"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Teléfono"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email (opcional)"
            value={emailCliente}
            onChange={(e) => setEmailCliente(e.target.value)}
          />
        </section>
      )}

      {/* ================= RESUMEN ================= */}
      <section>
        <h2>Resumen</h2>

        <ul>
          {items.map((item) => (
            <li key={item.product.id}>
              {item.product.nombre} × {item.quantity} — $
              {item.product.precio * item.quantity}
            </li>
          ))}
        </ul>

        <p>
          <strong>Total:</strong> ${total}
        </p>
      </section>

      {/* ================= ERRORES ================= */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ================= ACCIÓN ================= */}
      <button onClick={submitPedido} disabled={loading}>
        {loading ? 'Procesando…' : 'Confirmar pedido'}
      </button>
    </div>
  )
}
