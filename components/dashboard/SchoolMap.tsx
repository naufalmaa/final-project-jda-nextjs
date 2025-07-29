// components/dashboard/SchoolMap.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Pull in the default marker icon URLs so they don’t 404
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl    from "leaflet/dist/images/marker-icon.png";
import shadowUrl  from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina.src,
  iconUrl:       iconUrl.src,
  shadowUrl:     shadowUrl.src,
});

interface SchoolMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function SchoolMap({ lat, lng, name }: SchoolMapProps) {
  // Leaflet needs a container size, so we force a re-render after mount
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  return (
    <div className="h-64 w-full rounded border overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
