// File: app/(auth)/sign-up/page.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image"; // Import Image component for optimized images
import Link from "next/link"; // Import Link for navigation

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
    <div className="min-h-screen flex">
      {/* Left Section: Logo and Hero Image (Consistent with Sign-In) */}
      <div className="hidden lg:flex flex-col justify-between items-center w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 text-white">
        <div className="text-center">
          {/* Replace with your actual logo */}
          <Image
            src="/logo_only_white.png" // Assuming your logo is in public/logo.svg
            alt="ArahSekolah Logo"
            width={150}
            height={150}
            className="mb-6 mx-auto"
            priority
          />
          <h1 className="text-4xl font-bold mb-4">Join ArahSekolah</h1>
          <p className="text-lg opacity-80">
            Create your account to unlock full features and find the best schools.
          </p>
        </div>
        {/* Hero Image - Replace with your own image */}
        <div className="w-full max-w-md mt-8">
          <Image
            src="/window.svg" // Example hero image, replace with your own
            alt="Hero Illustration"
            width={500}
            height={500}
            className="rounded-lg shadow-xl"
            priority
          />
        </div>
        <p className="text-sm opacity-70 mt-8">
          &copy; {new Date().getFullYear()} ArahSekolah. All rights reserved.
        </p>
      </div>

      {/* Right Section: Sign Up Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 lg:p-8">
        <Card className="w-full max-w-md p-6 border-primary shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4">
              {/* Logo for smaller screens */}
              <Image
                src="/next.svg" // Assuming your logo is in public/logo.svg
                alt="Your Company Logo"
                width={100}
                height={100}
                className="mx-auto"
                priority
              />
            </div>
            <CardTitle className="text-primary text-3xl font-bold mb-2">Sign Up</CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <Input
                {...register("name")}
                placeholder="Full Name"
                required
                disabled={loading}
                className="border-primary focus:ring-primary focus:border-primary px-4 py-2 rounded-md"
              />
              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                required
                disabled={loading}
                className="border-primary focus:ring-primary focus:border-primary px-4 py-2 rounded-md"
              />
              <Input
                {...register("password")}
                type="password"
                placeholder="Password (min. 8 chars)"
                required
                disabled={loading}
                className="border-primary focus:ring-primary focus:border-primary px-4 py-2 rounded-md"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md transition-colors duration-200"
              >
                {loading ? "Creating…" : "Create Account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}