// File: app/api/schools/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { CreateSchoolSchema } from "@/lib/schemas"; // Import CreateSchoolSchema

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("User session for GET schools:", session);
    const schools = await prisma.school.findMany();
    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json({ message: "Error fetching schools" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ message: "Forbidden: Only Superadmin can create schools." }, { status: 403 });
  }

  const body = await req.json();

  // Validate the request body with Zod
  const validationResult = CreateSchoolSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { message: "Invalid request body for school creation.", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const validatedData = validationResult.data;

  try {
    const newSchool = await prisma.school.create({
      data: validatedData, // Use the validated data
    });
    return NextResponse.json(newSchool, { status: 201 });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json({ message: "Failed to create school" }, { status: 500 });
  }
}