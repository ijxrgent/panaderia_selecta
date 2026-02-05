import { NextRequest, NextResponse } from 'next/server'
import { CategoriasService } from '@/app/modules/categorias/categorias.service'
import { validateTokenAndRole } from '@/lib/auth-utils'
import { uploadToCloudinary } from '@/lib/cloudinary'

const service = new CategoriasService()

export async function GET() {
  try {
    const categorias = await service.obtenerCategorias()
    return NextResponse.json(categorias)
  } catch {
    return NextResponse.json(
      { error: 'Error obteniendo categorías' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const validation = await validateTokenAndRole(req, ['ADMIN'])

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    )
  }

  try {
    const formData = await req.formData()

    const nombre = formData.get('nombre')
    const descripcion = formData.get('descripcion')
    const file = formData.get('imagen')

    if (!nombre || typeof nombre !== 'string') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    let imagen: string | null = null
    let imagenPublicId: string | null = null

    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())

      const upload = await uploadToCloudinary(buffer, 'panaderia/categorias')

      imagen = upload.url
      imagenPublicId = upload.publicId
    }

    const categoria = await service.crearCategoria({
      nombre,
      descripcion: typeof descripcion === 'string' ? descripcion : null,
      imagen,
      imagenPublicId,
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
