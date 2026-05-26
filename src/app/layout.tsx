import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Repuestos App',
  description: 'Gestión de ventas de repuestos de electrodomésticos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
