'use client'

import { useState, useTransition } from 'react'
import { registrarPago } from '@/actions/ventas/ventaDetalle'
import { TIPOS_PAGO, TIPO_PAGO_LABELS } from '@/lib/utils'
import { formatMoneyInput, formatMoneyFromNumber, parseMoneyInput } from '@/lib/utils'
import { todayInputValue } from '@/lib/datetime'
import { isNextNavigationError, getActionErrorMessage } from '@/lib/actionError'
import FormError from '@/components/ui/FormError'

type Props = { ventaId: string; saldoPendiente: number }

export default function RegistrarPago({ ventaId, saldoPendiente }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [monto, setMonto] = useState(
    saldoPendiente > 0
      ? formatMoneyFromNumber(saldoPendiente)
      : ''
  )

  function handleSubmit(formData: FormData) {
    setError(null)
    formData.append('ventaId', ventaId)
    startTransition(async () => {
      try {
        await registrarPago(formData)
        setOpen(false)
      } catch (err) {
        if (isNextNavigationError(err)) throw err
        setError(getActionErrorMessage(err))
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:border-gray-400 hover:bg-gray-50 transition-colors"
      >
        + Registrar pago
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />

      {/* Panel — posicionado en mobile como bottom sheet, en desktop inline */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:static sm:inset-auto bg-white sm:bg-gray-50 rounded-t-2xl sm:rounded-xl border-t sm:border border-gray-200 p-5 shadow-xl sm:shadow-none mt-3">
        <div className="flex items-center justify-between mb-4 sm:mb-3">
          <p className="text-sm font-semibold text-gray-900">Registrar pago</p>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form action={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Monto</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  onBlur={() => setMonto(formatMoneyInput(monto))}
                  placeholder="0,00"
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="hidden"
                  name="monto"
                  value={parseMoneyInput(monto)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                defaultValue={todayInputValue()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Tipo</label>
            <div className="flex gap-2">
              {TIPOS_PAGO.map((tipo) => (
                <label key={tipo} className="flex-1">
                  <input type="radio" name="tipo" value={tipo} defaultChecked={tipo === 'SALDO'} className="sr-only peer" />
                  <span className="block text-center text-xs font-medium py-2 rounded-lg border border-gray-300 cursor-pointer peer-checked:bg-gray-900 peer-checked:text-white peer-checked:border-gray-900 transition-colors">
                    {TIPO_PAGO_LABELS[tipo]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <FormError message={error} />

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
