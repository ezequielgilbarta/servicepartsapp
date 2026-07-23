'use client'

import { useState, useTransition } from 'react'
import { formatMoneyInput, formatMoneyFromNumber, parseMoneyInput } from '@/lib/utils'
import { isNextNavigationError, getActionErrorMessage } from '@/lib/actionError'
import FormError from '@/components/ui/FormError'

const TIPOS_ELECTRODOMESTICO = [
  'Lavarropas', 'Heladera', 'Freezer', 'Lavavajillas', 'Secarropas', 'Lavasecarropas',
  'Microondas', 'Horno', 'Cocina', 'Aire acondicionado', 'Termotanque', 'Otro',
]

type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  marca: string
  tipoElectrodomestico: string
  modelo: string
  codigoInterno: string
  costoProveedor: number
  precioReferencia: number | null
  proveedorHabitual: string | null
}

type Props = {
  action: (formData: FormData) => Promise<void>
  producto?: Producto
  submitLabel: string
}

export default function ProductoForm({ action, producto, submitLabel }: Props) {
  const [costoProveedor, setCostoProveedor] = useState(
    producto?.costoProveedor
      ? formatMoneyFromNumber(producto.costoProveedor)
      : ''
  )

  const [precioReferencia, setPrecioReferencia] = useState(
    producto?.precioReferencia
      ? formatMoneyFromNumber(producto.precioReferencia)
      : ''
  )

  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await action(formData)
      } catch (err) {
        if (isNextNavigationError(err)) throw err
        setError(getActionErrorMessage(err))
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {producto && <input type="hidden" name="id" value={producto.id} />}

      {/* Identificación */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Identificación</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              name="nombre"
              required
              defaultValue={producto?.nombre}
              placeholder="Bomba de agua"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                name="marca"
                required
                defaultValue={producto?.marca}
                placeholder="Samsung"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                name="modelo"
                required
                defaultValue={producto?.modelo}
                placeholder="WW80J5555MW"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de electrodoméstico <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoElectrodomestico"
                required
                defaultValue={producto?.tipoElectrodomestico ?? ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="" disabled>Seleccioná un tipo</option>
                {TIPOS_ELECTRODOMESTICO.map((t) => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código interno <span className="text-red-500">*</span>
              </label>
              <input
                name="codigoInterno"
                required
                defaultValue={producto?.codigoInterno}
                placeholder="LAV-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={producto?.descripcion ?? ''}
              placeholder="Descripción del repuesto..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Precios y proveedor</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo proveedor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={costoProveedor}
                  onChange={(e) => setCostoProveedor(e.target.value)}
                  onBlur={() => setCostoProveedor(formatMoneyInput(costoProveedor))}
                  placeholder="0,00"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="hidden"
                  name="costoProveedor"
                  value={parseMoneyInput(costoProveedor)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Costo de referencia</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio de referencia</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={precioReferencia}
                  onChange={(e) => setPrecioReferencia(e.target.value)}
                  onBlur={() => setPrecioReferencia(formatMoneyInput(precioReferencia))}
                  placeholder="0,00"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="hidden"
                  name="precioReferencia"
                  value={parseMoneyInput(precioReferencia)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor habitual</label>
            <input
              name="proveedorHabitual"
              defaultValue={producto?.proveedorHabitual ?? ''}
              placeholder="Repuestos del Sur"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </div>

      <FormError message={error} />

      <div className="flex gap-3 pt-2">
        <a
          href="/productos"
          className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
