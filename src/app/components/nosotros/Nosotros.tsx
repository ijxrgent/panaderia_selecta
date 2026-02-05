// src/app/nosotros/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './styles/nosotros.module.css'

// Datos de la panadería
const historiaData = {
  titulo: 'Nuestra Historia',
  subtitulo: 'Más de 50 años horneando tradición',
  contenido: [
    {
      año: '1973',
      titulo: 'Los Inicios',
      descripcion:
        'En un pequeño local de Riohacha, comenzamos con un horno de leña y una receta familiar que pasó de generación en generación. El aroma del pan recién horneado pronto se convirtió en parte del paisaje de la ciudad.',
    },
    {
      año: '1985',
      titulo: 'El Sello Distintivo',
      descripcion:
        'Nuestro pan de queso se convirtió en leyenda. La combinación perfecta de queso costeño y masa fermentada naturalmente nos dio el sabor inconfundible que hoy nos caracteriza.',
    },
    {
      año: '2000',
      titulo: 'Tercera Generación',
      descripcion:
        'Los nietos de los fundadores asumen el negocio, combinando técnicas ancestrales con innovación. Expandimos nuestro catálogo manteniendo la calidad artesanal.',
    },
    {
      año: '2023',
      titulo: 'Presente y Futuro',
      descripcion:
        'Con más de 50 años de historia, seguimos siendo fieles a nuestras raíces. Cada día horneamos con el mismo amor y dedicación que en 1973.',
    },
  ],
}

const valoresData = [
  {
    icono: '👨‍🍳',
    titulo: 'Artesanía',
    descripcion:
      'Cada pieza es moldeada a mano, respetando los tiempos de fermentación naturales. No usamos conservantes ni aditivos.',
  },
  {
    icono: '🌾',
    titulo: 'Ingredientes Locales',
    descripcion:
      'Trabajamos con harineros y productores de la región. Nuestro queso proviene de fincas tradicionales de la Guajira.',
  },
  {
    icono: '🔥',
    titulo: 'Horneado Tradicional',
    descripcion:
      'Mantenemos hornos de ladrillo que conservan el calor y la humedad perfecta para cada tipo de pan.',
  },
  {
    icono: '❤️',
    titulo: 'Pasión Familiar',
    descripcion:
      'Somos una empresa familiar donde cada miembro aporta su sello personal. La receta original sigue siendo nuestro secreto mejor guardado.',
  },
]

const testimoniosData = [
  {
    texto:
      'La primera panadería de Riohacha, con más de 50 años de tradición, sigue viva en cada pan de queso recién salido del horno.',
    autor: 'El Espectador',
    fecha: '2022',
  },
  {
    texto:
      'Crujiente por fuera, suave por dentro. Para muchos, el mejor pan de queso del mundo.',
    autor: 'Revista Semana',
    fecha: '2021',
  },
  {
    texto:
      'No es solo pan, es un pedazo de historia de la Guajira que puedes saborear.',
    autor: 'Blog Gastro Viajero',
    fecha: '2023',
  },
  {
    texto:
      'El aroma que sale de su horno de leña es la mejor alarma para despertar en Riohacha.',
    autor: 'Visitante frecuente',
    fecha: '2020',
  },
]

// Galería de fotos (puedes reemplazar con tus propias imágenes)
const galeriaData = [
  { tipo: 'horno', descripcion: 'Nuestro horno tradicional de ladrillo' },
  { tipo: 'masa', descripcion: 'Amasado artesanal diario' },
  { tipo: 'productos', descripcion: 'Selección de nuestros panes' },
  { tipo: 'local', descripcion: 'Nuestro local histórico' },
  { tipo: 'familia', descripcion: 'Tercera generación al mando' },
  { tipo: 'ingredientes', descripcion: 'Ingredientes locales seleccionados' },
]

export default function Nosotros() {
  const [activeTestimonio, setActiveTestimonio] = useState(0)

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Más que una panadería,
            <br />
            <span className={styles.heroHighlight}>una tradición familiar</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Desde 1996, horneamos el alma de Riohacha en cada pieza
          </p>
        </div>
      </section>

      {/* Historia Timeline */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{historiaData.titulo}</h2>
          <p className={styles.sectionSubtitle}>{historiaData.subtitulo}</p>
        </div>

        <div className={styles.timeline}>
          {historiaData.contenido.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineDot}>
                <span className={styles.timelineYear}>{item.año}</span>
              </div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineItemTitle}>{item.titulo}</h3>
                <p className={styles.timelineItemDesc}>{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <p className={styles.sectionSubtitle}>Lo que nos hace únicos</p>
        </div>

        <div className={styles.valoresGrid}>
          {valoresData.map((valor, index) => (
            <div key={index} className={styles.valorCard}>
              <div className={styles.valorIcon}>{valor.icono}</div>
              <h3 className={styles.valorTitle}>{valor.titulo}</h3>
              <p className={styles.valorDesc}>{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios Carousel */}
      <section className={`${styles.section} ${styles.testimoniosSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Lo que dicen de nosotros</h2>
          <p className={styles.sectionSubtitle}>
            Reconocimientos y testimonios
          </p>
        </div>

        <div className={styles.testimoniosContainer}>
          <div className={styles.testimoniosCarousel}>
            {testimoniosData.map((testimonio, index) => (
              <div
                key={index}
                className={`${styles.testimonioCard} ${
                  activeTestimonio === index ? styles.active : ''
                }`}
                onClick={() => setActiveTestimonio(index)}
              >
                <div className={styles.testimonioContent}>
                  <p className={styles.testimonioText}>{testimonio.texto}</p>
                  <div className={styles.testimonioMeta}>
                    <span className={styles.testimonioAuthor}>
                      {testimonio.autor}
                    </span>
                    <span className={styles.testimonioDate}>
                      {testimonio.fecha}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.carouselDots}>
            {testimoniosData.map((_, index) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${
                  activeTestimonio === index ? styles.activeDot : ''
                }`}
                onClick={() => setActiveTestimonio(index)}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nuestro Día a Día</h2>
          <p className={styles.sectionSubtitle}>Detrás del horno</p>
        </div>

        <div className={styles.galeriaGrid}>
          {galeriaData.map((item, index) => (
            <div key={index} className={styles.galeriaItem}>
              <div className={styles.galeriaImage}>
                {/* Placeholder - reemplaza con Image de Next.js */}
                <div className={styles.imagePlaceholder}>
                  <span className={styles.imageText}>{item.tipo}</span>
                </div>
              </div>
              <p className={styles.galeriaDesc}>{item.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Listo para probar la tradición?</h2>
          <p className={styles.ctaText}>
            Ven a visitarnos y descubre por qué somos parte del patrimonio de
            Riohacha.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/productos" className={styles.ctaButtonPrimary}>
              Ver productos
            </Link>
            <Link href="/contacto" className={styles.ctaButtonSecondary}>
              Visítanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
