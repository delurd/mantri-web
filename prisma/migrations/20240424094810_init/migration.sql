-- CreateTable
CREATE TABLE "doorStatus" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "doorStatus_pkey" PRIMARY KEY ("id")
);
