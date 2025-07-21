// File: app/api/reviews/[id]/route.ts
import { prisma } from '@/app/lib/prisma';
import { reviewSchema } from '@/app/lib/schemas/review'; // Assuming you have this schema file
import { NextResponse } from 'next/server';

// Use `.partial()` to make all fields optional for updates
const reviewUpdateSchema = reviewSchema.partial();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Don't allow changing the schoolId or tanggal on update
    const { schoolId, tanggal, ...updateData } = body;

    const validatedData = reviewUpdateSchema.parse(updateData);

    const updatedReview = await prisma.review.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    console.error(`[PUT /api/reviews/${params.id}] Error:`, error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', detail: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    await prisma.review.delete({ where: { id } });
    
    return new NextResponse(null, { status: 204 }); // Use 204 No Content for successful deletion
  } catch (error) {
    console.error(`[DELETE /api/reviews/${params.id}] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}