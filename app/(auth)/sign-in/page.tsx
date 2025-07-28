// File: app/(auth)/sign-in/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = { email: string; password: string };

export default function SignInPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: "/dashboard/map",
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    // success
    router.push(res?.url!);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px] p-6 border-primary">
        <CardHeader>
          <CardTitle className="text-primary">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
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
              placeholder="Password"
              required
              disabled={loading}
              className="border-primary focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {loading ? "Signing In…" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard/map" })
              }
              disabled={loading}
              className="w-full"
            >
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
