// src/services/pedidos.service.ts
import prisma from '@/lib/prisma'
import { CrearPedidoDTO } from '@/types/pedidos'

export class PedidosService {
  // Crear un nuevo pedido
  static async crearPedido(userId: number | null, data: CrearPedidoDTO) {
    if (!data.items.length) {
      throw new Error('El pedido debe contener al menos un producto')
    }

    if (data.tipoEntrega === 'DOMICILIO' && !data.direccionEntrega) {
      throw new Error('La dirección es obligatoria para entrega a domicilio')
    }

    // Obtener productos
    const productoIds = data.items.map((item) => item.productoId)
    const productos = await prisma.producto.findMany({
      where: {
        id: { in: productoIds },
        activo: true,
      },
    })

    if (productos.length !== data.items.length) {
      throw new Error('Uno o más productos no existen o están inactivos')
    }

    // Calcular total
    const total = data.items.reduce<number>((acc, item) => {
      const producto = productos.find((p) => p.id === item.productoId)!
      return acc + producto.precio * item.cantidad
    }, 0)

    // Crear pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: userId,
        nombreCliente: data.nombreCliente ?? 'Cliente',
        telefonoCliente: data.telefonoCliente ?? '',
        emailCliente: data.emailCliente,
        tipoEntrega: data.tipoEntrega,
        direccionEntrega: data.direccionEntrega,
        total,
        items: {
          create: data.items.map((item) => {
            const producto = productos.find((p) => p.id === item.productoId)!
            return {
              productoId: item.productoId,
              cantidad: item.cantidad,
              precioUnit: producto.precio,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
        },
      },
    })

    return pedido
  }

  // Obtener un pedido específico con control de permisos
  static async obtenerPedido(
    pedidoId: number,
    userId: number,
    userRole: string
  ) {
    // Buscar el pedido primero sin filtro de usuario
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    if (!pedido) {
      throw new Error('Pedido no encontrado')
    }

    // Verificar permisos según el rol
    const esAdmin = userRole === 'ADMIN'
    const esEmpleado = userRole === 'EMPLOYEE'
    const esPropietario = pedido.usuarioId === userId

    // Solo pueden ver el pedido: admin, empleado o el dueño del pedido
    if (!esAdmin && !esEmpleado && !esPropietario) {
      throw new Error('No tienes permisos para ver este pedido')
    }

    return pedido
  }

  // Obtener todos los pedidos del usuario actual
  static async obtenerPedidosPorUsuario(userId: number) {
    return await prisma.pedido.findMany({
      where: { usuarioId: userId },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Obtener todos los pedidos (solo para admin/empleado)
  static async obtenerTodosPedidos(userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'EMPLOYEE') {
      throw new Error('No tienes permisos para ver todos los pedidos')
    }

    return prisma.pedido.findMany({
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precio: true,
                imagen: true,
              },
            },
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
