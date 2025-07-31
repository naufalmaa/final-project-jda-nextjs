// File: components/dashboard/ReviewForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { StarRatingInput } from "@/components/ui/star-rating-input";
import { Review } from "@prisma/client";

interface ReviewWithUser extends Review {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface ReviewFormProps {
  schoolId: number;
  onReviewSubmitted: () => void;
  currentReview?: ReviewWithUser | null; // Optional: for editing existing review
}

const formSchema = z.object({
  name: z.string().min(1, "Your name is required."),
  role: z.string().min(1, "Your role (e.g., Parent, Student) is required."),
  biaya: z.string().min(1, "Cost information is required."),
  komentar: z.string().min(10, "Comment must be at least 10 characters.").max(1000, "Comment cannot exceed 1000 characters."),
  kenyamanan: z.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
  pembelajaran: z.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
  fasilitas: z.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
  kepemimpinan: z.number().min(1, "Rating is required.").max(5, "Rating must be between 1 and 5."),
});

export default function ReviewForm({ schoolId, onReviewSubmitted, currentReview }: ReviewFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      biaya: "",
      komentar: "",
      kenyamanan: 3,
      pembelajaran: 3,
      fasilitas: 3,
      kepemimpinan: 3,
    },
  });

  // Populate form fields if editing an existing review
  useEffect(() => {
    if (currentReview) {
      form.reset({
        name: currentReview.name || "",
        role: currentReview.role || "",
        biaya: currentReview.biaya || "",
        komentar: currentReview.komentar,
        kenyamanan: currentReview.kenyamanan,
        pembelajaran: currentReview.pembelajaran,
        fasilitas: currentReview.fasilitas,
        kepemimpinan: currentReview.kepemimpinan,
      });
    } else {
      // Reset to default values for a new review
      form.reset({
        name: "",
        role: "",
        biaya: "",
        komentar: "",
        kenyamanan: 3,
        pembelajaran: 3,
        fasilitas: 3,
        kepemimpinan: 3,
      });
    }
  }, [currentReview, form]);

  const reviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const url = currentReview ? `/api/reviews/${currentReview.id}` : `/api/reviews`;
      const method = currentReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, schoolId: schoolId }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Review API Error:", errorBody);
        throw new Error(errorBody.error || errorBody.message || `Failed to ${currentReview ? 'update' : 'add'} review.`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", schoolId] });
      toast.success(currentReview ? "Review updated successfully!" : "Review added successfully!");
      form.reset(); // Reset form after successful submission
      onReviewSubmitted(); // Close the modal
    },
    onError: (error) => {
      toast.error(`Error ${currentReview ? 'updating' : 'adding'} review: ${error.message}`);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    reviewMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1"> {/* Adjusted padding */}
        <p className="text-sm text-gray-600">
          {currentReview
            ? "Make changes to your existing review."
            : "Share your experience about this school."
          }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="biaya"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Cost Information (e.g., Monthly Fee)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Rp 500.000/month or N/A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-800 pt-4 border-t border-gray-100">Your Detailed Feedback</h4>
        <FormField
          control={form.control}
          name="komentar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your experience and thoughts about the school..." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h4 className="text-xl font-semibold text-gray-800 pt-4 border-t border-gray-100">Ratings (1 = Poor, 5 = Excellent)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="kenyamanan"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Comfort/Environment:</FormLabel>
                <FormControl>
                  <StarRatingInput value={value} onChange={onChange} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pembelajaran"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Learning Quality:</FormLabel>
                <FormControl>
                  <StarRatingInput value={value} onChange={onChange} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fasilitas"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Facilities:</FormLabel>
                <FormControl>
                  <StarRatingInput value={value} onChange={onChange} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kepemimpinan"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Leadership/Management:</FormLabel>
                <FormControl>
                  <StarRatingInput value={value} onChange={onChange} {...fieldProps} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onReviewSubmitted} // This will close the modal
            disabled={reviewMutation.isPending}
            className="text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-auto bg-primary hover:bg-primary-dark" disabled={reviewMutation.isPending}>
            {reviewMutation.isPending ? (currentReview ? "Updating..." : "Submitting...") : (currentReview ? "Update Review" : "Submit Review")}
          </Button>
        </div>
      </form>
    </Form>
  );
}