// File: /app/dashboard/school/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchSchools } from '@/app/lib/actions';
import MapTableToggle from '@/app/ui/school/MapTableToggle';

export default function SchoolListPage() {
  const [schools, setSchools] = useState<any[]>([]);

  useEffect(() => {
    async function loadSchools() {
      const data = await fetchSchools();
      setSchools(data);
    }
    loadSchools();
  }, []);

  const userRole = 'superadmin'; // sementara hardcoded

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Sekolah di Bandung</h1>
      <MapTableToggle schools={schools} role={userRole} />
    </div>
  );
}
