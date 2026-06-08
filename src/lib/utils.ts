export const ESTADO_VENTA_LABELS: Record<string, string> = {
  PRESUPUESTO: 'Presupuesto',
  SENA_RECIBIDA: 'Seña recibida',
  EN_PROGRESO: 'En progreso',
  LISTO_ENTREGA: 'Listo para entregar',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const ESTADO_VENTA_COLORS: Record<string, string> = {
  PRESUPUESTO: 'bg-gray-100 text-gray-700',
  SENA_RECIBIDA: 'bg-blue-100 text-blue-700',
  EN_PROGRESO: 'bg-yellow-100 text-yellow-700',
  LISTO_ENTREGA: 'bg-green-100 text-green-700',
  ENTREGADO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

export const PROVEEDOR_ESTADO_LABELS: Record<string, string> = {
  NO_PEDIDO: 'No pedido',
  PEDIDO: 'Pedido',
  EN_CAMINO: 'En camino',
  RECIBIDO: 'Recibido',
}

export const PROVEEDOR_ESTADO_COLORS: Record<string, string> = {
  NO_PEDIDO: 'bg-gray-100 text-gray-600',
  PEDIDO: 'bg-blue-100 text-blue-600',
  EN_CAMINO: 'bg-orange-100 text-orange-600',
  RECIBIDO: 'bg-green-100 text-green-700',
}

export const TIPO_PAGO_LABELS: Record<string, string> = {
  SENA: 'Seña',
  SALDO: 'Saldo',
  ENVIO: 'Envío',
}

export const TIPO_ENTREGA_LABELS: Record<string, string> = {
  RETIRO: 'Retiro en local',
  ENVIO: 'Envío a domicilio',
}

// mostrar dinero en tablas, cards, resúmenes, listados.
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// mostrar dinero dentro de inputs editables.
export function formatMoneyInput(valor: string) {
  const limpio = valor
    .replace(/\./g, '')
    .replace(',', '.')

  const numero = Number(limpio)

  if (isNaN(numero)) return ''

  return numero.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// convertir el valor del input para enviarlo al servidor.
export function parseMoneyInput(valor: string) {
  return valor.replace(/\./g, '').replace(',', '.')
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export const ESTADOS_VENTA = [
  'PRESUPUESTO',
  'SENA_RECIBIDA',
  'EN_PROGRESO',
  'LISTO_ENTREGA',
  'ENTREGADO',
  'CANCELADO',
] as const

export const PROVEEDOR_ESTADOS = [
  'NO_PEDIDO',
  'PEDIDO',
  'EN_CAMINO',
  'RECIBIDO',
] as const

export const TIPOS_PAGO = ['SENA', 'SALDO', 'ENVIO'] as const
