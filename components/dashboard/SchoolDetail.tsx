// File: components/dashboard/SchoolDetail.tsx

"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { School } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import EditSchoolForm from "./EditSchoolForm";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import DetailPageSkeleton from "@/components/skeletons/DetailPageSkeleton";


const DynamicSchoolMap = dynamic(() => import('@/components/dashboard/SchoolMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-500">Loading map...</div>,
});

interface SchoolDetailProps {
  schoolId: number;
}

const fetchSchoolById = async (schoolId: number): Promise<School> => {
  const res = await fetch(`/api/schools/${schoolId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch school details");
  }
  return res.json();
};

export default function SchoolDetail({ schoolId }: SchoolDetailProps) {
  const { data: session } = useSession();
  const isAdminOrSuperadmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

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
    <DetailPageSkeleton />
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-700 font-semibold">Error: {error?.message || "Could not load school details."}</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-gray-600">No school data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Title and Action Buttons */}
      <Card className="shadow-lg rounded-xl overflow-hidden bg-white border-0 mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {school.name}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-blue-700 bg-blue-100 font-medium">
                  {school.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-green-700 bg-green-100 font-medium">
                  {school.bentuk}
                </span>
                <span className="text-gray-600">NPSN: {school.npsn}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isAdminOrSuperadmin && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors">
                      Edit School Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-bold">Edit School Details</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Make changes to the school's information here. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                      <EditSchoolForm 
                        schoolData={school} 
                        onFormSubmitted={() => setIsEditDialogOpen(false)} 
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Enroll Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="General Information">
          <DetailItem label="Status" value={school.status} />
          <DetailItem label="NPSN" value={school.npsn} />
          <DetailItem label="Bentuk" value={school.bentuk} />
          <DetailItem label="Telephone" value={school.telp || "N/A"} />
          <DetailItem 
            label="Website" 
            value={school.website ? (
              <a 
                href={school.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {school.website}
              </a>
            ) : "N/A"} 
          />
          <DetailItem label="Contact Person" value={school.contact || "N/A"} />
        </InfoCard>

        <InfoCard title="Location Details" className="md:col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem label="Address" value={school.alamat} />
              <DetailItem label="Sub-District" value={school.kelurahan} />
              <DetailItem label="District" value={school.kecamatan} />
              {school.lat && school.lng && (
                <>
                  <DetailItem label="Latitude" value={school.lat.toFixed(6)} />
                  <DetailItem label="Longitude" value={school.lng.toFixed(6)} />
                </>
              )}
            </div>
            
            <div className="w-full h-64 lg:h-full min-h-[200px] rounded-xl overflow-hidden shadow-md border border-gray-200">
              {school.lat && school.lng && !isEditDialogOpen ? ( // Conditional rendering for the map
                <DynamicSchoolMap 
                  lat={school.lat} 
                  lng={school.lng} 
                  schoolName={school.name} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  {isEditDialogOpen ? "Map hidden while editing" : "Map coordinates not available"}
                </div>
              )}
            </div>
          </div>
        </InfoCard>

        <InfoCard title="About the School">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {school.description || "No description provided."}
            </p>
          </div>
        </InfoCard>

        <InfoCard title="Programs Offered" className="lg:col-span-2">
          <DetailItem label="Programs" value={
            school.programs && school.programs.split('\n').length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-gray-700 mt-2">
                {school.programs.split('\n').map((program, index) => (
                  <li key={index}>{program}</li>
                ))}
              </ul>
            ) : (
              "No programs listed."
            )
          } />
        </InfoCard>

      <InfoCard title="Achievements" className="lg:col-span-3">
        <DetailItem label="Achievements" value={
          school.achievements && school.achievements.split('\n').length > 0 ? (
            <ul className="space-y-2 list-disc list-inside text-gray-700 mt-2">
              {school.achievements.split('\n').map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          ) : (
            "No achievements listed."
          )
        } />
      </InfoCard>
      </div>
    </div>
  );
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col space-y-1 py-3 border-b last:border-b-0 border-gray-100">
    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-base text-gray-800 break-words leading-relaxed">{value}</span>
  </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ 
  title, 
  children, 
  className = "" 
}) => (
  <Card className={`shadow-lg border-0 rounded-xl overflow-hidden bg-white ${className}`}>
    <CardHeader className="pb-4 border-b border-gray-100">
      <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      {children}
    </CardContent>
  </Card>
);