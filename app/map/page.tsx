// app/map/page.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";
import {prisma} from "@/lib/prisma";

const SchoolMap = dynamic(() => import("@/components/SchoolMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default async function MapPage() {
  const schools = await prisma.school.findMany({
    include: { _count: { select: { reviews: true } } }
  });
  // Compute average ratings if needed
  const schoolsWithRating = schools.map(s => ({
    ...s,
    avgRating: s.reviews.length ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / s.reviews.length : 0
  }));
  return (
    <div className="map-page">
      <Suspense fallback={<p>Loading map...</p>}>
        <SchoolMap schools={schoolsWithRating} />
      </Suspense>
    </div>
  );
}
