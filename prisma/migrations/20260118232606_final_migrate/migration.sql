/*
  Warnings:

  - You are about to drop the column `direccion` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `esParaHoy` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `fechaEntregaPrevista` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `fechaSolicitud` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `procesadoPor` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Pedido` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "direccion",
DROP COLUMN "esParaHoy",
DROP COLUMN "fechaEntregaPrevista",
DROP COLUMN "fechaSolicitud",
DROP COLUMN "notas",
DROP COLUMN "procesadoPor",
DROP COLUMN "updatedAt",
ADD COLUMN     "direccionEntrega" TEXT,
ADD COLUMN     "emailCliente" TEXT,
ADD COLUMN     "nombreCliente" TEXT,
ADD COLUMN     "telefonoCliente" TEXT,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Pedido_usuarioId_idx" ON "Pedido"("usuarioId");
