'use client';

import { useState } from 'react';
import { staticSchools } from '@/app/lib/staticSchools';

type ReviewProps = {
  onSubmit: (review: any) => void;
};

export default function ReviewForm({ onSubmit }: ReviewProps) {
  const [form, setForm] = useState({
    schoolId: '',
    name: '',
    role: '',
    ratings: {
      kenyamanan: 3,
      pembelajaran: 3,
      biaya: 3,
      fasilitas: 3,
      kepemimpinan: 3,
    },
    komentar: '',
  });

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name in form.ratings) {
      setForm({ ...form, ratings: { ...form.ratings, [name]: parseInt(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.schoolId || !form.name || !form.role) {
      alert('Semua kolom wajib diisi');
      return;
    }
    onSubmit({ ...form, id: Date.now(), tanggal: new Date().toISOString() });
    setForm({
      schoolId: '',
      name: '',
      role: '',
      ratings: {
        kenyamanan: 3,
        pembelajaran: 3,
        biaya: 3,
        fasilitas: 3,
        kepemimpinan: 3,
      },
      komentar: '',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <select name="schoolId" value={form.schoolId} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Pilih Sekolah</option>
        {staticSchools.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <input name="name" type="text" placeholder="Nama Anda" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Sebagai</option>
        <option value="Alumni">Alumni</option>
        <option value="Orang Tua Murid">Orang Tua Murid</option>
        <option value="Guru">Guru</option>
        <option value="Aktivis Pendidikan">Aktivis Pendidikan</option>
      </select>

      {Object.entries(form.ratings).map(([key, val]) => (
        <div key={key}>
          <label className="block text-sm font-medium capitalize">{key}</label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            name={key}
            value={val}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      ))}

      <textarea
        name="komentar"
        placeholder="Tulis komentar tambahan (opsional)"
        value={form.komentar}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Kirim Ulasan</button>
    </form>
  );
}
