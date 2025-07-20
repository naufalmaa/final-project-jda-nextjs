// File: app/ui/school/MapTableToggle.tsx

'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import TableSekolah from './TableSekolah';

// Lazy load Map component (only on client)
const MapSekolah = dynamic(() => import('./MapSekolah'), { ssr: false });

export default function MapTableToggle({ schools, role }: { schools: any[]; role: string }) {
  const [view, setView] = useState<'table' | 'map'>('table');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('table')}
          >
            📋 Tabel
          </button>
          <button
            className={`px-4 py-2 rounded ${view === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('map')}
          >
            🗺️ Peta
          </button>
        </div>

        {role === 'superadmin' && (
          <a href="/dashboard/school/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + Tambah Sekolah
          </a>
        )}
      </div>

      {view === 'table' ? (
        <TableSekolah schools={schools} role='superadmin' />
      ) : (
        <MapSekolah schools={schools} />
      )}
    </div>
  );
}
