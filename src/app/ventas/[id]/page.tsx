import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'
import CambiarEstado from '@/components/ventas/CambiarEstado'
import ItemRow from '@/components/ventas/ItemRow'
import RegistrarPago from '@/components/ventas/RegistrarPago'
import EliminarPago from '@/components/ventas/EliminarPago'
import EditarNotas from '@/components/ventas/EditarNotas'
import {
  formatCurrency,
  formatDate,
  getEstadoPago,
  TIPO_ENTREGA_LABELS,
  TIPO_PAGO_LABELS,
} from '@/lib/utils'

type Props = { params: { id: string } }

export default async function VentaDetallePage({ params }: Props) {
  requireAuth()

  const venta = await prisma.venta.findUnique({
    where: { id: params.id },
    include: {
      cliente: true,
      pagos: { orderBy: { fecha: 'asc' } },
      items: { include: { producto: true }, orderBy: { id: 'asc' } },
    },
  })

  if (!venta) notFound()

  const totalPagado = venta.pagos.reduce((s, p) => s + p.monto, 0)
  const saldoPendiente = venta.total + (venta.costoEnvio ?? 0) - totalPagado
  const estadoPago = getEstadoPago(totalPagado, venta.total + (venta.costoEnvio ?? 0))
  const itemsEntregados = venta.items.filter((i) => i.estadoPedido === 'ENTREGADO').length
  const totalItems = venta.items.length
  const todosEntregados = totalItems > 0 && itemsEntregados === totalItems
  const progresoPct = totalItems > 0 ? Math.round((itemsEntregados / totalItems) * 100) : 0

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl">

        {/* Breadcrumb */}
        <Link href="/ventas" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Ventas
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{venta.cliente.nombre}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span>{venta.cliente.telefono}</span>
              {venta.cliente.direccion && (
                <>
                  <span className="hidden md:inline">·</span>
                  <span>{venta.cliente.direccion}</span>
                </>
              )}
            </div>
          </div>
          <CambiarEstado ventaId={venta.id} estadoPago={estadoPago} cancelada={venta.cancelada} />
        </div>

        {/* Info rápida - 2 cols mobile, 4 desktop */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Creada</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(venta.createdAt)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Entrega estimada</p>
            <p className="text-sm font-medium text-gray-900">{formatDate(venta.fechaEntrega)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Tipo de entrega</p>
            <p className="text-sm font-medium text-gray-900">{TIPO_ENTREGA_LABELS[venta.tipoEntrega] ?? venta.tipoEntrega}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Items entregados</p>
            <p className="text-sm font-medium text-gray-900">{itemsEntregados} de {totalItems}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${todosEntregados ? 'bg-green-500' : 'bg-blue-400'}`}
                style={{ width: `${progresoPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-5 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 md:px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Productos</h2>
          </div>
          {venta.items.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No hay productos en esta venta</div>
          ) : (
            <>
              {/* Tabla desktop */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Producto', 'Cant. × Precio', 'Estado pedido', 'Seguimiento'].map((h) => (
                        <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {venta.items.map((item) => <ItemRow key={item.id} item={item} />)}
                  </tbody>
                </table>
              </div>
              {/* Cards mobile */}
              <div className="md:hidden divide-y divide-gray-100">
                {venta.items.map((item) => <ItemRow key={item.id} item={item} mobile />)}
              </div>
            </>
          )}
        </div>

        {/* Resumen + Pagos: stack en mobile, grid en desktop */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Resumen financiero */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Resumen financiero</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total productos</span>
                <span className="font-medium text-gray-900">{formatCurrency(venta.total)}</span>
              </div>
              {venta.costoEnvio != null && venta.costoEnvio > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Costo de envío</span>
                  <span className="font-medium text-gray-900">{formatCurrency(venta.costoEnvio)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total pagado</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalPagado)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between text-sm">
                <span className="font-semibold text-gray-900">Saldo pendiente</span>
                <span className={`font-bold text-base ${saldoPendiente > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {saldoPendiente > 0 ? formatCurrency(saldoPendiente) : 'Pagado ✓'}
                </span>
              </div>
            </div>
          </div>

          {/* Pagos */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Pagos</h2>
              <RegistrarPago ventaId={venta.id} saldoPendiente={saldoPendiente} />
            </div>
            {venta.pagos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {venta.pagos.map((pago) => (
                  <div key={pago.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(pago.monto)}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {TIPO_PAGO_LABELS[pago.tipo] ?? pago.tipo} · {formatDate(pago.fecha)}
                      </span>
                    </div>
                    <EliminarPago pagoId={pago.id} ventaId={venta.id} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Notas</h2>
          <EditarNotas ventaId={venta.id} notas={venta.notas} />
        </div>

      </div>
    </AppLayout>
  )
}
