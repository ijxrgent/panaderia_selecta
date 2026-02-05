-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "archivado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fechaArchivado" TIMESTAMP(3);
