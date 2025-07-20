// File: /app/dashboard/school/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { staticSchools } from '@/app/lib/staticSchools';
import { useEffect, useState } from 'react';

export default function SchoolDetailPage() {
  const { id } = useParams();
  const school = staticSchools.find((s) => s.id === parseInt(id as string));
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('reviews');
    const parsed = stored ? JSON.parse(stored) : [];
    setReviews(parsed.filter((r: any) => parseInt(r.schoolId) === parseInt(id as string)));
  }, [id]);

  if (!school) return <div className="p-6">Sekolah tidak ditemukan.</div>;

  const avgRating = (reviews.length > 0)
    ? reviews.reduce((acc, r) => {
        const { kenyamanan, pembelajaran, fasilitas, kepemimpinan } = r.ratings;
        return acc + kenyamanan + pembelajaran + fasilitas + kepemimpinan;
      }, 0) / (reviews.length * 4)
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-gray-100 h-48 rounded flex items-center justify-center text-gray-400">
          [ Gambar Sekolah ]
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-blue-800 mb-2">{school.name}</h1>
          <p className="text-gray-700">{school.bentuk} • {school.status} • {school.kecamatan}</p>
          <p className="text-sm text-gray-600 mb-2">{school.alamat}</p>
          <p className="text-yellow-600 font-semibold">{avgRating.toFixed(1)}/5 ⭐</p>
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Bandingkan</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Daftar</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Tentang Sekolah</h2>
        <p className="text-sm text-gray-700">Deskripsi singkat dari pihak sekolah. (dummy content)</p>
        <h3 className="mt-4 font-semibold">Program Unggulan & Prestasi</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>Program Tahfidz</li>
          <li>Juara OSN Matematika tingkat kota</li>
          <li>Kelas inklusi untuk anak berkebutuhan khusus</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Ulasan Pengguna</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada ulasan untuk sekolah ini.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Nama</th>
                <th className="text-left px-3 py-2">Peran</th>
                <th className="text-left px-3 py-2">Komentar</th>
                <th className="text-left px-3 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.role}</td>
                  <td className="px-3 py-2">{r.komentar}</td>
                  <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
