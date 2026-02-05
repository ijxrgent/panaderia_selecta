// src/lib/image-utils.ts
export function getImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null

  // Si ya es una URL completa (http o https)
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Si la ruta no empieza con /, agregarlo
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`
  }

  // Si ya empieza con /, dejarla así
  return imagePath
}
