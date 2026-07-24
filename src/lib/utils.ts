// Estado de pago de la venta: se calcula a partir de los pagos
// registrados, no se guarda en la base.
export type EstadoPago = 'SIN_PAGOS' | 'SENA_RECIBIDA' | 'FINALIZADA'

export function getEstadoPago(totalPagado: number, totalConEnvio: number): EstadoPago {
  if (totalPagado <= 0) return 'SIN_PAGOS'
  if (totalPagado >= totalConEnvio) return 'FINALIZADA'
  return 'SENA_RECIBIDA'
}

export const ESTADO_PAGO_LABELS: Record<EstadoPago, string> = {
  SIN_PAGOS: 'Sin pagos',
  SENA_RECIBIDA: 'Seña recibida',
  FINALIZADA: 'Finalizada',
}

export const ESTADO_PAGO_COLORS: Record<EstadoPago, string> = {
  SIN_PAGOS: 'bg-gray-100 text-gray-700',
  SENA_RECIBIDA: 'bg-blue-100 text-blue-700',
  FINALIZADA: 'bg-emerald-100 text-emerald-700',
}

export const ESTADO_PEDIDO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PEDIDO: 'Pedido',
  RECIBIDO: 'Recibido',
  ENTREGADO: 'Entregado',
}

export const ESTADO_PEDIDO_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-gray-100 text-gray-600',
  PEDIDO: 'bg-blue-100 text-blue-600',
  RECIBIDO: 'bg-green-100 text-green-700',
  ENTREGADO: 'bg-emerald-100 text-emerald-700',
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

// Fechas/horas: la implementación real vive en '@/lib/datetime', que es el
// único punto de configuración de la timezone del sistema. Se re-exporta
// acá para no romper los imports existentes (`from '@/lib/utils'`).
export {
  APP_TIMEZONE,
  formatDate,
  formatDateTime,
  toDateInputValue,
  dateInputToInstant,
  todayInputValue,
} from './datetime'

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

// formatear números provenientes de la base de datos para mostrarlos en inputs. Para prevenir que pase 14140.21 (servidor) --> 1.414.021,00 (cliente)
export function formatMoneyFromNumber(valor: number) {
  return valor.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// convertir el valor del input para enviarlo al servidor.
export function parseMoneyInput(valor: string) {
  return valor.replace(/\./g, '').replace(',', '.')
}

export const ESTADOS_PAGO = ['SIN_PAGOS', 'SENA_RECIBIDA', 'FINALIZADA'] as const

export const ESTADOS_PEDIDO = ['PENDIENTE', 'PEDIDO', 'RECIBIDO', 'ENTREGADO'] as const

export const TIPOS_PAGO = ['SENA', 'SALDO', 'ENVIO'] as const
