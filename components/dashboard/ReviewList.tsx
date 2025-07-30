// File: components/dashboard/ReviewList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import ReviewForm from "./ReviewForm"; // CHANGED IMPORT: Use ReviewForm

// Define the structure of a review, including user details
interface ReviewWithUser extends Review {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

// --- API Call Functions (these should largely remain the same) ---
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

// UPDATE function is now handled directly by ReviewForm's useMutation

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
  const [isAddReviewFormOpen, setIsAddReviewFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null); // State to track which review is being edited

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
  }, [schoolId, isAddReviewFormOpen, editingReviewId]); // Refetch when add form closes or edit form finishes

  const handleReviewAdded = () => {
    setIsAddReviewFormOpen(false); // Close the add form
    setEditingReviewId(null); // Ensure edit mode is off if it was somehow on
    // reviews will refetch due to dependency array
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

  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId); // Set the ID of the review to edit
    setIsAddReviewFormOpen(false); // Close the add form if open
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null); // Exit edit mode
  };

  if (loadingReviews || status === 'loading') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  const canAddReview = userRole === "USER";
  const canEditOrDelete = (reviewUserId: string) => userId === reviewUserId || userRole === "SUPERADMIN" || userRole === "ADMIN";


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Reviews</h2>
        {canAddReview && (
          <Collapsible open={isAddReviewFormOpen} onOpenChange={setIsAddReviewFormOpen} className="w-full">
            <div className="flex justify-end">
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="text-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setEditingReviewId(null)} // Ensure no review is in edit mode when opening add form
                >
                  {isAddReviewFormOpen ? "Close Review Form" : "Add Your Review"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden mt-4">
              <ReviewForm schoolId={schoolId} onReviewSubmitted={handleReviewAdded} currentReview={null} /> {/* Always pass null for adding */}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {reviews.length === 0 && !isAddReviewFormOpen && !editingReviewId ? ( // Only show message if no reviews AND no form is open
        <p className="text-gray-600 text-lg py-8 text-center">No reviews yet. Be the first to add one!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-700">{review.name || review.user?.name || "Anonymous"}</CardTitle>
                <CardDescription className="text-sm text-gray-500">{review.role}</CardDescription>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{format(new Date(review.createdAt), "PPP")}</span>
                </div>
              </CardHeader>
              <CardContent>
                {editingReviewId === review.id ? (
                  // Render ReviewForm for editing if this review's ID matches editingReviewId
                  <ReviewForm
                    schoolId={schoolId}
                    onReviewSubmitted={handleReviewAdded}
                    currentReview={reviews.find(r => r.id === editingReviewId)} // Pass the full review object
                    onCancelEdit={handleCancelEdit}
                  />
                ) : (
                  // Otherwise, render the display-only view
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Biaya:</strong> {review.biaya}
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed">{review.komentar}</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm text-primary hover:no-underline">Ratings Detail</AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 space-y-1">
                          <p>
                            <strong>Kenyamanan:</strong> {review.kenyamanan}/5
                          </p>
                          <p>
                            <strong>Pembelajaran:</strong> {review.pembelajaran}/5
                          </p>
                          <p>
                            <strong>Fasilitas:</strong> {review.fasilitas}/5
                          </p>
                          <p>
                            <strong>Kepemimpinan:</strong> {review.kepemimpinan}/5
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4 bg-gray-50">
                {canEditOrDelete(review.userId) && editingReviewId !== review.id && ( // Only show buttons if not in edit mode
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReview(review.id)} // Pass ID to edit handler
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
                {/* If in edit mode for this review, buttons are handled by ReviewForm itself */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;