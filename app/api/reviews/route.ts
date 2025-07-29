// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sid = url.searchParams.get("schoolId");
  if (!sid) {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }
  const schoolId = parseInt(sid, 10);
  if (isNaN(schoolId)) {
    return NextResponse.json({ error: "Invalid schoolId" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { schoolId },
    include: { user: true }, // if you want the reviewer’s name, etc.
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    schoolId: sid,
    name,
    role,
    biaya,
    komentar,
    kenyamanan: kStr,
    pembelajaran: pStr,
    fasilitas: fStr,
    kepemimpinan: kpStr,
  } = await req.json();

// parse and validate
  const schoolId = parseInt(sid, 10);
  const kenyamanan   = parseInt(kStr, 10);
  const pembelajaran = parseInt(pStr, 10);
  const fasilitas    = parseInt(fStr, 10);
  const kepemimpinan = parseInt(kpStr, 10);

  if (
    isNaN(schoolId) ||
    isNaN(kenyamanan) ||
    isNaN(pembelajaran) ||
    isNaN(fasilitas) ||
    isNaN(kepemimpinan)
  ) {
    return NextResponse.json({ error: "Invalid number in input" }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        school: { connect: { id: schoolId } },
        // instead of user.id, connect by unique email:
        user:   { connect: { email: session.user.email } },
        name,
        role,
        biaya,
        komentar,
        kenyamanan,
        pembelajaran,
        fasilitas,
        kepemimpinan,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}