'use client';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';
import { Review } from '@/app/lib/types';
import { RootState } from '@/app/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { deleteReview, setReviews } from '@/app/store/reviewSlice';

interface ReviewTableProps {
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  schoolId: number;
}

export default function ReviewTable({ onEdit, onDelete, schoolId }: ReviewTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const dispatch = useDispatch();
  const reviews = useSelector((state: RootState) => state.review.reviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?schoolId=${schoolId}`);
        const data = await res.json();
        dispatch(setReviews(data));
        console.log('✅ Review fetched:', data);
      } catch (err) {
        console.error('❌ Gagal ambil review dari API:', err);
      }
    };

    fetchReviews();
  }, [dispatch, schoolId]);

  const handleConfirmDelete = (id: number) => setConfirmDelete(id);
  const handleCancelDelete = () => setConfirmDelete(null);

  const handleDelete = () => {
    if (confirmDelete !== null) {
      dispatch(deleteReview(confirmDelete));
      onDelete(confirmDelete); // ⬅️ pastikan ini juga memanggil API DELETE
      setConfirmDelete(null);
    }
  };

  const renderStars = (val: number) => (
    <span className="text-yellow-500 flex items-center gap-1">
      {val}/5 <Star size={14} className="fill-yellow-400 text-yellow-400" />
    </span>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 py-2">Nama</th>
            <th className="px-3 py-2">Peran</th>
            <th className="px-3 py-2">Biaya</th>
            <th className="px-3 py-2">Komentar</th>
            <th className="px-3 py-2">Kenyamanan</th>
            <th className="px-3 py-2">Pembelajaran</th>
            <th className="px-3 py-2">Fasilitas</th>
            <th className="px-3 py-2">Kepemimpinan</th>
            <th className="px-3 py-2">Tanggal</th>
            <th className="px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2">{r.role}</td>
              <td className="px-3 py-2">{r.biaya}</td>
              <td className="px-3 py-2">{r.komentar}</td>
              <td className="px-3 py-2">{renderStars(r.kenyamanan)}</td>
              <td className="px-3 py-2">{renderStars(r.pembelajaran)}</td>
              <td className="px-3 py-2">{renderStars(r.fasilitas)}</td>
              <td className="px-3 py-2">{renderStars(r.kepemimpinan)}</td>
              <td className="px-3 py-2">{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onEdit && onEdit(r)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleConfirmDelete(r.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal konfirmasi hapus */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-4">
            <p className="text-sm text-gray-800">
              Apakah Anda yakin ingin menghapus review ini?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
