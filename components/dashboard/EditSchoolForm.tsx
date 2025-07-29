// File: components/dashboard/EditSchoolForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { School } from "@/lib/types"; // Assuming School type
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
import { Textarea } from "@/components/ui/textarea"; // For multiline text fields
import { toast } from "sonner"; // Assuming you use sonner for toasts

interface EditSchoolFormProps {
  school: School;
  onClose: () => void;
}

// Define the schema for validation
const formSchema = z.object({
  name: z.string().min(1, "School name is required."),
  status: z.string().min(1, "Status is required."),
  npsn: z.string().min(1, "NPSN is required."),
  bentuk: z.string().min(1, "Bentuk is required."),
  telp: z.string().nullable(),
  alamat: z.string().min(1, "Address is required."),
  kelurahan: z.string().min(1, "Sub-district is required."),
  kecamatan: z.string().min(1, "District is required."),
  description: z.string().nullable(),
  programs: z.string().nullable(),
  achievements: z.string().nullable(),
  website: z.string().url("Invalid URL format.").nullable().or(z.literal("")),
  contact: z.string().nullable(),
  // lat and lng are typically not directly editable via text input unless it's a map picker
  // For now, assume they are not directly editable here or are handled by a separate map component
});

export default function EditSchoolForm({ school, onClose }: EditSchoolFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school.name || "",
      status: school.status || "",
      npsn: school.npsn || "",
      bentuk: school.bentuk || "",
      telp: school.telp || "",
      alamat: school.alamat || "",
      kelurahan: school.kelurahan || "",
      kecamatan: school.kecamatan || "",
      description: school.description || "",
      programs: school.programs || "",
      achievements: school.achievements || "",
      website: school.website || "",
      contact: school.contact || "",
    },
  });

  const updateSchoolMutation = useMutation({
    mutationFn: async (updatedData: Partial<School>) => {
      const res = await fetch(`/api/schools/${school.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to update school.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school", school.id] });
      toast.success("School details updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(`Error updating school: ${error.message}`);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    updateSchoolMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* General Information */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Negeri, Swasta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="npsn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NPSN</FormLabel>
                <FormControl>
                  <Input placeholder="Enter NPSN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bentuk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bentuk (Form)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Info</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe - Head of Admissions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Details */}
        <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t border-gray-100">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kelurahan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-District (Kelurahan)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sub-district" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kecamatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District (Kecamatan)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter district" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Extended Information (Textareas for larger content) */}
        <h3 className="text-xl font-semibold text-gray-700 pt-4 border-t border-gray-100">Additional Information</h3>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a brief description of the school..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="programs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Programs Offered</FormLabel>
              <FormControl>
                <Textarea placeholder="List academic programs, extracurricular activities, etc." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievements</FormLabel>
              <FormControl>
                <Textarea placeholder="Highlight awards, recognitions, or notable achievements." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={updateSchoolMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateSchoolMutation.isPending}>
            {updateSchoolMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}