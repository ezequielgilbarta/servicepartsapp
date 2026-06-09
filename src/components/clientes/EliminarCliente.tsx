'use client'

import { useTransition } from 'react'
import { eliminarCliente } from '@/actions/clientes/clientes'

type Props = {
  clienteId: string
  tieneVentas: boolean
}

export default function EliminarCliente({ clienteId, tieneVentas }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (tieneVentas) {
      alert('No se puede eliminar un cliente con ventas asociadas.')
      return
    }
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return
    startTransition(() => eliminarCliente(clienteId))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || tieneVentas}
      title={tieneVentas ? 'No se puede eliminar: tiene ventas asociadas' : 'Eliminar cliente'}
      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
