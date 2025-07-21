// File: /app/dashboard/school/[id]/manage/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageSchoolPage() {
  const { id } = useParams();
  const [school, setSchool] = useState<any>(null);
  const [form, setForm] = useState<any>({
    description: '',
    programs: '',
    achievements: '',
    website: '',
    contact: '',
  });

  useEffect(() => {
    const fetchSchool = async () => {
      const res = await fetch(`/api/schools/${id}`);
      const data = await res.json();
      setSchool(data);
      setForm({
        description: data.description || '',
        programs: data.programs || '',
        achievements: data.achievements || '',
        website: data.website || '',
        contact: data.contact || '',
      });
    };
    fetchSchool();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/schools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert('Konten sekolah berhasil diperbarui');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Kelola Konten Sekolah</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Deskripsi Sekolah</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Program Unggulan</label>
          <textarea
            value={form.programs}
            onChange={(e) => setForm({ ...form, programs: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows={2}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Prestasi Sekolah</label>
          <textarea
            value={form.achievements}
            onChange={(e) => setForm({ ...form, achievements: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows={2}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Website Resmi (Opsional)</label>
          <input
            type="text"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Kontak (WhatsApp / Email)</label>
          <input
            type="text"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
