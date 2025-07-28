// app/dashboard/layout.tsx
// "use client";

import { ReactNode, useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import { QueryProvider } from "./QueryProvider";
import "@/app/globals.css"; // Ensure global styles are applied


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
