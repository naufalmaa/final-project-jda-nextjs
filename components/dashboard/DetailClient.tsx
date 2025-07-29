// components/dashboard/DetailClient.tsx
'use client';

import { useState } from 'react'
import { useSchool, useReviews, useAddReview } from '@/lib/queries';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import EditSchoolForm from './EditSchoolForm'   // ← new component

type FormData = {
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
};

export default function DetailClient({ schoolId }: { schoolId: string }) {
  const { data: school, isLoading: sLoading } = useSchool(schoolId);
  const { data: reviews, isLoading: rLoading } = useReviews(schoolId);
  // const { data: session } = useSession();
  const addReview = useAddReview();

  const { register, handleSubmit, reset } = useForm<FormData>();

  const [editing, setEditing] = useState(false)

  if (sLoading) return <p>Loading school…</p>;
  if (!school) return <p>School not found.</p>;

  const onSubmit = (vals: FormData) => {
    addReview.mutate({ ...vals, schoolId: Number(schoolId) });
    reset();
  };

  return (
    <div className="p-6 space-y-8">
      {/* School Info */}
      <header className="border-b pb-4">
        <h1 className="text-4xl font-bold">{school.name}</h1>
        <div className="mt-2 space-y-1 text-gray-600 text-sm">
          <p><strong>Status</strong>: {school.status}</p>
          <p><strong>NPSN</strong>: {school.npsn}</p>
          <p><strong>Bentuk</strong>: {school.bentuk}</p>
        </div>
      </header>

      {/* Action Buttons
      <div className="flex space-x-2 pt-4">
        {session?.user.role === 'USER' && (
          <Link href={`/dashboard/enroll/${schoolId}`}>
            <Button>Enroll</Button>
          </Link>
        )}
        {(session?.user.role === 'SUPERADMIN') ||
         (session?.user.role === 'SCHOOL_ADMIN' &&
            session.user.assignedSchoolId === Number(schoolId)) ? (
          <Link href={`/dashboard/schools/edit/${schoolId}`}>
            <Button>Edit School</Button>
          </Link>
        ) : null}
      </div> */}

            {/* Action Buttons */}
      <div className="flex space-x-2 pt-4">
            <Button>Enroll</Button>

          <Link href={`/dashboard/schools/edit/${schoolId}`}>
            <Button>Edit School</Button>
          </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p><strong>Alamat:</strong> {school.alamat}</p>
          <p><strong>Kelurahan:</strong> {school.kelurahan}</p>
          <p><strong>Kecamatan:</strong> {school.kecamatan}</p>
          <p><strong>Telp:</strong> {school.telp}</p>
          {school.website && (
            <p>
              <strong>Website:</strong>{' '}
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {school.website}
              </a>
            </p>
          )}
          {school.contact && <p><strong>Contact:</strong> {school.contact}</p>}
        </div>
        <div className="space-y-4">
          {school.description && (
            <>
              <h2 className="text-2xl font-semibold">Description</h2>
              <p>{school.description}</p>
            </>
          )}
          {school.programs && (
            <>
              <h2 className="text-2xl font-semibold">Programs</h2>
              <p>{school.programs}</p>
            </>
          )}
          {school.achievements && (
            <>
              <h2 className="text-2xl font-semibold">Achievements</h2>
              <p>{school.achievements}</p>
            </>
          )}
        </div>
      </section>

      {/* Optional Map Thumbnail */}
      {school.lat != null && school.lng != null && (
        <div className="h-64 rounded overflow-hidden">
          <iframe
            className="w-full h-full"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${school.lng! -
              0.01}%2C${school.lat! -
              0.005}%2C${school.lng! +
              0.01}%2C${school.lat! +
              0.005}&layer=mapnik&marker=${school.lat}%2C${school.lng}`}
          ></iframe>
          <p className="text-xs text-gray-500 mt-1">
            <a
              href={`https://www.openstreetmap.org/?mlat=${school.lat}&mlon=${school.lng}#map=15/${school.lat}/${school.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View larger map
            </a>
          </p>
        </div>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {rLoading ? (
          <p>Loading reviews…</p>
        ) : reviews && reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="p-4 border rounded">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(r.tanggal).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-2">{r.komentar}</p>
                <div className="flex flex-wrap text-sm space-x-4">
                  <span>Kenyamanan: {r.kenyamanan}</span>
                  <span>Pembelajaran: {r.pembelajaran}</span>
                  <span>Fasilitas: {r.fasilitas}</span>
                  <span>Kepemimpinan: {r.kepemimpinan}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>

      {/* Add Review Form */}
      <section className="pt-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Add Review</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          <Input
            {...register('name')}
            placeholder="Your Name"
            required
          />
          <Input
            {...register('role')}
            placeholder="Your Role"
            required
          />
          <Input
            {...register('biaya')}
            placeholder="Biaya (e.g. Rp 10jt)"
            required
          />
          <Textarea
            {...register('komentar')}
            placeholder="Komentar"
            required
          />

          {(['kenyamanan', 'pembelajaran', 'fasilitas', 'kepemimpinan'] as const).map(
            (key) => (
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                <select
                  {...register(key)}
                  className="w-full p-2 border rounded"
                  defaultValue={5}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          <Button type="submit" disabled={addReview.isLoading}>
            {addReview.isLoading ? 'Posting…' : 'Post Review'}
          </Button>
          {addReview.isError && (
            <p className="text-sm text-red-600">
              Failed to post—please try again.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
