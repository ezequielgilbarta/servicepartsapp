import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import ProductoForm from '@/components/productos/ProductoForm'
import EliminarProducto from '@/components/productos/EliminarProducto'
import { actualizarProducto } from '@/actions/productos/productos'
import { formatDate } from '@/lib/utils'

type Props = { params: { id: string } }

export default async function EditarProductoPage({ params }: Props) {
  requireAuth()

  const producto = await prisma.producto.findUnique({
    where: { id: params.id },
    include: { _count: { select: { ventaItems: true } } },
  })

  if (!producto) notFound()

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-2xl">
        <Link href="/productos" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Productos
        </Link>

        <div className="mt-4 mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{producto.nombre}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Usado en {producto._count.ventaItems} {producto._count.ventaItems === 1 ? 'venta' : 'ventas'}
              {' · '}Modificado: {formatDate(producto.lastModified)}
            </p>
          </div>
          <EliminarProducto productoId={producto.id} tieneVentas={producto._count.ventaItems > 0} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <ProductoForm action={actualizarProducto} producto={producto} submitLabel="Guardar cambios" />
        </div>
      </div>
    </AppLayout>
  )
}
