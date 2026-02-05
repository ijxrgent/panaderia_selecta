// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No hay refresh token disponible' },
        { status: 401 }
      )
    }

    const result = await AuthService.refresh(refreshToken)

    const response = NextResponse.json(
      {
        user: result.user,
      },
      { status: 200 }
    )

    // 🔐 NUEVO access token
    response.cookies.set({
      name: 'accessToken',
      value: result.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    })

    // 🔁 Rotar refresh token
    if (result.refreshToken) {
      response.cookies.set({
        name: 'refreshToken',
        value: result.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      })
    }

    return response
  } catch {
    const response = NextResponse.json(
      { error: 'Refresh inválido' },
      { status: 401 }
    )

    response.cookies.delete('refreshToken')
    response.cookies.delete('accessToken')

    return response
  }
}
