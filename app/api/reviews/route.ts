// File: app/api/reviews/route.ts (ensure you have these console.logs)

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

  try {
    const reviews = await prisma.review.findMany({
      where: { schoolId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // DEBUGGING: Log the session object received by the API route
  // console.log("API POST /api/reviews: Session received:", session);
  // console.log("API POST /api/reviews: Session User ID:", session?.user?.id); // THIS IS THE KEY LOG

  // Authorization check: Only users with the "USER" role can create reviews
  if (!session || !session.user || session.user.role !== "USER") {
    return NextResponse.json({ message: "Forbidden: Only authenticated users with 'USER' role can create reviews." }, { status: 403 });
  }

  const {
    schoolId: sid,
    name,
    role: userRoleInReview,
    biaya,
    komentar,
    kenyamanan: kStr,
    pembelajaran: pStr,
    fasilitas: fStr,
    kepemimpinan: kpStr,
  } = await req.json();

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
    return NextResponse.json({ error: "Invalid number in input for review fields." }, { status: 400 });
  }

  if (!komentar || !biaya) {
    return NextResponse.json({ error: "Missing required text fields (komentar, biaya)." }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        school: { connect: { id: schoolId } },
        user:   { connect: { id: session.user.id } }, // This line relies on session.user.id
        name: name || session.user.name,
        role: userRoleInReview,
        biaya,
        komentar,
        kenyamanan,
        pembelajaran,
        fasilitas,
        kepemimpinan,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    console.error("Error creating review:", err);
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}