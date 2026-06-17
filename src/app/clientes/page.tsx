import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'

export default async function ClientesPage() {
  requireAuth()

  const clientes = await prisma.cliente.findMany({
    orderBy: { nombre: 'asc' },
    include: { _count: { select: { ventas: true } } },
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <Link
            href="/clientes/nuevo"
            className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Nuevo
          </Link>
        </div>

        {clientes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay clientes registrados</p>
            <Link href="/clientes/nuevo" className="mt-3 inline-block text-sm text-gray-900 font-medium hover:underline">
              Crear el primero →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Tabla desktop ── */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Nombre', 'Teléfono', 'Dirección', 'Ventas'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientes.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{c.nombre}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.telefono}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{c.direccion ?? <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c._count.ventas}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/clientes/${c.id}`}
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
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
              {clientes.map((c) => (
                <Link
                  key={c.id}
                  href={`/clientes/${c.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.nombre}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{c.telefono}</p>
                      {c.direccion && <p className="text-xs text-gray-400 mt-0.5">{c.direccion}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs text-gray-400">{c._count.ventas} {c._count.ventas === 1 ? 'venta' : 'ventas'}</p>
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
