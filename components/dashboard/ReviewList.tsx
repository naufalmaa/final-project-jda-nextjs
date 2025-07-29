// File: components/dashboard/ReviewList.tsx

"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Review, User } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import EditReviewForm from "./EditReviewForm";
import DeleteReviewForm from "./DeleteReviewForm";
import { StarRatingInput } from "@/components/ui/star-rating-input"; // Assuming this path

interface ReviewListProps {
  schoolId: string;
}

type ReviewWithUser = Review & { user: User };

const fetchReviewsBySchoolId = async (schoolId: string): Promise<ReviewWithUser[]> => {
  const res = await fetch(`/api/schools/${schoolId}/reviews`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
    console.error(`Failed to fetch reviews for schoolId ${schoolId}:`, errorBody);
    throw new Error(`Failed to fetch reviews: ${errorBody.message || res.statusText}`);
  }
  return res.json();
};

export default function ReviewList({ schoolId }: ReviewListProps) {
//   const { data: session } = useSession();
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery<ReviewWithUser[], Error>({
    queryKey: ["reviews", schoolId],
    queryFn: () => fetchReviewsBySchoolId(schoolId),
  });

  const getRatingDisplay = (rating: number) => {
    return <StarRatingInput value={rating} onChange={() => {}} maxStars={5} className="pointer-events-none" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold">
          Error: {error?.message || "Could not load reviews."}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Please ensure your backend API at <code className="bg-gray-100 p-1 rounded">/api/schools/{schoolId}/reviews</code> is working correctly.
        </p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-accent">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">{review.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  {review.role} • {review.biaya}
                </CardDescription>
                <p className="text-xs text-gray-400 mt-1">
                  Reviewed by {review.user?.name || "Anonymous"} on{" "} {/* Use optional chaining for user?.name */}
                  {new Date(review.tanggal).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {
              (
                // session?.user?.id === review.userId || session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN"
            // ) && (
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] p-6">
                      <DialogHeader>
                        <DialogTitle>Edit Your Review</DialogTitle>
                        <DialogDescription>
                          Make changes to your review here.
                        </DialogDescription>
                      </DialogHeader>
                      <EditReviewForm review={review} schoolId={schoolId} onClose={() => { /* Dialog will close automatically */ }} />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">Delete</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-6">
                      <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this review? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DeleteReviewForm reviewId={review.id} schoolId={schoolId} onClose={() => { /* Dialog will close automatically */ }} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <Separator className="mt-4 mb-2 bg-gray-100" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 text-base leading-relaxed">{review.komentar}</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Comfort:</span>
                {getRatingDisplay(review.kenyamanan)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Learning:</span>
                {getRatingDisplay(review.pembelajaran)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Facilities:</span>
                {getRatingDisplay(review.fasilitas)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Leadership:</span>
                {getRatingDisplay(review.kepemimpinan)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}