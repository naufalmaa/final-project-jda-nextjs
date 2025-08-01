// File: app/layout.tsx
// (Your main root layout file for the entire application)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global CSS imports
import { Toaster } from "@/components/ui/sonner"; // Assuming you use Sonner for toasts
import { getServerSession } from "next-auth"; // Import getServerSession for server-side session fetching
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your authOptions
import { ReduxProvider } from "@/redux/provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arah Sekolah",
  description: "Find your next school",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on the server in the root layout for all client components below
  // const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap your entire application with AppProviders */}
        <ReduxProvider>
          {children}
          <Toaster /> {/* Your toaster component */}
        </ReduxProvider>
      </body>
    </html>
  );
}