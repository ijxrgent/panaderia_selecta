import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value
  const pathname = req.nextUrl.pathname

  // 🔐 Rutas que requieren login (cualquiera autenticado)
  const authOnlyRoutes = ['/mis-pedidos']

  // 🔐 Rutas solo admin/employee
  const adminRoutes = ['/dashboard']

  // ❌ No hay token y la ruta lo requiere
  if (!token) {
    if (
      authOnlyRoutes.some((route) => pathname.startsWith(route)) ||
      adminRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  }

  try {
    const payload = await verifyAccessToken(token)

    // 🚫 Dashboard → solo ADMIN / EMPLOYEE
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      payload.role !== 'ADMIN' &&
      payload.role !== 'EMPLOYEE'
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // ✅ Mis pedidos → CLIENT + ADMIN
    // (solo estar autenticado ya es suficiente)

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/mis-pedidos/:path*'],
}
