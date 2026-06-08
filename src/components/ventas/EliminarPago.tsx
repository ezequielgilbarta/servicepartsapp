'use client'

import { useTransition } from 'react'
import { eliminarPago } from '@/actions/ventaDetalle'

type Props = {
  pagoId: string
  ventaId: string
}

export default function EliminarPago({ pagoId, ventaId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('¿Eliminar este pago?')) return
    startTransition(() => eliminarPago(pagoId, ventaId))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Eliminar pago"
    >
      {isPending ? '...' : '✕'}
    </button>
  )
}
