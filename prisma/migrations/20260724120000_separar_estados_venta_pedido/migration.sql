-- ============================================================
-- Venta: "estado" deja de existir. El estado de pago ahora se
-- calcula (pagos vs. total), y lo único que se guarda es si la
-- venta está cancelada.
-- ============================================================

ALTER TABLE "Venta" ADD COLUMN "cancelada" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Venta" SET "cancelada" = true WHERE "estado" = 'CANCELADO';

ALTER TABLE "Venta" DROP COLUMN "estado";

-- ============================================================
-- VentaItem: "proveedorEstado" (4 valores, con EN_CAMINO) pasa a
-- ser "estadoPedido" (4 valores, con ENTREGADO en vez de
-- EN_CAMINO). Se recrea la tabla para poder cambiar el default
-- de la columna (algo que SQLite no permite con ALTER directo) y
-- de paso se agrega la fecha de entrega al cliente.
-- ============================================================

PRAGMA foreign_keys=OFF;

CREATE TABLE "new_VentaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ventaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "estadoPedido" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "codigoPedido" TEXT,
    "fechaPedidoProveedor" DATETIME,
    "fechaLlegadaProveedor" DATETIME,
    "fechaEntregaCliente" DATETIME,
    CONSTRAINT "VentaItem_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VentaItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_VentaItem" (
    "id", "ventaId", "productoId", "cantidad", "precioUnitario",
    "estadoPedido", "codigoPedido", "fechaPedidoProveedor", "fechaLlegadaProveedor", "fechaEntregaCliente"
)
SELECT
    "id", "ventaId", "productoId", "cantidad", "precioUnitario",
    CASE "proveedorEstado"
        WHEN 'NO_PEDIDO' THEN 'PENDIENTE'
        WHEN 'EN_CAMINO' THEN 'PEDIDO'
        ELSE "proveedorEstado"
    END,
    "codigoPedido", "fechaPedidoProveedor", "fechaLlegadaProveedor", NULL
FROM "VentaItem";

DROP TABLE "VentaItem";

ALTER TABLE "new_VentaItem" RENAME TO "VentaItem";

PRAGMA foreign_keys=ON;
