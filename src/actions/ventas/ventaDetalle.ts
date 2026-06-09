'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ── Estado de venta ──────────────────────────────────────────────────────────

export async function actualizarEstadoVenta(ventaId: string, estado: string) {
  await prisma.venta.update({
    where: { id: ventaId },
    data: { estado },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

// ── Items: proveedor estado + fechas + codigoPedido ──────────────────────────

export async function actualizarProveedorEstado(itemId: string, ventaId: string, proveedorEstado: string) {
  await prisma.ventaItem.update({
    where: { id: itemId },
    data: { proveedorEstado },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

export async function actualizarItemProveedor(formData: FormData) {
  const itemId = formData.get('itemId') as string
  const ventaId = formData.get('ventaId') as string
  const codigoPedido = (formData.get('codigoPedido') as string) || null
  const fechaPedidoProveedor = formData.get('fechaPedidoProveedor')
    ? new Date(formData.get('fechaPedidoProveedor') as string)
    : null
  const fechaLlegadaProveedor = formData.get('fechaLlegadaProveedor')
    ? new Date(formData.get('fechaLlegadaProveedor') as string)
    : null

  await prisma.ventaItem.update({
    where: { id: itemId },
    data: { codigoPedido, fechaPedidoProveedor, fechaLlegadaProveedor },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

// ── Pagos ────────────────────────────────────────────────────────────────────

export async function registrarPago(formData: FormData) {
  const ventaId = formData.get('ventaId') as string
  const monto = parseFloat(formData.get('monto') as string)
  const tipo = formData.get('tipo') as string
  const fecha = formData.get('fecha')
    ? new Date(formData.get('fecha') as string)
    : new Date()

  if (!ventaId || !monto || !tipo) return

  await prisma.pago.create({
    data: { ventaId, monto, tipo, fecha },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

export async function eliminarPago(pagoId: string, ventaId: string) {
  await prisma.pago.delete({ where: { id: pagoId } })
  revalidatePath(`/ventas/${ventaId}`)
}

// ── Notas ────────────────────────────────────────────────────────────────────

export async function actualizarNotas(ventaId: string, notas: string) {
  await prisma.venta.update({
    where: { id: ventaId },
    data: { notas },
  })
  revalidatePath(`/ventas/${ventaId}`)
}
