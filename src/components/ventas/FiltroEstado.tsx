'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ESTADO_PAGO_LABELS } from '@/lib/utils'

const FILTROS = ['TODOS', 'SIN_PAGOS', 'SENA_RECIBIDA', 'FINALIZADA', 'CANCELADAS'] as const

export default function FiltroEstado() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filtroActual = searchParams.get('estado') || 'TODOS'

  function handleChange(filtro: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (filtro === 'TODOS') {
      params.delete('estado')
    } else {
      params.set('estado', filtro)
    }
    router.push(`/ventas?${params.toString()}`)
  }

  function label(filtro: string) {
    if (filtro === 'TODOS') return 'Todos'
    if (filtro === 'CANCELADAS') return 'Canceladas'
    return ESTADO_PAGO_LABELS[filtro as keyof typeof ESTADO_PAGO_LABELS]
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTROS.map((filtro) => (
        <button
          key={filtro}
          onClick={() => handleChange(filtro)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filtroActual === filtro
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
          }`}
        >
          {label(filtro)}
        </button>
      ))}
    </div>
  )
}
