// src/app/dashboard/layout.tsx
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: 'center',
        }}
      >
        <strong>Panadería Selecta · Dashboard Admin</strong>
      </header>

      {/* Contenido */}
      <main
        style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {children}
      </main>
    </div>
  )
}
