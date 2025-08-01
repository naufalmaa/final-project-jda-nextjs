// File: app/api/users/[id]/route.ts
// CORRECTED: New file for managing individual users

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

// PUT update a user (SUPERADMIN only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = params.id;
  try {
    const body = await req.json();
    const { name, email, role, assignedSchoolId, password } = body;

    let dataToUpdate: any = {
      name,
      email,
      role,
      assignedSchoolId: role === 'SCHOOL_ADMIN' && assignedSchoolId ? Number(assignedSchoolId) : null,
    };

    // If a new password is provided, hash it and include it in the update
    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }
    
    // Prevent a SUPERADMIN from changing their own role
    if (userId === session.user.id && role !== session.user.role) {
      return NextResponse.json({ error: "You cannot change your own role." }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint failed (email)
        return NextResponse.json({ error: "Email is already in use by another account." }, { status: 409 });
    }
    if (error.code === 'P2025') { // Record to update not found
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE a user (SUPERADMIN only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = params.id;

  // Prevent SUPERADMIN from deleting themselves
  if (userId === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 403 });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') { // Record to delete not found
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}