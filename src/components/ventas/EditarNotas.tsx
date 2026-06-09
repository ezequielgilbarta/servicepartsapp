'use client'

import { useState, useTransition } from 'react'
import { actualizarNotas } from '@/actions/ventas/ventaDetalle'

type Props = {
  ventaId: string
  notas: string | null
}

export default function EditarNotas({ ventaId, notas }: Props) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(notas ?? '')
  const [isPending, startTransition] = useTransition()

  function handleGuardar() {
    startTransition(async () => {
      await actualizarNotas(ventaId, valor)
      setEditando(false)
    })
  }

  if (!editando) {
    return (
      <div className="group">
        <p className="text-sm text-gray-600 whitespace-pre-wrap min-h-[1.5rem]">
          {notas || <span className="text-gray-300 italic">Sin notas</span>}
        </p>
        <button
          onClick={() => setEditando(true)}
          className="mt-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Editar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        rows={3}
        autoFocus
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        placeholder="Agregar notas..."
      />
      <div className="flex gap-2">
        <button
          onClick={handleGuardar}
          disabled={isPending}
          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={() => { setValor(notas ?? ''); setEditando(false) }}
          className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
