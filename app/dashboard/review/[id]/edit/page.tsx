// File: /app/dashboard/review/[id]/edit/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReviewForm from '@/app/ui/review/ReviewForm';

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulasi ambil data review berdasarkan ID (dummy)
    const stored = localStorage.getItem('reviews');
    const parsed = stored ? JSON.parse(stored) : [];
    const found = parsed.find((r: any) => r.id === parseInt(params.id));
    if (found) setReview(found);
  }, [params.id]);

  function handleUpdate(updatedReview: any) {
    const stored = localStorage.getItem('reviews');
    const parsed = stored ? JSON.parse(stored) : [];
    const updated = parsed.map((r: any) => r.id === updatedReview.id ? updatedReview : r);
    localStorage.setItem('reviews', JSON.stringify(updated));
    router.push('/dashboard/review');
  }

  if (!review) return <p className="p-6">Memuat data ulasan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Ulasan Sekolah</h1>
      <ReviewForm onSubmit={handleUpdate} defaultValue={review} />
    </div>
  );
}
