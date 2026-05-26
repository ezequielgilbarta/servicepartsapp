import { requireAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

export default function VentaDetallePage({ params }: { params: { id: string } }) {
  requireAuth()

  return (
    <AppLayout>
      <div className="p-8">
        <Link href="/ventas" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
          ← Volver a ventas
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Detalle de venta</h1>
        <p className="text-gray-500 mt-1">Módulo en construcción — ID: {params.id}</p>
      </div>
    </AppLayout>
  )
}
