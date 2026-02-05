// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, password, role } = body

    // Llamar al servicio de registro
    const result = await AuthService.register({
      nombre,
      email,
      password,
      role,
    })

    // Crear respuesta
    const response = NextResponse.json(
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      { status: 201 }
    )

    // Configurar cookie para refresh token
    response.cookies.set({
      name: 'refreshToken',
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    })

    response.cookies.set({
      name: 'accessToken',
      value: result.accessToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    })

    return response
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error en el registro'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
