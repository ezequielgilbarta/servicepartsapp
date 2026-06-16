import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import EliminarProducto from '@/components/productos/EliminarProducto'
import { formatCurrency } from '@/lib/utils'

export default async function ProductosPage() {
  requireAuth()

  const productos = await prisma.producto.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      _count: { select: { ventaItems: true } },
    },
  })

  return (
    <AppLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'} en el catálogo
            </p>
          </div>
          <Link
            href="/productos/nuevo"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Nuevo producto
          </Link>
        </div>

        {/* Tabla */}
        {productos.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay productos en el catálogo</p>
            <Link href="/productos/nuevo" className="mt-3 inline-block text-sm text-gray-900 font-medium hover:underline">
              Agregar el primero →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Producto
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Código
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Proveedor habitual
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Costo ref.
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Precio ref.
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Ventas
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {producto.marca} · {producto.modelo}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 capitalize">
                      {producto.tipoElectrodomestico}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {producto.codigoInterno}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {producto.proveedorHabitual ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-right text-gray-700">
                      {formatCurrency(producto.costoProveedor)}
                    </td>
                    <td className="px-5 py-4 text-sm text-right text-gray-700">
                      {producto.precioReferencia
                        ? formatCurrency(producto.precioReferencia)
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {producto._count.ventaItems}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/productos/${producto.id}`}
                          className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Editar
                        </Link>
                        <EliminarProducto
                          productoId={producto.id}
                          tieneVentas={producto._count.ventaItems > 0}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
