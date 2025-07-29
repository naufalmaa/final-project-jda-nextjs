// File: components/dashboard/DeleteReviewForm.tsx

"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";

interface DeleteReviewFormProps {
  reviewId: number;
  schoolId: string;
  onClose: () => void;
}

export default function DeleteReviewForm({ reviewId, schoolId, onClose }: DeleteReviewFormProps) {
  const queryClient = useQueryClient();

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Delete Review API Error:", errorBody);
        throw new Error(errorBody.error || "Failed to delete review.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", schoolId] });
      toast.success("Review deleted successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Error deleting review: ${error.message}`);
    },
  });

  return (
    <DialogFooter className="mt-4 flex flex-col sm:flex-row-reverse sm:space-x-2 sm:space-x-reverse">
      <Button
        variant="destructive"
        onClick={() => deleteReviewMutation.mutate()}
        disabled={deleteReviewMutation.isPending}
      >
        {deleteReviewMutation.isPending ? "Deleting..." : "Confirm Delete"}
      </Button>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={deleteReviewMutation.isPending}
      >
        Cancel
      </Button>
    </DialogFooter>
  );
}