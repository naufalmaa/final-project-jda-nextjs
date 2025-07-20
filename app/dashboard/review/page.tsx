// File: /app/dashboard/review/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { staticSchools } from '@/app/lib/staticSchools';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function ReviewDashboardPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modalId, setModalId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('reviews');
    const parsed = stored ? JSON.parse(stored) : [];
    setReviews(parsed);
  }, []);

  function handleDelete(id: number) {
    const updated = reviews.filter((r) => r.id !== id);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setReviews(updated);
    setModalId(null);
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const filtered = reviews.filter((r) => {
    const school = staticSchools.find((s) => s.id === parseInt(r.schoolId));
    return school?.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Cari sekolah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <Link
          href="/dashboard/review/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Ulasan
        </Link>
      </div>

      <table className="min-w-full bg-white rounded shadow overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Sekolah</th>
            <th className="text-left px-4 py-2">Reviewer</th>
            <th className="text-left px-4 py-2">Peran</th>
            <th className="text-left px-4 py-2">Biaya</th>
            <th className="text-left px-4 py-2">Kenyamanan</th>
            <th className="text-left px-4 py-2">Pembelajaran</th>
            <th className="text-left px-4 py-2">Fasilitas</th>
            <th className="text-left px-4 py-2">Kepemimpinan</th>
            <th className="text-left px-4 py-2">Komentar</th>
            <th className="text-left px-4 py-2">Tanggal</th>
            <th className="text-left px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((review) => {
            const school = staticSchools.find((s) => s.id === parseInt(review.schoolId));
            const formatRating = (label: string, value: number) => `${value}/5 ⭐`;
            return (
              <tr key={review.id} className="border-t align-top">
                <td className="px-4 py-2 font-medium">{school?.name || 'Sekolah tidak ditemukan'}</td>
                <td className="px-4 py-2">{review.name}</td>
                <td className="px-4 py-2">{review.role}</td>
                <td className="px-4 py-2">{review.biayaKategori}</td>
                <td className="px-4 py-2">{formatRating('Kenyamanan', review.ratings.kenyamanan)}</td>
                <td className="px-4 py-2">{formatRating('Pembelajaran', review.ratings.pembelajaran)}</td>
                <td className="px-4 py-2">{formatRating('Fasilitas', review.ratings.fasilitas)}</td>
                <td className="px-4 py-2">{formatRating('Kepemimpinan', review.ratings.kepemimpinan)}</td>
                <td className="px-4 py-2 line-clamp-2 max-w-xs">{review.komentar}</td>
                <td className="px-4 py-2 whitespace-nowrap">{formatDate(review.tanggal)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/review/${review.id}/edit`)}
                      className="inline-flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setModalId(review.id)}
                      className="inline-flex items-center justify-center p-1.5 bg-red-100 hover:bg-red-200 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  {modalId === review.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <p className="mb-4">Yakin ingin menghapus ulasan ini?</p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setModalId(null)}
                            className="px-4 py-2 border rounded"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}