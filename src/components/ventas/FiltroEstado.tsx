'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ESTADO_VENTA_LABELS } from '@/lib/utils'

const ESTADOS = ['TODOS', 'PRESUPUESTO', 'SENA_RECIBIDA', 'EN_PROGRESO', 'LISTO_ENTREGA', 'ENTREGADO', 'CANCELADO'] as const

export default function FiltroEstado() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const estadoActual = searchParams.get('estado') || 'TODOS'

  function handleChange(estado: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (estado === 'TODOS') {
      params.delete('estado')
    } else {
      params.set('estado', estado)
    }
    router.push(`/ventas?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ESTADOS.map((estado) => (
        <button
          key={estado}
          onClick={() => handleChange(estado)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            estadoActual === estado
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
          }`}
        >
          {estado === 'TODOS' ? 'Todos' : ESTADO_VENTA_LABELS[estado as keyof typeof ESTADO_VENTA_LABELS]}
        </button>
      ))}
    </div>
  )
}
