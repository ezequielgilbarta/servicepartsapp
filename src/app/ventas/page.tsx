import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import NuevaVentaModal from '@/components/ventas/NuevaVentaModal'
import FiltroEstado from '@/components/ventas/FiltroEstado'
import Link from 'next/link'
import {
  ESTADO_PAGO_LABELS,
  ESTADO_PAGO_COLORS,
  getEstadoPago,
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

  const [todasLasVentas, clientes, productos] = await Promise.all([
    prisma.venta.findMany({
      include: { cliente: true, pagos: true, items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.cliente.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.producto.findMany({
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        marca: true,
        modelo: true,
        codigoInterno: true,
        precioReferencia: true,
      },
    }),
  ])

  // El estado de pago se calcula (no vive en la base), así que el filtro se
  // aplica en JS después de traer los pagos de cada venta.
  const ventas = todasLasVentas.filter((venta) => {
    if (!estadoFiltro) return true
    if (estadoFiltro === 'CANCELADAS') return venta.cancelada
    if (venta.cancelada) return false
    const totalPagado = venta.pagos.reduce((s, p) => s + p.monto, 0)
    return getEstadoPago(totalPagado, venta.total + (venta.costoEnvio ?? 0)) === estadoFiltro
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
          <NuevaVentaModal clientes={clientes} productos={productos} />
        </div>

        {/* Filtros */}
        <div className="mb-5">
          <Suspense fallback={null}>
            <FiltroEstado />
          </Suspense>
        </div>

        {/* Vacío */}
        {ventas.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">No hay ventas para mostrar</p>
          </div>
        ) : (
          <>
            {/* ── Tabla desktop ── */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Cliente', 'Estado', 'Entrega', 'Fecha entrega', 'Total', 'Saldo'].map((h, i) => (
                      <th
                        key={h}
                        className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 ${i >= 4 ? 'text-right' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ventas.map((venta) => {
                    const totalPagado = venta.pagos.reduce((s, p) => s + p.monto, 0)
                    const saldo = venta.total + (venta.costoEnvio ?? 0) - totalPagado
                    const estadoPago = getEstadoPago(totalPagado, venta.total + (venta.costoEnvio ?? 0))

                    return (
                      <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">{venta.cliente.nombre}</p>
                          <p className="text-xs text-gray-400">{venta.cliente.telefono}</p>
                        </td>
                        <td className="px-5 py-4">
                          {venta.cancelada ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Cancelada
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_PAGO_COLORS[estadoPago]}`}>
                              {ESTADO_PAGO_LABELS[estadoPago]}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {TIPO_ENTREGA_LABELS[venta.tipoEntrega]}
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
                        <td className="px-5 py-4 text-right">
                          <Link href={`/ventas/${venta.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Cards mobile ── */}
            <div className="md:hidden space-y-3">
              {ventas.map((venta) => {
                const totalPagado = venta.pagos.reduce((s, p) => s + p.monto, 0)
                const saldo = venta.total + (venta.costoEnvio ?? 0) - totalPagado
                const estadoPago = getEstadoPago(totalPagado, venta.total + (venta.costoEnvio ?? 0))

                return (
                  <Link
                    key={venta.id}
                    href={`/ventas/${venta.id}`}
                    className="block bg-white border border-gray-200 rounded-xl p-4 active:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{venta.cliente.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{venta.cliente.telefono}</p>
                      </div>
                      {venta.cancelada ? (
                        <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Cancelada
                        </span>
                      ) : (
                        <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_PAGO_COLORS[estadoPago]}`}>
                          {ESTADO_PAGO_LABELS[estadoPago]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500">
                        <span>{TIPO_ENTREGA_LABELS[venta.tipoEntrega]}</span>
                        {venta.fechaEntrega && (
                          <span className="ml-2 text-gray-400">· {formatDate(venta.fechaEntrega)}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatCurrency(venta.total)}</p>
                        {saldo > 0 ? (
                          <p className="text-xs text-orange-600">Saldo: {formatCurrency(saldo)}</p>
                        ) : (
                          <p className="text-xs text-green-600">Pagado</p>
                        )}
                      </div>
                    </div>
                    {venta.items.length > 0 && (
                      <p className="mt-2 text-xs text-gray-400">
                        {venta.items.length} {venta.items.length === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
