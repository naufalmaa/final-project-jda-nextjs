'use client';

import { useState } from 'react';
import SchoolTable from '@/app/ui/school/SchoolTable';
import SchoolForm from '@/app/ui/school/SchoolForm';

export default function SchoolPage() {
  const [schools, setSchools] = useState([
    {
      id: 1,
      name: 'SD Negeri 1 Bandung',
      address: 'Jl. Kembang No.1',
      type: 'Negeri',
      accreditation: 'A',
    },
    {
      id: 2,
      name: 'SD Swasta Harapan',
      address: 'Jl. Mawar No.2',
      type: 'Swasta',
      accreditation: 'B',
    },
  ]);

  const [selected, setSelected] = useState<any | null>(null);

  function handleAdd(data: any) {
    const newSchool = { id: Date.now(), ...data };
    setSchools((prev) => [...prev, newSchool]);
  }

  function handleUpdate(updated: any) {
    setSchools((prev) =>
      prev.map((school) => (school.id === updated.id ? updated : school))
    );
    setSelected(null);
  }

  function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus sekolah ini?')) {
      setSchools((prev) => prev.filter((school) => school.id !== id));
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manajemen Sekolah Dasar (SD) Daerah Bandung</h1>
      <SchoolForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        selected={selected}
        clearSelected={() => setSelected(null)}
      />
      <SchoolTable data={schools} onEdit={setSelected} onDelete={handleDelete} />
    </div>
  );
}
