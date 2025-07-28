// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const schoolId = Number(searchParams.get('schoolId'));
  const reviews = await prisma.review.findMany({
    where: { schoolId },
    orderBy: { tanggal: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Make sure userId exists and is properly typed
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    const {
      schoolId, name, role, biaya, komentar,
      kenyamanan, pembelajaran, fasilitas, kepemimpinan
    } = await req.json();

    // Validate required fields
    if (!schoolId || !name || !role || !biaya || !komentar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert string ratings to numbers and use direct foreign keys
    const review = await prisma.review.create({
      data: {
        schoolId: parseInt(schoolId),
        userId: userId,
        name,
        role,
        biaya,
        komentar,
        kenyamanan: parseInt(kenyamanan),
        pembelajaran: parseInt(pembelajaran),
        fasilitas: parseInt(fasilitas),
        kepemimpinan: parseInt(kepemimpinan),
      },
    });
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' }, 
      { status: 500 }
    );
  }
}