type Cliente = {
  id: string
  nombre: string
  telefono: string
  direccion: string | null
  notas: string | null
}

type Props = {
  action: (formData: FormData) => Promise<void>
  cliente?: Cliente
  submitLabel: string
}

export default function ClienteForm({ action, cliente, submitLabel }: Props) {
  return (
    <form action={action} className="space-y-4">
      {cliente && <input type="hidden" name="id" value={cliente.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            required
            defaultValue={cliente?.nombre}
            placeholder="Juan García"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            name="telefono"
            required
            defaultValue={cliente?.telefono}
            placeholder="1145678901"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          name="direccion"
          defaultValue={cliente?.direccion ?? ''}
          placeholder="Av. Corrientes 1234, CABA"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          defaultValue={cliente?.notas ?? ''}
          placeholder="Observaciones sobre el cliente..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <a
          href="/clientes"
          className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
