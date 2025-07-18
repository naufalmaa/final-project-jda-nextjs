'use client';

import { useEffect, useState } from 'react';

type Props = {
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  selected?: any;
  clearSelected: () => void;
};

export default function SchoolForm({ onAdd, onUpdate, selected, clearSelected }: Props) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    type: '',
    accreditation: '',
  });

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name,
        address: selected.address,
        type: selected.type,
        accreditation: selected.accreditation,
      });
    }
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected) {
      onUpdate({ ...selected, ...form });
    } else {
      onAdd(form);
    }
    setForm({ name: '', address: '', type: '', accreditation: '' });
    clearSelected();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <input
        type="text"
        name="name"
        placeholder="Nama Sekolah"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Alamat"
        value={form.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Pilih Tipe</option>
        <option value="Negeri">Negeri</option>
        <option value="Swasta">Swasta</option>
      </select>
      <select
        name="accreditation"
        value={form.accreditation}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Pilih Akreditasi</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>

      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {selected ? 'Perbarui' : 'Tambah'} Sekolah
        </button>
        {selected && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              clearSelected();
              setForm({ name: '', address: '', type: '', accreditation: '' });
            }}
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
