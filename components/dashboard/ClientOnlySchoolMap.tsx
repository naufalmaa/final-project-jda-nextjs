// components/dashboard/ClientOnlySchoolMap.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import your actual map, and disable SSR entirely
export default dynamic(
  () => import("./SchoolMap"),
  { ssr: false }
);
