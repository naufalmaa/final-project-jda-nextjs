// File: components/dashboard/SchoolDetail.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { School } from "@/lib/types"; // Assuming you have a School type defined in lib/types.ts
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"; // Assuming you have a Separator component (or use a div with border-b)
import EditSchoolForm from "./EditSchoolForm";
import SchoolMap from "@/components/dashboard/SchoolMap";
import { useSession } from "next-auth/react"; // To check user role

interface SchoolDetailProps {
  schoolId: string;
}

const fetchSchoolById = async (schoolId: string): Promise<School> => {
  const res = await fetch(`/api/schools/${schoolId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch school details");
  }
  return res.json();
};

export default function SchoolDetail({ schoolId }: SchoolDetailProps) {
//   const { data: session } = useSession();
//   const isAdmin = session?.user?.role === "ADMIN";

  const {
    data: school,
    isLoading,
    isError,
    error,
  } = useQuery<School, Error>({
    queryKey: ["school", schoolId],
    queryFn: () => fetchSchoolById(schoolId),
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading school details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold">Error: {error?.message || "Could not load school details."}</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No school data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-gray-900">{school.name}</h2>
        <div className="gap-4 flex items-center">
        {
        // isAdmin && 
        (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-primary hover:bg-primary/10">
                Edit School Info
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit School Details</DialogTitle>
                <DialogDescription>
                  Make changes to the school's information here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <EditSchoolForm school={school} onClose={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )
        }
        <Button className="text-primary-white bg-primary hover:bg-primary-dark" onClick={() => alert("Enroll functionality not implemented yet")}>
                <div className="text-white">Enroll Now</div>
        </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="General Information">
          <DetailItem label="Status" value={school.status} />
          <DetailItem label="NPSN" value={school.npsn} />
          <DetailItem label="Bentuk" value={school.bentuk} />
          <DetailItem label="Telephone" value={school.telp || "N/A"} />
          <DetailItem label="Website" value={school.website ? <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{school.website}</a> : "N/A"} />
          <DetailItem label="Contact Person" value={school.contact || "N/A"} />
        </InfoCard>

        {/* Location Details and Map */}
        <InfoCard title="Location Details" className="md:col-span-1 lg:col-span-2"> {/* Span 2 columns on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <DetailItem label="Address" value={school.alamat} />
              <DetailItem label="Sub-District" value={school.kelurahan} />
              <DetailItem label="District" value={school.kecamatan} />
              <DetailItem label="Latitude" value={school.lat?.toFixed(6) || "N/A"} />
              <DetailItem label="Longitude" value={school.lng?.toFixed(6) || "N/A"} />
            </div>
            {/* School Map Integration */}
            {school.lat && school.lng && (
              <div className="w-full h-64 md:h-full min-h-[200px] rounded-lg overflow-hidden shadow-md border border-gray-200">
                <SchoolMap lat={school.lat} lng={school.lng} schoolName={school.name} />
              </div>
            )}
            {(!school.lat || !school.lng) && (
              <div className="w-full h-64 md:h-full min-h-[200px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-500">
                Map coordinates not available.
              </div>
            )}
          </div>
        </InfoCard>

        <InfoCard title="About the School">
          <DetailItem label="Description" value={school.description || "No description provided."} />
        </InfoCard>

        <InfoCard title="Programs Offered" className="lg:col-span-2">
          <DetailItem label="Programs" value={school.programs || "No programs listed."} />
        </InfoCard>

        <InfoCard title="Achievements" className="lg:col-span-3">
          <DetailItem label="Achievements" value={school.achievements || "No achievements listed."} />
        </InfoCard>
      </div>
    </div>
  );
}

// Helper component for displaying individual detail items
const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col py-2 border-b last:border-b-0 border-gray-100">
    <span className="text-sm font-medium text-gray-500">{label}:</span>
    <span className="text-base text-gray-800 break-words">{value}</span>
  </div>
);

// Helper component for consistent card styling
const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <Card className={`shadow-sm border-gray-200 ${className}`}>
    <CardHeader className="pb-3">
      <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
      <Separator className="mt-2 bg-primary/20" /> {/* Visual separator */}
    </CardHeader>
    <CardContent className="pt-3">
      {children}
    </CardContent>
  </Card>
);