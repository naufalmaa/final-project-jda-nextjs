// File: app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UpdateReviewSchema, IdParamSchema } from "@/lib/schemas"; // Import schemas

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id || !session.user.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate 'id' parameter
  const paramValidation = IdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    return NextResponse.json(
      { message: "Invalid Review ID format.", issues: paramValidation.error.issues },
      { status: 400 }
    );
  }
  const reviewId = paramValidation.data.id;

  try {
    const reviewToDelete = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!reviewToDelete) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    const isOwner = reviewToDelete.userId === session.user.id;
    const isAdmin = session.user.role === "SCHOOL_ADMIN" || session.user.role === "SUPERADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden: You are not authorized to delete this review." }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    if (error.code === 'P2025') { // Handle Prisma 'record not found' error
        return NextResponse.json({ message: "Review not found for deletion." }, { status: 404 });
    }
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) { // Use session.user.id for consistency with other checks
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // Validate 'id' parameter
  const paramValidation = IdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    return NextResponse.json(
      { message: "Invalid Review ID format.", issues: paramValidation.error.issues },
      { status: 400 }
    );
  }
  const reviewId = paramValidation.data.id;

  const body = await req.json();

  // Validate request body using Zod schema
  const validationResult = UpdateReviewSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { message: "Invalid request body for review update.", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;

  try {
    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "SCHOOL_ADMIN" || session.user.role === "SUPERADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: 'Forbidden: You are not authorized to update this review.' }, { status: 403 });
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: validatedData, // Use validated data
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    console.error(err)
    if (err.code === 'P2025') { // Handle Prisma 'record not found' error
        return NextResponse.json({ message: "Review not found for update." }, { status: 404 });
    }
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}