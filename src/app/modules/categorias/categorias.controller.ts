// src/app/categorias/categorias.controller.ts
import { saveCategoryImage } from '@/lib/upload-category-image'
import { NextRequest, NextResponse } from 'next/server'
import { CategoriasService } from './categorias.service'
import path from 'path'
import fs from 'fs/promises'

// 1. Definir tipos de errores esperados
interface PrismaError extends Error {
  code?: string
  meta?: {
    target?: string[]
  }
}

interface ServiceError extends Error {
  message: string
}

const categoriasService = new CategoriasService()

export class CategoriasController {
  private service = new CategoriasService()

  /**
   * Obtener todas las categorías
   */
  async obtenerTodas() {
    try {
      const categorias = await categoriasService.obtenerCategorias()
      return Response.json(categorias, { status: 200 })
    } catch (error) {
      console.error('Error en Controller (obtenerTodas):', error)
      return Response.json(
        { error: 'Error interno del servidor al obtener categorías' },
        { status: 500 }
      )
    }
  }

  /**
   * Obtener una categoría por ID
   */
  async obtenerPorId(request: NextRequest, { id }: { id: string }) {
    try {
      const categoriaId = parseInt(id, 10)

      if (isNaN(categoriaId)) {
        return Response.json(
          { error: 'El ID de la categoría debe ser un número válido' },
          { status: 400 }
        )
      }

      const categoria =
        await categoriasService.obtenerCategoriaPorId(categoriaId)
      return Response.json(categoria, { status: 200 })
    } catch (error) {
      console.error('Error en Controller (obtenerPorId):', error)

      // 2. Usar el tipo definido para el error
      const serviceError = error as ServiceError

      if (serviceError.message === 'Categoría no encontrada.') {
        return Response.json(
          { error: 'Categoría no encontrada' },
          { status: 404 }
        )
      }

      return Response.json(
        { error: 'Error interno del servidor al obtener la categoría' },
        { status: 500 }
      )
    }
  }

  /**
   * Crear una nueva categoría
   */
  async crear(request: NextRequest) {
    try {
      const formData = await request.formData()

      const nombre = formData.get('nombre')
      const file = formData.get('imagen')

      if (!nombre || typeof nombre !== 'string') {
        return Response.json(
          { error: 'El campo "nombre" es requerido y debe ser texto' },
          { status: 400 }
        )
      }

      let imagePath: string | null = null

      if (file instanceof File && file.size > 0) {
        imagePath = await saveCategoryImage(file)
      }

      const nuevaCategoria = await categoriasService.crearCategoria({
        nombre,
        imagen: imagePath,
      })

      return Response.json(nuevaCategoria, { status: 201 })
    } catch (error) {
      console.error('Error en Controller (crear):', error)

      // Mejor type guard
      if (error instanceof Error && 'code' in error) {
        const prismaError = error as PrismaError
        if (prismaError.code === 'P2002') {
          return Response.json(
            { error: 'Ya existe una categoría con ese nombre' },
            { status: 409 }
          )
        }
      }

      return Response.json(
        { error: 'Error interno del servidor al crear la categoría' },
        { status: 500 }
      )
    }
  }

  /**
   * Actualizar una categoría existente
   */
  async actualizar(request: NextRequest, { id }: { id: string }) {
    try {
      const categoriaId = parseInt(id, 10)

      if (isNaN(categoriaId)) {
        return Response.json(
          { error: 'El ID de la categoría debe ser un número válido' },
          { status: 400 }
        )
      }

      const body = await request.json()

      // Validación básica
      if (body.nombre && typeof body.nombre !== 'string') {
        return Response.json(
          { error: 'El campo "nombre" debe ser texto' },
          { status: 400 }
        )
      }

      const categoriaActualizada = await categoriasService.actualizarCategoria(
        categoriaId,
        body
      )

      return Response.json(categoriaActualizada, { status: 200 })
    } catch (error) {
      console.error('Error en Controller (actualizar):', error)

      // Mejor manejo de tipos
      if (error instanceof Error) {
        const serviceError = error as ServiceError
        const prismaError = error as PrismaError

        if (serviceError.message === 'Categoría no encontrada.') {
          return Response.json(
            { error: 'Categoría no encontrada' },
            { status: 404 }
          )
        }

        if ('code' in error && prismaError.code === 'P2002') {
          return Response.json(
            { error: 'Ya existe una categoría con ese nombre' },
            { status: 409 }
          )
        }
      }

      return Response.json(
        { error: 'Error interno del servidor al actualizar la categoría' },
        { status: 500 }
      )
    }
  }

  /**
   * Eliminar una categoría
   */
  async eliminar(id: number) {
    try {
      const categoria = await this.service.eliminarCategoria(id)

      // borrar imagen si existe
      if (categoria.imagen) {
        const imagePath = path.join(process.cwd(), 'public', categoria.imagen)

        await fs.unlink(imagePath).catch(() => {
          // si no existe el archivo, no rompemos la app
        })
      }

      return NextResponse.json({
        message: 'Categoría eliminada correctamente',
        categoria,
      })
    } catch (error: unknown) {
      // ✅ Manejo correcto del FK constraint
      if (error instanceof Error && 'code' in error && error.code === 'P2003') {
        return NextResponse.json(
          {
            error:
              'No se puede eliminar la categoría porque tiene productos asociados',
          },
          { status: 409 }
        )
      }

      console.error('Error eliminando categoría:', error)

      return NextResponse.json(
        { error: 'Error al eliminar la categoría' },
        { status: 500 }
      )
    }
  }
}
