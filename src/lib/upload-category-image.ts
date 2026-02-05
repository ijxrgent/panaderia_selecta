import fs from 'fs/promises'
import path from 'path'

export async function saveCategoryImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'categorias')

  await fs.mkdir(uploadsDir, { recursive: true })

  const ext = file.name.split('.').pop()
  const fileName = `cat-${Date.now()}.${ext}`

  const filePath = path.join(uploadsDir, fileName)

  await fs.writeFile(filePath, buffer)

  // 👉 esto es lo que guardas en BD
  return `/uploads/categorias/${fileName}`
}
