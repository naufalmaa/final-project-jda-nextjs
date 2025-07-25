// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // data should contain schoolId, rating, comment
  const { schoolId, rating, comment } = data;
  if (!schoolId || !rating) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  // Create review in DB
  const newReview = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment: comment || "",
      authorId: session.user.id,
      schoolId: schoolId
    }
  });
  return NextResponse.json(newReview, { status: 201 });
}
