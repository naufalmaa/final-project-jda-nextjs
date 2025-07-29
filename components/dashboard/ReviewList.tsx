// components/dashboard/ReviewList.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState }    from "react";
import { Review }      from "./EditReviewForm";
import EditReviewForm  from "./EditReviewForm";
import { useReviews }  from "@/lib/queries";

export default function ReviewList({ schoolId }: { schoolId: string }) {
  const { data: reviews, isLoading } = useReviews(schoolId);
//   const { data: session }            = useSession();
  const [editingId, setEditingId]    = useState<number|null>(null);

  if (isLoading) return <p>Loading reviews…</p>;
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <ul className="space-y-4">
      {reviews.map((r) => {
        // is this review by the current user?
        // const canEdit = session?.user.email === r.user.email; 

        // if we’re editing this one, show the form
        if (editingId === r.id) {
          return (
            <li key={r.id}>
              <EditReviewForm
                initialData={r as Review}
                onCancel={() => setEditingId(null)}
                onSaved={() => setEditingId(null)}
              />
            </li>
          );
        }

        // otherwise show the normal display
        return (
          <li key={r.id} className="p-4 border rounded">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{r.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(r.tanggal).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-2">{r.komentar}</p>
            <div className="flex flex-wrap text-sm space-x-4">
              <span>Kenyamanan: {r.kenyamanan}</span>
              <span>Pembelajaran: {r.pembelajaran}</span>
              <span>Fasilitas: {r.fasilitas}</span>
              <span>Kepemimpinan: {r.kepemimpinan}</span>
            </div>

            {
            // canEdit && 
            (
              <button
                className="mt-2 text-sm text-blue-600 underline"
                onClick={() => setEditingId(r.id)}
              >
                Edit Review
              </button>
            )
            }
          </li>
        );
      })}
    </ul>
  );
}
