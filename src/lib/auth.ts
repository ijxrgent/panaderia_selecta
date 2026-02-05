// src/lib/auth.ts - VERSIÓN CORREGIDA CON DEBUG
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { Role } from '@prisma/client'

export interface AuthPayload extends JWTPayload {
  sub: string // id del usuario
  role: Role // rol del usuario
}

// VERIFICA QUE ESTAS VARIABLES EXISTEN
console.log('🔑 JWT_SECRET existe?:', !!process.env.JWT_SECRET)
console.log('🔑 REFRESH_SECRET existe?:', !!process.env.REFRESH_SECRET)

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET!)

export async function signAccessToken(payload: AuthPayload) {
  try {
    console.log('🔐 Generando Access Token...')
    console.log('📝 Payload:', payload)

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(JWT_SECRET)

    // Debug del token generado
    const parts = token.split('.')
    if (parts.length === 3) {
      const decoded = JSON.parse(atob(parts[1]))
      console.log('✅ Access Token generado:')
      console.log('   - exp timestamp:', decoded.exp)
      console.log('   - exp fecha:', new Date(decoded.exp * 1000))
      console.log('   - iat timestamp:', decoded.iat)
      console.log('   - iat fecha:', new Date(decoded.iat * 1000))
      console.log('   - tiempo actual:', Math.floor(Date.now() / 1000))
      console.log(
        '   - token válido hasta:',
        new Date(decoded.exp * 1000).toLocaleString()
      )
    }

    return token
  } catch (error) {
    console.error('❌ Error generando access token:', error)
    throw error
  }
}

export async function signRefreshToken(payload: AuthPayload) {
  try {
    console.log('🔐 Generando Refresh Token...')

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(REFRESH_SECRET)

    return token
  } catch (error) {
    console.error('❌ Error generando refresh token:', error)
    throw error
  }
}

export async function verifyAccessToken(token: string) {
  try {
    console.log('🔍 Verificando Access Token...')
    console.log('📝 Token (inicio):', token.substring(0, 30) + '...')

    const { payload } = await jwtVerify(token, JWT_SECRET, {
      // Tolerancia de 5 minutos por si hay desfase de tiempo
      clockTolerance: '5 min',
    })

    console.log('✅ Token verificado exitosamente')
    console.log('📊 Payload:', payload)
    console.log('⏰ Tiempo actual (server):', Math.floor(Date.now() / 1000))
    console.log('⏰ Token expira en:', payload.exp)

    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      const diff = payload.exp - now
      console.log('⏳ Tiempo restante (segundos):', diff)

      if (diff < 0) {
        console.log('⚠️ Token expirado según tiempo del servidor')
      }
    }
    console.log('📝 Payload:', payload)
    console.log('📊 Payload:', payload)

    return payload as AuthPayload
  } catch (error) {
    console.error('❌ Error verificando token:', error)
    console.error('Detalles:', error)
    throw error
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    console.log('🔍 Verificando Refresh Token...')

    const { payload } = await jwtVerify(token, REFRESH_SECRET, {
      clockTolerance: '5 min',
    })

    return payload as AuthPayload
  } catch (error) {
    console.error('❌ Error verificando refresh token:', error)
    throw error
  }
}
