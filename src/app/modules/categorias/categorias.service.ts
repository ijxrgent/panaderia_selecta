import { prisma } from '@/lib/prisma'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export class CategoriasService {
  obtenerCategorias() {
    return prisma.categoria.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        imagen: true,
      },
    })
  }

  crearCategoria(data: {
    nombre: string
    descripcion?: string | null
    imagen?: string | null
    imagenPublicId?: string | null
  }) {
    return prisma.categoria.create({ data })
  }

  async obtenerCategoriaPorId(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { productos: true },
    })

    if (!categoria) {
      throw new Error('Categoría no encontrada.')
    }

    return categoria
  }

  async actualizarCategoria(
    id: number,
    data: {
      nombre?: string
      descripcion?: string | null
      imagen?: string | null
      imagenPublicId?: string | null
    }
  ) {
    const categoria = await prisma.categoria.findUnique({ where: { id } })

    if (!categoria) {
      throw new Error('Categoría no encontrada')
    }

    // 👇 si hay imagen nueva y había una vieja → borrar vieja
    if (data.imagenPublicId && categoria.imagenPublicId) {
      await deleteFromCloudinary(categoria.imagenPublicId)
    }

    return prisma.categoria.update({
      where: { id },
      data,
    })
  }

  async eliminarCategoria(id: number) {
    const categoria = await prisma.categoria.findUnique({ where: { id } })

    if (!categoria) {
      throw new Error('Categoría no encontrada')
    }

    // 👇 borrar imagen en Cloudinary
    if (categoria.imagenPublicId) {
      await deleteFromCloudinary(categoria.imagenPublicId)
    }

    return prisma.categoria.delete({ where: { id } })
  }
}
