'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearVenta(formData: FormData) {
  const clienteId = formData.get('clienteId') as string
  const total = parseFloat(formData.get('total') as string)
  const costoEnvio = formData.get('costoEnvio') ? parseFloat(formData.get('costoEnvio') as string) : null
  const tipoEntrega = formData.get('tipoEntrega') as string
  const fechaEntrega = formData.get('fechaEntrega') ? new Date(formData.get('fechaEntrega') as string) : null
  const notas = formData.get('notas') as string || null

  if (!clienteId || !total || !tipoEntrega) {
    throw new Error('Faltan campos obligatorios')
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
    },
  })

  revalidatePath('/ventas')
  redirect(`/ventas/${venta.id}`)
}
