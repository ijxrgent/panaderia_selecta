// src/app/api/pedidos/[id]/route.ts (solo GET)
import { NextRequest, NextResponse } from 'next/server'
import { PedidosService } from '@/services/pedidos.service'
import { validateTokenAndRole } from '@/lib/auth-utils'

// GET /api/pedidos/:id - Obtener un pedido específico
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validar autenticación
    const validation = await validateTokenAndRole(req)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      )
    }

    // 2. Obtener ID
    const { id } = await context.params
    const pedidoId = parseInt(id)

    if (isNaN(pedidoId)) {
      return NextResponse.json(
        { error: 'ID de pedido inválido' },
        { status: 400 }
      )
    }

    // 3. Obtener pedido
    const pedido = await PedidosService.obtenerPedido(
      pedidoId,
      validation.userId!,
      validation.userRole!
    )

    // 4. Retornar
    return NextResponse.json({
      success: true,
      pedido,
    })
  } catch (error: unknown) {
    console.error('Error en GET /api/pedidos/:id:', error)

    const mensaje = error instanceof Error ? error.message : 'Error desconocido'

    return NextResponse.json({ error: mensaje }, { status: 404 })
  }
}
