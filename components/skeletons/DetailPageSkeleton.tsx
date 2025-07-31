// File: components/skeleton/DetailPageSkeleton.tsx

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DetailPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section Skeleton */}
        <Card className="shadow-lg rounded-xl overflow-hidden bg-white border-0">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* General Information Card */}
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-2 py-3 border-b last:border-b-0 border-gray-100">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Location Details Card - spans 2 columns */}
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white md:col-span-1 lg:col-span-2">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2 py-3 border-b last:border-b-0 border-gray-100">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
                <div className="w-full h-64 lg:h-full min-h-[200px] rounded-xl overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About the School Card */}
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Programs Offered Card - spans 2 columns */}
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white lg:col-span-2">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements Card - spans 3 columns */}
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden bg-white lg:col-span-3">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section Skeleton */}
        <Card className="shadow-lg rounded-xl overflow-hidden bg-white border-0">
          <CardHeader className="pb-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Reviews Header Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-7 w-24" />
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-36" />
              </div>

              {/* Individual Review Skeletons */}
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="shadow-md border-0 rounded-xl overflow-hidden bg-white">
                    <CardHeader className="pb-4 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-1 w-1 rounded-full" />
                                <div className="flex items-center space-x-1">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-8" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Cost Information Skeleton */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      
                      {/* Comment Skeleton */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      
                      {/* Ratings Skeleton */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="flex items-center justify-between py-2">
                              <Skeleton className="h-4 w-24" />
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, k) => (
                                  <Skeleton key={k} className="h-4 w-4" />
                                ))}
                                <Skeleton className="h-4 w-8 ml-2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;