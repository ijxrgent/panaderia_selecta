// ProductForm.tsx - SOLO CAMBIO NECESARIO
'use client'

import { useState } from 'react'
import styles from './styles/productForm.module.css'
import type { Producto } from '@/types/productos'
import Image from 'next/image'
import { apiFetch } from '@/lib/api' // 👈 Solo agrega esta línea

interface ProductFormProps {
  categoriaId: number | ''
  onCreated: (product: Producto) => void
}

export default function ProductForm({
  categoriaId,
  onCreated,
}: ProductFormProps) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [detalles, setDetalles] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [stock, setStock] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!categoriaId) {
      setError('Debe seleccionar una categoría')
      setLoading(false)
      return
    }

    const precioNumero = parseFloat(precio)
    if (isNaN(precioNumero) || precioNumero <= 0) {
      setError('El precio debe ser un número mayor a 0')
      setLoading(false)
      return
    }

    const stockNumero = parseInt(stock, 10)
    if (isNaN(stockNumero) || stockNumero < 0) {
      setError('El stock debe ser un número válido (0 o mayor)')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('precio', precioNumero.toString())
      formData.append('categoriaId', String(categoriaId))
      formData.append('descripcion', detalles)
      formData.append('stock', stockNumero.toString())

      if (imageFile) {
        formData.append('imagen', imageFile)
      }

      console.log('precio enviado:', precioNumero, 'tipo:', typeof precioNumero)

      // 🔄 SOLO CAMBIA ESTAS 2 LÍNEAS:
      const newProduct = await apiFetch('/api/productos', {
        method: 'POST',
        body: formData,
      })

      onCreated(newProduct)

      // reset
      setNombre('')
      setPrecio('')
      setDetalles('')
      setImageFile(null)
      setPreview(null)
      setStock('')
      setSuccess('Producto creado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setImageFile(file)

          if (file) {
            setPreview(URL.createObjectURL(file))
          } else {
            setPreview(null)
          }
        }}
        className={styles.fileInput}
      />
      <label htmlFor="imageUpload" className={styles.fileLabel}>
        {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen (opcional)'}
      </label>

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={120}
          height={120}
          style={{ marginTop: 10 }}
          unoptimized
        />
      )}

      <input
        className={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        className={styles.input}
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        step="0.01"
        min="0"
        required
      />

      <input
        className={styles.input}
        type="number"
        placeholder="Stock inicial"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
        required
      />

      <textarea
        className={styles.textarea}
        placeholder="Detalles adicionales"
        value={detalles}
        onChange={(e) => setDetalles(e.target.value)}
      />

      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear producto'}
      </button>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}
