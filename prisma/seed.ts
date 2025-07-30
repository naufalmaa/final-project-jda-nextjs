// File: prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const superadminEmail = 'niklascatastropher@gmail.com'; // You can change this email
  const superadminPassword = '123superadmin'; // *** CHANGE THIS TO A STRONG PASSWORD ***

  const existingSuperadmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingSuperadmin) {
    const hashedPassword = await bcrypt.hash(superadminPassword, 10); // Hash the password
    await prisma.user.create({
      data: {
        email: superadminEmail,
        passwordHash: hashedPassword,
        role: 'SUPERADMIN', // Assign the SUPERADMIN role
        name: 'Super-Admin', // Optional: Add a name
      },
    });
    console.log(`Superadmin account created with email: ${superadminEmail}`);
  } else {
    console.log(`Superadmin account with email: ${superadminEmail} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });