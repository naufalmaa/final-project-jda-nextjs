import { NextResponse } from 'next/server';

let reviews: any[] = [];

export async function GET() {
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newReview = { id: Date.now(), ...data };
  reviews.push(newReview);
  return NextResponse.json(newReview);
}

export async function PUT(req: Request) {
  const updated = await req.json();
  reviews = reviews.map((r) => (r.id === updated.id ? updated : r));
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  reviews = reviews.filter((r) => r.id !== id);
  return NextResponse.json({ message: 'Deleted' });
}
