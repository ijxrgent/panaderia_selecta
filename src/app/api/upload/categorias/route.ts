import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo inválido' }, { status: 400 })
    }

    // Validaciones adicionales del archivo
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo no debe exceder los 5MB' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Use JPEG, PNG o WebP' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'panaderia/categorias',
            transformation: [
              { width: 800, height: 600, crop: 'fill' }, // Optimizar para categorías
              { quality: 'auto:good' },
            ],
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              console.error('Cloudinary upload error:', {
                message: error.message,
                http_code: error.http_code,
                name: error.name,
              })
              reject(
                new Error(
                  `Error Cloudinary: ${error.message} (Código: ${error.http_code})`
                )
              )
              return
            }
            if (!result) {
              reject(new Error('Upload fallido: resultado indefinido'))
              return
            }
            resolve(result)
          }
        )
        .end(buffer)
    })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Error en upload categorías:', error)

    // Manejo específico de errores
    if (error instanceof Error) {
      const status = error.message.includes('Cloudinary') ? 502 : 500
      const message = error.message.includes('Cloudinary')
        ? 'Error en el servicio de imágenes'
        : error.message

      return NextResponse.json({ error: message }, { status })
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
