// import { NextResponse } from 'next/server';
// import { school } from '@/app/lib/schoolData';

// export async function GET() {
//   return NextResponse.json(school);
// }

// export async function POST(req: Request) {
//   const newSchool = await req.json();
//   school.push({ id: Date.now(), ...newSchool });
//   return NextResponse.json({ message: 'Berhasil ditambahkan' });
// }

// File: app/api/schools/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data sekolah.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const school = await prisma.school.create({
      data: {
        name: body.name,
        status: body.status,
        npsn: body.npsn,
        bentuk: body.bentuk,
        telp: body.telp,
        alamat: body.alamat,
        kelurahan: body.kelurahan,
        kecamatan: body.kecamatan,
        lat: body.lat ? parseFloat(body.lat) : null,
        lng: body.lng ? parseFloat(body.lng) : null,
      },
    });
    return NextResponse.json(school);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambahkan sekolah.' }, { status: 500 });
  }
}
