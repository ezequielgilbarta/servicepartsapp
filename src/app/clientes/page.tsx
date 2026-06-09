import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import EliminarCliente from '@/components/clientes/EliminarCliente'
import { formatDate } from '@/lib/utils'

export default async function ClientesPage() {
  requireAuth()

  const clientes = await prisma.cliente.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      _count: { select: { ventas: true } },
    },
  })

  return (
    <AppLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
            </p>
          </div>
          <Link
            href="/clientes/nuevo"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Nuevo cliente
          </Link>
        </div>

        {/* Tabla */}
        {clientes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay clientes registrados</p>
            <Link href="/clientes/nuevo" className="mt-3 inline-block text-sm text-gray-900 font-medium hover:underline">
              Crear el primero →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Nombre
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Teléfono
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Dirección
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Ventas
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Desde
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-900">{cliente.nombre}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {cliente.telefono}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {cliente.direccion ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {cliente._count.ventas}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(cliente.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/clientes/${cliente.id}`}
                          className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Editar
                        </Link>
                        <EliminarCliente
                          clienteId={cliente.id}
                          tieneVentas={cliente._count.ventas > 0}
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
