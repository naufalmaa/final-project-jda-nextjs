// components/dashboard/DetailClient.tsx
"use client";

import { useSchool, useReviews, useAddReview } from "@/lib/queries";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

export default function DetailClient({ schoolId }: { schoolId: string }) {
  const { data: school, isLoading: sLoading } = useSchool(schoolId);
  const { data: reviews, isLoading: rLoading } = useReviews(schoolId);
  const addReview = useAddReview();
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (vals: FormData) => {
    addReview.mutate({ ...vals, schoolId: Number(schoolId) });
    reset();
  };

  if (sLoading) return <p>Loading school…</p>;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{school?.name}</h1>
      <p className="mt-2">{school?.description}</p>

      <section className="mt-8">
        <h2 className="text-2xl">Reviews</h2>
        {rLoading ? (
          <p>Loading reviews…</p>
        ) : reviews?.length ? (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="p-4 border rounded">
                <div className="flex justify-between">
                  <strong>{r.name}</strong>
                  <span>{new Date(r.tanggal).toLocaleDateString()}</span>
                </div>
                <p className="mt-1">{r.komentar}</p>
                <div className="mt-2 text-sm space-x-3">
                  <span>Kenyamanan: {r.kenyamanan}</span>
                  <span>Pembelajaran: {r.pembelajaran}</span>
                  <span>Fasilitas: {r.fasilitas}</span>
                  <span>Kepemimpinan: {r.kepemimpinan}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl">Add Review</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Your Name" required />
          <Input {...register("role")} placeholder="Your Role" required />
          <Input {...register("biaya")} placeholder="Biaya" required />
          <Textarea {...register("komentar")} placeholder="Komentar" required />

          {/* Ratings */}
          {(
            ["kenyamanan", "pembelajaran", "fasilitas", "kepemimpinan"] as const
          ).map((key) => (
            <div key={key}>
              <label className="block mb-1 capitalize">{key}</label>
              <select {...register(key)} className="w-full p-2 border rounded">
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <Button type="submit" disabled={addReview.isLoading}>
            {addReview.isLoading ? "Posting…" : "Post Review"}
          </Button>
        </form>
      </section>
    </div>
  );
}
