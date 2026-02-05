// src/app/api/categorias/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { CategoriasController } from '@/app/modules/categorias/categorias.controller'
import { validateTokenAndRole } from '@/lib/auth-utils'

const controller = new CategoriasController()

export async function DELETE(
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
  const numericId = Number(id)

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  return controller.eliminar(numericId)
}
