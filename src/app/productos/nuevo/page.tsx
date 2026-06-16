import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'
import ProductoForm from '@/components/productos/ProductoForm'
import { crearProducto } from '@/actions/productos/productos'

export default function NuevoProductoPage() {
  requireAuth()

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <Link href="/productos" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Productos
        </Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Nuevo producto</h1>
          <p className="text-sm text-gray-500 mt-0.5">Agregá un repuesto al catálogo</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ProductoForm action={crearProducto} submitLabel="Crear producto" />
        </div>
      </div>
    </AppLayout>
  )
}
