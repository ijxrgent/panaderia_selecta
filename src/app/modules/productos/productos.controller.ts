// src/app/modules/productos/productos.controller.ts
import { NextRequest, NextResponse } from 'next/server'
import { ProductosService } from './productos.service'
import { uploadToCloudinary } from '@/lib/cloudinary'

export class ProductosController {
  private service = new ProductosService()

  /**
   * GET /api/productos
   * - Cursor-based (por defecto): /api/productos?limite=10  (o con cursor)
   * - Page-based (si pasa ?pagina=... o ?buscar=...): /api/productos?pagina=2&limite=10&buscar=...
   */
  async obtenerTodos(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams
      const cursorParam = searchParams.get('cursor') // ex: "12"
      const buscarParam = searchParams.get('buscar')
      const paginaParam = searchParams.get('pagina')
      const limiteParam = searchParams.get('limite')
      const categoriaIdParam = searchParams.get('categoriaId')

      console.log('🔍 Parámetros en controller:', {
        buscar: buscarParam,
        categoriaId: categoriaIdParam,
        pagina: paginaParam,
      })

      // Si hay 'pagina' o 'buscar' usamos page-based (útil para búsquedas tradicionales)
      if (paginaParam !== null || buscarParam !== null) {
        const pagina = paginaParam ? Number(paginaParam) : 1
        const limite = limiteParam ? Number(limiteParam) : 10
        const categoriaId = categoriaIdParam
          ? Number(categoriaIdParam)
          : undefined

        const resultado = await this.service.obtenerProductos({
          buscar: buscarParam ?? undefined,
          pagina,
          limite,
          categoriaId,
        })

        return NextResponse.json({
          productos: resultado.productos,
          page: resultado.pagina,
          limit: resultado.limite,
          total: resultado.total,
        })
      }

      // Por defecto usamos cursor-based (YouTube style)
      const cursor = cursorParam ? Number(cursorParam) : null
      const limite = limiteParam ? Number(limiteParam) : 10

      const resultadoCursor = await this.service.obtenerProductosCursor({
        cursor,
        limite,
      })

      return NextResponse.json({
        productos: resultadoCursor.productos,
        nextCursor: resultadoCursor.nextCursor ?? null,
      })
    } catch (error: unknown) {
      console.error('Error en ProductosController.obtenerTodos:', error)
      return NextResponse.json(
        { error: 'Error interno al obtener productos' },
        { status: 500 }
      )
    }
  }

  // POST /api/productos
  async crear(req: NextRequest) {
    try {
      console.log('Creando producto (usuario autenticado como ADMIN)')

      const formData = await req.formData()

      const nombre = formData.get('nombre')
      const precioRaw = formData.get('precio')
      const categoriaIdRaw = formData.get('categoriaId')
      const descripcion = formData.get('descripcion')
      const file = formData.get('imagen')
      const stockRaw = formData.get('stock')

      // =====================
      // VALIDACIONES
      // =====================

      if (!nombre || typeof nombre !== 'string') {
        return NextResponse.json(
          { error: 'El nombre es requerido' },
          { status: 400 }
        )
      }

      const precio = Number(precioRaw)
      if (isNaN(precio) || precio <= 0) {
        return NextResponse.json(
          { error: 'El precio debe ser un número válido' },
          { status: 400 }
        )
      }

      const categoriaId = Number(categoriaIdRaw)
      if (isNaN(categoriaId) || categoriaId <= 0) {
        return NextResponse.json(
          { error: 'categoriaId es requerido y debe ser un número válido' },
          { status: 400 }
        )
      }

      const stock = Number(stockRaw)
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { error: 'El stock debe ser un número válido (0 o mayor)' },
          { status: 400 }
        )
      }

      // =====================
      // IMAGEN → CLOUDINARY
      // =====================

      let imagen: string | null = null
      let imagenPublicId: string | null = null

      if (file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())

        const uploadResult = await uploadToCloudinary(
          buffer,
          'panaderia/productos'
        )

        imagen = uploadResult.url
        imagenPublicId = uploadResult.publicId
      }

      // =====================
      // CREAR PRODUCTO
      // =====================

      const producto = await this.service.crearProducto({
        nombre,
        precio,
        descripcion: typeof descripcion === 'string' ? descripcion : undefined,
        stock,
        categoriaId,
        imagen,
        imagenPublicId,
      })

      return NextResponse.json(producto, { status: 201 })
    } catch (error: unknown) {
      console.error('Error en ProductosController.crear:', error)

      const message =
        error instanceof Error ? error.message : 'Error desconocido'

      return NextResponse.json({ error: message }, { status: 400 })
    }
  }

  // Obtener producto por ID
  async obtenerPorId(id: number) {
    try {
      const producto = await this.service.obtenerProductoPorId(id)
      return NextResponse.json(producto)
    } catch (error: unknown) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 404 }
      )
    }
  }

  // Actualizar producto
  async actualizar(req: NextRequest, id: number) {
    try {
      const data = await req.json()

      // Permitir que cliente pase categoriaId para hacer connect
      if (data.categoriaId && typeof data.categoriaId === 'number') {
        data.categoria = { connect: { id: data.categoriaId } }
        delete data.categoriaId
      }

      const producto = await this.service.actualizarProducto(id, data)

      return NextResponse.json(producto)
    } catch (error: unknown) {
      console.error('Error en ProductosController.actualizar:', error)
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      )
    }
  }

  // Eliminar producto
  async eliminar(id: number) {
    // Obtener el producto ANTES de eliminarlo
    const producto = await this.service.obtenerProductoPorId(id)

    // 👇 ESTA LÍNEA FALTA - ELIMINAR EL PRODUCTO
    await this.service.eliminarProducto(id)

    return NextResponse.json({
      message: 'Producto eliminado correctamente',
      producto: producto, // El producto obtenido antes de eliminar
    })
  }
}
