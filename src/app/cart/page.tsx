// src/app/cart/page.tsx
'use client'

import { useCart } from '@/context/cartContext'
import { formatCOP } from '@/lib/formatCurrency'
import { FiTrash2 } from 'react-icons/fi'
import { FiMinus, FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import styles from './styles/page.module.css'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/image-utils' // ← AÑADIR ESTA IMPORTACIÓN

export default function CarritoPage() {
  const {
    items,
    deliveryType,
    setDeliveryType,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart()

  const router = useRouter()

  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0
  )

  if (items.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <h1 className={styles.title}>Mi Carrito</h1>
        <div className={styles.emptyCart}>
          <p>Tu carrito está vacío</p>
          <Link href="/productos" className={styles.continueLink}>
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Mi Carrito</h1>

      <div className={styles.cartContent}>
        <div className={styles.productsSection}>
          {items.map(({ product, quantity }) => {
            // OBTENER LA URL DE LA IMAGEN USANDO getImageUrl
            const imageUrl = product.imagen
              ? getImageUrl(product.imagen)
              : '/placeholder.png'

            console.log('IMAGEN EN CARRITO 👉', product.imagen)
            console.log('URL FINAL 👉', imageUrl)
            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.nombre}
                      width={100}
                      height={100}
                      className={styles.image}
                      unoptimized
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>🥐</div>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.nombre}</h3>
                  <p className={styles.productPrice}>
                    {formatCOP(product.precio)}
                  </p>

                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => {
                        if (quantity === 1) {
                          removeFromCart(product.id)
                        } else {
                          decrementQuantity(product.id)
                        }
                      }}
                    >
                      <FiMinus />
                    </button>
                    <span className={styles.quantity}>{quantity}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => incrementQuantity(product.id)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className={styles.productActions}>
                  <p className={styles.itemTotal}>
                    {formatCOP(product.precio * quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className={styles.removeBtn}
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCOP(total)}</span>
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>{formatCOP(total)}</span>
            </div>

            <div className={styles.paymentMethods}>
              <h3 className={styles.paymentTitle}>Método de entrega</h3>
              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                  />
                  <span>Recoger en la panadería</span>
                </label>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={() => setDeliveryType('delivery')}
                  />
                  <span>A domicilio</span>
                </label>
              </div>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => {
                if (deliveryType === 'pickup') {
                  router.push('/ir-a-recoger')
                } else {
                  router.push('/envio')
                }
              }}
            >
              Siguiente
            </button>

            <Link href="/productos" className={styles.continueLink}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
