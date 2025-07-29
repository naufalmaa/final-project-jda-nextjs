// app/dashboard/detail/[id]/page.tsx
import React from "react";
import SchoolDetail from "@/components/dashboard/SchoolDetail";
import ReviewList from "@/components/dashboard/ReviewList";
import AddReviewForm from "@/components/dashboard/AddReviewForm";

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-12">
      <SchoolDetail schoolId={id} />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <ReviewList schoolId={id} />

        {/* Only show the form if user is signed in */}
        <AddReviewForm schoolId={id} />
      </section>
    </div>
  );
}
