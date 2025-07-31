// File: app/dashboard/detail/[id]/page.tsx

import React from "react";
import SchoolDetail from "@/components/dashboard/SchoolDetail";
import ReviewList from "@/components/dashboard/ReviewList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const schoolId = parseInt(params.id, 10);
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild className="hover:bg-gray-100 transition-colors">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>

        {/* School Details Section */}
        <SchoolDetail schoolId={schoolId} />

        {/* Reviews Section */}
        <Card className="shadow-lg rounded-xl overflow-hidden bg-white border-0 mt-6">
          <CardHeader className="pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Reviews
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg mt-2">
                  What people are saying about this school?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <ReviewList schoolId={schoolId} />

            {/* Sign in prompt for non-authenticated users */}
            {!session?.user && (
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Share Your Experience
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Help other parents and students by sharing your review of this school.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Link href="/auth/signup">Create Account</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}