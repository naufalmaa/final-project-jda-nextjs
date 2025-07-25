// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, 'schools.csv');


const prisma = new PrismaClient();

async function main() {
//   const filePath = path.resolve(__dirname, 'schools.csv'); // letakkan file schools.csv di folder prisma/
// const filePath = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'schools.csv');

  const schools: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        schools.push({
          name: data.name,
          status: data.status,
          npsn: data.npsn,
          bentuk: data.bentuk,
          telp: data.telp,
          alamat: data.alamat,
          kelurahan: data.kelurahan,
          kecamatan: data.kecamatan,
          lat: data.lat ? parseFloat(data.lat) : null,
          lng: data.lng ? parseFloat(data.lng) : null,
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Seeding ${schools.length} sekolah...`);
  for (const school of schools) {
    await prisma.school.create({ data: school });
  }
  console.log('✅ Selesai seeding.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
