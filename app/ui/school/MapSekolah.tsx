// File: app/ui/school/MapSekolah.tsx

'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix marker icon issue in leaflet (default broken without this)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default function MapSekolah({ schools }: { schools: any[] }) {
  // Default to tengah Kota Bandung
  const center: [number, number] = [-6.914744, 107.60981];

  const validSchools = schools.filter(s => s.lat && s.lng);

  return (
    <MapContainer center={center} zoom={12} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {validSchools.map(school => (
        <Marker key={school.id} position={[school.lat, school.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>{school.name}</strong><br />
              {school.alamat}<br />
              <a href={`/dashboard/school/${school.id}`} className="text-blue-600 underline">Lihat Detail</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
