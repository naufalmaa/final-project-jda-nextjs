// File: /app/dashboard/review/new/page.tsx
'use client';

import ReviewForm from '@/app/ui/review/ReviewForm';
import { useRouter } from 'next/navigation';

export default function NewReviewPage() {
  const router = useRouter();

  function handleCreate(review: any) {
    // Sementara simpan di local state (bisa ganti ke API nanti)
    console.log('Review submitted:', review);
    router.push('/dashboard/review');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah Ulasan Sekolah</h1>
      <ReviewForm onSubmit={handleCreate} />
    </div>
  );
}
