// app/dashboard/map/page.tsx
import ClientOnlyMap from "./ClientOnlyMap";
// "use client";
// import MapClient from "./MapClient";

export default function MapPage() {
  return (
    <div className="h-screen">
      <ClientOnlyMap />
    </div>
  );
}
