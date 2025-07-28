// file: app/(auth)/sign-up/page.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = { name: string; email: string; password: string };

export default function SignUpPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    const body = await res.json();

    if (!res.ok) {
      // show error from API
      setError(body.error || "Signup failed.");
      return;
    }

    // success → redirect to sign-in
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px] p-6 border-primary">
        <CardHeader>
          <CardTitle className="text-primary">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Input
              {...register("name")}
              placeholder="Full Name"
              required
              disabled={loading}
              className="border-primary focus:ring-primary"
            />
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              required
              disabled={loading}
              className="border-primary focus:ring-primary"
            />
            <Input
              {...register("password")}
              type="password"
              placeholder="Password (min. 8 chars)"
              required
              disabled={loading}
              className="border-primary focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {loading ? "Creating…" : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
