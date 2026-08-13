/*
  Warnings:

  - You are about to drop the column `nombre` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "nombre",
ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "primerNombre" TEXT,
ADD COLUMN     "segundoNombre" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "webhookSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhookSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nombre",
ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "cedula" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "pais" TEXT NOT NULL DEFAULT 'EC',
ADD COLUMN     "primerNombre" TEXT,
ADD COLUMN     "segundoNombre" TEXT;
