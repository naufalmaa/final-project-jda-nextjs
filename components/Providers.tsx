// File: components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReduxProvider } from "@/redux/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}