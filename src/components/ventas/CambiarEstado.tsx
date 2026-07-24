'use client'

import { useTransition } from 'react'
import { actualizarCancelada } from '@/actions/ventas/ventaDetalle'
import { ESTADO_PAGO_LABELS, ESTADO_PAGO_COLORS, type EstadoPago } from '@/lib/utils'

type Props = { ventaId: string; estadoPago: EstadoPago; cancelada: boolean }

export default function CambiarEstado({ ventaId, estadoPago, cancelada }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleToggleCancelada() {
    startTransition(() => actualizarCancelada(ventaId, !cancelada))
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {cancelada ? (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
          Cancelada
        </span>
      ) : (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ESTADO_PAGO_COLORS[estadoPago]}`}>
          {ESTADO_PAGO_LABELS[estadoPago]}
        </span>
      )}

      <button
        onClick={handleToggleCancelada}
        disabled={isPending}
        className={`text-xs border rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50 ${
          cancelada
            ? 'text-gray-500 border-gray-300 hover:border-gray-400'
            : 'text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50'
        }`}
      >
        {isPending ? 'Guardando...' : cancelada ? 'Reactivar venta' : 'Cancelar venta'}
      </button>
    </div>
  )
}
