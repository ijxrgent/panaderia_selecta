// src/app/api/productos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ProductosController } from '../../../modules/productos/productos.controller'
import { validateTokenAndRole } from '@/lib/auth-utils'
import { Prisma } from '@prisma/client'

const controller = new ProductosController()

// Obtener producto por ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  return controller.obtenerPorId(Number(id))
}

// Actualizar producto
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const validation = await validateTokenAndRole(req, ['ADMIN'])

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    )
  }

  const { id } = await context.params
  return controller.actualizar(req, Number(id))
}

// Eliminar producto
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const validation = await validateTokenAndRole(req, ['ADMIN'])
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      )
    }

    const { id } = await context.params
    const numericId = Number(id)

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    return await controller.eliminar(numericId)
  } catch (error: unknown) {
    console.error('Error en DELETE producto:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return NextResponse.json(
        {
          error:
            'No se puede eliminar el producto porque está asociado a pedidos',
        },
        { status: 409 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
