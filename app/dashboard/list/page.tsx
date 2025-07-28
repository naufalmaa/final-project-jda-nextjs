// app/dashboard/list/page.tsx
'use client';

import { useSchools } from '@/lib/queries';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ListPage() {
  const { data: schools, isLoading, error } = useSchools();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading schools.</p>;

  return (
    <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {schools!.map(s => (
        <Card key={s.id} asChild>
          <Link href={`/dashboard/detail/${s.id}`}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
              <CardDescription>
                {s.kelurahan}, {s.kecamatan}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* placeholder for thumbnail or avg rating */}
              <p className="text-sm text-gray-600">Avg. Rating: {/* compute or fetch */} N/A</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
