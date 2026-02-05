// src/app/api/productos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ProductosController } from '../../modules/productos/productos.controller'
import { validateTokenAndRole } from '@/lib/auth-utils'

const controller = new ProductosController()

export async function GET(request: NextRequest) {
  return controller.obtenerTodos(request)
}

export async function POST(request: NextRequest) {
  // 1. VALIDAR ANTES DE PASAR AL CONTROLLER
  const validation = await validateTokenAndRole(request, ['ADMIN'])

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    )
  }
  return controller.crear(request)
}
