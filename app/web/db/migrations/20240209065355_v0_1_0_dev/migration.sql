-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proUsrName" TEXT NOT NULL,
    "clientUsrName" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "apptId" INTEGER NOT NULL,
    "awsRef" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("awsRef")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_apptId_fkey" FOREIGN KEY ("apptId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
