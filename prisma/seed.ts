// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

console.log('=== SEED SCRIPT STARTED ===');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, 'schools.csv');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Super Admin first
  console.log('👤 Checking for super admin...');
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      role: Role.SUPERADMIN
    }
  });

  if (existingSuperAdmin) {
    console.log('✅ Super admin already exists:', existingSuperAdmin.email);
  } else {
    // Hash password for the super admin
    const hashedPassword = await bcrypt.hash('superadmin123', 12);

    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        name: 'Super Administrator',
        email: 'admin@sekolahku.com', // Ganti dengan email yang kamu inginkan
        password: hashedPassword,
        role: Role.SUPERADMIN,
        emailVerified: new Date(), // Set as verified
      }
    });

    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Password: superadmin123');
    console.log('⚠️  Please change the password after first login!');
  }

  // 2. Seed Schools from CSV
  console.log('📚 Starting schools seeding from CSV...');

  // Check if CSV file exists
  if (!fs.existsSync(filePath)) {
    console.log('⚠️  schools.csv not found, skipping schools seeding...');
    console.log('📍 Expected location:', filePath);
    console.log('🎉 Database seeding completed (superadmin only)!');
    return;
  }

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

  console.log(`📊 Found ${schools.length} schools in CSV file`);

  let created = 0;
  let skipped = 0;

  for (const school of schools) {
    try {
      // Check if school already exists by NPSN
      const existingSchool = await prisma.school.findFirst({
        where: { npsn: school.npsn }
      });

      if (existingSchool) {
        skipped++;
        continue;
      }

      await prisma.school.create({ data: school });
      created++;

      // Log progress every 100 schools
      if (created % 100 === 0) {
        console.log(`📈 Progress: ${created} schools created...`);
      }
    } catch (error) {
      console.error(`❌ Error creating school ${school.name}:`, error);
    }
  }

  console.log(`✅ Schools seeding completed!`);
  console.log(`📊 Created: ${created} schools`);
  console.log(`⏭️  Skipped: ${skipped} schools (already exist)`);
  console.log('🎉 Database seeding completed!');
} // This closing brace was missing!

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });