// File: app/dashboard/school/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSchoolPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    status: '',
    npsn: '',
    bentuk: '',
    telp: '',
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    lat: '',
    lng: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/schools', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Berhasil menambahkan sekolah');
      router.push('/dashboard/school');
    } else {
      alert('Gagal menambahkan sekolah');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah Sekolah Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block mb-1 font-medium capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
