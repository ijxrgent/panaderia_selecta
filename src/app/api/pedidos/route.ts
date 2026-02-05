// src/app/api/pedidos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'
import { validateTokenAndRole } from '@/lib/auth-utils'
import { TipoEntrega, Role } from '@prisma/client'
import { Prisma } from '@prisma/client'

type PedidoItemInput = {
  productoId: number
  cantidad: number
}

type CrearPedidoBody = {
  items: PedidoItemInput[]
  tipoEntrega: TipoEntrega
  direccionEntrega?: string
  nombreCliente?: string
  telefonoCliente?: string
  emailCliente?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    const {
      items,
      tipoEntrega,
      direccionEntrega,
      nombreCliente,
      telefonoCliente,
      emailCliente,
    } = body as CrearPedidoBody

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      )
    }

    // 🔐 Intentar obtener usuario (opcional)
    const authHeader = req.headers.get('authorization')
    let usuarioId: number | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const payload = await verifyAccessToken(token)
      if (payload?.sub) {
        usuarioId = Number(payload.sub)
      }
    }

    // 🧑‍🦱 Validaciones invitado
    if (!usuarioId) {
      if (!nombreCliente || !telefonoCliente) {
        return NextResponse.json(
          {
            error:
              'Nombre y teléfono son obligatorios para pedidos como invitado',
          },
          { status: 400 }
        )
      }
    }

    // 🧮 Obtener productos
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: items.map((i) => i.productoId) },
      },
    })

    if (productos.length !== items.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no existen' },
        { status: 400 }
      )
    }

    // 💰 Calcular total
    const total = items.reduce((acc, item) => {
      const producto = productos.find((p) => p.id === item.productoId)!
      return acc + producto.precio * item.cantidad
    }, 0)

    // 📦 Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        nombreCliente: usuarioId ? 'Usuario registrado' : nombreCliente!,
        telefonoCliente: usuarioId ? 'Registrado' : telefonoCliente!,
        emailCliente: emailCliente ?? null,
        tipoEntrega,
        direccionEntrega:
          tipoEntrega === TipoEntrega.DOMICILIO
            ? (direccionEntrega ?? null)
            : null,
        total,
        items: {
          create: items.map((item) => {
            const producto = productos.find((p) => p.id === item.productoId)!

            return {
              productoId: producto.id,
              cantidad: item.cantidad,
              precioUnit: producto.precio,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, mensaje: 'Pedido creado correctamente', pedido },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creando pedido:', error)
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const validation = await validateTokenAndRole(req)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      )
    }

    const { userId, userRole } = validation

    const { searchParams } = new URL(req.url)
    const archivadoParam = searchParams.get('archivado')

    const where: Prisma.PedidoWhereInput = {}

    // 🔒 CORREGIDO: Usar Role.CLIENT (no 'USER')
    if (userRole === Role.CLIENT) {
      where.usuarioId = userId
    }

    // ADMIN / EMPLOYEE ven todos (no necesitan filtro por usuario)
    // Solo aplicamos filtro de archivado para todos
    if (archivadoParam === 'true') {
      where.archivado = true
    } else if (archivadoParam === 'false') {
      where.archivado = false
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: { select: { id: true, email: true } },
        items: {
          include: {
            producto: {
              select: { id: true, nombre: true, precio: true },
            },
          },
        },
      },
    })

    return NextResponse.json(pedidos)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}
