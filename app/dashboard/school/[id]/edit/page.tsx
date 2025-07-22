// // File: app/dashboard/school/[id]/edit/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// export default function EditSchoolPage() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<any>(null);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch(`/api/schools`);
//       const data = await res.json();
//       const school = data.find((s: any) => s.id.toString() === id);
//       setForm(school);
//     }
//     if (id) fetchData();
//   }, [id]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     const res = await fetch(`/api/schools/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       alert('Berhasil memperbarui sekolah');
//       router.push('/dashboard/school');
//     } else {
//       alert('Gagal memperbarui sekolah');
//     }
//     setLoading(false);
//   }

//   if (!form) return <div className="p-6">Memuat data sekolah...</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Edit Sekolah</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {Object.entries(form).map(([key, value]) => (
//           <div key={key}>
//             <label className="block mb-1 font-medium capitalize">{key}</label>
//             <input
//               type="text"
//               name={key}
//               value={value ?? ''}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//         ))}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
//         </button>
//       </form>
//     </div>
//   );
// }
