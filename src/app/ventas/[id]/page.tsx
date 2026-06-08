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
  TIPO_ENTREGA_LABELS,
  TIPO_PAGO_LABELS,
} from '@/lib/utils'

type Props = {
  params: { id: string }
}

export default async function VentaDetallePage({ params }: Props) {
  requireAuth()

  const venta = await prisma.venta.findUnique({
    where: { id: params.id },
    include: {
      cliente: true,
      pagos: { orderBy: { fecha: 'asc' } },
      items: {
        include: { producto: true },
        orderBy: { id: 'asc' },
      },
    },
  })

  if (!venta) notFound()

  // ── Cálculos ───────────────────────────────────────────────────────────────
  const totalPagado = venta.pagos.reduce((sum, p) => sum + p.monto, 0)
  const saldoPendiente = venta.total + (venta.costoEnvio ?? 0) - totalPagado
  const itemsRecibidos = venta.items.filter((i) => i.proveedorEstado === 'RECIBIDO').length
  const totalItems = venta.items.length
  const todosRecibidos = totalItems > 0 && itemsRecibidos === totalItems
  const progresoPct = totalItems > 0 ? Math.round((itemsRecibidos / totalItems) * 100) : 0

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl">

        {/* Breadcrumb */}
        <Link href="/ventas" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Ventas
        </Link>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{venta.cliente.nombre}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>{venta.cliente.telefono}</span>
              {venta.cliente.direccion && (
                <>
                  <span>·</span>
                  <span>{venta.cliente.direccion}</span>
                </>
              )}
            </div>
          </div>

          <CambiarEstado
            ventaId={venta.id}
            estadoActual={venta.estado}
            todosRecibidos={todosRecibidos}
          />
        </div>

        {/* ── Info rápida ─────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-4 gap-3">
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
            <p className="text-sm font-medium text-gray-900">
              {TIPO_ENTREGA_LABELS[venta.tipoEntrega] ?? venta.tipoEntrega}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Items recibidos</p>
            <p className="text-sm font-medium text-gray-900">{itemsRecibidos} de {totalItems}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${todosRecibidos ? 'bg-green-500' : 'bg-blue-400'}`}
                style={{ width: `${progresoPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Items ───────────────────────────────────────────────────────── */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Productos</h2>
          </div>

          {venta.items.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No hay productos en esta venta
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Producto
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Cant. × Precio
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Estado proveedor
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Seguimiento
                  </th>
                </tr>
              </thead>
              <tbody>
                {venta.items.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Resumen financiero + Pagos ──────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-6">

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

        {/* ── Notas ───────────────────────────────────────────────────────── */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Notas</h2>
          <EditarNotas ventaId={venta.id} notas={venta.notas} />
        </div>

      </div>
    </AppLayout>
  )
}
