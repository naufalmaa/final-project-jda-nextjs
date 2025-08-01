// File: components/dashboard/ReviewForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import Image from "next/image"; // Added Image component

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { createReviewAsync, updateReviewAsync, ReviewWithUser } from '@/redux/reviewSlice';
import { useSession } from 'next-auth/react';

interface ReviewFormProps {
  schoolId: number;
  onReviewSubmitted: () => void;
  onCancel: () => void; 
  currentReview?: ReviewWithUser | null; // Optional: for editing existing review
  userName: string;
  userImage: string;
}

// Utility function to get name initials
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return parts[0][0];
};

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

export default function ReviewForm({ schoolId, onReviewSubmitted, onCancel, currentReview, userName, userImage }: ReviewFormProps) {

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.review);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentReview?.name || userName || "",
      role: "",
      biaya: "",
      komentar: "",
      kenyamanan: 5,
      pembelajaran: 5,
      fasilitas: 5,
      kepemimpinan: 5,
    },
  });

  // Populate form fields if editing an existing review
  useEffect(() => {
    if (currentReview) {
      form.reset({
        ...currentReview,
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
        name: userName || "",
        role: "",
        biaya: "",
        komentar: "",
        kenyamanan: 5,
        pembelajaran: 5,
        fasilitas: 5,
        kepemimpinan: 5,
      });
    }
  }, [currentReview, form, userName]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    const reviewData = {
      ...values,
      userId: session.user.id,
    };

    if (currentReview) {
      
      dispatch(updateReviewAsync({ reviewId: currentReview.id, reviewData }))
        .unwrap()
        .then(() => {
          toast.success("Review updated successfully!");
          onReviewSubmitted();
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {

      const reviewData = {
        ...values,
        schoolId: schoolId,
        userId: session.user.id,
      };
      // MODIFIED: Dispatch the create thunk for new reviews
      dispatch(createReviewAsync(reviewData))
        .unwrap()
        .then(() => {
          toast.success("Review submitted successfully!");
          onReviewSubmitted();
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1"> {/* Adjusted padding */}
        {/* <p className="text-sm text-gray-600">
          {currentReview
            ? "Make changes to your existing review."
            : "Share your experience about this school."
          }
        </p> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <div className="flex items-center space-x-2">
                  {/* ADDED: Profile Picture or Abbreviation */}
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-sm">
                      {getInitials(userName)}
                    </div>
                  )}
                  <FormControl>
                    <Input placeholder="John Doe" {...field} readOnly />
                  </FormControl>
                </div>
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
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Education Activist">Education Activist</SelectItem>
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

        {/* <h4 className="text-xl font-semibold text-gray-800 pt-4 border-t border-gray-100">Your Detailed Feedback</h4> */}
        <div className="mt-4 border-t border-gray-100 pt-4">
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
        </div>

        {/* <h4 className="text-xl font-semibold text-gray-800 pt-4 border-t border-gray-100">Ratings (1 = Poor, 5 = Excellent)</h4> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t border-gray-100 pt-4">
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
            onClick={onCancel} // This will close the modal
            disabled={loading}
            className="text-gray-700 hover:bg-gray-100 mr-4"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-auto bg-primary hover:bg-primary-dark" disabled={loading }>
            {loading  ? (currentReview ? "Updating..." : "Submitting...") : (currentReview ? "Update Review" : "Submit Review")}
          </Button>
        </div>
      </form>
    </Form>
  );
  }