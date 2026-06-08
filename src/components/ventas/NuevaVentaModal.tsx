'use client'

import { useState } from 'react'
import { crearVenta } from '@/actions/ventas'
import { formatMoneyInput, parseMoneyInput } from '@/lib/utils'

type Cliente = {
  id: string
  nombre: string
  telefono: string
}

export default function NuevaVentaModal({ clientes }: { clientes: Cliente[] }) {
  const [open, setOpen] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState('RETIRO')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState('')
  const [costoEnvio, setCostoEnvio] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await crearVenta(formData)
  }

  const manana = new Date()
  manana.setDate(manana.getDate() + 1)

  const minFecha = manana.toISOString().split('T')[0]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Nueva venta
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Nueva venta</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  name="clienteId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Seleccioná un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} — {c.telefono}
                    </option>
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

                  <input
                    type="hidden"
                    name="total"
                    value={parseMoneyInput(total)}
                  />
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
                      {tipo === 'RETIRO' ? 'Retiro en local' : 'Envío a domicilio'}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="tipoEntrega" value={tipoEntrega} />
              </div>

              {/* Costo envío (solo si es envío) */}
              {tipoEntrega === 'ENVIO' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo de envío
                  </label>
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

                    <input
                      type="hidden"
                      name="costoEnvio"
                      value={parseMoneyInput(costoEnvio)}
                    />
                  </div>
                </div>
              )}

              {/* Fecha entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de entrega estimada
                </label>
                <input
                  type="date"
                  name="fechaEntrega"
                  min={minFecha}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  name="notas"
                  rows={2}
                  placeholder="Observaciones..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
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
