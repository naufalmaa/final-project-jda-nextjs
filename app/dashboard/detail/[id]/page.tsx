// File: app/dashboard/detail/[id]/page.tsx

import React from "react";
import SchoolDetail from "@/components/dashboard/SchoolDetail";
import ReviewList from "@/components/dashboard/ReviewList";
// REMOVE: import AddReviewForm from "@/components/dashboard/AddReviewForm"; // Remove this import
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
  const session = await getServerSession(authOptions); // Fetch session for conditional rendering

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button (Optional) */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>

        {/* School Details Section */}
        <SchoolDetail schoolId={schoolId} />

        {/* Parent Reviews Section (now includes the Add Review Form toggle) */}
        <Card className="shadow-lg rounded-lg overflow-hidden bg-white">
          <CardHeader className="pb-4 border-b border-gray-200">
            <CardTitle className="text-3xl font-extrabold text-secondary-dark">Parent Reviews</CardTitle>
            <CardDescription className="text-gray-700 mt-2">What parents are saying about this school.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* The ReviewList component now handles both displaying reviews and the Add Review form */}
            {/* We no longer pass userId and userRole directly to ReviewList because it fetches session internally */}
            <ReviewList schoolId={schoolId} />

            {/* REMOVED: Old Add Review Form Section */}
            {/*
            {session?.user && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Add Your Review</h3>
                <AddReviewForm schoolId={schoolId} />
              </div>
            )}
            */}
            {!session?.user && (
              <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-600">
                <p className="mb-4">
                  <Link href="/auth/signin" className="text-primary hover:underline font-medium">Sign in</Link> or {" "}
                  <Link href="/auth/signup" className="text-primary hover:underline font-medium">Sign up</Link> to add your review!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}