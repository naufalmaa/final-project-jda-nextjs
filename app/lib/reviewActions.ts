// File: app/lib/reviewActions.ts
'use server';

import { prisma } from '@/app/lib/prisma';

export async function getAllReviews(schoolId?: string | number) {
  const parsedId = typeof schoolId === 'string' ? parseInt(schoolId) : schoolId;

  return await prisma.review.findMany({
    where: parsedId ? { schoolId: parsedId } : undefined,
    orderBy: { tanggal: 'desc' },
  });
}

export async function createReview(data: {
  schoolId: number;
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
}) {
  return await prisma.review.create({ data });
}

export async function updateReview(id: number, data: {
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
}) {
  return await prisma.review.update({
    where: { id },
    data,
  });
}

export async function deleteReview(id: number) {
  return await prisma.review.delete({ where: { id } });
}
