// File: app/dashboard/detail/[id]/page.tsx

import React from "react";
import SchoolDetail from "@/components/dashboard/SchoolDetail";
import ReviewList from "@/components/dashboard/ReviewList";
import AddReviewForm from "@/components/dashboard/AddReviewForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Assuming you might want a back button or similar
import Link from "next/link"; // For navigation, e.g., a back button
import { getServerSession } from "next-auth/next"; // To conditionally render AddReviewForm
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params; // No need to await params here, it's already available
  const session = await getServerSession(authOptions); // Fetch session for conditional rendering

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button (Optional) */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/list">← Back to Schools</Link>
          </Button>
        </div>

        {/* School Details Section */}
        <Card className="shadow-lg border-t-4 border-primary rounded-lg overflow-hidden">
          <CardHeader className="bg-primary/5 p-6 border-b border-gray-200">
            <CardTitle className="text-3xl font-extrabold text-primary-dark">School Information</CardTitle>
            <CardDescription className="text-gray-700 mt-2">Detailed view of the elementary school.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* The SchoolDetail component will fetch and display school-specific data */}
            <SchoolDetail schoolId={id} />
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="shadow-lg border-t-4 border-accent rounded-lg overflow-hidden">
          <CardHeader className="bg-accent/5 p-6 border-b border-gray-200">
            <CardTitle className="text-3xl font-extrabold text-secondary-dark">Parent Reviews</CardTitle>
            <CardDescription className="text-gray-700 mt-2">What parents are saying about this school.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">All Reviews</h3>
            {/* The ReviewList component will fetch and display reviews */}
            <ReviewList schoolId={id} />

            {/* Add Review Form - only shown if user is signed in */}
            {session?.user && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Add Your Review</h3>
                <AddReviewForm schoolId={id} />
              </div>
            )}
            {!session?.user && (
              <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-600">
                <p className="mb-4">
                  <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">Sign in</Link> or {" "}
                  <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">Sign up</Link> to leave a review.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}