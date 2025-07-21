// File: app/api/schools/[id]/route.ts

import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch a single school by its ID.
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    // The 'id' is already available directly from the params object.
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
    }

    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      return new NextResponse('School not found', { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    console.error('[GET /api/schools/:id] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Handles PUT requests to update a school's content.
 * This is now more secure as it only updates specific, editable fields.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // The 'id' is already available directly from the params object.
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
    }

    const body = await req.json();

    // Only extract the fields that are meant to be editable from this component.
    // This prevents unwanted changes to other school data.
    const { description, programs, achievements, website, contact } = body;

    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        description,
        programs,
        achievements,
        website,
        contact,
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error('[PUT /api/schools/:id] Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui sekolah.' }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to remove a school.
 */
export async function DELETE(_: Request, { params }: { params: { id:string } }) {
    try {
        // The 'id' is already available directly from the params object.
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
        }

        await prisma.school.delete({
            where: { id },
        });
        
        // Return a 204 No Content response for successful deletion.
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[DELETE /api/schools/:id] Error:', error);
        return NextResponse.json({ error: 'Gagal menghapus sekolah.' }, { status: 500 });
    }
}