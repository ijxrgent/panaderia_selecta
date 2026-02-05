'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/authContext'
import {
  FaUserCircle,
  FaSignOutAlt,
  FaShoppingBag,
  FaTachometerAlt,
  FaCaretDown,
  FaUser,
  FaClipboardList,
  FaHome,
} from 'react-icons/fa'
import styles from './UserMenu.module.css'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout, isLoading } = useAuth()

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    )
  }

  // Formatear email para mostrar
  const formatEmail = (email: string) => {
    if (email.length > 18) {
      const [username, domain] = email.split('@')
      if (username.length > 10) {
        return `${username.substring(0, 8)}...@${domain.substring(0, 5)}...`
      }
      return `${username}@${domain.substring(0, 5)}...`
    }
    return email
  }

  // Obtener iniciales para avatar
  const getInitials = () => {
    if (user?.nombre) {
      return user.nombre.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Color según rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#d4a762' // Dorado panadería
      case 'EMPLOYEE':
        return '#8b4513' // Marrón
      default:
        return '#666' // Gris
    }
  }

  return (
    <div className={styles.userMenu} ref={dropdownRef}>
      <button
        onClick={toggleMenu}
        className={`${styles.userButton} ${isOpen ? styles.active : ''}`}
        aria-label="Menú de usuario"
      >
        {/* Avatar o icono */}
        {user ? (
          <div
            className={styles.avatar}
            style={{ backgroundColor: getRoleColor(user.role) }}
          >
            {getInitials()}
          </div>
        ) : (
          <FaUserCircle className={styles.guestIcon} />
        )}

        {/* Texto */}
        <span className={styles.userText}>
          {user ? (
            <>
              <span className={styles.userName}>
                {user.nombre || formatEmail(user.email)}
              </span>
              <span className={styles.userRoleTag}>
                {user.role === 'ADMIN'
                  ? '👑 Admin'
                  : user.role === 'EMPLOYEE'
                    ? '👔 Empleado'
                    : '👤 Cliente'}
              </span>
            </>
          ) : (
            <span className={styles.loginText}>Iniciar Sesión</span>
          )}
        </span>

        {/* Flecha indicadora */}
        <FaCaretDown
          className={`${styles.caret} ${isOpen ? styles.caretUp : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {user ? (
            // ==== USUARIO LOGEADO ====
            <>
              {/* Encabezado con info del usuario */}
              <div className={styles.userHeader}>
                <div
                  className={styles.headerAvatar}
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {getInitials()}
                </div>
                <div className={styles.headerInfo}>
                  <h4 className={styles.headerName}>
                    {user.nombre || 'Usuario'}
                  </h4>
                  <p className={styles.headerEmail}>{user.email}</p>
                  <span
                    className={styles.headerRole}
                    style={{ color: getRoleColor(user.role) }}
                  >
                    {user.role === 'ADMIN'
                      ? 'Administrador'
                      : user.role === 'EMPLOYEE'
                        ? 'Empleado'
                        : 'Cliente'}
                  </span>
                </div>
              </div>

              <div className={styles.divider}></div>

              {/* Enlaces principales */}
              <div className={styles.menuSection}>
                <h5 className={styles.sectionTitle}>Mi Cuenta</h5>
                <Link
                  href="/mi-perfil"
                  className={styles.menuItem}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className={styles.menuIcon} />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  href="/mis-pedidos"
                  className={styles.menuItem}
                  onClick={() => setIsOpen(false)}
                >
                  <FaClipboardList className={styles.menuIcon} />
                  <span>Mis Pedidos</span>
                </Link>

                <Link
                  href="/cart"
                  className={styles.menuItem}
                  onClick={() => setIsOpen(false)}
                >
                  <FaShoppingBag className={styles.menuIcon} />
                  <span>Mi Carrito</span>
                </Link>
              </div>

              {/* Dashboard solo para admin/empleado */}
              {(user.role === 'ADMIN' || user.role === 'EMPLOYEE') && (
                <>
                  <div className={styles.divider}></div>
                  <div className={styles.menuSection}>
                    <h5 className={styles.sectionTitle}>Administración</h5>
                    <Link
                      href="/dashboard"
                      className={styles.menuItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTachometerAlt className={styles.menuIcon} />
                      <span>Dashboard</span>
                      <span className={styles.badge}>Nuevo</span>
                    </Link>
                  </div>
                </>
              )}

              <div className={styles.divider}></div>

              {/* Acciones */}
              <div className={styles.menuActions}>
                <Link href="/" className={styles.homeLink}>
                  <FaHome />
                  <span>Ir al Inicio</span>
                </Link>

                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                >
                  <FaSignOutAlt />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          ) : (
            // ==== USUARIO NO LOGEADO ====
            <>
              {/* Mensaje de bienvenida */}
              <div className={styles.guestHeader}>
                <FaUserCircle className={styles.guestHeaderIcon} />
                <h4>Bienvenido a Panadería Selecta</h4>
                <p>Inicia sesión para disfrutar de todos los beneficios</p>
              </div>

              <div className={styles.divider}></div>

              {/* Opciones de acceso */}
              <div className={styles.menuSection}>
                <Link
                  href="/login"
                  className={`${styles.menuItem} ${styles.loginItem}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.itemContent}>
                    <FaUser className={styles.menuIcon} />
                    <div>
                      <span className={styles.itemTitle}>Iniciar Sesión</span>
                      <small className={styles.itemSubtitle}>
                        Accede a tu cuenta existente
                      </small>
                    </div>
                  </div>
                  <span className={styles.arrow}>→</span>
                </Link>

                <Link
                  href="/register"
                  className={`${styles.menuItem} ${styles.registerItem}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.itemContent}>
                    <FaUser className={styles.menuIcon} />
                    <div>
                      <span className={styles.itemTitle}>Registrarse</span>
                      <small className={styles.itemSubtitle}>
                        Crea una nueva cuenta
                      </small>
                    </div>
                  </div>
                  <span className={styles.arrow}>→</span>
                </Link>
              </div>

              <div className={styles.divider}></div>

              {/* Acceso rápido */}
              <div className={styles.menuActions}>
                <Link href="/productos" className={styles.quickLink}>
                  <FaShoppingBag />
                  <span>Ver Productos</span>
                </Link>
                <Link href="/contacto" className={styles.quickLink}>
                  <FaHome />
                  <span>Contacto</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
