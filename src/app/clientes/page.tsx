import { requireAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'

export default function ClientesPage() {
  requireAuth()

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <p className="text-gray-500 mt-1">Módulo en construcción</p>
      </div>
    </AppLayout>
  )
}
