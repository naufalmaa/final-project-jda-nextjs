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
import { Eye, EyeOff } from "lucide-react";

type FormData = { name: string; email: string; password: string };

export default function SignUpPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      {/* Left Section: Logo and Hero Image (Consistent with Sign-In) */}
      <div className="hidden lg:flex flex-col justify-between items-center w-1/2 bg-slate-800 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8">
            <Image
              src="/logo_only_white.png"
              alt="ArahSekolah Logo"
              width={120}
              height={120}
              className="mx-auto rounded-2xl shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Join ArahSekolah</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Create your account to unlock full features and discover the perfect elementary school for your child.
          </p>
        </div>
        
        <div className="w-full max-w-md mt-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <Image
              src="/hero_image_2.jpg"
              alt="Education Illustration"
              width={800}
              height={800}
              className="mx-auto opacity-80"
              priority
            />
          </div>
        </div>
        
        <p className="text-sm opacity-70 mt-8 relative z-10">
          &copy; {new Date().getFullYear()} ArahSekolah. All rights reserved.
        </p>
      </div>

      {/* Right Section: Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center p-8 pb-6">
              <div className="lg:hidden mb-6">
                <Image
                  src="/next.svg"
                  alt="ArahSekolah Logo"
                  width={80}
                  height={80}
                  className="mx-auto rounded-xl"
                  priority
                />
              </div>
              <CardTitle className="text-slate-900 text-3xl font-bold mb-3">Create Account</CardTitle>
              <CardDescription className="text-slate-600 text-base">
                Join thousands of parents finding the best schools in Bandung.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}
                
                <div className="space-y-4 flex flex-col gap-3">
                  <div>
                    <Input
                      {...register("name")}
                      placeholder="Full Name"
                      required
                      disabled={loading}
                      className="h-12 px-4 rounded-2xl border-slate-200 focus:border-slate-400 focus:ring-slate-300 text-base bg-white/50"
                    />
                  </div>
                  
                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email address"
                      required
                      disabled={loading}
                      className="h-12 px-4 rounded-2xl border-slate-200 focus:border-slate-400 focus:ring-slate-300 text-base bg-white/50"
                    />
                  </div>
                  
                  <div className="relative">
                    <Input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min. 8 characters)"
                      required
                      disabled={loading}
                      className="h-12 px-4 pr-12 rounded-2xl border-slate-200 focus:border-slate-400 focus:ring-slate-300 text-base bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                                  
                <div className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-4">
                  <p className="mb-2 font-medium text-slate-600">Your password should contain:</p>
                  <ul className="space-y-1">
                    <li>• At least 8 characters</li>
                    <li>• Mix of letters and numbers recommended</li>
                  </ul>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                </div>

              </form>
              
              <div className="mt-8 text-center">
                <p className="text-slate-600 text-base">
                  Already have an account?{" "}
                  <Link 
                    href="/auth/sign-in" 
                    className="text-slate-800 hover:text-slate-900 font-semibold hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-center text-sm text-slate-500">
            <div className="flex items-center space-x-4">
            <p className="text-xs text-slate-400">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}