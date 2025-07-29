// components/dashboard/EditReviewForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export type Review = {
  id:           number;
  name:         string;
  role:         string;
  biaya:        string;
  komentar:     string;
  kenyamanan:   number;
  pembelajaran: number;
  fasilitas:    number;
  kepemimpinan: number;
};

export default function EditReviewForm({
  initialData,
  onCancel,
  onSaved,
}: {
  initialData: Review;
  onCancel:    () => void;
  onSaved:     () => void;
}) {
  const { register, handleSubmit } = useForm<Review>({
    defaultValues: initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string|null>(null);

  const onSubmit = async (data: Review) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews/${initialData.id}`, {
        method:      "PUT",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({
          name:         data.name,
          role:         data.role,
          biaya:        data.biaya,
          komentar:     data.komentar,
          kenyamanan:   data.kenyamanan,
          pembelajaran: data.pembelajaran,
          fasilitas:    data.fasilitas,
          kepemimpinan: data.kepemimpinan,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to update");
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded">
      <Input {...register("name")}      label="Name"         required />
      <Input {...register("role")}      label="Role"         required />
      <Input {...register("biaya")}     label="Biaya"        required />
      <Textarea {...register("komentar")} label="Komentar"  required />

      {(["kenyamanan","pembelajaran","fasilitas","kepemimpinan"] as const).map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize">{field}</label>
          <select
            {...register(field)}
            className="w-full p-2 border rounded"
          >
            {[1,2,3,4,5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
