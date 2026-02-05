'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './customDropdown.module.css'

interface Option {
  id: number | ''
  nombre: string
}

interface CustomDropdownProps {
  options: Option[]
  value: number | ''
  onChange: (value: number | '') => void
  placeholder?: string
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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

  const selectedOption = options.find((opt) => opt.id === value)
  const displayText = selectedOption ? selectedOption.nombre : placeholder

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.selectedText}>{displayText}</span>
        <span className={styles.arrow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuContent}>
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.option} ${
                  value === option.id ? styles.selected : ''
                }`}
                onClick={() => {
                  onChange(option.id)
                  setIsOpen(false)
                }}
              >
                {value === option.id && (
                  <span className={styles.checkIcon}>✓</span>
                )}
                <span className={styles.optionText}>{option.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
