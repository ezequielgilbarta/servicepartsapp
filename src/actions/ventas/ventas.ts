'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { dateInputToInstant } from '@/lib/datetime'

type ItemVentaInput = {
  productoId: string
  cantidad: number
  precioUnitario: number
}

function parseItemsVenta(raw: FormDataEntryValue | null): ItemVentaInput[] {
  if (!raw || typeof raw !== 'string') return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Los productos enviados no son válidos')
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Los productos enviados no son válidos')
  }

  const items = parsed as ItemVentaInput[]
  const sonValidos = items.every(
    (i) =>
      i &&
      typeof i.productoId === 'string' &&
      i.productoId.length > 0 &&
      Number.isFinite(i.cantidad) &&
      i.cantidad > 0 &&
      Number.isFinite(i.precioUnitario) &&
      i.precioUnitario >= 0
  )
  if (!sonValidos) {
    throw new Error('Hay productos con datos inválidos')
  }

  return items
}

export async function crearVenta(formData: FormData) {
  const clienteId = formData.get('clienteId') as string
  const total = parseFloat(formData.get('total') as string)
  const costoEnvio = formData.get('costoEnvio') ? parseFloat(formData.get('costoEnvio') as string) : null
  const tipoEntrega = formData.get('tipoEntrega') as string
  const fechaEntrega = dateInputToInstant(formData.get('fechaEntrega') as string | null)
  const notas = formData.get('notas') as string || null
  const items = parseItemsVenta(formData.get('items'))

  if (!clienteId || !total || !tipoEntrega) {
    throw new Error('Faltan campos obligatorios')
  }

  if (items.length === 0) {
    throw new Error('Agregá al menos un producto a la venta')
  }

  const productosIds = [...new Set(items.map((i) => i.productoId))]
  const productosExistentes = await prisma.producto.count({ where: { id: { in: productosIds } } })
  if (productosExistentes !== productosIds.length) {
    throw new Error('Alguno de los productos seleccionados ya no existe')
  }

  const venta = await prisma.venta.create({
    data: {
      clienteId,
      total,
      costoEnvio,
      tipoEntrega,
      fechaEntrega,
      notas,
      estado: 'PRESUPUESTO',
      items: {
        create: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
      },
    },
  })

  revalidatePath('/ventas')
  redirect(`/ventas/${venta.id}`)
}
