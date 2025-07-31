// File: components/dashboard/ReviewList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, StarFilledIcon } from "@radix-ui/react-icons"; // Added StarFilledIcon
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./ReviewForm"; // Correct import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // NEW IMPORT for dialog components

interface ReviewWithUser extends Review {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

// --- API Call Functions ---
async function fetchReviewsBySchoolId(
  schoolId: number
): Promise<ReviewWithUser[]> {
  const res = await fetch(`/api/reviews?schoolId=${schoolId}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: "Unknown error" }));
    console.error(
      `Failed to fetch reviews for schoolId ${schoolId}:`,
      errorBody
    );
    throw new Error(`Failed to fetch reviews: ${errorBody.message || res.statusText}`);
  }
  return res.json();
}

async function deleteReview(reviewId: string) {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: "Unknown error" }));
    console.error(`Failed to delete review ${reviewId}:`, errorBody);
    throw new Error(`Failed to delete review: ${errorBody.message || res.statusText}`);
  }
  return res.json();
}

interface ReviewListProps {
  schoolId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ schoolId }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Add Review Modal
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  // State for Edit Review Modal
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [currentEditingReview, setCurrentEditingReview] = useState<ReviewWithUser | null>(null);


  const router = useRouter();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReviewsBySchoolId(schoolId);
        setReviews(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoadingReviews(false);
      }
    };
    getReviews();
  }, [schoolId, isAddReviewModalOpen, isEditReviewModalOpen]); // Refetch when modals close

  const handleReviewAddedOrUpdated = () => {
    setIsAddReviewModalOpen(false); // Close add form modal
    setIsEditReviewModalOpen(false); // Close edit form modal
    setCurrentEditingReview(null); // Clear editing review data
    // Reviews will refetch due to dependency array
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        toast.success("Review deleted successfully!");
      } catch (err: any) {
        console.error("Error deleting review:", err);
        toast.error(`Failed to delete review: ${err.message}`);
      }
    }
  };

  const handleEditReviewClick = (review: ReviewWithUser) => {
    setCurrentEditingReview(review);
    setIsEditReviewModalOpen(true);
  };

  if (loadingReviews || status === 'loading') {
    return (
      <div className="space-y-4">
        {/* Skeleton for Review List Header */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
        {/* Skeletons for individual review cards */}
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  const canAddReview = userRole === "USER"; // Only regular users can add reviews
  const canEditOrDelete = (reviewUserId: string) => userId === reviewUserId || userRole === "SUPERADMIN" || userRole === "ADMIN";


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Moved title/description here for alignment */}
        <div className="flex-1">
          {/* <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
          <p className="text-gray-600">What people are saying about this school?</p> */}
        </div>
        {canAddReview && (
          <Dialog open={isAddReviewModalOpen} onOpenChange={setIsAddReviewModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto text-primary hover:bg-primary/10 transition-colors"
              >
                Add Your Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add Your Review</DialogTitle>
                <DialogDescription>
                  Share your experience and help others learn about this school.
                </DialogDescription>
              </DialogHeader>
              <ReviewForm schoolId={schoolId} onReviewSubmitted={handleReviewAddedOrUpdated} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-lg py-8 text-center">No reviews yet. Be the first to add one!</p>
      ) : (
        <div className="space-y-4 mt-6">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-700 leading-snug">
                  {review.name || review.user?.name || "Anonymous"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">{review.role}</CardDescription>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{format(new Date(review.createdAt), "PPP")}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Cost/Biaya:</strong> {review.biaya}
                </p>
                <p className="text-base text-gray-800 leading-relaxed">
                  {review.komentar}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-700 mt-4 pt-4 border-t border-gray-100">
                  {/* Display ratings with filled stars */}
                  <p className="flex items-center gap-1">
                    <strong>Comfort:</strong> {review.kenyamanan} <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Learning:</strong> {review.pembelajaran} <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Facilities:</strong> {review.fasilitas} <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Leadership:</strong> {review.kepemimpinan} <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4 bg-gray-50">
                {canEditOrDelete(review.userId) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReviewClick(review)} // Open edit modal
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Review Modal (Hidden by default, opens when currentEditingReview is set) */}
      {currentEditingReview && (
        <Dialog open={isEditReviewModalOpen} onOpenChange={setIsEditReviewModalOpen}>
          <DialogContent className="sm:max-w-[700px] p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Your Review</DialogTitle>
              <DialogDescription>
                Make changes to your existing review.
              </DialogDescription>
            </DialogHeader>
            <ReviewForm
              schoolId={schoolId}
              onReviewSubmitted={handleReviewAddedOrUpdated}
              currentReview={currentEditingReview}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReviewList;