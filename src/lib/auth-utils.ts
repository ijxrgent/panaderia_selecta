// src/lib/auth-utils.ts - VERSIÓN COMPLETA CORREGIDA
import { verifyAccessToken } from '@/lib/auth'
import { NextRequest } from 'next/server'
import { Role } from '@prisma/client'

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer' || !token) return null

  return token
}

export async function validateTokenAndRole(
  req: NextRequest,
  requiredRoles?: Role[] // 👈 Ahora acepta array de Roles
): Promise<{
  success: boolean
  userId?: number
  userRole?: Role
  error?: string
  status?: number
}> {
  try {
    const token = extractToken(req)

    if (!token) {
      return { success: false, error: 'No autenticado', status: 401 }
    }

    const payload = await verifyAccessToken(token)

    const userId = Number(payload.sub)

    if (Number.isNaN(userId)) {
      return { success: false, error: 'Token inválido', status: 401 }
    }

    // Asegurar que el role del payload sea un Role válido de Prisma
    const userRole = payload.role as Role

    // Si se especifican roles requeridos, verificar
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userRole)) {
        return { success: false, error: 'Sin permisos', status: 403 }
      }
    }

    return {
      success: true,
      userId,
      userRole,
    }
  } catch {
    return { success: false, error: 'Token inválido', status: 401 }
  }
}
