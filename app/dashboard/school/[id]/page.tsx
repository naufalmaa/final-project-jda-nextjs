import UnderConstruction from '@/app/ui/under-construction';

export default function SchoolDetail({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Detail Sekolah ID: {params.id}</h1>
      <p>Informasi lengkap tentang sekolah dengan ID tersebut akan muncul di sini.</p>
    <UnderConstruction />

    </div>
  );
}