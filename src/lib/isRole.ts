//src/lib/isRole.ts
import { Role } from '@prisma/client'

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && value in Role
}
