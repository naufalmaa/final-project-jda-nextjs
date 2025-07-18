'use client';

import { useState } from 'react';
import ReviewForm from '@/app/ui/review/ReviewForm';
import ReviewList from '@/app/ui/review/ReviewList';

export default function ReviewDashboardPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  function handleAdd(review: any) {
    setReviews([...reviews, review]);
  }

  function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus ulasan ini?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tulis & Lihat Ulasan Sekolah</h1>
      <ReviewForm onSubmit={handleAdd} />
      <ReviewList data={reviews} onDelete={handleDelete} />
    </div>
  );
}
