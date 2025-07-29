// app/dashboard/map/ClientOnlyMap.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the real MapClient on the client only
export default dynamic(() => import("./MapClient"), { ssr: false });
