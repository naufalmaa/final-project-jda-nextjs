// app/dashboard/map/MapClient.tsx
"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// —— fix missing marker icons —— //
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl    from "leaflet/dist/images/marker-icon.png";
import shadowUrl  from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:  iconRetina.src,
  iconUrl:        iconUrl.src,
  shadowUrl:      shadowUrl.src,
});

type School = { id: string; name: string; lat: number; lng: number; };

export default function MapClient() {
  const [schools, setSchools] = useState<School[]>([]);
  const [viewList, setViewList] = useState(false);

  useEffect(() => {
    fetch("/api/schools").then((r) => r.json()).then(setSchools);
  }, []);

  if (viewList) {
    return (
      <div className="p-4">
        <button onClick={() => setViewList(false)}>← Back</button>
        {/* …table… */}
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <button
        onClick={() => setViewList(true)}
        className="absolute top-4 left-4 z-10 bg-white p-2"
      >
        List View
      </button>
      <MapContainer
        center={[-6.914744, 107.60981]}
        zoom={13}
        className="h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {schools.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]}>
            <Popup>
              <strong>{s.name}</strong>
              <br />
              <a href={`/dashboard/detail/${s.id}`}>View Details</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
