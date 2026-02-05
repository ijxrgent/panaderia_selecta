'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './authContext'

interface Product {
  id: number
  nombre: string
  precio: number
  imagen?: string | null
}

interface CartItem {
  product: Product
  quantity: number
}

export type DeliveryType = 'pickup' | 'delivery'
export type PaymentMethod = 'EFECTIVO' | 'NEQUI' | 'DAVIPLATA'
export interface CheckoutData {
  paymentMethod?: 'efectivo' | 'nequi' | 'daviplata'
  paymentAmount?: number
  direccion?: string
}

interface CartContextType {
  items: CartItem[]

  deliveryType: DeliveryType
  setDeliveryType: (type: DeliveryType) => void

  checkoutData: CheckoutData
  setCheckoutData: (data: Partial<CheckoutData>) => void

  setPaymentMethod: (method: PaymentMethod) => void

  totalItems: number
  total: number

  addToCart: (product: Product) => void
  incrementQuantity: (productId: number) => void
  decrementQuantity: (productId: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup')
  const [checkoutData, setCheckoutDataState] = useState<CheckoutData>({})

  const storageKey = user ? `cart_v2_items_${user.id}` : 'cart_v2_items_guest'

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(storageKey)
      if (storedCart) {
        const parsed: CartItem[] = JSON.parse(storedCart)

        const normalized = parsed.map((item) => ({
          ...item,
          product: {
            ...item.product,
            imagen: item.product.imagen ?? null,
          },
        }))

        setItems(normalized)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
      setItems([])
    } finally {
      setIsInitialized(true)
    }
  }, [storageKey])

  // Guardar en localStorage cuando cambien los items
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items))
      } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error)
      }
    }
  }, [items, isInitialized, storageKey])

  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0
  )

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)

      let newItems
      if (existing) {
        newItems = prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...prev, { product, quantity: 1 }]
      }

      // No loguees aquí, usa el useEffect para debuggear
      return newItems
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const incrementQuantity = (productId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decrementQuantity = (productId: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          // Si la cantidad es 1, eliminar el producto
          if (item.quantity === 1) {
            return item // Mantenerlo para que se elimine con removeFromCart
          }
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
    )
  }

  // Opcional: función para limpiar el carrito
  const clearCart = () => {
    setItems([])
    setDeliveryType('pickup')
    setCheckoutDataState({})
    localStorage.removeItem(storageKey)
  }

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  const setCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutDataState((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    setCheckoutDataState((prev) => ({
      ...prev,
      paymentMethod: method.toLowerCase() as 'efectivo' | 'nequi' | 'daviplata',
    }))
  }

  // Para debuggear cambios en el carrito
  useEffect(() => {
    console.log('CART STATE UPDATED:', items)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryType,
        setDeliveryType,
        checkoutData,
        setCheckoutData,
        setPaymentMethod,
        totalItems,
        total,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
