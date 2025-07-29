// components/dashboard/AddReviewForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddReview } from "@/lib/queries";

type FormData = {
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
};

export default function AddReviewForm({ schoolId }: { schoolId: string }) {
  const addReview = useAddReview();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (vals: FormData) => {
    addReview.mutate({ ...vals, schoolId: Number(schoolId) });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input {...register("name")} placeholder="Your Name" required />
      <Input {...register("role")} placeholder="Your Role" required />
      <Input {...register("biaya")} placeholder="Biaya (e.g. Rp 10jt)" required />
      <Textarea {...register("komentar")} placeholder="Komentar" required />

      {(["kenyamanan", "pembelajaran", "fasilitas", "kepemimpinan"] as const).map(
        (key) => (
          <div key={key}>
            <label className="block mb-1 capitalize">{key}</label>
            <select
              {...register(key)}
              className="w-full p-2 border rounded"
              defaultValue={5}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )
      )}

      <Button type="submit" disabled={addReview.isLoading}>
        {addReview.isLoading ? "Posting…" : "Post Review"}
      </Button>
      {addReview.isError && (
        <p className="text-sm text-red-600">Failed to post—please try again.</p>
      )}
    </form>
  );
}
