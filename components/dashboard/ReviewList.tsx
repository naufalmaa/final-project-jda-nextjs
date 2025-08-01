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
import Image from "next/image"; 

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchReviewsBySchoolId, deleteReviewAsync, ReviewWithUser } from "@/redux/reviewSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReviewListProps {
  schoolId: number;
}

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return parts[0][0];
};

const ReviewList = ({ schoolId }: ReviewListProps) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [currentEditingReview, setCurrentEditingReview] =
    useState<ReviewWithUser | null>(null);
  // ADDED: State for delete confirmation modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.review);

  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    dispatch(fetchReviewsBySchoolId(schoolId));
  }, [dispatch, schoolId]);

  const handleReviewAddedOrUpdated = () => {
    // CORRECTED: First, close all modals
    setIsAddReviewModalOpen(false);
    setCurrentEditingReview(null);
    // Then, re-fetch data
    dispatch(fetchReviewsBySchoolId(schoolId));
  };

  // This function is now solely responsible for closing the "Add Review" modal
  const handleCancelAddReview = () => {
    setIsAddReviewModalOpen(false);
  };

  const handleEditReviewClick = (review: ReviewWithUser) => {
    setCurrentEditingReview(review);
    setIsEditReviewModalOpen(true);
  };

  const handleDeleteReview = (reviewId: number) => {
    // REPLACE: local fetch with Redux thunk
    dispatch(deleteReviewAsync(reviewId))
      .unwrap()
      .then(() => {
        toast.success("Review deleted successfully!");
        setIsDeleteDialogOpen(false);
        setReviewToDelete(null);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <StarFilledIcon
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const renderSkeletons = () => (
    <div className="space-y-4 mt-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // CORRECTED: Conditional rendering logic
  if (loading) {
    return renderSkeletons();
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const canAddReview = userRole === "USER"; // Only regular users can add reviews
  const canEditOrDelete = (reviewUserId: string) =>
    userId === reviewUserId || userRole === "SCHOOL_ADMIN";

  // ADDED: Check if the user has already reviewed this school
  const hasUserReviewed = reviews.some((review) => review.userId === userId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Moved title/description here for alignment */}
        <div className="flex-1">
          {/* <h3 className="text-2xl font-bold text-gray-800">Reviews</h3>
          <p className="text-gray-600">What people are saying about this school?</p> */}
        </div>
        {/* {canAddReview && !hasUserReviewed && ( */}
        {canAddReview && (
          <Dialog
            open={isAddReviewModalOpen}
            onOpenChange={setIsAddReviewModalOpen}
          >
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
                <DialogTitle className="text-2xl font-bold">
                  Add Your Review
                </DialogTitle>
                <DialogDescription>
                  Share your experience and help others learn about this school.
                </DialogDescription>
              </DialogHeader>
              <ReviewForm
                schoolId={Number(schoolId)}
                onReviewSubmitted={handleReviewAddedOrUpdated}
                onCancel={handleCancelAddReview}
                userName={userName || ''}
                userImage={userImage || ''}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-lg py-8 text-center">
          No reviews yet. Be the first to add one!
        </p>
      ) : (
        <div className="space-y-4 mt-6">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm border-gray-200 mb-6">
              <CardHeader className="pb-3">
                {review.user?.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={review.user.image}
                        alt={review.user.name || "User"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-lg">
                      {getInitials(review.user.name)}
                    </div>
                  )}
                <CardTitle className="text-xl font-semibold text-gray-700 leading-snug">
                  {review.name || review.user?.name || "Anonymous"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {review.role}
                </CardDescription>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{format(new Date(review.createdAt), "PPP")}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Cost/Biaya:</strong> {review.biaya}
                </p>
                <p className="text-base text-gray-800 leading-relaxed">
                  <strong className="text-sm text-gray-600"> Comment: <br></br></strong>{review.komentar}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-700 mt-4 pt-4 border-t border-dashed border-gray-200">
                  {/* Display ratings with filled stars */}
                  <p className="flex items-center gap-1">
                    <strong>Comfort:</strong> {review.kenyamanan}{" "}
                    <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Learning:</strong> {review.pembelajaran}{" "}
                    <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Facilities:</strong> {review.fasilitas}{" "}
                    <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>Leadership:</strong> {review.kepemimpinan}{" "}
                    <StarFilledIcon className="text-yellow-500 h-4 w-4" />
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
                {canEditOrDelete(review.userId) && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReviewClick(review)} // Open edit modal
                      className="text-blue-600 hover:bg-blue-50 mr-3"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setReviewToDelete(review.id);
                        setIsDeleteDialogOpen(true);
                      }}
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
        <Dialog
          open={isEditReviewModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCurrentEditingReview(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[700px] p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Edit Your Review
              </DialogTitle>
              <DialogDescription>
                Make changes to your existing review.
              </DialogDescription>
            </DialogHeader>
            <ReviewForm
              schoolId={Number(schoolId)}
              onReviewSubmitted={handleReviewAddedOrUpdated}
              onCancel={() => setCurrentEditingReview(null)} // Close modal without saving
              currentReview={currentEditingReview}
              userName={userName || ''}
              userImage={userImage || ''}

            />
          </DialogContent>
        </Dialog>
      )}

      {/* ADDED: Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              review.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (reviewToDelete !== null) {
                  handleDeleteReview(reviewToDelete);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewList;
