'use client'

import { useCart } from '@/context/cartContext'
import { formatCOP } from '@/lib/formatCurrency'
import styles from './page.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShoppingBag,
  FaDollarSign,
  FaCheck,
  FaChevronDown,
} from 'react-icons/fa'
import { FaMobileScreen } from 'react-icons/fa6'
import type { PaymentMethod } from '@/context/cartContext'
import { useAuth } from '@/context/authContext'

export default function IrARecogerPage() {
  const router = useRouter()
  const {
    items,
    total,
    deliveryType,
    checkoutData,
    setCheckoutData,
    clearCart,
  } = useCart()
  const { token } = useAuth()

  const [paymentMethod, setLocalPaymentMethod] =
    useState<PaymentMethod>('EFECTIVO')
  const [cashAmount, setCashAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)

  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')

  const paymentOptions: {
    id: PaymentMethod
    label: string
    note?: string
  }[] = [
    { id: 'EFECTIVO', label: 'Efectivo' },
    { id: 'NEQUI', label: 'Nequi', note: '(requiere comprobante)' },
    { id: 'DAVIPLATA', label: 'Daviplata', note: '(requiere comprobante)' },
  ]

  const amount = parseFloat(cashAmount) || 0
  const change =
    paymentMethod === 'EFECTIVO' && amount > total ? amount - total : 0

  const handleConfirmOrder = async () => {
    try {
      setLoading(true)

      const payload = {
        items: items.map((i) => ({
          productoId: i.product.id,
          cantidad: i.quantity,
        })),
        tipoEntrega: deliveryType === 'pickup' ? 'RECOGER' : 'DOMICILIO',
        direccionEntrega: checkoutData.direccion || null,

        ...(token
          ? {}
          : {
              nombreCliente,
              telefonoCliente,
            }),

        metodoPago: paymentMethod,
        montoPago: paymentMethod === 'EFECTIVO' ? amount : undefined,
      }

      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('ERROR CREANDO PEDIDO:', res.status, data)
        throw new Error(data.error || 'Error al crear pedido')
      }

      alert(data.mensaje)
      clearCart()
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Error inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setLocalPaymentMethod(method)
    const paymentMap = {
      EFECTIVO: 'efectivo',
      NEQUI: 'nequi',
      DAVIPLATA: 'daviplata',
    } as const

    setCheckoutData({
      paymentMethod: paymentMap[method],
    })

    setShowPaymentOptions(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {deliveryType === 'pickup' ? 'Recoger en tienda' : 'Confirmar pedido'}
        </h1>
        <p className={styles.subtitle}>Panadería Selecta</p>
      </header>

      <div className={styles.grid}>
        {/* IZQUIERDA */}
        <div className={styles.leftColumn}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaMapMarkerAlt className={styles.icon} />
              <h3>Dirección</h3>
            </div>

            {deliveryType === 'pickup' ? (
              <div className={styles.address}>
                <p className={styles.addressLine}>Calle 27 #7-68</p>
                <div className={styles.contact}>
                  <FaMobileScreen className={styles.smallIcon} />
                  <span>317 777 9390</span>
                </div>
                <p className={styles.hours}>6:00 AM - 8:00 PM</p>
              </div>
            ) : (
              <p>{checkoutData.direccion}</p>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaShoppingBag className={styles.icon} />
              <h3>Total a pagar</h3>
            </div>
            <p className={styles.totalAmount}>{formatCOP(total)}</p>
          </section>
        </div>

        {/* DERECHA */}
        <div className={styles.rightColumn}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaMoneyBillWave className={styles.icon} />
              <h3>Forma de pago</h3>
            </div>

            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => setShowPaymentOptions(!showPaymentOptions)}
              >
                <span>
                  {paymentOptions.find((p) => p.id === paymentMethod)?.label}
                </span>
                <FaChevronDown />
              </button>

              {showPaymentOptions && (
                <div className={styles.dropdownMenu}>
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      className={styles.dropdownItem}
                      onClick={() => handlePaymentMethodChange(option.id)}
                    >
                      {option.label} {option.note}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {paymentMethod === 'EFECTIVO' && (
              <div className={styles.paymentInput}>
                <FaDollarSign />
                <input
                  type="number"
                  placeholder="¿Con cuánto pagarás?"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  min="0"
                  step="100"
                />

                {amount >= total && amount > 0 && (
                  <p className={styles.changeText}>
                    Cambio: {formatCOP(change)}
                  </p>
                )}
              </div>
            )}
          </section>

          {!token && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FaMobileScreen className={styles.icon} />
                <h3>Datos de contacto</h3>
              </div>

              <input
                type="text"
                placeholder="Tu nombre"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className={styles.input}
              />

              <input
                type="tel"
                placeholder="Tu teléfono"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
                className={styles.input}
              />
            </section>
          )}

          <button
            className={styles.confirmBtn}
            onClick={handleConfirmOrder}
            disabled={
              loading ||
              (paymentMethod === 'EFECTIVO' && (amount < total || !cashAmount))
            }
          >
            <FaCheck /> {loading ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
