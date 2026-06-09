'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearCliente(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim()
  const telefono = (formData.get('telefono') as string).trim()
  const direccion = (formData.get('direccion') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre || !telefono) throw new Error('Faltan campos obligatorios')

  await prisma.cliente.create({ data: { nombre, telefono, direccion, notas } })
  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function actualizarCliente(formData: FormData) {
  const id = formData.get('id') as string
  const nombre = (formData.get('nombre') as string).trim()
  const telefono = (formData.get('telefono') as string).trim()
  const direccion = (formData.get('direccion') as string)?.trim() || null
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!id || !nombre || !telefono) throw new Error('Faltan campos obligatorios')

  await prisma.cliente.update({ where: { id }, data: { nombre, telefono, direccion, notas } })
  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  redirect('/clientes')
}

export async function eliminarCliente(id: string) {
  // No eliminar si tiene ventas asociadas
  const ventas = await prisma.venta.count({ where: { clienteId: id } })
  if (ventas > 0) throw new Error('No se puede eliminar un cliente con ventas asociadas')

  await prisma.cliente.delete({ where: { id } })
  revalidatePath('/clientes')
  redirect('/clientes')
}
