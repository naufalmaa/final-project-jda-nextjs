// app/api/schools/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params before using its properties
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  
  const school = await prisma.school.findUnique({
    where: { id },
    select: {
      // bring in full text fields if you like:
      description: true,
      programs: true,
      achievements: true,
      website: true,
      contact: true,
    },
  });
  
  if (!school) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(school);
}

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
