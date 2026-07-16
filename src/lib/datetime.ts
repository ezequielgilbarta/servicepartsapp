// ─────────────────────────────────────────────────────────────────────────
// Único punto de configuración de la zona horaria del sistema.
// Todo el proyecto (backend, server actions, componentes) debe importar
// desde acá en lugar de hardcodear timezones o hacer conversiones manuales.
// ─────────────────────────────────────────────────────────────────────────
export const APP_TIMEZONE = 'America/Argentina/Buenos_Aires'

type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

/**
 * Offset (en minutos) entre UTC y `timeZone` para el instante `date`.
 * Se calcula dinámicamente vía Intl (no se hardcodea "-3"), para que
 * siga siendo correcto si algún día se cambia APP_TIMEZONE a una zona
 * con horario de verano.
 */
function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const map: Record<string, string> = {}
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value
  }

  // Lectura de la hora local en `timeZone`, interpretada como si fuera UTC.
  const localAsUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  )

  return (localAsUTC - date.getTime()) / 60000
}

/**
 * Muestra SOLO la fecha (dd/MM/yyyy), en APP_TIMEZONE.
 * Este es el formato por defecto para toda la UI.
 */
export function formatDate(date: DateInput | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: APP_TIMEZONE,
  }).format(toDate(date))
}

/**
 * Muestra fecha y hora completas (dd/MM/yyyy HH:mm:ss), en APP_TIMEZONE.
 * Usar SOLO en los casos puntuales donde se necesite explícitamente
 * mostrar la hora (no es el default de la UI).
 */
export function formatDateTime(date: DateInput | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: APP_TIMEZONE,
  }).format(toDate(date))
}

/**
 * Convierte un instante (Date/string/number) al string `yyyy-MM-dd` que
 * espera un <input type="date">, calculado en APP_TIMEZONE.
 *
 * Reemplaza a `date.toISOString().split('T')[0]`, que corta en UTC y
 * puede mostrar el día equivocado según la hora del día en Argentina.
 */
export function toDateInputValue(date: DateInput | null | undefined): string {
  if (!date) return ''
  const d = toDate(date)

  const map: Record<string, string> = {}
  for (const part of new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)) {
    if (part.type !== 'literal') map[part.type] = part.value
  }

  return `${map.year}-${map.month}-${map.day}`
}

/**
 * Convierte el string `yyyy-MM-dd` de un <input type="date"> al instante
 * UTC real correspondiente a las 00:00:00 de ese día en APP_TIMEZONE.
 *
 * Reemplaza a `new Date(dateOnlyString)`, que el spec de JS interpreta
 * como medianoche UTC (no medianoche en Argentina), provocando que el
 * día se corra según la timezone del proceso que después lo formatee.
 *
 * Devuelve `null` si `value` es vacío/inválido, para poder asignarlo
 * directamente a campos opcionales de Prisma.
 */
export function dateInputToInstant(value: string | null | undefined): Date | null {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  const guess = Date.UTC(year, month - 1, day, 0, 0, 0)
  const offsetMinutes = getTimeZoneOffsetMinutes(new Date(guess), APP_TIMEZONE)
  let instant = guess - offsetMinutes * 60000

  // Refinamiento: recalcula el offset ya con el instante corregido, por si
  // el día cayera justo en un cambio de horario de verano. No aplica a
  // Buenos Aires (que no tiene DST), pero deja el helper genérico y
  // correcto para cualquier IANA timezone que se configure a futuro.
  const refinedOffset = getTimeZoneOffsetMinutes(new Date(instant), APP_TIMEZONE)
  if (refinedOffset !== offsetMinutes) {
    instant = guess - refinedOffset * 60000
  }

  return new Date(instant)
}

/**
 * "Hoy" (00:00 local) en APP_TIMEZONE, como string `yyyy-MM-dd`.
 * Útil para min/max de <input type="date">.
 */
export function todayInputValue(): string {
  return toDateInputValue(new Date())
}
