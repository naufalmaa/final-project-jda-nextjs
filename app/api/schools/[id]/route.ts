// app/api/schools/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. await the params promise
  const { id } = await params
  const sid = Number(id)
  if (isNaN(sid)) {
    return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 })
  }

  // 2. fetch the record
  const school = await prisma.school.findUnique({
    where: { id: sid },
    // no `include` of scalar fields—Prisma returns those by default
  })

  // 3. not found?
  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 })
  }

  return NextResponse.json(school)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const sid = Number(id)
  if (isNaN(sid)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const updates = await request.json()
  const school = await prisma.school.update({
    where: { id: sid },
    data: updates,
  })
  return NextResponse.json(school)
}


// // app/api/schools/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   // Await the params before using its properties
//   const { id: idParam } = await params;
//   const id = parseInt(idParam, 10);
  
//   const school = await prisma.school.findUnique({
//     where: { id },
//     select: {
//       // bring in full text fields if you like:
//       description: true,
//       programs: true,
//       achievements: true,
//       website: true,
//       contact: true,
//     },
//   });
  
//   if (!school) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 });
//   }
  
//   return NextResponse.json(school);
// }

// // app/api/schools/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = parseInt(params.id, 10);
//   const school = await prisma.school.findUnique({
//     where: { id },
//     select: {
//       // bring in full text fields if you like:
//       description: true,
//       programs: true,
//       achievements: true,
//       website: true,
//       contact: true,
//     },
//   });
//   if (!school) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 });
//   }
//   return NextResponse.json(school);
// }
