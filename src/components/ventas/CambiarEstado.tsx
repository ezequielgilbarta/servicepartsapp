'use client'

import { useState, useTransition } from 'react'
import { actualizarEstadoVenta } from '@/actions/ventas/ventaDetalle'
import { ESTADO_VENTA_LABELS, ESTADO_VENTA_COLORS, ESTADOS_VENTA } from '@/lib/utils'

type Props = {
  ventaId: string
  estadoActual: string
  todosRecibidos: boolean
}

export default function CambiarEstado({ ventaId, estadoActual, todosRecibidos }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleChange(estado: string) {
    setOpen(false)
    startTransition(() => actualizarEstadoVenta(ventaId, estado))
  }

  return (
    <div className="flex items-center gap-3">
      {/* Badge estado actual */}
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ESTADO_VENTA_COLORS[estadoActual]}`}>
        {ESTADO_VENTA_LABELS[estadoActual]}
      </span>

      {/* Sugerencia si todos los items están recibidos */}
      {todosRecibidos && estadoActual !== 'LISTO_ENTREGA' && estadoActual !== 'ENTREGADO' && (
        <button
          onClick={() => handleChange('LISTO_ENTREGA')}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <span>✓</span>
          Marcar listo para entregar
        </button>
      )}

      {/* Dropdown cambio manual */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          disabled={isPending}
          className="text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-2.5 py-1.5 hover:border-gray-400 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Cambiar estado ▾'}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[200px]">
              {ESTADOS_VENTA.map((estado) => (
                <button
                  key={estado}
                  onClick={() => handleChange(estado)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${
                    estado === estadoActual ? 'font-medium text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {ESTADO_VENTA_LABELS[estado]}
                  {estado === estadoActual && <span className="text-gray-400">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
