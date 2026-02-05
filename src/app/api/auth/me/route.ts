import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Leer cookie
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // 2️⃣ Verificar token
    const payload = await verifyAccessToken(token)

    if (!payload?.sub) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // 3️⃣ Buscar usuario
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

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 401 }
    )
  }
}
