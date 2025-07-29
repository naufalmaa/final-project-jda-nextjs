// components/dashboard/EditSchoolForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

type School = {
  id: number;
  name: string;
  status: string;
  npsn: string;
  bentuk: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  telp: string;
  website?: string;
  contact?: string;
  description?: string;
  programs?: string;
  achievements?: string;
};

export default function EditSchoolForm({
  initialData,
  onCancel,
  onSaved,
}: {
  initialData: School;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm<School>({
    defaultValues: initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router: any = useRouter();

  const onSubmit = async (data: School) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${initialData.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update school");

      onSaved();
      // Optionally refresh the page so server cache is busted:
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register("name")} label="Name" required />
        <Input {...register("status")} label="Status" required />
        <Input {...register("npsn")} label="NPSN" required />
        <Input {...register("bentuk")} label="Bentuk" required />
        <Input {...register("alamat")} label="Alamat" />
        <Input {...register("kelurahan")} label="Kelurahan" />
        <Input {...register("kecamatan")} label="Kecamatan" />
        <Input {...register("telp")} label="Telp" />
        <Input {...register("website")} label="Website" />
        <Input {...register("contact")} label="Contact" />
      </div>

      <Textarea {...register("description")} label="Description" />
      <Textarea {...register("programs")} label="Programs" />
      <Textarea {...register("achievements")} label="Achievements" />

      {error && <p className="text-red-600">{error}</p>}

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
