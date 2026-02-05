// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '..//app/components/Header/Header'
import WhatsAppButton from './components/ui/WhatsAppButton'
import Footer from './components/footer/Footer'
import { AuthProvider } from '@/context/authContext'
import { CartProvider } from '@/context/cartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Panadería Selecta - Herencia Panadera desde 1996',
  description:
    'Panadería tradicional con los mejores productos horneados diariamente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
            <WhatsAppButton phone={'573177779390'} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
