// src/app/contacto/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './styles/contacto.module.css'

// Datos de los canales de contacto
const canalesData = [
  {
    id: 'whatsapp',
    nombre: 'WhatsApp',
    icono: '💬',
    descripcion: 'Escribenos directamente para pedidos y consultas',
    enlace: 'https://wa.me/573177779390',
    horario: '8:00 AM - 8:00 PM',
    color: '#25D366',
  },
  {
    id: 'instagram',
    nombre: 'Instagram',
    icono: '📱',
    descripcion: 'Síguenos y envíanos mensaje por DM',
    enlace: 'https://www.instagram.com/panaderiaselectacol/',
    horario: '24/7',
    color: 'linear-gradient(45deg, #405DE6, #E1306C, #FFDC80)',
  },
]

const horariosData = [
  { dias: 'Lunes a Viernes', horas: '7:00 AM - 9:00 PM' },
  { dias: 'Sábados', horas: '7:00 AM - 10:00 PM' },
  { dias: 'Domingos y Festivos', horas: '7:00 AM - 8:00 PM' },
]

const ubicacionData = {
  direccion: 'Calle 27 #7-68, Centro Histórico, Riohacha, La Guajira',
  mapaUrl: 'https://maps.google.com/?q=Calle+27+7-68+Riohacha+La+Guajira',
  nota: 'Al lado del colegio Un Mundo Nuevo',
}

export default function Contacto() {
  const [activeCanal, setActiveCanal] = useState('whatsapp')

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Estamos aquí
            <br />
            <span className={styles.heroHighlight}>para atenderte</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Contáctanos por tu medio preferido
          </p>
        </div>
      </section>

      {/* Canales de Contacto */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Escríbenos directamente</h2>
          <p className={styles.sectionSubtitle}>
            Te responderemos lo más pronto posible
          </p>
        </div>

        <div className={styles.canalesGrid}>
          {canalesData.map((canal) => (
            <div
              key={canal.id}
              className={`${styles.canalCard} ${
                activeCanal === canal.id ? styles.activeCanal : ''
              }`}
              onClick={() => setActiveCanal(canal.id)}
              style={{ '--color-canal': canal.color } as React.CSSProperties}
            >
              <div className={styles.canalHeader}>
                <div className={styles.canalIcon}>{canal.icono}</div>
                <h3 className={styles.canalNombre}>{canal.nombre}</h3>
              </div>

              <div className={styles.canalContent}>
                <p className={styles.canalDesc}>{canal.descripcion}</p>

                <div className={styles.canalHorario}>
                  <span className={styles.horarioIcon}>🕐</span>
                  <span className={styles.horarioText}>{canal.horario}</span>
                </div>

                <a
                  href={canal.enlace}
                  className={styles.canalButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Abrir {canal.nombre}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Información de Contacto */}
      <section className={styles.section}>
        <div className={styles.infoGrid}>
          {/* Ubicación */}
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>📍</div>
              <h3 className={styles.infoTitle}>Nuestra Ubicación</h3>
            </div>

            <div className={styles.infoContent}>
              <p className={styles.ubicacionTexto}>{ubicacionData.direccion}</p>
              {ubicacionData.nota && (
                <p className={styles.ubicacionNota}>{ubicacionData.nota}</p>
              )}

              {ubicacionData.mapaUrl && (
                <a
                  href={ubicacionData.mapaUrl}
                  className={styles.mapaButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en Google Maps
                  <span className={styles.mapaIcon}>🗺️</span>
                </a>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIcon}>🕐</div>
              <h3 className={styles.infoTitle}>Horarios de Atención</h3>
            </div>

            <div className={styles.infoContent}>
              <div className={styles.horariosLista}>
                {horariosData.map((horario, index) => (
                  <div key={index} className={styles.horarioItem}>
                    <span className={styles.horarioDias}>{horario.dias}</span>
                    <span className={styles.horarioHoras}>{horario.horas}</span>
                  </div>
                ))}
              </div>

              <div className={styles.horarioNota}>
                <p>⏰ Pedidos especiales: con 24h de anticipación</p>
                <p>🚚 Delivery disponible en Riohacha</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nota Final */}
      <div className={styles.notaFinal}>
        <div className={styles.notaContent}>
          <div className={styles.notaIcon}>💡</div>
          <div>
            <p className={styles.notaTexto}>
              <strong>¿Necesitas ayuda inmediata?</strong> Usa el botón flotante
              de WhatsApp para una respuesta más rápida.
            </p>
            <p className={styles.notaSubtexto}>
              Todos nuestros canales son atendidos por personal capacitado.
              ¡Estamos aquí para servirte!
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Listo para tu próximo pedido?</h2>
          <p className={styles.ctaText}>
            Haz tu pedido ahora y recibe el auténtico sabor de Riohacha
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/productos" className={styles.ctaButtonPrimary}>
              Ver nuestro menú
            </Link>
            <a
              href="https://wa.me/5211234567890"
              className={styles.ctaButtonSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ordenar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
