-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "bentuk" TEXT NOT NULL,
    "telp" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "biaya" TEXT NOT NULL,
    "komentar" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kenyamanan" INTEGER NOT NULL,
    "pembelajaran" INTEGER NOT NULL,
    "fasilitas" INTEGER NOT NULL,
    "kepemimpinan" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
