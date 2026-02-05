// src/services/auth.service.ts
import { prisma } from '@/lib/prisma'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Role } from '@prisma/client'

export class AuthService {
  // ===========================
  //         LOGIN
  // ===========================
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new Error('Contraseña incorrecta')
    }

    const payload = {
      sub: String(user.id),
      role: user.role, // user.role ya es del tipo Role
    }

    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }
  }

  // ===========================
  //       REFRESH TOKEN
  // ===========================
  static async refresh(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken)

    if (!payload?.sub) {
      throw new Error('Token inválido')
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    const newAccessToken = await signAccessToken({
      sub: String(user.id),
      role: user.role,
    })

    const newRefreshToken = await signRefreshToken({
      sub: String(user.id),
      role: user.role,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    }
  }

  // ===========================
  //       REGISTER (SIGNUP)
  // ===========================
  static async register(data: {
    nombre?: string
    email: string
    password: string
    role?: Role
  }) {
    const { nombre, email, password, role } = data

    if (!email || !password) {
      throw new Error('email y password son requeridos')
    }

    if (password.length < 6) {
      throw new Error('password debe tener al menos 6 caracteres')
    }

    const hashed = await bcrypt.hash(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          nombre: nombre ?? null,
          email,
          password: hashed,
          role: role ?? 'CLIENT', // 👈 Valor por defecto como string
        },
      })

      const payload = {
        sub: String(user.id),
        role: user.role as Role, // 👈 Asegurar tipo Role
      }
      const accessToken = await signAccessToken(payload)
      const refreshToken = await signRefreshToken(payload)

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role as Role,
        },
      }
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new Error('Ya existe un usuario con ese email')
      }

      throw err
    }
  }
}
