// File: app/api/reviews/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ensure this path is correct

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (!session || !session.user || !session.user.id || !session.user.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // CORRECTED: Parse reviewId to integer
  const reviewId = parseInt(params.id, 10);
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
  }

  try {
    const reviewToDelete = await prisma.review.findUnique({
      where: { id: reviewId }, // Use the parsed integer ID
      select: { userId: true }, // Select userId to check ownership
    });

    if (!reviewToDelete) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user is the owner OR has ADMIN/SUPERADMIN role
    const isOwner = reviewToDelete.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden: You are not authorized to delete this review." }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId }, // Use the parsed integer ID
    });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest, // Changed Request to NextRequest for consistency
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) { // Consider using session.user.id and role for consistency
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // CORRECTED: Parse reviewId to integer directly from params.id
  const reviewId = parseInt(params.id, 10);
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 })
  }

  // parse and validate incoming fields
  const {
    name,
    role,
    biaya,
    komentar,
    kenyamanan: kStr,
    pembelajaran: pStr,
    fasilitas: fStr,
    kepemimpinan: kpStr,
  } = await req.json()

  const kenyamanan   = parseInt(kStr, 10)
  const pembelajaran = parseInt(pStr, 10)
  const fasilitas    = parseInt(fStr, 10)
  const kepemimpinan = parseInt(kpStr, 10)

  if (
    [kenyamanan, pembelajaran, fasilitas, kepemimpinan].some(isNaN)
  ) {
    return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
  }

  try {
    // Ensure the user can only edit their own review (or is admin/superadmin)
    const existing = await prisma.review.findUnique({
      where: { id: reviewId }, // Use the parsed integer ID
      select: { userId: true }, // Select userId to check ownership
    });

    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPERADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You are not authorized to update this review.' }, { status: 403 });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId }, // Use the parsed integer ID
      data: {
        name,
        role,
        biaya,
        komentar,
        kenyamanan,
        pembelajaran,
        fasilitas,
        kepemimpinan,
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}