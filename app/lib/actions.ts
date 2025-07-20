// File: lib/actions.ts

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
  
  