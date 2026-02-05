// CategoryForm.tsx - SOLO CAMBIO NECESARIO
'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './styles/categoryForm.module.css'
import { apiFetch } from '@/lib/api' // 👈 Solo agrega esta línea

interface Props {
  onCreated: (categoria: { id: number; nombre: string }) => void
}

export default function CategoryForm({ onCreated }: Props) {
  const [nombre, setNombre] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('nombre', nombre)

      if (imageFile) {
        formData.append('imagen', imageFile)
      }

      // 🔄 SOLO CAMBIA ESTAS 2 LÍNEAS:
      const categoria = await apiFetch('/api/categorias', {
        method: 'POST',
        body: formData,
      })

      onCreated(categoria)

      setNombre('')
      setImageFile(null)
      setPreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fileWrapper}>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setImageFile(file)
            setPreview(file ? URL.createObjectURL(file) : null)
          }}
          className={styles.fileInput}
        />
        <label htmlFor="imageUpload" className={styles.fileLabel}>
          {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen (opcional)'}
        </label>

        {preview && (
          <Image
            src={preview}
            alt="Vista previa"
            width={140}
            height={140}
            className={styles.previewImage}
            unoptimized
          />
        )}
      </div>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la categoría"
        className={styles.input}
      />

      <button
        type="submit"
        disabled={loading}
        className={`${styles.button} ${loading ? styles.loading : ''}`}
      >
        {loading ? 'Creando...' : 'Crear categoría'}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}
