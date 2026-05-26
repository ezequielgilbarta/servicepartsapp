import { EstadoVenta, ProveedorEstado, TipoPago, TipoEntrega } from '@prisma/client'

export const ESTADO_VENTA_LABELS: Record<EstadoVenta, string> = {
  PRESUPUESTO: 'Presupuesto',
  SENA_RECIBIDA: 'Seña recibida',
  EN_PROGRESO: 'En progreso',
  LISTO_ENTREGA: 'Listo para entregar',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const ESTADO_VENTA_COLORS: Record<EstadoVenta, string> = {
  PRESUPUESTO: 'bg-gray-100 text-gray-700',
  SENA_RECIBIDA: 'bg-blue-100 text-blue-700',
  EN_PROGRESO: 'bg-yellow-100 text-yellow-700',
  LISTO_ENTREGA: 'bg-green-100 text-green-700',
  ENTREGADO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

export const PROVEEDOR_ESTADO_LABELS: Record<ProveedorEstado, string> = {
  NO_PEDIDO: 'No pedido',
  PEDIDO: 'Pedido',
  EN_CAMINO: 'En camino',
  RECIBIDO: 'Recibido',
}

export const PROVEEDOR_ESTADO_COLORS: Record<ProveedorEstado, string> = {
  NO_PEDIDO: 'bg-gray-100 text-gray-600',
  PEDIDO: 'bg-blue-100 text-blue-600',
  EN_CAMINO: 'bg-orange-100 text-orange-600',
  RECIBIDO: 'bg-green-100 text-green-700',
}

export const TIPO_PAGO_LABELS: Record<TipoPago, string> = {
  SENA: 'Seña',
  SALDO: 'Saldo',
  ENVIO: 'Envío',
}

export const TIPO_ENTREGA_LABELS: Record<TipoEntrega, string> = {
  RETIRO: 'Retiro en local',
  ENVIO: 'Envío a domicilio',
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
