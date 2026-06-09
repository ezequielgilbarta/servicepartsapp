'use client'

import { useState, useTransition } from 'react'
import { actualizarProveedorEstado, actualizarItemProveedor } from '@/actions/ventas/ventaDetalle'
import {
  PROVEEDOR_ESTADO_LABELS,
  PROVEEDOR_ESTADO_COLORS,
  PROVEEDOR_ESTADOS,
  formatDate,
  formatCurrency,
} from '@/lib/utils'

type Item = {
  id: string
  ventaId: string
  cantidad: number
  precioUnitario: number
  proveedorEstado: string
  codigoPedido: string | null
  fechaPedidoProveedor: Date | null
  fechaLlegadaProveedor: Date | null
  producto: {
    nombre: string
    marca: string
    modelo: string
    codigoInterno: string
  }
}

function toInputDate(date: Date | null | undefined): string {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

export default function ItemRow({ item }: { item: Item }) {
  const [editando, setEditando] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleEstado(estado: string) {
    startTransition(() => actualizarProveedorEstado(item.id, item.ventaId, estado))
  }

  return (
    <tr className="border-b border-gray-100 last:border-0">
      {/* Producto */}
      <td className="px-5 py-4">
        <p className="text-sm font-medium text-gray-900">{item.producto.nombre}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {item.producto.marca} · {item.producto.modelo} · <span className="font-mono">{item.producto.codigoInterno}</span>
        </p>
      </td>

      {/* Cantidad y precio */}
      <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
        {item.cantidad} × {formatCurrency(item.precioUnitario)}
      </td>

      {/* Estado proveedor */}
      <td className="px-5 py-4">
        <select
          value={item.proveedorEstado}
          onChange={(e) => handleEstado(e.target.value)}
          disabled={isPending}
          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 ${PROVEEDOR_ESTADO_COLORS[item.proveedorEstado]}`}
        >
          {PROVEEDOR_ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {PROVEEDOR_ESTADO_LABELS[estado]}
            </option>
          ))}
        </select>
      </td>

      {/* Código pedido y fechas */}
      <td className="px-5 py-4">
        {editando ? (
          <form
            action={(formData) => {
              formData.append('itemId', item.id)
              formData.append('ventaId', item.ventaId)
              startTransition(async () => {
                await actualizarItemProveedor(formData)
                setEditando(false)
              })
            }}
            className="space-y-2"
          >
            <input
              name="codigoPedido"
              defaultValue={item.codigoPedido ?? ''}
              placeholder="Código pedido (ej: PON260313453723)"
              className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 mb-0.5">Fecha pedido</label>
                <input
                  type="date"
                  name="fechaPedidoProveedor"
                  defaultValue={toInputDate(item.fechaPedidoProveedor)}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 mb-0.5">Fecha llegada</label>
                <input
                  type="date"
                  name="fechaLlegadaProveedor"
                  defaultValue={toInputDate(item.fechaLlegadaProveedor)}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="text-xs px-3 py-1 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-1">
            {item.codigoPedido && (
              <p className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block">
                {item.codigoPedido}
              </p>
            )}
            <div className="text-xs text-gray-500 space-y-0.5">
              {item.fechaPedidoProveedor && (
                <p>Pedido: {formatDate(item.fechaPedidoProveedor)}</p>
              )}
              {item.fechaLlegadaProveedor && (
                <p>Llegada: {formatDate(item.fechaLlegadaProveedor)}</p>
              )}
              {!item.codigoPedido && !item.fechaPedidoProveedor && !item.fechaLlegadaProveedor && (
                <p className="text-gray-300">—</p>
              )}
            </div>
            <button
              onClick={() => setEditando(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Editar
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
