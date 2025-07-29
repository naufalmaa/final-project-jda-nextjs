import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const reviewId = parseInt(id, 10)
  if (isNaN(reviewId)) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 })
  }

  // parse and validate incoming fields
  const {
    name,
    role,
    biaya,
    komentar,
    kenyamanan: kStr,
    pembelajaran: pStr,
    fasilitas: fStr,
    kepemimpinan: kpStr,
  } = await req.json()

  const kenyamanan   = parseInt(kStr, 10)
  const pembelajaran = parseInt(pStr, 10)
  const fasilitas    = parseInt(fStr, 10)
  const kepemimpinan = parseInt(kpStr, 10)

  if (
    [kenyamanan, pembelajaran, fasilitas, kepemimpinan].some(isNaN)
  ) {
    return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
  }

  try {
    // Ensure the user can only edit their own review
    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { user: { select: { email: true } } },
    })
    if (!existing || existing.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        name,
        role,
        biaya,
        komentar,
        kenyamanan,
        pembelajaran,
        fasilitas,
        kepemimpinan,
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
