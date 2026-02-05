'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './hero-carousel.module.css'

interface Slide {
  image: string
  title: string
  subtitle: string
  ctaText: string
  href: string
  variant?: 'primary' | 'secondary'
}

const slides: Slide[] = [
  {
    image: '/hero/vitrina_de_panes.jpg',
    title: 'Panadería Selecta',
    subtitle: 'Herencia panadera desde 1996',
    ctaText: 'Ver productos',
    href: '/productos',
    variant: 'primary',
  },
  {
    image: '/hero/pan_hawaiano.jpg',
    title: 'Pan recién horneado',
    subtitle: 'Todos los días, ingredientes de calidad',
    ctaText: 'Explorar catálogo',
    href: '/productos',
    variant: 'secondary',
  },
  {
    image: '/hero/varios_panes.jpg',
    title: 'Pedidos rápidos',
    subtitle: 'Recoge en tienda o entrega programada',
    ctaText: 'Contáctanos',
    href: '/contacto',
    variant: 'secondary',
  },
]

export default function HeroCarousel() {
  return (
    <section className={styles.hero}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        navigation
        pagination={{ clickable: true }}
        className={styles.swiper}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.image} className={styles.slide}>
            {/* Imagen con wrapper */}
            <div className={styles.imageWrapper}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className={styles.image}
              />
            </div>

            {/* Contenido de texto (sin overlay extra) */}
            <div className={styles.content}>
              <div className={styles.textContainer}>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>

                <Link
                  href={slide.href}
                  className={
                    slide.variant === 'primary'
                      ? styles.cta
                      : styles.ctaSecondary
                  }
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
