// File: app/api/schools/[id]/route.ts

import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const school = await prisma.school.update({
      where: { id: parseInt(params.id) },
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
    console.error('[PUT /api/schools/:id] Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui sekolah.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.school.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/schools/:id] Error:', error);
    return NextResponse.json({ error: 'Gagal menghapus sekolah.' }, { status: 500 });
  }
}
