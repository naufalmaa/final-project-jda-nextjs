// File: /app/ui/review/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { staticSchools } from '@/app/lib/staticSchools';

const biayaOptions = [
  { value: 'Sangat Murah', label: 'Sangat Murah (< Rp 5 juta)' },
  { value: 'Murah', label: 'Murah (Rp 5–15 juta)' },
  { value: 'Sedang', label: 'Sedang (Rp 15–40 juta)' },
  { value: 'Mahal', label: 'Mahal (Rp 40–90 juta)' },
  { value: 'Sangat Mahal', label: 'Sangat Mahal (> Rp 90 juta)' },
];

const aspek = ['kenyamanan', 'pembelajaran', 'fasilitas', 'kepemimpinan'];

export default function ReviewForm({ onSubmit, defaultValue }: { onSubmit: (review: any) => void, defaultValue?: any }) {
  const [form, setForm] = useState(
    defaultValue || {
      schoolId: '',
      name: '',
      role: '',
      ratings: {
        kenyamanan: 0,
        pembelajaran: 0,
        fasilitas: 0,
        kepemimpinan: 0,
      },
      biayaKategori: '',
      komentar: '',
    }
  );

  function handleChange(e: any) {
    const { name, value } = e.target;
    if (aspek.includes(name)) {
      setForm({ ...form, ratings: { ...form.ratings, [name]: parseInt(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.schoolId || !form.name || !form.role) {
      alert('Lengkapi semua kolom');
      return;
    }
    const stored = localStorage.getItem('reviews');
    const parsed = stored ? JSON.parse(stored) : [];
    const updated = defaultValue
      ? parsed.map((r: any) => (r.id === defaultValue.id ? { ...form, id: defaultValue.id, tanggal: defaultValue.tanggal } : r))
      : [...parsed, { ...form, id: Date.now(), tanggal: new Date().toISOString() }];
    localStorage.setItem('reviews', JSON.stringify(updated));
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select name="schoolId" value={form.schoolId} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">-- Pilih Sekolah --</option>
        {staticSchools.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <input type="text" name="name" placeholder="Nama Anda" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />

      <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">-- Peran Anda --</option>
        <option>Alumni</option>
        <option>Orang Tua Murid</option>
        <option>Guru</option>
        <option>Aktivis Pendidikan</option>
      </select>

      {aspek.map((asp) => (
        <div key={asp}>
          <label className="capitalize font-medium">{asp}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm({ ...form, ratings: { ...form.ratings, [asp]: i } })}
              >
                {form.ratings[asp] >= i ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>
      ))}

      <select name="biayaKategori" value={form.biayaKategori} onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">-- Pilih Segmen Biaya --</option>
        {biayaOptions.map((b) => (
          <option key={b.value} value={b.value}>{b.label}</option>
        ))}
      </select>

      <textarea
        name="komentar"
        placeholder="Komentar tambahan..."
        rows={3}
        value={form.komentar}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {defaultValue ? 'Perbarui' : 'Kirim'} Ulasan
      </button>
    </form>
  );
}
