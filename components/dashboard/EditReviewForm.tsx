// File: components/dashboard/EditReviewForm.tsx

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Review } from "@/lib/types";
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
import { StarRatingInput } from "@/components/ui/star-rating-input"; // NEW IMPORT

interface EditReviewFormProps {
  review: Review;
  schoolId: string;
  onClose: () => void;
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

export default function EditReviewForm({ review, schoolId, onClose }: EditReviewFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: review.name || "",
      role: review.role || "",
      biaya: review.biaya || "",
      komentar: review.komentar || "",
      kenyamanan: review.kenyamanan || 3,
      pembelajaran: review.pembelajaran || 3,
      fasilitas: review.fasilitas || 3,
      kepemimpinan: review.kepemimpinan || 3,
    },
  });

  useEffect(() => {
    form.reset({
      name: review.name || "",
      role: review.role || "",
      biaya: review.biaya || "",
      komentar: review.komentar || "",
      kenyamanan: review.kenyamanan || 3,
      pembelajaran: review.pembelajaran || 3,
      fasilitas: review.fasilitas || 3,
      kepemimpinan: review.kepemimpinan || 3,
    });
  }, [review, form]);

  const updateReviewMutation = useMutation({
    mutationFn: async (updatedReview: z.infer<typeof formSchema>) => {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Update Review API Error:", errorBody);
        throw new Error(errorBody.error || "Failed to update review.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", schoolId] });
      toast.success("Review updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Error updating review: ${error.message}`);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateReviewMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg bg-white shadow-sm">
        <h4 className="text-xl font-semibold text-gray-800">Your Information</h4>
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

        <h4 className="text-xl font-semibold text-gray-800 pt-4 border-t border-gray-100">Your Review</h4>
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
          {/* Rating: Kenyamanan */}
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
          {/* Rating: Pembelajaran */}
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
          {/* Rating: Fasilitas */}
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
          {/* Rating: Kepemimpinan */}
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

        <div className="flex justify-end space-x-2 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={updateReviewMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateReviewMutation.isPending}>
            {updateReviewMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}