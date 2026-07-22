/**
 * Utilidades para manejar errores de Server Actions invocadas desde
 * componentes cliente (formularios, botones, etc.).
 *
 * Next.js implementa redirect()/notFound() lanzando una excepción especial
 * (identificable por su `digest`). Si algún día una acción combina un
 * redirect con un throw en el mismo call site, hay que dejar pasar esa
 * excepción de navegación sin tratarla como error de validación.
 */
export function isNextNavigationError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('digest' in error)) return false
  const digest = (error as { digest?: unknown }).digest
  return typeof digest === 'string' && (digest === 'NEXT_NOT_FOUND' || digest.startsWith('NEXT_REDIRECT'))
}

/** Extrae un mensaje legible para mostrarle al usuario a partir de un error capturado. */
export function getActionErrorMessage(error: unknown, fallback = 'Ocurrió un error. Intentá de nuevo.'): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
