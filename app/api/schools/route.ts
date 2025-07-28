// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const schools = await prisma.school.findMany({
//     select: { id: true, name: true, lat: true, lng: true },
//   });
//   return NextResponse.json(schools);
// }

// app/api/schools/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const schools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
     status: true,
     npsn: true,
     bentuk: true,
     telp: true,
     alamat: true,
     kelurahan: true,
     kecamatan: true,
      lat: true,
      lng: true
    },
  });
  return NextResponse.json(schools);
}
