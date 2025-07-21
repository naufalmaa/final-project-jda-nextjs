// File: lib/actions.ts

import { prisma } from './prisma';

export async function getSchoolById(id: number) {
  try {
    const school = await prisma.school.findUnique({
      where: { id },
    });

    return school;
  } catch (error) {
    console.error('[getSchoolById] Error:', error);
    return null;
  }
}


export async function fetchSchools() {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const res = await fetch(`${base}/api/schools`, {
        cache: 'no-store',
      });
  
      if (!res.ok) throw new Error('Gagal memuat data sekolah.');
      return await res.json();
    } catch (err) {
      console.error('[fetchSchools] error:', err);
      return [];
    }
  }
  
  