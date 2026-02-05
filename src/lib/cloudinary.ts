// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export { cloudinary } // Exportar la instancia configurada

export interface CloudinaryUploadResult {
  url: string
  publicId: string
}

export function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Upload fallido'))
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      })
      .end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}
