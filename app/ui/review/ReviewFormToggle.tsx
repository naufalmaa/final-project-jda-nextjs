// File: /app/ui/review/ReviewFormToggle.tsx

'use client';
import { useEffect, useState } from 'react';
import { Review } from '@/app/lib/types'; // Make sure this type is defined
import { useDispatch } from 'react-redux';
import { addReview, deleteReview } from '@/app/store/reviewSlice';


// Define component props for clarity
interface ReviewFormToggleProps {
  schoolId: number;
  onSubmit: () => void;
  onCancel: () => void;
  editing?: Review | null;
}

const defaultForm = {
  name: '',
  role: '',
  biaya: '',
  komentar: '',
  kenyamanan: 0,
  pembelajaran: 0,
  fasilitas: 0,
  kepemimpinan: 0,
};

const biayaOptions = [
  { value: 'Sangat Murah', label: 'Sangat Murah (< Rp 5 juta)' },
  { value: 'Murah', label: 'Murah (Rp 5–15 juta)' },
  { value: 'Sedang', label: 'Sedang (Rp 15–40 juta)' },
  { value: 'Mahal', label: 'Mahal (Rp 40–90 juta)' },
  { value: 'Sangat Mahal', label: 'Sangat Mahal (> Rp 90 juta)' },
];

export default function ReviewFormToggle({
  schoolId,
  onSubmit,
  editing = null,
  onCancel,
}: ReviewFormToggleProps) {
  const [showForm, setShowForm] = useState(!!editing);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...defaultForm, schoolId });

  useEffect(() => {
    if (editing) {
      // If editing, populate the form with existing review data
      setForm({ ...editing });
      setShowForm(true);
    } else {
      // Otherwise, reset to the default form for the current school
      setForm({ ...defaultForm, schoolId });
    }
  }, [editing, schoolId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Use a generic key of the form state for type safety
  const handleRating = (key: keyof typeof defaultForm, val: number) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const reviewToSend = {
      schoolId: Number(schoolId), // PASTIKAN ANGKA
      name: form.name,
      role: form.role,
      biaya: form.biaya,
      komentar: form.komentar,
      kenyamanan: Number(form.kenyamanan),
      pembelajaran: Number(form.pembelajaran),
      fasilitas: Number(form.fasilitas),
      kepemimpinan: Number(form.kepemimpinan),
    };
  
    try {
      const method = editing ? 'PUT' : 'POST';
      const endpoint = editing ? `/api/reviews/${editing.id}` : '/api/reviews';
  
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewToSend),
      });
  
      const saved = await res.json();
  
      if (!res.ok) {
        console.error('❌ Gagal menyimpan ke DB:', saved);
        throw new Error(saved.message || 'Gagal menyimpan review');
      }
  
      // ✅ Simpan ke Redux hanya jika berhasil masuk DB
      if (editing) dispatch(deleteReview(editing.id));
      dispatch(addReview(saved)); // dari API
  
      setShowForm(false);
      onSubmit(); // refresh tabel jika perlu
    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('Gagal menyimpan review ke database');
    }
  };
  
  
  
  const handleOpen = () => setShowForm(true);

  const handleClose = () => {
    setShowForm(false);
    onCancel(); // Let the parent component know editing was cancelled
  };

  // Conditionally render the "Add Review" button
  if (!showForm) {
    return (
      <button className="mb-2 px-4 py-2 rounded bg-blue-600 text-white" onClick={handleOpen}>
        + Tambah Review
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-4 bg-gray-50 space-y-4">
      <h3 className="font-semibold text-lg">{editing ? 'Edit Review' : 'Tambah Review Baru'}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Anda" required className="input" />
        <select name="role" value={form.role} onChange={handleChange} required className="input">
          <option value="">Peran Anda sebagai...</option>
          <option>Alumni</option>
          <option>Orang Tua Murid</option>
          <option>Guru</option>
        </select>
        <select name="biaya" value={form.biaya} onChange={handleChange} required className="input md:col-span-2">
          <option value="">Kategori Biaya Sekolah...</option>
          {biayaOptions.map((opt) => ( <option key={opt.value} value={opt.value}>{opt.label}</option> ))}
        </select>
      </div>

      <textarea name="komentar" value={form.komentar} onChange={handleChange} className="input w-full" rows={3} placeholder="Bagikan pengalaman Anda di sini..." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {([ 'kenyamanan', 'pembelajaran', 'fasilitas', 'kepemimpinan' ] as const).map((k) => (
          <div key={k}>
            <span className="capitalize text-sm font-medium">{k}</span>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => handleRating(k, n)} className={`text-2xl ${form[k] >= n ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          {editing ? 'Simpan Perubahan' : 'Kirim Review'}
        </button>
        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800" onClick={handleClose}>
          Batal
        </button>
      </div>
    </form>
  );
}