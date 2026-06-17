import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import { formatCurrency } from '@/lib/utils'

export default async function ProductosPage() {
  requireAuth()

  const productos = await prisma.producto.findMany({
    orderBy: { nombre: 'asc' },
    include: { _count: { select: { ventaItems: true } } },
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <Link
            href="/productos/nuevo"
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Nuevo
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay productos en el catálogo</p>
            <Link href="/productos/nuevo" className="mt-3 inline-block text-sm text-gray-900 font-medium hover:underline">
              Agregar el primero →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Tabla desktop ── */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Producto</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Código</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Proveedor</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Costo ref.</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Precio ref.</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.marca} · {p.modelo}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 capitalize">{p.tipoElectrodomestico}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{p.codigoInterno}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{p.proveedorHabitual ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 text-sm text-right text-gray-700">{formatCurrency(p.costoProveedor)}</td>
                      <td className="px-5 py-4 text-sm text-right text-gray-700">
                        {p.precioReferencia ? formatCurrency(p.precioReferencia) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/productos/${p.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Cards mobile ── */}
            <div className="md:hidden space-y-3">
              {productos.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.marca} · {p.modelo}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{p.codigoInterno}</span>
                        <span className="text-xs text-gray-400 capitalize">{p.tipoElectrodomestico}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(p.costoProveedor)}</p>
                      {p.precioReferencia && (
                        <p className="text-xs text-gray-400 mt-0.5">Ref: {formatCurrency(p.precioReferencia)}</p>
                      )}
                      <p className="text-sm text-gray-400 mt-1">→</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
