import { NextResponse } from 'next/server';
import { school } from '@/app/lib/schoolData';

export async function GET() {
  return NextResponse.json(school);
}

export async function POST(req: Request) {
  const newSchool = await req.json();
  school.push({ id: Date.now(), ...newSchool });
  return NextResponse.json({ message: 'Berhasil ditambahkan' });
}
