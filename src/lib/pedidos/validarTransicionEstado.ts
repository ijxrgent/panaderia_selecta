import { EstadoPedido, Role } from '@prisma/client'

interface ValidarTransicionParams {
  estadoActual: EstadoPedido
  nuevoEstado: EstadoPedido
  rol: Role
}

interface ResultadoValidacion {
  ok: boolean
  error?: string
}

/**
 * Valida si una transición de estado es permitida
 */
export function validarTransicionEstado({
  estadoActual,
  nuevoEstado,
  rol,
}: ValidarTransicionParams): ResultadoValidacion {
  // 1. No permitir mismo estado
  if (estadoActual === nuevoEstado) {
    return {
      ok: false,
      error: 'El pedido ya se encuentra en ese estado',
    }
  }

  // 2. Estados finales no se pueden modificar
  if (
    estadoActual === EstadoPedido.ENTREGADO ||
    estadoActual === EstadoPedido.CANCELADO
  ) {
    return {
      ok: false,
      error: 'No se puede modificar un pedido finalizado',
    }
  }

  // 3. Definición clara de transiciones permitidas
  const transiciones: Record<Role, Record<EstadoPedido, EstadoPedido[]>> = {
    [Role.EMPLOYEE]: {
      [EstadoPedido.PENDIENTE]: [EstadoPedido.PROCESANDO],
      [EstadoPedido.PROCESANDO]: [EstadoPedido.LISTO],
      [EstadoPedido.LISTO]: [EstadoPedido.ENTREGADO],
      [EstadoPedido.ENTREGADO]: [],
      [EstadoPedido.CANCELADO]: [],
    },
    [Role.ADMIN]: {
      [EstadoPedido.PENDIENTE]: [
        EstadoPedido.PROCESANDO,
        EstadoPedido.LISTO,
        EstadoPedido.ENTREGADO,
        EstadoPedido.CANCELADO,
      ],
      [EstadoPedido.PROCESANDO]: [
        EstadoPedido.LISTO,
        EstadoPedido.ENTREGADO,
        EstadoPedido.CANCELADO,
      ],
      [EstadoPedido.LISTO]: [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO],
      [EstadoPedido.ENTREGADO]: [],
      [EstadoPedido.CANCELADO]: [],
    },
    [Role.CLIENT]: {
      [EstadoPedido.PENDIENTE]: [],
      [EstadoPedido.PROCESANDO]: [],
      [EstadoPedido.LISTO]: [],
      [EstadoPedido.ENTREGADO]: [],
      [EstadoPedido.CANCELADO]: [],
    },
  }

  const estadosPermitidos = transiciones[rol]?.[estadoActual] ?? []

  if (!estadosPermitidos.includes(nuevoEstado)) {
    return {
      ok: false,
      error: `Transición no permitida de ${estadoActual} a ${nuevoEstado} para el rol ${rol}`,
    }
  }

  return { ok: true }
}
