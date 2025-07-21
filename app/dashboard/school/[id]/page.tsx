// File: app/dashboard/school/[id]/page.tsx

'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import ReviewFormToggle from '@/app/ui/review/ReviewFormToggle';
import ReviewTable from '@/app/ui/review/ReviewTable';
import SchoolContent from '@/app/ui/school/SchoolContent';
import { StarIcon } from 'lucide-react';
import { School, Review } from '@/app/lib/types';

export default function SchoolDetailPage() {
  const { id } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch only reviews. This is efficient for refreshing after a review action.
  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const reviewsRes = await fetch(`/api/reviews?schoolId=${id}`);
      if (!reviewsRes.ok) throw new Error('Gagal memuat ulasan');
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [id]);

  // Function to fetch all page data. Used for initial load and after school content update.
  const fetchAllData = useCallback(async () => {
    if (!id) return;
    // Set loading to true only for the initial full fetch or when there's no school data yet
    if (!school) { // Check if school is null/not loaded yet
        setIsLoading(true);
    }
    try {
      const [schoolRes, reviewsRes] = await Promise.all([
        fetch(`/api/schools/${id}`),
        fetch(`/api/reviews?schoolId=${id}`)
      ]);

      if (!schoolRes.ok) throw new Error('Gagal memuat data sekolah');
      if (!reviewsRes.ok) throw new Error('Gagal memuat ulasan');

      const schoolData = await schoolRes.json();
      const reviewsData = await reviewsRes.json();

      setSchool(schoolData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSchool(null); // Set school to null on error to show error message
    } finally {
      setIsLoading(false);
    }
  }, [id]); // Removed 'school' from dependencies to prevent infinite loop

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Review Handling Functions ---
  const handleReviewSubmit = () => {
    setEditingReview(null); // Clear editing state
    fetchReviews(); // Refetch only reviews to show the new/updated one
  };
  
  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    // Scroll to the review section for better UX
    document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus ulasan');
      fetchReviews(); // Refetch reviews after delete
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (isLoading) return <div className="p-6 text-center text-gray-500">Memuat data sekolah...</div>;
  if (!school) return <div className="p-6 text-center text-red-500">Gagal memuat data sekolah. Silakan coba lagi.</div>;

  const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.kenyamanan + r.pembelajaran + r.fasilitas + r.kepemimpinan, 0) / (reviews.length * 4)
      : 0;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* --- School Header --- */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/4 h-48 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">[Logo Sekolah]</div>
        <div className="w-full md:w-3/4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{school.name}</h1>
            <p className="text-gray-600">{school.bentuk} • {school.status} • {school.kecamatan}</p>
            <p className="text-sm text-gray-500 mb-3">{school.alamat}</p>
            <div className="flex items-center gap-4">
              <p className="text-yellow-500 font-bold text-lg flex items-center gap-2">
                  {avgRating.toFixed(1)}
                  <StarIcon className="w-5 h-5 fill-current" />
                  <span className="text-gray-500 text-sm font-normal">({reviews.length} ulasan)</span>
              </p>
            </div>
        </div>
      </div>

      {/* --- School Content Section --- */}
      {/* Here is the integrated component. It receives the `school` data and the `fetchAllData` function to call on update. */}
      <SchoolContent school={school} onUpdate={fetchAllData} />

      {/* --- Review Section --- */}
      <div id="review-section" className="bg-white p-6 rounded-lg shadow-md scroll-mt-4">
        <h2 className="text-xl font-semibold mb-4">Ulasan Pengguna</h2>
        <ReviewFormToggle
          schoolId={school.id}
          editing={editingReview}
          onCancel={() => setEditingReview(null)}
          onSubmit={handleReviewSubmit}
        />
        <div className="mt-6">
          <ReviewTable
            reviews={reviews}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
}