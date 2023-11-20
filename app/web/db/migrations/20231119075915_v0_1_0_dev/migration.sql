/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "Appointment" (
    "apptId" SERIAL NOT NULL,
    "proId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("apptId")
);

-- CreateTable
CREATE TABLE "Video" (
    "apptId" INTEGER NOT NULL,
    "awsRef" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_awsRef_key" ON "Video"("awsRef");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_proId_fkey" FOREIGN KEY ("proId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_apptId_fkey" FOREIGN KEY ("apptId") REFERENCES "Appointment"("apptId") ON DELETE RESTRICT ON UPDATE CASCADE;
