'use client'

import { useState } from 'react'
import { crearVenta } from '@/actions/ventas/ventas'
import { formatMoneyInput, parseMoneyInput } from '@/lib/utils'
import { todayInputValue } from '@/lib/datetime'
import { isNextNavigationError, getActionErrorMessage } from '@/lib/actionError'
import FormError from '@/components/ui/FormError'

type Cliente = { id: string; nombre: string; telefono: string }

export default function NuevaVentaModal({ clientes }: { clientes: Cliente[] }) {
  const [open, setOpen] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState('RETIRO')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState('')
  const [costoEnvio, setCostoEnvio] = useState('')
  const [error, setError] = useState<string | null>(null)

  const minFecha = todayInputValue()

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    try {
      await crearVenta(formData)
    } catch (err) {
      if (isNextNavigationError(err)) throw err
      setError(getActionErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setOpen(false)
    setTipoEntrega('RETIRO')
    setTotal('')
    setCostoEnvio('')
    setLoading(false)
    setError(null)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        <span className="hidden sm:inline">Nueva venta</span>
        <span className="sm:hidden">Nueva</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          {/* Modal — bottom sheet en mobile, centrado en desktop */}
          <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-xl rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">Nueva venta</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1">×</button>
            </div>

            <form action={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  name="clienteId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="">Seleccioná un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>
                  ))}
                </select>
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    onBlur={() => setTotal(formatMoneyInput(total))}
                    placeholder="0,00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input type="hidden" name="total" value={parseMoneyInput(total)} />
                </div>
              </div>

              {/* Tipo entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de entrega <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {(['RETIRO', 'ENVIO'] as const).map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setTipoEntrega(tipo)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        tipoEntrega === tipo
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tipo === 'RETIRO' ? 'Retiro' : 'Envío'}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="tipoEntrega" value={tipoEntrega} />
              </div>

              {/* Costo envío */}
              {tipoEntrega === 'ENVIO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo de envío</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={costoEnvio}
                      onChange={(e) => setCostoEnvio(e.target.value)}
                      onBlur={() => setCostoEnvio(formatMoneyInput(costoEnvio))}
                      placeholder="0,00"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <input type="hidden" name="costoEnvio" value={parseMoneyInput(costoEnvio)} />
                  </div>
                </div>
              )}

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrega estimada</label>
                <input
                  type="date"
                  name="fechaEntrega"
                  min={minFecha}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  name="notas"
                  rows={2}
                  placeholder="Observaciones..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <FormError message={error} />

              <div className="flex gap-3 pb-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creando...' : 'Crear venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
