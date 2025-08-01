// File: app/dashboard/users/page.tsx
// CORRECTED: New page for user management

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserManagementClient from "@/components/dashboard/UserManagementClient";
import { useAppDispatch } from "@/redux/store";
import { fetchUsersAsync } from "@/redux/userSlice";
import { useSchools } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Fetch schools for the "assign school" dropdown in the forms
  const { data: schools, isLoading: schoolsLoading, error: schoolsError } = useSchools();

  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session to be loaded
    }

    if (status === "unauthenticated" || session?.user?.role !== 'SUPERADMIN') {
      router.replace("/dashboard/map"); // Redirect if not authorized
      return;
    }
    
    // Fetch user data if authorized
    if (session?.user?.role === 'SUPERADMIN') {
        dispatch(fetchUsersAsync());
    }

  }, [session, status, router, dispatch]);

  // Loading state for the page
  if (status === "loading" || schoolsLoading) {
    return (
        <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }
  
  if (schoolsError) {
      return <div className="p-8 text-red-500 font-medium">Error: Could not load school data. User management is unavailable.</div>
  }

  // Render the page only if authorized
  if (session?.user?.role === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
              <UserManagementClient schools={schools || []} />
          </div>
      </div>
    );
  }

  // Fallback, although the useEffect should handle redirection
  return null; 
}