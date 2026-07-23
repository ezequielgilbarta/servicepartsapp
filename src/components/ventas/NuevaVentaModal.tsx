'use client'

import { useEffect, useMemo, useState } from 'react'
import { crearVenta } from '@/actions/ventas/ventas'
import { formatMoneyInput, formatMoneyFromNumber, parseMoneyInput, formatCurrency } from '@/lib/utils'
import { todayInputValue } from '@/lib/datetime'
import { isNextNavigationError, getActionErrorMessage } from '@/lib/actionError'
import FormError from '@/components/ui/FormError'

type Cliente = { id: string; nombre: string; telefono: string }
type Producto = {
  id: string
  nombre: string
  marca: string
  modelo: string
  codigoInterno: string
  precioReferencia: number | null
}

type ItemCarrito = {
  productoId: string
  nombre: string
  marca: string
  modelo: string
  codigoInterno: string
  cantidad: number
  precioUnitario: number
}

export default function NuevaVentaModal({ clientes, productos }: { clientes: Cliente[]; productos: Producto[] }) {
  const [open, setOpen] = useState(false)
  const [tipoEntrega, setTipoEntrega] = useState('RETIRO')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState('')
  const [costoEnvio, setCostoEnvio] = useState('')
  const [error, setError] = useState<string | null>(null)

  // ── Selector de productos ──
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [cantidadNueva, setCantidadNueva] = useState('1')
  const [precioNuevo, setPrecioNuevo] = useState('')
  const [itemError, setItemError] = useState<string | null>(null)

  const minFecha = todayInputValue()

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0),
    [items]
  )

  // El total se recalcula cada vez que cambia el carrito, pero sigue siendo editable a mano
  // (por si hace falta un ajuste o descuento puntual sobre el total sugerido).
  useEffect(() => {
    setTotal(formatMoneyFromNumber(subtotal))
  }, [subtotal])

  const resultadosBusqueda = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return []
    return productos
      .filter((p) =>
        `${p.nombre} ${p.marca} ${p.modelo} ${p.codigoInterno}`.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [busqueda, productos])

  function handleSeleccionarProducto(p: Producto) {
    setProductoSeleccionado(p)
    setBusqueda('')
    setMostrarResultados(false)
    setCantidadNueva('1')
    setPrecioNuevo(p.precioReferencia != null ? formatMoneyFromNumber(p.precioReferencia) : '')
    setItemError(null)
  }

  function handleCancelarSeleccion() {
    setProductoSeleccionado(null)
    setCantidadNueva('1')
    setPrecioNuevo('')
    setItemError(null)
  }

  function handleAgregarItem() {
    if (!productoSeleccionado) return

    const cantidadNum = parseInt(cantidadNueva, 10)
    const precioNum = parseFloat(parseMoneyInput(precioNuevo))

    if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) {
      setItemError('La cantidad tiene que ser mayor a 0')
      return
    }
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      setItemError('Ingresá un precio unitario válido')
      return
    }

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productoId === productoSeleccionado.id)
      if (idx >= 0) {
        const copia = [...prev]
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cantidadNum }
        return copia
      }
      return [
        ...prev,
        {
          productoId: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          marca: productoSeleccionado.marca,
          modelo: productoSeleccionado.modelo,
          codigoInterno: productoSeleccionado.codigoInterno,
          cantidad: cantidadNum,
          precioUnitario: precioNum,
        },
      ]
    })

    handleCancelarSeleccion()
  }

  function handleEditarItem(index: number, campo: 'cantidad' | 'precioUnitario', valor: number) {
    setItems((prev) => {
      const copia = [...prev]
      copia[index] = { ...copia[index], [campo]: valor }
      return copia
    })
  }

  function handleQuitarItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(formData: FormData) {
    setError(null)

    if (items.length === 0) {
      setError('Agregá al menos un producto a la venta')
      return
    }

    formData.set(
      'items',
      JSON.stringify(
        items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        }))
      )
    )

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
    setItems([])
    setBusqueda('')
    setMostrarResultados(false)
    setProductoSeleccionado(null)
    setCantidadNueva('1')
    setPrecioNuevo('')
    setItemError(null)
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

              {/* Productos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Productos <span className="text-red-500">*</span>
                </label>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                  {/* Buscador */}
                  <div className="relative">
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => {
                        setBusqueda(e.target.value)
                        setMostrarResultados(true)
                      }}
                      onFocus={() => setMostrarResultados(true)}
                      placeholder="Buscar por nombre, marca o código..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    />
                    {mostrarResultados && busqueda.trim() && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {resultadosBusqueda.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-gray-400">Sin resultados</p>
                        ) : (
                          resultadosBusqueda.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSeleccionarProducto(p)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                              <p className="font-medium text-gray-900">{p.nombre}</p>
                              <p className="text-xs text-gray-400">
                                {p.marca} · {p.modelo} · <span className="font-mono">{p.codigoInterno}</span>
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Producto seleccionado: cantidad + precio + agregar */}
                  {productoSeleccionado && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{productoSeleccionado.nombre}</p>
                          <p className="text-xs text-gray-400">
                            {productoSeleccionado.marca} · {productoSeleccionado.modelo} ·{' '}
                            <span className="font-mono">{productoSeleccionado.codigoInterno}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelarSeleccion}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-20">
                          <label className="block text-[10px] text-gray-400 mb-0.5">Cantidad</label>
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={cantidadNueva}
                            onChange={(e) => setCantidadNueva(e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-gray-400 mb-0.5">Precio unitario</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={precioNuevo}
                              onChange={(e) => setPrecioNuevo(e.target.value)}
                              onBlur={() => setPrecioNuevo(formatMoneyInput(precioNuevo))}
                              placeholder="0,00"
                              className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleAgregarItem}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormError message={itemError} />

                  {/* Carrito */}
                  {items.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">Todavía no agregaste productos</p>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div
                          key={item.productoId}
                          className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {item.marca} · <span className="font-mono">{item.codigoInterno}</span>
                            </p>
                          </div>
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={item.cantidad}
                            onChange={(e) => handleEditarItem(idx, 'cantidad', Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="w-14 px-1.5 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <span className="text-xs text-gray-400">×</span>
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              defaultValue={formatMoneyFromNumber(item.precioUnitario)}
                              onBlur={(e) => {
                                const num = parseFloat(parseMoneyInput(e.target.value))
                                handleEditarItem(idx, 'precioUnitario', Number.isFinite(num) && num >= 0 ? num : item.precioUnitario)
                              }}
                              className="w-full pl-5 pr-1.5 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-24 text-right shrink-0">
                            {formatCurrency(item.cantidad * item.precioUnitario)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuitarItem(idx)}
                            className="text-gray-400 hover:text-red-500 text-lg leading-none shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1 text-sm">
                        <span className="text-gray-500">Subtotal productos</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
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
                <p className="mt-1 text-xs text-gray-400">Se sugiere según los productos cargados; se puede ajustar a mano.</p>
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
