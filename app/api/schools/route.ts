// File: app/api/schools/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming your prisma client is exported from here
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct import for authOptions
import { getServerSession } from "next-auth"; // Import getServerSession

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions); // Get the session

    // For GET schools, all users can read, so no specific role check is needed here
    // But having the session available is useful for debugging and future logic
    console.log("User session for GET schools:", session);

    const schools = await prisma.school.findMany();
    return NextResponse.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json({ message: "Error fetching schools" }, { status: 500 });
  }
}

// Add a placeholder for POST if it doesn't exist, we'll implement it next
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "SUPERADMIN") {
    return NextResponse.json({ message: "Forbidden: Only Superadmin can create schools." }, { status: 403 });
  }

  // // TODO: Implement school creation logic here (Superadmin only)
  return NextResponse.json({ message: "School creation not yet implemented for Superadmin." }, { status: 501 });
}