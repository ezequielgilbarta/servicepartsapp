import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/layout/AppLayout'
import ClienteForm from '@/components/clientes/ClienteForm'
import { actualizarCliente } from '@/actions/clientes/clientes'

type Props = {
  params: { id: string }
}

export default async function EditarClientePage({ params }: Props) {
  requireAuth()

  const cliente = await prisma.cliente.findUnique({
    where: { id: params.id },
    include: { _count: { select: { ventas: true } } },
  })

  if (!cliente) notFound()

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <Link href="/clientes" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Clientes
        </Link>

        <div className="mt-4 mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{cliente.nombre}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {cliente._count.ventas} {cliente._count.ventas === 1 ? 'venta' : 'ventas'} asociadas
            </p>
          </div>
          {cliente._count.ventas > 0 && (
            <Link
              href={`/ventas?clienteId=${cliente.id}`}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-colors"
            >
              Ver ventas →
            </Link>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ClienteForm
            action={actualizarCliente}
            cliente={cliente}
            submitLabel="Guardar cambios"
          />
        </div>
      </div>
    </AppLayout>
  )
}
