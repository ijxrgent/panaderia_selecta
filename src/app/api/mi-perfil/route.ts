// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Leer header Authorization
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // 2️⃣ Verificar access token
    const payload = await verifyAccessToken(token)

    if (!payload?.sub) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // 3️⃣ Buscar usuario en BD
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // 4️⃣ Responder con usuario autenticado
    return NextResponse.json(user, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 401 }
    )
  }
}
