// File: app/dashboard/layout.tsx

"use client"; // This is still a client component because Sidebar might be interactive

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";


// No longer needs to accept a `session` prop
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}