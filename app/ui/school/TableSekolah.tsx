// File: app/ui/school/TableSekolah.tsx

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

export default function TableSekolah({ schools, role }: { schools: any[]; role?: string }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus sekolah ini? Tindakan ini tidak dapat dibatalkan.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Sekolah berhasil dihapus');
        router.refresh();
      } else {
        throw new Error('Gagal menghapus sekolah');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus. Silakan coba lagi.');
    }
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nama Sekolah</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Kecamatan</th>
            <th className="px-4 py-2 text-left">Alamat</th>
            {role === 'superadmin' && <th className="px-4 py-2 text-left">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="border-t">
              <td className="px-4 py-2 font-medium text-blue-600 hover:underline">
                <Link href={`/dashboard/school/${school.id}`}>{school.name}</Link>
              </td>
              <td className="px-4 py-2">{school.status}</td>
              <td className="px-4 py-2">{school.kecamatan}</td>
              <td className="px-4 py-2">{school.alamat}</td>
              {role === 'superadmin' && (
                <td className="px-4 py-2 space-x-2">
                  <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/school/${school.id}/edit`)}
                    // className="text-yellow-600 hover:underline"
                    className="inline-flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 rounded"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />

                  </button>
                  <button
                    onClick={() => handleDelete(school.id)}
                    // className="text-red-600 hover:underline"
                    className="inline-flex items-center justify-center p-1.5 bg-red-100 hover:bg-red-200 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  </div>

                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
