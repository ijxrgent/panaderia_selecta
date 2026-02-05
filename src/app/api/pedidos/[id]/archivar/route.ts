import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateTokenAndRole } from '@/lib/auth-utils'
import { EstadoPedido, Role } from '@prisma/client' // 👈 Importa Role
import { isRole } from '@/lib/isRole'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const pedidoId = Number(id)

    if (!Number.isInteger(pedidoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // 🔐 Auth - Usa el enum Role de Prisma
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

    if (!isRole(validation.userRole)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 403 })
    }

    // 📦 Pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    })

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // 🛑 Reglas de negocio
    if (pedido.archivado) {
      return NextResponse.json(
        { error: 'El pedido ya está archivado' },
        { status: 400 }
      )
    }

    if (
      pedido.estado !== EstadoPedido.ENTREGADO &&
      pedido.estado !== EstadoPedido.CANCELADO
    ) {
      return NextResponse.json(
        {
          error: 'Solo se pueden archivar pedidos ENTREGADOS o CANCELADOS',
        },
        { status: 403 }
      )
    }

    // ✅ Archivar
    const pedidoArchivado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        archivado: true,
        fechaArchivado: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      pedido: pedidoArchivado,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al archivar el pedido' },
      { status: 500 }
    )
  }
}
