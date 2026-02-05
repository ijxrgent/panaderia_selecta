// Header.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import UserMenu from '..//UserMenu/UserMenu'
import { useCart } from '@/context/cartContext'
import styles from './Hearder.module.css'
import { useAuth } from '@/context/authContext'
import { FaClipboardList } from 'react-icons/fa'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const { totalItems } = useCart()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/logo_panaderia_selecta.png"
              alt="Panadería Selecta - Herencia Panadera desde 1996"
              width={180}
              height={80}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Navegación Desktop */}
        <nav className={`${styles.nav} ${styles.navDesktop}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Inicio
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/productos" className={styles.navLink}>
                Productos
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/panaderia" className={styles.navLink}>
                Panadería
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/nosotros" className={styles.navLink}>
                Nosotros
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/contacto" className={styles.navLink}>
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sección derecha - Desktop */}
        <div className={`${styles.rightSection} ${styles.rightSectionDesktop}`}>
          {/* Icono de carrito */}
          <Link
            href="/cart"
            className={`${styles.cartIcon} ${styles.cartWrapper}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalItems > 0 && (
              <span className={`${styles.cartBadge} ${styles.cartSection}`}>
                {totalItems}
              </span>
            )}
          </Link>
          {/* Usamos el componente LoginButton */}
          <div className={styles.mobileUserMenu}>
            <UserMenu />
          </div>
        </div>

        {/* Icono de carrito - Mobile (Centro) */}
        <div className={styles.cartSectionMobile}>
          <Link
            href="/cart"
            className={`${styles.cartIconMobile} ${styles.cartWrapperMobile}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalItems > 0 && (
              <span
                className={`${styles.cartBadgeMobile} ${styles.cartSectionMobile}`}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Botón Hamburguesa - Mobile */}
        <button
          className={`${styles.hamburger} ${
            isMenuOpen ? styles.hamburgerActive : ''
          }`}
          onClick={toggleMenu}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú Mobile */}
        <div
          className={`${styles.mobileMenu} ${
            isMenuOpen ? styles.mobileMenuActive : ''
          }`}
        >
          <nav className={styles.navMobile}>
            <ul className={styles.navListMobile}>
              <li className={styles.navItemMobile}>
                <Link
                  href="/"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Inicio
                </Link>
              </li>
              <li className={styles.navItemMobile}>
                <Link
                  href="/productos"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Productos
                </Link>
              </li>
              <li className={styles.navItemMobile}>
                <Link
                  href="/panaderia"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Panadería
                </Link>
              </li>
              <li className={styles.navItemMobile}>
                <Link
                  href="/nosotros"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Nosotros
                </Link>
              </li>
              <li className={styles.navItemMobile}>
                <Link
                  href="/contacto"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Contacto
                </Link>
              </li>
              <li className={styles.navItemMobile}>
                <Link
                  href="/cart"
                  className={styles.navLinkMobile}
                  onClick={toggleMenu}
                >
                  Carrito
                </Link>
              </li>
              {user && (
                <li
                  className={`${styles.navItemMobile} ${styles.misPedidosMobile}`}
                >
                  <Link
                    href="/mis-pedidos"
                    className={styles.navLinkMobile}
                    onClick={toggleMenu}
                  >
                    <FaClipboardList size={18} />
                    Mis pedidos
                  </Link>
                </li>
              )}

              <li className={styles.navItemMobile}>
                {!user ? (
                  <Link
                    href="/login"
                    className={`${styles.navLinkMobile} ${styles.loginLinkMobile}`}
                    onClick={toggleMenu}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Login / Signin
                  </Link>
                ) : (
                  <button
                    className={styles.logoutMobile}
                    onClick={() => {
                      logout()
                      toggleMenu()
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 17L21 12L16 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Cerrar sesión
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
