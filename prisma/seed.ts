import { PrismaClient, EstadoVenta, TipoEntrega, ProveedorEstado, TipoPago } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      nombre: 'Juan García',
      telefono: '1145678901',
      direccion: 'Av. Corrientes 1234, CABA',
      notas: 'Prefiere contacto por WhatsApp',
    },
  })

  const cliente2 = await prisma.cliente.create({
    data: {
      nombre: 'María López',
      telefono: '1167890123',
    },
  })

  // Productos
  const producto1 = await prisma.producto.create({
    data: {
      nombre: 'Bomba de Agua',
      descripcion: 'Bomba de agua para lavarropas carga frontal',
      marca: 'Samsung',
      tipoElectrodomestico: 'lavarropas',
      modelo: 'WW80J5555MW',
      codigoInterno: 'LAV-001',
      costoProveedor: 4500,
      precioReferencia: 7000,
      proveedorHabitual: 'Repuestos del Sur',
    },
  })

  const producto2 = await prisma.producto.create({
    data: {
      nombre: 'Termostato',
      descripcion: 'Termostato bimetálico para heladera',
      marca: 'Whirlpool',
      tipoElectrodomestico: 'heladera',
      modelo: 'WRB36SMHB',
      codigoInterno: 'HEL-002',
      costoProveedor: 2800,
      precioReferencia: 4500,
      proveedorHabitual: 'Electro Repuestos SRL',
    },
  })

  const producto3 = await prisma.producto.create({
    data: {
      nombre: 'Motor Ventilador',
      descripcion: 'Motor para ventilador de condensador',
      marca: 'LG',
      tipoElectrodomestico: 'heladera',
      modelo: 'GR-B247WLUI',
      codigoInterno: 'HEL-003',
      costoProveedor: 6200,
      precioReferencia: 9800,
    },
  })

  // Venta 1 - En progreso
  const venta1 = await prisma.venta.create({
    data: {
      clienteId: cliente1.id,
      estado: EstadoVenta.EN_PROGRESO,
      total: 16000,
      costoEnvio: 1500,
      tipoEntrega: TipoEntrega.ENVIO,
      fechaEntrega: new Date('2025-06-15'),
      notas: 'Entregar en horario de tarde',
      items: {
        create: [
          {
            productoId: producto1.id,
            cantidad: 1,
            precioUnitario: 7000,
            proveedorEstado: ProveedorEstado.EN_CAMINO,
            fechaPedidoProveedor: new Date('2025-05-20'),
          },
          {
            productoId: producto2.id,
            cantidad: 2,
            precioUnitario: 4500,
            proveedorEstado: ProveedorEstado.RECIBIDO,
            fechaPedidoProveedor: new Date('2025-05-18'),
            fechaLlegadaProveedor: new Date('2025-05-25'),
          },
        ],
      },
      pagos: {
        create: [
          {
            monto: 5000,
            tipo: TipoPago.SENA,
            fecha: new Date('2025-05-15'),
          },
        ],
      },
    },
  })

  // Venta 2 - Lista para entrega
  await prisma.venta.create({
    data: {
      clienteId: cliente2.id,
      estado: EstadoVenta.LISTO_ENTREGA,
      total: 9800,
      tipoEntrega: TipoEntrega.RETIRO,
      items: {
        create: [
          {
            productoId: producto3.id,
            cantidad: 1,
            precioUnitario: 9800,
            proveedorEstado: ProveedorEstado.RECIBIDO,
            fechaPedidoProveedor: new Date('2025-05-10'),
            fechaLlegadaProveedor: new Date('2025-05-22'),
          },
        ],
      },
      pagos: {
        create: [
          {
            monto: 3000,
            tipo: TipoPago.SENA,
            fecha: new Date('2025-05-08'),
          },
          {
            monto: 6800,
            tipo: TipoPago.SALDO,
            fecha: new Date('2025-05-23'),
          },
        ],
      },
    },
  })

  console.log('✅ Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
