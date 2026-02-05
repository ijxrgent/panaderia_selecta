// src/app/modules/productos/productos.service.ts
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { deleteProductImage } from '@/lib/delete-image'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export class ProductosService {
  private ensureValidId(id: number) {
    if (!id || typeof id !== 'number' || isNaN(id)) {
      throw new Error('ID inválido.')
    }
  }

  private async findProductoOrFail(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    })

    if (!producto) {
      throw new Error('Producto no encontrado.')
    }

    return producto
  }

  /**
   * Cursor-based pagination (YouTube style)
   * - params.cursor: id del último elemento visto (number) o null
   * - params.limite: cuantos items devolver (default 10)
   *
   * Devuelve: { nextCursor, productos }
   */
  async obtenerProductosCursor(params?: {
    cursor?: number | null
    limite?: number
  }) {
    const { cursor = null, limite = 50 } = params ?? {}

    const productos = await prisma.producto.findMany({
      take: limite + 1, // pedimos 1 extra para saber si hay más
      skip: cursor ? 1 : 0, // si hay cursor, saltamos el item del cursor
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
      include: { categoria: true },
    })

    let nextCursor: number | null = null

    if (productos.length > limite) {
      const ultimo = productos.pop()! // quitamos el extra
      nextCursor = ultimo.id
    }

    return {
      nextCursor,
      productos,
    }
  }

  /**
   * Page-based pagination (offset)
   * - params.buscar: string opcional para buscar por nombre (insensitive)
   * - params.pagina: número de página (1-based)
   * - params.limite: items por página
   *
   * Devuelve: { productos, total, pagina, limite }
   */
  async obtenerProductos(params?: {
    buscar?: string
    pagina?: number
    limite?: number
    categoriaId?: number
  }) {
    const { buscar, pagina = 1, limite = 50, categoriaId } = params ?? {}

    console.log('🔍 Parámetros recibidos en service:', {
      buscar,
      categoriaId,
      tipoCategoriaId: typeof categoriaId,
    })

    const filtros: Prisma.ProductoWhereInput = {}

    if (buscar) {
      filtros.nombre = {
        contains: buscar,
        mode: 'insensitive', // ← Añade esto para búsqueda case-insensitive
      }
    }

    if (categoriaId) {
      console.log('✅ Aplicando filtro categoriaId:', categoriaId)
      filtros.categoriaId = categoriaId
    }

    const [total, productos] = await Promise.all([
      prisma.producto.count({ where: filtros }),
      prisma.producto.findMany({
        where: filtros,
        skip: (pagina - 1) * limite,
        take: limite,
        include: { categoria: true },
        orderBy: { id: 'desc' },
      }),
    ])
    console.log('🔧 Filtros aplicados:', filtros)

    return {
      total,
      pagina,
      limite,
      productos,
    }
  }

  // Crear producto (acepta categoriaId)
  async crearProducto(data: {
    nombre: string
    precio: number
    descripcion?: string
    stock: number
    categoriaId: number
    imagen?: string | null
    imagenPublicId?: string | null
  }) {
    const categoria = await prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    })

    if (!categoria) {
      throw new Error('La categoría seleccionada no existe')
    }

    return prisma.producto.create({
      data: {
        nombre: data.nombre,
        precio: data.precio,
        descripcion: data.descripcion,
        stock: data.stock,
        imagen: data.imagen ?? null,
        imagenPublicId: data.imagenPublicId ?? null,
        categoria: {
          connect: { id: data.categoriaId },
        },
      },
      include: { categoria: true },
    })
  }

  // Añade este método en ProductosService
  async obtenerTodosProductos() {
    return prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { id: 'desc' },
    })
  }

  obtenerProductoPorId(id: number) {
    this.ensureValidId(id)
    return this.findProductoOrFail(id)
  }

  async actualizarProducto(id: number, data: Prisma.ProductoUpdateInput) {
    try {
      let imagenAEliminar: string | null = null

      // Si se está subiendo una nueva imagen, obtener la vieja para borrarla
      // Verificamos si 'imagen' está presente en los datos de actualización
      if (data.imagen !== undefined && data.imagen !== null) {
        const productoAnterior = await prisma.producto.findUnique({
          where: { id },
          select: { imagen: true },
        })

        // Solo borramos si hay una imagen anterior y no es la misma
        if (
          productoAnterior?.imagen &&
          productoAnterior.imagen !== data.imagen
        ) {
          // Verificar que no sea una imagen por defecto o URL externa
          if (
            !productoAnterior.imagen.startsWith('http') &&
            !productoAnterior.imagen.includes('/default') &&
            !productoAnterior.imagen.includes('/placeholder')
          ) {
            imagenAEliminar = productoAnterior.imagen
          }
        }
      }

      // Actualizar producto usando el método existente
      this.ensureValidId(id)
      const producto = await prisma.producto.update({
        where: { id },
        data,
        include: { categoria: true },
      })

      // Borrar imagen anterior si existe (después de actualizar exitosamente)
      if (imagenAEliminar) {
        // Usar setTimeout para no bloquear la respuesta
        setTimeout(async () => {
          try {
            await deleteProductImage(imagenAEliminar!)
          } catch (error) {
            console.error('Error al borrar imagen anterior:', error)
          }
        }, 0)
      }

      return producto
    } catch (error) {
      console.error('Error en ProductosService.actualizarProducto:', error)
      throw error
    }
  }

  async eliminarProducto(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
    })

    if (!producto) {
      throw new Error('Producto no encontrado')
    }

    // 👇 borrar imagen si existe
    if (producto.imagenPublicId) {
      await deleteFromCloudinary(producto.imagenPublicId)
    }

    await prisma.producto.delete({
      where: { id },
    })

    return producto
  }
}
