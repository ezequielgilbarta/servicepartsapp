-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "marca" TEXT NOT NULL,
    "tipoElectrodomestico" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "codigoInterno" TEXT NOT NULL,
    "costoProveedor" REAL NOT NULL,
    "precioReferencia" REAL,
    "proveedorHabitual" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PRESUPUESTO',
    "total" REAL NOT NULL,
    "costoEnvio" REAL,
    "tipoEntrega" TEXT NOT NULL,
    "fechaEntrega" DATETIME,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Venta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VentaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ventaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "proveedorEstado" TEXT NOT NULL DEFAULT 'NO_PEDIDO',
    "codigoPedido" TEXT,
    "fechaPedidoProveedor" DATETIME,
    "fechaLlegadaProveedor" DATETIME,
    CONSTRAINT "VentaItem_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VentaItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ventaId" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pago_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoInterno_key" ON "Producto"("codigoInterno");
