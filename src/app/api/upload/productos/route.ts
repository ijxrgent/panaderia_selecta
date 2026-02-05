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

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'panaderia/productos',
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
      created_at: result.created_at,
    })
  } catch (error) {
    console.error('Error en upload productos:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Cloudinary') ? 502 : 500 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
