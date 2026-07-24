'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { dateInputToInstant } from '@/lib/datetime'

// ── Cancelación de venta ─────────────────────────────────────────────────────

export async function actualizarCancelada(ventaId: string, cancelada: boolean) {
  await prisma.venta.update({
    where: { id: ventaId },
    data: { cancelada },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

// ── Items: estado de pedido + fechas + codigoPedido ──────────────────────────

export async function actualizarEstadoPedido(itemId: string, ventaId: string, estadoPedido: string) {
  await prisma.ventaItem.update({
    where: { id: itemId },
    data: { estadoPedido },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

export async function actualizarItemProveedor(formData: FormData) {
  const itemId = formData.get('itemId') as string
  const ventaId = formData.get('ventaId') as string
  const codigoPedido = (formData.get('codigoPedido') as string) || null
  const fechaPedidoProveedor = dateInputToInstant(formData.get('fechaPedidoProveedor') as string | null)
  const fechaLlegadaProveedor = dateInputToInstant(formData.get('fechaLlegadaProveedor') as string | null)
  const fechaEntregaCliente = dateInputToInstant(formData.get('fechaEntregaCliente') as string | null)

  await prisma.ventaItem.update({
    where: { id: itemId },
    data: { codigoPedido, fechaPedidoProveedor, fechaLlegadaProveedor, fechaEntregaCliente },
  })
  revalidatePath(`/ventas/${ventaId}`)
}

// ── Pagos ────────────────────────────────────────────────────────────────────

export async function registrarPago(formData: FormData) {
  const ventaId = formData.get('ventaId') as string
  const monto = parseFloat(formData.get('monto') as string)
  const tipo = formData.get('tipo') as string
  const fecha = dateInputToInstant(formData.get('fecha') as string | null) ?? new Date()

  if (!ventaId || !monto || !tipo) {
    throw new Error('Faltan campos obligatorios')
  }

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
