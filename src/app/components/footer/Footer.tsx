// src/components/Footer/Footer.tsx
'use client'

import Link from 'next/link'
import styles from './footer.module.css'
import { useAuth } from '@/context/authContext'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Identidad */}
        <div className={styles.brand}>
          <h3 className={styles.logo}>Panadería Selecta</h3>
          <p className={styles.tagline}>Tradición panadera desde 1996</p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <div>
            <h4>Empresa</h4>
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/contacto">Contacto</Link>
            <Link href="/panaderia">Panadería</Link>
          </div>

          <div>
            <h4>Cuenta</h4>
            {!user && <Link href="/login">Iniciar sesión</Link>}
            {user && <Link href="/mis-pedidos">Mis pedidos</Link>}
            {user?.role === 'ADMIN' && <Link href="/dashboard">Dashboard</Link>}
          </div>

          <div>
            <h4>Legal</h4>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
          </div>
        </div>
      </div>

      <div className={styles.copy}>
        © {new Date().getFullYear()} Panadería Selecta. Todos los derechos
        reservados.
      </div>
    </footer>
  )
}
