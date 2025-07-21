// File: app/api/reviews/route.ts

import { prisma } from '@/app/lib/prisma';
import { reviewSchema } from '@/app/lib/schemas/review';
import { NextResponse, NextRequest } from 'next/server';
import { getAllReviews } from '@/app/lib/reviewActions'; // <-- Import your function

// ✅ NEW: Handles GET requests to /api/reviews
export async function GET(req: NextRequest) {
  try {
    // Get the schoolId from the URL query parameters (e.g., ?schoolId=123)
    const schoolId = req.nextUrl.searchParams.get('schoolId');
    
    // Use the existing logic from reviewActions.ts to fetch reviews
    const reviews = await getAllReviews(schoolId);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET /api/reviews] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


// bestehend: Handles POST requests to create a review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const parsedData = {
      ...body,
      schoolId: parseInt(body.schoolId, 10),
      kenyamanan: parseInt(body.kenyamanan, 10),
      pembelajaran: parseInt(body.pembelajaran, 10),
      fasilitas: parseInt(body.fasilitas, 10),
      kepemimpinan: parseInt(body.kepemimpinan, 10),
      tanggal: new Date(),
    };

    const validatedData = reviewSchema.parse(parsedData);

    const review = await prisma.review.create({
      data: validatedData,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/reviews] Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', detail: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}