// File: components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReduxProvider } from "@/redux/provider";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    
    <SessionProvider session={session}>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}