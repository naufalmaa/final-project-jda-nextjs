"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SchoolMap({ schools }) {
  const centerPosition: [number, number] = [-6.9149, 107.6098]; // Bandung coords
  return (
    <MapContainer center={centerPosition} zoom={12} style={{ height: "60vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {schools.map(school => (
        <Marker key={school.id} position={[school.latitude, school.longitude]}>
          <Popup>
            <b>{school.name}</b><br/>
            Rating: {school.avgRating?.toFixed(1) ?? "N/A"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
