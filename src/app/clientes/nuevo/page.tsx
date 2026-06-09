import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'
import ClienteForm from '@/components/clientes/ClienteForm'
import { crearCliente } from '@/actions/clientes/clientes'

export default function NuevoClientePage() {
  requireAuth()

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <Link href="/clientes" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Clientes
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Nuevo cliente</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ClienteForm action={crearCliente} submitLabel="Crear cliente" />
        </div>
      </div>
    </AppLayout>
  )
}
