// File: /app/ui/school/SchoolContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { School } from '@/app/lib/types'; // Assuming you have a types file
import { Edit, Save, X, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { updateSchool } from '@/app/store/schoolSlice';


// Define the component's props for type safety
interface SchoolContentProps {
  school: School | null; // Allow school to be null initially
  onUpdate: () => void; // A callback to notify the parent page to refetch data
}

// Define the shape of the form data
type FormData = {
  description: string;
  programs: string;
  achievements: string;
  website: string;
  contact: string;
};

export default function SchoolContent() {
  const dispatch = useDispatch();
  // const school = useSelector((state: RootState) => state.school.selected);
  const school = useSelector((state: any) => state.school?.selected);


  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    description: '',
    programs: '',
    achievements: '',
    website: '',
    contact: '',
  });

  // This effect syncs the component's form state with the `school` prop.
  // It runs whenever the school data from the parent page changes.
  useEffect(() => {
    if (school) {
      setForm({
        description: school.description || '',
        programs: school.programs || '',
        achievements: school.achievements || '',
        website: school.website || '',
        contact: school.contact || '',
      });
    }
  }, [school]);

  const handleSave = async () => {
    if (!school) return;
  
    try {
      const updatedData = { ...school, ...form };
  
      const res = await fetch(`/api/schools/${school.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
  
      if (!res.ok) throw new Error('Gagal update data sekolah');
  
      dispatch(updateSchool(form));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating school:', error);
      alert('Gagal menyimpan perubahan.');
    }
  };


  const handleCancel = () => {
    if (school) {
      setForm({
        description: school.description || '',
        programs: school.programs || '',
        achievements: school.achievements || '',
        website: school.website || '',
        contact: school.contact || '',
      });
    }
    
  };

  // For now, we assume the role is always admin for the edit button to be visible
  const isSuperAdmin = true;

  // ✅ FIX: Add a defensive check. If the school data hasn't loaded, don't render the component.
  // The parent page will show a loading indicator instead.
  if (!school) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">Profil Sekolah</h2>
        {isSuperAdmin && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
          >
            <Edit size={16} />
            Edit Konten
          </button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}

      <ContentBlock label="Deskripsi" value={form.description} editMode={editMode} onChange={(v) => setForm({ ...form, description: v })} />
      <ContentBlock label="Program Unggulan" value={form.programs} editMode={editMode} onChange={(v) => setForm({ ...form, programs: v })} />
      <ContentBlock label="Prestasi" value={form.achievements} editMode={editMode} onChange={(v) => setForm({ ...form, achievements: v })} />
      <ContentBlock label="Website" value={form.website} editMode={editMode} onChange={(v) => setForm({ ...form, website: v })} inputType="input" />
      <ContentBlock label="Kontak" value={form.contact} editMode={editMode} onChange={(v) => setForm({ ...form, contact: v })} inputType="input" />

      {editMode && (
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-36 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Menyimpan' : 'Simpan'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold disabled:text-gray-400"
          >
            <X size={16} />
            Batal
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-component for displaying/editing content blocks. This keeps the main component clean.
function ContentBlock({ label, value, editMode, onChange, inputType = 'textarea' }: {
  label: string;
  value: string;
  editMode: boolean;
  onChange: (val: string) => void;
  inputType?: 'textarea' | 'input';
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      {editMode ? (
        inputType === 'textarea' ? (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Masukkan ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Masukkan ${label.toLowerCase()}...`}
          />
        )
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap min-h-[24px]">
          {value || <span className="text-gray-400 italic">Belum diisi</span>}
        </p>
      )}
    </div>
  );
}
