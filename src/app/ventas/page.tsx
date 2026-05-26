import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import NuevaVentaModal from '@/components/ventas/NuevaVentaModal'
import FiltroEstado from '@/components/ventas/FiltroEstado'
import Link from 'next/link'
import {
  ESTADO_VENTA_LABELS,
  ESTADO_VENTA_COLORS,
  TIPO_ENTREGA_LABELS,
  formatCurrency,
  formatDate,
} from '@/lib/utils'
import { Suspense } from 'react'

type PageProps = {
  searchParams: { estado?: string }
}

export default async function VentasPage({ searchParams }: PageProps) {
  requireAuth()

  const estadoFiltro = searchParams.estado

  const [ventas, clientes] = await Promise.all([
    prisma.venta.findMany({
      where: estadoFiltro ? { estado: estadoFiltro } : undefined,
      include: {
        cliente: true,
        pagos: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
    }),
  ])

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {ventas.length} {ventas.length === 1 ? 'venta' : 'ventas'}
              {estadoFiltro ? ` en estado "${ESTADO_VENTA_LABELS[estadoFiltro as keyof typeof ESTADO_VENTA_LABELS]}"` : ' en total'}
            </p>
          </div>
          <NuevaVentaModal clientes={clientes} />
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <FiltroEstado />
          </Suspense>
        </div>

        {/* Tabla */}
        {ventas.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay ventas para mostrar</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Estado
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Entrega
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Fecha entrega
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Total
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Saldo pendiente
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Items
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ventas.map((venta) => {
                  const totalPagado = venta.pagos.reduce((sum, p) => sum + p.monto, 0)
                  const saldo = venta.total + (venta.costoEnvio ?? 0) - totalPagado
                  const estado = venta.estado as keyof typeof ESTADO_VENTA_LABELS

                  return (
                    <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {venta.cliente.nombre}
                        </span>
                        <span className="block text-xs text-gray-400">{venta.cliente.telefono}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_VENTA_COLORS[estado]}`}>
                          {ESTADO_VENTA_LABELS[estado]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {TIPO_ENTREGA_LABELS[venta.tipoEntrega as keyof typeof TIPO_ENTREGA_LABELS]}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(venta.fechaEntrega)}
                      </td>
                      <td className="px-5 py-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(venta.total)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-sm font-medium ${saldo > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {saldo > 0 ? formatCurrency(saldo) : 'Pagado'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {venta.items.length} {venta.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/ventas/${venta.id}`}
                          className="text-sm font-medium text-gray-900 hover:underline"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
