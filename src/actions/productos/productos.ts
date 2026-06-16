'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearProducto(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim()
  const descripcion = (formData.get('descripcion') as string)?.trim() || null
  const marca = (formData.get('marca') as string).trim()
  const tipoElectrodomestico = (formData.get('tipoElectrodomestico') as string).trim()
  const modelo = (formData.get('modelo') as string).trim()
  const codigoInterno = (formData.get('codigoInterno') as string).trim()
  const costoProveedor = parseFloat(formData.get('costoProveedor') as string)
  const precioReferencia = formData.get('precioReferencia')
    ? parseFloat(formData.get('precioReferencia') as string)
    : null
  const proveedorHabitual = (formData.get('proveedorHabitual') as string)?.trim() || null

  if (!nombre || !marca || !tipoElectrodomestico || !modelo || !codigoInterno || !costoProveedor) {
    throw new Error('Faltan campos obligatorios')
  }

  await prisma.producto.create({
    data: {
      nombre,
      descripcion,
      marca,
      tipoElectrodomestico,
      modelo,
      codigoInterno,
      costoProveedor,
      precioReferencia,
      proveedorHabitual,
    },
  })

  revalidatePath('/productos')
  redirect('/productos')
}

export async function actualizarProducto(formData: FormData) {
  const id = formData.get('id') as string
  const nombre = (formData.get('nombre') as string).trim()
  const descripcion = (formData.get('descripcion') as string)?.trim() || null
  const marca = (formData.get('marca') as string).trim()
  const tipoElectrodomestico = (formData.get('tipoElectrodomestico') as string).trim()
  const modelo = (formData.get('modelo') as string).trim()
  const codigoInterno = (formData.get('codigoInterno') as string).trim()
  const costoProveedor = parseFloat(formData.get('costoProveedor') as string)
  const precioReferencia = formData.get('precioReferencia')
    ? parseFloat(formData.get('precioReferencia') as string)
    : null
  const proveedorHabitual = (formData.get('proveedorHabitual') as string)?.trim() || null

  if (!id || !nombre || !marca || !tipoElectrodomestico || !modelo || !codigoInterno || !costoProveedor) {
    throw new Error('Faltan campos obligatorios')
  }

  await prisma.producto.update({
    where: { id },
    data: {
      nombre,
      descripcion,
      marca,
      tipoElectrodomestico,
      modelo,
      codigoInterno,
      costoProveedor,
      precioReferencia,
      proveedorHabitual,
    },
  })

  revalidatePath('/productos')
  revalidatePath(`/productos/${id}`)
  redirect('/productos')
}

export async function eliminarProducto(id: string) {
  const usos = await prisma.ventaItem.count({ where: { productoId: id } })
  if (usos > 0) throw new Error('No se puede eliminar un producto con ventas asociadas')

  await prisma.producto.delete({ where: { id } })
  revalidatePath('/productos')
  redirect('/productos')
}
