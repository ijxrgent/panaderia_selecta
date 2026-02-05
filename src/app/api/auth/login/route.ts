// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      )
    }

    // Llamar al servicio directamente
    const result = await AuthService.login(email, password)

    // Crear respuesta
    const response = NextResponse.json(
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      { status: 200 }
    )

    // Configurar cookie para refresh token (httpOnly, seguro)
    response.cookies.set({
      name: 'refreshToken',
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    response.cookies.set({
      name: 'accessToken',
      value: result.accessToken,
      httpOnly: true, // el middleware sí puede leerla
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60,
    })

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error en el login'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
