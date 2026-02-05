// src/app/api/pedidos/[id]/estado/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenAndRole } from '@/lib/auth-utils'
import { EstadoPedido, Role } from '@prisma/client' // 👈 Importa Role
import prisma from '@/lib/prisma'
import { validarTransicionEstado } from '@/lib/pedidos/validarTransicionEstado'
import { isRole } from '@/lib/isRole'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// PUT /api/pedidos/:id/estado
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params

    // 1. Auth - Usa el enum Role de Prisma
    const validation = await validateTokenAndRole(req, [
      Role.EMPLOYEE,
      Role.ADMIN,
    ])

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      )
    }

    const pedidoId = Number(id)

    if (!Number.isInteger(pedidoId)) {
      return NextResponse.json(
        { error: 'ID de pedido inválido' },
        { status: 400 }
      )
    }

    // 2. Body
    const body: unknown = await req.json()

    if (typeof body !== 'object' || body === null || !('nuevoEstado' in body)) {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    const { nuevoEstado } = body as { nuevoEstado: EstadoPedido }

    // 3. Validar estado - Usa el enum directamente
    const estadosValidos: EstadoPedido[] = Object.values(EstadoPedido)

    if (!estadosValidos.includes(nuevoEstado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    // 4. Obtener pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // 5. No permitir cambiar propio pedido
    if (pedido.usuarioId === validation.userId) {
      return NextResponse.json(
        { error: 'No puedes modificar tu propio pedido' },
        { status: 403 }
      )
    }

    if (!isRole(validation.userRole)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 403 })
    }

    // 6. Validar transición
    const resultado = validarTransicionEstado({
      estadoActual: pedido.estado,
      nuevoEstado,
      rol: validation.userRole!, // Ya validado por isRole
    })

    if (!resultado.ok) {
      return NextResponse.json({ error: resultado.error }, { status: 403 })
    }

    // 7. Fechas automáticas
    const dataToUpdate: {
      estado: EstadoPedido
      fechaProcesado?: Date
      fechaEntregado?: Date
      archivado?: boolean
      fechaArchivado?: Date
    } = {
      estado: nuevoEstado,
    }

    // Usa el enum en las comparaciones
    if (nuevoEstado === EstadoPedido.PROCESANDO && !pedido.fechaProcesado) {
      dataToUpdate.fechaProcesado = new Date()
    }

    if (nuevoEstado === EstadoPedido.ENTREGADO) {
      if (!pedido.fechaEntregado) {
        dataToUpdate.fechaEntregado = new Date()
      }

      if (!pedido.archivado) {
        dataToUpdate.archivado = true
        dataToUpdate.fechaArchivado = new Date()
      }
    }

    const pedidoActualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: dataToUpdate,
      include: {
        usuario: { select: { id: true, email: true } },
        items: {
          include: {
            producto: {
              select: { id: true, nombre: true, precio: true },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      pedido: pedidoActualizado,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al cambiar estado del pedido' },
      { status: 500 }
    )
  }
}
