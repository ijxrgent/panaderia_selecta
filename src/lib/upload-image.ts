import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function saveProductImage(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = path.extname(file.name)
  const fileName = `${crypto.randomUUID()}${ext}`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'productos')

  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)

  // Ruta pública (la que se guarda en DB)
  return `/uploads/productos/${fileName}`
}
