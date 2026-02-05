// src/app/components/panaderia/PanaderiaHero.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import styles from './styles/panaderiaHero.module.css'

interface FloatingBread {
  id: number
  emoji: string
  size: number
  top: number
  left: number
  speed: number
  rotation: number
  opacity: number
}

// Mover la función fuera del componente para evitar recreaciones
const getRandomBreadEmoji = () => {
  const breads = ['🥖', '🥨', '🥐', '🍞', '🥪', '🥯', '🫓', '🥠', '🥮', '🌾']
  return breads[Math.floor(Math.random() * breads.length)]
}

// Crear panes iniciales fuera del componente
const createInitialBreads = (): FloatingBread[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    emoji: getRandomBreadEmoji(),
    size: Math.random() * 40 + 20, // 20px a 60px
    top: Math.random() * 100,
    left: Math.random() * 100,
    speed: Math.random() * 0.5 + 0.2, // Velocidad
    rotation: Math.random() * 360,
    opacity: Math.random() * 0.4 + 0.2, // 0.2 a 0.6
  }))
}

export default function PanaderiaHero() {
  // Usar el estado inicial directamente
  const [breads, setBreads] = useState<FloatingBread[]>(() =>
    createInitialBreads()
  )
  const animationRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    const updateBreads = (timestamp: number) => {
      // Controlar la frecuencia de actualización (60 FPS máximo)
      if (timestamp - lastUpdateRef.current < 16) {
        animationRef.current = requestAnimationFrame(updateBreads)
        return
      }

      lastUpdateRef.current = timestamp

      setBreads((prev) =>
        prev.map((bread) => ({
          ...bread,
          left: (bread.left + bread.speed) % 110,
          top: (bread.top + bread.speed * 0.7) % 110,
          rotation: bread.rotation + 0.5,
        }))
      )

      animationRef.current = requestAnimationFrame(updateBreads)
    }

    // Iniciar la animación
    animationRef.current = requestAnimationFrame(updateBreads)

    // Limpiar al desmontar
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, []) // Vacío porque no depende de nada externo

  return (
    <section className={styles.hero}>
      {/* Fondo animado de panes flotantes */}
      <div className={styles.floatingBackground}>
        {breads.map((bread) => (
          <div
            key={bread.id}
            className={styles.floatingBread}
            style={{
              fontSize: `${bread.size}px`,
              top: `${bread.top}%`,
              left: `${bread.left}%`,
              transform: `rotate(${bread.rotation}deg)`,
              opacity: bread.opacity,
              animationDelay: `${bread.id * 0.2}s`,
            }}
          >
            {bread.emoji}
          </div>
        ))}

        {/* Capas de gradientes para profundidad */}
        <div className={styles.gradientLayer1} />
        <div className={styles.gradientLayer2} />
        <div className={styles.gradientLayer3} />
      </div>

      {/* Contenido principal */}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Desde 1996</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleLine}>Sabor que</span>
            <span className={styles.titleAccent}>traspasa generaciones</span>
          </h1>

          <p className={styles.subtitle}>
            Cada día, nuestro horno artesano da vida al pan más auténtico, hecho
            con la paciencia y el amor que solo tres décadas pueden dar.
          </p>

          {/* Stats/Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🥖</div>
              <span className={styles.featureText}>Ingredientes naturales</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔥</div>
              <span className={styles.featureText}>Horneado tradicional</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>❤️</div>
              <span className={styles.featureText}>Hecho con amor</span>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaContainer}>
            <Link href="/productos" className={styles.ctaPrimary}>
              Explorar productos
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <Link href="/nosotros" className={styles.ctaSecondary}>
              Conoce nuestra historia
            </Link>
          </div>
        </div>
      </div>

      {/* Elemento decorativo de trigo animado */}
      <div className={styles.decoration}>
        <div className={styles.wheatIcon}>🌾</div>
        <div className={styles.wheatIcon} style={{ animationDelay: '0.5s' }}>
          🌾
        </div>
        <div className={styles.wheatIcon} style={{ animationDelay: '1s' }}>
          🌾
        </div>
      </div>
    </section>
  )
}
