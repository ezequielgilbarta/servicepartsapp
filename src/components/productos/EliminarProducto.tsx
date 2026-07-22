'use client'

import { useTransition } from 'react'
import { eliminarProducto } from '@/actions/productos/productos'
import { isNextNavigationError, getActionErrorMessage } from '@/lib/actionError'

type Props = {
  productoId: string
  tieneVentas: boolean
}

export default function EliminarProducto({ productoId, tieneVentas }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (tieneVentas) {
      alert('No se puede eliminar un producto con ventas asociadas.')
      return
    }
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    startTransition(async () => {
      try {
        await eliminarProducto(productoId)
      } catch (err) {
        if (isNextNavigationError(err)) throw err
        alert(getActionErrorMessage(err))
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || tieneVentas}
      title={tieneVentas ? 'No se puede eliminar: tiene ventas asociadas' : 'Eliminar producto'}
      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
