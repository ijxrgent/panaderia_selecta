'use client'

import styles from './page.module.css'
import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cartContext'
import {
  FaHome,
  FaBuilding,
  FaMapMarkerAlt,
  FaTruck,
  FaCheck,
} from 'react-icons/fa'

interface FormData {
  direccion: string
  casaApto: string
  barrioEdificio: string
}

export default function EnvioPage() {
  const router = useRouter()
  const { setCheckoutData, setDeliveryType } = useCart()

  const [formData, setFormData] = useState<FormData>({
    direccion: '',
    casaApto: '',
    barrioEdificio: '',
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Construir dirección completa
    const direccionCompleta = [
      formData.direccion,
      formData.casaApto,
      formData.barrioEdificio,
    ]
      .filter(Boolean)
      .join(', ')

    // Guardar en contexto
    setDeliveryType('delivery')
    setCheckoutData({
      direccion: direccionCompleta,
    })

    // Ir al paso final (pickup reutiliza ir-a-recoger como confirmación)
    router.push('/ir-a-recoger')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Datos de entrega</h1>
        <p className={styles.subtitle}>Panadería Selecta • Envío a domicilio</p>
      </header>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <FaTruck className={styles.truckIcon} />
          <div>
            <h3>Envío disponible</h3>
            <p>Costo: $3.000 • Tiempo: 30-45 min</p>
            <p className={styles.note}>
              Zona de cobertura: Centro y barrios aledaños
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <FaMapMarkerAlt className={styles.icon} />
              <h3>Dirección principal</h3>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>Dirección completa</span>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.direccion}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('direccion', e.target.value)
                    }
                    placeholder="Calle, número, referencia"
                    required
                  />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <div className={styles.labelWithIcon}>
                  <FaHome className={styles.inputIcon} />
                  <span className={styles.labelText}>Casa / Apartamento</span>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.casaApto}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('casaApto', e.target.value)
                    }
                    placeholder="Ej: Casa 2, Apt 301"
                  />
                </div>
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <div className={styles.labelWithIcon}>
                  <FaBuilding className={styles.inputIcon} />
                  <span className={styles.labelText}>Barrio / Edificio</span>
                </div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.barrioEdificio}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('barrioEdificio', e.target.value)
                    }
                    placeholder="Ej: Centro, Edificio Torreón"
                    required
                  />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.notes}>
            <p>
              ℹ️ Asegúrate de que la dirección sea correcta. El repartidor te
              llamará al llegar.
            </p>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!formData.direccion || !formData.barrioEdificio}
          >
            <FaCheck /> Continuar con el pedido
          </button>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>¿Problemas con la dirección? Llámanos: 317 777 9390</p>
      </footer>
    </div>
  )
}
