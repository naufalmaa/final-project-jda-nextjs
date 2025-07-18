'use client';

type School = {
  id: number;
  name: string;
  address: string;
  type: string;
  accreditation: string;
};

type Props = {
  data: School[];
  onEdit: (school: School) => void;
  onDelete: (id: number) => void;
};

export default function SchoolTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="px-4 py-3">Nama Sekolah</th>
            <th className="px-4 py-3">Alamat</th>
            <th className="px-4 py-3">Tipe</th>
            <th className="px-4 py-3">Akreditasi</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800">
          {data.map((school) => (
            <tr key={school.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{school.name}</td>
              <td className="px-4 py-2">{school.address}</td>
              <td className="px-4 py-2">{school.type}</td>
              <td className="px-4 py-2">{school.accreditation}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onEdit(school)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(school.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
