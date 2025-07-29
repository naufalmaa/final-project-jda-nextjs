// components/dashboard/SchoolDetail.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/lib/queries";
import EditSchoolForm from "./EditSchoolForm";
import ClientOnlySchoolMap from "./ClientOnlySchoolMap";

export default function SchoolDetail({ schoolId }: { schoolId: string }) {
  const { data: school, isLoading } = useSchool(schoolId);
  const [editing, setEditing] = useState(false);
//   const { data: session } = useSession();

  if (isLoading) return <p>Loading school…</p>;
  if (!school) return <p>School not found.</p>;

 // pull out lat/lng, adjust to whatever your model calls them
 const { lat, lng } = school;

  // only superadmins or the school’s own admin may edit
//   const canEdit =
//     session?.user.role === "SUPERADMIN" ||
//     (session?.user.role === "SCHOOL_ADMIN" &&
//       session.user.assignedSchoolId === school.id);

  if (editing) {
    return (
      <EditSchoolForm
        initialData={school}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
            {/* Map goes right at the top */}
     <ClientOnlySchoolMap lat={lat} lng={lng} name={school.name} />
      <h1 className="text-3xl font-bold">{school.name}</h1>
      <p>
        <strong>Status:</strong> {school.status} · <strong>NPSN:</strong>{" "}
        {school.npsn} · <strong>Bentuk:</strong> {school.bentuk}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Alamat:</strong> {school.alamat}
          </p>
          <p>
            <strong>Kelurahan:</strong> {school.kelurahan}
          </p>
          <p>
            <strong>Kecamatan:</strong> {school.kecamatan}
          </p>
          <p>
            <strong>Telp:</strong> {school.telp}
          </p>
          {school.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {school.website}
              </a>
            </p>
          )}
        </div>
        <div>
          {school.description && (
            <>
              <h2 className="font-semibold">Description</h2>
              <p className="mb-2">{school.description}</p>
            </>
          )}
          {school.programs && (
            <>
              <h2 className="font-semibold">Programs</h2>
              <p className="mb-2">{school.programs}</p>
            </>
          )}
          {school.achievements && (
            <>
              <h2 className="font-semibold">Achievements</h2>
              <p>{school.achievements}</p>
            </>
          )}
        </div>
      </div>

      {
    //   canEdit && 
      (
        <Button variant="outline" onClick={() => setEditing(true)}>
          Edit School
        </Button>
      )
      }
    </div>
  );
}
