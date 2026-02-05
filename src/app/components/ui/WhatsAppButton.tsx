'use client'

import styles from './styles/whatsAppBtn.module.css'
import { FaWhatsapp } from 'react-icons/fa'

interface WhatsAppButtonProps {
  phone: string // Ej: "573001234567"
  message?: string
}

export default function WhatsAppButton({
  phone,
  message = 'Hola, me gustaría hacer un pedido 🥐',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className={styles.icon} />
    </a>
  )
}
