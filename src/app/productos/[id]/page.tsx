// src/app/productos/[id]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatCOP } from '@/lib/formatCurrency'
import AddToCartButton from './AddToCarButton'
import styles from './producto-detalle.module.css'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductoDetallePage({ params }: PageProps) {
  const { id } = await params
  const productoId = Number(id)

  if (!Number.isInteger(productoId)) {
    notFound()
  }

  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      precio: true,
      stock: true,
      imagen: true,
      categoria: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  })

  if (!producto) {
    notFound()
  }

  return (
    <div className={styles.container}>
      {/* Migas de pan */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span className={styles.separator}>/</span>
        <Link href="/productos">Productos</Link>
        <span className={styles.separator}>/</span>
        <Link href={`/productos?categoria=${producto.categoria.id}`}>
          {producto.categoria.nombre}
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{producto.nombre}</span>
      </nav>

      <div className={styles.productoGrid}>
        {/* Imagen del producto */}
        <div className={styles.imagenContainer}>
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className={styles.imagen}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className={styles.imagenPlaceholder}>
              <span className={styles.placeholderIcon}>🥖</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className={styles.infoContainer}>
          <div>
            <span className={styles.categoriaBadge}>
              {producto.categoria.nombre}
            </span>
            <h1 className={styles.titulo}>{producto.nombre}</h1>

            <div className={styles.precioStock}>
              <p className={styles.precio}>{formatCOP(producto.precio)}</p>
              <div
                className={`${styles.stock} ${producto.stock > 0 ? styles.disponible : styles.agotado}`}
              >
                {producto.stock > 0 ? 'Disponible' : 'Agotado'}
                {producto.stock > 0 && (
                  <span className={styles.stockCantidad}>
                    {' '}
                    ({producto.stock} unidades)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.descripcionContainer}>
            <h2 className={styles.descripcionTitulo}>Descripción</h2>
            <p className={styles.descripcion}>
              {producto.descripcion ||
                'Este producto no tiene descripción disponible.'}
            </p>
          </div>

          {/* Botón para agregar al carrito */}
          <AddToCartButton
            producto={{
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              stock: producto.stock,
              imagen: producto.imagen,
              categoria: producto.categoria,
            }}
          />

          {/* Información adicional */}
          <div className={styles.detallesAdicionales}>
            <div className={styles.detalleItem}>
              <span className={styles.detalleLabel}>ID del producto</span>
              <span className={styles.detalleValor}>#{producto.id}</span>
            </div>
            <div className={styles.detalleItem}>
              <span className={styles.detalleLabel}>Envío</span>
              <span className={styles.detalleValor}>
                Entrega en 24-48 horas
              </span>
            </div>
            <div className={styles.detalleItem}>
              <span className={styles.detalleLabel}>Pago seguro</span>
              <span className={styles.detalleValor}>Garantizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
