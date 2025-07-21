// File: /app/ui/review/ReviewList.tsx

'use client';

import { staticSchools } from '@/app/lib/staticSchools';

export default function ReviewList({ data, onDelete }: { data: any[]; onDelete: (id: number) => void }) {
  return (
    <div className="space-y-4">
      {data.map((review) => {
        const school = staticSchools.find((s) => s.id === parseInt(review.schoolId));
        return (
          <div key={review.id} className="p-4 border rounded shadow-sm bg-white">
            <h2 className="font-bold text-lg">{school?.name || 'Sekolah Tidak Ditemukan'}</h2>
            <p className="text-sm text-gray-600">Oleh: {review.name} ({review.role})</p>
            <ul className="text-sm mt-2">
              {Object.entries(review.ratings).map(([k, v]) => (
                <li key={k}><strong>{k}:</strong> {v}/5</li>
              ))}
            </ul>
            {review.komentar && <p className="italic mt-2">"{review.komentar}"</p>}
            <button onClick={() => onDelete(review.id)} className="text-red-600 text-sm mt-2 hover:underline">Hapus</button>
          </div>
        );
      })}
    </div>
  );
}
