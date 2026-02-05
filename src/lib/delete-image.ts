import fs from 'fs/promises'
import path from 'path'

export async function deleteProductImage(imagePath: string | null) {
  if (!imagePath) return

  try {
    // Si la imagen es una URL externa (ej: placeholder), no la borres
    if (imagePath.startsWith('http')) {
      return
    }

    // Construir la ruta completa en public/uploads
    const fullPath = path.join(process.cwd(), 'public', imagePath)

    // Verificar si el archivo existe
    await fs.access(fullPath)

    // Borrar el archivo
    await fs.unlink(fullPath)
    console.log(`Imagen eliminada: ${fullPath}`)
  } catch (error) {
    // Si el archivo no existe o hay error, solo loguear
    console.warn(`No se pudo eliminar la imagen ${imagePath}:`, error)
  }
}
